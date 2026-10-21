import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import DashboardShell from "@/components/dashboard/DashboardShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <DashboardShell
      role={session.profile.role}
      nama={session.profile.nama}
      cabor={session.cabor?.nama ?? null}
    >
      {children}
    </DashboardShell>
  );
}
