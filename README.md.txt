CineSearch - Aplikasi Pencarian Film Interaktif

Aplikasi web untuk pencarian film menggunakan OMDb API. Dibuat sebagai proyek UAS mata kuliah Pengembangan Aplikasi Berbasis Web.

 Fitur Utama

- Pencarian Film Real-time - Menggunakan OMDb API
- UI Modern & Responsif - Mendukung tema gelap/terang
- Mobile Friendly - Responsif di semua perangkat
- Riwayat Pencarian - Disimpan di Local Storage
- Performance Optimized - Menggunakan ES6 Modules dan async/await
- Detail Film Lengkap - Rating, plot, aktor, dll.

 Teknologi yang Digunakan

- Frontend: HTML5, CSS3 (Grid & Flexbox), JavaScript ES6+
- API: OMDb API (The Open Movie Database)
- Architecture: Object-Oriented Programming (OOP)
- Modules: ES6 Modules (import/export)
- Storage: Browser Local Storage API
- Icons: Font Awesome 6
- Fonts: Google Fonts (Poppins & Inter)

Struktur Folder
movie-search-app/
├── index.html # Halaman utama
├── style.css # Styling aplikasi
├── js/
│ ├── main.js # Entry point aplikasi
│ ├── ApiService.js # Class untuk API calls
│ ├── UIManager.js # Class untuk UI management
│ └── StorageManager.js # Class untuk Local Storage
└── README.md # Dokumentasi ini

 Cara Menjalankan

Opsi 1: Menggunakan Live Server (Rekomendasi)
1. Install ekstensi "Live Server" di VS Code
2. Buka folder proyek di VS Code
3. Klik kanan pada `index.html` → "Open with Live Server"
4. Aplikasi akan terbuka di browser

Opsi 2: Menggunakan Serve Static
1. Pastikan Node.js terinstal
2. Install http-server: `npm install -g http-server`
3. Jalankan: `http-server .`
4. Buka `http://localhost:8080`

Opsi 3: Membuka Langsung
1. Buka file `index.html` langsung di browser
2. Catatan: Beberapa fitur mungkin terbatas karena CORS

Instalasi dan Konfigurasi

1. Clone Repository
bash
git clone https://github.com/username/movie-search-app.git

cd movie-search-app
