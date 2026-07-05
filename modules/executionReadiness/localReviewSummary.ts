import type { LocalReviewGlobalSummary } from "./localReviewTypes";
import { listLocalReviewSessions } from "./localReviewBuilder";

export function generateLocalReviewSummary(): LocalReviewGlobalSummary {
  const sessions = listLocalReviewSessions();
  const awaitingInput = sessions.filter((s) =>
    ["draft", "awaiting_user_input", "review_ready"].includes(s.status)
  ).length;
  const likelySuccess = sessions.filter((s) => s.status === "likely_success").length;
  const needsAttention = sessions.filter((s) => s.status === "needs_attention").length;
  const likelyFailed = sessions.filter((s) => s.status === "likely_failed").length;
  const inconclusive = sessions.filter((s) => s.status === "inconclusive").length;
  const sensitiveAlerts = sessions.filter((s) => s.hasSensitivePatternAlert).length;

  const summaryText =
    sessions.length === 0
      ? "Aucune revue locale — colle un résultat obtenu manuellement pour une analyse prudente."
      : `${sessions.length} revue(s) · ${awaitingInput} en attente · ${needsAttention} attention · analyse locale uniquement.`;

  return {
    totalSessions: sessions.length,
    awaitingInput,
    likelySuccess,
    needsAttention,
    likelyFailed,
    inconclusive,
    sensitiveAlerts,
    summaryText,
  };
}

export const LOCAL_REVIEW_EMPTY_SUMMARY =
  "Revue locale V4.4 — analyse du texte collé uniquement. Gigi ne lit pas ton terminal.";
