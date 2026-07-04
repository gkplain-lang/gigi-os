export type {
  PreparedAction,
  PreparedActionBuildInput,
  PreparedActionIntent,
  PreparedActionType,
} from "./types";

export { PREPARED_ACTION_TYPE_LABELS } from "./types";

export {
  buildPreparedAction,
  buildPreparedActionForProject,
  buildPreparedActionFromPreview,
  detectPreparedActionIntent,
  getProjectPrepareHref,
  PREPARED_ACTION_DRY_RUN_MESSAGE,
} from "./preparedActionBuilder";

export { formatPreparedActionForCopy } from "./preparedActionFormatter";

export {
  PREPARED_ACTION_DRY_RUN_MESSAGE as DRY_RUN_MESSAGE,
  PREPARED_SAFETY_DEFAULTS,
  PREPARED_VALIDATION_DEFAULTS,
} from "./preparedActionSummary";

export {
  buildCursorPromptBody,
  defaultTypeForProject,
  inferTypeFromSourceId,
} from "./preparedActionRules";

export function getPreparedActionAskHref(
  projectName: string,
  type: "cursor_prompt" | "checklist" | "branch_plan" = "cursor_prompt"
): string {
  const prompts: Record<string, string> = {
    cursor_prompt: `Gigi, prépare le prompt Cursor pour ${projectName}`,
    checklist: `Gigi, fais-moi une checklist pour ${projectName}`,
    branch_plan: `Gigi, prépare la branche pour ${projectName}`,
  };
  return `/conversation?ask=${encodeURIComponent(prompts[type] ?? prompts.cursor_prompt)}`;
}
