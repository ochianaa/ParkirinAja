# 🚗 ParkirinAja

![Docker](https://img.shields.io/badge/Docker-Container-blue?logo=docker&logoColor=white)
![Status](https://img.shields.io/badge/Status-Active-success)

**ParkirinAja** adalah solusi modern untuk manajemen parkir yang efisien, dirancang untuk memudahkan pengguna dalam mencari, membooking, dan membayar slot parkir secara digital.

---

## 👥 Anggota Kelompok

Tim pengembang di balik proyek ini:

| No | Nama Lengkap | NIM |
| :--: | :--- | :--- |
| 1. | **Dewa Kadek Arie Yudha** | 42130093 |
| 2. | **Dimas Rangga Marshandika** | 42230046 |
| 3. | **Ni Made Ochiana Septhi Pratiwi** | 42230027 |
| 4. | **Vella Puspitasari Wijayanti** | 42230043 |

---

## 🎯 Tema Aplikasi

> **"Aplikasi Manajemen Parkir Otomatis"**

Aplikasi ini berfokus pada efisiensi waktu dan kemudahan akses dalam pengelolaan lahan parkir di area perkotaan atau gedung komersial.

---

## 📝 Deskripsi Proyek

ParkirinAja adalah sebuah aplikasi web yang membantu pengguna menemukan, memesan, dan mengelola tempat parkir dengan mudah, cepat, dan aman. 

Aplikasi ini dirancang untuk menyelesaikan dua masalah utama:
1.  **Bagi Pengguna:** Kesulitan mencari slot parkir kosong secara manual.
2.  **Bagi Pengelola:** Kesulitan memantau okupansi lahan parkir secara real-time.

### Fitur Unggulan:
* ✅ **Reservasi Mudah:** Booking slot parkir sebelum tiba di lokasi.
* ✅ **Real-time Monitoring:** Melihat ketersediaan slot secara langsung.
* ✅ **Transaksi Efisien:** Mengelola pembayaran dan riwayat parkir dengan transparan.

---

## 🚀 Instruksi Menjalankan Proyek

Aplikasi ini dikemas menggunakan teknologi containerization agar mudah dijalankan di berbagai lingkungan.

### Prasyarat
Pastikan perangkat Anda telah terinstal:
* [Docker](https://www.docker.com/)
* [Docker Compose](https://docs.docker.com/compose/)

### Langkah Instalasi

1.  **Clone Repository**
    Unduh kode sumber ke komputer lokal Anda:
    ```bash
    git clone [https://github.com/ochianaa/ParkirinAja.git](https://github.com/ochianaa/ParkirinAja.git)
    cd ParkirinAja
    ```

2.  **Siapkan Environment (.env)**
    Gunakan referensi `./.env.example` untuk membuat file `.env`:
    ```bash
    cp .env.example .env
    ```
    Lalu sesuaikan nilai minimal berikut:
    ```env
    POSTGRES_USER=postgres
    POSTGRES_PASSWORD=postgres
    POSTGRES_DB=parkirinaja_db
    POSTGRES_PORT=5432
    PORT=8080
    JWT_SECRET="your-super-secret-jwt-key-here"

    AUTH_SERVICE_URL=http://auth-service:3001
    GARAGE_SERVICE_URL=http://garage-service:3002
    BOOKING_SERVICE_URL=http://booking-service:3003
    ```
    Opsional: tambahkan `JWT_EXPIRES_IN` (mis. `24h`) bila diperlukan oleh Auth Service.

3.  **Jalankan Aplikasi**
    Gunakan Docker Compose untuk membangun dan menjalankan service:
    ```bash
    docker compose up
    ```
    *(Tambahkan flag `-d` jika ingin menjalankannya di latar belakang / background mode)*:
    ```bash
    docker compose up -d
    ```

4.  **Akses Aplikasi**
    Setelah proses selesai, akses layanan sesuai konfigurasi `docker-compose.yml`:
    - API Gateway to all service: `http://localhost:8080`
    - Frontend: `http://localhost:3000` (lihat catatan port di compose)


5.  **Menghentikan Aplikasi**
    Untuk mematikan container:
    ```bash
    docker compose down
    ```

---


<p align="center">
  Made with ❤️ by ParkirinAja Team
</p>
