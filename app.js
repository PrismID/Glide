// 1. Import the SDKs directly
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// 2. Initialize in the same file
const firebaseConfig = {
    apiKey: "AIzaSyA1owZzydT29hztK74bMNQvskezuOG8uZ8",
    authDomain: "glide-rideshares.firebaseapp.com",
    projectId: "glide-rideshares",
    storageBucket: "glide-rideshares.firebasestorage.app",
    messagingSenderId: "936136981965",
    appId: "1:936136981965:web:bdbcc48520577704281884",
    measurementId: "G-9LZMHZ8351"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.getElementById('login-btn').addEventListener('click', () => {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!email || !password) {
        alert("Please enter both email and password.");
        return;
    }

    const btn = document.getElementById('login-btn');
    const originalText = btn.innerText;
    btn.innerText = "Logging in...";
    btn.disabled = true;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log("Logged in:", userCredential.user);
            window.location.href = "dashboard/";
        })
        .catch((error) => {
            console.error("Login failed:", error.message);
            alert("Login failed: " + error.message);
            btn.innerText = originalText;
            btn.disabled = false;
        });
});
