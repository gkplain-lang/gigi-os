import { listLocalReviewSessions } from "./localReviewBuilder";
import type { LocalReviewAuditEntry } from "./localReviewTypes";

export interface LocalReviewHistoryItem {
  sessionId: string;
  sessionTitle: string;
  entryId: string;
  at: string;
  type: LocalReviewAuditEntry["type"];
  message: string;
}

export const LOCAL_REVIEW_AUDIT_EVENT_LABELS: Record<LocalReviewAuditEntry["type"], string> = {
  review_session_created: "Revue créée",
  input_saved_by_human: "Résultat collé",
  local_review_analyzed: "Analyse locale",
  sensitive_pattern_detected: "Alerte secret",
  marked_inconclusive: "Inconclusif",
  archived: "Archivée",
  status_change: "Changement statut",
};

export function getRecentLocalReviewAudit(limit = 8): LocalReviewHistoryItem[] {
  const entries = listLocalReviewSessions().flatMap((session) =>
    session.auditTrail.map((entry) => ({
      sessionId: session.id,
      sessionTitle: session.title,
      entryId: entry.id,
      at: entry.at,
      type: entry.type,
      message: entry.message,
    }))
  );
  return entries.sort((a, b) => b.at.localeCompare(a.at)).slice(0, limit);
}
