import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { PageHeader } from "@/components/ui";
import ProfilClient from "@/components/dashboard/ProfilClient";

export const metadata: Metadata = { title: "Profil Saya" };

export default async function ProfilPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div>
      <PageHeader
        title="Profil Saya"
        description="Kelola data akun dan keamanan login Anda."
      />
      <ProfilClient
        profile={session.profile}
        email={session.user.email ?? ""}
        cabor={session.cabor?.nama ?? null}
      />
    </div>
  );
}
