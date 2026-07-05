"use client";

import type { ManualExecutionHandoff } from "@/modules/manualExecutionHandoff";
import {
  MANUAL_EXECUTION_HANDOFF_DISCLAIMER,
  MANUAL_EXECUTION_HANDOFF_STATUS_LABELS,
  MANUAL_EXECUTION_HANDOFF_TARGET_LABELS,
} from "@/modules/manualExecutionHandoff";
import { cn } from "@/lib/utils";

interface ManualExecutionHandoffSummaryCardProps {
  handoff: ManualExecutionHandoff;
  className?: string;
}

export function ManualExecutionHandoffSummaryCard({
  handoff,
  className,
}: ManualExecutionHandoffSummaryCardProps) {
  return (
    <div className={cn("rounded-xl border border-border bg-surface-2/20 px-4 py-3", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
          Manual Execution Handoff · V2.9
        </p>
        <span className="rounded-full border border-[rgba(124,140,255,0.35)] bg-[rgba(124,140,255,0.1)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent-soft">
          {MANUAL_EXECUTION_HANDOFF_TARGET_LABELS[handoff.target]}
        </span>
        <span className="rounded-full border border-border px-2 py-0.5 text-[10px] text-text-muted">
          {MANUAL_EXECUTION_HANDOFF_STATUS_LABELS[handoff.status]}
        </span>
      </div>
      <p className="mt-2 text-[15px] font-semibold text-text-primary">
        {handoff.title.replace(/^Handoff · /, "")}
      </p>
      <p className="mt-1 text-[13px] leading-relaxed text-text-secondary">{handoff.objective}</p>
      <p className="mt-3 text-[11px] text-text-muted">{MANUAL_EXECUTION_HANDOFF_DISCLAIMER}</p>
    </div>
  );
}
