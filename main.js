/**
 * ADAMAS PROTOCOL - MASTER ENGINE
 * Updates: Polygon Amoy Strict Check & Real Wallet Auth
 */

const logoText = "ADAMAS PROTOCOL";
const typingEl = document.getElementById('typing-logo');
let charIdx = 0;

function typeLogo() {
    if (typingEl && charIdx < logoText.length) {
        typingEl.innerHTML += logoText.charAt(charIdx);
        charIdx++;
        setTimeout(typeLogo, 80); 
    }
}
window.onload = typeLogo;

window.startJourney = function() {
    const phaseIntro = document.getElementById('phase-intro');
    const phaseSocial = document.getElementById('phase-social');
    if (phaseIntro && phaseSocial) {
        phaseIntro.style.opacity = '0';
        phaseIntro.style.transform = 'scale(0.9)';
        setTimeout(() => {
            phaseIntro.classList.remove('active');
            phaseSocial.classList.add('active');
        }, 400);
    }
};

let tasksDone = 0;
window.verifyTask = function(el) {
    const statusBox = el.querySelector('.node-status');
    const currentStatus = el.getAttribute('data-status');

    if (currentStatus === 'pending') {
        const taskName = el.querySelector('.node-name').innerText;
        if(taskName.includes("TELEGRAM")) {
            window.open('https://t.me/your_telegram_channel', '_blank');
        } else {
            window.open('https://x.com/your_profile', '_blank');
        }

        el.setAttribute('data-status', 'completed');
        el.style.borderColor = 'var(--cyan)';
        el.style.background = 'rgba(0, 242, 255, 0.1)';
        
        if (statusBox) {
            statusBox.innerText = 'VERIFIED';
            statusBox.style.color = '#00ff88';
        }
        
        tasksDone++;
        checkValidation();
    }
};

function checkValidation() {
    if (tasksDone >= 2) {
        const connectBtn = document.getElementById('connect-wallet-btn');
        if (connectBtn) {
            connectBtn.disabled = false;
            connectBtn.classList.add('btn-active-blink');
            connectBtn.innerText = "INITIALIZE PROTOCOL CONNECTION";
        }
    }
}

// --- REAL WEB3 ENGINE START ---
window.connectWeb3 = async function() {
    const connectBtn = document.getElementById('connect-wallet-btn');

    if (window.ethereum) {
        try {
            connectBtn.innerText = "VERIFYING NETWORK...";
            
            // 1. Check for Polygon Amoy (Chain ID: 80002 -> 0x13882)
            const chainId = await window.ethereum.request({ method: 'eth_chainId' });
            if (chainId !== '0x13882') {
                try {
                    await window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: '0x13882' }],
                    });
                } catch (switchError) {
                    // Agar Amoy wallet mein added nahi hai
                    if (switchError.code === 4902) {
                        alert("Please add Polygon Amoy Testnet to your MetaMask.");
                    }
                    return;
                }
            }

            // 2. Real Account Request (Popup aayega)
            connectBtn.innerText = "WAITING FOR SIGNATURE...";
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

            if (accounts.length > 0) {
                const userAddress = accounts[0];
                localStorage.setItem('adamas_user', userAddress); // Real Address Save
                
                connectBtn.style.background = "#00ff88";
                connectBtn.style.color = "#000";
                connectBtn.innerText = "PROTOCOL SECURED";
                
                setTimeout(() => { window.location.href = "dashboard.html"; }, 1000);
            }
        } catch (err) {
            console.error(err);
            connectBtn.innerText = "CONNECTION DENIED";
            setTimeout(() => { connectBtn.innerText = "INITIALIZE PROTOCOL CONNECTION"; }, 2000);
        }
    } else {
        const dappUrl = window.location.href.split('//')[1];
        window.location.href = `https://metamask.app.link/dapp/${dappUrl}`;
    }
};
