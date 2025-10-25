"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { consumeCredits } from "@/lib/creditsMock";

export default function TataGenerator() {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [generating, setGenerating] = useState(false);

  async function handleGenerate() {
    if (!fileRef.current?.files?.[0]) return;
    setGenerating(true);
    await consumeCredits("guest", 1);
    setTimeout(() => {
      setResultUrl("/placeholder/tata.jpg");
      setOpen(true);
      setGenerating(false);
    }, 800);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Táta jako legenda</h1>
      <p className="opacity-90">Váš originální layout vložíme později. Nyní skeleton.</p>

      <div className="flex items-center gap-4">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) setPreviewUrl(URL.createObjectURL(file));
          }}
        />
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="rounded-md bg-emerald-500/80 px-4 py-2 hover:bg-emerald-400/90 disabled:opacity-60"
        >
          {generating ? "Generuji…" : "Vygenerovat"}
        </button>
      </div>

      {previewUrl && (
        <div className="rounded-lg overflow-hidden border border-white/10 w-full max-w-lg">
          <Image src={previewUrl} alt="Náhled" width={800} height={600} className="object-cover w-full h-auto" />
        </div>
      )}

      {open && resultUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-black/60 backdrop-blur rounded-xl border border-white/10 p-4 max-w-3xl w-full">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-medium">Výsledek</h2>
              <button onClick={() => setOpen(false)} className="opacity-80 hover:opacity-100">Zavřít</button>
            </div>
            <div className="relative w-full aspect-[16/10]">
              <Image src={resultUrl} alt="Výsledek" fill className="object-cover rounded-lg" />
            </div>
            <div className="mt-4 flex justify-end">
              <a href={resultUrl} download className="inline-flex items-center rounded-md bg-emerald-500/80 px-3 py-1.5 hover:bg-emerald-400/90">Stáhnout</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
