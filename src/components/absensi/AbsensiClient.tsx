"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Camera,
  Loader2,
  MapPin,
  PlayCircle,
  StopCircle,
  CheckCircle2,
  AlertCircle,
  Clock3,
} from "lucide-react";
import KameraAbsensi from "@/components/absensi/KameraAbsensi";
import { absenMulaiAction, absenSelesaiAction } from "@/app/dashboard/actions";
import { formatWaktu, formatWaktuDetil, formatDurasi } from "@/lib/utils";
import type { ActionResult } from "@/lib/types";

type Sesi = { id: string; started_at: string; lokasi: string | null } | null;

export default function AbsensiClient({ sesi }: { sesi: Sesi }) {
  const router = useRouter();
  const [modal, setModal] = useState<null | "mulai" | "selesai">(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<ActionResult | null>(null);
  const [lokasi, setLokasi] = useState("");
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const elapsed = sesi
    ? Math.max(0, Math.floor((now - new Date(sesi.started_at).getTime()) / 1000))
    : 0;

  const jam = String(Math.floor(elapsed / 3600)).padStart(2, "0");
  const menit = String(Math.floor((elapsed % 3600) / 60)).padStart(2, "0");
  const detik = String(elapsed % 60).padStart(2, "0");

  const deviceInfo =
    typeof navigator !== "undefined"
      ? `${navigator.userAgent}`.slice(0, 200)
      : "";

  const handleCapture = async (blob: Blob, gps: { lat: number; lng: number } | null) => {
    setModal(null);
    setLoading(true);
    setMessage(null);

    const fd = new FormData();
    fd.append(
      "foto",
      new File([blob], `absensi-${Date.now()}.jpg`, { type: blob.type || "image/jpeg" })
    );
    if (gps) {
      fd.append("lat", String(gps.lat));
      fd.append("lng", String(gps.lng));
    }
    fd.append("lokasi", lokasi);
    fd.append("device", deviceInfo);

    const result = await absenMulaiAction(fd);

    setLoading(false);
    setMessage(result);
    router.refresh();
  };

  const handleCaptureSelesai = async (
    blob: Blob,
    gps: { lat: number; lng: number } | null
  ) => {
    setModal(null);
    setLoading(true);
    setMessage(null);

    const fd = new FormData();
    fd.append(
      "foto",
      new File([blob], `absensi-${Date.now()}.jpg`, { type: blob.type || "image/jpeg" })
    );
    fd.append("sesi_id", sesi?.id ?? "");
    if (gps) {
      fd.append("lat", String(gps.lat));
      fd.append("lng", String(gps.lng));
    }
    fd.append("device", deviceInfo);

    const result = await absenSelesaiAction(fd);
    setLoading(false);
    setMessage(result);
    router.refresh();
  };

  return (
    <div className="space-y-6">
      {message && (
        <div
          className={`rounded-2xl border px-5 py-4 flex items-start gap-3 ${
            message.ok
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-rose-200 bg-rose-50 text-rose-700"
          }`}
        >
          {message.ok ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          )}
          <p className="text-sm font-medium">{message.message}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Panel utama */}
        <div className="lg:col-span-3 bg-slate-900 text-white rounded-2xl p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute inset-0 gradient-glow pointer-events-none" />
          <div className="relative">
            {sesi ? (
              <>
                <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold px-3 py-1.5 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Sesi Latihan Berjalan
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold mt-4">
                  Latihan Sedang Berjalan
                </h2>
                <p className="text-slate-300 text-sm mt-2">
                  Dimulai pukul {formatWaktu(sesi.started_at)} &middot;{" "}
                  {formatWaktuDetil(sesi.started_at)}
                </p>

                <div className="mt-6 inline-flex items-center gap-3 bg-slate-950 border border-slate-800 rounded-2xl px-5 py-3">
                  <Clock3 className="w-5 h-5 text-amber-400" />
                  <span className="font-mono text-3xl font-bold tracking-wider text-amber-400">
                    {jam}:{menit}:{detik}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setModal("selesai")}
                  disabled={loading}
                  className="mt-6 w-full sm:w-auto inline-flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-bold px-6 py-3.5 rounded-xl transition-all disabled:opacity-60"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <StopCircle className="w-5 h-5" />
                  )}
                  Selesaikan Latihan
                </button>
              </>
            ) : (
              <>
                <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-semibold px-3 py-1.5 rounded-full">
                  <PlayCircle className="w-3.5 h-3.5" />
                  Siap Bertraining
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold mt-4">
                  Mulai Sesi Latihan
                </h2>
                <p className="text-slate-300 text-sm mt-2 max-w-md">
                  Ambil foto absensi di lokasi latihan. Sistem akan mengunci koordinat
                  GPS dan waktu pengambilan foto sebagai bukti kehadiran.
                </p>

                <div className="mt-6">
                  <label
                    htmlFor="lokasi"
                    className="block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2"
                  >
                    Lokasi Latihan (opsional)
                  </label>
                  <input
                    id="lokasi"
                    value={lokasi}
                    onChange={(e) => setLokasi(e.target.value)}
                    placeholder="Contoh: GOR Jayabaya Lapangan A"
                    className="w-full max-w-sm rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-amber-400 transition"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setModal("mulai")}
                  disabled={loading}
                  className="mt-6 w-full sm:w-auto inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-6 py-3.5 rounded-xl transition-all disabled:opacity-60"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Camera className="w-5 h-5" />
                  )}
                  Mulai Latihan
                </button>
              </>
            )}
          </div>
        </div>

        {/* Panel informasi */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h3 className="font-bold text-slate-900 mb-4">Ketentuan Absensi</h3>
            <ul className="space-y-3 text-sm text-slate-600">
              {[
                "Absensi dilakukan dua kali: saat mulai dan saat selesai latihan.",
                "Foto diambil langsung melalui kamera aplikasi (tidak bisa diunggah ulang).",
                "Koordinat GPS dan waktu pengambilan foto dicatat otomatis oleh sistem.",
                "Durasi latihan dihitung otomatis dari selisih waktu mulai dan selesai.",
              ].map((t) => (
                <li key={t} className="flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-500" />
              Informasi Lokasi
            </h3>
            <p className="text-sm text-slate-600">
              Pastikan GPS perangkat dalam keadaan aktif dan Anda berada di area latihan
              resmi. Lokasi yang tercatat akan dibandingkan dengan titik koordinat
              Puslatkot oleh pelatih dan pengelola.
            </p>
          </div>

          {sesi && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <p className="text-sm text-amber-900">
                <span className="font-bold">Durasi berjalan: {formatDurasi(Math.floor(elapsed / 60))}</span>
                <br />
                Sesi akan otomatis tercatat lengkap setelah Anda Ambil Foto Selesai.
              </p>
            </div>
          )}
        </div>
      </div>

      {modal === "mulai" && (
        <KameraAbsensi
          jenis="mulai"
          onCapture={handleCapture}
          onClose={() => setModal(null)}
        />
      )}
      {modal === "selesai" && (
        <KameraAbsensi
          jenis="selesai"
          onCapture={handleCaptureSelesai}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
