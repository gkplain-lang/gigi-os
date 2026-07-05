"use client";

import type { GuidedProjectActionFlow } from "@/modules/executionExperience/guidedActionTypes";
import { GuidedActionStatusBadge } from "./GuidedActionStatusBadge";
import { GuidedActionFlowMiniStepper } from "./GuidedActionFlowStepper";
import { ExecutionRiskBadge } from "@/components/executionReadiness/ExecutionRiskBadge";
import { cn } from "@/lib/utils";

interface GuidedActionFlowListProps {
  flows: GuidedProjectActionFlow[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function GuidedActionFlowList({ flows, selectedId, onSelect }: GuidedActionFlowListProps) {
  if (flows.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border/50 px-4 py-8 text-center">
        <p className="text-[13px] text-text-secondary">
          Aucun parcours guidé — choisis un modèle ci-dessus pour commencer.
        </p>
        <p className="mt-2 text-[11px] text-text-muted">
          Local uniquement · aucune exécution réelle · validation humaine obligatoire.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {flows.map((flow) => {
        const isSelected = flow.id === selectedId;
        return (
          <li key={flow.id}>
            <button
              type="button"
              onClick={() => onSelect(flow.id)}
              className={cn(
                "gigi-focus w-full rounded-lg border px-3 py-2.5 text-left transition-colors",
                isSelected
                  ? "border-indigo-500/45 bg-indigo-500/10"
                  : "border-border/40 bg-surface-2/10 hover:border-border/60"
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <p className="text-[13px] font-medium text-text-primary">{flow.title}</p>
                <GuidedActionStatusBadge status={flow.status} />
              </div>
              {flow.projectName && (
                <p className="mt-1 text-[11px] text-text-muted">Projet · {flow.projectName}</p>
              )}
              <div className="mt-2">
                <ExecutionRiskBadge level={flow.riskLevel} />
              </div>
              <div className="mt-2">
                <GuidedActionFlowMiniStepper flow={flow} />
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
