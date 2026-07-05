import {
  loadExecutionReadinessState,
  saveExecutionReadinessState,
} from "@/modules/executionReadiness/executionReadinessStore";
import { getActiveDailyPriorityMission, getDailyPriorityMissionById } from "@/modules/missionComposer";
import { getGuidedProjectActionFlowById } from "@/modules/executionExperience/guidedActionBuilder";
import { getMissionReviewTemplate } from "./missionReviewTemplates";
import {
  computeFocusScore,
  generateExecutionReflection,
  generateRecommendedNextDecision,
} from "./missionReviewReflection";
import type {
  DailyMissionReview,
  DailyMissionReviewStatus,
  MissionExecutionReflection,
  MissionReviewAuditEntry,
  MissionReviewAuditType,
  NextDecision,
  OutcomeStatus,
} from "./missionReviewTypes";

function newId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

function audit(type: MissionReviewAuditType, message: string): MissionReviewAuditEntry {
  return { id: newId("mr-audit"), at: nowIso(), type, message };
}

function getReviews(): DailyMissionReview[] {
  return loadExecutionReadinessState().dailyMissionReviews ?? [];
}

function getReflections(): MissionExecutionReflection[] {
  return loadExecutionReadinessState().missionExecutionReflections ?? [];
}

function saveReviewState(
  reviews: DailyMissionReview[],
  reflections: MissionExecutionReflection[]
): void {
  const state = loadExecutionReadinessState();
  saveExecutionReadinessState({
    ...state,
    dailyMissionReviews: reviews,
    missionExecutionReflections: reflections,
    lastUpdatedAt: nowIso(),
  });
}

export function listDailyMissionReviews(limit?: number): DailyMissionReview[] {
  const sorted = [...getReviews()].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return limit ? sorted.slice(0, limit) : sorted;
}

export function getDailyMissionReviewById(id: string): DailyMissionReview | undefined {
  return getReviews().find((r) => r.id === id);
}

export function getLatestMissionReview(): DailyMissionReview | undefined {
  return listDailyMissionReviews(1)[0];
}

export function getReflectionByReviewId(reviewId: string): MissionExecutionReflection | undefined {
  return getReflections().find((r) => r.reviewId === reviewId);
}

export interface CreateDailyMissionReviewInput {
  title?: string;
  missionTitle: string;
  dailyPriorityMissionId?: string;
  missionCandidateId?: string;
  linkedGuidedFlowId?: string;
  projectId?: string;
  projectName?: string;
  source?: DailyMissionReview["source"];
  outcomeStatus?: OutcomeStatus;
  nextDecision?: NextDecision;
  whatWasDone?: string;
  blockers?: string;
  learnings?: string;
  progressLevel?: number;
}

export function createDailyMissionReview(
  input: CreateDailyMissionReviewInput
): DailyMissionReview {
  const now = nowIso();
  const review: DailyMissionReview = {
    id: newId("mr-review"),
    dailyPriorityMissionId: input.dailyPriorityMissionId,
    missionCandidateId: input.missionCandidateId,
    linkedGuidedFlowId: input.linkedGuidedFlowId,
    projectId: input.projectId,
    projectName: input.projectName,
    title: input.title ?? `Revue · ${input.missionTitle}`,
    missionTitle: input.missionTitle,
    reviewDate: now.slice(0, 10),
    status: "draft",
    outcomeStatus: input.outcomeStatus ?? "unclear",
    progressLevel: input.progressLevel ?? 50,
    completedByHuman: false,
    whatWasDone: input.whatWasDone ?? "",
    blockers: input.blockers ?? "",
    learnings: input.learnings ?? "",
    nextDecision: input.nextDecision ?? "clarify_next_step",
    recommendedNextAction: "",
    focusScore: 50,
    createdAt: now,
    updatedAt: now,
    source: input.source ?? "manual",
    auditTrail: [
      audit("mission_review_created", `Revue créée pour « ${input.missionTitle} » — action explicite.`),
    ],
  };

  const recommended = generateRecommendedNextDecision(review);
  review.recommendedNextAction = recommended.action;
  review.focusScore = computeFocusScore(review);

  const reviews = [review, ...getReviews()];
  saveReviewState(reviews, getReflections());
  return review;
}

export function createReviewFromDailyMission(dailyId?: string): DailyMissionReview | undefined {
  const daily = dailyId
    ? getDailyPriorityMissionById(dailyId)
    : getActiveDailyPriorityMission();
  if (!daily) return undefined;

  return createDailyMissionReview({
    missionTitle: daily.title,
    dailyPriorityMissionId: daily.id,
    missionCandidateId: daily.missionCandidateId,
    linkedGuidedFlowId: daily.linkedGuidedFlowId,
    projectId: daily.projectId,
    projectName: daily.projectName,
    source: "daily_mission",
  });
}

