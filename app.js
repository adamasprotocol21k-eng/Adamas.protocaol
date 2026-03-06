// Maintenance Switch Logic
db.collection("system_settings").doc("status").onSnapshot((doc) => {
    if (doc.exists && doc.data().isMaintenance === true) {
        // Agar maintenance true hai, toh dashboard chhupa do aur message dikhao
        document.getElementById("main-dashboard").style.display = "none";
        document.getElementById("maintenance-screen").style.display = "flex";
        console.log("System Under Maintenance");
    } else {
        // Agar maintenance false hai, toh dashboard dikhao
        document.getElementById("main-dashboard").style.display = "block";
        document.getElementById("maintenance-screen").style.display = "none";
    }
});

// Adamas Protocol - Master Engine [cite: 2026-03-06]

// Firebase Initialize (MASTER_CONFIG config.js se aayega)
firebase.initializeApp(MASTER_CONFIG.firebase);
const db = firebase.firestore();

async function initApp() {
    if (window.ethereum) {
        try {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            const userWallet = accounts[0];
            
            // Dashboard par status update
            document.getElementById("status").innerText = "Connected: " + userWallet.substring(0,6) + "...";
            
            // Firebase se points load karein
            loadPoints(userWallet);
        } catch (err) {
            document.getElementById("status").innerText = "Status: Connection Denied";
        }
    }
}

function loadPoints(wallet) {
    db.collection("users").doc(wallet).onSnapshot((doc) => {
        const points = doc.exists ? doc.data().points : 0;
        // Dashboard par points display karein
        const pointsDisplay = document.getElementById("user-points");
        if(pointsDisplay) pointsDisplay.innerText = points;
    });
}

window.onload = initApp;
async function claimTokens() {
    const userWallet = (await ethereum.request({ method: 'eth_accounts' }))[0];
    const userRef = db.collection("users").doc(userWallet);

    userRef.get().then(async (doc) => {
        if (doc.exists && doc.data().points >= 5000) {
            // Yahan Smart Contract trigger hoga [cite: 2026-02-28]
            alert("Processing your 100 Million ABP Airdrop... Please wait.");
            
            // Note: Professional setup mein hum yahan Contract Call karenge
            // Abhi ke liye ye success message dikhayega
            console.log("Contract Call to: " + MASTER_CONFIG.blockchain.contractAddress);
        } else {
            alert("Bhai, kam se kam 5,000 points toh kamao!");
        }
    });
}
