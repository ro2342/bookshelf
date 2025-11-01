// app.js - Lógica principal do App Deutsch A1.1 (Vanilla JS)
// Estrutura inspirada no app.js do BookTracker
// CORRIGIDO: Removido 'window.load' e adicionado 'safeCreateIcons'

// Importações do Firebase (SDK 9 modular)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, doc, onSnapshot, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

// --- CONFIGURAÇÃO E INICIALIZAÇÃO ---

// SUA Configuração do Firebase (para deutsch-39779)
const firebaseConfig = {
    apiKey: "AIzaSyCyfUhhftcrV1piHd8f-4wYaB9iatLUcXU",
    authDomain: "deutsch-39779.firebaseapp.com",
    projectId: "deutsch-39779",
    storageBucket: "deutsch-39779.firebasestorage.app",
    messagingSenderId: "672743327567",
    appId: "1:672743327567:web:8875f89b1f282b7aba273a",
    measurementId: "G-XYVLCZD740"
};

// Variáveis globais do App
let app, db, auth;
let userId = null;
let profileUnsubscribe = () => {};
let userProfile = {
    score: 0,
    completedLektions: [],
    theme: 'taylorSwift',
    name: 'Estudante',
    avatarUrl: ''
};
let currentTheme = 'taylorSwift';

// Dados estáticos (carregados pelos scripts no app.html)
// Se os arquivos JS não carregarem, estes serão arrays/objetos vazios.
const allLektions = window.exercisesData || [];
const allGrammar = window.grammarExplanations || {};
const allThemes = window.themes || {};

// Variáveis de estado do exercício
let currentLektion = null;
let currentExerciseIndex = 0;
let userAnswer = '';
let feedback = null;

// --- FUNÇÃO DE AJUDA PARA ÍCONES ---
/**
 * Executa o lucide.createIcons() de forma segura, evitando erros
 * caso a biblioteca de ícones falhe ao carregar.
 */
function safeCreateIcons() {
    if (window.lucide) {
        lucide.createIcons();
    } else {
        console.warn('Biblioteca de ícones (Lucide) não carregou a tempo.');
    }
}


// --- INICIALIZAÇÃO DO FIREBASE E APP ---

function initFirebase() {
    try {
        app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        auth = getAuth(app);
        
        // Pega o tema salvo no localStorage (se houver) para evitar flash
        const savedTheme = localStorage.getItem('deutschAppTheme');
        if (savedTheme && allThemes[savedTheme]) {
            applyTheme(savedTheme, false);
        }

        onAuthStateChanged(auth, (user) => {
            if (user) {
                // Usuário está logado
                userId = user.uid;
                localStorage.setItem('deutschAppUserId', userId);
                initializeAppLogic(); // <--- Inicia o app
            } else {
                // Usuário não está logado
                localStorage.removeItem('deutschAppUserId');
                window.location.href = 'index.html'; // Redireciona para o login
            }
        });

    } catch (error) {
        console.error("Erro ao inicializar Firebase:", error);
        document.body.innerHTML = `<h1>Erro crítico ao carregar o Firebase. Verifique o console e tente recarregar a página.</h1><p>${error.message}</p>`;
    }
}

// Inicia a lógica principal do app
function initializeAppLogic() {
    console.log("App lógico iniciado para o usuário:", userId);
    // Esconde o loader SÓ DEPOIS que os dados do perfil carregarem (movido para listenToProfile)
    listenToProfile(); // Começa a ouvir os dados do usuário
    window.addEventListener('hashchange', router); // Ouve mudanças no hash (navegação)
}

// --- SISTEMA DE TEMAS (Inspirado no BookTracker) ---

