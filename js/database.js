/**
 * ADAMAS PROTOCOL - Database Module
 * Functionality: Firebase Realtime DB Connection & Optimized Sync
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getDatabase, ref, get, set, update, serverTimestamp, increment } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";

// 1. Firebase Configuration (Replace with your actual keys)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const DBModule = {
    userData: null,

    // 2. Fetch User Data (Optimized: Sirf tabhi fetch karega jab zaroorat ho)
    async getUserData(wallet) {
        if (!wallet) return null;
        const userKey = wallet.toLowerCase().substring(0, 15); // Collision safe prefix
        const userRef = ref(db, 'users/' + userKey);
        
        try {
            const snapshot = await get(userRef);
            if (snapshot.exists()) {
                this.userData = snapshot.val();
                return this.userData;
            } else {
                // Naya User: Initial Setup
                return await this.createNewUser(wallet);
            }
        } catch (error) {
            console.error("Database Fetch Error:", error);
            return null;
        }
    },

    // 3. Create New User (Starting Bonus Logic)
    async createNewUser(wallet) {
        const userKey = wallet.toLowerCase().substring(0, 15);
        const newUser = {
            address: wallet.toLowerCase(),
            balance: 100, // Welcome Bonus
            lastCheckin: 0,
            tasksCompleted: 0,
            joinedAt: serverTimestamp(),
            referrals: 0
        };
        await set(ref(db, 'users/' + userKey), newUser);
        this.userData = newUser;
        return newUser;
    },

    // 4. Secure Balance Update (Server-side Increment)
    async addReward(wallet, amount, activityName) {
        const userKey = wallet.toLowerCase().substring(0, 15);
        const userRef = ref(db, 'users/' + userKey);

        try {
            await update(userRef, {
                balance: increment(amount),
                lastActivity: activityName,
                lastUpdate: serverTimestamp()
            });
            console.log(`Reward Sync: +${amount} ABP for ${activityName}`);
            return true;
        } catch (error) {
            console.error("Sync Failed:", error);
            return false;
        }
    }
};

// Export to Global Window
window.DBModule = DBModule;

