"use client";

import type { DailyMissionReview } from "@/modules/missionReview";
import { OUTCOME_STATUS_LABELS, NEXT_DECISION_LABELS } from "@/modules/missionReview";
import { MissionReviewStatusBadge } from "./MissionReviewStatusBadge";

interface DailyMissionReviewCardProps {
  review: DailyMissionReview;
  compact?: boolean;
}

export function DailyMissionReviewCard({ review, compact = false }: DailyMissionReviewCardProps) {
  return (
    <article
      className={`rounded-xl border border-violet-500/30 bg-violet-500/[0.05] ${compact ? "p-4" : "p-5"}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-violet-200/90">
            Revue de mission · V4.8
          </p>
          <h3 className="mt-1 text-[15px] font-semibold text-text-primary">{review.missionTitle}</h3>
          {!compact && (
            <p className="mt-1 text-[12.5px] text-text-secondary">{review.title}</p>
          )}
        </div>
        <MissionReviewStatusBadge status={review.status} />
      </div>

      <dl className="mt-3 grid gap-2 text-[12px] sm:grid-cols-2">
        {review.projectName && (
          <div>
            <dt className="text-text-muted">Projet</dt>
            <dd className="font-medium text-text-primary">{review.projectName}</dd>
          </div>
        )}
        <div>
          <dt className="text-text-muted">Outcome</dt>
          <dd className="font-medium text-text-primary">
            {OUTCOME_STATUS_LABELS[review.outcomeStatus]}
          </dd>
        </div>
        <div>
          <dt className="text-text-muted">Décision suivante</dt>
          <dd className="font-medium text-accent-soft">
            {review.recommendedNextAction || NEXT_DECISION_LABELS[review.nextDecision]}
          </dd>
        </div>
        <div>
          <dt className="text-text-muted">Focus score</dt>
          <dd className="font-medium tabular-nums text-text-primary">{review.focusScore}</dd>
        </div>
      </dl>
    </article>
  );
}
