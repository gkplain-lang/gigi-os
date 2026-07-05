import {
  generateCommandPackSummary,
  generateGlobalExecutionReadinessSummary,
  generateLocalReviewSummary,
  generateManualBridgeSummary,
  listExecutionReadinessRequests,
} from "@/modules/executionReadiness";
import { countByPermissionFilter } from "@/modules/executionReadiness/permissionCenterFilters";

export interface ExecutionCenterOverviewData {
  requestsTotal: number;
  requestsActive: number;
  permissionsTotal: number;
  permissionsAwaiting: number;
  bridgeTotal: number;
  bridgeReady: number;
  packsTotal: number;
  packsReady: number;
  reviewsTotal: number;
  reviewsAwaiting: number;
  hasAnyActivity: boolean;
}

export function getExecutionCenterOverviewData(): ExecutionCenterOverviewData {
  const readiness = generateGlobalExecutionReadinessSummary();
  const permissionCounts = countByPermissionFilter(listExecutionReadinessRequests());
  const bridge = generateManualBridgeSummary();
  const packs = generateCommandPackSummary();
  const reviews = generateLocalReviewSummary();

  const requestsTotal = readiness.totalRequests;
  const permissionsTotal = permissionCounts.all;
  const bridgeTotal = bridge.totalPackets;
  const packsTotal = packs.totalPacks;
  const reviewsTotal = reviews.totalSessions;

  const hasAnyActivity =
    requestsTotal + permissionsTotal + bridgeTotal + packsTotal + reviewsTotal > 0;

  return {
    requestsTotal,
    requestsActive: readiness.activeRequests,
    permissionsTotal,
    permissionsAwaiting: permissionCounts.awaiting,
    bridgeTotal,
    bridgeReady: bridge.readyForReview,
    packsTotal,
    packsReady: packs.readyForReview,
    reviewsTotal,
    reviewsAwaiting: reviews.awaitingInput,
    hasAnyActivity,
  };
}
