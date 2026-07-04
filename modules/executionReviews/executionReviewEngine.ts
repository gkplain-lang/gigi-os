import type { ExecutionLog, ExecutionLogEntry } from "@/modules/executionLogs/types";
import type { ExecutionPlan } from "@/modules/executionPlans/types";
import type {
  ExecutionReview,
  ExecutionReviewDecision,
  ExecutionReviewFinding,
  ExecutionReviewRecommendedAction,
  ExecutionReviewValidationItem,
} from "./types";

function nowIso(): string {
  return new Date().toISOString();
}

function findingId(n: number): string {
  return `exrev-find-${n}`;
}

function hasEntryType(log: ExecutionLog, type: ExecutionLogEntry["type"]): boolean {
  return log.entries.some((e) => e.type === type);
}

function countEntryType(log: ExecutionLog, type: ExecutionLogEntry["type"]): number {
  return log.entries.filter((e) => e.type === type).length;
}

function lastEntryOfType(
  log: ExecutionLog,
  type: ExecutionLogEntry["type"]
): ExecutionLogEntry | undefined {
  return log.entries.find((e) => e.type === type);
}

function buildFindings(log: ExecutionLog): ExecutionReviewFinding[] {
  const findings: ExecutionReviewFinding[] = [];
  let i = 1;

  for (const entry of log.entries) {
    switch (entry.type) {
      case "test_failed":
        findings.push({
          id: findingId(i++),
          type: "failed_test",
          severity: "critical",
          title: entry.title,
          description: entry.description ?? "Test échoué déclaré manuellement.",
          relatedEntryId: entry.id,
        });
        break;
      case "blocked":
        findings.push({
          id: findingId(i++),
          type: "blocker",
          severity: "warning",
          title: entry.title,
          description: entry.description ?? "Blocage signalé par l'utilisateur.",
          relatedEntryId: entry.id,
        });
        break;
      case "fix_needed":
        findings.push({
          id: findingId(i++),
          type: "fix_required",
          severity: "warning",
          title: entry.title,
          description: entry.description ?? "Correction nécessaire déclarée.",
          relatedEntryId: entry.id,
        });
        break;
      case "manual_commit":
        findings.push({
          id: findingId(i++),
          type: "manual_commit",
          severity: "success",
          title: entry.title,
          description: entry.description ?? "Commit manuel déclaré.",
          relatedEntryId: entry.id,
        });
        break;
      case "completed_manually":
        findings.push({
          id: findingId(i++),
          type: "completion_signal",
          severity: "success",
          title: entry.title,
          description: entry.description ?? "Terminé manuellement déclaré.",
          relatedEntryId: entry.id,
        });
        break;
      case "abandoned":
        findings.push({
          id: findingId(i++),
          type: "abandonment_signal",
          severity: "info",
          title: entry.title,
          description: entry.description ?? "Abandon déclaré.",
          relatedEntryId: entry.id,
        });
        break;
      case "note":
        findings.push({
          id: findingId(i++),
          type: "note",
          severity: "info",
          title: entry.title,
          description: entry.description ?? "Note utilisateur.",
          relatedEntryId: entry.id,
        });
        break;
      default:
        break;
    }
  }

  if (
    (log.status === "completed_manually" || hasEntryType(log, "completed_manually")) &&
    !log.finalReport?.trim()
  ) {
    findings.push({
      id: findingId(i++),
      type: "missing_report",
      severity: "warning",
      title: "Rapport final manquant",
      description: "L'action est marquée terminée sans rapport final détaillé.",
    });
  }

  if (
    log.status === "started" &&
    log.entries.length > 0 &&
    !hasEntryType(log, "completed_manually") &&
    !hasEntryType(log, "abandoned")
  ) {
    findings.push({
      id: findingId(i++),
      type: "unclear_status",
      severity: "warning",
      title: "Exécution sans conclusion",
      description: "Le journal indique un démarrage mais pas de clôture claire.",
    });
  }

  if (log.status === "not_started" || log.entries.length === 0) {
    findings.push({
      id: findingId(i++),
      type: "unclear_status",
      severity: "info",
      title: "Journal vide ou non démarré",
      description: "Aucune entrée suffisante pour conclure.",
    });
  }

  return findings;
}

