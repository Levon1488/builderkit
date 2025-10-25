"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { buyCredits, getCredits } from "@/lib/creditsMock";

export function TopBar() {
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const value = await getCredits("guest");
      if (mounted) setCredits(value);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="sticky top-0 z-50 w-full backdrop-blur-md bg-black/40 text-white">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-wide hover:opacity-90">
          Rodinná proměna
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <span className="opacity-90">
            Kredity: {credits ?? "…"}
          </span>
          <button
            type="button"
            onClick={() => buyCredits()}
            className="inline-flex items-center rounded-md bg-emerald-500/80 px-3 py-1.5 hover:bg-emerald-400/90 transition-colors"
          >
            Dobít
          </button>
        </div>
      </div>
    </div>
  );
}
