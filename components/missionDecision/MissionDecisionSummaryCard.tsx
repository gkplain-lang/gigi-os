import type { MissionDecision } from "@/modules/missionDecision";
import {
  MISSION_DECISION_DISCLAIMER,
  MISSION_DECISION_STATUS_LABELS,
} from "@/modules/missionDecision";
import { cn } from "@/lib/utils";

interface MissionDecisionSummaryCardProps {
  decision: MissionDecision;
  onRegenerate?: () => void;
  onCopy?: () => void;
  className?: string;
}

export function MissionDecisionSummaryCard({
  decision,
  onRegenerate,
  onCopy,
  className,
}: MissionDecisionSummaryCardProps) {
  const top = decision.candidates.find((c) => c.id === decision.selectedCandidateId) ??
    decision.candidates[0];

  return (
    <section
      className={cn(
        "rounded-xl border border-[rgba(124,140,255,0.28)] bg-[rgba(124,140,255,0.05)] px-4 py-4",
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
          Centre de décision · V2.6
        </p>
        <span className="rounded-full border border-border px-2 py-0.5 text-[10px] font-medium text-text-secondary">
          {MISSION_DECISION_STATUS_LABELS[decision.status]}
        </span>
        <span className="text-[10px] text-text-muted">{decision.date}</span>
      </div>

      <p className="mt-2 text-[13.5px] leading-relaxed text-text-secondary">
        {decision.recommendationSummary}
      </p>

      {top && (
        <p className="mt-2 text-[14px] font-medium text-text-primary">
          {decision.finalUserChoice ?? top.title}
          <span className="ml-2 text-[12px] font-normal text-accent-soft">
            {top.score}/100
          </span>
        </p>
      )}

      <p className="mt-2 text-[12px] text-amber-200/90">{MISSION_DECISION_DISCLAIMER}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        {onRegenerate && (
          <button
            type="button"
            onClick={onRegenerate}
            className="gigi-btn-primary gigi-focus rounded-lg px-3 py-1.5 text-[12.5px] font-medium"
          >
            Régénérer
          </button>
        )}
        {onCopy && (
          <button
            type="button"
            onClick={onCopy}
            className="gigi-btn gigi-focus rounded-lg px-3 py-1.5 text-[12.5px]"
          >
            Copier la décision
          </button>
        )}
      </div>
    </section>
  );
}
