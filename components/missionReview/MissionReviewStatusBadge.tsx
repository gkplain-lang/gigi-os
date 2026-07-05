"use client";

import type { DailyMissionReviewStatus } from "@/modules/missionReview";
import { REVIEW_STATUS_LABELS } from "@/modules/missionReview";

export function MissionReviewStatusBadge({ status }: { status: DailyMissionReviewStatus }) {
  return (
    <span className="rounded border border-border/40 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-text-muted">
      {REVIEW_STATUS_LABELS[status]}
    </span>
  );
}
