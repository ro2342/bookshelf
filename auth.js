import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

console.log("auth.js: Script carregado.");

const firebaseConfig = {
    apiKey: "AIzaSyAY2sjNC_-RQa3SjO8ASC_44Q10mdR0n24",
    authDomain: "booktracker-afdfa.firebaseapp.com",
    projectId: "booktracker-afdfa",
    storageBucket: "booktracker-afdfa.appspot.com",
    messagingSenderId: "626116591231",
    appId: "1:626116591231:web:52953d422d580a8da3094a",
    measurementId: "G-HV1JL3129W"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
console.log("auth.js: Serviços do Firebase inicializados.");

function showLoginError(error) {
    const loginContainer = document.getElementById('login-container');
    loginContainer.innerHTML += `<p class="text-red-400 mt-4">Erro no login: ${error.message}. Verifique a consola para mais detalhes.</p>`;
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("auth.js: DOM pronto.");
    const googleLoginBtn = document.getElementById('google-login-btn');
    const loader = document.getElementById('loader');

    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', async () => {
            console.log("auth.js: Botão de login clicado.");
            loader.classList.remove('hidden');
            googleLoginBtn.classList.add('hidden');

            const provider = new GoogleAuthProvider();
            try {
                console.log("auth.js: A tentar abrir o pop-up de login...");
                await signInWithPopup(auth, provider);
                console.log("auth.js: Login com Google bem-sucedido.");
                // onAuthStateChanged irá tratar do redirecionamento
            } catch (error) {
                console.error("auth.js: ERRO durante signInWithPopup:", error);
                loader.classList.add('hidden');
                googleLoginBtn.classList.remove('hidden');
                showLoginError(error);
            }
        });
    }

    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("auth.js: Utilizador autenticado detectado:", user.uid);
            // Guarda o ID de utilizador real do Google no localStorage.
            localStorage.setItem('bookTrackerUserId', user.uid);
            console.log("auth.js: ID do utilizador guardado. A redirecionar para app.html...");
            window.location.href = 'app.html';
        } else {
            console.log("auth.js: Nenhum utilizador autenticado.");
            loader.classList.add('hidden');
            googleLoginBtn.classList.remove('hidden');
        }
    });
});
