import baseJokes from './jokes-data.json';
/* eslint-env browser */
// Joke management
const jokesManager = window.jokesManager = {
    initialized: false,
    jokes: [],
    currentJoke: null,
    featuredJokes: [],
    currentPage: 1,
    jokesPerPage: 6,
    likedJokes: new Set(), // Keep for backward compatibility
    reactions: {}, // { jokeId: { '😂': true, '🤓': false, ... } }
    currentFilter: 'all',
    currentSearch: '',
    sortBy: 'newest', // newest, popular, category
    baseJokeCount: 0,
    userJokesStorageKey: 'codingJokes.userJokes.v1',
    analyticsStorageKey: 'codingJokes.analytics.v1',
    analytics: {
        reveals: 0,
        reactions: 0,
        searches: 0,
        searchNoResults: 0,
        randomJumps: 0
    },
    lastSearchNoResultKey: '',
    
    init() {
        if (this.initialized) return;
        this.initialized = true;

        this.loadLikedJokes();
        this.loadReactions();
        this.loadAnalytics();
        this.loadStateFromUrl();
        this.loadJokes();
        this.addEventListeners();
        this.setupSubmitForm();
        this.setupPagination();
        this.setupSortControls();
        this.syncControlsFromState();
    },
    
    loadLikedJokes() {
        const saved = localStorage.getItem('likedJokes');
        if (saved) {
            this.likedJokes = new Set(JSON.parse(saved));
        }
    },
    
    saveLikedJokes() {
        localStorage.setItem('likedJokes', JSON.stringify([...this.likedJokes]));
    },
    
    loadReactions() {
        const saved = localStorage.getItem('jokeReactions');
        if (saved) {
            this.reactions = JSON.parse(saved);
        }
    },
    
    saveReactions() {
        localStorage.setItem('jokeReactions', JSON.stringify(this.reactions));
    },

    escapeHtml(value) {
        const text = String(value ?? '');
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    },

    getAllowedCategories() {
        return new Set([
            'javascript', 'python', 'java', 'general', 'web', 'testing',
            'design', 'security', 'mobile', 'startup', 'ai', 'database',
            'devops', 'hardware'
        ]);
    },

    loadAnalytics() {
        const saved = localStorage.getItem(this.analyticsStorageKey);
        if (!saved) return;

        try {
            const parsed = JSON.parse(saved);
            this.analytics = {
                reveals: Number(parsed.reveals) || 0,
                reactions: Number(parsed.reactions) || 0,
                searches: Number(parsed.searches) || 0,
                searchNoResults: Number(parsed.searchNoResults) || 0,
                randomJumps: Number(parsed.randomJumps) || 0
            };
        } catch (error) {
            console.error('Failed to load analytics:', error);
        }
    },

    saveAnalytics() {
        localStorage.setItem(this.analyticsStorageKey, JSON.stringify(this.analytics));
    },

    trackMetric(metric, increment = 1) {
        if (!Object.hasOwn(this.analytics, metric)) return;
        this.analytics[metric] += increment;
        this.saveAnalytics();
    },

    trackSearch(query) {
        if (String(query || '').trim().length === 0) return;
        this.trackMetric('searches', 1);
    },

    getNextJokeId() {
        return this.jokes.reduce((maxId, joke) => Math.max(maxId, Number(joke.id) || 0), 0) + 1;
    },

    loadUserJokes() {
        const saved = localStorage.getItem(this.userJokesStorageKey);
        if (!saved) return [];

        try {
            const parsed = JSON.parse(saved);
            if (!parsed || parsed.version !== 1 || !Array.isArray(parsed.jokes)) {
                return [];
            }

            const allowedCategories = this.getAllowedCategories();
            return parsed.jokes
                .filter((joke) => {
                    return (
                        joke &&
                        Number.isInteger(joke.id) &&
                        joke.id > 0 &&
                        typeof joke.question === 'string' &&
                        typeof joke.answer === 'string' &&
                        allowedCategories.has(joke.category)
                    );
                })
                .map((joke) => ({
                    id: joke.id,
                    question: joke.question.trim().slice(0, 500),
                    answer: joke.answer.trim().slice(0, 500),
                    category: joke.category,
                    likes: 0,
                    userSubmitted: true,
                    createdAt: typeof joke.createdAt === 'string' ? joke.createdAt : new Date().toISOString()
                }))
                .filter((joke) => joke.question && joke.answer);
        } catch (error) {
            console.error('Failed to load user jokes:', error);
            return [];
        }
    },

    saveUserJokes() {
        const jokes = this.jokes
            .filter((joke) => joke.userSubmitted)
            .map((joke) => ({
                id: joke.id,
                question: joke.question,
                answer: joke.answer,
                category: joke.category,
                createdAt: joke.createdAt || new Date().toISOString()
            }));

        localStorage.setItem(
            this.userJokesStorageKey,
            JSON.stringify({ version: 1, jokes })
        );
    },

    mergeUserJokes() {
        const persistedJokes = this.loadUserJokes();
        if (persistedJokes.length === 0) return;

        const usedIds = new Set(this.jokes.map((joke) => joke.id));
        let nextId = this.getNextJokeId();

        for (const joke of persistedJokes) {
            const mergedJoke = { ...joke };
            if (usedIds.has(mergedJoke.id)) {
                mergedJoke.id = nextId++;
            }
            usedIds.add(mergedJoke.id);
            this.jokes.push(mergedJoke);
        }
    },

    syncLikesFromReactions() {
        for (const joke of this.jokes) {
            const jokeReactions = this.reactions[joke.id] || {};
            joke.likes = Object.values(jokeReactions).filter(Boolean).length;
        }
    },

    loadStateFromUrl() {
        const params = new URLSearchParams(window.location.search);
        const allowedSort = new Set(['newest', 'popular', 'category']);
        const category = params.get('category');
        const search = params.get('q');
        const sort = params.get('sort');
        const page = Number.parseInt(params.get('page') || '1', 10);

        if (category && (category === 'all' || this.getAllowedCategories().has(category))) {
            this.currentFilter = category;
        }
        if (typeof search === 'string') {
            this.currentSearch = search.slice(0, 120);
        }
        if (sort && allowedSort.has(sort)) {
            this.sortBy = sort;
        }
        if (Number.isInteger(page) && page > 0) {
            this.currentPage = page;
        }
    },

    syncControlsFromState() {
        const searchInput = document.getElementById('searchInput');
        const categoryFilter = document.getElementById('categoryFilter');
        const sortSelect = document.getElementById('sortSelect');

        if (searchInput) searchInput.value = this.currentSearch;
        if (categoryFilter) categoryFilter.value = this.currentFilter;
        if (sortSelect) sortSelect.value = this.sortBy;
    },

    updateUrlState() {
        const params = new URLSearchParams();
        if (this.currentSearch) params.set('q', this.currentSearch);
        if (this.currentFilter !== 'all') params.set('category', this.currentFilter);
        if (this.sortBy !== 'newest') params.set('sort', this.sortBy);
        if (this.currentPage > 1) params.set('page', String(this.currentPage));

        const query = params.toString();
        const nextUrl = query ? `${window.location.pathname}?${query}` : window.location.pathname;
        window.history.replaceState(null, '', nextUrl);
    },
    
    loadJokes() {
        this.showLoading();
        
        // Simulate loading delay
        setTimeout(() => {
            try {
                this.jokes = baseJokes.map((joke) => ({ ...joke, likes: 0 }));
                this.baseJokeCount = this.jokes.length;
                this.mergeUserJokes();
                this.syncLikesFromReactions();
                this.loadFeaturedJokes();
                this.syncControlsFromState();
                this.applyFilters({ preservePage: true });
            } catch (error) {
                this.showError('Failed to load jokes. Please try again later.');
                console.error('Error loading jokes:', error);
            }
        }, 0);
    },
    
    loadFeaturedJokes() {
        // Select 3 random jokes to feature
        const availableJokes = [...this.jokes];
        this.featuredJokes = [];
        for (let i = 0; i < 3 && availableJokes.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * availableJokes.length);
            this.featuredJokes.push(availableJokes.splice(randomIndex, 1)[0]);
        }
        this.renderFeaturedJokes();
    },
    
    renderJokes() {
        const container = document.querySelector('.jokes-grid');
        if (!container) return;
        
        if (this.jokes.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-grin-beam-sweat"></i>
                    <h3>No Jokes Found</h3>
                    <p>Be the first to submit a joke!</p>
                </div>
            `;
            return;
        }
        
        // Apply filters
        const filteredJokes = this.getFilteredJokes();
        if (filteredJokes.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <h3>No Matching Jokes</h3>
                    <p>Try adjusting search, category, or sort options.</p>
                </div>
            `;
            this.updatePagination(0);
            return;
        }

        const totalPages = Math.max(1, Math.ceil(filteredJokes.length / this.jokesPerPage));
        if (this.currentPage > totalPages) {
            this.currentPage = totalPages;
        }
        
        const startIndex = (this.currentPage - 1) * this.jokesPerPage;
        const endIndex = startIndex + this.jokesPerPage;
        const currentJokes = filteredJokes.slice(startIndex, endIndex);
        
        container.innerHTML = currentJokes.map((joke, index) => this.createJokeElement(joke, false, index)).join('');
        
        // Update pagination with filtered count
        this.updatePagination(filteredJokes.length);
    },
    
    getFilteredJokes() {
        let filtered = [...this.jokes];
        
        // Apply category filter
        if (this.currentFilter !== 'all') {
            filtered = filtered.filter(joke => joke.category === this.currentFilter);
        }
        
        // Apply search filter
        if (this.currentSearch) {
            const query = this.currentSearch.toLowerCase().trim();
            filtered = filtered.filter(joke => 
                joke.question.toLowerCase().includes(query) ||
                joke.answer.toLowerCase().includes(query) ||
                joke.category.toLowerCase().includes(query)
            );
        }
        
        // Apply sorting
        filtered = this.sortJokes(filtered);
        
        return filtered;
    },
    
    sortJokes(jokes) {
        switch(this.sortBy) {
            case 'popular':
                return jokes.sort((a, b) => b.likes - a.likes);
            case 'category':
                return jokes.sort((a, b) => a.category.localeCompare(b.category));
            case 'newest':
            default:
                return jokes.sort((a, b) => b.id - a.id);
        }
    },
    
    applyFilters(options = {}) {
        if (!options.preservePage) {
            this.currentPage = 1; // Reset to first page when filters change
        }

        const filtered = this.getFilteredJokes();
        if (this.currentSearch && filtered.length === 0) {
            const key = `${this.currentSearch}|${this.currentFilter}`;
            if (this.lastSearchNoResultKey !== key) {
                this.trackMetric('searchNoResults', 1);
                this.lastSearchNoResultKey = key;
            }
        } else {
            this.lastSearchNoResultKey = '';
        }

        this.renderJokes();
        this.updateResultsCounters(filtered.length, this.jokes.length);
        this.updateStatusMessage();
        this.updateUrlState();
    },

    updateResultsCounters(filteredCount, totalCount) {
        const searchCountEl = document.querySelector('.search-results-count');
        const filterCountEl = document.querySelector('.filter-results-count');

        if (searchCountEl) {
            if (this.currentSearch) {
                searchCountEl.textContent = `Found ${filteredCount} of ${totalCount} jokes`;
                searchCountEl.style.display = 'block';
            } else {
                searchCountEl.style.display = 'none';
            }
        }

        if (filterCountEl) {
            if (this.currentFilter !== 'all') {
                filterCountEl.textContent = `${filteredCount} ${this.currentFilter} jokes`;
                filterCountEl.style.display = 'block';
            } else {
                filterCountEl.style.display = 'none';
            }
        }
    },
    
    updateStatusMessage() {
        const filtered = this.getFilteredJokes();
        const total = this.jokes.length;
        
        let message = '';
        if (this.currentSearch) {
            message += `Searching for "${this.currentSearch}" `;
        }
        if (this.currentFilter !== 'all') {
            message += `in ${this.currentFilter} `;
        }
        if (filtered.length !== total) {
            message += `(${filtered.length} of ${total} jokes)`;
        }
        
        // Update any status display elements
        const statusElement = document.querySelector('.filter-status');
        if (statusElement && message) {
            statusElement.textContent = message;
            statusElement.style.display = 'block';
        } else if (statusElement) {
            statusElement.style.display = 'none';
        }
    },
    
    renderFeaturedJokes() {
        const container = document.querySelector('.featured-jokes');
        if (!container) return;
        
        if (this.featuredJokes.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-star"></i>
                    <h3>No Featured Jokes</h3>
                    <p>Check back later for featured jokes!</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = this.featuredJokes.map((joke, index) => this.createJokeElement(joke, true, index)).join('');
    },
    
    createJokeElement(joke, isFeatured = false, index = 0) {
        const isLiked = this.likedJokes.has(joke.id);
        const safeId = Number.isInteger(joke.id) ? joke.id : 0;
        const safeCategory = this.escapeHtml(joke.category);
        const safeQuestion = this.escapeHtml(joke.question);
        const safeAnswer = this.escapeHtml(joke.answer);
        const safeLikes = Number.isFinite(joke.likes) ? joke.likes : 0;
        const element = `
            <div class="joke ${isFeatured ? 'featured-joke' : ''} animate__animated animate__fadeIn" 
                 style="--delay: ${index * 0.1}s"
                 data-category="${safeCategory}" 
                 data-id="${safeId}"
                 role="article"
                 aria-labelledby="joke-${safeId}-question">
                <span class="category-badge animate__animated animate__slideInRight" aria-label="Category: ${safeCategory}">${safeCategory}</span>
                <div id="joke-${safeId}-question" class="question">${safeQuestion}</div>
                <div id="joke-${safeId}-punchline" class="punchline" aria-expanded="false">${safeAnswer}</div>
                <div class="joke-actions">
                    <button class="reveal-button" 
                            aria-label="Reveal punchline"
                            aria-expanded="false"
                            aria-controls="joke-${safeId}-punchline">
                        <i class="fas fa-eye"></i> <span>Reveal</span>
                    </button>
                    <div class="action-buttons">
                        <div class="reactions-container">
                            <button class="action-button like-button ${isLiked ? 'liked' : ''}" 
                                    aria-label="Like joke"
                                    aria-pressed="${isLiked}"
                                    style="display: none;">
                                <i class="fas fa-heart"></i> <span class="like-count">${safeLikes}</span>
                            </button>
                            ${this.renderReactions(joke)}
                        </div>
                        <button class="action-button share-button" 
                                aria-label="Share joke">
                            <i class="fas fa-share"></i>
                        </button>
                        <button class="action-button copy-button" 
                                aria-label="Copy joke to clipboard">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        return element;
    },
    
    addEventListeners() {
        // Event delegation for joke interactions
        document.addEventListener('click', (e) => {
            const joke = e.target.closest('.joke, .featured-joke');
            if (!joke) return;
            
            if (e.target.closest('.reveal-button')) {
                this.togglePunchline(joke);
            } else if (e.target.closest('.like-button')) {
                this.toggleLike(joke);
            } else if (e.target.closest('.reaction-button')) {
                this.handleReaction(joke, e.target.closest('.reaction-button'));
            } else if (e.target.closest('.share-button')) {
                this.shareJoke(joke);
            } else if (e.target.closest('.copy-button')) {
                this.copyJoke(joke);
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // Close any open punchlines
                document.querySelectorAll('.punchline.visible').forEach(punchline => {
                    const joke = punchline.closest('.joke, .featured-joke');
                    if (joke) this.togglePunchline(joke);
                });
            }
        });

        // Random joke button
        const randomButton = document.querySelector('.random-joke');
        if (randomButton) {
            randomButton.addEventListener('click', () => this.showRandomJoke());
            randomButton.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.showRandomJoke();
                }
            });
        }

        // Form keyboard navigation
        const form = document.getElementById('submitJokeForm');
        if (form) {
            form.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
                    e.preventDefault();
                }
            });
        }
    },
    
    togglePunchline(joke) {
        const punchline = joke.querySelector('.punchline');
        const revealButton = joke.querySelector('.reveal-button');
        const icon = revealButton.querySelector('i');
        
        if (punchline.classList.toggle('visible')) {
            icon.className = 'fas fa-eye-slash';
            revealButton.querySelector('span').textContent = 'Hide';
            revealButton.setAttribute('aria-expanded', 'true');
            revealButton.setAttribute('aria-label', 'Hide punchline');
            punchline.setAttribute('aria-expanded', 'true');
            punchline.classList.add('animate__animated', 'animate__fadeIn');
            this.announceToScreenReader('Punchline revealed');
            this.trackMetric('reveals', 1);
            
            // Track joke view for stats
            const jokeId = parseInt(joke.dataset.id, 10);
            const category = joke.dataset.category;
            if (window.statsManager) {
                window.statsManager.trackJokeView(jokeId, category);
            }
        } else {
            icon.className = 'fas fa-eye';
            revealButton.querySelector('span').textContent = 'Reveal';
            revealButton.setAttribute('aria-expanded', 'false');
            revealButton.setAttribute('aria-label', 'Reveal punchline');
            punchline.setAttribute('aria-expanded', 'false');
            punchline.classList.remove('animate__animated', 'animate__fadeIn');
        }
    },
    
    renderReactions(joke) {
        const reactionTypes = ['\ud83d\ude02', '\ud83e\udd13', '\ud83d\udc80', '\ud83d\udd25', '\ud83e\udd14'];
        const jokeReactions = this.reactions[joke.id] || {};
        
        return `
            <div class="reaction-picker">
                ${reactionTypes.map(emoji => {
                    const isActive = jokeReactions[emoji] || false;
                    return `
                        <button class="reaction-button ${isActive ? 'active' : ''}" 
                                data-emoji="${emoji}"
                                aria-label="React with ${emoji}">
                            <span class="reaction-emoji">${emoji}</span>
                        </button>
                    `;
                }).join('')}
            </div>
        `;
    },
    
    handleReaction(joke, button) {
        const jokeId = parseInt(joke.dataset.id, 10);
        const emoji = button.dataset.emoji;
        
        if (!this.reactions[jokeId]) {
            this.reactions[jokeId] = {};
        }
        
        // Toggle the reaction
        this.reactions[jokeId][emoji] = !this.reactions[jokeId][emoji];
        
        // Animate the button
        button.classList.toggle('active');
        button.classList.add('animate__animated', 'animate__bounce');
        setTimeout(() => {
            button.classList.remove('animate__animated', 'animate__bounce');
        }, 600);
        
        // Track reaction for stats
        if (this.reactions[jokeId][emoji] && window.statsManager) {
            window.statsManager.trackReaction();
            this.trackMetric('reactions', 1);
        }
        
        // Save to localStorage
        this.saveReactions();
        
        // Update joke object likes count based on all reactions
        const jokeObj = this.jokes.find(j => j.id === jokeId);
        if (jokeObj) {
            const activeReactions = Object.values(this.reactions[jokeId] || {}).filter(Boolean).length;
            jokeObj.likes = activeReactions;
            
            // Update like count if legacy like button exists
            const likeCount = joke.querySelector('.like-count');
            if (likeCount) {
                likeCount.textContent = jokeObj.likes;
            }
        }
    },
    
    toggleLike(joke) {
        const jokeId = parseInt(joke.dataset.id, 10);
        const jokeObj = this.jokes.find(j => j.id === jokeId);
        if (!jokeObj) return;

        const likeButton = joke.querySelector('.like-button');
        const likeCount = joke.querySelector('.like-count');
        const isLiked = likeButton.classList.toggle('liked');
        
        if (isLiked) {
            this.likedJokes.add(jokeId);
            jokeObj.likes += 1;
            likeButton.classList.add('animate__animated', 'animate__heartBeat');
            setTimeout(() => {
                likeButton.classList.remove('animate__animated', 'animate__heartBeat');
            }, 1000);
        } else {
            this.likedJokes.delete(jokeId);
            jokeObj.likes = Math.max(0, jokeObj.likes - 1);
        }
        
        likeCount.textContent = jokeObj.likes;
        this.saveLikedJokes();
        
        // If sorted by popular, re-render
        if (this.sortBy === 'popular') {
            this.renderJokes();
        }
    },
    
    shareJoke(joke) {
        const question = joke.querySelector('.question').textContent;
        const answer = joke.querySelector('.punchline').textContent;
        const text = `${question}\n${answer}`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Coding Joke',
                text: text
            }).catch(console.error);
        } else {
            this.copyToClipboard(text);
        }
    },
    
    copyJoke(joke) {
        const question = joke.querySelector('.question').textContent;
        const answer = joke.querySelector('.punchline').textContent;
        const text = `${question}\n${answer}`;
        this.copyToClipboard(text);
    },
    
    copyToClipboard(text) {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text)
                .then(() => this.showToast('Copied to clipboard!'))
                .catch((error) => console.error('Clipboard copy failed:', error));
            return;
        }

        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.setAttribute('readonly', '');
        textArea.style.position = 'absolute';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();

        try {
            document.execCommand('copy');
            this.showToast('Copied to clipboard!');
        } catch (error) {
            console.error('Clipboard fallback failed:', error);
        } finally {
            textArea.remove();
        }
    },
    
    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast animate__animated animate__slideInUp';
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'polite');
        toast.textContent = message;
        document.body.appendChild(toast);
        
        this.announceToScreenReader(message);
        
        setTimeout(() => {
            toast.classList.remove('animate__slideInUp');
            toast.classList.add('animate__fadeOut');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 2700);
    },
    
    showRandomJoke() {
        const filteredJokes = this.getFilteredJokes();
        if (filteredJokes.length === 0) return;

        const randomIndex = Math.floor(Math.random() * filteredJokes.length);
        const joke = filteredJokes[randomIndex];
        const absoluteIndex = filteredJokes.findIndex((item) => item.id === joke.id);
        const targetPage = Math.floor(absoluteIndex / this.jokesPerPage) + 1;

        this.currentPage = targetPage;
        this.renderJokes();
        this.updateUrlState();

        const jokeElement = document.querySelector(`.joke[data-id="${joke.id}"]`);
        if (!jokeElement) return;

        jokeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        jokeElement.classList.add('animate__animated', 'animate__bounce');
        this.trackMetric('randomJumps', 1);
        setTimeout(() => {
            jokeElement.classList.remove('animate__animated', 'animate__bounce');
        }, 1000);
    },
    
    showLoading() {
        const container = document.querySelector('.jokes-grid');
        if (!container) return;
        
        container.innerHTML = `
            <div class="loading">
                <div class="loading-spinner"></div>
                <span class="loading-text">Loading jokes...</span>
            </div>
        `;
    },
    
    showError(message) {
        const container = document.querySelector('.jokes-grid');
        if (!container) return;
        
        container.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <span>${message}</span>
            </div>
        `;
    },
    
    setupSubmitForm() {
        const form = document.getElementById('submitJokeForm');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const question = document.getElementById('jokeQuestion').value.trim();
            const answer = document.getElementById('jokeAnswer').value.trim();
            const category = document.getElementById('jokeCategory').value;
            const allowedCategories = this.getAllowedCategories();
            
            if (!question || !answer || !allowedCategories.has(category)) {
                this.showToast('Please fill in both question and answer!');
                return;
            }
            
            try {
                const newJoke = {
                    id: this.getNextJokeId(),
                    question,
                    answer,
                    category,
                    likes: 0,
                    userSubmitted: true,
                    createdAt: new Date().toISOString()
                };
                
                this.jokes.unshift(newJoke);
                this.saveUserJokes();
                this.renderJokes();
                this.updateUrlState();
                
                // Clear form
                form.reset();
                
                // Show success message
                this.showToast('Joke submitted successfully!');
                
                // Highlight the new joke
                const jokeElement = document.querySelector(`.joke[data-id="${newJoke.id}"]`);
                if (jokeElement) {
                    jokeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    jokeElement.classList.add('highlighted');
                    setTimeout(() => {
                        jokeElement.classList.remove('highlighted');
                    }, 2000);
                }
            } catch (error) {
                this.showToast('Failed to submit joke. Please try again.');
                console.error('Error submitting joke:', error);
            }
        });
    },

    announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        document.body.appendChild(announcement);
        setTimeout(() => announcement.remove(), 1000);
    },

    setupPagination() {
        const container = document.querySelector('.jokes-grid');
        if (!container) return;
        
        // Create pagination container if it doesn't exist
        let paginationContainer = document.querySelector('.pagination');
        if (!paginationContainer) {
            paginationContainer = document.createElement('div');
            paginationContainer.className = 'pagination';
            container.parentNode.insertBefore(paginationContainer, container.nextSibling);
        }
        
        this.updatePagination();
    },
    
    setupSortControls() {
        // Create sort controls if they don't exist
        const header = document.querySelector('header');
        if (!header) return;
        
        let sortContainer = document.querySelector('.sort-container');
        if (!sortContainer) {
            sortContainer = document.createElement('div');
            sortContainer.className = 'sort-container';
            sortContainer.innerHTML = `
                <label for="sortSelect" class="sort-label">Sort by:</label>
                <select id="sortSelect" class="sort-select" aria-label="Sort jokes">
                    <option value="newest">Newest</option>
                    <option value="popular">Most Popular</option>
                    <option value="category">Category</option>
                </select>
            `;
            
            const controls = header.querySelector('.controls');
            if (controls) {
                controls.appendChild(sortContainer);
            }
        }
        
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.value = this.sortBy;
            sortSelect.addEventListener('change', (e) => {
                this.sortBy = e.target.value;
                this.applyFilters();
            });
        }
    },
    
    updatePagination(totalFiltered) {
        const paginationContainer = document.querySelector('.pagination');
        if (!paginationContainer) return;
        
        const jokesCount = totalFiltered !== undefined ? totalFiltered : this.jokes.length;
        const totalPages = Math.max(1, Math.ceil(jokesCount / this.jokesPerPage));
        if (this.currentPage > totalPages) {
            this.currentPage = totalPages;
        }
        const startIndex = (this.currentPage - 1) * this.jokesPerPage;
        const endIndex = Math.min(startIndex + this.jokesPerPage, jokesCount);
        
        // Clear existing pagination
        paginationContainer.innerHTML = '';
        
        // Add previous button
        const prevButton = document.createElement('button');
        prevButton.className = 'pagination-button';
        prevButton.innerHTML = '&laquo;';
        prevButton.disabled = this.currentPage === 1 || jokesCount === 0;
        prevButton.setAttribute('aria-label', 'Previous page');
        prevButton.addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.renderJokes();
                this.updateUrlState();
            }
        });
        paginationContainer.appendChild(prevButton);

        if (jokesCount === 0) {
            const nextButton = document.createElement('button');
            nextButton.className = 'pagination-button';
            nextButton.innerHTML = '&raquo;';
            nextButton.disabled = true;
            nextButton.setAttribute('aria-label', 'Next page');
            paginationContainer.appendChild(nextButton);

            const pageInfo = document.createElement('span');
            pageInfo.className = 'pagination-info';
            pageInfo.textContent = 'Showing 0-0 of 0 jokes';
            paginationContainer.appendChild(pageInfo);
            return;
        }
        
        // Function to add page button
        const addPageButton = (pageNum) => {
            const pageButton = document.createElement('button');
            pageButton.className = `pagination-button ${pageNum === this.currentPage ? 'active' : ''}`;
            pageButton.textContent = pageNum;
            pageButton.addEventListener('click', () => {
                this.currentPage = pageNum;
                this.renderJokes();
                this.updatePagination();
                this.updateUrlState();
            });
            paginationContainer.appendChild(pageButton);
        };

        // Function to add ellipsis
        const addEllipsis = () => {
            const ellipsis = document.createElement('span');
            ellipsis.className = 'pagination-button';
            ellipsis.textContent = '...';
            ellipsis.style.cursor = 'default';
            paginationContainer.appendChild(ellipsis);
        };

        // Logic for displaying page numbers
        if (totalPages <= 7) {
            // If 7 or fewer pages, show all
            for (let i = 1; i <= totalPages; i++) {
                addPageButton(i);
            }
        } else {
            // Always show first page
            addPageButton(1);
            
            if (this.currentPage > 3) {
                addEllipsis();
            }
            
            // Show pages around current page
            for (let i = Math.max(2, this.currentPage - 1); i <= Math.min(this.currentPage + 1, totalPages - 1); i++) {
                addPageButton(i);
            }
            
            if (this.currentPage < totalPages - 2) {
                addEllipsis();
            }
            
            // Always show last page
            if (totalPages > 1) {
                addPageButton(totalPages);
            }
        }
        
        // Add next button
        const nextButton = document.createElement('button');
        nextButton.className = 'pagination-button';
        nextButton.innerHTML = '&raquo;';
        nextButton.disabled = this.currentPage >= totalPages;
        nextButton.setAttribute('aria-label', 'Next page');
        nextButton.addEventListener('click', () => {
            if (this.currentPage < totalPages) {
                this.currentPage++;
                this.renderJokes();
                this.updateUrlState();
            }
        });
        paginationContainer.appendChild(nextButton);
        
        // Add page info
        const pageInfo = document.createElement('span');
        pageInfo.className = 'pagination-info';
        const start = jokesCount > 0 ? startIndex + 1 : 0;
        const end = endIndex;
        pageInfo.textContent = `Showing ${start}-${end} of ${jokesCount} jokes`;
        paginationContainer.appendChild(pageInfo);
    },
    
    loadMoreJokes() {
        // In a real app, this would load from an API
        // For now, we'll just show a loading state
        const loadingSentinel = document.querySelector('.scroll-sentinel');
        if (loadingSentinel) {
            loadingSentinel.innerHTML = `
                <div class="loading">
                    <div class="loading-spinner"></div>
                    <span class="loading-text">Loading more jokes...</span>
                </div>
            `;
        }

        // Simulate loading delay
        setTimeout(() => {
            const newJokes = [
                {
                    id: this.jokes.length + 1,
                    question: "Why did the developer go to the beach?",
                    answer: "To catch some waves and debug their code! 🌊",
                    category: "general",
                    likes: 0
                },
                {
                    id: this.jokes.length + 2,
                    question: "What's a programmer's favorite type of music?",
                    answer: "Heavy metal! 🤘",
                    category: "general",
                    likes: 0
                }
            ];

            this.jokes.push(...newJokes);
            this.renderJokes();
        }, 1000);
    }
};

