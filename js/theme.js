// Theme management
console.log('Theme script loaded');

const theme = {
    current: localStorage.getItem('theme') || 'light',
    
    init() {
        // Set initial theme immediately to prevent flash
        this.setTheme(this.current);
        
        // Add event listeners after DOM is loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.addEventListeners());
        } else {
            this.addEventListeners();
        }
    },
    
    setTheme(newTheme) {
        this.current = newTheme;
        document.documentElement.setAttribute('data-theme', this.current);
        localStorage.setItem('theme', this.current);
        
        // Update button if it exists
        const button = document.getElementById('themeToggle');
        if (button) {
            const icon = button.querySelector('i');
            const text = button.querySelector('span');
            
            if (this.current === 'dark') {
                icon.className = 'fas fa-sun';
                text.textContent = 'Toggle Light Mode';
            } else {
                icon.className = 'fas fa-moon';
                text.textContent = 'Toggle Dark Mode';
            }
        }
    },
    
    toggle() {
        const newTheme = this.current === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    },
    
    addEventListeners() {
        const button = document.getElementById('themeToggle');
        if (!button) return;
        
        // Remove any existing listeners
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        // Add click listener
        newButton.addEventListener('click', () => this.toggle());
        
        // Add keyboard support
        newButton.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggle();
            }
        });
    }
};

// Initialize theme immediately
theme.init(); 