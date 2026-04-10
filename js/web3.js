const web3Handler = {
    amoyChainId: '0x13882', // Amoy Testnet Hex Code

    checkNetwork: async () => {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        if (chainId !== web3Handler.amoyChainId) {
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: web3Handler.amoyChainId }],
                });
            } catch (err) {
                // Agar network add nahi hai toh add karwao
                console.log("Adding Amoy Network...");
            }
        }
    },

    getUserWallet: async () => {
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        return accounts[0];
    }
};
