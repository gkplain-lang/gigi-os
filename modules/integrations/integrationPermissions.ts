import type { IntegrationId } from "./types";
import { permissionsForGitHubAction } from "./github/githubPermissions";
import type { GitHubDryRunActionType } from "./github/types";

export function permissionsForIntegration(
  integrationId: IntegrationId,
  githubAction?: GitHubDryRunActionType
): string[] {
  switch (integrationId) {
    case "github":
      return permissionsForGitHubAction(githubAction ?? "prepare_branch_plan");
    default:
      return ["local_read_only"];
  }
}

export function formatPermissionsList(permissions: string[]): string {
  if (permissions.length === 0) return "Aucune permission externe";
  return permissions.map((p) => p.replace(/_/g, " ")).join(", ");
}
