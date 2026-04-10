const TaskManager = {
    tasks: [
        { id: 1, title: "Like & Retweet pinned post", reward: 100, link: "https://x.com/adamas/status/1" },
        { id: 2, title: "Join Adamas Announcement Channel", reward: 50, link: "https://t.me/adamas_news" }
    ],

    renderTasks: function() {
        const taskArea = document.getElementById('taskContainer'); // Add this ID in dashboard
        taskArea.innerHTML = '<h3>DAILY MISSIONS</h3>';
        this.tasks.forEach(task => {
            taskArea.innerHTML += `
                <div class="pro-card task-box">
                    <span>${task.title}</span>
                    <button class="btn-primary-sm" onclick="TaskManager.complete(${task.id})">+${task.reward} ABP</button>
                </div>
            `;
        });
    },

    complete: function(id) {
        const task = this.tasks.find(t => t.id === id);
        window.open(task.link, '_blank');
        // Animation for claiming points
        alert(`Verification pending for ${task.reward} ABP. Usually takes 24h.`);
    }
};
