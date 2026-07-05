import type { QueuedAction } from "@/modules/actionQueue/types";
import { loadActionQueueState } from "@/modules/actionQueue/actionQueueStore";
import { getMissionPlanBridgeById } from "@/modules/missionPlanBridge";
import {
  aggregateContextFromQueuedAction,
  computeWorkspaceReadiness,
  createWorkspaceFromBridgeRecord,
  createWorkspaceFromContext,
} from "./safeActionWorkspaceEngine";
import {
  formatChecklistForCopy,
  formatCursorContextForCopy,
  formatSafeActionWorkspaceForCopy,
} from "./safeActionWorkspaceFormatter";
import {
  SAFE_ACTION_WORKSPACE_EMPTY_SUMMARY,
  SAFE_ACTION_WORKSPACE_GUIDANCE,
} from "./safeActionWorkspaceSummary";
import {
  archiveSafeActionWorkspace,
  getSafeActionWorkspaceByActionId,
  getSafeActionWorkspaceById,
  listSafeActionWorkspaces,
  upsertSafeActionWorkspace,
} from "./safeActionWorkspaceStore";
import type {
  SafeActionWorkspace,
  SafeActionWorkspaceGlobalSummary,
  SafeActionWorkspaceIntent,
} from "./types";
import { SAFE_ACTION_WORKSPACE_DISCLAIMER } from "./types";

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function detectProjectId(norm: string): string | null {
  if (/buildy ?crafts|(^|\W)crafts(\W|$)/.test(norm)) return "buildy-crafts";
  if (/buildy ?clear|(^|\W)clear(\W|$)/.test(norm)) return "buildy-clear";
  if (/linko/.test(norm)) return "linko";
  if (/gigi ?os|gigios|(^|\W)gigi(\W|$)/.test(norm)) return "gigi-os";
  return null;
}

const SAFE_ACTION_WORKSPACE_KEYWORDS = [
  "ouvre le workspace",
  "ouvrir le workspace",
  "espace d action securise",
  "espace d'action sécurisé",
  "safe action workspace",
  "prepare l espace d action",
  "prépare l'espace d'action",
  "est ce que cette action est prete",
  "est-ce que cette action est prête",
  "qu est ce qu il manque avant d executer",
  "qu'est-ce qu'il manque avant d'exécuter",
  "copie le contexte cursor",
  "prepare moi avant cursor",
  "prépare-moi avant cursor",
  "quels sont les risques de cette action",
  "quelle checklist avant execution",
  "quelle checklist avant exécution",
  "poste de pilotage",
  "workspace action",
];

export function detectSafeActionWorkspaceIntent(objective: string): SafeActionWorkspaceIntent {
  const norm = normalize(objective);
  const isSafeActionWorkspace = SAFE_ACTION_WORKSPACE_KEYWORDS.some((k) =>
    norm.includes(normalize(k))
  );
  return { isSafeActionWorkspace, projectId: detectProjectId(norm) };
}

export function createWorkspaceFromQueuedAction(
  action: QueuedAction
): SafeActionWorkspace {
  const existing = getSafeActionWorkspaceByActionId(action.id);
  const ctx = aggregateContextFromQueuedAction(action);
  const workspace = createWorkspaceFromContext(ctx, existing);
  return upsertSafeActionWorkspace(workspace);
}

export function createWorkspaceFromBridge(bridgeId: string): SafeActionWorkspace | undefined {
  const bridge = getMissionPlanBridgeById(bridgeId);
  if (!bridge) return undefined;
  const workspace = createWorkspaceFromBridgeRecord(bridge);
  if (!workspace) return undefined;
  return upsertSafeActionWorkspace(workspace);
}

export function refreshWorkspace(workspaceId: string): SafeActionWorkspace | undefined {
  const existing = getSafeActionWorkspaceById(workspaceId);
  if (!existing?.actionId) return existing;

  const action = loadActionQueueState().actions.find((a) => a.id === existing.actionId);
  if (!action) return existing;

  const ctx = aggregateContextFromQueuedAction(action);
  const workspace = createWorkspaceFromContext(ctx, existing);
  return upsertSafeActionWorkspace(workspace);
}

