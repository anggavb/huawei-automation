# Huawei Technical Test I Dev - Documentation & Guide

Repositori ini berisi penyelesaian teknis untuk **Huawei Technical Test I Dev**. Seluruh tugas telah diimplementasikan secara modular, efisien, dan mengikuti praktik terbaik pengembangan perangkat lunak (*software development best practices*).

---

## 📋 Daftar Isi
1. [Struktur Repositori](#-struktur-repositori)
2. [Bagian 1: Pengembangan Backend (Express.js)](#bagian-1-pengembangan-backend-expressjs)
3. [Bagian 2: Automation Testing (Cron Jobs & Cleansing)](#bagian-2-automation-testing-cron-jobs--cleansing)
4. [Bagian 3: Data Processing (SQL Queries)](#bagian-3-data-processing-sql-queries)
5. [Laporan Perbandingan & Perbaikan](#-laporan-perbandingan--perbaikan)
6. [Panduan Menjalankan Project secara Lokal](#-panduan-menjalankan-project-secara-lokal)

---

## 📁 Struktur Repositori
Berikut adalah struktur folder dan berkas utama dari penyelesaian tugas ini:
```bash
.
├── README.md                           # Dokumentasi & panduan instalasi (berkas ini)
├── Huawei Technical Test I Dev.pdf     # Berkas instruksi teknis asli
├── backend/                            # ── [Bagian 1: Pengembangan Backend]
│   ├── app.js                          # Konfigurasi Express, View Engine EJS, & Error Handling
│   ├── server.js                       # Entry point server backend
│   ├── package.json                    # Dependensi backend (Express, EJS, Swagger UI)
│   ├── controllers/
│   │   └── form.controller.js          # Controller penanganan request API form
│   ├── repository/
│   │   └── form.repository.js          # Penyimpanan data sederhana (In-Memory Array)
│   ├── routes/
│   │   └── form.routes.js              # Definisi router API & Swagger OpenAPI dokumentasi
│   ├── service/
│   │   └── form.service.js             # Logic layer pemrosesan data form
│   ├── utils/
│   │   └── response.js                 # Helper format response JSON standard
│   └── view/
│       └── index.ejs                   # Antarmuka web frontend interaktif (EJS template)
├── automation/                         # ── [Bagian 2: Automation Testing / Cron Job]
│   ├── collect_data.sh                 # Skrip Shell untuk collect data JSON ke CSV (timeout & safe-limit)
│   ├── data_cleansing.sh               # Skrip Shell untuk data cleansing (hapus file > 30 hari)
│   ├── index.js                        # Alternatif service scheduler Node.js (node-cron)
│   ├── package.json                    # Dependensi service automation Node.js
│   └── cron/                           # Folder penyimpanan hasil data collection (.csv)
└── sql/                                # ── [Bagian 3: Data Processing]
    └── data_processing.sql             # Defini tabel, seeding data, dan 5 query analisis SQL
```

---

## Bagian 1: Pengembangan Backend (Express.js)

### 🚀 Deskripsi Tugas
Membangun server Node.js sederhana menggunakan framework Express yang menyediakan:
1. Endpoint API untuk menerima data formulir (berupa JSON) dari frontend dan menyimpannya ke penyimpanan data sederhana (in-memory array).
2. Endpoint API untuk mengembalikan data yang disimpan ketika diminta oleh frontend.
3. Kriteria penilaian berfokus pada desain endpoint yang baik dan keandalan penyimpanan.

### 🛠️ Detail Implementasi
* **Arsitektur Modular:** Menggunakan arsitektur clean-code berlapis: **Routes ➔ Controller ➔ Service ➔ Repository** untuk memudahkan skalabilitas.
* **Integrasi EJS View Engine:** Menambahkan antarmuka web interaktif yang modern di path root `/` menggunakan EJS. User dapat menginput data form secara visual dan data akan masuk ke tabel secara dinamis dengan AJAX tanpa *page reload*.
* **Interactive API Documentation:** Dilengkapi dengan **Swagger UI** di path `/api-docs` untuk mempermudah testing developer lain.
* **Global Error Handler:** Menambahkan penanganan error untuk body parser JSON malformed (HTTP 400 Bad Request) dan error internal server lainnya (HTTP 500).

---

## Bagian 2: Automation Testing (Cron Jobs & Cleansing)

### 🚀 Deskripsi Tugas
1. **Data Collection:** Membuat skrip otomatis (cron job) untuk mengumpulkan data dari resource API tertentu sebanyak 3 kali sehari pada jam **08.00 WIB, 12.00 WIB, dan 15.00 WIB**. Data disimpan di path `/home/cron` (disimulasikan ke `./cron` pada local directory) dalam format berkas `cron_{date}_{hours}.csv` (contoh: `cron_12192024_15.00.csv`).
2. **Data Cleansing:** Membuat skrip terpisah untuk menghapus berkas CSV di path tersebut secara otomatis setelah berusia lebih dari sebulan (> 30 hari).

### 🛠️ Detail Implementasi
Dua pendekatan disediakan untuk fleksibilitas deployment:

#### Metode A: Native Bash Scripts (Sangat Direkomendasikan untuk Linux Server)
* **[collect_data.sh](file:///Users/anggavb/Test/huawei-test/automation/collect_data.sh):**
  * Menggunakan `curl` dengan proteksi timeout (`--connect-timeout 10` dan `--max-time 30`) agar proses tidak menggantung jika API mengalami kelambatan.
  * Mengonversi struktur JSON dari API sepak bola luar menggunakan tool `jq` langsung ke baris CSV.
  * Dilengkapi penulisan header CSV (`id,home_team_name_en,away_team_name_en,local_date`).
  * Membatasi batas maksimum row hingga 1000 baris (`head -n 1000`) sebagai antisipasi data overload.
* **[data_cleansing.sh](file:///Users/anggavb/Test/huawei-test/automation/data_cleansing.sh):**
  * Menggunakan command Linux `find` yang sangat efisien dengan parameter `-mtime +30` untuk menyaring dan menghapus berkas berusia di atas 30 hari.

> [!TIP]
> **Cara Konfigurasi di Crontab Sistem Linux:**
> Jalankan perintah `crontab -e` di terminal Linux Anda, lalu masukkan konfigurasi berikut:
> ```cron
> # Mengumpulkan data setiap pukul 08:00, 12:00, dan 15:00 WIB
> 0 8,12,15 * * * /absolute/path/to/automation/collect_data.sh
>
> # Menjalankan data cleansing setiap hari pukul 00:00 WIB
> 0 0 * * * /absolute/path/to/automation/data_cleansing.sh
> ```

#### Metode B: Node.js Cron Service (`index.js`)
Service mandiri berbasis JavaScript menggunakan library `node-cron`. Sangat cocok jika dideploy di platform yang tidak memiliki akses crontab sistem secara bebas.
* Berjalan pada timezone terkonfigurasi `Asia/Jakarta` (WIB).
* Melakukan sanitasi umur file menggunakan metrik modifikasi metadata filesystem (`stats.mtime`).

---

## Bagian 3: Data Processing (SQL Queries)

### 🚀 Deskripsi Tugas
Melakukan manipulasi dan ekstraksi analitik database dari tabel data karyawan menggunakan query SQL.

### 🛠️ Skema Tabel & Query Solusi ([data_processing.sql](file:///Users/anggavb/Test/huawei-test/sql/data_processing.sql))

1. **Pembuatan & Pengisian Tabel (DDL/DML):**
   Mendefinisikan kolom tipe data yang tepat seperti `DATE` untuk Join/Release, `FLOAT` untuk Years of Experience, dan `INT` untuk Salary.

2. **Penyelesaian Kasus Soal:**
   * **Kasus 1: Tambah Karyawan Baru (Albert)**
     ```sql
     INSERT INTO employees (Name, Position, Join_Date, Release_Date, Year_of_Experience, Salary)
     VALUES ('Albert', 'Engineer', '2024-01-24', NULL, 2.5, 50);
     ```
   * **Kasus 2: Update Gaji Posisi Engineer Menjadi $85**
     ```sql
     UPDATE employees
     SET Salary = 85
     WHERE Position = 'Engineer';
     ```
   * **Kasus 3: Hitung Total Pengeluaran Gaji Selama Tahun 2021 (Telah Diperbaiki)**
     Query ini menghitung total pengeluaran untuk semua karyawan yang **aktif bekerja** pada periode tahun 2021 (menghindari kesalahan logika yang hanya menghitung karyawan yang baru masuk di tahun 2021).
     ```sql
     SELECT SUM(Salary) AS Total_Salary_2021
     FROM employees
     WHERE Join_Date <= '2021-12-31' 
       AND (Release_Date IS NULL OR Release_Date >= '2021-01-01');
     ```
   * **Kasus 4: Tampilkan 3 Karyawan dengan Pengalaman Terlama**
     ```sql
     SELECT * FROM employees
     ORDER BY year_of_experience DESC
     LIMIT 3;
     ```
   * **Kasus 5: Subquery Karyawan Engineer dengan Pengalaman <= 3 Tahun**
     ```sql
     SELECT * 
     FROM employees 
     WHERE name IN (
         SELECT name 
         FROM employees
         WHERE position = 'Engineer' AND year_of_experience <= 3
     );
     ```

---

## 🔍 Laporan Perbandingan & Perbaikan
Berdasarkan perbandingan antara berkas soal PDF dengan repositori awal, berikut adalah perbaikan penting yang telah dilakukan:

1. **Kebenaran Logika SQL (Nomor 3):**
   * *Sebelumnya:* Filter query SQL hanya membatasi `join_date >= '2021-01-01'`. Hal ini keliru karena mengabaikan karyawan lama yang masih digaji pada tahun 2021.
   * *Perbaikan:* Query SQL di [data_processing.sql](file:///Users/anggavb/Test/huawei-test/sql/data_processing.sql) telah diperbaiki untuk mendeteksi tumpang tindih masa kerja di tahun 2021 secara akurat.
2. **Kesesuaian Tipe Data SQL:**
   * Kami memetakan tipe string format PDF (misal `8 Years` dan `$150`) ke dalam format numerik murni (`8.0` dan `150`) di dalam database agar kalkulasi aggregate seperti `SUM` dan operator matematika `<=` berfungsi dengan benar.
3. **Ketahanan Script Shell Automation (Nomor 2):**
   * Ditambahkan parameter timeout pada `curl` agar automation script tidak rentan terhadap kegagalan jaringan atau server API tujuan yang tidak merespons.
   * Menambahkan header CSV untuk validitas pembacaan berkas.
4. **Implementasi UI Web Backend (Nomor 1):**
   * Terpenuhinya catatan EJS frontend pada [app.js](file:///Users/anggavb/Test/huawei-test/backend/app.js) dan [index.ejs](file:///Users/anggavb/Test/huawei-test/backend/view/index.ejs). Penambahan error handler global JSON parser juga menjamin server tidak mendadak crash apabila menerima payload API yang rusak.

---

## 💻 Panduan Menjalankan Project secara Lokal

### 1. Prasyarat Sistem
* Node.js versi 18 atau lebih tinggi.
* Docker desktop (opsional, jika ingin menguji SQL dengan database lokal).
* Jaringan internet aktif untuk fetching API luar dan instalasi paket npm.

### 2. Setup Database PostgreSQL (Docker)
Jalankan perintah berikut untuk mengaktifkan database lokal PostgreSQL:
```bash
docker run --name db-huawei \
  -e POSTGRES_USER=huawei_test \
  -e POSTGRES_PASSWORD=secret \
  -e POSTGRES_DB=huawei_test \
  -p 5432:5432 \
  -d postgres:18.3-alpine
```
Anda dapat menjalankan query di dalam folder `/sql` menggunakan PostgreSQL client (seperti DBeaver atau command line `psql`).

### 3. Setup & Menjalankan Backend Server
1. Masuk ke folder backend:
   ```bash
   cd backend
   ```
2. Buat konfigurasi environment `.env` dari `.env.example`:
   ```bash
   cp .env.example .env
   ```
   *Isi berkas `.env` dengan `APP_PORT=3000` (atau port lain).*
3. Instal dependensi dan jalankan server:
   ```bash
   npm install
   npm run dev
   ```
4. Buka browser dan akses:
   * **Antarmuka Form Web:** `http://localhost:3000/`
   * **Dokumentasi API Swagger:** `http://localhost:3000/api-docs`

### 4. Setup & Menjalankan Node.js Cron Service
1. Masuk ke folder automation:
   ```bash
   cd automation
   ```
2. Instal dependensi dan jalankan scheduler:
   ```bash
   npm install
   npm start
   ```
   *File CSV akan otomatis di-generate ke folder `./cron` saat trigger scheduler aktif.*