function applyTheme(themeName, saveToDb = true) {
    const theme = allThemes[themeName];
    if (!theme) {
        console.warn(`Tema "${themeName}" não encontrado. Usando padrão.`);
        return;
    }

    // Define as variáveis CSS globais
    document.documentElement.style.setProperty('--primary', theme.primary);
    document.documentElement.style.setProperty('--accent', theme.accent);
    document.documentElement.style.setProperty('--bg', theme.bg);
    document.documentElement.style.setProperty('--card', theme.card);
    document.documentElement.style.setProperty('--text', theme.text);
    document.documentElement.style.setProperty('--border', theme.border);

    currentTheme = themeName;
    localStorage.setItem('deutschAppTheme', themeName);

    // Salva a preferência no Firestore
    if (saveToDb && userId) {
        saveProfileData({ theme: themeName }, false); // Salva sem mostrar loading
    }
}

// --- FUNÇÕES DE DADOS (FIRESTORE) ---

// Ouve as mudanças no perfil do usuário
function listenToProfile() {
    if (profileUnsubscribe) profileUnsubscribe(); // Cancela o listener anterior
    if (!userId) return;

    const profileDocRef = doc(db, "users", userId, "profile", "data");
    
    profileUnsubscribe = onSnapshot(profileDocRef, (doc) => {
        const googleUser = auth.currentUser;
        if (doc.exists()) {
            const data = doc.data();
            userProfile = {
                ...userProfile, // Mantém padrões
                ...data, // Sobrescreve com dados do FB
                name: data.name || googleUser?.displayName || 'Estudante',
                avatarUrl: data.avatarUrl || googleUser?.photoURL || ''
            };
            console.log("Perfil do usuário carregado:", userProfile);
        } else {
            // Se não existe, cria um perfil básico
            console.log("Nenhum perfil encontrado, criando um novo...");
            userProfile = {
                score: 0,
                completedLektions: [],
                theme: 'taylorSwift',
                name: googleUser?.displayName || 'Estudante',
                avatarUrl: googleUser?.photoURL || '',
                uid: userId,
                email: googleUser?.email || ''
            };
            saveProfileData(userProfile, false); // Salva o novo perfil
        }
        
        // Aplica o tema carregado do perfil
        applyTheme(userProfile.theme || 'taylorSwift', false);
        
        // **IMPORTANTE**: Esconde o loader e renderiza a página SÓ AGORA
        document.getElementById('page-loader').classList.add('hidden');
        router(); 
    }, (error) => {
        console.error("Erro ao ouvir perfil:", error);
        document.getElementById('page-loader').innerHTML = `<p class="text-red-500">Erro ao carregar perfil: ${error.message}</p>`;
    });
}

// Função genérica para salvar dados no perfil
async function saveProfileData(dataToSave, showLoadingFeedback = true) {
    if (!userId) return;

    const profileDocRef = doc(db, "users", userId, "profile", "data");
    if (showLoadingFeedback) showLoading("Salvando...");

    try {
        await setDoc(profileDocRef, {
            ...dataToSave,
            lastUpdated: serverTimestamp()
        }, { merge: true }); // Merge: true para não apagar dados existentes
        
        if (showLoadingFeedback) hideModal();
        console.log("Dados salvos com sucesso:", dataToSave);
    } catch (error) {
        console.error("Erro ao salvar dados do perfil:", error);
        if (showLoadingFeedback) hideModal();
        showModal("Erro ao Salvar", `Não foi possível salvar seu progresso: ${error.message}`);
    }
}

// --- SISTEMA DE MODAL (Inspirado no BookTracker) ---

const modalContainer = document.getElementById('modal-container');
const modalContent = document.getElementById('modal-content');

function showModal(title, contentHtml, maxWidth = '600px') {
    modalContent.innerHTML = `
        <button id="modal-close-btn" class="modal-close-btn">
            <i data-lucide="x" class="w-6 h-6"></i>
        </button>
        <h2 class="text-2xl font-bold mb-6" style="color: var(--primary);">${title}</h2>
        <div id="modal-body">${contentHtml}</div>
    `;
    modalContent.style.maxWidth = maxWidth;
    modalContainer.classList.remove('hidden');
    safeCreateIcons(); // Recria ícones dentro do modal

    // Adiciona listeners
    modalContainer.addEventListener('click', hideModal);
    modalContent.addEventListener('click', (e) => e.stopPropagation());
    document.getElementById('modal-close-btn').addEventListener('click', hideModal);
    document.addEventListener('keydown', handleEscKey);
}

