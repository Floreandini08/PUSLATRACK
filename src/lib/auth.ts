import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

export type SessionData = {
  user: { id: string; email?: string };
  profile: Profile;
  cabor: { id: string; nama: string; kode: string } | null;
};

export const getSession = cache(async (): Promise<SessionData | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profileData } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profileData) return null;

  const profile = profileData as Profile;

  let cabor: SessionData["cabor"] = null;
  if (profile.cabor_id) {
    const { data: caborData } = await supabase
      .from("cabor")
      .select("id, nama, kode")
      .eq("id", profile.cabor_id)
      .single();
    cabor = (caborData as SessionData["cabor"]) ?? null;
  }

  return { user: { id: user.id, email: user.email }, profile, cabor };
});
