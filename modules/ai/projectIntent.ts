import { PROJECT_NAMES } from "@/modules/conversation/missionCatalog";
import type { AiBrainRequest, ProjectIntentLock } from "./types";

export interface DetectedProjectIntent {
  requestedProjectId: string | null;
  requestedProjectName: string | null;
  intentLock: ProjectIntentLock;
}

const EMPTY_INTENT: DetectedProjectIntent = {
  requestedProjectId: null,
  requestedProjectName: null,
  intentLock: null,
};

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function lockProject(projectId: string): DetectedProjectIntent {
  return {
    requestedProjectId: projectId,
    requestedProjectName: PROJECT_NAMES[projectId] ?? projectId,
    intentLock: "project_specific",
  };
}

function matchesBuildyCrafts(norm: string): boolean {
  return (
    /buildy\s*crafts/.test(norm) ||
    /(^|\W)crafts(\W|$)/.test(norm) ||
    /bibliotheque/.test(norm) ||
    /materiaux/.test(norm) ||
    /charpente/.test(norm) ||
    /ouvertures/.test(norm)
  );
}

function matchesBuildyClear(norm: string): boolean {
  return (
    /buildy\s*clear/.test(norm) ||
    /(^|\W)clear(\W|$)/.test(norm) ||
    /page de vente/.test(norm) ||
    /tunnel/.test(norm) ||
    /paiement/.test(norm) ||
    /checkout/.test(norm)
  );
}

/**
 * Strict explicit project detection from user message.
 * Crafts is checked before Clear to avoid cross-project substitution.
 */
export function detectRequestedProject(userMessage: string): DetectedProjectIntent {
  const norm = normalize(userMessage.trim());
  if (!norm) return EMPTY_INTENT;

  if (matchesBuildyCrafts(norm)) return lockProject("buildy-crafts");
  if (matchesBuildyClear(norm)) return lockProject("buildy-clear");
  if (/linko/.test(norm)) return lockProject("linko");
  if (/1\s*millimetre|millimetre|1mm/.test(norm)) return lockProject("1millimetre");
  if (/dernier souvenir|(^|\W)souvenir(\W|$)/.test(norm)) {
    return lockProject("le-dernier-souvenir");
  }
  if (/gigi\s*os|gigios/.test(norm)) return lockProject("gigi-os");

  return EMPTY_INTENT;
}

export function enrichAiBrainRequest(request: AiBrainRequest): AiBrainRequest {
  const detected = detectRequestedProject(request.userMessage);
  return {
    ...request,
    requestedProjectId: detected.requestedProjectId,
    requestedProjectName: detected.requestedProjectName,
    intentLock: detected.intentLock,
  };
}
