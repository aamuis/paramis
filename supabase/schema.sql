-- =====================================================================
-- PARAMIS FOUNDATION - Supabase Database Schema
-- Jalankan seluruh file ini sekali di: Supabase Dashboard > SQL Editor > New query > Run
-- =====================================================================

-- Konfigurasi CMS (satu baris saja, id selalu 'main')
create table if not exists public.cms_config (
  id text primary key default 'main',
  data jsonb not null,
  updated_at timestamptz not null default now()
);

-- Layanan / program unggulan
create table if not exists public.services (
  id text primary key,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Campaign / program donasi
create table if not exists public.campaigns (
  id text primary key,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Transaksi donasi
create table if not exists public.transactions (
  id text primary key,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Pendaftar relawan
create table if not exists public.volunteers (
  id text primary key,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Laporan kegiatan sosial
create table if not exists public.reports (
  id text primary key,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Log notifikasi email
create table if not exists public.email_logs (
  id text primary key,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Pengajuan galang dana dari pengunjung
create table if not exists public.submissions (
  id text primary key,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Artikel legal / syarat & ketentuan
create table if not exists public.legal_articles (
  id text primary key,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =====================================================================
-- Row Level Security
--
-- CATATAN PENTING: Panel admin di aplikasi ini saat ini hanya dilindungi
-- oleh kode PIN/password di sisi BROWSER (client-side), bukan oleh sistem
-- login Supabase Auth. Karena itu, policy di bawah ini dibuat permisif
-- (baca & tulis boleh lewat anon key) supaya fitur admin yang sudah ada
-- tetap berfungsi tanpa perlu menulis ulang seluruh sistem login.
--
-- Konsekuensinya: siapa pun yang tahu VITE_SUPABASE_URL & ANON_KEY (yang
-- memang publik di frontend) secara teknis bisa memanggil API Supabase
-- langsung dan mengubah data tanpa lewat PIN admin. Untuk yayasan yang
-- mengelola donasi sungguhan, sangat disarankan upgrade ke Supabase Auth
-- + policy yang membatasi INSERT/UPDATE/DELETE hanya untuk user yang
-- sudah login sebagai admin. Ini bisa dikerjakan sebagai tahap berikutnya.
-- =====================================================================

alter table public.cms_config enable row level security;
alter table public.services enable row level security;
alter table public.campaigns enable row level security;
alter table public.transactions enable row level security;
alter table public.volunteers enable row level security;
alter table public.reports enable row level security;
alter table public.email_logs enable row level security;
alter table public.submissions enable row level security;
alter table public.legal_articles enable row level security;

do $$
declare
  t text;
begin
  for t in select unnest(array[
    'cms_config','services','campaigns','transactions',
    'volunteers','reports','email_logs','submissions','legal_articles'
  ])
  loop
    execute format('drop policy if exists "public read %1$s" on public.%1$s', t);
    execute format('create policy "public read %1$s" on public.%1$s for select using (true)', t);
    execute format('drop policy if exists "public write %1$s" on public.%1$s', t);
    execute format('create policy "public write %1$s" on public.%1$s for all using (true) with check (true)', t);
  end loop;
end $$;

-- Selesai. Lanjut ke README-SUPABASE.md untuk langkah konfigurasi berikutnya.