// Initialize jokes manager on page load
document.addEventListener('DOMContentLoaded', () => {
    jokesManager.init();
});

function showLoadingState() {
    const jokesGrid = document.querySelector('.jokes-grid');
    const featuredSection = document.querySelector('.featured-jokes');
    
    // Create skeleton loading states
    const skeletonHtml = `
        <div class="loading-skeleton">
            <div class="skeleton-category"></div>
            <div class="skeleton-question"></div>
            <div class="skeleton-answer"></div>
            <div class="skeleton-actions">
                <div class="skeleton-button"></div>
                <div class="skeleton-button"></div>
            </div>
        </div>
    `;
    
    const featuredSkeletonHtml = `
        <div class="loading-skeleton featured-skeleton">
            <div class="skeleton-category"></div>
            <div class="skeleton-question"></div>
            <div class="skeleton-answer"></div>
            <div class="skeleton-actions">
                <div class="skeleton-button"></div>
                <div class="skeleton-button"></div>
            </div>
        </div>
    `;
    
    // Add loading class and skeletons
    jokesGrid.classList.add('loading');
    featuredSection.classList.add('loading');
    
    // Add multiple skeletons to simulate content
    jokesGrid.innerHTML = skeletonHtml.repeat(6);
    featuredSection.innerHTML = featuredSkeletonHtml.repeat(3);
}

function hideLoadingState() {
    const jokesGrid = document.querySelector('.jokes-grid');
    const featuredSection = document.querySelector('.featured-jokes');
    
    jokesGrid.classList.remove('loading');
    featuredSection.classList.remove('loading');
} 
