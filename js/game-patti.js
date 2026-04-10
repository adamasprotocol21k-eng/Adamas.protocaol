const PattiGame = {
    deck: ["A", "K", "Q", "J", "10", "9", "8", "7", "6", "5", "4", "3", "2"],
    suits: ["♠", "♥", "♣", "♦"],
    active: false,

    init: function() {
        const container = document.getElementById('gameContainer');
        container.innerHTML = `
            <div class="patti-wrapper">
                <h2 class="ultra-glow-text">3D TEEN PATTI</h2>
                <div class="table-3d">
                    <div class="dealer-side">
                        <div class="card-slot mini" id="d1">?</div>
                        <div class="card-slot mini" id="d2">?</div>
                        <div class="card-slot mini" id="d3">?</div>
                        <p class="label">DEALER</p>
                    </div>
                    
                    <div class="pot-area">
                        <span id="potAmount">Pot: 20 ABP</span>
                    </div>

                    <div class="player-side">
                        <div class="card-slot" id="p1">?</div>
                        <div class="card-slot" id="p2">?</div>
                        <div class="card-slot" id="p3">?</div>
                        <p class="label">YOU</p>
                    </div>
                </div>

                <div class="controls" id="pattiControls">
                    <button class="btn-primary" onclick="PattiGame.deal()">DEAL (10 ABP)</button>
                </div>
            </div>
        `;
    },

    deal: function() {
        if(this.active) return;
        this.active = true;
        
        // Reset Visuals
        document.querySelectorAll('.card-slot').forEach(s => {
            s.innerHTML = "🎴";
            s.className = "card-slot flipping";
        });

        setTimeout(() => {
            this.revealResults();
        }, 1500);
    },

    generateHand: function() {
        let hand = [];
        for(let i=0; i<3; i++) {
            let card = this.deck[Math.floor(Math.random() * this.deck.length)];
            let suit = this.suits[Math.floor(Math.random() * this.suits.length)];
            hand.push({card, suit});
        }
        return hand;
    },

    revealResults: function() {
        const playerHand = this.generateHand();
        const dealerHand = this.generateHand();

        // Reveal Player Cards
        playerHand.forEach((h, i) => {
            const el = document.getElementById(`p${i+1}`);
            el.innerHTML = `<span class="card-val">${h.card}</span><br>${h.suit}`;
            el.className = "card-slot revealed";
            if(h.suit === "♥" || h.suit === "♦") el.style.color = "#ff4b2b";
            else el.style.color = "#fff";
        });

        // Reveal Dealer Cards
        dealerHand.forEach((h, i) => {
            const el = document.getElementById(`d${i+1}`);
            el.innerHTML = `<span class="card-val">${h.card}</span><br>${h.suit}`;
            el.className = "card-slot mini revealed";
        });

        this.decideWinner(playerHand, dealerHand);
    },

    decideWinner: function(p, d) {
        // Simple logic for Demo: High Card check
        // Real logic will need sequence/color check which we can add later
        const win = Math.random() > 0.5; 
        
        const controls = document.getElementById('pattiControls');
        if(win) {
            controls.innerHTML = `<h3 style="color:#00ff88">YOU WIN! +20 ABP</h3>
                                 <button class="btn-primary" onclick="PattiGame.init()">PLAY AGAIN</button>`;
        } else {
            controls.innerHTML = `<h3 style="color:#ff4b2b">DEALER WINS</h3>
                                 <button class="btn-primary" onclick="PattiGame.init()">TRY AGAIN</button>`;
        }
        this.active = false;
    }
};
