/**
 * ADAMAS PROTOCOL - Quantum Navigation Engine
 */

const Navigation = {
    init() {
        const navHTML = `
        <div id="quantum-nav-container" style="
            position: fixed; bottom: 15px; left: 50%; transform: translateX(-50%);
            width: 90%; max-width: 400px; z-index: 10000;
        ">
            <nav style="
                background: rgba(5, 5, 10, 0.6); backdrop-filter: blur(25px) saturate(150%);
                border: 1px solid rgba(0, 242, 255, 0.2); 
                display: flex; justify-content: space-around; align-items: center;
                padding: 12px 10px; border-radius: 25px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.8), inset 0 0 10px rgba(0, 242, 255, 0.1);
            ">
                <div onclick="window.location.href='dashboard.html'" class="nav-item">
                    <div class="nav-icon">🏟️</div>
                    <div class="nav-text">HUB</div>
                </div>
                
                <div onclick="window.location.href='game.html'" class="nav-item">
                    <div class="nav-icon">⚔️</div>
                    <div class="nav-text">QUESTS</div>
                </div>

                <div onclick="window.location.href='staking.html'" style="
                    position: relative; top: -25px;
                    background: linear-gradient(135deg, #00f2ff, #ff00ff);
                    width: 65px; height: 65px; border-radius: 22px;
                    display: flex; flex-direction: column; justify-content: center; align-items: center;
                    border: 4px solid #020205; transform: rotate(45deg);
                    box-shadow: 0 0 30px rgba(0, 242, 255, 0.5);
                    transition: 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                " class="center-nav">
                    <div style="transform: rotate(-45deg); font-size: 1.5rem; filter: drop-shadow(0 0 5px #fff);">💎</div>
                </div>

                <div onclick="window.location.href='referral.html'" class="nav-item">
                    <div class="nav-icon">🛰️</div>
                    <div class="nav-text">FLEET</div>
                </div>

                <div onclick="window.location.href='wallet.html'" class="nav-item">
                    <div class="nav-icon">💳</div>
                    <div class="nav-text">VAULT</div>
                </div>
            </nav>
        </div>

        <style>
            .nav-item { text-align: center; cursor: pointer; transition: 0.3s; padding: 5px 10px; border-radius: 12px; }
            .nav-item:active { background: rgba(0, 242, 255, 0.1); transform: translateY(-3px); }
            .nav-icon { font-size: 1.2rem; filter: grayscale(100%); transition: 0.3s; }
            .nav-item:hover .nav-icon { filter: grayscale(0%); transform: scale(1.2); }
            .nav-text { font-size: 0.55rem; color: #666; font-weight: 800; letter-spacing: 1px; margin-top: 4px; font-family: 'Orbitron'; }
            .center-nav:active { transform: rotate(45deg) scale(0.9); box-shadow: 0 0 50px var(--neon-cyan); }
        </style>
        `;

        const placeholder = document.getElementById('navbar-placeholder');
        if (placeholder) placeholder.innerHTML = navHTML;
    }
};

document.addEventListener('DOMContentLoaded', () => Navigation.init());
