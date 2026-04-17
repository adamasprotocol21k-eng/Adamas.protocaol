/* ADAMAS PROTOCOL - CENTRAL CONFIGURATION ENGINE 
   Core System v2.5 | SECURE_GENESIS_INTEGRATION
*/

const firebaseConfig = {
    apiKey: "AIzaSyBs2XAli-CtSh4qqHJTwcoLBaGsGC4RUHI",
    authDomain: "adamas-protocol-v2.firebaseapp.com",
    databaseURL: "https://adamas-protocol-v2-default-rtdb.firebaseio.com",
    projectId: "adamas-protocol-v2",
    appId: "1:197711342782:web:84cc5ffcd29b3f9bfe82ef"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.database();

// --- GENESIS CORE CONFIG ---
const GENESIS_WALLET = "0xcc19036Ad18b761ad25D2cb69Fd3c5EbcB766488"; // Company Master Node
const SYSTEM_IDENTIFIER = "ADAMAS_GENESIS"; // Mask for UI

// --- SYSTEM UTILITIES ---

function formatCurrency(num) {
    const val = parseFloat(num) || 0;
    if (val >= 1000000000) return (val / 1000000000).toFixed(2) + 'B';
    if (val >= 1000000) return (val / 1000000).toFixed(2) + 'M';
    if (val >= 1000) return (val / 1000).toFixed(1) + 'K';
    return val.toFixed(0); // Removing decimals for small whole points (ABP)
}

// Global Wallet Checker
const currentUser = localStorage.getItem('adamas_user');

// Route Guardian - Fixed logic for smoother redirects
function protectRoute() {
    const path = window.location.pathname;
    if (!currentUser && !path.includes('index.html')) {
        window.location.href = "index.html";
    }
}

// --- SMART REFERRAL ENGINE (MASKED) ---
function getReferrer() {
    const urlParams = new URLSearchParams(window.location.search);
    let ref = urlParams.get('ref');
    
    // Masking Logic: Agar ref khali hai, ya admin hai, toh Genesis dikhao
    if (!ref || ref.toLowerCase() === GENESIS_WALLET.toLowerCase() || ref.toUpperCase() === 'GENESIS') {
        return SYSTEM_IDENTIFIER; 
    }
    return ref.toLowerCase();
}

// Global Referrer Logic
const activeReferrer = getReferrer();
if (!localStorage.getItem('adamas_ref')) {
    // Agar Genesis hai toh storage mein Master Wallet save hoga, par UI mein Mask dikhega
    const storageRef = (activeReferrer === SYSTEM_IDENTIFIER) ? GENESIS_WALLET.toLowerCase() : activeReferrer;
    localStorage.setItem('adamas_ref', storageRef);
}

// --- AUTO-INITIALIZE ENGINE ---
async function syncUserSession() {
    if (!currentUser) return;
    
    const userRef = db.ref('users/' + currentUser.toLowerCase());
    const snap = await userRef.once('value');
    
    if (!snap.exists()) {
        console.log("INITIALIZING_NEW_GENESIS_NODE...");
        
        // Safety: Ensure we never have a null referrer
        let assignedRef = localStorage.getItem('adamas_ref') || GENESIS_WALLET.toLowerCase();
        
        // Prevent Self-Referral
        if(assignedRef.toLowerCase() === currentUser.toLowerCase()) {
            assignedRef = GENESIS_WALLET.toLowerCase();
        }

        await userRef.set({
            balance: 0,
            streak: 1,
            referredBy: assignedRef,
            lastActive: Date.now(),
            joinedAt: Date.now(),
            quizDone: false,
            loyaltyClaimed: false,
            referralCount: 0,
            activityCount: 0,
            role: (currentUser.toLowerCase() === GENESIS_WALLET.toLowerCase()) ? "ADMIN" : "NODE"
        });
        
        // Update Referrer's count only if it's a valid node
        const refCounter = db.ref('users/' + assignedRef + '/referralCount');
        refCounter.transaction((currentCount) => {
            return (currentCount || 0) + 1;
        });
    }
}

// Run Protection & Sync
protectRoute();
if(currentUser) syncUserSession();

console.log(`ADAMAS_SYSTEM: Genesis Node Online | Identity: ${currentUser ? currentUser.substring(0,6) : 'GUEST'}`);
