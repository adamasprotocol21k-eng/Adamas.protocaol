// wallet.js
let provider;
let signer;
let userAddress = null;

const connectWalletBtn = document.getElementById("connectWalletBtn");
const walletAddressSpan = document.getElementById("walletAddress");

async function connectWallet() {
    if (window.ethereum) {
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            provider = new ethers.providers.Web3Provider(window.ethereum);
            signer = provider.getSigner();
            userAddress = await signer.getAddress();
            walletAddressSpan.innerText = userAddress.slice(0, 6) + "..." + userAddress.slice(-4);
            connectWalletBtn.innerText = "Wallet Connected ✅";
            showPopup("Wallet Connected Successfully 🎉");
            initDashboard();
        } catch (err) {
            console.error(err);
            showPopup("Wallet Connection Failed ⚠️");
        }
    } else {
        alert("Please install MetaMask!");
    }
}

connectWalletBtn.addEventListener("click", connectWallet);

// POPUP FUNCTION
function showPopup(message) {
    const popup = document.createElement("div");
    popup.className = "popup";
    popup.innerText = message;
    document.body.appendChild(popup);
    setTimeout(() => {
        popup.remove();
    }, 3000);
}
