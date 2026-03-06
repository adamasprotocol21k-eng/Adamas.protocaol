// ==========================================
// 🚀 ADS PROTOCOL: TOTAL FINAL INTEGRATED LOGIC
// ==========================================
let currentUserWallet = ""; 
let db = null;
let bombLocation = -1;
let isMinesActive = false;
const cardSymbols = ['💎', '💰', '🔥', 'ADS', '🚀', '⭐'];

// 1. Firebase System Initialize
if (typeof firebase !== 'undefined') {
    if (!firebase.apps.length) { 
        firebase.initializeApp(window.firebaseConfig); 
    }
    db = firebase.firestore();
}

// 2. Dashboard Unlock
function verifyAndUnlock() {
    const lock = document.getElementById("social-lock");
    const grid = document.getElementById("main-grid");
    
    if(lock) lock.style.setProperty("display", "none", "important");
    if(grid) {
        grid.style.filter = "none";
        grid.style.pointerEvents = "auto";
    }

    if (currentUserWallet && db) {
        db.collection("users").doc(currentUserWallet).update({
            hasJoinedSocials: true,
            points: firebase.firestore.FieldValue.increment(500)
        }).then(() => {
            loadADSData();
        }).catch((e) => console.log("ADS Syncing..."));
    }
}

// 3. Connect Wallet
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
                await userRef.set({ 
                    points: 0, 
                    wallet: currentUserWallet, 
                    hasJoinedSocials: false, 
                    lastCheckIn: 0, 
                    lockUntil: 0 
                });
                document.getElementById("social-lock").style.display = "flex";
            } else {
                if(!doc.data().hasJoinedSocials) {
                    document.getElementById("social-lock").style.display = "flex";
                } else {
                    verifyAndUnlock(); 
                }
            }
            loadADSData();
            checkReferral();
        } catch (e) { console.error("User cancelled connection"); }
    } else { alert("Install MetaMask for ADS Protocol!"); }
}

// 4. Load ADS Stats
async function loadADSData() {
    if(!currentUserWallet || !db) return;
    try {
        const doc = await db.collection("users").doc(currentUserWallet).get();
        if(doc.exists) {
            const data = doc.data();
            document.getElementById("user-points").innerText = (data.points || 0).toFixed(0) + " ADS";
            document.getElementById("ref-link").innerText = window.location.origin + "?ref=" + currentUserWallet;
            updateLeaderboard();
        }
    } catch (e) { console.log("Load error"); }
}

async function updateLeaderboard() {
    if(!db) return;
    const snap = await db.collection("users").orderBy("points", "desc").limit(5).get();
    let html = "";
    snap.forEach((d, i) => { 
        html += `<div style='display:flex; justify-content:space-between; padding:5px 0; border-bottom:1px solid #222;'>
                    <span>${i+1}. ${d.id.substring(0,8)}...</span> 
                    <span style='color:#ffcc00; font-weight:bold;'>${d.data().points} ADS</span>
                 </div>`; 
    });
    document.getElementById("leaderboard-list").innerHTML = html;
}

// 5. Game: Mines
async function startMinesGame() {
    if(!currentUserWallet) return alert("Connect Wallet!");
    const userRef = db.collection("users").doc(currentUserWallet);
    const doc = await userRef.get();
    const data = doc.data();

    if(data.lockUntil > Date.now()) return alert("Penalty Active! Please wait.");
    if(data.points < 100) return alert("Need 100 ADS to play!");

    await userRef.update({ points: firebase.firestore.FieldValue.increment(-100) });
    bombLocation = Math.floor(Math.random() * 9);
    isMinesActive = true;
    
    document.querySelectorAll("#mines-grid button").forEach(b => { 
        b.innerText = "?"; 
        b.style.background = "#1a1a1a"; 
        b.disabled = false;
    });
    loadADSData();
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
        alert("BOOM! Account locked for 60 seconds.");
    } else {
        btns[idx].innerText = "💎"; 
        btns[idx].style.background = "#ffcc00";
        btns[idx].style.color = "black";
        btns[idx].disabled = true;
        await userRef.update({ points: firebase.firestore.FieldValue.increment(200) });
        loadADSData();
    }
}

// 6. Game: Triple Spin
async function playTripleCard() {
    if(!currentUserWallet) return alert("Connect Wallet!");
    const userRef = db.collection("users").doc(currentUserWallet);
    const doc = await userRef.get();
    if(doc.data().points < 50) return alert("Insufficient ADS!");

    await userRef.update({ points: firebase.firestore.FieldValue.increment(-50) });
    loadADSData();

    let count = 0;
    const interval = setInterval(() => {
        const res = [cardSymbols[Math.floor(Math.random()*6)], cardSymbols[Math.floor(Math.random()*6)], cardSymbols[Math.floor(Math.random()*6)]];
        document.getElementById("cards-container").innerHTML = `<span>${res[0]}</span><span>${res[1]}</span><span>${res[2]}</span>`;
        if(++count > 15) {
            clearInterval(interval);
            let win = (res[0] === res[1] && res[1] === res[2]) ? 1000 : 0;
            if(win > 0) {
                userRef.update({ points: firebase.firestore.FieldValue.increment(win) });
                document.getElementById("game-status").innerText = "🎉 BIG WIN! +" + win + " ADS";
            } else { 
                document.getElementById("game-status").innerText = "❌ Try Again!"; 
            }
            loadADSData();
        }
    }, 90);
}

// 7. Referral & Daily Bonus
async function dailyCheckIn() {
    if(!currentUserWallet) return;
    const userRef = db.collection("users").doc(currentUserWallet);
    const doc = await userRef.get();
    if(Date.now() - (doc.data().lastCheckIn || 0) < 86400000) return alert("Come back tomorrow!");
    await userRef.update({ lastCheckIn: Date.now(), points: firebase.firestore.FieldValue.increment(100) });
    alert("Daily 100 ADS Rewards Claimed!");
    loadADSData();
}

async function checkReferral() {
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref');
    if(ref && currentUserWallet && ref !== currentUserWallet) {
        const userRef = db.collection("users").doc(currentUserWallet);
        const doc = await userRef.get();
        if(!doc.data().refClaimed) {
            await db.collection("users").doc(ref).update({ points: firebase.firestore.FieldValue.increment(200) });
            await userRef.update({ refClaimed: true });
        }
    }
}

window.onload = () => { document.getElementById("social-lock").style.display = "none"; };
