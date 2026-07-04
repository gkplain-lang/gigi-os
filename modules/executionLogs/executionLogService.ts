import type { ExecutionPlan } from "@/modules/executionPlans/types";
import {
  EXECUTION_LOG_EMPTY_SUMMARY,
  EXECUTION_LOG_GUIDANCE_MESSAGE,
} from "./executionLogSummary";
import {
  getExecutionLogByPlanId,
  getExecutionLogByQueuedActionId,
  upsertExecutionLog,
} from "./executionLogStore";
import type {
  ExecutionLog,
  ExecutionLogEntry,
  ExecutionLogEntryType,
  ExecutionLogIntent,
  ExecutionLogStatus,
  ExecutionLogSummary,
} from "./types";
import { EXECUTION_LOG_STATUS_LABELS } from "./types";

function nowIso(): string {
  return new Date().toISOString();
}

function entryId(): string {
  return `exentry-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

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

const EXECUTION_LOG_KEYWORDS = [
  "j ai termine",
  "j'ai terminé",
  "action terminee",
  "action terminée",
  "build est ok",
  "build ok",
  "le build est ok",
  "ca a echoue",
  "ça a échoué",
  "ca a fail",
  "je suis bloque",
  "je suis bloqué",
  "bloque sur",
  "bloqué sur",
  "note que cette action",
  "action est faite",
  "cursor a fait",
  "test echoue",
  "test échoué",
  "test ok",
  "ui verifiee",
  "ui vérifiée",
  "commit fait",
  "execution terminee",
  "exécution terminée",
  "journal d execution",
  "journal d'exécution",
  "noter l execution",
  "noter l'exécution",
];

export function detectExecutionLogIntent(objective: string): ExecutionLogIntent {
  const norm = normalize(objective);
  const isExecutionLog = EXECUTION_LOG_KEYWORDS.some((k) => norm.includes(normalize(k)));
  return { isExecutionLog, projectId: detectProjectId(norm) };
}

export function createExecutionLogForPlan(plan: ExecutionPlan): ExecutionLog {
  const timestamp = nowIso();
  return {
    id: `exlog-${plan.id}`,
    executionPlanId: plan.id,
    queuedActionId: plan.queuedActionId,
    projectId: plan.projectId,
    projectName: plan.projectName,
    status: "not_started",
    entries: [],
    updatedAt: timestamp,
  };
}

export function getOrCreateExecutionLog(plan: ExecutionPlan): ExecutionLog {
  const existing =
    getExecutionLogByPlanId(plan.id) ?? getExecutionLogByQueuedActionId(plan.queuedActionId);
  if (existing) return existing;
  const log = createExecutionLogForPlan(plan);
  return upsertExecutionLog(log);
}

function statusForEntryType(type: ExecutionLogEntryType): ExecutionLogStatus | null {
  switch (type) {
    case "started":
      return "started";
    case "blocked":
      return "blocked";
    case "fix_needed":
      return "needs_fix";
    case "completed_manually":
      return "completed_manually";
    case "abandoned":
      return "abandoned";
    default:
      return null;
  }
}

function appendEntry(
  log: ExecutionLog,
  type: ExecutionLogEntryType,
  title: string,
  options?: {
    description?: string;
    relatedStepId?: string;
    relatedTestId?: string;
    finalReport?: string;
  }
): ExecutionLog {
  const timestamp = nowIso();
  const entry: ExecutionLogEntry = {
    id: entryId(),
    type,
    title,
    description: options?.description,
    relatedStepId: options?.relatedStepId,
    relatedTestId: options?.relatedTestId,
    createdAt: timestamp,
  };

  const nextStatus = statusForEntryType(type);
  const next: ExecutionLog = {
    ...log,
    entries: [entry, ...log.entries],
    updatedAt: timestamp,
    status: nextStatus ?? (log.status === "not_started" && type !== "note" ? "started" : log.status),
    startedAt: log.startedAt ?? (type === "started" ? timestamp : undefined),
    completedAt:
      type === "completed_manually" || type === "abandoned"
        ? timestamp
        : log.completedAt,
    finalReport: options?.finalReport ?? log.finalReport,
  };

  if (type === "started" && next.status === "not_started") {
    next.status = "started";
    next.startedAt = timestamp;
  }

  return upsertExecutionLog(next);
}

export function markLogStarted(log: ExecutionLog): ExecutionLog {
  return appendEntry(log, "started", "Exécution commencée", {
    description: "Démarrage manuel déclaré par l'utilisateur.",
  });
}

export function addLogNote(log: ExecutionLog, text: string): ExecutionLog {
  const trimmed = text.trim();
  if (!trimmed) return log;
  return appendEntry(log, "note", "Note", { description: trimmed });
}

export function markStepCompleted(
  log: ExecutionLog,
  stepId: string,
  stepTitle: string
): ExecutionLog {
  return appendEntry(log, "step_completed", `Étape faite : ${stepTitle}`, {
    relatedStepId: stepId,
  });
}

export function markTestPassed(
  log: ExecutionLog,
  testId: string,
  testLabel: string
): ExecutionLog {
  return appendEntry(log, "test_passed", `Test OK : ${testLabel}`, {
    relatedTestId: testId,
  });
}

export function markTestFailed(
  log: ExecutionLog,
  testId: string,
  testLabel: string,
  reason?: string
): ExecutionLog {
  return appendEntry(log, "test_failed", `Test échoué : ${testLabel}`, {
    relatedTestId: testId,
    description: reason,
  });
}

export function markLogBlocked(log: ExecutionLog, reason?: string): ExecutionLog {
  return appendEntry(log, "blocked", "Blocage signalé", { description: reason });
}

export function markFixNeeded(log: ExecutionLog, reason?: string): ExecutionLog {
  return appendEntry(log, "fix_needed", "Correction nécessaire", { description: reason });
}

export function markManualCommit(log: ExecutionLog, message?: string): ExecutionLog {
  return appendEntry(log, "manual_commit", "Commit fait manuellement", {
    description: message,
  });
}

export function markLogCompletedManually(
  log: ExecutionLog,
  finalReport?: string
): ExecutionLog {
  return appendEntry(log, "completed_manually", "Action terminée manuellement", {
    description: finalReport,
    finalReport: finalReport?.trim() || log.finalReport,
  });
}

export function markLogAbandoned(log: ExecutionLog, reason?: string): ExecutionLog {
  return appendEntry(log, "abandoned", "Action abandonnée", { description: reason });
}

export function summarizeExecutionLog(
  log: ExecutionLog,
  plan?: ExecutionPlan
): ExecutionLogSummary {
  const testsPassed = log.entries.filter((e) => e.type === "test_passed").length;
  const testsFailed = log.entries.filter((e) => e.type === "test_failed").length;
  const blockers = log.entries
    .filter((e) => e.type === "blocked" || e.type === "fix_needed")
    .map((e) => e.description ?? e.title);

  const lastEntry = log.entries[0];
  const completedStepIds = new Set(
    log.entries.filter((e) => e.type === "step_completed").map((e) => e.relatedStepId)
  );
  const passedTestIds = new Set(
    log.entries.filter((e) => e.type === "test_passed").map((e) => e.relatedTestId)
  );

  let recommendedNextStep = "Marque l'action comme commencée dans /actions.";

  if (log.status === "completed_manually") {
    recommendedNextStep = "Action terminée — tu peux archiver ou passer à la suivante.";
  } else if (log.status === "abandoned") {
    recommendedNextStep = "Action abandonnée — reprends ou crée une nouvelle action si besoin.";
  } else if (log.status === "blocked" || log.status === "needs_fix") {
    recommendedNextStep = "Résous le blocage, puis ajoute une note ou marque l'étape suivante.";
  } else if (log.status === "not_started") {
    recommendedNextStep = "Marque comme commencé quand tu démarres l'exécution manuelle.";
  } else if (plan) {
    const nextStep = plan.steps.find((s) => !completedStepIds.has(s.id));
    const nextTest = plan.tests.find((t) => !passedTestIds.has(t.id));

    if (nextStep) {
      recommendedNextStep = `Prochaine étape : ${nextStep.title}`;
    } else if (nextTest && testsFailed === 0) {
      recommendedNextStep = `Prochaine vérification : ${nextTest.label} — marque test OK ou échoué.`;
    } else if (testsFailed > 0) {
      recommendedNextStep = "Corrige les tests échoués, puis marque test OK ou terminé manuellement.";
    } else {
      recommendedNextStep = "Relis la checklist, puis marque terminé manuellement avec un rapport.";
    }
  } else if (log.status === "started") {
    recommendedNextStep = "Continue le suivi — note, test OK/KO, ou marque terminé manuellement.";
  }

  let summaryText = EXECUTION_LOG_EMPTY_SUMMARY;

  if (log.status !== "not_started" || log.entries.length > 0) {
    const parts: string[] = [];
    parts.push(EXECUTION_LOG_STATUS_LABELS[log.status]);
    if (testsPassed > 0) parts.push(`${testsPassed} test(s) OK`);
    if (testsFailed > 0) parts.push(`${testsFailed} test(s) échoué(s)`);
    if (blockers.length > 0) parts.push(`${blockers.length} blocage(s)`);
    parts.push(recommendedNextStep);
    summaryText = parts.join(", ") + ".";
  }

  return {
    status: log.status,
    statusLabel: EXECUTION_LOG_STATUS_LABELS[log.status],
    lastEntryTitle: lastEntry?.title,
    testsPassed,
    testsFailed,
    blockers,
    recommendedNextStep,
    summaryText,
  };
}

export { EXECUTION_LOG_GUIDANCE_MESSAGE };
