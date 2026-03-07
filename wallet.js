let provider
let signer
let userAddress

document.getElementById("connectWalletBtn").onclick = connectWallet

async function connectWallet(){

if(window.ethereum){

provider = new ethers.providers.Web3Provider(window.ethereum)

await provider.send("eth_requestAccounts",[])

signer = provider.getSigner()

userAddress = await signer.getAddress()

document.getElementById("walletAddress").innerText =
userAddress.substring(0,6)+"..."+userAddress.slice(-4)

alert("Wallet Connected")

}

else{

alert("Install MetaMask")

}

}
