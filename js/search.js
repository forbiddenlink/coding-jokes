// Search functionality
const searchManager = {
    debounceTimer: null,
    debounceDelay: 300,
    
    init() {
        this.addEventListeners();
    },
    
    addEventListeners() {
        const searchInput = document.getElementById('searchInput');
        if (!searchInput) return;
        
        searchInput.addEventListener('input', (e) => {
            this.debounce(() => this.search(e.target.value));
        });
        
        // Add keyboard navigation
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                searchInput.value = '';
                this.search('');
            }
        });
    },
    
    debounce(callback) {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(callback, this.debounceDelay);
    },
    
    search(query) {
        const jokes = document.querySelectorAll('.joke');
        const normalizedQuery = query.toLowerCase().trim();
        
        jokes.forEach(joke => {
            const question = joke.querySelector('.question').textContent.toLowerCase();
            const answer = joke.querySelector('.punchline').textContent.toLowerCase();
            const category = joke.dataset.category.toLowerCase();
            
            const matches = question.includes(normalizedQuery) || 
                          answer.includes(normalizedQuery) || 
                          category.includes(normalizedQuery);
            
            joke.style.display = matches ? 'block' : 'none';
        });
        
        // Update search results count
        this.updateSearchResultsCount();
    },
    
    updateSearchResultsCount() {
        const visibleJokes = document.querySelectorAll('.joke[style="display: block"]').length;
        const totalJokes = document.querySelectorAll('.joke').length;
        
        const resultsCount = document.querySelector('.search-results-count');
        if (!resultsCount) return;
        
        resultsCount.textContent = `Showing ${visibleJokes} of ${totalJokes} jokes`;
    }
};

// Initialize search manager on page load
document.addEventListener('DOMContentLoaded', () => searchManager.init()); 