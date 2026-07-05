"use client";

import { GUIDED_FLOW_STATUS_LABELS, type GuidedFlowStatus } from "@/modules/executionExperience/guidedActionTypes";
import { cn } from "@/lib/utils";

const STATUS_STYLE: Partial<Record<GuidedFlowStatus, string>> = {
  draft: "border-border/50 text-text-muted",
  action_selected: "border-indigo-500/40 text-indigo-200/90",
  request_prepared: "border-violet-500/40 text-violet-200/90",
  permission_review_ready: "border-amber-500/40 text-amber-200/90",
  manual_bridge_ready: "border-blue-500/40 text-blue-200/90",
  command_pack_ready: "border-purple-500/40 text-purple-200/90",
  local_review_ready: "border-teal-500/40 text-teal-200/90",
  completed_by_human: "border-emerald-500/40 text-emerald-200/90",
  cancelled: "border-border/40 text-text-muted line-through",
};

export function GuidedActionStatusBadge({
  status,
  className,
}: {
  status: GuidedFlowStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
        STATUS_STYLE[status] ?? "border-border/40 text-text-muted",
        className
      )}
    >
      {GUIDED_FLOW_STATUS_LABELS[status]}
    </span>
  );
}
