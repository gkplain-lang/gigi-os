"use client";

import { useMemo } from "react";
import { buildActionFlowViewModel } from "@/modules/missionOS";
import { useActionQueue } from "@/components/providers/ActionQueueProvider";
import { ActionFlowPrimaryCard } from "./ActionFlowPrimaryCard";
import { ActionFlowStageTabs } from "./ActionFlowStageTabs";
import { ActionFlowEmptyState } from "./ActionFlowEmptyState";
import { ActionFlowSafetyNote } from "./ActionFlowSafetyNote";
import { cn } from "@/lib/utils";

interface ActionFlowViewProps {
  className?: string;
}

export function ActionFlowView({ className }: ActionFlowViewProps) {
  const { state } = useActionQueue();
  const viewModel = useMemo(
    () => buildActionFlowViewModel(state.actions),
    [state.actions]
  );

  return (
    <section className={cn("mb-6", className)} aria-label="Flux d'action V3.2">
      <ActionFlowPrimaryCard viewModel={viewModel} />

      <ActionFlowStageTabs
        stageItems={viewModel.stageItems}
        activeStepId={viewModel.flowStepId}
      />

      {viewModel.emptyStateTitle && viewModel.emptyStateDescription && (
        <ActionFlowEmptyState
          className="mt-5"
          title={viewModel.emptyStateTitle}
          description={viewModel.emptyStateDescription}
        />
      )}

      <ActionFlowSafetyNote note={viewModel.safetyNote} className="mt-5" />
    </section>
  );
}
