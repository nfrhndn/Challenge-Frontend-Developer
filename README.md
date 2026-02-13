# 🧠 QuizMania

<div align="center">

**Aplikasi Kuis Interaktif** — Uji pengetahuanmu dengan soal-soal dari berbagai kategori!

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vite.dev/)

</div>

---

## ✨ Fitur Utama

| Fitur                        | Deskripsi                                                                   |
| ---------------------------- | --------------------------------------------------------------------------- |
| 🔐 **Login**                 | Masukkan nama untuk memulai sesi kuis                                       |
| ⚙️ **Pengaturan Kuis**       | Pilih tingkat kesulitan, jumlah soal, dan batas waktu                       |
| ⏱️ **Timer Interaktif**      | Timer lingkaran SVG yang berubah warna (hijau → kuning → merah)             |
| 📊 **Progress Tracking**     | Tampilkan soal ke-N dari total & jumlah yang sudah dijawab                  |
| 🎯 **Satu Soal per Halaman** | Langsung pindah ke soal berikutnya setelah menjawab                         |
| 📋 **Halaman Hasil**         | Skor persentase, statistik benar/salah/dilewati, dan review jawaban         |
| 💾 **Resume Kuis**           | Tutup browser → buka lagi → lanjutkan dari soal terakhir via `localStorage` |
| 🎨 **UI Modern**             | Glassmorphism, animasi smooth, dark theme premium                           |

## 🛠️ Tech Stack

| Teknologi         | Kegunaan                                   |
| ----------------- | ------------------------------------------ |
| **React 19**      | Library UI utama                           |
| **TypeScript**    | Type-safe development                      |
| **Zustand**       | State management + persist ke localStorage |
| **React Router**  | Navigasi antar halaman                     |
| **Framer Motion** | Animasi & transisi halus                   |
| **Tailwind CSS**  | Utility-first styling                      |
| **Axios**         | HTTP client untuk API                      |
| **Lucide React**  | Icon library                               |
| **Vite**          | Build tool & dev server                    |

## 📡 API

Soal diambil dari [Open Trivia Database](https://opentdb.com/) — database gratis berisi ribuan soal trivia dari berbagai kategori.

## 🚀 Cara Menjalankan

### Prasyarat

- **Node.js** versi 18 atau lebih baru
- **npm** atau **yarn**

### Langkah-langkah

```bash
# 1. Clone repository
git clone https://github.com/nfrhndn/Challenge-Frontend-Developer.git

# 2. Masuk ke direktori project
cd Challenge-Frontend-Developer

# 3. Install dependencies
npm install

# 4. Jalankan dalam mode development
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173`

## 📁 Struktur Project

```
src/
├── components/
│   ├── ui/               # Komponen UI dasar (Button, Input)
│   └── QuestionCard.tsx   # Kartu soal dengan pilihan jawaban
├── pages/
│   ├── Welcome.tsx        # Halaman login
│   ├── Setup.tsx          # Pengaturan kuis
│   ├── Quiz.tsx           # Halaman mengerjakan kuis
│   └── Results.tsx        # Halaman hasil & review jawaban
├── services/
│   └── api.ts             # Fetch soal dari OpenTDB API
├── store/
│   └── quizStore.ts       # State management (Zustand + persist)
├── lib/
│   └── utils.ts           # Utility functions
├── App.tsx                # Routing utama
└── main.tsx               # Entry point
```

## 🔄 Alur Aplikasi

```
Login (/) → Atur Kuis (/setup) → Kerjakan Kuis (/quiz) → Hasil (/results)
                ↑                                              │
                └──────────── Main Lagi ───────────────────────┘
```

- **Main Lagi** → kembali ke pengaturan kuis (nama tetap tersimpan)
- **Logout** → kembali ke halaman login (data direset)
- **Tutup browser** → buka lagi → **resume otomatis** dari soal terakhir

## 📝 Scripts

| Perintah          | Fungsi                 |
| ----------------- | ---------------------- |
| `npm run dev`     | Jalankan dev server    |
| `npm run build`   | Build untuk production |
| `npm run preview` | Preview hasil build    |
| `npm run lint`    | Cek kode dengan ESLint |

---

<div align="center">

Dibuat dengan ❤️ menggunakan **React + TypeScript**

</div>