function resolveDecision(log: ExecutionLog, findings: ExecutionReviewFinding[]): ExecutionReviewDecision {
  const testsFailed = countEntryType(log, "test_failed");
  const hasBlocker = hasEntryType(log, "blocked") || log.status === "blocked";
  const hasFix = hasEntryType(log, "fix_needed") || log.status === "needs_fix";
  const isAbandoned = log.status === "abandoned" || hasEntryType(log, "abandoned");
  const isCompleted =
    log.status === "completed_manually" || hasEntryType(log, "completed_manually");

  if (isAbandoned) return "abandoned_confirmed";

  if (log.status === "not_started" || log.entries.length === 0) return "unclear";

  if (testsFailed > 0 || hasFix) return "needs_fix";

  if (hasBlocker && !isCompleted) {
    return findings.some((f) => f.type === "note" && f.description?.includes("résolu"))
      ? "unclear"
      : "needs_fix";
  }

  if (isCompleted) {
    const completionEntry = lastEntryOfType(log, "completed_manually");
    const blockerEntry = lastEntryOfType(log, "blocked");
    const blockerAfterComplete =
      blockerEntry &&
      completionEntry &&
      blockerEntry.createdAt > completionEntry.createdAt;

    if (blockerAfterComplete || (testsFailed > 0 && isCompleted)) {
      return "needs_retry";
    }

    if (!log.finalReport?.trim() && findings.some((f) => f.type === "missing_report")) {
      return "unclear";
    }

    const stepsInPlan = countEntryType(log, "step_completed");
    if (stepsInPlan >= 3 && hasEntryType(log, "manual_commit")) {
      return "completed_confirmed";
    }

    if (isCompleted && !hasBlocker && testsFailed === 0) {
      return "completed_confirmed";
    }

    return "unclear";
  }

  if (log.status === "started") return "unclear";

  return "unclear";
}

function computeConfidence(log: ExecutionLog, decision: ExecutionReviewDecision): number {
  let score = 50;
  score += countEntryType(log, "test_passed") * 8;
  score -= countEntryType(log, "test_failed") * 15;
  score -= countEntryType(log, "blocked") * 10;
  score -= countEntryType(log, "fix_needed") * 10;
  score += countEntryType(log, "step_completed") * 3;

  if (log.finalReport?.trim()) score += 12;
  if (log.status === "completed_manually") score += 15;
  if (log.status === "abandoned") score += 10;
  if (log.entries.length === 0) score -= 25;

  if (decision === "completed_confirmed") score += 10;
  if (decision === "unclear") score -= 15;
  if (decision === "needs_fix" || decision === "needs_retry") score -= 5;

  return Math.max(25, Math.min(95, Math.round(score)));
}

function buildSummary(log: ExecutionLog, decision: ExecutionReviewDecision): string {
  const testsFailed = countEntryType(log, "test_failed");
  const testsPassed = countEntryType(log, "test_passed");
  const hasBlocker = hasEntryType(log, "blocked");

  switch (decision) {
    case "completed_confirmed":
      return `L'action semble terminée selon tes déclarations manuelles${testsPassed > 0 ? ` (${testsPassed} test(s) OK)` : ""}. Aucun blocage actif détecté dans le journal.`;
    case "needs_fix":
      return `L'action semble partiellement exécutée, mais ${testsFailed > 0 ? "un test a échoué" : "une correction est nécessaire"} ou un blocage reste présent.`;
    case "needs_retry":
      return "L'action a été marquée terminée, mais des signaux de blocage ou d'échec subsistent — une nouvelle tentative manuelle est recommandée.";
    case "needs_new_action":
      return "La tâche principale semble avancée — une action de suivi pourrait être utile pour la suite.";
    case "abandoned_confirmed":
      return "L'action a été abandonnée selon le journal manuel.";
    case "unclear":
    default:
      if (log.entries.length === 0) {
        return "Pas assez d'entrées dans le journal pour conclure — commence le suivi manuel dans /actions.";
      }
      if (hasBlocker) {
        return "Le journal contient un blocage sans résolution claire — complète les notes ou corrige avant de conclure.";
      }
      return "Le statut reste incertain — ajoute des notes, des tests OK/KO ou un rapport final pour clarifier.";
  }
}