function hideModal() {
    modalContainer.classList.add('hidden');
    modalContent.innerHTML = '';
    
    // Se estávamos em uma lição, volta para o mapa
    if (window.location.hash.startsWith('#/lektion/')) {
        window.location.hash = '#/map';
    }

    document.removeEventListener('keydown', handleEscKey);
}

function handleEscKey(event) {
    if (event.key === 'Escape') {
        hideModal();
    }
}

function showLoading(message = 'Carregando...') {
    modalContent.innerHTML = `
        <div class="flex flex-col items-center justify-center p-8 text-center">
            <svg class="animate-spin h-8 w-8 text-white mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="text-lg font-medium">${message}</p>
        </div>
    `;
    modalContent.style.maxWidth = '300px';
    modalContainer.classList.remove('hidden');
    
    // Remove listeners de fechar
    modalContainer.removeEventListener('click', hideModal);
    document.removeEventListener('keydown', handleEscKey);
}

// --- ROUTER (Inspirado no BookTracker) ---

const pages = ['home', 'map', 'progress', 'settings'];

function hideAllPages() {
    pages.forEach(pageId => {
        const pageEl = document.getElementById(`page-${pageId}`);
        if (pageEl) pageEl.classList.add('hidden');
    });
    // Não mexemos no loader aqui, ele é controlado pelo listenToProfile
}

function router() {
    if (!userId) return; // Não faz nada se os dados do usuário ainda não carregaram

    const currentHash = window.location.hash || '#/home';
    const [path, param] = currentHash.substring(2).split('/');

    // Rotas de Modal (Lição, Menu)
    if (path === 'lektion') {
        renderLektionInModal(parseInt(param));
        return; // Para a execução para manter o modal aberto
    }
    if (path === 'menu') {
        renderMenuInModal();
        return;
    }

    // Se nenhuma rota de modal foi ativada, garante que o modal esteja fechado
    if (!modalContainer.classList.contains('hidden')) {
        hideModal();
    }

    // Rotas de Página
    hideAllPages();
    updateNavLinks(currentHash);

    const targetPage = document.getElementById(`page-${path}`);
    if (targetPage) {
        targetPage.classList.remove('hidden');
        switch (path) {
            case 'home': renderHome(); break;
            case 'map': renderMap(); break;
            case 'progress': renderProgress(); break;
            case 'settings': renderSettings(); break;
            default:
                document.getElementById('page-home').classList.remove('hidden');
                renderHome();
        }
    } else {
        // Fallback para home
        document.getElementById('page-home').classList.remove('hidden');
        renderHome();
    }
    
    safeCreateIcons(); // Atualiza ícones na página
}

function updateNavLinks(activeHash) {
    document.querySelectorAll('.nav-link').forEach(link => {
        const linkHash = new URL(link.href, window.location.origin).hash;
        if (linkHash === activeHash) {
            link.classList.add('active');
            link.classList.remove('text-gray-400');
        } else {
            link.classList.remove('active');
            link.classList.add('text-gray-400');
        }
    });
}

// --- RENDERIZAÇÃO DE PÁGINAS ---

function getPageHeader(title) {
    const avatarUrl = userProfile.avatarUrl || `https://placehold.co/100x100/333/FFF?text=${userProfile.name.charAt(0)}`;
    return `
        <div class="flex items-center gap-4 mb-8 pt-8">
            <img src="${avatarUrl}" alt="Avatar" class="w-16 h-16 rounded-full object-cover shadow-lg border-2" style="border-color: var(--primary);">
            <div>
                <h1 class="font-bold text-3xl md:text-4xl">${title}</h1>
                <p class="text-lg text-gray-400">Olá, ${userProfile.name.split(' ')[0]}!</p>
            </div>
        </div>
    `;
}

