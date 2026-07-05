import type { ManualBridgeGlobalSummary } from "./manualBridgeTypes";
import { listManualExecutionPackets, getEffectivePacketStatus, syncExpiredManualBridgePackets } from "./manualBridgePackets";
import { getSandboxConnectorRegistry } from "./manualBridgeRegistry";

export function generateManualBridgeSummary(): ManualBridgeGlobalSummary {
  if (typeof window !== "undefined") {
    syncExpiredManualBridgePackets();
  }

  const packets = listManualExecutionPackets();
  const connectors = getSandboxConnectorRegistry();

  const readyForReview = packets.filter(
    (p) => getEffectivePacketStatus(p) === "ready_for_human_review"
  ).length;
  const copiedByHuman = packets.filter(
    (p) => getEffectivePacketStatus(p) === "copied_by_human"
  ).length;
  const markedDone = packets.filter(
    (p) => getEffectivePacketStatus(p) === "marked_done_by_human"
  ).length;
  const expired = packets.filter((p) => getEffectivePacketStatus(p) === "expired").length;
  const cancelled = packets.filter((p) => getEffectivePacketStatus(p) === "cancelled").length;

  const blockedConnectors = connectors.length;

  const summaryText =
    packets.length === 0
      ? "Aucun paquet manuel — Gigi peut préparer des étapes à copier, sans exécution réelle."
      : `${packets.length} paquet(s) manuel(s) · ${readyForReview} en attente de revue · ${markedDone} marqué(s) fait par l'humain · connecteurs non actifs.`;

  return {
    totalPackets: packets.length,
    readyForReview,
    copiedByHuman,
    markedDone,
    expired,
    cancelled,
    blockedConnectors,
    summaryText,
  };
}

export const MANUAL_BRIDGE_EMPTY_SUMMARY =
  "Pont manuel V4.2 — prépare des paquets d'exécution à valider toi-même. Aucune exécution réelle.";
