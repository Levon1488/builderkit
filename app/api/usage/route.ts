import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

const COST = 200;

export async function POST() {
  const supabase = createRouteHandlerClient({ cookies });
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Nejste přihlášen" }, { status: 401 });
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("credits")
    .eq("user_id", user.id)
    .single();

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 400 });
  }

  const credits = profile?.credits ?? 0;
  if (credits < COST) {
    return NextResponse.json({ error: "Nemáš dostatek kreditů" }, { status: 402 });
  }

  const { data: updated, error: updateError } = await supabase
    .from("profiles")
    .update({ credits: credits - COST })
    .eq("user_id", user.id)
    .select("credits")
    .single();

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true, credits: updated?.credits ?? credits - COST });
}
