// app.js - Lógica principal do App Deutsch A1.1 (Vanilla JS)
// ATUALIZAÇÃO: Salva o progresso por exercício e corrige o modal.

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
    inProgressLektions: {}, // <-- NOVO: Salva progresso (ex: { 1: 3 } -> lição 1, parou no ex 3)
    theme: 'taylorSwift',
    name: 'Estudante',
    avatarUrl: ''
};
let currentTheme = 'taylorSwift';

// Dados estáticos (carregados pelos scripts no app.html)
const allLektions = window.exercisesData || [];
const allGrammar = window.grammarExplanations || {};
const allThemes = window.themes || {};

// Variáveis de estado do exercício
let currentLektion = null;
let currentExerciseIndex = 0;
let userAnswer = '';
let feedback = null;

// --- FUNÇÃO DE AJUDA PARA ÍCONES ---
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
        
        const savedTheme = localStorage.getItem('deutschAppTheme');
        if (savedTheme && allThemes[savedTheme]) {
            applyTheme(savedTheme, false);
        }

        // Injeta o estilo para texto secundário (corrige temas claros)
        const style = document.createElement('style');
        style.textContent = `
            .text-secondary {
                color: var(--text);
                opacity: 0.7;
            }
        `;
        document.head.appendChild(style);

        onAuthStateChanged(auth, (user) => {
            if (user) {
                userId = user.uid;
                localStorage.setItem('deutschAppUserId', userId);
                initializeAppLogic();
            } else {
                localStorage.removeItem('deutschAppUserId');
                window.location.href = 'index.html';
            }
        });

    } catch (error) {
        console.error("Erro ao inicializar Firebase:", error);
        document.body.innerHTML = `<h1>Erro crítico ao carregar o Firebase. Verifique o console e tente recarregar a página.</h1><p>${error.message}</p>`;
    }
}

function initializeAppLogic() {
    console.log("App lógico iniciado para o usuário:", userId);
    listenToProfile();
    window.addEventListener('hashchange', router);
}

// --- SISTEMA DE TEMAS ---

function applyTheme(themeName, saveToDb = true) {
    const theme = allThemes[themeName];
    if (!theme) {
        console.warn(`Tema "${themeName}" não encontrado. Usando padrão.`);
        return;
    }

    document.documentElement.style.setProperty('--primary', theme.primary);
    document.documentElement.style.setProperty('--accent', theme.accent);
    document.documentElement.style.setProperty('--bg', theme.bg);
    document.documentElement.style.setProperty('--card', theme.card);
    document.documentElement.style.setProperty('--text', theme.text);
    document.documentElement.style.setProperty('--border', theme.border);

    currentTheme = themeName;
    localStorage.setItem('deutschAppTheme', themeName);

    if (saveToDb && userId) {
        saveProfileData({ theme: themeName }, false);
    }
}

// --- FUNÇÕES DE DADOS (FIRESTORE) ---

function listenToProfile() {
    if (profileUnsubscribe) profileUnsubscribe();
    if (!userId) return;

    const profileDocRef = doc(db, "users", userId, "profile", "data");
    
    profileUnsubscribe = onSnapshot(profileDocRef, (doc) => {
        const googleUser = auth.currentUser;
        if (doc.exists()) {
            const data = doc.data();
            userProfile = {
                ...userProfile,
                ...data,
                inProgressLektions: data.inProgressLektions || {}, // <-- ATUALIZADO
                name: data.name || googleUser?.displayName || 'Estudante',
                avatarUrl: data.avatarUrl || googleUser?.photoURL || ''
            };
            console.log("Perfil do usuário carregado:", userProfile);
        } else {
            console.log("Nenhum perfil encontrado, criando um novo...");
            userProfile = {
                score: 0,
                completedLektions: [],
                inProgressLektions: {}, // <-- ATUALIZADO
                theme: 'taylorSwift',
                name: googleUser?.displayName || 'Estudante',
                avatarUrl: googleUser?.photoURL || '',
                uid: userId,
                email: googleUser?.email || ''
            };
            saveProfileData(userProfile, false);
        }
        
        applyTheme(userProfile.theme || 'taylorSwift', false);
        
        document.getElementById('page-loader').classList.add('hidden');
        router(); 
    }, (error) => {
        console.error("Erro ao ouvir perfil:", error);
        document.getElementById('page-loader').innerHTML = `<p class="text-red-500">Erro ao carregar perfil: ${error.message}</p>`;
    });
}

