// AGAR MAINTENANCE ON KARNA HAI TO 'true' KAREIN, OFF KE LIYE 'false'
const MAINTENANCE_MODE = true; 

window.onload = () => {
    if (MAINTENANCE_MODE) {
        // Sab kuch chhupa do aur sirf Maintenance Screen dikhao
        document.body.innerHTML = `
            <div style="height:100vh; display:flex; flex-direction:column; justify-content:center; align-items:center; background:#020617; color:#00f2ff; font-family:'Orbitron',sans-serif; text-align:center; padding:20px;">
                <h1 style="font-size:50px; text-shadow:0 0 20px #00f2ff;">💎 ADAMAS UPGRADE</h1>
                <p style="color:white; font-size:20px;">Back-end work in progress. We are making Adamas stronger!</p>
                <div style="margin-top:20px; border:2px solid #00f2ff; padding:10px 20px; border-radius:50px;">COMING BACK SOON</div>
            </div>
        `;
    } else {
        console.log("Adamas Portal Live 🚀");
    }
};

let userAccount = null;
let currentBalance = 0;
// 1. FIREBASE INITIALIZE (config.js se data lega)
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let userAccount = null;
let currentBalance = 0;

// 2. WALLET CONNECT & DATA LOAD
async function connectWallet() {
    if (window.ethereum) {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            userAccount = accounts[0];
            document.getElementById('walletBtn').innerText = userAccount.slice(0,6) + "..." + userAccount.slice(-4);
            
            // Database se user ka purana balance uthana
            const userDoc = await db.collection("users").doc(userAccount).get();
            if (userDoc.exists) {
                currentBalance = userDoc.data().abp_balance || 0;
            } else {
                currentBalance = 0;
                // Naya user hai toh database mein entry banao
                await syncData();
            }

            document.getElementById('ads-balance').innerText = currentBalance.toFixed(2);
            document.getElementById('landing-page').style.display = 'none';
            document.getElementById('social-gateway').style.display = 'block';
            
            loadLeaderboard(); // Rankings load karna
        } catch (error) {
            console.error(error);
            alert("Connection failed!");
        }
    } else {
        alert("MetaMask install karein!");
    }
}

// 3. SYNC DATA (Database mein save karna)
async function syncData() {
    if (!userAccount) return;
    await db.collection("users").doc(userAccount).set({
        wallet: userAccount,
        abp_balance: currentBalance,
        last_active: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    loadLeaderboard();
}

// 4. DAILY CHECK-IN
async function dailyCheckIn() {
    let reward = Math.floor(Math.random() * 5001);
    currentBalance += reward;
    document.getElementById('ads-balance').innerText = currentBalance.toFixed(2);
    alert("🎉 Won " + reward + " ABP!");
    await syncData(); // Points save karo
}

// 5. TEEN PATTI (SLOTS)
async function playTeenPatti() {
    if (currentBalance < 50) return alert("ABP kam hai!");
    currentBalance -= 50;

    const slots = [document.getElementById('slot1'), document.getElementById('slot2'), document.getElementById('slot3')];
    const symbols = ['💎', '💰', '🎲', '🃏'];
    
    slots.forEach(s => s.classList.add('spinning'));

    setTimeout(async () => {
        let results = [];
        slots.forEach(s => {
            s.classList.remove('spinning');
            let res = symbols[Math.floor(Math.random() * symbols.length)];
            s.innerText = res;
            results.push(res);
        });

        // Win logic: Teeno symbol same hone par 1000 ABP
        if(results[0] === results[1] && results[1] === results[2]) {
            currentBalance += 1000;
            alert("JACKPOT! +1000 ABP");
        }

        document.getElementById('ads-balance').innerText = currentBalance.toFixed(2);
        await syncData(); // Game ke baad points save karo
    }, 1000);
}

// 6. LEADERBOARD LOAD
async function loadLeaderboard() {
    const snapshot = await db.collection("users").orderBy("abp_balance", "desc").limit(5).get();
    let listHTML = "<h4>🏆 TOP HOLDERS</h4>";
    snapshot.forEach(doc => {
        let user = doc.data();
        listHTML += `<div style="margin-bottom:10px; font-size:14px;">${user.wallet.slice(0,6)}... : <strong>${Math.floor(user.abp_balance)} ABP</strong></div>`;
    });
    const lb = document.getElementById('leaderboard-list');
    if(lb) lb.innerHTML = listHTML;
}

// Gateway Unlock
function unlockDashboard() {
    document.getElementById('social-gateway').style.display = 'none';
    document.getElementById('dashboard').style.display = 'grid';
}



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
// Quiz Limit Check
let quizPlayedToday = false;

function startDailyQuiz() {
    if (quizPlayedToday) {
        alert("Aap aaj ka test de chuke hain! Kal wapas aayein.");
        return;
    }
    document.getElementById('question-text').innerText = "Project Adamas ki target supply kitni hai?";
    document.getElementById('options-btn').innerHTML = `
        <button onclick="checkQuiz(true)" class="action-btn">21,000</button>
        <button onclick="checkQuiz(false)" class="action-btn">21 Million</button>
    `;
}

function checkQuiz(isCorrect) {
    quizPlayedToday = true; // Lock laga diya
    document.getElementById('options-btn').innerHTML = ""; // Buttons hata diye
    
    if (isCorrect) {
        let reward = 1000;
        currentBalance += reward;
        alert("Sahi Jawab! +1000 ABP");
    } else {
        alert("Galat Jawab! Lock for 24 hours.");
    }
    document.getElementById('ads-balance').innerText = currentBalance.toFixed(2);
    document.getElementById('quiz-status').innerText = "Test Completed for Today.";
}

// Slot Game with Visual Animation
function playTeenPatti() {
    if (currentBalance < 50) return alert("ABP kam hai!");
    currentBalance -= 50;
    
    const slots = [document.getElementById('slot1'), document.getElementById('slot2'), document.getElementById('slot3')];
    const symbols = ['💎', '💰', '🎲', '🃏'];
    
    // Animation shuru
    slots.forEach(s => s.classList.add('spinning'));
    
    setTimeout(() => {
        slots.forEach(s => {
            s.classList.remove('spinning');
            s.innerText = symbols[Math.floor(Math.random() * symbols.length)];
        });
        
        // Win logic yahan check hogi (jaise pehle thi)
        document.getElementById('ads-balance').innerText = currentBalance.toFixed(2);
    }, 1000);
}

// 8. LOTTERY SYSTEM (1000 ABP Ticket)
function buyLottery() {
    if (currentBalance < 1000) { return alert("Not enough ABP for Lottery!"); }
    currentBalance -= 1000;
    
    // Random 6-digit lottery number
    let ticketNum = Math.floor(100000 + Math.random() * 900000);
    document.getElementById('lottery-number').innerText = "# " + ticketNum;
    
    document.getElementById('ads-balance').innerText = currentBalance.toFixed(2);
    alert("Ticket Purchased! Winner will be announced soon.");
}

// 9. REFERRAL SYSTEM
function copyReferral() {
    if (!userAccount) { return alert("Connect wallet first!"); }
    
    let refLink = "https://adamas-protocol.vercel.app/?ref=" + userAccount.slice(-6);
    document.getElementById('referral-link').value = refLink;
    
    navigator.clipboard.writeText(refLink);
    alert("Referral link copied! Share it with your friends.");
}
