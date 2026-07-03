import type { Mission } from "@/modules/missions/missionTypes";
import { GlassCard } from "@/components/ui/GlassCard";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { MissionSteps } from "./MissionSteps";

interface MissionModePreviewProps {
  mission: Mission;
}

export function MissionModePreview({ mission }: MissionModePreviewProps) {
  return (
    <div className="mt-12 animate-fade-in">
      <p className="mb-4 text-xs font-medium uppercase tracking-widest text-text-muted">
        Aperçu mode mission
      </p>
      <GlassCard variant="surface" className="p-6 md:p-8">
        <p className="text-xs text-copper-soft">Exécution focalisée</p>
        <h3 className="mt-2 text-xl font-medium text-text-primary">{mission.title}</h3>
        <p className="mt-1 text-sm text-text-muted">{mission.projectName}</p>
        <p className="mt-4 text-sm text-text-secondary">
          Durée estimée : {mission.estimatedDuration}
        </p>
        <MissionSteps mission={mission} />
        <div className="mt-6 flex gap-3">
          <PrimaryButton className="flex-1">Terminer la mission</PrimaryButton>
          <button
            type="button"
            className="rounded-xl px-4 py-2 text-sm text-text-muted hover:text-text-secondary"
          >
            Quitter
          </button>
        </div>
      </GlassCard>
    </div>
  );
}
