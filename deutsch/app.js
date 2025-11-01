// app.js - Aplicativo React com Firebase v9+ (Modular)

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

// --- CONFIGURAÇÃO FIREBASE ---
const firebaseConfig = {
    apiKey: "AIzaSyCyfUhhftcrV1piHd8f-4wYaB9iatLUcXU",
    authDomain: "deutsch-39779.firebaseapp.com",
    projectId: "deutsch-39779",
    storageBucket: "deutsch-39779.firebasestorage.app",
    messagingSenderId: "672743327567",
    appId: "1:672743327567:web:8875f89b1f282b7aba273a",
    measurementId: "G-XYVLCZD740"
};

let app, db, auth;
let userId = null;
let userDataUnsubscribe = null;
let userData = {
    score: 0,
    completedLektions: [],
    theme: 'taylorSwift',
    exerciseProgress: {}, // { lektionId: { completed: [], currentIndex: 0 } }
    lastUpdated: null
};

// --- COMPONENTE PRINCIPAL ---
const App = () => {
    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [currentView, setCurrentView] = React.useState('home');
    const [currentTheme, setCurrentTheme] = React.useState('taylorSwift');
    const [currentLektion, setCurrentLektion] = React.useState(null);
    const [currentExerciseIndex, setCurrentExerciseIndex] = React.useState(0);
    const [userAnswer, setUserAnswer] = React.useState('');
    const [feedback, setFeedback] = React.useState(null);
    const [showGrammar, setShowGrammar] = React.useState(false);
    const [showMenu, setShowMenu] = React.useState(false);
    const [userScore, setUserScore] = React.useState(0);
    const [completedLektions, setCompletedLektions] = React.useState([]);

    // Inicializar Firebase e Auth
    React.useEffect(() => {
        try {
            app = initializeApp(firebaseConfig);
            db = getFirestore(app);
            auth = getAuth(app);

            onAuthStateChanged(auth, async (firebaseUser) => {
                if (firebaseUser) {
                    userId = firebaseUser.uid;
                    setUser(firebaseUser);
                    await initializeUserData();
                } else {
                    window.location.href = 'index.html';
                }
            });
        } catch (error) {
            console.error("Erro ao inicializar Firebase:", error);
            alert("Erro crítico ao inicializar o aplicativo.");
        }
    }, []);

    // Inicializar dados do usuário e listener em tempo real
    const initializeUserData = async () => {
        if (!userId) return;

        const userDocRef = doc(db, "users", userId);

        // Listener em tempo real
        if (userDataUnsubscribe) userDataUnsubscribe();
        
        userDataUnsubscribe = onSnapshot(userDocRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                userData = {
                    score: data.score || 0,
                    completedLektions: data.completedLektions || [],
                    theme: data.theme || 'taylorSwift',
                    exerciseProgress: data.exerciseProgress || {},
                    lastUpdated: data.lastUpdated
                };
                
                setUserScore(userData.score);
                setCompletedLektions(userData.completedLektions);
                setCurrentTheme(userData.theme);
                applyTheme(userData.theme);
            } else {
                // Criar documento inicial
                const initialData = {
                    score: 0,
                    completedLektions: [],
                    theme: 'taylorSwift',
                    exerciseProgress: {},
                    lastUpdated: new Date()
                };
                setDoc(userDocRef, initialData);
                userData = initialData;
            }
            setLoading(false);
        }, (error) => {
            console.error("Erro ao ouvir dados do usuário:", error);
            setLoading(false);
        });
    };

    // Salvar dados no Firestore
    const saveUserData = async (updates) => {
        if (!userId) return;

        try {
            const userDocRef = doc(db, "users", userId);
            await setDoc(userDocRef, {
                ...updates,
                lastUpdated: new Date()
            }, { merge: true });
        } catch (error) {
            console.error("Erro ao salvar dados:", error);
        }
    };

    // Aplicar tema
    const applyTheme = (themeName) => {
        const theme = window.themes[themeName];
        if (!theme) return;

        for (const [key, value] of Object.entries(theme.values)) {
            const prop = `--md-sys-color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
            document.documentElement.style.setProperty(prop, value);
        }
    };

    // Trocar tema
    const changeTheme = async (themeName) => {
        setCurrentTheme(themeName);
        applyTheme(themeName);
        await saveUserData({ theme: themeName });
    };

    // Iniciar lição
    const startLektion = (lektionId) => {
        const lektion = window.exercisesData.find(l => l.id === lektionId);
        if (!lektion) return;

        const progress = userData.exerciseProgress[lektionId] || { completed: [], currentIndex: 0 };
        
        setCurrentLektion(lektion);
        setCurrentExerciseIndex(progress.currentIndex);
        setUserAnswer('');
        setFeedback(null);
        setCurrentView('exercise');
    };

    // Verificar resposta
    const checkAnswer = async () => {
        if (!currentLektion) return;

        const exercise = currentLektion.exercises[currentExerciseIndex];
        const userAns = userAnswer.trim().toLowerCase();
        const correctAns = exercise.answer.toLowerCase();
        const alternatives = exercise.alternatives || [];

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
            const lektionId = currentLektion.id;
            const progress = userData.exerciseProgress[lektionId] || { completed: [], currentIndex: 0 };
            
            // Adicionar exercício completado se ainda não foi
            if (!progress.completed.includes(currentExerciseIndex)) {
                progress.completed.push(currentExerciseIndex);
                
                // Adicionar 10 pontos apenas uma vez por exercício
                const newScore = userData.score + 10;
                
                // Salvar progresso imediatamente
                await saveUserData({
                    score: newScore,
                    [`exerciseProgress.${lektionId}`]: progress
                });
            }
        }
    };

    // Próximo exercício
    const nextExercise = async () => {
        if (!currentLektion) return;

        if (currentExerciseIndex < currentLektion.exercises.length - 1) {
            const nextIndex = currentExerciseIndex + 1;
            setCurrentExerciseIndex(nextIndex);
            setUserAnswer('');
            setFeedback(null);

            // Atualizar índice atual no Firebase
            const lektionId = currentLektion.id;
            const progress = userData.exerciseProgress[lektionId] || { completed: [], currentIndex: 0 };
            progress.currentIndex = nextIndex;

            await saveUserData({
                [`exerciseProgress.${lektionId}`]: progress
            });
        } else {
            await finishLektion();
        }
    };

    // Finalizar lição
    const finishLektion = async () => {
        if (!currentLektion) return;

        const lektionId = currentLektion.id;
        const newCompletedLektions = [...userData.completedLektions];
        
        if (!newCompletedLektions.includes(lektionId)) {
            newCompletedLektions.push(lektionId);
        }

        // Resetar progresso da lição
        const progress = { completed: [], currentIndex: 0 };

        await saveUserData({
            completedLektions: newCompletedLektions,
            [`exerciseProgress.${lektionId}`]: progress
        });

        setCurrentLektion(null);
        setCurrentView('map');
    };

    // Logout
    const handleLogout = async () => {
        try {
            if (userDataUnsubscribe) userDataUnsubscribe();
            await signOut(auth);
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    };

    // Inicializar ícones Lucide quando a view mudar
    React.useEffect(() => {
        if (window.lucide && !loading) {
            setTimeout(() => window.lucide.createIcons(), 100);
        }
    }, [currentView, loading]);

    const theme = window.themes[currentTheme] || window.themes.taylorSwift;

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                backgroundColor: theme.bg,
                color: theme.text
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', animation: 'spin 1s linear infinite' }}>⏳</div>
                    <p style={{ marginTop: 20 }}>Carregando...</p>
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
                        <span>{userScore}</span>
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
        const completedCount = completedLektions.length;
        const progress = (completedCount / totalLektions) * 100;

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
                    onClick={() => setCurrentView('map')}
                    style={{ 
                        width: '100%',
                        padding: 20,
                        fontSize: '1.2rem',
                        background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`
                    }}
                >
                    Ir para Mapa de Aprendizado →
                </button>
            </div>
        );
    }

    // MAP VIEW
    function MapView() {
        return (
            <div>
                <h1 style={{ fontSize: '2rem', marginBottom: 20, color: theme.primary }}>
                    Mapa de Aprendizado 🗺️
                </h1>
                
                {window.exercisesData.map((lektion, index) => {
                    const isCompleted = completedLektions.includes(lektion.id);
                    const isLocked = index > 0 && !completedLektions.includes(window.exercisesData[index - 1].id);
                    const progress = userData.exerciseProgress[lektion.id];
                    const hasProgress = progress && progress.completed.length > 0;
                    
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
                            <div style={{ display: 'flex', alignItems: 'center', gap: 15, flexWrap: 'wrap' }}>
                                <span style={{ opacity: 0.7 }}>
                                    📝 {lektion.exercises.length} exercícios
                                </span>
                                {hasProgress && !isCompleted && (
                                    <span style={{ 
                                        backgroundColor: theme.accent, 
                                        color: 'white', 
                                        padding: '4px 12px', 
                                        borderRadius: 12,
                                        fontSize: '0.85rem',
                                        fontWeight: 600
                                    }}>
                                        {progress.completed.length}/{lektion.exercises.length} completos
                                    </span>
                                )}
                                {!isLocked && (
                                    <button 
                                        className="btn-secondary"
                                        style={{ 
                                            marginLeft: 'auto',
                                            borderColor: theme.primary,
                                            color: theme.text
                                        }}
                                    >
                                        {isCompleted ? 'Revisar' : hasProgress ? 'Continuar' : 'Iniciar'}
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
        const completedCount = completedLektions.length;
        const totalExercises = window.exercisesData.reduce((sum, l) => sum + l.exercises.length, 0);
        const progress = (completedCount / totalLektions) * 100;

        return (
            <div>
                <h1 style={{ fontSize: '2rem', marginBottom: 20, color: theme.primary }}>
                    Seu Progresso 📊
                </h1>

                <div className="stats-grid">
                    <div className="card stat-card" style={{ backgroundColor: theme.card }}>
                        <div className="stat-number" style={{ color: theme.primary }}>
                            {userScore}
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
                            {totalExercises}
                        </div>
                        <div className="stat-label">Total de Exercícios</div>
                    </div>
                </div>

                <div className="card" style={{ backgroundColor: theme.card }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: 15 }}>Lições Completadas</h2>
                    {completedLektions.length > 0 ? (
                        completedLektions.map(lektionId => {
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
        const progress = ((currentExerciseIndex + 1) / currentLektion.exercises.length) * 100;
        const isLastExercise = currentExerciseIndex === currentLektion.exercises.length - 1;

        React.useEffect(() => {
            if (inputRef.current && !feedback) {
                inputRef.current.focus();
            }
        }, [currentExerciseIndex, feedback]);

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
                                width: `${progress}%`,
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
                            {feedback.isCorrect ? '✓' : '✗'}
                            <div>
                                <div style={{ fontWeight: 700, marginBottom: 5 }}>
                                    {feedback.isCorrect ? 'Correto! +10 pontos' : 'Incorreto'}
                                </div>
                                <div>{feedback.explanation}</div>
                            </div>
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap' }}>
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
                                    📚 Gramática
                                </button>
                            </>
                        ) : (
                            <>
                                <button 
                                    className="btn-primary"
                                    onClick={nextExercise}
                                    style={{ 
                                        flex: 1,
                                        background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`
                                    }}
                                >
                                    {isLastExercise ? 'Finalizar Lição 🎉' : 'Próximo →'}
                                </button>
                                {isLastExercise && (
                                    <button 
                                        className="btn-secondary"
                                        onClick={async () => {
                                            await finishLektion();
                                            const nextLektion = window.exercisesData.find(l => l.id === currentLektion.id + 1);
                                            if (nextLektion) startLektion(nextLektion.id);
                                        }}
                                        style={{ borderColor: theme.accent }}
                                    >
                                        Próxima Lição →
                                    </button>
                                )}
                            </>
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
                                    onClick={() => {
                                        changeTheme(themeName);
                                        setTimeout(() => setShowMenu(false), 300);
                                    }}
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
                    <h2 style={{ fontSize: '1.8rem', marginBottom: 20, color: theme.primary }}>
                        Explicações Gramaticais 📚
                    </h2>

                    {currentLektion.grammarKeys.map(key => {
                        const explanation = window.grammarExplanations[key];
                        return explanation ? (
                            <div key={key} style={{ marginBottom: 25 }}>
                                <h3 style={{ fontSize: '1.3rem', marginBottom: 10, color: theme.accent }}>
                                    {explanation.title}
                                </h3>
                                <div style={{ 
                                    whiteSpace: 'pre-line', 
                                    lineHeight: 1.6,
                                    opacity: 0.9
                                }}>
                                    {explanation.content}
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
                        Fechar
                    </button>
                </div>
            </div>
        );
    }
};

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
