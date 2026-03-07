let balance = 0;

function loadBalance(){

const saved = localStorage.getItem("abp_balance");

if(saved){

balance = parseInt(saved);

}

updateBalance();

}

function updateBalance(){

document.getElementById("abpBalance").innerText = balance;

localStorage.setItem("abp_balance",balance);

}

function dailyFuel(){

let lastClaim = localStorage.getItem("daily_claim");

let now = Date.now();

if(lastClaim){

let diff = now - lastClaim;

if(diff < 86400000){

alert("Daily fuel already claimed");

return;

}

}

balance += 50;

updateBalance();

localStorage.setItem("daily_claim",now);

alert("+50 ABP claimed");

}

loadBalance();
