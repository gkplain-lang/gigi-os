"use client";

import type { ClosedLoopLifecycle } from "@/modules/closedLoopLifecycle";
import { cn } from "@/lib/utils";

interface ClosedLoopLifecycleNextStepsProps {
  lifecycle: ClosedLoopLifecycle;
  className?: string;
}

export function ClosedLoopLifecycleNextSteps({
  lifecycle,
  className,
}: ClosedLoopLifecycleNextStepsProps) {
  if (lifecycle.nextSteps.length === 0) return null;

  return (
    <div className={cn("gigi-panel rounded-xl p-4", className)}>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
        Prochaines étapes (recommandations locales)
      </p>
      <ol className="mt-3 space-y-3">
        {lifecycle.nextSteps.map((step, i) => (
          <li key={step.id} className="text-[13px]">
            <p className="font-medium text-text-primary">
              {i + 1}. {step.label}
              {step.manualOnly && (
                <span className="ml-2 text-[10px] font-normal text-text-muted">(manuel)</span>
              )}
            </p>
            <p className="mt-0.5 text-text-secondary">{step.description}</p>
            <p className="mt-0.5 text-[11.5px] text-accent-soft">{step.reason}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
