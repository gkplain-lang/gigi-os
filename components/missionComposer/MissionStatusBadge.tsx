"use client";

import type { DailyPriorityMissionStatus, MissionCandidateStatus } from "@/modules/missionComposer";
import {
  DAILY_MISSION_STATUS_LABELS,
  MISSION_CANDIDATE_STATUS_LABELS,
} from "@/modules/missionComposer";

interface MissionStatusBadgeProps {
  status: MissionCandidateStatus | DailyPriorityMissionStatus;
  variant?: "candidate" | "daily";
}

export function MissionStatusBadge({ status, variant = "candidate" }: MissionStatusBadgeProps) {
  const label =
    variant === "daily"
      ? DAILY_MISSION_STATUS_LABELS[status as DailyPriorityMissionStatus]
      : MISSION_CANDIDATE_STATUS_LABELS[status as MissionCandidateStatus];

  return (
    <span className="rounded border border-border/40 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-text-muted">
      {label}
    </span>
  );
}
