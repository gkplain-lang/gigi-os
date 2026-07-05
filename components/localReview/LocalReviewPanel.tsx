"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  createEmptyReviewSession,
  generateLocalReviewSummary,
  getLocalReviewSessionById,
  listLocalReviewSessions,
  localReviewPolicyNotes,
} from "@/modules/executionReadiness";
import { LocalReviewBadges } from "./LocalReviewBadges";
import { LocalReviewDisclaimer } from "./LocalReviewDisclaimer";
import { LocalReviewSummaryStats } from "./LocalReviewSummaryStats";
import { LocalReviewSessionList } from "./LocalReviewSessionList";
import { LocalReviewSessionDetail } from "./LocalReviewSessionDetail";
import { LocalReviewExportPanel } from "./LocalReviewExportPanel";
import { useIsClient } from "@/components/settings/useIsClient";

export function LocalReviewPanel() {
  const isClient = useIsClient();
  const searchParams = useSearchParams();
  const sessionFromUrl = searchParams.get("session");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const effectiveSelectedId = selectedId ?? sessionFromUrl;
  const [revision, setRevision] = useState(0);

  const refresh = useCallback(() => setRevision((r) => r + 1), []);

  const summary = useMemo(() => {
    if (!isClient) return null;
    void revision;
    return generateLocalReviewSummary();
  }, [isClient, revision]);

  const sessions = useMemo(() => {
    if (!isClient) return [];
    void revision;
    return listLocalReviewSessions();
  }, [isClient, revision]);

  const selected = useMemo(() => {
    if (!effectiveSelectedId) return null;
    void revision;
    return getLocalReviewSessionById(effectiveSelectedId) ?? null;
  }, [effectiveSelectedId, revision]);

  if (!isClient || !summary) return null;

  function handleCreateSession() {
    const session = createEmptyReviewSession();
    setSelectedId(session.id);
    refresh();
  }

  return (
    <div className="gigi-page-shell animate-fade-in">
      <div className="gigi-page-spotlight" aria-hidden />
      <div className="gigi-page-content">
        <PageHeader
          title="Revue locale"
          meta="Colle un résultat obtenu manuellement. Gigi l'analyse localement, sans lire ton terminal ni exécuter de commande."
        />

        <section className="gigi-panel-raised mb-6 rounded-xl border border-teal-500/25 p-5">
          <LocalReviewBadges className="mb-3" />
          <p className="text-[13px] leading-relaxed text-text-secondary">
            Analyse prudente du texte collé — statuts probables, signaux détectés, contrôle humain
            obligatoire. Gigi ne lit pas ton terminal, n&apos;inspecte pas tes fichiers, n&apos;appelle
            aucune API.
          </p>
          <LocalReviewDisclaimer className="mt-3" />
          <ul className="mt-3 space-y-1 text-[11.5px] text-text-muted">
            {localReviewPolicyNotes().map((note) => (
              <li key={note}>· {note}</li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleCreateSession}
              className="gigi-btn-primary gigi-focus rounded-lg px-3.5 py-2 text-[12.5px] font-medium"
            >
              Créer une revue locale
            </button>
            <Link
              href="/command-packs"
              className="gigi-btn-secondary gigi-focus inline-flex rounded-lg px-3.5 py-2 text-[12.5px] font-medium"
            >
              Packs commandes →
            </Link>
            <Link
              href="/actions"
              className="gigi-focus inline-flex items-center text-[12.5px] font-medium text-accent-soft hover:underline"
            >
              /actions →
            </Link>
          </div>
        </section>

        <LocalReviewSummaryStats summary={summary} className="mb-6" />

        <div className="mb-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <div>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
              Sessions de revue
            </p>
            <LocalReviewSessionList
              sessions={sessions}
              selectedId={effectiveSelectedId}
              onSelect={setSelectedId}
            />
          </div>
          <div className="gigi-panel rounded-xl p-5 md:p-6">
            {selected ? (
              <LocalReviewSessionDetail session={selected} onUpdated={refresh} />
            ) : (
              <p className="text-[13px] text-text-secondary">
                Sélectionne une revue — colle un résultat, consulte les signaux et valide humainement.
              </p>
            )}
          </div>
        </div>

        <LocalReviewExportPanel />
      </div>
    </div>
  );
}