function renderHome() {
    const page = document.getElementById('page-home');
    const completedCount = userProfile.completedLektions?.length || 0;
    const totalLektions = allLektions.length;
    
    if (totalLektions === 0) {
        page.innerHTML = `
            ${getPageHeader('Início')}
            <div class="card p-6 text-center">
                <h2 class="text-xl font-bold mb-4 text-red-500">Erro de Carregamento</h2>
                <p class="text-gray-300">Não foi possível carregar os dados das lições (<code>exercisesData.js</code>). Verifique se o arquivo está no lugar correto e recarregue a página.</p>
            </div>
        `;
        return;
    }

    const progress = totalLektions > 0 ? (completedCount / totalLektions) * 100 : 0;

    page.innerHTML = `
        ${getPageHeader('Início')}
        <div class="card p-6 mb-6">
            <h2 class="text-xl font-bold mb-4">Bem-vindo(a) de volta!</h2>
            <p class="text-gray-300 mb-6">Continue de onde parou. Seu progresso é salvo automaticamente na nuvem.</p>
            <button id="go-to-map-btn" class="btn-primary w-full text-lg">
                Ir para o Mapa de Aulas →
            </button>
        </div>
        
        <div class="card p-6">
            <h2 class="text-xl font-bold mb-4">Seu Progresso</h2>
            <div class="mb-2 flex justify-between font-medium text-gray-300">
                <span>Lições Completas</span>
                <span>${completedCount} / ${totalLektions}</span>
            </div>
            <div class="progress-bar mb-4">
                <div class="progress-fill" style="width: ${progress}%;"></div>
            </div>
            <div class="text-center text-2xl font-bold" style="color: var(--primary);">${Math.round(progress)}%</div>
        </div>
    `;
    
    document.getElementById('go-to-map-btn').onclick = () => window.location.hash = '#/map';
}

function renderMap() {
    const page = document.getElementById('page-map');
    const completed = userProfile.completedLektions || [];

    if (allLektions.length === 0) {
        page.innerHTML = `
            ${getPageHeader('Mapa de Aprendizado')}
            <div class="card p-6 text-center">
                <h2 class="text-xl font-bold mb-4 text-red-500">Erro de Carregamento</h2>
                <p class="text-gray-300">Não foi possível carregar os dados das lições (<code>exercisesData.js</code>). Verifique se o arquivo está no lugar correto e recarregue a página.</p>
            </div>
        `;
        return;
    }
    
    page.innerHTML = `
        ${getPageHeader('Mapa de Aprendizado')}
        <div class="space-y-4">
            ${allLektions.map((lektion, index) => {
                const isCompleted = completed.includes(lektion.id);
                // A primeira lição está sempre desbloqueada.
                // As seguintes são desbloqueadas se a anterior foi completada.
                const isLocked = index > 0 && !completed.includes(allLektions[index - 1].id);
                
                return `
                    <div 
                        id="lektion-${lektion.id}"
                        class="card p-5 flex items-center gap-4 lektion-card ${isLocked ? 'locked' : 'cursor-pointer hover:bg-gray-800'}"
                        data-lektion-id="${lektion.id}"
                    >
                        <div class="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl" style="background-color: ${isLocked ? 'var(--border)' : 'var(--primary)'}; color: ${isLocked ? 'var(--text-opacity-50)' : 'white'};">
                            ${isLocked ? '<i data-lucide="lock" class="w-6 h-6"></i>' : (isCompleted ? '<i data-lucide="check" class="w-6 h-6"></i>' : index + 1)}
                        </div>
                        <div class="flex-grow">
                            <h3 class="text-lg font-bold">${lektion.title}</h3>
                            <p class="text-sm text-gray-400">${lektion.topics.join(', ')}</p>
                        </div>
                        ${!isLocked ? '<i data-lucide="chevron-right" class="w-6 h-6 text-gray-500"></i>' : ''}
                    </div>
                `;
            }).join('')}
        </div>
    `;

    // Adiciona event listeners para os cards de lição
    document.querySelectorAll('.lektion-card:not(.locked)').forEach(card => {
        card.onclick = () => {
            const lektionId = card.dataset.lektionId;
            window.location.hash = `#/lektion/${lektionId}`; // Abre a lição no modal
        };
    });
    
    safeCreateIcons();
}

