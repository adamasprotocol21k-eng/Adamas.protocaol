// MAINTENANCE MODE

const MAINTENANCE = false;

if(MAINTENANCE){

document.body.innerHTML = `
<h1>🚧 Platform Under Maintenance</h1>
`;

throw new Error("Maintenance Mode");

}



// WALLET CONNECT

const connectBtn = document.getElementById("connectBtn");

let provider;
let signer;
let userAddress;


connectBtn.addEventListener("click", connectWallet);


async function connectWallet(){

if(!window.ethereum){

alert("Please install MetaMask");

return;

}

try{

await window.ethereum.request({

method:"eth_requestAccounts"

});

provider = new ethers.providers.Web3Provider(window.ethereum);

signer = provider.getSigner();

userAddress = await signer.getAddress();

document.getElementById("walletAddress").innerText = userAddress;

loadPoints();

}

catch(error){

console.log(error);

}

}



// LOAD ABP POINTS

async function loadPoints(){

try{

const contract = new ethers.Contract(

CONTRACT_ADDRESS,

CONTRACT_ABI,

provider

);

const points = await contract.getPoints(userAddress);

document.getElementById("points").innerText = points;

}

catch(error){

console.log("Contract error",error);

}

}



// DASHBOARD FUNCTIONS

function openCheckin(){

alert("🎁 Daily Check-In system coming soon");

}

function openLottery(){

alert("🎲 Lottery system coming soon");

}

function openGames(){

alert("🎮 Mini games coming soon");

}

function openLeaderboard(){

alert("🏆 Leaderboard loading");

}
