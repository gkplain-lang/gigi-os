"use client";

import { generateMissionComposerSummary } from "@/modules/missionComposer";
import { useIsClient } from "@/components/settings/useIsClient";

interface MissionComposerStatsProps {
  revision: number;
}

export function MissionComposerStats({ revision }: MissionComposerStatsProps) {
  const isClient = useIsClient();
  if (!isClient) return null;
  void revision;
  const summary = generateMissionComposerSummary();

  return (
    <dl className="mt-4 grid gap-3 sm:grid-cols-4">
      <div className="rounded-lg border border-border/30 px-3 py-2">
        <dt className="text-[10px] uppercase text-text-muted">Candidates</dt>
        <dd className="text-[18px] font-semibold text-text-primary">{summary.totalCandidates}</dd>
      </div>
      <div className="rounded-lg border border-border/30 px-3 py-2">
        <dt className="text-[10px] uppercase text-text-muted">Actives</dt>
        <dd className="text-[18px] font-semibold text-text-primary">{summary.activeCandidates}</dd>
      </div>
      <div className="rounded-lg border border-border/30 px-3 py-2">
        <dt className="text-[10px] uppercase text-text-muted">Mission du jour</dt>
        <dd className="text-[18px] font-semibold text-text-primary">
          {summary.hasDailyMission ? "Oui" : "—"}
        </dd>
      </div>
      <div className="rounded-lg border border-border/30 px-3 py-2">
        <dt className="text-[10px] uppercase text-text-muted">→ Guidées</dt>
        <dd className="text-[18px] font-semibold text-text-primary">{summary.convertedCount}</dd>
      </div>
    </dl>
  );
}
