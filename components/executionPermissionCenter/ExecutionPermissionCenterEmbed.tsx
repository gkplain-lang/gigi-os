"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import {
  EXECUTION_READINESS_V41_DISCLAIMER,
  buildPermissionCenterViewModel,
  countByPermissionFilter,
  listExecutionReadinessRequests,
  type PermissionCenterFilterId,
} from "@/modules/executionReadiness";
import { PermissionCenterBadges } from "./PermissionCenterBadges";
import { PermissionCenterFilters } from "./PermissionCenterFilters";
import { PermissionCenterSummaryStats } from "./PermissionCenterSummaryStats";
import { PermissionRequestListItem } from "./PermissionRequestListItem";
import { PermissionRequestDetail } from "./PermissionRequestDetail";
import { useIsClient } from "@/components/settings/useIsClient";
import { cn } from "@/lib/utils";

const EMBED_LIST_LIMIT = 5;

interface ExecutionPermissionCenterEmbedProps {
  className?: string;
}

export function ExecutionPermissionCenterEmbed({
  className,
}: ExecutionPermissionCenterEmbedProps) {
  const isClient = useIsClient();
  const [filter, setFilter] = useState<PermissionCenterFilterId>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [revision, setRevision] = useState(0);

  const refresh = useCallback(() => setRevision((r) => r + 1), []);

  const viewModel = useMemo(() => {
    if (!isClient) return null;
    void revision;
    return buildPermissionCenterViewModel(filter, selectedId, { syncExpiration: true });
  }, [isClient, filter, selectedId, revision]);

  const counts = useMemo(() => {
    if (!isClient) return null;
    void revision;
    return countByPermissionFilter(listExecutionReadinessRequests());
  }, [isClient, revision]);

  if (!isClient || !viewModel || !counts) return null;

  const visibleRequests = viewModel.requests.slice(0, EMBED_LIST_LIMIT);

  return (
    <section
      className={cn(
        "gigi-panel-raised mb-6 rounded-xl border border-violet-500/25 p-5 md:p-6",
        className
      )}
      aria-label="Centre de permissions d'exécution V4.1"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-violet-200/90">
            Centre de permissions d&apos;exécution · V4.1
          </p>
          <p className="mt-1 max-w-2xl text-[13px] leading-relaxed text-text-secondary">
            Toutes les permissions restent locales et simulées. Aucune action réelle n&apos;est
            lancée en V4.1.
          </p>
        </div>
        <Link
          href="/permissions"
          className="gigi-btn-secondary gigi-focus shrink-0 rounded-lg px-3 py-1.5 text-[12px] font-medium"
        >
          Centre complet →
        </Link>
      </div>

      <PermissionCenterBadges className="mt-4" />
      <p className="mt-3 text-[11.5px] italic text-text-muted">{EXECUTION_READINESS_V41_DISCLAIMER}</p>

      <PermissionCenterSummaryStats counts={counts} className="mt-4" />

      <PermissionCenterFilters filter={filter} counts={counts} onChange={setFilter} className="mt-4" />

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="space-y-2">
          {visibleRequests.length === 0 ? (
            <p className="rounded-lg border border-border/40 px-4 py-6 text-center text-[13px] text-text-muted">
              Aucune demande pour ce filtre — prépare-en une via le panneau V4 ci-dessus.
            </p>
          ) : (
            visibleRequests.map((request) => (
              <PermissionRequestListItem
                key={request.id}
                request={request}
                selected={selectedId === request.id}
                onSelect={() => setSelectedId(request.id)}
              />
            ))
          )}
          {viewModel.filteredCount > EMBED_LIST_LIMIT && (
            <Link
              href="/permissions"
              className="gigi-focus block text-center text-[12.5px] font-medium text-accent-soft hover:underline"
            >
              Voir les {viewModel.filteredCount} demandes →
            </Link>
          )}
        </div>

        <div className="rounded-xl border border-border/40 bg-surface-2/10 p-4">
          {viewModel.selectedRequest ? (
            <PermissionRequestDetail
              request={viewModel.selectedRequest}
              onUpdated={refresh}
            />
          ) : (
            <p className="text-[13px] text-text-secondary">
              Sélectionne une demande pour le détail — capacité, scope, risque, rollback et journal
              local.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
