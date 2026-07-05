import type { QueuedAction } from "@/modules/actionQueue/types";
import type { ExecutionPlan } from "@/modules/executionPlans/types";
import type { SafeActionWorkspace } from "@/modules/safeActionWorkspace/types";
import { getSafeActionWorkspaceById } from "@/modules/safeActionWorkspace/safeActionWorkspaceStore";
import {
  createHandoffFromExecutionPlanRecord,
  createHandoffFromQueuedActionRecord,
  createHandoffFromWorkspaceRecord,
} from "./manualExecutionHandoffEngine";
import {
  formatChecklistHandoffForCopy,
  formatCursorPromptForCopy,
  formatExpectedReportForCopy,
  formatManualExecutionHandoffForCopy,
} from "./manualExecutionHandoffFormatter";
import {
  MANUAL_EXECUTION_HANDOFF_EMPTY_SUMMARY,
  MANUAL_EXECUTION_HANDOFF_GUIDANCE,
} from "./manualExecutionHandoffSummary";
import {
  archiveManualExecutionHandoff,
  getHandoffsBySourceActionId,
  getHandoffsBySourceWorkspaceId,
  getManualExecutionHandoffById,
  listManualExecutionHandoffs,
  upsertManualExecutionHandoff,
} from "./manualExecutionHandoffStore";
import type {
  ManualExecutionHandoff,
  ManualExecutionHandoffGlobalSummary,
  ManualExecutionHandoffIntent,
  ManualExecutionHandoffTarget,
} from "./types";
import { MANUAL_EXECUTION_HANDOFF_DISCLAIMER } from "./types";

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

const HANDOFF_KEYWORDS = [
  "prepare le handoff",
  "prépare le handoff",
  "prepare pour cursor",
  "prépare pour cursor",
  "donne moi le paquet d execution",
  "donne-moi le paquet d'exécution",
  "copie le contexte cursor",
  "prepare la passation",
  "prépare la passation",
  "qu est ce que je colle dans cursor",
  "qu'est-ce que je colle dans cursor",
  "quel rapport je dois demander",
  "prepare moi l execution manuelle",
  "prépare-moi l'exécution manuelle",
  "paquet d execution",
  "paquet d'exécution",
  "manual execution handoff",
  "passation manuelle",
  "handoff cursor",
];

export function detectManualExecutionHandoffIntent(
  objective: string
): ManualExecutionHandoffIntent {
  const norm = normalize(objective);
  const isManualExecutionHandoff = HANDOFF_KEYWORDS.some((k) =>
    norm.includes(normalize(k))
  );
  return { isManualExecutionHandoff, projectId: detectProjectId(norm) };
}

export function createHandoffFromWorkspace(
  workspace: SafeActionWorkspace,
  target: ManualExecutionHandoffTarget = "cursor"
): ManualExecutionHandoff {
  const existing = getHandoffsBySourceWorkspaceId(workspace.id)[0];
  const handoff = createHandoffFromWorkspaceRecord(workspace, target, existing);
  return upsertManualExecutionHandoff(handoff);
}

export function createHandoffFromWorkspaceId(
  workspaceId: string,
  target: ManualExecutionHandoffTarget = "cursor"
): ManualExecutionHandoff | undefined {
  const workspace = getSafeActionWorkspaceById(workspaceId);
  if (!workspace) return undefined;
  return createHandoffFromWorkspace(workspace, target);
}

export function createHandoffFromQueuedAction(
  action: QueuedAction,
  target: ManualExecutionHandoffTarget = "cursor"
): ManualExecutionHandoff {
  const existing = getHandoffsBySourceActionId(action.id)[0];
  const handoff = createHandoffFromQueuedActionRecord(action, target, existing);
  return upsertManualExecutionHandoff(handoff);
}

export function createHandoffFromExecutionPlan(
  plan: ExecutionPlan,
  target: ManualExecutionHandoffTarget = "cursor"
): ManualExecutionHandoff {
  const existing = listManualExecutionHandoffs().find(
    (h) => h.sourceExecutionPlanId === plan.id && h.status !== "archived"
  );
  const handoff = createHandoffFromExecutionPlanRecord(plan, target, existing);
  return upsertManualExecutionHandoff(handoff);
}

export function markHandoffCopied(id: string): ManualExecutionHandoff | undefined {
  const handoff = getManualExecutionHandoffById(id);
  if (!handoff) return undefined;
  const timestamp = new Date().toISOString();
  return upsertManualExecutionHandoff({
    ...handoff,
    status: "copied",
    copyCount: handoff.copyCount + 1,
    lastCopiedAt: timestamp,
    updatedAt: timestamp,
  });
}

