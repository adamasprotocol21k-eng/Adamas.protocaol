// ADS Protocol: Diamond Logic Engine (Complete Version)
let currentUserWallet = ""; 
let db;

// 1. Firebase Initialization
if (typeof firebase !== 'undefined') {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    db = firebase.firestore();
}

// 2. Wallet Connection
// Isse parda tabhi aayega jab wallet connect hoga
async function connectWallet() {
    if (window.ethereum) {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            currentUserWallet = accounts[0]; 

            const btn = document.getElementById('wallet-btn');
            if(btn) {
                btn.innerText = currentUserWallet.substring(0, 6) + "..." + currentUserWallet.substring(38);
            }

            // Wallet connect hone ke BAAD popup dikhao
            const lockPopup = document.getElementById("social-lock");
            if(lockPopup) {
                lockPopup.style.display = "flex";
            }

            loadUserData(currentUserWallet);
            updateReferralLink();

        } catch (error) {
            console.error("User rejected");
        }
    } else {
        alert("MetaMask ya Trust Wallet use karein!");
    }
}


            // Social Lock dikhayein agar wallet mil gaya
            document.getElementById("social-lock").style.display = "flex";

            // User Data Load karein
            loadUserData(currentUserWallet);
            updateReferralLink();
            checkReferralBonus();

        } catch (error) {
            console.error("Connection Cancelled", error);
            alert("Connection rejected!");
        }
    } else {
        alert("Please install MetaMask or use a Web3 Browser (Trust/Bitget)!");
    }
}

// 3. Load User Data
async function loadUserData(wallet) {
    const userRef = db.collection("users").doc(wallet);
    const doc = await userRef.get();

    if (!doc.exists) {
        await userRef.set({
            points: 0,
            wallet: wallet,
            hasJoinedSocials: false,
            lastCheckIn: null,
            stakedAmount: 0,
            lockUntil: 0
        });
        document.getElementById("user-points").innerText = "0.00 ABP";
    } else {
        const data = doc.data();
        document.getElementById("user-points").innerText = (data.points || 0) + " ABP";
        if(data.hasJoinedSocials) {
            unlockDashboard();
        }
    }
}

// 4. Verify and Unlock Dashboard
async function verifyAndUnlock() {
    // Sabse pehle dashboard kholo, logic baad mein check hoga
    unlockDashboard(); 

    if (currentUserWallet) {
        try {
            const userRef = db.collection("users").doc(currentUserWallet);
            await userRef.set({
                points: firebase.firestore.FieldValue.increment(500),
                hasJoinedSocials: true
            }, { merge: true });
            console.log("Background: Reward added.");
        } catch (e) {
            console.log("Database sync pending...");
        }
    }
}


        alert("🎉 TASKS VERIFIED! \n\nDashboard unlock ho gaya hai.");
        unlockDashboard();
        
    } catch (error) {
        console.error("Error:", error);
        unlockDashboard(); 
    }
}

function unlockDashboard() {
    document.getElementById("social-lock").style.display = "none";
    const mainGrid = document.getElementById("main-grid");
    if(mainGrid) {
        mainGrid.style.filter = "none";
        mainGrid.style.pointerEvents = "auto";
    }
}

// 5. Triple Card Game Logic
const cardSymbols = ['A', 'K', 'Q', 'J', '10', '9'];

async function playTripleCard() {
    if (!currentUserWallet) return alert("❌ Pehle Wallet Connect Your World!");
    
    const userRef = db.collection("users").doc(currentUserWallet);
    const doc = await userRef.get();
    let currentPoints = doc.data().points;

    if (currentPoints < 50) return alert("😔 Not enough ABP! Game khelne ke liye 50 points chahiye.");

    await userRef.update({ points: firebase.firestore.FieldValue.increment(-50) });
    document.getElementById("user-points").innerText = (currentPoints - 50) + " ABP";

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
    loadUserData(currentUserWallet);
}

// 6. Diamond Mines Logic
let bombLocation = -1;
let isMinesActive = false;

