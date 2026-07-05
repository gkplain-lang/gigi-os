"use client";

import Link from "next/link";
import { generateMissionComposerSummary, missionComposerPolicyNotes } from "@/modules/missionComposer";
import { useIsClient } from "@/components/settings/useIsClient";

export function MissionComposerSettingsSummary() {
  const isClient = useIsClient();
  if (!isClient) return null;

  const summary = generateMissionComposerSummary();
  const notes = missionComposerPolicyNotes();

  return (
    <div className="mt-4 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-3">
      <p className="text-[12px] font-medium text-text-primary">Mission Composer V4.7</p>
      <p className="mt-1 text-[12.5px] text-text-secondary">{summary.summaryText}</p>
      <p className="mt-2 text-[11.5px] text-text-muted">
        {summary.totalCandidates} candidate(s) · mission du jour{" "}
        {summary.hasDailyMission ? "active" : "aucune"} · {summary.convertedCount} convertie(s) en
        parcours guidé
      </p>
      <ul className="mt-2 list-inside list-disc text-[11px] text-text-muted">
        {notes.slice(0, 3).map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ul>
      <Link
        href="/mission-composer"
        className="gigi-focus mt-2 inline-flex text-[13px] font-medium text-accent-soft underline-offset-2 hover:underline"
      >
        Composer la mission du jour →
      </Link>
    </div>
  );
}
