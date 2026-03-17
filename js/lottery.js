/**
 * ADAMAS PROTOCOL - Lottery System
 * Ticket Purchase & Registry
 */
import { DBModule } from './database.js';

const LotteryModule = {
    ticketPrice: 50,
    wallet: localStorage.getItem('userWallet'),

    openUI() {
        document.getElementById('lotteryModal').style.display = 'flex';
    },

    closeUI() {
        document.getElementById('lotteryModal').style.display = 'none';
    },

    async buyTicket() {
        if(!this.wallet) return Notify.show("Connect Wallet First", "error");

        const user = await DBModule.getUserData(this.wallet);
        if(user.balance < this.ticketPrice) {
            return Notify.show("Insufficient ABP for Ticket!", "error");
        }

        // 1. Subtract Balance
        await DBModule.updateBalance(this.wallet, -this.ticketPrice);

        // 2. Add to Lottery Registry in Firebase (Logic placeholder)
        // Note: Real production mein hum tickets ka ek naya node banate hain
        Notify.show("Ticket Purchased! Good Luck 🎟️", "success");
        this.closeUI();
    }
};

window.LotteryModule = LotteryModule;
export { LotteryModule };

