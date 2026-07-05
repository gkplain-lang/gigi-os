"use client";

import Link from "next/link";
import { useMemo } from "react";
import { buildActionFlowViewModel, buildMissionLearningViewModel } from "@/modules/missionOS";
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
  const learning = useMemo(() => buildMissionLearningViewModel(), []);

  return (
    <section className={cn("mb-6", className)} aria-label="Flux d'action V3.2">
      <ActionFlowPrimaryCard viewModel={viewModel} />

      {learning.hasLearning && (
        <p className="mt-4 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-[12.5px] leading-relaxed text-text-secondary">
          Après le rapport, Gigi apprend et recommande la suite —{" "}
          <span className="text-text-primary">{learning.whatGigiLearned.slice(0, 100)}…</span>{" "}
          <Link href="/history" className="text-accent-soft underline-offset-2 hover:underline">
            Voir l&apos;apprentissage récent
          </Link>
          {learning.recommendedNextMissionTitle && (
            <>
              {" "}
              · Suite possible :{" "}
              <Link
                href={learning.recommendedNextMissionRoute}
                className="text-accent-soft underline-offset-2 hover:underline"
              >
                {learning.recommendedNextMissionTitle}
              </Link>
            </>
          )}
        </p>
      )}

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
