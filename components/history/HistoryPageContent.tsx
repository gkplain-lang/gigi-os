"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { MissionDecisionHistoryPanel } from "@/components/missionDecision/MissionDecisionHistoryPanel";
import { generateGlobalDecisionSummary, listMissionDecisions } from "@/modules/missionDecision";
import {
  generateGlobalBridgeSummary,
  listMissionPlanBridges,
  MISSION_PLAN_BRIDGE_STATUS_LABELS,
} from "@/modules/missionPlanBridge";
import {
  generateGlobalWorkspaceSummary,
  listSafeActionWorkspaces,
  SAFE_ACTION_WORKSPACE_READINESS_LABELS,
} from "@/modules/safeActionWorkspace";
import {
  generateGlobalHandoffSummary,
  listManualExecutionHandoffs,
  MANUAL_EXECUTION_HANDOFF_STATUS_LABELS,
  MANUAL_EXECUTION_HANDOFF_TARGET_LABELS,
} from "@/modules/manualExecutionHandoff";
import {
  generateGlobalIntakeSummary,
  listExecutionReportIntakes,
  EXECUTION_REPORT_INTAKE_DECISION_LABELS,
  EXECUTION_REPORT_INTAKE_STATUS_LABELS,
} from "@/modules/executionReportIntake";
import {
  generateGlobalLifecycleSummary,
  listClosedLoopLifecycles,
  CLOSED_LOOP_LIFECYCLE_HEALTH_LABELS,
  CLOSED_LOOP_LIFECYCLE_STATUS_LABELS,
} from "@/modules/closedLoopLifecycle";
import { PageHeader } from "@/components/ui/PageHeader";
import { HistoryTimeline } from "@/components/history/HistoryTimeline";
import { HistoryLearningPanel } from "@/components/historyLearning/HistoryLearningPanel";
import { MissionFeedbackSummaryCard } from "@/components/missionFeedback/MissionFeedbackSummaryCard";
import {
  generateGlobalMissionFeedbackSummary,
  getCopyableGlobalMissionFeedbackText,
  regenerateMissionFeedbackFromHistory,
} from "@/modules/missionFeedback";
import { useGigi } from "@/components/providers/GigiProvider";
import { RecentLearningSection } from "@/components/history/RecentLearningSection";
import { ExecutionReadinessSummaryCard } from "@/components/executionReadiness/ExecutionReadinessSummaryCard";
import { PermissionAuditHistoryCard } from "@/components/executionPermissionCenter/PermissionAuditHistoryCard";
import { ManualBridgeHistoryCard } from "@/components/manualBridge/ManualBridgeHistoryCard";
import { CommandPackHistoryCard } from "@/components/commandPacks/CommandPackHistoryCard";
import { LocalReviewHistoryCard } from "@/components/localReview/LocalReviewHistoryCard";
import { generateGlobalExecutionReadinessSummary } from "@/modules/executionReadiness";
import { ControlledExecutionActivitySummary } from "@/components/executionExperience/ControlledExecutionActivitySummary";
import { GuidedActionHistoryCard } from "@/components/guidedActionFlow/GuidedActionHistoryCard";

