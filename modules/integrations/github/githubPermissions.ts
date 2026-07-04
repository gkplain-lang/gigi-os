import type { GitHubDryRunActionType } from "./types";

export function permissionsForGitHubAction(action: GitHubDryRunActionType): string[] {
  const base = ["local_read_only", "github_dry_run_only", "no_api_call_v08"];
  switch (action) {
    case "prepare_branch_plan":
      return [...base, "branch_naming_suggestion"];
    case "prepare_commit_plan":
      return [...base, "commit_message_draft"];
    case "prepare_pull_request_plan":
      return [...base, "pr_description_draft"];
    case "prepare_merge_plan":
      return [...base, "merge_checklist_draft"];
    case "prepare_issue_plan":
      return [...base, "issue_draft"];
    case "prepare_release_note_plan":
      return [...base, "release_notes_draft"];
    default:
      return base;
  }
}
