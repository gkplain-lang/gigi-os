import type { QueuedAction } from "@/modules/actionQueue/types";
import {
  addLogNote,
  getOrCreateExecutionLog,
  markFixNeeded,
  markLogAbandoned,
  markLogBlocked,
  markLogCompletedManually,
  markLogStarted,
  markManualCommit,
  markStepCompleted,
  markTestFailed,
  markTestPassed,
} from "@/modules/executionLogs/executionLogService";
import {
  getExecutionLogByPlanId,
  getExecutionLogByQueuedActionId,
} from "@/modules/executionLogs/executionLogStore";
import type { ExecutionLog } from "@/modules/executionLogs/types";
import { createReviewFromLog } from "@/modules/executionReviews/executionReviewService";
import type { ExecutionReview } from "@/modules/executionReviews/types";
import { getCachedExecutionPlan } from "@/modules/executionPlans/executionPlanBuilder";
import type { ManualExecutionHandoff } from "@/modules/manualExecutionHandoff/types";
import { markHandoffReportReceived } from "@/modules/manualExecutionHandoff/manualExecutionHandoffService";
import type { SafeActionWorkspace } from "@/modules/safeActionWorkspace/types";
import {
  createIntakeRecord,
  parseIntakeReport,
  type IntakeBuildContext,
} from "./executionReportIntakeEngine";
import {
  formatExecutionReportIntakeForCopy,
  formatNormalizedReportForCopy,
  formatParsedSummaryForCopy,
} from "./executionReportIntakeFormatter";
import {
  archiveExecutionReportIntake,
  getExecutionReportIntakeById,
  getIntakesBySourceActionId,
  getIntakesBySourceHandoffId,
  listExecutionReportIntakes,
  upsertExecutionReportIntake,
} from "./executionReportIntakeStore";
import {
  buildExecutionReportIntakeGuidanceHints,
  EXECUTION_REPORT_INTAKE_EMPTY_SUMMARY,
  EXECUTION_REPORT_INTAKE_GUIDANCE,
} from "./executionReportIntakeSummary";
import type {
  ExecutionReportIntake,
  ExecutionReportIntakeGlobalSummary,
  ExecutionReportIntakeIntent,
  ExecutionReportIntakeReporter,
  ProposedLogEntry,
} from "./types";
import { EXECUTION_REPORT_INTAKE_DISCLAIMER } from "./types";

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

const INTAKE_KEYWORDS = [
  "j ai recu le rapport",
  "j'ai reçu le rapport",
  "voici le rapport cursor",
  "analyse ce rapport",
  "analyse ce rapport d execution",
  "analyse ce rapport d'exécution",
  "transforme ce rapport en log",
  "ajoute ca au journal",
  "ajoute ça au journal",
  "est ce que le rapport est termine",
  "est-ce que le rapport est terminé",
  "qu est ce que je fais apres ce rapport",
  "qu'est-ce que je fais après ce rapport",
  "colle ce rapport",
  "coller ce rapport",
  "prepare la review a partir de ce rapport",
  "prépare la review à partir de ce rapport",
  "execution report intake",
  "rapport d execution",
  "rapport d'exécution",
  "importer rapport",
  "importe le rapport",
  "rapport cursor",
  "rapport recu",
  "rapport reçu",
];

export function detectExecutionReportIntakeIntent(objective: string): ExecutionReportIntakeIntent {
  const norm = normalize(objective);
  const isExecutionReportIntake = INTAKE_KEYWORDS.some((k) => norm.includes(normalize(k)));
  return { isExecutionReportIntake, projectId: detectProjectId(norm) };
}

function resolveLogForIntake(intake: ExecutionReportIntake): ExecutionLog | undefined {
  if (intake.sourceExecutionLogId) {
    const byPlan = getExecutionLogByPlanId(intake.sourceExecutionPlanId ?? "");
    if (byPlan?.id === intake.sourceExecutionLogId) return byPlan;
  }
  if (intake.sourceExecutionPlanId) {
    const log = getExecutionLogByPlanId(intake.sourceExecutionPlanId);
    if (log) return log;
  }
  if (intake.sourceActionId) {
    const log = getExecutionLogByQueuedActionId(intake.sourceActionId);
    if (log) return log;
    const plan = getCachedExecutionPlan(intake.sourceActionId);
    if (plan) return getOrCreateExecutionLog(plan);
  }
  return undefined;
}

