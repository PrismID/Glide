// 1. Import the SDKs directly
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
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
const db = getFirestore(app);

let map;
let marker;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 26.65, lng: -80.25 },
        zoom: 14,
        disableDefaultUI: true
    });

    const input = document.getElementById("destination-input");
    const autocomplete = new google.maps.places.Autocomplete(input);

    autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) return;
        map.setCenter(place.geometry.location);
        map.setZoom(17);
        if (marker) marker.setMap(null);
        
    });
}

window.onload = initMap;

// Updated Logic to push to Firebase
document.getElementById('btn-request').addEventListener('click', async () => {
    const destination = document.getElementById('destination-input').value;

    if (!destination) {
        alert("Please enter a destination first.");
        return;
    }

    try {
        // Save to Firebase Firestore 'rides' collection
        await addDoc(collection(db, "rides"), {
            destination: destination,
            status: "pending",
            timestamp: new Date(),
            passenger: "current_user_id" // Ideally, get this from auth.currentUser.uid
        });

        window.location.href = "../confirm/";
    } catch (e) {
        console.error("Error saving ride: ", e);
        alert("Could not request ride. Please try again.");
    }
});

const vehicleMarkers = {};

onSnapshot(collection(db, "vehicles"), (snapshot) => {
    snapshot.forEach((doc) => {
        const vehicle = doc.data();
        const position = { lat: vehicle.location.lat, lng: vehicle.location.lng };

        if (vehicleMarkers[doc.id]) {
            // Update existing marker
            vehicleMarkers[doc.id].position = position;
        } else {
            // Create new marker
            vehicleMarkers[doc.id] = new google.maps.Marker({
                position: position,
                map: map,
                icon: '../car.png'
            });
        }
    });
});