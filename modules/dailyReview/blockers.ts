import { buildExecutionSnapshot } from "../missionExecution/executionState";
import type { GigiLocalState } from "../storage/gigiStateTypes";
import { detectStaleProjects } from "./staleProjects";
import {
  collectDismissedRecent,
  collectPostponedRecent,
  countProjectSwitches,
  hasRecentCompletion,
} from "./reviewSignals";
import type { DailyReviewBlocker } from "./types";

export function detectPossibleBlockers(state: GigiLocalState): DailyReviewBlocker[] {
  const blockers: DailyReviewBlocker[] = [];
  const snapshot = buildExecutionSnapshot(state);
  const postponed = collectPostponedRecent(state);
  const dismissed = collectDismissedRecent(state);
  const stale = detectStaleProjects(state);
  const switches = countProjectSwitches(state.history ?? []);

  if (postponed.length > 0) {
    blockers.push({
      type: "postponed_mission",
      message: `Mission reportée : ${postponed[0].title}.`,
      severity: "medium",
    });
  }

  if (dismissed.length > 0) {
    blockers.push({
      type: "dismissed_mission",
      message: `Mission mise de côté : ${dismissed[0].title}.`,
      severity: "low",
    });
  }

  if (snapshot.phase === "proposed" && !snapshot.canStart) {
    blockers.push({
      type: "no_active_mission",
      message: "Aucune mission active — une mission est proposée mais pas démarrée.",
      severity: "medium",
    });
  }

  if (!hasRecentCompletion(state) && state.completedMissionIds.length === 0) {
    blockers.push({
      type: "no_recent_completion",
      message: "Aucune mission terminée récemment — difficile de mesurer l'avancement.",
      severity: "low",
    });
  }

  const lastCompleted = state.history.find((e) => e.type === "mission_completed");
  if (lastCompleted && !lastCompleted.meta?.nextStep && !state.executionHints?.nextStep) {
    blockers.push({
      type: "completed_without_next_step",
      message: "Dernière mission terminée sans prochaine étape enregistrée.",
      severity: "medium",
    });
  }

  if (switches >= 3) {
    blockers.push({
      type: "project_switching",
      message: "Plusieurs projets touchés récemment — risque de dispersion.",
      severity: "high",
    });
  }

  const priorityStale = stale.find(
    (s) => s.projectId === "buildy-clear" || s.projectId === "buildy-crafts"
  );
  if (priorityStale) {
    blockers.push({
      type: "stale_project",
      message: `Projet prioritaire sans activité récente : ${priorityStale.projectName}.`,
      severity: "medium",
    });
  }

  return blockers;
}
