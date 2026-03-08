// ADAMAS Protocol - Core Logic

// 1. Wallet Connection Logic
const walletBtn = document.getElementById('walletConnect');
const abpBalanceDisplay = document.getElementById('abpBalance');
let userAccount = "0x1E12BFE8eB6Ef1334cF8f873F2d9Abad5C56daDB"; // Aapka default address

async function connectWallet() {
    if (window.ethereum) {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            userAccount = accounts[0];
            walletBtn.innerText = "Connected: " + userAccount.substring(0, 6) + "...";
            console.log("Wallet linked: ", userAccount);
        } catch (error) {
            alert("Connection failed!");
        }
    } else {
        alert("Please install MetaMask or Trust Wallet!");
    }
}

walletBtn.addEventListener('click', connectWallet);

// 2. Mining Countdown Timer (Based on Video)
function startTimer(duration, display) {
    let timer = duration, hours, minutes, seconds;
    setInterval(function () {
        hours = parseInt(timer / 3600, 10);
        minutes = parseInt((timer % 3600) / 60, 10);
        seconds = parseInt(timer % 60, 10);

        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = hours + "h : " + minutes + "m : " + seconds + "s";

        if (--timer < 0) {
            timer = duration; // Reset for next session
        }
    }, 1000);
}

window.onload = function () {
    const fifteenHours = 15 * 60 * 60 + 27 * 60 + 40; // Video time
    const display = document.querySelector('#timer');
    startTimer(fifteenHours, display);
};

// 3. Simple Mining Action
function startMining() {
    alert("Mining session started for ADAMAS Protocol!");
    // Yahan hum Firebase integration karenge rewards update karne ke liye
}
