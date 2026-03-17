import { DBModule } from './database.js';

const MinesLogic = {
    gridSize: 25, bombCount: 3, active: false, 
    bet: 0, diamonds: 0, bombs: [], wallet: localStorage.getItem('userWallet'),

    async startGame() {
        this.bet = parseInt(document.getElementById('betAmount').value);
        const user = await DBModule.getUserData(this.wallet);

        if (user.balance < this.bet) return Notify.show("Insufficient ABP!", "error");
        
        // Subtract bet amount
        await DBModule.updateBalance(this.wallet, -this.bet);
        
        this.active = true;
        this.diamonds = 0;
        this.bombs = this.generateBombs();
        this.updateUI(true);
        this.renderGrid();
    },

    generateBombs() {
        let b = [];
        while(b.length < this.bombCount) {
            let r = Math.floor(Math.random() * this.gridSize);
            if(!b.includes(r)) b.push(r);
        }
        return b;
    },

    renderGrid() {
        const grid = document.getElementById('minesGrid');
        grid.innerHTML = '';
        for(let i=0; i<this.gridSize; i++) {
            const tile = document.createElement('div');
            tile.className = 'tile';
            tile.onclick = () => this.clickTile(i, tile);
            grid.appendChild(tile);
        }
    },

    async clickTile(idx, el) {
        if(!this.active || el.classList.contains('revealed')) return;

        el.classList.add('revealed');
        if(this.bombs.includes(idx)) {
            el.innerHTML = "💣"; el.classList.add('bomb');
            this.gameOver(false);
        } else {
            el.innerHTML = "💎";
            this.diamonds++;
            const mult = (1 + (this.diamonds * 0.25)).toFixed(2);
            document.getElementById('multiplier').innerText = mult + "x";
        }
    },

    async cashout() {
        if(!this.active || this.diamonds === 0) return;
        const mult = 1 + (this.diamonds * 0.25);
        const winAmount = Math.floor(this.bet * mult);
        
        await DBModule.updateBalance(this.wallet, winAmount);
        Notify.show(`Cashed out ${winAmount} ABP! 💎`, "success");
        this.gameOver(true);
    },

    gameOver(won) {
        this.active = false;
        this.updateUI(false);
        if(!won) Notify.show("BOOM! Try again.", "error");
    },

    updateUI(playing) {
        document.getElementById('setupSection').style.display = playing ? 'none' : 'block';
        document.getElementById('actionSection').style.display = playing ? 'block' : 'none';
        if(!playing) document.getElementById('multiplier').innerText = "1.00x";
    }
};

window.MinesLogic = MinesLogic;

