// ADS Protocol: Diamond Logic Engine
let currentUserWallet = "";

async function connectWallet() {
    if (window.ethereum) {
        try {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            currentUserWallet = accounts[0];
            
            // UI Update: Button text change karein
            const btn = document.querySelector('.connect-btn');
            btn.innerText = currentUserWallet.substring(0, 6) + "..." + currentUserWallet.substring(38);
            
            // Social Lock dikhayein
            document.getElementById("social-lock").style.display = "flex";
            
            // User Data Load karein
            loadUserData(currentUserWallet);
            
        } catch (error) {
            console.error("Connection Cancelled");
        }
    } else {
        alert("Please install MetaMask or use a Web3 Browser!");
    }
}

async function loadUserData(wallet) {
    const userRef = db.collection("users").doc(wallet);
    const doc = await userRef.get();

    if (!doc.exists) {
        // Naya user entry
        await userRef.set({
            points: 0,
            wallet: wallet,
            hasJoinedSocials: false,
            lastCheckIn: null,
            stakingAmount: 0
        });
        document.getElementById("user-points").innerText = "0.00 ABP";
    } else {
        // Purana user points dikhayein
        document.getElementById("user-points").innerText = doc.data().points + " ABP";
        // Agar pehle se social join kar rakha hai toh lock hata dein
        if(doc.data().hasJoinedSocials) {
            unlockDashboard();
        }
    }
}

// Button click hone par checkmark dikhane ke liye
function markFollowed(btnId) {
    const btn = document.getElementById(btnId);
    if (btn) {
        btn.style.border = "2px solid #00ff00";
        btn.style.opacity = "0.8";
    }
}

// Final Verification aur Unlock function
async function verifyAndUnlock() {
    // Check agar wallet connect hai
    if (typeof currentUserWallet === 'undefined' || !currentUserWallet) {
        return alert("❌ Pehle upar se CONNECT WALLET button dabayein!");
    }

    const btn = document.getElementById("verify-final-btn");
    btn.innerText = "⏳ Verifying...";

    try {
        const userRef = db.collection("users").doc(currentUserWallet);
        
        // Firebase mein 500 points add karna
        await userRef.set({
            points: firebase.firestore.FieldValue.increment(500),
            hasJoinedSocials: true,
            wallet: currentUserWallet
        }, { merge: true });

        alert("🎉 TASKS VERIFIED! \n\n500 ABP aapke account mein add ho gaye hain.");
        unlockDashboard(); // Dashboard kholne ke liye
        
    } catch (error) {
        console.error("Error:", error);
        alert("⚠️ Connection Issue: Refresh karke phir se koshish karein.");
        btn.innerText = "✅ VERIFY & UNLOCK";
    }
}

    } catch (error) {
        console.error("Update failed", error);
        btn.innerText = oldText;
        alert("⚠️ Verification failed. Please try again.");
    }
}


function unlockDashboard() {
    document.getElementById("social-lock").style.display = "none";
    document.getElementById("main-grid").style.filter = "none";
}
// Final Initialization Logic
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
    // Leaderboard hamesha load hona chahiye, chahe wallet connect ho ya na ho
    loadLeaderboard();
};

// Har 30 second mein leaderboard refresh karein
setInterval(loadLeaderboard, 30000);

// ADS Protocol: Triple Card Game Logic
const cardSymbols = ['A', 'K', 'Q', 'J', '10', '9'];

async function playTripleCard() {
    if (!currentUserWallet) return alert("❌ Pehle Wallet Connect Your World!");
    
    const userRef = db.collection("users").doc(currentUserWallet);
    const doc = await userRef.get();
    let currentPoints = doc.data().points;

    if (currentPoints < 50) return alert("😔 Not enough ABP! Game khelne ke liye 50 points chahiye.");

    // 50 Points kaatna (Bet amount)
    await userRef.update({ points: firebase.firestore.FieldValue.increment(-50) });
    document.getElementById("user-points").innerText = (currentPoints - 50) + " ABP";

    // Animation: Cards ko ghumte huye dikhana
    let spinCount = 0;
    const interval = setInterval(async () => {
        const randomCards = [
            cardSymbols[Math.floor(Math.random() * cardSymbols.length)],
            cardSymbols[Math.floor(Math.random() * cardSymbols.length)],
            cardSymbols[Math.floor(Math.random() * cardSymbols.length)]
        ];
        document.getElementById("cards-container").innerHTML = `<span>${randomCards[0]}</span><span>${randomCards[1]}</span><span>${randomCards[2]}</span>`;
        spinCount++;
        
        if (spinCount > 15) {
            clearInterval(interval);
            calculateWin(randomCards, userRef);
        }
    }, 80);
}

