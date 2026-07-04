import type { HistoryLearningGlobalSummary } from "@/modules/historyLearning";
import { HISTORY_LEARNING_DISCLAIMER } from "@/modules/historyLearning";
import { cn } from "@/lib/utils";

interface HistoryLearningSummaryCardProps {
  summary: HistoryLearningGlobalSummary;
  onCopyGlobal?: () => void;
  className?: string;
}

export function HistoryLearningSummaryCard({
  summary,
  onCopyGlobal,
  className,
}: HistoryLearningSummaryCardProps) {
  return (
    <section
      className={cn(
        "rounded-xl border border-[rgba(124,140,255,0.25)] bg-[rgba(124,140,255,0.04)] px-4 py-4",
        className
      )}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
        Boucle d&apos;apprentissage · V2.4
      </p>
      <p className="mt-2 text-[13.5px] leading-relaxed text-text-secondary">
        {summary.summaryText}
      </p>
      <p className="mt-2 text-[12px] text-amber-200/90">{HISTORY_LEARNING_DISCLAIMER}</p>

      {summary.recurringPatterns.length > 0 && (
        <ul className="mt-3 space-y-1">
          {summary.recurringPatterns.map((p) => (
            <li key={p} className="text-[12px] text-amber-200/80">
              ⚠ {p}
            </li>
          ))}
        </ul>
      )}

      {summary.topLearnings.length > 0 && (
        <div className="mt-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            Leçons récentes
          </p>
          <ul className="mt-1.5 space-y-1">
            {summary.topLearnings.map((l, i) => (
              <li key={i} className="text-[12.5px] text-text-secondary">
                · {l}
              </li>
            ))}
          </ul>
        </div>
      )}

      {onCopyGlobal && summary.totalEntries > 0 && (
        <button
          type="button"
          onClick={onCopyGlobal}
          className="gigi-btn gigi-focus mt-3 rounded-lg px-3 py-1.5 text-[12.5px]"
        >
          Copier synthèse globale
        </button>
      )}
    </section>
  );
}
