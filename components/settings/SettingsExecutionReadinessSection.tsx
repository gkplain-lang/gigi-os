"use client";

import Link from "next/link";
import {
  EXECUTION_READINESS_EMPTY_SUMMARY,
  EXECUTION_READINESS_V4_TAGLINE,
  EXECUTION_READINESS_V42_DISCLAIMER,
  EXECUTION_READINESS_V43_DISCLAIMER,
  EXECUTION_READINESS_V44_DISCLAIMER,
  generateGlobalExecutionReadinessSummary,
  generateManualBridgeSummary,
  generateCommandPackSummary,
  generateLocalReviewSummary,
  getSandboxConnectorRegistry,
  loadExecutionReadinessState,
} from "@/modules/executionReadiness";
import { useIsClient } from "./useIsClient";
import { V4SettingsJourneyStrip } from "@/components/executionExperience/V4SettingsJourneyStrip";
import { EXECUTION_EXPERIENCE_V45_DISCLAIMER } from "@/modules/executionExperience";
import { generateGuidedActionSummary } from "@/modules/executionExperience/guidedActionSummary";
import { GUIDED_ACTION_V46_DISCLAIMER } from "@/modules/executionExperience/guidedActionPolicy";
import { MissionComposerSettingsSummary } from "@/components/missionComposer/MissionComposerSettingsSummary";

function formatLastUpdated(iso: string | undefined): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleString("fr-FR");
}

