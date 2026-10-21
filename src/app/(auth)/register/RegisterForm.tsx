"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { Loader2, UserPlus } from "lucide-react";
import { registerAction } from "../actions";
import type { ActionResult, Cabor } from "@/lib/types";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold py-3 transition-colors disabled:opacity-60"
    >
      {pending ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <UserPlus className="w-4 h-4" />
      )}
      {pending ? "Mendaftarkan..." : "Daftar Sekarang"}
    </button>
  );
}

const inputClass =
  "w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition";

export default function RegisterForm({ cabor }: { cabor: Cabor[] }) {
  const [role, setRole] = useState<"atlet" | "pelatih">("atlet");
  const [state, formAction] = useActionState<ActionResult | null, FormData>(
    registerAction,
    null
  );

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
      <h1 className="text-2xl font-extrabold text-slate-900">Buat Akun Baru</h1>
      <p className="text-slate-500 text-sm mt-2 mb-6">
        Pilih peran Anda agar fitur yang tampil menyesuaikan kebutuhan.
      </p>

      {state?.message && (
        <div
          className={`mb-4 rounded-xl border px-4 py-3 text-sm ${
            state.ok
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {state.message}
        </div>
      )}

      <form action={formAction} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {(
            [
              { value: "atlet", label: "Atlet" },
              { value: "pelatih", label: "Pelatih" },
            ] as const
          ).map((r) => (
            <label
              key={r.value}
              className={`cursor-pointer rounded-xl border-2 px-4 py-3 text-center text-sm font-semibold transition ${
                role === r.value
                  ? "border-amber-400 bg-amber-50 text-amber-700"
                  : "border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              <input
                type="radio"
                name="role"
                value={r.value}
                checked={role === r.value}
                onChange={() => setRole(r.value)}
                className="sr-only"
              />
              {r.label}
            </label>
          ))}
        </div>

        <div>
          <label htmlFor="nama" className="block text-sm font-medium text-slate-700 mb-1.5">
            Nama Lengkap
          </label>
          <input id="nama" name="nama" required className={inputClass} placeholder="Nama lengkap" />
        </div>

        <div>
          <label
            htmlFor="identitas"
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            {role === "atlet" ? "Nomor Identitas Atlet (NIM)" : "Nomor Identitas Pelatih"}
          </label>
          <input
            id="identitas"
            name="identitas"
            required={role === "atlet"}
            className={inputClass}
            placeholder={role === "atlet" ? "25061574030" : "Nomor identitas / NPDS"}
          />
        </div>

        <div>
          <label htmlFor="cabor_id" className="block text-sm font-medium text-slate-700 mb-1.5">
            Cabang Olahraga
          </label>
          <select id="cabor_id" name="cabor_id" className={inputClass} defaultValue="">
            <option value="">-- Pilih Cabor --</option>
            {cabor.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nama}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="telepon" className="block text-sm font-medium text-slate-700 mb-1.5">
            Nomor Telepon
          </label>
          <input id="telepon" name="telepon" className={inputClass} placeholder="08xxxxxxxxxx" />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={inputClass}
            placeholder="nama@puslatkot.id"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              Kata Sandi
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              className={inputClass}
              placeholder="Min. 6 karakter"
            />
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              Konfirmasi
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              className={inputClass}
              placeholder="Ulangi kata sandi"
            />
          </div>
        </div>

        <SubmitButton />
      </form>

      <p className="text-sm text-slate-500 mt-6 text-center">
        Sudah punya akun?{" "}
        <Link href="/login" className="text-amber-600 font-semibold hover:underline">
          Masuk di sini
        </Link>
      </p>
    </div>
  );
}
