"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/types";

/* ------------------------------------------------------------------
 *  AUTH
 * ---------------------------------------------------------------- */
export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

/* ------------------------------------------------------------------
 *  ABSENSI
 * ---------------------------------------------------------------- */
export async function absenMulaiAction(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false, message: "Sesi tidak valid. Silakan masuk kembali." };

  const file = formData.get("foto");
  const lat = Number(formData.get("lat"));
  const lng = Number(formData.get("lng"));
  const lokasi = String(formData.get("lokasi") ?? "");
  const device = String(formData.get("device") ?? "");

  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, message: "Foto absensi wajib diambil." };
  }
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return { ok: false, message: "Lokasi GPS tidak dapat ditemukan. Aktifkan GPS terlebih dahulu." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role, cabor_id, nama")
    .eq("id", user.id)
    .single();

  if (!profile) return { ok: false, message: "Profil tidak ditemukan." };
  if (profile.role !== "atlet") {
    return { ok: false, message: "Absensi hanya dapat dilakukan oleh akun atlet." };
  }

  // Cegah absensi ganda ketika sesi masih berjalan
  const { data: berjalan } = await supabase
    .from("sesi_latihan")
    .select("id")
    .eq("atlet_id", user.id)
    .eq("status", "berjalan")
    .limit(1);

  if (berjalan && berjalan.length > 0) {
    return {
      ok: false,
      message: "Anda memiliki sesi latihan yang belum ditutup. Selesaikan latihan terlebih dahulu.",
    };
  }

  const { data: sesi, error } = await supabase
    .from("sesi_latihan")
    .insert({
      atlet_id: user.id,
      cabor_id: profile.cabor_id,
     started_at: new Date().toISOString(),
      status: "berjalan",
      lokasi,
      lat_mulai: lat,
      lng_mulai: lng,
      device_info: device,
    })
    .select("id")
    .single();

  if (error) return { ok: false, message: error.message };

  const { url, error: uploadError } = await uploadFoto(
    supabase,
    user.id,
    sesi.id,
    "mulai",
    file
  );

  if (uploadError) {
    await supabase.from("sesi_latihan").delete().eq("id", sesi.id);
    return { ok: false, message: `Gagal mengunggah foto: ${uploadError}` };
  }

  await supabase.from("sesi_latihan").update({ foto_mulai_url: url }).eq("id", sesi.id);

  await supabase.from("absensi_log").insert({
    sesi_id: sesi.id,
    atlet_id: user.id,
    jenis: "mulai",
    waktu: new Date().toISOString(),
    lat,
    lng,
    foto_url: url,
    device_info: device,
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/riwayat");
  return { ok: true, message: "Absensi mulai latihan berhasil dicatat." };
}

export async function absenSelesaiAction(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false, message: "Sesi tidak valid. Silakan masuk kembali." };

  const file = formData.get("foto");
  const sesiId = String(formData.get("sesi_id") ?? "");
  const lat = Number(formData.get("lat"));
  const lng = Number(formData.get("lng"));
  const device = String(formData.get("device") ?? "");

  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, message: "Foto absensi wajib diambil." };
  }
  if (!sesiId) return { ok: false, message: "Sesi latihan tidak ditemukan." };
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return { ok: false, message: "Lokasi GPS tidak dapat ditemukan. Aktifkan GPS terlebih dahulu." };
  }

  const { data: sesi } = await supabase
    .from("sesi_latihan")
    .select("id, atlet_id, status, started_at")
    .eq("id", sesiId)
    .eq("atlet_id", user.id)
    .single();

  if (!sesi) return { ok: false, message: "Sesi latihan tidak ditemukan." };
  if (sesi.status === "selesai") {
    return { ok: false, message: "Sesi latihan ini sudah ditutup." };
  }

  const finishedAt = new Date();
  const startedAt = new Date(sesi.started_at);
  const durasiMenit = Math.max(
    1,
    Math.round((finishedAt.getTime() - startedAt.getTime()) / 60000)
  );

  const { url, error: uploadError } = await uploadFoto(
    supabase,
    user.id,
    sesi.id,
    "selesai",
    file
  );

  if (uploadError) {
    return { ok: false, message: `Gagal mengunggah foto: ${uploadError}` };
  }

  const { error } = await supabase
    .from("sesi_latihan")
    .update({
      status: "selesai",
      finished_at: finishedAt.toISOString(),
      durasi_menit: durasiMenit,
      foto_selesai_url: url,
      lat_selesai: lat,
      lng_selesai: lng,
      device_info: device,
    })
    .eq("id", sesi.id);

  if (error) return { ok: false, message: error.message };

  await supabase.from("absensi_log").insert({
    sesi_id: sesi.id,
    atlet_id: user.id,
    jenis: "selesai",
    waktu: finishedAt.toISOString(),
    lat,
    lng,
    foto_url: url,
    device_info: device,
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/riwayat");
  return {
    ok: true,
    message: `Latihan selesai. Durasi tercatat ${durasiMenit} menit.`,
  };
}

async function uploadFoto(
  supabase: Awaited<ReturnType<typeof createClient>>,
  atletId: string,
  sesiId: string,
  jenis: "mulai" | "selesai",
  file: File
): Promise<{ url: string | null; error: string | null }> {
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `${atletId}/${sesiId}-${jenis}-${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from("absensi-foto")
    .upload(path, file, { contentType: file.type || "image/jpeg", upsert: true });

  if (error) return { url: null, error: error.message };

  const { data } = supabase.storage.from("absensi-foto").getPublicUrl(path);
  return { url: data.publicUrl, error: null };
}

/* ------------------------------------------------------------------
 *  PROGRAM LATIHAN (PELATIH)
 * ---------------------------------------------------------------- */
export async function createProgramAction(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Sesi tidak valid." };

  const judul = String(formData.get("judul") ?? "").trim();
  const materi = String(formData.get("materi") ?? "").trim();
  const catatan = String(formData.get("catatan") ?? "").trim();
  const tanggal = String(formData.get("tanggal") ?? "");
  const durasi = Number(formData.get("durasi_menit") ?? 0);
  const caborId = String(formData.get("cabor_id") ?? "");

  if (!judul) return { ok: false, message: "Judul program latihan wajib diisi." };
  if (!caborId) return { ok: false, message: "Cabang olahraga wajib dipilih." };

  const { error } = await supabase.from("program_latihan").insert({
    pelatih_id: user.id,
    cabor_id: caborId,
    judul,
    materi,
    catatan,
    tanggal: tanggal || new Date().toISOString().slice(0, 10),
    durasi_menit: durasi > 0 ? durasi : null,
  });

  if (error) return { ok: false, message: error.message };

  revalidatePath("/dashboard/program");
  return { ok: true, message: "Program latihan berhasil dipublikasikan." };
}

export async function updateProgramAction(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Sesi tidak valid." };

  const id = String(formData.get("id") ?? "");
  const judul = String(formData.get("judul") ?? "").trim();
  const materi = String(formData.get("materi") ?? "").trim();
  const catatan = String(formData.get("catatan") ?? "").trim();
  const tanggal = String(formData.get("tanggal") ?? "");
  const durasi = Number(formData.get("durasi_menit") ?? 0);
  const caborId = String(formData.get("cabor_id") ?? "");

  if (!id || !judul) return { ok: false, message: "Data program tidak lengkap." };

  const { error } = await supabase
    .from("program_latihan")
    .update({
      judul,
      materi,
      catatan,
      tanggal: tanggal || new Date().toISOString().slice(0, 10),
      durasi_menit: durasi > 0 ? durasi : null,
      cabor_id: caborId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return { ok: false, message: error.message };

  revalidatePath("/dashboard/program");
  return { ok: true, message: "Program latihan berhasil diperbarui." };
}

export async function deleteProgramAction(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Sesi tidak valid." };

  const id = String(formData.get("id") ?? "");
  if (!id) return { ok: false, message: "ID program tidak valid." };

  const { error } = await supabase.from("program_latihan").delete().eq("id", id);
  if (error) return { ok: false, message: error.message };

  revalidatePath("/dashboard/program");
  return { ok: true, message: "Program latihan berhasil dihapus." };
}

/* ------------------------------------------------------------------
 *  KELOLA PENGGUNA (ADMIN)
 * ---------------------------------------------------------------- */
export async function createUserAction(formData: FormData): Promise<ActionResult> {
  const admin = createAdminClient();
  if (!admin) return { ok: false, message: "SUPABASE_SERVICE_ROLE_KEY belum dikonfigurasi." };

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const nama = String(formData.get("nama") ?? "").trim();
  const role = String(formData.get("role") ?? "atlet");
  const identitas = String(formData.get("identitas") ?? "").trim();
  const caborId = String(formData.get("cabor_id") ?? "");
  const telepon = String(formData.get("telepon") ?? "").trim();

  if (!email || !password || !nama) {
    return { ok: false, message: "Nama, email, dan kata sandi wajib diisi." };
  }
  if (password.length < 6) {
    return { ok: false, message: "Kata sandi minimal 6 karakter." };
  }
  if (!["atlet", "pelatih", "admin"].includes(role)) {
    return { ok: false, message: "Peran tidak valid." };
  }

  const { error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      nama,
      identitas,
      role,
      cabor_id: caborId,
      telepon,
    },
  });

  if (error) return { ok: false, message: error.message };

  revalidatePath("/dashboard/pengguna");
  return { ok: true, message: `Akun ${nama} berhasil dibuat.` };
}

export async function updateUserAction(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  const id = String(formData.get("id") ?? "");
  const nama = String(formData.get("nama") ?? "").trim();
  const role = String(formData.get("role") ?? "atlet");
  const identitas = String(formData.get("identitas") ?? "").trim();
  const caborId = String(formData.get("cabor_id") ?? "");
  const telepon = String(formData.get("telepon") ?? "").trim();
  const aktif = formData.get("aktif") === "true";

  if (!id || !nama) return { ok: false, message: "Data pengguna tidak lengkap." };

  const { error } = await supabase
    .from("profiles")
    .update({
      nama,
      role,
      identitas,
      telepon,
      cabor_id: caborId || null,
      aktif,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return { ok: false, message: error.message };

  revalidatePath("/dashboard/pengguna");
  return { ok: true, message: "Data pengguna berhasil diperbarui." };
}

export async function deleteUserAction(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  const admin = createAdminClient();
  const id = String(formData.get("id") ?? "");
  if (!id) return { ok: false, message: "ID pengguna tidak valid." };
  if (!admin) return { ok: false, message: "SUPABASE_SERVICE_ROLE_KEY belum dikonfigurasi." };

  const { error } = await admin.auth.admin.deleteUser(id);
  if (error) {
    // Fallback: nonaktifkan akun bila penghapusan ditolak
    const { error: updErr } = await supabase
      .from("profiles")
      .update({ aktif: false })
      .eq("id", id);
    if (updErr) return { ok: false, message: error.message };
  }

  revalidatePath("/dashboard/pengguna");
  return { ok: true, message: "Pengguna berhasil dihapus." };
}

/* ------------------------------------------------------------------
 *  KELOLA CABOR (ADMIN)
 * ---------------------------------------------------------------- */
export async function createCaborAction(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  const nama = String(formData.get("nama") ?? "").trim();
  const kode = String(formData.get("kode") ?? "").trim().toUpperCase();
  const deskripsi = String(formData.get("deskripsi") ?? "").trim();
  const latitude = Number(formData.get("latitude"));
  const longitude = Number(formData.get("longitude"));
  const radius = Number(formData.get("radius_m") ?? 200);

  if (!nama || !kode) {
    return { ok: false, message: "Nama dan kode cabor wajib diisi." };
  }

  const { error } = await supabase.from("cabor").insert({
    nama,
    kode,
    deskripsi,
    latitude: Number.isFinite(latitude) ? latitude : null,
    longitude: Number.isFinite(longitude) ? longitude : null,
    radius_m: radius > 0 ? radius : 200,
  });

  if (error) return { ok: false, message: error.message };

  revalidatePath("/dashboard/cabor");
  return { ok: true, message: "Cabang olahraga berhasil ditambahkan." };
}

export async function updateCaborAction(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  const id = String(formData.get("id") ?? "");
  const nama = String(formData.get("nama") ?? "").trim();
  const kode = String(formData.get("kode") ?? "").trim().toUpperCase();
  const deskripsi = String(formData.get("deskripsi") ?? "").trim();
  const latitude = Number(formData.get("latitude"));
  const longitude = Number(formData.get("longitude"));
  const radius = Number(formData.get("radius_m") ?? 200);
  const aktif = formData.get("aktif") === "true";

  if (!id || !nama || !kode) {
    return { ok: false, message: "Data cabor tidak lengkap." };
  }

  const { error } = await supabase
    .from("cabor")
    .update({
      nama,
      kode,
      deskripsi,
      latitude: Number.isFinite(latitude) ? latitude : null,
      longitude: Number.isFinite(longitude) ? longitude : null,
      radius_m: radius > 0 ? radius : 200,
      aktif,
    })
    .eq("id", id);

  if (error) return { ok: false, message: error.message };

  revalidatePath("/dashboard/cabor");
  return { ok: true, message: "Cabang olahraga berhasil diperbarui." };
}

export async function deleteCaborAction(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  const id = String(formData.get("id") ?? "");
  if (!id) return { ok: false, message: "ID cabor tidak valid." };

  const { error } = await supabase.from("cabor").delete().eq("id", id);
  if (error) return { ok: false, message: error.message };

  revalidatePath("/dashboard/cabor");
  return { ok: true, message: "Cabang olahraga berhasil dihapus." };
}

/* ------------------------------------------------------------------
 *  PROFIL
 * ---------------------------------------------------------------- */
export async function updateProfileAction(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Sesi tidak valid." };

  const nama = String(formData.get("nama") ?? "").trim();
  const identitas = String(formData.get("identitas") ?? "").trim();
  const telepon = String(formData.get("telepon") ?? "").trim();
  const alamat = String(formData.get("alamat") ?? "").trim();
  const kamar = String(formData.get("kamar") ?? "").trim();

  if (!nama) return { ok: false, message: "Nama wajib diisi." };

  const { error } = await supabase
    .from("profiles")
    .update({ nama, identitas, telepon, alamat, kamar, updated_at: new Date().toISOString() })
    .eq("id", user.id);

  if (error) return { ok: false, message: error.message };

  revalidatePath("/dashboard/profil");
  return { ok: true, message: "Profil berhasil diperbarui." };
}

export async function updatePasswordAction(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirmPassword") ?? "");

  if (password.length < 6) {
    return { ok: false, message: "Kata sandi minimal 6 karakter." };
  }
  if (password !== confirm) {
    return { ok: false, message: "Konfirmasi kata sandi tidak sama." };
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { ok: false, message: error.message };

  return { ok: true, message: "Kata sandi berhasil diperbarui." };
}

/* ------------------------------------------------------------------
 *  HELPER
 * ---------------------------------------------------------------- */
function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;

  return createSupabaseClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
