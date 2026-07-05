"use client";

import {
  cancelGuidedFlow,
  completeGuidedFlowByHuman,
  linkGuidedFlowToCommandPack,
  linkGuidedFlowToManualPacket,
  linkGuidedFlowToRequest,
  linkGuidedFlowToReviewSession,
  markGuidedStepReady,
} from "@/modules/executionExperience/guidedActionBuilder";
import {
  listCommandPacks,
  listExecutionReadinessRequests,
  listLocalReviewSessions,
  listManualExecutionPackets,
} from "@/modules/executionReadiness";
import type { GuidedProjectActionFlow, GuidedFlowStepId } from "@/modules/executionExperience/guidedActionTypes";

interface GuidedActionFlowActionsProps {
  flow: GuidedProjectActionFlow;
  onUpdated: () => void;
}

export function GuidedActionFlowActions({ flow, onUpdated }: GuidedActionFlowActionsProps) {
  const isTerminal = ["completed_by_human", "cancelled"].includes(flow.status);

  function handleMarkStep(stepId: GuidedFlowStepId) {
    markGuidedStepReady(flow.id, stepId);
    onUpdated();
  }

  function handleLinkRequest() {
    const requests = listExecutionReadinessRequests(5);
    const first = requests[0];
    if (first) linkGuidedFlowToRequest(flow.id, first.id);
    onUpdated();
  }

  function handleLinkPacket() {
    const packets = listManualExecutionPackets();
    const first = packets[0];
    if (first) linkGuidedFlowToManualPacket(flow.id, first.id);
    onUpdated();
  }

  function handleLinkPack() {
    const packs = listCommandPacks(5);
    const first = packs[0];
    if (first) linkGuidedFlowToCommandPack(flow.id, first.id);
    onUpdated();
  }

  function handleLinkReview() {
    const sessions = listLocalReviewSessions();
    const first = sessions[0];
    if (first) linkGuidedFlowToReviewSession(flow.id, first.id);
    onUpdated();
  }

  if (isTerminal) {
    return (
      <p className="text-[12px] text-text-muted">
        Parcours {flow.status === "completed_by_human" ? "terminé" : "annulé"} — local uniquement.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
        Actions locales
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => handleMarkStep("local_request")}
          className="gigi-btn-secondary gigi-focus rounded-lg px-3 py-1.5 text-[12px] font-medium"
        >
          Marquer demande prête
        </button>
        <button
          type="button"
          onClick={handleLinkRequest}
          className="gigi-btn-secondary gigi-focus rounded-lg px-3 py-1.5 text-[12px] font-medium"
        >
          Relier demande existante
        </button>
        <button
          type="button"
          onClick={handleLinkPacket}
          className="gigi-btn-secondary gigi-focus rounded-lg px-3 py-1.5 text-[12px] font-medium"
        >
          Relier pont manuel
        </button>
        <button
          type="button"
          onClick={handleLinkPack}
          className="gigi-btn-secondary gigi-focus rounded-lg px-3 py-1.5 text-[12px] font-medium"
        >
          Relier pack commandes
        </button>
        <button
          type="button"
          onClick={handleLinkReview}
          className="gigi-btn-secondary gigi-focus rounded-lg px-3 py-1.5 text-[12px] font-medium"
        >
          Relier revue locale
        </button>
        <button
          type="button"
          onClick={() => {
            completeGuidedFlowByHuman(flow.id);
            onUpdated();
          }}
          className="gigi-btn-primary gigi-focus rounded-lg px-3 py-1.5 text-[12px] font-medium"
        >
          Marquer terminé (humain)
        </button>
        <button
          type="button"
          onClick={() => {
            cancelGuidedFlow(flow.id);
            onUpdated();
          }}
          className="gigi-focus rounded-lg border border-border/50 px-3 py-1.5 text-[12px] text-text-muted hover:text-text-secondary"
        >
          Annuler le parcours
        </button>
      </div>
      <p className="text-[11px] text-text-muted">
        Chaque action est explicite — rien n&apos;est créé ni lancé automatiquement.
      </p>
    </div>
  );
}