export function HistoryPageContent() {
  const { state, isHydrated } = useGigi();
  const [feedbackSummary, setFeedbackSummary] = useState(() =>
    generateGlobalMissionFeedbackSummary()
  );

  const handleRegenerateFeedback = useCallback(() => {
    regenerateMissionFeedbackFromHistory();
    setFeedbackSummary(generateGlobalMissionFeedbackSummary());
  }, []);

  const handleCopyFeedback = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(getCopyableGlobalMissionFeedbackText());
    } catch {
      /* fallback */
    }
  }, []);

  const decisionSummary = generateGlobalDecisionSummary();
  const recentDecisions = listMissionDecisions(4);
  const bridgeSummary = generateGlobalBridgeSummary();
  const recentBridges = listMissionPlanBridges(4);
  const workspaceSummary = generateGlobalWorkspaceSummary();
  const recentWorkspaces = listSafeActionWorkspaces(4);
  const handoffSummary = generateGlobalHandoffSummary();
  const recentHandoffs = listManualExecutionHandoffs(4);
  const intakeSummary = generateGlobalIntakeSummary();
  const recentIntakes = listExecutionReportIntakes(4);
  const lifecycleSummary = generateGlobalLifecycleSummary();
  const recentLifecycles = listClosedLoopLifecycles(4);
  const executionReadinessSummary = generateGlobalExecutionReadinessSummary();

  if (!isHydrated) return null;

  return (
    <div className="gigi-page-shell animate-fade-in mx-auto max-w-[760px]">
      <div className="gigi-page-spotlight" aria-hidden />
      <div className="gigi-page-content">
        <PageHeader
          title="Historique"
          meta="Ce que tu as fait, ce que Gigi en tire, et la suite recommandée — tout reste local et manuel."
        />
        <RecentLearningSection />
        <ControlledExecutionActivitySummary />
        <div className="gigi-panel-raised mb-4 rounded-xl p-5 md:p-6">
          <GuidedActionHistoryCard />
        </div>
        <div className="gigi-panel-raised mb-4 rounded-xl p-5 md:p-6">
          <ExecutionReadinessSummaryCard summary={executionReadinessSummary} />
        </div>
        <div className="gigi-panel-raised mb-4 rounded-xl p-5 md:p-6">
          <PermissionAuditHistoryCard />
        </div>
        <div className="gigi-panel-raised mb-4 rounded-xl p-5 md:p-6">
          <ManualBridgeHistoryCard />
        </div>
        <div className="gigi-panel-raised mb-4 rounded-xl p-5 md:p-6">
          <CommandPackHistoryCard />
        </div>
        <div className="gigi-panel-raised mb-4 rounded-xl p-5 md:p-6">
          <LocalReviewHistoryCard />
        </div>
        <p className="mb-4 text-[12.5px] leading-relaxed text-text-muted">
          <span className="font-medium text-text-secondary">Parcours bêta :</span> rapport →
          apprentissage ici → mission sur{" "}
          <Link href="/" className="text-accent-soft underline-offset-2 hover:underline">
            /
          </Link>{" "}
          ou action sur{" "}
          <Link href="/actions" className="text-accent-soft underline-offset-2 hover:underline">
            /actions
          </Link>
          .
        </p>
        <div className="gigi-panel-raised rounded-xl p-5 md:p-6">
          <HistoryTimeline events={state.history} />
        </div>
        <div className="gigi-panel-raised mt-6 rounded-xl p-5 md:p-6">
          <HistoryLearningPanel />
        </div>
        <div className="gigi-panel-raised mt-6 rounded-xl p-5 md:p-6">
          <MissionFeedbackSummaryCard
            summary={feedbackSummary}
            onRegenerate={handleRegenerateFeedback}
            onCopyGlobal={handleCopyFeedback}
          />
          <p className="mt-3 text-[12px] text-text-muted">
            Détail par mission sur{" "}
            <Link href="/" className="text-accent-soft underline">
              la mission du jour
            </Link>{" "}
            ou sur chaque{" "}
            <Link href="/projects" className="text-accent-soft underline">
              fiche projet
            </Link>
            .
          </p>
        </div>
        <details className="gigi-panel-raised mt-6 rounded-xl">
          <summary className="cursor-pointer list-none px-5 py-4 text-[13px] font-medium text-text-secondary md:px-6 [&::-webkit-details-marker]:hidden">
            Modules techniques · cycles et traces détaillées
          </summary>
          <div className="space-y-6 border-t border-border/40 px-5 py-5 md:px-6">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            Décisions mission
          </p>
          <p className="mt-2 text-[13.5px] text-text-secondary">{decisionSummary.summaryText}</p>
          <MissionDecisionHistoryPanel decisions={recentDecisions} className="mt-3" />
          <p className="mt-3 text-[12px] text-text-muted">
            Centre complet sur{" "}
            <Link href="/#mission-decision" className="text-accent-soft underline">
              la mission du jour
            </Link>
            .
          </p>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            Passage mission → plan
          </p>
          <p className="mt-2 text-[13.5px] text-text-secondary">{bridgeSummary.summaryText}</p>
          {recentBridges.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {recentBridges.map((b) => (
                <li key={b.id} className="text-[12.5px] text-text-secondary">
                  <span className="font-medium text-text-primary">{b.missionTitle}</span>
                  <span className="text-text-muted">
                    {" "}
                    — {MISSION_PLAN_BRIDGE_STATUS_LABELS[b.status]} · {b.updatedAt.slice(0, 10)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-[12px] text-text-muted">
              Aucun passage — accepte une mission sur{" "}
              <Link href="/#mission-decision" className="text-accent-soft underline">
                la mission du jour
              </Link>
              .
            </p>
          )}
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            Espaces d&apos;action sécurisés
          </p>
          <p className="mt-2 text-[13.5px] text-text-secondary">{workspaceSummary.summaryText}</p>
          {recentWorkspaces.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {recentWorkspaces.map((w) => (
                <li key={w.id} className="text-[12.5px] text-text-secondary">
                  <span className="font-medium text-text-primary">
                    {w.title.replace(/^Workspace · /, "")}
                  </span>
                  <span className="text-text-muted">
                    {" "}
                    — {SAFE_ACTION_WORKSPACE_READINESS_LABELS[w.readiness]} ·{" "}
                    {w.updatedAt.slice(0, 10)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-[12px] text-text-muted">
              Aucun espace — ouvre une action sur{" "}
              <Link href="/actions" className="text-accent-soft underline">
                /actions
              </Link>
              .
            </p>
          )}
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            Passations manuelles
          </p>
          <p className="mt-2 text-[13.5px] text-text-secondary">{handoffSummary.summaryText}</p>
          {recentHandoffs.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {recentHandoffs.map((h) => (
                <li key={h.id} className="text-[12.5px] text-text-secondary">
                  <span className="font-medium text-text-primary">
                    {h.title.replace(/^Handoff · /, "")}
                  </span>
                  <span className="text-text-muted">
                    {" "}
                    — {MANUAL_EXECUTION_HANDOFF_TARGET_LABELS[h.target]} ·{" "}
                    {MANUAL_EXECUTION_HANDOFF_STATUS_LABELS[h.status]} ·{" "}
                    {h.updatedAt.slice(0, 10)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-[12px] text-text-muted">
              Aucune passation — crée-en une depuis{" "}
              <Link href="/actions" className="text-accent-soft underline">
                /actions
              </Link>
              .
            </p>
          )}
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            Rapports d&apos;exécution
          </p>
          <p className="mt-2 text-[13.5px] text-text-secondary">{intakeSummary.summaryText}</p>
          {recentIntakes.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {recentIntakes.map((i) => (
                <li key={i.id} className="text-[12.5px] text-text-secondary">
                  <span className="font-medium text-text-primary">
                    {i.title.replace(/^Intake · /, "")}
                  </span>
                  <span className="text-text-muted">
                    {" "}
                    — {EXECUTION_REPORT_INTAKE_DECISION_LABELS[i.decision]} ·{" "}
                    {EXECUTION_REPORT_INTAKE_STATUS_LABELS[i.status]} ·{" "}
                    {i.updatedAt.slice(0, 10)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-[12px] text-text-muted">
              Aucun rapport reçu — colle un rapport depuis{" "}
              <Link href="/actions" className="text-accent-soft underline">
                /actions
              </Link>
              .
            </p>
          )}
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            Cycles complets
          </p>
          <p className="mt-2 text-[13.5px] text-text-secondary">{lifecycleSummary.summaryText}</p>
          {recentLifecycles.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {recentLifecycles.map((l) => (
                <li key={l.id} className="text-[12.5px] text-text-secondary">
                  <span className="font-medium text-text-primary">
                    {l.title.replace(/^Cycle · /, "")}
                  </span>
                  <span className="text-text-muted">
                    {" "}
                    — {CLOSED_LOOP_LIFECYCLE_HEALTH_LABELS[l.health]} ·{" "}
                    {CLOSED_LOOP_LIFECYCLE_STATUS_LABELS[l.status]} ·{" "}
                    {l.updatedAt.slice(0, 10)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-[12px] text-text-muted">
              Aucun cycle — ouvre le cycle complet depuis{" "}
              <Link href="/actions" className="text-accent-soft underline">
                /actions
              </Link>
              .
            </p>
          )}
        </div>
          </div>
        </details>
      </div>
    </div>
  );
}
