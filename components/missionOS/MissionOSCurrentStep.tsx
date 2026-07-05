"use client";

import type { MissionOSViewModel } from "@/modules/missionOS";
import { cn } from "@/lib/utils";

interface MissionOSCurrentStepProps {
  viewModel: MissionOSViewModel;
  className?: string;
}

export function MissionOSCurrentStep({ viewModel, className }: MissionOSCurrentStepProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-indigo-500/25 bg-indigo-500/5 p-4",
        className
      )}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-200/90">
        Étape actuelle
      </p>
      <p className="mt-1.5 text-[15px] font-semibold text-text-primary">
        {viewModel.currentStepLabel}
      </p>
      <p className="mt-2 text-[13px] leading-relaxed text-text-secondary">
        {viewModel.currentStepDescription}
      </p>
      {viewModel.reasons.length > 0 && (
        <div className="mt-3 space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            Pourquoi
          </p>
          <ul className="list-inside list-disc space-y-0.5 text-[12.5px] text-text-secondary">
            {viewModel.reasons.slice(0, 3).map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
