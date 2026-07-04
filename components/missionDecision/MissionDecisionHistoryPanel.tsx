"use client";

import type { MissionDecision } from "@/modules/missionDecision";
import { MISSION_DECISION_STATUS_LABELS } from "@/modules/missionDecision";
import { cn } from "@/lib/utils";

interface MissionDecisionHistoryPanelProps {
  decisions: MissionDecision[];
  className?: string;
}

export function MissionDecisionHistoryPanel({
  decisions,
  className,
}: MissionDecisionHistoryPanelProps) {
  if (decisions.length === 0) {
    return (
      <p className={cn("text-[13px] text-text-muted", className)}>
        Aucune décision enregistrée localement.
      </p>
    );
  }

  return (
    <ul className={cn("space-y-2", className)}>
      {decisions.map((d) => {
        const title =
          d.finalUserChoice ??
          d.candidates.find((c) => c.id === d.selectedCandidateId)?.title ??
          d.candidates[0]?.title ??
          "—";
        return (
          <li
            key={d.id}
            className="rounded-lg border border-border bg-surface-2/25 px-3 py-2.5 text-[12.5px]"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium text-text-secondary">{d.date}</span>
              <span className="text-[10px] uppercase text-text-muted">
                {MISSION_DECISION_STATUS_LABELS[d.status]}
              </span>
            </div>
            <p className="mt-1 text-text-primary">{title}</p>
            {d.userNote && (
              <p className="mt-1 text-[11.5px] text-text-muted">{d.userNote}</p>
            )}
          </li>
        );
      })}
    </ul>
  );
}
