/* ADAMAS PROTOCOL - CENTRAL CONFIGURATION ENGINE 
   Core System v2.1 | Encrypted Logic
*/

const firebaseConfig = {
    apiKey: "AIzaSyBs2XAli-CtSh4qqHJTwcoLBaGsGC4RUHI",
    authDomain: "adamas-protocol-v2.firebaseapp.com",
    databaseURL: "https://adamas-protocol-v2-default-rtdb.firebaseio.com",
    projectId: "adamas-protocol-v2",
    appId: "1:197711342782:web:84cc5ffcd29b3f9bfe82ef"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.database();

// --- SYSTEM UTILITIES ---

// Smart Formatting (e.g., 5000 -> 5K)
function formatCurrency(num) {
    const val = parseFloat(num) || 0;
    if (val >= 1000000000) return (val / 1000000000).toFixed(2) + 'B';
    if (val >= 1000000) return (val / 1000000).toFixed(2) + 'M';
    if (val >= 1000) return (val / 1000).toFixed(1) + 'K';
    return val.toFixed(2);
}

// Wallet Session Management
const currentUser = localStorage.getItem('adamas_user');

// Route Guardian
function protectRoute() {
    if (!currentUser && !window.location.pathname.includes('index.html')) {
        window.location.href = "index.html";
    }
}

// --- NEW: AUTO-INITIALIZE ENGINE ---
// Ye function ensure karta hai ki user ka basic data hamesha exist kare
async function syncUserSession() {
    if (!currentUser) return;
    
    const userRef = db.ref('users/' + currentUser.toLowerCase());
    const snap = await userRef.once('value');
    
    if (!snap.exists()) {
        console.log("INITIALIZING_NEW_NODE...");
        await userRef.set({
            balance: 0,
            streak: 1,
            lastActive: Date.now(),
            joinedAt: Date.now(),
            quizDone: false,
            loyaltyClaimed: false
        });
    }
}

// Run Protection & Sync
protectRoute();
if(currentUser) syncUserSession();

console.log("ADAMAS_SYSTEM: Core Engine Online. Node: " + (currentUser || "GUEST"));
