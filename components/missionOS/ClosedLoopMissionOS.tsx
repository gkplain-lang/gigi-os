"use client";

import { useMemo } from "react";
import type { MissionOSBuildInput } from "@/modules/missionOS";
import { buildMissionOSViewModel } from "@/modules/missionOS";
import { MissionOSHero } from "./MissionOSHero";
import { MissionOSProgress } from "./MissionOSProgress";
import { MissionOSCurrentStep } from "./MissionOSCurrentStep";
import { MissionOSNextAction } from "./MissionOSNextAction";
import { MissionOSCyclePreview } from "./MissionOSCyclePreview";
import { MissionOSLearningPreview } from "./MissionOSLearningPreview";
import { MissionOSSafetyNoteFromVM } from "./MissionOSSafetyNote";
import { cn } from "@/lib/utils";

interface ClosedLoopMissionOSProps {
  input: MissionOSBuildInput;
  className?: string;
  compact?: boolean;
}

export function ClosedLoopMissionOS({ input, className, compact }: ClosedLoopMissionOSProps) {
  const viewModel = useMemo(
    () => buildMissionOSViewModel(input),
    // Champs explicites — évite recompute si l'objet inline change de référence sans contenu
    // eslint-disable-next-line react-hooks/exhaustive-deps -- input fields listed explicitly
    [
      input.missionTitle,
      input.missionSummary,
      input.missionId,
      input.projectId,
      input.missionStatus,
    ]
  );

  if (compact) {
    return (
      <section
        className={cn(
          "gigi-panel-raised rounded-xl border border-indigo-500/20 p-4 md:p-5",
          className
        )}
      >
        <MissionOSHero viewModel={viewModel} />
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <MissionOSCurrentStep viewModel={viewModel} />
          <MissionOSNextAction viewModel={viewModel} compact />
        </div>
        <MissionOSSafetyNoteFromVM viewModel={viewModel} className="mt-3" />
      </section>
    );
  }

  return (
    <section
      className={cn(
        "gigi-panel-raised rounded-xl border border-indigo-500/25 p-5 md:p-6",
        className
      )}
    >
      <MissionOSHero viewModel={viewModel} />
      <div className="mt-5">
        <MissionOSProgress viewModel={viewModel} />
      </div>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <MissionOSCurrentStep viewModel={viewModel} />
        <MissionOSNextAction viewModel={viewModel} />
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <MissionOSCyclePreview viewModel={viewModel} />
        <MissionOSLearningPreview viewModel={viewModel} />
      </div>
      <MissionOSSafetyNoteFromVM viewModel={viewModel} className="mt-4" />
    </section>
  );
}

export { buildMissionOSViewModel };
