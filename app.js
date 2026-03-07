// app.js

// TABS FUNCTIONALITY
const tabButtons = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        tabButtons.forEach(b => b.classList.remove("active"));
        tabContents.forEach(tc => tc.classList.remove("active"));
        btn.classList.add("active");
        document.getElementById(btn.dataset.tab).classList.add("active");
    });
});

// DASHBOARD FUNCTIONS
let userPoints = 0;
let stakedPoints = 0;

const userPointsSpan = document.getElementById("userPoints");
const stakedPointsSpan = document.getElementById("stakedPoints");

const dailyCheckinBtn = document.getElementById("dailyCheckinBtn");
dailyCheckinBtn.addEventListener("click", () => {
    const dailyReward = Math.floor(Math.random() * 991) + 10; // 10-1000 ABP
    userPoints += dailyReward;
    userPointsSpan.innerText = userPoints;
    showPopup(`🎉 You earned ${dailyReward} ABP today!`);
});

// STAKING
const stakeAmountInput = document.getElementById("stakeAmount");
const stakeBtn = document.getElementById("stakeBtn");
const claimStakeBtn = document.getElementById("claimStakeBtn");

stakeBtn.addEventListener("click", () => {
    const stakeValue = parseInt(stakeAmountInput.value);
    if (!stakeValue || stakeValue > userPoints) {
        showPopup("Invalid Stake Amount ❌");
        return;
    }
    stakedPoints += stakeValue;
    userPoints -= stakeValue;
    userPointsSpan.innerText = userPoints;
    stakedPointsSpan.innerText = stakedPoints;
    showPopup(`🔒 Staked ${stakeValue} ABP successfully!`);
});

claimStakeBtn.addEventListener("click", () => {
    const reward = Math.floor(stakedPoints * 0.1); // 10% reward
    userPoints += reward;
    userPointsSpan.innerText = userPoints;
    showPopup(`🎁 Claimed ${reward} ABP from staking!`);
});
