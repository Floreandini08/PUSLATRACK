"use client";

import { useMemo, useState } from "react";
import {
  Users,
  Search,
  Activity,
  Clock3,
  CalendarCheck,
  X,
  Camera,
  MapPin,
  ChevronRight,
} from "lucide-react";
import { formatDurasi, formatTanggal, formatWaktu, inisial, relatif } from "@/lib/utils";
import type { SesiLatihan } from "@/lib/types";

type Athlete = {
  atlet_id: string;
  nama_atlet: string;
  identitas: string | null;
  total_sesi_selesai: number;
  total_menit: number;
  hari_aktif: number;
  terakhir_latihan: string | null;
};

export default function AtletClient({
  atlet,
  sesi,
  cabor,
}: {
  atlet: Athlete[];
  sesi: SesiLatihan[];
  cabor: string | null;
}) {
  const [cari, setCari] = useState("");
  const [dipilih, setDipilih] = useState<Athlete | null>(null);

  const terfilter = useMemo(
    () =>
      atlet.filter((a) =>
        a.nama_atlet.toLowerCase().includes(cari.trim().toLowerCase())
      ),
    [atlet, cari]
  );

  const sesiAtlet = dipilih
    ? sesi
        .filter((s) => s.atlet_id === dipilih.atlet_id)
        .sort(
          (a, b) =>
            new Date(b.started_at).getTime() - new Date(a.started_at).getTime()
        )
    : [];

  const maxMenit = Math.max(1, ...atlet.map((a) => Number(a.total_menit ?? 0)));

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            value={cari}
            onChange={(e) => setCari(e.target.value)}
            placeholder="Cari nama atlet..."
            className="w-full rounded-xl border border-slate-300 bg-slate-50 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition"
          />
        </div>
        <div className="text-sm text-slate-500">
          <span className="font-bold text-slate-800">{atlet.length}</span> atlet
          {cabor ? ` · ${cabor}` : ""}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {terfilter.length === 0 ? (
          <div className="text-center py-16 px-6">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6" />
            </div>
            <p className="font-semibold text-slate-800">Tidak ada atlet ditemukan</p>
            <p className="text-sm text-slate-500 mt-1">
              Coba gunakan kata kunci pencarian yang lain.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-5 sm:px-6 py-3 font-semibold">Atlet</th>
                  <th className="px-3 py-3 font-semibold">Sesi</th>
                  <th className="px-3 py-3 font-semibold">Durasi Total</th>
                  <th className="px-3 py-3 font-semibold">Hari Aktif</th>
                  <th className="px-3 py-3 font-semibold hidden md:table-cell">
                    Proporsi
                  </th>
                  <th className="px-5 sm:px-6 py-3 font-semibold text-right">
                    Terakhir
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {terfilter.map((a) => (
                  <tr
                    key={a.atlet_id}
                    onClick={() => setDipilih(a)}
                    className="hover:bg-amber-50/40 cursor-pointer transition"
                  >
                    <td className="px-5 sm:px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="w-9 h-9 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center text-xs font-bold shrink-0">
                          {inisial(a.nama_atlet)}
                        </span>
                        <div>
                          <p className="font-semibold text-slate-800">{a.nama_atlet}</p>
                          <p className="text-xs text-slate-500">
                            {a.identitas ?? "Tanpa nomor identitas"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3.5 text-slate-600">{a.total_sesi_selesai}</td>
                    <td className="px-3 py-3.5 font-semibold text-slate-800">
                      {formatDurasi(Number(a.total_menit))}
                    </td>
                    <td className="px-3 py-3.5 text-slate-600">{a.hari_aktif}</td>
                    <td className="px-3 py-3.5 hidden md:table-cell">
                      <div className="w-28 bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-amber-400 h-2 rounded-full"
                          style={{
                            width: `${Math.round((Number(a.total_menit) / maxMenit) * 100)}%`,
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-5 sm:px-6 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-xs text-slate-500">
                          {a.terakhir_latihan ? relatif(a.terakhir_latihan) : "-"}
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-300" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {dipilih && (
        <div
          className="fixed inset-0 z-[60] bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setDipilih(null)}
        >
          <div
            className="w-full max-w-3xl max-h-[85vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-slate-100 px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center text-xs font-bold">
                  {inisial(dipilih.nama_atlet)}
                </span>
                <div>
                  <h3 className="font-bold text-slate-900">{dipilih.nama_atlet}</h3>
                  <p className="text-xs text-slate-500">
                    {dipilih.identitas ?? "Tanpa nomor identitas"} &middot; {cabor ?? "-"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDipilih(null)}
                className="text-slate-400 hover:text-slate-700"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 px-5 py-4">
              {[
                { label: "Total Sesi", value: dipilih.total_sesi_selesai, icon: CalendarCheck },
                { label: "Total Durasi", value: formatDurasi(Number(dipilih.total_menit)), icon: Clock3 },
                { label: "Hari Aktif", value: dipilih.hari_aktif, icon: Activity },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="bg-slate-50 rounded-xl p-3 text-center">
                  <Icon className="w-4 h-4 text-amber-500 mx-auto" />
                  <p className="text-lg font-extrabold text-slate-900 mt-1">{value}</p>
                  <p className="text-[11px] text-slate-500">{label}</p>
                </div>
              ))}
            </div>

            <div className="px-5 pb-5">
              <h4 className="font-semibold text-slate-800 text-sm mb-3">
                Riwayat Kehadiran
              </h4>
              {sesiAtlet.length === 0 ? (
                <p className="text-sm text-slate-500 py-6 text-center">
                  Belum ada riwayat latihan untuk atlet ini.
                </p>
              ) : (
                <ul className="divide-y divide-slate-100 border border-slate-100 rounded-xl">
                  {sesiAtlet.map((s) => (
                    <li key={s.id} className="px-4 py-3 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                        <Activity className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-800">
                          {formatTanggal(s.started_at)}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                          <span>{formatWaktu(s.started_at)}</span>
                          {s.lokasi ? (
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {s.lokasi}
                            </span>
                          ) : null}
                        </p>
                      </div>
                      {s.foto_mulai_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={s.foto_mulai_url}
                          alt="Bukti absensi"
                          className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                        />
                      ) : (
                        <Camera className="w-4 h-4 text-slate-300" />
                      )}
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                          s.status === "selesai"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-amber-200 bg-amber-50 text-amber-700"
                        }`}
                      >
                        {s.status === "selesai" ? formatDurasi(s.durasi_menit) : "Berjalan"}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
