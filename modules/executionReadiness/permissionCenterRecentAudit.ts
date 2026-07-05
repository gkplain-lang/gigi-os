import { loadExecutionReadinessState } from "./executionReadinessStore";

export interface PermissionAuditHistoryItem {
  requestId: string;
  requestTitle: string;
  entryId: string;
  at: string;
  type: string;
  message: string;
  decision?: string;
}

export const PERMISSION_AUDIT_EVENT_LABELS: Record<string, string> = {
  created: "Créée",
  approved_dry_run: "Dry-run approuvé",
  rejected: "Refusée",
  revoked: "Révoquée",
  expired: "Expirée",
  decision: "Décision",
  updated: "Mise à jour",
};

export function listRecentPermissionAuditEvents(limit = 8): PermissionAuditHistoryItem[] {
  const state = loadExecutionReadinessState();
  const entries = state.requests.flatMap((request) =>
    request.auditTrail.map((entry) => ({
      requestId: request.id,
      requestTitle: request.title,
      entryId: entry.id,
      at: entry.at,
      type: entry.type,
      message: entry.message,
      decision: entry.decision,
    }))
  );

  return entries.sort((a, b) => b.at.localeCompare(a.at)).slice(0, limit);
}
