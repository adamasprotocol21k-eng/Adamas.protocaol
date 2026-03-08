
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

const wallet = "0x6DbC17D9950e0b3A7627ec6bFc6b210A998da690";
let balance = 0;

// Update Live Pool and User Tickets
db.ref('lottery/pool').on('value', (s) => document.getElementById('totalPool').innerText = s.val() || "50000");
db.ref('users/' + wallet).on('value', (s) => {
    balance = s.val().balance || 0;
    document.getElementById('myTickets').innerText = s.val().tickets || 0;
});

function buyTicket() {
    if(balance < 100) return alert("Pehle ABP Points earn karein!");
    
    // Deduct 100 ABP and Add 1 Ticket
    db.ref('users/' + wallet).update({
        balance: balance - 100,
        tickets: (parseInt(document.getElementById('myTickets').innerText) + 1)
    });

    // Add to Global Pool
    db.ref('lottery/pool').transaction((current) => (current || 50000) + 50);
    
    alert("🎟️ Ticket Purchased Successfully! Good luck for the Diamond Draw.");
}
