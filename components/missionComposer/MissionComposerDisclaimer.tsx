"use client";

import { MISSION_COMPOSER_BADGES } from "@/modules/missionComposer";

export function MissionComposerDisclaimer({ className }: { className?: string }) {
  return (
    <p className={`text-[11.5px] italic text-amber-200/85 ${className ?? ""}`}>
      Composer mission local — tu choisis une mission prioritaire. Gigi prépare le parcours guidé.
      Aucune exécution réelle, validation humaine obligatoire.
    </p>
  );
}

export function MissionComposerBadges({ className }: { className?: string }) {
  return (
    <div className={`flex flex-wrap gap-1.5 ${className ?? ""}`}>
      {MISSION_COMPOSER_BADGES.map((b) => (
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
