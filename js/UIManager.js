/**
 * Class untuk menangani semua manipulasi DOM dan UI
 * Menggunakan prinsip Unobtrusive JavaScript
 */
export class UIManager {
    constructor() {
        // Cache DOM elements
        this.elements = {
            searchInput: document.getElementById('searchInput'),
            searchButton: document.getElementById('searchButton'),
            searchHistory: document.getElementById('searchHistory'),
            clearHistory: document.getElementById('clearHistory'),
            moviesGrid: document.getElementById('moviesGrid'),
            loadingIndicator: document.getElementById('loadingIndicator'),
            errorContainer: document.getElementById('errorContainer'),
            errorTitle: document.getElementById('errorTitle'),
            errorMessage: document.getElementById('errorMessage'),
            retryButton: document.getElementById('retryButton'),
            noResults: document.getElementById('noResults'),
            resultsTitle: document.getElementById('resultsTitle'),
            resultsCount: document.getElementById('resultsCount'),
            movieModal: document.getElementById('movieModal'),
            modalTitle: document.getElementById('modalTitle'),
            modalBody: document.getElementById('modalBody'),
            closeModal: document.getElementById('closeModal'),
            themeToggle: document.getElementById('themeToggle'),
            totalSearches: document.getElementById('totalSearches')
        };

        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(this.currentTheme);
        this.bindEvents();
    }

    /**
     * Bind semua event listeners
     */
    bindEvents() {
        // Search events
        this.elements.searchButton.addEventListener('click', () => this.triggerSearch());
        this.elements.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.triggerSearch();
        });

        // Retry button
        this.elements.retryButton.addEventListener('click', () => {
            this.hideError();
            this.triggerSearch();
        });

        // Modal close
        this.elements.closeModal.addEventListener('click', () => this.closeMovieModal());

        // Click outside modal to close
        this.elements.movieModal.addEventListener('click', (e) => {
            if (e.target === this.elements.movieModal) {
                this.closeMovieModal();
            }
        });

        // Theme toggle
        this.elements.themeToggle.addEventListener('click', () => this.toggleTheme());

        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.elements.movieModal.classList.contains('hidden')) {
                this.closeMovieModal();
            }
        });
    }

    /**
     * Memicu proses pencarian
     */
    triggerSearch() {
        const query = this.elements.searchInput.value.trim();
        if (query) {
            // Event custom untuk komunikasi dengan main.js
            const searchEvent = new CustomEvent('searchMovies', { 
                detail: { query } 
            });
            document.dispatchEvent(searchEvent);
        }
    }

    /**
     * Menampilkan loading indicator
     */
    showLoading() {
        this.elements.loadingIndicator.classList.remove('hidden');
        this.elements.moviesGrid.innerHTML = '';
        this.elements.noResults.classList.add('hidden');
        this.elements.errorContainer.classList.add('hidden');
    }

    /**
     * Menyembunyikan loading indicator
     */
    hideLoading() {
        this.elements.loadingIndicator.classList.add('hidden');
    }

    /**
     * Menampilkan error message
     * @param {string} title - Judul error
     * @param {string} message - Pesan error
     */
    showError(title, message) {
        this.elements.errorTitle.textContent = title;
        this.elements.errorMessage.textContent = message;
        this.elements.errorContainer.classList.remove('hidden');
    }

    /**
     * Menyembunyikan error message
     */
    hideError() {
        this.elements.errorContainer.classList.add('hidden');
    }

    /**
     * Render daftar film ke grid
     * @param {Array} movies - Array film
     */
    renderMovies(movies, query = '') {
        this.elements.moviesGrid.innerHTML = '';
        
        if (!movies || movies.length === 0) {
            this.elements.noResults.classList.remove('hidden');
            this.elements.resultsCount.textContent = '0';
            this.elements.resultsTitle.textContent = query ? `Hasil untuk "${query}"` : 'Film Populer';
            return;
        }

        this.elements.noResults.classList.add('hidden');
        this.elements.resultsCount.textContent = movies.length;
        this.elements.resultsTitle.textContent = query ? `Hasil untuk "${query}"` : 'Film Populer';

        movies.forEach(movie => {
            const movieCard = this.createMovieCard(movie);
            this.elements.moviesGrid.appendChild(movieCard);
        });
    }

    /**
     * Membuat elemen kartu film
     * @param {Object} movie - Data film
     * @returns {HTMLElement} - Elemen kartu film
     */
createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.dataset.id = movie.imdbID;

    // Handle poster URL - perbaiki dari data API
    let poster = '';
    if (movie.Poster && movie.Poster !== 'N/A') {
        poster = movie.Poster;
    } else {
        // Fallback ke placeholder dengan gradient menarik
        const colors = ['4361ee', '3a0ca3', 'f72585', '4cc9f0'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        poster = `https://via.placeholder.com/300x450/${color}/ffffff?text=${encodeURIComponent(movie.Title.substring(0, 20))}`;
    }
    
    // Format tahun (ambil 4 digit pertama)
    const year = movie.Year ? movie.Year.substring(0, 4) : 'N/A';
    
    // Rating dari API (jika ada)
    const rating = movie.imdbRating ? 
        `<div class="movie-rating">
            <i class="fas fa-star"></i>
            <span>${movie.imdbRating}/10</span>
        </div>` : 
        `<div class="movie-rating">
            <i class="fas fa-film"></i>
            <span>${movie.Type}</span>
        </div>`;

    card.innerHTML = `
        <div class="poster-container">
            <img src="${poster}" alt="${movie.Title}" class="movie-poster" 
                 onerror="this.src='https://via.placeholder.com/300x450/4361ee/ffffff?text=Poster+Not+Available'">
            <div class="poster-overlay">
                <i class="fas fa-play-circle"></i>
            </div>
        </div>
        <div class="movie-info">
            <h3 class="movie-title" title="${movie.Title}">${movie.Title}</h3>
            <div class="movie-meta">
                <span class="movie-year">
                    <i class="far fa-calendar"></i> ${year}
                </span>
                <span class="movie-runtime">
                    <i class="far fa-clock"></i> ${movie.Runtime || 'N/A'}
                </span>
            </div>
            <span class="movie-genre">
                <i class="fas fa-tags"></i> ${movie.Genre ? movie.Genre.split(',').slice(0, 2).join(', ') : 'N/A'}
            </span>
            ${rating}
        </div>
    `;

    // Event listener untuk membuka modal
    card.addEventListener('click', () => {
        const detailEvent = new CustomEvent('showMovieDetails', {
            detail: { id: movie.imdbID }
        });
        document.dispatchEvent(detailEvent);
    });

    return card;
}

    /**
     * Memperbarui riwayat pencarian
     * @param {Array} history - Array riwayat pencarian
     */
    updateSearchHistory(history) {
        this.elements.searchHistory.innerHTML = '';
        
        history.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            li.addEventListener('click', () => {
                this.elements.searchInput.value = item;
                this.triggerSearch();
            });
            this.elements.searchHistory.appendChild(li);
        });
    }

    /**
     * Menampilkan modal detail film
     * @param {Object} movie - Data detail film
     */
    showMovieDetails(movie) {
    this.elements.modalTitle.textContent = movie.Title;
    
    // Handle poster
    let poster = '';
    if (movie.Poster && movie.Poster !== 'N/A') {
        poster = movie.Poster;
    } else {
        poster = 'https://via.placeholder.com/400x600/4361ee/ffffff?text=No+Poster+Available';
    }
    
    // Format ratings dari API
    const ratingsHtml = movie.Ratings ? 
        movie.Ratings.map(rating => {
            let value = rating.Value;
            // Format nilai rating
            if (rating.Source === 'Internet Movie Database') {
                value = value.replace('/', '<small>/10</small>');
            } else if (rating.Source === 'Rotten Tomatoes') {
                value = value.replace('%', '<small>%</small>');
            }
            return `
                <div class="rating-item">
                    <div class="rating-source">${rating.Source}</div>
                    <div class="rating-value">${value}</div>
                </div>
            `;
        }).join('') : 
        `<div class="rating-item">
            <div class="rating-source">IMDb</div>
            <div class="rating-value">${movie.imdbRating || 'N/A'}<small>/10</small></div>
        </div>`;
    
    // Format box office
    const boxOffice = movie.BoxOffice ? 
        `<span class="detail-item">
            <i class="fas fa-money-bill-wave"></i> 
            <strong>Box Office:</strong> ${movie.BoxOffice}
        </span>` : '';
    
    // Format awards
    const awards = movie.Awards && movie.Awards !== 'N/A' ?
        `<span class="detail-item">
            <i class="fas fa-trophy"></i> 
            <strong>Awards:</strong> ${movie.Awards}
        </span>` : '';
    
    this.elements.modalBody.innerHTML = `
        <div class="movie-details">
            <div class="detail-poster-container">
                <img src="${poster}" alt="${movie.Title}" class="detail-poster" 
                     onerror="this.src='https://via.placeholder.com/400x600/4361ee/ffffff?text=Poster+Error'">
            </div>
            <div class="detail-info">
                <div class="detail-header">
                    <h2>${movie.Title} <span class="year">(${movie.Year})</span></h2>
                    <div class="detail-subtitle">
                        <span class="rated">${movie.Rated || 'Not Rated'}</span>
                        <span class="runtime"><i class="far fa-clock"></i> ${movie.Runtime || 'N/A'}</span>
                        <span class="language"><i class="fas fa-globe"></i> ${movie.Language || 'N/A'}</span>
                    </div>
                </div>
                
                <div class="ratings-section">
                    <h3><i class="fas fa-star"></i> Ratings</h3>
                    <div class="ratings">
                        ${ratingsHtml}
                    </div>
                </div>
                
                <div class="plot-section">
                    <h3><i class="fas fa-book-open"></i> Plot</h3>
                    <p class="detail-plot">${movie.Plot || 'Plot not available.'}</p>
                </div>
                
                <div class="details-grid">
                    <div class="detail-group">
                        <h4><i class="fas fa-user"></i> Director</h4>
                        <p>${movie.Director || 'N/A'}</p>
                    </div>
                    <div class="detail-group">
                        <h4><i class="fas fa-users"></i> Writers</h4>
                        <p>${movie.Writer ? movie.Writer.split(',').slice(0, 3).join(', ') : 'N/A'}</p>
                    </div>
                    <div class="detail-group">
                        <h4><i class="fas fa-user-friends"></i> Actors</h4>
                        <p>${movie.Actors ? movie.Actors.split(',').slice(0, 5).join(', ') : 'N/A'}</p>
                    </div>
                    <div class="detail-group">
                        <h4><i class="fas fa-tags"></i> Genre</h4>
                        <p>${movie.Genre || 'N/A'}</p>
                    </div>
                </div>
                
                <div class="additional-info">
                    <h3><i class="fas fa-info-circle"></i> Additional Information</h3>
                    <div class="info-items">
                        ${boxOffice}
                        ${awards}
                        <span class="detail-item">
                            <i class="fas fa-map-marker-alt"></i> 
                            <strong>Country:</strong> ${movie.Country || 'N/A'}
                        </span>
                        <span class="detail-item">
                            <i class="fas fa-desktop"></i> 
                            <strong>Website:</strong> ${movie.Website && movie.Website !== 'N/A' ? 
                                `<a href="${movie.Website}" target="_blank">Official Site</a>` : 'N/A'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    this.elements.movieModal.classList.remove('hidden');
}

    /**
     * Menutup modal detail film
     */
    closeMovieModal() {
        this.elements.movieModal.classList.add('hidden');
    }

    /**
     * Memperbarui statistik pencarian
     * @param {number} count - Jumlah total pencarian
     */
    updateSearchStats(count) {
        this.elements.totalSearches.textContent = count;
    }

    /**
     * Toggle tema gelap/terang
     */
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
        
        // Update icon
        const icon = this.elements.themeToggle.querySelector('i');
        icon.className = this.currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }

    /**
     * Mengatur tema
     * @param {string} theme - 'light' atau 'dark'
     */
    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
    }
}