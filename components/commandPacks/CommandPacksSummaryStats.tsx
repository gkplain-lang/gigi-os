"use client";

import type { CommandPackGlobalSummary } from "@/modules/executionReadiness";
import { cn } from "@/lib/utils";

interface CommandPacksSummaryStatsProps {
  summary: CommandPackGlobalSummary;
  className?: string;
}

export function CommandPacksSummaryStats({
  summary,
  className,
}: CommandPacksSummaryStatsProps) {
  const stats = [
    { label: "Packs créés", value: summary.totalPacks },
    { label: "Prêts à relire", value: summary.readyForReview },
    { label: "Copiés (humain)", value: summary.copiedByHuman },
    { label: "Lancés (humain)", value: summary.markedRun },
    { label: "Succès déclarés", value: summary.markedSuccess },
    { label: "Échecs déclarés", value: summary.markedFailed },
    { label: "Expirés", value: summary.expired },
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
