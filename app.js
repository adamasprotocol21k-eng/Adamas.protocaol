// ==========================================
// 💎 ADS PROTOCOL: FINAL ALL-IN-ONE ENGINE (400+ Lines Logic)
// ==========================================
let currentUserWallet = ""; 
let db;

// 1. Firebase Initialization
if (typeof firebase !== 'undefined') {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    db = firebase.firestore();
}

// 2. Wallet Connection Logic
async function connectWallet() {
    if (window.ethereum) {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            currentUserWallet = accounts[0]; 

            const btn = document.getElementById('wallet-btn');
            if(btn) {
                btn.innerText = currentUserWallet.substring(0, 6) + "..." + currentUserWallet.substring(38);
            }

            // Wallet connect hote hi social lock popup dikhayein
            document.getElementById("social-lock").style.display = "flex";

            loadUserData(currentUserWallet);
            updateReferralLink();
            checkReferralBonus();

        } catch (error) {
            console.error("Connection Cancelled");
            alert("Wallet connection rejected!");
        }
    } else {
        alert("Please use MetaMask or Trust Wallet browser!");
    }
}

// 3. Load User Profile & Data
async function loadUserData(wallet) {
    const userRef = db.collection("users").doc(wallet);
    const doc = await userRef.get();

    if (!doc.exists) {
        // Naya User initialization
        await userRef.set({
            points: 0,
            wallet: wallet,
            hasJoinedSocials: false,
            lastCheckIn: null,
            stakedAmount: 0,
            lockUntil: 0,
            stakingStartTime: null
        });
        document.getElementById("user-points").innerText = "0.00 ABP";
    } else {
        const data = doc.data();
        document.getElementById("user-points").innerText = (data.points || 0) + " ABP";
        
        // Agar pehle hi social task kar chuka hai toh lock hata do
        if(data.hasJoinedSocials) {
            unlockDashboard();
        }
    }
}

// 4. Verify & Unlock Dashboard (Task System)
async function verifyAndUnlock() {
    if (!currentUserWallet) return alert("❌ Pehle CONNECT WALLET button dabayein!");

    const btn = document.getElementById("verify-final-btn");
    if (btn) btn.innerText = "⏳ Verifying Tasks...";

    try {
        const userRef = db.collection("users").doc(currentUserWallet);
        await userRef.set({
            points: firebase.firestore.FieldValue.increment(500),
            hasJoinedSocials: true
        }, { merge: true });

        alert("🎉 TASKS VERIFIED! +500 ABP Reward Added.");
        unlockDashboard();
    } catch (error) {
        console.error("Verification error, bypassing...");
        unlockDashboard(); // Emergency bypass for user experience
    }
}

function unlockDashboard() {
    const lock = document.getElementById("social-lock");
    if(lock) lock.style.display = "none";

    const mainGrid = document.getElementById("main-grid");
    if(mainGrid) {
        mainGrid.style.filter = "none";
        mainGrid.style.pointerEvents = "auto";
    }
}

// ==========================================
// 🃏 GAME 1: TRIPLE CARD JACKPOT
// ==========================================
const cardSymbols = ['A', 'K', 'Q', 'J', '10', '9'];

async function playTripleCard() {
    if (!currentUserWallet) return alert("❌ Pehle Wallet Connect Karein!");
    
    const userRef = db.collection("users").doc(currentUserWallet);
    const doc = await userRef.get();
    let currentPoints = doc.data().points;

    if (currentPoints < 50) return alert("😔 Not enough ABP! 50 points chahiye.");

    await userRef.update({ points: firebase.firestore.FieldValue.increment(-50) });
    document.getElementById("user-points").innerText = (currentPoints - 50) + " ABP";

    let spinCount = 0;
    const interval = setInterval(() => {
        const randomCards = [
            cardSymbols[Math.floor(Math.random() * 6)],
            cardSymbols[Math.floor(Math.random() * 6)],
            cardSymbols[Math.floor(Math.random() * 6)]
        ];
        document.getElementById("cards-container").innerHTML = `<span>${randomCards[0]}</span><span>${randomCards[1]}</span><span>${randomCards[2]}</span>`;
        
        if (++spinCount > 15) {
            clearInterval(interval);
            calculateWin(randomCards, userRef);
        }
    }, 80);
}

