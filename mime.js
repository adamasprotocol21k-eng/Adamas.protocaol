function startMimeGame() {
    const gameArea = document.querySelector('.mining-section');
    gameArea.innerHTML = "<h3>Wait for the Diamond...</h3>";
    
    const waitTime = Math.random() * 5000 + 2000; // 2 to 7 seconds random wait

    setTimeout(() => {
        const startTime = Date.now();
        gameArea.innerHTML = `
            <div id="target" style="font-size: 5rem; cursor: pointer; animation: pulse 1s infinite;">💎</div>
            <p>CLICK FAST!</p>
        `;

        document.getElementById('target').onclick = () => {
            const reactionTime = (Date.now() - startTime) / 1000;
            const reward = Math.max(0, (2 - reactionTime) * 50).toFixed(2); // Speed based reward
            
            alert(`Fast Reaction! Time: ${reactionTime}s. You earned ${reward} ABP!`);
            // Update Firebase Balance
            db.ref('users/' + wallet + '/balance').transaction((b) => (b || 0) + parseFloat(reward));
            location.reload(); // Reset to Main UI
        };
    }, waitTime);
}

