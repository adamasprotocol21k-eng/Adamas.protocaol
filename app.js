let balance = 0

function scrollDashboard(){

document.getElementById("dashboard").scrollIntoView({
behavior:"smooth"
})

}

function updateBalance(){

document.getElementById("balanceValue").innerText = balance

}

function showReward(points){

balance += points

updateBalance()

document.getElementById("rewardText").innerText = "+"+points+" ABP"

document.getElementById("rewardPopup").style.display="flex"

}

function closePopup(){

document.getElementById("rewardPopup").style.display="none"

}

function openTab(tab){

let sections=document.querySelectorAll(".tabSection")

sections.forEach(s=>s.style.display="none")

document.getElementById(tab).style.display="block"

}