async function calculateWin(cards, userRef) {
    let winAmount = 0;
    const [c1, c2, c3] = cards;

    // Winning Logic as per your strategy
    if (c1 === c2 && c2 === c3) { 
        if (c1 === 'A') winAmount = 1000;
        else if (c1 === 'K') winAmount = 900;
        else if (c1 === 'Q') winAmount = 800;
        else if (c1 === 'J') winAmount = 700;
        else winAmount = 500;
    }

    if (winAmount > 0) {
        await userRef.update({ points: firebase.firestore.FieldValue.increment(winAmount) });
        document.getElementById("game-status").innerHTML = `<span style="color:#00ff00">🎉 JACKPOT! YOU WON ${winAmount} ABP!</span>`;
        alert(`🔥 Amazing! Triple ${c1} aa gaya! Aapne ${winAmount} ABP jeet liye hain.`);
    } else {
        document.getElementById("game-status").innerText = "❌ No Match. Agli baar koshish karein!";
    }
    
    // Balance Refresh
    const newDoc = await userRef.get();
    document.getElementById("user-points").innerText = newDoc.data().points + " ABP";
}

// ==========================================
// 💣 DIAMOND MINES GAME LOGIC (WITH 1-MIN LOCK)
// ==========================================
let bombLocation = -1;
let isMinesActive = false;

async function startMinesGame() {
    if (!currentUserWallet) return alert("❌ Pehle Wallet Connect Your World!");
    
    const userRef = db.collection("users").doc(currentUserWallet);
    const doc = await userRef.get();
    const userData = doc.data();

    // 1. Check if Account is Locked (1-Minute Bomb Penalty)
    if (userData.lockUntil && userData.lockUntil > Date.now()) {
        let remainingSeconds = Math.ceil((userData.lockUntil - Date.now()) / 1000);
        return alert(`⚠️ ACCOUNT LOCKED! 💣 Bomb blast ki wajah se aapka account ${remainingSeconds} seconds ke liye lock hai.`);
    }

    // 2. Check Balance (100 ABP per Game)
    if (userData.points < 100) {
        return alert("😔 Game khelne ke liye 100 ABP points chahiye!");
    }

    // 3. Deduct Points & Set Bomb
    await userRef.update({ points: firebase.firestore.FieldValue.increment(-100) });
    document.getElementById("user-points").innerText = (userData.points - 100) + " ABP";

    bombLocation = Math.floor(Math.random() * 9); // 0 se 8 ke beech bomb
    isMinesActive = true;
    
    // UI Reset: Grid buttons ko saaf karna
    const buttons = document.querySelectorAll("#mines-grid button");
    buttons.forEach(btn => { 
        btn.innerText = "❓"; 
        btn.style.background = "rgba(255,255,255,0.05)"; 
        btn.disabled = false;
    });
    
    document.getElementById("mines-instruction").innerText = "Game Started! Diamond dhoondho... 💎";
}

async function openMine(index) {
    if (!isMinesActive) return alert("🚀 Pehle 'START MINE' button dabayein!");

    const userRef = db.collection("users").doc(currentUserWallet);
    const buttons = document.querySelectorAll("#mines-grid button");

    if (index === bombLocation) {
        // --- 💥 BOMB BLAST LOGIC ---
        isMinesActive = false;
        buttons[index].innerText = "💣";
        buttons[index].style.background = "#ff4d4d"; // Red color
        
        // 1 Minute Penalty Lock
        const lockTime = Date.now() + (60 * 1000);
        await userRef.update({ lockUntil: lockTime });
        
        alert("💥 BOOM! Aapne Bomb par click kar diya. Account 1 minute ke liye LOCK ho gaya hai!");
    } else {
        // --- 💎 DIAMOND FOUND LOGIC ---
        buttons[index].innerText = "💎";
        buttons[index].style.background = "#00e6e6"; // Blue/Green color
        buttons[index].disabled = true; // Ek baar click hone par disable
        
        // Random Reward: 200 se 1000 points ke beech
        let winAmount = Math.floor(Math.random() * (1000 - 200 + 1)) + 200;
        
        await userRef.update({ points: firebase.firestore.FieldValue.increment(winAmount) });
        
        // Refresh UI points
        const newDoc = await userRef.get();
        document.getElementById("user-points").innerText = newDoc.data().points + " ABP";
    }
}

// ==========================================
// 💎 STAKING & 📅 DAILY CHECK-IN LOGIC
// ==========================================

async function dailyCheckIn() {
    if (!currentUserWallet) return alert("❌ Connect Wallet First!");
    
    const userRef = db.collection("users").doc(currentUserWallet);
    const doc = await userRef.get();
    const lastCheck = doc.data().lastCheckIn || 0;
    const now = Date.now();

    // Check if 24 hours passed
    if (now - lastCheck < 24 * 60 * 60 * 1000) {
        return alert("⏳ Aapne aaj ka Check-in pehle hi kar liya hai. Kal wapas aayein!");
    }

    await userRef.update({
        lastCheckIn: now,
        points: firebase.firestore.FieldValue.increment(100) // Daily Bonus
    });

    alert("🎉 Daily Check-in Success! +100 ABP Reward added.");
    location.reload();
}

