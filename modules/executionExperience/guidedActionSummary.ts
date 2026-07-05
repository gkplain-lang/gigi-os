import { listGuidedProjectActionFlows } from "./guidedActionBuilder";
import type { GuidedActionGlobalSummary } from "./guidedActionTypes";

export const GUIDED_ACTION_EMPTY_SUMMARY =
  "Aucun parcours guidé — choisis un modèle sur /guided-actions pour structurer une action projet.";

export function generateGuidedActionSummary(): GuidedActionGlobalSummary {
  const flows = listGuidedProjectActionFlows();
  const activeFlows = flows.filter(
    (f) => !["completed_by_human", "cancelled"].includes(f.status)
  ).length;
  const completedFlows = flows.filter((f) => f.status === "completed_by_human").length;
  const cancelledFlows = flows.filter((f) => f.status === "cancelled").length;

  const summaryText =
    flows.length === 0
      ? GUIDED_ACTION_EMPTY_SUMMARY
      : `${flows.length} parcours guidé(s) · ${activeFlows} actif(s) · ${completedFlows} terminé(s) (humain) · local uniquement.`;

  return {
    totalFlows: flows.length,
    activeFlows,
    completedFlows,
    cancelledFlows,
    summaryText,
  };
}
