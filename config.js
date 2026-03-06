// Adamas Protocol Master Configuration
const MASTER_CONFIG = {
    firebase: {
        apiKey: "YOUR_API_KEY", // Firebase Console se copy karein
        authDomain: "adamas-protocol.firebaseapp.com",
        projectId: "adamas-protocol",
        storageBucket: "adamas-protocol.appspot.com",
        messagingSenderId: "YOUR_SENDER_ID",
        appId: "YOUR_APP_ID"
    },
    blockchain: {
        contractAddress: "0x6DbC17D9950e0b3A7627ec6bFc6b210A998da690", // Aapka ABP Smart Contract [cite: 2026-02-26]
        minWithdraw: 5000, // Kam se kam withdrawal limit [cite: 2026-02-24]
        network: "Polygon Amoy"
    }
};