async function stakePoints() {
    const amount = parseInt(document.getElementById("stake-input").value);
    if (!amount || amount <= 0) return alert("❌ Sahi amount daalein!");

    const userRef = db.collection("users").doc(currentUserWallet);
    const doc = await userRef.get();
    
    if (doc.data().points < amount) return alert("😔 Aapke paas itne points nahi hain!");

    await userRef.update({
        points: firebase.firestore.FieldValue.increment(-amount),
        stakedAmount: firebase.firestore.FieldValue.increment(amount),
        stakingStartTime: Date.now()
    });

    alert(`💎 ${amount} ABP Stake ho gaye hain! Rozana 1% reward milega.`);
    location.reload();
}

// ==========================================
// 🧩 LOGO PUZZLE GAME LOGIC
// ==========================================
let puzzleOrder = [0, 1, 2, 3];
let currentUserOrder = [3, 1, 0, 2]; // Shuffled initially

function renderPuzzle() {
    const board = document.getElementById("puzzle-board");
    board.innerHTML = "";
    // Aapke logo image ka URL (Make sure this path is correct in your folder)
    const imgUrl = "38682.jpg"; 

    currentUserOrder.forEach((pos, index) => {
        const piece = document.createElement("div");
        piece.style.width = "95px";
        piece.style.height = "95px";
        piece.style.backgroundImage = `url(${imgUrl})`;
        piece.style.backgroundSize = "200px 200px";
        piece.style.cursor = "pointer";
        piece.style.border = "1px solid rgba(0,230,230,0.2)";

        // Logic to show different parts of the logo
        const row = Math.floor(pos / 2);
        const col = pos % 2;
        piece.style.backgroundPosition = `-${col * 95}px -${row * 95}px`;

        piece.onclick = () => swapPiece(index);
        board.appendChild(piece);
    });
}

function swapPiece(index) {
    // Simple swap logic for mobile/touch
    let next = (index + 1) % 4;
    [currentUserOrder[index], currentUserOrder[next]] = [currentUserOrder[next], currentUserOrder[index]];
    renderPuzzle();
}

async function checkPuzzle() {
    if (JSON.stringify(currentUserOrder) === JSON.stringify(puzzleOrder)) {
        const userRef = db.collection("users").doc(currentUserWallet);
        await userRef.update({ points: firebase.firestore.FieldValue.increment(300) });
        alert("🎯 Amazing! Logo stable ho gaya hai. +300 ABP Reward added!");
        location.reload();
    } else {
        alert("❌ Logo abhi bhi tuta hua hai. Pieces ko sahi order mein layein!");
    }
}

// Initial Render
window.addEventListener('load', () => {
    setTimeout(renderPuzzle, 2000); // Wait for wallet load
});

// ==========================================
// 👥 REFERRAL & 🏆 LEADERBOARD LOGIC
// ==========================================

async function loadLeaderboard() {
    const list = document.getElementById("leaderboard-list");
    // Top 5 users fetch karein points ke basis par
    const snapshot = await db.collection("users").orderBy("points", "desc").limit(5).get();
    
    let html = "";
    let rank = 1;
    snapshot.forEach(doc => {
        const data = doc.data();
        const shortWallet = doc.id.substring(0, 6) + "..." + doc.id.substring(38);
        html += `<p>${rank}. ${shortWallet} — <span style="color: var(--primary-blue);">${data.points} ABP</span></p>`;
        rank++;
    });
    list.innerHTML = html;
}

function updateReferralLink() {
    if (currentUserWallet) {
        const link = window.location.origin + "?ref=" + currentUserWallet;
        document.getElementById("ref-link").innerText = link;
    }
}

function copyRef() {
    const link = document.getElementById("ref-link").innerText;
    navigator.clipboard.writeText(link);
    alert("🚀 Referral link copy ho gaya! Doston ko bhejein aur 200 ABP payein.");
}

// Referral Check: Jab koi link se aaye
async function checkReferralBonus() {
    const urlParams = new URLSearchParams(window.location.search);
    const referrer = urlParams.get('ref');

    if (referrer && currentUserWallet && referrer !== currentUserWallet) {
        const refUserRef = db.collection("users").doc(referrer);
        const currentUserRef = db.collection("users").doc(currentUserWallet);
        const doc = await currentUserRef.get();

        // Bonus sirf tab milega agar user naya hai
        if (!doc.exists || !doc.data().hasClaimedRef) {
            await refUserRef.update({ points: firebase.firestore.FieldValue.increment(200) });
            await currentUserRef.update({ hasClaimedRef: true });
            console.log("Referral Bonus Given to: " + referrer);
        }
    }
}

// Function calls inside window.onload or after login
// loadLeaderboard();
// updateReferralLink();
// checkReferralBonus();

function unlockDashboard() {
    // Popup ko hide karna
    const lock = document.getElementById("social-lock");
    if(lock) lock.style.display = "none";

    // Dashboard se blur hatana aur buttons chalu karna
    const mainGrid = document.getElementById("main-grid");
    if(mainGrid) {
        mainGrid.style.filter = "none";
        mainGrid.style.pointerEvents = "auto";
    }
}

