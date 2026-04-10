const MinesGame = {
    grid: [],
    bombs: 3,
    active: false,

    init: function() {
        const container = document.getElementById('gameContainer');
        container.innerHTML = `
            <h2 class="ultra-glow-text">DIAMOND MINES</h2>
            <div id="mineGrid" class="mine-grid"></div>
            <div class="controls">
                <button onclick="MinesGame.startGame()" class="btn-primary">START (Bet 10 ABP)</button>
            </div>
        `;
        this.renderGrid();
    },

    renderGrid: function() {
        const gridDiv = document.getElementById('mineGrid');
        gridDiv.innerHTML = '';
        for(let i=0; i<25; i++) {
            gridDiv.innerHTML += `<div class="mine-tile" onclick="MinesGame.reveal(${i})">?</div>`;
        }
    },

    startGame: function() {
        this.active = true;
        this.renderGrid();
        alert("Game Started! Find Diamonds, avoid Bombs.");
    },

    reveal: function(idx) {
        if(!this.active) return;
        const tiles = document.querySelectorAll('.mine-tile');
        // Logic: 10% chance of bomb
        if(Math.random() < 0.2) {
            tiles[idx].innerHTML = "💣";
            tiles[idx].style.background = "red";
            this.active = false;
            alert("BOOM! You lost.");
        } else {
            tiles[idx].innerHTML = "💎";
            tiles[idx].style.background = "var(--cyan)";
            // Add points logic here
        }
    }
};
