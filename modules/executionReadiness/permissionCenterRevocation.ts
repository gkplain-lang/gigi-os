import { applyExecutionReadinessDecision } from "./executionReadinessService";
import type { ExecutionReadinessRequest } from "./types";

const DEFAULT_REVOKE_REASON =
  "Révocation locale par l'utilisateur — simulation close, aucune exécution réelle.";

export function revokeLocalPermission(
  requestId: string,
  reason: string = DEFAULT_REVOKE_REASON
): ExecutionReadinessRequest | undefined {
  return applyExecutionReadinessDecision(requestId, "revoke", reason);
}
