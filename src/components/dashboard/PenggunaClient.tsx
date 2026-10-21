"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  UserCog,
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  Search,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  createUserAction,
  updateUserAction,
  deleteUserAction,
} from "@/app/dashboard/actions";
import { inisial, ROLE_LABEL } from "@/lib/utils";
import type { ActionResult, Cabor, Profile, Role } from "@/lib/types";

const inputClass =
  "w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition";

export default function PenggunaClient({
  users,
  cabor,
}: {
  users: Profile[];
  cabor: Cabor[];
}) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Profile | null>(null);
  const [cari, setCari] = useState("");
  const [filterRole, setFilterRole] = useState<"semua" | Role>("semua");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<ActionResult | null>(null);

  const terfilter = useMemo(
    () =>
      users.filter((u) => {
        const cocokCari = u.nama.toLowerCase().includes(cari.trim().toLowerCase());
        const cocokRole = filterRole === "semua" || u.role === filterRole;
        return cocokCari && cocokRole;
      }),
    [users, cari, filterRole]
  );

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const fd = new FormData(e.currentTarget);
    const result = editing ? await updateUserAction(fd) : await createUserAction(fd);
    setLoading(false);
    setMessage(result);
    if (result.ok) {
      setFormOpen(false);
      setEditing(null);
      router.refresh();
    }
  };

  const hapus = async (id: string) => {
    if (!confirm("Hapus pengguna ini? Data absensinya ikut terhapus.")) return;
    setLoading(true);
    const fd = new FormData();
    fd.append("id", id);
    const result = await deleteUserAction(fd);
    setLoading(false);
    setMessage(result);
    if (result.ok) router.refresh();
  };

  const namaCabor = (id: string | null) => cabor.find((c) => c.id === id)?.nama ?? "-";

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

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            value={cari}
            onChange={(e) => setCari(e.target.value)}
            placeholder="Cari nama pengguna..."
            className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition"
          />
        </div>

        <div className="flex rounded-xl border border-slate-200 bg-white overflow-hidden">
          {(
            [
              { key: "semua", label: "Semua" },
              { key: "atlet", label: "Atlet" },
              { key: "pelatih", label: "Pelatih" },
              { key: "admin", label: "Admin" },
            ] as const
          ).map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilterRole(f.key)}
              className={`px-4 py-2 text-sm font-medium transition ${
                filterRole === f.key ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setFormOpen((v) => !v);
          }}
          className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-5 py-3 rounded-xl transition"
        >
          {formOpen ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {formOpen ? "Tutup" : "Tambah Pengguna"}
        </button>
      </div>

      {formOpen && (
        <form
          onSubmit={submit}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4"
        >
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <UserCog className="w-4 h-4 text-amber-500" />
            {editing ? "Ubah Data Pengguna" : "Tambah Pengguna Baru"}
          </h3>

          {editing && <input type="hidden" name="id" value={editing.id} />}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Nama Lengkap
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
                Peran
              </label>
              <select
                name="role"
                defaultValue={editing?.role ?? "atlet"}
                className={inputClass}
              >
                <option value="atlet">Atlet</option>
                <option value="pelatih">Pelatih</option>
                <option value="admin">Admin / Puslatkot</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Nomor Identitas
              </label>
              <input
                name="identitas"
                defaultValue={editing?.identitas ?? ""}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Cabang Olahraga
              </label>
              <select
                name="cabor_id"
                defaultValue={editing?.cabor_id ?? ""}
                className={inputClass}
              >
                <option value="">-- Tanpa Cabor --</option>
                {cabor.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nama}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Nomor Telepon
              </label>
              <input
                name="telepon"
                defaultValue={editing?.telepon ?? ""}
                className={inputClass}
              />
            </div>

            {!editing && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  className={inputClass}
                />
              </div>
            )}

            {!editing && (
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Kata Sandi
                </label>
                <input
                  name="password"
                  type="text"
                  required
                  minLength={6}
                  className={inputClass}
                  placeholder="Minimal 6 karakter"
                />
              </div>
            )}

            {editing && (
              <div className="sm:col-span-2 flex items-center gap-2">
                <input
                  id="aktif"
                  name="aktif"
                  type="checkbox"
                  value="true"
                  defaultChecked={editing.aktif}
                  className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-400"
                />
                <label htmlFor="aktif" className="text-sm text-slate-700">
                  Akun aktif dan dapat masuk aplikasi
                </label>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-5 py-3 rounded-xl transition disabled:opacity-60"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {editing ? "Simpan Perubahan" : "Buat Akun"}
          </button>
        </form>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="px-5 sm:px-6 py-3 font-semibold">Pengguna</th>
                <th className="px-3 py-3 font-semibold">Peran</th>
                <th className="px-3 py-3 font-semibold hidden md:table-cell">Cabor</th>
                <th className="px-3 py-3 font-semibold hidden lg:table-cell">Identitas</th>
                <th className="px-5 sm:px-6 py-3 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {terfilter.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/70">
                  <td className="px-5 sm:px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center text-xs font-bold shrink-0">
                        {inisial(u.nama)}
                      </span>
                      <div>
                        <p className="font-semibold text-slate-800">{u.nama}</p>
                        <p className="text-xs text-slate-500">
                          {u.telepon ?? "-"}
                          {!u.aktif && (
                            <span className="ml-2 text-rose-500 font-semibold">nonaktif</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3.5">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                        u.role === "admin"
                          ? "border-blue-200 bg-blue-50 text-blue-700"
                          : u.role === "pelatih"
                            ? "border-amber-200 bg-amber-50 text-amber-700"
                            : "border-slate-200 bg-slate-50 text-slate-600"
                      }`}
                    >
                      {ROLE_LABEL[u.role]}
                    </span>
                  </td>
                  <td className="px-3 py-3.5 text-slate-600 hidden md:table-cell">
                    {namaCabor(u.cabor_id)}
                  </td>
                  <td className="px-3 py-3.5 text-slate-600 hidden lg:table-cell">
                    {u.identitas ?? "-"}
                  </td>
                  <td className="px-5 sm:px-6 py-3.5">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setEditing(u);
                          setFormOpen(true);
                        }}
                        className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                        aria-label="Ubah pengguna"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => hapus(u.id)}
                        className="p-2 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                        aria-label="Hapus pengguna"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {terfilter.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm text-slate-400">
                    Tidak ada pengguna ditemukan.
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
