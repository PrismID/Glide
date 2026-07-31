// --- DOM Elements ---
const tempDisplay = document.getElementById('temp-display');
const btnUp = document.getElementById('tempup');
const btnDown = document.getElementById('tempdown');
const btnPanic = document.getElementById('emergency-btn');
const btnSupport = document.getElementById('support-btn');
const destEl = document.getElementById('journey-destination');
const etaTimer = document.getElementById('eta-timer');

// Load saved destination if available from the passenger's request
document.addEventListener('DOMContentLoaded', () => {
    console.log("Glide Cabin Interface Systems Online.");
    const savedDest = localStorage.getItem("last_destination");
    if (savedDest && destEl) {
        destEl.innerText = savedDest;
    }

    // Dynamic ETA simulated countdown
    if (etaTimer) {
        let eta = 12;
        const interval = setInterval(() => {
            if (eta > 1) {
                eta -= 1;
                etaTimer.innerText = eta + " Min";
            } else {
                etaTimer.innerText = "Arrived";
                clearInterval(interval);
            }
        }, 60000); // decrease every minute
    }
});

// --- Helper: Robust Temperature Parsing ---
const getCurrentTemp = () => {
    if (!tempDisplay) return 72;
    return parseInt(tempDisplay.innerText.replace('°F', '')) || 72;
};

// --- Temperature Logic ---
if (btnUp) {
    btnUp.addEventListener('click', () => {
        const nextTemp = getCurrentTemp() + 1;
        if (tempDisplay) tempDisplay.innerText = nextTemp + "°F";
        console.log(`Command sent: TEMPERATURE UP TO ${nextTemp}°F`);
    });
}

if (btnDown) {
    btnDown.addEventListener('click', () => {
        const nextTemp = getCurrentTemp() - 1;
        if (tempDisplay) tempDisplay.innerText = nextTemp + "°F";
        console.log(`Command sent: TEMPERATURE DOWN TO ${nextTemp}°F`);
    });
}

// --- Global sendToCar integration to prevent inline onclick ReferenceErrors ---
window.sendToCar = (command) => {
    console.log("Autopilot execution instruction received:", command);
    if (command === 'TEMP_UP') {
        const nextTemp = getCurrentTemp() + 1;
        if (tempDisplay) tempDisplay.innerText = nextTemp + "°F";
    } else if (command === 'TEMP_DOWN') {
        const nextTemp = getCurrentTemp() - 1;
        if (tempDisplay) tempDisplay.innerText = nextTemp + "°F";
    } else if (command === 'CALL_REMOTE_SUPPORT') {
        alert("Initiating secure video call with remote support specialist...");
    }
};

// --- Support Logic ---
if (btnSupport) {
    btnSupport.addEventListener('click', () => {
        console.log("Initiating support call...");
    });
}

// --- Gorgeous holding panic button for 911 (Prevents ReferenceErrors & highly creative!) ---
let emergencyTimeout;
let emergencyInterval;
let emergencyActive = false;

