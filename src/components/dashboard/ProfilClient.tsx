"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, AlertCircle, User, Lock, ShieldCheck } from "lucide-react";
import { updatePasswordAction, updateProfileAction } from "@/app/dashboard/actions";
import { inisial, ROLE_LABEL } from "@/lib/utils";
import type { ActionResult, Profile, Role } from "@/lib/types";

const inputClass =
  "w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition";

export default function ProfilClient({
  profile,
  email,
  cabor,
}: {
  profile: Profile;
  email: string;
  cabor: string | null;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<ActionResult | null>(null);

  const submitProfil = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const result = await updateProfileAction(new FormData(e.currentTarget));
    setLoading(false);
    setMessage(result);
    if (result.ok) router.refresh();
  };

  const submitPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const result = await updatePasswordAction(new FormData(e.currentTarget));
    setLoading(false);
    setMessage(result);
  };

  return (
    <div className="space-y-6">
      {message && (
        <div
          className={`rounded-2xl border px-5 py-4 flex items-start gap-3 ${
            message.ok
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-rose-200 bg-rose-50 text-rose-700"
          }`}
        >
          {message.ok ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          )}
          <p className="text-sm font-medium">{message.message}</p>
        </div>
      )}

      {/* Kartu identitas */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute inset-0 gradient-glow pointer-events-none" />
        <div className="relative flex flex-wrap items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center text-xl font-extrabold">
            {inisial(profile.nama)}
          </div>
          <div>
            <h2 className="text-2xl font-extrabold">{profile.nama}</h2>
            <p className="text-slate-300 text-sm mt-1">
              {email} &middot; {ROLE_LABEL[profile.role as Role]}
              {cabor ? ` · ${cabor}` : ""}
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-white/10 border border-white/15">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                {ROLE_LABEL[profile.role as Role]}
              </span>
              {profile.identitas && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/10 border border-white/15">
                  ID: {profile.identitas}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Data profil */}
        <form
          onSubmit={submitProfil}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4"
        >
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <User className="w-4 h-4 text-amber-500" />
            Data Profil
          </h3>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Nama Lengkap
            </label>
            <input
              name="nama"
              required
              defaultValue={profile.nama}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Nomor Identitas
            </label>
            <input
              name="identitas"
              defaultValue={profile.identitas ?? ""}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Nomor Telepon
            </label>
            <input
              name="telepon"
              defaultValue={profile.telepon ?? ""}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Alamat
            </label>
            <input
              name="alamat"
              defaultValue={profile.alamat ?? ""}
              className={inputClass}
            />
          </div>

          {profile.role === "atlet" && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Kamar / Asrama
              </label>
              <input
                name="kamar"
                defaultValue={profile.kamar ?? ""}
                className={inputClass}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-5 py-3 rounded-xl transition disabled:opacity-60"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Simpan Perubahan
          </button>
        </form>

        {/* Keamanan */}
        <form
          onSubmit={submitPassword}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4 h-fit"
        >
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-500" />
            Keamanan Akun
          </h3>
          <p className="text-sm text-slate-500">
            Gunakan kata sandi yang kuat dan tidak sama dengan kata sandi pada
            layanan lain.
          </p>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Kata Sandi Baru
            </label>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              className={inputClass}
              placeholder="Minimal 6 karakter"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Konfirmasi Kata Sandi
            </label>
            <input
              name="confirmPassword"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 border border-slate-300 hover:border-amber-400 hover:text-amber-600 text-slate-700 font-semibold px-5 py-3 rounded-xl transition disabled:opacity-60"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Perbarui Kata Sandi
          </button>
        </form>
      </div>
    </div>
  );
}
