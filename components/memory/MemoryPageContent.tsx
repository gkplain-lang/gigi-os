"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { HardDrive, Cloud, Shield } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { REFINED_PAGE_META } from "@/modules/dailyUseRefinement";
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
  const [formattedBackup, setFormattedBackup] = useState<string | null>(null);
  const isSaving = backupState === "saving";

  useEffect(() => {
    setFormattedBackup(formatMemoryBackupDate(lastBackupAt));
  }, [lastBackupAt]);

  return (
    <div className="gigi-page-shell animate-fade-in">
      <div className="gigi-page-spotlight" aria-hidden />
      <div className="gigi-page-content">
        <PageHeader title="Mémoire" meta={REFINED_PAGE_META.memory} />

        <div className="space-y-4">
          <section className="gigi-memory-vault p-5">
            <div className="gigi-memory-vault-header">
              <Shield className="h-3.5 w-3.5" aria-hidden />
              État de protection
            </div>
            <p className="mt-3 text-[17px] font-semibold text-text-primary">{label}</p>
            <p className="mt-1.5 text-[14px] leading-relaxed text-text-secondary">{message}</p>
            <p className="mt-3 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-[13px] text-text-secondary">
              Gigi continue de fonctionner en local — tes données restent sur cet appareil.
            </p>
          </section>

          {localSummary && localSummary.projectsCount === 0 && (
            <section className="rounded-xl border border-[rgba(124,140,255,0.28)] bg-[rgba(124,140,255,0.08)] p-5">
              <p className="text-[13px] font-semibold text-text-primary">Aucun projet en mémoire</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-text-secondary">
                Ajoute des projets via l&apos;onboarding ou restaure les projets de départ depuis
                les outils dev si besoin.
              </p>
            </section>
          )}

          {localSummary && (
            <section className="gigi-memory-vault p-5">
              <div className="gigi-memory-vault-header">
                <HardDrive className="h-3.5 w-3.5" aria-hidden />
                Mémoire locale
              </div>
              <dl className="mt-4 grid grid-cols-3 gap-3">
                {[
                  { label: "Projets", value: localSummary.projectsCount },
                  { label: "Missions", value: localSummary.missionsCount },
                  { label: "Historique", value: localSummary.historyEventsCount },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 text-center"
                  >
                    <dt className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                      {item.label}
                    </dt>
                    <dd className="mt-1 text-[18px] font-bold tabular-nums text-text-primary">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          <section className="gigi-memory-vault p-5">
            <div className="gigi-memory-vault-header">
              <Cloud className="h-3.5 w-3.5" aria-hidden />
              Sauvegarde distante
            </div>
            {lastBackupAt && formattedBackup ? (
              <p className="mt-3 text-[14px] text-text-secondary">
                Dernière sauvegarde : <span className="font-medium text-text-primary">{formattedBackup}</span>
              </p>
            ) : (
              <p className="mt-3 text-[14px] text-text-secondary">
                Aucune sauvegarde distante enregistrée pour l&apos;instant.
              </p>
            )}
            {persisted.lastBackupCounts && (
              <p className="mt-1 text-[13px] text-text-muted">
                {persisted.lastBackupCounts.projects} proj · {persisted.lastBackupCounts.missions}{" "}
                miss · {persisted.lastBackupCounts.history} hist
              </p>
            )}

            <div className="gigi-memory-vault-action space-y-3">
              {canBackup && (
                <button
                  type="button"
                  onClick={() => void backupNow()}
                  disabled={isSaving}
                  className="gigi-btn-primary gigi-memory-save-btn gigi-focus rounded-xl font-semibold disabled:opacity-50"
                >
                  {isSaving ? "Sauvegarde en cours…" : "Sauvegarder maintenant"}
                </button>
              )}
              <div className="flex flex-wrap gap-2">
                {canOpenAuth && (
                  <Link
                    href="/auth"
                    className="gigi-btn gigi-focus rounded-lg px-4 py-2 text-[14px] text-text-secondary"
                  >
                    Se connecter
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => void refreshMemoryStatus()}
                  disabled={refreshing || canOpenAuth}
                  className="gigi-btn gigi-focus rounded-lg px-4 py-2 text-[14px] text-text-muted disabled:opacity-50"
                >
                  {refreshing ? "Actualisation…" : "Actualiser statut"}
                </button>
              </div>
            </div>

            {lastResult && (
              <p
                className={`mt-3 text-[13px] ${
                  lastResult.status === "success" ? "text-ok" : "text-text-secondary"
                }`}
              >
                {lastResult.message}
              </p>
            )}
            {error && <p className="mt-2 text-[13px] text-text-secondary">{error}</p>}
          </section>

          {IS_DEV && (
            <p className="text-[12px] text-text-secondary">
              Dev :{" "}
              <Link href="/dev/sync" className="text-accent-soft hover:underline">
                /dev/sync
              </Link>
              {" · "}
              <Link href="/dev/persistence" className="text-accent-soft hover:underline">
                /dev/persistence
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
