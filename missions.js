// missions.js
import { contract, signer, getUserPoints } from "./wallet.js";

// Random AB Points generator for Daily Checkin
export function dailyCheckin() {
    const pointsEarned = Math.floor(Math.random() * 1000) + 10;
    showPopup(`🎉 Congratulations! आपने आज ${pointsEarned} AB Points कमाए!`);
    updatePoints(pointsEarned);
}

// Stake Points
export async function stakePoints(amount) {
    if(!contract) return;
    try {
        const tx = await contract.stake(amount);
        await tx.wait();
        showPopup(`✅ आपने ${amount} पॉइंट्स स्टेक किए!`);
        getUserPoints();
    } catch(err) {
        console.error(err);
        showPopup("❌ स्टेकिंग में समस्या आयी।");
    }
}

// Claim Staked Rewards
export async function claimRewards() {
    if(!contract) return;
    try {
        const tx = await contract.claim();
        await tx.wait();
        showPopup("💰 आपने अपने Rewards क्लेम कर लिए!");
        getUserPoints();
    } catch(err) {
        console.error(err);
        showPopup("❌ क्लेम में समस्या आयी।");
    }
}

// Utility: Update local points UI
function updatePoints(points) {
    const current = parseInt(document.getElementById("user-points").innerText) || 0;
    document.getElementById("user-points").innerText = current + points;
}

// Popup Animation
export function showPopup(message) {
    const popup = document.createElement("div");
    popup.className = "popup-message";
    popup.innerHTML = message;
    document.body.appendChild(popup);
    setTimeout(() => {
        popup.classList.add("show");
    }, 10);
    setTimeout(() => {
        popup.classList.remove("show");
        setTimeout(() => popup.remove(), 500);
    }, 3000);
}
