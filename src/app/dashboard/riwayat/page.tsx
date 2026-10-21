import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui";
import RiwayatClient from "@/components/dashboard/RiwayatClient";
import type { SesiLatihan } from "@/lib/types";

export const metadata: Metadata = { title: "Riwayat Latihan" };

export default async function RiwayatPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.profile.role !== "atlet") redirect("/dashboard");

  const supabase = await createClient();
  const { data } = await supabase
    .from("sesi_latihan")
    .select("*")
    .eq("atlet_id", session.user.id)
    .order("started_at", { ascending: false })
    .limit(200);

  const sesi = (data ?? []) as SesiLatihan[];

  return (
    <div>
      <PageHeader
        title="Riwayat Latihan"
        description="Rekap kehadiran, waktu, dan durasi latihan Anda."
      />
      <RiwayatClient sesi={sesi} />
    </div>
  );
}
