window.AdamasWeb3 = {
    connectWallet: async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                // Check if Amoy Network
                const chainId = await window.ethereum.request({ method: 'eth_chainId' });
                if (chainId !== '0x13882') {
                    await window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: '0x13882' }],
                    });
                }
                return accounts[0];
            } catch (err) { return null; }
        } else {
            alert("Please Install MetaMask");
            return null;
        }
    }
};
