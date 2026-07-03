import type { Mission } from "@/modules/missions/missionTypes";
import { StatusPill } from "@/components/ui/StatusPill";
import { MissionActions } from "./MissionActions";

interface MissionCardProps {
  mission: Mission;
}

export function MissionCard({ mission }: MissionCardProps) {
  return (
    <section className="relative">
      <div className="gigi-halo" aria-hidden />

      <div className="relative z-10 max-w-3xl">
        <div className="flex items-center gap-3">
          <StatusPill label="Mission du jour" variant="warm" />
          <span className="text-sm text-text-muted">{mission.projectName}</span>
        </div>

        <h2 className="mt-7 font-display text-[2.3rem] font-medium leading-[1.08] tracking-tight text-text-primary md:text-[3.4rem]">
          {mission.title}
        </h2>

        <p className="mt-6 max-w-xl text-lg leading-relaxed text-text-secondary">
          {mission.reason}
        </p>

        <p className="mt-4 text-base text-text-muted">Le reste peut attendre.</p>

        <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-text-muted">
          <span>{mission.estimatedDuration}</span>
          <span className="text-text-muted/40">·</span>
          <span>Impact {mission.expectedImpact.toLowerCase()}</span>
          <span className="text-text-muted/40">·</span>
          <span>
            Confiance <span className="text-copper-soft">{mission.confidence}%</span>
          </span>
        </div>

        <div className="mt-10">
          <MissionActions />
        </div>
      </div>
    </section>
  );
}
