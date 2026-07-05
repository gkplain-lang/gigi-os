"use client";

import type { ManualBridgeGlobalSummary } from "@/modules/executionReadiness";
import { cn } from "@/lib/utils";

interface ManualBridgeSummaryStatsProps {
  summary: ManualBridgeGlobalSummary;
  className?: string;
}

export function ManualBridgeSummaryStats({
  summary,
  className,
}: ManualBridgeSummaryStatsProps) {
  const stats = [
    { label: "Paquets créés", value: summary.totalPackets },
    { label: "Revue humaine", value: summary.readyForReview },
    { label: "Copiés (humain)", value: summary.copiedByHuman },
    { label: "Fait (humain)", value: summary.markedDone },
    { label: "Expirés", value: summary.expired },
    { label: "Connecteurs bloqués", value: summary.blockedConnectors },
  ];

  return (
    <dl className={cn("grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6", className)}>
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
