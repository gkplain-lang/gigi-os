import { ArrowRight, Check } from "lucide-react";
import { MISSION_ACTION_LABELS } from "@/modules/dailyUseRefinement";
import type { MissionStatus } from "@/modules/missions/missionTypes";

interface MissionActionsProps {
  status: MissionStatus;
  onStart: () => void;
  onComplete: () => void;
  onPostpone: () => void;
  onReject: () => void;
}

export function MissionActions({
  status,
  onStart,
  onComplete,
  onPostpone,
  onReject,
}: MissionActionsProps) {
  if (status === "in_progress") {
    return (
      <div className="flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          onClick={onComplete}
          className="gigi-btn-primary gigi-btn-primary-lg gigi-focus inline-flex items-center gap-2 rounded-lg font-medium"
        >
          <Check className="h-4 w-4" strokeWidth={2.2} />
          {MISSION_ACTION_LABELS.complete}
        </button>
        <span className="text-[13px] text-text-muted">{MISSION_ACTION_LABELS.inProgressHint}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <button
        type="button"
        onClick={onStart}
        className="gigi-btn-primary gigi-btn-primary-lg gigi-focus inline-flex items-center gap-2 rounded-lg font-medium"
      >
        {MISSION_ACTION_LABELS.start}
        <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
      </button>
      <span className="text-[13px] text-text-muted">{MISSION_ACTION_LABELS.recommendedHint}</span>
      <button
        type="button"
        onClick={onPostpone}
        className="gigi-btn gigi-focus rounded-lg px-3.5 py-2.5 text-[14px]"
      >
        {MISSION_ACTION_LABELS.postpone}
      </button>
      <button
        type="button"
        onClick={onReject}
        className="gigi-btn gigi-focus rounded-lg px-3.5 py-2.5 text-[14px]"
      >
        {MISSION_ACTION_LABELS.reject}
      </button>
    </div>
  );
}
