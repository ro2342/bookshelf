// auth.js - Lógica de login para deutsch/index.html
// Refatorado para usar a sintaxe de MÓDULO (import), igual ao 'booktracker/auth.js'

// --- 1. IMPORTAÇÕES (A "TECNOLOGIA DO BOOKTRACKER") ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// --- 2. CONFIGURAÇÃO (A MESMA DE ANTES) ---
const firebaseConfig = {
    apiKey: "AIzaSyCyfUhhftcrV1piHd8f-4wYaBiatLUcXU",
    authDomain: "deutsch-39779.firebaseapp.com",
    projectId: "deutsch-39779",
    storageBucket: "deutsch-39779.firebasestorage.app",
    messagingSenderId: "672743327567",
    appId: "1:672743327567:web:8875f89b1f282b7aba273a",
    measurementId: "G-XYVLCZD740"
};

// --- 3. INICIALIZAÇÃO MODULAR (O NOVO PADRÃO) ---
// Em vez de 'firebase.app.initializeApp', usamos a função importada
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- 4. LÓGICA DA PÁGINA (A MESMA DE ANTES, MAS USANDO AS FUNÇÕES NOVAS) ---

let selectedTheme = 'taylorSwift';

function renderThemes() {
    // Acessa o 'window.themes' carregado pelo script em index.html
    if (!window.themes) {
        console.error("themes.js não foi carregado a tempo.");
        return;
    }
    const grid = document.getElementById('themeGrid');
    if (!grid) return; // Sai se o elemento não existir
    
    grid.innerHTML = ''; // Limpa o grid para evitar duplicatas
    
    Object.keys(window.themes).forEach(themeName => {
        const theme = window.themes[themeName];
        const div = document.createElement('div');
        div.className = 'theme-option';
        if (themeName === selectedTheme) {
            div.classList.add('selected');
        }
        div.textContent = theme.name;
        div.style.backgroundColor = theme.primary;
        div.style.color = theme.text;
        div.style.borderColor = theme.primary;
        
        div.onclick = () => {
            selectedTheme = themeName;
            document.querySelectorAll('.theme-option').forEach(el => {
                el.classList.remove('selected');
            });
            div.classList.add('selected');
        };
        
        grid.appendChild(div);
    });
}

const loginBtn = document.getElementById('loginBtn');
const loadingDiv = document.getElementById('loading');

if (loginBtn) {
    // Usando as funções modulares importadas (signInWithPopup, GoogleAuthProvider)
    loginBtn.addEventListener('click', async () => {
        if(loadingDiv) loadingDiv.style.display = 'block';
        
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Usando as funções modulares (doc, getDoc, setDoc, updateDoc, serverTimestamp)
            const docRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                await setDoc(docRef, {
                    email: user.email,
                    displayName: user.displayName,
                    theme: selectedTheme,
                    lastLogin: serverTimestamp(),
                    score: 0,
                    completedLektions: [],
                    lektionProgress: {},
                    exerciseStats: {}
                });
            } else {
                await updateDoc(docRef, {
                    lastLogin: serverTimestamp()
                });
            }
            
            localStorage.setItem('selectedTheme', selectedTheme);
            window.location.href = 'app.html';
            
        } catch (error) {
            console.error('Login error:', error);
            alert('Erro ao fazer login. Tente novamente.');
            if(loadingDiv) loadingDiv.style.display = 'none';
        }
    });
}

// Usando a função modular importada (onAuthStateChanged)
onAuthStateChanged(auth, (user) => {
    if (user) {
        window.location.href = 'app.html';
    }
});

// Inicializa a renderização dos temas
// Adiciona um listener para garantir que o DOM (e o themes.js) esteja pronto
document.addEventListener('DOMContentLoaded', () => {
     renderThemes();
});

// Se o DOM já estiver pronto (caso o script carregue 'defer'),
// rode a função imediatamente.
if (document.readyState === 'interactive' || document.readyState === 'complete') {
    renderThemes();
}
