import type { ExecutionReadinessGlobalSummary } from "./types";
import { EXECUTION_READINESS_V4_TAGLINE } from "./types";
import {
  listActiveExecutionReadinessRequests,
  listExecutionReadinessRequests,
} from "./executionReadinessStore";
import { EXECUTION_PERMISSION_STATUS_LABELS, EXECUTION_RISK_LABELS } from "./executionReadinessFormatter";

export const EXECUTION_READINESS_EMPTY_SUMMARY =
  "Aucune demande d'exécution contrôlée — V4.0 prépare les permissions futures sans rien lancer.";

export const EXECUTION_READINESS_GUIDANCE = [
  "V4.0 ne lance rien : dry-run et préparation de permissions uniquement.",
  "Chaque demande a un risque, un périmètre et un plan de rollback.",
  "« Approuver dry-run » n'exécute pas — cela autorise la simulation locale.",
  "Ouvre /actions pour créer ou gérer une demande depuis l'action dominante.",
];

export function buildExecutionReadinessGuidanceHints(objective: string): string[] {
  const norm = objective.toLowerCase();
  const hints = [...EXECUTION_READINESS_GUIDANCE];
  if (/risque|dangereux|danger/.test(norm)) {
    hints.push("Consulte le badge risque et les notes de sécurité sur chaque demande.");
  }
  if (/fais|execute|exécute|autorise/.test(norm)) {
    hints.push("En V4.0 je ne peux pas agir seul — je prépare une demande que tu valides.");
  }
  if (/droit|permission|scope|périmètre/.test(norm)) {
    hints.push("Le périmètre autorisé vs interdit est listé dans chaque scope de la demande.");
  }
  return hints;
}

export function generateGlobalExecutionReadinessSummary(): ExecutionReadinessGlobalSummary {
  const all = listExecutionReadinessRequests();
  const active = listActiveExecutionReadinessRequests();
  const awaitingApproval = active.filter(
    (r) =>
      r.permissionStatus === "awaiting_user_approval" ||
      r.permissionStatus === "needs_review"
  ).length;
  const approvedDryRun = active.filter(
    (r) => r.permissionStatus === "approved_for_dry_run"
  ).length;
  const blockedCount = active.filter(
    (r) => r.permissionStatus === "blocked" || r.riskLevel === "blocked"
  ).length;
  const expiredCount = all.filter((r) => r.permissionStatus === "expired").length;
  const revokedCount = all.filter(
    (r) => r.permissionStatus === "revoked" || Boolean(r.revokedAt)
  ).length;

  let summaryText = EXECUTION_READINESS_EMPTY_SUMMARY;
  if (all.length > 0) {
    const latest = all[0];
    summaryText = `${all.length} demande(s) locale(s) · dernière : « ${latest.title.replace(/^Readiness · /, "")} » — ${EXECUTION_PERMISSION_STATUS_LABELS[latest.permissionStatus]} · risque ${EXECUTION_RISK_LABELS[latest.riskLevel]}. ${EXECUTION_READINESS_V4_TAGLINE}`;
  }

  return {
    totalRequests: all.length,
    activeRequests: active.length,
    awaitingApproval,
    approvedDryRun,
    blockedCount,
    expiredCount,
    revokedCount,
    summaryText,
  };
}
