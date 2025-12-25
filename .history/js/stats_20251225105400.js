// Stats and Achievements Manager
const statsManager = {
    stats: {
        jokesViewed: new Set(),
        totalReactions: 0,
        categoryViews: {},
        achievements: {}
    },
    
    achievements: [
        {
            id: 'first_laugh',
            icon: '😂',
            name: 'First Laugh',
            description: 'React to your first joke',
            condition: () => this.stats.totalReactions >= 1
        },
        {
            id: 'joke_explorer',
            icon: '🔍',
            name: 'Joke Explorer',
            description: 'View 10 different jokes',
            condition: () => this.stats.jokesViewed.size >= 10
        },
        {
            id: 'category_master',
            icon: '🎓',
            name: 'Category Master',
            description: 'View jokes from 5 different categories',
            condition: () => Object.keys(this.stats.categoryViews).length >= 5
        },
        {
            id: 'reaction_enthusiast',
            icon: '🔥',
            name: 'Reaction Enthusiast',
            description: 'Give 20 reactions',
            condition: () => this.stats.totalReactions >= 20
        },
        {
            id: 'joke_connoisseur',
            icon: '🤓',
            name: 'Joke Connoisseur',
            description: 'View 50 jokes',
            condition: () => this.stats.jokesViewed.size >= 50
        },
        {
            id: 'night_owl',
            icon: '🌙',
            name: 'Night Owl',
            description: 'Browse jokes after midnight',
            condition: () => {
                const hour = new Date().getHours();
                return hour >= 0 && hour < 6;
            }
        },
        {
            id: 'early_bird',
            icon: '🌅',
            name: 'Early Bird',
            description: 'Browse jokes before 7 AM',
            condition: () => {
                const hour = new Date().getHours();
                return hour >= 5 && hour < 7;
            }
        },
        {
            id: 'weekend_coder',
            icon: '🎮',
            name: 'Weekend Coder',
            description: 'Browse jokes on Saturday or Sunday',
            condition: () => {
                const day = new Date().getDay();
                return day === 0 || day === 6;
            }
        },
        {
            id: 'collector',
            icon: '💎',
            name: 'Collector',
            description: 'React to 10 jokes',
            condition: () => this.stats.totalReactions >= 10
        },
        {
            id: 'all_categories',
            icon: '🌟',
            name: 'All Categories',
            description: 'View jokes from all 14 categories',
            condition: () => Object.keys(this.stats.categoryViews).length >= 14
        }
    ],
    
    init() {
        this.loadStats();
        this.setupEventListeners();
        this.checkTimeBasedAchievements();
    },
    
    loadStats() {
        const saved = localStorage.getItem('jokeStats');
        if (saved) {
            const parsed = JSON.parse(saved);
            this.stats.jokesViewed = new Set(parsed.jokesViewed || []);
            this.stats.totalReactions = parsed.totalReactions || 0;
            this.stats.categoryViews = parsed.categoryViews || {};
            this.stats.achievements = parsed.achievements || {};
        }
    },
    
    saveStats() {
        localStorage.setItem('jokeStats', JSON.stringify({
            jokesViewed: [...this.stats.jokesViewed],
            totalReactions: this.stats.totalReactions,
            categoryViews: this.stats.categoryViews,
            achievements: this.stats.achievements
        }));
    },
    
    setupEventListeners() {
        const statsButton = document.querySelector('.stats-button');
        const closeStats = document.querySelector('.close-stats');
        const statsDashboard = document.getElementById('statsDashboard');
        
        if (statsButton) {
            statsButton.addEventListener('click', () => {
                if (statsDashboard.style.display === 'none') {
                    this.showStats();
                } else {
                    this.hideStats();
                }
            });
        }
        
        if (closeStats) {
            closeStats.addEventListener('click', () => this.hideStats());
        }
    },
    
    trackJokeView(jokeId, category) {
        this.stats.jokesViewed.add(jokeId);
        
        if (category) {
            this.stats.categoryViews[category] = (this.stats.categoryViews[category] || 0) + 1;
        }
        
        this.checkAchievements();
        this.saveStats();
    },
    
    trackReaction() {
        this.stats.totalReactions++;
        this.checkAchievements();
        this.saveStats();
    },
    
    checkTimeBasedAchievements() {
        const timeBasedIds = ['night_owl', 'early_bird', 'weekend_coder'];
        timeBasedIds.forEach(id => {
            const achievement = this.achievements.find(a => a.id === id);
            if (achievement && achievement.condition.call(this)) {
                this.unlockAchievement(id);
            }
        });
    },
    
    checkAchievements() {
        this.achievements.forEach(achievement => {
            if (!this.stats.achievements[achievement.id] && achievement.condition.call(this)) {
                this.unlockAchievement(achievement.id);
            }
        });
    },
    
    unlockAchievement(achievementId) {
        if (this.stats.achievements[achievementId]) return;
        
        this.stats.achievements[achievementId] = {
            unlockedAt: new Date().toISOString()
        };
        
        const achievement = this.achievements.find(a => a.id === achievementId);
        if (achievement) {
            this.showAchievementNotification(achievement);
        }
        
        this.saveStats();
    },
    
    showAchievementNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification animate__animated animate__bounceIn';
        notification.innerHTML = `
            <div class="achievement-notification-content">
                <div class="achievement-notification-icon">${achievement.icon}</div>
                <div>
                    <div class="achievement-notification-title">Achievement Unlocked!</div>
                    <div class="achievement-notification-name">${achievement.name}</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.remove('animate__bounceIn');
            notification.classList.add('animate__bounceOut');
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    },
    
    showStats() {
        const dashboard = document.getElementById('statsDashboard');
        
        // Update stat values
        document.getElementById('totalReactions').textContent = this.stats.totalReactions;
        document.getElementById('jokesViewed').textContent = this.stats.jokesViewed.size;
        
        // Find favorite category
        const categories = Object.entries(this.stats.categoryViews);
        const favoriteCategory = categories.length > 0
            ? categories.sort((a, b) => b[1] - a[1])[0][0]
            : '—';
        document.getElementById('favoriteCategory').textContent = 
            favoriteCategory === '—' ? '—' : this.formatCategoryName(favoriteCategory);
        
        // Count unlocked achievements
        const unlockedCount = Object.keys(this.stats.achievements).length;
        document.getElementById('achievementCount').textContent = `${unlockedCount}/${this.achievements.length}`;
        
        // Render achievements
        this.renderAchievements();
        
        dashboard.style.display = 'block';
        dashboard.scrollIntoView({ behavior: 'smooth' });
    },
    
    hideStats() {
        const dashboard = document.getElementById('statsDashboard');
        dashboard.style.display = 'none';
    },
    
    renderAchievements() {
        const grid = document.getElementById('achievementsGrid');
        if (!grid) return;
        
        grid.innerHTML = this.achievements.map(achievement => {
            const isUnlocked = !!this.stats.achievements[achievement.id];
            return `
                <div class="achievement ${isUnlocked ? 'unlocked' : 'locked'}">
                    <div class="achievement-icon">${achievement.icon}</div>
                    <div class="achievement-name">${achievement.name}</div>
                    <div class="achievement-desc">${achievement.description}</div>
                </div>
            `;
        }).join('');
    },
    
    formatCategoryName(category) {
        const names = {
            javascript: 'JavaScript',
            python: 'Python',
            java: 'Java',
            web: 'Web Dev',
            testing: 'Testing',
            design: 'Design',
            security: 'Security',
            mobile: 'Mobile',
            startup: 'Startup',
            ai: 'AI/ML',
            database: 'Database',
            devops: 'DevOps',
            hardware: 'Hardware',
            general: 'General'
        };
        return names[category] || category;
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => statsManager.init());
} else {
    statsManager.init();
}
