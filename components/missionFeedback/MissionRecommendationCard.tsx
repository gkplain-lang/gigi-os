import type { MissionRecommendationScore } from "@/modules/missionFeedback";
import { MISSION_DECISION_LABELS } from "@/modules/missionFeedback";
import { cn } from "@/lib/utils";

const DECISION_STYLE: Record<MissionRecommendationScore["decision"], string> = {
  strongly_recommended: "border-emerald-500/35 bg-emerald-500/10 text-emerald-300/90",
  recommended: "border-[rgba(124,140,255,0.35)] bg-[rgba(124,140,255,0.08)] text-accent-soft",
  neutral: "border-border bg-surface-2/30 text-text-secondary",
  needs_clarification: "border-amber-500/35 bg-amber-500/10 text-amber-200/90",
  not_recommended: "border-red-500/25 bg-red-500/8 text-red-300/80",
};

interface MissionRecommendationCardProps {
  missionTitle: string;
  score: MissionRecommendationScore;
  onCopy?: () => void;
  compact?: boolean;
  className?: string;
}

export function MissionRecommendationCard({
  missionTitle,
  score,
  onCopy,
  compact = false,
  className,
}: MissionRecommendationCardProps) {
  return (
    <article
      className={cn(
        "rounded-lg border px-3 py-3",
        DECISION_STYLE[score.decision],
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-wide">
          {MISSION_DECISION_LABELS[score.decision]}
        </span>
        <span className="text-[10px] tabular-nums opacity-80">
          {score.score}/100 · conf. {score.confidence}%
        </span>
      </div>

      {!compact && (
        <>
          <h4 className="mt-2 text-[13.5px] font-medium text-text-primary">{missionTitle}</h4>

          {score.reasons.length > 0 && (
            <div className="mt-2">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                Pourquoi
              </p>
              <ul className="mt-1 space-y-1">
                {score.reasons.map((r) => (
                  <li key={r} className="text-[12.5px] text-text-secondary">
                    · {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {score.risks.length > 0 && (
            <div className="mt-2">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                Risques
              </p>
              <ul className="mt-1 space-y-1">
                {score.risks.map((r) => (
                  <li key={r} className="text-[12.5px] text-amber-200/85">
                    · {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {score.suggestedRefinement && (
            <p className="mt-2 rounded border border-border/60 bg-surface/40 px-2.5 py-2 text-[12px] text-text-secondary">
              <span className="font-medium text-text-primary">Clarification : </span>
              {score.suggestedRefinement}
            </p>
          )}
        </>
      )}

      {onCopy && !compact && (
        <button
          type="button"
          onClick={onCopy}
          className="gigi-btn gigi-focus mt-2 rounded-lg px-2.5 py-1 text-[11.5px]"
        >
          Copier le feedback
        </button>
      )}
    </article>
  );
}
