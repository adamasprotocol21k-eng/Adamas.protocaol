function startTimer(){

let seconds=3600;

setInterval(()=>{

seconds--;

let h=Math.floor(seconds/3600);

let m=Math.floor((seconds%3600)/60);

let s=seconds%60;

document.getElementById("labTimer").innerText=
`Next mission in ${h}:${m}:${s}`;

},1000);

}

startTimer();
