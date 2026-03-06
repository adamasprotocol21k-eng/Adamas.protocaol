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
    if(!currentUserWallet) return alert("Pehle Wallet Connect karein!");
    
    const userRef = db.collection("users").doc(currentUserWallet);
    
    // Yahan hum points aur social status update kar rahe hain
    await userRef.update({
        points: firebase.firestore.FieldValue.increment(500), // Welcome Reward
        hasJoinedSocials: true
    });
    
    alert("Congrats! 500 ABP Reward Added.");
    unlockDashboard();
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