async function saveProfileData(dataToSave, showLoadingFeedback = true) {
    if (!userId) return;

    const profileDocRef = doc(db, "users", userId, "profile", "data");
    if (showLoadingFeedback) showLoading("Salvando...");

    try {
        await setDoc(profileDocRef, {
            ...dataToSave,
            lastUpdated: serverTimestamp()
        }, { merge: true });
        
        if (showLoadingFeedback) hideModal();
        console.log("Dados salvos com sucesso:", dataToSave);
    } catch (error) {
        console.error("Erro ao salvar dados do perfil:", error);
        if (showLoadingFeedback) hideModal();
        showModal("Erro ao Salvar", `Não foi possível salvar seu progresso: ${error.message}`);
    }
}

// --- SISTEMA DE MODAL (AGORA SÓ PARA GRAMÁTICA/LOADING) ---

const modalContainer = document.getElementById('modal-container');
const modalContent = document.getElementById('modal-content');

// ATUALIZADO: Remove 'maxWidth' - agora é controlado pelo CSS
function showModal(title, contentHtml) {
    modalContent.innerHTML = `
        <button id="modal-close-btn" class="modal-close-btn">
            <i data-lucide="x" class="w-6 h-6"></i>
        </button>
        <!-- Título agora usa uma cor fixa legível no fundo branco -->
        <h2 class="text-2xl font-bold mb-6" style="color: #667eea;">${title}</h2>
        <!-- 'prose' adicionado para estilizar o HTML da gramática -->
        <div id="modal-body" class="prose">${contentHtml}</div>
    `;
    // modalContent.style.maxWidth = maxWidth; // <-- LINHA REMOVIDA
    modalContainer.classList.remove('hidden');
    safeCreateIcons();

    modalContainer.addEventListener('click', hideModal);
    modalContent.addEventListener('click', (e) => e.stopPropagation());
    document.getElementById('modal-close-btn').addEventListener('click', hideModal);
    document.addEventListener('keydown', handleEscKey);
}

function hideModal() {
    modalContainer.classList.add('hidden');
    modalContent.innerHTML = '';
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
    
    modalContainer.removeEventListener('click', hideModal);
    document.removeEventListener('keydown', handleEscKey);
}

// Converte o Markdown simples do 'grammarExplanations.js' para HTML
function parseSimpleMarkdown(text) {
    if (!text) return '';

    let htmlLines = text.trim().split('\n');
    let inList = false;

    let processedLines = htmlLines.map(line => {
        // 1. Converte **bold** para <strong>bold</strong>
        let processedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // 2. Converte • item para <li>item</li>
        if (processedLine.trim().startsWith('• ')) {
            let itemContent = processedLine.trim().substring(2).trim();
            if (!inList) {
                inList = true;
                return '<ul><li class="mb-1">' + itemContent + '</li>'; // Tailwind 'prose' cuida do estilo
            } else {
                return '<li class="mb-1">' + itemContent + '</li>';
            }
        } else {
            if (inList) {
                inList = false;
                return '</ul>' + processedLine; 
            }
            return processedLine;
        }
    });

    if (inList) {
        processedLines.push('</ul>');
    }

    // O 'whitespace-pre-line' no CSS cuidará das quebras de linha
    return processedLines.join('\n');
}


// --- ROUTER ---

const pages = ['home', 'map', 'progress', 'settings', 'exercise'];

function hideAllPages() {
    pages.forEach(pageId => {
        const pageEl = document.getElementById(`page-${pageId}`);
        if (pageEl) pageEl.classList.add('hidden');
    });
}

