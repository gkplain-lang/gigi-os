"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  commandPackPolicyNotes,
  generateCommandPackSummary,
  getCommandPackById,
  listCommandPacks,
  syncExpiredCommandPacks,
} from "@/modules/executionReadiness";
import { CommandPackBadges } from "./CommandPackBadges";
import { CommandPackDisclaimer } from "./CommandPackDisclaimer";
import { CommandPacksSummaryStats } from "./CommandPacksSummaryStats";
import { CommandPackTemplateGallery } from "./CommandPackTemplateGallery";
import { CommandPackList } from "./CommandPackList";
import { CommandPackDetail } from "./CommandPackDetail";
import { CommandPackExportPanel } from "./CommandPackExportPanel";
import { useIsClient } from "@/components/settings/useIsClient";

export function CommandPacksPanel() {
  const isClient = useIsClient();
  const searchParams = useSearchParams();
  const packFromUrl = searchParams.get("pack");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const effectiveSelectedId = selectedId ?? packFromUrl;
  const [revision, setRevision] = useState(0);

  const refresh = useCallback(() => setRevision((r) => r + 1), []);

  const summary = useMemo(() => {
    if (!isClient) return null;
    void revision;
    syncExpiredCommandPacks();
    return generateCommandPackSummary();
  }, [isClient, revision]);

  const packs = useMemo(() => {
    if (!isClient) return [];
    void revision;
    return listCommandPacks();
  }, [isClient, revision]);

  const selected = useMemo(() => {
    if (!effectiveSelectedId) return null;
    void revision;
    return getCommandPackById(effectiveSelectedId) ?? null;
  }, [effectiveSelectedId, revision]);

  if (!isClient || !summary) return null;

  return (
    <div className="gigi-page-shell animate-fade-in">
      <div className="gigi-page-spotlight" aria-hidden />
      <div className="gigi-page-content">
        <PageHeader
          title="Packs de commandes"
          meta="Gigi prépare des commandes à relire et copier. Rien n'est lancé automatiquement."
        />

        <section className="gigi-panel-raised mb-6 rounded-xl border border-violet-500/25 p-5">
          <CommandPackBadges className="mb-3" />
          <p className="text-[13px] leading-relaxed text-text-secondary">
            Commandes structurées à copier — lancement humain, validation locale, sandbox connecteurs,
            aucune exécution réelle.
          </p>
          <CommandPackDisclaimer className="mt-3" />
          <ul className="mt-3 space-y-1 text-[11.5px] text-text-muted">
            {commandPackPolicyNotes().map((note) => (
              <li key={note}>· {note}</li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/manual-bridge"
              className="gigi-btn-secondary gigi-focus inline-flex rounded-lg px-3.5 py-2 text-[12.5px] font-medium"
            >
              Pont manuel →
            </Link>
            <Link
              href="/permissions"
              className="gigi-btn-secondary gigi-focus inline-flex rounded-lg px-3.5 py-2 text-[12.5px] font-medium"
            >
              Permissions →
            </Link>
            <Link
              href="/actions"
              className="gigi-focus inline-flex items-center text-[12.5px] font-medium text-accent-soft hover:underline"
            >
              /actions →
            </Link>
          </div>
        </section>

        <CommandPacksSummaryStats summary={summary} className="mb-6" />

        <CommandPackTemplateGallery
          onCreated={(id) => {
            setSelectedId(id);
            refresh();
          }}
        />

        <div className="mb-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <div>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
              Packs de commandes
            </p>
            <CommandPackList
              packs={packs}
              selectedId={effectiveSelectedId}
              onSelect={setSelectedId}
            />
          </div>
          <div className="gigi-panel rounded-xl p-5 md:p-6">
            {selected ? (
              <CommandPackDetail pack={selected} onUpdated={refresh} />
            ) : (
              <p className="text-[13px] text-text-secondary">
                Sélectionne un pack — objectif, checklist, commandes copiables, rollback et journal
                local.
              </p>
            )}
          </div>
        </div>

        <CommandPackExportPanel />
      </div>
    </div>
  );
}
