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

async function verifyAndUnlock() {
    if(!currentUserWallet) return alert("❌ Pehle Wallet Connect karein!");
    
    // Process loading...
    const btn = document.querySelector('.popup-box .connect-btn');
    const oldText = btn.innerText;
    btn.innerText = "⏳ Verifying...";

    try {
        const userRef = db.collection("users").doc(currentUserWallet);
        
        await userRef.update({
            points: firebase.firestore.FieldValue.increment(500),
            hasJoinedSocials: true
        });
        
        // Premium Alert Message
        alert("🎉 CONGRATULATIONS! \n\n🎁 Welcome Gift: 500 ABP added to your vault. \n🔓 Dashboard is now fully unlocked for you!");
        
        unlockDashboard();
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

// Window Load Check
window.onload = async () => {
    if (window.ethereum) {
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
            currentUserWallet = accounts[0];
            loadUserData(currentUserWallet);
        }
    }
};


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
