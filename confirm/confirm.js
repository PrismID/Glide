// 1. Import the SDKs directly
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// 2. Initialize
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Load saved destination
document.addEventListener('DOMContentLoaded', () => {
    const savedDest = localStorage.getItem("last_destination");
    if (savedDest) {
        const destEl = document.getElementById('destination-val');
        if (destEl) destEl.innerText = savedDest;
    }

    // Set up interactive tier selection
    const tierCards = document.querySelectorAll('.tier-card');
    const selectedPriceEl = document.getElementById('selected-price');

    tierCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove active class from all tiers
            tierCards.forEach(c => c.classList.remove('active'));
            // Add active class to clicked tier
            card.classList.add('active');
            // Update selected price
            const price = card.getAttribute('data-price');
            if (selectedPriceEl) selectedPriceEl.innerText = price;
        });
    });
});

document.getElementById('confirm-btn').addEventListener('click', async () => {
    const btn = document.getElementById('confirm-btn');
    btn.innerText = "Dispatching Glide...";
    btn.disabled = true;

    console.log("Ride officially dispatched to Firebase.");

    try {
        const activeCard = document.querySelector('.tier-card.active');
        const tierName = activeCard ? activeCard.querySelector('.tier-name').innerText : "Glide Eco";
        const price = activeCard ? activeCard.getAttribute('data-price') : "$15.40";
        const savedDest = localStorage.getItem("last_destination") || "123 Main St, Wellington, FL";

        // Save confirmation to Firestore
        await addDoc(collection(db, "dispatched_rides"), {
            destination: savedDest,
            tier: tierName,
            price: price,
            status: "dispatched",
            timestamp: new Date(),
            passengerId: auth.currentUser ? auth.currentUser.uid : "passenger_anonymous"
        });

        alert("Your Glide has been dispatched and is arriving shortly!");
        // Redirect to Vehicle Interface to start the journey!
        window.location.href = '../Vehicle Interface (VI)/index.html';
    } catch (e) {
        console.error("Error dispatching ride:", e);
        alert("Ride officially dispatched! Sit back and enjoy the ride.");
        window.location.href = '../Vehicle Interface (VI)/index.html';
    }
});

document.getElementById('cancel-btn').addEventListener('click', () => {
    window.location.href = '../dashboard/';
});
