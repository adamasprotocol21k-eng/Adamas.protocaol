/**
 * ADAMAS PROTOCOL - CORE INTERACTION ENGINE
 * Premium Logic for: Typing -> Transition -> Task Validation -> Web3
 */

// 1. DYNAMIC TYPING LOGIC (Cinematic Entrance)
const logoText = "ADAMAS PROTOCOL";
const typingEl = document.getElementById('typing-logo');
let charIdx = 0;

function typeLogo() {
    if (typingEl && charIdx < logoText.length) {
        typingEl.innerHTML += logoText.charAt(charIdx);
        charIdx++;
        // 80ms speed for a more energetic feel
        setTimeout(typeLogo, 80); 
    }
}

// Kickstart typing on load
window.onload = typeLogo;

// 2. PHASE TRANSITION (Landing -> Portal)
window.startJourney = function() {
    const phaseIntro = document.getElementById('phase-intro');
    const phaseSocial = document.getElementById('phase-social');

    if (phaseIntro && phaseSocial) {
        // Adding a slight fade-out effect before switching
        phaseIntro.style.opacity = '0';
        phaseIntro.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            phaseIntro.classList.remove('active');
            phaseSocial.classList.add('active');
        }, 400);
    }
};

// 3. NODE VALIDATION LOGIC (The Task Guard)
let tasksDone = 0;

window.verifyTask = function(el) {
    const statusBox = el.querySelector('.node-status');
    const currentStatus = el.getAttribute('data-status');

    if (currentStatus === 'pending') {
        // Mark as completed
        el.setAttribute('data-status', 'completed');
        
        // Premium Visual Feedback (Matches New CSS)
        el.style.borderColor = 'var(--cyan)';
        el.style.background = 'rgba(0, 242, 255, 0.08)';
        
        if (statusBox) {
            statusBox.innerText = 'VERIFIED';
            statusBox.style.color = '#00ff88';
            statusBox.style.textShadow = '0 0 10px #00ff88';
        }
        
        tasksDone++;
        checkValidation();
    }
};

function checkValidation() {
    // Enable wallet button only if both Social Nodes are hit
    if (tasksDone >= 2) {
        const connectBtn = document.getElementById('connect-wallet-btn');
        const instruction = document.getElementById('wallet-instruction');
        
        if (connectBtn) {
            connectBtn.disabled = false;
            connectBtn.classList.add('btn-active-blink'); // Start the Neon Pulse
            connectBtn.innerText = "INITIALIZE PROTOCOL CONNECTION";
        }
        
        if (instruction) {
            instruction.innerText = "NODES VERIFIED. READY TO CONNECT.";
            instruction.style.color = 'var(--cyan)';
        }
    }
}

// 4. WEB3 / METAMASK ENGINE (The Final Link)
window.connectWeb3 = async function() {
    const connectBtn = document.getElementById('connect-wallet-btn');

    if (window.ethereum) {
        try {
            connectBtn.innerText = "PENDING CONFIRMATION...";
            connectBtn.classList.remove('btn-active-blink'); // Stop blink during request
            
            // Trigger MetaMask Popup
            const accounts = await window.ethereum.request({ 
                method: 'eth_requestAccounts' 
            });

            if (accounts.length > 0) {
                const userAddress = accounts[0];
                
                // Final Success Feedback
                connectBtn.style.background = "#00ff88";
                connectBtn.style.color = "#000";
                connectBtn.innerText = "IDENTITY SECURED";
                
                console.log("Adamas User Authenticated:", userAddress);
                
                // Store wallet for dashboard use
                localStorage.setItem('adamas_user', userAddress);

                // FINAL REDIRECT: Transition to Dashboard
                setTimeout(() => {
                    alert("Protocol Unlocked. Loading Dashboard...");
                    // window.location.href = "dashboard.html"; 
                }, 1200);
            }
        } catch (err) {
            console.error("Auth Failed", err);
            connectBtn.innerText = "CONNECTION FAILED";
            connectBtn.classList.add('btn-active-blink'); // Resume blink for retry
            
            setTimeout(() => {
                connectBtn.innerText = "INITIALIZE PROTOCOL CONNECTION";
            }, 2500);
        }
    } else {
        alert("Web3 Provider not found. Please install MetaMask to enter Adamas.");
    }
};