function applySingleProposedEntry(log: ExecutionLog, entry: ProposedLogEntry): ExecutionLog {
  switch (entry.type) {
    case "started":
      return markLogStarted(log);
    case "step_completed":
      return markStepCompleted(log, entry.id, entry.message);
    case "test_passed":
      return markTestPassed(log, entry.id, entry.message);
    case "test_failed":
      return markTestFailed(log, entry.id, entry.message, entry.sourceText);
    case "blocked":
      return markLogBlocked(log, entry.message);
    case "fix_needed":
      return markFixNeeded(log, entry.message);
    case "manual_commit":
      return markManualCommit(log, entry.message);
    case "completed_manually":
      return markLogCompletedManually(log, entry.message);
    case "abandoned":
      return markLogAbandoned(log, entry.message);
    case "note":
    default:
      return addLogNote(log, entry.message);
  }
}

export function createIntakeFromHandoff(
  handoff: ManualExecutionHandoff,
  reporter?: ExecutionReportIntakeReporter
): ExecutionReportIntake {
  const ctx: IntakeBuildContext = {
    title: `Intake · ${handoff.title.replace(/^Handoff · /, "")}`,
    source: "manual_execution_handoff",
    reporter: reporter ?? (handoff.target === "cursor" ? "cursor" : handoff.target === "human" ? "human" : handoff.target === "self" ? "self" : "generic"),
    sourceHandoffId: handoff.id,
    sourceWorkspaceId: handoff.sourceWorkspaceId,
    sourceActionId: handoff.sourceActionId,
    sourceExecutionPlanId: handoff.sourceExecutionPlanId,
    projectId: handoff.projectId,
    missionId: handoff.missionId,
  };
  const intake = createIntakeRecord(ctx);
  return upsertExecutionReportIntake(intake);
}

export function createIntakeFromWorkspace(
  workspace: SafeActionWorkspace,
  reporter?: ExecutionReportIntakeReporter
): ExecutionReportIntake {
  const ctx: IntakeBuildContext = {
    title: `Intake · ${workspace.title.replace(/^Workspace · /, "")}`,
    source: "safe_action_workspace",
    reporter,
    sourceWorkspaceId: workspace.id,
    sourceActionId: workspace.actionId,
    sourceExecutionPlanId: workspace.executionPlanId,
    sourceExecutionLogId: workspace.executionLogId,
    projectId: workspace.projectId,
    missionId: workspace.missionId,
  };
  return upsertExecutionReportIntake(createIntakeRecord(ctx));
}

export function createIntakeFromQueuedAction(
  action: QueuedAction,
  reporter?: ExecutionReportIntakeReporter
): ExecutionReportIntake {
  const plan = getCachedExecutionPlan(action.id);
  const ctx: IntakeBuildContext = {
    title: `Intake · ${action.preparedAction.title}`,
    source: plan ? "execution_plan" : "action_queue",
    reporter,
    sourceActionId: action.id,
    sourceExecutionPlanId: plan?.id,
    projectId: action.projectId,
  };
  return upsertExecutionReportIntake(createIntakeRecord(ctx));
}

export function parseIntakeRawReport(
  intakeId: string,
  rawReport: string
): ExecutionReportIntake | undefined {
  const intake = getExecutionReportIntakeById(intakeId);
  if (!intake) return undefined;
  const parsed = parseIntakeReport(intake, rawReport);
  return upsertExecutionReportIntake({ ...parsed, status: parsed.status });
}

export function applyProposedLogEntries(intakeId: string): {
  intake?: ExecutionReportIntake;
  log?: ExecutionLog;
  error?: string;
} {
  const intake = getExecutionReportIntakeById(intakeId);
  if (!intake) return { error: "Intake introuvable." };
  if (intake.proposedLogEntries.length === 0) {
    return { error: "Aucune entrée de log proposée." };
  }

  const log = resolveLogForIntake(intake);
  if (!log) {
    return {
      error: "Aucun journal V2.1 trouvé — crée d'abord un plan d'exécution et un suivi manuel.",
    };
  }

  let nextLog = log;
  for (const entry of [...intake.proposedLogEntries].reverse()) {
    nextLog = applySingleProposedEntry(nextLog, entry);
  }

  const timestamp = new Date().toISOString();
  const updated: ExecutionReportIntake = {
    ...intake,
    status: "applied_to_log",
    sourceExecutionLogId: nextLog.id,
    appliedAt: timestamp,
    updatedAt: timestamp,
    metadata: { ...intake.metadata, intakeId: intake.id, appliedFrom: "v2.10" },
  };
  return { intake: upsertExecutionReportIntake(updated), log: nextLog };
}

