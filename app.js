let provider
let signer
let address
let points=0

const connectBtn = document.getElementById("connectBtn");

async function connectWallet() {
  if (!window.ethereum) {
    alert("MetaMask not detected");
    return;
  }

  try {

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts"
    });

    const userAddress = accounts[0];

    document.getElementById("walletAddress").innerText = userAddress;

    console.log("Wallet connected:", userAddress);

  } catch (error) {
    console.error("Connection failed:", error);
  }
}

connectBtn.addEventListener("click", connectWallet);

function verifySocial(){

document.getElementById("socialPopup").classList.add("hidden")

document.getElementById("dashboard").classList.remove("hidden")

document.getElementById("refLink").innerText=
window.location.origin+"?ref="+address

}

function showTab(id){

document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"))

document.getElementById(id).classList.add("active")

}

function dailyCheckin(){

let reward=Math.floor(Math.random()*1000)

points+=reward

update()

alert("Reward "+reward+" ABP")

}

function stake(){

alert("Stake Started")

}

function claim(){

points+=10

update()

}

function solvePuzzle(){

let reward=Math.floor(Math.random()*500)

points+=reward

update()

}

function playCard(){

points-=50

let reward=Math.floor(Math.random()*2000)

points+=reward

document.getElementById("gameResult").innerText="You won "+reward

update()

}

function buyTicket(){

points-=1000

update()

alert("Lottery Ticket Purchased")

}

function quiz(correct){

if(correct){

points+=100

update()

alert("Correct Answer")

}else{

alert("Try Again Tomorrow")

}

}

function withdraw(){

if(points>=5000){

alert("Withdraw Request Sent")

}else{

alert("Minimum 5000 ABP Required")

}

}

function update(){

document.getElementById("points").innerText=points

}
