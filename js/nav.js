/**
 * ADAMAS PROTOCOL - Navigation Engine
 */

const Navigation = {
    init() {
        const navHTML = `
        <nav style="
            position: fixed; bottom: 0; left: 0; width: 100%; 
            background: rgba(10, 10, 15, 0.8); backdrop-filter: blur(20px);
            border-top: 1px solid rgba(0, 242, 255, 0.2); 
            display: flex; justify-content: space-around; align-items: center;
            padding: 15px 0; z-index: 9999; border-radius: 25px 25px 0 0;
        ">
            <div onclick="window.location.href='dashboard.html'" style="text-align:center; cursor:pointer;">
                <div style="font-size: 1.2rem;">🏠</div>
                <div style="font-size: 0.5rem; color: #888; margin-top:4px;">HOME</div>
            </div>
            
            <div onclick="window.location.href='game.html'" style="text-align:center; cursor:pointer;">
                <div style="font-size: 1.2rem;">🎮</div>
                <div style="font-size: 0.5rem; color: #888; margin-top:4px;">GAMES</div>
            </div>

            <div onclick="window.location.href='staking.html'" style="
                text-align:center; cursor:pointer; 
                background: linear-gradient(45deg, #00f2ff, #00ff88);
                width: 55px; height: 55px; border-radius: 50%;
                display: flex; flex-direction: column; justify-content: center;
                margin-top: -30px; border: 4px solid #020205;
                box-shadow: 0 5px 15px rgba(0, 242, 255, 0.4);
            ">
                <div style="font-size: 1.3rem;">💎</div>
                <div style="font-size: 0.4rem; color: #000; font-weight:900;">STAKE</div>
            </div>

            <div onclick="window.location.href='referral.html'" style="text-align:center; cursor:pointer;">
                <div style="font-size: 1.2rem;">👥</div>
                <div style="font-size: 0.5rem; color: #888; margin-top:4px;">FRIENDS</div>
            </div>

            <div onclick="window.location.href='wallet.html'" style="text-align:center; cursor:pointer;">
                <div style="font-size: 1.2rem;">👛</div>
                <div style="font-size: 0.5rem; color: #888; margin-top:4px;">WALLET</div>
            </div>
        </nav>
        `;

        const placeholder = document.getElementById('navbar-placeholder');
        if (placeholder) {
            placeholder.innerHTML = navHTML;
        }
    }
};

// Auto-init on load
document.addEventListener('DOMContentLoaded', () => Navigation.init());
