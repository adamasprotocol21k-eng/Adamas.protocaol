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
