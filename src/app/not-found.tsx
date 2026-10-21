import Link from "next/link";
import { Timer, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center mx-auto mb-6">
          <Timer className="w-8 h-8" strokeWidth={2.5} />
        </div>
        <p className="text-amber-400 text-xs font-bold uppercase tracking-widest">
          404
        </p>
        <h1 className="text-3xl font-extrabold mt-2">Halaman tidak ditemukan</h1>
        <p className="text-slate-300 text-sm mt-3">
          Alamat yang Anda tuju tidak tersedia atau sudah dipindahkan.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 mt-7 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-6 py-3 rounded-xl transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
