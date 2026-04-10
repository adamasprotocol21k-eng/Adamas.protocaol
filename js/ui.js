/**
 * ADAMAS PROTOCOL - UI ORCHESTRATOR
 * Handles Smooth Transitions & Interactive Feedbacks
 */
export const uiManager = {
    screens: {
        landing: document.getElementById('view-landing'),
        dashboard: document.getElementById('view-dashboard'),
        portal: document.getElementById('modal-portal')
    },

    // High-End View Switching
    routeTo(target) {
        Object.values(this.screens).forEach(s => {
            if (s) s.classList.remove('active-view');
        });
        
        const targetScreen = this.screens[target];
        if (targetScreen) {
            targetScreen.classList.add('active-view');
            targetScreen.style.display = (target === 'portal') ? 'flex' : 'block';
        }
    },

    updateLiveBalance(value) {
        const counter = document.getElementById('live-balance');
        if (counter) {
            // Smooth counting animation logic
            counter.innerText = value;
        }
    },

    playEffect(type) {
        const audio = new Audio(`./assets/sounds/${type}.mp3`);
        audio.play().catch(() => console.log("Silent Mode"));
    }
};
