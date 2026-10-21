import Link from "next/link";
import { Trophy, FileSignature, Timer, MapPin, Mail, Phone } from "lucide-react";

export function CtaSection() {
  return (
    <section
      id="cta"
      className="py-16 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="max-w-3xl mx-auto space-y-6">
          <Trophy className="w-12 h-12 mx-auto text-amber-400 animate-bounce" />
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Siap tingkatkan efektivitas dan transparansi pembinaan atlet daerah Anda?
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            Bergabunglah bersama PuslatTrack untuk mewujudkan tata kelola kedisiplinan
            atlet Puslatkot dan KONI yang modern &amp; terukur.
          </p>
          <div className="pt-4">
            <Link
              href="/register"
              className="inline-block px-8 py-4 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-extrabold text-lg shadow-xl shadow-amber-400/20 hover:shadow-amber-400/40 transition-all transform hover:-translate-y-1"
            >
              <FileSignature className="w-5 h-5 inline mr-2" />
              Ajukan Integrasi PuslatTrack Sekarang
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-amber-400 p-2 rounded-lg text-slate-900">
                <Timer className="w-5 h-5" strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold text-white">
                Puslat<span className="text-amber-400">Track</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Sistem Informasi Pengelola Absensi &amp; Monitoring Latihan Atlet
              Puslatkot &amp; KONI berbasis Foto Geotagging dan Rekapitulasi Otomatis.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">
              Navigasi Halaman
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#fitur" className="hover:text-amber-400 transition-colors">
                  Fitur Utama
                </a>
              </li>
              <li>
                <a href="#peran" className="hover:text-amber-400 transition-colors">
                  Akses Berdasarkan Peran
                </a>
              </li>
              <li>
                <a href="#cara-kerja" className="hover:text-amber-400 transition-colors">
                  Cara Kerja Sistem
                </a>
              </li>
              <li>
                <a href="#mengapa" className="hover:text-amber-400 transition-colors">
                  Keunggulan Aplikasi
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">
              Kontak Pengelola
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Gedung Sekretariat KONI / Puslatkot</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>admin@puslattrack.id</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>+62 812-3456-7890</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500">
          <p>&copy; 2026 PuslatTrack. Seluruh Hak Cipta Dilindungi Undang-Undang.</p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <span>Kelompok 1 Kelas 2025B - UNESA</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
