# Benahin

Aplikasi untuk melaporkan dan memantau kerusakan pada fasilitas kampus.

## Teknologi
- React (Vite)
- Docker

## Docker Hub
https://hub.docker.com/r/iftitahptri/benahin

Jalankan dengan:

    docker run -p 8080:80 iftitahptri/benahin:submit-UTS

## Design Pattern

Proyek Benahin mengimplementasikan pola desain (*design pattern*) berbasis React:

### 1. Hooks Pattern
Mengelola state dan siklus hidup komponen menggunakan React Hooks bawaan:
- **`useState`**: Mengelola state lokal pada antarmuka (contoh: data form di `src/components/ReportForm.jsx`, filter dan modal di `src/pages/Admin.jsx`, serta toggle sidebar di `src/App.jsx`).
- **`useEffect`**: Menangani efek samping seperti sinkronisasi data ke `localStorage` (`src/context/ReportsProvider.jsx`, `src/context/AuthProvider.jsx`) dan event listener resize responsif (`src/App.jsx`).

### 2. Custom Hooks & Provider Pattern
Memisahkan logika bisnis dan data bersama dari komponen antarmuka agar dapat digunakan ulang (*reusable*):
- **`useReports()`** (`src/context/ReportsContext.js`): Menyediakan akses terpusat untuk data laporan, tambah laporan, pembaruan status, dan penghapusan data.
- **`useAuth()`** (`src/context/AuthContext.js`): Mengelola sesi pengguna, login/logout, serta pemisahan hak akses antara peran Pelapor dan Admin.

## Anggota Tim
- Inayah Kamila Nurman (2408107010060)
- Ifititah Putri Syahna (2408107010065)
- Brigita Hafidzah (2408107010066)
