import Link from "next/link";
import {
  Camera,
  CalendarCheck,
  Clock3,
  Users,
  ClipboardList,
  Activity,
  Trophy,
  ArrowRight,
  MapPin,
  Dumbbell,
  ShieldCheck,
} from "lucide-react";
import { getSession } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import {
  Badge,
  Card,
  CardHeader,
  EmptyState,
  ProgressBar,
  StatCard,
} from "@/components/ui";
import { formatDurasi, formatTanggal, formatWaktu, relatif } from "@/lib/utils";
import type { ProgramLatihan, SesiLatihan } from "@/lib/types";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) return null;

  const { profile, user } = session;

  if (profile.role === "atlet") return <AtletDashboard userId={user.id} caborId={profile.cabor_id} nama={profile.nama} />;
  if (profile.role === "pelatih") return <PelatihDashboard caborId={profile.cabor_id} nama={profile.nama} />;
  return <AdminDashboard />;
}

/* ------------------------------------------------------------------ */
/*  ATLET                                                              */
/* ------------------------------------------------------------------ */
async function AtletDashboard({
  userId,
  caborId,
  nama,
}: {
  userId: string;
  caborId: string | null;
  nama: string;
}) {
  const supabase = await createClient();

  const { data: sesiData } = await supabase
    .from("sesi_latihan")
    .select("*")
    .eq("atlet_id", userId)
    .order("started_at", { ascending: false });

  const sesi = (sesiData ?? []) as SesiLatihan[];
  const selesai = sesi.filter((s) => s.status === "selesai");
  const berjalan = sesi.find((s) => s.status === "berjalan");

  const totalMenit = selesai.reduce((a, b) => a + (b.durasi_menit ?? 0), 0);
  const hariAktif = new Set(selesai.map((s) => s.started_at.slice(0, 10))).size;

  const batas = new Date();
  batas.setDate(batas.getDate() - 30);
  const total30 = selesai.filter((s) => new Date(s.started_at) >= batas);

  const { data: programData } = await supabase
    .from("program_latihan")
    .select("*")
    .eq("cabor_id", caborId ?? "__none__")
    .order("tanggal", { ascending: false })
    .limit(3);

  const program = (programData ?? []) as ProgramLatihan[];

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute inset-0 gradient-glow pointer-events-none" />
        <div className="relative flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-amber-400 text-xs font-bold uppercase tracking-widest">
              Dashboard Atlet
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-1.5">
              Halo, {nama.split(" ")[0]}! Siap latihan hari ini?
            </h1>
            <p className="text-slate-300 text-sm mt-2 max-w-lg">
              {berjalan
                ? "Sesi latihan Anda sedang berjalan. Ambil foto selesai saat latihan berakhir."
                : "Lakukan absensi saat memulai latihan dan akhiri dengan foto saat selesai."}
            </p>
          </div>
          <Link
            href="/dashboard/absensi"
            className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-6 py-3 rounded-xl transition-all transform hover:-translate-y-0.5 shadow-lg shadow-amber-400/20"
          >
            <Camera className="w-5 h-5" />
            {berjalan ? "Selesaikan Latihan" : "Absensi Latihan"}
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Total Sesi"
          value={selesai.length}
          sub="Sesi latihan selesai"
          icon={CalendarCheck}
          tone="blue"
        />
        <StatCard
          label="Total Jam Latihan"
          value={formatDurasi(totalMenit)}
          sub="Akumulasi seluruh periode"
          icon={Clock3}
          tone="amber"
        />
        <StatCard
          label="Hari Aktif"
          value={hariAktif}
          sub="Hari dengan absensi"
          icon={Activity}
          tone="emerald"
        />
        <StatCard
          label="30 Hari Terakhir"
          value={total30.length}
          sub="Sesi dalam 30 hari"
          icon={Trophy}
          tone="slate"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Riwayat Latihan Terakhir"
            description="Catatan kehadiran dan durasi latihan Anda"
            action={
              <Link
                href="/dashboard/riwayat"
                className="text-sm font-semibold text-amber-600 hover:underline inline-flex items-center gap-1"
              >
                Lihat semua <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            }
          />
          {sesi.length === 0 ? (
            <EmptyState
              title="Belum ada riwayat latihan"
              description="Mulai lakukan absensi untuk membangun riwayat latihan Anda."
              icon={Camera}
              action={
                <Link
                  href="/dashboard/absensi"
                  className="inline-block bg-slate-900 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-slate-800"
                >
                  Mulai Absensi
                </Link>
              }
            />
          ) : (
            <ul className="divide-y divide-slate-100">
              {sesi.slice(0, 5).map((s) => (
                <li key={s.id} className="px-5 sm:px-6 py-4 flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-800 text-sm">
                      {formatTanggal(s.started_at)}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {formatWaktu(s.started_at)}
                      {s.lokasi ? ` · ${s.lokasi}` : ""}
                    </p>
                  </div>
                  {s.status === "berjalan" ? (
                    <Badge tone="amber">Berjalan</Badge>
                  ) : (
                    <Badge tone="emerald">{formatDurasi(s.durasi_menit)}</Badge>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <CardHeader
            title="Program Latihan Terbaru"
            description="Dari pelatih Anda"
            action={
              <Link
                href="/dashboard/program"
                className="text-sm font-semibold text-amber-600 hover:underline inline-flex items-center gap-1"
              >
                Semua <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            }
          />
          {program.length === 0 ? (
            <EmptyState
              title="Belum ada program"
              description="Program latihan dari pelatih akan tampil di sini."
              icon={ClipboardList}
            />
          ) : (
            <ul className="divide-y divide-slate-100">
              {program.map((p) => (
                <li key={p.id} className="px-5 sm:px-6 py-4">
                  <p className="font-semibold text-slate-800 text-sm">{p.judul}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {formatTanggal(p.tanggal)}
                    {p.durasi_menit ? ` · ${p.durasi_menit} menit` : ""}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card className="p-5 sm:p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-slate-900">Target Jam Latihan Bulanan</h3>
          <span className="text-sm font-bold text-amber-600">
            {formatDurasi(total30.reduce((a, b) => a + (b.durasi_menit ?? 0), 0))} / 60 Jam
          </span>
        </div>
        <ProgressBar
          value={total30.reduce((a, b) => a + (b.durasi_menit ?? 0), 0)}
          max={3600}
        />
        <p className="text-xs text-slate-500 mt-2">
          Target bulanan 60 jam. Puedes mencapai target dengan rata-rata 2 jam latihan
          per hari selama 30 hari.
        </p>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PELATIH                                                            */
/* ------------------------------------------------------------------ */
async function PelatihDashboard({
  caborId,
  nama,
}: {
  caborId: string | null;
  nama: string;
}) {
  const supabase = await createClient();

  const { data: rekapData } = await supabase
    .from("rekap_atlet")
    .select("*")
    .eq("cabor_id", caborId ?? "__none__")
    .order("total_menit", { ascending: false });

  const rekap = (rekapData ?? []) as Array<{
    atlet_id: string;
    nama_atlet: string;
    total_sesi_selesai: number;
    total_menit: number;
    hari_aktif: number;
    terakhir_latihan: string | null;
  }>;

  const { data: programData } = await supabase
    .from("program_latihan")
    .select("*")
    .eq("pelatih_id", caborId ? undefined : undefined)
    .order("tanggal", { ascending: false })
    .limit(100);

  const program = ((programData ?? []) as ProgramLatihan[]).filter(
    (p) => p.cabor_id === caborId
  );

  const totalMenit = rekap.reduce((a, b) => a + Number(b.total_menit ?? 0), 0);
  const totalSesi = rekap.reduce((a, b) => a + Number(b.total_sesi_selesai ?? 0), 0);
  const atletAktif = rekap.filter((r) => Number(r.hari_aktif) > 0).length;

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute inset-0 gradient-glow pointer-events-none" />
        <div className="relative flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-amber-400 text-xs font-bold uppercase tracking-widest">
              Dashboard Pelatih
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-1.5">
              Pantau Kesiapan Atlet Anda
            </h1>
            <p className="text-slate-300 text-sm mt-2 max-w-lg">
              {nama} &middot; Monitoring kehadiran, durasi latihan, dan program
              latihan atlet binaan Anda.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard/program"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-5 py-3 rounded-xl transition-all"
            >
              <ClipboardList className="w-4.5 h-[18px] w-[18px] h-[18px]" />
              Kelola Program
            </Link>
            <Link
              href="/dashboard/atlet"
              className="inline-flex items-center gap-2 border border-slate-600 hover:border-amber-400 hover:text-amber-400 text-slate-200 font-semibold px-5 py-3 rounded-xl transition-all"
            >
              <Users className="w-[18px] h-[18px]" />
              Data Atlet
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Jumlah Atlet" value={rekap.length} sub="Atlet binaan" icon={Users} tone="blue" />
        <StatCard label="Atlet Aktif" value={atletAktif} sub="Pernah absensi" icon={Activity} tone="emerald" />
        <StatCard label="Total Sesi" value={totalSesi} sub="Sesi selesai" icon={CalendarCheck} tone="slate" />
        <StatCard label="Total Jam Latihan" value={formatDurasi(totalMenit)} sub="Akumulasi atlet" icon={Clock3} tone="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Aktivitas Atlet"
            description="Diurutkan berdasarkan total durasi latihan"
            action={
              <Link
                href="/dashboard/atlet"
                className="text-sm font-semibold text-amber-600 hover:underline inline-flex items-center gap-1"
              >
                Detail <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            }
          />
          {rekap.length === 0 ? (
            <EmptyState
              title="Belum ada atlet terdaftar"
              description="Atlet akan muncul di sini setelah terdaftar pada cabang olahraga Anda."
              icon={Users}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-slate-500 border-b border-slate-100">
                    <th className="px-5 sm:px-6 py-3 font-semibold">Atlet</th>
                    <th className="px-3 py-3 font-semibold">Sesi</th>
                    <th className="px-3 py-3 font-semibold">Durasi</th>
                    <th className="px-3 py-3 font-semibold">Hari Aktif</th>
                    <th className="px-5 sm:px-6 py-3 font-semibold text-right">Terakhir</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {rekap.map((r) => (
                    <tr key={r.atlet_id} className="hover:bg-slate-50/70">
                      <td className="px-5 sm:px-6 py-3.5 font-semibold text-slate-800">
                        {r.nama_atlet}
                      </td>
                      <td className="px-3 py-3.5 text-slate-600">{r.total_sesi_selesai}</td>
                      <td className="px-3 py-3.5 text-slate-600">
                        {formatDurasi(Number(r.total_menit))}
                      </td>
                      <td className="px-3 py-3.5 text-slate-600">{r.hari_aktif}</td>
                      <td className="px-5 sm:px-6 py-3.5 text-right text-slate-500 text-xs">
                        {r.terakhir_latihan ? relatif(r.terakhir_latihan) : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Card>
          <CardHeader title="Program Terakhir" description="Yang Anda terbitkan" />
          {program.length === 0 ? (
            <EmptyState
              title="Belum ada program"
              description="Terbitkan program latihan pertama Anda."
              icon={ClipboardList}
            />
          ) : (
            <ul className="divide-y divide-slate-100">
              {program.slice(0, 5).map((p) => (
                <li key={p.id} className="px-5 sm:px-6 py-4">
                  <p className="font-semibold text-slate-800 text-sm">{p.judul}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {formatTanggal(p.tanggal)}
                    {p.durasi_menit ? ` · ${p.durasi_menit} menit` : ""}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  ADMIN / PUSLATKOT - KONI                                           */
/* ------------------------------------------------------------------ */
async function AdminDashboard() {
  const supabase = await createClient();

  const [{ data: profilData }, { data: caborData }, { data: rekapCaborData }] =
    await Promise.all([
      supabase.from("profiles").select("id, role"),
      supabase.from("cabor").select("id, nama, kode").eq("aktif", true),
      supabase.from("rekap_cabor").select("*").order("total_menit", { ascending: false }),
    ]);

  const profil = (profilData ?? []) as Array<{ id: string; role: string }>;
  const cabor = (caborData ?? []) as Array<{ id: string; nama: string; kode: string }>;
  const rekapCabor = (rekapCaborData ?? []) as Array<{
    cabor_id: string;
    nama_cabor: string;
    jumlah_atlet: number;
    total_sesi: number;
    total_menit: number;
  }>;

  const atlet = profil.filter((p) => p.role === "atlet").length;
  const pelatih = profil.filter((p) => p.role === "pelatih").length;
  const totalSesi = rekapCabor.reduce((a, b) => a + Number(b.total_sesi ?? 0), 0);
  const totalMenit = rekapCabor.reduce((a, b) => a + Number(b.total_menit ?? 0), 0);
  const maxMenit = Math.max(1, ...rekapCabor.map((r) => Number(r.total_menit ?? 0)));

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 text-white rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute inset-0 gradient-glow pointer-events-none" />
        <div className="relative flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-amber-400 text-xs font-bold uppercase tracking-widest">
              Dashboard Puslatkot &amp; KONI
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-1.5">
              Monitoring Keaktifan Seluruh Cabang Olahraga
            </h1>
            <p className="text-slate-300 text-sm mt-2 max-w-xl">
              Data rekapitulasi absensi dan durasi latihan seluruh atlet dalam satu
              tampilan untuk monitoring dan evaluasi pembinaan.
            </p>
          </div>
          <Link
            href="/dashboard/monitor"
            className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-5 py-3 rounded-xl transition-all"
          >
            <ShieldCheck className="w-[18px] h-[18px]" />
            Buka Monitoring
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Total Atlet" value={atlet} sub="Atlet terdaftar" icon={Activity} tone="blue" />
        <StatCard label="Total Pelatih" value={pelatih} sub="Pelatih terdaftar" icon={Users} tone="emerald" />
        <StatCard label="Cabang Olahraga" value={cabor.length} sub="Cabor aktif" icon={Dumbbell} tone="slate" />
        <StatCard label="Total Jam Latihan" value={formatDurasi(totalMenit)} sub={`${totalSesi} sesi`} icon={Clock3} tone="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Rekapitulasi per Cabang Olahraga"
            description="Total durasi latihan seluruh atlet per cabor"
            action={
              <Link
                href="/dashboard/monitor"
                className="text-sm font-semibold text-amber-600 hover:underline inline-flex items-center gap-1"
              >
                Detail <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            }
          />
          {rekapCabor.length === 0 ? (
            <EmptyState
              title="Belum ada data latihan"
              description="Data akan muncul setelah atlet mulai melakukan absensi."
              icon={Activity}
            />
          ) : (
            <ul className="divide-y divide-slate-100">
              {rekapCabor.slice(0, 8).map((r) => (
                <li key={r.cabor_id} className="px-5 sm:px-6 py-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="font-semibold text-slate-800 flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-amber-500" />
                      {r.nama_cabor}
                    </span>
                    <span className="text-slate-500 text-xs">
                      {r.jumlah_atlet} atlet · {r.total_sesi} sesi ·{" "}
                      <span className="font-bold text-slate-700">
                        {formatDurasi(Number(r.total_menit))}
                      </span>
                    </span>
                  </div>
                  <ProgressBar value={Number(r.total_menit)} max={maxMenit} />
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <CardHeader title="Aksi Cepat" description="Pengelolaan data aplikasi" />
          <div className="p-5 space-y-3">
            {[
              { href: "/dashboard/pengguna", label: "Kelola Pengguna", desc: "Atlet, pelatih, dan admin", icon: Users },
              { href: "/dashboard/cabor", label: "Kelola Cabor", desc: "Master cabang olahraga", icon: Dumbbell },
              { href: "/dashboard/monitor", label: "Monitoring", desc: "Rekap seluruh aktivitas", icon: Activity },
            ].map(({ href, label, desc, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/40 transition"
              >
                <span className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </span>
                <span className="min-w-0">
                  <span className="block font-semibold text-slate-800 text-sm">{label}</span>
                  <span className="block text-xs text-slate-500">{desc}</span>
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400 ml-auto" />
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
