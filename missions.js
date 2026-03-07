// missions.js

// DIAMOND MINES GAME
const diamondGrid = document.querySelector(".diamond-grid");
for (let i = 0; i < 10; i++) {
    const box = document.createElement("div");
    box.innerText = "💎";
    box.addEventListener("click", () => {
        const reward = Math.floor(Math.random() * 991) + 10;
        userPoints += reward;
        userPointsSpan.innerText = userPoints;
        showPopup(`💎 You found a diamond! +${reward} ABP`);
        box.style.pointerEvents = "none";
        box.style.opacity = 0.5;
    });
    diamondGrid.appendChild(box);
}

// THREE CARD GAME
const cardGrid = document.querySelector(".card-grid");
const cardTypes = ["A", "K", "Q", "J", "10"];
for (let i = 0; i < 5; i++) {
    const card = document.createElement("div");
    card.innerText = cardTypes[Math.floor(Math.random() * cardTypes.length)];
    card.addEventListener("click", () => {
        const reward = Math.floor(Math.random() * 501) + 500; // 500-1000 ABP
        userPoints += reward;
        userPointsSpan.innerText = userPoints;
        showPopup(`🎴 Card Reward: +${reward} ABP`);
        card.style.pointerEvents = "none";
        card.style.opacity = 0.5;
    });
    cardGrid.appendChild(card);
}

// LOTTERY
const lotteryList = document.getElementById("lotteryList");
const buyLotteryTicket = document.getElementById("buyLotteryTicket");
const lotteryRewardSpan = document.getElementById("lotteryReward");
buyLotteryTicket.addEventListener("click", () => {
    const ticketNum = document.getElementById("lotteryTicketNum").value;
    if (userPoints < 1000 || !ticketNum) {
        showPopup("Insufficient ABP or invalid ticket ❌");
        return;
    }
    userPoints -= 1000;
    userPointsSpan.innerText = userPoints;
    const li = document.createElement("li");
    li.innerText = `Ticket #${ticketNum} - ${userAddress.slice(0,6)}...${userAddress.slice(-4)}`;
    lotteryList.appendChild(li);
    showPopup(`🎟️ Lottery Ticket Purchased!`);
});

// REFERRAL
const refLinkInput = document.getElementById("refLink");
const refCountSpan = document.getElementById("refCount");
function generateReferral() {
    if (!userAddress) return;
    const link = `${window.location.href}?ref=${userAddress}`;
    refLinkInput.value = link;
    refCountSpan.innerText = Math.floor(Math.random() * 10); // Example
}
setInterval(generateReferral, 2000);
