// 1. Import the SDKs directly
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

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
document.getElementById('confirm-btn').addEventListener('click', () => {
    console.log("Ride officially dispatched to Firebase.");
    alert("Glide is on the way!");
    window.location.href = 'index.html';
});

document.getElementById('cancel-btn').addEventListener('click', () => {
    window.location.href = 'index.html';
});