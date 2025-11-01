// app.js - Lógica principal do App Deutsch A1.1 (Vanilla JS)
// ATUALIZAÇÃO: Implementa a barra de navegação "Liquid Glass"

// Importações do Firebase (SDK 9 modular)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, doc, onSnapshot, setDoc, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
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
    inProgressLektions: {}, // Salva o progresso no meio da lição
    theme: 'taylorSwift',
    name: 'Estudante',
    avatarUrl: ''
};
let currentTheme = 'taylorSwift';

// ATUALIZAÇÃO: Deixamos de definir "|| []" aqui para que a verificação funcione
const allLektions = window.exercisesData;
const allGrammar = window.grammarExplanations;
const allThemes = window.themes;

// Variáveis de estado do exercício
let currentLektion = null;
let currentExerciseIndex = 0;
let userAnswer = '';
let feedback = null;

// --- FUNÇÃO DE AJUDA PARA ÍCONES ---
/**
 * Executa o lucide.createIcons() de forma segura.
 */
function safeCreateIcons() {
    if (window.lucide) {
        try {
            lucide.createIcons();
        } catch (error) {
            console.warn("Erro ao criar ícones Lucide:", error.message);
        }
    } else {
        console.warn('Biblioteca de ícones (Lucide) não carregou a tempo.');
    }
}


// --- INICIALIZAÇÃO DO FIREBASE E APP ---

function initFirebase() {
    try {
        // --- NOVA VERIFICAÇÃO DE DADOS (MAIS CEDO) ---
        // Verificamos se os scripts globais carregaram ANTES de fazer qualquer coisa.
        if (!allThemes || Object.keys(allThemes).length === 0) {
            document.body.innerHTML = `<div style="padding: 20px; font-family: sans-serif; color: #111;">
                <h1>Erro Crítico de Carregamento</h1>
                <p>O ficheiro <strong>themes.js</strong> não foi carregado ou está vazio.</p>
                <p>Por favor, verifique se o ficheiro existe e se o nome em <code>app.html</code> está correto.</p>
            </div>`;
            console.error("ERRO: themes.js não carregou. 'window.themes' está indefinido ou vazio.");
            return; // Para a execução
        }
        if (!allLektions || allLektions.length === 0) {
            document.body.innerHTML = `<div style="padding: 20px; font-family: sans-serif; color: #111;">
                <h1>Erro Crítico de Carregamento</h1>
                <p>O ficheiro <strong>exercisesData.js</strong> não foi carregado ou está vazio.</p>
                <p>Por favor, verifique se o ficheiro existe e se o nome em <code>app.html</code> está correto.</p>
            </div>`;
            console.error("ERRO: exercisesData.js não carregou. 'window.exercisesData' está indefinido ou vazio.");
            return; // Para a execução
        }
         if (!allGrammar || Object.keys(allGrammar).length === 0) {
            document.body.innerHTML = `<div style="padding: 20px; font-family: sans-serif; color: #111;">
                <h1>Erro Crítico de Carregamento</h1>
                <p>O ficheiro <strong>grammarExplanations.js</strong> não foi carregado ou está vazio.</p>
                <p>Por favor, verifique se o ficheiro existe e se o nome em <code>app.html</code> está correto.</p>
            </div>`;
            console.error("ERRO: grammarExplanations.js não carregou. 'window.grammarExplanations' está indefinido ou vazio.");
            return; // Para a execução
        }
        // --- FIM DA NOVA VERIFICAÇÃO ---

        app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        auth = getAuth(app);
        
        const savedTheme = localStorage.getItem('deutschAppTheme');
        if (savedTheme && allThemes[savedTheme]) {
            applyTheme(savedTheme, false);
        }

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
        document.body.innerHTML = `<h1>Erro crítico ao carregar o Firebase. Verifique o console.</h1><p>${error.message}</p>`;
    }
}

