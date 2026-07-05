"use client";

import { useState } from "react";
import Link from "next/link";
import { CAPABILITY_DEMO_EXAMPLES } from "@/modules/executionExperience/executionExperienceConstants";
import { cn } from "@/lib/utils";

export function GigiCapabilityDemoStrip({ className }: { className?: string }) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function handleCopy(example: (typeof CAPABILITY_DEMO_EXAMPLES)[number]) {
    try {
      await navigator.clipboard.writeText(example.prompt);
      setCopiedId(example.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      /* ignore */
    }
  }

  return (
    <section
      className={cn("rounded-xl border border-border/40 bg-surface-2/10 p-5", className)}
      aria-label="Exemples à tester"
    >
      <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
        Exemples · UI uniquement
      </p>
      <p className="mt-1 text-[12.5px] text-text-secondary">
        Copie un exemple ou ouvre{" "}
        <Link href="/conversation" className="text-accent-soft hover:underline">
          /conversation
        </Link>{" "}
        — rien n&apos;est créé automatiquement dans le stockage local.
      </p>

      <ul className="mt-4 space-y-2">
        {CAPABILITY_DEMO_EXAMPLES.map((ex) => (
          <li
            key={ex.id}
            className="flex flex-wrap items-start justify-between gap-2 rounded-lg border border-border/30 px-3 py-2.5"
          >
            <div className="min-w-0 flex-1">
              <p className="text-[12.5px] font-medium text-text-primary">{ex.label}</p>
              <p className="mt-0.5 text-[11px] text-text-muted">{ex.hint}</p>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(ex)}
              className="gigi-btn-secondary gigi-focus shrink-0 rounded-lg px-2.5 py-1 text-[11px] font-medium"
            >
              {copiedId === ex.id ? "Copié" : "Copier l'exemple"}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
