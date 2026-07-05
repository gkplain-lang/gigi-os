import { listGuidedProjectActionFlows } from "./guidedActionBuilder";
import type { GuidedFlowAuditEntry } from "./guidedActionTypes";

export interface GuidedActionHistoryItem {
  flowId: string;
  flowTitle: string;
  entryId: string;
  at: string;
  type: GuidedFlowAuditEntry["type"];
  message: string;
}

export const GUIDED_FLOW_AUDIT_LABELS: Record<GuidedFlowAuditEntry["type"], string> = {
  guided_flow_created: "Parcours créé",
  guided_step_marked_ready: "Étape prête",
  guided_flow_linked_request: "Demande reliée",
  guided_flow_linked_manual_packet: "Pont relié",
  guided_flow_linked_command_pack: "Pack relié",
  guided_flow_linked_review_session: "Revue reliée",
  guided_flow_completed_by_human: "Terminé (humain)",
  guided_flow_cancelled: "Annulé",
  guided_flow_status_change: "Changement statut",
};

export function getRecentGuidedActionAudit(limit = 8): GuidedActionHistoryItem[] {
  const entries = listGuidedProjectActionFlows().flatMap((flow) =>
    flow.auditTrail.map((entry) => ({
      flowId: flow.id,
      flowTitle: flow.title,
      entryId: entry.id,
      at: entry.at,
      type: entry.type,
      message: entry.message,
    }))
  );
  return entries.sort((a, b) => b.at.localeCompare(a.at)).slice(0, limit);
}
