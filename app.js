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

let currentUser = null;

let balance = 1000; 
let isLocked = false;

// 1. AUTH & SOCIAL FLOW
document.getElementById('connectBtn').onclick = async () => {
    // Wallet connect logic
    document.getElementById('socialTasks').style.display = 'block';
};

document.getElementById('unlockBtn').onclick = () => {
    document.getElementById('authOverlay').style.display = 'none';
    document.getElementById('mainDash').style.opacity = '1';
    document.getElementById('mainDash').style.pointer_events = 'auto';
};

// 2. FAN SPIN LOGIC (Random 2000 ABP)
function spinFan() {
    const wheel = document.getElementById('wheel');
    wheel.style.transform = `rotate(${Math.random() * 3600 + 360}deg)`;
    
    setTimeout(() => {
        const win = Math.floor(Math.random() * 2000);
        updateBalance(win);
        alert(`🌀 Fan se aapko mile: ${win} ABP Points!`);
    }, 3000);
}

// 3. TEEN PATTI (Triple Logic)
function playTeenPatti() {
    const cards = ['A', 'K', 'Q', 'J'];
    let res = [cards[Math.floor(Math.random()*4)], cards[Math.floor(Math.random()*4)], cards[Math.floor(Math.random()*4)]];
    alert(`Cards: ${res.join(' - ')}`);

    if(res[0] === res[1] && res[1] === res[2]) {
        let win = 0;
        if(res[0] === 'A') win = 3000;
        else if(res[0] === 'K') win = 2500;
        else if(res[0] === 'Q') win = 2000;
        else win = 1000;
        updateBalance(win);
        alert(`🏆 TRIPLE ${res[0]}! Jackpot: ${win} ABP`);
    } else {
        alert("Try Again for Triples!");
    }
}

// 4. KNOWLEDGE QUIZ (Math & GK)
function startQuiz(type) {
    if(isLocked) return alert("You are locked for 24h!");
    
    let q = type === 'math' ? "15 + 25 = ?" : "Capital of India?";
    let ans = type === 'math' ? "40" : "Delhi";
    
    let userAns = prompt(q);
    if(userAns === ans) {
        updateBalance(50);
        alert("Correct! +50 ABP");
    } else {
        isLocked = true;
        alert("Wrong! Account locked for 24 hours.");
        setTimeout(() => isLocked = false, 86400000);
    }
}

// 5. LOTTERY SYSTEM
function buyLottery() {
    if(balance < 1000) return alert("Need 1000 ABP for Ticket");
    balance -= 1000;
    alert("🎟️ Ticket Bought! 10 Winners will share 500000 ABP Pool.");
    // Firebase update logic
}

function updateBalance(amt) {
    balance += amt;
    document.getElementById('abpBalance').innerText = balance.toFixed(2);
}
