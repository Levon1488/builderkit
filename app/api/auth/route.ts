import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const body = await req.json().catch(() => ({}));

  if (body?.action === "logout") {
    await supabase.auth.signOut();
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json(
    { error: "Nepodporovaná akce. Přihlášení řešte přes klientské SDK." },
    { status: 400 }
  );
}

export function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
