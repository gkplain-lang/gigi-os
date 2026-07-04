import { ArrowRight, Check } from "lucide-react";
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
          className="gigi-btn-primary gigi-focus inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-[14px] font-medium"
        >
          <Check className="h-4 w-4" strokeWidth={2.2} />
          Terminer la mission
        </button>
        <span className="text-[13px] text-text-muted">Une seule chose à la fois.</span>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <button
        type="button"
        onClick={onStart}
        className="gigi-btn-primary gigi-focus inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-[14px] font-medium"
      >
        Démarrer la mission
        <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
      </button>
      <button
        type="button"
        onClick={onPostpone}
        className="gigi-btn gigi-focus rounded-lg px-3.5 py-2.5 text-[14px]"
      >
        Reporter
      </button>
      <button
        type="button"
        onClick={onReject}
        className="gigi-btn gigi-focus rounded-lg px-3.5 py-2.5 text-[14px]"
      >
        Pas maintenant
      </button>
    </div>
  );
}
