import { monitorStatus, db, ref, set, get } from './firebase.js';

document.addEventListener('DOMContentLoaded', () => {
    monitorStatus(); // Sabse pehle maintenance check karein
    initUI();
});

// Premium Pop-up Logic for ABP Points
window.openClaimPopup = async () => {
    // Elegant Pop-up dikhane ke liye
    const currentPoints = document.getElementById('abpBalance').innerText;
    alert(`💎 Premium Reward: You have ${currentPoints} ABP available to claim!`);
    // Note: Isse aap ek custom modal mein bhi badal sakte hain
};

// Wallet Connection with Web3
async function connectWallet() {
    const btn = document.getElementById('walletBtn');
    
    if (typeof window.ethereum !== 'undefined') {
        try {
            btn.innerText = "Connecting... ⏳";
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const walletAddress = accounts[0];
            
            // UI Update
            btn.innerHTML = `<i data-lucide="check-circle"></i> ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
            btn.style.background = "linear-gradient(135deg, #00ff88, #0066ff)";
            
            // Save User to Firebase
            saveUserToDB(walletAddress);
            
            // Re-create icons for new elements
            lucide.createIcons();
            
        } catch (error) {
            btn.innerText = "Connect Wallet";
            console.error("User rejected the connection.");
        }
    } else {
        alert("🦊 Please install MetaMask or use a Web3 Browser!");
    }
}

// User Profile Creation in Database
async function saveUserToDB(address) {
    const userRef = ref(db, 'users/' + address);
    const snapshot = await get(userRef);
    
    if (!snapshot.exists()) {
        // Naya user hai toh welcome bonus dein (Notebook ke hisaab se 1000)
        await set(userRef, {
            wallet: address,
            points: 1000,
            lastLogin: new Date().toISOString(),
            isVerified: false
        });
        showGuide(); // Pehli baar user guide dikhayein
    }
}

// Toggle User Guide Popup
window.toggleGuide = () => {
    const guide = document.getElementById('guidePopup');
    guide.classList.toggle('hidden');
};

function initUI() {
    // Default ABP Points display logic
    document.getElementById('abpBalance').innerText = "1000.00";
}

// Global scope mein functions ko expose karein
window.connectWallet = connectWallet;
