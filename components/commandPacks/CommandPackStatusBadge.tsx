"use client";

import type { CommandPackStatus } from "@/modules/executionReadiness";
import { COMMAND_PACK_STATUS_LABELS } from "@/modules/executionReadiness";
import { cn } from "@/lib/utils";

const STATUS_STYLE: Record<CommandPackStatus, string> = {
  draft: "border-border/50 text-text-muted",
  ready_for_review: "border-violet-500/40 bg-violet-500/10 text-violet-200/90",
  copied_by_human: "border-sky-500/40 bg-sky-500/10 text-sky-200/90",
  marked_run_by_human: "border-indigo-500/40 bg-indigo-500/10 text-indigo-200/90",
  marked_success_by_human: "border-emerald-500/40 bg-emerald-500/10 text-emerald-200/90",
  marked_failed_by_human: "border-red-500/40 bg-red-500/10 text-red-200/90",
  cancelled: "border-border/50 text-text-muted line-through",
  expired: "border-amber-500/40 bg-amber-500/10 text-amber-200/90",
};

interface CommandPackStatusBadgeProps {
  status: CommandPackStatus;
  className?: string;
}

export function CommandPackStatusBadge({ status, className }: CommandPackStatusBadgeProps) {
  return (
    <span
      className={cn(
        "rounded-md border px-2 py-0.5 text-[11px] font-medium",
        STATUS_STYLE[status],
        className
      )}
    >
      {COMMAND_PACK_STATUS_LABELS[status]}
    </span>
  );
}
