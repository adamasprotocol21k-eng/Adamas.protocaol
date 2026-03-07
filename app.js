// AGAR MAINTENANCE ON KARNA HAI TO 'true' KAREIN, OFF KE LIYE 'false'
const MAINTENANCE_MODE = true; 

window.onload = () => {
    if (MAINTENANCE_MODE) {
        // Sab kuch chhupa do aur sirf Maintenance Screen dikhao
        document.body.innerHTML = `
            <div style="height:100vh; display:flex; flex-direction:column; justify-content:center; align-items:center; background:#020617; color:#00f2ff; font-family:'Orbitron',sans-serif; text-align:center; padding:20px;">
                <h1 style="font-size:50px; text-shadow:0 0 20px #00f2ff;">💎 ADAMAS UPGRADE</h1>
                <p style="color:white; font-size:20px;">Back-end work in progress. We are making Adamas stronger!</p>
                <div style="margin-top:20px; border:2px solid #00f2ff; padding:10px 20px; border-radius:50px;">COMING BACK SOON</div>
            </div>
        `;
    } else {
        console.log("Adamas Portal Live 🚀");
    }
};

let userAccount = null;
let currentBalance = 0;

async function connectWallet() {
    if (window.ethereum) {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            userAccount = accounts[0];
            
            // Switch to Amoy
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x13882' }],
            });

            document.getElementById('landing').style.display = 'none';
            document.getElementById('dashboard').style.display = 'block';
            document.getElementById('walletBtn').innerText = userAccount.slice(0,6) + "...";
            document.getElementById('userAddress').innerText = userAccount;
            
            loadUserData();
        } catch (error) {
            alert("Connection Failed. Please use Polygon Amoy Testnet.");
        }
    }
}
let userAccount = null;
let currentBalance = 0;

async function connectWallet() {
    if (window.ethereum) {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            userAccount = accounts[0];
            
            // Switch to Amoy
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x13882' }],
            });

            document.getElementById('landing').style.display = 'none';
            document.getElementById('dashboard').style.display = 'block';
            document.getElementById('walletBtn').innerText = userAccount.slice(0,6) + "...";
            document.getElementById('userAddress').innerText = userAccount;
            
            loadUserData();
        } catch (error) {
            alert("Connection Failed. Please use Polygon Amoy Testnet.");
        }
    }
}

function updateUI() {
    document.getElementById('ads-balance').innerText = currentBalance.toFixed(3);
    const progress = (currentBalance / 5000) * 100;
    document.getElementById('w-progress').style.width = Math.min(progress, 100) + "%";
    document.getElementById('w-text').innerText = `Threshold: ${Math.floor(currentBalance)} / 5000 ABP`;
    
    if (currentBalance >= 5000) {
        document.getElementById('withdrawBtn').disabled = false;
        document.getElementById('withdrawBtn').style.background = "#00f2ff";
    }
}

// Logic for Daily Check-in, Games etc will go here...