export function toggleChecklistItem(
  workspaceId: string,
  itemId: string,
  completed: boolean
): SafeActionWorkspace | undefined {
  const workspace = getSafeActionWorkspaceById(workspaceId);
  if (!workspace) return undefined;

  const validationChecklist = workspace.validationChecklist.map((item) =>
    item.id === itemId ? { ...item, completed } : item
  );

  const timestamp = new Date().toISOString();
  let readiness = workspace.readiness;

  if (workspace.actionId) {
    const action = loadActionQueueState().actions.find((a) => a.id === workspace.actionId);
    if (action) {
      const ctx = aggregateContextFromQueuedAction(action);
      readiness = computeWorkspaceReadiness(ctx, validationChecklist);
    }
  }

  return upsertSafeActionWorkspace({
    ...workspace,
    validationChecklist,
    readiness,
    updatedAt: timestamp,
  });
}

export function addUserNote(
  workspaceId: string,
  content: string
): SafeActionWorkspace | undefined {
  const workspace = getSafeActionWorkspaceById(workspaceId);
  if (!workspace || !content.trim()) return undefined;

  const note = {
    id: `note-${Date.now()}`,
    content: content.trim(),
    createdAt: new Date().toISOString(),
  };

  return upsertSafeActionWorkspace({
    ...workspace,
    userNotes: [note, ...workspace.userNotes],
    updatedAt: note.createdAt,
  });
}

export function getCopyableWorkspaceText(workspaceId: string): string {
  const workspace = getSafeActionWorkspaceById(workspaceId);
  if (!workspace) return SAFE_ACTION_WORKSPACE_DISCLAIMER;
  return formatSafeActionWorkspaceForCopy(workspace);
}

export function getCopyableChecklistText(workspaceId: string): string {
  const workspace = getSafeActionWorkspaceById(workspaceId);
  if (!workspace) return SAFE_ACTION_WORKSPACE_DISCLAIMER;
  return formatChecklistForCopy(workspace);
}

export function getCursorContextText(workspaceId: string): string {
  const workspace = getSafeActionWorkspaceById(workspaceId);
  if (!workspace) return SAFE_ACTION_WORKSPACE_DISCLAIMER;
  return formatCursorContextForCopy(workspace);
}

export function generateGlobalWorkspaceSummary(): SafeActionWorkspaceGlobalSummary {
  const workspaces = listSafeActionWorkspaces();
  if (workspaces.length === 0) {
    return {
      totalWorkspaces: 0,
      readyCount: 0,
      blockedCount: 0,
      summaryText: SAFE_ACTION_WORKSPACE_EMPTY_SUMMARY,
    };
  }

  const readyCount = workspaces.filter((w) => w.readiness === "ready").length;
  const blockedCount = workspaces.filter(
    (w) => w.readiness === "blocked" || w.readiness === "risky"
  ).length;
  const recent = workspaces[0];

  return {
    totalWorkspaces: workspaces.length,
    readyCount,
    blockedCount,
    recentTitle: recent.title.replace(/^Workspace · /, ""),
    summaryText: `${workspaces.length} workspace(s) — ${readyCount} prêt(s), ${blockedCount} à relire — dernier : « ${recent.title.replace(/^Workspace · /, "")} ».`,
  };
}

export function buildSafeActionWorkspaceGuidanceHints(objective: string): string[] {
  const hints = [...SAFE_ACTION_WORKSPACE_GUIDANCE];
  const norm = normalize(objective);
  if (norm.includes("cursor") || norm.includes("contexte")) {
    hints.push("Copie le contexte Cursor depuis le workspace — Gigi ne lance rien.");
  }
  if (norm.includes("checklist") || norm.includes("pret") || norm.includes("prêt")) {
    hints.push("Coche chaque item de la checklist avant exécution manuelle.");
  }
  if (norm.includes("risque")) {
    hints.push("Les risques viennent de données locales déclarées — pas de vérification repo.");
  }
  return hints;
}

export { archiveSafeActionWorkspace, listSafeActionWorkspaces, getSafeActionWorkspaceById };
