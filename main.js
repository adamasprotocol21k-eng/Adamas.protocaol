/* -----------------------------
   WALLET CONNECT (Simulated)
----------------------------- */
let walletConnected = false;
const walletButton = document.getElementById("wallet-connect-btn");
const walletAddressDisplay = document.getElementById("wallet-address");

walletButton.addEventListener("click", async () => {
  // Simulated wallet connect
  walletConnected = true;
  walletAddressDisplay.innerText = "0xABCD...1234";
  showPopup("🎉 Wallet Connected!", "Welcome to the Premium Crypto Hub!");
  initDashboard();
});

/* -----------------------------
   POPUP & CONFETTI FUNCTION
----------------------------- */
function showPopup(title, message) {
  const popup = document.createElement("div");
  popup.className = "popup show";
  popup.innerHTML = `<h3>${title}</h3><p>${message}</p><button onclick="this.parentElement.remove()">Close</button>`;
  document.body.appendChild(popup);

  // Create confetti
  for(let i=0;i<20;i++){
    const confetti = document.createElement("div");
    confetti.className = "confetti";
    confetti.style.left = Math.random() * window.innerWidth + "px";
    confetti.style.backgroundColor = `hsl(${Math.random()*360}, 100%, 50%)`;
    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 3000);
  }
}

/* -----------------------------
   DASHBOARD INIT
----------------------------- */
let userPoints = 0;
let dailyChecked = false;

function initDashboard() {
  if(!walletConnected) return;
  
  updatePointsDisplay();
  setupDailyCheckin();
  setupStaking();
}

/* -----------------------------
   UPDATE POINTS DISPLAY
----------------------------- */
function updatePointsDisplay() {
  const pointsEl = document.getElementById("user-points");
  pointsEl.innerText = userPoints;
}

/* -----------------------------
   DAILY CHECK-IN LOGIC
----------------------------- */
function setupDailyCheckin() {
  const dailyBtn = document.getElementById("daily-checkin-btn");
  dailyBtn.addEventListener("click", () => {
    if(dailyChecked){
      showPopup("⚠️ Already Claimed", "You have already claimed today!");
      return;
    }
    const reward = Math.floor(Math.random()*1000) + 10; // 10-1000 ABP
    userPoints += reward;
    updatePointsDisplay();
    dailyChecked = true;
    showRewardAnimation(reward);
  });
}

/* -----------------------------
   STAKING & CLAIM
----------------------------- */
let stakedPoints = 0;

function setupStaking() {
  const stakeBtn = document.getElementById("stake-btn");
  const claimBtn = document.getElementById("claim-btn");

  stakeBtn.addEventListener("click", () => {
    if(userPoints <= 0){
      showPopup("⚠️ No Points", "You have no points to stake!");
      return;
    }
    stakedPoints += userPoints;
    userPoints = 0;
    updatePointsDisplay();
    showPopup("💎 Staked!", `${stakedPoints} points staked successfully.`);
  });

  claimBtn.addEventListener("click", () => {
    if(stakedPoints <= 0){
      showPopup("⚠️ Nothing to Claim", "You have no staked points.");
      return;
    }
    const reward = Math.floor(stakedPoints * 0.05); // 5% reward
    userPoints += stakedPoints + reward;
    stakedPoints = 0;
    updatePointsDisplay();
    showPopup("🎉 Claimed!", `You received ${reward} ABP as staking reward!`);
  });
}

/* -----------------------------
   REWARD ANIMATION
----------------------------- */
function showRewardAnimation(points) {
  const rewardEl = document.createElement("div");
  rewardEl.className = "reward-text";
  rewardEl.innerText = `+${points} ABP! 🎉`;
  document.body.appendChild(rewardEl);
  
  setTimeout(() => rewardEl.remove(), 2000);

  // Coin pop
  for(let i=0
