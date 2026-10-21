"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Camera,
  X,
  Loader2,
  MapPin,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

type Gps = { lat: number; lng: number; akurasi: number } | null;

export default function KameraAbsensi({
  onCapture,
  onClose,
  jenis,
}: {
  onCapture: (blob: Blob, gps: Gps) => void;
  onClose: () => void;
  jenis: "mulai" | "selesai";
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [gps, setGps] = useState<Gps>(null);
  const [gpsLoading, setGpsLoading] = useState(true);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturing, setCapturing] = useState(false);

  const gpsDidukung =
    typeof navigator !== "undefined" && "geolocation" in navigator;

  const onGpsSuccess = useCallback((pos: GeolocationPosition) => {
    setGps({
      lat: pos.coords.latitude,
      lng: pos.coords.longitude,
      akurasi: pos.coords.accuracy,
    });
    setGpsError(null);
    setGpsLoading(false);
  }, []);

  const onGpsError = useCallback((err: GeolocationPositionError) => {
    setGpsError(err.message || "Gagal mendapatkan lokasi GPS.");
    setGpsLoading(false);
  }, []);

  const requestGps = useCallback(
    (tampilkanLoading: boolean) => {
      if (tampilkanLoading) {
        setGpsLoading(true);
        setGpsError(null);
      }

      if (!("geolocation" in navigator)) {
        setGpsError("Perangkat tidak mendukung GPS.");
        setGpsLoading(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(onGpsSuccess, onGpsError, {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      });
    },
    [onGpsSuccess, onGpsError]
  );

  useEffect(() => {
    if (gpsDidukung) {
      navigator.geolocation.getCurrentPosition(onGpsSuccess, onGpsError, {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      });
    } else {
      queueMicrotask(() => {
        setGpsError("Perangkat tidak mendukung GPS.");
        setGpsLoading(false);
      });
    }

    let cancelled = false;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 1280 } },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch {
        queueMicrotask(() =>
          setCameraError(
            "Tidak dapat mengakses kamera. Gunakan tombol Unggah Foto sebagai gantinya."
          )
        );
      }
    })();

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [gpsDidukung, onGpsSuccess, onGpsError]);

  const takeShot = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    setCapturing(true);

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setCapturing(false);
      return;
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(
      (blob) => {
        setCapturing(false);
        if (blob) onCapture(blob, gps);
      },
      "image/jpeg",
      0.85
    );
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onCapture(file, gps);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div>
            <h3 className="font-bold text-white">
              {jenis === "mulai"
                ? "Absensi Mulai Latihan"
                : "Absensi Selesai Latihan"}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Pastikan wajah terlihat jelas dan GPS aktif.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative bg-black aspect-[3/4] max-h-[52vh]">
          <video
            ref={videoRef}
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          {cameraError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-slate-300">
              <AlertTriangle className="w-10 h-10 text-amber-400 mb-3" />
              <p className="text-sm">{cameraError}</p>
            </div>
          )}
          <div className="absolute inset-0 border-[3rem] border-slate-950/40 pointer-events-none" />
        </div>

        <div className="px-5 py-3 border-t border-slate-800 flex items-center gap-3 text-xs">
          {gpsLoading ? (
            <span className="flex items-center gap-2 text-slate-400">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Mengambil lokasi
              GPS...
            </span>
          ) : gpsError ? (
            <span className="flex items-center gap-2 text-rose-400">
              <AlertTriangle className="w-3.5 h-3.5" /> {gpsError}
            </span>
          ) : gps ? (
            <span className="flex items-center gap-2 text-emerald-400 font-mono">
              <MapPin className="w-3.5 h-3.5" />
              {gps.lat.toFixed(5)}, {gps.lng.toFixed(5)} (&#177;
              {Math.round(gps.akurasi)} m)
            </span>
          ) : (
            <span className="text-slate-500">Lokasi belum tersedia</span>
          )}
          <button
            type="button"
            onClick={() => requestGps(true)}
            className="ml-auto text-slate-400 hover:text-amber-400 inline-flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Perbarui
          </button>
        </div>

        <div className="px-5 py-4 flex items-center gap-3">
          <button
            type="button"
            onClick={takeShot}
            disabled={!!cameraError || !gps || capturing}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 hover:bg-amber-500 disabled:opacity-50 text-slate-950 font-bold py-3 transition"
          >
            {capturing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Camera className="w-4 h-4" />
            )}
            Ambil Foto
          </button>

          <label className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 hover:border-amber-400 text-slate-200 font-semibold py-3 cursor-pointer transition">
            <CheckCircle2 className="w-4 h-4" />
            Unggah Foto
            <input
              type="file"
              accept="image/*"
              capture="user"
              className="hidden"
              onChange={onFileChange}
            />
          </label>
        </div>
      </div>
    </div>
  );
}
