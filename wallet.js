let provider;
let signer;
let userAddress;

document.getElementById("connectWallet").onclick=async()=>{

if(!window.ethereum){

alert("Install MetaMask");

return;

}

await window.ethereum.request({
method:"eth_requestAccounts"
});

provider=new ethers.providers.Web3Provider(window.ethereum);

signer=provider.getSigner();

userAddress=await signer.getAddress();

document.getElementById("connectWallet").innerText=
userAddress.slice(0,6)+"...";

}