function buildValidationChecklist(
  decision: ExecutionReviewDecision,
  findings: ExecutionReviewFinding[]
): ExecutionReviewValidationItem[] {
  const items: ExecutionReviewValidationItem[] = [];
  let i = 1;

  if (decision === "needs_fix" || decision === "needs_retry") {
    if (findings.some((f) => f.type === "failed_test")) {
      items.push({ id: `val-${i++}`, label: "Corriger la cause du test échoué", required: true });
      items.push({ id: `val-${i++}`, label: "Relancer le build manuellement", required: true });
    }
    if (findings.some((f) => f.type === "blocker")) {
      items.push({ id: `val-${i++}`, label: "Lever le blocage signalé", required: true });
    }
    if (findings.some((f) => f.type === "fix_required")) {
      items.push({ id: `val-${i++}`, label: "Appliquer la correction nécessaire", required: true });
    }
    items.push({ id: `val-${i++}`, label: "Ajouter une note de résultat dans le journal", required: true });
    items.push({ id: `val-${i++}`, label: "Régénérer la review", required: false });
  }

  if (decision === "completed_confirmed") {
    items.push({ id: `val-${i++}`, label: "Relire le rapport final", required: true });
    items.push({ id: `val-${i++}`, label: "Confirmer que tous les tests requis sont OK", required: true });
    items.push({ id: `val-${i++}`, label: "Archiver ou passer à la mission suivante", required: false });
  }

  if (decision === "unclear") {
    items.push({ id: `val-${i++}`, label: "Compléter le journal (notes, tests, rapport)", required: true });
    items.push({ id: `val-${i++}`, label: "Régénérer la review après mise à jour", required: true });
  }

  if (findings.some((f) => f.type === "missing_report")) {
    items.push({ id: `val-${i++}`, label: "Ajouter un rapport final dans le journal", required: true });
  }

  if (decision === "abandoned_confirmed") {
    items.push({ id: `val-${i++}`, label: "Documenter la raison de l'abandon", required: false });
    items.push({ id: `val-${i++}`, label: "Créer une nouvelle action si tu reprends plus tard", required: false });
  }

  if (items.length === 0) {
    items.push({ id: `val-${i++}`, label: "Revoir le journal manuellement", required: true });
  }

  return items;
}

