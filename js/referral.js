// Referral System Logic
function initReferral() {
    const userStats = JSON.parse(localStorage.getItem('adamas_user'));
    const referInput = document.getElementById('referLink');
    const inviteCountEl = document.getElementById('inviteCount');
    const referIncomeEl = document.getElementById('referIncome');

    if (userStats && userStats.address) {
        // असली वेबसाइट लिंक के साथ वॉलेट एड्रेस जोड़ना
        const myReferLink = window.location.origin + "?ref=" + userStats.address;
        referInput.value = myReferLink;
        
        // डमी डेटा (इसे बाद में डेटाबेस से सिंक करेंगे)
        inviteCountEl.innerText = userStats.referrals || 0;
        referIncomeEl.innerText = (userStats.referrals * 500) + " ABP";
    } else {
        referInput.value = "Connect Wallet First!";
    }
}

function copyLink() {
    const copyText = document.getElementById("referLink");
    if(copyText.value.includes("0x")) {
        copyText.select();
        copyText.setSelectionRange(0, 99999);
        document.execCommand("copy");
        alert("Referral Link Copied!");
    } else {
        alert("Please connect wallet to get your link.");
    }
}
