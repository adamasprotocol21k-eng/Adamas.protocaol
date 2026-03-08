// Referral System State
let myReferralCode = "";
let totalReferrals = 0;
let referralEarnings = 0;

// 1. Generate Referral Link
function generateReferralCode() {
    if(!currentUser) return alert("Please connect wallet first!");
    
    // User ke wallet address ke last 6 characters se code banana
    myReferralCode = "ADMS-" + currentUser.substring(currentUser.length - 6).toUpperCase();
    document.getElementById('refCodeDisplay').innerText = myReferralCode;
    
    // Firebase mein code save karna
    db.ref('referrals/' + myReferralCode).set({
        owner: currentUser,
        timestamp: Date.now()
    });
}

// 2. Direct Reward & Daily Commission Logic
// Jab koi user kisi ke code se join karega
function processReferralJoin(invitedByCode) {
    const directReward = 100; // Direct 100 ABP milenge
    
    db.ref('referrals/' + invitedByCode).once('value', (snapshot) => {
        if (snapshot.exists()) {
            const ownerAddress = snapshot.val().owner;
            
            // a. Direct Reward Update
            db.ref('users/' + ownerAddress + '/balance').transaction(b => (b || 0) + directReward);
            
            // b. Referral List Update
            db.ref('users/' + ownerAddress + '/referralCount').transaction(c => (c || 0) + 1);
            
            alert("Referral Successful! Reward distributed.");
        }
    });
}

// 3. Daily Commission (User ke task karne par)
// Agar referral user game khelta hai ya check-in karta hai, toh 10% upline ko jayega
function distributeCommission(userAddress, taskReward) {
    db.ref('users/' + userAddress + '/invitedBy').once('value', (snapshot) => {
        if (snapshot.exists()) {
            const uplineAddress = snapshot.val();
            const commission = taskReward * 0.10; // 10% Commission
            db.ref('users/' + uplineAddress + '/balance').transaction(b => (b || 0) + commission);
        }
    });
}
