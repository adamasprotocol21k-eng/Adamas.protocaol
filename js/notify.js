/**
 * ADAMAS PROTOCOL - Notification Module
 * Functionality: Visual Toasts, Sound FX & Haptic Feedback
 */

const NotifyModule = {
    // 1. SOUND EFFECTS (Paths can be changed to your assets)
    sounds: {
        success: 'assets/sounds/success.mp3',
        error: 'assets/sounds/error.mp3',
        click: 'assets/sounds/click.mp3'
    },

    // 2. VISUAL TOAST (Neon Styled)
    show(message, type = 'info') {
        const toastContainer = document.getElementById('toast-container') || this.createContainer();
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-icon">${type === 'success' ? '✅' : '⚠️'}</span>
                <span class="toast-text">${message}</span>
            </div>
            <div class="toast-progress"></div>
        `;

        toastContainer.appendChild(toast);

        // Play Sound
        this.playSound(type === 'success' ? 'success' : 'error');

        // Remove after 4 seconds
        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.5s forwards';
            setTimeout(() => toast.remove(), 500);
        }, 4000);
    },

    // 3. INTERNAL HELPER: Create Container
    createContainer() {
        const container = document.createElement('div');
        container.id = 'toast-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;
        document.body.appendChild(container);
        return container;
    },

    // 4. PLAY SOUND LOGIC
    playSound(soundName) {
        try {
            const audio = new Audio(this.sounds[soundName]);
            audio.volume = 0.5;
            audio.play();
        } catch (e) {
            console.warn("Audio playback blocked by browser or file missing.");
        }
    }
};

// Global Access
window.Notify = NotifyModule;

