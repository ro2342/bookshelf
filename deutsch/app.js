// app.js - Aplicativo React Completo
// VERSÃO CORRIGIDA: Remove localStorage (usa 100% Firebase) e corrige carregamento lento de ícones.

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
    
    // *** CORREÇÃO TEMA (Firebase) ***
    // Inicializa com um padrão. O Firebase irá sobrescrevê-lo.
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

    // *** CORREÇÃO ÍCONES LENTOS ***
    // O array de dependência [currentView] estava errado.
    // Um array vazio [] garante que isso rode APENAS UMA VEZ.
    React.useEffect(() => {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }, []); // <-- Array de dependência corrigido para []

    // Load user data from Firestore
    const loadUserData = async (uid) => {
        try {
            const docRef = db.collection('users').doc(uid);
            const doc = await docRef.get();
            
            if (doc.exists) {
                const data = doc.data();
                
                if (!data.completedLektions) {
                    data.completedLektions = [];
                }
                if (!data.currentLektionProgress) {
                    data.currentLektionProgress = {};
                }
                
                // *** CORREÇÃO TEMA (Firebase) ***
                // Lê o tema do Firebase e atualiza o estado.
                const userTheme = data.theme || 'taylorSwift';
                setUserData(data);
                setCurrentTheme(userTheme);
            } else {
                // Initialize new user data
                const newUserData = {
                    score: 0,
                    completedLektions: [],
                    currentLektionProgress: {}, 
                    theme: 'taylorSwift',
                    lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
                };
                await docRef.set(newUserData);
                setUserData(newUserData);
                // O tema padrão 'taylorSwift' já está definido no estado.
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    };

    // Save user data to Firestore
    const saveUserData = async (data) => {
        if (!user) return;
        
        try {
            await db.collection('users').doc(user.uid).update({
                ...data,
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
            });
            // Atualiza o estado local com os new data
            setUserData(prev => ({ ...prev, ...data }));
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
        // *** CORREÇÃO TEMA (Firebase) ***
        // Remove a escrita no localStorage.
        // Salva o tema diretamente no Firebase.
        await saveUserData({ theme: themeName });
        setShowMenu(false);
    };

    // Start Lektion
    const startLektion = (lektionId) => {
        // Correção de bug anterior: Garante que userData existe.
        if (!userData) {
            console.warn("User data not loaded yet, please wait.");
            return;
        }

        const lektion = window.exercisesData.find(l => l.id === lektionId);
        if (lektion) {
            const isReview = userData.completedLektions.includes(lektionId);
            
            let startIndex = 0;
            if (!isReview) {
                const savedIndex = userData.currentLektionProgress?.[lektionId];
                if (savedIndex && savedIndex < lektion.exercises.length) {
                    startIndex = savedIndex;
                }
            }
            
            setCurrentLektion(lektion);
            setCurrentExerciseIndex(startIndex); 
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
            const newScore = (userData?.score || 0) + 10;
            saveUserData({ score: newScore });
        }
    };

    // Next exercise
    const nextExercise = async () => {
        const nextIndex = currentExerciseIndex + 1;
        
        if (nextIndex < currentLektion.exercises.length) {
            setCurrentExerciseIndex(nextIndex);
            setUserAnswer('');
            setFeedback(null);
            
            const newProgress = { ...(userData.currentLektionProgress || {}), [currentLektion.id]: nextIndex };
            await saveUserData({ currentLektionProgress: newProgress });

        } else {
            await finishLektion();
        }
    };

    // Finish Lektion
    const finishLektion = async () => {
        if (!currentLektion || !userData) return;
        
        const completedLektions = [...(userData.completedLektions || [])];
        if (!completedLektions.includes(currentLektion.id)) {
            completedLektions.push(currentLektion.id);
        }
        
        const newProgress = { ...(userData.currentLektionProgress || {}) };
        delete newProgress[currentLektion.id];
        
        await saveUserData({ 
            completedLektions: completedLektions,
            currentLektionProgress: newProgress 
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
                // A tela de loading usará o tema padrão, e mudará
                // quando o Firebase carregar.
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
        const completedLektions = userData?.completedLektions || [];
        const currentProgress = userData?.currentLektionProgress || {};
        
        return (
            <div>
                <h1 style={{ fontSize: '2rem', marginBottom: 20, color: theme.primary }}>
                    Mapa de Aprendizado 🗺️
                </h1>
                
                {window.exercisesData.map((lektion, index) => {
                    const isCompleted = completedLektions.includes(lektion.id);
                    const inProgressIndex = currentProgress[lektion.id];
                    const isLocked = index > 0 && !completedLektions.includes(window.exercisesData[index - 1].id);
                    
                    let buttonText = 'Iniciar';
                    if (isCompleted) {
                        buttonText = 'Revisar';
                    } else if (inProgressIndex > 0) {
                        buttonText = 'Continuar'; 
                    }

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
                                {inProgressIndex > 0 && !isCompleted && (
                                    <span style={{ opacity: 0.7, fontWeight: 600, color: theme.accent }}>
                                        {inProgressIndex} / {lektion.exercises.length}
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
                                        {buttonText} 
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
                            {totalExercises}
                        </div>
                        <div className="stat-label">Total de Exercícios</div>
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
