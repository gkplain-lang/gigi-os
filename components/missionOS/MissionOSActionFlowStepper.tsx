"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buildActionFlowViewModel } from "@/modules/missionOS";
import { useActionQueue } from "@/components/providers/ActionQueueProvider";
import { cn } from "@/lib/utils";

const FLOW_STEPS = [
  { id: "decision", label: "Décision" },
  { id: "validation", label: "Validation" },
  { id: "preparation", label: "Préparation" },
  { id: "handoff", label: "Passation" },
  { id: "report", label: "Rapport" },
  { id: "cycle", label: "Cycle" },
] as const;

interface MissionOSActionFlowStepperProps {
  className?: string;
}

/** Bannière compacte — préférer ActionFlowView sur /actions (V3.2). */
export function MissionOSActionFlowStepper({ className }: MissionOSActionFlowStepperProps) {
  const { state } = useActionQueue();
  const viewModel = useMemo(
    () => buildActionFlowViewModel(state.actions),
    [state.actions]
  );

  const activeStepId = viewModel.flowStepId;

  return (
    <section
      className={cn(
        "mb-5 rounded-xl border border-indigo-500/25 bg-indigo-500/5 p-4 md:p-5",
        className
      )}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-200/90">
        Flux d&apos;action
      </p>
      <ol className="mt-3 flex flex-wrap gap-2">
        {FLOW_STEPS.map((step) => {
          const isActive = step.id === activeStepId;
          const stepIndex = FLOW_STEPS.findIndex((s) => s.id === step.id);
          const activeIndex = FLOW_STEPS.findIndex((s) => s.id === activeStepId);
          const isDone = stepIndex < activeIndex;
          return (
            <li
              key={step.id}
              className={cn(
                "rounded-full border px-2.5 py-1 text-[11px] font-medium",
                isActive && "border-indigo-400/50 bg-indigo-500/20 text-indigo-100",
                isDone && !isActive && "border-emerald-500/30 text-emerald-200/80",
                !isActive && !isDone && "border-border/50 text-text-muted"
              )}
            >
              {step.label}
            </li>
          );
        })}
      </ol>
      <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[14px] font-semibold text-text-primary">
            {viewModel.primaryActionTitle}
          </p>
          <p className="mt-1 text-[12.5px] text-text-muted">
            {viewModel.activeStageLabel} · {viewModel.activeStatusLabel}
          </p>
        </div>
        <Link
          href={viewModel.primaryCtaRoute}
          className="gigi-btn-primary gigi-focus inline-flex shrink-0 items-center gap-2 rounded-lg px-3.5 py-2 text-[13px] font-medium"
        >
          {viewModel.primaryCtaLabel}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      <p className="mt-3 text-[11px] text-text-muted">
        Chaque étape nécessite ton clic — Gigi ne valide ni n&apos;exécute automatiquement.
      </p>
    </section>
  );
}
