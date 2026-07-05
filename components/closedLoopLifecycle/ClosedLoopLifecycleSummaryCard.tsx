"use client";

import type { ClosedLoopLifecycle } from "@/modules/closedLoopLifecycle";
import {
  CLOSED_LOOP_LIFECYCLE_DISCLAIMER,
  CLOSED_LOOP_LIFECYCLE_STATUS_LABELS,
} from "@/modules/closedLoopLifecycle";
import { ClosedLoopLifecycleHealthBadge } from "./ClosedLoopLifecycleHealthBadge";
import { cn } from "@/lib/utils";

interface ClosedLoopLifecycleSummaryCardProps {
  lifecycle: ClosedLoopLifecycle;
  className?: string;
}

export function ClosedLoopLifecycleSummaryCard({
  lifecycle,
  className,
}: ClosedLoopLifecycleSummaryCardProps) {
  return (
    <div className={cn("rounded-xl border border-border bg-surface-2/20 px-4 py-3", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
          Closed Loop Action Lifecycle · V2.11
        </p>
        <ClosedLoopLifecycleHealthBadge health={lifecycle.health} />
        <span className="rounded-full border border-border px-2 py-0.5 text-[10px] text-text-muted">
          {CLOSED_LOOP_LIFECYCLE_STATUS_LABELS[lifecycle.status]}
        </span>
      </div>
      <p className="mt-2 text-[15px] font-semibold text-text-primary">
        {lifecycle.title.replace(/^Cycle · /, "")}
      </p>
      <p className="mt-2 text-[13px] leading-relaxed text-text-secondary">{lifecycle.summary}</p>
      <p className="mt-3 text-[11px] text-text-muted">{CLOSED_LOOP_LIFECYCLE_DISCLAIMER}</p>
    </div>
  );
}
