// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// -----------------------------
// MAINTENANCE MODE CHECK
// -----------------------------
let maintenanceMode = false;

async function checkMaintenance() {
    const docRef = db.collection("settings").doc("maintenance");
    const doc = await docRef.get();
    if(doc.exists){
        maintenanceMode = doc.data().enabled;
        if(maintenanceMode){
            document.body.innerHTML = `
                <div style="text-align:center;margin-top:100px;">
                    <h1>🚧 Site Under Maintenance 🚧</h1>
                    <p>We'll be back soon. Thank you for your patience!</p>
                </div>`;
        }
    }
}

// Call it on load
checkMaintenance();

// -----------------------------
// USER POINTS MANAGEMENT
// -----------------------------
async function getUserPoints(walletAddress){
    const userRef = db.collection("users").doc(walletAddress);
    const doc = await userRef.get();
    if(doc.exists){
        return doc.data().points;
    } else {
        await userRef.set({ points: 0, staked: 0, referrals: 0 });
        return 0;
    }
}

async function updateUserPoints(walletAddress, points){
    const userRef = db.collection("users").doc(walletAddress);
    await userRef.set({ points }, { merge: true });
}

// -----------------------------
// REFERRALS
// -----------------------------
async function addReferral(walletAddress){
    const userRef = db.collection("users").doc(walletAddress);
    const doc = await userRef.get();
    if(doc.exists){
        let currentRef = doc.data().referrals || 0;
        await userRef.update({ referrals: currentRef + 1 });
    }
}

// -----------------------------
// STAKING
// -----------------------------
async function stakePoints(walletAddress, amount){
    const userRef = db.collection("users").doc(walletAddress);
    const doc = await userRef.get();
    if(doc.exists){
        let currentPoints = doc.data().points || 0;
        let staked = doc.data().staked || 0;
        if(amount <= currentPoints){
            await userRef.update({ points: currentPoints - amount, staked: staked + amount });
        }
    }
}

async function claimStaking(walletAddress){
    const userRef = db.collection("users").doc(walletAddress);
    const doc = await userRef.get();
    if(doc.exists){
        let staked = doc.data().staked || 0;
        const reward = Math.floor(staked * 0.05);
        let points = doc.data().points || 0;
        await userRef.update({ points: points + staked + reward, staked: 0 });
    }
}

// -----------------------------
// LOTTERY TICKETS
// -----------------------------
async function buyLotteryTicket(walletAddress, ticketNumber){
    const userRef = db.collection("users").doc(walletAddress);
    const doc = await userRef.get();
    if(doc.exists){
        let points = doc.data().points || 0;
        if(points >= 1000){
            await userRef.update({ points: points - 1000 });
            await db.collection("lottery").add({ wallet: walletAddress, ticket: ticketNumber });
        }
    }
}
