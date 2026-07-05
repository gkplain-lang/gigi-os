"use client";

import Link from "next/link";
import { generateMissionReviewSummary, missionReviewPolicyNotes } from "@/modules/missionReview";
import { useIsClient } from "@/components/settings/useIsClient";

export function MissionReviewSettingsSummary() {
  const isClient = useIsClient();
  if (!isClient) return null;

  const summary = generateMissionReviewSummary();
  const notes = missionReviewPolicyNotes();

  return (
    <div className="mt-4 rounded-lg border border-violet-500/20 bg-violet-500/5 px-4 py-3">
      <p className="text-[12px] font-medium text-text-primary">Revue de mission V4.8</p>
      <p className="mt-1 text-[12.5px] text-text-secondary">{summary.summaryText}</p>
      <p className="mt-2 text-[11.5px] text-text-muted">
        {summary.totalReviews} revue(s) · {summary.completedByHumanCount} terminée(s) par
        l&apos;humain · local uniquement, aucune exécution réelle
      </p>
      <ul className="mt-2 list-inside list-disc text-[11px] text-text-muted">
        {notes.slice(0, 3).map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ul>
      <Link
        href="/mission-review"
        className="gigi-focus mt-2 inline-flex text-[13px] font-medium text-accent-soft underline-offset-2 hover:underline"
      >
        Faire la revue de mission →
      </Link>
    </div>
  );
}
