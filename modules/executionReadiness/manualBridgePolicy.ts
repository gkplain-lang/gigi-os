import { isRealExecutionBlocked } from "./executionReadinessPolicy";
import { EXECUTION_READINESS_V42_DISCLAIMER } from "./manualBridgeTypes";

export const MANUAL_BRIDGE_V42_RULES = [
  "Aucune exécution réelle en V4.2 — pont manuel uniquement.",
  "Tous les connecteurs restent non actifs (sandbox / manual_bridge_only).",
  "Les commandes et instructions sont du texte à copier — jamais lancées par Gigi.",
  "Noms de secrets autorisés dans les paquets — jamais les valeurs.",
  "Validation humaine obligatoire avant toute action hors Gigi.",
  "Aucune permission permanente, aucune auto-approbation.",
  "Aucun scheduler, aucune exécution en arrière-plan.",
] as const;

export function isManualBridgeExecutionBlocked(): boolean {
  return true;
}

export function isManualBridgeConnectorActive(): boolean {
  return false;
}

export function getManualBridgeDisclaimer(): string {
  return EXECUTION_READINESS_V42_DISCLAIMER;
}

export function manualBridgePolicyNotes(): string[] {
  return [...MANUAL_BRIDGE_V42_RULES];
}

export function assertManualBridgeSafe(capability: import("./types").ExecutionCapability): boolean {
  return isRealExecutionBlocked(capability) && isManualBridgeExecutionBlocked();
}
