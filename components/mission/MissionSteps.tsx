import type { Mission } from "@/modules/missions/missionTypes";
import { GlassCard } from "@/components/ui/GlassCard";

interface MissionStepsProps {
  mission: Mission;
}

export function MissionSteps({ mission }: MissionStepsProps) {
  if (!mission.steps?.length) return null;

  return (
    <GlassCard className="mt-8 p-6">
      <p className="text-xs font-medium uppercase tracking-widest text-text-muted">
        Étapes de la mission
      </p>
      <ul className="mt-4 space-y-3">
        {mission.steps.map((step) => (
          <li key={step} className="flex items-start gap-3 text-sm text-text-secondary">
            <span className="mt-0.5 h-4 w-4 shrink-0 rounded border border-white/20" />
            {step}
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}
