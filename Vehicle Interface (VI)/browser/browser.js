// browser.js
const exitToDashboard = getElementById('backBtn')

window.exitToDashboard = () => {
    console.log("Exit initiated...");
    const wv = document.getElementById('browser-view');
 if (wv && wv.clearData) {
     wv.clearData({
         since: 0,
         storages: ['cookies', 'localstorage', 'cache', 'indexeddb']
     }, () => {
         // 2. Once cleared, navigate back
         window.location.href = 'https://prismid.github.io/Glide/Vehicle%20Interface%20(VI)/';
     });
 } else {
     // Fallback if wv isn't ready
     window.location.href = 'https://prismid.github.io/Glide/Vehicle%20Interface%20(VI)/browser/';
 }
};
