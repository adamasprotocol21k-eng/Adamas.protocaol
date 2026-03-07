// wallet.js
import { ethers } from "https://cdn.jsdelivr.net/npm/ethers@6.9.2/dist/ethers.esm.min.js";
import { contractAddress, contractABI } from "./config.js";

let provider;
let signer;
let contract;

export async function connectWallet() {
    if(window.ethereum) {
        provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = await provider.getSigner();
        contract = new ethers.Contract(contractAddress, contractABI, signer);
        const walletAddress = await signer.getAddress();
        document.querySelector(".wallet-address").innerText = walletAddress;
        document.querySelector(".wallet-address").classList.add("connected");
    } else {
        alert("Please install MetaMask!");
    }
}

// Function to fetch user points
export async function getUserPoints() {
    if(!contract) return 0;
    const wallet = await signer.getAddress();
    const points = await contract.points(wallet);
    document.getElementById("user-points").innerText = points.toString();
}