// Inicia a lógica principal do app
function initializeAppLogic() {
    try {
        console.log("App lógico iniciado para o usuário:", userId);
        
        // ATUALIZAÇÃO: Adiciona CSS dinâmico para legibilidade dos temas
        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = `.text-secondary { color: var(--text); opacity: 0.7; }`;
        document.head.appendChild(styleSheet);
        
        listenToProfile();
        window.addEventListener('hashchange', router);
        
        // Adiciona o listener para o "popstate" (botão de voltar do navegador)
        window.addEventListener('popstate', router);
    } catch (error) {
        console.error("Erro fatal no initializeAppLogic:", error);
        document.body.innerHTML = `<h1>Erro fatal ao iniciar o app.</h1><p>${error.message}</p>`;
    }
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
    
    // ATUALIZAÇÃO: Constrói o rgba() em JS para garantir a transparência
    const cardRgb = theme['card-rgb'] || '240, 230, 255';
    const borderRgb = theme['border-rgb'] || '216, 195, 232';
    document.documentElement.style.setProperty('--card-bg-transparent', `rgba(${cardRgb}, 0.7)`);
    document.documentElement.style.setProperty('--border-bg-transparent', `rgba(${borderRgb}, 0.5)`);


    currentTheme = themeName;
    localStorage.setItem('deutschAppTheme', themeName);

    if (saveToDb && userId) {
        saveProfileData({ theme: themeName }, false);
    }
}

// --- FUNÇÕES DE DADOS (FIRESTORE) ---

// Ouve as mudanças no perfil do usuário
function listenToProfile() {
    if (profileUnsubscribe) profileUnsubscribe();
    if (!userId) return;

    const profileDocRef = doc(db, "users", userId, "profile", "data");
    
    profileUnsubscribe = onSnapshot(profileDocRef, (docSnap) => {
        // ATUALIZAÇÃO: Envolvemos tudo num try...catch
        try {
            const googleUser = auth.currentUser;
            if (docSnap.exists()) {
                const data = docSnap.data();
                userProfile = {
                    ...userProfile, // Mantém padrões
                    ...data, // Sobrescreve com dados do FB
                    name: data.name || googleUser?.displayName || 'Estudante',
                    avatarUrl: data.avatarUrl || googleUser?.photoURL || ''
                };
                console.log("Perfil do usuário carregado:", userProfile);
            } else {
                console.log("Nenhum perfil encontrado, criando um novo...");
                userProfile = {
                    score: 0,
                    completedLektions: [],
                    inProgressLektions: {},
                    theme: 'taylorSwift',
                    name: googleUser?.displayName || 'Estudante',
                    avatarUrl: googleUser?.photoURL || '',
                    uid: userId,
                    email: googleUser?.email || ''
                };
                // Usa setDoc para criar o documento
                saveProfileData(userProfile, false); 
            }
            
            applyTheme(userProfile.theme || 'taylorSwift', false);
            
            // Garante que o loader existe antes de o esconder
            const loader = document.getElementById('page-loader');
            if (loader) {
                loader.classList.add('hidden');
            }
            router(); // Roda o router pela primeira vez
        } catch (error) {
             console.error("Erro dentro do 'onSnapshot' (provavelmente de renderização):", error);
             document.getElementById('page-loader').innerHTML = `<p class="text-red-500">Erro ao processar dados do perfil: ${error.message}</p>`;
        }
    }, (error) => {
        console.error("Erro ao ouvir perfil (Erro de Firestore):", error);
        // ATUALIZAÇÃO: Mensagem de erro mais clara
        const loader = document.getElementById('page-loader');
        if(loader) {
            loader.innerHTML = `<div class="p-4 text-red-700 bg-red-100 rounded-lg">
                <h3 class="font-bold">Erro de Banco de Dados</h3>
                <p>Não foi possível carregar seu perfil. Verifique suas regras de segurança do Firestore.</p>
                <p class="text-sm mt-2">Erro: ${error.message}</p>
            </div>`;
        }
    });
}

