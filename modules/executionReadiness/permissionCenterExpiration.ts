import {
  DRY_RUN_APPROVAL_TTL_HOURS,
  type ExecutionReadinessRequest,
} from "./types";
import {
  getExecutionReadinessRequestById,
  listExecutionReadinessRequests,
  upsertExecutionReadinessRequest,
} from "./executionReadinessStore";

function nowIso(): string {
  return new Date().toISOString();
}

function newAuditId(): string {
  return `audit-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function computeDryRunExpiresAt(fromIso: string): string {
  const date = new Date(fromIso);
  date.setHours(date.getHours() + DRY_RUN_APPROVAL_TTL_HOURS);
  return date.toISOString();
}

export function isDryRunExpired(request: ExecutionReadinessRequest): boolean {
  if (request.permissionStatus !== "approved_for_dry_run") return false;
  if (!request.dryRunExpiresAt) return false;
  return new Date(request.dryRunExpiresAt).getTime() <= Date.now();
}

export function getEffectivePermissionStatus(
  request: ExecutionReadinessRequest
): ExecutionReadinessRequest["permissionStatus"] {
  if (request.permissionStatus === "revoked" || request.revokedAt) return "revoked";
  if (request.permissionStatus === "approved_for_dry_run" && isDryRunExpired(request)) {
    return "expired";
  }
  return request.permissionStatus;
}

/** Persist expiration locale — appelé depuis /permissions (action utilisateur implicite) */
export function syncExpiredDryRunPermissions(): number {
  if (typeof window === "undefined") return 0;
  let count = 0;
  for (const request of listExecutionReadinessRequests()) {
    if (request.permissionStatus !== "approved_for_dry_run") continue;
    if (!isDryRunExpired(request)) continue;

    upsertExecutionReadinessRequest({
      ...request,
      permissionStatus: "expired",
      updatedAt: nowIso(),
      auditTrail: [
        {
          id: newAuditId(),
          at: nowIso(),
          type: "expired",
          message: `Approbation dry-run expirée après ${DRY_RUN_APPROVAL_TTL_HOURS}h — permission locale close.`,
        },
        ...request.auditTrail,
      ],
    });
    count += 1;
  }
  return count;
}

export function applyDryRunApprovalTimestamps(
  request: ExecutionReadinessRequest,
  approvedAt: string
): ExecutionReadinessRequest {
  return {
    ...request,
    dryRunApprovedAt: approvedAt,
    dryRunExpiresAt: computeDryRunExpiresAt(approvedAt),
  };
}

export function formatExpirationLabel(expiresAt: string | undefined): string | null {
  if (!expiresAt) return null;
  const date = new Date(expiresAt);
  if (Number.isNaN(date.getTime())) return null;
  const expired = date.getTime() <= Date.now();
  const label = date.toLocaleString("fr-FR");
  return expired ? `Expirée le ${label}` : `Expire le ${label}`;
}

export function getRequestByIdWithEffectiveStatus(
  id: string
): ExecutionReadinessRequest | undefined {
  const request = getExecutionReadinessRequestById(id);
  if (!request) return undefined;
  const effective = getEffectivePermissionStatus(request);
  if (effective === request.permissionStatus) return request;
  return { ...request, permissionStatus: effective };
}
