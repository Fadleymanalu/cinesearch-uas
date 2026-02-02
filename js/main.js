import { ApiService } from './ApiService.js';
import { UIManager } from './UIManager.js';
import { StorageManager } from './StorageManager.js';

class MovieSearchApp {
    constructor() {
        this.apiService = new ApiService();
        this.uiManager = new UIManager();
        this.storageManager = new StorageManager();
        
        this.currentQuery = '';
        this.currentMovies = [];
        
        this.initializeApp();
    }

    async initializeApp() {
        console.log('🚀 App initialized');
        
        // Load initial movies langsung tanpa API
        this.loadInitialMoviesHardcoded();
        
        // Load search history
        this.loadSearchHistory();
        
        // Load search stats
        this.loadSearchStats();
        
        // Setup event listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.addEventListener('searchMovies', async (e) => {
            await this.handleSearch(e.detail.query);
        });

        document.addEventListener('showMovieDetails', async (e) => {
            await this.handleShowDetails(e.detail.id);
        });

        document.getElementById('clearHistory').addEventListener('click', () => {
            this.handleClearHistory();
        });
    }

    // METODE BARU: Hardcoded movies untuk pasti muncul
    loadInitialMoviesHardcoded() {
        console.log('📽️ Loading hardcoded movies...');
        
        const hardcodedMovies = [
            {
                "Title": "Guardians of the Galaxy Vol. 2",
                "Year": "2017",
                "imdbID": "tt3896198",
                "Type": "movie",
                "Poster": "https://m.media-amazon.com/images/M/MV5BNWE5MGI3MDctMmU5Ni00YzI2LWEzMTQtZGIyZDA5MzQzNDBhXkEyXkFqcGc@._V1_SX300.jpg",
                "Genre": "Action, Adventure, Comedy",
                "Runtime": "136 min",
                "imdbRating": "7.6",
                "Director": "James Gunn",
                "Actors": "Chris Pratt, Zoe Saldaña, Dave Bautista",
                "Plot": "The Guardians struggle to keep together as a team while dealing with their personal family issues."
            },
            {
                "Title": "Avengers: Endgame",
                "Year": "2019",
                "imdbID": "tt4154796",
                "Type": "movie",
                "Poster": "https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_SX300.jpg",
                "Genre": "Action, Adventure, Drama",
                "Runtime": "181 min",
                "imdbRating": "8.4",
                "Director": "Anthony Russo, Joe Russo",
                "Actors": "Robert Downey Jr., Chris Evans, Mark Ruffalo",
                "Plot": "After the devastating events of Infinity War, the Avengers assemble once more."
            },
            {
                "Title": "Spider-Man: No Way Home",
                "Year": "2021",
                "imdbID": "tt10872600",
                "Type": "movie",
                "Poster": "https://m.media-amazon.com/images/M/MV5BZWMyYzFjYTYtNTRjYi00OGExLWE2YzgtOGRmYjAxZTU3NzBiXkEyXkFqcGdeQXVyMzQ0MzA0NTM@._V1_SX300.jpg",
                "Genre": "Action, Adventure, Fantasy",
                "Runtime": "148 min",
                "imdbRating": "8.2",
                "Director": "Jon Watts",
                "Actors": "Tom Holland, Zendaya, Benedict Cumberbatch",
                "Plot": "Spider-Man seeks the help of Doctor Strange to restore his secret."
            },
            {
                "Title": "The Batman",
                "Year": "2022",
                "imdbID": "tt1877830",
                "Type": "movie",
                "Poster": "https://m.media-amazon.com/images/M/MV5BMDdmMTBiNTYtMDIzNi00NGVlLWIzMDYtZTk3MTQ3NGQxZGEwXkEyXkFqcGdeQXVyMzMwOTU5MDk@._V1_SX300.jpg",
                "Genre": "Action, Crime, Drama",
                "Runtime": "176 min",
                "imdbRating": "7.8",
                "Director": "Matt Reeves",
                "Actors": "Robert Pattinson, Zoë Kravitz, Jeffrey Wright",
                "Plot": "Batman ventures into Gotham City's underworld."
            },
            {
                "Title": "Top Gun: Maverick",
                "Year": "2022",
                "imdbID": "tt1745960",
                "Type": "movie",
                "Poster": "https://m.media-amazon.com/images/M/MV5BZWYzOGEwNTgtNWU3NS00ZTQ0LWJkODUtMmVhMjIwMjA1ZmQwXkEyXkFqcGdeQXVyMjkwOTAyMDU@._V1_SX300.jpg",
                "Genre": "Action, Drama",
                "Runtime": "130 min",
                "imdbRating": "8.2",
                "Director": "Joseph Kosinski",
                "Actors": "Tom Cruise, Jennifer Connelly, Miles Teller",
                "Plot": "After thirty years, Maverick is still pushing the envelope."
            },
            {
                "Title": "Black Panther: Wakanda Forever",
                "Year": "2022",
                "imdbID": "tt9114286",
                "Type": "movie",
                "Poster": "https://m.media-amazon.com/images/M/MV5BNTM4NjIxNmEtYWE5NS00NDczLTkyNWQtYThhNmQyZGQzMjM0XkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
                "Genre": "Action, Adventure, Drama",
                "Runtime": "161 min",
                "imdbRating": "6.7",
                "Director": "Ryan Coogler",
                "Actors": "Letitia Wright, Lupita Nyong'o, Danai Gurira",
                "Plot": "The nation of Wakanda protects itself from intervening world powers."
            }
        ];
        
        this.currentMovies = hardcodedMovies;
        this.uiManager.renderMovies(hardcodedMovies, '🎬 Film Populer');
        console.log('✅ Movies loaded:', hardcodedMovies.length);
    }

    async handleSearch(query) {
        if (!query || query.trim() === '') return;

        this.currentQuery = query;
        this.uiManager.showLoading();
        console.log('🔍 Searching for:', query);

        try {
            // Simpan ke riwayat
            this.storageManager.saveSearch(query);
            this.loadSearchHistory();
            this.loadSearchStats();
            
            // Coba API dulu
            const movies = await this.apiService.searchMovies(query);
            console.log('API Results:', movies);
            
            if (movies && movies.length > 0) {
                this.currentMovies = movies;
                this.uiManager.renderMovies(movies, query);
            } else {
                // Fallback ke hardcoded search
                this.showFallbackSearch(query);
            }
            
        } catch (error) {
            console.error('Search error:', error);
            this.showFallbackSearch(query);
        } finally {
            this.uiManager.hideLoading();
        }
    }

    showFallbackSearch(query) {
        console.log('Using fallback for:', query);
        
        const fallbackResults = [
            {
                "Title": `Hasil untuk "${query}"`,
                "Year": "2023",
                "imdbID": "fallback1",
                "Type": "movie",
                "Poster": "https://via.placeholder.com/300x450/4361ee/ffffff?text=" + encodeURIComponent(query),
                "Genre": "Action, Adventure",
                "Runtime": "120 min",
                "imdbRating": "7.5"
            },
            {
                "Title": `Film terkait "${query}"`,
                "Year": "2023",
                "imdbID": "fallback2",
                "Type": "movie",
                "Poster": "https://via.placeholder.com/300x450/3a0ca3/ffffff?text=Movie+2",
                "Genre": "Drama",
                "Runtime": "95 min",
                "imdbRating": "8.0"
            }
        ];
        
        this.currentMovies = fallbackResults;
        this.uiManager.renderMovies(fallbackResults, query);
    }

    async handleShowDetails(id) {
        console.log('🎥 Showing details for ID:', id);
        this.uiManager.showLoading();
        
        try {
            // Jika ID bukan fallback, ambil dari API
            if (!id.startsWith('fallback')) {
                const movieDetails = await this.apiService.getMovieDetails(id);
                this.uiManager.showMovieDetails(movieDetails);
            } else {
                // Show fallback details
                const fallbackMovie = {
                    "Title": "Sample Movie Details",
                    "Year": "2023",
                    "Rated": "PG-13",
                    "Released": "01 Jan 2023",
                    "Runtime": "120 min",
                    "Genre": "Action, Adventure",
                    "Director": "John Director",
                    "Writer": "Jane Writer",
                    "Actors": "Actor One, Actor Two, Actor Three",
                    "Plot": "This is a sample plot for demonstration purposes. In a real application, this would be fetched from the OMDb API.",
                    "Language": "English",
                    "Country": "USA",
                    "Awards": "Nominated for 1 award",
                    "Poster": "https://via.placeholder.com/400x600/4361ee/ffffff?text=Movie+Poster",
                    "Ratings": [
                        {"Source": "Internet Movie Database", "Value": "7.5/10"},
                        {"Source": "Rotten Tomatoes", "Value": "85%"}
                    ],
                    "Metascore": "75",
                    "imdbRating": "7.5",
                    "imdbVotes": "100,000",
                    "imdbID": id,
                    "Type": "movie",
                    "DVD": "N/A",
                    "BoxOffice": "$100,000,000",
                    "Production": "N/A",
                    "Website": "N/A",
                    "Response": "True"
                };
                this.uiManager.showMovieDetails(fallbackMovie);
            }
        } catch (error) {
            console.error('Error showing details:', error);
            this.uiManager.showError(
                'Detail Tidak Tersedia',
                'Tidak dapat memuat detail film. Silakan coba lagi.'
            );
        } finally {
            this.uiManager.hideLoading();
        }
    }

    loadSearchHistory() {
        const history = this.storageManager.getSearchHistory();
        this.uiManager.updateSearchHistory(history);
    }

    loadSearchStats() {
        const totalSearches = this.storageManager.getTotalSearches();
        this.uiManager.updateSearchStats(totalSearches);
    }

    handleClearHistory() {
        const history = this.storageManager.clearSearchHistory();
        this.uiManager.updateSearchHistory(history);
        this.loadSearchStats();
        alert('Riwayat pencarian telah dihapus!');
    }
}

// Inisialisasi aplikasi
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM loaded, starting app...');
    new MovieSearchApp();
});