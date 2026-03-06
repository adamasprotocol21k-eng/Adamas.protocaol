// 1. Sabse upar variables define karenge
let userAccount = null;

// 2. WALLET CONNECT FUNCTION: Right side button ke liye
async function connectWallet() {
    if (window.ethereum) {
        try {
            // User ka wallet connect karwana
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            userAccount = accounts[0];
            
            // Button ka naam badal kar address dikhana
            document.getElementById('walletBtn').innerText = userAccount.slice(0,6) + "..." + userAccount.slice(-4);
            
            // 🔥 MAGIC: Landing Page chhupao aur Social Tasks dikhao
            document.getElementById('landing-page').style.display = 'none';
            document.getElementById('social-gateway').style.display = 'block';
            
            console.log("Wallet Connected: " + userAccount);
        } catch (error) {
            alert("Wallet connect karne mein dikkat aayi!");
        }
    } else {
        alert("Please install MetaMask!");
    }
}

// 3. UNLOCK DASHBOARD: Social tasks ke baad dashboard kholne ke liye
function unlockDashboard() {
    // Abhi ke liye hum ise direct open kar rahe hain
    // Baad mein hum check karenge ki user ne click kiya ya nahi
    document.getElementById('social-gateway').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    
    // Yahan hum dashboard load karne ka logic likhenge
    alert("Welcome to Adamas Dashboard! 💎");
}

// 4. Initial Load: Page load hote hi kya hona chahiye
window.onload = () => {
    console.log("Adamas Portal Live 🚀");
};
