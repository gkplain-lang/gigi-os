import type { ExecutionCapability, ExecutionRiskLevel } from "./types";
import {
  APPROVAL_REQUIRED_CAPABILITIES,
  BLOCKED_REAL_EXECUTION_CAPABILITIES,
  DRY_RUN_ALWAYS_CAPABILITIES,
} from "./executionReadinessPolicy";

const CAPABILITY_RISK_WEIGHT: Record<ExecutionCapability, number> = {
  documentation_only: 0,
  local_only: 1,
  file_read: 2,
  email_draft: 4,
  calendar_draft: 4,
  browser_action: 5,
  file_write: 6,
  git_operation: 7,
  shell_command: 8,
  github_operation: 8,
  n8n_workflow: 8,
  external_api: 9,
};

export function scoreCapabilities(capabilities: ExecutionCapability[]): number {
  if (capabilities.length === 0) return 0;
  return Math.max(...capabilities.map((c) => CAPABILITY_RISK_WEIGHT[c] ?? 5));
}

export function assessRiskLevel(capabilities: ExecutionCapability[]): ExecutionRiskLevel {
  const score = scoreCapabilities(capabilities);
  const hasBlocked = capabilities.some((c) =>
    BLOCKED_REAL_EXECUTION_CAPABILITIES.includes(c)
  );
  const onlySafe = capabilities.every((c) => DRY_RUN_ALWAYS_CAPABILITIES.includes(c));

  if (onlySafe && !hasBlocked) return "low";
  if (score <= 2) return "low";
  if (score <= 4) return "medium";
  if (score <= 6) return "high";
  if (score <= 8) return "critical";
  return "blocked";
}

export function riskRationale(
  capabilities: ExecutionCapability[],
  level: ExecutionRiskLevel
): string[] {
  const notes: string[] = [];
  if (capabilities.some((c) => c === "shell_command")) {
    notes.push("Commande shell — toujours bloquée en exécution réelle en V4.0.");
  }
  if (capabilities.some((c) => c === "github_operation")) {
    notes.push("GitHub — préparable en simulation, aucun appel API réel.");
  }
  if (capabilities.some((c) => c === "n8n_workflow")) {
    notes.push("n8n — préparable en simulation, aucun workflow réel déclenché.");
  }
  if (capabilities.some((c) => APPROVAL_REQUIRED_CAPABILITIES.includes(c))) {
    notes.push("Au moins une capacité sensible — validation humaine obligatoire.");
  }
  switch (level) {
    case "low":
      notes.push("Risque faible : documentation ou préparation locale uniquement.");
      break;
    case "medium":
      notes.push("Risque modéré : périmètre à confirmer avant toute future exécution.");
      break;
    case "high":
      notes.push("Risque élevé : rollback et preuves requis avant toute évolution V4.1+.");
      break;
    case "critical":
      notes.push("Risque critique : simulation seulement — exécution réelle interdite en V4.0.");
      break;
    case "blocked":
      notes.push("Bloqué en V4.0 — capacité non exécutable même avec approbation.");
      break;
  }
  return notes;
}
