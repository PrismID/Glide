// --- DOM Elements ---
const tempDisplay = document.getElementById('temp-display');
const btnUp = document.getElementById('tempup');
const btnDown = document.getElementById('tempdown');
const btnPanic = document.getElementById('emergency-btn');
const btnSupport = document.getElementById('support-btn');

// --- Helper: Robust Temperature Parsing ---
const getCurrentTemp = () => parseInt(tempDisplay.innerText.replace('°F', '')) || 72;

// --- Temperature Logic ---
btnUp.addEventListener('click', () => {
    tempDisplay.innerText = (getCurrentTemp() + 1) + "°F";
});

btnDown.addEventListener('click', () => {
    tempDisplay.innerText = (getCurrentTemp() - 1) + "°F";
});

// --- Emergency & Support Logic ---
btnPanic.addEventListener('click', () => {
    // In a real vehicle, this would talk to the CAN-bus or vehicle API
    console.log("CRITICAL: Emergency Alert Sent to Dispatch");
});

btnSupport.addEventListener('click', () => {
    // Logic for remote support call
    console.log("Initiating support call...");
});

// --- Security: Initialize on load ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("Glide Dashboard Systems Online.");
});
