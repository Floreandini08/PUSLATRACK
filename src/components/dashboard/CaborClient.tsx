"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dumbbell,
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  MapPin,
} from "lucide-react";
import {
  createCaborAction,
  updateCaborAction,
  deleteCaborAction,
} from "@/app/dashboard/actions";
import type { ActionResult, Cabor } from "@/lib/types";

const inputClass =
  "w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition";

export default function CaborClient({ cabor }: { cabor: Cabor[] }) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Cabor | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<ActionResult | null>(null);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const fd = new FormData(e.currentTarget);
    const result = editing ? await updateCaborAction(fd) : await createCaborAction(fd);
    setLoading(false);
    setMessage(result);
    if (result.ok) {
      setFormOpen(false);
      setEditing(null);
      router.refresh();
    }
  };

  const hapus = async (id: string) => {
    if (!confirm("Hapus cabang olahraga ini?")) return;
    setLoading(true);
    const fd = new FormData();
    fd.append("id", id);
    const result = await deleteCaborAction(fd);
    setLoading(false);
    setMessage(result);
    if (result.ok) router.refresh();
  };

  return (
    <div className="space-y-5">
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

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setFormOpen((v) => !v);
          }}
          className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-5 py-3 rounded-xl transition"
        >
          {formOpen ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {formOpen ? "Tutup Form" : "Tambah Cabang Olahraga"}
        </button>
      </div>

      {formOpen && (
        <form
          onSubmit={submit}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4"
        >
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <Dumbbell className="w-4 h-4 text-amber-500" />
            {editing ? "Ubah Cabang Olahraga" : "Tambah Cabang Olahraga"}
          </h3>

          {editing && <input type="hidden" name="id" value={editing.id} />}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Nama Cabang Olahraga
              </label>
              <input
                name="nama"
                required
                defaultValue={editing?.nama ?? ""}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Kode
              </label>
              <input
                name="kode"
                required
                maxLength={5}
                defaultValue={editing?.kode ?? ""}
                placeholder="TKD"
                className={`${inputClass} uppercase`}
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Deskripsi
              </label>
              <textarea
                name="deskripsi"
                rows={2}
                defaultValue={editing?.deskripsi ?? ""}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Latitude
              </label>
              <input
                name="latitude"
                type="number"
                step="any"
                defaultValue={editing?.latitude ?? ""}
                placeholder="-7.2570"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Longitude
              </label>
              <input
                name="longitude"
                type="number"
                step="any"
                defaultValue={editing?.longitude ?? ""}
                placeholder="112.7520"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Radius (meter)
              </label>
              <input
                name="radius_m"
                type="number"
                min={0}
                defaultValue={editing?.radius_m ?? 200}
                className={inputClass}
              />
            </div>

            {editing && (
              <div className="sm:col-span-3 flex items-center gap-2">
                <input
                  id="aktif"
                  name="aktif"
                  type="checkbox"
                  value="true"
                  defaultChecked={editing.aktif}
                  className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-400"
                />
                <label htmlFor="aktif" className="text-sm text-slate-700">
                  Cabor aktif dan dapat dipilih pengguna
                </label>
              </div>
            )}
          </div>

          <p className="text-xs text-slate-500 flex items-start gap-1.5">
            <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-amber-500" />
            Koordinat dan radius digunakan sebagai acuan area latihan saat absensi
            dilakukan.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-5 py-3 rounded-xl transition disabled:opacity-60"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {editing ? "Simpan Perubahan" : "Tambah Cabor"}
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cabor.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col"
          >
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-extrabold text-sm shrink-0">
                {c.kode}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-slate-900 leading-snug">{c.nama}</h3>
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                  {c.deskripsi ?? "Tanpa deskripsi"}
                </p>
              </div>
            </div>

            <div className="mt-4 flex-1 flex items-end justify-between">
              <div className="text-xs text-slate-500 space-y-1">
                {c.latitude != null && c.longitude != null ? (
                  <p className="font-mono">
                    {c.latitude.toFixed(4)}, {c.longitude.toFixed(4)}
                  </p>
                ) : (
                  <p>Koordinat belum diisi</p>
                )}
                <p>Radius validasi {c.radius_m} m</p>
                {!c.aktif && (
                  <span className="inline-block text-rose-600 font-semibold">Nonaktif</span>
                )}
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setEditing(c);
                    setFormOpen(true);
                  }}
                  className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                  aria-label="Ubah cabor"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => hapus(c.id)}
                  className="p-2 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                  aria-label="Hapus cabor"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {cabor.length === 0 && (
          <p className="text-sm text-slate-400 col-span-full text-center py-10">
            Belum ada cabang olahraga.
          </p>
        )}
      </div>
    </div>
  );
}
