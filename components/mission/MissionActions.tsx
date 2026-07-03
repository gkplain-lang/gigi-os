import type { MissionStatus } from "@/modules/missions/missionTypes";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { GhostButton } from "@/components/ui/GhostButton";

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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <PrimaryButton className="sm:w-auto" onClick={onComplete}>
          Terminer la mission
        </PrimaryButton>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <PrimaryButton className="sm:w-auto" onClick={onStart}>
        Démarrer la mission
      </PrimaryButton>
      <div className="flex items-center gap-1">
        <GhostButton onClick={onPostpone}>Reporter</GhostButton>
        <GhostButton onClick={onReject}>Pas maintenant</GhostButton>
      </div>
    </div>
  );
}
