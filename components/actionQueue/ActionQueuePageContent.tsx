"use client";

import { ActionFlowView } from "@/components/actionQueue/ActionFlowView";
import { ActionFlowDetails } from "@/components/actionQueue/ActionFlowDetails";
import Link from "next/link";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { ActionQueueFilters } from "@/components/actionQueue/ActionQueueFilters";
import { ActionQueueEmptyState } from "@/components/actionQueue/ActionQueueEmptyState";
import { QueuedActionCard } from "@/components/actionQueue/QueuedActionCard";
import { useActionQueue } from "@/components/providers/ActionQueueProvider";
import type { ActionQueueFilter } from "@/modules/actionQueue";
import {
  countByStatus,
  filterQueuedActions,
  QUEUE_DRY_RUN_NOTE,
  sortQueuedActions,
  uniqueProjectIds,
} from "@/modules/actionQueue";
import { buildActionFlowViewModel } from "@/modules/missionOS";
import { ExecutionReadinessPanel } from "@/components/executionReadiness/ExecutionReadinessPanel";
import { ExecutionPermissionCenterEmbed } from "@/components/executionPermissionCenter/ExecutionPermissionCenterEmbed";
import { ManualBridgeEmbed } from "@/components/manualBridge/ManualBridgeEmbed";

export function ActionQueuePageContent() {
  const { state, isHydrated } = useActionQueue();
  const [filter, setFilter] = useState<ActionQueueFilter>({ status: "all" });

  const flowViewModel = useMemo(
    () => buildActionFlowViewModel(state.actions),
    [state.actions]
  );

  const primaryAction = useMemo(
    () => state.actions.find((a) => a.id === flowViewModel.primaryActionId),
    [state.actions, flowViewModel.primaryActionId]
  );

  const counts = useMemo(() => countByStatus(state.actions), [state.actions]);
  const projects = useMemo(() => uniqueProjectIds(state.actions), [state.actions]);

  const filtered = useMemo(() => {
    const list = filterQueuedActions(state.actions, filter);
    return sortQueuedActions(list);
  }, [state.actions, filter]);

  if (!isHydrated) return null;

  const filterActive =
    (filter.status && filter.status !== "all") || filter.projectId !== undefined;

  const advancedSlot = (
    <>
      <p className="rounded-lg border border-amber-500/25 bg-amber-500/5 px-4 py-3 text-[13px] leading-relaxed text-text-secondary">
        {QUEUE_DRY_RUN_NOTE}
      </p>
      <p className="text-[12.5px] leading-relaxed text-text-muted">
        Chaque module ci-dessous reste manuel. Historique et apprentissage sur{" "}
        <Link href="/history" className="text-accent-soft underline-offset-2 hover:underline">
          /history
        </Link>
        .
      </p>

      {state.actions.length > 0 && (
        <ActionQueueFilters
          filter={filter}
          onChange={setFilter}
          projects={projects}
          counts={counts}
        />
      )}

      {filtered.length === 0 ? (
        <ActionQueueEmptyState filterActive={filterActive && state.actions.length > 0} />
      ) : (
        <div className="space-y-3">
          {filtered.map((action) => (
            <QueuedActionCard
              key={action.id}
              action={action}
              highlight={action.id === flowViewModel.primaryActionId}
            />
          ))}
        </div>
      )}
    </>
  );

  return (
    <div className="gigi-page-shell animate-fade-in">
      <div className="gigi-page-spotlight" aria-hidden />
      <div className="gigi-page-content">
        <PageHeader
          title="Flux d'action"
          meta="Une action à la fois — prépare, exécute hors de Gigi, colle le rapport. Rien n'est automatique."
        />

        <ActionFlowView />

        <ExecutionReadinessPanel primaryAction={primaryAction} className="mb-6" />

        <ExecutionPermissionCenterEmbed />

        <ManualBridgeEmbed />

        <ActionFlowDetails
          groupedActions={flowViewModel.groupedActions}
          advancedSlot={advancedSlot}
        />
      </div>
    </div>
  );
}
