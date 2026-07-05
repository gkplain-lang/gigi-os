"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { GigiConversationResponse } from "@/modules/conversation/conversationTypes";
import { GigiOrb } from "@/components/ui/GigiOrb";
import { ActionProposalCard } from "./ActionProposalCard";
import { AutomationProposalCard } from "./AutomationProposalCard";
import { IntegrationProposalCard } from "./IntegrationProposalCard";
import { ActionPlanPanel } from "@/components/actionPlans/ActionPlanPanel";
import { PreparedActionPanel } from "@/components/preparedActions/PreparedActionPanel";
import { ExecutionPlanPanel } from "@/components/executionPlans/ExecutionPlanPanel";
import { V062_NO_EXTERNAL_MESSAGE } from "@/modules/agents/confirmation";
import { V07_NO_EXECUTION_MESSAGE } from "@/modules/automation";
import { V08_NO_API_MESSAGE } from "@/modules/integrations";

interface GigiAnswerProps {
  response: GigiConversationResponse;
  onChoice: (prompt: string) => void;
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-medium uppercase tracking-wider text-text-muted">{children}</p>
  );
}

function IntegrationProposalsSection({ response }: { response: GigiConversationResponse }) {
  if (!response.integrationProposals?.length) return null;

  return (
    <div className="gigi-panel mt-3 rounded-xl p-4">
      <Label>Intégration proposée (dry-run)</Label>
      {response.integrationBlockedMessage && (
        <p className="mt-2 text-[12.5px] leading-relaxed text-amber-200/90">
          {response.integrationBlockedMessage}
        </p>
      )}
      {response.integrationProposals.map((proposal) => (
        <IntegrationProposalCard key={proposal.id} proposal={proposal} />
      ))}
      <p className="mt-2.5 text-[11px] text-text-muted/70">V0.8 — {V08_NO_API_MESSAGE}</p>
    </div>
  );
}

function AutomationProposalsSection({ response }: { response: GigiConversationResponse }) {
  if (!response.automationProposals?.length) return null;

  return (
    <div className="gigi-panel mt-3 rounded-xl p-4">
      <Label>Automatisation proposée (dry-run)</Label>
      {response.automationBlockedMessage && (
        <p className="mt-2 text-[12.5px] leading-relaxed text-amber-200/90">
          {response.automationBlockedMessage}
        </p>
      )}
      {response.automationProposals.map((proposal) => (
        <AutomationProposalCard key={proposal.id} proposal={proposal} />
      ))}
      <p className="mt-2.5 text-[11px] text-text-muted/70">V0.7 — {V07_NO_EXECUTION_MESSAGE}</p>
    </div>
  );
}

function ActionProposalsSection({ response }: { response: GigiConversationResponse }) {
  if (!response.actionProposals?.length) return null;

  return (
    <div className="gigi-panel mt-3 rounded-xl p-4">
      <Label>Action proposée (dry-run)</Label>
      {response.actionProposals.map((proposal) => (
        <ActionProposalCard
          key={proposal.id}
          proposal={proposal}
          agentBlockedMessage={response.agentBlockedMessage}
        />
      ))}
      <p className="mt-2.5 text-[11px] text-text-muted/70">V0.6.2 — {V062_NO_EXTERNAL_MESSAGE}</p>
    </div>
  );
}

function DailyReviewSection({ response }: { response: GigiConversationResponse }) {
  const review = response.dailyReview;
  if (!review) return null;

  return (
    <div className="gigi-panel mt-3 rounded-xl p-4">
      <Label>Bilan du jour</Label>
      <p className="mt-2 text-[13.5px] leading-relaxed text-text-secondary">{review.shortSummary}</p>
      {review.suggestedFocus && (
        <p className="mt-2 text-[12.5px] text-text-muted">
          Focus : <span className="text-text-secondary">{review.suggestedFocus}</span>
        </p>
      )}
      {review.possibleBlockers[0] && (
        <p className="mt-2 text-[12.5px] text-text-muted">
          Blocage : {review.possibleBlockers[0].message}
        </p>
      )}
      <p className="mt-2 text-[11px] text-text-muted/70">
        V0.6.1 — read-only, aucune sync, aucun agent.
      </p>
    </div>
  );
}