function renderProgress() {
    const page = document.getElementById('page-progress');
    const completedCount = userProfile.completedLektions?.length || 0;
    const totalLektions = allLektions.length;
    const score = userProfile.score || 0;
    
    page.innerHTML = `
        ${getPageHeader('Progresso')}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="card p-6 text-center">
                <h2 class="text-lg font-medium text-gray-400 mb-2">Pontos Totais</h2>
                <div class="text-5xl font-bold" style="color: var(--primary);">${score}</div>
                <i data-lucide="award" class="w-12 h-12 mx-auto mt-4 text-gray-500"></i>
            </div>
            <div class="card p-6 text-center">
                <h2 class="text-lg font-medium text-gray-400 mb-2">Lições Completas</h2>
                <div class="text-5xl font-bold" style="color: var(--accent);">${completedCount} / ${totalLektions || 'N/A'}</div>
                <i data-lucide="check-circle" class="w-12 h-12 mx-auto mt-4 text-gray-500"></i>
            </div>
            <div class="card p-6 md:col-span-2">
                <h2 class="text-xl font-bold mb-4">Lições Completadas</h2>
                ${(completedCount > 0 && allLektions.length > 0) ? `
                    <ul class="space-y-3">
                        ${userProfile.completedLektions.map(id => {
                            const lektion = allLektions.find(l => l.id === id);
                            return lektion ? `<li class="flex items-center gap-3 text-gray-300"><i data-lucide="check" class="w-5 h-5 text-green-500"></i> ${lektion.title}</li>` : '';
                        }).join('')}
                    </ul>
                ` : `
                    <p class="text-gray-400 text-center py-4">Você ainda não completou nenhuma lição. Vá para o Mapa para começar!</p>
                `}
            </div>
        </div>
    `;
    
    safeCreateIcons();
}

function renderSettings() {
    const page = document.getElementById('page-settings');
    
    if (Object.keys(allThemes).length === 0) {
         page.innerHTML = `
            ${getPageHeader('Configurações')}
            <div class="card p-6 text-center">
                <h2 class="text-xl font-bold mb-4 text-red-500">Erro de Carregamento</h2>
                <p class="text-gray-300">Não foi possível carregar os dados dos temas (<code>themes.js</code>). Verifique se o arquivo está no lugar correto e recarregue a página.</p>
            </div>
        `;
        return;
    }
    
    const currentThemeName = userProfile.theme || 'taylorSwift';

    page.innerHTML = `
        ${getPageHeader('Configurações')}
        
        <div class="card p-6 mb-6">
            <h2 class="text-xl font-bold mb-4">Tema do Aplicativo</h2>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
                ${Object.keys(allThemes).map(themeName => {
                    const theme = allThemes[themeName];
                    const isSelected = themeName === currentThemeName;
                    return `
                        <button 
                            class="theme-option p-4 rounded-lg border-2"
                            data-theme="${themeName}"
                            style="border-color: ${isSelected ? theme.primary : 'var(--border)'}; background-color: ${theme.bg};"
                        >
                            <span class="font-medium" style="color: ${theme.text};">${theme.name}</span>
                        </button>
                    `;
                }).join('')}
            </div>
        </div>

        <div class="card p-6">
            <h2 class="text-xl font-bold mb-4">Conta</h2>
            <p class="text-gray-300 mb-4">Você está logado como ${userProfile.name} (${userProfile.email || 'sem e-mail'}).</p>
            <button id="logout-btn" class="btn-secondary w-full" style="border-color: #ef4444; color: #ef4444;">
                Sair (Logout)
            </button>
        </div>
    `;

    // Adiciona listeners
    document.querySelectorAll('.theme-option').forEach(btn => {
        btn.onclick = () => {
            const themeName = btn.dataset.theme;
            applyTheme(themeName, true); // Salva no DB
            renderSettings(); // Re-renderiza para mostrar a seleção
        };
    });
    
    document.getElementById('logout-btn').onclick = async () => {
        showLoading("Saindo...");
        try {
            await signOut(auth);
            localStorage.clear();
            window.location.href = 'index.html';
        } catch (error) {
            hideModal();
            showModal("Erro ao Sair", error.message);
        }
    };
}

