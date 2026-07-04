"use client";

import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { formatMemoryBackupDate, useMemoryStatus } from "@/modules/memory";

const IS_DEV = process.env.NODE_ENV !== "production";

export function MemoryPageContent() {
  const {
    memoryStatus,
    backupState,
    backupNow,
    refreshMemoryStatus,
    lastResult,
    error,
    refreshing,
    persisted,
  } = useMemoryStatus();

  const { label, message, canBackup, canOpenAuth, localSummary, lastBackupAt } = memoryStatus;
  const isSaving = backupState === "saving";

  return (
    <>
      <PageHeader
        title="Mémoire"
        meta="Sauvegarde distante optionnelle — localStorage reste la source principale."
      />

      <div className="space-y-4">
        <section className="rounded-xl border border-border bg-surface p-5">
          <p className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
            Statut
          </p>
          <p className="mt-2 text-[16px] font-medium text-text-primary">{label}</p>
          <p className="mt-1 text-[14px] leading-relaxed text-text-secondary">{message}</p>
          <p className="mt-3 text-[13px] text-text-muted">
            Gigi continue de fonctionner en local.
          </p>
        </section>

        {localSummary && (
          <section className="rounded-xl border border-border bg-surface p-5">
            <p className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
              Résumé local
            </p>
            <dl className="mt-3 space-y-2 text-[14px] text-text-secondary">
              <div className="flex justify-between gap-4">
                <dt className="text-text-muted">Projets</dt>
                <dd>{localSummary.projectsCount}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-text-muted">Missions</dt>
                <dd>{localSummary.missionsCount}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-text-muted">Historique</dt>
                <dd>{localSummary.historyEventsCount}</dd>
              </div>
            </dl>
          </section>
        )}

        <section className="rounded-xl border border-border bg-surface p-5">
          <p className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
            Sauvegarde distante
          </p>
          {lastBackupAt ? (
            <p className="mt-2 text-[14px] text-text-secondary">
              Dernière sauvegarde : {formatMemoryBackupDate(lastBackupAt)}
            </p>
          ) : (
            <p className="mt-2 text-[14px] text-text-muted">Aucune sauvegarde distante enregistrée.</p>
          )}
          {persisted.lastBackupCounts && (
            <p className="mt-1 text-[13px] text-text-muted">
              {persisted.lastBackupCounts.projects} proj · {persisted.lastBackupCounts.missions}{" "}
              miss · {persisted.lastBackupCounts.history} hist
            </p>
          )}

          <div className="mt-4 flex flex-wrap gap-3">
            {canBackup && (
              <button
                type="button"
                onClick={() => void backupNow()}
                disabled={isSaving}
                className="gigi-focus rounded-lg border border-border bg-white/[0.04] px-4 py-2 text-[14px] text-text-primary transition-colors hover:bg-white/[0.07] disabled:opacity-50"
              >
                {isSaving ? "Sauvegarde en cours…" : "Sauvegarder maintenant"}
              </button>
            )}
            {canOpenAuth && (
              <Link
                href="/auth"
                className="gigi-focus rounded-lg border border-border px-4 py-2 text-[14px] text-text-secondary transition-colors hover:text-text-primary"
              >
                Se connecter
              </Link>
            )}
            <button
              type="button"
              onClick={() => void refreshMemoryStatus()}
              disabled={refreshing || canOpenAuth}
              className="gigi-focus rounded-lg border border-border px-4 py-2 text-[14px] text-text-muted transition-colors hover:text-text-secondary disabled:opacity-50"
            >
              {refreshing ? "Actualisation…" : "Actualiser statut"}
            </button>
          </div>

          {lastResult && (
            <p
              className={`mt-3 text-[13px] ${
                lastResult.status === "success" ? "text-ok" : "text-text-muted"
              }`}
            >
              {lastResult.message}
            </p>
          )}
          {error && <p className="mt-2 text-[13px] text-text-secondary">{error}</p>}
        </section>

        {IS_DEV && (
          <p className="text-[12px] text-text-muted/70">
            Dev :{" "}
            <Link href="/dev/sync" className="hover:text-text-muted">
              /dev/sync
            </Link>
            {" · "}
            <Link href="/dev/persistence" className="hover:text-text-muted">
              /dev/persistence
            </Link>
          </p>
        )}
      </div>
    </>
  );
}
