"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { Loader2, LogIn } from "lucide-react";
import { loginAction } from "../actions";
import type { ActionResult } from "@/lib/types";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 transition-colors disabled:opacity-60"
    >
      {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
      {pending ? "Memproses..." : "Masuk"}
    </button>
  );
}

export default function LoginForm({ redirectTo }: { redirectTo: string }) {
  const [state, formAction] = useActionState<ActionResult | null, FormData>(
    loginAction,
    null
  );

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
      <h1 className="text-2xl font-extrabold text-slate-900">Masuk ke Akun Anda</h1>
      <p className="text-slate-500 text-sm mt-2 mb-6">
        Gunakan akun yang terdaftar di Pusat Latihan Kota.
      </p>

      {state?.message && !state.ok && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.message}
        </div>
      )}
      {state?.message && state.ok && (
        <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {state.message}
        </div>
      )}

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="redirectTo" value={redirectTo} />

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
            placeholder="nama@puslatkot.id"
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition"
          />
        </div>

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
            autoComplete="current-password"
            placeholder="••••••••"
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition"
          />
        </div>

        <SubmitButton />
      </form>

      <p className="text-sm text-slate-500 mt-6 text-center">
        Belum punya akun?{" "}
        <Link href="/register" className="text-amber-600 font-semibold hover:underline">
          Daftar sekarang
        </Link>
      </p>
    </div>
  );
}
