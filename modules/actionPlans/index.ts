export type {
  ActionPlan,
  ActionPlanBuildInput,
  ActionPlanDeliverable,
  ActionPlanEffort,
  ActionPlanIntent,
  ActionPlanRisk,
  ActionPlanStep,
  PreparedActionPreview,
  PreparedActionType,
} from "./types";

export {
  buildActionPlan,
  buildActionPlanForProject,
  detectActionPlanIntent,
  getActionPlanStepsAsTasks,
  ACTION_PLAN_DRY_RUN_MESSAGE,
} from "./actionPlanBuilder";

export { formatActionPlanSummary, formatActionPlanStepsText, formatDeliverablesList } from "./actionPlanFormatter";

export {
  PREPARED_ACTION_LABELS,
  VALIDATION_DEFAULTS,
  confidenceForPlan,
  effortFromScore,
} from "./actionPlanSummary";

export { getMissionPlanTemplate, MISSION_PLAN_TEMPLATES } from "./actionPlanRules";

export function getProjectPlanHref(projectId: string, missionId?: string): string {
  const base = `/projects/${projectId}`;
  if (!missionId) return `${base}?plan=recommended`;
  return `${base}?plan=${encodeURIComponent(missionId)}`;
}

export function getMissionPlanAskHref(projectName: string, missionTitle: string): string {
  const ask = `Gigi, transforme la mission « ${missionTitle} » en plan d'action pour ${projectName}.`;
  return `/conversation?ask=${encodeURIComponent(ask)}`;
}
