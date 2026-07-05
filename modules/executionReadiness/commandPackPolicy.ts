import { isManualBridgeExecutionBlocked } from "./manualBridgePolicy";
import { isRealExecutionBlocked } from "./executionReadinessPolicy";
import { EXECUTION_READINESS_V43_DISCLAIMER } from "./commandPackTypes";

export const COMMAND_PACK_V43_RULES = [
  "Aucune commande n'est exécutée par Gigi en V4.3.",
  "Les commandes sont du texte à copier — lancement humain uniquement.",
  "Statuts déclaratifs — Gigi ne vérifie pas l'exécution réelle.",
  "Secrets : noms autorisés, jamais les valeurs.",
  "Placeholders explicites (<BRANCH_NAME>, etc.) — à remplacer manuellement.",
  "Aucune permission permanente, aucune auto-approbation.",
  "Aucun scheduler, aucune exécution en arrière-plan.",
] as const;

export function isCommandPackExecutionBlocked(): boolean {
  return true;
}

export function getCommandPackDisclaimer(): string {
  return EXECUTION_READINESS_V43_DISCLAIMER;
}

export function commandPackPolicyNotes(): string[] {
  return [...COMMAND_PACK_V43_RULES];
}

export function validateCommandPackSafety(): boolean {
  return (
    isRealExecutionBlocked("shell_command") &&
    isManualBridgeExecutionBlocked() &&
    isCommandPackExecutionBlocked()
  );
}
