let db, userWallet = "", balance = 0, mineChances = 50, tasks = {tw:false, tg1:false, tg2:false};

window.onload = async () => {
    try {
        db = firebase.firestore();
        setupMaintenance();
        if (window.ethereum && window.ethereum.selectedAddress) connectWallet();
    } catch(e) { console.log("Init error"); }
};

function setupMaintenance() {
    db.collection("admin_settings").doc("maintenance").onSnapshot(doc => {
        if(doc.exists && doc.data().isActive) document.getElementById('maintenance-screen').style.display = 'flex';
        else document.getElementById('maintenance-screen').style.display = 'none';
    });
}

window.connectWallet = async () => {
    if(!window.ethereum) return alert("Install MetaMask");
    const accs = await ethereum.request({ method: 'eth_requestAccounts' });
    userWallet = accs[0].toLowerCase();

    // ✅ Fix 1: Button Change
    const btn = document.getElementById('walletBtn');
    btn.innerText = "CONNECTED ✅";
    btn.style.background = "#fff";

    const userRef = db.collection("users").doc(userWallet);
    const doc = await userRef.get();
    if(!doc.exists || !doc.data().isVerified) {
        document.getElementById('landing').style.display = 'none';
        document.getElementById('social-modal').style.display = 'flex';
    } else {
        enterDashboard();
    }
};

function enterDashboard() {
    document.getElementById('landing').style.display = 'none';
    document.getElementById('social-modal').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    db.collection("users").doc(userWallet).onSnapshot(doc => {
        if(doc.exists) {
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
    document.getElementById('w-progress').style.width = Math.min(prg,100) + "%";
    document.getElementById('w-percent').innerText = Math.floor(Math.min(prg,100)) + "%";
    document.getElementById('withdrawBtn').disabled = balance < 5000;
}

// ✅ Fix 2: Task Check Logic
window.taskDone = (t) => {
    tasks[t] = true;
    if(tasks.tw && tasks.tg1 && tasks.tg2) {
        const vBtn = document.getElementById('verifyBtn');
        vBtn.disabled = false; vBtn.style.opacity = "1";
    }
};

window.finalVerify = async () => {
    await db.collection("users").doc(userWallet).set({ isVerified: true }, { merge: true });
    enterDashboard();
};

// ✅ Fix 3: Teen Patti Rewards (Notebook Rules)
window.playSlots = () => {
    if(balance < 50) return alert("50 ABP required");
    updateDB(-50);
    const items = ['A','K','Q','J','10'];
    let spin = setInterval(() => {
        document.getElementById('s1').innerText = items[Math.floor(Math.random()*5)];
        document.getElementById('s2').innerText = items[Math.floor(Math.random()*5)];
        document.getElementById('s3').innerText = items[Math.floor(Math.random()*5)];
    }, 100);

    setTimeout(() => {
        clearInterval(spin);
        const r = [items[Math.floor(Math.random()*5)], items[Math.floor(Math.random()*5)], items[Math.floor(Math.random()*5)]];
        document.getElementById('s1').innerText=r[0]; document.getElementById('s2').innerText=r[1]; document.getElementById('s3').innerText=r[2];
        
        let win = 0;
        if(r[0]===r[1] && r[1]===r[2]) {
            if(r[0]==='A') win=1500; else if(r[0]==='K') win=900;
            else if(r[0]==='Q') win=600; else if(r[0]==='J') win=300;
        }
        if(win > 0) triggerWin(win);
    }, 1200);
};

function triggerWin(a) {
    updateDB(a);
    confetti({ particleCount: 150, spread: 70 });
    document.getElementById('win-amount').innerText = `+${a} ABP`;
    document.getElementById('win-overlay').style.display = 'flex';
}

function updateDB(a) {
    db.collection("users").doc(userWallet).update({ balance: firebase.firestore.FieldValue.increment(a) });
}

window.closeWinOverlay = () => document.getElementById('win-overlay').style.display = 'none';
window.openPopup = (id) => {
    document.getElementById(id).style.display = 'flex';
    if(id === 'mine-modal') initMines();
};
window.closePopup = (id) => document.getElementById(id).style.display = 'none';

function initMines() {
    const grid = document.getElementById('mine-grid'); grid.innerHTML = '';
    const bomb = Math.floor(Math.random()*25);
    for(let i=0; i<25; i++) {
        let c = document.createElement('div'); c.className='cell'; c.innerText='❓';
        c.onclick = () => {
            if(i === bomb) {
                c.innerText='💣'; alert("LOCKED 30s"); closePopup('mine-modal');
            } else {
                c.innerText='💎'; updateDB(100);
            }
        };
        grid.appendChild(c);
    }
}
