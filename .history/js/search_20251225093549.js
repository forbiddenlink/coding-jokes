// Search functionality
const searchManager = {
    debounceTimer: null,
    debounceDelay: 300,
    currentQuery: '',
    
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
        this.currentQuery = query;
        if (typeof jokesManager !== 'undefined') {
            jokesManager.currentSearch = query;
            jokesManager.applyFilters();
        } else {
            // Fallback to direct DOM manipulation
            this.searchDOM(query);
        }
    },
    
    searchDOM(query) {
        const jokes = document.querySelectorAll('.joke');
        const normalizedQuery = query.toLowerCase().trim();
        let visibleCount = 0;
        
        jokes.forEach(joke => {
            const question = joke.querySelector('.question').textContent.toLowerCase();
            const answer = joke.querySelector('.punchline').textContent.toLowerCase();
            const category = joke.dataset.category.toLowerCase();
            
            const matchesSearch = !normalizedQuery || 
                question.includes(normalizedQuery) || 
                answer.includes(normalizedQuery) || 
                category.includes(normalizedQuery);
            
            if (matchesSearch) {
                joke.style.display = 'block';
                visibleCount++;
            } else {
                joke.style.display = 'none';
            }
        });
        
        this.updateSearchResultsCount(visibleCount, jokes.length);
    },
    
    updateSearchResultsCount(visible, total) {
        const resultsCount = document.querySelector('.search-results-count');
        if (!resultsCount) return;
        
        if (this.currentQuery) {
            resultsCount.textContent = `Found ${visible} of ${total} jokes`;
            resultsCount.style.display = 'block';
        } else {
            resultsCount.style.display = 'none';
        }
    }
};

// Initialize search manager on page load
document.addEventListener('DOMContentLoaded', () => searchManager.init()); 