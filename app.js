// app.js
import { connectWallet, getUserPoints } from "./wallet.js";
import { dailyCheckin, stakePoints, claimRewards, showPopup } from "./missions.js";

// Initialize Dashboard
export function initDashboard() {
    document.querySelector(".connect-wallet-btn").addEventListener("click", async () => {
        await connectWallet();
        await getUserPoints();
    });

    document.querySelector(".daily-checkin-btn").addEventListener("click", () => {
        dailyCheckin();
    });

    document.querySelector(".stake-btn").addEventListener("click", () => {
        const amount = parseInt(prompt("कितने पॉइंट्स स्टेक करना चाहते हैं?"));
        stakePoints(amount);
    });

    document.querySelector(".claim-btn").addEventListener("click", () => {
        claimRewards();
    });

    // Gaming - Three Cards
    document.querySelectorAll(".three-card-game .card").forEach(card => {
        card.addEventListener("click", () => {
            const reward = Math.floor(Math.random() * 1500) + 500;
            showPopup(`🎯 आपने ${reward} AB Points जीत लिए!`);
        });
    });

    // Gaming - Diamond Mine
    document.querySelectorAll(".diamond-mine .diamond").forEach(diamond => {
        diamond.addEventListener("click", () => {
            const points = Math.floor(Math.random() * 1000) + 10;
            showPopup(`💎 आपने ${points} AB Points पाए!`);
        });
    });

    // Lottery Buy Ticket
    document.querySelector(".lottery-buy-btn").addEventListener("click", () => {
        const ticketNumber = Math.floor(Math.random() * 9999);
        showPopup(`🎫 आपने टिकट नंबर ${ticketNumber} खरीदा!`);
    });

    // Referral Copy
    document.querySelector(".referral-copy-btn").addEventListener("click", () => {
        const referralLink = "https://yourwebsite.com/?ref=USER123";
        navigator.clipboard.writeText(referralLink);
        showPopup("🔗 Referral Link कॉपी कर लिया गया!");
    });
}
