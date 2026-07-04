import {
  MISSION_CATALOG,
  catalogToMission,
  type CatalogMission,
} from "@/modules/conversation/missionCatalog";
import type { Mission } from "@/modules/missions/missionTypes";
import { runLocalFallbackProvider } from "./localFallbackProvider";
import type { AiBrainRequest, AiBrainResponse } from "./types";

function tasksFromCatalog(cm: CatalogMission): string[] {
  if (cm.subtasks && cm.subtasks.length >= 3) return cm.subtasks.slice(0, 3);
  return [
    `${cm.title} — poser la première petite étape`,
    "Avancer 45 minutes, sans rien ouvrir d'autre",
    "Noter où tu t'arrêtes pour reprendre facilement",
  ];
}

export function pickCatalogMissionForProject(
  projectId: string,
  completedMissionIds: string[]
): Mission | undefined {
  const completed = new Set(completedMissionIds);
  const best = MISSION_CATALOG.filter(
    (m) => m.projectId === projectId && !completed.has(m.id)
  ).sort((a, b) => b.score - a.score)[0];

  return best ? catalogToMission(best) : undefined;
}

function withIntentMeta(
  response: AiBrainResponse,
  request: AiBrainRequest,
  extras: Partial<AiBrainResponse> = {}
): AiBrainResponse {
  return {
    ...response,
    requestedProjectId: request.requestedProjectId ?? null,
    ...extras,
  };
}

/**
 * Rejects or corrects AI responses that ignore an explicit project request.
 */
export function applyProjectIntentGuard(
  request: AiBrainRequest,
  response: AiBrainResponse
): AiBrainResponse {
  const lockedProjectId = request.requestedProjectId;
  if (!lockedProjectId || request.intentLock !== "project_specific") {
    return withIntentMeta(response, request, { projectMismatchDetected: false });
  }

  const recommendedProjectId = response.recommendedMission?.projectId;
  if (!recommendedProjectId || recommendedProjectId === lockedProjectId) {
    return withIntentMeta(response, request, {
      projectMismatchDetected: false,
      intent: "project_specific",
    });
  }

  const corrected = pickCatalogMissionForProject(lockedProjectId, request.completedMissionIds);
  if (corrected) {
    const catalogEntry = MISSION_CATALOG.find((m) => m.id === corrected.id);
    return withIntentMeta(response, request, {
      recommendedMission: corrected,
      reason: response.reason ?? `Mission prioritaire dans ${request.requestedProjectName ?? lockedProjectId}.`,
      tasks: catalogEntry ? tasksFromCatalog(catalogEntry) : response.tasks,
      intent: "project_specific",
      fallbackReason: "AI_PROJECT_MISMATCH",
      projectMismatchDetected: true,
    });
  }

  const local = runLocalFallbackProvider(request);
  return {
    ...local,
    mode: "ai_unavailable",
    requestedProjectId: lockedProjectId,
    fallbackReason: "AI_PROJECT_MISMATCH",
    projectMismatchDetected: true,
  };
}
