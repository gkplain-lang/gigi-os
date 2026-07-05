"use client";

import type { GuidedProjectActionFlow } from "@/modules/executionExperience/guidedActionTypes";
import { GuidedActionStatusBadge } from "./GuidedActionStatusBadge";
import { ExecutionRiskBadge } from "@/components/executionReadiness/ExecutionRiskBadge";
import { getNextGuidedStep } from "@/modules/executionExperience/guidedActionBuilder";
import { cn } from "@/lib/utils";

export function GuidedActionFlowStepper({ flow }: { flow: GuidedProjectActionFlow }) {
  const next = getNextGuidedStep(flow);

  return (
    <ol className="space-y-2">
      {flow.steps.map((step, index) => {
        const isNext = next?.id === step.id;
        const done = step.status === "completed_by_human";
        return (
          <li
            key={step.id}
            className={cn(
              "flex gap-3 rounded-lg border px-3 py-2.5",
              isNext ? "border-indigo-500/35 bg-indigo-500/5" : "border-border/30 bg-surface-2/10",
              done && "opacity-80"
            )}
          >
            <span
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                done
                  ? "bg-emerald-500/20 text-emerald-200/90"
                  : isNext
                    ? "bg-indigo-500/25 text-indigo-200/90"
                    : "bg-surface-2/30 text-text-muted"
              )}
            >
              {done ? "✓" : index + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-medium text-text-primary">{step.label}</p>
              <p className="mt-0.5 text-[11.5px] text-text-secondary">{step.description}</p>
              <a
                href={step.route}
                className="gigi-focus mt-1 inline-flex text-[11px] font-medium text-accent-soft hover:underline"
              >
                Ouvrir {step.route} →
              </a>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export function GuidedActionFlowMiniStepper({ flow }: { flow: GuidedProjectActionFlow }) {
  const next = getNextGuidedStep(flow);
  return (
    <p className="text-[11.5px] text-text-muted">
      Prochaine étape :{" "}
      <span className="text-text-secondary">{next?.label ?? "Parcours complet"}</span>
      {" · "}
      <GuidedActionStatusBadge status={flow.status} className="align-middle" />
      {" · "}
      <ExecutionRiskBadge level={flow.riskLevel} className="align-middle" />
    </p>
  );
}
