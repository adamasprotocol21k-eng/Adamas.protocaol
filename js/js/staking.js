/**
 * ADAMAS PROTOCOL - Staking Module
 * Functionality: Lock ABP tokens and earn rewards based on time
 */

const StakingModule = {
    // APY Config (Annual Percentage Yield)
    rates: {
        7: 5,   // 7 Days = 5% Bonus
        30: 15, // 30 Days = 15% Bonus
        90: 40  // 90 Days = 40% Bonus
    },

    // 1. STAKE TOKENS LOGIC
    async stake(amount, durationDays) {
        const wallet = localStorage.getItem('userWallet');
        if (!wallet) return Notify.show("Connect Wallet!", "error");

        const userData = await window.DBModule.getUserData(wallet);
        if (userData.balance < amount) {
            return Notify.show("Insufficient ABP Balance!", "error");
        }

        const unlockDate = Date.now() + (durationDays * 24 * 60 * 60 * 1000);
        const bonusRate = this.rates[durationDays];

        // Prepare Staking Data
        const stakeData = {
            amount: amount,
            stakedAt: Date.now(),
            unlockAt: unlockDate,
            expectedBonus: Math.floor(amount * (bonusRate / 100)),
            status: 'locked'
        };

        try {
            // Subtract from balance and add to stake
            const userKey = wallet.toLowerCase().substring(0, 15);
            const { getDatabase, ref, update, increment } = await import("https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js");
            const db = getDatabase();
            
            await update(ref(db, 'users/' + userKey), {
                balance: increment(-amount),
                staking: stakeData
            });

            Notify.show(`Successfully Staked ${amount} ABP for ${durationDays} Days!`, "success");
            setTimeout(() => window.location.reload(), 2000);
        } catch (error) {
            console.error("Staking Error:", error);
            Notify.show("Staking Failed. Try again.", "error");
        }
    },

    // 2. CHECK UNLOCK STATUS
    async checkUnlock() {
        const wallet = localStorage.getItem('userWallet');
        const userData = await window.DBModule.getUserData(wallet);

        if (userData.staking && userData.staking.status === 'locked') {
            if (Date.now() >= userData.staking.unlockAt) {
                // Return original + bonus
                const totalReturn = userData.staking.amount + userData.staking.expectedBonus;
                await window.DBModule.addReward(wallet, totalReturn, "Staking Maturity");
                
                // Clear stake record
                const userKey = wallet.toLowerCase().substring(0, 15);
                const { getDatabase, ref, update } = await import("https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js");
                const db = getDatabase();
                await update(ref(db, 'users/' + userKey + '/staking'), { status: 'claimed' });

                Notify.show(`Staking Mature! ${totalReturn} ABP returned to vault.`, "success");
            } else {
                Notify.show("Tokens are still locked in the vault.", "info");
            }
        }
    }
};

// Global Access
window.StakingModule = StakingModule;

