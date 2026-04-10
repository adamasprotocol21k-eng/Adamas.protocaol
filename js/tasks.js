// ADAMAS PROTOCOL - Tasks & Referral Engine (Final)
import { getDatabase, ref, get, update } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";

const db = getDatabase();
let userWallet = localStorage.getItem('adamas_user');

// 1. Referral Link Generate Karna
function generateReferralLink() {
    const baseUrl = window.location.origin;
    const refLink = `${baseUrl}/index.html?ref=${userWallet}`;
    document.getElementById('referralLink').value = refLink;
}

// 2. Referral Check Karna (Jab naya user join kare)
async function checkReferral() {
    const urlParams = new URLSearchParams(window.location.search);
    const referrer = urlParams.get('ref');

    if (referrer && referrer !== userWallet) {
        const referrerRef = ref(db, 'users/' + referrer);
        const snapshot = await get(referrerRef);

        if (snapshot.exists()) {
            let currentRefs = snapshot.val().referrals || 0;
            await update(referrerRef, {
                referrals: currentRefs + 1
            });
            console.log("Referral counted for:", referrer);
        }
    }
}

// 3. Eligibility Check (10 Referrals + Tasks)
async function checkEligibility() {
    const userRef = ref(db, 'users/' + userWallet);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
        const data = snapshot.val();
        const refCount = data.referrals || 0;
        const isVerified = data.isVerified || false;

        // UI update karna (Dashboard par dikhane ke liye)
        document.getElementById('refCount').innerText = `${refCount}/10`;
        
        if (refCount >= 10 && isVerified) {
            document.getElementById('statusBadge').innerText = "ELIGIBLE FOR ADS";
            document.getElementById('statusBadge').className = "badge-success";
        } else {
            document.getElementById('statusBadge').innerText = "NOT ELIGIBLE";
            document.getElementById('statusBadge').className = "badge-danger";
        }
    }
}

// Global Execution
if (userWallet) {
    checkReferral();
    generateReferralLink();
    setInterval(checkEligibility, 5000); // Har 5 sec mein status update hoga
}
