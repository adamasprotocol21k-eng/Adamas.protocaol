// Load User Data on Start
window.onload = () => {
    const savedAddress = localStorage.getItem('adamas_user');
    const addressEl = document.getElementById('user-address');
    
    if (savedAddress) {
        addressEl.innerText = savedAddress.slice(0, 6) + "..." + savedAddress.slice(-4);
    } else {
        // Agar user direct yahan aa gaya hai bina wallet connect kiye
        window.location.href = "index.html";
    }
};

let miningActive = false;
let balance = 0.0000;

function toggleMining() {
    const btn = document.querySelector('.btn-mine-start');
    miningActive = !miningActive;

    if (miningActive) {
        btn.innerText = "MINING IN PROGRESS...";
        btn.style.borderColor = "#00ff88";
        btn.style.color = "#00ff88";
        startCounter();
    } else {
        btn.innerText = "RESUME MINING";
        btn.style.borderColor = "var(--cyan)";
    }
}

function startCounter() {
    if (!miningActive) return;
    
    // Simulate mining increment
    balance += 0.000125; 
    document.getElementById('total-balance').innerText = balance.toFixed(4);
    
    setTimeout(startCounter, 3000); // Har 3 second mein balance badhega
}

