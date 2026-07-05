"use client";

import type { LocalReviewGlobalSummary } from "@/modules/executionReadiness";
import { cn } from "@/lib/utils";

export function LocalReviewSummaryStats({
  summary,
  className,
}: {
  summary: LocalReviewGlobalSummary;
  className?: string;
}) {
  const stats = [
    { label: "Revues créées", value: summary.totalSessions },
    { label: "En attente", value: summary.awaitingInput },
    { label: "Succès probable", value: summary.likelySuccess },
    { label: "Attention", value: summary.needsAttention },
    { label: "Échec probable", value: summary.likelyFailed },
    { label: "Inconclusives", value: summary.inconclusive },
    { label: "Alerte secret", value: summary.sensitiveAlerts },
  ];

  return (
    <dl className={cn("grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-7", className)}>
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-lg border border-border/40 bg-surface-2/15 px-3 py-2.5"
        >
          <dt className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            {s.label}
          </dt>
          <dd className="mt-1 text-[18px] font-semibold tabular-nums text-text-primary">
            {s.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
