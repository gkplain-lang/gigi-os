"use client";

import type { LocalReviewSessionStatus } from "@/modules/executionReadiness";
import { LOCAL_REVIEW_STATUS_LABELS } from "@/modules/executionReadiness";
import { cn } from "@/lib/utils";

const STATUS_STYLE: Record<LocalReviewSessionStatus, string> = {
  draft: "border-border/50 text-text-muted",
  awaiting_user_input: "border-sky-500/40 bg-sky-500/10 text-sky-200/90",
  review_ready: "border-indigo-500/40 bg-indigo-500/10 text-indigo-200/90",
  likely_success: "border-emerald-500/40 bg-emerald-500/10 text-emerald-200/90",
  needs_attention: "border-amber-500/40 bg-amber-500/10 text-amber-200/90",
  likely_failed: "border-red-500/40 bg-red-500/10 text-red-200/90",
  inconclusive: "border-border/50 bg-surface-2/20 text-text-muted",
  cancelled: "border-border/50 text-text-muted line-through",
  archived: "border-border/50 text-text-muted",
};

export function LocalReviewStatusBadge({ status }: { status: LocalReviewSessionStatus }) {
  return (
    <span
      className={cn(
        "rounded-md border px-2 py-0.5 text-[11px] font-medium",
        STATUS_STYLE[status]
      )}
    >
      {LOCAL_REVIEW_STATUS_LABELS[status]}
    </span>
  );
}
