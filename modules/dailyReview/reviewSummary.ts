import type { GigiLocalState } from "../storage/gigiStateTypes";
import type { AiBrainRequest, AiBrainResponse } from "../ai/types";
import { buildDailyReviewSnapshot, buildStateFromAiRequest } from "./reviewBuilder";
import { isDailyReviewRequest } from "./reviewSignals";
import type { DailyReviewSnapshot, DailyReviewSummary } from "./types";

export function summarizeDailyReview(state: GigiLocalState): DailyReviewSummary {
  const snapshot = buildDailyReviewSnapshot(state);
  return {
    date: snapshot.date,
    phase: snapshot.currentMission.phase,
    recentEventCount: snapshot.recentHistoryEvents.length,
    staleProjectCount: snapshot.staleProjects.length,
    blockerCount: snapshot.possibleBlockers.length,
    suggestedFocus: snapshot.suggestedFocus,
    confidenceScore: snapshot.confidenceScore,
    shortSummary: snapshot.shortSummary,
  };
}

export function formatReviewBrief(snapshot: DailyReviewSnapshot): string {
  return `Bilan du jour — ${snapshot.shortSummary}`;
}

/** Enrich AI response with read-only daily review — no mutation, no external calls. */
export function applyDailyReviewEnrichment(
  request: AiBrainRequest,
  response: AiBrainResponse
): AiBrainResponse {
  if (!isDailyReviewRequest(request.userMessage)) {
    return response;
  }

  const state = buildStateFromAiRequest({
    currentMission: request.currentMission,
    projects: request.projects,
    historyEvents: request.historyEvents,
    historyFallback: request.history,
    completedMissionIds: request.completedMissionIds,
    postponedMissionIds: request.postponedMissionIds,
    rejectedMissionIds: request.rejectedMissionIds,
    executionHints: request.executionHints,
  });

  const snapshot = buildDailyReviewSnapshot(state);
  const brief = formatReviewBrief(snapshot);

  const message = response.message.includes("Bilan du jour")
    ? response.message
    : `${brief}\n\n${response.message}`;

  const primaryBlocker = snapshot.possibleBlockers[0]?.message;

  return {
    ...response,
    message,
    intent: response.intent === "general" ? "daily_review" : response.intent,
    primaryRisk: response.primaryRisk ?? primaryBlocker ?? undefined,
    nextStep: response.nextStep ?? snapshot.nextStep,
    notNow: response.notNow?.length ? response.notNow : snapshot.ignoredToday,
    dailyReview: snapshot,
    confidence: Math.max(response.confidence, snapshot.confidenceScore),
  };
}
