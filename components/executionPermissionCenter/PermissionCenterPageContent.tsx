"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  EXECUTION_READINESS_V41_DISCLAIMER,
  buildPermissionCenterViewModel,
  countByPermissionFilter,
  listExecutionReadinessRequests,
  permissionCenterPolicyNotes,
  type PermissionCenterFilterId,
} from "@/modules/executionReadiness";
import { PermissionCenterBadges } from "./PermissionCenterBadges";
import { PermissionCenterSummaryStats } from "./PermissionCenterSummaryStats";
import { PermissionCenterFilters } from "./PermissionCenterFilters";
import { PermissionRequestListItem } from "./PermissionRequestListItem";
import { PermissionRequestDetail } from "./PermissionRequestDetail";
import { PermissionAuditExportPanel } from "./PermissionAuditExportPanel";
import { ExecutionRouteEmptyHint } from "@/components/executionExperience/ExecutionRouteEmptyHint";
import { useIsClient } from "@/components/settings/useIsClient";

export function PermissionCenterPageContent() {
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

  return (
    <div className="gigi-page-shell animate-fade-in">
      <div className="gigi-page-spotlight" aria-hidden />
      <div className="gigi-page-content">
        <PageHeader
          title="Centre de permissions d'exécution"
          meta="Toutes les permissions restent locales et simulées. Aucune action réelle n'est lancée en V4.1."
        />

        <section className="gigi-panel-raised mb-6 rounded-xl border border-violet-500/25 p-5">
          <PermissionCenterBadges className="mb-3" />
          <p className="text-[13px] leading-relaxed text-text-secondary">
            Gigi prépare des demandes d&apos;autorisation sur cet appareil. Chaque approbation
            dry-run est temporaire, révocable et ne déclenche aucune action externe.
          </p>
          <p className="mt-2 text-[12px] italic text-text-muted">{EXECUTION_READINESS_V41_DISCLAIMER}</p>
          <ul className="mt-3 space-y-1 text-[11.5px] text-text-muted">
            {permissionCenterPolicyNotes().map((note) => (
              <li key={note}>· {note}</li>
            ))}
          </ul>
          <Link
            href="/command-packs"
            className="gigi-focus mt-4 inline-flex text-[12.5px] font-medium text-accent-soft hover:underline"
          >
            Packs de commandes →
          </Link>
          <p className="mt-2 text-[11.5px] text-text-muted">
            Parcours : permission locale → pont manuel → pack de commandes — aucune action réelle.
          </p>
          <Link
            href="/manual-bridge"
            className="gigi-focus mt-4 inline-flex text-[12.5px] font-medium text-accent-soft hover:underline"
          >
            Pont manuel d&apos;exécution →
          </Link>
          <Link
            href="/actions"
            className="gigi-focus mt-4 inline-flex text-[12.5px] font-medium text-accent-soft hover:underline"
          >
            Préparer une demande depuis /actions →
          </Link>
        </section>

        <PermissionCenterSummaryStats counts={counts} className="mb-6" />

        <PermissionCenterFilters filter={filter} counts={counts} onChange={setFilter} />

        <p className="mb-4 mt-4 text-[12px] text-text-muted">
          {viewModel.filteredCount} demande(s) · {viewModel.totalCount} au total (hors archivées)
        </p>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <div className="space-y-2">
            {viewModel.requests.length === 0 ? (
              <ExecutionRouteEmptyHint
                message="Rien ici pour l'instant. Prépare une demande locale depuis l'action dominante sur /actions."
                nextSteps={[
                  { label: "Ouvrir Actions", href: "/actions" },
                  { label: "Pont manuel", href: "/manual-bridge" },
                  { label: "Packs commandes", href: "/command-packs" },
                ]}
              />
            ) : (
              viewModel.requests.map((request) => (
                <PermissionRequestListItem
                  key={request.id}
                  request={request}
                  selected={selectedId === request.id}
                  onSelect={() => setSelectedId(request.id)}
                />
              ))
            )}
          </div>

          <div className="gigi-panel rounded-xl p-5 md:p-6">
            {viewModel.selectedRequest ? (
              <PermissionRequestDetail
                request={viewModel.selectedRequest}
                onUpdated={refresh}
              />
            ) : (
              <p className="text-[13px] text-text-secondary">
                Sélectionne une demande pour voir le détail — capacités, scope, risque, rollback et
                journal d&apos;audit local.
              </p>
            )}
          </div>
        </div>

        <div className="mt-8">
          <PermissionAuditExportPanel />
        </div>
      </div>
    </div>
  );
}
