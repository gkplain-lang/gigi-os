"use client";

import type { ManualExecutionPacketStatus } from "@/modules/executionReadiness";
import { MANUAL_PACKET_STATUS_LABELS } from "@/modules/executionReadiness";
import { cn } from "@/lib/utils";

const STATUS_STYLE: Partial<Record<ManualExecutionPacketStatus, string>> = {
  ready_for_human_review: "border-violet-500/30 bg-violet-500/10 text-violet-200/90",
  copied_by_human: "border-sky-500/30 bg-sky-500/10 text-sky-200/90",
  marked_done_by_human: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200/90",
  cancelled: "border-border/50 bg-surface-2/20 text-text-muted",
  expired: "border-amber-500/30 bg-amber-500/10 text-amber-200/90",
};

export function ManualBridgeStatusBadge({
  status,
  className,
}: {
  status: ManualExecutionPacketStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
        STATUS_STYLE[status] ?? "border-border/50 text-text-muted",
        className
      )}
    >
      {MANUAL_PACKET_STATUS_LABELS[status]}
    </span>
  );
}
