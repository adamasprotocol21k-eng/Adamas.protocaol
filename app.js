let db, balance = 0, userWallet = "";
let mineChances = 50;
let isStaking = false;

window.onload = () => {
    try {
        db = firebase.firestore();
        setupLiveMaintenance();
    } catch(e) { console.error("Initialize Failed: Firebase Config?"); }
};

function setupLiveMaintenance() {
    db.collection("admin_settings").doc("maintenance").onSnapshot(doc => {
        const screen = document.getElementById('maintenance-screen');
        if (doc.exists && doc.data().isActive) screen.style.display = 'flex';
        else screen.style.display = 'none';
    });
}

window.connectWallet = async () => {
    if (window.ethereum) {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        userWallet = accounts[0];
        document.getElementById('walletBtn').innerText = "CONNECTED";
        syncUserEcosystem();
    } else { alert("Install MetaMask"); }
};

function syncUserEcosystem() {
    db.collection("users").doc(userWallet).onSnapshot(doc => {
        if (doc.exists) {
            const data = doc.data();
            balance = data.balance || 0;
            mineChances = data.mineChances || 50;
            isStaking = data.isStaking || false;
            updateDashboard();
        } else {
            db.collection("users").doc(userWallet).set({ 
                balance: 100, 
                mineChances: 50, 
                isStaking: false,
                referrals: 0,
                createdAt: new Date()
            });
        }
        document.getElementById('landing').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
    });
}

function updateDashboard() {
    document.getElementById('ads-balance').innerText = balance.toLocaleString();
    document.getElementById('stk-status').innerText = isStaking ? "Active (1%)" : "Inactive";
    const prog = (balance / 5000) * 100;
    document.getElementById('w-progress').style.width = Math.min(prog, 100) + "%";
    document.getElementById('withdrawBtn').disabled = balance < 5000;
}

// GAME 1: SLOTS (Notebook Rules)
window.playSlots = () => {
    if(balance < 50) return alert("Low ABP!");
    updateDB(-50);
    const cards = ['A','K','Q','J','10'];
    const s1 = document.getElementById('s1'), s2 = document.getElementById('s2'), s3 = document.getElementById('s3');
    let spin = setInterval(() => {
        [s1,s2,s3].forEach(s => s.innerText = cards[Math.floor(Math.random()*5)]);
    }, 100);
    setTimeout(() => {
        clearInterval(spin);
        const r1 = s1.innerText, r2 = s2.innerText, r3 = s3.innerText;
        let win = 0;
        if(r1===r2 && r2===r3) {
            if(r1==='A') win = 1500; else if(r1==='K') win = 900; 
            else if(r1==='Q') win = 600; else if(r1==='J') win = 300;
        }
        updateDB(win);
        alert(win > 0 ? `JACKPOT! +${win} ABP` : "No Luck!");
    }, 1200);
};

// GAME 2: MINES (Notebook Rules)
window.initMineGrid = () => {
    const grid = document.getElementById('mine-grid');
    grid.innerHTML = '';
    const bomb = Math.floor(Math.random()*25);
    for(let i=0; i<25; i++) {
        let cell = document.createElement('div');
        cell.className = 'cell'; cell.innerText = '❓';
        cell.onclick = () => {
            if(mineChances <= 0) return alert("Daily Limit Reached!");
            if(i === bomb) {
                cell.innerText = '💣'; cell.style.background = 'red';
                alert("BOOM! 30s Lock.");
                window.closePopup('mine-modal');
            } else {
                cell.innerText = '💎';
                let rew = Math.floor(Math.random()*550) + 50;
                updateDB(rew);
                mineChances--;
                cell.onclick = null;
            }
        };
        grid.appendChild(cell);
    }
};

// UTILS
function updateDB(amt) {
    db.collection("users").doc(userWallet).update({ 
        balance: firebase.firestore.FieldValue.increment(amt),
        mineChances: mineChances
    });
}
window.openPopup = (id) => { 
    document.getElementById(id).style.display = 'flex'; 
    if(id === 'mine-modal') window.initMineGrid();
};
window.closePopup = (id) => document.getElementById(id).style.display = 'none';
