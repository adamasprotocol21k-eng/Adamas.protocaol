document.getElementById('connectWallet').onclick = async () => {
    if (window.ethereum) {
        try {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            console.log("Connected:", accounts[0]);
            
            // Wallet connect hote hi Social Popup dikhao
            document.getElementById('socialPopup').style.display = 'block';
        } catch (error) {
            alert("Connection Failed!");
        }
    } else {
        alert("Please install MetaMask!");
    }
};

// Simple logic: Button click hone par verify enable kar do
document.querySelectorAll('.social-btn').forEach(btn => {
    btn.onclick = () => {
        document.getElementById('verifySocials').disabled = false;
        document.getElementById('verifySocials').style.background = '#00f2ff';
    };
});

document.getElementById('verifySocials').onclick = () => {
    window.location.href = "dashboard.html"; // Seedha Dashboard par bhej do
};