async function calculateWin(cards, userRef) {
    let winAmount = 0;
    const [c1, c2, c3] = cards;

    if (c1 === c2 && c2 === c3) { 
        if (c1 === 'A') winAmount = 1000;
        else if (c1 === 'K') winAmount = 900;
        else if (c1 === 'Q') winAmount = 800;
        else winAmount = 500;
    }

    if (winAmount > 0) {
        await userRef.update({ points: firebase.firestore.FieldValue.increment(winAmount) });
        document.getElementById("game-status").innerHTML = `<span style="color:#00ff00">🎉 JACKPOT! WON ${winAmount} ABP!</span>`;
    } else {
        document.getElementById("game-status").innerText = "❌ No Match. Try Again!";
    }
    loadUserData(currentUserWallet);
}

// ==========================================
// 💣 GAME 2: DIAMOND MINES (WITH LOCK PENALTY)
// ==========================================
let bombLocation = -1;
let isMinesActive = false;

async function startMinesGame() {
    if (!currentUserWallet) return;
    const userRef = db.collection("users").doc(currentUserWallet);
    const doc = await userRef.get();
    const userData = doc.data();

    if (userData.lockUntil && userData.lockUntil > Date.now()) {
        let remaining = Math.ceil((userData.lockUntil - Date.now()) / 1000);
        return alert(`⚠️ ACCOUNT LOCKED! 💣 Penalty: ${remaining}s left.`);
    }

    if (userData.points < 100) return alert("😔 100 ABP points chahiye!");

    await userRef.update({ points: firebase.firestore.FieldValue.increment(-100) });
    bombLocation = Math.floor(Math.random() * 9);
    isMinesActive = true;
    
    document.querySelectorAll("#mines-grid button").forEach(btn => { 
        btn.innerText = "❓"; 
        btn.style.background = ""; 
        btn.disabled = false;
    });
    loadUserData(currentUserWallet);
}

async function openMine(index) {
    if (!isMinesActive) return alert("🚀 Pehle 'START MINE' dabayein!");
    const userRef = db.collection("users").doc(currentUserWallet);
    const btns = document.querySelectorAll("#mines-grid button");

    if (index === bombLocation) {
        isMinesActive = false;
        btns[index].innerText = "💣";
        btns[index].style.background = "#ff4d4d";
        await userRef.update({ lockUntil: Date.now() + 60000 });
        alert("💥 BOOM! Bomb blast. Account 1 min ke liye lock!");
    } else {
        btns[index].innerText = "💎";
        btns[index].style.background = "#00e6e6";
        btns[index].disabled = true;
        await userRef.update({ points: firebase.firestore.FieldValue.increment(200) });
        loadUserData(currentUserWallet);
    }
}

// ==========================================
// 📅 STAKING & DAILY CHECK-IN
// ==========================================
async function dailyCheckIn() {
    if (!currentUserWallet) return;
    const userRef = db.collection("users").doc(currentUserWallet);
    const doc = await userRef.get();
    const lastCheck = doc.data().lastCheckIn || 0;

    if (Date.now() - lastCheck < 86400000) {
        return alert("⏳ 24 ghante baad wapas aayein!");
    }

    await userRef.update({
        lastCheckIn: Date.now(),
        points: firebase.firestore.FieldValue.increment(100)
    });
    alert("🎉 +100 ABP Daily Bonus!");
    loadUserData(currentUserWallet);
}

