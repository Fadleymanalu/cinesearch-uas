/**
 * Class untuk menangani penyimpanan lokal (Local Storage)
 * Mengimplementasikan Browser API: Local Storage
 */
export class StorageManager {
    constructor() {
        this.SEARCH_HISTORY_KEY = 'movieSearchHistory';
        this.TOTAL_SEARCHES_KEY = 'totalSearches';
        this.MAX_HISTORY_ITEMS = 10;
    }

    /**
     * Menyimpan query pencarian ke riwayat
     * @param {string} query - Query pencarian
     */
    saveSearch(query) {
        if (!query || query.trim() === '') return;

        // Ambil riwayat yang ada
        let history = this.getSearchHistory();
        
        // Hapus duplikat
        history = history.filter(item => item.toLowerCase() !== query.toLowerCase());
        
        // Tambahkan ke awal array
        history.unshift(query.trim());
        
        // Batasi jumlah item
        if (history.length > this.MAX_HISTORY_ITEMS) {
            history = history.slice(0, this.MAX_HISTORY_ITEMS);
        }
        
        // Simpan ke Local Storage
        localStorage.setItem(this.SEARCH_HISTORY_KEY, JSON.stringify(history));
        
        // Update total pencarian
        this.incrementTotalSearches();
    }

    /**
     * Mendapatkan riwayat pencarian
     * @returns {Array} - Array riwayat pencarian
     */
    getSearchHistory() {
        const history = localStorage.getItem(this.SEARCH_HISTORY_KEY);
        return history ? JSON.parse(history) : [];
    }

    /**
     * Menghapus riwayat pencarian
     */
    clearSearchHistory() {
        localStorage.removeItem(this.SEARCH_HISTORY_KEY);
        return [];
    }

    /**
     * Menambah jumlah total pencarian
     */
    incrementTotalSearches() {
        let total = parseInt(localStorage.getItem(this.TOTAL_SEARCHES_KEY)) || 0;
        total++;
        localStorage.setItem(this.TOTAL_SEARCHES_KEY, total.toString());
        return total;
    }

    /**
     * Mendapatkan jumlah total pencarian
     * @returns {number} - Total pencarian
     */
    getTotalSearches() {
        return parseInt(localStorage.getItem(this.TOTAL_SEARCHES_KEY)) || 0;
    }

    /**
     * Menyimpan data sementara ke session storage
     * @param {string} key - Kunci penyimpanan
     * @param {any} data - Data yang akan disimpan
     */
    saveToSession(key, data) {
        try {
            sessionStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving to session storage:', error);
        }
    }

    /**
     * Mengambil data dari session storage
     * @param {string} key - Kunci penyimpanan
     * @returns {any} - Data yang diambil
     */
    getFromSession(key) {
        try {
            const data = sessionStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error getting from session storage:', error);
            return null;
        }
    }
}