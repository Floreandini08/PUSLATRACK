import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type { Cabor } from "@/lib/types";
import RegisterForm from "./RegisterForm";

export const metadata: Metadata = {
  title: "Daftar Akun",
  description: "Daftar akun PuslatTrack untuk atlet dan pelatih",
};

export const dynamic = "force-dynamic";

export default async function RegisterPage() {
  const supabase = await createClient();

  let cabor: Cabor[] = [];
  try {
    const { data } = await supabase
      .from("cabor")
      .select("*")
      .eq("aktif", true)
      .order("nama");
    cabor = (data ?? []) as Cabor[];
  } catch {
    cabor = [];
  }

  return <RegisterForm cabor={cabor} />;
}
