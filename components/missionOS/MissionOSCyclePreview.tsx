"use client";

import Link from "next/link";
import type { MissionOSViewModel } from "@/modules/missionOS";
import { MISSION_OS_PHASE_ORDER, MISSION_OS_PHASE_LABELS, phaseIndex } from "@/modules/missionOS";
import { cn } from "@/lib/utils";

interface MissionOSCyclePreviewProps {
  viewModel: MissionOSViewModel;
  className?: string;
}

export function MissionOSCyclePreview({ viewModel, className }: MissionOSCyclePreviewProps) {
  const currentIdx = phaseIndex(viewModel.currentPhase);

  return (
    <div className={cn("rounded-xl border border-border/60 bg-surface-2/30 p-4", className)}>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
        Boucle fermée
      </p>
      <ol className="mt-3 flex flex-wrap gap-2">
        {MISSION_OS_PHASE_ORDER.map((phase, idx) => {
          const active = idx === currentIdx;
          const done = idx < currentIdx;
          return (
            <li
              key={phase}
              className={cn(
                "rounded-full border px-2.5 py-1 text-[11px] font-medium",
                active &&
                  "border-indigo-500/45 bg-indigo-500/15 text-indigo-100",
                done && !active && "border-emerald-500/30 bg-emerald-500/10 text-emerald-200/90",
                !active && !done && "border-border text-text-muted"
              )}
            >
              {MISSION_OS_PHASE_LABELS[phase]}
            </li>
          );
        })}
      </ol>
      {viewModel.activeActionId && (
        <p className="mt-3 text-[12px] text-text-muted">
          Action en cours ·{" "}
          <Link href="/actions" className="text-accent-soft underline-offset-2 hover:underline">
            voir sur /actions
          </Link>
        </p>
      )}
    </div>
  );
}
