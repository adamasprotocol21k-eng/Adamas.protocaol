/**
 * ADAMAS PROTOCOL - Dynamic Navigation
 * Logic: One code for all pages.
 */

const NavModule = {
    init() {
        const navHTML = `
            <nav style="position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); width: 95%; max-width: 420px; background: rgba(10, 11, 20, 0.9); backdrop-filter: blur(20px); border-radius: 50px; display: flex; justify-content: space-around; padding: 18px; border: 1px solid rgba(0, 242, 255, 0.2); z-index: 1000; box-shadow: 0 10px 40px rgba(0,0,0,0.8);">
                <div onclick="window.location.href='dashboard.html'" style="cursor: pointer; font-size: 1.4rem;">🏠</div>
                <div onclick="window.location.href='game.html'" style="cursor: pointer; font-size: 1.4rem;">🎮</div>
                <div onclick="window.location.href='learn.html'" style="cursor: pointer; font-size: 1.4rem;">📖</div>
                <div onclick="window.location.href='referral.html'" style="cursor: pointer; font-size: 1.4rem;">👥</div>
                <div onclick="window.location.href='wallet.html'" style="cursor: pointer; font-size: 1.4rem;">👛</div>
            </nav>
        `;
        
        // Agar HTML mein placeholder hai toh wahan daal dega, nahi toh body mein.
        const placeholder = document.getElementById('navbar-placeholder');
        if (placeholder) {
            placeholder.innerHTML = navHTML;
        } else {
            const div = document.createElement('div');
            div.innerHTML = navHTML;
            document.body.appendChild(div);
        }
    }
};

// Run automatically on page load
window.addEventListener('DOMContentLoaded', () => NavModule.init());
