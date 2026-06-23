// vi.js - The Vehicle OS Controller

// 1. PWA Registration
/*
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(() => console.log('VI: Service Worker Registered'));
}
*/

// 2. Connectivity Monitor (Crucial for the driver)
window.addEventListener('online', () => {
    console.log("VI: Connection restored. Syncing offline cache...");
    // Trigger sync function here
});

window.addEventListener('offline', () => {
    console.warn("VI: Offline mode activated. Ride requests will be cached locally.");
});
