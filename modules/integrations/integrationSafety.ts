import type { GitHubForbiddenActionType } from "./github/types";
import { isGitHubForbiddenAction } from "./github/githubActions";

export const V08_NO_API_MESSAGE =
  "V0.8 — aucune API externe appelée. GitHub en dry-run uniquement, désactivé par défaut.";

export const V08_BLOCKED_REAL_MESSAGE =
  "Je peux préparer le plan GitHub, mais je ne peux pas l'exécuter automatiquement en V0.8.";

export function blockedReasonForGitHubForbidden(action: GitHubForbiddenActionType): string {
  return `Action GitHub réelle « ${action} » interdite en V0.8. ${V08_BLOCKED_REAL_MESSAGE}`;
}

export function assertIntegrationDryRunOnly(dryRunOnly: boolean): void {
  if (!dryRunOnly) {
    throw new Error("V0.8: real integration execution not allowed");
  }
}

export function rejectsRealIntegrationExecution(): true {
  return true;
}

export function isRealGitHubAction(action: string): action is GitHubForbiddenActionType {
  return isGitHubForbiddenAction(action);
}
