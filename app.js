// ==========================================
// 💎 DIAMO CORE ENGINE - 100% COMPLETE CODE
// ==========================================
let currentUserWallet = ""; 
let db;
let bombLocation = -1;
let isMinesActive = false;
const cardSymbols = ['A', 'K', 'Q', 'J', '10', '9'];

// 1. Firebase Initialization
if (typeof firebase !== 'undefined') {
    if (!firebase.apps.length) { 
        firebase.initializeApp(window.firebaseConfig); 
    }
    db = firebase.firestore();
}

// 2. UI Control Functions
function togglePopup(show) {
    const lock = document.getElementById("social-lock");
    if(lock) {
        lock.style.display = show ? "flex" : "none";
    }
}

function unlockDashboard() {
    togglePopup(false);
    const grid = document.getElementById("main-grid");
    if(grid) {
        grid.style.filter = "none";
        grid.style.pointerEvents = "auto";
    }
}

// 3. Wallet Connection Logic
async function connectWallet() {
    if (window.ethereum) {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            currentUserWallet = accounts[0]; 
            
            const btn = document.getElementById('wallet-btn');
            if(btn) {
                btn.innerText = currentUserWallet.substring(0, 6) + "..." + currentUserWallet.substring(38);
            }
            
            const userRef = db.collection("users").doc(currentUserWallet);
            const doc = await userRef.get();

            if (!doc.exists) {
                // New User Setup
                await userRef.set({ 
                    points: 0, 
                    wallet: currentUserWallet, 
                    hasJoinedSocials: false, 
                    lastCheckIn: 0, 
                    stakedAmount: 0, 
                    lockUntil: 0 
                });
                togglePopup(true);
            } else {
                // Existing User Check
                if(!doc.data().hasJoinedSocials) {
                    togglePopup(true);
                } else {
                    unlockDashboard();
                }
            }
            loadUserData();
            updateReferralLink();
            checkReferralBonus();
        } catch (e) { 
            console.log("User rejected connection"); 
        }
    } else { 
        alert("Please install MetaMask or Trust Wallet!"); 
    }
}

// 4. Load User Points & Data
async function loadUserData() {
    if(!currentUserWallet) return;
    try {
        const doc = await db.collection("users").doc(currentUserWallet).get();
        if(doc.exists) {
            const data = doc.data();
            document.getElementById("user-points").innerText = (data.points || 0).toFixed(2) + " ABP";
            loadLeaderboard();
        }
    } catch (e) {
        console.log("Error loading user data");
    }
}

// 5. Social Tasks Verify Button
async function verifyAndUnlock() {
    unlockDashboard(); // Instant access
    if(currentUserWallet) {
        try {
            const userRef = db.collection("users").doc(currentUserWallet);
            await userRef.update({
                points: firebase.firestore.FieldValue.increment(500),
                hasJoinedSocials: true
            });
            loadUserData();
        } catch (e) {
            console.log("Background reward sync pending");
        }
    }
}

// 6. Triple Card Game Logic
async function playTripleCard() {
    if(!currentUserWallet) return alert("Connect Wallet First!");
    
    const userRef = db.collection("users").doc(currentUserWallet);
    const doc = await userRef.get();
    
    if(doc.data().points < 50) return alert("You need 50 ABP to play!");

    await userRef.update({ points: firebase.firestore.FieldValue.increment(-50) });
    loadUserData();

    let count = 0;
    const interval = setInterval(() => {
        const res = [
            cardSymbols[Math.floor(Math.random() * 6)], 
            cardSymbols[Math.floor(Math.random() * 6)], 
            cardSymbols[Math.floor(Math.random() * 6)]
        ];
        
        document.getElementById("cards-container").innerHTML = `<span>${res[0]}</span><span>${res[1]}</span><span>${res[2]}</span>`;
        
        if(++count > 15) {
            clearInterval(interval);
            let win = 0;
            if(res[0] === res[1] && res[1] === res[2]) {
                win = (res[0] === 'A') ? 1000 : 500;
            }
            
            if(win > 0) {
                userRef.update({ points: firebase.firestore.FieldValue.increment(win) });
                document.getElementById("game-status").innerText = "🎉 WON " + win + " ABP!";
            } else { 
                document.getElementById("game-status").innerText = "❌ No Match. Try again!"; 
            }
            loadUserData();
        }
    }, 80);
}

