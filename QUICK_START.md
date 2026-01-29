# 🚀 Quick Start Guide - Personal Finance Tracker

## Cara Menggunakan Aplikasi

### 1️⃣ Buka Aplikasi
```
Buka file berikut di browser Anda:
d:\Personal Financial Tracker\index.html
```

**Browser yang Direkomendasikan:**
- Google Chrome
- Microsoft Edge
- Firefox
- Safari

### 2️⃣ Pertama Kali Membuka

Saat pertama kali dibuka, aplikasi akan:
- ✅ Menginisialisasi Firebase Firestore
- ✅ Membuat kategori default otomatis
- ✅ Siap digunakan dalam beberapa detik

### 3️⃣ Tambah Transaksi Pertama

1. **Klik tombol + hijau** di tengah bawah
2. Isi form:
   - Pilih **Income** atau **Expense**
   - Masukkan **jumlah** (contoh: 5000000)
   - Pilih **kategori** dari dropdown
   - Isi **deskripsi** (opsional)
   - Pilih **tanggal**
3. Klik **"Save"**
4. ✅ Dashboard akan langsung update!

### 4️⃣ Navigasi Aplikasi

**Bottom Navigation (Menu Bawah):**
- 🏠 **Home** - Dashboard dengan grafik dan statistik
- 📋 **History** - Daftar semua transaksi
- 📁 **Categories** - Kelola kategori custom
- ⚙️ **Settings** - Pengaturan aplikasi

### 5️⃣ Fitur-Fitur Utama

#### 📊 Dashboard
- **Total Balance** - Saldo keseluruhan
- **Income/Expense** - Total pemasukan dan pengeluaran
- **Line Chart** - Trend cashflow dari waktu ke waktu
- **Pie Charts** - Distribusi per kategori
- **Filter Waktu** - 1D, 1W, 1M, 3M, 1Y

#### 📝 Riwayat Transaksi
- **Filter Tanggal** - Pilih rentang tanggal
- **Edit** - Klik ikon pensil untuk edit transaksi
- **Delete** - Klik ikon tempat sampah untuk hapus
- **Grouped** - Otomatis dikelompokkan per tanggal

#### 🗂️ Kelola Kategori
- **Tambah Kategori Baru** - Input nama + pilih tipe (Income/Expense)
- **Hapus Kategori** - Klik × pada kategori yang mau dihapus
- **Kategori Default** sudah tersedia

## 📱 Tips & Trik

### Gunakan Filter Waktu
Klik tombol periode (1D, 1M, dst) untuk melihat data spesifik:
- **1D** = 1 Hari terakhir
- **1W** = 1 Minggu terakhir
- **1M** = 1 Bulan terakhir
- **3M** = 3 Bulan terakhir
- **1Y** = 1 Tahun terakhir

### Edit Transaksi Cepat
- Klik ikon **pensil** di samping transaksi
- Modal akan terbuka dengan data yang sudah terisi
- Ubah yang perlu, lalu klik **"Update"**

### Kategori Custom
Buat kategori sesuai kebutuhan:
- **Income**: Bonus, Side Hustle, Dividen, dll
- **Expense**: Subscription Netflix, Kopi, Parkir, dll

### Filter Riwayat
Gunakan filter tanggal untuk:
- Lihat transaksi bulan lalu
- Analisa spending per minggu
- Cek income bulanan

## 🎨 Kategori Default yang Sudah Ada

### 💰 Income (Pemasukan)
- Salary (Gaji)
- Freelance
- Investments (Investasi)
- Business
- Gift (Hadiah)

### 💸 Expense (Pengeluaran)
- Groceries (Belanja Bulanan)
- Rent (Sewa/KPR)
- Transport
- Utilities (Listrik, Air, dll)
- Entertainment (Hiburan)
- Healthcare (Kesehatan)
- Shopping
- Food & Dining (Makan)
- Education (Pendidikan)

## 🔧 Troubleshooting

### Aplikasi Tidak Muncul?
- Pastikan koneksi internet aktif (untuk Firebase)
- Buka di browser modern (Chrome/Edge/Firefox)
- Cek Console (F12) untuk error messages

### Data Tidak Tersimpan?
- Periksa koneksi internet
- Cek Firebase Console apakah data masuk
- Pastikan semua field diisi dengan benar

### Chart Tidak Muncul?
- Tambahkan beberapa transaksi dulu
- Pilih periode waktu yang tepat
- Refresh halaman (F5)

## 📚 Struktur Data

### Lokasi Data
Semua data disimpan di **Firebase Firestore** secara real-time:
- Collection `categories` - Menyimpan semua kategori
- Collection `transactions` - Menyimpan semua transaksi

### Akses Firebase Console
Untuk melihat data langsung:
1. Buka: https://console.firebase.google.com/
2. Pilih project: `personal-finance-tracker-f603e`
3. Klik **Firestore Database**

## 🎯 Best Practices

1. **Konsisten Input Data** - Catat transaksi setiap hari
2. **Gunakan Kategori yang Jelas** - Buat kategori spesifik untuk tracking yang lebih baik
3. **Review Berkala** - Cek dashboard setiap minggu/bulan
4. **Manfaatkan Filter** - Analisa spending pattern dengan filter waktu
5. **Edit Jika Salah** - Jangan hapus, edit saja jika ada kesalahan input

## 🚀 Selamat Menggunakan!

Aplikasi Personal Finance Tracker siap membantu Anda mengelola keuangan dengan lebih baik!

**Fitur yang sudah aktif:**
- ✅ Realtime sync dengan Firebase
- ✅ Dynamic charts dengan Chart.js
- ✅ Custom categories
- ✅ Edit & Delete transactions
- ✅ Date filtering
- ✅ Responsive design
- ✅ SPA navigation

**Mulai track keuangan Anda sekarang!** 💪💰
