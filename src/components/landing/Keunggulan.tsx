import {
  ShieldCheck,
  ChartPie,
  Eye,
  Camera,
  History,
  Calculator,
  Users,
  ClipboardList,
  ChartLine,
} from "lucide-react";

const KEUNGGULAN = [
  {
    icon: ShieldCheck,
    title: "Bebas Manipulasi Data",
    desc: "Penguncian lokasi via GPS Geotagging dan pembatasan kamera langsung mencegah kecurangan manipulasi jam dan kehadiran latihan atlet.",
    tone: "dark" as const,
  },
  {
    icon: ChartPie,
    title: "Rekapitulasi Otomatis",
    desc: "Sistem menghitung durasi jam latihan harian hingga bulanan secara presisi tanpa perlu rekapitulasi manual di spreadsheet yang memakan waktu.",
    tone: "amber" as const,
  },
  {
    icon: Eye,
    title: "Transparansi Lintas Peran",
    desc: "KONI dan Pengurus Puslatkot dapat memantau grafik keaktifan seluruh cabang olahraga secara real-time kapan saja dan dari mana saja.",
    tone: "dark" as const,
  },
];

const FITUR = [
  {
    icon: Camera,
    title: "Geotagging & Timestamp",
    desc: "Kamera aplikasi otomatis mengunci koordinat GPS lokasi latihan beserta waktu real-time yang tidak dapat diubah manual.",
  },
  {
    icon: History,
    title: "Verifikasi Dual-Sesi",
    desc: "Atlet wajib melakukan foto absensi saat mulai latihan dan saat sesi latihan selesai untuk akumulasi jam yang otentik.",
  },
  {
    icon: Calculator,
    title: "Kalkulasi Jam Otomatis",
    desc: "Sistem menghitung otomatis total jam harian, mingguan, hingga akumulasi bulanan untuk pemenuhan kuota target latihan.",
  },
  {
    icon: Users,
    title: "Multi-Peran & Cabor",
    desc: "Mendukung pemisahan kategori hak akses berdasarkan Atlet, Pelatih, serta pengelompokan Cabang Olahraga (Cabor).",
  },
  {
    icon: ClipboardList,
    title: "Manajemen Program Latihan",
    desc: "Pelatih dapat mengunggah silabus program latihan harian yang langsung dapat diakses dan dipelajari oleh atlet.",
  },
  {
    icon: ChartLine,
    title: "Dasbor Pemantauan KONI",
    desc: "Halaman eksekutif bagi pengurus KONI & Puslatkot untuk mengevaluasi tingkat keaktifan seluruh cabang olahraga secara terukur.",
  },
];

function SectionHeading({
  eyebrow,
  title,
  description,
  light = false,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  light?: boolean;
}) {
  return (
    <div className="text-center max-w-3xl mx-auto mb-16">
      <h2
        className={`text-xs font-bold uppercase tracking-widest mb-2 ${
          light ? "text-amber-400" : "text-amber-500"
        }`}
      >
        {eyebrow}
      </h2>
      <p
        className={`text-3xl sm:text-4xl font-extrabold ${
          light ? "text-white" : "text-slate-900"
        }`}
      >
        {title}
      </p>
      <div className="w-16 h-1 bg-amber-400 mx-auto my-4 rounded-full" />
      {description && (
        <p className={`text-base sm:text-lg ${light ? "text-slate-300" : "text-slate-600"}`}>
          {description}
        </p>
      )}
    </div>
  );
}

export function MengapaSection() {
  return (
    <section id="mengapa" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Solusi Modernisasi Sports Management"
          title="Mengapa Harus PuslatTrack?"
          description="Meninggalkan pencatatan manual yang rawan ketidaksesuaian data. PuslatTrack menghadirkan transparansi penuh bagi Atlet, Pelatih, Puslatkot, hingga KONI dalam satu ekosistem terpadu."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {KEUNGGULAN.map(({ icon: Icon, title, desc, tone }) => (
            <div
              key={title}
              className="p-8 rounded-2xl bg-slate-50 border border-slate-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-md ${
                  tone === "amber"
                    ? "bg-amber-400 text-slate-950"
                    : "bg-blue-900 text-amber-400"
                }`}
              >
                <Icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FiturSection() {
  return (
    <section id="fitur" className="py-20 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Fitur Unggulan System"
          title="Dirancang Khusus Sesuai Kebutuhan Atlet & Pengurus"
          light
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FITUR.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-slate-800/80 p-8 rounded-2xl border border-slate-700 hover:border-amber-400 transition-all group"
            >
              <div className="w-12 h-12 bg-amber-400/10 text-amber-400 rounded-xl flex items-center justify-center text-xl mb-6 group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
