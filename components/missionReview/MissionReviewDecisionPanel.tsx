"use client";

import { useRouter } from "next/navigation";
import type { DailyMissionReview } from "@/modules/missionReview";
import {
  updateDailyMissionReviewStatus,
  completeDailyMissionReviewByHuman,
} from "@/modules/missionReview";
import { convertMissionToGuidedActionFlow } from "@/modules/missionComposer";

interface MissionReviewDecisionPanelProps {
  review: DailyMissionReview;
  onRefresh: () => void;
}

export function MissionReviewDecisionPanel({ review, onRefresh }: MissionReviewDecisionPanelProps) {
  const router = useRouter();

  function handleContinue() {
    updateDailyMissionReviewStatus(review.id, "continued");
    onRefresh();
  }

  function handlePivot() {
    updateDailyMissionReviewStatus(review.id, "pivoted");
    onRefresh();
  }

  function handleComplete() {
    completeDailyMissionReviewByHuman(review.id);
    onRefresh();
  }

  function handleConvertGuided() {
    if (review.missionCandidateId) {
      const result = convertMissionToGuidedActionFlow(review.missionCandidateId);
      if (result?.flow) router.push(`/guided-actions?flow=${result.flow.id}`);
    } else {
      router.push("/guided-actions");
    }
    updateDailyMissionReviewStatus(review.id, "reviewed");
    onRefresh();
  }

  function handleChooseNew() {
    updateDailyMissionReviewStatus(review.id, "pivoted");
    router.push("/mission-composer");
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={handleContinue}
        className="gigi-btn-secondary gigi-focus rounded-lg px-3 py-1.5 text-[12px] font-medium"
      >
        Continuer la même mission
      </button>
      <button
        type="button"
        onClick={handleChooseNew}
        className="gigi-focus rounded-lg border border-border/40 px-3 py-1.5 text-[12px] font-medium text-text-secondary"
      >
        Choisir une nouvelle mission
      </button>
      <button
        type="button"
        onClick={handleConvertGuided}
        className="gigi-focus rounded-lg border border-border/40 px-3 py-1.5 text-[12px] font-medium text-text-secondary"
      >
        Convertir en parcours guidé
      </button>
      <button
        type="button"
        onClick={handleComplete}
        className="gigi-focus rounded-lg border border-border/40 px-3 py-1.5 text-[12px] font-medium text-text-secondary"
      >
        Marquer terminée (humain)
      </button>
      <button
        type="button"
        onClick={handlePivot}
        className="gigi-focus rounded-lg px-3 py-1.5 text-[12px] text-text-muted hover:text-text-secondary"
      >
        Mettre en pause
      </button>
    </div>
  );
}
