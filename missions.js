let balance=0;

function updateBalance(){

document.getElementById("abpBalance").innerText=balance;

}

function dailyFuel(){

balance+=50;

updateBalance();

alert("Daily Fuel claimed!");

}

function joinTelegram(){

window.open("https://t.me/ADSProtocol");

balance+=100;

updateBalance();

}

function followX(){

window.open("https://x.com");

balance+=100;

updateBalance();

}
