// --- 1. CONFIGURATION ---
const MAINTENANCE_MODE = true; // Isse TRUE rakhne par maintenance screen dikhega
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

// --- 4. WEB3 WALLET ---
async function connectWallet() {
    if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        document.getElementById('walletBtn').innerText = accounts[0].slice(0,6) + "...";
        alert("Wallet Connected!");
    } else { alert("Install Metamask!"); }
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

function checkWin() {
    if (currentPos.every((v, i) => v === i)) { alert("🏆 Win! " + Math.floor(Math.random()*3001) + " ABP"); initPuzzle(); }
    else alert("❌ Galat hai!");
}

window.onload = initApp;

