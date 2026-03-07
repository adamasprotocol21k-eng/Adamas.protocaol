function buyLotteryTicket(){

if(balance < CONFIG.lotteryPrice){

alert("Not enough ABP")

return

}

balance -= CONFIG.lotteryPrice

updateBalance()

let ticket = Math.floor(Math.random()*100000)

document.getElementById("ticketNumber").innerText =
"Ticket #" + ticket

alert("Ticket purchased")

}
