"use client";

import type { ClosedLoopLifecycleHealth } from "@/modules/closedLoopLifecycle";
import { CLOSED_LOOP_LIFECYCLE_HEALTH_LABELS } from "@/modules/closedLoopLifecycle";
import { cn } from "@/lib/utils";

const HEALTH_STYLE: Record<ClosedLoopLifecycleHealth, string> = {
  healthy: "border-emerald-500/35 bg-emerald-500/10 text-emerald-300/90",
  incomplete: "border-sky-500/30 bg-sky-500/10 text-sky-200/90",
  risky: "border-amber-500/35 bg-amber-500/10 text-amber-200/90",
  blocked: "border-red-500/30 bg-red-500/10 text-red-300/80",
  unclear: "border-border bg-surface-2/30 text-text-muted",
};

interface ClosedLoopLifecycleHealthBadgeProps {
  health: ClosedLoopLifecycleHealth;
  className?: string;
}

export function ClosedLoopLifecycleHealthBadge({
  health,
  className,
}: ClosedLoopLifecycleHealthBadgeProps) {
  return (
    <span
      className={cn(
        "rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        HEALTH_STYLE[health],
        className
      )}
    >
      {CLOSED_LOOP_LIFECYCLE_HEALTH_LABELS[health]}
    </span>
  );
}
