"use client";

import type { MissionOSViewModel } from "@/modules/missionOS";
import { MISSION_OS_PHASE_LABELS, formatReadinessLabel } from "@/modules/missionOS";
import { cn } from "@/lib/utils";

interface MissionOSHeroProps {
  viewModel: MissionOSViewModel;
  className?: string;
}

export function MissionOSHero({ viewModel, className }: MissionOSHeroProps) {
  return (
    <header className={cn("space-y-2", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-indigo-500/35 bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-indigo-200/90">
          Gigi V3 · Closed Loop Mission OS
        </span>
        <span className="rounded-full border border-[rgba(124,140,255,0.35)] bg-[rgba(124,140,255,0.1)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent-soft">
          {MISSION_OS_PHASE_LABELS[viewModel.currentPhase]}
        </span>
        <span className="text-[11px] text-text-muted">{formatReadinessLabel(viewModel)}</span>
      </div>
      <h2 className="text-[18px] font-bold tracking-tight text-text-primary md:text-[20px]">
        {viewModel.currentMissionTitle}
      </h2>
      <p className="max-w-2xl text-[13.5px] leading-relaxed text-text-secondary">
        {viewModel.currentMissionSummary}
      </p>
    </header>
  );
}
