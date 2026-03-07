import { db, ref, set, get } from './firebase.js';

const TICKET_PRICE = 100; // Har ticket ki keemat 100 ABP

/**
 * 1. BUY LOTTERY TICKET
 * User ke balance se points deduct honge aur ticket number generate hoga.
 */
export async function buyTicket(userAddress) {
    const userRef = ref(db, `users/${userAddress}`);
    const snapshot = await get(userRef);
    
    if (!snapshot.exists() || snapshot.val().points < TICKET_PRICE) {
        showNotification("❌ Balance Kam Hai! Kam se kam 100 ABP chahiye.", "error");
        return;
    }

    // New Balance Calculate karein
    const newBalance = snapshot.val().points - TICKET_PRICE;
    const ticketID = "ABP-" + Math.floor(100000 + Math.random() * 900000); // Unique 6-digit ID

    // Firebase mein update karein
    await set(userRef, { ...snapshot.val(), points: newBalance });
    
    // Global Lottery Pool mein ticket add karein
    const poolRef = ref(db, `lottery/tickets/${ticketID}`);
    await set(poolRef, { owner: userAddress, timestamp: Date.now() });

    // UI Update
    updateUIBalance(newBalance);
    showTicketPopup(ticketID);
}

/**
 * 2. PREMIUM UI POPUP (Ticket Confirmation)
 */
function showTicketPopup(id) {
    const popup = document.createElement('div');
    popup.className = 'ticket-modal glass-effect fade-in';
    popup.innerHTML = `
        <div class="ticket-content">
            <h2 style="color: #ffcc00;">🎫 Ticket Confirmed!</h2>
            <p>Your Lucky Number:</p>
            <div class="ticket-id">${id}</div>
            <button onclick="this.parentElement.parentElement.remove()" class="premium-btn">Good Luck! 🍀</button>
        </div>
    `;
    document.body.appendChild(popup);
}

/**
 * 3. NOTIFICATION SYSTEM
 */
function showNotification(msg, type) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerText = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function updateUIBalance(newBalance) {
    document.getElementById('abpBalance').innerText = newBalance.toFixed(2);
}

// Global scope ke liye export
window.buyTicket = buyTicket;
