import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui";
import AbsensiClient from "@/components/absensi/AbsensiClient";

export const metadata: Metadata = { title: "Absensi Latihan" };

export default async function AbsensiPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  if (session.profile.role !== "atlet") {
    redirect("/dashboard");
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("sesi_latihan")
    .select("id, started_at, lokasi, status")
    .eq("atlet_id", session.user.id)
    .eq("status", "berjalan")
    .order("started_at", { ascending: false })
    .limit(1);

  const sesi = data?.[0]
    ? { id: data[0].id, started_at: data[0].started_at, lokasi: data[0].lokasi }
    : null;

  return (
    <div>
      <PageHeader
        title="Absensi Latihan"
        description="Lakukan absensi saat memulai dan mengakhiri sesi latihan."
      />
      <AbsensiClient sesi={sesi} />
    </div>
  );
}
