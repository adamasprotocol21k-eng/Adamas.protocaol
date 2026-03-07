// firebase.js

// Initialize Firebase
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Check Maintenance Mode
const maintenanceRef = db.collection("settings").doc("maintenance");

async function checkMaintenance() {
    const doc = await maintenanceRef.get();
    if (doc.exists && doc.data().status === true) {
        document.body.innerHTML = `
            <div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#0a0a0a;color:white;font-family:sans-serif;flex-direction:column;">
                <h1 style="font-size:3rem;color:#00d1ff;">🚧 Site Under Maintenance 🚧</h1>
                <p style="font-size:1.2rem;margin-top:1rem;">Please come back later. We'll be live soon!</p>
            </div>
        `;
        throw new Error("Site under maintenance");
    }
}

// Call maintenance check immediately
checkMaintenance();
