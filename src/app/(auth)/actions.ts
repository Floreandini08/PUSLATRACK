"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/types";

export async function loginAction(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const redirectTo = String(formData.get("redirectTo") ?? "/dashboard");

  if (!email || !password) {
    return { ok: false, message: "Email dan kata sandi wajib diisi." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return {
      ok: false,
      message:
        error.message === "Invalid login credentials"
          ? "Email atau kata sandi tidak sesuai."
          : error.message,
    };
  }

  revalidatePath("/", "layout");
  redirect(redirectTo.startsWith("/") ? redirectTo : "/dashboard");
}

export async function registerAction(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const nama = String(formData.get("nama") ?? "").trim();
  const identitas = String(formData.get("identitas") ?? "").trim();
  const role = String(formData.get("role") ?? "atlet");
  const caborId = String(formData.get("cabor_id") ?? "");
  const telepon = String(formData.get("telepon") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!nama || !email || !password) {
    return { ok: false, message: "Nama, email, dan kata sandi wajib diisi." };
  }
  if (role === "atlet" && !identitas) {
    return { ok: false, message: "Nomor identitas atlet wajib diisi." };
  }
  if (!["atlet", "pelatih"].includes(role)) {
    return { ok: false, message: "Peran tidak valid." };
  }
  if (password.length < 6) {
    return { ok: false, message: "Kata sandi minimal 6 karakter." };
  }
  if (password !== confirmPassword) {
    return { ok: false, message: "Konfirmasi kata sandi tidak sama." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/dashboard`,
      data: {
        nama,
        identitas,
        role,
        cabor_id: caborId || "",
        telepon,
      },
    },
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  if (data.session) {
    revalidatePath("/", "layout");
    redirect("/dashboard");
  }

  return {
    ok: true,
    message:
      "Pendaftaran berhasil. Silakan periksa email Anda untuk verifikasi akun sebelum masuk.",
  };
}
