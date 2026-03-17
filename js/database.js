/**
 * ADAMAS PROTOCOL - Firebase Realtime Engine
 * Logic: Handle all user data, balance updates, and security checks.
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getDatabase, ref, set, get, onValue, update, increment } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";

// --- YOUR FIREBASE CONFIG (Synced with Project) ---
const firebaseConfig = {
    apiKey: "AIzaSyCJ2i6r8F66CxKpnbwMEhPS4pwC36V0Kgg",
    authDomain: "adamas-protocol.firebaseapp.com",
    databaseURL: "https://adamas-protocol-default-rtdb.firebaseio.com",
    projectId: "adamas-protocol",
    storageBucket: "adamas-protocol.firebasestorage.app",
    messagingSenderId: "207788425238",
    appId: "1:207788425238:web:025b8544f085dde60af537"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const DBModule = {
    // 1. Get User Profile
    async getUserData(address) {
        const userRef = ref(db, 'users/' + address.toLowerCase());
        const snapshot = await get(userRef);
        return snapshot.exists() ? snapshot.val() : null;
    },

    // 2. Save/Update User Profile
    async saveUser(address, data) {
        const userRef = ref(db, 'users/' + address.toLowerCase());
        await set(userRef, data);
    },

    // 3. Real-time Balance Listener (Auto Updates Dashboard)
    listenToProfile(address, callback) {
        const userRef = ref(db, 'users/' + address.toLowerCase());
        onValue(userRef, (snapshot) => {
            if (snapshot.exists()) {
                callback(snapshot.val());
            }
        });
    },

    // 4. Secure Balance Update (Add/Subtract)
    async updateBalance(address, amount) {
        const userRef = ref(db, 'users/' + address.toLowerCase());
        try {
            await update(userRef, {
                balance: increment(amount)
            });
            return true;
        } catch (e) {
            console.error("Balance Update Error", e);
            return false;
        }
    },

    // 5. Update Energy
    async updateEnergy(address, amount) {
        const userRef = ref(db, 'users/' + address.toLowerCase());
        await update(userRef, {
            energy: increment(amount)
        });
    }
};

// Global export for other scripts to use
window.DBModule = DBModule;
export { DBModule };
