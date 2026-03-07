function playTeenPatti(){

let cards=["A","K","Q","J","10"]

let c1 = cards[Math.floor(Math.random()*cards.length)]
let c2 = cards[Math.floor(Math.random()*cards.length)]
let c3 = cards[Math.floor(Math.random()*cards.length)]

let reward=0

if(c1=="A" && c2=="A" && c3=="A") reward=2000
else if(c1=="K" && c2=="K" && c3=="K") reward=1500
else if(c1=="Q" && c2=="Q" && c3=="Q") reward=1000
else if(c1=="J" && c2=="J" && c3=="J") reward=800
else reward = Math.floor(Math.random()*150)+50

showReward(reward)

}

function generateMines(){

let grid=document.getElementById("mineGrid")

for(let i=0;i<16;i++){

let cell=document.createElement("div")

cell.className="mineCell"

cell.onclick=function(){

let bomb=Math.random()<0.2

if(bomb){

alert("💣 Bomb! Try again later")

}

else{

let reward=Math.floor(Math.random()*1000)+10

showReward(reward)

}

}

grid.appendChild(cell)

}

}

generateMines()
