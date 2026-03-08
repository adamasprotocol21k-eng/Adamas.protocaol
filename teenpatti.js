// Firebase Config (Wahi copy karein jo app.js mein hai)
const firebaseConfig = {
    apiKey: "PASTE_YOUR_API_KEY",
    databaseURL: "PASTE_YOUR_DB_URL",
    projectId: "PASTE_YOUR_PROJECT_ID",
    appId: "PASTE_YOUR_APP_ID"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let userWallet = "0x1E12BFE8eB6Ef1334cF8f873F2d9Abad5C56daDB"; // Default
let currentABP = 0;

// Load Balance
db.ref('users/' + userWallet + '/balance').on('value', (snap) => {
    currentABP = snap.val() || 0;
    document.getElementById('gameBalance').innerText = currentABP.toFixed(2);
});

function playHand() {
    const bet = parseFloat(document.getElementById('betAmount').value);
    const status = document.getElementById('gameStatus');
    
    if (bet > currentABP) return alert("Insufficient ABP Balance!");

    status.innerText = "Shuffling...";
    
    setTimeout(() => {
        // Random Game Logic
        const win = Math.random() > 0.6; // 40% Chance to win
        const cardArea = document.getElementById('cardArea');
        cardArea.innerHTML = '';

        // Generate 3 Random Cards
        for(let i=0; i<3; i++) {
            const val = Math.floor(Math.random() * 10) + 1;
            cardArea.innerHTML += `<div class="card">${val}</div>`;
        }

        if (win) {
            const profit = bet * 2;
            db.ref('users/' + userWallet + '/balance').set(currentABP + profit);
            status.innerHTML = `<span style="color: #39ff14;">WINNER! +${profit} ABP</span>`;
        } else {
            db.ref('users/' + userWallet + '/balance').set(currentABP - bet);
            status.innerHTML = `<span style="color: #ff0000;">LOSS! -${bet} ABP</span>`;
        }
    }, 1000);
}

