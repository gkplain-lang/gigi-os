import { listCommandPacks } from "./commandPackBuilder";
import type { CommandPackAuditEntry } from "./commandPackTypes";

export interface CommandPackHistoryItem {
  packId: string;
  packTitle: string;
  entryId: string;
  at: string;
  type: CommandPackAuditEntry["type"];
  message: string;
}

export const COMMAND_PACK_AUDIT_EVENT_LABELS: Record<CommandPackAuditEntry["type"], string> = {
  command_pack_created: "Pack créé",
  command_copied_by_human: "Commande copiée",
  marked_run_by_human: "Lancé (humain)",
  marked_success_by_human: "Succès déclaré",
  marked_failed_by_human: "Échec déclaré",
  cancelled: "Annulé",
  expired: "Expiré",
  status_change: "Changement statut",
};

export function getRecentCommandPackAudit(limit = 8): CommandPackHistoryItem[] {
  const entries = listCommandPacks().flatMap((pack) =>
    pack.auditTrail.map((entry) => ({
      packId: pack.id,
      packTitle: pack.title,
      entryId: entry.id,
      at: entry.at,
      type: entry.type,
      message: entry.message,
    }))
  );
  return entries.sort((a, b) => b.at.localeCompare(a.at)).slice(0, limit);
}
