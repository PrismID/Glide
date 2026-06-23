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

document.getElementById('signup-btn').addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        alert("Please enter details.");
        return;
    }

    try {
        await createUserWithEmailAndPassword(auth, email, password);
        console.log("User signed up successfully!");
        window.location.href = '../dashboard/'; // Adjust path as needed
    } catch (error) {
        console.error("Signup Error:", error);
        alert(error.message);
    }
});