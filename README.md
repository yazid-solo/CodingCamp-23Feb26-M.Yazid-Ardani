# 🚀 Portfolio v5 — Muchamad Yazid Ardani

Website portofolio pribadi yang modern, responsif, dan futuristik. Dibangun dengan HTML, CSS, JavaScript murni, dan Tailwind CSS via CDN.

---

## ⚡ Cara Menjalankan

Tidak perlu instalasi apapun. Cukup buka `index.html` di browser favorit kamu.

**Cara paling mudah — VS Code Live Server:**
1. Instal ekstensi [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) di VS Code
2. Klik kanan `index.html` → klik **"Open with Live Server"**
3. Website akan terbuka otomatis di `http://localhost:5500`

**Cara alternatif — Python HTTP Server:**
```bash
# Python 3
python -m http.server 8000

# Buka di browser: http://localhost:8000
```

> **Penting:** Buka via server (bukan langsung double-klik `index.html`) karena file `data/projects.json` dimuat dengan `fetch()` yang membutuhkan protokol HTTP/HTTPS — tidak bisa dijalankan dari `file://` protokol karena CORS policy.

---

## 📁 Struktur Proyek

```
portfolio/
├── index.html          ← Halaman Home
├── about.html          ← Halaman About
├── projects.html       ← Halaman Projects (data dari JSON)
├── resume.html         ← Halaman Resume / Skills
├── contact.html        ← Halaman Contact
│
├── css/
│   └── styles.css      ← Design system lengkap (variabel, komponen, animasi)
│
├── js/
│   ├── theme.js        ← Dark/light toggle + accent switcher
│   ├── components.js   ← Inject navbar & footer, command palette, page transition
│   ├── animations.js   ← Three.js hero, scroll reveal, 3D tilt, parallax
│   └── main.js         ← Logika per halaman (projects render, form validasi)
│
├── data/
│   └── projects.json   ← DATA SOURCE — edit di sini untuk update proyek
│
├── assets/             ← Simpan gambar lokal, ikon, Lottie di sini
│
├── README.md           ← Dokumentasi ini
└── CREDITS.md          ← Daftar aset dan lisensinya
```

---

## ✏️ Cara Update Data & Konten

### Menambah atau Mengubah Proyek

Buka file `data/projects.json` dan tambahkan objek baru dengan format berikut:

```json
{
  "id": 7,
  "title": "Nama Proyek",
  "slug": "nama-proyek-slug",
  "category": "web",
  "description": "Deskripsi singkat (1-2 kalimat, tampil di card).",
  "longDescription": "Deskripsi panjang yang tampil di modal detail.",
  "features": [
    "Fitur 1",
    "Fitur 2"
  ],
  "tech": ["HTML", "CSS", "JavaScript"],
  "image": "https://images.unsplash.com/photo-xxxx?w=600&q=80",
  "demo": "https://link-demo.com",
  "github": "https://github.com/username/repo",
  "status": "completed",
  "year": 2024
}
```

Nilai yang valid untuk `category` adalah: `"web"`, `"ui"`, atau `"mini-apps"`. Nilai untuk `status` adalah `"completed"` atau `"in-progress"`.

### Mengubah Informasi Profil

Buka file `js/components.js` untuk mengubah nama di navbar/footer. Untuk konten halaman (bio, deskripsi skill, dll), edit langsung di file HTML yang bersangkutan — setiap section sudah diberi komentar yang jelas.

### Mengganti Foto Profil

Ganti URL `https://images.unsplash.com/...` pada gambar di `about.html` dengan path gambar lokal kamu (simpan di folder `assets/img/`), misalnya:
```html
<img src="assets/img/foto-saya.jpg" alt="Foto Yazid Ardani">
```

---

## 🎨 Cara Ganti Tema & Aksen

### Mengubah Aksen Warna Default

Buka `js/theme.js` dan ubah nilai `DEFAULT_ACCENT`:

```javascript
const DEFAULT_ACCENT = 'cyan'; // pilihan: 'indigo', 'cyan', 'emerald'
```

### Menambah Warna Aksen Baru

Dua langkah yang perlu dilakukan: pertama, tambahkan CSS variable di `css/styles.css` (ikuti pola `[data-accent="cyan"]` yang sudah ada). Kedua, tambahkan dot baru di fungsi `renderNavbar()` di `js/components.js`.

### Mengubah Font

Ganti link Google Fonts di bagian `<head>` setiap HTML file, lalu update variable `--font-display` dan `--font-body` di bagian `:root` di `css/styles.css`.

---

## 🏗️ Upgrade ke Tailwind CLI (Opsional)

Saat ini proyek menggunakan Tailwind via CDN untuk kemudahan penggunaan. Jika kamu ingin output lebih kecil dan build yang lebih profesional, ikuti langkah ini:

**1. Instal Node.js dan inisialisasi proyek:**
```bash
npm init -y
npm install -D tailwindcss
npx tailwindcss init
```

**2. Konfigurasi `tailwind.config.js`:**
```javascript
module.exports = {
  content: ["./*.html"],
  theme: { extend: {} },
  plugins: [],
}
```

**3. Buat file `css/input.css`:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**4. Jalankan build:**
```bash
npx tailwindcss -i ./css/input.css -o ./css/tailwind-output.css --watch
```

**5. Ganti** script CDN di semua HTML dengan:
```html
<link rel="stylesheet" href="css/tailwind-output.css">
```

---

## 🔌 Menyambungkan Form Contact ke Backend

Saat ini form contact menggunakan dummy handler JavaScript. Untuk mengirim email sungguhan, ada beberapa opsi:

**Opsi A — EmailJS (paling mudah, tanpa backend):**
1. Daftar di [emailjs.com](https://www.emailjs.com)
2. Buat Service dan Template
3. Di `main.js`, ganti setTimeout simulasi dengan `emailjs.send(serviceId, templateId, params)`

**Opsi B — Formspree:**
1. Daftar di [formspree.io](https://formspree.io)
2. Ganti `action` form dengan URL Formspree kamu

**Opsi C — Custom Backend:**
Ganti handler di `main.js` dengan `fetch('/api/contact', { method:'POST', body: formData })`

---

## ♿ Aksesibilitas

Website ini dibangun dengan memperhatikan aksesibilitas: semantic HTML (`<nav>`, `<main>`, `<section>`, `<article>`), ARIA labels pada elemen interaktif, keyboard navigation penuh (Tab, Enter, Escape, Arrow keys), dan menghormati `prefers-reduced-motion` (semua animasi dimatikan untuk pengguna yang membutuhkan).

---

## 📜 Lisensi

Kode proyek ini bebas digunakan untuk keperluan pribadi dan edukatif. Untuk penggunaan komersial, hubungi pemilik. Lihat `CREDITS.md` untuk lisensi aset pihak ketiga.
