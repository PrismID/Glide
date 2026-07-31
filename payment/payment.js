// 1. Import the SDKs directly
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// 2. Initialize
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
const db = getFirestore(app);

// --- Credit Card Real-time Preview ---
const inputName = document.getElementById('card-name');
const inputNumber = document.getElementById('card-number');
const inputExpiry = document.getElementById('card-expiry');
const inputCVC = document.getElementById('card-cvc');

const previewName = document.getElementById('preview-name');
const previewNumber = document.getElementById('preview-number');
const previewExpiry = document.getElementById('preview-expiry');

if (inputName) {
    inputName.addEventListener('input', (e) => {
        previewName.innerText = e.target.value.toUpperCase() || "YOUR NAME";
    });
}

if (inputNumber) {
    inputNumber.addEventListener('input', (e) => {
        // Format card number: Add space after every 4 digits
        let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        let formatted = '';
        for (let i = 0; i < value.length; i++) {
            if (i > 0 && i % 4 === 0) {
                formatted += ' ';
            }
            formatted += value[i];
        }
        e.target.value = formatted;
        previewNumber.innerText = formatted || "•••• •••• •••• ••••";
    });
}

if (inputExpiry) {
    inputExpiry.addEventListener('input', (e) => {
        let value = e.target.value.replace(/[^0-9]/g, '');
        if (value.length >= 2) {
            e.target.value = value.substring(0, 2) + '/' + value.substring(2, 4);
        } else {
            e.target.value = value;
        }
        previewExpiry.innerText = e.target.value || "MM/YY";
    });
}

// Form validation and submit
const savePaymentState = async (status) => {
    const user = auth.currentUser;
    if (user) {
        try {
            await setDoc(doc(db, "users", user.uid), {
                paymentStatus: status,
                setupComplete: status === "active"
            }, { merge: true });

            console.log("Payment status updated in Firestore:", status);
            window.location.href = '../dashboard/';
        } catch (e) {
            console.error("Error writing payment configuration to Firestore:", e);
            alert("Error: Could not save payment details. Please try again.");
        }
    } else {
        // If auth state is not yet loaded, wait for auth or redirect to dashboard as fallback
        console.warn("User auth not loaded yet. Attempting redirect directly to dashboard.");
        window.location.href = '../dashboard/';
    }
};

document.getElementById('pay-btn').addEventListener('click', async () => {
    const nameVal = inputName.value.trim();
    const numVal = inputNumber.value.trim();
    const expVal = inputExpiry.value.trim();
    const cvcVal = inputCVC.value.trim();
    const zipVal = document.getElementById('billing-zip').value.trim();

    if (!nameVal || !numVal || !expVal || !cvcVal || !zipVal) {
        alert("Please enter all billing details.");
        return;
    }

    if (numVal.replace(/\s/g, '').length < 15) {
        alert("Please enter a valid credit card number.");
        return;
    }

    if (cvcVal.length < 3) {
        alert("Please enter a valid security code (CVC).");
        return;
    }

    const btn = document.getElementById('pay-btn');
    btn.innerText = "Processing Securing...";
    btn.disabled = true;

    // Simulate standard secure payment tokenization delay
    setTimeout(async () => {
        await savePaymentState("active");
    }, 1200);
});

document.getElementById('skip-btn').addEventListener('click', async () => {
    await savePaymentState("pending");
});