function router() {
    if (!userId) return;

    const currentHash = window.location.hash || '#/home';
    const [path, param] = currentHash.substring(2).split('/');
    
    if (path === 'menu') {
        renderMenuInModal();
        return;
    }

    if (!modalContainer.classList.contains('hidden')) {
        hideModal();
    }

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
            case 'exercise': renderExercisePage(); break;
            default:
                document.getElementById('page-home').classList.remove('hidden');
                renderHome();
        }
    } else {
        document.getElementById('page-home').classList.remove('hidden');
        renderHome();
    }
    
    safeCreateIcons();
}

function updateNavLinks(activeHash) {
    document.querySelectorAll('.nav-link').forEach(link => {
        const linkHash = new URL(link.href, window.location.origin).hash;
        
        if (activeHash.startsWith('#/exercise')) {
             link.classList.remove('active');
             link.classList.add('text-secondary');
             return;
        }

        if (linkHash === activeHash) {
            link.classList.add('active');
            link.classList.remove('text-secondary');
        } else {
            link.classList.remove('active');
            link.classList.add('text-secondary');
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
                <p class="text-lg text-secondary">Olá, ${userProfile.name.split(' ')[0]}!</p>
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
                <p class="text-secondary">Não foi possível carregar os dados das lições (<code>exercisesData.js</code>). Verifique se o arquivo está no lugar correto e recarregue a página.</p>
            </div>
        `;
        return;
    }

    const progress = totalLektions > 0 ? (completedCount / totalLektions) * 100 : 0;

    page.innerHTML = `
        ${getPageHeader('Início')}
        <div class="card p-6 mb-6">
            <h2 class="text-xl font-bold mb-4">Bem-vindo(a) de volta!</h2>
            <p class="text-secondary mb-6">Continue de onde parou. Seu progresso é salvo automaticamente na nuvem.</p>
            <button id="go-to-map-btn" class="btn-primary w-full text-lg p-4 rounded-lg font-semibold">
                Ir para o Mapa de Aulas →
            </button>
        </div>
        
        <div class="card p-6">
            <h2 class="text-xl font-bold mb-4">Seu Progresso</h2>
            <div class="mb-2 flex justify-between font-medium text-secondary">
                <span>Lições Completas</span>
                <span>${completedCount} / ${totalLektions}</span>
            </div>
            <div class="progress-bar rounded-full h-3 overflow-hidden mb-4">
                <div class="progress-fill h-full rounded-full" style="width: ${progress}%;"></div>
            </div>
            <div class="text-center text-2xl font-bold" style="color: var(--primary);">${Math.round(progress)}%</div>
        </div>
    `;
    
    document.getElementById('go-to-map-btn').onclick = () => window.location.hash = '#/map';
}

function renderMap() {
    const page = document.getElementById('page-map');
    const completed = userProfile.completedLektions || [];
    const inProgress = userProfile.inProgressLektions || {};

    if (allLektions.length === 0) {
        page.innerHTML = `
            ${getPageHeader('Mapa de Aprendizado')}
            <div class="card p-6 text-center">
                <h2 class="text-xl font-bold mb-4 text-red-500">Erro de Carregamento</h2>
                <p class="text-secondary">Não foi possível carregar os dados das lições (<code>exercisesData.js</code>). Verifique se o arquivo está no lugar correto e recarregLektione a página.</p>
            </div>
        `;
        return;
    }
    
    page.innerHTML = `
        ${getPageHeader('Mapa de Aprendizado')}
        <div class="space-y-4">
            ${allLektions.map((lektion, index) => {
                const isCompleted = completed.includes(lektion.id);
                const isLocked = index > 0 && !completed.includes(allLektions[index - 1].id);
                const progressIndex = inProgress[lektion.id] || 0;
                const isStarted = progressIndex > 0 && !isCompleted;

                return `
                    <div 
                        id="lektion-${lektion.id}"
                        class="card p-5 flex items-center gap-4 lektion-card rounded-lg ${isLocked ? 'locked' : 'cursor-pointer hover:opacity-80'}"
                        data-lektion-id="${lektion.id}"
                    >
                        <div class="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl" style="background-color: ${isLocked ? 'var(--border)' : 'var(--primary)'}; color: ${isLocked ? 'var(--text)' : 'white'}; opacity: ${isLocked ? '0.7' : '1'};">
                            ${isLocked ? '<i data-lucide="lock" class="w-6 h-6"></i>' : (isCompleted ? '<i data-lucide="check" class="w-6 h-6"></i>' : index + 1)}
                        </div>
                        <div class="flex-grow">
                            <h3 class="text-lg font-bold">${lektion.title}</h3>
                            <p class="text-sm text-secondary">${lektion.topics.join(', ')}</p>
                            ${isStarted ? `
                                <div class="mt-2">
                                    <span class="text-xs font-medium px-2 py-1 rounded-full" style="background-color: var(--accent); color: white;">Em progresso</span>
                                </div>
                            ` : ''}
                        </div>
                        ${!isLocked ? '<i data-lucide="chevron-right" class="w-6 h-6 text-secondary"></i>' : ''}
                    </div>
                `;
            }).join('')}
        </div>
    `;

    document.querySelectorAll('.lektion-card:not(.locked)').forEach(card => {
        card.onclick = () => {
            const lektionId = card.dataset.lektionId;
            startLektion(parseInt(lektionId));
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
            <div class="card p-6 text-center rounded-lg">
                <h2 class="text-lg font-medium text-secondary mb-2">Pontos Totais</h2>
                <div class="text-5xl font-bold" style="color: var(--primary);">${score}</div>
                <i data-lucide="award" class="w-12 h-12 mx-auto mt-4 text-secondary"></i>
            </div>
            <div class="card p-6 text-center rounded-lg">
                <h2 class="text-lg font-medium text-secondary mb-2">Lições Completas</h2>
                <div class="text-5xl font-bold" style="color: var(--accent);">${completedCount} / ${totalLektions || 'N/A'}</div>
                <i data-lucide="check-circle" class="w-12 h-12 mx-auto mt-4 text-secondary"></i>
            </div>
            <div class="card p-6 md:col-span-2 rounded-lg">
                <h2 class="text-xl font-bold mb-4">Lições Completadas</h2>
                ${(completedCount > 0 && allLektions.length > 0) ? `
                    <ul class="space-y-3">
                        ${userProfile.completedLektions.map(id => {
                            const lektion = allLektions.find(l => l.id === id);
                            return lektion ? `<li class="flex items-center gap-3 text-secondary"><i data-lucide="check" class="w-5 h-5 text-green-500"></i> ${lektion.title}</li>` : '';
                        }).join('')}
                    </ul>
                ` : `
                    <p class="text-secondary text-center py-4">Você ainda não completou nenhuma lição. Vá para o Mapa para começar!</p>
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
            <div class="card p-6 text-center rounded-lg">
                <h2 class="text-xl font-bold mb-4 text-red-500">Erro de Carregamento</h2>
                <p class="text-secondary">Não foi possível carregar os dados dos temas (<code>themes.js</code>). Verifique se o arquivo está no lugar correto e recarregLektione a página.</p>
            </div>
        `;
        return;
    }
    
    const currentThemeName = userProfile.theme || 'taylorSwift';

    page.innerHTML = `
        ${getPageHeader('Configurações')}
        
        <div class="card p-6 mb-6 rounded-lg">
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

        <div class="card p-6 rounded-lg">
            <h2 class="text-xl font-bold mb-4">Conta</h2>
            <p class="text-secondary mb-4">Você está logado como ${userProfile.name} (${userProfile.email || 'sem e-mail'}).</p>
            <button id="logout-btn" class="btn-secondary w-full p-3 rounded-lg font-semibold" style="border-color: #ef4444; color: #ef4444;">
                Sair (Logout)
            </button>
        </div>
    `;

    document.querySelectorAll('.theme-option').forEach(btn => {
        btn.onclick = () => {
            const themeName = btn.dataset.theme;
            applyTheme(themeName, true);
            renderSettings();
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

// --- LÓGICA DE LIÇÃO E EXERCÍCIOS ---

function startLektion(lektionId) {
    const lektion = allLektions.find(l => l.id === lektionId);
    if (!lektion) {
        console.error("Lição não encontrada:", lektionId);
        return;
    }

    currentLektion = lektion;
    
    // *** ATUALIZADO: Carrega o progresso salvo ***
    const savedIndex = userProfile.inProgressLektions ? (userProfile.inProgressLektions[lektion.id] || 0) : 0;
    // Se o índice salvo for igual ao total, significa que ele terminou mas não "finalizou"
    // Reinicia do zero nesse caso.
    currentExerciseIndex = savedIndex >= lektion.exercises.length ? 0 : savedIndex;
    
    userAnswer = '';
    feedback = null;

    window.location.hash = '#/exercise';
}

function renderExercisePage() {
    const page = document.getElementById('page-exercise');

    if (!currentLektion) {
        page.innerHTML = `
            <h2 class="text-2xl font-bold mb-4 text-red-500">Erro</h2>
            <p class="text-secondary mb-6">Nenhuma lição está selecionada.</p>
            <button id="back-to-map" class="btn-primary p-3 rounded-lg">Voltar ao Mapa</button>
        `;
        document.getElementById('back-to-map').onclick = () => window.location.hash = '#/map';
        return;
    }
    
    page.innerHTML = `
        <div class="exercise-page-header flex items-center gap-4 py-4">
            <button id="back-to-map-btn" class="btn-secondary" style="padding: 0.5rem 0.75rem;">
                <i data-lucide="arrow-left" class="w-6 h-6"></i>
            </button>
            <div class="flex-grow">
                <h1 class="text-xl md:text-2xl font-bold" style="color: var(--primary);">${currentLektion.title}</h1>
                <p class="text-secondary text-sm">Exercício ${currentExerciseIndex + 1} de ${currentLektion.exercises.length}</p>
            </div>
        </div>
        <div id="exercise-container-page"></div>
    `;
    
    document.getElementById('back-to-map-btn').onclick = () => {
        // Não precisa mais de 'confirm' pois o progresso está salvo
        currentLektion = null;
        window.location.hash = '#/map';
    };
    
    safeCreateIcons();
    renderCurrentExerciseOnPage();
}

function renderCurrentExerciseOnPage() {
    const container = document.getElementById('exercise-container-page');
    if (!container || !currentLektion) return;

    const exercise = currentLektion.exercises[currentExerciseIndex];
    const progress = ((currentExerciseIndex + 1) / currentLektion.exercises.length) * 100;

    let inputHtml = '';
    if (exercise.type === 'fillBlank' || exercise.type === 'translation') {
        inputHtml = `
            <input 
                type="text"
                id="exercise-input"
                class="input-field w-full p-4 text-lg rounded-lg"
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
                        class="btn-secondary text-left p-4 text-base w-full rounded-lg"
                        data-option="${option}"
                        ${feedback ? 'disabled' : ''}
                        style="${userAnswer === option ? `background-color: var(--primary); color: white; border-color: var(--primary);` : `color: var(--text); border-color: var(--border);`}"
                    >
                        ${option}
                    </button>
                `).join('')}
            </div>
        `;
    }

    container.innerHTML = `
        <div class="card p-4 mb-6 rounded-lg">
            <div class="progress-bar rounded-full h-3 overflow-hidden" style="margin: 0;">
                <div class="progress-fill h-full rounded-full" style="width: ${progress}%;"></div>
            </div>
        </div>

        <div class="card p-6 rounded-lg">
            <h3 class="text-xl font-medium mb-6">${exercise.question.replace(/___/g, '<span class="font-bold text-secondary">___</span>')}</h3>
            
            <div class="mb-4">${inputHtml}</div>
            
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
            
            <div class="flex gap-4 mt-8 pt-6 border-t" style="border-color: var(--border);">
                <button id="grammar-btn" class="btn-secondary p-3 rounded-lg flex items-center">
                    <i data-lucide="book-open" class="w-5 h-5 mr-2"></i> Gramática
                </button>
                <button id="action-btn" class="btn-primary flex-grow p-3 rounded-lg font-semibold" ${(!userAnswer && !feedback) ? 'disabled' : ''}>
                    ${feedback ? 'Próximo →' : 'Verificar'}
                </button>
            </div>
        </div>
    `;

    if (exercise.type === 'fillBlank' || exercise.type === 'translation') {
        const input = document.getElementById('exercise-input');
        const actionBtn = document.getElementById('action-btn');
        input.oninput = (e) => {
            userAnswer = e.target.value;
            if (!feedback) actionBtn.disabled = !userAnswer;
        };
        input.onkeydown = (e) => {
            if (e.key === 'Enter' && !feedback && userAnswer) document.getElementById('action-btn').click();
        };
        if (!feedback) input.focus();
    } else if (exercise.type === 'multipleChoice') {
        document.querySelectorAll('button[data-option]').forEach(btn => {
            btn.onclick = () => {
                if (feedback) return;
                userAnswer = btn.dataset.option;
                renderCurrentExerciseOnPage();
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
        if (!explanation) {
            return `<p class="text-red-500">Erro: Tópico de gramática "${key}" não encontrado.</p>`;
        }
        
        const parsedContent = parseSimpleMarkdown(explanation.content);

        return `
            <div class="mb-6">
                <!-- Título agora usa a cor do tema 'dark' (legível no branco) -->
                <h3 class="text-xl font-bold mb-3" style="color: #bb86fc;">${explanation.title}</h3>
                <div class="text-secondary whitespace-pre-line leading-relaxed break-words">
                    ${parsedContent}
                </div>
            </div>
        `;
    }).join('');
    
    // ATUALIZADO: Remove '900px' - largura é controlada pelo CSS
    showModal("Explicações Gramaticais 📚", grammarHtml);
}

function checkAnswer() {
    if (!userAnswer) return;
    
    const exercise = currentLektion.exercises[currentExerciseIndex];
    const userAns = userAnswer.trim().toLowerCase();
    const correctAns = exercise.answer.toLowerCase();
    const alternatives = exercise.alternatives?.map(a => a.toLowerCase()) || [];

    const correctAnswers = [correctAns, ...alternatives];
    const isCorrect = correctAnswers.some(ans => {
        if (ans.includes('|')) {
            const parts = ans.split('|');
            const userParts = userAns.split(/[\s,|]+/);
            return parts.every((part, idx) => userParts[idx] === part);
        }
        return userAns === ans;
    });

    feedback = {
        isCorrect,
        explanation: exercise.explanation
    };

    if (isCorrect) {
        const newScore = (userProfile.score || 0) + 10;
        userProfile.score = newScore;
        
        // *** ATUALIZADO: Salva o progresso do *próximo* índice ***
        const nextIndex = currentExerciseIndex + 1;
        const newProgress = { ...(userProfile.inProgressLektions || {}), [currentLektion.id]: nextIndex };
        userProfile.inProgressLektions = newProgress;
        
        // Salva pontuação E progresso da lição
        saveProfileData({ score: newScore, inProgressLektions: newProgress }, false); 
    }
    
    renderCurrentExerciseOnPage();
}

async function nextExercise() {
    if (currentExerciseIndex < currentLektion.exercises.length - 1) {
        currentExerciseIndex++;
        userAnswer = '';
        feedback = null;
        renderCurrentExerciseOnPage();
    } else {
        await finishLektion();
    }
}

async function finishLektion() {
    showLoading("Salvando progresso...");
    
    const completed = userProfile.completedLektions || [];
    if (!completed.includes(currentLektion.id)) {
        completed.push(currentLektion.id);
        userProfile.completedLektions = completed;
    }
    
    // *** ATUALIZADO: Remove do "em progresso" ***
    const newProgress = { ...(userProfile.inProgressLektions || {}) };
    delete newProgress[currentLektion.id];
    userProfile.inProgressLektions = newProgress;
    
    // Salva AMBAS as mudanças
    await saveProfileData({ completedLektions: completed, inProgressLektions: newProgress }, false);
    
    hideModal();
    currentLektion = null;
    window.location.hash = '#/map';
}

// --- INICIALIZAÇÃO DO APP ---
initFirebase();


