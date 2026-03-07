const db = firebase.firestore();
let balance = 0;
let userWallet = "";
let isStaking = false;

// 1. MAINTENANCE LISTENER
db.collection("admin_settings").doc("maintenance").onSnapshot((doc) => {
    if (doc.exists && doc.data().isActive) {
        document.getElementById('maintenance-screen').style.display = 'flex';
    } else {
        document.getElementById('maintenance-screen').style.display = 'none';
    }
});

// 2. WALLET CONNECT
async function connectWallet() {
    if (window.ethereum) {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        userWallet = accounts[0];
        document.getElementById('walletBtn').innerText = "SYNCED";
        startLiveSync();
    } else { alert("Install MetaMask"); }
}

// 3. LIVE DATA SYNC
function startLiveSync() {
    db.collection("users").doc(userWallet).onSnapshot((doc) => {
        if (doc.exists) {
            const data = doc.data();
            balance = data.balance || 0;
            isStaking = data.isStaking || false;
            updateUI();
        } else {
            db.collection("users").doc(userWallet).set({ balance: 100, isStaking: false });
        }
        document.getElementById('landing').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
    });
}

function updateUI() {
    document.getElementById('ads-balance').innerText = balance.toLocaleString();
    document.getElementById('userAddress').innerText = userWallet.substring(0,6)+"..."+userWallet.slice(-4);
    document.getElementById('stk-status').innerText = isStaking ? "ACTIVE (1%)" : "INACTIVE";
    let progress = (balance / 5000) * 100;
    document.getElementById('w-progress').style.width = Math.min(progress, 100) + "%";
    document.getElementById('withdrawBtn').disabled = balance < 5000;
}

// 4. GAME: SLOTS (TEEN PATTI STYLE)
function playSlots() {
    if (balance < 50) return alert("Low ABP!");
    updateDBBalance(-50);
    
    const icons = ['💎', '👑', '👸', '⚔️', '💰'];
    const s1 = document.getElementById('s1'), s2 = document.getElementById('s2'), s3 = document.getElementById('s3');
    
    let interval = setInterval(() => {
        s1.innerText = icons[Math.floor(Math.random()*icons.length)];
        s2.innerText = icons[Math.floor(Math.random()*icons.length)];
        s3.innerText = icons[Math.floor(Math.random()*icons.length)];
    }, 100);

    setTimeout(() => {
        clearInterval(interval);
        const r1 = icons[Math.floor(Math.random()*icons.length)];
        const r2 = icons[Math.floor(Math.random()*icons.length)];
        const r3 = icons[Math.floor(Math.random()*icons.length)];
        s1.innerText = r1; s2.innerText = r2; s3.innerText = r3;

        if (r1 === r2 && r2 === r3) {
            let win = (r1 === '💎') ? 2000 : 1000;
            alert("WINNER! +" + win);
            updateDBBalance(win);
        }
    }, 1500);
}

// 5. UTILS
function updateDBBalance(amt) {
    db.collection("users").doc(userWallet).update({ balance: balance + amt });
}

window.openPopup = (id) => { 
    document.getElementById(id).style.display = 'flex'; 
    if(id === 'mine-modal') initMineGrid(); 
};
window.closePopup = (id) => { document.getElementById(id).style.display = 'none'; };