// Função genérica para salvar dados no perfil
async function saveProfileData(dataToSave, showLoadingFeedback = true) {
    if (!userId) return;

    const profileDocRef = doc(db, "users", userId, "profile", "data");
    if (showLoadingFeedback) showLoading("Salvando...");

    try {
        // Usa setDoc com merge: true para criar ou atualizar
        await setDoc(profileDocRef, {
            ...dataToSave,
            lastUpdated: serverTimestamp()
        }, { merge: true }); 
        
        if (showLoadingFeedback) hideModal();
        console.log("Dados salvos com sucesso:", dataToSave);
    } catch (error)
    {
        console.error("Erro ao salvar dados do perfil:", error);
        if (showLoadingFeedback) hideModal();
        showModal("Erro ao Salvar", `Não foi possível salvar seu progresso: ${error.message}`);
    }
}

// --- SISTEMA DE MODAL (Gramática, Loading) ---

const modalContainer = document.getElementById('modal-container');
const modalContent = document.getElementById('modal-content');

function showModal(title, contentHtml) {
    if (!modalContent) return; // Segurança
    // ATUALIZAÇÃO: O estilo agora é controlado pelo CSS
    modalContent.innerHTML = `
        <button id="modal-close-btn">
            <i data-lucide="x" class="w-5 h-5"></i>
        </button>
        <div id="modal-body" class="mt-4">
             <h3 class="text-xl font-bold mb-4" style="color: var(--primary);">${title}</h3>
            ${contentHtml}
        </div>
    `;
    modalContainer.classList.remove('hidden');
    safeCreateIcons();

    modalContainer.addEventListener('click', hideModal);
    modalContent.addEventListener('click', (e) => e.stopPropagation());
    document.getElementById('modal-close-btn').addEventListener('click', hideModal);
    document.addEventListener('keydown', handleEscKey);
}

function hideModal() {
    if (modalContainer) modalContainer.classList.add('hidden');
    if (modalContent) modalContent.innerHTML = '';
    document.removeEventListener('keydown', handleEscKey);
}

function handleEscKey(event) {
    if (event.key === 'Escape') {
        hideModal();
    }
}

function showLoading(message = 'Carregando...') {
    if (!modalContainer || !modalContent) return; // Segurança
    // Usa o mesmo estilo de modal para consistência
    modalContent.innerHTML = `
        <div class="flex flex-col items-center justify-center p-8 text-center" style="color: var(--text);">
            <svg class="animate-spin h-8 w-8 mb-4" style="color: var(--primary);" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="text-lg font-medium">${message}</p>
        </div>
    `;
    modalContainer.classList.remove('hidden');
    
    modalContainer.removeEventListener('click', hideModal);
    document.removeEventListener('keydown', handleEscKey);
}

// --- ROUTER (Inspirado no BookTracker) ---

const pages = ['home', 'map', 'progress', 'settings', 'exercise'];

function hideAllPages() {
    pages.forEach(pageId => {
        const pageEl = document.getElementById(`page-${pageId}`);
        if (pageEl) pageEl.classList.add('hidden');
    });
}

function router() {
    if (!userId) return; 

    try {
        const currentHash = window.location.hash || '#/home';
        const [path] = currentHash.substring(2).split('/');
        
        if (path === 'menu') {
            // Lógica de menu modal (se necessário)
            return;
        }

        if (modalContainer && !modalContainer.classList.contains('hidden')) {
            hideModal();
        }

        hideAllPages();
        updateNavLinks(path || 'home'); // ATUALIZADO: Passa só o 'path'

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
    } catch (error) {
        console.error("Erro fatal no router:", error);
        document.getElementById('page-loader').innerHTML = `<p class="text-red-500">Erro ao navegar para a página: ${error.message}</p>`;
        document.getElementById('page-loader').classList.remove('hidden');
    }
}

// --- ATUALIZAÇÃO: LÓGICA DA BARRA DE NAVEGAÇÃO "LIQUID GLASS" ---

