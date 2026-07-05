import type { ExecutionReadinessRequest, PermissionCenterFilterId } from "./types";
import { getEffectivePermissionStatus } from "./permissionCenterExpiration";

export const PERMISSION_CENTER_FILTER_LABELS: Record<PermissionCenterFilterId, string> = {
  all: "Toutes",
  awaiting: "En attente",
  approved_dry_run: "Dry-run approuvées",
  rejected: "Refusées",
  expired: "Expirées",
  blocked: "Bloquées",
  revoked: "Révoquées",
};

const AWAITING_STATUSES: ExecutionReadinessRequest["permissionStatus"][] = [
  "draft",
  "needs_review",
  "awaiting_user_approval",
];

export function filterPermissionRequests(
  requests: ExecutionReadinessRequest[],
  filter: PermissionCenterFilterId
): ExecutionReadinessRequest[] {
  return requests
    .map((r) => ({ ...r, permissionStatus: getEffectivePermissionStatus(r) }))
    .filter((request) => {
      switch (filter) {
        case "all":
          return request.permissionStatus !== "archived";
        case "awaiting":
          return AWAITING_STATUSES.includes(request.permissionStatus);
        case "approved_dry_run":
          return request.permissionStatus === "approved_for_dry_run";
        case "rejected":
          return request.permissionStatus === "rejected";
        case "expired":
          return request.permissionStatus === "expired";
        case "blocked":
          return (
            request.permissionStatus === "blocked" || request.riskLevel === "blocked"
          );
        case "revoked":
          return request.permissionStatus === "revoked";
        default:
          return true;
      }
    })
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function countByPermissionFilter(
  requests: ExecutionReadinessRequest[]
): Record<PermissionCenterFilterId, number> {
  return {
    all: filterPermissionRequests(requests, "all").length,
    awaiting: filterPermissionRequests(requests, "awaiting").length,
    approved_dry_run: filterPermissionRequests(requests, "approved_dry_run").length,
    rejected: filterPermissionRequests(requests, "rejected").length,
    expired: filterPermissionRequests(requests, "expired").length,
    blocked: filterPermissionRequests(requests, "blocked").length,
    revoked: filterPermissionRequests(requests, "revoked").length,
  };
}