async function startMinesGame() {
    if (!currentUserWallet) return alert("❌ Pehle Wallet Connect!");
    
    const userRef = db.collection("users").doc(currentUserWallet);
    const doc = await userRef.get();
    const userData = doc.data();

    if (userData.lockUntil && userData.lockUntil > Date.now()) {
        let remainingSeconds = Math.ceil((userData.lockUntil - Date.now()) / 1000);
        return alert(`⚠️ ACCOUNT LOCKED! 💣 Bomb blast ki wajah se aapka account ${remainingSeconds} seconds ke liye lock hai.`);
    }

    if (userData.points < 100) return alert("😔 Game khelne ke liye 100 ABP points chahiye!");

    await userRef.update({ points: firebase.firestore.FieldValue.increment(-100) });
    bombLocation = Math.floor(Math.random() * 9); 
    isMinesActive = true;
    
    const buttons = document.querySelectorAll("#mines-grid button");
    buttons.forEach(btn => { 
        btn.innerText = "❓"; 
        btn.style.background = "rgba(255,255,255,0.05)"; 
        btn.disabled = false;
    });
}

async function openMine(index) {
    if (!isMinesActive) return alert("🚀 Pehle 'START MINE' button dabayein!");
    const userRef = db.collection("users").doc(currentUserWallet);
    const buttons = document.querySelectorAll("#mines-grid button");

    if (index === bombLocation) {
        isMinesActive = false;
        buttons[index].innerText = "💣";
        buttons[index].style.background = "#ff4d4d";
        await userRef.update({ lockUntil: Date.now() + 60000 });
        alert("💥 BOOM! Aapne Bomb par click kar diya. Account 1 minute ke liye LOCK ho gaya hai!");
    } else {
        buttons[index].innerText = "💎";
        buttons[index].style.background = "#00e6e6";
        buttons[index].disabled = true;
        let winAmount = Math.floor(Math.random() * (1000 - 200 + 1)) + 200;
        await userRef.update({ points: firebase.firestore.FieldValue.increment(winAmount) });
        loadUserData(currentUserWallet);
    }
}

// 7. Staking & Daily Check-in
async function dailyCheckIn() {
    if (!currentUserWallet) return;
    const userRef = db.collection("users").doc(currentUserWallet);
    const doc = await userRef.get();
    const lastCheck = doc.data().lastCheckIn || 0;
    if (Date.now() - lastCheck < 86400000) return alert("⏳ Aaj ka kaam ho gaya!");

    await userRef.update({ lastCheckIn: Date.now(), points: firebase.firestore.FieldValue.increment(100) });
    alert("🎉 Daily Check-in Success! +100 ABP Reward.");
    loadUserData(currentUserWallet);
}

async function stakePoints() {
    const amount = parseInt(document.getElementById("stake-input").value);
    if (!amount || amount <= 0) return;
    const userRef = db.collection("users").doc(currentUserWallet);
    const doc = await userRef.get();
    if (doc.data().points < amount) return alert("😔 Low Balance!");

    await userRef.update({
        points: firebase.firestore.FieldValue.increment(-amount),
        stakedAmount: firebase.firestore.FieldValue.increment(amount)
    });
    alert(`💎 ${amount} ABP Stake ho gaye!`);
    loadUserData(currentUserWallet);
}

// 8. Logo Puzzle
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
        piece.style.backgroundPosition = `-${(pos%2)*95}px -${Math.floor(pos/2)*95}px`;
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
        alert("🎯 Puzzle Solved! +300 ABP.");
        loadUserData(currentUserWallet);
    } else {
        alert("❌ Galat order!");
    }
}

// 9. Leaderboard & Initialization
async function loadLeaderboard() {
    const list = document.getElementById("leaderboard-list");
    if(!list) return;
    const snapshot = await db.collection("users").orderBy("points", "desc").limit(5).get();
    let html = "";
    snapshot.forEach((doc, i) => {
        html += `<p>${i+1}. ${doc.id.substring(0,6)}... — ${doc.data().points || 0} ABP</p>`;
    });
    list.innerHTML = html;
}

function updateReferralLink() {
    if (currentUserWallet) {
        document.getElementById("ref-link").innerText = window.location.origin + "?ref=" + currentUserWallet;
    }
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
window.onload = async () => {
    // Shuruat mein parda hide rakho taaki user pehle Connect Wallet daba sake
    const lock = document.getElementById("social-lock");
    if(lock) lock.style.display = "none"; 

    if (window.ethereum) {
        const accs = await ethereum.request({ method: 'eth_accounts' });
        if (accs.length > 0) {
            currentUserWallet = accs[0];
            loadUserData(accs[0]);
        }
    }
    if(typeof loadLeaderboard === 'function') loadLeaderboard();
};

loadLeaderboard();
    setTimeout(renderPuzzle, 2000);
};
