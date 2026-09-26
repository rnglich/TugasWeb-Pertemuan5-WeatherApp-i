# 🌤️ Weather App — Tugas Rutin 5

Repositori ini memuat implementasi **Tugas Rutin 5: Weather App** pada mata kuliah **Pemrograman Web**. Aplikasi ini dibangun menggunakan JavaScript modern (ES6+) yang mengintegrasikan **OpenWeatherMap API** secara asinkron (`async/await` & `Fetch API`) untuk menyajikan informasi cuaca terkini secara real-time, lengkap dengan penanganan galat (*error handling*), indikator status pemuatan (*loading state*), manipulasi data menggunakan metode array, serta antarmuka yang sepenuhnya responsif.

---

## 🔗 Live Demo & Repositori

- **Demo Aplikasi (GitHub Pages):** 
https://rnglich.github.io/TugasWeb-Pertemuan5-WeatherApp-i/
- **Repositori GitHub:**
https://github.com/rnglich/TugasWeb-Pertemuan5-WeatherApp-i

---

## 🛠️ Pemenuhan Requirements Tugas

Proyek ini telah memenuhi seluruh 8 persyaratan utama beserta fitur bonus:

### 1. Standar JavaScript ES6+ Modern
- Deklarasi variabel konsisten menggunakan `const` dan `let` (tanpa kata kunci lama `var`).
- Penulisan fungsi modular menggunakan sintaks *Arrow Functions* (`const getWeatherData = async () => { ... }`).
- Konstruksi elemen dinamis dan penyisipan string menggunakan *Template Literals* (`` `${data.name}` ``).
- Penggunaan *Object Destructuring* untuk ekstraksi properti payload API secara bersih.

### 2. Komunikasi Data Asinkron (`async/await` + `Fetch API`)
- Mengambil data ramalan cuaca melalui protokol HTTP Fetch API dengan sintaksis `async/await` modern di dalam blok `try...catch` untuk alur eksekusi yang rapi dan terstruktur.

### 3. Informasi Cuaca Lengkap
Aplikasi menampilkan parameter cuaca esensial yang diterima dari API:
- **Nama Kota & Negara:** Menampilkan lokasi hasil pencarian.
- **Suhu Saat Ini:** Nilai temperatur terkini dengan konversi metrik.
- **Deskripsi Cuaca:** Keterangan kondisi cuaca (misal: *broken clouds*, *light rain*, *clear sky*).
- **Ikon Cuaca:** Ikon resmi dari OpenWeatherMap yang sesuai dengan kondisi cuaca aktual.
- **Tingkat Kelembaban:** Persentase kelembaban udara (*humidity percentage*).

### 4. Error Handling: Kota Tidak Ditemukan (404)
- Melakukan pengecekan respons API (`response.status === 404`).
- Jika kota tidak terdaftar atau terdapat salah ketik (*typo*), aplikasi menampilkan pesan peringatan visual yang informatif (*user-friendly alert/toast*) tanpa menyebabkan aplikasi mogok (*crash*).

### 5. Error Handling: Gangguan Jaringan (Network Error)
- Menangkap kegagalan jaringan atau ketiadaan koneksi internet pengguna melalui blok `catch (error)`.
- Menyajikan status koneksi terputus dan saran untuk memeriksa jaringan data/WiFi.

### 6. Indikator Loading State
- Menampilkan animasi pemuatan (*loading spinner / skeleton placeholder*) tepat saat proses *fetching* berlangsung.
- Menyembunyikan indikator loading secara otomatis setelah data berhasil diterima atau ketika galat tertangkap.

### 7. Penggunaan Minimal 1 Metode Array (`map`, `filter`, `reduce`)
- Menggunakan `map()` untuk mengiterasi riwayat pencarian kota ke dalam elemen tombol pintasan (*history chips*).
- Menggunakan `filter()` pada data prakiraan cuaca 5 hari (*5-day forecast*) untuk menyaring sampel waktu tertentu (misal: jam 12:00 siang setiap harinya).

### 8. Desain UI Responsif (Mobile-Friendly)
- Mengadopsi tata letak fleksibel (Flexbox & CSS Grid) yang menyesuaikan tampilan dengan nyaman pada perangkat layar ponsel pintar (*smartphone*), tablet, hingga monitor desktop.

### ⭐ Fitur Bonus yang Diimplementasikan
- **Riwayat Pencarian (LocalStorage):** Menyimpan daftar nama kota yang terakhir dicari pengguna sehingga tetap tersimpan meskipun peramban dimuat ulang.
- **Toggle Konversi Satuan Suhu (°C / °F):** Tombol pengubah unit satuan temperatur antara Celcius dan Fahrenheit secara instan.
- **Prakiraan Cuaca 5 Hari (5-Day Forecast):** Panel kartu ramalan cuaca multi-hari ke depan.

---

## 📋 Checklist Persyaratan Tugas

| No | Kriteria Persyaratan | Status | Keterangan Implementasi |
|:--:|:---------------------|:------:|:------------------------|
| 1 | Gunakan ES6+ (`const`, arrow function, template literals) | ✅ Terpenuhi | Sintaks ES6+ penuh di seluruh berkas JavaScript |
| 2 | `async/await` + `Fetch API` | ✅ Terpenuhi | Pemanggilan endpoint OpenWeatherMap secara asinkron |
| 3 | Tampilkan kota, suhu, deskripsi, ikon, kelembaban | ✅ Terpenuhi | Seluruh parameter cuaca utama tersaji lengkap pada kartu cuaca |
| 4 | Error handling: kota tidak ditemukan (404) | ✅ Terpenuhi | Notifikasi peringatan saat nama kota tidak valid |
| 5 | Error handling: network error | ✅ Terpenuhi | Menangani kondisi offline / gagal koneksi ke server API |
| 6 | Loading state saat fetch data | ✅ Terpenuhi | Indikator spinner aktif selama proses pemuatan data |
| 7 | Minimal 1 array method (`map`/`filter`/`reduce`) | ✅ Terpenuhi | Pemanfaatan `map()` dan `filter()` pada data riwayat & forecast |
| 8 | UI responsif (*mobile-friendly*) | ✅ Terpenuhi | Tampilan optimal di layar mobile, tablet, dan desktop |
| ⭐ | **Bonus 1:** Riwayat Pencarian (`LocalStorage`) | ✅ Terpenuhi | Penyimpanan riwayat pencarian lokal |
| ⭐ | **Bonus 2:** Toggle Satuan Suhu (°C / °F) | ✅ Terpenuhi | Sakelar pengubah satuan derajat temperatur |
| ⭐ | **Bonus 3:** Prakiraan Cuaca 5 Hari (*Forecast*) | ✅ Terpenuhi | Kartu prediksi cuaca harian tambahan |

---
