/**
 * ADAMAS PROTOCOL - Auth Module
 * Functionality: Wallet Connection & Network Validation (Polygon Amoy)
 */

const AMOY_CHAIN_ID = '0x13882'; // 80002 in Hex

const AuthModule = {
    userWallet: null,

    // 1. Initial Check: Kya user pehle se connected hai?
    async init() {
        this.userWallet = localStorage.getItem('userWallet');
        if (this.userWallet) {
            console.log("Session restored for:", this.userWallet);
            this.checkNetwork();
        }
    },

    // 2. Connect Wallet Function
    async connect() {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                this.userWallet = accounts[0].toLowerCase();
                
                // Network check karein connect hote hi
                const isCorrectNetwork = await this.checkNetwork();
                
                if (isCorrectNetwork) {
                    localStorage.setItem('userWallet', this.userWallet);
                    console.log("Connected successfully:", this.userWallet);
                    // Yahan hum dashboard load karne ka logic daalenge
                    window.location.reload(); 
                }
            } catch (error) {
                console.error("User rejected connection", error);
                alert("Connection failed. Please approve the request.");
            }
        } else {
            alert("MetaMask not detected. Please install MetaMask to use ADAMAS Protocol.");
        }
    },

    // 3. Network Validation (Polygon Amoy 80002)
    async checkNetwork() {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        
        if (chainId !== AMOY_CHAIN_ID) {
            try {
                // Network switch karne ki koshish karein
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: AMOY_CHAIN_ID }],
                });
                return true;
            } catch (switchError) {
                // Agar network MetaMask mein add nahi hai toh add karwayein
                if (switchError.code === 4902) {
                    alert("Please add Polygon Amoy Testnet to your MetaMask.");
                }
                console.error("Network switch failed", switchError);
                return false;
            }
        }
        return true;
    },

    // 4. Logout (Clear Session)
    logout() {
        localStorage.removeItem('userWallet');
        this.userWallet = null;
        window.location.href = "index.html";
    }
};

// Auto-run on load
window.addEventListener('DOMContentLoaded', () => AuthModule.init());

// Export for global use
window.AuthModule = AuthModule;

