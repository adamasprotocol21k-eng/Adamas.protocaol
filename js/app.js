// Adamas Protocol - Global Logic
let userStats = JSON.parse(localStorage.getItem('adamas_user')) || {
    balance: 0,
    referrals: 0,
    isWalletConnected: false,
    address: ""
};

function saveStats() {
    localStorage.setItem('adamas_user', JSON.stringify(userStats));
}

// Wallet Connection Logic
async function connectWallet() {
    if (window.ethereum) {
        try {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            userStats.address = accounts[0];
            userStats.isWalletConnected = true;
            saveStats();
            window.location.href = "dashboard.html";
        } catch (error) {
            alert("Connection rejected");
        }
    } else {
        alert("Please use a Web3 Browser or MetaMask");
    }
}

// Update UI Data
function updateUI() {
    const balEl = document.getElementById('balance');
    const addrEl = document.getElementById('walletAddress');
    if (balEl) balEl.innerText = userStats.balance.toFixed(2);
    if (addrEl) addrEl.innerText = userStats.address.substring(0, 6) + "..." + userStats.address.substring(38);
}

