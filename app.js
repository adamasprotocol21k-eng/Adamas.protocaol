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
