/* =====================================
   ADS PROTOCOL MAIN APP SCRIPT
===================================== */


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


/* ========= UI NOTIFICATION ========= */

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