function updateNavLinks(activePath) {
    const navContainer = document.querySelector('.liquid-nav');
    if (!navContainer) return;

    let activeLinkEl = null;

    // 1. Remove a classe 'active' de todos e encontra o link ativo
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.linkId === activePath) {
            activeLinkEl = link;
            link.classList.add('active');
        }
    });

    // 2. Move a pílula líquida
    moveLiquidPill(activeLinkEl);
}

function moveLiquidPill(activeLinkEl) {
    const liquidPill = document.getElementById('nav-liquid-pill');
    const navContainer = document.querySelector('.liquid-nav');
    
    if (!liquidPill || !navContainer) return;

    if (activeLinkEl) {
        // ATUALIZAÇÃO: Damos um pequeno atraso para o navegador calcular o layout
        setTimeout(() => {
            const navRect = navContainer.getBoundingClientRect();
            const linkRect = activeLinkEl.getBoundingClientRect();
            
            // Calcula a posição da pílula relativa ao container
            const pillLeft = linkRect.left - navRect.left;
            const pillWidth = linkRect.width;

            liquidPill.style.left = `${pillLeft}px`;
            liquidPill.style.width = `${pillWidth}px`;
            liquidPill.style.opacity = '1';
        }, 0); // 0ms é suficiente para 'empurrar' para a próxima frame
    } else {
        // Esconde a pílula se nenhuma rota estiver ativa (ex: #/exercise)
        liquidPill.style.opacity = '0';
    }
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
    if (!page) return; // Segurança
    const completedCount = userProfile.completedLektions?.length || 0;
    const totalLektions = allLektions.length; // Já sabemos que não é 0
    
    const progress = totalLektions > 0 ? (completedCount / totalLektions) * 100 : 0;

    page.innerHTML = `
        ${getPageHeader('Início')}
        <div class="card p-6 mb-6">
            <h2 class="text-xl font-bold mb-4">Bem-vindo(a) de volta!</h2>
            <p class="text-secondary mb-6">Continue de onde parou. Seu progresso é salvo automaticamente na nuvem.</p>
            <button id="go-to-map-btn" class="btn-primary w-full text-lg py-3 rounded-xl font-semibold">
                Ir para o Mapa de Aulas →
            </button>
        </div>
        
        <div class="card p-6">
            <h2 class="text-xl font-bold mb-4">Seu Progresso</h2>
            <div class="mb-2 flex justify-between font-medium text-secondary">
                <span>Lições Completas</span>
                <span>${completedCount} / ${totalLektions}</span>
            </div>
            <div class="progress-bar h-2.5 rounded-full mb-4">
                <div class="progress-fill h-2.5 rounded-full" style="width: ${progress}%;"></div>
            </div>
            <div class="text-center text-2xl font-bold" style="color: var(--primary);">${Math.round(progress)}%</div>
        </div>
    `;
    
    document.getElementById('go-to-map-btn').onclick = () => window.location.hash = '#/map';
}

