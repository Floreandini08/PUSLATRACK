-- ============================================================
--  PUSLATTRACK - Skema Basis Data Supabase
--  Pengembangan Aplikasi Digital Absensi dan Monitoring
--  Program Latihan Atlet pada Pusat Latihan Kota (Puslatkot)
-- ============================================================

-- ------------------------------------------------------------
-- 1. TABEL CABANG OLAHRAGA (CABOR)
-- ------------------------------------------------------------
create table if not exists public.cabor (
  id          uuid primary key default gen_random_uuid(),
  nama        text not null unique,
  kode        text not null unique,
  deskripsi   text,
  latitude    double precision,
  longitude   double precision,
  radius_m    integer not null default 200,
  aktif       boolean not null default true,
  created_at  timestamptz not null default now()
);

comment on table public.cabor is 'Master data cabang olahraga yang dibina Puslatkot';

-- ------------------------------------------------------------
-- 2. TABEL PROFIL PENGGUNA
-- ------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  role        text not null default 'atlet'
              check (role in ('atlet','pelatih','admin')),
  nama        text not null,
  identitas   text,
  telepon     text,
  alamat      text,
  kamar       text,
  cabor_id    uuid references public.cabor(id) on delete set null,
  pelatih_id  uuid references public.profiles(id) on delete set null,
  foto_url    text,
  aktif       boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_profiles_cabor on public.profiles(cabor_id);

comment on table public.profiles is 'Profil pengguna (atlet, pelatih, admin)'];

-- ------------------------------------------------------------
-- 3. TABEL SESI LATIHAN (Menggantikan pencatatan manual)
-- ------------------------------------------------------------
create table if not exists public.sesi_latihan (
  id              uuid primary key default gen_random_uuid(),
  atlet_id        uuid not null references public.profiles(id) on delete cascade,
  cabor_id        uuid references public.cabor(id) on delete set null,
  pelatih_id      uuid references public.profiles(id) on delete set null,
  lokasi          text,
  status          text not null default 'berjalan'
                  check (status in ('berjalan','selesai')),
  started_at      timestamptz not null default now(),
  finished_at     timestamptz,
  durasi_menit    integer,
  foto_mulai_url  text,
  foto_selesai_url text,
  lat_mulai       double precision,
  lng_mulai       double precision,
  lat_selesai     double precision,
  lng_selesai     double precision,
  device_info     text,
  created_at      timestamptz not null default now()
);

create index if not exists idx_sesi_atlet on public.sesi_latihan(atlet_id, started_at desc);
create index if not exists idx_sesi_cabor on public.sesi_latihan(cabor_id);
create index if not exists idx_sesi_status on public.sesi_latihan(status);

comment on table public.sesi_latihan is 'Sesi latihan atlet: absensi mulai & selesai beserta durasi';

-- ------------------------------------------------------------
-- 4. TABEL LOG ABSENSI (Jejak audit)
-- ------------------------------------------------------------
create table if not exists public.absensi_log (
  id           uuid primary key default gen_random_uuid(),
  sesi_id      uuid references public.sesi_latihan(id) on delete cascade,
  atlet_id     uuid not null references public.profiles(id) on delete cascade,
  jenis        text not null check (jenis in ('mulai','selesai')),
  waktu        timestamptz not null default now(),
  lat          double precision,
  lng          double precision,
  foto_url     text,
  device_info  text
);

create index if not exists idx_log_atlet on public.absensi_log(atlet_id, waktu desc);

-- ------------------------------------------------------------
-- 5. TABEL PROGRAM LATIHAN (Dikelola Pelatih)
-- ------------------------------------------------------------
create table if not exists public.program_latihan (
  id            uuid primary key default gen_random_uuid(),
  pelatih_id    uuid not null references public.profiles(id) on delete cascade,
  cabor_id      uuid references public.cabor(id) on delete cascade,
  judul         text not null,
  tanggal       date not null default current_date,
  durasi_menit  integer,
  materi        text,
  catatan       text,
  file_url      text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists idx_program_cabor on public.program_latihan(cabor_id, tanggal desc);

comment on table public.program_latihan is 'Program latihan yang diunggah pelatih dan dilihat atlet';

-- ------------------------------------------------------------
-- 6. VIEW REKAPITULASI
-- ------------------------------------------------------------
create or replace view public.rekap_atlet as
select
  p.id                as atlet_id,
  p.nama              as nama_atlet,
  p.cabor_id          as cabor_id,
  c.nama              as nama_cabor,
  count(s.id)                                                      as total_sesi,
  count(s.id) filter (where s.status = 'selesai')                 as total_sesi_selesai,
  coalesce(sum(s.durasi_menit) filter (where s.status = 'selesai'), 0) as total_menit,
  count(distinct date(s.started_at))                              as hari_aktif,
  max(s.started_at)                                               as terakhir_latihan
from public.profiles p
left join public.cabor c on c.id = p.cabor_id
left join public.sesi_latihan s on s.atlet_id = p.id
where p.role = 'atlet'
group by p.id, p.nama, p.cabor_id, c.nama
with (security_invoker = on);

create or replace view public.rekap_cabor as
select
  c.id                     as cabor_id,
  c.nama                   as nama_cabor,
  c.kode,
  count(distinct p.id)                                        as jumlah_atlet,
  count(s.id) filter (where s.status = 'selesai')             as total_sesi,
  coalesce(sum(s.durasi_menit) filter (where s.status = 'selesai'), 0) as total_menit
from public.cabor c
left join public.profiles p on p.cabor_id = c.id and p.role = 'atlet'
left join public.sesi_latihan s on s.atlet_id = p.id
group by c.id, c.nama, c.kode
with (security_invoker = on);

-- ------------------------------------------------------------
-- 7. FUNGSI BANTU (SECURITY DEFINER)
-- ------------------------------------------------------------
create or replace function public.my_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.my_cabor_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select cabor_id from public.profiles where id = auth.uid();
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((select role = 'admin' from public.profiles where id = auth.uid()), false);
$$;

-- ------------------------------------------------------------
-- 8. TRIGGER PENDAFTARAN PENGGUNA BARU
-- ------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, nama, role, identitas, cabor_id, telepon)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'nama', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data ->> 'role', 'atlet'),
    new.raw_user_meta_data ->> 'identitas',
    nullif(new.raw_user_meta_data ->> 'cabor_id', '')::uuid,
    new.raw_user_meta_data ->> 'telepon'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ------------------------------------------------------------
