import { DBModule } from './database.js';
import { ref, update } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";

const StakingModule = {
    wallet: localStorage.getItem('userWallet'),
    dailyROI: 0.01, // 1% Daily reward

    async init() {
        const user = await DBModule.getUserData(this.wallet);
        if(!user) return;

        document.getElementById('stakedAmount').innerText = (user.stakedBalance || 0).toLocaleString();
        document.getElementById('dailyReward').innerText = `+${((user.stakedBalance || 0) * this.dailyROI).toFixed(2)} ABP`;

        // Check for 24-Day Lock
        if(user.lockUntil && Date.now() < user.lockUntil) {
            document.getElementById('lockMessage').style.display = 'block';
            const daysLeft = Math.ceil((user.lockUntil - Date.now()) / (1000 * 60 * 60 * 24));
            document.getElementById('lockMessage').innerText = `⚠️ SECURITY LOCK: ${daysLeft} Days Remaining`;
        }
    },

    async stake() {
        const amount = parseFloat(document.getElementById('stakeInput').value);
        if(!amount || amount <= 0) return Notify.show("Enter valid amount", "error");

        const user = await DBModule.getUserData(this.wallet);
        
        // Anti-Spam Check: 3 times limit
        let stakeCount = user.stakeCount || 0;
        let lockUntil = user.lockUntil || 0;

        if(Date.now() < lockUntil) {
            return Notify.show("Vault is locked for 24 days!", "error");
        }

        if(user.balance < amount) return Notify.show("Insufficient Balance", "error");

        stakeCount++;
        let newLock = 0;
        if(stakeCount >= 4) {
            newLock = Date.now() + (24 * 24 * 60 * 60 * 1000); // 24 Days Lock
            stakeCount = 0; // Reset count after lock
            Notify.show("Security Triggered: 24-Day Lock Active!", "warning");
        }

        const userRef = ref(window.db, 'users/' + this.wallet.toLowerCase());
        await update(userRef, {
            balance: user.balance - amount,
            stakedBalance: (user.stakedBalance || 0) + amount,
            stakeCount: stakeCount,
            lockUntil: newLock,
            lastStakeUpdate: Date.now()
        });

        Notify.show("ABP Staked Successfully!", "success");
        this.init();
    },

    async unstake() {
        const user = await DBModule.getUserData(this.wallet);
        if(!user.stakedBalance || user.stakedBalance <= 0) return Notify.show("Nothing to unstake", "error");

        if(user.lockUntil && Date.now() < user.lockUntil) {
            return Notify.show("Funds are locked! Wait for 24 days.", "error");
        }

        // Calculate Rewards
        const days = (Date.now() - user.lastStakeUpdate) / (1000 * 60 * 60 * 24);
        const reward = user.stakedBalance * this.dailyROI * days;

        const userRef = ref(window.db, 'users/' + this.wallet.toLowerCase());
        await update(userRef, {
            balance: user.balance + user.stakedBalance + reward,
            stakedBalance: 0,
            lastStakeUpdate: Date.now()
        });

        Notify.show("Funds & Rewards Unlocked!", "success");
        this.init();
    }
};

window.StakingModule = StakingModule;
window.addEventListener('DOMContentLoaded', () => StakingModule.init());