function renderMap() {
    const page = document.getElementById('page-map');
    if (!page) return; // Segurança
    const completed = userProfile.completedLektions || [];
    const inProgress = userProfile.inProgressLektions || {};

    page.innerHTML = `
        ${getPageHeader('Mapa de Aprendizado')}
        <div class="space-y-4">
            ${allLektions.map((lektion, index) => {
                const isCompleted = completed.includes(lektion.id);
                const isInProgress = Object.keys(inProgress).includes(String(lektion.id));
                const isLocked = index > 0 && !completed.includes(allLektions[index - 1].id);
                
                let icon = index + 1;
                if (isLocked) icon = '<i data-lucide="lock" class="w-6 h-6"></i>';
                else if (isCompleted) icon = '<i data-lucide="check" class="w-6 h-6"></i>';
                else if (isInProgress) icon = '<i data-lucide="play" class="w-6 h-6 fill-current"></i>';
                
                return `
                    <div 
                        id="lektion-${lektion.id}"
                        class="card p-5 flex items-center gap-4 lektion-card ${isLocked ? 'locked' : 'cursor-pointer transition-transform transform hover:-translate-y-1'}"
                        data-lektion-id="${lektion.id}"
                    >
                        <div class="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl" style="background-color: ${isLocked ? 'var(--border)' : (isCompleted ? '#28a745' : 'var(--primary)')}; color: white;">
                            ${icon}
                        </div>
                        <div class="flex-grow">
                            <h3 class="text-lg font-bold">${lektion.title}</h3>
                            <p class="text-sm text-secondary">${lektion.topics.join(', ')}</p>
                        </div>
                        ${!isLocked ? '<i data-lucide="chevron-right" class="w-6 h-6 text-secondary"></i>' : ''}
                    </div>
                `;
            }).join('')}
        </div>
    `;

    document.querySelectorAll('.lektion-card:not(.locked)').forEach(card => {
        card.onclick = () => {
            const lektionId = parseInt(card.dataset.lektionId);
            startLektion(lektionId);
        };
    });
    
    safeCreateIcons();
}

function renderProgress() {
    const page = document.getElementById('page-progress');
    if (!page) return; // Segurança
    const completedCount = userProfile.completedLektions?.length || 0;
    const totalLektions = allLektions.length;
    const score = userProfile.score || 0;
    
    page.innerHTML = `
        ${getPageHeader('Progresso')}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="card p-6 text-center">
                <h2 class="text-lg font-medium text-secondary mb-2">Pontos Totais</h2>
                <div class="text-5xl font-bold" style="color: var(--primary);">${score}</div>
                <i data-lucide="award" class="w-12 h-12 mx-auto mt-4 text-secondary"></i>
            </div>
            <div class="card p-6 text-center">
                <h2 class="text-lg font-medium text-secondary mb-2">Lições Completas</h2>
                <div class="text-5xl font-bold" style="color: var(--accent);">${completedCount} / ${totalLektions || 'N/A'}</div>
                <i data-lucide="check-circle" class="w-12 h-12 mx-auto mt-4 text-secondary"></i>
            </div>
            <div class="card p-6 md:col-span-2">
                <h2 class="text-xl font-bold mb-4">Lições Completadas</h2>
                ${(completedCount > 0 && allLektions.length > 0) ? `
                    <ul class="space-y-3">
                        ${userProfile.completedLektions.map(id => {
                            const lektion = allLektions.find(l => l.id === id);
                            return lektion ? `<li class="flex items-center gap-3"><i data-lucide="check" class="w-5 h-5 text-green-500"></i> ${lektion.title}</li>` : '';
                        }).join('')}
                    </ul>
                ` : `
                    <p class="text-secondary text-center py-4">Você ainda não completou nenhuma lição.</p>
                `}
            </div>
        </div>
    `;
    
    safeCreateIcons();
}

