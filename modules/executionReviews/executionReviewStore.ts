import type { ExecutionReview, ExecutionReviewsState } from "./types";
import { EXECUTION_REVIEWS_STORAGE_KEY } from "./types";

export function createEmptyReviewsState(): ExecutionReviewsState {
  return { reviews: [] };
}

export function loadExecutionReviewsState(): ExecutionReviewsState {
  if (typeof window === "undefined") return createEmptyReviewsState();
  try {
    const raw = localStorage.getItem(EXECUTION_REVIEWS_STORAGE_KEY);
    if (!raw) return createEmptyReviewsState();
    const parsed = JSON.parse(raw) as ExecutionReviewsState;
    if (!parsed?.reviews || !Array.isArray(parsed.reviews)) return createEmptyReviewsState();
    return parsed;
  } catch {
    return createEmptyReviewsState();
  }
}

export function saveExecutionReviewsState(state: ExecutionReviewsState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(EXECUTION_REVIEWS_STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

export function upsertExecutionReview(review: ExecutionReview): ExecutionReview {
  const state = loadExecutionReviewsState();
  const filtered = state.reviews.filter((r) => r.executionLogId !== review.executionLogId);
  const next: ExecutionReviewsState = {
    reviews: [review, ...filtered],
    lastUpdatedAt: review.updatedAt,
  };
  saveExecutionReviewsState(next);
  return review;
}

export function getExecutionReviewByLogId(executionLogId: string): ExecutionReview | undefined {
  return loadExecutionReviewsState().reviews.find((r) => r.executionLogId === executionLogId);
}

export function deleteExecutionReview(executionLogId: string): void {
  const state = loadExecutionReviewsState();
  const next: ExecutionReviewsState = {
    reviews: state.reviews.filter((r) => r.executionLogId !== executionLogId),
    lastUpdatedAt: new Date().toISOString(),
  };
  saveExecutionReviewsState(next);
}

export function listExecutionReviews(): ExecutionReview[] {
  return loadExecutionReviewsState().reviews;
}
