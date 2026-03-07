// --------------------------
// DASHBOARD FUNCTIONALITY
// --------------------------

let userPoints = 0;          // Total user points
let stakedPoints = 0;        // Total staked points

// Elements
const userPointsSpan = document.getElementById("userPoints");
const stakedPointsSpan = document.getElementById("stakedPoints");
const dailyCheckinBtn = document.getElementById("dailyCheckinBtn");

// --------------------------
// DAILY CHECK-IN
// --------------------------
dailyCheckinBtn.addEventListener("click", () => {
    const dailyReward = Math.floor(Math.random() * 991) + 10; // Random 10-1000 ABP
    userPoints += dailyReward;
    userPointsSpan.innerText = userPoints;
    showPopup(`🎉 You earned ${dailyReward} ABP today!`);
});

// --------------------------
// STAKING FUNCTIONALITY
// --------------------------
const stakeAmountInput = document.getElementById("stakeAmount");
const stakeBtn = document.getElementById("stakeBtn");
const claimStakeBtn = document.getElementById("claimStakeBtn");

stakeBtn.addEventListener("click", () => {
    const stakeValue = parseInt(stakeAmountInput.value);
    if (!stakeValue || stakeValue > userPoints) {
        showPopup("❌ Invalid Stake Amount");
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

// --------------------------
// REFERRAL LINK COPY
// --------------------------
const copyBtn = document.getElementById("copyBtn");
const refLink = document.getElementById("refLink");

copyBtn.addEventListener("click", () => {
    refLink.select();
    refLink.setSelectionRange(0, 99999); // Mobile support
    navigator.clipboard.writeText(refLink.value);
    showPopup("✅ Referral Link Copied!");
});

// --------------------------
// SIMPLE POPUP FUNCTION
// --------------------------
function showPopup(message) {
    const popup = document.createElement("div");
    popup.className = "popup";
    popup.innerText = message;
    document.body.appendChild(popup);

    popup.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(0,0,0,0.8);
        color: #fff;
        padding: 12px 20px;
        border-radius: 12px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.5);
        z-index: 9999;
        font-weight: bold;
        animation: fadeInOut 3s forwards;
    `;

    setTimeout(() => popup.remove(), 3000);
}

// --------------------------
// ANIMATION KEYFRAMES
// --------------------------
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
@keyframes fadeInOut {
  0% {opacity: 0; transform: translateY(-20px);}
  10% {opacity: 1; transform: translateY(0);}
  90% {opacity: 1; transform: translateY(0);}
  100% {opacity: 0; transform: translateY(-20px);}
}`;
document.head.appendChild(styleSheet);
