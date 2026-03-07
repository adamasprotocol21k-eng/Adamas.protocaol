import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


const firebaseConfig = {

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

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);


async function checkMaintenance(){

const docRef = doc(db,"settings","site");

const docSnap = await getDoc(docRef);

if(docSnap.exists()){

const data = docSnap.data();

if(data.maintenance){

document.body.innerHTML = `

<div style="
height:100vh;
display:flex;
flex-direction:column;
align-items:center;
justify-content:center;
background:#020617;
color:white;
font-family:Arial;
text-align:center;
">

<h1>🚧 Maintenance Mode</h1>

<p>ADS Protocol upgrading system</p>

<p>Please come back later</p>

</div>

`;

}

}

}

checkMaintenance();