export function SettingsExecutionReadinessSection() {
  const isClient = useIsClient();

  if (!isClient) return null;

  const summary = generateGlobalExecutionReadinessSummary();
  const bridgeSummary = generateManualBridgeSummary();
  const commandPackSummary = generateCommandPackSummary();
  const localReviewSummary = generateLocalReviewSummary();
  const guidedActionSummary = generateGuidedActionSummary();
  const connectorCount = getSandboxConnectorRegistry().length;
  const state = loadExecutionReadinessState();
  const preparedCount = state.requests.length;
  const decisionCount = state.decisions.length;
  const lastUpdatedLabel = formatLastUpdated(state.lastUpdatedAt);
  const hasData = preparedCount > 0 || decisionCount > 0;

  return (
    <section className="gigi-panel mb-6 rounded-xl border border-violet-500/25 p-5">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-violet-200/90">
        Exécution contrôlée V4 · V4.5 visible
      </p>
      <p className="mt-2 text-[13px] leading-relaxed text-text-secondary">
        Gigi ne déclenche aucune action réelle. Les demandes restent sur cet appareil ; les
        approbations autorisent uniquement un dry-run local (simulation). Les capacités sensibles
        restent bloquées — la validation humaine finale t&apos;appartient toujours.
      </p>
      <p className="mt-2 text-[12px] font-medium text-amber-200/90">
        Ces modules sont locaux. Ils ne déclenchent aucune action réelle.
      </p>
      <p className="mt-2 text-[12px] text-text-muted italic">{EXECUTION_READINESS_V4_TAGLINE}</p>
      <V4SettingsJourneyStrip />
      <p className="mt-3 text-[11px] italic text-text-muted">{EXECUTION_EXPERIENCE_V45_DISCLAIMER}</p>

      <div className="mt-4 rounded-lg border border-border/50 bg-surface-2/15 px-4 py-3">
        {hasData ? (
          <>
            <p className="text-[13px] text-text-secondary">{summary.summaryText}</p>
            <dl className="mt-3 grid gap-2 text-[12.5px] sm:grid-cols-3">
              <div>
                <dt className="text-text-muted">Demandes préparées</dt>
                <dd className="font-medium text-text-primary">{preparedCount}</dd>
              </div>
              <div>
                <dt className="text-text-muted">Décisions locales</dt>
                <dd className="font-medium text-text-primary">{decisionCount}</dd>
              </div>
              <div>
                <dt className="text-text-muted">Dernière mise à jour</dt>
                <dd className="font-medium text-text-primary">
                  {lastUpdatedLabel ?? "—"}
                </dd>
              </div>
            </dl>
            {summary.activeRequests > 0 && (
              <p className="mt-2 text-[11.5px] text-text-muted">
                {summary.activeRequests} active(s) · {summary.awaitingApproval} en attente ·{" "}
                {summary.approvedDryRun} dry-run approuvé(s) · {summary.expiredCount} expirée(s) ·{" "}
                {summary.revokedCount} révoquée(s)
              </p>
            )}
          </>
        ) : (
          <p className="text-[13px] text-text-secondary">{EXECUTION_READINESS_EMPTY_SUMMARY}</p>
        )}
      </div>

      <p className="mt-3 text-[11.5px] leading-relaxed text-amber-200/85">
        {EXECUTION_READINESS_V42_DISCLAIMER}
      </p>

      <div className="mt-4 rounded-lg border border-indigo-500/20 bg-indigo-500/5 px-4 py-3">
        <p className="text-[12px] font-medium text-text-primary">Pont manuel V4.2</p>
        <p className="mt-1 text-[12.5px] text-text-secondary">{bridgeSummary.summaryText}</p>
        <p className="mt-2 text-[11.5px] text-text-muted">
          {bridgeSummary.totalPackets} paquet(s) · {connectorCount} connecteurs sandbox (non
          actifs) · aucun secret stocké
        </p>
      </div>

      <div className="mt-4 rounded-lg border border-violet-500/20 bg-violet-500/5 px-4 py-3">
        <p className="text-[12px] font-medium text-text-primary">Packs de commandes V4.3</p>
        <p className="mt-1 text-[12.5px] text-text-secondary">{commandPackSummary.summaryText}</p>
        <p className="mt-2 text-[11.5px] text-text-muted">
          {commandPackSummary.totalPacks} pack(s) · {commandPackSummary.readyForReview} prêt(s) à
          relire · {commandPackSummary.markedRun} lancé(s) (déclaratif) · commandes copiables
          uniquement · secrets jamais stockés
        </p>
        <p className="mt-2 text-[11px] italic text-amber-200/85">{EXECUTION_READINESS_V43_DISCLAIMER}</p>
      </div>

      <div className="mt-4 rounded-lg border border-teal-500/20 bg-teal-500/5 px-4 py-3">
        <p className="text-[12px] font-medium text-text-primary">Revue locale V4.4</p>
        <p className="mt-1 text-[12.5px] text-text-secondary">{localReviewSummary.summaryText}</p>
        <p className="mt-2 text-[11.5px] text-text-muted">
          {localReviewSummary.totalSessions} revue(s) · {localReviewSummary.sensitiveAlerts} alerte(s)
          secret · résultat collé uniquement · Gigi ne lit pas terminal/fichiers/API
        </p>
        <p className="mt-2 text-[11px] italic text-amber-200/85">{EXECUTION_READINESS_V44_DISCLAIMER}</p>
      </div>

      <div className="mt-4 rounded-lg border border-indigo-500/20 bg-indigo-500/5 px-4 py-3">
        <p className="text-[12px] font-medium text-text-primary">Actions guidées V4.6</p>
        <p className="mt-1 text-[12.5px] text-text-secondary">{guidedActionSummary.summaryText}</p>
        <p className="mt-2 text-[11.5px] text-text-muted">
          {guidedActionSummary.totalFlows} parcours · {guidedActionSummary.activeFlows} actif(s) ·
          local uniquement · aucune exécution réelle
        </p>
        <p className="mt-2 text-[11px] italic text-amber-200/85">{GUIDED_ACTION_V46_DISCLAIMER}</p>
        <Link
          href="/guided-actions"
          className="gigi-focus mt-2 inline-flex text-[13px] font-medium text-accent-soft underline-offset-2 hover:underline"
        >
          Parcours guidés →
        </Link>
      </div>

      <MissionComposerSettingsSummary />

      <div className="mt-4 flex flex-wrap gap-4">
        <Link
          href="/local-review"
          className="gigi-focus inline-flex text-[13px] font-medium text-accent-soft underline-offset-2 hover:underline"
        >
          Revue locale →
        </Link>
        <Link
          href="/command-packs"
          className="gigi-focus inline-flex text-[13px] font-medium text-accent-soft underline-offset-2 hover:underline"
        >
          Packs de commandes →
        </Link>
        <Link
          href="/manual-bridge"
          className="gigi-focus inline-flex text-[13px] font-medium text-accent-soft underline-offset-2 hover:underline"
        >
          Pont manuel d&apos;exécution →
        </Link>
        <Link
          href="/permissions"
          className="gigi-focus inline-flex text-[13px] font-medium text-accent-soft underline-offset-2 hover:underline"
        >
          Ouvrir le centre de permissions →
        </Link>
        <Link
          href="/actions"
          className="gigi-focus inline-flex text-[13px] font-medium text-text-muted underline-offset-2 hover:text-text-secondary hover:underline"
        >
          Voir le flux d&apos;action →
        </Link>
      </div>
    </section>
  );
}
