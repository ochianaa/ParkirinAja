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

2.  **Jalankan Aplikasi**
    Gunakan Docker Compose untuk membangun dan menjalankan service:
    ```bash
    docker compose up
    ```
    *(Tambahkan flag `-d` jika ingin menjalankannya di latar belakang / background mode)*:
    ```bash
    docker compose up -d
    ```

3.  **Akses Aplikasi**
    Setelah proses selesai, aplikasi dapat diakses melalui browser sesuai port yang dikonfigurasi di `docker-compose.yml` (biasanya `http://localhost:80` atau `http://localhost:3000`).

4.  **Menghentikan Aplikasi**
    Untuk mematikan container:
    ```bash
    docker compose down
    ```

---


<p align="center">
  Made with ❤️ by ParkirinAja Team
</p>
