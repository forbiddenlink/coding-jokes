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
        const jokes = document.querySelectorAll('.joke');
        
        jokes.forEach(joke => {
            const jokeCategory = joke.dataset.category;
            const shouldShow = category === 'all' || jokeCategory === category;
            
            // Only show if it matches both search and category filter
            const isVisible = joke.style.display !== 'none';
            joke.style.display = shouldShow && isVisible ? 'block' : 'none';
        });
        
        // Update filter results count
        this.updateFilterResultsCount();
    },
    
    updateFilterResultsCount() {
        const visibleJokes = document.querySelectorAll('.joke[style="display: block"]').length;
        const totalJokes = document.querySelectorAll('.joke').length;
        
        const resultsCount = document.querySelector('.filter-results-count');
        if (!resultsCount) return;
        
        const categoryText = this.currentCategory === 'all' ? 'all categories' : this.currentCategory;
        resultsCount.textContent = `Showing ${visibleJokes} of ${totalJokes} jokes in ${categoryText}`;
    }
};

// Initialize filter manager on page load
document.addEventListener('DOMContentLoaded', () => filterManager.init()); 