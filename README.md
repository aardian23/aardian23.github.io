# Portfolio Website — Ardian Rahman

Website portofolio modern, bersih, dan interaktif yang dibangun secara khusus sesuai kebutuhan desain tanpa menggunakan template kaku berbasis AI.

---

## ✨ Fitur Utama & Konsep Desain

1. **Hybrid Background (Light & Dark Mode)**:
   - **Light Mode**: Nuansa *Clean White & iPhone 14 Basic Blue* (`#f5f8fc`, `#edf3f9`, `#1d68bd`) yang lembut, segar, dan berkelas.
   - **Dark Mode**: Nuansa *Hitam agak Keputihan* (*Monochrome Gradient Depth* dengan *silvery mist* dan *subtle noise*), bebas dari kesan warna neon murahan khas template AI generik.
   - **Persistence**: Pilihan tema tersimpan otomatis di `localStorage` dan mendeteksi preferensi sistem.

2. **Transparent Navbar & Interaktif**:
   - Tampilan *frosted glass* transparan (`backdrop-filter: blur(20px)`).
   - Efek border halus dan bayangan elegan saat halaman digulir (*scroll*).
   - Indikator menu aktif otomatis mengikuti posisi layar (*ScrollSpy*).

3. **Hamburger Menu Beranimasi & Interaktif**:
   - Ikon hamburger 3 baris yang bertransformasi mulus menjadi silang ('X') saat ditekan.
   - *Slide-in mobile drawer* dengan latar belakang blur dan animasi bertingkat (*staggered animation*).

4. **Home Section — ID Card Menggantung & Interaktif (Lanyard 3D Physics)**:
   - Konsep tali lanyard fleksibel dengan gantungan logam (*metal swivel clasp*).
   - **Fisika Ayunan Nyata (*Spring Physics*)**: Kartu dapat diseret (*drag*) dengan kursor atau sentuhan layar dan akan berayun secara alami saat dilepas.
   - **Efek Pantulan Holografik (*Dynamic Glare*)**: Cahaya berkilau di atas kartu mengikuti sudut kursor pengguna.
   - **Balik Kartu (3D Flip)**: Tombol interaktif untuk membalik kartu ke sisi belakang (menampilkan pita magnetik, tanda tangan, dan detail sertifikasi).

5. **Layout Non-Generic (Anti-AI Card Grid)**:
   - **About Section**: Mengusung tata letak editorial majalah dengan tipografi tebal, kutipan bermakna, garis pemisah minimalis, dan prinsip kerja.
   - **Technologi**: Menggunakan *interactive filter tabs* (Frontend, Backend, Tools & DevOps) serta *marquee flow strip* yang dinamis.
   - **Sertifikasi**: Katalog kredensial profesional berpenanggalan dengan jendela modal interaktif untuk memverifikasi kredensial.

---

## 🚀 Cara Menjalankan Website

### Opsi 1: Buka Langsung di Browser
Klik dua kali file `index.html` pada File Explorer, atau klik kanan lalu pilih **Open with > Google Chrome / Microsoft Edge**.

### Opsi 2: Menggunakan Live Server / Local Server
Jika menggunakan VS Code, instal ekstensi **Live Server**, lalu klik kanan pada `index.html` dan pilih **Open with Live Server**.

Atau melalui terminal/PowerShell di direktori ini:
```powershell
# Menggunakan Python:
python -m http.server 3000

# Atau menggunakan Node.js (npx):
npx serve .
```
Lalu buka `http://localhost:3000` di peramban Anda.

---

## 📁 Struktur File
```text
myweb1-ardianrahman/
├── index.html        # Struktur semantik HTML5, meta tag, modal, & konten
├── style.css         # Styling modern, variabel CSS Hybrid Theme, & animasi 3D
├── script.js         # Logika interaktif fisika lanyard ID Card, hamburger, & filter
└── README.md         # Dokumentasi & panduan pengguna
```