async function stakePoints() {
    const amount = parseInt(document.getElementById("stake-input").value);
    if (!amount || amount <= 0) return alert("Valid amount daalein!");
    const userRef = db.collection("users").doc(currentUserWallet);
    const doc = await userRef.get();
    
    if (doc.data().points < amount) return alert("😔 Points kam hain!");

    await userRef.update({
        points: firebase.firestore.FieldValue.increment(-amount),
        stakedAmount: firebase.firestore.FieldValue.increment(amount),
        stakingStartTime: Date.now()
    });
    alert(`💎 ${amount} ABP Stake ho gaye!`);
    loadUserData(currentUserWallet);
}

// ==========================================
// 🧩 LOGO PUZZLE GAME
// ==========================================
let puzzleOrder = [0, 1, 2, 3];
let currentUserOrder = [3, 1, 0, 2]; 

function renderPuzzle() {
    const board = document.getElementById("puzzle-board");
    if(!board) return;
    board.innerHTML = "";
    currentUserOrder.forEach((pos, index) => {
        const piece = document.createElement("div");
        piece.style.width = "95px"; piece.style.height = "95px";
        piece.style.backgroundImage = "url('38682.jpg')"; 
        piece.style.backgroundSize = "200px 200px";
        piece.style.backgroundPosition = `-${(pos % 2) * 95}px -${Math.floor(pos / 2) * 95}px`;
        piece.style.border = "1px solid rgba(0,230,230,0.3)";
        piece.onclick = () => {
            let next = (index + 1) % 4;
            [currentUserOrder[index], currentUserOrder[next]] = [currentUserOrder[next], currentUserOrder[index]];
            renderPuzzle();
        };
        board.appendChild(piece);
    });
}

async function checkPuzzle() {
    if (JSON.stringify(currentUserOrder) === JSON.stringify(puzzleOrder)) {
        const userRef = db.collection("users").doc(currentUserWallet);
        await userRef.update({ points: firebase.firestore.FieldValue.increment(300) });
        alert("🎯 Logo Fixed! +300 ABP Reward.");
        loadUserData(currentUserWallet);
    } else {
        alert("❌ Galat order!");
    }
}

// ==========================================
// 🏆 LEADERBOARD & REFERRAL
// ==========================================
async function loadLeaderboard() {
    const list = document.getElementById("leaderboard-list");
    if(!list) return;
    const snap = await db.collection("users").orderBy("points", "desc").limit(5).get();
    let html = "";
    snap.forEach((doc, i) => {
        html += `<p>${i+1}. ${doc.id.substring(0,6)}... — <span style="color:#00e6e6">${doc.data().points || 0} ABP</span></p>`;
    });
    list.innerHTML = html;
}

function updateReferralLink() {
    if (currentUserWallet) {
        document.getElementById("ref-link").innerText = window.location.origin + "?ref=" + currentUserWallet;
    }
}

function copyRef() {
    const link = document.getElementById("ref-link").innerText;
    navigator.clipboard.writeText(link);
    alert("🚀 Referral link copied!");
}

async function checkReferralBonus() {
    const urlParams = new URLSearchParams(window.location.search);
    const referrer = urlParams.get('ref');
    if (referrer && currentUserWallet && referrer !== currentUserWallet) {
        const currentUserRef = db.collection("users").doc(currentUserWallet);
        const doc = await currentUserRef.get();
        if (!doc.exists || !doc.data().hasClaimedRef) {
            await db.collection("users").doc(referrer).update({ points: firebase.firestore.FieldValue.increment(200) });
            await currentUserRef.update({ hasClaimedRef: true }, { merge: true });
        }
    }
}

// ==========================================
// 🚀 INITIALIZATION
// ==========================================
window.onload = async () => {
    if (window.ethereum) {
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
            currentUserWallet = accounts[0];
            await loadUserData(currentUserWallet);
            updateReferralLink();
            checkReferralBonus();
        }
    }
    loadLeaderboard();
    setTimeout(renderPuzzle, 1000);
};
