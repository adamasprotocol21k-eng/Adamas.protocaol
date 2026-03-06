// --- ADAMAS PROTOCOL OFFICIAL ENGINE ---
const CONTRACT_ADDR = "0x6DbC17D9950e0b3A7627ec6bFc6b210A998da690";
const LOGO_IMG = "https://via.placeholder.com/240/ffcc00/000000?text=ADS+LOGO"; // 👈 Apne Logo ka path yahan daalein

let tasks = { t1: false, t2: false, t3: false };
let puzzleOrder = [0, 1, 2, 3];
let currentPuzzle = [];
let timeLeft = 15;

// 1. Gateway Logic (Community Building)
function doTask(id, url) {
    window.open(url, '_blank');
    tasks['t' + id] = true;
    document.getElementById('t' + id).classList.add('done');
    document.getElementById('t' + id).innerText += " ✅";
    
    if (tasks.t1 && tasks.t2 && tasks.t3) {
        let btn = document.getElementById('enter-btn');
        btn.disabled = false;
        btn.style.opacity = "1";
        btn.style.cursor = "pointer";
    }
}

function showDashboard() {
    document.getElementById('gateway').style.display = 'none';
    document.getElementById('main-dashboard').style.display = 'block';
    initPuzzle();
}

// 2. Logo Puzzle Logic (0-3000 ABP)
function initPuzzle() {
    const board = document.getElementById('puzzle-board');
    board.innerHTML = '';
    currentPuzzle = [...puzzleOrder].sort(() => Math.random() - 0.5);
    renderPuzzle();
}

function renderPuzzle() {
    const board = document.getElementById('puzzle-board');
    board.innerHTML = '';
    currentPuzzle.forEach((pos, i) => {
        const div = document.createElement('div');
        div.className = 'piece';
        div.style.backgroundImage = `url('${LOGO_IMG}')`;
        div.style.backgroundPosition = `${(pos % 2) * -120}px ${Math.floor(pos / 2) * -120}px`;
        div.onclick = () => swapPieces(i);
        board.appendChild(div);
    });
}

let sel = null;
function swapPieces(i) {
    if (sel === null) { sel = i; document.querySelectorAll('.piece')[i].style.borderColor = '#ffcc00'; }
    else {
        [currentPuzzle[sel], currentPuzzle[i]] = [currentPuzzle[i], currentPuzzle[sel]];
        sel = null; renderPuzzle();
    }
}

function verifyLogo() {
    if (currentPuzzle.every((v, i) => v === i)) {
        let win = Math.floor(Math.random() * 3001);
        document.getElementById('pts').innerText = win;
        document.getElementById('reward-modal').style.display = 'flex';
    } else { alert("❌ Logo galat hai! Sahi se jodein. 😊"); }
}

function closeModal() { document.getElementById('reward-modal').style.display = 'none'; initPuzzle(); timeLeft = 15; }

// 3. Web3 Connection Placeholder (Using your ABI)
async function connectWallet() {
    if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3.eth.getAccounts();
        alert("Wallet Connected: " + accounts[0]);
        // Yahan aap contract interaction (balanceOf) add kar sakte hain
    } else { alert("Metamask install karein!"); }
}

// Global Timer
setInterval(() => {
    if(document.getElementById('main-dashboard').style.display === 'block') {
        timeLeft--;
        document.getElementById('timer').innerText = timeLeft;
        if (timeLeft <= 0) { initPuzzle(); timeLeft = 15; }
    }
}, 1000);