window.startEmergency = () => {
    if (emergencyActive) return;
    emergencyActive = true;
    console.log("Hold active: Panic Dispatch Countdown Started.");

    // Create a gorgeous red overlay screen dynamically
    let overlay = document.getElementById('emergency-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'emergency-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.background = 'rgba(255, 0, 0, 0.9)';
        overlay.style.backdropFilter = 'blur(15px)';
        overlay.style.webkitBackdropFilter = 'blur(15px)';
        overlay.style.zIndex = '99999';
        overlay.style.display = 'flex';
        overlay.style.flexDirection = 'column';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.color = '#ffffff';
        overlay.style.fontFamily = '-apple-system, sans-serif';
        overlay.style.userSelect = 'none';
        overlay.innerHTML = `
            <div style="font-size: 5rem; margin-bottom: 10px; animation: pulse 1s infinite alternate;">🚨</div>
            <h1 style="font-size: 2.8rem; font-weight: 900; margin-bottom: 15px; text-shadow: 0 4px 10px rgba(0,0,0,0.5); text-transform: uppercase; letter-spacing: 2px;">911 Dispatch</h1>
            <p style="font-size: 1.25rem; margin-bottom: 30px; text-align: center; max-width: 500px; color: #ffcccc; letter-spacing: 0.5px;">HOLDING... KEEP HOLDING TO CALL DISPATCH</p>
            <div style="width: 280px; height: 12px; background: rgba(255,255,255,0.25); border-radius: 6px; overflow: hidden; margin-bottom: 25px;">
                <div id="emergency-progress" style="width: 0%; height: 100%; background: #ffffff; transition: width 0.05s linear;"></div>
            </div>
            <div style="font-size: 3.5rem; font-weight: 900; font-variant-numeric: tabular-nums;" id="emergency-countdown">3.0s</div>
        `;
        document.body.appendChild(overlay);
    } else {
        overlay.style.display = 'flex';
    }

    const progressBar = document.getElementById('emergency-progress');
    const countdownText = document.getElementById('emergency-countdown');

    let duration = 3000; // 3 seconds
    let start = Date.now();

    progressBar.style.width = '0%';
    countdownText.innerText = '3.0s';

    emergencyInterval = setInterval(() => {
        let elapsed = Date.now() - start;
        let percentage = Math.min(100, (elapsed / duration) * 100);
        let remaining = Math.max(0, (duration - elapsed) / 1000);

        progressBar.style.width = percentage + '%';
        countdownText.innerText = remaining.toFixed(1) + 's';

        // Red/Crimson toggle flash
        if (Math.floor(elapsed / 200) % 2 === 0) {
            overlay.style.backgroundColor = 'rgba(180, 0, 0, 0.95)';
        } else {
            overlay.style.backgroundColor = 'rgba(255, 0, 0, 0.95)';
        }
    }, 50);

    emergencyTimeout = setTimeout(() => {
        clearInterval(emergencyInterval);
        progressBar.style.width = '100%';
        countdownText.innerText = 'DISPATCHED!';
        overlay.innerHTML = `
            <div style="font-size: 6rem; margin-bottom: 20px; animation: rotate🚨 1.5s infinite linear;">🚨</div>
            <h1 style="font-size: 3.2rem; font-weight: 900; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 3px;">911 NOTIFIED</h1>
            <p style="font-size: 1.5rem; text-align: center; max-width: 600px; line-height: 1.5; color: #ffffff;">EMERGENCY FIRST RESPONDERS & GLIDE PILOT CONTROL NOTIFIED IN REAL-TIME.</p>
            <p style="font-size: 1.1rem; margin-top: 35px; color: #ffcccc;">Autopilot has safely locked vehicle route to closest medical center or safe-zone.</p>
            <button onclick="window.closeEmergency()" style="margin-top: 40px; width: auto; max-width: 250px; background: white; color: black; font-weight: 800; padding: 16px 35px; border-radius: 30px; text-transform: uppercase; border: none; cursor: pointer; font-size: 1rem; box-shadow: 0 10px 25px rgba(0,0,0,0.3);">Dismiss Alert</button>
        `;
        console.log("CRITICAL: Emergency Alert Sent to Dispatch - 911 Call Initiated.");
    }, duration);
};

window.cancelEmergency = () => {
    if (!emergencyActive) return;
    emergencyActive = false;
    clearTimeout(emergencyTimeout);
    clearInterval(emergencyInterval);
    console.log("Emergency trigger cancelled by user release.");

    const overlay = document.getElementById('emergency-overlay');
    if (overlay && !overlay.innerHTML.includes('911 NOTIFIED')) {
        overlay.style.display = 'none';
    }
};

window.closeEmergency = () => {
    emergencyActive = false;
    const overlay = document.getElementById('emergency-overlay');
    if (overlay) {
        overlay.remove();
    }
};
