// [cite: 2026-02-24, 2026-02-28, 2026-02-26]
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc, increment, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { firebaseConfig, CONTRACT_ADDRESS, AMOY_CHAIN_ID } from "./config.js";

// Global Instances
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const ABI = [
    "function balanceOf(address owner) view returns (uint256)", 
    "function decimals() view returns (uint8)"
];

let wallet, contract, userAddress;
let clickCounter = 0;

// Initialize Core Session
async function init() {
    if (!window.ethereum) {
        showToast("Please install MetaMask 🦊");
        return;
    }

    try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        userAddress = accounts[0];

        // Ensure Polygon Amoy Testnet [cite: 2026-02-24]
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        if (chainId !== AMOY_CHAIN_ID) {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: AMOY_CHAIN_ID }],
            });
        }

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

        // UI Transition
        document.getElementById('dashboard').classList.remove('hidden');
        document.getElementById('dashboard').scrollIntoView({ behavior: 'smooth' });
        document.getElementById('connectBtn').innerText = "ONLINE";
        document.getElementById('userAddr').innerText = userAddress.substring(0,6) + "..." + userAddress.substring(38);

        // Fetch Data [cite: 2026-02-28]
        refreshDashboard();
    } catch (err) {
        console.error("Initialization error", err);
    }
}

async function refreshDashboard() {
    // 1. Blockchain Data [cite: 2026-02-26]
    try {
        const bal = await contract.balanceOf(userAddress);
        const dec = await contract.decimals();
        document.getElementById('tokenBalance').innerText = parseFloat(ethers.utils.formatUnits(bal, dec)).toFixed(2);
    } catch (e) { console.warn("BC Sync Failed"); }

    // 2. Firebase Data [cite: 2026-02-26, 2026-02-28]
    const userRef = doc(db, "Users", userAddress);
    const snap = await getDoc(userRef);
    
    if (snap.exists()) {
        document.getElementById('totalABP').innerText = snap.data().totalABP || 0;
    } else {
        await setDoc(userRef, { 
            walletAddress: userAddress, 
            totalABP: 0, 
            lastLogin: new Date(),
            rank: "Diamond Elite" 
        });
    }
}

// Mining Logic: 10 Clicks = 1 ABP point synced to Firestore [cite: 2026-02-28]
async function playGame() {
    if (!userAddress) return;
    
    clickCounter++;
    const progress = (clickCounter / 10) * 100;
    document.getElementById('progressBar').style.width = progress + "%";
    document.getElementById('clickLabel').innerText = `${clickCounter} / 10 CLICKS`;

    if (clickCounter >= 10) {
        // Haptic feedback simulation
        if (window.navigator.vibrate) window.navigator.vibrate(50);
        
        const userRef = doc(db, "Users", userAddress);
        await updateDoc(userRef, { totalABP: increment(1) });
        
        clickCounter = 0;
        document.getElementById('progressBar').style.width = "0%";
        document.getElementById('clickLabel').innerText = `0 / 10 CLICKS`;
        
        refreshDashboard();
        showToast("ABP Point Mined! 💎");
    }
}

function showToast(msg) {
    // Simple alert for now, but integrated in professional style
    alert(msg);
}

// Global Exports
window.init = init;
window.playGame = playGame;
