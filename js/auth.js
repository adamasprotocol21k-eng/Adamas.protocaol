/**
 * ADAMAS PROTOCOL - Auth & Wallet Logic
 */

const AuthModule = {
    wallet: null,

    async connect() {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                this.wallet = accounts[0];
                localStorage.setItem('userWallet', this.wallet);
                
                // Initialize User in Firebase
                await this.syncUser(this.wallet);
                
                return this.wallet;
            } catch (error) {
                console.error("Connection Failed", error);
                return null;
            }
        } else {
            alert("Please install MetaMask or TrustWallet!");
            return null;
        }
    },

    async syncUser(address) {
        // Firebase sync logic call (Database.js se connect hoga)
        const userKey = address.toLowerCase().replace(/[^a-z0-9]/g, "");
        const userData = await window.DBModule.getUserData(address);
        
        if (!userData) {
            // New User Setup
            const newUser = {
                address: address,
                balance: 100, // Welcome Bonus
                energy: 100,
                joinedAt: Date.now(),
                lastCheckIn: 0
            };
            await window.DBModule.saveUser(address, newUser);
        }
    }
};

window.AuthModule = AuthModule;
