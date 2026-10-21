"use client";

import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { Activity, Users, Clock3, Dumbbell, Search } from "lucide-react";
import { formatDurasi, inisial } from "@/lib/utils";
import { StatCard } from "@/components/ui";
import type { RekapAtlet, RekapCabor } from "@/lib/types";

export default function MonitorClient({
  rekapCabor,
  rekapAtlet,
}: {
  rekapCabor: RekapCabor[];
  rekapAtlet: RekapAtlet[];
}) {
  const [cari, setCari] = useState("");

  const chartData = useMemo(
    () =>
      rekapCabor
        .filter((r) => Number(r.total_menit) > 0 || Number(r.jumlah_atlet) > 0)
        .slice(0, 12)
        .map((r) => ({
          nama: r.nama_cabor.length > 12 ? `${r.nama_cabor.slice(0, 12)}…` : r.nama_cabor,
          "Total Jam": Math.round(Number(r.total_menit) / 60),
          Sesi: Number(r.total_sesi),
          Atlet: Number(r.jumlah_atlet),
        })),
    [rekapCabor]
  );

  const atletTerfilter = rekapAtlet.filter((a) =>
    a.nama_atlet.toLowerCase().includes(cari.trim().toLowerCase())
  );

  const totalMenit = rekapCabor.reduce((a, b) => a + Number(b.total_menit ?? 0), 0);
  const totalSesi = rekapCabor.reduce((a, b) => a + Number(b.total_sesi ?? 0), 0);
  const totalAtlet = rekapAtlet.length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Total Atlet" value={totalAtlet} icon={Users} tone="blue" />
        <StatCard label="Total Sesi" value={totalSesi} icon={Activity} tone="emerald" />
        <StatCard
          label="Total Jam Latihan"
          value={formatDurasi(totalMenit)}
          icon={Clock3}
          tone="amber"
        />
        <StatCard label="Cabang Olahraga" value={rekapCabor.length} icon={Dumbbell} tone="slate" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <div className="xl:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <h3 className="font-bold text-slate-900 mb-1">Grafik Aktivitas per Cabor</h3>
          <p className="text-sm text-slate-500 mb-4">
            Perbandingan total jam latihan dan jumlah sesi pada setiap cabang olahraga.
          </p>
          {chartData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-sm text-slate-400">
              Belum ada data untuk ditampilkan.
            </div>
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 8, right: 8, left: -18, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="nama" tick={{ fontSize: 11, fill: "#64748b" }} interval={0} angle={-20} textAnchor="end" height={60} />
                  <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid #e2e8f0",
                      fontSize: 12,
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="Total Jam" fill="#fbbf24" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="Sesi" fill="#1e293b" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <h3 className="font-bold text-slate-900 mb-4">Rekap per Cabang Olahraga</h3>
          <ul className="space-y-3 max-h-[22rem] overflow-y-auto pr-1">
            {rekapCabor.map((r) => {
              const max = Math.max(1, ...rekapCabor.map((x) => Number(x.total_menit)));
              return (
                <li key={r.cabor_id}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="font-semibold text-slate-800 flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center text-[10px] font-bold">
                        {r.kode}
                      </span>
                      {r.nama_cabor}
                    </span>
                    <span className="text-xs text-slate-500">
                      {r.jumlah_atlet} atlet &middot; {formatDurasi(Number(r.total_menit))}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-amber-400 h-2 rounded-full"
                      style={{ width: `${Math.round((Number(r.total_menit) / max) * 100)}%` }}
                    />
                  </div>
                </li>
              );
            })}
            {rekapCabor.length === 0 && (
              <li className="text-sm text-slate-400 text-center py-8">
                Belum ada data cabang olahraga.
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex flex-wrap items-center gap-3">
          <div className="min-w-[200px] flex-1">
            <h3 className="font-bold text-slate-900">Rekapitulasi Per Atlet</h3>
            <p className="text-sm text-slate-500 mt-0.5">
              Dasar evaluasi keaktifan atlet seluruh cabang olahraga.
            </p>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              value={cari}
              onChange={(e) => setCari(e.target.value)}
              placeholder="Cari atlet..."
              className="w-full sm:w-64 rounded-xl border border-slate-300 bg-slate-50 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="px-5 sm:px-6 py-3 font-semibold">Atlet</th>
                <th className="px-3 py-3 font-semibold">Cabor</th>
                <th className="px-3 py-3 font-semibold">Sesi</th>
                <th className="px-3 py-3 font-semibold">Durasi</th>
                <th className="px-3 py-3 font-semibold">Hari Aktif</th>
                <th className="px-5 sm:px-6 py-3 font-semibold text-right">Terakhir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {atletTerfilter.map((a) => (
                <tr key={a.atlet_id} className="hover:bg-slate-50/70">
                  <td className="px-5 sm:px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center text-[11px] font-bold shrink-0">
                        {inisial(a.nama_atlet)}
                      </span>
                      <span className="font-semibold text-slate-800">{a.nama_atlet}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3.5 text-slate-600">{a.nama_cabor ?? "-"}</td>
                  <td className="px-3 py-3.5 text-slate-600">{a.total_sesi_selesai}</td>
                  <td className="px-3 py-3.5 font-semibold text-slate-800">
                    {formatDurasi(Number(a.total_menit))}
                  </td>
                  <td className="px-3 py-3.5 text-slate-600">{a.hari_aktif}</td>
                  <td className="px-5 sm:px-6 py-3.5 text-right text-xs text-slate-500">
                    {a.terakhir_latihan
                      ? new Date(a.terakhir_latihan).toLocaleDateString("id-ID")
                      : "-"}
                  </td>
                </tr>
              ))}
              {atletTerfilter.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-slate-400">
                    Tidak ada data atlet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
