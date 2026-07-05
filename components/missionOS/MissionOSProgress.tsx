"use client";

import type { MissionOSViewModel } from "@/modules/missionOS";
import { cn } from "@/lib/utils";

interface MissionOSProgressProps {
  viewModel: MissionOSViewModel;
  className?: string;
}

export function MissionOSProgress({ viewModel, className }: MissionOSProgressProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-[11px] text-text-muted">
        <span>Progression du cycle</span>
        <span className="font-medium text-text-secondary">{viewModel.progressPercent}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-surface-2">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500/80 to-accent-soft/90 transition-all duration-500"
          style={{ width: `${Math.min(100, Math.max(0, viewModel.progressPercent))}%` }}
          role="progressbar"
          aria-valuenow={viewModel.progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}
