import type { DryRunActionType, ForbiddenRealActionType } from "./types";

export const DRY_RUN_ACTIONS: DryRunActionType[] = [
  "prepare_github_branch",
  "prepare_github_commit",
  "prepare_n8n_agent_plan",
  "prepare_buildy_crafts_library_update",
  "prepare_supabase_backup_plan",
  "prepare_tomorrow_mission",
  "prepare_project_review",
];

export const FORBIDDEN_REAL_ACTIONS: ForbiddenRealActionType[] = [
  "send_email",
  "modify_calendar",
  "push_to_github",
  "merge_branch",
  "run_n8n_workflow",
  "sync_supabase",
  "restore_supabase",
  "delete_data",
  "publish_content",
  "spend_money",
  "call_external_api",
];

export const DRY_RUN_ACTION_LABELS: Record<DryRunActionType, string> = {
  prepare_github_branch: "Préparer une branche GitHub",
  prepare_github_commit: "Préparer un commit GitHub",
  prepare_n8n_agent_plan: "Préparer un plan d'agent n8n",
  prepare_buildy_crafts_library_update: "Préparer une mise à jour bibliothèque Buildy Crafts",
  prepare_supabase_backup_plan: "Préparer un plan de backup Supabase",
  prepare_tomorrow_mission: "Préparer la mission de demain",
  prepare_project_review: "Préparer une revue de projet",
};

export const FORBIDDEN_ACTION_LABELS: Record<ForbiddenRealActionType, string> = {
  send_email: "Envoyer un email",
  modify_calendar: "Modifier le calendrier",
  push_to_github: "Push GitHub",
  merge_branch: "Merger une branche",
  run_n8n_workflow: "Exécuter un workflow n8n",
  sync_supabase: "Sync Supabase",
  restore_supabase: "Restore Supabase",
  delete_data: "Supprimer des données",
  publish_content: "Publier du contenu",
  spend_money: "Dépenser de l'argent",
  call_external_api: "Appeler une API externe",
};

export function isDryRunAction(type: string): type is DryRunActionType {
  return (DRY_RUN_ACTIONS as string[]).includes(type);
}

export function isForbiddenRealAction(type: string): type is ForbiddenRealActionType {
  return (FORBIDDEN_REAL_ACTIONS as string[]).includes(type);
}
