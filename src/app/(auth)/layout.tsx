import Link from "next/link";
import { Timer, ShieldCheck, BarChart3, ClipboardList } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-950">
      {/* Panel kiri - branding */}
      <div className="hidden lg:flex relative flex-col justify-between p-12 overflow-hidden">
        <div className="absolute inset-0 gradient-glow pointer-events-none" />
        <div className="relative z-10">
          <Link href="/" className="flex items-center space-x-3">
            <div className="bg-amber-400 p-2.5 rounded-xl text-slate-900 shadow-lg shadow-amber-400/20">
              <Timer className="w-6 h-6" strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-white">
              Puslat<span className="text-amber-400">Track</span>
            </span>
          </Link>
        </div>

        <div className="relative z-10 max-w-md space-y-6">
          <h2 className="text-4xl font-extrabold text-white leading-tight">
            Digitalisasi pembinaan atlet yang terukur, transparan, dan mudah
            diakses.
          </h2>
          <ul className="space-y-4">
            {[
              { icon: ShieldCheck, text: "Absensi foto dengan Geotagging & timestamp otomatis" },
              { icon: BarChart3, text: "Rekapitulasi durasi latihan real-time" },
              { icon: ClipboardList, text: "Program latihan dari pelatih langsung terpublikasi" },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-slate-300">
                <span className="w-9 h-9 rounded-lg bg-amber-400/10 text-amber-400 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-xs text-slate-500">
          &copy; 2026 PuslatTrack &mdash; Kelompok 1 Kelas 2025B, Universitas Negeri
          Surabaya
        </p>
      </div>

      {/* Panel kanan - form */}
      <div className="bg-slate-50 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex items-center space-x-3">
            <div className="bg-amber-400 p-2 rounded-lg text-slate-900">
              <Timer className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-extrabold text-slate-900">
              Puslat<span className="text-amber-500">Track</span>
            </span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
