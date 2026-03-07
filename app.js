import { db, ref, set, get, monitorStatus } from './firebase.js';

let currentUser = null;

document.addEventListener('DOMContentLoaded', () => {
    monitorStatus(); 
});

window.connectWallet = async () => {
    if (window.ethereum) {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            currentUser = accounts[0];
            document.getElementById('walletBtn').innerHTML = `<i data-lucide="user"></i> ${currentUser.slice(0,6)}...`;
            lucide.createIcons();
            syncUserData(currentUser);
        } catch (err) { console.error(err); }
    } else { alert("Please install MetaMask!"); }
};

window.handleDailyCheckIn = async () => {
    if(!currentUser) return alert("Please connect wallet first!");
    const userRef = ref(db, `users/${currentUser}`);
    const snap = await get(userRef);
    let data = snap.val() || { points: 0 };
    data.points += 50;
    await set(userRef, data);
    document.getElementById('abpBalance').innerText = data.points.toFixed(2);
    alert("💎 +50 ABP Added Successfully!");
};

window.processClaim = () => alert("📥 Rewards claim logic will unlock after Day 7!");
window.openStaking = () => alert("📊 Staking: Rewards 12% APY starting soon!");
window.openKnowledge = () => alert("📚 ADAMAS Academy: Knowledge center coming soon.");
window.openReferral = () => {
    const link = `https://t.me/daimodmo?start=${currentUser || 'join'}`;
    alert("👥 Share your link: " + link);
};

async function syncUserData(address) {
    const userRef = ref(db, `users/${address}`);
    const snap = await get(userRef);
    if(snap.exists()) {
        document.getElementById('abpBalance').innerText = snap.val().points.toFixed(2);
    } else {
        await set(userRef, { points: 1000, wallet: address }); // Welcome Bonus
        document.getElementById('abpBalance').innerText = "1000.00";
    }
}
