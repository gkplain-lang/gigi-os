"use client";

import type { PermissionCenterFilterId } from "@/modules/executionReadiness";
import { PERMISSION_CENTER_FILTER_LABELS } from "@/modules/executionReadiness";
import { cn } from "@/lib/utils";

interface PermissionCenterSummaryStatsProps {
  counts: Record<PermissionCenterFilterId, number>;
  className?: string;
}

const STAT_KEYS: PermissionCenterFilterId[] = [
  "all",
  "awaiting",
  "approved_dry_run",
  "expired",
  "revoked",
  "blocked",
];

export function PermissionCenterSummaryStats({
  counts,
  className,
}: PermissionCenterSummaryStatsProps) {
  return (
    <dl
      className={cn(
        "grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6",
        className
      )}
    >
      {STAT_KEYS.map((key) => (
        <div
          key={key}
          className="rounded-lg border border-border/40 bg-surface-2/15 px-3 py-2.5"
        >
          <dt className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            {PERMISSION_CENTER_FILTER_LABELS[key]}
          </dt>
          <dd className="mt-1 text-[18px] font-semibold tabular-nums text-text-primary">
            {counts[key]}
          </dd>
        </div>
      ))}
    </dl>
  );
}
