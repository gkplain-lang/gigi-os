import type { IntegrationId, IntegrationStatus } from "./types";
import { getGitHubIntegrationStatus } from "./github/githubSummary";

const DEFAULT_STATUS: IntegrationStatus = "not_configured";

export function getIntegrationStatus(integrationId: IntegrationId): IntegrationStatus {
  switch (integrationId) {
    case "github":
      return getGitHubIntegrationStatus();
    default:
      return DEFAULT_STATUS;
  }
}

export function formatIntegrationStatusLabel(status: IntegrationStatus): string {
  switch (status) {
    case "not_configured":
      return "Non configuré";
    case "dry_run_only":
      return "Dry-run uniquement";
    case "ready_for_confirmation":
      return "Prêt pour confirmation";
    case "disabled":
      return "Désactivé";
    case "blocked":
      return "Bloqué";
    default:
      return status;
  }
}
