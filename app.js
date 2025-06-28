import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getFirestore, doc, getDoc, addDoc, setDoc, updateDoc, deleteDoc, onSnapshot, collection, query, getDocs, writeBatch } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-storage.js";

// --- CONFIGURAÇÃO E INICIALIZAÇÃO ---
const firebaseConfig = {
    apiKey: "AIzaSyAY2sjNC_-RQa3SjO8ASC_44Q10mdR0n24",
    authDomain: "booktracker-afdfa.firebaseapp.com",
    projectId: "booktracker-afdfa",
    storageBucket: "booktracker-afdfa.firebasestorage.app",
    messagingSenderId: "626116591231",
    appId: "1:626116591231:web:52953d422d580a8da3094a",
    measurementId: "G-HV1JL3129W"
};

const GOOGLE_BOOKS_API_KEY = "AIzaSyAVtbiQ6V2O0GhRk8aStfkSENRYy9xsa5U";


let app, db, auth, storage;
let userId = null;
let booksUnsubscribe = () => { };
let profileUnsubscribe = () => { };
let allBooks = [];
let userProfile = {};
let currentFilter = 'todos';
let currentPage = 1;
let itemsPerPage = 10;
let apiSearchResults = [];
let currentApiResultIndex = 0;
let shelfSearchTerm = '';

// Array de sentimentos para a nova funcionalidade
const sentimentos = [
    'curiosidade', 'inspiração', 'reflexão', 'relaxamento', 'comoção', 'surpresa', 'paixão', 'diversão', 'alegria', 'surto', 'ansiedade', 'aflição', 'distração', 'confusão', 'raiva', 'medo', 'vulnerabilidade', 'vergonha', 'frustração', 'tristeza', 'cansaço', 'tédio', 'conexão', 'foco', 'intensidade', 'excitação', 'choque', 'horror', 'nojo', 'indiferença'
];


// --- SISTEMA DE TEMAS ---
const themes = {
    'dark': { name: 'Padrão Escuro', values: { primary: '190 80% 60%', onPrimary: '210 30% 10%', primaryContainer: '190 70% 30%', onPrimaryContainer: '190 80% 90%', surface: '220 15% 12%', onSurface: '220 10% 90%', surfaceContainerHigh: '220 15% 18%', onSurfaceVariant: '220 10% 70%', outline: '220 10% 40%' } },
    'sunset': { name: 'Sunset', values: { primary: '15 90% 60%', onPrimary: '15 90% 10%', primaryContainer: '15 80% 85%', onPrimaryContainer: '15 90% 20%', surface: '30 30% 15%', onSurface: '30 20% 95%', surfaceContainerHigh: '30 25% 20%', onSurfaceVariant: '30 15% 70%', outline: '30 10% 45%' } },
    'forest': { name: 'Forest', values: { primary: '140 60% 50%', onPrimary: '140 60% 95%', primaryContainer: '140 40% 25%', onPrimaryContainer: '140 50% 85%', surface: '120 10% 10%', onSurface: '120 15% 90%', surfaceContainerHigh: '120 10% 15%', onSurfaceVariant: '120 10% 60%', outline: '120 5% 35%' } },
    'nonbinary_pride': { name: 'Non-Binary Pride', values: { primary: '55 100% 60%', onPrimary: '55 100% 5%', primaryContainer: '270 50% 30%', onPrimaryContainer: '270 50% 90%', surface: '0 0% 10%', onSurface: '0 0% 95%', surfaceContainerHigh: '0 0% 15%', onSurfaceVariant: '0 0% 70%', outline: '0 0% 45%' } },
    'taylor_swift': { name: 'Taylor Swift (Debut)', values: { primary: '150 70% 60%', onPrimary: '150 100% 5%', primaryContainer: '150 50% 20%', onPrimaryContainer: '150 70% 90%', surface: '150 10% 10%', onSurface: '150 15% 90%', surfaceContainerHigh: '150 10% 15%', onSurfaceVariant: '150 10% 70%', outline: '150 5% 40%' } },
    'fearless': { name: 'Fearless', values: { primary: '50 90% 65%', onPrimary: '50 100% 10%', primaryContainer: '50 60% 30%', onPrimaryContainer: '50 90% 90%', surface: '45 30% 15%', onSurface: '45 25% 95%', surfaceContainerHigh: '45 30% 20%', onSurfaceVariant: '45 20% 75%', outline: '45 15% 50%' } },
    'speak_now': { name: 'Speak Now', values: { primary: '280 80% 75%', onPrimary: '280 100% 10%', primaryContainer: '280 50% 35%', onPrimaryContainer: '280 80% 95%', surface: '280 20% 15%', onSurface: '280 20% 90%', surfaceContainerHigh: '280 20% 20%', onSurfaceVariant: '280 15% 70%', outline: '280 10% 45%' } },
    'red': { name: 'Red', values: { primary: '0 85% 60%', onPrimary: '0 100% 95%', primaryContainer: '0 60% 30%', onPrimaryContainer: '0 85% 95%', surface: '0 20% 10%', onSurface: '0 15% 90%', surfaceContainerHigh: '0 20% 18%', onSurfaceVariant: '0 10% 65%', outline: '0 5% 40%' } },
    '1989': { name: '1989', values: { primary: '200 80% 70%', onPrimary: '200 100% 10%', primaryContainer: '200 50% 30%', onPrimaryContainer: '200 80% 90%', surface: '35 25% 15%', onSurface: '35 25% 95%', surfaceContainerHigh: '35 25% 20%', onSurfaceVariant: '35 15% 70%', outline: '35 10% 45%' } },
    'reputation': { name: 'Reputation', values: { primary: '220 5% 80%', onPrimary: '0 0% 0%', primaryContainer: '220 5% 25%', onPrimaryContainer: '220 10% 90%', surface: '0 0% 8%', onSurface: '0 0% 90%', surfaceContainerHigh: '0 0% 12%', onSurfaceVariant: '0 0% 60%', outline: '0 0% 35%' } },
    'lover': { name: 'Lover', values: { primary: '320 90% 80%', onPrimary: '320 100% 15%', primaryContainer: '320 60% 35%', onPrimaryContainer: '320 90% 95%', surface: '240 20% 12%', onSurface: '240 20% 92%', surfaceContainerHigh: '240 20% 18%', onSurfaceVariant: '240 15% 70%', outline: '240 10% 45%' } },
    'folklore': { name: 'Folklore', values: { primary: '220 10% 75%', onPrimary: '220 10% 10%', primaryContainer: '220 10% 25%', onPrimaryContainer: '220 15% 90%', surface: '30 5% 10%', onSurface: '30 5% 85%', surfaceContainerHigh: '30 5% 15%', onSurfaceVariant: '30 5% 65%', outline: '30 5% 40%' } },
    'evermore': { name: 'Evermore', values: { primary: '35 40% 65%', onPrimary: '35 40% 10%', primaryContainer: '35 30% 25%', onPrimaryContainer: '35 40% 90%', surface: '30 15% 12%', onSurface: '30 15% 90%', surfaceContainerHigh: '30 15% 18%', onSurfaceVariant: '30 10% 70%', outline: '30 10% 45%' } },
    'midnights': { name: 'Midnights', values: { primary: '230 60% 70%', onPrimary: '230 100% 95%', primaryContainer: '230 50% 25%', onPrimaryContainer: '230 60% 90%', surface: '230 25% 10%', onSurface: '230 20% 92%', surfaceContainerHigh: '230 25% 15%', onSurfaceVariant: '230 15% 70%', outline: '230 10% 40%' } },
    'ttpd': { name: 'The Tortured Poets Department', values: { primary: '30 20% 80%', onPrimary: '30 20% 10%', primaryContainer: '30 15% 25%', onPrimaryContainer: '30 20% 90%', surface: '30 5% 8%', onSurface: '30 5% 90%', surfaceContainerHigh: '30 5% 12%', onSurfaceVariant: '30 5% 65%', outline: '30 5% 35%' } }
};
const themeOrder = ['dark', 'sunset', 'forest', 'nonbinary_pride', 'taylor_swift', 'fearless', 'speak_now', 'red', '1989', 'reputation', 'lover', 'folklore', 'evermore', 'midnights', 'ttpd'];

