import type { QueuedAction } from "@/modules/actionQueue/types";
import type { SafeActionWorkspace } from "@/modules/safeActionWorkspace/types";
import type { ManualExecutionHandoff } from "@/modules/manualExecutionHandoff/types";
import type { ExecutionReportIntake } from "@/modules/executionReportIntake/types";
import {
  buildAggregateContextFromAction,
  buildAggregateContextFromHandoff,
  buildAggregateContextFromIntake,
  buildAggregateContextFromWorkspace,
  buildLifecycleRecord,
  recalculateLifecycleRecord,
} from "./closedLoopLifecycleEngine";
import {
  formatClosedLoopLifecycleForCopy,
  formatNextStepsForCopy,
} from "./closedLoopLifecycleFormatter";
import {
  archiveClosedLoopLifecycle,
  getClosedLoopLifecycleById,
  getLifecyclesByActionId,
  listClosedLoopLifecycles,
  upsertClosedLoopLifecycle,
} from "./closedLoopLifecycleStore";
import {
  CLOSED_LOOP_LIFECYCLE_EMPTY_SUMMARY,
  buildClosedLoopLifecycleGuidanceHints,
} from "./closedLoopLifecycleSummary";
import type {
  ClosedLoopLifecycle,
  ClosedLoopLifecycleGlobalSummary,
  ClosedLoopLifecycleIntent,
  ClosedLoopLifecycleStage,
} from "./types";
import { CLOSED_LOOP_LIFECYCLE_DISCLAIMER } from "./types";

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

const LIFECYCLE_KEYWORDS = [
  "ou en est cette action",
  "où en est cette action",
  "montre le cycle complet",
  "est ce que la boucle est fermee",
  "est-ce que la boucle est fermée",
  "qu est ce qu il manque",
  "qu'est-ce qu'il manque",
  "quelle est la prochaine etape",
  "quelle est la prochaine étape",
  "qu est ce que gigi a appris",
  "qu'est-ce que gigi a appris",
  "ferme le cycle",
  "fermer le cycle",
  "archive le cycle",
  "reprends le cycle",
  "montre la lifecycle",
  "cycle d action",
  "cycle d'action",
  "closed loop",
  "lifecycle",
  "cycle complet",
];

export function detectClosedLoopLifecycleIntent(objective: string): ClosedLoopLifecycleIntent {
  const norm = normalize(objective);
  const isClosedLoopLifecycle = LIFECYCLE_KEYWORDS.some((k) => norm.includes(normalize(k)));
  return { isClosedLoopLifecycle, projectId: detectProjectId(norm) };
}

export function createLifecycleFromAction(action: QueuedAction): ClosedLoopLifecycle {
  const ctx = buildAggregateContextFromAction(action);
  const lifecycle = buildLifecycleRecord({
    title: `Cycle · ${action.preparedAction.title}`,
    source: "action_queue",
    ctx,
  });
  return upsertClosedLoopLifecycle(lifecycle);
}

export function createLifecycleFromWorkspace(workspace: SafeActionWorkspace): ClosedLoopLifecycle {
  const ctx = buildAggregateContextFromWorkspace(workspace);
  const title = workspace.title.replace(/^Workspace · /, "");
  const lifecycle = buildLifecycleRecord({
    title: `Cycle · ${title}`,
    source: "safe_action_workspace",
    ctx,
  });
  return upsertClosedLoopLifecycle(lifecycle);
}

export function createLifecycleFromHandoff(handoff: ManualExecutionHandoff): ClosedLoopLifecycle {
  const ctx = buildAggregateContextFromHandoff(handoff);
  const title = handoff.title.replace(/^Handoff · /, "");
  const lifecycle = buildLifecycleRecord({
    title: `Cycle · ${title}`,
    source: "manual_execution_handoff",
    ctx,
  });
  return upsertClosedLoopLifecycle(lifecycle);
}

export function createLifecycleFromIntake(intake: ExecutionReportIntake): ClosedLoopLifecycle {
  const ctx = buildAggregateContextFromIntake(intake);
  const title = intake.title.replace(/^Intake · /, "");
  const lifecycle = buildLifecycleRecord({
    title: `Cycle · ${title}`,
    source: "execution_report_intake",
    ctx,
  });
  return upsertClosedLoopLifecycle(lifecycle);
}

export function recalculateLifecycle(id: string): ClosedLoopLifecycle | undefined {
  const existing = getClosedLoopLifecycleById(id);
  if (!existing) return undefined;
  const updated = recalculateLifecycleRecord(existing);
  return upsertClosedLoopLifecycle(updated);
}

export function markLifecycleClosed(id: string): ClosedLoopLifecycle | undefined {
  const existing = getClosedLoopLifecycleById(id);
  if (!existing) return undefined;
  const recalculated = recalculateLifecycleRecord(existing);
  const timestamp = new Date().toISOString();
  return upsertClosedLoopLifecycle({
    ...recalculated,
    status: "closed",
    userClosed: true,
    closedAt: timestamp,
    updatedAt: timestamp,
    completedStages: [
      ...new Set<ClosedLoopLifecycleStage>([...recalculated.completedStages, "cycle_closed"]),
    ],
    missingStages: recalculated.missingStages.filter((s) => s !== "cycle_closed"),
  });
}

export function addLifecycleUserNote(id: string, note: string): ClosedLoopLifecycle | undefined {
  const lifecycle = getClosedLoopLifecycleById(id);
  const trimmed = note.trim();
  if (!lifecycle || !trimmed) return undefined;
  const timestamp = new Date().toISOString();
  return upsertClosedLoopLifecycle({
    ...lifecycle,
    userNotes: [...lifecycle.userNotes, trimmed],
    updatedAt: timestamp,
  });
}

export function archiveLifecycle(id: string): ClosedLoopLifecycle | undefined {
  return archiveClosedLoopLifecycle(id);
}

export function getCopyableLifecycleText(id: string): string {
  const lifecycle = getClosedLoopLifecycleById(id);
  if (!lifecycle) return "";
  return formatClosedLoopLifecycleForCopy(lifecycle);
}

export function getCopyableNextStepsText(id: string): string {
  const lifecycle = getClosedLoopLifecycleById(id);
  if (!lifecycle) return "";
  return formatNextStepsForCopy(lifecycle);
}

export function generateGlobalLifecycleSummary(): ClosedLoopLifecycleGlobalSummary {
  const lifecycles = listClosedLoopLifecycles();
  if (lifecycles.length === 0) return CLOSED_LOOP_LIFECYCLE_EMPTY_SUMMARY;

  const activeCount = lifecycles.filter((l) =>
    ["active", "waiting_for_user", "waiting_for_execution", "waiting_for_report", "needs_review", "needs_follow_up", "learning_ready"].includes(l.status)
  ).length;
  const closedCount = lifecycles.filter((l) => l.status === "closed").length;
  const blockedCount = lifecycles.filter((l) => l.status === "blocked" || l.health === "blocked").length;

  return {
    totalLifecycles: lifecycles.length,
    activeCount,
    closedCount,
    blockedCount,
    summaryText: `${lifecycles.length} cycle(s) · ${activeCount} actif(s) · ${closedCount} fermé(s) · ${blockedCount} bloqué(s).`,
  };
}

export function getExistingLifecycleForAction(actionId: string): ClosedLoopLifecycle | undefined {
  return getLifecyclesByActionId(actionId)[0];
}

export {
  buildClosedLoopLifecycleGuidanceHints,
  CLOSED_LOOP_LIFECYCLE_DISCLAIMER,
};
