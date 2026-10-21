import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Users, Activity, Clock3 } from "lucide-react";
import { getSession } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, StatCard } from "@/components/ui";
import AtletClient from "@/components/dashboard/AtletClient";
import { formatDurasi } from "@/lib/utils";
import type { SesiLatihan } from "@/lib/types";

export const metadata: Metadata = { title: "Monitoring Atlet" };

export default async function AtletPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.profile.role !== "pelatih") redirect("/dashboard");

  const supabase = await createClient();
  const caborId = session.profile.cabor_id;

  const { data: rekapData } = await supabase
    .from("rekap_atlet")
    .select("*")
    .eq("cabor_id", caborId ?? "__none__")
    .order("nama_atlet");

  const rekap = (rekapData ?? []) as Array<{
    atlet_id: string;
    nama_atlet: string;
    total_sesi_selesai: number;
    total_menit: number;
    hari_aktif: number;
    terakhir_latihan: string | null;
  }>;

  const { data: profilData } = await supabase
    .from("profiles")
    .select("id, identitas")
    .eq("cabor_id", caborId ?? "__none__")
    .eq("role", "atlet");

  const identitasMap = new Map(
    ((profilData ?? []) as Array<{ id: string; identitas: string | null }>).map(
      (p) => [p.id, p.identitas]
    )
  );

  const { data: sesiData } = await supabase
    .from("sesi_latihan")
    .select("*")
    .eq("cabor_id", caborId ?? "__none__")
    .order("started_at", { ascending: false })
    .limit(500);

  const atlet = rekap.map((r) => ({
    ...r,
    identitas: identitasMap.get(r.atlet_id) ?? null,
  }));

  const totalMenit = rekap.reduce((a, b) => a + Number(b.total_menit ?? 0), 0);
  const totalSesi = rekap.reduce((a, b) => a + Number(b.total_sesi_selesai ?? 0), 0);
  const aktif = rekap.filter((r) => Number(r.hari_aktif) > 0).length;

  return (
    <div>
      <PageHeader
        title="Monitoring Atlet"
        description={`Pantau kehadiran dan durasi latihan atlet bina Anda${
          session.cabor ? ` (${session.cabor.nama})` : ""
        }.`}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Jumlah Atlet" value={rekap.length} icon={Users} tone="blue" />
        <StatCard label="Atlet Aktif" value={aktif} icon={Activity} tone="emerald" />
        <StatCard
          label="Total Jam Latihan"
          value={formatDurasi(totalMenit)}
          sub={`${totalSesi} sesi`}
          icon={Clock3}
          tone="amber"
        />
      </div>

      <AtletClient
        atlet={atlet}
        sesi={(sesiData ?? []) as SesiLatihan[]}
        cabor={session.cabor?.nama ?? null}
      />
    </div>
  );
}
