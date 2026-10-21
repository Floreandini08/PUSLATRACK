import Link from "next/link";
import {
  PlayCircle,
  Send,
  User,
  MapPin,
  Clock,
  Activity,
} from "lucide-react";

export default function Hero() {
  return (
    <section className="relative bg-slate-950 text-white pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-hidden">
      <div className="absolute inset-0 gradient-glow pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs sm:text-sm font-semibold px-4 py-2 rounded-full">
              <Activity className="w-4 h-4" />
              <span>Platform Digital Pemantauan Atlet Terintegrasi</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Modernisasi Absensi &amp; Monitoring Latihan{" "}
              <span className="text-amber-400">Atlet Puslatkot</span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Platform digital terpadu dengan absensi foto ber-geotagging,
              rekapitulasi jam latihan otomatis, serta monitoring program latihan
              terintegrasi untuk mempersiapkan atlet meraih juara.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/register"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-base shadow-lg shadow-amber-400/20 hover:shadow-amber-400/40 transition-all transform hover:-translate-y-1 text-center"
              >
                <Send className="w-4 h-4 inline mr-2" />
                Mulai Sekarang
              </Link>
              <a
                href="#fitur"
                className="w-full sm:w-auto px-8 py-4 rounded-xl border-2 border-slate-700 hover:border-amber-400 text-slate-200 hover:text-amber-400 font-semibold text-base transition-all text-center"
              >
                <PlayCircle className="w-4 h-4 inline mr-2" />
                Pelajari Fitur
              </a>
            </div>

            <div className="pt-8 grid grid-cols-3 gap-4 border-t border-slate-800/80 text-center lg:text-left">
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white">
                  100%
                </div>
                <div className="text-xs text-slate-400 mt-1">Akurasi Geotagging</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">
                  Real-Time
                </div>
                <div className="text-xs text-slate-400 mt-1">Rekap Jam Latihan</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white">30+</div>
                <div className="text-xs text-slate-400 mt-1">Cabang Olahraga</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-blue-600 rounded-2xl blur opacity-30" />

              <div className="relative bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 sm:p-6 overflow-hidden">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 font-bold">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Bagus Pratama</h4>
                      <p className="text-xs text-slate-400">Atlet Taekwondo - Puslatkot</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    Sesi Aktif
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-xs text-amber-400 font-semibold tracking-wider uppercase">
                          Absensi Sesi Pagi
                        </span>
                        <h5 className="text-sm font-bold text-white">
                          GOR Jayabaya - Lapangan A
                        </h5>
                      </div>
                      <span className="text-xs text-slate-400">
                        <Clock className="w-3 h-3 inline mr-1" />
                        06:30 WIB
                      </span>
                    </div>

                    <div className="relative bg-slate-950 rounded-lg h-32 flex items-center justify-center overflow-hidden border border-slate-800 my-3 bg-[radial-gradient(circle_at_30%_30%,#1e293b,#020617)]">
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                      <div className="absolute bottom-2 left-2 text-[11px] text-slate-300 font-mono bg-slate-900/90 px-2 py-1 rounded border border-slate-700">
                        <MapPin className="w-3 h-3 inline mr-1 text-red-400" />
                        Lat: -7.8124, Long: 112.0135
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Durasi Terverifikasi:</span>
                      <span className="font-bold text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800">
                        2 Jam 30 Menit
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80">
                    <div className="flex justify-between text-xs font-medium mb-1">
                      <span className="text-slate-300">Target Jam Latihan Bulanan</span>
                      <span className="text-amber-400 font-bold">48 / 60 Jam</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-2.5">
                      <div className="bg-amber-400 h-2.5 rounded-full" style={{ width: "80%" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
