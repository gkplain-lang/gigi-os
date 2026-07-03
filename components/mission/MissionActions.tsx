import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { GhostButton } from "@/components/ui/GhostButton";

export function MissionActions() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <PrimaryButton className="sm:w-auto">Démarrer la mission</PrimaryButton>
      <div className="flex items-center gap-1">
        <GhostButton>Reporter</GhostButton>
        <GhostButton>Pas maintenant</GhostButton>
      </div>
    </div>
  );
}
