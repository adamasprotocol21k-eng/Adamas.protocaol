// ==========================================
// 💎 ADS PROTOCOL: FINAL VERIFIED ALL-IN-ONE
// ==========================================
let currentUserWallet = ""; 
let db;

if (typeof firebase !== 'undefined') {
    if (!firebase.apps.length) { firebase.initializeApp(firebaseConfig); }
    db = firebase.firestore();
}

// 1. Sabse pehle Wallet Connect
async function connectWallet() {
    if (window.ethereum) {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            currentUserWallet = accounts[0]; 
            const btn = document.getElementById('wallet-btn');
            if(btn) btn.innerText = currentUserWallet.substring(0, 6) + "..." + currentUserWallet.substring(38);

            // Wallet connect hote hi Pop-up dikhana
            document.getElementById("social-lock").style.display = "flex";
            loadUserData(currentUserWallet);
        } catch (e) { alert("Connection rejected!"); }
    } else { alert("Use MetaMask/Trust Wallet Browser!"); }
}

// 2. User Data Load
async function loadUserData(wallet) {
    const userRef = db.collection("users").doc(wallet);
    const doc = await userRef.get();
    if (!doc.exists) {
        await userRef.set({ points: 0, wallet: wallet, hasJoinedSocials: false, lastCheckIn: null, stakedAmount: 0, lockUntil: 0 });
        document.getElementById("user-points").innerText = "0.00 ABP";
    } else {
        const data = doc.data();
        document.getElementById("user-points").innerText = (data.points || 0) + " ABP";
        if(data.hasJoinedSocials) { unlockDashboard(); }
    }
}

// 3. Verify & Instant Unlock
async function verifyAndUnlock() {
    unlockDashboard(); // Turant parda hatao
    if (currentUserWallet) {
        try {
            const userRef = db.collection("users").doc(currentUserWallet);
            await userRef.set({ points: firebase.firestore.FieldValue.increment(500), hasJoinedSocials: true }, { merge: true });
        } catch (e) { console.log("Sync delay..."); }
    }
}

function unlockDashboard() {
    const lock = document.getElementById("social-lock");
    if(lock) lock.style.display = "none";
    const grid = document.getElementById("main-grid");
    if(grid) { grid.style.filter = "none"; grid.style.pointerEvents = "auto"; }
}

// 🃏 GAME: TRIPLE CARD
const cardSymbols = ['A', 'K', 'Q', 'J', '10', '9'];
async function playTripleCard() {
    if (!currentUserWallet) return alert("❌ Connect Wallet!");
    const userRef = db.collection("users").doc(currentUserWallet);
    const doc = await userRef.get();
    if (doc.data().points < 50) return alert("😔 50 ABP chahiye!");
    await userRef.update({ points: firebase.firestore.FieldValue.increment(-50) });
    let count = 0;
    const inv = setInterval(() => {
        const res = [cardSymbols[Math.floor(Math.random()*6)], cardSymbols[Math.floor(Math.random()*6)], cardSymbols[Math.floor(Math.random()*6)]];
        document.getElementById("cards-container").innerHTML = `<span>${res[0]}</span><span>${res[1]}</span><span>${res[2]}</span>`;
        if (++count > 15) { clearInterval(inv); calculateWin(res, userRef); }
    }, 80);
}

async function calculateWin(cards, userRef) {
    let win = (cards[0]===cards[1] && cards[1]===cards[2]) ? (cards[0]==='A'?1000:500) : 0;
    if(win > 0) await userRef.update({ points: firebase.firestore.FieldValue.increment(win) });
    loadUserData(currentUserWallet);
}

// 💣 GAME: DIAMOND MINES
let bombLocation = -1;
let isMinesActive = false;
async function startMinesGame() {
    const userRef = db.collection("users").doc(currentUserWallet);
    const doc = await userRef.get();
    if (doc.data().lockUntil > Date.now()) return alert("⚠️ Locked!");
    if (doc.data().points < 100) return alert("😔 100 ABP chahiye!");
    await userRef.update({ points: firebase.firestore.FieldValue.increment(-100) });
    bombLocation = Math.floor(Math.random() * 9);
    isMinesActive = true;
    document.querySelectorAll("#mines-grid button").forEach(b => { b.innerText = "❓"; b.disabled = false; b.style.background = ""; });
    loadUserData(currentUserWallet);
}

async function openMine(idx) {
    if (!isMinesActive) return;
    const userRef = db.collection("users").doc(currentUserWallet);
    if (idx === bombLocation) {
        isMinesActive = false;
        await userRef.update({ lockUntil: Date.now() + 60000 });
        alert("💥 BOOM!");
    } else {
        await userRef.update({ points: firebase.firestore.FieldValue.increment(200) });
        loadUserData(currentUserWallet);
    }
}

// 📅 STAKING & DAILY
async function dailyCheckIn() {
    const userRef = db.collection("users").doc(currentUserWallet);
    const doc = await userRef.get();
    if (Date.now() - (doc.data().lastCheckIn || 0) < 86400000) return alert("⏳ Kal aana!");
    await userRef.update({ lastCheckIn: Date.now(), points: firebase.firestore.FieldValue.increment(100) });
    loadUserData(currentUserWallet);
}

async function stakePoints() {
    const amt = parseInt(document.getElementById("stake-input").value);
    const userRef = db.collection("users").doc(currentUserWallet);
    const doc = await userRef.get();
    if (doc.data().points < amt) return alert("Low balance!");
    await userRef.update({ points: firebase.firestore.FieldValue.increment(-amt), stakedAmount: firebase.firestore.FieldValue.increment(amt) });
    loadUserData(currentUserWallet);
}

// 🏆 LEADERBOARD & INITIALIZE
async function loadLeaderboard() {
    const snap = await db.collection("users").orderBy("points", "desc").limit(5).get();
    let html = "";
    snap.forEach((doc, i) => { html += `<p>${i+1}. ${doc.id.substring(0,6)}... — ${doc.data().points} ABP</p>`; });
    document.getElementById("leaderboard-list").innerHTML = html;
}

window.onload = async () => {
    if (window.ethereum) {
        const acc = await ethereum.request({ method: 'eth_accounts' });
        if (acc.length > 0) { currentUserWallet = acc[0]; loadUserData(acc[0]); }
    }
    loadLeaderboard();
};
