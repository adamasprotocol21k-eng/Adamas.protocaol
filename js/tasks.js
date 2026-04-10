const TaskManager = {
    // Current tasks with more details
    tasks: [
        { id: 1, type: 'x', title: "Like & RT Pinned Post", reward: 100, link: "https://x.com/adamas" },
        { id: 2, type: 'tg', title: "Join Announcement Channel", reward: 50, link: "https://t.me/adamas_news" },
        { id: 3, type: 'yt', title: "Subscribe Our YouTube", reward: 150, link: "https://youtube.com/@adamas" }
    ],

    renderTasks: function() {
        const taskArea = document.getElementById('taskContainer');
        if(!taskArea) return;

        taskArea.innerHTML = '<h3 class="ultra-glow-text" style="margin-bottom:15px;">DAILY MISSIONS</h3>';
        
        // Get completed tasks from local storage to keep state
        const completed = JSON.parse(localStorage.getItem('completedTasks') || "[]");

        this.tasks.forEach(task => {
            const isDone = completed.includes(task.id);
            taskArea.innerHTML += `
                <div class="pro-card task-box" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; padding:15px;">
                    <div style="display:flex; align-items:center; gap:10px;">
                        <span class="social-icon">${this.getIcon(task.type)}</span>
                        <div style="text-align:left;">
                            <div style="font-weight:700; font-size:0.9rem;">${task.title}</div>
                            <div style="font-size:0.7rem; color:var(--cyan);">+${task.reward} ABP</div>
                        </div>
                    </div>
                    <button id="taskBtn-${task.id}" 
                            onclick="TaskManager.handleTask(${task.id})" 
                            class="${isDone ? 'btn-done' : 'btn-primary-sm'}" 
                            ${isDone ? 'disabled' : ''}>
                        ${isDone ? 'CLAIMED' : 'GO'}
                    </button>
                </div>
            `;
        });
    },

    getIcon: function(type) {
        if(type === 'x') return '🐦';
        if(type === 'tg') return '📢';
        if(type === 'yt') return '📺';
        return '🔗';
    },

    handleTask: function(id) {
        const task = this.tasks.find(t => t.id === id);
        const btn = document.getElementById(`taskBtn-${id}`);
        
        window.open(task.link, '_blank');

        // Start Verification Animation
        btn.innerText = "VERIFYING...";
        btn.classList.add('loading');

        setTimeout(() => {
            this.complete(id);
        }, 8000); // 8-second fake verification for realism
    },

    complete: function(id) {
        const task = this.tasks.find(t => t.id === id);
        const btn = document.getElementById(`taskBtn-${id}`);
        
        // Update Local Storage
        const completed = JSON.parse(localStorage.getItem('completedTasks') || "[]");
        if(!completed.includes(id)) {
            completed.push(id);
            localStorage.setItem('completedTasks', JSON.stringify(completed));
        }

        // Update UI
        btn.innerText = "CLAIMED";
        btn.className = "btn-done";
        btn.disabled = true;

        // Visual Feedback (Floating points can be added here)
        alert(`Verification Successful! ${task.reward} ABP added to your balance.`);
        
        // Balance sync call (optional)
        if(typeof syncBalance === 'function') syncBalance(task.reward);
    }
};
