// 1. Import the SDKs directly
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// 2. Initialize in the same file

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.getElementById('signup-btn').addEventListener('click', async () => {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!name || !email || !password) {
        alert("Please enter all details.");
        return;
    }

    if (password.length < 6) {
        alert("Password should be at least 6 characters.");
        return;
    }

    const btn = document.getElementById('signup-btn');
    const originalText = btn.innerText;
    btn.innerText = "Signing up...";
    btn.disabled = true;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Save user's name to Firestore
        await setDoc(doc(db, "users", user.uid), {
            name: name,
            email: email,
            paymentStatus: "pending",
            setupComplete: false,
            createdAt: new Date()
        });

        console.log("User signed up and recorded in Firestore successfully!");
        window.location.href = '../payment/'; // Forward directly to payment setup page!
    } catch (error) {
        console.error("Signup Error:", error);
        alert("Signup Error: " + error.message);
        btn.innerText = originalText;
        btn.disabled = false;
    }
});