export function createReviewFromGuidedFlow(flowId: string): DailyMissionReview | undefined {
  const flow = getGuidedProjectActionFlowById(flowId);
  if (!flow) return undefined;

  return createDailyMissionReview({
    missionTitle: flow.title.replace(/^Guidé · /, ""),
    linkedGuidedFlowId: flow.id,
    missionCandidateId: flow.missionId,
    projectId: flow.projectId,
    projectName: flow.projectName,
    source: "guided_flow",
    whatWasDone: "Parcours guidé en cours ou terminé — revue locale.",
  });
}

export interface UpdateReviewInput {
  whatWasDone?: string;
  blockers?: string;
  learnings?: string;
  outcomeStatus?: OutcomeStatus;
  nextDecision?: NextDecision;
  progressLevel?: number;
  status?: DailyMissionReviewStatus;
  completedByHuman?: boolean;
}

export function updateDailyMissionReview(
  reviewId: string,
  input: UpdateReviewInput
): DailyMissionReview | undefined {
  const reviews = getReviews();
  const idx = reviews.findIndex((r) => r.id === reviewId);
  if (idx === -1) return undefined;

  const now = nowIso();
  const updated: DailyMissionReview = {
    ...reviews[idx],
    ...input,
    updatedAt: now,
    auditTrail: [
      ...reviews[idx].auditTrail,
      audit("mission_review_updated", "Revue mise à jour — champs locaux."),
    ],
  };

  const recommended = generateRecommendedNextDecision(updated);
  updated.recommendedNextAction = recommended.action;
  updated.focusScore = computeFocusScore(updated);

  reviews[idx] = updated;
  saveReviewState(reviews, getReflections());
  return updated;
}

export function updateDailyMissionReviewStatus(
  reviewId: string,
  status: DailyMissionReviewStatus
): DailyMissionReview | undefined {
  const auditType: MissionReviewAuditType =
    status === "completed_by_human"
      ? "mission_review_completed_by_human"
      : status === "continued"
        ? "mission_review_continued"
        : status === "pivoted"
          ? "mission_review_pivoted"
          : status === "cancelled"
            ? "mission_review_cancelled"
            : "mission_review_updated";

  const review = updateDailyMissionReview(reviewId, { status });
  if (!review) return undefined;

  const reviews = getReviews().map((r) =>
    r.id === reviewId
      ? {
          ...r,
          status,
          auditTrail: [
            ...r.auditTrail,
            audit(auditType, `Statut revue → ${status}`),
          ],
        }
      : r
  );
  saveReviewState(reviews, getReflections());
  return reviews.find((r) => r.id === reviewId);
}

export function saveDailyMissionReviewWithReflection(
  reviewId: string,
  input: UpdateReviewInput
): { review: DailyMissionReview; reflection: MissionExecutionReflection } | undefined {
  const updated = updateDailyMissionReview(reviewId, {
    ...input,
    status: input.status ?? "reviewed",
  });
  if (!updated) return undefined;

  const reflection = generateExecutionReflection(updated);
  const reflections = [reflection, ...getReflections().filter((r) => r.reviewId !== reviewId)];
  saveReviewState(getReviews(), reflections);

  return { review: updated, reflection };
}

export function completeDailyMissionReviewByHuman(
  reviewId: string
): DailyMissionReview | undefined {
  const review = updateDailyMissionReview(reviewId, {
    status: "completed_by_human",
    completedByHuman: true,
    outcomeStatus: "completed",
    nextDecision: "mark_complete",
  });
  if (!review) return undefined;

  updateDailyMissionReviewStatus(reviewId, "completed_by_human");
  const reflection = generateExecutionReflection({ ...review, status: "completed_by_human" });
  const reflections = [reflection, ...getReflections().filter((r) => r.reviewId !== reviewId)];
  saveReviewState(getReviews(), reflections);
  return getDailyMissionReviewById(reviewId);
}

export function createReviewFromTemplate(
  templateId: string,
  missionTitle: string,
  context?: Partial<CreateDailyMissionReviewInput>
): DailyMissionReview | undefined {
  const template = getMissionReviewTemplate(templateId);
  if (!template) return undefined;

  return createDailyMissionReview({
    missionTitle,
    title: `Revue · ${template.title}`,
    outcomeStatus: template.outcomeStatus,
    nextDecision: template.nextDecision,
    whatWasDone: template.defaultWhatWasDone ?? "",
    blockers: template.defaultBlockers ?? "",
    learnings: template.defaultLearnings ?? "",
    source: "template",
    ...context,
  });
}
