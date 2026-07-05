"use client";

import type { MissionOSViewModel } from "@/modules/missionOS";
import { cn } from "@/lib/utils";

interface MissionCommandTimelineProps {
  viewModel: MissionOSViewModel;
  className?: string;
}

export function MissionCommandTimeline({ viewModel, className }: MissionCommandTimelineProps) {
  return (
    <div className={cn("rounded-xl border border-border/60 bg-surface-2/25 p-4", className)}>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
        Fil du cycle
      </p>
      <ol className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        {viewModel.timelineItems.map((item) => (
          <li
            key={item.phase}
            className={cn(
              "flex items-center gap-2 rounded-lg border px-3 py-2 text-[12px] font-medium",
              item.status === "current" &&
                "border-indigo-500/45 bg-indigo-500/15 text-indigo-100",
              item.status === "done" &&
                "border-emerald-500/30 bg-emerald-500/10 text-emerald-200/90",
              item.status === "upcoming" && "border-border/50 text-text-muted"
            )}
          >
            <span
              className={cn(
                "h-2 w-2 shrink-0 rounded-full",
                item.status === "current" && "bg-indigo-400",
                item.status === "done" && "bg-emerald-400",
                item.status === "upcoming" && "bg-text-muted/40"
              )}
              aria-hidden
            />
            {item.label}
          </li>
        ))}
      </ol>
      {viewModel.hasActiveCycle && (
        <p className="mt-3 text-[12px] text-text-muted">
          Cycle actif · progression {viewModel.progressPercent}%
        </p>
      )}
    </div>
  );
}
