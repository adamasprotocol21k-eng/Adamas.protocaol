let provider;
let signer;
let userAddress;

async function connectWallet(){

if(!window.ethereum){

alert("Please install MetaMask");

return;

}

try{

await window.ethereum.request({method:"eth_requestAccounts"});

provider = new ethers.providers.Web3Provider(window.ethereum);

signer = provider.getSigner();

userAddress = await signer.getAddress();

document.getElementById("connectWallet").innerText =
userAddress.slice(0,6)+"..."+userAddress.slice(-4);

localStorage.setItem("wallet",userAddress);

}catch(err){

console.log(err);

}

}

document.getElementById("connectWallet").onclick = connectWallet;
