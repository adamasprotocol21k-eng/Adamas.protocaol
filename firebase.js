// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { firebaseConfig } from "./config.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Maintenance Mode Check
export async function checkMaintenance() {
    const docRef = doc(db, "settings", "maintenance");
    const docSnap = await getDoc(docRef);
    if(docSnap.exists()) {
        const isMaintenance = docSnap.data().active;
        if(isMaintenance) {
            document.body.innerHTML = `
                <div style="text-align:center; padding:100px; color:white;">
                    <h1>🚧 वेबसाइट मेंटेनेंस मोड पर है</h1>
                    <p>कृपया बाद में वापस आएँ</p>
                </div>`;
            throw new Error("Maintenance Mode Active");
        }
    }
}
