import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui";
import CaborClient from "@/components/dashboard/CaborClient";
import type { Cabor } from "@/lib/types";

export const metadata: Metadata = { title: "Kelola Cabor" };

export default async function CaborPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.profile.role !== "admin") redirect("/dashboard");

  const supabase = await createClient();
  const { data } = await supabase.from("cabor").select("*").order("nama");

  return (
    <div>
      <PageHeader
        title="Kelola Cabang Olahraga"
        description="Master data cabang olahraga beserta koordinat area latihan."
      />
      <CaborClient cabor={(data ?? []) as Cabor[]} />
    </div>
  );
}
