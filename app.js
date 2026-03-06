// --- 1. CONFIGURATION ---
const MAINTENANCE_MODE = false; // Isse FALSE rakhne par maintenance screen dikhega
const CONTRACT_ADDR = "0x6DbC17D9950e0b3A7627ec6bFc6b210A998da690";
const LOGO_URL = "assets/logo.png"; // Aapka logo

// --- 2. MAINTENANCE LOGIC ---
function initApp() {
    if (MAINTENANCE_MODE) {
        document.getElementById('maintenance-screen').style.display = 'flex';
    } else {
        document.getElementById('gateway').style.display = 'block';
    }
}

/ Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCJ2i6r8F66CxKpnbwMEhPS4pwC36V0Kgg",
  authDomain: "adamas-protocol.firebaseapp.com",
  databaseURL: "https://adamas-protocol-default-rtdb.firebaseio.com",
  projectId: "adamas-protocol",
  storageBucket: "adamas-protocol.firebasestorage.app",
  messagingSenderId: "207788425238",
  appId: "1:207788425238:web:025b8544f085dde60af537",
  measurementId: "G-NVCWQ1XQZS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// --- 3. SOCIAL TASKS ---
let tasks = { ch: false, gr: false, tw: false };
function verifySocial(type, url) {
    window.open(url, '_blank');
    tasks[type] = true;
    document.getElementById(type + '-btn').style.borderColor = "#00f2ff";
    if(tasks.ch && tasks.gr && tasks.tw) document.getElementById('unlock-btn').disabled = false;
}

function unlockPortal() {
    document.getElementById('gateway').style.display = 'none';
    document.getElementById('main-dashboard').style.display = 'block';
    initPuzzle();
}

async function saveUserToDB(walletAddress) {
    const userRef = db.collection("users").doc(walletAddress);
    const doc = await userRef.get();

    if (!doc.exists) {
        // Naya User: Database mein entry banayein
        await userRef.set({
            address: walletAddress,
            abp_balance: 0,
            tasks_completed: false,
            joined_at: firebase.firestore.FieldValue.serverTimestamp()
        });
        console.log("Naya Diamond Member register ho gaya! 💎");
    } else {
        // Purana User: Uska balance UI mein dikhayein
        const userData = doc.data();
        document.getElementById('ads-balance').innerText = userData.abp_balance + " ABP";
        console.log("Purana member wapas aaya!");
    }
}

// --- 4. WEB3 WALLET ---
async function connectWallet() {
    if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        const walletAddress = accounts[0]; // Wallet address pakda
        document.getElementById('walletBtn').innerText = walletAddress.slice(0,6) + "...";
        
        // 🔥 YE LINE ADD KAREIN (Database Sync Trigger)
        await saveUserToDB(walletAddress); 
        
        alert("Wallet Connected & Data Synced! 💎");
    } else { 
        alert("Install Metamask!"); 
    }
}

// --- 5. LOGO PUZZLE ---
let puzzleOrder = [0,1,2,3];
let currentPos = [];
function initPuzzle() {
    currentPos = [...puzzleOrder].sort(() => Math.random() - 0.5);
    renderPuzzle();
}

function renderPuzzle() {
    const board = document.getElementById('puzzle-board');
    board.innerHTML = '';
    currentPos.forEach((val, i) => {
        const div = document.createElement('div');
        div.className = 'piece';
        div.style.backgroundImage = `url('${LOGO_URL}')`;
        div.style.backgroundPosition = `${(val % 2) * -120}px ${Math.floor(val / 2) * -120}px`;
        div.onclick = () => {
            if(window.sel === undefined) { window.sel = i; div.style.boxShadow = "0 0 10px #00f2ff"; }
            else { [currentPos[window.sel], currentPos[i]] = [currentPos[i], currentPos[window.sel]]; window.sel = undefined; renderPuzzle(); }
        };
        board.appendChild(div);
    });
}
async function checkWin() {
    if (currentPos.every((v, i) => v === i)) {
        // 1. Ek random reward generate karein
        let reward = Math.floor(Math.random() * 3001);
        alert("🏆 Win! " + reward + " ABP");

        // 2. Database mein points update karein
        if (typeof userAccount !== 'undefined' && userAccount !== null) {
            const userRef = db.collection("users").doc(userAccount);
            try {
                await userRef.update({
                    abp_balance: firebase.firestore.FieldValue.increment(reward)
                });
                // 3. UI par balance update karein
                const doc = await userRef.get();
                document.getElementById('ads-balance').innerText = doc.data().abp_balance + " ABP";
                console.log("Points Saved Successfully! ✅");
            } catch (error) {
                console.error("Error saving points:", error);
            }
        } else {
            alert("Pehle Wallet Connect karein!");
        }
        initPuzzle();
    } else {
        alert("❌ Galat hai!");
    }
}

window.onload = initApp;

async function updateLeaderboard() {
    const leaderboardDiv = document.getElementById('leaderboard-list');
    try {
        // Database se top 10 users fetch karna balance ke hisab se
        const snapshot = await db.collection("users")
            .orderBy("abp_balance", "desc")
            .limit(10)
            .get();

        let html = "";
        let rank = 1;
        snapshot.forEach(doc => {
            const data = doc.data();
            const shortAddr = data.address.slice(0, 6) + "..." + data.address.slice(-4);
            html += `<div style="display:flex; justify-content:space-between; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
                        <span>${rank}. ${shortAddr}</span>
                        <span style="color:#00f2ff;">${data.abp_balance} ABP</span>
                     </div>`;
            rank++;
        });
        leaderboardDiv.innerHTML = html || "No rankings yet. Be the first!";
    } catch (e) {
        console.error("Leaderboard error:", e);
    }
}

// Har 30 second mein leaderboard refresh karein
setInterval(updateLeaderboard, 30000);