function buildRecommendedActions(decision: ExecutionReviewDecision): ExecutionReviewRecommendedAction[] {
  const actions: ExecutionReviewRecommendedAction[] = [];
  let i = 1;

  switch (decision) {
    case "completed_confirmed":
      actions.push({
        id: `rec-${i++}`,
        type: "validate_done",
        label: "Valider la clôture",
        description: "Considère l'action comme terminée côté suivi manuel.",
        nextStepHint: "Passe à la mission suivante ou archive la carte dans /actions.",
      });
      actions.push({
        id: `rec-${i++}`,
        type: "create_followup_action",
        label: "Créer une action de suivi (V2.3)",
        description: "Si une suite logique existe, prépare une nouvelle action plus tard.",
        nextStepHint: "Disponible en V2.3 — Follow-up Action Generator.",
      });
      break;
    case "needs_fix":
      actions.push({
        id: `rec-${i++}`,
        type: "create_fix_action",
        label: "Créer une action corrective",
        description: "Prépare une action ciblée sur la correction (V2.3).",
        nextStepHint: "Pour l'instant, note la correction dans le journal.",
      });
      actions.push({
        id: `rec-${i++}`,
        type: "retry_execution",
        label: "Relancer l'exécution après correction",
        description: "Reprends le plan d'exécution une fois le fix appliqué.",
      });
      break;
    case "needs_retry":
      actions.push({
        id: `rec-${i++}`,
        type: "retry_execution",
        label: "Relancer une tentative manuelle",
        description: "Recommence les étapes non validées du plan.",
      });
      actions.push({
        id: `rec-${i++}`,
        type: "add_missing_report",
        label: "Documenter ce qui a échoué",
        description: "Ajoute une note détaillée avant de réessayer.",
      });
      break;
    case "needs_new_action":
      actions.push({
        id: `rec-${i++}`,
        type: "create_followup_action",
        label: "Créer une action de finalisation",
        description: "Une suite logique semble nécessaire.",
        nextStepHint: "V2.3 générera des actions de suivi automatiquement.",
      });
      break;
    case "abandoned_confirmed":
      actions.push({
        id: `rec-${i++}`,
        type: "abandon_action",
        label: "Confirmer l'abandon",
        description: "L'action reste validée en queue — pas de suppression auto.",
      });
      actions.push({
        id: `rec-${i++}`,
        type: "review_manually",
        label: "Revoir manuellement",
        description: "Décide si tu reprends plus tard avec une nouvelle action.",
      });
      break;
    case "unclear":
    default:
      actions.push({
        id: `rec-${i++}`,
        type: "review_manually",
        label: "Revoir le journal dans /actions",
        description: "Complète le suivi manuel avant de conclure.",
      });
      actions.push({
        id: `rec-${i++}`,
        type: "add_missing_report",
        label: "Ajouter un rapport ou des notes",
        description: "Clarifie ce qui a été fait ou ce qui bloque.",
      });
      break;
  }

  return actions;
}

function maybeNeedsNewAction(log: ExecutionLog, decision: ExecutionReviewDecision): ExecutionReviewDecision {
  if (decision !== "completed_confirmed") return decision;

  const hasCommit = hasEntryType(log, "manual_commit");
  const hasNotes = hasEntryType(log, "note");
  const incompleteSteps =
    countEntryType(log, "step_completed") > 0 &&
    countEntryType(log, "step_completed") < 3 &&
    hasNotes;

  if (hasCommit && incompleteSteps) return "needs_new_action";
  return decision;
}

export function analyzeExecutionLog(
  log: ExecutionLog,
  plan?: ExecutionPlan
): Omit<ExecutionReview, "id" | "createdAt" | "updatedAt"> {
  const findings = buildFindings(log);
  let decision = resolveDecision(log, findings);
  decision = maybeNeedsNewAction(log, decision);

  return {
    executionLogId: log.id,
    executionPlanId: log.executionPlanId ?? plan?.id,
    actionId: log.queuedActionId,
    decision,
    confidence: computeConfidence(log, decision),
    summary: buildSummary(log, decision),
    findings,
    validationChecklist: buildValidationChecklist(decision, findings),
    recommendedNextActions: buildRecommendedActions(decision),
    sourceLogStatus: log.status,
    sourceLogEntryCount: log.entries.length,
    metadata: {
      projectId: log.projectId,
      projectName: log.projectName,
    },
  };
}

export function buildExecutionReviewFromLog(
  log: ExecutionLog,
  plan?: ExecutionPlan,
  existingId?: string
): ExecutionReview {
  const analyzed = analyzeExecutionLog(log, plan);
  const timestamp = nowIso();
  return {
    id: existingId ?? `exreview-${log.id}-${Date.now()}`,
    ...analyzed,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}