export function GigiAnswer({ response, onChoice }: GigiAnswerProps) {
  const [showNotNow, setShowNotNow] = useState(false);

  return (
    <div className="animate-fade-in flex gap-3">
      <GigiOrb size="sm" className="mt-1" />

      <div className="min-w-0 flex-1 rounded-xl border border-[rgba(124,140,255,0.32)] bg-[rgba(124,140,255,0.04)] p-4 shadow-[0_0_24px_-16px_rgba(124,140,255,0.35)]">
        <div className="inline-flex items-center gap-1.5 rounded-md border border-[rgba(124,140,255,0.28)] bg-surface px-2 py-0.5">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
          <span className="text-[11.5px] font-medium text-text-secondary">
            {response.intentLabel}
          </span>
        </div>
        <p className="mt-2.5 text-[15px] leading-relaxed text-text-primary">{response.listen}</p>

        <DailyReviewSection response={response} />

        {response.needsClarification ? (
          <div className="gigi-panel mt-3 rounded-xl p-4">
            {response.executionPlanBlockedMessage && (
              <p className="mb-2 text-[12.5px] leading-relaxed text-amber-200/90">
                {response.executionPlanBlockedMessage}
              </p>
            )}
            <p className="text-[14px] leading-relaxed text-text-secondary">
              {response.clarificationQuestion}
            </p>
            <div className="mt-3.5 flex flex-wrap gap-2">
              {response.choices?.map((choice) => (
                <button
                  key={choice.label}
                  type="button"
                  onClick={() => onChoice(choice.prompt)}
                  className="gigi-chip gigi-focus rounded-lg px-3.5 py-2 text-[13.5px]"
                >
                  {choice.label}
                </button>
              ))}
            </div>
          </div>
        ) : response.intent === "mission_os" ? (
          <div className="mt-3 space-y-3">
            {response.missionOSBlockedMessage && (
              <p className="text-[12.5px] leading-relaxed text-amber-200/90">
                {response.missionOSBlockedMessage}
              </p>
            )}
            <div className="gigi-panel rounded-xl p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                Gigi V3 · Closed Loop Mission OS
              </p>
              {response.missionOSPhaseLabel && (
                <p className="mt-1.5 text-[13px] text-accent-soft">
                  Phase : {response.missionOSPhaseLabel}
                  {response.missionOSReadinessLabel && ` · ${response.missionOSReadinessLabel}`}
                </p>
              )}
              {response.missionOSStepLabel && (
                <p className="mt-2 text-[15px] font-medium text-text-primary">
                  {response.missionOSStepLabel}
                </p>
              )}
              {response.missionOSNextActionLabel && response.missionOSNextActionRoute && (
                <a
                  href={response.missionOSNextActionRoute}
                  className="gigi-btn-primary gigi-focus mt-3 inline-flex rounded-lg px-3.5 py-2 text-[13px] font-medium"
                >
                  {response.missionOSNextActionLabel}
                </a>
              )}
              {response.missionOSSummaryText && (
                <pre className="mt-3 max-h-48 overflow-auto whitespace-pre-wrap rounded-lg bg-surface-2/60 p-3 text-[12px] text-text-secondary">
                  {response.missionOSSummaryText}
                </pre>
              )}
            </div>
            {response.missionOSGuidance && response.missionOSGuidance.length > 0 && (
              <div className="gigi-panel rounded-xl p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                  Guidance
                </p>
                <ul className="mt-2 list-inside list-disc space-y-1 text-[13px] text-text-secondary">
                  {response.missionOSGuidance.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : response.intent === "closed_loop_lifecycle" ? (
          <div className="mt-3 space-y-3">
            {response.closedLoopLifecycleBlockedMessage && (
              <p className="text-[12.5px] leading-relaxed text-amber-200/90">
                {response.closedLoopLifecycleBlockedMessage}
              </p>
            )}
            {response.closedLoopLifecycleActionTitle && (
              <div className="gigi-panel rounded-xl p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                  Closed Loop Lifecycle · V2.11
                </p>
                <p className="mt-1.5 text-[15px] font-medium text-text-primary">
                  {response.closedLoopLifecycleActionTitle}
                </p>
                {(response.closedLoopLifecycleHealthLabel || response.closedLoopLifecycleStatusLabel) && (
                  <p className="mt-1 text-[13px] text-accent-soft">
                    {response.closedLoopLifecycleHealthLabel && `Santé : ${response.closedLoopLifecycleHealthLabel}`}
                    {response.closedLoopLifecycleStatusLabel && ` · ${response.closedLoopLifecycleStatusLabel}`}
                  </p>
                )}
                {response.closedLoopLifecycleSummaryText && (
                  <p className="mt-2 text-[13.5px] leading-relaxed text-text-secondary">
                    {response.closedLoopLifecycleSummaryText}
                  </p>
                )}
              </div>
            )}
            {response.closedLoopLifecycleGuidance && response.closedLoopLifecycleGuidance.length > 0 && (
              <div className="gigi-panel rounded-xl p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                  Cycle d&apos;action
                </p>
                <ol className="mt-2.5 space-y-2">
                  {response.closedLoopLifecycleGuidance.map((hint, i) => (
                    <li key={i} className="flex gap-2.5 text-[13.5px] leading-relaxed text-text-secondary">
                      <span className="mt-0.5 font-medium tabular-nums text-accent-soft">{i + 1}.</span>
                      {hint}
                    </li>
                  ))}
                </ol>
              </div>
            )}
            {response.finalMessage && (
              <p className="text-[14px] font-medium text-text-primary">{response.finalMessage}</p>
            )}
          </div>
        ) : response.intent === "execution_report_intake" ? (
          <div className="mt-3 space-y-3">
            {response.executionReportIntakeBlockedMessage && (
              <p className="text-[12.5px] leading-relaxed text-amber-200/90">
                {response.executionReportIntakeBlockedMessage}
              </p>
            )}
            {response.executionReportIntakeActionTitle && (
              <div className="gigi-panel rounded-xl p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                  Execution Report Intake · V2.10
                </p>
                <p className="mt-1.5 text-[15px] font-medium text-text-primary">
                  {response.executionReportIntakeActionTitle}
                </p>
                {response.executionReportIntakeSummaryText && (
                  <p className="mt-2 text-[13.5px] leading-relaxed text-text-secondary">
                    {response.executionReportIntakeSummaryText}
                  </p>
                )}
              </div>
            )}
            {response.executionReportIntakeGuidance && response.executionReportIntakeGuidance.length > 0 && (
              <div className="gigi-panel rounded-xl p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                  Rapport d&apos;exécution
                </p>
                <ol className="mt-2.5 space-y-2">
                  {response.executionReportIntakeGuidance.map((hint, i) => (
                    <li key={i} className="flex gap-2.5 text-[13.5px] leading-relaxed text-text-secondary">
                      <span className="mt-0.5 font-medium tabular-nums text-accent-soft">{i + 1}.</span>
                      {hint}
                    </li>
                  ))}
                </ol>
              </div>
            )}
            {response.finalMessage && (
              <p className="text-[14px] font-medium text-text-primary">{response.finalMessage}</p>
            )}
          </div>
        ) : response.intent === "manual_execution_handoff" ? (
          <div className="mt-3 space-y-3">
            {response.manualExecutionHandoffBlockedMessage && (
              <p className="text-[12.5px] leading-relaxed text-amber-200/90">
                {response.manualExecutionHandoffBlockedMessage}
              </p>
            )}
            {response.manualExecutionHandoffActionTitle && (
              <div className="gigi-panel rounded-xl p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                  Handoff V2.9 (aperçu)
                </p>
                <p className="mt-1.5 text-[15px] font-medium text-text-primary">
                  {response.manualExecutionHandoffActionTitle}
                </p>
                {response.manualExecutionHandoffTargetLabel && (
                  <p className="mt-1 text-[13px] text-accent-soft">
                    Cible : {response.manualExecutionHandoffTargetLabel}
                  </p>
                )}
                {response.manualExecutionHandoffSummaryText && (
                  <p className="mt-2 text-[13.5px] leading-relaxed text-text-secondary">
                    {response.manualExecutionHandoffSummaryText}
                  </p>
                )}
              </div>
            )}
            {response.manualExecutionHandoffGuidance && response.manualExecutionHandoffGuidance.length > 0 && (
              <div className="gigi-panel rounded-xl p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                  Passation manuelle
                </p>
                <ol className="mt-2.5 space-y-2">
                  {response.manualExecutionHandoffGuidance.map((hint, i) => (
                    <li key={i} className="flex gap-2.5 text-[13.5px] leading-relaxed text-text-secondary">
                      <span className="mt-0.5 font-medium tabular-nums text-accent-soft">{i + 1}.</span>
                      {hint}
                    </li>
                  ))}
                </ol>
              </div>
            )}
            {response.finalMessage && (
              <p className="text-[14px] font-medium text-text-primary">{response.finalMessage}</p>
            )}
          </div>
        ) : response.intent === "safe_action_workspace" ? (
          <div className="mt-3 space-y-3">
            {response.safeActionWorkspaceBlockedMessage && (
              <p className="text-[12.5px] leading-relaxed text-amber-200/90">
                {response.safeActionWorkspaceBlockedMessage}
              </p>
            )}
            {response.safeActionWorkspaceActionTitle && (
              <div className="gigi-panel rounded-xl p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                  Action (workspace V2.8)
                </p>
                <p className="mt-1.5 text-[15px] font-medium text-text-primary">
                  {response.safeActionWorkspaceActionTitle}
                </p>
                {response.safeActionWorkspaceReadinessLabel && (
                  <p className="mt-1 text-[13px] text-accent-soft">
                    Readiness : {response.safeActionWorkspaceReadinessLabel}
                  </p>
                )}
                {response.safeActionWorkspaceSummaryText && (
                  <p className="mt-2 text-[13.5px] leading-relaxed text-text-secondary">
                    {response.safeActionWorkspaceSummaryText}
                  </p>
                )}
              </div>
            )}
            {response.safeActionWorkspaceGuidance && response.safeActionWorkspaceGuidance.length > 0 && (
              <div className="gigi-panel rounded-xl p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                  Préparer l&apos;exécution manuelle
                </p>
                <ol className="mt-2.5 space-y-2">
                  {response.safeActionWorkspaceGuidance.map((hint, i) => (
                    <li key={i} className="flex gap-2.5 text-[13.5px] leading-relaxed text-text-secondary">
                      <span className="mt-0.5 font-medium tabular-nums text-accent-soft">{i + 1}.</span>
                      {hint}
                    </li>
                  ))}
                </ol>
              </div>
            )}
            {response.finalMessage && (
              <p className="text-[14px] font-medium text-text-primary">{response.finalMessage}</p>
            )}
          </div>
        ) : response.intent === "mission_plan_bridge" ? (
          <div className="mt-3 space-y-3">
            {response.missionPlanBridgeBlockedMessage && (
              <p className="text-[12.5px] leading-relaxed text-amber-200/90">
                {response.missionPlanBridgeBlockedMessage}
              </p>
            )}
            {response.missionPlanBridgeMissionTitle && (
              <div className="gigi-panel rounded-xl p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                  Mission acceptée (bridge V2.7)
                </p>
                <p className="mt-1.5 text-[15px] font-medium text-text-primary">
                  {response.missionPlanBridgeMissionTitle}
                </p>
                {response.missionPlanBridgeSummaryText && (
                  <p className="mt-2 text-[13.5px] leading-relaxed text-text-secondary">
                    {response.missionPlanBridgeSummaryText}
                  </p>
                )}
              </div>
            )}
            {response.missionPlanBridgeGuidance && response.missionPlanBridgeGuidance.length > 0 && (
              <div className="gigi-panel rounded-xl p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                  Prochaines étapes (manuel)
                </p>
                <ol className="mt-2.5 space-y-2">
                  {response.missionPlanBridgeGuidance.map((hint, i) => (
                    <li key={i} className="flex gap-2.5 text-[13.5px] leading-relaxed text-text-secondary">
                      <span className="mt-0.5 font-medium tabular-nums text-accent-soft">{i + 1}.</span>
                      {hint}
                    </li>
                  ))}
                </ol>
              </div>
            )}
            {response.finalMessage && (
              <p className="text-[14px] font-medium text-text-primary">{response.finalMessage}</p>
            )}
          </div>
        ) : response.intent === "mission_decision" ? (
          <div className="mt-3 space-y-3">
            {response.missionDecisionBlockedMessage && (
              <p className="text-[12.5px] leading-relaxed text-amber-200/90">
                {response.missionDecisionBlockedMessage}
              </p>
            )}
            {response.missionDecisionTopTitle && (
              <div className="gigi-panel rounded-xl p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                  Mission recommandée (décision locale)
                </p>
                <p className="mt-1.5 text-[15px] font-medium text-text-primary">
                  {response.missionDecisionTopTitle}
                </p>
                {response.missionDecisionStatusLabel && (
                  <p className="mt-1 text-[13px] text-accent-soft">
                    Statut : {response.missionDecisionStatusLabel}
                  </p>
                )}
                {response.missionDecisionSummaryText && (
                  <p className="mt-2 text-[13.5px] leading-relaxed text-text-secondary">
                    {response.missionDecisionSummaryText}
                  </p>
                )}
              </div>
            )}
            {response.missionDecisionComparisonText && (
              <div className="gigi-panel rounded-xl p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                  Comparaison des candidates
                </p>
                <pre className="mt-2 whitespace-pre-wrap text-[12.5px] leading-relaxed text-text-secondary">
                  {response.missionDecisionComparisonText}
                </pre>
              </div>
            )}
            {response.missionDecisionGuidance && response.missionDecisionGuidance.length > 0 && (
              <div className="gigi-panel rounded-xl p-4">
                <ol className="space-y-2">
                  {response.missionDecisionGuidance.map((hint, i) => (
                    <li key={i} className="flex gap-2.5 text-[13.5px] leading-relaxed text-text-secondary">
                      <span className="mt-0.5 font-medium tabular-nums text-accent-soft">{i + 1}.</span>
                      {hint}
                    </li>
                  ))}
                </ol>
              </div>
            )}
            {response.finalMessage && (
              <p className="text-[14px] font-medium text-text-primary">{response.finalMessage}</p>
            )}
          </div>
        ) : response.intent === "mission_feedback" ? (
          <div className="mt-3 space-y-3">
            {response.missionFeedbackBlockedMessage && (
              <p className="text-[12.5px] leading-relaxed text-amber-200/90">
                {response.missionFeedbackBlockedMessage}
              </p>
            )}
            {response.missionFeedbackTopMissionTitle && (
              <div className="gigi-panel rounded-xl p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                  Mission suggérée (feedback local)
                </p>
                <p className="mt-1.5 text-[15px] font-medium text-text-primary">
                  {response.missionFeedbackTopMissionTitle}
                </p>
                {response.missionFeedbackScoreLabel && (
                  <p className="mt-1 text-[13px] text-accent-soft">
                    {response.missionFeedbackScoreLabel}
                  </p>
                )}
                {response.missionFeedbackSummaryText && (
                  <p className="mt-2 text-[13.5px] leading-relaxed text-text-secondary">
                    {response.missionFeedbackSummaryText}
                  </p>
                )}
              </div>
            )}
            {response.missionFeedbackGuidance && response.missionFeedbackGuidance.length > 0 && (
              <div className="gigi-panel rounded-xl p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                  Affiner les recommandations
                </p>
                <ol className="mt-2.5 space-y-2">
                  {response.missionFeedbackGuidance.map((hint, i) => (
                    <li key={i} className="flex gap-2.5 text-[13.5px] leading-relaxed text-text-secondary">
                      <span className="mt-0.5 font-medium tabular-nums text-accent-soft">{i + 1}.</span>
                      {hint}
                    </li>
                  ))}
                </ol>
              </div>
            )}
            {response.finalMessage && (
              <p className="text-[14px] font-medium text-text-primary">{response.finalMessage}</p>
            )}
          </div>
        ) : response.intent === "history_learning" ? (
          <div className="mt-3 space-y-3">
            {response.historyLearningBlockedMessage && (
              <p className="text-[12.5px] leading-relaxed text-amber-200/90">
                {response.historyLearningBlockedMessage}
              </p>
            )}
            {response.historyLearningSummaryText && (
              <div className="gigi-panel rounded-xl p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                  Synthèse locale
                </p>
                <p className="mt-1.5 text-[15px] font-medium text-text-primary">
                  {response.historyLearningSummaryText}
                </p>
              </div>
            )}
            {response.historyLearningGuidance && response.historyLearningGuidance.length > 0 && (
              <div className="gigi-panel rounded-xl p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                  Boucle d&apos;apprentissage · /history
                </p>
                <ol className="mt-2.5 space-y-2">
                  {response.historyLearningGuidance.map((hint, i) => (
                    <li key={i} className="flex gap-2.5 text-[13.5px] leading-relaxed text-text-secondary">
                      <span className="mt-0.5 font-medium tabular-nums text-accent-soft">{i + 1}.</span>
                      {hint}
                    </li>
                  ))}
                </ol>
              </div>
            )}
            {response.finalMessage && (
              <p className="text-[14px] font-medium text-text-primary">{response.finalMessage}</p>
            )}
          </div>
        ) : response.intent === "follow_up_action" ? (
          <div className="mt-3 space-y-3">
            {response.followUpBlockedMessage && (
              <p className="text-[12.5px] leading-relaxed text-amber-200/90">
                {response.followUpBlockedMessage}
              </p>
            )}
            {response.followUpGuidance && response.followUpGuidance.length > 0 && (
              <div className="gigi-panel rounded-xl p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                  Générer une action de suivi dans /actions
                </p>
                <ol className="mt-2.5 space-y-2">
                  {response.followUpGuidance.map((hint, i) => (
                    <li key={i} className="flex gap-2.5 text-[13.5px] leading-relaxed text-text-secondary">
                      <span className="mt-0.5 font-medium tabular-nums text-accent-soft">{i + 1}.</span>
                      {hint}
                    </li>
                  ))}
                </ol>
              </div>
            )}
            {response.finalMessage && (
              <p className="text-[14px] font-medium text-text-primary">{response.finalMessage}</p>
            )}
          </div>
        ) : response.intent === "execution_review" ? (
          <div className="mt-3 space-y-3">
            {response.executionReviewBlockedMessage && (
              <p className="text-[12.5px] leading-relaxed text-amber-200/90">
                {response.executionReviewBlockedMessage}
              </p>
            )}
            {response.executionReviewDecisionLabel && (
              <div className="gigi-panel rounded-xl p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                  Décision recommandée
                </p>
                <p className="mt-1.5 text-[15px] font-medium text-text-primary">
                  {response.executionReviewDecisionLabel}
                </p>
                {response.executionReviewSummaryText && (
                  <p className="mt-2 text-[13.5px] leading-relaxed text-text-secondary">
                    {response.executionReviewSummaryText}
                  </p>
                )}
              </div>
            )}
            {response.executionReviewGuidance && response.executionReviewGuidance.length > 0 && (
              <div className="gigi-panel rounded-xl p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                  Comment utiliser la review dans /actions
                </p>
                <ol className="mt-2.5 space-y-2">
                  {response.executionReviewGuidance.map((hint, i) => (
                    <li key={i} className="flex gap-2.5 text-[13.5px] leading-relaxed text-text-secondary">
                      <span className="mt-0.5 font-medium tabular-nums text-accent-soft">{i + 1}.</span>
                      {hint}
                    </li>
                  ))}
                </ol>
              </div>
            )}
            {response.finalMessage && (
              <p className="text-[14px] font-medium text-text-primary">{response.finalMessage}</p>
            )}
          </div>
        ) : response.intent === "execution_log" ? (
          <div className="mt-3 space-y-3">
            {response.executionLogBlockedMessage && (
              <p className="text-[12.5px] leading-relaxed text-amber-200/90">
                {response.executionLogBlockedMessage}
              </p>
            )}
            {response.executionLogGuidance && response.executionLogGuidance.length > 0 && (
              <div className="gigi-panel rounded-xl p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                  Comment enregistrer dans /actions
                </p>
                <ol className="mt-2.5 space-y-2">
                  {response.executionLogGuidance.map((hint, i) => (
                    <li key={i} className="flex gap-2.5 text-[13.5px] leading-relaxed text-text-secondary">
                      <span className="mt-0.5 font-medium tabular-nums text-accent-soft">{i + 1}.</span>
                      {hint}
                    </li>
                  ))}
                </ol>
              </div>
            )}
            {response.finalMessage && (
              <p className="text-[14px] font-medium text-text-primary">{response.finalMessage}</p>
            )}
          </div>
        ) : response.executionPlan ? (
          <div className="mt-3 space-y-3">
            {response.executionPlanBlockedMessage && (
              <p className="text-[12.5px] leading-relaxed text-amber-200/90">
                {response.executionPlanBlockedMessage}
              </p>
            )}
            <ExecutionPlanPanel plan={response.executionPlan} compact />
            {response.finalMessage && (
              <p className="text-[14px] font-medium text-text-primary">{response.finalMessage}</p>
            )}
          </div>
        ) : response.preparedAction ? (
          <div className="mt-3 space-y-3">
            {response.preparedActionBlockedMessage && (
              <p className="text-[12.5px] leading-relaxed text-amber-200/90">
                {response.preparedActionBlockedMessage}
              </p>
            )}
            <PreparedActionPanel
              action={response.preparedAction}
              projectName={response.priorityProjectName ?? response.preparedAction.projectId}
            />
            {response.actionPlan && (
              <details className="gigi-panel rounded-xl p-3">
                <summary className="cursor-pointer text-[12px] font-medium text-text-muted">
                  Voir le plan d&apos;action associé
                </summary>
                <div className="mt-3">
                  <ActionPlanPanel plan={response.actionPlan} compact />
                </div>
              </details>
            )}
            {response.finalMessage && (
              <p className="text-[14px] font-medium text-text-primary">{response.finalMessage}</p>
            )}
          </div>
        ) : response.actionPlan ? (
          <div className="mt-3 space-y-3">
            {response.actionPlanBlockedMessage && (
              <p className="text-[12.5px] leading-relaxed text-amber-200/90">
                {response.actionPlanBlockedMessage}
              </p>
            )}
            <ActionPlanPanel plan={response.actionPlan} compact />
            {response.finalMessage && (
              <p className="text-[14px] font-medium text-text-primary">{response.finalMessage}</p>
            )}
          </div>
        ) : !response.mission ? (
          <>
            <div className="gigi-panel mt-3 rounded-xl p-4">
              {response.alternative && (
                <p className="text-[14px] leading-relaxed text-text-secondary">
                  Si tu veux quand même avancer :{" "}
                  <span className="text-text-muted">{response.alternative.projectName}</span> —{" "}
                  {response.alternative.missionTitle}
                </p>
              )}
              {response.finalMessage && (
                <p className="mt-3 text-[15px] font-medium text-text-primary">
                  {response.finalMessage}
                </p>
              )}
            </div>
            <IntegrationProposalsSection response={response} />
            <AutomationProposalsSection response={response} />
            <ActionProposalsSection response={response} />
          </>
        ) : (
          <div className="gigi-panel mt-3 divide-y divide-border overflow-hidden rounded-xl">
            <div className="p-4">
              <Label>Priorité · {response.priorityProjectName}</Label>
              <p className="mt-1.5 text-[15px] font-medium text-text-primary">
                {response.missionTitle}
              </p>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-text-muted">{response.why}</p>
            </div>

            {response.tasks && response.tasks.length > 0 && (
              <div className="p-4">
                <Label>Tes 3 tâches</Label>
                <ul className="mt-2.5 space-y-2">
                  {response.tasks.map((task, i) => (
                    <li key={i} className="flex gap-2.5 text-[13.5px] leading-relaxed text-text-secondary">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden />
                      {task}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {(response.alternative || response.warning || response.nextStep) && (
              <div className="p-4">
                {response.alternative && (
                  <>
                    <Label>Alternative</Label>
                    <p className="mt-1.5 text-[13.5px] leading-relaxed text-text-secondary">
                      <span className="text-text-muted">{response.alternative.projectName}</span> —{" "}
                      {response.alternative.missionTitle}
                    </p>
                  </>
                )}
                {response.warning && (
                  <p className="mt-2.5 text-[13px] leading-relaxed text-text-muted">
                    <span className="font-medium text-text-secondary">Risque : </span>
                    {response.warning}
                  </p>
                )}
                {response.nextStep && (
                  <p className="mt-2.5 text-[13px] leading-relaxed text-text-secondary">
                    <span className="font-medium text-text-muted">Prochaine étape : </span>
                    {response.nextStep}
                  </p>
                )}
              </div>
            )}

            {response.notNow && response.notNow.length > 0 && (
              <div className="p-4">
                <button
                  type="button"
                  onClick={() => setShowNotNow((v) => !v)}
                  className="gigi-focus flex items-center gap-1.5 rounded text-[11px] font-medium uppercase tracking-wider text-text-muted hover:text-text-secondary"
                >
                  Pourquoi pas les autres ?
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showNotNow ? "rotate-180" : ""}`} />
                </button>
                {showNotNow && (
                  <ul className="mt-2.5 space-y-1.5">
                    {response.notNow.map((item) => (
                      <li key={item.projectName} className="text-[13px] leading-relaxed text-text-muted">
                        <span className="text-text-secondary">{item.projectName}</span> — {item.reason}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {response.integrationProposals && response.integrationProposals.length > 0 && (
              <div className="p-4">
                <Label>Intégration proposée (dry-run)</Label>
                {response.integrationBlockedMessage && (
                  <p className="mt-2 text-[12.5px] leading-relaxed text-amber-200/90">
                    {response.integrationBlockedMessage}
                  </p>
                )}
                {response.integrationProposals.map((proposal) => (
                  <IntegrationProposalCard key={proposal.id} proposal={proposal} />
                ))}
                <p className="mt-2.5 text-[11px] text-text-muted/70">
                  V0.8 — {V08_NO_API_MESSAGE}
                </p>
              </div>
            )}

            {response.automationProposals && response.automationProposals.length > 0 && (
              <div className="p-4">
                <Label>Automatisation proposée (dry-run)</Label>
                {response.automationBlockedMessage && (
                  <p className="mt-2 text-[12.5px] leading-relaxed text-amber-200/90">
                    {response.automationBlockedMessage}
                  </p>
                )}
                {response.automationProposals.map((proposal) => (
                  <AutomationProposalCard key={proposal.id} proposal={proposal} />
                ))}
                <p className="mt-2.5 text-[11px] text-text-muted/70">
                  V0.7 — {V07_NO_EXECUTION_MESSAGE}
                </p>
              </div>
            )}

            {response.actionProposals && response.actionProposals.length > 0 && (
              <div className="p-4">
                <Label>Action proposée (dry-run)</Label>
                {response.actionProposals.map((proposal) => (
                  <ActionProposalCard
                    key={proposal.id}
                    proposal={proposal}
                    agentBlockedMessage={response.agentBlockedMessage}
                  />
                ))}
                <p className="mt-2.5 text-[11px] text-text-muted/70">
                  V0.6.2 — {V062_NO_EXTERNAL_MESSAGE}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
