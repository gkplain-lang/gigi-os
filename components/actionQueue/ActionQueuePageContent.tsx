"use client";

import { MissionOSActionsBanner } from "@/components/missionOS/MissionOSActionsBanner";
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

export function ActionQueuePageContent() {
  const { state, isHydrated } = useActionQueue();
  const [filter, setFilter] = useState<ActionQueueFilter>({ status: "all" });

  const counts = useMemo(() => countByStatus(state.actions), [state.actions]);
  const projects = useMemo(() => uniqueProjectIds(state.actions), [state.actions]);

  const filtered = useMemo(() => {
    const list = filterQueuedActions(state.actions, filter);
    return sortQueuedActions(list);
  }, [state.actions, filter]);

  if (!isHydrated) return null;

  const filterActive =
    (filter.status && filter.status !== "all") || filter.projectId !== undefined;

  return (
    <div className="gigi-page-shell animate-fade-in">
      <div className="gigi-page-spotlight" aria-hidden />
      <div className="gigi-page-content">
        <PageHeader
          title="Actions à valider"
          meta="Actions préparées par Gigi — aucune exécution automatique."
        />

        <MissionOSActionsBanner />

        <p className="mb-3 rounded-lg border border-amber-500/25 bg-amber-500/5 px-4 py-3 text-[13px] leading-relaxed text-text-secondary">
          {QUEUE_DRY_RUN_NOTE}
        </p>
        <p className="mb-5 text-[12.5px] leading-relaxed text-text-muted">
          <span className="font-medium text-text-secondary">Prochaine étape :</span> valider une
          action → ouvrir le workspace → créer un handoff → coller le rapport d&apos;exécution →
          consulter le cycle complet. Historique et apprentissage sur{" "}
          <Link href="/history" className="text-accent-soft underline-offset-2 hover:underline">
            /history
          </Link>
          .
        </p>

        {state.actions.length > 0 && (
          <div className="mb-5">
            <ActionQueueFilters
              filter={filter}
              onChange={setFilter}
              projects={projects}
              counts={counts}
            />
          </div>
        )}

        {filtered.length === 0 ? (
          <ActionQueueEmptyState filterActive={filterActive && state.actions.length > 0} />
        ) : (
          <div className="space-y-3">
            {filtered.map((action) => (
              <QueuedActionCard key={action.id} action={action} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
