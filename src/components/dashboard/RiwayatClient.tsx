"use client";

import { useState } from "react";
import { X, Camera, MapPin, Clock, Smartphone } from "lucide-react";
import { formatDurasi, formatWaktuDetil, formatTanggal } from "@/lib/utils";
import type { SesiLatihan } from "@/lib/types";

export default function RiwayatClient({ sesi }: { sesi: SesiLatihan[] }) {
  const [filter, setFilter] = useState<"semua" | "bulan" | "hari">("semua");
  const [detail, setDetail] = useState<SesiLatihan | null>(null);

  const now = new Date();
  const terfilter = sesi.filter((s) => {
    const d = new Date(s.started_at);
    if (filter === "bulan") {
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }
    if (filter === "hari") return d.toDateString() === now.toDateString();
    return true;
  });

  const totalMenit = terfilter
    .filter((s) => s.status === "selesai")
    .reduce((a, b) => a + (b.durasi_menit ?? 0), 0);

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-wrap items-center gap-3">
        <div className="flex rounded-xl border border-slate-200 overflow-hidden">
          {(
            [
              { key: "semua", label: "Semua" },
              { key: "bulan", label: "Bulan Ini" },
              { key: "hari", label: "Hari Ini" },
            ] as const
          ).map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 text-sm font-medium transition ${
                filter === f.key
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="ml-auto text-sm text-slate-500">
          <span className="font-bold text-slate-800">{terfilter.length}</span> sesi &middot;
          total{" "}
          <span className="font-bold text-slate-800">{formatDurasi(totalMenit)}</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {terfilter.length === 0 ? (
          <div className="text-center py-16 px-6">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <p className="font-semibold text-slate-800">Belum ada riwayat latihan</p>
            <p className="text-sm text-slate-500 mt-1">
              Riwayat akan muncul setelah Anda melakukan absensi latihan.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-5 sm:px-6 py-3 font-semibold">Tanggal</th>
                  <th className="px-3 py-3 font-semibold">Mulai</th>
                  <th className="px-3 py-3 font-semibold">Selesai</th>
                  <th className="px-3 py-3 font-semibold">Durasi</th>
                  <th className="px-3 py-3 font-semibold">Status</th>
                  <th className="px-5 sm:px-6 py-3 font-semibold text-right">Bukti</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {terfilter.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/70">
                    <td className="px-5 sm:px-6 py-3.5 font-semibold text-slate-800">
                      {formatTanggal(s.started_at)}
                    </td>
                    <td className="px-3 py-3.5 text-slate-600">
                      {s.started_at ? new Date(s.started_at).toLocaleTimeString("id-ID") : "-"}
                    </td>
                    <td className="px-3 py-3.5 text-slate-600">
                      {s.finished_at
                        ? new Date(s.finished_at).toLocaleTimeString("id-ID")
                        : "-"}
                    </td>
                    <td className="px-3 py-3.5 font-semibold text-slate-800">
                      {s.durasi_menit ? formatDurasi(s.durasi_menit) : "-"}
                    </td>
                    <td className="px-3 py-3.5">
                      {s.status === "selesai" ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700">
                          Selesai
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border border-amber-200 bg-amber-50 text-amber-700">
                          Berjalan
                        </span>
                      )}
                    </td>
                    <td className="px-5 sm:px-6 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => setDetail(s)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 hover:text-amber-500"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        Lihat
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {detail && (
        <div
          className="fixed inset-0 z-[60] bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setDetail(null)}
        >
          <div
            className="w-full max-w-3xl bg-white rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900">Detail Absensi</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {formatWaktuDetil(detail.started_at)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDetail(null)}
                className="text-slate-400 hover:text-slate-700"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
                  Foto Absensi Mulai
                </p>
                {detail.foto_mulai_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={detail.foto_mulai_url}
                    alt="Foto absensi mulai"
                    className="w-full rounded-xl border border-slate-200 object-cover aspect-[3/4]"
                  />
                ) : (
                  <div className="w-full rounded-xl border border-dashed border-slate-300 aspect-[3/4] flex items-center justify-center text-xs text-slate-400">
                    Tidak ada foto
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
                  Foto Absensi Selesai
                </p>
                {detail.foto_selesai_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={detail.foto_selesai_url}
                    alt="Foto absensi selesai"
                    className="w-full rounded-xl border border-slate-200 object-cover aspect-[3/4]"
                  />
                ) : (
                  <div className="w-full rounded-xl border border-dashed border-slate-300 aspect-[3/4] flex items-center justify-center text-xs text-slate-400">
                    Belum ada foto
                  </div>
                )}
              </div>
            </div>

            <div className="px-5 pb-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-slate-50 p-3 flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                <span className="text-slate-600 font-mono text-xs">
                  {detail.lat_mulai?.toFixed(5)}, {detail.lng_mulai?.toFixed(5)}
                </span>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 flex items-start gap-2">
                <Clock className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                <span className="text-slate-600 text-xs">
                  Durasi: {formatDurasi(detail.durasi_menit)}
                </span>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 flex items-start gap-2 sm:col-span-2">
                <Smartphone className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                <span className="text-slate-500 text-xs break-all">
                  {detail.device_info ?? "-"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
