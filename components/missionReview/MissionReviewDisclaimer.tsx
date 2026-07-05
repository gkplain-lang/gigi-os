"use client";

import { MISSION_REVIEW_BADGES } from "@/modules/missionReview";

export function MissionReviewDisclaimer({ className }: { className?: string }) {
  return (
    <p className={`text-[11.5px] italic text-amber-200/85 ${className ?? ""}`}>
      Revue de mission locale — tu décris ce qui s&apos;est passé. Gigi prépare une réflexion, tu
      valides la décision suivante. Aucune exécution réelle, validation humaine obligatoire.
    </p>
  );
}

export function MissionReviewBadges({ className }: { className?: string }) {
  return (
    <div className={`flex flex-wrap gap-1.5 ${className ?? ""}`}>
      {MISSION_REVIEW_BADGES.map((b) => (
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
