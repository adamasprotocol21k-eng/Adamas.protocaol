/**
 * ADAMAS PROTOCOL - Database Module (Optimized & Fixed)
 * Update: Full Wallet Keys & Real-time Sync Support
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getDatabase, ref, get, set, update, onValue, serverTimestamp, increment } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";

// 1. Firebase Configuration (Keep your keys as they are)
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
    userData: null,

    // Fix: Full address ko key banana zaroori hai
    getUserKey(wallet) {
        return wallet.toLowerCase().replace(/[^a-z0-9]/g, ""); // Clean key for Firebase
    },

    // 2. Fetch User Data
    async getUserData(wallet) {
        if (!wallet) return null;
        const userKey = this.getUserKey(wallet);
        const userRef = ref(db, 'users/' + userKey);
        
        try {
            const snapshot = await get(userRef);
            if (snapshot.exists()) {
                this.userData = snapshot.val();
                return this.userData;
            } else {
                return await this.createNewUser(wallet);
            }
        } catch (error) {
            console.error("Database Fetch Error:", error);
            return null;
        }
    },

    // 3. Real-time Listener (Naya Feature: Dashboard bina refresh update hoga)
    listenToUpdates(wallet, callback) {
        if (!wallet) return;
        const userKey = this.getUserKey(wallet);
        const userRef = ref(db, 'users/' + userKey);
        
        onValue(userRef, (snapshot) => {
            const data = snapshot.val();
            if (data) callback(data);
        });
    },

    // 4. Create New User
    async createNewUser(wallet) {
        const userKey = this.getUserKey(wallet);
        const newUser = {
            address: wallet.toLowerCase(),
            balance: 500, // Welcome Bonus thoda badha diya premium feel ke liye
            lastCheckin: 0,
            tasksCompleted: 0,
            joinedAt: serverTimestamp(),
            referrals: 0,
            tier: "Founder"
        };
        await set(ref(db, 'users/' + userKey), newUser);
        this.userData = newUser;
        return newUser;
    },

    // 5. Secure Reward Update
    async addReward(wallet, amount, activityName) {
        if (!wallet) return false;
        const userKey = this.getUserKey(wallet);
        const userRef = ref(db, 'users/' + userKey);

        try {
            await update(userRef, {
                balance: increment(amount),
                lastActivity: activityName,
                lastUpdate: serverTimestamp()
            });
            return true;
        } catch (error) {
            console.error("Sync Failed:", error);
            return false;
        }
    }
};

window.DBModule = DBModule;
export { DBModule };
