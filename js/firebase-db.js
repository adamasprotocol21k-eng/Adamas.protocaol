import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import firebaseConfig from "./config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// User ka data load ya create karna
export async function syncUser(wallet) {
    const userRef = doc(db, "users", wallet);
    const snap = await getDoc(userRef);

    if (snap.exists()) {
        return snap.data().abp_balance;
    } else {
        await setDoc(userRef, {
            wallet: wallet,
            abp_balance: 0,
            joinedAt: new Date()
        });
        return 0;
    }
}

// Points cloud par save karna
export async function savePoints(wallet, amount) {
    const userRef = doc(db, "users", wallet);
    await updateDoc(userRef, {
        abp_balance: amount
    });
}
