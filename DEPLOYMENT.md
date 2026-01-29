# 🚀 Panduan Deploy ke GitHub

Berikut adalah langkah-langkah untuk meng-upload update website ini ke GitHub dan men-deploy-nya.

## 1️⃣ Persiapan Folder (Local)

Folder project Anda saat ini ada di:
`d:\Personal Financial Tracker\`

Pastikan semua file sudah tersimpan.

## 2️⃣ Upload ke GitHub

Buka terminal (Command Prompt / PowerShell) di folder project, lalu jalankan perintah berikut satu per satu:

### A. Inisialisasi Git (Jika belum)
```bash
git init
```

### B. Simpan Perubahan (Commit)
```bash
git add .
git commit -m "feat: major update ui, responsive grid, dynamic charts, and financial setup"
```

### C. Hubungkan ke Repository GitHub
1. Buka [GitHub.com](https://github.com) dan buat repository baru (New Repository).
2. Beri nama, misal: `personal-finance-tracker`.
3. Jangan centang "Initialize with README".
4. Copy URL repository HTTPS-nya (contoh: `https://github.com/username/repo-name.git`).

Kembali ke terminal, jalankan:
```bash
git branch -M main
git remote add origin https://github.com/USERNAME/NAMAREPO.git
# Ganti URL di atas dengan URL repository Anda
```

### D. Push (Upload)
```bash
git push -u origin main
```

---

## 3️⃣ Deploy ke Firebase Hosting (Update Live Website)

Karena Anda sudah punya website yang live (`personal-finance-tracker-f603e.web.app`), Anda tinggal jalankan update saja:

```bash
firebase deploy
```

Tunggu proses upload selesai. Setelah sukses, website live Anda akan otomatis ter-update dengan tampilan dan fitur baru yang kita buat!

---

## 4️⃣ Catatan Penting Soal Saldo

Saat ini **Total Balance** Anda mungkin terlihat **Minus (-Rp 257.356)**.
Ini **BUKAN BUG**, melainkan karena hitungan murni transaksi dari Database:
- **Total Pemasukan:** Rp 3.478.200
- **Total Pengeluaran:** Rp 3.735.556
- **Selisih:** -Rp 257.356 (Defisit)

Agar saldo sesuai dengan realita (Rp 2.077.005), Anda **WAJIB** memasukkan Saldo Awal:
1. Buka Web yang sudah di-deploy.
2. Masuk ke menu **Settings**.
3. Di kotak **Financial Setup**, isi Saldo Awal.
   - Perhitungannya: `Target Saldo` - `Saldo Saat Ini`
   - `2.077.005` - `(-257.356)` = **2.334.361**
   - Jadi masukkan angka **2334361**.
4. Klik **Save Balance**.
5. Total Balance di Dashboard otomatis akan jadi **Rp 2.077.005**.

Selamat mencoba! 🚀
