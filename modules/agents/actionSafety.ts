import { ACTIVE_MAX_AUTONOMY_LEVEL, isAutonomyLevelAllowed, type AutonomyLevel } from "./autonomyLevels";
import { isDryRunAction, isForbiddenRealAction } from "./actionRegistry";
import type { AgentActionType } from "./types";

export const V06_BLOCKED_MESSAGE =
  "Je peux préparer le plan, mais je ne peux pas l'exécuter automatiquement en V0.6.";

export function isRealExecutionForbidden(actionType: AgentActionType): boolean {
  return isForbiddenRealAction(actionType);
}

export function canPrepareAction(
  actionType: AgentActionType,
  activeLevel: AutonomyLevel = ACTIVE_MAX_AUTONOMY_LEVEL
): boolean {
  if (isForbiddenRealAction(actionType)) {
    return false;
  }
  if (!isDryRunAction(actionType)) {
    return false;
  }
  return isAutonomyLevelAllowed("level_1_prepare_only", activeLevel);
}

export function blockedReasonForForbidden(actionType: AgentActionType): string {
  return `Action réelle « ${actionType} » interdite en V0.6. ${V06_BLOCKED_MESSAGE}`;
}

export function assertNoExternalExecution(actionType: AgentActionType): void {
  if (isForbiddenRealAction(actionType)) {
    throw new Error(`External execution blocked for ${actionType} in V0.6`);
  }
}
