let db, userWallet = "", balance = 0, mineChances = 50;

// 🟢 INITIALIZE
window.onload = async () => {
    try {
        db = firebase.firestore();
        setupMaintenance();
        if (window.ethereum && window.ethereum.selectedAddress) connectWallet();
    } catch (e) { console.error("Firebase fail"); }
};

// 🛠️ MAINTENANCE LOGIC
function setupMaintenance() {
    db.collection("admin_settings").doc("maintenance").onSnapshot(doc => {
        const screen = document.getElementById('maintenance-screen');
        if (doc.exists && doc.data().isActive) screen.style.display = 'flex';
        else screen.style.display = 'none';
    });
}

// 🔐 WALLET CONNECT
window.connectWallet = async () => {
    if (!window.ethereum) return alert("Install MetaMask");
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    userWallet = accounts[0].toLowerCase();
    
    const userRef = db.collection("users").doc(userWallet);
    const doc = await userRef.get();
    
    if (!doc.exists) {
        await userRef.set({ balance: 100, mineChances: 50, createdAt: new Date() });
    }
    
    document.getElementById('landing').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    startSync();
};

function startSync() {
    db.collection("users").doc(userWallet).onSnapshot(doc => {
        if (doc.exists) {
            balance = doc.data().balance;
            mineChances = doc.data().mineChances;
            updateUI();
        }
    });
}

function updateUI() {
    document.getElementById('ads-balance').innerText = balance.toLocaleString();
    document.getElementById('userAddress').innerText = userWallet.substring(0,6)+"..."+userWallet.slice(-4);
    let prg = (balance / 5000) * 100;
    document.getElementById('w-progress').style.width = Math.min(prg, 100) + "%";
    document.getElementById('w-percent').innerText = Math.floor(Math.min(prg, 100)) + "%";
    document.getElementById('withdrawBtn').disabled = balance < 5000;
}

// 🎰 SLOTS LOGIC
window.playSlots = () => {
    if (balance < 50) return alert("Need 50 ABP");
    updateDB(-50);
    const cards = ['A','K','Q','J','10'];
    const s1 = document.getElementById('s1'), s2 = document.getElementById('s2'), s3 = document.getElementById('s3');
    
    let spin = setInterval(() => {
        [s1,s2,s3].forEach(s => s.innerText = cards[Math.floor(Math.random()*5)]);
    }, 100);
    
    setTimeout(() => {
        clearInterval(spin);
        const results = [cards[Math.floor(Math.random()*5)], cards[Math.floor(Math.random()*5)], cards[Math.floor(Math.random()*5)]];
        s1.innerText = results[0]; s2.innerText = results[1]; s3.innerText = results[2];
        
        let win = 0;
        if(results[0]===results[1] && results[1]===results[2]) {
            if(results[0]==='A') win = 1500; else if(results[0]==='K') win = 900;
            else if(results[0]==='Q') win = 600; else if(results[0]==='J') win = 300;
        }
        if(win > 0) triggerWin(win);
    }, 1200);
};

// 🎊 WIN CELEBRATION
function triggerWin(amt) {
    updateDB(amt);
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    document.getElementById('win-amount').innerText = `+${amt} ABP`;
    document.getElementById('win-overlay').style.display = 'flex';
}

function updateDB(amt) {
    db.collection("users").doc(userWallet).update({ 
        balance: firebase.firestore.FieldValue.increment(amt) 
    });
}

window.closeWinOverlay = () => document.getElementById('win-overlay').style.display = 'none';
window.openPopup = (id) => document.getElementById(id).style.display = 'flex';
window.closePopup = (id) => document.getElementById(id).style.display = 'none';
