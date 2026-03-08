
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCJ2i6r8F66CxKpnbwMEhPS4pwC36V0Kgg",
  authDomain: "adamas-protocol.firebaseapp.com",
  databaseURL: "https://adamas-protocol-default-rtdb.firebaseio.com",
  projectId: "adamas-protocol",
  storageBucket: "adamas-protocol.firebasestorage.app",
  messagingSenderId: "207788425238",
  appId: "1:207788425238:web:025b8544f085dde60af537",
  measurementId: "G-NVCWQ1XQZS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let userWallet = "0x6DbC17D9950e0b3A7627ec6bFc6b210A998da690"; // Default
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

