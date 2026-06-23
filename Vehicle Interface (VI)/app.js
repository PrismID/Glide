// --- DOM Elements ---
const tempDisplay = document.getElementById('temp-display');
const btnUp = document.getElementById('tempup');
const btnDown = document.getElementById('tempdown');
const btnPanic = document.getElementById('emergency-btn');
const btnSupport = document.getElementById('support-btn');

// Temperature Logic
btnUp.addEventListener('click', () => {
    let currentTemp = parseInt(tempDisplay.innerText);
    tempDisplay.innerText = (currentTemp + 1) + "°F";
});

btnDown.addEventListener('click', () => {
    let currentTemp = parseInt(tempDisplay.innerText);
    tempDisplay.innerText = (currentTemp - 1) + "°F";
});

// PANIC LOGIC: This should trigger a car-wide alert, not change temperature!
btnPanic.addEventListener('click', () => {
    alert("EMERGENCY: Notifying dispatch and pulling over.");
    // Insert your vehicle emergency API call here
});

btnSupport.addEventListener('click', () => {
    // Insert your support call logic here
});

// THE SECURE BROWSER LAUNCH
// Note: We open 'browser.html', NOT an .exe
function openSecureBrowser(event) {
    event.preventDefault();

    // Open the browser interface as a separate window
    const win = window.open('browser.html', '_blank', 'width=1000,height=800,frame=yes');
}