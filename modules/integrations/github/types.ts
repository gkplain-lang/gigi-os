/** GitHub actions preparable in dry-run — no API, no git. */
export type GitHubDryRunActionType =
  | "prepare_branch_plan"
  | "prepare_commit_plan"
  | "prepare_pull_request_plan"
  | "prepare_merge_plan"
  | "prepare_issue_plan"
  | "prepare_release_note_plan";

/** Real GitHub actions forbidden in V0.8. */
export type GitHubForbiddenActionType =
  | "create_branch_real"
  | "commit_real"
  | "push_real"
  | "create_pr_real"
  | "merge_real"
  | "delete_branch_real"
  | "modify_repo_settings"
  | "access_secrets"
  | "read_private_repo_without_confirmation";

export type GitHubActionType = GitHubDryRunActionType | GitHubForbiddenActionType;

export interface GitHubPlanContext {
  userMessage: string;
  projectId?: string;
  missionId?: string;
  isRecurring?: boolean;
}
