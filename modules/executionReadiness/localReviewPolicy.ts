import { isCommandPackExecutionBlocked } from "./commandPackPolicy";
import { isManualBridgeExecutionBlocked } from "./manualBridgePolicy";
import { isRealExecutionBlocked } from "./executionReadinessPolicy";
import { EXECUTION_READINESS_V44_DISCLAIMER } from "./localReviewTypes";

export const LOCAL_REVIEW_V44_RULES = [
  "Aucune exécution réelle — analyse locale du texte collé uniquement.",
  "Gigi ne lit pas le terminal, n'inspecte pas les fichiers, n'appelle aucune API.",
  "Statuts probables — aucune vérification réelle du système.",
  "Si un secret semble présent dans le texte collé, alerte locale — retirer avant sauvegarde.",
  "Aucune permission permanente, aucune auto-approbation.",
  "Aucun scheduler, aucune exécution en arrière-plan.",
  "Contrôle humain obligatoire pour toute décision.",
] as const;

export function isLocalReviewReadOnly(): boolean {
  return true;
}

export function isLocalReviewExecutionBlocked(): boolean {
  return true;
}

export function getLocalReviewDisclaimer(): string {
  return EXECUTION_READINESS_V44_DISCLAIMER;
}

export function localReviewPolicyNotes(): string[] {
  return [...LOCAL_REVIEW_V44_RULES];
}

export function validateLocalReviewSafety(): boolean {
  return (
    isRealExecutionBlocked("shell_command") &&
    isManualBridgeExecutionBlocked() &&
    isCommandPackExecutionBlocked() &&
    isLocalReviewExecutionBlocked() &&
    isLocalReviewReadOnly()
  );
}
