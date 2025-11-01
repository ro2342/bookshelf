// app.js - Aplicativo React Completo

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCyfUhhftcrV1piHd8f-4wYaB9iatLUcXU",
    authDomain: "deutsch-39779.firebaseapp.com",
    projectId: "deutsch-39779",
    storageBucket: "deutsch-39779.firebasestorage.app",
    messagingSenderId: "672743327567",
    appId: "1:672743327567:web:8875f89b1f282b7aba273a",
    measurementId: "G-XYVLCZD740"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();
const db = firebase.firestore();

// Main App Component
const App = () => {
    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [userData, setUserData] = React.useState(null);
    const [currentView, setCurrentView] = React.useState('home');
    const [currentTheme, setCurrentTheme] = React.useState('taylorSwift');
    const [showMenu, setShowMenu] = React.useState(false);
    const [currentLektion, setCurrentLektion] = React.useState(null);
    const [currentExerciseIndex, setCurrentExerciseIndex] = React.useState(0);
    const [userAnswer, setUserAnswer] = React.useState('');
    const [feedback, setFeedback] = React.useState(null);
    const [showGrammar, setShowGrammar] = React.useState(false);

    // Check authentication
    React.useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                setUser(user);
                await loadUserData(user.uid);
            } else {
                window.location.href = 'index.html';
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Initialize Lucide icons
    React.useEffect(() => {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }, [currentView, showMenu, showGrammar, feedback]); // Re-run when view or modals change

    // Load user data from Firestore
    const loadUserData = async (uid) => {
        try {
            const docRef = db.collection('users').doc(uid);
            const doc = await docRef.get();
            
            if (doc.exists) {
                const data = doc.data();
                setUserData(data);
                setCurrentTheme(data.theme || 'taylorSwift');
            } else {
                // Initialize new user data
                // ATUALIZADO: Adicionado lektionProgress
                const newUserData = {
                    score: 0,
                    completedLektions: [],
                    theme: 'taylorSwift',
                    lektionProgress: {}, // <-- NOVO: Garante que o progresso exista
                    exerciseStats: {},
                    lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
                };
                await docRef.set(newUserData);
                setUserData(newUserData);
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    };

    // Save user data to Firestore
    const saveUserData = async (data) => {
        if (!user) return;
        
        try {
            // Atualiza o estado local imediatamente para responsividade
            setUserData(prev => ({ ...prev, ...data }));
            // Envia para o Firestore
            await db.collection('users').doc(user.uid).update({
                ...data,
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
            });
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };

    // Logout
    const handleLogout = async () => {
        try {
            await auth.signOut();
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    // Change theme
    const changeTheme = async (themeName) => {
        setCurrentTheme(themeName);
        // ATUALIZADO: Salva o tema no Firebase (como já fazia)
        await saveUserData({ theme: themeName });
        setShowMenu(false);
    };

    // Start Lektion
    // ATUALIZADO: Esta função agora lê o progresso salvo
    const startLektion = (lektionId) => {
        const lektion = window.exercisesData.find(l => l.id === lektionId);
        if (lektion) {
            // Lê o progresso salvo do userData
            const lektionProgress = userData?.lektionProgress || {};
            // Encontra o índice salvo para esta lição, ou 0 se não houver
            let startIndex = lektionProgress[lektionId] || 0;

            // Se o índice salvo for igual ou maior que o total (lição completa),
            // reseta para 0 para permitir a revisão.
            if (startIndex >= lektion.exercises.length) {
                startIndex = 0;
            }

            setCurrentLektion(lektion);
            setCurrentExerciseIndex(startIndex); // <-- USA O ÍNDICE CORRETO
            setUserAnswer('');
            setFeedback(null);
            setCurrentView('exercise');
        }
    };

    // Check answer
    const checkAnswer = () => {
        if (!currentLektion) return;
        
        const exercise = currentLektion.exercises[currentExerciseIndex];
        const userAns = userAnswer.trim().toLowerCase();
        const correctAns = exercise.answer.toLowerCase();
        const alternatives = exercise.alternatives || [];
        
        // Handle multi-part answers (e.g., "fährt|ab")
        const correctAnswers = [correctAns, ...alternatives.map(a => a.toLowerCase())];
        const isCorrect = correctAnswers.some(ans => {
            if (ans.includes('|')) {
                const parts = ans.split('|');
                const userParts = userAns.split(/[\s,|]+/);
                return parts.every((part, idx) => userParts[idx] === part);
            }
            return userAns === ans;
        });

        setFeedback({
            isCorrect,
            explanation: exercise.explanation
        });

        if (isCorrect) {
            // Add points (só se for a primeira vez, mas a lógica de pontos pode ser refinada)
            // Por enquanto, vamos manter simples
            const newScore = (userData?.score || 0) + 10;
            // Salva a pontuação (não precisamos salvar o progresso aqui,
            // salvamos no 'nextExercise')
            saveUserData({ score: newScore });
        }
    };

    // Next exercise
    // ATUALIZADO: Esta função agora SALVA o progresso
    const nextExercise = () => {
        const lektionId = currentLektion.id;

        // Verifica se NÃO é o último exercício
        if (currentExerciseIndex < currentLektion.exercises.length - 1) {
            const nextIndex = currentExerciseIndex + 1;
            setCurrentExerciseIndex(nextIndex);
            setUserAnswer('');
            setFeedback(null);
            
            // SALVA O PROGRESSO NO FIREBASE
            const newProgress = { ...(userData.lektionProgress || {}), [lektionId]: nextIndex };
            saveUserData({ lektionProgress: newProgress }); // Salva em segundo plano
            
        } else {
            // Se for o último, chama finishLektion
            finishLektion();
        }
    };

    // Finish Lektion
    // ATUALIZADO: Esta função agora salva o status de "completo"
    const finishLektion = async () => {
        if (!currentLektion || !userData) return;
        
        const lektionId = currentLektion.id;
        const completedLektions = userData.completedLektions || [];
        const isNewCompletion = !completedLektions.includes(lektionId);

        if (isNewCompletion) {
            completedLektions.push(lektionId);
        }
        
        // Salva o índice final (igual ao total de exercícios) para marcar como "completo"
        const newProgress = { ...(userData.lektionProgress || {}), [lektionId]: currentLektion.exercises.length };
        
        // Salva o status de completo E o progresso final
        await saveUserData({ 
            completedLektions: completedLektions, 
            lektionProgress: newProgress 
        });
        
        setCurrentLektion(null);
        setCurrentView('map');
    };

    // Get theme colors
    const theme = window.themes[currentTheme] || window.themes.taylorSwift;

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                backgroundColor: theme.bg
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div className="loading" style={{ fontSize: '3rem' }}>⏳</div>
                    <p style={{ marginTop: 20, color: theme.text }}>Carregando...</p>
                </div>
            </div>
        );
    }

    return (
        <div 
            className="app-container" 
            style={{ 
                backgroundColor: theme.bg,
                color: theme.text,
                '--primary': theme.primary,
                '--accent': theme.accent,
                '--text': theme.text,
                '--card': theme.card,
                '--border': theme.border
            }}
        >
            {/* Header */}
            <header className="header" style={{ backgroundColor: theme.card }}>
                <div className="header-left">
                    <div className="score-display" style={{ color: theme.primary }}>
                        <span>🏆</span>
                        <span>{userData?.score || 0}</span>
                    </div>
                </div>
                <button 
                    className="menu-btn" 
                    onClick={() => setShowMenu(true)}
                    style={{ color: theme.text }}
                >
                    <i data-lucide="menu" width="28" height="28"></i>
                </button>
            </header>

            {/* Main Content */}
            <main className="main-content">
                {currentView === 'home' && <HomeView />}
                {currentView === 'map' && <MapView />}
                {currentView === 'progress' && <ProgressView />}
                {currentView === 'exercise' && <ExerciseView />}
            </main>

            {/* Navigation Footer */}
            <nav className="nav-footer" style={{ backgroundColor: theme.card }}>
                <button 
                    className={`nav-btn ${currentView === 'home' ? 'active' : ''}`}
                    onClick={() => setCurrentView('home')}
                    style={{ color: currentView === 'home' ? 'white' : theme.text }}
                >
                    <i data-lucide="home" width="24" height="24"></i>
                    <span>Início</span>
                </button>
                <button 
                    className={`nav-btn ${currentView === 'map' ? 'active' : ''}`}
                    onClick={() => setCurrentView('map')}
                    style={{ color: currentView === 'map' ? 'white' : theme.text }}
                >
                    <i data-lucide="map" width="24" height="24"></i>
                    <span>Mapa</span>
                </button>
                <button 
                    className={`nav-btn ${currentView === 'progress' ? 'active' : ''}`}
                    onClick={() => setCurrentView('progress')}
                    style={{ color: currentView === 'progress' ? 'white' : theme.text }}
                >
                    <i data-lucide="trending-up" width="24" height="24"></i>
                    <span>Progresso</span>
                </button>
            </nav>

            {/* Menu Modal */}
            {showMenu && <MenuModal />}

            {/* Grammar Modal */}
            {showGrammar && <GrammarModal />}
        </div>
    );

    // HOME VIEW
    function HomeView() {
        const totalLektions = window.exercisesData.length;
        const completedCount = userData?.completedLektions?.length || 0;
        const progress = (completedCount / totalLektions) * 100;

        // ATUALIZADO: Encontra a próxima lição para começar/continuar
        const nextLektion = React.useCallback(() => {
            const completed = userData?.completedLektions || [];
            const progress = userData?.lektionProgress || {};

            // 1. Tenta encontrar uma lição em progresso (nem 0, nem completa)
            for (const lektion of window.exercisesData) {
                const lektionId = lektion.id;
                const savedIndex = progress[lektionId] || 0;
                if (savedIndex > 0 && savedIndex < lektion.exercises.length) {
                    return lektion; // Encontrou uma lição em progresso
                }
            }

            // 2. Se não houver, encontra a primeira lição não completada
            for (const lektion of window.exercisesData) {
                if (!completed.includes(lektion.id)) {
                    return lektion; // Encontrou a próxima lição
                }
            }
            
            // 3. Se todas estiverem completas, retorna a primeira para revisar
            return window.exercisesData[0];
        }, [userData]);

        const lektionToStart = nextLektion();

        return (
            <div>
                <div className="card" style={{ backgroundColor: theme.card }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: 15, color: theme.primary }}>
                        Olá, {user?.displayName?.split(' ')[0] || 'Estudante'}! 👋
                    </h1>
                    <p style={{ fontSize: '1.1rem', opacity: 0.8 }}>
                        Bem-vindo ao seu curso de alemão A1.1
                    </p>
                </div>

                <div className="card" style={{ backgroundColor: theme.card }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: 15 }}>Seu Progresso</h2>
                    <div style={{ marginBottom: 10 }}>
                        <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                            {completedCount} de {totalLektions} lições completadas
                        </span>
                    </div>
                    <div className="progress-bar" style={{ backgroundColor: theme.border }}>
                        <div 
                            className="progress-fill" 
                            style={{ 
                                width: `${progress}%`,
                                background: `linear-gradient(90deg, ${theme.primary}, ${theme.accent})`
                            }}
                        ></div>
                    </div>
                    <p style={{ textAlign: 'center', marginTop: 10, fontSize: '2rem', fontWeight: 700 }}>
                        {Math.round(progress)}%
                    </p>
                </div>

                <button 
                    className="btn-primary" 
                    onClick={() => startLektion(lektionToStart.id)}
                    style={{ 
                        width: '100%',
                        padding: 20,
                        fontSize: '1.2rem',
                        background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`
                    }}
                >
                    {/* ATUALIZADO: Texto do botão é dinâmico */}
                    {
                        (userData?.lektionProgress && userData.lektionProgress[lektionToStart.id] > 0) ? 
                        `Continuar: ${lektionToStart.title} →` :
                        `Começar: ${lektionToStart.title} →`
                    }
                </button>
            </div>
        );
    }

    // MAP VIEW
    function MapView() {
        const completedLektions = userData?.completedLektions || [];
        
        return (
            <div>
                <h1 style={{ fontSize: '2rem', marginBottom: 20, color: theme.primary }}>
                    Mapa de Aprendizado 🗺️
                </h1>
                
                {window.exercisesData.map((lektion, index) => {
                    const isCompleted = completedLektions.includes(lektion.id);
                    // Lógica de bloqueio: o primeiro (index 0) nunca está bloqueado
                    // Os outros estão bloqueados se a *lição anterior* não estiver completa
                    const isLocked = index > 0 && !completedLektions.includes(window.exercisesData[index - 1].id);
                    
                    // ATUALIZADO: Verifica se a lição está em progresso
                    const lektionProgress = userData?.lektionProgress || {};
                    const savedIndex = lektionProgress[lektion.id] || 0;
                    const isInProgress = savedIndex > 0 && savedIndex < lektion.exercises.length;

                    return (
                        <div 
                            key={lektion.id}
                            className={`card lektion-card ${isCompleted ? 'completed' : ''} ${isLocked ? 'locked' : ''}`}
                            style={{ 
                                backgroundColor: theme.card,
                                cursor: isLocked ? 'not-allowed' : 'pointer',
                                opacity: isLocked ? 0.6 : 1
                            }}
                            onClick={() => !isLocked && startLektion(lektion.id)}
                        >
                            <h3 style={{ fontSize: '1.3rem', marginBottom: 10, color: theme.primary }}>
                                {isLocked && '🔒 '}{lektion.title}
                            </h3>
                            <p style={{ marginBottom: 15, opacity: 0.8 }}>
                                <strong>Tópicos:</strong> {lektion.topics.join(', ')}
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                                <span style={{ opacity: 0.7 }}>
                                    📝 {lektion.exercises.length} exercícios
                                </span>
                                {!isLocked && (
                                    <button 
                                        className="btn-secondary"
                                        style={{ 
                                            marginLeft: 'auto',
                                            borderColor: theme.primary,
                                            color: theme.text
                                        }}
                                    >
                                        {/* ATUALIZADO: Texto do botão dinâmico */}
                                        {isCompleted ? 'Revisar' : (isInProgress ? 'Continuar' : 'Iniciar')}
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }

    // PROGRESS VIEW
    function ProgressView() {
        const totalLektions = window.exercisesData.length;
        const completedCount = userData?.completedLektions?.length || 0;
        const totalExercises = window.exercisesData.reduce((sum, l) => sum + l.exercises.length, 0);
        const progress = (completedCount / totalLektions) * 100;

        // ATUALIZADO: Calcula exercícios feitos
        const lektionProgress = userData?.lektionProgress || {};
        const exercisesDone = Object.values(lektionProgress).reduce((sum, count) => sum + count, 0);

        return (
            <div>
                <h1 style={{ fontSize: '2rem', marginBottom: 20, color: theme.primary }}>
                    Seu Progresso 📊
                </h1>

                <div className="stats-grid">
                    <div className="card stat-card" style={{ backgroundColor: theme.card }}>
                        <div className="stat-number" style={{ color: theme.primary }}>
                            {userData?.score || 0}
                        </div>
                        <div className="stat-label">Pontos Totais</div>
                    </div>

                    <div className="card stat-card" style={{ backgroundColor: theme.card }}>
                        <div className="stat-number" style={{ color: theme.accent }}>
                            {completedCount}/{totalLektions}
                        </div>
                        <div className="stat-label">Lições Completas</div>
                    </div>

                    <div className="card stat-card" style={{ backgroundColor: theme.card }}>
                        <div className="stat-number" style={{ color: theme.primary }}>
                            {Math.round(progress)}%
                        </div>
                        <div className="stat-label">Progresso Geral</div>
                    </div>

                    <div className="card stat-card" style={{ backgroundColor: theme.card }}>
                        <div className="stat-number" style={{ color: theme.accent }}>
                            {/* ATUALIZADO: Mostra exercícios feitos vs total */}
                            {exercisesDone}/{totalExercises}
                        </div>
                        <div className="stat-label">Exercícios Feitos</div>
                    </div>
                </div>

                <div className="card" style={{ backgroundColor: theme.card }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: 15 }}>Lições Completadas</h2>
                    {userData?.completedLektions?.length > 0 ? (
                        userData.completedLektions.map(lektionId => {
                            const lektion = window.exercisesData.find(l => l.id === lektionId);
                            return lektion ? (
                                <div 
                                    key={lektionId}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '15px 0',
                                        borderBottom: `1px solid ${theme.border}`
                                    }}
                                >
                                    <div>
                                        <strong>{lektion.title}</strong>
                                        <div style={{ fontSize: '0.9rem', opacity: 0.7, marginTop: 5 }}>
                                            {lektion.exercises.length} exercícios
                                        </div>
                                    </div>
                                    <button 
                                        className="btn-secondary"
                                        onClick={() => startLektion(lektionId)}
                                        style={{ borderColor: theme.primary }}
                                    >
                                        Revisar
                                    </button>
                                </div>
                            ) : null;
                        })
                    ) : (
                        <p style={{ opacity: 0.7 }}>Nenhuma lição completada ainda. Vamos começar!</p>
                    )}
                </div>
            </div>
        );
    }

    // EXERCISE VIEW
    function ExerciseView() {
        const inputRef = React.useRef(null);
        
        if (!currentLektion) return null;

        const exercise = currentLektion.exercises[currentExerciseIndex];
        // ATUALIZADO: O progresso agora é baseado no índice atual, não no +1
        const progress = (currentExerciseIndex / currentLektion.exercises.length) * 100;

        // Auto-focus input when exercise changes
        React.useEffect(() => {
            if (inputRef.current && !feedback) {
                inputRef.current.focus();
            }
        }, [currentExerciseIndex]);

        return (
            <div>
                <button 
                    className="btn-secondary"
                    onClick={() => {
                        setCurrentView('map');
                        setCurrentLektion(null);
                    }}
                    style={{ marginBottom: 20, borderColor: theme.primary }}
                >
                    ← Voltar ao Mapa
                </button>

                <div className="card" style={{ backgroundColor: theme.card }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: 10, color: theme.primary }}>
                        {currentLektion.title}
                    </h2>
                    <p style={{ opacity: 0.8, marginBottom: 15 }}>
                        Exercício {currentExerciseIndex + 1} de {currentLektion.exercises.length}
                    </p>
                    <div className="progress-bar" style={{ backgroundColor: theme.border }}>
                        <div 
                            className="progress-fill"
                            style={{ 
                                width: `${progress}%`, // A barra começa vazia no ex 1
                                background: `linear-gradient(90deg, ${theme.primary}, ${theme.accent})`
                            }}
                        ></div>
                    </div>
                </div>

                <div className="card" style={{ backgroundColor: theme.card }}>
                    <h3 style={{ fontSize: '1.3rem', marginBottom: 20 }}>
                        {exercise.question}
                    </h3>

                    {exercise.type === 'fillBlank' && (
                        <input 
                            ref={inputRef}
                            type="text"
                            className="input-field"
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && !feedback && checkAnswer()}
                            placeholder="Digite sua resposta..."
                            disabled={!!feedback}
                            autoComplete="off"
                            autoFocus
                            style={{
                                backgroundColor: theme.bg,
                                color: theme.text,
                                borderColor: theme.primary
                            }}
                        />
                    )}

                    {exercise.type === 'multipleChoice' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {exercise.options.map((option, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setUserAnswer(option)}
                                    disabled={!!feedback}
                                    style={{
                                        padding: 15,
                                        border: `3px solid ${userAnswer === option ? theme.primary : theme.border}`,
                                        borderRadius: 10,
                                        background: userAnswer === option ? theme.primary : theme.card,
                                        color: userAnswer === option ? 'white' : theme.text,
                                        cursor: feedback ? 'not-allowed' : 'pointer',
                                        fontSize: '1.1rem',
                                        fontWeight: 600,
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    )}

                    {exercise.type === 'translation' && (
                        <input 
                            ref={inputRef}
                            type="text"
                            className="input-field"
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && !feedback && checkAnswer()}
                            placeholder="Traduza para alemão..."
                            disabled={!!feedback}
                            autoComplete="off"
                            autoFocus
                            style={{
                                backgroundColor: theme.bg,
                                color: theme.text,
                                borderColor: theme.primary
                            }}
                        />
                    )}

                    {feedback && (
                        <div className={`feedback ${feedback.isCorrect ? 'correct' : 'incorrect'}`}>
                            {feedback.isCorrect ? <i data-lucide="check" width="24" height="24"></i> : <i data-lucide="x" width="24" height="24"></i>}
                            <div>
                                <div style={{ fontWeight: 700, marginBottom: 5 }}>
                                    {feedback.isCorrect ? 'Correto!' : 'Incorreto'}
                                </div>
                                <div>{feedback.explanation}</div>
                            </div>
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                        {!feedback ? (
                            <>
                                <button 
                                    className="btn-primary"
                                    onClick={checkAnswer}
                                    disabled={!userAnswer}
                                    style={{ 
                                        flex: 1,
                                        background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
                                        opacity: !userAnswer ? 0.5 : 1
                                    }}
                                >
                                    Verificar Resposta
                                </button>
                                <button 
                                    className="btn-secondary"
                                    onClick={() => setShowGrammar(true)}
                                    style={{ borderColor: theme.primary }}
                                >
                                    <i data-lucide="book-open" width="18" height="18" style={{ verticalAlign: 'middle', marginRight: 5 }}></i>
                                    Gramática
                                </button>
                            </>
                        ) : (
                            <button 
                                className="btn-primary"
                                onClick={nextExercise} // Esta função agora lida com os dois casos
                                style={{ 
                                    flex: 1,
                                    background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`
                                }}
                            >
                                {/* ATUALIZADO: O botão "Finalizar Lição" chama a mesma função */}
                                {currentExerciseIndex < currentLektion.exercises.length - 1 ? 'Próximo →' : 'Finalizar Lição 🎉'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // MENU MODAL
    function MenuModal() {
        return (
            <div className="modal-overlay" onClick={() => setShowMenu(false)}>
                <div 
                    className="modal-content" 
                    style={{ backgroundColor: theme.card }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <h2 style={{ fontSize: '1.8rem', marginBottom: 20, color: theme.primary }}>
                        Configurações
                    </h2>

                    <h3 style={{ fontSize: '1.3rem', marginBottom: 15 }}>Escolha seu tema:</h3>
                    <div className="theme-grid">
                        {Object.keys(window.themes).map(themeName => {
                            const t = window.themes[themeName];
                            return (
                                <div
                                    key={themeName}
                                    className={`theme-option ${currentTheme === themeName ? 'selected' : ''}`}
                                    onClick={() => changeTheme(themeName)}
                                    style={{
                                        backgroundColor: t.primary,
                                        color: t.text,
                                        borderColor: currentTheme === themeName ? t.text : 'transparent'
                                    }}
                                >
                                    {t.name}
                                </div>
                            );
                        })}
                    </div>

                    <div style={{ marginTop: 30 }}>
                        <button 
                            className="btn-primary"
                            onClick={handleLogout}
                            style={{ 
                                width: '100%',
                                background: '#dc3545'
                            }}
                        >
                            Sair
                        </button>
                    </div>

                    <button 
                        className="btn-secondary"
                        onClick={() => setShowMenu(false)}
                        style={{ 
                            width: '100%',
                            marginTop: 15,
                            borderColor: theme.primary
                        }}
                    >
                        Fechar
                    </button>
                </div>
            </div>
        );
    }

    // GRAMMAR MODAL
    function GrammarModal() {
        if (!currentLektion) return null;

        return (
            <div className="modal-overlay" onClick={() => setShowGrammar(false)}>
                <div 
                    className="modal-content" 
                    style={{ backgroundColor: theme.card }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <h2 style={{ fontSize: '1.8rem', color: theme.primary }}>
                            Gramática 📚
                        </h2>
                        <button 
                            className="menu-btn"
                            onClick={() => setShowGrammar(false)}
                            style={{ color: theme.text }}
                        >
                            <i data-lucide="x" width="28" height="28"></i>
                        </button>
                    </div>

                    {currentLektion.grammarKeys.map(key => {
                        const explanation = window.grammarExplanations[key];
                        return explanation ? (
                            <div key={key} style={{ marginBottom: 25 }}>
                                <h3 style={{ fontSize: '1.3rem', marginBottom: 10, color: theme.accent }}>
                                    {explanation.title}
                                </h3>
                                {/* ATUALIZADO: Renderiza o HTML das explicações */}
                                <div 
                                    style={{ 
                                        lineHeight: 1.6,
                                        opacity: 0.9
                                    }}
                                    dangerouslySetInnerHTML={{ __html: explanation.content.replace(/\n/g, '<br />') }}
                                >
                                </div>
                            </div>
                        ) : null;
                    })}

                    <button 
                        className="btn-primary"
                        onClick={() => setShowGrammar(false)}
                        style={{ 
                            width: '100%',
                            marginTop: 20,
                            background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`
                        }}
                    >
                        Entendi, fechar
                    </button>
                </div>
            </div>
        );
    }
};

// Render the app
ReactDOM.render(<App />, document.getElementById('root'));
