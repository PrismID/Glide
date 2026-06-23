// 1. Correct the DOM selection (ensure document. is present)
const backBtn = document.getElementById('backBtn');

// 2. Attach the click listener directly 
// This is cleaner than relying on inline HTML 'onclick' attributes
if (backBtn) {
    backBtn.addEventListener('click', () => {
        console.log("Exit initiated...");
        const wv = document.getElementById('browser-view');
        
        if (wv && wv.clearData) {
            wv.clearData({
                since: 0,
                storages: ['cookies', 'localstorage', 'cache', 'indexeddb']
            }, () => {
                window.location.href = "https://prismid.github.io/Glide/Vehicle%20Interface%20(VI)/index.html";
            });
        } else {
            window.location.href = "https://prismid.github.io/Glide/Vehicle%20Interface%20(VI)/index.html";
        }
    });
}