// 7. Diamond Mines Game Logic
async function startMinesGame() {
    if(!currentUserWallet) return;
    
    const userRef = db.collection("users").doc(currentUserWallet);
    const doc = await userRef.get();
    const data = doc.data();

    if(data.lockUntil > Date.now()) {
        return alert("Penalty! Try again after 1 minute.");
    }
    
    if(data.points < 100) return alert("Not enough ABP!");

    await userRef.update({ points: firebase.firestore.FieldValue.increment(-100) });
    bombLocation = Math.floor(Math.random() * 9);
    isMinesActive = true;
    
    const buttons = document.querySelectorAll("#mines-grid button");
    buttons.forEach(b => { 
        b.innerText = "?"; 
        b.style.background = "#333"; 
        b.disabled = false;
    });
    loadUserData();
}

async function openMine(idx) {
    if(!isMinesActive) return;
    
    const btns = document.querySelectorAll("#mines-grid button");
    const userRef = db.collection("users").doc(currentUserWallet);

    if(idx === bombLocation) {
        isMinesActive = false;
        btns[idx].innerText = "💣"; 
        btns[idx].style.background = "red";
        await userRef.update({ lockUntil: Date.now() + 60000 });
        alert("💥 BOOM! You hit a bomb. 1 Minute Penalty!");
    } else {
        btns[idx].innerText = "💎"; 
        btns[idx].style.background = "#00e6e6";
        btns[idx].disabled = true;
        await userRef.update({ points: firebase.firestore.FieldValue.increment(200) });
        loadUserData();
    }
}

// 8. Staking, Daily Reward & Referral
async function dailyCheckIn() {
    if(!currentUserWallet) return;
    const userRef = db.collection("users").doc(currentUserWallet);
    const doc = await userRef.get();
    const lastCheck = doc.data().lastCheckIn || 0;

    if(Date.now() - lastCheck < 86400000) {
        return alert("Already checked in today! Come back tomorrow.");
    }

    await userRef.update({ 
        lastCheckIn: Date.now(), 
        points: firebase.firestore.FieldValue.increment(100) 
    });
    alert("Check-in successful! +100 ABP Reward.");
    loadUserData();
}

async function stakePoints() {
    const amt = parseInt(document.getElementById("stake-input").value);
    if(!amt || amt <= 0) return alert("Enter valid amount!");

    const userRef = db.collection("users").doc(currentUserWallet);
    const doc = await userRef.get();
    
    if(doc.data().points < amt) return alert("Not enough balance to stake!");

    await userRef.update({ 
        points: firebase.firestore.FieldValue.increment(-amt),
        stakedAmount: firebase.firestore.FieldValue.increment(amt)
    });
    alert("Successfully staked " + amt + " ABP!");
    loadUserData();
}

function updateReferralLink() {
    const link = window.location.origin + "?ref=" + currentUserWallet;
    document.getElementById("ref-link").innerText = link;
}

async function checkReferralBonus() {
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref');
    if(ref && currentUserWallet && ref !== currentUserWallet) {
        const userRef = db.collection("users").doc(currentUserWallet);
        const doc = await userRef.get();
        if(!doc.data().hasClaimedRef) {
            await db.collection("users").doc(ref).update({ points: firebase.firestore.FieldValue.increment(200) });
            await userRef.update({ hasClaimedRef: true });
        }
    }
}

// 9. Leaderboard Display
async function loadLeaderboard() {
    try {
        const snap = await db.collection("users").orderBy("points", "desc").limit(5).get();
        let html = "";
        snap.forEach((doc, i) => { 
            html += `<p style='margin:5px 0;'>${i+1}. ${doc.id.substring(0,6)}... — <span style='color:#00e6e6;'>${doc.data().points.toFixed(0)} ABP</span></p>`; 
        });
        document.getElementById("leaderboard-list").innerHTML = html;
    } catch (e) {
        console.log("Leaderboard error");
    }
}

// Initial System Load
window.onload = async () => {
    // Force hide popup on refresh
    togglePopup(false); 
    
    if (window.ethereum) {
        const accs = await window.ethereum.request({ method: 'eth_accounts' });
        if (accs.length > 0) { 
            currentUserWallet = accs[0]; 
            // Re-connect session
            const btn = document.getElementById('wallet-btn');
            if(btn) btn.innerText = currentUserWallet.substring(0, 6) + "...";
            loadUserData();
            updateReferralLink();
        }
    }
};
