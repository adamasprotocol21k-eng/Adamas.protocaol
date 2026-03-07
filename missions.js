function claimDailyReward(){

let reward = Math.floor(
Math.random()*(CONFIG.dailyMax-CONFIG.dailyMin)
)+CONFIG.dailyMin

showReward(reward)

}

function completePuzzle(){

showReward(500)

}

function stakeAll(){

alert("Points staked")

}

function claimStake(){

let reward = Math.floor(Math.random()*200)

showReward(reward)

}

function unstake(){

alert("Unstaked")

}