function applyTheme(themeName, saveToDb = true) {
    const theme = themes[themeName];
    if (!theme) return;

    for (const [key, value] of Object.entries(theme.values)) {
        const prop = `--md-sys-color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
        document.documentElement.style.setProperty(prop, value);
    }

    localStorage.setItem('bookTrackerTheme', themeName);

    if (saveToDb && userId) {
        saveProfile({ theme: themeName }, false); // Salva o tema no perfil do usuário silenciosamente
    }
}

function initTheme() {
    const savedTheme = localStorage.getItem('bookTrackerTheme');
    // Aplica o tema do localStorage inicialmente para uma pintura rápida.
    // O tema do Firebase será aplicado depois, se existir, através do listenToProfile.
    if (savedTheme && themes[savedTheme]) {
        applyTheme(savedTheme, false);
    } else {
        applyTheme('dark', false);
    }
}

// --- Funções do Modal ---
function showModal(title, content, actions = []) {
    const modalContainer = document.getElementById('modal-container');
    const modalContent = document.getElementById('modal-content');

    let actionsHtml = actions.map(action => `<button id="${action.id}" class="btn-expressive ${action.class}">${action.text}</button>`).join('');
    const closeButtonHtml = `<button id="modal-close-x" class="absolute top-4 right-4 text-neutral-500 hover:text-white text-3xl leading-none">&times;</button>`;

    modalContent.innerHTML = `<div class="relative p-8 max-w-md w-full card-expressive">${closeButtonHtml}<h2 class="text-2xl font-bold mb-4">${title}</h2><div class="text-neutral-300 mb-6">${content}</div><div class="flex gap-4 justify-end">${actionsHtml}</div></div>`;
    modalContainer.classList.remove('hidden');

    modalContent.firstChild.onclick = (e) => e.stopPropagation();
    modalContainer.onclick = hideModal;
    document.getElementById('modal-close-x').onclick = hideModal;

    actions.forEach(action => {
        const btn = document.getElementById(action.id);
        if (btn) btn.onclick = () => {
            action.onClick();
            if (!action.keepOpen) hideModal();
        };
    });

    document.addEventListener('keydown', handleEscKey);
}

function hideModal() {
    const modalContainer = document.getElementById('modal-container');
    modalContainer.classList.add('hidden');
    document.getElementById('modal-content').innerHTML = '';

    // Reseta o hash se um modal de livro ou formulário foi fechado
    const currentHash = window.location.hash;
    if (currentHash.includes('#/book/') || currentHash.includes('#/add') || currentHash.includes('#/edit/')) {
        window.location.hash = '#/estante';
    }

    window.scrollTo(0, 0); // Rola a página principal para o topo
    document.removeEventListener('keydown', handleEscKey);
}

function handleEscKey(event) {
    if (event.key === 'Escape') {
        hideModal();
    }
}

function showLoading(message = 'Aguarde...') {
    const modalContainer = document.getElementById('modal-container');
    const modalContent = document.getElementById('modal-content');
    modalContent.innerHTML = `<div class="flex flex-col items-center justify-center p-4 card-expressive"><p class="text-lg font-semibold mb-4">${message}</p><div class="w-full bg-neutral-700 rounded-full h-2.5"><div class="bg-[hsl(var(--md-sys-color-primary))] h-2.5 rounded-full animate-pulse"></div></div></div>`;
    modalContainer.classList.remove('hidden');
}


// --- LÓGICA DO FIREBASE E DO APLICATIVO ---

function initializeAppLogic() {
    document.getElementById('page-loader').classList.add('hidden');
    listenToBooks();
    listenToProfile();
    setupInteractiveNav();
    router();
    window.addEventListener('hashchange', router);
}

function initFirebase() {
    try {
        app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        auth = getAuth(app);
        storage = getStorage(app);
        initTheme();

        onAuthStateChanged(auth, (user) => {
            if (user) {
                userId = user.uid;
                localStorage.setItem('bookTrackerUserId', userId);
                initializeAppLogic();
            } else {
                localStorage.removeItem('bookTrackerUserId');
                window.location.href = 'index.html';
            }
        });

    } catch (error) {
        console.error("Erro ao inicializar Firebase:", error);
        alert("Erro Crítico: Falha ao inicializar os serviços. O aplicativo não pode funcionar corretamente.");
    }
}

function setupInteractiveNav() {
    const nav = document.getElementById('desktop-nav');
    const main = document.getElementById('main-content');
    if (!nav || !main) return;

    const navExpandedWidth = '12rem';
    const navCollapsedWidth = '5rem';

    nav.addEventListener('mouseenter', () => {
        if (window.innerWidth >= 768) {
            nav.classList.add('expanded');
            nav.style.width = navExpandedWidth;
            main.style.marginLeft = navExpandedWidth;
        }
    });

    nav.addEventListener('mouseleave', () => {
        if (window.innerWidth >= 768) {
            nav.classList.remove('expanded');
            nav.style.width = navCollapsedWidth;
            main.style.marginLeft = navCollapsedWidth;
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth < 768) {
            nav.style.width = '';
            main.style.marginLeft = '';
        } else {
            if (nav.classList.contains('expanded')) {
                nav.style.width = navExpandedWidth;
                main.style.marginLeft = navExpandedWidth;
            } else {
                nav.style.width = navCollapsedWidth;
                main.style.marginLeft = navCollapsedWidth;
            }
        }
    });

    if (window.innerWidth >= 768) {
        main.style.marginLeft = navCollapsedWidth;
    }
}


function listenToBooks() {
    if (typeof booksUnsubscribe === 'function') booksUnsubscribe();
    if (!userId) return;

    const booksCollection = collection(db, "users", userId, "books");
    booksUnsubscribe = onSnapshot(booksCollection, (snapshot) => {
        allBooks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), addedAt: doc.data().addedAt?.toDate() || new Date(0) })).sort((a, b) => b.addedAt - a.addedAt);
        router();
    }, (error) => {
        console.error("Erro ao ouvir livros:", error);
        showModal("Erro de Sincronização", `Houve um problema ao sincronizar seus livros. Erro: ${error.code}`);
    });
}

function listenToProfile() {
    if (typeof profileUnsubscribe === 'function') profileUnsubscribe();
    if (!userId) return;

    const profileDocRef = doc(db, "users", userId, "profile", "data");
    profileUnsubscribe = onSnapshot(profileDocRef, (doc) => {
        userProfile = doc.exists() ? doc.data() : {};
        const currentUser = auth.currentUser;
        if (currentUser) {
            if (!userProfile.name && currentUser.displayName) {
                userProfile.name = currentUser.displayName;
            }
            if (!userProfile.avatarUrl && currentUser.photoURL) {
                userProfile.avatarUrl = currentUser.photoURL;
            }
        }

        // Aplica o tema do perfil do Firebase, se existir
        if (userProfile.theme) {
            applyTheme(userProfile.theme, false); // false para não salvar de volta no DB
        }

        router(); // Re-renderiza a página ativa para refletir quaisquer mudanças
    }, (error) => {
        console.error("Erro ao ouvir perfil:", error);
    });
}

async function saveData(collectionName, data, docId = null) {
    if (!userId) {
        showModal("Erro", "Utilizador não autenticado. Não é possível salvar.");
        return null;
    }

    const basePath = collection(db, "users", userId, collectionName);

    try {
        if (docId) {
            const docRef = doc(basePath, docId);
            await updateDoc(docRef, data);
            return docId;
        } else {
            const newDocRef = await addDoc(basePath, data);
            return newDocRef.id;
        }
    } catch (error) {
        console.error(`Erro ao salvar em ${collectionName}:`, error);
        showModal("Erro ao Salvar", `Não foi possível salvar os dados. Erro: ${error.message}`);
        return null;
    }
}

async function saveBook(bookData) {
    const collectionName = 'books';
    const docId = bookData.id || null;

    let dataToSave = { ...bookData };
    delete dataToSave.id;

    if (!docId) {
        dataToSave.addedAt = new Date();
    }

    return await saveData(collectionName, dataToSave, docId);
}

async function saveProfile(profileData, showModals = true) {
    if (!userId) return; // Não mostra modal se o usuário não estiver logado

    const profileDocRef = doc(db, "users", userId, "profile", "data");
    if (showModals) showLoading("Salvando perfil...");

    try {
        await setDoc(profileDocRef, profileData, { merge: true });
        if (showModals) {
            hideModal();
            showModal("Sucesso!", "Seu perfil foi atualizado.", []);
        }
    } catch (error) {
        if (showModals) hideModal();
        showModal("Erro", `Não foi possível salvar seu perfil: ${error.message}`);
        console.error("Erro ao salvar perfil:", error);
    }
}

async function deleteAllBooks() {
    if (!userId) return;

    showLoading("A apagar todos os livros...");
    try {
        const batch = writeBatch(db);
        const booksCollectionRef = collection(db, "users", userId, "books");
        const querySnapshot = await getDocs(booksCollectionRef);
        console.log(`Encontrados ${querySnapshot.size} livros para apagar.`);
        querySnapshot.forEach((doc) => {
            batch.delete(doc.ref);
        });
        await batch.commit();
        console.log("Todos os livros foram apagados com sucesso.");
        hideModal();
        showModal("Sucesso", "Todos os seus livros foram apagados.");
    } catch (error) {
        hideModal();
        showModal("Erro", `Não foi possível apagar os livros: ${error.message}`);
        console.error("Erro ao apagar todos os livros:", error);
    }
}

async function deleteBook(bookId) {
    if (!userId) return;
    try {
        const docRef = doc(db, "users", userId, "books", bookId);
        await deleteDoc(docRef);
        console.log("Livro deletado:", bookId);
        hideModal(); // Fecha o modal de detalhes após deletar
    } catch (error) {
        console.error("Erro ao deletar livro: ", error);
        showModal("Erro", "Não foi possível deletar o livro.");
    }
}

// --- Funções do Router e Renderização ---
const pages = ['estatisticas', 'estante', 'profile', 'settings']; // A página 'form' foi removida
function hideAllPages() {
    pages.forEach(pageId => {
        const pageEl = document.getElementById(`page-${pageId}`);
        if (pageEl) pageEl.classList.add('hidden');
    });
    const loader = document.getElementById('page-loader');
    if (loader) loader.classList.add('hidden');
}

function router() {
    if (!userId) {
        const loader = document.getElementById('page-loader');
        if (loader) loader.classList.remove('hidden');
        return;
    };

    const currentHash = window.location.hash || '#/estante';
    const [path, param] = currentHash.substring(2).split('/');

    // Funções que abrem modais
    const modalRoutes = {
        'book': renderDetailsInModal,
        'add': renderFormInModal,
        'edit': renderFormInModal,
    };

    if (modalRoutes[path]) {
        hideAllPages();
        const pageEstante = document.getElementById('page-estante');
        if (pageEstante.innerHTML === '') renderEstante();
        pageEstante.classList.remove('hidden');
        modalRoutes[path](param); // param será o bookId para 'book' e 'edit'
        return;
    }

    if (!document.getElementById('modal-container').classList.contains('hidden')) {
        hideModal();
    }

    hideAllPages();
    updateNavLinks(currentHash);

    const pageId = path === 'inicio' ? 'estante' : path;
    const fab = document.getElementById('fab-add-book');
    fab.classList.toggle('hidden', path !== 'estante' && path !== 'estatisticas' && path !== 'inicio');

    const targetPage = document.getElementById(`page-${pageId}`);
    if (targetPage) {
        targetPage.classList.remove('hidden');
        switch (pageId) {
            case 'estatisticas': renderEstatisticas(); break;
            case 'estante': renderEstante(); break;
            case 'profile': renderProfile(); break;
            case 'settings': renderSettings(); break;
            default:
                document.getElementById('page-estante').classList.remove('hidden');
                renderEstante();
        }
    } else {
        document.getElementById('page-estante').classList.remove('hidden');
        renderEstante();
    }
}

function updateNavLinks(activeHash) {
    document.querySelectorAll('.nav-link').forEach(link => {
        let linkBaseHash = new URL(link.href).hash.split('/')[1] || 'estante';
        if (linkBaseHash === 'inicio') linkBaseHash = 'estante';
        let activeBaseHash = activeHash.split('/')[1] || 'estante';
        if (activeBaseHash === 'inicio') activeBaseHash = 'estante';

        if (linkBaseHash === activeBaseHash) {
            link.classList.add('text-white', 'bg-neutral-700/50');
            link.classList.remove('text-neutral-400');
        } else {
            link.classList.add('text-neutral-400');
            link.classList.remove('text-white', 'bg-neutral-700/50');
        }
    });
}

function renderEstante() {
    const page = document.getElementById('page-estante');
    const displayName = userProfile.name || 'Leitor(a)';
    const avatarUrl = userProfile.avatarUrl || 'https://placehold.co/200x200/171717/FFFFFF?text=A';

    const statusMap = { todos: 'Todos', lendo: 'Lendo Agora', lido: 'Lidos', abandonado: 'Abandonados', 'quero-ler': 'Quero Ler', favorito: 'Favoritos', comCapa: 'Com Capa', semCapa: 'Sem Capa' };
    const counts = {
        todos: allBooks.length,
        lendo: allBooks.filter(b => b.status === 'lendo').length,
        lido: allBooks.filter(b => b.status === 'lido').length,
        'quero-ler': allBooks.filter(b => b.status === 'quero-ler').length,
        abandonado: allBooks.filter(b => b.status === 'abandonado').length,
        favorito: allBooks.filter(b => b.favorite).length,
        comCapa: allBooks.filter(b => b.coverUrl).length,
        semCapa: allBooks.filter(b => !b.coverUrl).length
    };

    page.innerHTML = `
        <div class="max-w-4xl mx-auto space-y-8">
             <div class="flex items-center gap-4">
                <img src="${avatarUrl}" alt="Avatar do utilizador" class="w-16 h-16 rounded-full object-cover shadow-lg">
                <div>
                    <p class="text-neutral-400 text-lg">Boas vindas de volta,</p>
                    <h1 class="font-display text-3xl">${displayName}</h1>
                </div>
            </div>
            
            <div>
                 <h1 class="font-display text-5xl md:text-6xl">Minha estante</h1>
                 <p class="text-neutral-400 mt-2">Tudo o que você leu, vai ler, quer ler. Ou abandonou. Sem julgamentos.</p>
            </div>

            <div class="segmented-btn-container flex-wrap flex gap-2">
                ${Object.keys(statusMap).map(key => `
                    <button data-filter="${key}" class="filter-btn btn-expressive py-2 px-4 h-auto text-sm ${currentFilter === key ? 'active' : ''}">
                        ${statusMap[key]} (${counts[key] || 0})
                    </button>
                `).join('')}
            </div>
            
            <div id="shelf-content" class="space-y-4"></div>
            <div id="pagination-controls" class="mt-8"></div>
        </div>
    `;

    renderShelfContent();

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.onclick = (e) => {
            currentFilter = e.currentTarget.dataset.filter;
            currentPage = 1;
            renderShelfContent();
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
        };
    });
}

function renderShelfContent() {
    const contentContainer = document.getElementById('shelf-content');
    if (!contentContainer) return;

    const filteredBooks = allBooks.filter(book => {
        if (currentFilter === 'todos') return true;
        if (currentFilter === 'favorito') return book.favorite;
        if (currentFilter === 'comCapa') return !!book.coverUrl;
        if (currentFilter === 'semCapa') return !book.coverUrl;
        return book.status === currentFilter;
    });

    const totalItems = filteredBooks.length;
    const totalPages = itemsPerPage > 0 ? Math.ceil(totalItems / itemsPerPage) : 1;
    if (currentPage > totalPages && totalPages > 0) {
        currentPage = totalPages;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = itemsPerPage > 0 ? startIndex + itemsPerPage : totalItems;
    const paginatedBooks = filteredBooks.slice(startIndex, endIndex);

    if (paginatedBooks.length > 0) {
        contentContainer.innerHTML = paginatedBooks.map(bookCard).join('');
    } else {
        contentContainer.innerHTML = `
            <div class="text-center py-20 card-expressive">
                <span class="material-symbols-outlined text-6xl text-neutral-500 mb-4">search_off</span>
                <h3 class="text-xl font-bold">Nenhum livro encontrado</h3>
                <p class="text-neutral-400">Tente um filtro diferente ou adicione um novo livro!</p>
            </div>
         `;
    }

    renderPaginationControls(totalPages, totalItems);

    // O evento de clique agora vai para um link de hash que o router vai interceptar
    document.querySelectorAll('.book-card-link').forEach(card => {
        card.href = card.dataset.href;
    });

}

function bookCard(book) {
    const ratingHtml = Array.from({ length: 5 }, (_, i) =>
        `<span class="material-symbols-outlined !text-xl ${i < book.rating ? 'filled text-amber-400' : 'text-neutral-600'}">star</span>`
    ).join('');

    const feelingsHtml = book.feelings && book.feelings.length > 0
        ? `<div class="flex flex-wrap gap-1 mt-2 justify-center sm:justify-start">
            ${book.feelings.slice(0, 5).map(f => `<span class="mood-tag-pill text-xs font-bold px-2 py-0.5 rounded-full capitalize">${f}</span>`).join('')}
           </div>`
        : '';

    return `
        <a data-href="#/book/${book.id}" href="#/book/${book.id}" class="book-card-link card-expressive p-4 flex flex-col sm:flex-row gap-4 no-underline hover:bg-[hsl(var(--md-sys-color-surface-container-highest))]">
            <div class="w-1/3 sm:w-1/5 flex-shrink-0 mx-auto">
                <img src="${book.coverUrl || 'https://placehold.co/400x600/171717/FFFFFF?text=Sem+Capa'}" alt="Capa de ${book.title}" class="w-full rounded-lg shadow-lg aspect-[2/3] object-cover">
            </div>
            <div class="flex flex-col flex-grow text-center sm:text-left text-current">
                <h2 class="font-display text-xl lg:text-2xl title-text-shadow font-bold leading-tight">${book.title}</h2>
                <p class="text-sm text-neutral-400 mb-2">${book.author || 'Autor desconhecido'}</p>
                <div class="flex items-center justify-center sm:justify-start gap-1 mb-2">${ratingHtml}</div>
                ${feelingsHtml}
                <div class="mt-auto pt-4 flex flex-col sm:flex-row gap-2">
                     <div class="btn-expressive btn-primary !h-10 !text-sm flex-1 flex items-center justify-center gap-2">
                        <span class="material-symbols-outlined !text-base">visibility</span>Ver Detalhes
                    </div>
                </div>
            </div>
        </a>
    `;
}

function renderPaginationControls(totalPages, totalItems) {
    const controlsContainer = document.getElementById('pagination-controls');
    if (!controlsContainer) return;

    const itemsPerPageOptions = [10, 20, 50, 100];

    controlsContainer.innerHTML = `
        <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div class="flex items-center gap-2">
                <label for="items-per-page" class="text-sm text-neutral-400">Itens por pág:</label>
                <select id="items-per-page" class="bg-neutral-800 border-2 border-neutral-700 rounded-lg p-1 text-sm">
                    ${itemsPerPageOptions.map(opt => `<option value="${opt}" ${itemsPerPage === opt ? 'selected' : ''}>${opt}</option>`).join('')}
                    <option value="999999" ${itemsPerPage >= totalItems && totalItems > 0 ? 'selected' : ''}>Todos</option>
                </select>
            </div>
            <div id="page-buttons" class="flex items-center gap-1">
            </div>
        </div>
    `;

    const pageButtonsContainer = document.getElementById('page-buttons');
    let buttonsHtml = '';

    if (totalPages > 1) {
        buttonsHtml += `<button class="pagination-btn p-2 rounded-lg" ${currentPage === 1 ? 'disabled' : ''} data-page="${currentPage - 1}">&lt;</button>`;

        let pagesToShow = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pagesToShow.push(i);
        } else {
            pagesToShow.push(1);
            if (currentPage > 3) pagesToShow.push('...');

            let start = Math.max(2, currentPage - 1);
            let end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) pagesToShow.push(i);

            if (currentPage < totalPages - 2) pagesToShow.push('...');
            pagesToShow.push(totalPages);
        }

        pagesToShow.forEach(page => {
            if (page === '...') {
                buttonsHtml += `<span class="px-2">...</span>`;
            } else {
                buttonsHtml += `<button class="pagination-btn w-10 h-10 rounded-lg ${page === currentPage ? 'active' : ''}" data-page="${page}">${page}</button>`;
            }
        });

        buttonsHtml += `<button class="pagination-btn p-2 rounded-lg" ${currentPage === totalPages ? 'disabled' : ''} data-page="${currentPage + 1}">&gt;</button>`;
    }

    pageButtonsContainer.innerHTML = buttonsHtml;

    document.getElementById('items-per-page').onchange = (e) => {
        itemsPerPage = Number(e.target.value);
        currentPage = 1;
        renderShelfContent();
    };

    document.querySelectorAll('.pagination-btn').forEach(button => {
        button.onclick = (e) => {
            currentPage = Number(e.currentTarget.dataset.page);
            renderShelfContent();
        };
    });
}

function renderEstatisticas() {
    const page = document.getElementById('page-estatisticas');
    const readBooks = allBooks.filter(b => b.status === 'lido');
    const totalPagesRead = readBooks.reduce((sum, b) => {
        const bookType = b.mediaType || 'fisico';
        if (bookType === 'fisico' || bookType === 'digital') {
            const pages = b.totalPages !== undefined ? b.totalPages : b.pages;
            return sum + (Number(pages) || 0);
        }
        return sum;
    }, 0);

    const validRatings = readBooks.filter(b => b.rating && b.rating > 0);
    const avgRating = validRatings.length > 0
        ? (validRatings.reduce((sum, b) => sum + b.rating, 0) / validRatings.length).toFixed(1)
        : 'N/A';

    page.innerHTML = `
        <div class="max-w-4xl mx-auto space-y-8">
            <h1 class="font-display text-5xl md:text-6xl">Estatísticas</h1>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="card-expressive p-6 flex flex-col justify-between">
                    <h2 class="text-lg font-bold text-neutral-400">Livros Lidos</h2>
                    <p class="font-display text-6xl text-white">${readBooks.length}</p>
                </div>
                <div class="card-expressive p-6 flex flex-col justify-between">
                    <h2 class="text-lg font-bold text-neutral-400">Páginas Lidas</h2>
                    <p class="font-display text-6xl text-white">${totalPagesRead.toLocaleString('pt-BR')}</p>
                </div>
                <div class="card-expressive p-6 flex flex-col justify-between">
                    <h2 class="text-lg font-bold text-neutral-400">Média de Estrelas</h2>
                    <p class="font-display text-6xl text-white">${avgRating}</p>
                </div>
            </div>
        </div>
    `;
}

function renderProfile() {
    const page = document.getElementById('page-profile');
    const avatarUrls = [
        'https://rodcarvalho.com/2.png',
        'https://rodcarvalho.com/1.png',
        'https://rodcarvalho.com/3.png',
        'https://rodcarvalho.com/4.png'
    ];

    const googlePhotoUrl = auth.currentUser?.photoURL;

    page.innerHTML = `
        <div class="max-w-2xl mx-auto space-y-8">
            <h1 class="font-display text-5xl md:text-6xl">Meu Perfil</h1>
            <form id="profile-form" class="space-y-8">
                 <div class="card-expressive p-6">
                    <h2 class="text-xl font-bold mb-4 text-[hsl(var(--md-sys-color-primary))]">Seu Avatar</h2>
                    <input type="hidden" id="avatarUrl" value="${userProfile.avatarUrl || ''}">
                    <div id="avatar-selector" class="flex justify-center flex-wrap gap-4">
                        ${googlePhotoUrl ? `<img src="${googlePhotoUrl}" data-url="${googlePhotoUrl}" class="avatar-option w-24 h-24 rounded-full object-cover cursor-pointer border-4 border-transparent hover:border-[hsl(var(--md-sys-color-primary))] transition-all ${userProfile.avatarUrl === googlePhotoUrl ? '!border-[hsl(var(--md-sys-color-primary))]' : ''}" title="Usar foto do Google">` : ''}
                        ${avatarUrls.map(url => `
                            <img src="${url}" 
                                 data-url="${url}"
                                 class="avatar-option w-24 h-24 rounded-full object-cover cursor-pointer border-4 border-transparent hover:border-[hsl(var(--md-sys-color-primary))] transition-all
                                 ${userProfile.avatarUrl === url ? '!border-[hsl(var(--md-sys-color-primary))]' : ''}"
                            >
                        `).join('')}
                    </div>
                     <p class="text-xs text-neutral-500 mt-4 text-center">Para alterar a sua foto de perfil, <a href="https://myaccount.google.com/" target="_blank" class="text-[hsl(var(--md-sys-color-primary))] hover:underline">atualize na sua Conta Google</a>.</p>
                </div>
            
                <div class="card-expressive p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div class="md:col-span-2">
                        <label for="profile-name" class="block text-sm font-bold mb-2 text-neutral-300">Nome</label>
                        <input type="text" id="profile-name" class="w-full bg-neutral-800 border-2 border-neutral-700 rounded-xl p-3" value="${userProfile.name || auth.currentUser?.displayName || ''}" placeholder="Seu nome de exibição">
                    </div>
                    <div>
                        <label for="profile-pronouns" class="block text-sm font-bold mb-2 text-neutral-300">Pronomes</label>
                        <input type="text" id="profile-pronouns" class="w-full bg-neutral-800 border-2 border-neutral-700 rounded-xl p-3" value="${userProfile.pronouns || ''}" placeholder="ela/dela, ele/dele">
                    </div>
                    <div>
                        <label for="profile-blog" class="block text-sm font-bold mb-2 text-neutral-300">Blog / Site</label>
                        <input type="url" id="profile-blog" class="w-full bg-neutral-800 border-2 border-neutral-700 rounded-xl p-3" value="${userProfile.blog || ''}" placeholder="https://...">
                    </div>
                    <div>
                        <label for="profile-instagram" class="block text-sm font-bold mb-2 text-neutral-300">Instagram</label>
                        <input type="text" id="profile-instagram" class="w-full bg-neutral-800 border-2 border-neutral-700 rounded-xl p-3" value="${userProfile.instagram || ''}" placeholder="@usuario">
                    </div>
                     <div>
                        <label for="profile-youtube" class="block text-sm font-bold mb-2 text-neutral-300">YouTube</label>
                        <input type="text" id="profile-youtube" class="w-full bg-neutral-800 border-2 border-neutral-700 rounded-xl p-3" value="${userProfile.youtube || ''}" placeholder="@canal">
                    </div>
                </div>
                
                 <div class="flex items-center justify-end gap-4 pt-4">
                    <button type="submit" class="btn-expressive btn-primary">
                        <span class="material-symbols-outlined mr-2">save</span> Salvar Perfil
                    </button>
                </div>
            </form>
        </div>
    `;

    document.querySelectorAll('.avatar-option').forEach(img => {
        img.onclick = () => {
            document.querySelectorAll('.avatar-option').forEach(el => el.classList.remove('!border-[hsl(var(--md-sys-color-primary))]'));
            img.classList.add('!border-[hsl(var(--md-sys-color-primary))]');
            document.getElementById('avatarUrl').value = img.dataset.url;
        }
    });

    document.getElementById('profile-form').onsubmit = (e) => {
        e.preventDefault();
        const profileData = {
            avatarUrl: document.getElementById('avatarUrl').value,
            name: document.getElementById('profile-name').value,
            pronouns: document.getElementById('profile-pronouns').value,
            blog: document.getElementById('profile-blog').value,
            instagram: document.getElementById('profile-instagram').value,
            youtube: document.getElementById('profile-youtube').value,
        };
        saveProfile(profileData);
    };
}

function renderSettings() {
    const page = document.getElementById('page-settings');
    const savedTheme = userProfile.theme || localStorage.getItem('bookTrackerTheme') || 'dark';

    page.innerHTML = `
         <div class="max-w-2xl mx-auto space-y-8">
            <h1 class="font-display text-5xl md:text-6xl">Configurações</h1>
            <div class="card-expressive p-6">
                <h2 class="text-xl font-bold mb-2 text-[hsl(var(--md-sys-color-primary))]">Aparência</h2>
                <label for="theme-selector" class="block text-sm font-bold mb-2 text-neutral-300">Tema do Aplicativo</label>
                <select id="theme-selector" class="w-full bg-neutral-800 border-2 border-neutral-700 rounded-xl p-3 focus:border-[hsl(var(--md-sys-color-primary))] focus:ring-0">
                    ${themeOrder.map(key => `<option value="${key}" ${savedTheme === key ? 'selected' : ''}>${themes[key].name}</option>`).join('')}
                </select>
            </div>
            
            <div class="card-expressive p-6">
                <h2 class="text-xl font-bold mb-2 text-[hsl(var(--md-sys-color-primary))]">Gerenciar Dados</h2>
                <div class="flex flex-col sm:flex-row gap-4">
                    <button id="import-csv-btn" class="btn-expressive btn-text flex-1">
                        <span class="material-symbols-outlined mr-2">upload</span> Importar CSV
                    </button>
                    <input type="file" id="csv-file-input" class="hidden" accept=".csv">
                    <button id="export-csv-btn" class="btn-expressive btn-text flex-1">
                       <span class="material-symbols-outlined mr-2">download</span> Exportar CSV
                    </button>
                </div>
            </div>

            <div class="card-expressive p-6">
                <h2 class="text-xl font-bold mb-2 text-[hsl(var(--md-sys-color-primary))]">Sessão</h2>
                <p class="text-neutral-300 mb-4">Você está logado. Para sair, clique no botão abaixo.</p>
                <button id="logout-btn" class="btn-expressive btn-tonal w-full">Sair da Conta</button>
            </div>

            <div class="card-expressive p-6 border-l-4 border-red-500">
                <h2 class="text-xl font-bold mb-2 text-red-400">Zona de Perigo</h2>
                 <p class="text-neutral-300 mb-4">A ação abaixo é irreversível. Tenha certeza do que está fazendo.</p>
                <button id="delete-all-books-btn" class="btn-expressive bg-red-800/80 hover:bg-red-800 text-white w-full">Deletar Todos os Livros</button>
            </div>
         </div>
    `;
    document.getElementById('theme-selector').onchange = (e) => applyTheme(e.target.value);
    document.getElementById('import-csv-btn').onclick = () => document.getElementById('csv-file-input').click();
    document.getElementById('csv-file-input').onchange = handleCsvImport;
    document.getElementById('export-csv-btn').onclick = handleCsvExport;

    document.getElementById('logout-btn').onclick = () => {
        signOut(auth).then(() => {
            localStorage.removeItem('bookTrackerUserId');
            localStorage.removeItem('bookTrackerTheme'); // Limpa também o tema local ao sair
            window.location.href = 'index.html';
        }).catch((error) => {
            console.error('Erro ao fazer logout: ', error);
        });
    };

    document.getElementById('delete-all-books-btn').onclick = () => {
        showModal(
            'Confirmar Exclusão Total',
            `Tem certeza que deseja excluir <strong>TODOS</strong> os seus livros? Esta ação não pode ser desfeita.`,
            [{
                id: 'confirm-delete-all-btn',
                text: 'Sim, Excluir Tudo',
                class: 'bg-red-600 text-white',
                onClick: () => {
                    deleteAllBooks();
                },
                keepOpen: false
            }, {
                id: 'modal-close-btn',
                text: 'Cancelar',
                class: 'btn-text',
                onClick: hideModal,
                keepOpen: true
            }]
        );
    };
}

async function renderFormInModal(bookId = null) {
    const modalContainer = document.getElementById('modal-container');
    const modalContent = document.getElementById('modal-content');
    let book = {};
    const isEditing = bookId !== null;

    if (isEditing) {
        book = allBooks.find(b => b.id === bookId) || {};
    }

    const selectedFeelings = book.feelings || [];

    const formHtml = `
        <div class="card-expressive w-full max-w-5xl max-h-[90vh] flex flex-col relative">
            <button id="modal-close-btn" class="absolute top-4 right-5 text-neutral-400 hover:text-white text-4xl leading-none z-10">&times;</button>
            <div class="p-6 md:p-8 flex-grow overflow-y-auto">
                <form id="book-form" class="space-y-6">
                    <h1 class="font-display text-3xl md:text-4xl mb-6">${isEditing ? 'Editar Livro' : 'Adicionar Novo Livro'}</h1>
                    <input type="hidden" id="bookId" value="${book.id || ''}">
                    
                    <div class="card-expressive p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="md:col-span-2">
                            <label for="title" class="block text-sm font-bold mb-2 text-neutral-300">Título</label>
                            <div class="flex items-center gap-2">
                                <input type="text" id="title" class="w-full bg-neutral-800 border-2 border-neutral-700 rounded-xl p-3 focus:border-[hsl(var(--md-sys-color-primary))] focus:ring-0" value="${book.title || ''}" required>
                                <button type="button" id="metadata-search-btn" class="btn-expressive btn-tonal h-auto py-2 px-3 shrink-0">Procurar Edição</button>
                            </div>
                        </div>
                        <div class="md:col-span-2 flex justify-center">
                             <div id="cover-preview-container" class="mt-4">
                                ${book.coverUrl ? `<img src="${book.coverUrl}" class="w-32 rounded-lg shadow-md">` : ''}
                             </div>
                        </div>
                        <div>
                            <label for="author" class="block text-sm font-bold mb-2 text-neutral-300">Autor</label>
                            <input type="text" id="author" class="w-full bg-neutral-800 border-2 border-neutral-700 rounded-xl p-3" value="${book.author || ''}" required>
                        </div>
                         <div>
                            <label for="isbn" class="block text-sm font-bold mb-2 text-neutral-300">ISBN</label>
                            <input type="text" id="isbn" class="w-full bg-neutral-800 border-2 border-neutral-700 rounded-xl p-3" value="${book.isbn || ''}">
                        </div>
                        <div class="md:col-span-2">
                            <label for="coverUrl" class="block text-sm font-bold mb-2 text-neutral-300">URL da Capa</label>
                            <input type="url" id="coverUrl" class="w-full bg-neutral-800 border-2 border-neutral-700 rounded-xl p-3" value="${book.coverUrl || ''}">
                        </div>
                    </div>

                    <div class="card-expressive p-6 space-y-4">
                        <h3 class="text-xl font-bold text-[hsl(var(--md-sys-color-primary))]">Como este livro te fez sentir?</h3>
                        <p class="text-neutral-400 text-sm">Selecione até 5 sentimentos.</p>
                        <div id="feelings-container" class="flex flex-wrap gap-2">
                            ${sentimentos.map(s => `
                                <button type="button" data-feeling="${s}" class="mood-tag-btn btn-expressive !py-1 !px-3 !h-auto !text-xs capitalize ${selectedFeelings.includes(s) ? 'selected' : ''}">
                                    ${s}
                                </button>
                            `).join('')}
                        </div>
                        <input type="hidden" id="feelingsValue" value="${selectedFeelings.join(',') || ''}">
                    </div>

                    <div class="card-expressive p-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                             <div>
                                <label for="status" class="block text-sm font-bold mb-2 text-neutral-300">Status</label>
                                <select id="status" class="w-full bg-neutral-800 border-2 border-neutral-700 rounded-xl p-3 focus:border-[hsl(var(--md-sys-color-primary))] focus:ring-0">
                                    <option value="quero-ler" ${book.status === 'quero-ler' ? 'selected' : ''}>Quero Ler</option>
                                    <option value="lendo" ${book.status === 'lendo' ? 'selected' : ''}>Lendo Agora</option>
                                    <option value="lido" ${book.status === 'lido' ? 'selected' : ''}>Lido</option>
                                    <option value="abandonado" ${book.status === 'abandonado' ? 'selected' : ''}>Abandonado</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-bold mb-2 text-neutral-300">Avaliação & Favorito</label>
                                <div class="flex items-center gap-4">
                                    <div id="rating" class="flex items-center gap-1">
                                        ${[1, 2, 3, 4, 5].map(i => `<span class="material-symbols-outlined star-icon !text-3xl cursor-pointer transition-colors ${Number(book.rating) >= i ? 'filled text-amber-400' : 'text-neutral-600'}" data-value="${i}">star</span>`).join('')}
                                    </div>
                                    <input type="hidden" id="ratingValue" value="${book.rating || 0}">
                                    <button type="button" id="favorite-btn" class="text-neutral-500 hover:text-red-500 transition-colors">
                                        <span class="material-symbols-outlined !text-3xl ${book.favorite ? 'filled text-red-500' : ''}">favorite</span>
                                    </button>
                                    <input type="hidden" id="favoriteValue" value="${book.favorite ? 'true' : 'false'}">
                                </div>
                            </div>
                            
                            <div>
                                <label for="startDate" class="block text-sm font-bold mb-2 text-neutral-300">Data de Início</label>
                                <input type="date" id="startDate" class="w-full bg-neutral-800 border-2 border-neutral-700 rounded-xl p-3" value="${book.startDate || ''}">
                            </div>
                            <div>
                                <label for="endDate" class="block text-sm font-bold mb-2 text-neutral-300">Data de Conclusão</label>
                                <input type="date" id="endDate" class="w-full bg-neutral-800 border-2 border-neutral-700 rounded-xl p-3" value="${book.endDate || ''}">
                            </div>

                            <div class="md:col-span-2 grid grid-cols-3 gap-4">
                                <label for="media-type-fisico" class="text-center cursor-pointer p-3 rounded-xl has-[:checked]:bg-[hsl(var(--md-sys-color-primary-container))] has-[:checked]:text-[hsl(var(--md-sys-color-on-primary-container))] border-2 border-transparent has-[:checked]:border-[hsl(var(--md-sys-color-primary))]">
                                    <span class="material-symbols-outlined mb-1">auto_stories</span>
                                    <span class="block text-sm font-bold">Físico</span>
                                    <input type="radio" name="mediaType" id="media-type-fisico" value="fisico" ${!book.mediaType || book.mediaType === 'fisico' ? 'checked' : ''} class="sr-only">
                                </label>
                                 <label for="media-type-digital" class="text-center cursor-pointer p-3 rounded-xl has-[:checked]:bg-[hsl(var(--md-sys-color-primary-container))] has-[:checked]:text-[hsl(var(--md-sys-color-on-primary-container))] border-2 border-transparent has-[:checked]:border-[hsl(var(--md-sys-color-primary))]">
                                     <span class="material-symbols-outlined mb-1">tablet_mac</span>
                                     <span class="block text-sm font-bold">Digital</span>
                                    <input type="radio" name="mediaType" id="media-type-digital" value="digital" ${book.mediaType === 'digital' ? 'checked' : ''} class="sr-only">
                                </label>
                                 <label for="media-type-audiobook" class="text-center cursor-pointer p-3 rounded-xl has-[:checked]:bg-[hsl(var(--md-sys-color-primary-container))] has-[:checked]:text-[hsl(var(--md-sys-color-on-primary-container))] border-2 border-transparent has-[:checked]:border-[hsl(var(--md-sys-color-primary))]">
                                     <span class="material-symbols-outlined mb-1">headphones</span>
                                     <span class="block text-sm font-bold">Audiolivro</span>
                                    <input type="radio" name="mediaType" id="media-type-audiobook" value="audiobook" ${book.mediaType === 'audiobook' ? 'checked' : ''} class="sr-only">
                                </label>
                            </div>
                            <div id="total-pages-container" class="md:col-span-1">
                                <label for="totalPages" class="block text-sm font-bold mb-2 text-neutral-300">Nº de Páginas</label>
                                <input type="number" id="totalPages" class="w-full bg-neutral-800 border-2 border-neutral-700 rounded-xl p-3" value="${book.totalPages || book.pages || ''}">
                            </div>
                            <div id="total-time-container" class="hidden md:col-span-1">
                                <label for="totalTime" class="block text-sm font-bold mb-2 text-neutral-300">Tempo Total (HH:MM:SS)</label>
                                <input type="text" id="totalTime" class="w-full bg-neutral-800 border-2 border-neutral-700 rounded-xl p-3" value="${book.totalTime || ''}" placeholder="01:30:00">
                            </div>
                        </div>
                    </div>
                    
                    <div class="card-expressive p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label for="synopsis" class="block text-sm font-bold mb-2 text-neutral-300">Sinopse</label>
                             <textarea id="synopsis" rows="6" class="w-full bg-neutral-800 border-2 border-neutral-700 rounded-xl p-3">${book.synopsis || ''}</textarea>
                        </div>
                        <div>
                            <label for="review" class="block text-sm font-bold mb-2 text-neutral-300">Minha Resenha</label>
                            <textarea id="review" rows="6" class="w-full bg-neutral-800 border-2 border-neutral-700 rounded-xl p-3">${book.review || ''}</textarea>
                        </div>
                        <div class="md:col-span-2">
                           <label for="categories" class="block text-sm font-bold mb-2 text-neutral-300">Categorias (separadas por vírgula)</label>
                           <input type="text" id="categories" class="w-full bg-neutral-800 border-2 border-neutral-700 rounded-xl p-3" value="${book.categories || ''}">
                       </div>
                    </div>
                    
                    <div class="flex items-center justify-end gap-4 pt-4">
                         <button type="button" class="btn-expressive btn-text" id="form-cancel-btn">Cancelar</button>
                        <button type="submit" class="btn-expressive btn-primary">
                            <span class="material-symbols-outlined mr-2">save</span> ${isEditing ? 'Salvar Alterações' : 'Adicionar Livro'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;

    modalContent.innerHTML = formHtml;
    modalContainer.classList.remove('hidden');

    // Adiciona listener para fechar o modal, mas impede que o clique no conteúdo o feche
    document.getElementById('modal-close-btn').onclick = hideModal;
    modalContainer.onclick = hideModal;
    modalContent.firstElementChild.onclick = (e) => e.stopPropagation();

    setupFormListeners(modalContent);
    document.addEventListener('keydown', handleEscKey);
}

function setupFormListeners(container = document) {
    // Rating stars logic
    const stars = container.querySelectorAll('.star-icon');
    stars.forEach(star => {
        star.onclick = () => {
            const rating = star.dataset.value;
            container.getElementById('ratingValue').value = rating;
            stars.forEach(s => {
                s.classList.toggle('filled', s.dataset.value <= rating);
                s.classList.toggle('text-amber-400', s.dataset.value <= rating);
                s.classList.toggle('text-neutral-600', s.dataset.value > rating);
            });
        };
    });

    // Favorite button logic
    const favBtn = container.querySelector('#favorite-btn');
    const favValueInput = container.querySelector('#favoriteValue');
    favBtn.onclick = () => {
        const isFavorite = favValueInput.value === 'true';
        favValueInput.value = !isFavorite;
        favBtn.querySelector('span').classList.toggle('filled', !isFavorite);
        favBtn.querySelector('span').classList.toggle('text-red-500', !isFavorite);
    };

    // Media type toggle logic
    const mediaTypeRadios = container.querySelectorAll('input[name="mediaType"]');
    const pagesContainer = container.querySelector('#total-pages-container');
    const timeContainer = container.querySelector('#total-time-container');

    function toggleMediaFields() {
        const selectedType = container.querySelector('input[name="mediaType"]:checked').value;
        if (selectedType === 'audiobook') {
            pagesContainer.classList.add('hidden');
            timeContainer.classList.remove('hidden');
        } else {
            pagesContainer.classList.remove('hidden');
            timeContainer.classList.add('hidden');
            pagesContainer.querySelector('label').textContent = 'Nº de Páginas';
            pagesContainer.querySelector('input').placeholder = '';
        }
    }
    mediaTypeRadios.forEach(radio => radio.onchange = toggleMediaFields);
    toggleMediaFields();

    // Feelings/Moods selection logic
    const feelingsContainer = container.querySelector('#feelings-container');
    const feelingsValueInput = container.querySelector('#feelingsValue');
    if (feelingsContainer) {
        feelingsContainer.addEventListener('click', (e) => {
            if (e.target.matches('.mood-tag-btn')) {
                e.preventDefault();
                const btn = e.target;
                const feeling = btn.dataset.feeling;
                let selectedFeelings = feelingsValueInput.value ? feelingsValueInput.value.split(',').filter(f => f) : [];

                if (selectedFeelings.includes(feeling)) {
                    selectedFeelings = selectedFeelings.filter(f => f !== feeling);
                    btn.classList.remove('selected');
                } else {
                    if (selectedFeelings.length < 5) {
                        selectedFeelings.push(feeling);
                        btn.classList.add('selected');
                    } else {
                        // Optional: Show a message that the limit is 5
                        console.warn("Limit of 5 feelings reached.");
                        alert("Você pode selecionar no máximo 5 sentimentos.");
                    }
                }
                feelingsValueInput.value = selectedFeelings.join(',');
            }
        });
    }


    // Form submission logic
    container.querySelector('#book-form').onsubmit = async (e) => {
        e.preventDefault();
        const bookId = container.querySelector('#bookId').value || null;

        const bookData = {
            id: bookId,
            title: container.querySelector('#title').value,
            author: container.querySelector('#author').value,
            status: container.querySelector('#status').value,
            rating: Number(container.querySelector('#ratingValue').value) || 0,
            startDate: container.querySelector('#startDate').value,
            endDate: container.querySelector('#endDate').value,
            isbn: container.querySelector('#isbn').value,
            coverUrl: container.querySelector('#coverUrl').value,
            synopsis: container.querySelector('#synopsis').value,
            review: container.querySelector('#review').value,
            categories: container.querySelector('#categories').value,
            favorite: container.querySelector('#favoriteValue').value === 'true',
            mediaType: container.querySelector('input[name="mediaType"]:checked').value,
            totalPages: Number(container.querySelector('#totalPages').value) || 0,
            totalTime: container.querySelector('#totalTime').value || '',
            feelings: container.querySelector('#feelingsValue').value ? container.querySelector('#feelingsValue').value.split(',').filter(f => f) : [],
        };

        showLoading("Salvando...");
        const savedBookId = await saveBook(bookData);
        hideModal(); // Fecha o modal do formulário
    };

    container.querySelector('#metadata-search-btn').onclick = () => handleMetadataSearch(container);
}

async function renderDetailsInModal(bookId) {
    const modalContainer = document.getElementById('modal-container');
    const modalContent = document.getElementById('modal-content');
    let book = allBooks.find(b => b.id === bookId);

    if (!book && userId && bookId) {
        try {
            const docRef = doc(db, "users", userId, "books", bookId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                book = { id: docSnap.id, ...docSnap.data() };
            }
        } catch (error) {
            console.error("Error fetching single book:", error);
        }
    }


    if (!book) {
        showModal('Erro', 'Livro não encontrado.');
        window.location.hash = '#/estante';
        return;
    }

    const ratingHtml = book.rating ? Array.from({ length: 5 }, (_, i) => `<span class="material-symbols-outlined text-amber-400 !text-3xl ${i < book.rating ? 'filled' : ''}">star</span>`).join('') : '<span class="text-neutral-400">Sem avaliação</span>';
    const statusDisplay = { 'lido': 'Lido', 'lendo': 'Lendo Agora', 'quero-ler': 'Quero Ler', 'abandonado': 'Abandonado' }[book.status] || 'Sem status';

    let totalDisplay = '';
    const bookType = book.mediaType || 'fisico';

    if (bookType === 'fisico' || bookType === 'digital') {
        const pages = book.totalPages !== undefined ? book.totalPages : book.pages;
        totalDisplay = `${pages || '?'} páginas`;
        if (bookType === 'digital') totalDisplay = 'E-book';
    } else if (bookType === 'audiobook') {
        totalDisplay = `${book.totalTime || '?'} de áudio`;
    }

    const feelingsHtml = book.feelings && book.feelings.length > 0
        ? `<div class="card-expressive p-6"><h3 class="text-xl font-bold mb-4">Como este livro me fez sentir</h3><div class="flex flex-wrap gap-2">${book.feelings.map(f => `<span class="mood-tag-pill text-sm font-bold px-3 py-1 rounded-full capitalize">${f}</span>`).join('')}</div></div>`
        : '';

    const detailHTML = `
        <div class="card-expressive w-full max-w-5xl max-h-[90vh] flex flex-col relative">
            <button id="modal-close-btn" class="absolute top-4 right-5 text-neutral-400 hover:text-white text-4xl leading-none z-10">&times;</button>
            <div class="p-6 md:p-8 flex-grow overflow-y-auto">
                <div class="flex flex-col sm:flex-row gap-8 md:gap-12">
                    <div class="w-1/3 sm:w-1/5 mx-auto flex-shrink-0">
                        <img src="${book.coverUrl || 'https://placehold.co/400x600/171717/FFFFFF?text=Sem+Capa'}" alt="Capa de ${book.title}" class="w-full rounded-2xl shadow-2xl" onerror="this.onerror=null;this.src='https://placehold.co/400x600/171717/FFFFFF?text=Capa+Inv%C3%A1lida';">
                    </div>
                    <div class="w-full sm:w-2/3 flex flex-col">
                        <h1 class="font-display text-3xl md:text-5xl lg:text-6xl mb-2">${book.title}</h1>
                        <h2 class="text-xl md:text-3xl text-neutral-300 mb-6">${book.author}</h2>
                        <div class="flex items-center gap-2 mb-6">${ratingHtml}</div>
                        <div class="flex flex-wrap gap-2 text-sm mb-6">
                            <span class="bg-neutral-800 text-neutral-300 font-bold py-1 px-3 rounded-full">${statusDisplay}</span>
                            <span class="bg-neutral-800 text-neutral-300 font-bold py-1 px-3 rounded-full">${totalDisplay}</span>
                        </div>
                         <div class="flex flex-wrap gap-2 mb-8">${book.categories ? book.categories.split(',').map(cat => `<span class="bg-[hsla(var(--md-sys-color-primary),0.2)] text-[hsl(var(--md-sys-color-primary))] text-xs font-bold mr-2 px-2.5 py-1 rounded-full">${cat.trim()}</span>`).join('') : ''}</div>
                         <div class="mt-auto flex flex-col sm:flex-row gap-4">
                            <a href="#/edit/${book.id}" class="btn-expressive btn-primary flex-1 !h-11 !text-sm"><span class="material-symbols-outlined mr-2">edit</span> Editar</a>
                            <button id="delete-book-btn" class="btn-expressive !h-11 !text-sm bg-red-900/60 text-red-300 hover:bg-red-800"><span class="material-symbols-outlined">delete</span></button>
                        </div>
                    </div>
                </div>
                
                <div class="mt-8 space-y-6">
                    ${book.status === 'lendo' ? renderProgressUpdater(book) : ''}
                     ${book.synopsis ? `<div class="card-expressive p-6"><h3 class="text-xl font-bold mb-4">Sinopse</h3><p class="text-neutral-300 whitespace-pre-wrap">${book.synopsis}</p></div>` : ''}
                     ${book.review ? `<div class="card-expressive p-6"><h3 class="text-xl font-bold mb-4">Minha Resenha</h3><p class="text-neutral-300 whitespace-pre-wrap">${book.review}</p></div>` : ''}
                     ${feelingsHtml}
                </div>
            </div>
        </div>
    `;

    modalContent.innerHTML = detailHTML;
    modalContainer.classList.remove('hidden');

    // Adiciona funcionalidade aos botões dentro do modal
    modalContent.querySelector('#modal-close-btn').onclick = hideModal;
    modalContainer.onclick = hideModal;
    modalContent.firstElementChild.onclick = (e) => e.stopPropagation();


    modalContent.querySelector('#delete-book-btn').onclick = () => showModal('Confirmar Exclusão', `Tem certeza que deseja excluir o livro "<strong>${book.title}</strong>"? Esta ação não pode ser desfeita.`, [{ id: 'confirm-delete-btn', text: 'Sim, Excluir', class: 'bg-red-600 text-white', onClick: () => deleteBook(book.id) }]);

    if (book.status === 'lendo') {
        modalContent.querySelector('#update-progress-btn').onclick = () => {
            const progressInput = modalContent.querySelector('#progress-input');
            let progressValue = progressInput.value;
            if (book.mediaType === 'audiobook') {
                const parts = progressValue.split(':');
                progressValue = (+parts[0]) * 3600 + (+parts[1]) * 60 + (+parts[2]);
            }
            updateBookProgress(book.id, Number(progressValue));
        }
        const progressInput = modalContent.querySelector('#progress-input');
        progressInput.oninput = () => {
            let isComplete = false;
            const bookType = book.mediaType || 'fisico';

            if (bookType === 'fisico' || bookType === 'digital') {
                const total = book.totalPages !== undefined ? book.totalPages : book.pages;
                isComplete = total && Number(progressInput.value) >= total;
            } else if (bookType === 'audiobook') {
                if (progressInput.value && book.totalTime) {
                    const currentParts = progressInput.value.split(':');
                    const totalParts = book.totalTime.split(':');
                    if (currentParts.length === 3 && totalParts.length === 3) {
                        const currentSeconds = (+currentParts[0]) * 3600 + (+currentParts[1]) * 60 + (+currentParts[2]);
                        const totalSeconds = (+totalParts[0]) * 3600 + (+totalParts[1]) * 60 + (+totalParts[2]);
                        isComplete = currentSeconds >= totalSeconds;
                    }
                }
            }
            modalContent.querySelector('#mark-as-read-btn').classList.toggle('hidden', !isComplete);
        };
        modalContent.querySelector('#mark-as-read-btn').onclick = () => markBookAsRead(book.id);
    }
    document.addEventListener('keydown', handleEscKey);
}

function renderProgressUpdater(book) {
    let label, value, max, step, type, placeholder;

    const bookType = book.mediaType || 'fisico';
    type = 'number';
    placeholder = '';
    step = 1;
    max = '';

    if (bookType === 'fisico' || bookType === 'digital') {
        const total = book.totalPages !== undefined ? book.totalPages : book.pages;
        label = `Página Atual (de ${total || '?'})`;
        value = book.currentProgress || 0;
        max = total || '';
    } else if (bookType === 'audiobook') {
        label = `Tempo Ouvido (de ${book.totalTime || '??:??:??'})`;
        const s = book.currentProgress || 0;
        value = new Date(s * 1000).toISOString().slice(11, 19);
        type = 'text';
        placeholder = 'HH:MM:SS';
        max = undefined;
        step = undefined;
    }

    return `
         <div class="card-expressive p-6 mb-8">
            <h3 class="text-xl font-bold mb-4">Atualizar Leitura</h3>
            <div class="flex items-end gap-4">
                <div class="flex-grow">
                     <label for="progress-input" class="block text-sm font-bold mb-2 text-neutral-300">${label}</label>
                     <input type="${type}" id="progress-input" class="w-full bg-neutral-800 border-2 border-neutral-700 rounded-xl p-3" value="${value}" ${max ? `max="${max}"` : ''} ${step ? `step="${step}"` : ''} placeholder="${placeholder}">
                </div>
                <button id="update-progress-btn" class="btn-expressive btn-tonal">Atualizar</button>
            </div>
             <button id="mark-as-read-btn" class="btn-expressive btn-primary w-full mt-4 hidden">Marcar como Lido</button>
        </div>
    `;
}

// --- FUNÇÕES DA GOOGLE BOOKS API ---

async function handleMetadataSearch(container = document) {
    const title = container.querySelector('#title').value;
    if (!title) {
        showModal("Falta o Título", "Por favor, insira um título de livro para buscar os dados.", []);
        return;
    }
    if (!GOOGLE_BOOKS_API_KEY || GOOGLE_BOOKS_API_KEY === "SUA_CHAVE_DE_API_AQUI") {
        showModal("API Key Faltando", "Por favor, adicione sua chave da Google Books API no ficheiro app.js.", []);
        return;
    }

    showLoading('A procurar edições...');
    const query = encodeURIComponent(`intitle:${title}`);
    const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${GOOGLE_BOOKS_API_KEY}&maxResults=40`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            apiSearchResults = data.items;
            currentApiResultIndex = 0;
            showApiResultsModal();
        } else {
            hideModal();
            showModal("Nenhum Resultado", "Nenhum livro foi encontrado com este título.", []);
        }
    } catch (error) {
        console.error("Erro na busca de metadados:", error);
        hideModal();
        showModal("Erro na Busca", `Não foi possível buscar os dados do livro: ${error.message}`, []);
    }
}

function showApiResultsModal() {
    const book = apiSearchResults[currentApiResultIndex];
    if (!book) return;

    const volumeInfo = book.volumeInfo;
    const coverUrl = volumeInfo.imageLinks?.thumbnail || 'https://placehold.co/400x600/171717/FFFFFF?text=Sem+Capa';
    const title = volumeInfo.title || 'Título desconhecido';
    const authors = volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Autor desconhecido';
    const pages = volumeInfo.pageCount ? `${volumeInfo.pageCount} páginas` : '';
    const isbn = volumeInfo.industryIdentifiers?.find(i => i.type === "ISBN_13")?.identifier || '';

    const content = `
        <div class="flex flex-col md:flex-row gap-4">
            <img src="${coverUrl}" class="w-24 md:w-1/3 rounded-lg shadow-md mx-auto">
            <div class="flex-grow">
                <h3 class="font-bold text-lg">${title}</h3>
                <p class="text-sm text-neutral-400">${authors}</p>
                <p class="text-xs text-neutral-500 mt-1">${pages} | ISBN: ${isbn}</p>
                <p class="text-sm mt-2 line-clamp-3">${volumeInfo.description || ''}</p>
            </div>
        </div>
        <div class="flex justify-between items-center mt-4">
             <button id="prev-book-btn" class="btn-expressive btn-text !h-10 !p-2">&lt; Anterior</button>
             <span>${currentApiResultIndex + 1} / ${apiSearchResults.length}</span>
             <button id="next-book-btn" class="btn-expressive btn-text !h-10 !p-2">Próxima &gt;</button>
        </div>
    `;

    const actions = [
        { id: 'select-book-btn', text: '<span class="material-symbols-outlined !text-base mr-2">done</span>É essa!', class: 'btn-primary', onClick: selectApiBook },
    ];

    // Re-usa o showModal genérico, mas ele será sobreposto pelo modal do formulário se a busca for de lá.
    // O ideal seria um sistema de modal mais robusto, mas isso funciona por agora.
    showModal(`Resultados da Busca`, content, actions);

    document.getElementById('prev-book-btn').disabled = currentApiResultIndex === 0;
    document.getElementById('next-book-btn').disabled = currentApiResultIndex === apiSearchResults.length - 1;
    document.getElementById('prev-book-btn').onclick = showPrevApiBook;
    document.getElementById('next-book-btn').onclick = showNextApiBook;

}

function showNextApiBook() {
    if (currentApiResultIndex < apiSearchResults.length - 1) {
        currentApiResultIndex++;
        showApiResultsModal();
    }
}

function showPrevApiBook() {
    if (currentApiResultIndex > 0) {
        currentApiResultIndex--;
        showApiResultsModal();
    }
}

function selectApiBook() {
    // O container do formulário é o modalContent quando o formulário está aberto
    const container = document.getElementById('modal-content');
    const book = apiSearchResults[currentApiResultIndex].volumeInfo;

    container.querySelector('#title').value = book.title || '';
    container.querySelector('#author').value = book.authors ? book.authors.join(', ') : '';
    container.querySelector('#synopsis').value = book.description || '';
    container.querySelector('#totalPages').value = book.pageCount || '';
    container.querySelector('#isbn').value = book.industryIdentifiers?.find(i => i.type === "ISBN_13")?.identifier || '';
    const coverUrl = book.imageLinks?.thumbnail || '';
    container.querySelector('#coverUrl').value = coverUrl;

    const previewContainer = container.querySelector('#cover-preview-container');
    if (coverUrl) {
        previewContainer.innerHTML = `<img src="${coverUrl}" class="w-32 mx-auto rounded-lg shadow-md">`;
    } else {
        previewContainer.innerHTML = '';
    }

    // Não fecha o modal principal, apenas o de resultados (que na verdade é o mesmo)
    // O usuário vê a atualização e pode continuar editando o form.
    renderFormInModal(container.querySelector('#bookId').value);
}


function handleCsvExport() {
    if (allBooks.length === 0) {
        showModal("Sem dados", "Não há livros para exportar.", []);
        return;
    }
    const goodreadsData = allBooks.map(b => ({
        'Book Id': b.id,
        'Title': b.title,
        'Author': b.author,
        'ISBN': b.isbn || '',
        'My Rating': b.rating || 0,
        'Average Rating': 0,
        'Publisher': '',
        'Binding': '',
        'Number of Pages': b.totalPages !== undefined ? b.totalPages : b.pages || '',
        'Year Published': '',
        'Original Publication Year': '',
        'Date Read': b.endDate ? new Date(b.endDate).toISOString().split('T')[0] : '',
        'Date Added': b.addedAt ? b.addedAt.toISOString().split('T')[0] : '',
        'Bookshelves': b.status,
        'My Review': b.review || '',
    }));

    const csv = Papa.unparse(goodreadsData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "minha_estante_export.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function handleCsvImport(event) {
    if (typeof window.Papa === 'undefined') {
        console.error("CSV Import: ERRO - A biblioteca PapaParse não foi encontrada no objeto 'window'. Verifique se o script está a ser carregado corretamente no 'app.html'.");
        showModal("Erro de Importação", "A ferramenta para ler arquivos CSV não carregou. Verifique sua conexão com a internet e se há algum bloqueador de scripts ativo.");
        return;
    }
    const file = event.target.files[0];
    if (!file) return;
    showLoading("Importando livros do Goodreads...");

    window.Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
            const booksToImport = results.data.map(row => {
                const shelves = row['Exclusive Shelf'] || '';
                let status = 'quero-ler';
                if (shelves === 'read') status = 'lido';
                if (shelves === 'currently-reading') status = 'lendo';

                const formatDate = (dateStr) => {
                    if (!dateStr || dateStr.length === 0) return '';
                    try {
                        const [year, month, day] = dateStr.split('/');
                        if (year && month && day && year.length === 4) {
                            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                        }
                        const d = new Date(dateStr);
                        if (isNaN(d.getTime())) return '';
                        return d.toISOString().split('T')[0];
                    } catch (e) {
                        return '';
                    }
                };

                return {
                    title: row.Title || '',
                    author: row.Author || '',
                    isbn: row.ISBN13 || row.ISBN || '',
                    totalPages: Number(row['Number of Pages']) || 0,
                    rating: Number(row['My Rating']) || 0,
                    startDate: '',
                    endDate: formatDate(row['Date Read']),
                    review: row['My Review'] || '',
                    status: status,
                    favorite: (row.Bookshelves || '').includes('favorites'),
                    mediaType: 'fisico',
                    currentProgress: 0,
                    addedAt: new Date(formatDate(row['Date Added']) || Date.now())
                };
            }).filter(b => b.title && b.author);

            if (booksToImport.length > 0) {
                showLoading(`Enriquecendo dados de ${booksToImport.length} livros...`);
                const batch = writeBatch(db);
                const collectionRef = collection(db, "users", userId, "books");

                for (const bookData of booksToImport) {
                    try {
                        const query = encodeURIComponent(`intitle:${bookData.title}+inauthor:${bookData.author}`);
                        const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${GOOGLE_BOOKS_API_KEY}&maxResults=1`;
                        const response = await fetch(url);
                        const apiData = await response.json();
                        if (apiData.items && apiData.items.length > 0) {
                            const bookApi = apiData.items[0].volumeInfo;
                            bookData.coverUrl = bookApi.imageLinks?.thumbnail || '';
                            if (!bookData.synopsis) bookData.synopsis = bookApi.description || '';
                        }
                    } catch (e) {
                        console.warn("Não foi possível enriquecer dados para: ", bookData.title, e);
                    }

                    const docRef = doc(collectionRef);
                    batch.set(docRef, bookData);
                }

                await batch.commit();
                hideModal();
                showModal("Importação Concluída", `${booksToImport.length} livros foram importados e atualizados com sucesso!`, []);

            } else {
                hideModal();
                showModal("Nenhum livro válido", "Não foram encontrados livros válidos para importar no arquivo CSV.");
            }
            event.target.value = null;
        },
        error: (err) => {
            hideModal();
            showModal("Erro no CSV", `Não foi possível processar o arquivo: ${err.message}`);
        }
    });
}


// --- INICIALIZAÇÃO DO APP ---
window.addEventListener('load', () => {
    initFirebase();
});
