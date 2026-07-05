"use client";

import type { DailyMissionReview, OutcomeStatus, NextDecision } from "@/modules/missionReview";
import { OUTCOME_STATUS_LABELS, NEXT_DECISION_LABELS } from "@/modules/missionReview";

interface MissionReviewFormProps {
  review: DailyMissionReview;
  onChange: (fields: {
    whatWasDone: string;
    blockers: string;
    learnings: string;
    outcomeStatus: OutcomeStatus;
    nextDecision: NextDecision;
    progressLevel: number;
  }) => void;
}

export function MissionReviewForm({ review, onChange }: MissionReviewFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
          Ce qui a été fait
        </label>
        <textarea
          value={review.whatWasDone}
          onChange={(e) =>
            onChange({
              whatWasDone: e.target.value,
              blockers: review.blockers,
              learnings: review.learnings,
              outcomeStatus: review.outcomeStatus,
              nextDecision: review.nextDecision,
              progressLevel: review.progressLevel,
            })
          }
          rows={3}
          className="gigi-focus mt-1 w-full rounded-lg border border-border/40 bg-surface-2/20 px-3 py-2 text-[13px] text-text-primary"
          placeholder="Décris localement ce que tu as avancé…"
        />
      </div>

      <div>
        <label className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
          Blocages
        </label>
        <textarea
          value={review.blockers}
          onChange={(e) =>
            onChange({
              whatWasDone: review.whatWasDone,
              blockers: e.target.value,
              learnings: review.learnings,
              outcomeStatus: review.outcomeStatus,
              nextDecision: review.nextDecision,
              progressLevel: review.progressLevel,
            })
          }
          rows={2}
          className="gigi-focus mt-1 w-full rounded-lg border border-border/40 bg-surface-2/20 px-3 py-2 text-[13px] text-text-primary"
          placeholder="Qu'est-ce qui a bloqué ?"
        />
      </div>

      <div>
        <label className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
          Apprentissages
        </label>
        <textarea
          value={review.learnings}
          onChange={(e) =>
            onChange({
              whatWasDone: review.whatWasDone,
              blockers: review.blockers,
              learnings: e.target.value,
              outcomeStatus: review.outcomeStatus,
              nextDecision: review.nextDecision,
              progressLevel: review.progressLevel,
            })
          }
          rows={2}
          className="gigi-focus mt-1 w-full rounded-lg border border-border/40 bg-surface-2/20 px-3 py-2 text-[13px] text-text-primary"
          placeholder="Ce que tu retiens pour demain…"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
            Outcome
          </label>
          <select
            value={review.outcomeStatus}
            onChange={(e) =>
              onChange({
                whatWasDone: review.whatWasDone,
                blockers: review.blockers,
                learnings: review.learnings,
                outcomeStatus: e.target.value as OutcomeStatus,
                nextDecision: review.nextDecision,
                progressLevel: review.progressLevel,
              })
            }
            className="gigi-focus mt-1 w-full rounded-lg border border-border/40 bg-surface-2/20 px-3 py-2 text-[13px]"
          >
            {Object.entries(OUTCOME_STATUS_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
            Progression ({review.progressLevel}%)
          </label>
          <input
            type="range"
            min={0}
            max={100}
            value={review.progressLevel}
            onChange={(e) =>
              onChange({
                whatWasDone: review.whatWasDone,
                blockers: review.blockers,
                learnings: review.learnings,
                outcomeStatus: review.outcomeStatus,
                nextDecision: review.nextDecision,
                progressLevel: Number(e.target.value),
              })
            }
            className="mt-2 w-full"
          />
        </div>
      </div>

      <div>
        <label className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
          Décision suivante
        </label>
        <select
          value={review.nextDecision}
          onChange={(e) =>
            onChange({
              whatWasDone: review.whatWasDone,
              blockers: review.blockers,
              learnings: review.learnings,
              outcomeStatus: review.outcomeStatus,
              nextDecision: e.target.value as NextDecision,
              progressLevel: review.progressLevel,
            })
          }
          className="gigi-focus mt-1 w-full rounded-lg border border-border/40 bg-surface-2/20 px-3 py-2 text-[13px]"
        >
          {Object.entries(NEXT_DECISION_LABELS).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
