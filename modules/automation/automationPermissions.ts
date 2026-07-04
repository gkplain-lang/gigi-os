import type { AutomationType } from "./types";

export function permissionsForAutomation(type: AutomationType): string[] {
  const base = ["confirmation_utilisateur", "dry_run_local"];

  switch (type) {
    case "daily_review_reminder":
    case "weekly_project_review":
    case "project_stale_check":
    case "tomorrow_mission_preparation":
      return [...base, "lecture_localStorage", "lecture_historique"];
    case "buildy_crafts_library_update_plan":
      return [...base, "lecture_projets", "planification_manuelle"];
    case "buildy_clear_launch_checklist":
      return [...base, "lecture_projets", "checklist_locale"];
    case "gigi_os_git_branch_plan":
      return [...base, "plan_git_manuel"];
    case "n8n_agent_plan":
      return [...base, "documentation_plan", "n8n_non_connecte"];
    case "content_publication_plan":
      return [...base, "plan_contenu_manuel"];
    case "supabase_backup_plan":
      return [...base, "plan_backup_manuel", "pas_de_sync_auto"];
    case "send_email":
      return [...base, "gmail_non_autorise_v07"];
    case "publish_video":
      return [...base, "publication_non_autorisee_v07"];
    case "push_to_github":
    case "merge_branch":
      return [...base, "github_api_non_autorisee_v07"];
    case "run_n8n_workflow":
      return [...base, "n8n_non_branché"];
    case "sync_supabase":
    case "restore_supabase":
      return [...base, "supabase_sync_restore_non_autorise_v07"];
    case "modify_calendar":
      return [...base, "calendar_non_autorise_v07"];
    default:
      return base;
  }
}

export function formatPermissionsList(permissions: string[]): string {
  return permissions.map((p) => p.replace(/_/g, " ")).join(", ");
}
