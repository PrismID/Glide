// browser.js
const exitToDashboard = getElementById('backBtn')
function exitToDashboard() {
    const wv = document.getElementById('browser-view');

    // 1. Wipe the webview internals specifically
    if (wv && wv.clearData) {
        wv.clearData({
            since: 0,
            storages: ['cookies', 'localstorage', 'cache', 'indexeddb']
        }, () => {
            // 2. Once cleared, navigate back
            window.location.href = '../';
        });
    } else {
        // Fallback if wv isn't ready
        window.location.href = '../browser/';
    }
}
