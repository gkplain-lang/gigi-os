"use client";

import { useRouter } from "next/navigation";
import type { ProjectMissionCandidate } from "@/modules/missionComposer";
import {
  MISSION_CATEGORY_LABELS,
  selectDailyPriorityMission,
  convertMissionToGuidedActionFlow,
} from "@/modules/missionComposer";
import { MissionStatusBadge } from "./MissionStatusBadge";

interface MissionCandidateCardProps {
  candidate: ProjectMissionCandidate;
  onRefresh: () => void;
}

export function MissionCandidateCard({ candidate, onRefresh }: MissionCandidateCardProps) {
  const router = useRouter();

  function handleSelectDaily() {
    selectDailyPriorityMission(candidate.id);
    onRefresh();
  }

  function handleConvert() {
    const result = convertMissionToGuidedActionFlow(candidate.id);
    onRefresh();
    if (result?.flow) {
      router.push(`/guided-actions?flow=${result.flow.id}`);
    }
  }

  return (
    <li className="rounded-lg border border-border/35 px-4 py-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-[12.5px] font-medium text-text-primary">{candidate.title}</p>
          <p className="text-[11px] text-text-muted">
            {candidate.projectName} · {MISSION_CATEGORY_LABELS[candidate.category]}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold tabular-nums text-accent-soft">
            {candidate.priorityScore}
          </span>
          <MissionStatusBadge status={candidate.status} />
        </div>
      </div>

      <p className="mt-2 text-[11.5px] text-text-secondary">{candidate.reason}</p>

      <div className="mt-2 flex flex-wrap gap-1.5">
        <span className="rounded border border-border/30 px-1.5 py-0.5 text-[9px] uppercase text-text-muted">
          impact {candidate.impact}
        </span>
        <span className="rounded border border-border/30 px-1.5 py-0.5 text-[9px] uppercase text-text-muted">
          effort {candidate.effort}
        </span>
        <span className="rounded border border-border/30 px-1.5 py-0.5 text-[9px] uppercase text-text-muted">
          risque {candidate.riskLevel}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleSelectDaily}
          className="gigi-btn-secondary gigi-focus rounded-lg px-2.5 py-1 text-[11px] font-medium"
        >
          Choisir comme mission du jour
        </button>
        <button
          type="button"
          onClick={handleConvert}
          className="gigi-focus rounded-lg border border-border/40 px-2.5 py-1 text-[11px] font-medium text-text-secondary hover:text-text-primary"
        >
          Transformer en parcours guidé
        </button>
      </div>
    </li>
  );
}
