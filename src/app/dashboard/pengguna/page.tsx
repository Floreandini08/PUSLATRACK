import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui";
import PenggunaClient from "@/components/dashboard/PenggunaClient";
import type { Cabor, Profile } from "@/lib/types";

export const metadata: Metadata = { title: "Kelola Pengguna" };

export default async function PenggunaPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.profile.role !== "admin") redirect("/dashboard");

  const supabase = await createClient();

  const [{ data: profilData }, { data: caborData }] = await Promise.all([
    supabase
      .from("profiles")
      .select("*")
      .order("role", { ascending: true })
      .order("nama", { ascending: true }),
    supabase.from("cabor").select("*").order("nama"),
  ]);

  return (
    <div>
      <PageHeader
        title="Kelola Pengguna"
        description="Tambah, ubah, dan hapus akun atlet, pelatih, serta pengelola."
      />
      <PenggunaClient
        users={(profilData ?? []) as Profile[]}
        cabor={(caborData ?? []) as Cabor[]}
      />
    </div>
  );
}
