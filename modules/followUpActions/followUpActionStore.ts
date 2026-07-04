import type { FollowUpActionProposal, FollowUpActionsState } from "./types";
import { FOLLOW_UP_ACTIONS_STORAGE_KEY } from "./types";

export function createEmptyFollowUpState(): FollowUpActionsState {
  return { proposals: [] };
}

export function loadFollowUpActionsState(): FollowUpActionsState {
  if (typeof window === "undefined") return createEmptyFollowUpState();
  try {
    const raw = localStorage.getItem(FOLLOW_UP_ACTIONS_STORAGE_KEY);
    if (!raw) return createEmptyFollowUpState();
    const parsed = JSON.parse(raw) as FollowUpActionsState;
    if (!parsed?.proposals || !Array.isArray(parsed.proposals)) return createEmptyFollowUpState();
    return parsed;
  } catch {
    return createEmptyFollowUpState();
  }
}

export function saveFollowUpActionsState(state: FollowUpActionsState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(FOLLOW_UP_ACTIONS_STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

export function replaceProposalsForReview(
  reviewId: string,
  proposals: FollowUpActionProposal[]
): FollowUpActionProposal[] {
  const state = loadFollowUpActionsState();
  const kept = state.proposals.filter((p) => p.sourceReviewId !== reviewId);
  const next: FollowUpActionsState = {
    proposals: [...proposals, ...kept],
    lastUpdatedAt: proposals[0]?.updatedAt ?? new Date().toISOString(),
  };
  saveFollowUpActionsState(next);
  return proposals;
}

export function getProposalsByReviewId(reviewId: string): FollowUpActionProposal[] {
  return loadFollowUpActionsState().proposals.filter((p) => p.sourceReviewId === reviewId);
}

export function updateProposalInStore(
  proposalId: string,
  patch: Partial<Pick<FollowUpActionProposal, "status" | "updatedAt">>
): FollowUpActionProposal | undefined {
  const state = loadFollowUpActionsState();
  let updated: FollowUpActionProposal | undefined;
  const proposals = state.proposals.map((p) => {
    if (p.id !== proposalId) return p;
    updated = { ...p, ...patch, updatedAt: patch.updatedAt ?? new Date().toISOString() };
    return updated;
  });
  if (updated) {
    saveFollowUpActionsState({ proposals, lastUpdatedAt: updated.updatedAt });
  }
  return updated;
}

export function listAllFollowUpProposals(): FollowUpActionProposal[] {
  return loadFollowUpActionsState().proposals;
}
