import type { IntegrationStatus } from "../types";
import { detectIntegrationProposals } from "../integrationProposal";

/** GitHub is dry_run_only by default in V0.8 — no token, no API. */
export function getGitHubIntegrationStatus(): IntegrationStatus {
  return "dry_run_only";
}

export function summarizeGitHubAlpha(): {
  status: IntegrationStatus;
  dryRunActions: string[];
  forbiddenActions: string[];
} {
  return {
    status: getGitHubIntegrationStatus(),
    dryRunActions: [
      "prepare_branch_plan",
      "prepare_commit_plan",
      "prepare_pull_request_plan",
      "prepare_merge_plan",
      "prepare_issue_plan",
      "prepare_release_note_plan",
    ],
    forbiddenActions: [
      "create_branch_real",
      "commit_real",
      "push_real",
      "create_pr_real",
      "merge_real",
      "delete_branch_real",
      "modify_repo_settings",
      "access_secrets",
      "read_private_repo_without_confirmation",
    ],
  };
}

export function buildExampleGitHubProposal() {
  return detectIntegrationProposals("Gigi, prépare une branche GitHub pour V0.8").proposals[0]!;
}
