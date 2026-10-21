# PuslatTrack

Aplikasi digital absensi dan monitoring program latihan atlet pada **Pusat Latihan Kota (Puslatkot) & KONI**.

PuslatTrack Replacing pencatatan manual dengan sistem terpadu: absensi berbasis foto geotagging + timestamp, kalkulasi durasi latihan otomatis, distribusi program latihan dari pelatih, dan dashboard monitoring untuk Puslatkot/KONI.

---

## Daftar Isi

- [Fitur Utama](#fitur-utama)
- [Peran Pengguna](#peran-pengguna)
- [Teknologi](#teknologi)
- [Menjalankan Secara Lokal](#menjalankan-secara-lokal)
- [Setup Supabase](#setup-supabase)
- [Deploy ke Vercel](#deploy-ke-vercel)
- [Push ke GitHub](#push-ke-github)
- [Struktur Proyek](#struktur-proyek)
- [Catatan Keamanan Data](#catatan-keamanan-data)

---

## Fitur Utama

| Fitur | Keterangan |
|---|---|
| **Login & Akun Pengguna** | Autentikasi berbasis peran (atlet, pelatih, admin) menggunakan Supabase Auth. |
| **Absensi Atlet** | Foto langsung dari kamera + koordinat GPS + waktu otomatis (dua sesi: mulai & selesai). |
| **Riwayat Absensi** | Daftar sesi latihan beserta tanggal, waktu, durasi, dan bukti foto. |
| **Pencatatan Durasi Latihan** | Durasi dihitung otomatis dari selisih waktu mulai – selesai. |
| **Program Latihan** | Pelatih mengunggah program latihan; atlet dapat melihatnya berdasarkan cabor. |
| **Monitoring Aktivitas Atlet** | Pelatih memantau kehadiran & durasi atlet binaannya. |
| **Monitoring KONI** | Dasbor eksekutif: grafik per cabor, rekap per atlet, total jam latihan. |
| **Rekapitulasi Data** | Rekap jumlah sesi, durasi, dan hari aktif per atlet maupun per cabor. |
| **Kelola Pengguna & Cabor** | Admin mengelola akun pengguna, peran, cabor, dan koordinat area latihan. |

## Peran Pengguna

| Pengguna | Fungsi |
|---|---|
| **Atlet** | Absensi, melihat riwayat & durasi latihan, melihat program latihan. |
| **Pelatih** | Mengelola program latihan, melihat absensi, memantau aktivitas atlet binaannya. |
| **Puslatkot / KONI** | Melihat data aktivitas latihan, monitoring, dan evaluasi. |
| **Admin / Pengelola** | Mengelola data pengguna, cabang olahraga, dan konfigurasi aplikasi. |

## Teknologi

- **Next.js 16** (App Router, Turbopack, TypeScript)
- **Tailwind CSS v4**
- **Supabase** (PostgreSQL + Auth + Storage + Row Level Security)
- **React 19**, `lucide-react` (ikon), `recharts` (grafik), `date-fns`

## Menjalankan Secara Lokal

```bash
npm install
cp .env.example .env.local   # Windows: copy .env.example .env.local
npm run dev
```

Buka http://localhost:3000

Perintah lain:

```bash
npm run build   # build produksi
npm run start   # jalankan hasil build
npm run lint    # ESLint
npx tsc --noEmit  # cek tipe
```

## Setup Supabase

1. Buat project di [supabase.com](https://supabase.com).
2. Buka **SQL Editor**, jalankan `supabase/schema.sql` (membuat tabel, view, RLS, trigger, dan storage bucket).
3. Jalankan `supabase/seed.sql` untuk mengisi master cabang olahraga.
4. Salin kredensial dari **Project Settings → API** ke `.env.local`:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   SUPABASE_SERVICE_ROLE_KEY=eyJ...      # hanya untuk server
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

5. **Authentication → Providers → Email**: untuk ease of use saat demo, matikan
   *Confirm email* (atau biarkan aktif, akun harus diverifikasi lewat email dulu).
6. **Storage**: bucket `absensi-foto` sudah dibuat oleh `schema.sql` (public).

### Membuat akun admin pertama

Buat akun lewat menu **Register** (peran atlet/pelatih), lalu ubah peran di
**Authentication → Users**, atau jalankan SQL berikut:

```sql
update public.profiles set role = 'admin' where nama = 'Nama Anda';
```

## Deploy ke Vercel

1. Push kode ke GitHub (lihat bagian berikut).
2. Login ke [vercel.com](https://vercel.com) → **Add New → Project** → import repository `puslattrack`.
3. Framework preset: **Next.js** (deteksi otomatis).
4. Tambahkan **Environment Variables** (Production & Preview):

   | Key | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxx.supabase.co` |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` |
   | `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` |
   | `NEXT_PUBLIC_SITE_URL` | `https://puslattrack.vercel.app` |

5. Klik **Deploy**..afterwards, tambahkan URL Vercel ke
   **Supabase → Authentication → URL Configuration → Redirect URLs**:
   `https://<nama-proyek>.vercel.app/**`

## Push ke GitHub

```bash
git init
git add .
git commit -m "feat: implementasi aplikasi PuslatTrack"
git branch -M main
git remote add origin https://github.com/Floreandini08/puslattrack.git
git push -u origin main
```

> **Penting:** `.env.local` sudah masuk `.gitignore` sehingga kredensial Supabase
> tidak ikut ter-*commit*.

## Struktur Proyek

```
puslattrack/
├─ public/                  # aset statis
├─ supabase/
│  ├─ schema.sql            # tabel, view, RLS, trigger, storage bucket
│  └─ seed.sql              # data awal cabang olahraga
├─ src/
│  ├─ app/
│  │  ├─ page.tsx           # landing page (berbasis desain puslat.html)
│  │  ├─ (auth)/            # login & register
│  │  └─ dashboard/         # area aplikasi (butuh login)
│  │     ├─ absensi/        # absensi atlet (kamera + GPS)
│  │     ├─ riwayat/        # riwayat latihan atlet
│  │     ├─ program/        # program latihan (atlet & pelatih)
│  │     ├─ atlet/          # monitoring atlet (pelatih)
│  │     ├─ monitor/        # monitoring KONI (admin)
│  │     ├─ pengguna/       # kelola pengguna (admin)
│  │     ├─ cabor/          # kelola cabor (admin)
│  │     ├─ profil/         # profil & keamanan akun
│  │     └─ actions.ts      # server actions (mutasi data)
│  ├─ components/           # komponen UI (landing, dashboard, absensi, ui)
│  ├─ lib/                  # supabase client, auth, types, utils
│  └─ proxy.ts              # proteksi rute (Next 16: proxy, bukan middleware)
```

## Catatan Keamanan Data

- Seluruh tabel mengaktifkan **Row Level Security** (RLS) Supabase.
- Atlet hanya dapat mengakses data miliknya sendiri.
- Pelatih hanya dapat melihat data atlet pada cabor yang ia bina.
- Data monitoring penuh hanya untuk peran admin.
- `SUPABASE_SERVICE_ROLE_KEY` hanya dipakai di sisi server (server action admin)
  dan **tidak pernah** dikirim ke browser.
- Foto absensi disimpan pada bucket `absensi-foto` dengan path berawalan `id-atlet/`.

---

© 2026 PuslatTrack — Kelompok 1 Kelas 2025B, Program Studi S1 Manajemen Olahraga,
Fakultas Ilmu Keelatran dan Kesehatan, Universitas Negeri Surabaya.
