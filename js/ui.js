// ui.js - Controls Screen Transitions & Balance Updates
export const uiController = {
    switchScreen(currentId, nextId) {
        document.getElementById(currentId).classList.remove('active');
        document.getElementById(nextId).classList.add('active');
    },

    updateBalance(val) {
        const el = document.getElementById('ads-balance');
        if (el) el.innerText = val.toFixed(4);
    },

    showNotification(msg) {
        alert(msg); // Placeholder for a custom toast notification
    }
};
