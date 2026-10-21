export type Role = "atlet" | "pelatih" | "admin";

export interface Profile {
  id: string;
  role: Role;
  nama: string;
  identitas: string | null;
  telepon: string | null;
  alamat: string | null;
  kamar: string | null;
  cabor_id: string | null;
  pelatih_id: string | null;
  foto_url: string | null;
  aktif: boolean;
  created_at: string;
}

export interface Cabor {
  id: string;
  nama: string;
  kode: string;
  deskripsi: string | null;
  latitude: number | null;
  longitude: number | null;
  radius_m: number;
  aktif: boolean;
  created_at: string;
}

export interface SesiLatihan {
  id: string;
  atlet_id: string;
  cabor_id: string | null;
  pelatih_id: string | null;
  lokasi: string | null;
  status: "berjalan" | "selesai";
  started_at: string;
  finished_at: string | null;
  durasi_menit: number | null;
  foto_mulai_url: string | null;
  foto_selesai_url: string | null;
  lat_mulai: number | null;
  lng_mulai: number | null;
  lat_selesai: number | null;
  lng_selesai: number | null;
  device_info: string | null;
}

export interface ProgramLatihan {
  id: string;
  pelatih_id: string;
  cabor_id: string | null;
  judul: string;
  tanggal: string;
  durasi_menit: number | null;
  materi: string | null;
  catatan: string | null;
  file_url: string | null;
  created_at: string;
 updated_at?: string;
}

export interface RekapAtlet {
  atlet_id: string;
  nama_atlet: string;
  cabor_id: string | null;
  nama_cabor: string | null;
  total_sesi: number;
  total_sesi_selesai: number;
  total_menit: number;
  hari_aktif: number;
  terakhir_latihan: string | null;
}

export interface RekapCabor {
  cabor_id: string;
  nama_cabor: string;
  kode: string;
  jumlah_atlet: number;
  total_sesi: number;
  total_menit: number;
}

export interface ActionResult {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string>;
}