// --- LÓGICA DE LIÇÃO E EXERCÍCIOS (NO MODAL) ---

function renderLektionInModal(lektionId) {
    const lektion = allLektions.find(l => l.id === lektionId);
    if (!lektion) {
        hideModal();
        window.location.hash = '#/map';
        return;
    }

    // Reseta o estado da lição
    currentLektion = lektion;
    currentExerciseIndex = 0;
    userAnswer = '';
    feedback = null;

    const modalTitle = `${lektion.title}`;
    const modalContentHtml = `<div id="exercise-container"></div>`;
    
    showModal(modalTitle, modalContentHtml, '900px');
    renderCurrentExercise();
}

function renderCurrentExercise() {
    const container = document.getElementById('exercise-container');
    if (!container || !currentLektion) return;

    const exercise = currentLektion.exercises[currentExerciseIndex];
    const progress = ((currentExerciseIndex + 1) / currentLektion.exercises.length) * 100;

    let inputHtml = '';
    if (exercise.type === 'fillBlank' || exercise.type === 'translation') {
        inputHtml = `
            <input 
                type="text"
                id="exercise-input"
                class="input-field"
                placeholder="Digite sua resposta..."
                value="${userAnswer}"
                ${feedback ? 'disabled' : ''}
            >
        `;
    } else if (exercise.type === 'multipleChoice') {
        inputHtml = `
            <div class="flex flex-col gap-3">
                ${exercise.options.map(option => `
                    <button 
                        class="btn-secondary text-left p-4 text-base w-full ${userAnswer === option ? '!bg-var(--primary) !text-white' : ''}"
                        data-option="${option}"
                        ${feedback ? 'disabled' : ''}
                        style="${userAnswer === option ? `background-color: var(--primary); color: white; border-color: var(--primary);` : ''}"
                    >
                        ${option}
                    </button>
                `).join('')}
            </div>
        `;
    }

    container.innerHTML = `
        <!-- Progresso -->
        <p class="text-sm font-medium text-gray-400 mb-2">
            Exercício ${currentExerciseIndex + 1} de ${currentLektion.exercises.length}
        </p>
        <div class="progress-bar mb-6">
            <div class="progress-fill" style="width: ${progress}%;"></div>
        </div>

        <!-- Pergunta -->
        <h3 class="text-xl font-medium mb-6">${exercise.question.replace(/___/g, '<span class="font-bold text-gray-400">___</span>')}</h3>
        
        <!-- Input -->
        <div class="mb-4">${inputHtml}</div>
        
        <!-- Feedback -->
        <div id="feedback-container">
            ${feedback ? `
                <div class="feedback ${feedback.isCorrect ? 'correct' : 'incorrect'}">
                    <i data-lucide="${feedback.isCorrect ? 'check-circle' : 'x-circle'}" class="w-8 h-8 flex-shrink-0"></i>
                    <div>
                        <strong class="block mb-1">${feedback.isCorrect ? 'Correto!' : 'Incorreto'}</strong>
                        ${feedback.explanation}
                    </div>
                </div>
            ` : ''}
        </div>
        
        <!-- Botões de Ação -->
        <div class="flex gap-4 mt-8 pt-6 border-t" style="border-color: var(--border);">
            <button id="grammar-btn" class="btn-secondary">
                <i data-lucide="book-open" class="w-5 h-5 mr-2"></i> Gramática
            </button>
            <button id="action-btn" class="btn-primary flex-grow" ${(!userAnswer && !feedback) ? 'disabled' : ''}>
                ${feedback ? 'Próximo →' : 'Verificar'}
            </button>
        </div>
    `;

    // Adiciona Listeners
    if (exercise.type === 'fillBlank' || exercise.type === 'translation') {
        const input = document.getElementById('exercise-input');
        const actionBtn = document.getElementById('action-btn');
        input.oninput = (e) => {
            userAnswer = e.target.value;
            if (!feedback) actionBtn.disabled = !userAnswer; // Ativa/desativa o botão
        };
        input.onkeydown = (e) => {
            if (e.key === 'Enter' && !feedback && userAnswer) document.getElementById('action-btn').click();
        };
        if (!feedback) input.focus();
    } else if (exercise.type === 'multipleChoice') {
        document.querySelectorAll('.btn-secondary[data-option]').forEach(btn => {
            btn.onclick = () => {
                if (feedback) return;
                userAnswer = btn.dataset.option;
                renderCurrentExercise(); // Re-renderiza para mostrar a seleção
            };
        });
    }
    
    document.getElementById('grammar-btn').onclick = showGrammarModal;
    document.getElementById('action-btn').onclick = feedback ? nextExercise : checkAnswer;
    
    safeCreateIcons();
}

