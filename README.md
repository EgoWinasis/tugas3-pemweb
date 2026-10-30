# SITTA — Tugas Praktik 3 Vue.js

Aplikasi simulasi pengelolaan stok bahan ajar dan tracking Delivery Order menggunakan Vue.js 2.7. Tampilan menggunakan tema utama hijau.

## Menjalankan aplikasi

Aplikasi harus dijalankan melalui web server lokal (jangan membuka `index.html` langsung dengan `file://`) karena data dan template dibaca menggunakan `fetch()`.

### Cara 1 — VS Code Live Server
1. Ekstrak ZIP.
2. Buka folder `tugas3-vue-ut` di Visual Studio Code.
3. Pasang ekstensi **Live Server** jika belum tersedia.
4. Klik kanan `index.html`, pilih **Open with Live Server**.

### Cara 2 — Python
1. Buka terminal pada folder proyek.
2. Jalankan `python -m http.server 5500`.
3. Buka `http://localhost:5500` di browser.

## Struktur folder

```text
tugas3-vue-ut/
├── index.html
├── assets/css/style.css
├── data/dataBahanAjar.json
├── js/app.js
├── js/services/api.js
├── js/components/
└── templates/
```

## Perbaikan pemuatan template

`api.js` mengambil setiap file template dan membungkus isinya dalam elemen `script` bertipe `text/x-template` dengan ID yang sesuai, misalnya `tpl-stock-table`. Vue baru menampilkan komponen setelah semua template dan data berhasil dimuat.

## Fitur

- Daftar dan pencarian stok bahan ajar.
- Filter UPBJJ, kategori, dan kondisi stok (aman, menipis, kosong, perlu reorder).
- Pengurutan judul, stok, dan harga.
- Tambah, edit, hapus data stok dengan validasi.
- Catatan HTML pada indikator status.
- Pencarian tracking berdasarkan nomor DO atau NIM.
- Pembuatan nomor DO otomatis dan penambahan riwayat perjalanan.

## Catatan

Data awal dibaca dari `data/dataBahanAjar.json`. Perubahan selama aplikasi berjalan disimpan sementara di memori browser dan akan kembali ke data awal ketika halaman dimuat ulang. Untuk penyimpanan permanen dibutuhkan backend atau database.


## Login aplikasi
Aplikasi menampilkan halaman login sebelum dashboard dapat digunakan.

- Username: `egowinasis@ut.ac.id`
- Password: `053062337`

Gunakan tombol **Keluar** pada bagian kanan atas untuk mengakhiri sesi. Status login disimpan pada `sessionStorage` selama sesi tab browser.

**Catatan keamanan:** autentikasi ini dibuat untuk simulasi/tugas praktik dan validasi kredensial berada di JavaScript sisi browser. Untuk penggunaan nyata, autentikasi harus dipindahkan ke backend dengan password yang di-hash dan sesi/token yang aman.
# tugas3-pemweb
