// Firebase SDK modules import karein
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onValue, set, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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
const db = getDatabase(app);

/** * Maintenance Mode Logic
 * Jab Firebase mein 'settings/maintenance' true hoga, toh user ko 
 * maintenance screen dikhegi.
 */
export function monitorStatus() {
    const statusRef = ref(db, 'settings/maintenance');
    onValue(statusRef, (snapshot) => {
        const isMaintenance = snapshot.val();
        const screen = document.getElementById('maintenance-screen');
        if (isMaintenance) {
            screen.classList.remove('hidden');
            console.log("🛠️ Platform is in Maintenance Mode.");
        } else {
            screen.classList.add('hidden');
        }
    });
}

// Export Database for other files
export { db, ref, set, get };
