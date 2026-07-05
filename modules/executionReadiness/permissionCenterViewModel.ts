import type { PermissionCenterFilterId, PermissionCenterViewModel } from "./types";
import { listExecutionReadinessRequests } from "./executionReadinessStore";
import { syncExpiredDryRunPermissions } from "./permissionCenterExpiration";
import { filterPermissionRequests } from "./permissionCenterFilters";
import { getRequestByIdWithEffectiveStatus } from "./permissionCenterExpiration";

export function buildPermissionCenterViewModel(
  filter: PermissionCenterFilterId,
  selectedId: string | null,
  options: { syncExpiration?: boolean } = {}
): PermissionCenterViewModel {
  if (options.syncExpiration && typeof window !== "undefined") {
    syncExpiredDryRunPermissions();
  }

  const all = listExecutionReadinessRequests();
  const filtered = filterPermissionRequests(all, filter);
  const selectedRequest = selectedId
    ? getRequestByIdWithEffectiveStatus(selectedId) ?? null
    : null;

  return {
    filter,
    requests: filtered,
    selectedId,
    selectedRequest,
    totalCount: all.filter((r) => r.permissionStatus !== "archived").length,
    filteredCount: filtered.length,
  };
}
