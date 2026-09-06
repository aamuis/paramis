# Panduan: Menyambungkan Website Paramis ke Database Supabase

Kode di project ini sudah diubah supaya semua data (konten CMS, campaign
donasi, transaksi, relawan, laporan kegiatan, foto/logo yang diupload, dsb)
tersimpan permanen di database Supabase — bukan lagi di `localStorage`
browser seperti sebelumnya.

## 1. Buat project & tabel di Supabase

1. Buka [supabase.com](https://supabase.com) → buat project baru (atau pakai yang sudah ada).
2. Masuk ke **SQL Editor** → **New query**.
3. Copy-paste seluruh isi file `supabase/schema.sql` dari project ini → klik **Run**.
   Ini akan membuat 9 tabel (`cms_config`, `services`, `campaigns`, `transactions`,
   `volunteers`, `reports`, `email_logs`, `submissions`, `legal_articles`).

## 2. Ambil kunci API

Di dashboard Supabase: **Project Settings > API**, salin:
- **Project URL**
- **anon public key**

## 3. Isi environment variable

Di file `.env` (copy dari `.env.example`), isi:

```
VITE_SUPABASE_URL="https://xxxxxxxxxxxx.supabase.co"
VITE_SUPABASE_ANON_KEY="isi-dengan-anon-public-key-anda"
```

Kalau deploy di **Vercel**: buka Project Settings > Environment Variables,
tambahkan dua variabel di atas untuk environment Production (dan Preview
kalau perlu), lalu redeploy.

## 4. Jalankan / deploy seperti biasa

```
npm install
npm run dev      # untuk coba lokal
npm run build    # untuk build produksi (dipakai Vercel otomatis)
```

Saat pertama kali dijalankan dengan database yang masih kosong, aplikasi
otomatis mengisi Supabase dengan data bawaan (default) yang sebelumnya ada
di kode — supaya website tidak tampil kosong.

## 5. Pindahkan data yang SUDAH ada di website lama (opsional tapi penting)

Kalau situs Anda yang sedang online sekarang (`paramis.vercel.app`) sudah
punya campaign, konfigurasi, atau data lain yang diketik lewat panel admin,
data itu masih tersimpan di localStorage browser admin — belum ada di
Supabase. Untuk memindahkannya:

1. Buka situs **lama** (yang belum pakai Supabase) → masuk sebagai admin →
   menu pengaturan/editor file website → klik **Unduh Cadangan / Export**.
   Ini akan mengunduh file `paramis-website-backup-....json`.
2. Deploy versi baru (yang sudah tersambung Supabase) ke Vercel.
3. Buka situs yang baru → masuk sebagai admin → menu yang sama → **Import** →
   pilih file backup tadi.
4. Data akan otomatis dikirim ke Supabase. Setelah itu, semua device yang
   membuka situs akan melihat data yang sama.

## 6. Catatan keamanan (penting untuk yayasan yang mengelola donasi)

Saat ini akses admin masih berupa PIN/kode di sisi browser (client-side),
bukan sistem login Supabase Auth. Supaya fitur admin yang sudah ada tetap
langsung berfungsi tanpa harus menulis ulang, policy database (Row Level
Security) yang dibuat di `schema.sql` bersifat terbuka: siapa pun yang
membawa `anon key` (yang memang publik ada di kode frontend) secara teknis
bisa memanggil API Supabase langsung.

Ini wajar untuk tahap awal / MVP, tapi untuk situs donasi produksi
sebaiknya ditingkatkan lagi dengan:
- Mengaktifkan **Supabase Auth** untuk login admin.
- Mengganti policy RLS supaya INSERT/UPDATE/DELETE hanya boleh dilakukan
  oleh user yang sudah login sebagai admin (bukan `using (true)` seperti
  sekarang).

Ini bisa dikerjakan sebagai tahap lanjutan kapan pun Anda siap — beri tahu
saya kalau mau saya bantu sekalian.

## 7. Soal foto/gambar

Untuk saat ini, foto (logo, QRIS, cover campaign, dsb) yang diupload lewat
panel admin tetap disimpan sebagai teks base64 di dalam kolom `data` (JSONB)
di Postgres — supaya semua form upload yang sudah ada di kode tidak perlu
diubah. Ini sudah cukup untuk menjaga foto tidak hilang dan tersinkron ke
database.

Untuk skala lebih besar (banyak foto beresolusi tinggi), langkah lanjutan
yang disarankan adalah memindahkan foto ke **Supabase Storage** (bucket
khusus file) supaya database tetap ringan dan loading gambar lebih cepat.
Ini juga bisa dikerjakan sebagai peningkatan berikutnya.