function renderSettings() {
    const page = document.getElementById('page-settings');
    if (!page) return; // Segurança
    
    const currentThemeName = userProfile.theme || 'taylorSwift';

    page.innerHTML = `
        ${getPageHeader('Configurações')}
        
        <div class="card p-6 mb-6">
            <h2 class="text-xl font-bold mb-4">Tema do Aplicativo</h2>
            <p class="text-secondary mb-6">Escolha seu tema favorito. A mudança é salva automaticamente.</p>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
                ${Object.keys(allThemes).map(themeName => {
                    const theme = allThemes[themeName];
                    const isSelected = themeName === currentThemeName;
                    return `
                        <button 
                            class="theme-option p-4 rounded-lg border-2 text-center"
                            data-theme="${themeName}"
                            style="border-color: ${isSelected ? theme.primary : 'var(--border)'}; background: ${theme.bg};"
                        >
                            <span class="font-medium" style="color: ${theme.text};">${theme.name}</span>
                        </button>
                    `;
                }).join('')}
            </div>
        </div>

        <div class="card p-6">
            <h2 class="text-xl font-bold mb-4">Conta</h2>
            <p class="text-secondary mb-4">Você está logado como ${userProfile.name} (${userProfile.email || 'sem e-mail'}).</p>
            <button id="logout-btn" class="btn-secondary w-full py-3 rounded-xl font-semibold" style="border-color: #ef4444; color: #ef4444;">
                Sair (Logout)
            </button>
        </div>
    `;

    document.querySelectorAll('.theme-option').forEach(btn => {
        btn.onclick = () => {
            const themeName = btn.dataset.theme;
            applyTheme(themeName, true);
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

// --- LÓGICA DE LIÇÃO E EXERCÍCIOS ---

/**
 * Converte o texto simples (quase-markdown) das explicações em HTML.
 */
function parseSimpleMarkdown(text = '') {
    if (!text) return '';
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Negrito
        .replace(/• (.*?)(\n|$)/g, '<ul><li>$1</li></ul>') // Listas
        .replace(/<\/ul><ul>/g, '') // Junta listas
        .replace(/\n/g, '<br>'); // Quebra de linha
}

/**
 * Inicia uma lição.
 */
async function startLektion(lektionId) {
    const lektion = allLektions.find(l => l.id === lektionId);
    if (!lektion) {
        console.error("Lição não encontrada:", lektionId);
        return;
    }

    currentLektion = lektion;
    
    // ATUALIZAÇÃO: Verifica se há progresso salvo
    // Temos que ler UMA VEZ do banco de dados, pois o userProfile pode estar
    // um pouco desatualizado se o usuário fechou o app rápido.
    try {
        const profileDocRef = doc(db, "users", userId, "profile", "data");
        const docSnap = await getDoc(profileDocRef);
        const profileData = docSnap.data() || {};
        userProfile.inProgressLektions = profileData.inProgressLektions || {};
        
        const savedProgress = userProfile.inProgressLektions?.[lektionId];
        if (savedProgress && savedProgress < lektion.exercises.length) {
            currentExerciseIndex = savedProgress;
            console.log(`Continuando lição ${lektionId} do exercício ${savedProgress}`);
        } else {
            currentExerciseIndex = 0;
        }
        
        userAnswer = '';
        feedback = null;
        window.location.hash = '#/exercise';

    } catch (error) {
        console.error("Erro ao ler progresso salvo:", error);
        currentExerciseIndex = 0; // Começa do zero se houver erro
        userAnswer = '';
        feedback = null;
        window.location.hash = '#/exercise';
    }
}

/**
 * Renderiza a PÁGINA de exercício
 */
function renderExercisePage() {
    const page = document.getElementById('page-exercise');
    if (!page) return; // Segurança

    if (!currentLektion) {
        page.innerHTML = `
            <div class="card p-6 text-center">
                <h2 class="text-2xl font-bold mb-4 text-red-500">Erro</h2>
                <p class="text-secondary mb-6">Nenhuma lição está selecionada.</p>
                <button id="back-to-map" class="btn-primary py-3 px-6 rounded-xl">Voltar ao Mapa</button>
            </div>
        `;
        document.getElementById('back-to-map').onclick = () => window.location.hash = '#/map';
        return;
    }
    
    page.innerHTML = `
        <div class="flex items-center justify-between gap-4 mb-6">
            <button id="back-to-map-btn" class="btn-secondary !border-0 !bg-gray-700/50 hover:!bg-gray-600/50" style="padding: 0.75rem;">
                <i data-lucide="x" class="w-6 h-6"></i>
            </button>
            <div class="flex-grow text-right">
                <h1 class="text-2xl font-bold" style="color: var(--primary);">${currentLektion.title}</h1>
                <p class="text-secondary">Exercício ${currentExerciseIndex + 1} de ${currentLektion.exercises.length}</p>
            </div>
        </div>
        <div id="exercise-container-page"></div>
    `;
    
    document.getElementById('back-to-map-btn').onclick = () => {
        // Simplesmente volta ao mapa. O progresso já está salvo.
        currentLektion = null; // Limpa a lição atual
        window.location.hash = '#/map';
    };
    
    safeCreateIcons();
    renderCurrentExerciseOnPage();
}

/**
 * Renderiza o exercício ATUAL dentro da página
 */
function renderCurrentExerciseOnPage() {
    const container = document.getElementById('exercise-container-page');
    if (!container || !currentLektion) return;

    const exercise = currentLektion.exercises[currentExerciseIndex];
    if (!exercise) {
        console.error("Erro: Exercício não encontrado no índice", currentExerciseIndex, currentLektion);
        container.innerHTML = `<p class="text-red-500">Erro: Exercício não encontrado.</p>`;
        return;
    }
    
    const progress = ((currentExerciseIndex + 1) / currentLektion.exercises.length) * 100;

    let inputHtml = '';
    if (exercise.type === 'fillBlank' || exercise.type === 'translation') {
        inputHtml = `
            <input 
                type="text"
                id="exercise-input"
                class="input-field w-full text-lg p-4 rounded-xl"
                placeholder="Digite sua resposta..."
                value="${userAnswer}"
                ${feedback ? 'disabled' : ''}
                autocomplete="off"
            >
        `;
    } else if (exercise.type === 'multipleChoice') {
        inputHtml = `
            <div class="flex flex-col gap-3">
                ${exercise.options.map(option => `
                    <button 
                        class="btn-secondary text-left p-4 text-base w-full rounded-xl"
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
        <div class="card p-4 mb-6">
            <div class="progress-bar h-2.5 rounded-full" style="margin: 0;">
                <div class="progress-fill h-2.5 rounded-full" style="width: ${progress}%;"></div>
            </div>
        </div>

        <div class="card p-6">
            <h3 class="text-xl font-medium mb-6">${exercise.question.replace(/___/g, '<span class="font-bold text-gray-400">___</span>')}</h3>
            
            <div class="mb-4">${inputHtml}</div>
            
            <div id="feedback-container">
                ${feedback ? `
                    <div class="feedback ${feedback.isCorrect ? 'correct' : 'incorrect'}">
                        <i data-lucide="${feedback.isCorrect ? 'check-circle' : 'x-circle'}" class="w-8 h-8 flex-shrink-0"></i>
                        <div>
                            <strong class="block mb-1">${feedback.isCorrect ? 'Correto!' : 'Incorreto'}</strong>
                            <span class="text-secondary">${feedback.explanation}</span>
                        </div>
                    </div>
                ` : ''}
            </div>
            
            <div class="flex gap-4 mt-8 pt-6 border-t" style="border-color: var(--border);">
                <button id="grammar-btn" class="btn-secondary !px-4 !py-3 rounded-xl">
                    <i data-lucide="book-open" class="w-5 h-5"></i>
                </button>
                <button id="action-btn" class="btn-primary flex-grow !py-3 rounded-xl font-semibold" ${(!userAnswer && !feedback) ? 'disabled' : ''}>
                    ${feedback ? 'Próximo →' : 'Verificar'}
                </button>
            </div>
        </div>
    `;

    // Listeners
    if (exercise.type === 'fillBlank' || exercise.type === 'translation') {
        const input = document.getElementById('exercise-input');
        if (input) { // Adiciona verificação
            const actionBtn = document.getElementById('action-btn');
            input.oninput = (e) => {
                userAnswer = e.target.value;
                if (!feedback && actionBtn) actionBtn.disabled = !userAnswer;
            };
            input.onkeydown = (e) => {
                if (e.key === 'Enter' && !feedback && userAnswer && actionBtn) actionBtn.click();
            };
            if (!feedback) input.focus();
        }
    } else if (exercise.type === 'multipleChoice') {
        document.querySelectorAll('.btn-secondary[data-option]').forEach(btn => {
            btn.onclick = () => {
                if (feedback) return;
                userAnswer = btn.dataset.option;
                renderCurrentExerciseOnPage(); // Re-renderiza para mostrar a seleção
            };
        });
    }
    
    const grammarBtn = document.getElementById('grammar-btn');
    if (grammarBtn) grammarBtn.onclick = showGrammarModal;
    
    const actionBtn = document.getElementById('action-btn');
    if (actionBtn) actionBtn.onclick = feedback ? nextExercise : checkAnswer;
    
    safeCreateIcons();
}

/**
 * Abre o modal de gramática
 */
function showGrammarModal() {
    if (!currentLektion || !currentLektion.grammarKeys) { // Segurança
         showModal("Erro", "Nenhuma gramática associada a esta lição.");
        return;
    }

    if (!allGrammar || Object.keys(allGrammar).length === 0) {
        showModal("Erro de Carregamento", "Não foi possível carregar os dados de gramática (<code>grammarExplanations.js</code>).");
        return;
    }

    const grammarHtml = currentLektion.grammarKeys.map(key => {
        const explanation = allGrammar[key];
        return explanation ? `
            <div class="mb-6"> <!-- Corrigido de classmb-6 -->
                <h3 class="text-xl font-bold mb-3" style="color: var(--primary);">${explanation.title}</h3>
                <div class="text-gray-700 whitespace-pre-line leading-relaxed break-words">
                    ${parseSimpleMarkdown(explanation.content)}
                </div>
            </div>
        ` : `<p class="text-red-500">Erro: Tópico de gramática "${key}" não encontrado.</p>`;
    }).join('<hr class="my-6">');
    
    // ATUALIZAÇÃO: O título agora é fixo no CSS, passamos só o conteúdo
    showModal("Explicações Gramaticais 📚", grammarHtml);
}

/**
 * Verifica a resposta
 */
function checkAnswer() {
    if (!userAnswer || !currentLektion) return; // Segurança
    
    const exercise = currentLektion.exercises[currentExerciseIndex];
    if (!exercise) return; // Segurança

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
        // Adiciona pontos
        const newScore = (userProfile.score || 0) + 10;
        userProfile.score = newScore;
        
        // ATUALIZAÇÃO: Salva o progresso parcial da lição
        const nextIndex = currentExerciseIndex + 1;
        const currentLektionId = currentLektion.id;
        
        if (!userProfile.inProgressLektions) {
            userProfile.inProgressLektions = {};
        }
        userProfile.inProgressLektions[currentLektionId] = nextIndex;

        saveProfileData({ 
            score: newScore,
            inProgressLektions: userProfile.inProgressLektions
        }, false);
    }
    
    renderCurrentExerciseOnPage();
}

/**
 * Avança para o próximo exercício
 */
async function nextExercise() {
    if (!currentLektion) return; // Segurança
    if (currentExerciseIndex < currentLektion.exercises.length - 1) {
        currentExerciseIndex++;
        userAnswer = '';
        feedback = null;
        renderCurrentExerciseOnPage();
    } else {
        await finishLektion();
    }
}

/**
 * Finaliza a lição
 */
async function finishLektion() {
    if (!currentLektion) return; // Segurança
    showLoading("Salvando progresso...");
    
    const completed = userProfile.completedLektions || [];
    if (!completed.includes(currentLektion.id)) {
        completed.push(currentLektion.id);
        userProfile.completedLektions = completed;
    }
    
    // ATUALIZAÇÃO: Remove o progresso "em andamento"
    if (userProfile.inProgressLektions) {
        delete userProfile.inProgressLektions[currentLektion.id];
    }

    await saveProfileData({ 
        completedLektions: userProfile.completedLektions,
        inProgressLektions: userProfile.inProgressLektions
    }, false);
    
    hideModal();
    currentLektion = null;
    window.location.hash = '#/map';
}

// --- INICIALIZAÇÃO DO APP ---
initFirebase();

