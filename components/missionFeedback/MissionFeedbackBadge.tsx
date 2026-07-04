"use client";

import { useMemo } from "react";
import {
  getMissionRecommendationScore,
  getMissionScoreForId,
  MISSION_DECISION_LABELS,
  regenerateMissionFeedbackFromHistory,
  toScoreableMission,
} from "@/modules/missionFeedback";
import { listHistoryEntries } from "@/modules/historyLearning";
import { cn } from "@/lib/utils";

interface MissionFeedbackBadgeProps {
  missionId: string;
  projectId: string;
  title: string;
  className?: string;
}

const DECISION_DOT: Record<string, string> = {
  strongly_recommended: "bg-emerald-400",
  recommended: "bg-accent",
  neutral: "bg-text-muted",
  needs_clarification: "bg-amber-400",
  not_recommended: "bg-red-400",
};

export function MissionFeedbackBadge({
  missionId,
  projectId,
  title,
  className,
}: MissionFeedbackBadgeProps) {
  const score = useMemo(() => {
    const existing = getMissionRecommendationScore(missionId);
    if (existing) return existing;
    if (listHistoryEntries().length === 0) return undefined;
    regenerateMissionFeedbackFromHistory([toScoreableMission(missionId, projectId, title)]);
    return getMissionScoreForId(missionId, projectId, title);
  }, [missionId, projectId, title]);

  if (!score) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-2/40 px-2 py-0.5 text-[10px] font-medium text-text-secondary",
        className
      )}
      title={`Feedback local V2.5 — ${score.reasons[0] ?? "Score indicatif"}`}
    >
      <span
        className={cn("h-1.5 w-1.5 rounded-full", DECISION_DOT[score.decision])}
        aria-hidden
      />
      {MISSION_DECISION_LABELS[score.decision]} · {score.score}
    </span>
  );
}
