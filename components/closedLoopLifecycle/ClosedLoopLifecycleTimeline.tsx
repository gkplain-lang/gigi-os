"use client";

import type { ClosedLoopLifecycle } from "@/modules/closedLoopLifecycle";
import { CLOSED_LOOP_LIFECYCLE_STAGE_LABELS } from "@/modules/closedLoopLifecycle";
import { cn } from "@/lib/utils";
import { Check, Circle, Minus, AlertTriangle } from "lucide-react";

const STATUS_ICON: Record<string, typeof Check> = {
  completed: Check,
  missing: Circle,
  available: Circle,
  blocked: AlertTriangle,
  optional: Minus,
  unclear: Circle,
};

interface ClosedLoopLifecycleTimelineProps {
  lifecycle: ClosedLoopLifecycle;
  className?: string;
}

export function ClosedLoopLifecycleTimeline({
  lifecycle,
  className,
}: ClosedLoopLifecycleTimelineProps) {
  return (
    <div className={cn("gigi-panel rounded-xl p-4", className)}>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
        Timeline du cycle
      </p>
      <ol className="mt-3 space-y-2">
        {lifecycle.stageItems.map((item) => {
          const Icon = STATUS_ICON[item.status] ?? Circle;
          const isDone = item.status === "completed";
          return (
            <li
              key={item.id}
              className={cn(
                "flex gap-3 rounded-lg border px-3 py-2 text-[13px]",
                isDone ? "border-emerald-500/20 bg-emerald-500/5" : "border-border bg-surface-2/10"
              )}
            >
              <Icon
                className={cn(
                  "mt-0.5 h-3.5 w-3.5 shrink-0",
                  isDone ? "text-emerald-400" : item.status === "blocked" ? "text-red-400" : "text-text-muted"
                )}
              />
              <div>
                <p className="font-medium text-text-primary">
                  {CLOSED_LOOP_LIFECYCLE_STAGE_LABELS[item.stage]}
                </p>
                <p className="mt-0.5 text-[12px] text-text-secondary">{item.description}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
