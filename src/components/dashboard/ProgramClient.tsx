"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ClipboardList,
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  CalendarDays,
  Clock,
  CheckCircle2,
  AlertCircle,
  Dumbbell,
} from "lucide-react";
import {
  createProgramAction,
  updateProgramAction,
  deleteProgramAction,
} from "@/app/dashboard/actions";
import { formatTanggal } from "@/lib/utils";
import type { ActionResult, Cabor, ProgramLatihan } from "@/lib/types";

type Pelatih = { id: string; nama: string };

export default function ProgramClient({
  role,
  programs,
  cabor,
  caborId,
  pelatih,
}: {
  role: "atlet" | "pelatih";
  programs: ProgramLatihan[];
  cabor: Cabor[];
  caborId: string | null;
  pelatih: Pelatih[];
}) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<ProgramLatihan | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<ActionResult | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const isPelatih = role === "pelatih";

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const fd = new FormData(e.currentTarget);

    const result = editing
      ? await updateProgramAction(fd)
      : await createProgramAction(fd);

    setLoading(false);
    setMessage(result);
    if (result.ok) {
      setFormOpen(false);
      setEditing(null);
      router.refresh();
    }
  };

  const hapus = async (id: string) => {
    if (!confirm("Hapus program latihan ini?")) return;
    setLoading(true);
    const fd = new FormData();
    fd.append("id", id);
    const result = await deleteProgramAction(fd);
    setLoading(false);
    setMessage(result);
    if (result.ok) router.refresh();
  };

  const bukaEdit = (p: ProgramLatihan) => {
    setEditing(p);
    setFormOpen(true);
    setMessage(null);
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

      {isPelatih && (
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
            {formOpen ? "Tutup Form" : "Unggah Program Latihan"}
          </button>
        </div>
      )}

      {isPelatih && formOpen && (
        <form
          onSubmit={submit}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4"
        >
          <h3 className="font-bold text-slate-900">
            {editing ? "Ubah Program Latihan" : "Form Program Latihan Baru"}
          </h3>

          {editing && <input type="hidden" name="id" value={editing.id} />}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Judul Program
              </label>
              <input
                name="judul"
                required
                defaultValue={editing?.judul ?? ""}
                placeholder="Contoh: Latihan Fisik Terapan - Day 1"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Cabang Olahraga
              </label>
              <select
                name="cabor_id"
                required
                defaultValue={editing?.cabor_id ?? caborId ?? ""}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition"
              >
                <option value="">-- Pilih Cabor --</option>
                {cabor.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nama}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Tanggal
              </label>
              <input
                type="date"
                name="tanggal"
                defaultValue={editing?.tanggal ?? new Date().toISOString().slice(0, 10)}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Durasi (menit)
              </label>
              <input
                type="number"
                name="durasi_menit"
                min={0}
                defaultValue={editing?.durasi_menit ?? 90}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Materi Latihan
              </label>
              <textarea
                name="materi"
                rows={5}
                defaultValue={editing?.materi ?? ""}
                placeholder={"1. Pemanasan (10 menit)\n2. Latihan inti (60 menit)\n3. Pendinginan (10 menit)"}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Catatan Pelatih
              </label>
              <textarea
                name="catatan"
                rows={2}
                defaultValue={editing?.catatan ?? ""}
                placeholder="Catatan tambahan untuk atlet"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-5 py-3 rounded-xl transition disabled:opacity-60"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {editing ? "Simpan Perubahan" : "Terbitkan Program"}
          </button>
        </form>
      )}

      {programs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm text-center py-16 px-6">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <ClipboardList className="w-6 h-6" />
          </div>
          <p className="font-semibold text-slate-800">
            {isPelatih ? "Belum ada program latihan" : "Belum ada program latihan"}
          </p>
          <p className="text-sm text-slate-500 mt-1">
            {isPelatih
              ? "Unggah program latihan agar dapat dilihat oleh atlet cabor Anda."
              : "Program latihan dari pelatih akan tampil di sini."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {programs.map((p) => {
            const namaCabor = p.cabor_id
              ? cabor.find((c) => c.id === p.cabor_id)?.nama
              : null;
            const pelatihNama =
              pelatih.find((x) => x.id === p.pelatih_id)?.nama ?? "Pelatih";
            return (
              <article
                key={p.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
              >
                <div className="px-5 py-4 border-b border-slate-100 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <Dumbbell className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-slate-900 leading-snug">{p.judul}</h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-1.5">
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays className="w-3.5 h-3.5" />
                        {formatTanggal(p.tanggal)}
                      </span>
                      {p.durasi_menit ? (
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {p.durasi_menit} menit
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="px-5 py-4">
                  <p className="text-xs text-slate-500 mb-1">Pelatih: {pelatihNama}</p>
                  {namaCabor && <p className="text-xs text-slate-500 mb-3">Cabor: {namaCabor}</p>}

                  {p.materi && (
                    <button
                      type="button"
                      onClick={() => setExpanded(expanded === p.id ? null : p.id)}
                      className="text-sm font-semibold text-amber-600 hover:underline"
                    >
                      {expanded === p.id ? "Sembunyikan Materi" : "Lihat Materi Latihan"}
                    </button>
                  )}

                  {expanded === p.id && p.materi && (
                    <pre className="mt-3 text-sm text-slate-600 whitespace-pre-wrap font-sans bg-slate-50 rounded-xl p-4 border border-slate-100">
                      {p.materi}
                    </pre>
                  )}

                  {p.catatan && !expanded && (
                    <p className="mt-3 text-sm text-slate-600 bg-amber-50/60 border border-amber-100 rounded-xl p-3">
                      {p.catatan}
                    </p>
                  )}
                </div>

                {isPelatih && (
                  <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      Diperbarui {formatTanggal(p.updated_at ?? p.created_at)}
                    </span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => bukaEdit(p)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded-lg hover:bg-slate-100"
                      >
                        <Pencil className="w-3.5 h-3.5" /> Ubah
                      </button>
                      <button
                        type="button"
                        onClick={() => hapus(p.id)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 px-2.5 py-1.5 rounded-lg hover:bg-rose-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Hapus
                      </button>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
