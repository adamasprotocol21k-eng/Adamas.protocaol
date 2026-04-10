// Sync Everything on Load
window.onload = async () => {
    await web3Handler.checkNetwork();
    const wallet = await web3Handler.getUserWallet();
    document.getElementById('walletAddr').innerText = wallet.slice(0,6) + "..." + wallet.slice(-4);
    
    // Start Mining Animation
    startMining();
    // Render Daily Tasks
    TaskManager.renderTasks();
};

function openGame(gameType) {
    document.getElementById('gameModal').style.display = 'block';
    const container = document.getElementById('gameContainer');
    
    if(gameType === 'mines') MinesGame.init();
    if(gameType === 'patti') PattiGame.init();
    // Baki games ke liye bhi yahan logic load hoga
}

function closeGame() {
    document.getElementById('gameModal').style.display = 'none';
}

function startMining() {
    let ads = 0.0000;
    setInterval(() => {
        ads += 0.0001;
        document.getElementById('liveAds').innerText = ads.toFixed(4);
    }, 3000);
}
