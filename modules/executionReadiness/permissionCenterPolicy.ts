import { isRealExecutionBlocked } from "./executionReadinessPolicy";

/** Règles V4.1 — renforce V4.0 sans activer l'exécution réelle */
export const PERMISSION_CENTER_V41_RULES = [
  "L'exécution réelle reste bloquée en V4.1.",
  "Dry-run et simulation uniquement — validation humaine obligatoire.",
  "État local uniquement — aucune sync cloud.",
  "Capacités sensibles (shell, Git, GitHub, n8n, API, etc.) restent bloquées.",
  "Aucune permission permanente — expiration locale après approbation dry-run.",
  "Aucune exécution en arrière-plan.",
] as const;

export function permissionCenterPolicyNotes(): string[] {
  return [...PERMISSION_CENTER_V41_RULES];
}

export function isCapabilityBlockedInV41(
  capability: import("./types").ExecutionCapability
): boolean {
  return isRealExecutionBlocked(capability);
}

export function isSensitiveCapability(
  capability: import("./types").ExecutionCapability
): boolean {
  return !["documentation_only", "local_only"].includes(capability);
}
