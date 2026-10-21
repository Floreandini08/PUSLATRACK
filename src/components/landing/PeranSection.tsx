import { Check, Smartphone, Laptop, ChartLine, PersonStanding, ClipboardPen, Building2 } from "lucide-react";

const PERAN = [
  {
    title: "Untuk Atlet",
    desc: "Kemudahan pencatatan latihan dalam genggaman ponsel.",
    icon: PersonStanding,
    bullets: [
      "Absensi praktis foto geotagging cepat",
      "Monitor akumulasi target jam latihan",
      "Akses panduan & instruksi program dari pelatih",
    ],
    footer: "Tampilan Mobile App Optimized",
    footerIcon: Smartphone,
    style: "light" as const,
  },
  {
    title: "Untuk Pelatih",
    desc: "Kelola kedisiplinan & program latihan tim secara presisi.",
    icon: ClipboardPen,
    bullets: [
      "Unggah & susun silabus program latihan",
      "Pantau tingkat kehadiran & kedisiplinan atlet",
      "Otomatisasi laporan tanpa rekap manual",
    ],
    footer: "Akses Web & Mobile Management",
    footerIcon: Laptop,
    style: "dark" as const,
    popular: true,
  },
  {
    title: "KONI & Puslatkot",
    desc: "Pengawasan menyeluruh untuk hasil maksimal di kejuaraan.",
    icon: Building2,
    bullets: [
      "Dashboard statistik keaktifan seluruh Cabor",
      "Evaluasi kesiapan fisik & kuota jam latihan",
      "Data otentik untuk dasar pengambil keputusan",
    ],
    footer: "Executive Dashboard Access",
    footerIcon: ChartLine,
    style: "light" as const,
  },
];

const LANGKAH = [
  { title: "Login & Cabor", desc: "Login akun atlet/pelatih sesuai cabang olahraga yang terdaftar." },
  { title: "Absen Mulai", desc: "Foto selfie di lokasi latihan. Sistem mengunci lokasi GPS & jam." },
  { title: "Absen Selesai", desc: "Foto kembali saat sesi latihan usai untuk menutup timer absensi." },
  { title: "Rekap Otomatis", desc: "Durasi jam tersimpan dan langsung mengakumulasi total bulanan." },
  { title: "Evaluasi", desc: "Pelatih & KONI meninjau laporan performa dan tingkat kedisiplinan." },
];

export function PeranSection() {
  return (
    <section id="peran" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-2">
            Akses Multi-Role
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Didesain Spesifik Sesuai Peran Anda
          </p>
          <div className="w-16 h-1 bg-amber-400 mx-auto my-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PERAN.map(({ title, desc, icon: Icon, bullets, footer, footerIcon: FooterIcon, style, popular }) => (
            <div
              key={title}
              className={`rounded-2xl shadow-xl overflow-hidden border flex flex-col justify-between hover:-translate-y-2 transition-all relative ${
                style === "dark"
                  ? "bg-slate-900 text-white border-slate-800 shadow-2xl"
                  : "bg-white border-slate-100"
              }`}
            >
              {popular && (
                <div className="absolute top-0 right-0 bg-amber-400 text-slate-950 font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-bl-lg">
                  Populer
                </div>
              )}
              <div className="p-8">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-bold mb-4 ${
                    style === "dark"
                      ? "bg-amber-400 text-slate-950"
                      : "bg-blue-100 text-blue-900"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className={`text-2xl font-bold mb-2 ${style === "dark" ? "text-white" : "text-slate-900"}`}>
                  {title}
                </h3>
                <p className={`text-sm mb-6 ${style === "dark" ? "text-slate-400" : "text-slate-500"}`}>
                  {desc}
                </p>
                <ul className="space-y-3 text-sm">
                  {bullets.map((b) => (
                    <li
                      key={b}
                      className={`flex items-start ${style === "dark" ? "text-slate-300" : "text-slate-700"}`}
                    >
                      <Check
                        className={`w-4 h-4 mt-1 mr-3 shrink-0 ${
                          style === "dark" ? "text-amber-400" : "text-emerald-500"
                        }`}
                      />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div
                className={`px-8 py-4 border-t text-xs font-medium ${
                  style === "dark"
                    ? "bg-slate-950 border-slate-800 text-slate-400"
                    : "bg-slate-50 border-slate-100 text-slate-500"
                }`}
              >
                <FooterIcon className="w-3.5 h-3.5 inline mr-2" />
                {footer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CaraKerjaSection() {
  return (
    <section id="cara-kerja" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-2">
            Alur Penggunaan
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            5 Langkah Mudah Cara Kerja PuslatTrack
          </p>
          <div className="w-16 h-1 bg-amber-400 mx-auto my-4 rounded-full" />
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0" />
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 relative z-10">
            {LANGKAH.map((s, i) => (
              <div
                key={s.title}
                className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center relative hover:shadow-lg transition-all"
              >
                <div className="w-10 h-10 bg-slate-900 text-amber-400 font-bold rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-amber-400 shadow-md">
                  {i + 1}
                </div>
                <h4 className="font-bold text-slate-900 mb-2">{s.title}</h4>
                <p className="text-slate-600 text-xs">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

