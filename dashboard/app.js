// 1. Import the SDKs directly
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore, collection, addDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// 2. Initialize in the same file

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let map;
let marker;
const vehicleMarkers = {};

function initMap() {
    try {
        if (typeof google === 'undefined' || !google.maps) {
            console.warn("Google Maps API not loaded. Using luxury ambient map styling.");
            return;
        }

        map = new google.maps.Map(document.getElementById("map"), {
            center: { lat: 26.65, lng: -80.25 },
            zoom: 14,
            disableDefaultUI: true,
            styles: [
                { "elementType": "geometry", "stylers": [{ "color": "#212121" }] },
                { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] },
                { "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] },
                { "elementType": "labels.text.stroke", "stylers": [{ "color": "#212121" }] },
                { "featureType": "administrative", "elementType": "geometry", "stylers": [{ "color": "#757575" }] },
                { "featureType": "administrative.country", "elementType": "labels.text.fill", "stylers": [{ "color": "#9e9e9e" }] },
                { "featureType": "administrative.land_parcel", "stylers": [{ "visibility": "off" }] },
                { "featureType": "administrative.locality", "elementType": "labels.text.fill", "stylers": [{ "color": "#bdbdbd" }] },
                { "featureType": "road", "elementType": "geometry.fill", "stylers": [{ "color": "#2c2c2c" }] },
                { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#8a8a8a" }] },
                { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#000000" }] }
            ]
        });

        const input = document.getElementById("destination-input");
        const autocomplete = new google.maps.places.Autocomplete(input);

        autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();
            if (!place.geometry) return;
            map.setCenter(place.geometry.location);
            map.setZoom(17);
            if (marker) marker.setMap(null);

            marker = new google.maps.Marker({
                position: place.geometry.location,
                map: map,
                title: place.name,
                animation: google.maps.Animation.DROP
            });
        });

        // Initialize Firestore Vehicles listener
        initVehiclesListener();
    } catch (e) {
        console.error("Failed to initialize map:", e);
    }
}

function initVehiclesListener() {
    try {
        onSnapshot(collection(db, "vehicles"), (snapshot) => {
            snapshot.forEach((doc) => {
                const vehicle = doc.data();
                if (!vehicle.location || typeof vehicle.location.lat !== 'number' || typeof vehicle.location.lng !== 'number') return;
                const position = { lat: vehicle.location.lat, lng: vehicle.location.lng };

                if (vehicleMarkers[doc.id]) {
                    // Update existing marker position
                    vehicleMarkers[doc.id].setPosition(position);
                } else {
                    // Create new marker
                    vehicleMarkers[doc.id] = new google.maps.Marker({
                        position: position,
                        map: map,
                        icon: {
                            url: '../car.png',
                            scaledSize: new google.maps.Size(40, 40)
                        }
                    });
                }
            });
        });
    } catch (e) {
        console.error("Error setting up live vehicles tracking:", e);
    }
}

window.onload = initMap;

// Updated Logic to push to Firebase
document.getElementById('btn-request').addEventListener('click', async () => {
    const destination = document.getElementById('destination-input').value.trim();

    if (!destination) {
        alert("Please enter a destination first.");
        return;
    }

    const btn = document.getElementById('btn-request');
    const originalText = btn.innerText;
    btn.innerText = "Processing...";
    btn.disabled = true;

    try {
        const user = auth.currentUser;
        const passengerId = user ? user.uid : "passenger_anonymous";
        const passengerEmail = user ? user.email : "anonymous@glide.com";

        // Save to Firebase Firestore 'rides' collection
        await addDoc(collection(db, "rides"), {
            destination: destination,
            status: "pending",
            timestamp: new Date(),
            passengerId: passengerId,
            passengerEmail: passengerEmail
        });

        // Save destination localstorage for confirmation screen
        localStorage.setItem("last_destination", destination);

        window.location.href = "../confirm/";
    } catch (e) {
        console.error("Error saving ride: ", e);
        alert("Could not request ride: " + e.message);
        btn.innerText = originalText;
        btn.disabled = false;
    }
});