-- 9. ROW LEVEL SECURITY
-- ------------------------------------------------------------
alter table public.cabor          enable row level security;
alter table public.profiles       enable row level security;
alter table public.sesi_latihan   enable row level security;
alter table public.absensi_log    enable row level security;
alter table public.program_latihan enable row level security;

-- CABOR
drop policy if exists "cabor_select" on public.cabor;
create policy "cabor_select" on public.cabor for select to authenticated using (true);

drop policy if exists "cabor_insert" on public.cabor;
create policy "cabor_insert" on public.cabor for insert to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "cabor_update" on public.cabor;
create policy "cabor_update" on public.cabor for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "cabor_delete" on public.cabor;
create policy "cabor_delete" on public.cabor for delete to authenticated using (public.is_admin());

-- PROFILES
drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select" on public.profiles for select to authenticated
  using (
    id = auth.uid()
    or public.is_admin()
    or (role = 'atlet' and id in (select id from public.profiles where role = 'pelatih' and cabor_id = public.my_cabor_id()))
    or cabor_id = public.my_cabor_id()
  );

drop policy if exists "profiles_insert_self" on public.profiles;
create policy "profiles_insert_self" on public.profiles for insert to authenticated
  with check (id = auth.uid());

drop policy if exists "profiles_update_self" on public.profiles;
create policy "profiles_update_self" on public.profiles for update to authenticated
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

drop policy if exists "profiles_delete_admin" on public.profiles;
create policy "profiles_delete_admin" on public.profiles for delete to authenticated using (public.is_admin());

-- SESI LATIHAN
drop policy if exists "sesi_select" on public.sesi_latihan;
create policy "sesi_select" on public.sesi_latihan for select to authenticated
  using (
    atlet_id = auth.uid()
    or public.is_admin()
    or cabor_id = public.my_cabor_id()
  );

drop policy if exists "sesi_insert" on public.sesi_latihan;
create policy "sesi_insert" on public.sesi_latihan for insert to authenticated
  with check (atlet_id = auth.uid());

drop policy if exists "sesi_update" on public.sesi_latihan;
create policy "sesi_update" on public.sesi_latihan for update to authenticated
  using (atlet_id = auth.uid() or public.is_admin())
  with check (atlet_id = auth.uid() or public.is_admin());

drop policy if exists "sesi_delete" on public.sesi_latihan;
create policy "sesi_delete" on public.sesi_latihan for delete to authenticated using (public.is_admin());

-- ABSENSI LOG
drop policy if exists "log_select" on public.absensi_log;
create policy "log_select" on public.absensi_log for select to authenticated
  using (atlet_id = auth.uid() or public.is_admin() or public.my_role() = 'pelatih');

drop policy if exists "log_insert" on public.absensi_log;
create policy "log_insert" on public.absensi_log for insert to authenticated
  with check (atlet_id = auth.uid());

-- PROGRAM LATIHAN
drop policy if exists "program_select" on public.program_latihan;
create policy "program_select" on public.program_latihan for select to authenticated
  using (cabor_id = public.my_cabor_id() or public.is_admin());

drop policy if exists "program_insert" on public.program_latihan;
create policy "program_insert" on public.program_latihan for insert to authenticated
  with check (
    (public.my_role() = 'pelatih' and pelatih_id = auth.uid() and cabor_id = public.my_cabor_id())
    or public.is_admin()
  );

drop policy if exists "program_update" on public.program_latihan;
create policy "program_update" on public.program_latihan for update to authenticated
  using (
    (public.my_role() = 'pelatih' and pelatih_id = auth.uid())
    or public.is_admin()
  )
  with check (
    (public.my_role() = 'pelatih' and pelatih_id = auth.uid())
    or public.is_admin()
  );

drop policy if exists "program_delete" on public.program_latihan;
create policy "program_delete" on public.program_latihan for delete to authenticated
  using (
    (public.my_role() = 'pelatih' and pelatih_id = auth.uid())
    or public.is_admin()
  );

-- ------------------------------------------------------------
-- 10. STORAGE BUCKET FOTO ABSENSI
-- ------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('absensi-foto', 'absensi-foto', true)
on conflict (id) do nothing;

drop policy if exists "foto_insert" on storage.objects;
create policy "foto_insert" on storage.objects for insert to authenticated
  with check (bucket_id = 'absensi-foto');

drop policy if exists "foto_select" on storage.objects;
create policy "foto_select" on storage.objects for select to authenticated
  using (bucket_id = 'absensi-foto');

drop policy if exists "foto_delete" on storage.objects;
create policy "foto_delete" on storage.objects for delete to authenticated
  using (bucket_id = 'absensi-foto' and public.is_admin());
