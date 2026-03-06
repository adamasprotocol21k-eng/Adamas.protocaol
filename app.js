let userAccount = null;
let currentBalance = 0;

// 1. WALLET CONNECT & SYNC
async function connectWallet() {
    if (window.ethereum) {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            userAccount = accounts[0];
            document.getElementById('walletBtn').innerText = userAccount.slice(0,6) + "..." + userAccount.slice(-4);
            
            // Landing page chhupao aur Social Gateway dikhao
            document.getElementById('landing-page').style.display = 'none';
            document.getElementById('social-gateway').style.display = 'block';
            
            console.log("Connected: " + userAccount);
        } catch (error) {
            alert("Connection failed!");
        }
    } else {
        alert("Please install MetaMask!");
    }
}

// 2. UNLOCK DASHBOARD
function unlockDashboard() {
    document.getElementById('social-gateway').style.display = 'none';
    document.getElementById('dashboard').style.display = 'grid';
    alert("Dashboard Unlocked! 💎");
}

// 3. DAILY CHECK-IN (0-5000 ABP Reward)
function dailyCheckIn() {
    // 0 se 5000 ke beech random number
    let reward = Math.floor(Math.random() * 5001);
    currentBalance += reward;
    
    // UI update karna
    document.getElementById('ads-balance').innerText = currentBalance.toFixed(2);
    alert("🎉 Congratulations! You won " + reward + " ABP points.");
}

// 4. STAKING LOGIC (Basic)
function stakeTokens() {
    if (currentBalance <= 0) {
        alert("Pehle points kamao!");
        return;
    }
    alert("Tokens Staked! 24h login rule active.");
}

function claimStaking() {
    alert("Reward claimed successfully!");
}

// 5. LOGO PUZZLE CHECK
function checkPuzzle() {
    let puzzleReward = Math.floor(Math.random() * 1001);
    currentBalance += puzzleReward;
    document.getElementById('ads-balance').innerText = currentBalance.toFixed(2);
    alert("Logo Adjusted! Reward: " + puzzleReward + " ABP");
}

// 6. TEEN PATTI LOGIC (50 ABP Fee)
function playTeenPatti() {
    if (currentBalance < 50) { return alert("Not enough ABP!"); }
    currentBalance -= 50;
    
    const symbols = ['J', 'Q', 'K', 'A'];
    let r1 = symbols[Math.floor(Math.random()*4)];
    let r2 = symbols[Math.floor(Math.random()*4)];
    let r3 = symbols[Math.floor(Math.random()*4)];
    
    document.getElementById('slot-machine').innerText = `${r1} ${r2} ${r3}`;
    
    if (r1 === 'A' && r2 === 'A' && r3 === 'A') { 
        currentBalance += 2000; alert("TRIPLE AAA! Won 2000 ABP"); 
    } else if (r1 === 'K' && r2 === 'K' && r3 === 'K') { 
        currentBalance += 1600; alert("TRIPLE KKK! Won 1600 ABP");
    } else if (r1 === 'Q' && r2 === 'Q' && r3 === 'Q') { 
        currentBalance += 1400; alert("TRIPLE QQQ! Won 1400 ABP");
    } else if (r1 === 'J' && r2 === 'J' && r3 === 'J') { 
        currentBalance += 1000; alert("TRIPLE JJJ! Won 1000 ABP");
    }
    document.getElementById('ads-balance').innerText = currentBalance.toFixed(2);
}

// 7. DAILY QUIZ LOGIC
function startDailyQuiz() {
    document.getElementById('question-text').innerText = "What is 15 + 25?";
    document.getElementById('options-btn').innerHTML = `
        <button onclick="checkQuiz(40)" class="action-btn">40</button>
        <button onclick="checkQuiz(35)" class="action-btn">35</button>
    `;
}

function checkQuiz(ans) {
    if (ans === 40) {
        let reward = Math.floor(Math.random() * 1001);
        currentBalance += reward;
        alert("Correct! You won " + reward + " ABP");
    } else {
        alert("Wrong! Locked for today.");
    }
    document.getElementById('ads-balance').innerText = currentBalance.toFixed(2);
}
