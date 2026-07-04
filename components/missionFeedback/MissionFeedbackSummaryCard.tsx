import type { MissionFeedbackGlobalSummary } from "@/modules/missionFeedback";
import { MISSION_FEEDBACK_DISCLAIMER } from "@/modules/missionFeedback";
import { cn } from "@/lib/utils";

interface MissionFeedbackSummaryCardProps {
  summary: MissionFeedbackGlobalSummary;
  onCopyGlobal?: () => void;
  onRegenerate?: () => void;
  className?: string;
}

export function MissionFeedbackSummaryCard({
  summary,
  onCopyGlobal,
  onRegenerate,
  className,
}: MissionFeedbackSummaryCardProps) {
  return (
    <section
      className={cn(
        "rounded-xl border border-[rgba(124,140,255,0.25)] bg-[rgba(124,140,255,0.04)] px-4 py-4",
        className
      )}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
        Feedback mission · V2.5
      </p>
      <p className="mt-2 text-[13.5px] leading-relaxed text-text-secondary">
        {summary.summaryText}
      </p>
      {summary.topRecommendedTitle && (
        <p className="mt-2 text-[13px] font-medium text-text-primary">
          Meilleure piste locale : {summary.topRecommendedTitle}
        </p>
      )}
      <p className="mt-2 text-[12px] text-amber-200/90">{MISSION_FEEDBACK_DISCLAIMER}</p>

      {summary.recurringBlockers.length > 0 && (
        <ul className="mt-3 space-y-1">
          {summary.recurringBlockers.map((b) => (
            <li key={b} className="text-[12px] text-amber-200/80">
              ⚠ {b}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        {onRegenerate && (
          <button
            type="button"
            onClick={onRegenerate}
            className="gigi-btn-primary gigi-focus rounded-lg px-3 py-1.5 text-[12.5px] font-medium"
          >
            Régénérer depuis l&apos;historique
          </button>
        )}
        {onCopyGlobal && summary.totalScores > 0 && (
          <button
            type="button"
            onClick={onCopyGlobal}
            className="gigi-btn gigi-focus rounded-lg px-3 py-1.5 text-[12.5px]"
          >
            Copier synthèse
          </button>
        )}
      </div>
    </section>
  );
}
