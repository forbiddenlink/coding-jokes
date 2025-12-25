/* eslint-env browser */
// Filter functionality
const filterManager = {
    currentCategory: 'all',
    
    init() {
        this.addEventListeners();
    },
    
    addEventListeners() {
        const categoryFilter = document.getElementById('categoryFilter');
        if (!categoryFilter) return;
        
        categoryFilter.addEventListener('change', (e) => {
            this.filterByCategory(e.target.value);
        });
    },
    
    filterByCategory(category) {
        this.currentCategory = category;
        if (typeof jokesManager !== 'undefined') {
            jokesManager.currentFilter = category;
            jokesManager.applyFilters();
        } else {
            // Fallback to direct DOM manipulation
            this.filterDOM(category);
        }
    },
    
    filterDOM(category) {
        const jokes = document.querySelectorAll('.joke');
        let visibleCount = 0;
        
        jokes.forEach(joke => {
            const jokeCategory = joke.dataset.category;
            const matchesCategory = category === 'all' || jokeCategory === category;
            
            if (matchesCategory && joke.style.display !== 'none') {
                visibleCount++;
            } else if (!matchesCategory) {
                joke.style.display = 'none';
            }
        });
        
        this.updateFilterResultsCount(visibleCount, jokes.length);
    },
    
    updateFilterResultsCount(visible, total) {
        const resultsCount = document.querySelector('.filter-results-count');
        if (!resultsCount) return;
        
        if (this.currentCategory !== 'all') {
            const categoryText = this.currentCategory;
            resultsCount.textContent = `${visible} ${categoryText} jokes`;
            resultsCount.style.display = 'block';
        } else {
            resultsCount.style.display = 'none';
        }
    }
};

// Initialize filter manager on page load
document.addEventListener('DOMContentLoaded', () => filterManager.init()); 