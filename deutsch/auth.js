// auth.js - Lida com a autenticação e redirecionamento
// Inspirado no auth.js do BookTracker

// Importações do Firebase (SDK 9 modular)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getFirestore, doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

console.log("auth.js: Script carregado.");

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

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
console.log("auth.js: Serviços do Firebase (Deutsch) inicializados.");

// Mostra erro de login na UI
function showLoginError(error) {
    const loginContainer = document.getElementById('login-container');
    // Remove erro antigo se existir
    const oldError = loginContainer.querySelector('.error-message');
    if (oldError) oldError.remove();
    
    loginContainer.innerHTML += `<p class="text-red-400 mt-4 error-message">Erro no login: ${error.message}.</p>`;
    console.error("auth.js: Erro de login:", error);
}

// Event listener para quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    console.log("auth.js: DOM pronto.");
    const googleLoginBtn = document.getElementById('google-login-btn');
    const loader = document.getElementById('loader');

    if (googleLoginBtn) {
        // Evento de clique no botão de login
        googleLoginBtn.addEventListener('click', async () => {
            console.log("auth.js: Botão de login clicado.");
            loader.classList.remove('hidden');
            googleLoginBtn.classList.add('hidden');

            const provider = new GoogleAuthProvider();
            try {
                console.log("auth.js: Tentando abrir o pop-up de login...");
                const result = await signInWithPopup(auth, provider);
                const user = result.user;
                console.log("auth.js: Login com Google bem-sucedido.");
                
                // Cria ou atualiza o perfil do usuário no Firestore
                // Este é o local ideal para garantir que o usuário tenha um perfil
                const userDocRef = doc(db, "users", user.uid, "profile", "data");
                await setDoc(userDocRef, {
                    uid: user.uid,
                    name: user.displayName,
                    email: user.email,
                    avatarUrl: user.photoURL,
                    lastLogin: serverTimestamp(),
                }, { merge: true }); // Merge: true para não sobrescrever dados existentes (como score)

                // onAuthStateChanged irá tratar do redirecionamento
            } catch (error) {
                console.error("auth.js: ERRO durante signInWithPopup:", error);
                loader.classList.add('hidden');
                googleLoginBtn.classList.remove('hidden');
                showLoginError(error);
            }
        });
    }

    // Observador do estado de autenticação
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("auth.js: Usuário autenticado detectado:", user.uid);
            // Guarda o ID de usuário no localStorage para o app.js pegar
            localStorage.setItem('deutschAppUserId', user.uid);
            console.log("auth.js: ID do usuário salvo. Redirecionando para app.html...");
            window.location.href = 'app.html';
        } else {
            console.log("auth.js: Nenhum usuário autenticado.");
            loader.classList.add('hidden');
            if (googleLoginBtn) {
                googleLoginBtn.classList.remove('hidden');
            }
        }
    });
});

