// Maintenance Mode

const MAINTENANCE = false;

if(MAINTENANCE){

document.body.innerHTML = `
<h1>🚧 Platform Under Maintenance</h1>
`;

throw new Error("Maintenance Mode");

}


// Wallet connect

const connectBtn = document.getElementById("connectBtn");

let provider;
let signer;
let userAddress;


connectBtn.addEventListener("click", connectWallet);


async function connectWallet(){

if(!window.ethereum){

alert("Install MetaMask");

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


// Load Points

async function loadPoints(){

const contract = new ethers.Contract(

CONTRACT_ADDRESS,

CONTRACT_ABI,

provider

);

const points = await contract.getPoints(userAddress);

document.getElementById("points").innerText = points;

}
