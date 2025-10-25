"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function LoginForm() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [useMagicLink, setUseMagicLink] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      if (useMagicLink) {
        const { error } = await supabase.auth.signInWithOtp({ email });
        if (error) throw error;
        setMessage("Odkaz pro přihlášení byl odeslán na email.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.replace("/dashboard");
      }
    } catch (err: any) {
      setMessage(err?.message ?? "Nastala chyba při přihlášení");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-lg border bg-card p-6 shadow-sm space-y-4">
        <h1 className="text-xl font-semibold text-center">Přihlášení</h1>
        <p className="text-xs text-muted-foreground text-center">
          Pro přihlášení musíte nastavit proměnné <code>NEXT_PUBLIC_SUPABASE_URL</code> a <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> v souboru <code>.env.local</code>.
        </p>
        <form className="space-y-3" onSubmit={onSubmit}>
          <div className="space-y-1">
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-md border px-3 py-2 bg-background"
              placeholder="jan@domena.cz"
            />
          </div>
          {!useMagicLink && (
            <div className="space-y-1">
              <label className="text-sm font-medium">Heslo</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-md border px-3 py-2 bg-background"
                placeholder="••••••••"
              />
            </div>
          )}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={useMagicLink}
                onChange={(e) => setUseMagicLink(e.target.checked)}
              />
              Přihlásit pomocí magic linku
            </label>
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-black text-white px-4 py-2 disabled:opacity-60"
            >
              {loading ? "Probíhá…" : useMagicLink ? "Odeslat odkaz" : "Přihlásit"}
            </button>
          </div>
        </form>
        {message && (
          <p className="text-sm text-muted-foreground text-center">{message}</p>
        )}
      </div>
    </div>
  );
}
