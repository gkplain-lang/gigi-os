import type { DryRunAutomationType, ForbiddenRealAutomationType } from "./types";

export const DRY_RUN_AUTOMATIONS: DryRunAutomationType[] = [
  "daily_review_reminder",
  "weekly_project_review",
  "buildy_crafts_library_update_plan",
  "buildy_clear_launch_checklist",
  "gigi_os_git_branch_plan",
  "n8n_agent_plan",
  "content_publication_plan",
  "supabase_backup_plan",
  "project_stale_check",
  "tomorrow_mission_preparation",
];

export const FORBIDDEN_REAL_AUTOMATIONS: ForbiddenRealAutomationType[] = [
  "send_email",
  "publish_video",
  "push_to_github",
  "merge_branch",
  "run_n8n_workflow",
  "sync_supabase",
  "restore_supabase",
  "delete_data",
  "spend_money",
  "call_external_api",
  "modify_calendar",
];

export const DRY_RUN_AUTOMATION_LABELS: Record<DryRunAutomationType, string> = {
  daily_review_reminder: "Rappel revue quotidienne",
  weekly_project_review: "Revue hebdomadaire des projets",
  buildy_crafts_library_update_plan: "Plan MAJ bibliothèque Buildy Crafts",
  buildy_clear_launch_checklist: "Checklist lancement Buildy Clear",
  gigi_os_git_branch_plan: "Plan branche Git Aegis",
  n8n_agent_plan: "Plan agent n8n (sans connexion)",
  content_publication_plan: "Plan publication contenu",
  supabase_backup_plan: "Plan backup Supabase",
  project_stale_check: "Surveillance projets dormants",
  tomorrow_mission_preparation: "Préparation mission de demain",
};

export const FORBIDDEN_AUTOMATION_LABELS: Record<ForbiddenRealAutomationType, string> = {
  send_email: "Envoi email automatique",
  publish_video: "Publication vidéo automatique",
  push_to_github: "Push GitHub automatique",
  merge_branch: "Merge branche automatique",
  run_n8n_workflow: "Exécution workflow n8n",
  sync_supabase: "Sync Supabase automatique",
  restore_supabase: "Restore Supabase automatique",
  delete_data: "Suppression données automatique",
  spend_money: "Dépense automatique",
  call_external_api: "Appel API externe automatique",
  modify_calendar: "Modification calendrier automatique",
};

export function isDryRunAutomation(type: string): type is DryRunAutomationType {
  return (DRY_RUN_AUTOMATIONS as string[]).includes(type);
}

export function isForbiddenAutomation(type: string): type is ForbiddenRealAutomationType {
  return (FORBIDDEN_REAL_AUTOMATIONS as string[]).includes(type);
}