export function markHandoffHandedOff(id: string): ManualExecutionHandoff | undefined {
  const handoff = getManualExecutionHandoffById(id);
  if (!handoff) return undefined;
  const timestamp = new Date().toISOString();
  return upsertManualExecutionHandoff({
    ...handoff,
    status: "handed_off",
    updatedAt: timestamp,
  });
}

export function markHandoffWaitingForReport(id: string): ManualExecutionHandoff | undefined {
  const handoff = getManualExecutionHandoffById(id);
  if (!handoff) return undefined;
  const timestamp = new Date().toISOString();
  return upsertManualExecutionHandoff({
    ...handoff,
    status: "waiting_for_report",
    updatedAt: timestamp,
  });
}

export function markHandoffReportReceived(id: string): ManualExecutionHandoff | undefined {
  const handoff = getManualExecutionHandoffById(id);
  if (!handoff) return undefined;
  const timestamp = new Date().toISOString();
  return upsertManualExecutionHandoff({
    ...handoff,
    status: "report_received",
    updatedAt: timestamp,
  });
}

export function addHandoffUserNote(id: string, note: string): ManualExecutionHandoff | undefined {
  const handoff = getManualExecutionHandoffById(id);
  if (!handoff || !note.trim()) return undefined;
  const timestamp = new Date().toISOString();
  return upsertManualExecutionHandoff({
    ...handoff,
    userNotes: [note.trim(), ...handoff.userNotes],
    updatedAt: timestamp,
  });
}

export function updateHandoffTarget(
  id: string,
  target: ManualExecutionHandoffTarget
): ManualExecutionHandoff | undefined {
  const handoff = getManualExecutionHandoffById(id);
  if (!handoff) return undefined;
  return upsertManualExecutionHandoff({
    ...handoff,
    target,
    updatedAt: new Date().toISOString(),
  });
}

export function getCopyableHandoffText(id: string): string {
  const handoff = getManualExecutionHandoffById(id);
  if (!handoff) return MANUAL_EXECUTION_HANDOFF_DISCLAIMER;
  return formatManualExecutionHandoffForCopy(handoff);
}

export function getCopyableCursorPrompt(id: string): string {
  const handoff = getManualExecutionHandoffById(id);
  if (!handoff) return MANUAL_EXECUTION_HANDOFF_DISCLAIMER;
  return formatCursorPromptForCopy(handoff);
}

export function getCopyableHandoffChecklist(id: string): string {
  const handoff = getManualExecutionHandoffById(id);
  if (!handoff) return MANUAL_EXECUTION_HANDOFF_DISCLAIMER;
  return formatChecklistHandoffForCopy(handoff);
}

export function getCopyableExpectedReport(id: string): string {
  const handoff = getManualExecutionHandoffById(id);
  if (!handoff) return MANUAL_EXECUTION_HANDOFF_DISCLAIMER;
  return formatExpectedReportForCopy(handoff);
}

export function generateGlobalHandoffSummary(): ManualExecutionHandoffGlobalSummary {
  const handoffs = listManualExecutionHandoffs();
  if (handoffs.length === 0) {
    return {
      totalHandoffs: 0,
      waitingForReportCount: 0,
      summaryText: MANUAL_EXECUTION_HANDOFF_EMPTY_SUMMARY,
    };
  }

  const waitingForReportCount = handoffs.filter(
    (h) => h.status === "waiting_for_report" || h.status === "handed_off"
  ).length;
  const recent = handoffs[0];

  return {
    totalHandoffs: handoffs.length,
    waitingForReportCount,
    recentTitle: recent.title.replace(/^Handoff · /, ""),
    summaryText: `${handoffs.length} handoff(s) — ${waitingForReportCount} en attente de rapport — dernier : « ${recent.title.replace(/^Handoff · /, "")} ».`,
  };
}

export function buildManualExecutionHandoffGuidanceHints(objective: string): string[] {
  const hints = [...MANUAL_EXECUTION_HANDOFF_GUIDANCE];
  const norm = normalize(objective);
  if (norm.includes("cursor")) {
    hints.push("Copie le prompt Cursor toi-même — Gigi ne l'envoie pas automatiquement.");
  }
  if (norm.includes("rapport")) {
    hints.push("Utilise le template de rapport inclus dans le handoff.");
  }
  return hints;
}

export { archiveManualExecutionHandoff, listManualExecutionHandoffs, getManualExecutionHandoffById };
