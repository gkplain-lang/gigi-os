"use client";

import type { GuidedActionGlobalSummary } from "@/modules/executionExperience/guidedActionTypes";

export function GuidedActionSummaryStats({
  summary,
  className,
}: {
  summary: GuidedActionGlobalSummary;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-[13px] text-text-secondary">{summary.summaryText}</p>
      {summary.totalFlows > 0 && (
        <dl className="mt-3 grid gap-2 text-[12px] sm:grid-cols-4">
          <div>
            <dt className="text-text-muted">Total</dt>
            <dd className="font-semibold tabular-nums text-text-primary">{summary.totalFlows}</dd>
          </div>
          <div>
            <dt className="text-text-muted">Actifs</dt>
            <dd className="font-semibold tabular-nums text-text-primary">{summary.activeFlows}</dd>
          </div>
          <div>
            <dt className="text-text-muted">Terminés</dt>
            <dd className="font-semibold tabular-nums text-text-primary">{summary.completedFlows}</dd>
          </div>
          <div>
            <dt className="text-text-muted">Annulés</dt>
            <dd className="font-semibold tabular-nums text-text-primary">{summary.cancelledFlows}</dd>
          </div>
        </dl>
      )}
    </div>
  );
}
