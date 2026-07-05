"use client";

import { GUIDED_ACTION_BADGES } from "@/modules/executionExperience/guidedActionPolicy";

export function GuidedActionDisclaimer({ className }: { className?: string }) {
  return (
    <p className={`text-[11.5px] italic text-amber-200/85 ${className ?? ""}`}>
      Parcours guidé local — Gigi prépare et structure. Aucune exécution réelle, validation
      humaine obligatoire.
    </p>
  );
}

export function GuidedActionBadges({ className }: { className?: string }) {
  return (
    <div className={`flex flex-wrap gap-1.5 ${className ?? ""}`}>
      {GUIDED_ACTION_BADGES.map((b) => (
        <span
          key={b}
          className="rounded border border-border/40 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-text-muted"
        >
          {b}
        </span>
      ))}
    </div>
  );
}
