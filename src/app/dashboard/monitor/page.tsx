import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui";
import MonitorClient from "@/components/dashboard/MonitorClient";
import type { RekapAtlet, RekapCabor } from "@/lib/types";

export const metadata: Metadata = { title: "Monitoring KONI" };

export default async function MonitorPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.profile.role !== "admin") redirect("/dashboard");

  const supabase = await createClient();

  const [{ data: caborData }, { data: atletData }] = await Promise.all([
    supabase.from("rekap_cabor").select("*").order("total_menit", { ascending: false }),
    supabase.from("rekap_atlet").select("*").order("nama_atlet"),
  ]);

  return (
    <div>
      <PageHeader
        title="Monitoring KONI & Puslatkot"
        description="Rekapitulasi aktivitas latihan seluruh atlet untuk monitoring dan evaluasi pembinaan."
      />
      <MonitorClient
        rekapCabor={(caborData ?? []) as RekapCabor[]}
        rekapAtlet={(atletData ?? []) as RekapAtlet[]}
      />
    </div>
  );
}
