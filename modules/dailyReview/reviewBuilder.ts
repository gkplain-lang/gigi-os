import { buildExecutionSnapshot } from "../missionExecution/executionState";
import type { GigiLocalState } from "../storage/gigiStateTypes";
import { buildNotNow } from "./reviewNotNow";
import { detectPossibleBlockers } from "./blockers";
import { detectStaleProjects } from "./staleProjects";
import {
  collectCompletedRecent,
  collectDismissedRecent,
  collectPostponedRecent,
  getActiveMissionRef,
} from "./reviewSignals";
import { filterRecentEvents, todayIsoDate } from "./reviewWindow";
import type { DailyReviewSnapshot } from "./types";

function buildShortSummary(state: GigiLocalState, snapshot: Omit<DailyReviewSnapshot, "shortSummary" | "confidenceScore">): string {
  const parts: string[] = [];
  const yesterdayDone = state.history.filter(
    (e) => e.group === "yesterday" && e.type === "mission_completed"
  );
  const todayDone = state.history.filter(
    (e) => e.group === "today" && e.type === "mission_completed"
  );

  if (todayDone.length > 0) {
    parts.push(`Aujourd'hui : ${todayDone[0].title.replace(/^Mission terminée\s*:\s*/i, "")}.`);
  } else if (yesterdayDone.length > 0) {
    parts.push(`Hier : ${yesterdayDone[0].title.replace(/^Mission terminée\s*:\s*/i, "")}.`);
  } else if (snapshot.completedMissionsRecent.length > 0) {
    parts.push(`Récemment terminé : ${snapshot.completedMissionsRecent[0].title}.`);
  } else {
    parts.push("Pas de mission terminée récemment.");
  }

  if (snapshot.activeMission) {
    parts.push(`En cours : ${snapshot.activeMission.title}.`);
  } else if (snapshot.currentMission.phase === "proposed") {
    parts.push(`Proposée : ${snapshot.currentMission.title}.`);
  }

  if (snapshot.possibleBlockers[0]) {
    parts.push(`Blocage : ${snapshot.possibleBlockers[0].message}`);
  }

  return parts.join(" ");
}

function computeConfidenceScore(snapshot: Omit<DailyReviewSnapshot, "confidenceScore" | "shortSummary">): number {
  let score = 0.55;
  if (snapshot.completedMissionsRecent.length > 0) score += 0.1;
  if (snapshot.activeMission) score += 0.15;
  if (snapshot.possibleBlockers.length === 0) score += 0.1;
  if (snapshot.staleProjects.length <= 2) score += 0.05;
  if (snapshot.nextStep) score += 0.05;
  score -= Math.min(0.2, snapshot.possibleBlockers.filter((b) => b.severity === "high").length * 0.1);
  return Math.min(1, Math.max(0.3, Math.round(score * 100) / 100));
}

/**
 * Read-only daily review builder — never mutates state, no sync, no external calls.
 */
export function buildDailyReviewSnapshot(state: GigiLocalState): DailyReviewSnapshot {
  const execution = buildExecutionSnapshot(state);
  const recentEvents = filterRecentEvents(state.history ?? []);
  const completedMissionsRecent = collectCompletedRecent(state);
  const postponedMissionsRecent = collectPostponedRecent(state);
  const dismissedMissionsRecent = collectDismissedRecent(state);
  const staleProjects = detectStaleProjects(state);
  const possibleBlockers = detectPossibleBlockers(state);
  const activeMission = getActiveMissionRef(state);

  const nextStep =
    state.executionHints?.nextStep ??
    execution.lastNextStep ??
    (completedMissionsRecent.length > 0
      ? "Démarrer la mission recommandée ci-dessous."
      : "Choisir une mission unique et la démarrer.");

  const suggestedFocus =
    activeMission != null
      ? `Terminer ${activeMission.title}`
      : execution.phase === "proposed"
        ? `Démarrer ${execution.missionTitle}`
        : "Une mission claire sur un seul projet";

  const partial = {
    date: todayIsoDate(),
    currentMission: {
      missionId: execution.missionId,
      title: execution.missionTitle,
      projectId: execution.projectId,
      projectName: execution.projectName,
      phase: execution.phase,
    },
    activeMission,
    completedMissionsRecent,
    postponedMissionsRecent,
    dismissedMissionsRecent,
    recentHistoryEvents: recentEvents.slice(0, 8),
    staleProjects,
    possibleBlockers,
    suggestedFocus,
    ignoredToday: buildNotNow(execution.projectId),
    nextStep,
  };

  return {
    ...partial,
    shortSummary: buildShortSummary(state, partial),
    confidenceScore: computeConfidenceScore(partial),
  };
}

export function buildStateFromAiRequest(input: {
  currentMission: GigiLocalState["mission"];
  projects: GigiLocalState["projects"];
  historyEvents?: GigiLocalState["history"];
  historyFallback?: Array<{ title: string; type: string; date: string }>;
  completedMissionIds: string[];
  postponedMissionIds: string[];
  rejectedMissionIds: string[];
  executionHints?: GigiLocalState["executionHints"];
}): GigiLocalState {
  let history = input.historyEvents ?? [];
  if (history.length === 0 && input.historyFallback?.length) {
    history = input.historyFallback.map((h, i) => ({
      id: `hist-fallback-${i}`,
      type: h.type as GigiLocalState["history"][0]["type"],
      title: h.title,
      date: h.date,
      group: "earlier" as const,
    }));
  }

  return {
    mission: input.currentMission,
    projects: input.projects,
    history,
    completedMissionIds: input.completedMissionIds,
    postponedMissionIds: input.postponedMissionIds,
    rejectedMissionIds: input.rejectedMissionIds,
    executionHints: input.executionHints ?? null,
  };
}
