import { listManualExecutionPackets } from "./manualBridgePackets";
import type { ManualBridgeAuditEntry } from "./manualBridgeTypes";

export interface ManualBridgeHistoryItem {
  packetId: string;
  packetTitle: string;
  entryId: string;
  at: string;
  type: ManualBridgeAuditEntry["type"];
  message: string;
}

export const MANUAL_BRIDGE_AUDIT_EVENT_LABELS: Record<ManualBridgeAuditEntry["type"], string> = {
  manual_packet_created: "Paquet créé",
  copied_by_human: "Copié par l'humain",
  marked_done_by_human: "Marqué fait (humain)",
  cancelled: "Annulé",
  expired: "Expiré",
  status_change: "Changement statut",
};

export function listRecentManualBridgeAuditEvents(limit = 8): ManualBridgeHistoryItem[] {
  const entries = listManualExecutionPackets().flatMap((packet) =>
    packet.auditTrail.map((entry) => ({
      packetId: packet.id,
      packetTitle: packet.title,
      entryId: entry.id,
      at: entry.at,
      type: entry.type,
      message: entry.message,
    }))
  );
  return entries.sort((a, b) => b.at.localeCompare(a.at)).slice(0, limit);
}
