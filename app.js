/* =====================================
   ADS PROTOCOL MAIN APP SCRIPT
===================================== */


/* ========= MAINTENANCE MODE ========= */

if (typeof MAINTENANCE_MODE !== "undefined" && MAINTENANCE_MODE) {

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

<p>ADS Protocol system upgrade running.</p>

<p>Please come back later.</p>

</div>
`;

throw new Error("Site under maintenance");

}


/* ========= TIMER SYSTEM ========= */

function startTimer(){

let duration = 86400;

setInterval(()=>{

duration--;

let h = Math.floor(duration/3600);
let m = Math.floor((duration%3600)/60);
let s = duration%60;

let timerElement = document.getElementById("labTimer");

if(timerElement){

timerElement.innerText = `Next mission in ${h}:${m}:${s}`;

}

if(duration <= 0){

duration = 86400;

}

},1000);

}


/* ========= UI FUNCTIONS ========= */

function showNotification(text){

let box = document.createElement("div");

box.innerText = text;

box.style.position = "fixed";
box.style.bottom = "20px";
box.style.right = "20px";
box.style.background = "#22c55e";
box.style.color = "#000";
box.style.padding = "12px 20px";
box.style.borderRadius = "8px";
box.style.zIndex = "9999";

document.body.appendChild(box);

setTimeout(()=>{

box.remove();

},3000);

}


/* ========= APP START ========= */

window.onload = () => {

startTimer();

console.log("ADS Protocol Dashboard Loaded");

};
