// ADAMAS PROTOCOL - Staking & Lock System
document.addEventListener('DOMContentLoaded', () => {
    // 1. Data Loading
    let stakedBalance = parseFloat(localStorage.getItem('staked_abp') || 0);
    let claimCount = parseInt(localStorage.getItem('claim_count') || 0);
    let lockTimestamp = localStorage.getItem('staking_lock_time') || null;

    const claimBtn = document.getElementById('claimRewardBtn');
    const timerBox = document.getElementById('countdownBox');
    const timerDisplay = document.getElementById('timerDisplay');
    const lockBadge = document.getElementById('lockStatus');

    // 2. Logic to check Lock Status
    function checkLockStatus() {
        if (lockTimestamp) {
            const now = Date.now();
            const lockDuration = 24 * 24 * 60 * 60 * 1000; // 24 days in ms
            const unlockTime = parseInt(lockTimestamp) + lockDuration;

            if (now < unlockTime) {
                // System is Locked
                const diff = unlockTime - now;
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                
                timerBox.style.display = 'block';
                timerDisplay.innerText = `${days}d ${hours}h left`;
                lockBadge.innerText = "LOCKED";
                lockBadge.style.background = "red";
                claimBtn.disabled = true;
                claimBtn.innerText = "VAULT LOCKED";
                return true;
            } else {
                // Lock Period Over
                localStorage.removeItem('staking_lock_time');
                localStorage.setItem('claim_count', 0);
                location.reload();
            }
        }
        return false;
    }

    // 3. Staking Action
    document.getElementById('stakeConfirmBtn').addEventListener('click', () => {
        if (checkLockStatus()) return alert("Vault is locked!");
        
        const amount = parseFloat(document.getElementById('stakeInput').value);
        if (amount >= 500) {
            stakedBalance += amount;
            localStorage.setItem('staked_abp', stakedBalance);
            alert(`Successfully staked ${amount} ABP!`);
            location.reload();
        } else {
            alert("Minimum staking is 500 ABP.");
        }
    });

    // 4. Claim Action (The 3x Rule)
    claimBtn.addEventListener('click', () => {
        if (stakedBalance <= 0) return alert("Nothing staked yet!");
        
        claimCount++;
        localStorage.setItem('claim_count', claimCount);

        if (claimCount >= 3) {
            // Activate 24 Days Lock
            localStorage.setItem('staking_lock_time', Date.now());
            alert("Warning: This was your 3rd claim. Your vault is now locked for 24 days!");
            checkLockStatus();
        } else {
            // Normal Claim
            window.addABP(stakedBalance * 0.05); // Sample reward calculation
            alert(`Claim Successful! (${claimCount}/3 claims done)`);
            location.reload();
        }
    });

    // Initial Checks
    document.getElementById('claimCountText').innerText = `${claimCount}/3`;
    checkLockStatus();
});

