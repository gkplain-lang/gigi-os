import type { ExecutionLog } from "@/modules/executionLogs/types";
import { loadExecutionLogsState } from "@/modules/executionLogs/executionLogStore";
import type { ExecutionPlan } from "@/modules/executionPlans/types";
import { buildExecutionReviewFromLog } from "./executionReviewEngine";
import { formatExecutionReviewForCopy } from "./executionReviewFormatter";
import {
  getExecutionReviewByLogId,
  listExecutionReviews,
  upsertExecutionReview,
} from "./executionReviewStore";
import type { ExecutionReview, ExecutionReviewIntent } from "./types";
import { EXECUTION_REVIEW_DISCLAIMER } from "./types";

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

const EXECUTION_REVIEW_KEYWORDS = [
  "analyse le rapport",
  "analyser le rapport",
  "est ce que c est vraiment termine",
  "est-ce que c'est vraiment terminé",
  "vraiment terminé",
  "review l execution",
  "review l'exécution",
  "review execution",
  "verifie le log",
  "vérifie le log",
  "resume l execution",
  "résume l'exécution",
  "resumer l execution",
  "execution review",
  "review du journal",
  "analyse le journal",
  "analyse le log",
  "qu est ce que je fais maintenant avec cette action",
];

export function detectExecutionReviewIntent(objective: string): ExecutionReviewIntent {
  const norm = normalize(objective);
  const isExecutionReview = EXECUTION_REVIEW_KEYWORDS.some((k) =>
    norm.includes(normalize(k))
  );
  return { isExecutionReview, projectId: detectProjectId(norm) };
}

export function createReviewFromLog(log: ExecutionLog, plan?: ExecutionPlan): ExecutionReview {
  const existing = getExecutionReviewByLogId(log.id);
  const review = buildExecutionReviewFromLog(log, plan, existing?.id);
  return upsertExecutionReview({
    ...review,
    createdAt: existing?.createdAt ?? review.createdAt,
    updatedAt: new Date().toISOString(),
  });
}

export function regenerateReview(log: ExecutionLog, plan?: ExecutionPlan): ExecutionReview {
  return createReviewFromLog(log, plan);
}

export function getLatestReviewForLog(executionLogId: string): ExecutionReview | undefined {
  return getExecutionReviewByLogId(executionLogId);
}

export function getCopyableReviewText(review: ExecutionReview): string {
  return formatExecutionReviewForCopy(review);
}

export function findBestLogForReview(projectId?: string | null): ExecutionLog | undefined {
  const logs = loadExecutionLogsState().logs.filter((l) => l.entries.length > 0);
  if (projectId) {
    const match = logs.find((l) => l.projectId === projectId);
    if (match) return match;
  }
  return logs.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0];
}

export function buildReviewGuidanceHints(objective: string): string[] {
  const norm = objective.toLowerCase();
  const hints = [
    "Ouvre /actions et affiche le plan d'exécution de l'action validée.",
    "Descends jusqu'à la section « Review d'exécution » sous le suivi manuel.",
    "Clique « Générer la review » ou « Régénérer » si le journal a changé.",
  ];

  if (/termine|terminé/.test(norm)) {
    hints.push("Si tu as marqué « Terminé manuellement », la review confirmera ou signalera des lacunes.");
  }
  if (/bloque|bloqué|echoue|échoué/.test(norm)) {
    hints.push("Les blocages et tests échoués orientent la décision vers needs_fix ou needs_retry.");
  }
  if (/rapport|resume|résume/.test(norm)) {
    hints.push("Copie la review au format texte pour ton rapport ou tes notes.");
  }

  return hints;
}

export { EXECUTION_REVIEW_DISCLAIMER, listExecutionReviews };
