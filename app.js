
// --- CONFIG & STATE ---
let balance = 0;
let userWallet = "";
let isStaking = false;
const db = firebase.firestore();

// --- WALLET SYNC ---
async function connectWallet() {
    if (window.ethereum) {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        userWallet = accounts[0];
        document.getElementById('walletBtn').innerText = "CONNECTED";
        loadData();
    } else { alert("Please install MetaMask"); }
}

function loadData() {
    db.collection("users").doc(userWallet).onSnapshot((doc) => {
        if (doc.exists) {
            balance = doc.data().balance || 0;
            isStaking = doc.data().isStaking || false;
            updateUI();
        } else {
            db.collection("users").doc(userWallet).set({ balance: 100, isStaking: false, lastCheckIn: 0 });
            document.getElementById('social-popup').style.display = 'flex';
        }
        document.getElementById('landing').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
    });
}

function updateUI() {
    document.getElementById('ads-balance').innerText = balance.toFixed(2);
    document.getElementById('userAddress').innerText = userWallet.substring(0, 6) + "..." + userWallet.slice(-4);
    document.getElementById('stk-status').innerText = isStaking ? "ACTIVE (1%)" : "INACTIVE";
    
    // Progress for Withdrawal (5000 ABP)
    let prg = (balance / 5000) * 100;
    document.getElementById('w-progress').style.width = Math.min(prg, 100) + "%";
    document.getElementById('withdrawBtn').disabled = balance < 5000;
}

// --- FEATURE 1: DIAMOND SLOTS (TEEN PATTI STYLE) ---
function playSlots() {
    if (balance < 50) return alert("Need 50 ABP!");
    addBalance(-50);
    
    const cards = ['A', 'K', 'Q', 'J', '10', '9'];
    const emojis = { 'A': '💎', 'K': '👑', 'Q': '👸', 'J': '⚔️', '10': '💰', '9': '🃏' };
    
    const c1 = document.getElementById('card1');
    const c2 = document.getElementById('card2');
    const c3 = document.getElementById('card3');

    // Start Spinning Animation
    [c1, c2, c3].forEach(c => c.classList.add('spinning'));

    setTimeout(() => {
        [c1, c2, c3].forEach(c => c.classList.remove('spinning'));
        
        let r1 = cards[Math.floor(Math.random() * cards.length)];
        let r2 = cards[Math.floor(Math.random() * cards.length)];
        let r3 = cards[Math.floor(Math.random() * cards.length)];

        c1.innerText = emojis[r1];
        c2.innerText = emojis[r2];
        c3.innerText = emojis[r3];

        // Win Logic
        if (r1 === r2 && r2 === r3) {
            let win = 0;
            if (r1 === 'A') win = 2000;
            else if (r1 === 'K') win = 1800;
            else if (r1 === 'Q') win = 1500;
            else win = 1000;
            
            alert("JACKPOT! You won " + win + " ABP");
            addBalance(win);
        } else {
            addBalance(Math.floor(Math.random() * 15) + 5); // Consolation
        }
    }, 1500);
}

// --- FEATURE 2: DIAMOND MINE ---
function initMineGame() {
    const grid = document.getElementById('mine-grid');
    grid.innerHTML = '';
    let bombPos = Math.floor(Math.random() * 25);

    for (let i = 0; i < 25; i++) {
        let cell = document.createElement('div');
        cell.className = 'cell';
        cell.onclick = () => {
            if (i === bombPos) {
                cell.innerText = '💣';
                alert("BOMB! Locked for 5 mins.");
                closePopup('mine-popup');
            } else {
                cell.innerText = '💎';
                addBalance(Math.floor(Math.random() * 50) + 10);
                cell.onclick = null;
            }
        };
        grid.appendChild(cell);
    }
}

// --- CORE UTILS ---
function addBalance(amt) {
    balance += amt;
    db.collection("users").doc(userWallet).update({ balance: balance });
}

function openPopup(id) {
    document.getElementById(id).style.display = 'flex';
    if (id === 'mine-popup') initMineGame();
}

function closePopup(id) { document.getElementById(id).style.display = 'none'; }

function verifyAndUnlock() {
    document.getElementById('social-popup').style.display = 'none';
}
