import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui";
import ProgramClient from "@/components/dashboard/ProgramClient";
import type { Cabor, ProgramLatihan } from "@/lib/types";

export const metadata: Metadata = { title: "Program Latihan" };

export default async function ProgramPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.profile.role === "admin") redirect("/dashboard");

  const supabase = await createClient();
  const caborId = session.profile.cabor_id;

  const { data: programData } = await supabase
    .from("program_latihan")
    .select("*")
    .eq("cabor_id", caborId ?? "__none__")
    .order("tanggal", { ascending: false });

  const { data: caborData } = await supabase
    .from("cabor")
    .select("*")
    .eq("aktif", true)
    .order("nama");

  const { data: pelatihData } = await supabase
    .from("profiles")
    .select("id, nama")
    .eq("role", "pelatih")
    .eq("cabor_id", caborId ?? "__none__");

  return (
    <div>
      <PageHeader
        title="Program Latihan"
        description={
          session.profile.role === "pelatih"
            ? "Unggah dan kelola program latihan untuk atlet cabor Anda."
            : "Program latihan yang diberikan oleh pelatih Anda."
        }
      />
      <ProgramClient
        role={session.profile.role as "atlet" | "pelatih"}
        programs={(programData ?? []) as ProgramLatihan[]}
        cabor={(caborData ?? []) as Cabor[]}
        caborId={caborId}
        pelatih={(pelatihData ?? []) as Array<{ id: string; nama: string }>}
      />
    </div>
  );
}