function showGrammarModal() {
    if (!currentLektion) return;

    if (Object.keys(allGrammar).length === 0) {
        showModal("Erro de Carregamento", "Não foi possível carregar os dados de gramática (<code>grammarExplanations.js</code>).");
        return;
    }

    const grammarHtml = currentLektion.grammarKeys.map(key => {
        const explanation = allGrammar[key];
        return explanation ? `
            <div class="mb-6">
                <h3 class="text-xl font-bold mb-3" style="color: var(--accent);">${explanation.title}</h3>
                <div class="text-gray-300 whitespace-pre-line leading-relaxed">${explanation.content.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
            </div>
        ` : `<p class="text-red-500">Erro: Tópico de gramática "${key}" não encontrado.</p>`;
    }).join('');
    
    showModal("Explicações Gramaticais 📚", grammarHtml, '900px');
}

function checkAnswer() {
    if (!userAnswer) return;
    
    const exercise = currentLektion.exercises[currentExerciseIndex];
    const userAns = userAnswer.trim().toLowerCase();
    const correctAns = exercise.answer.toLowerCase();
    const alternatives = exercise.alternatives?.map(a => a.toLowerCase()) || [];

    // Lógica de checagem (igual ao React app)
    const correctAnswers = [correctAns, ...alternatives];
    const isCorrect = correctAnswers.some(ans => {
        if (ans.includes('|')) {
            const parts = ans.split('|');
            const userParts = userAns.split(/[\s,|]+/); // Aceita espaço, vírgula ou | como separador
            return parts.every((part, idx) => userParts[idx] === part);
        }
        return userAns === ans;
    });

    feedback = {
        isCorrect,
        explanation: exercise.explanation
    };

    if (isCorrect) {
        // Adiciona pontos
        const newScore = (userProfile.score || 0) + 10;
        userProfile.score = newScore; // Atualiza localmente
        saveProfileData({ score: newScore }, false); // Salva no FB sem loading
    }
    
    renderCurrentExercise(); // Re-renderiza com o feedback
}

async function nextExercise() {
    if (currentExerciseIndex < currentLektion.exercises.length - 1) {
        // Próximo exercício
        currentExerciseIndex++;
        userAnswer = '';
        feedback = null;
        renderCurrentExercise();
    } else {
        // Finalizou a lição
        await finishLektion();
    }
}

async function finishLektion() {
    showLoading("Salvando progresso...");
    
    const completed = userProfile.completedLektions || [];
    if (!completed.includes(currentLektion.id)) {
        completed.push(currentLektion.id);
        userProfile.completedLektions = completed; // Atualiza local
        await saveProfileData({ completedLektions: completed }, false); // Salva no FB
    }
    
    hideModal(); // Fecha o modal da lição
    window.location.hash = '#/map'; // Volta para o mapa
    // O router vai rodar e re-renderizar o mapa com a lição completa
}

// --- INICIALIZAÇÃO DO APP ---
// Executa o initFirebase assim que o script for lido,
// como ele está no fim do <body>, o DOM estará pronto.
initFirebase();

