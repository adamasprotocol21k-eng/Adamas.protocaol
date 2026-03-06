import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc, increment, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { firebaseConfig, CONTRACT_ADDRESS, AMOY_CHAIN_ID } from "./config.js";

// Initialize Services
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const ABI = ["function balanceOf(address owner) view returns (uint256)", "function decimals() view returns (uint8)"];

let userAddress;
let localClicks = 0;

async function init() {
    if (!window.ethereum) return alert("MetaMask error: No provider detected. 🦊");

    try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        userAddress = accounts[0];

        // Network Switch: Adamas works on Polygon Amoy
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        if (chainId !== AMOY_CHAIN_ID) {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: AMOY_CHAIN_ID }],
            });
        }

        // Setup UI
        document.getElementById('dashboard').classList.remove('hidden');
        document.getElementById('connectBtn').innerText = "ONLINE";
        document.getElementById('userAddr').innerText = userAddress;

        syncAdamasData();
    } catch (err) { console.error("Auth Failure", err); }
}

async function syncAdamasData() {
    // 1. Blockchain Sync
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
        const bal = await contract.balanceOf(userAddress);
        const dec = await contract.decimals();
        document.getElementById('tokenBalance').innerText = parseFloat(ethers.utils.formatUnits(bal, dec)).toFixed(2);
    } catch (e) { console.warn("BC Sync issue."); }

    // 2. Firebase Sync
    const userRef = doc(db, "Users", userAddress);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
        document.getElementById('totalABP').innerText = snap.data().totalABP || 0;
    } else {
        await setDoc(userRef, { 
            walletAddress: userAddress, 
            totalABP: 0, 
            protocolRole: "Adamas Miner",
            joinDate: new Date()
        });
    }
}

async function playGame() {
    if (!userAddress) return;
    
    localClicks++;
    const progress = (localClicks / 10) * 100;
    document.getElementById('progressBar').style.width = progress + "%";
    document.getElementById('clickLabel').innerText = `${localClicks} / 10`;

    if (localClicks >= 10) {
        const userRef = doc(db, "Users", userAddress);
        await updateDoc(userRef, { totalABP: increment(1) });
        
        localClicks = 0;
        document.getElementById('progressBar').style.width = "0%";
        document.getElementById('clickLabel').innerText = "0 / 10";
        
        syncAdamasData(); // Refresh UI
        alert("Success! 1 ABP point mined for Adamas Protocol. 💎");
    }
}

window.init = init;
window.playGame = playGame;