export function generateProposedReview(intakeId: string): {
  intake?: ExecutionReportIntake;
  review?: ExecutionReview;
  error?: string;
} {
  const intake = getExecutionReportIntakeById(intakeId);
  if (!intake) return { error: "Intake introuvable." };

  const log = resolveLogForIntake(intake);
  if (!log) return { error: "Aucun journal V2.1 lié — applique d'abord au log ou crée un suivi." };

  const plan = intake.sourceExecutionPlanId
    ? getCachedExecutionPlan(intake.sourceActionId ?? "")
    : undefined;
  const review = createReviewFromLog(log, plan ?? undefined);

  const timestamp = new Date().toISOString();
  const updated: ExecutionReportIntake = {
    ...intake,
    status: "review_generated",
    sourceExecutionReviewId: review.id,
    proposedReviewSummary: review.summary,
    updatedAt: timestamp,
  };
  return { intake: upsertExecutionReportIntake(updated), review };
}

export function markLinkedHandoffReportReceived(intakeId: string): ManualExecutionHandoff | undefined {
  const intake = getExecutionReportIntakeById(intakeId);
  if (!intake?.sourceHandoffId) return undefined;
  return markHandoffReportReceived(intake.sourceHandoffId);
}

export function addIntakeUserNote(intakeId: string, note: string): ExecutionReportIntake | undefined {
  const intake = getExecutionReportIntakeById(intakeId);
  const trimmed = note.trim();
  if (!intake || !trimmed) return undefined;
  const timestamp = new Date().toISOString();
  return upsertExecutionReportIntake({
    ...intake,
    userNotes: [...intake.userNotes, trimmed],
    updatedAt: timestamp,
  });
}

export function archiveIntake(intakeId: string): ExecutionReportIntake | undefined {
  return archiveExecutionReportIntake(intakeId);
}

export function getCopyableIntakeText(intakeId: string): string {
  const intake = getExecutionReportIntakeById(intakeId);
  if (!intake) return "";
  return formatExecutionReportIntakeForCopy(intake);
}

export function getCopyableParsedSummary(intakeId: string): string {
  const intake = getExecutionReportIntakeById(intakeId);
  if (!intake) return "";
  return formatParsedSummaryForCopy(intake);
}

export function getCopyableNormalizedReport(intakeId: string): string {
  const intake = getExecutionReportIntakeById(intakeId);
  if (!intake) return "";
  return formatNormalizedReportForCopy(intake);
}

export function generateGlobalIntakeSummary(): ExecutionReportIntakeGlobalSummary {
  const intakes = listExecutionReportIntakes();
  if (intakes.length === 0) return EXECUTION_REPORT_INTAKE_EMPTY_SUMMARY;

  const parsedCount = intakes.filter((i) =>
    ["parsed", "needs_review", "ready_to_apply", "applied_to_log", "review_generated"].includes(i.status)
  ).length;
  const appliedCount = intakes.filter((i) =>
    ["applied_to_log", "review_generated"].includes(i.status)
  ).length;
  const reviewGeneratedCount = intakes.filter((i) => i.status === "review_generated").length;

  return {
    totalIntakes: intakes.length,
    parsedCount,
    appliedCount,
    reviewGeneratedCount,
    summaryText: `${intakes.length} rapport(s) reçu(s) · ${parsedCount} parsé(s) · ${appliedCount} appliqué(s) au log · ${reviewGeneratedCount} review(s) générée(s).`,
  };
}

export {
  buildExecutionReportIntakeGuidanceHints,
  EXECUTION_REPORT_INTAKE_GUIDANCE,
  EXECUTION_REPORT_INTAKE_DISCLAIMER,
  getIntakesBySourceHandoffId,
  getIntakesBySourceActionId,
};
