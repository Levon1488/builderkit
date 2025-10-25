import type { SupabaseClient } from "@supabase/supabase-js";

export type Profile = {
  user_id: string;
  credits: number;
  active: boolean;
};

export async function getProfile(
  supabase: SupabaseClient,
  userId: string
): Promise<Profile | null> {
  const { data } = await supabase
    .from("profiles")
    .select("user_id, credits, active")
    .eq("user_id", userId)
    .single();
  return (data as Profile) ?? null;
}

export async function decrementCredits(
  supabase: SupabaseClient,
  userId: string,
  amount: number = 200
): Promise<{ ok: boolean; credits?: number; error?: string }> {
  const { data: prof, error: readErr } = await supabase
    .from("profiles")
    .select("credits")
    .eq("user_id", userId)
    .single();
  if (readErr) return { ok: false, error: readErr.message };

  const current = (prof?.credits as number) ?? 0;
  if (current < amount) return { ok: false, error: "Nemáš dostatek kreditů" };

  const { data: updated, error: updateErr } = await supabase
    .from("profiles")
    .update({ credits: current - amount })
    .eq("user_id", userId)
    .select("credits")
    .single();

  if (updateErr) return { ok: false, error: updateErr.message };
  return { ok: true, credits: (updated?.credits as number) ?? current - amount };
}
