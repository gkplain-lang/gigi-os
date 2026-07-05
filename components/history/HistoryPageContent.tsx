"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { MissionDecisionHistoryPanel } from "@/components/missionDecision/MissionDecisionHistoryPanel";
import { generateGlobalDecisionSummary, listMissionDecisions } from "@/modules/missionDecision";
import {
  generateGlobalBridgeSummary,
  listMissionPlanBridges,
  MISSION_PLAN_BRIDGE_STATUS_LABELS,
} from "@/modules/missionPlanBridge";
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
import { REFINED_PAGE_META } from "@/modules/dailyUseRefinement";

export function HistoryPageContent() {
  const { state, isHydrated } = useGigi();
  const [feedbackKey, setFeedbackKey] = useState(0);

  const feedbackSummary = useMemo(
    () => generateGlobalMissionFeedbackSummary(),
    [feedbackKey]
  );

  const handleRegenerateFeedback = useCallback(() => {
    regenerateMissionFeedbackFromHistory();
    setFeedbackKey((k) => k + 1);
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

  if (!isHydrated) return null;

  return (
    <div className="gigi-page-shell animate-fade-in mx-auto max-w-[760px]">
      <div className="gigi-page-spotlight" aria-hidden />
      <div className="gigi-page-content">
        <PageHeader title="Historique" meta={REFINED_PAGE_META.history} />
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
        <div className="gigi-panel-raised mt-6 rounded-xl p-5 md:p-6">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            Décisions mission · V2.6
          </p>
          <p className="mt-2 text-[13.5px] text-text-secondary">{decisionSummary.summaryText}</p>
          <MissionDecisionHistoryPanel decisions={recentDecisions} className="mt-3" />
          <p className="mt-3 text-[12px] text-text-muted">
            Centre complet sur{" "}
            <Link href="/#mission-decision-center" className="text-accent-soft underline">
              la mission du jour
            </Link>
            .
          </p>
        </div>
        <div className="gigi-panel-raised mt-6 rounded-xl p-5 md:p-6">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            Bridges mission → plan · V2.7
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
              Aucun bridge — accepte une mission sur{" "}
              <Link href="/#mission-plan-bridge" className="text-accent-soft underline">
                la mission du jour
              </Link>
              .
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
