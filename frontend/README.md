# 🍍 SIGANAS Frontend (React + Vite)

Web dashboard untuk **Sistem Informasi Grading Nanas Subang**. Terhubung
langsung ke backend FastAPI (`nanas-grading-backend`).

## Stack

- React 19 + Vite
- Tailwind CSS v4
- React Router v6
- Axios (+ interceptor JWT otomatis)

## Fitur yang sudah dibuat

- **Login & Register** — sesuai desain, terhubung ke `POST /api/v1/auth/login` dan `/register`
- **Auth Context** — simpan JWT di localStorage, auto-logout kalau token expired (401)
- **Protected Routes** — halaman dashboard hanya bisa diakses setelah login
- **Dashboard per role** — menu sidebar menyesuaikan role user (petani, pengepul, eksportir, pabrik, dinas_pertanian)
- **Kebun** — petani bisa lihat & tambah data kebun (untuk traceability)
- **Batch Panen** — buat batch, lihat daftar, detail batch
- **Scan Grading** — upload foto nanas -> panggil `/grading/{batch_id}/scan` -> tampilkan hasil YOLO + DSS (grade, rekomendasi pasar, estimasi harga)
- **QR Code** — tampilkan QR code traceability per batch
- **Verifikasi Blockchain** — cek integritas data batch (`/batches/{id}/verify`)
- **Laporan (Dinas Pertanian)** — ringkasan, rekap per lokasi, rekap per petani, termasuk food loss %
- **Halaman Traceability Publik** — `/public/trace/:kodeBatch`, TANPA LOGIN, ini yang dibuka saat QR code kemasan di-scan pembeli/eksportir

## Menjalankan

### 1. Pastikan backend FastAPI sudah jalan

```bash
# di folder backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Install & jalankan frontend

```bash
npm install
npm run dev
```

Buka **http://localhost:3000**

> Saat development, request ke `/api/*` dan `/public/*` otomatis diteruskan
> (proxy) ke `http://localhost:8000` oleh Vite — lihat `vite.config.js`.
> Tidak perlu setting CORS tambahan di backend untuk kebutuhan development.

### 3. Build untuk production

```bash
npm run build
```

Untuk production, set `VITE_API_BASE_URL` di `.env` mengarah ke domain
backend FastAPI kamu yang sebenarnya (karena tidak ada proxy Vite dev server
di production), contoh:

```
VITE_API_BASE_URL=https://api.siganas.example.com
```

Pastikan juga `ALLOWED_ORIGINS` di `.env` backend FastAPI mengizinkan domain
frontend production kamu (lihat `app/core/config.py` backend).

## Akun demo (dari `docs/schema.sql` backend)

| Username | Password | Role |
|---|---|---|
| dinas_admin | admin123 | dinas_pertanian |
| petani_demo | petani123 | petani |
| pengepul_demo | pengepul123 | pengepul |

## Struktur

```
src/
├── api/            # semua pemanggilan ke FastAPI (axios)
├── context/        # AuthContext (JWT, user state)
├── routes/         # ProtectedRoute
├── components/     # DashboardLayout (sidebar)
└── pages/          # LoginPage, RegisterPage, DashboardHome,
                     # KebunPage, BatchesPage, BatchDetailPage,
                     # ReportsPage, PublicTracePage
```

## Catatan

- Field `no_hp` dan role user disesuaikan dengan enum di backend
  (`petani`, `pengepul`, `eksportir`, `pabrik`, `dinas_pertanian`).
- Endpoint QR code (`/batches/{id}/qrcode`) butuh header Authorization,
  jadi diambil sebagai blob lalu dibuat object URL — bukan dipakai
  langsung sebagai `src` di tag `<img>`.
