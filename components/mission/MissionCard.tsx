import { Check } from "lucide-react";
import type { Mission, MissionStatus } from "@/modules/missions/missionTypes";
import { StatusPill } from "@/components/ui/StatusPill";
import { GigiOrb } from "@/components/ui/GigiOrb";
import { MissionActions } from "./MissionActions";

interface MissionCardProps {
  mission: Mission;
  onStart: () => void;
  onComplete: () => void;
  onPostpone: () => void;
  onReject: () => void;
}

const RESTING_MESSAGE: Partial<Record<MissionStatus, { title: string; body: string }>> = {
  postponed: {
    title: "Mission reportée.",
    body: "Gigi garde cette priorité en mémoire. Elle reviendra quand ce sera le bon moment.",
  },
  rejected_for_now: {
    title: "Pas maintenant.",
    body: "Gigi peut proposer une autre priorité. Rien n'est perdu.",
  },
};

export function MissionCard({
  mission,
  onStart,
  onComplete,
  onPostpone,
  onReject,
}: MissionCardProps) {
  // Victory state — a small, calm win.
  if (mission.status === "completed") {
    return (
      <section className="relative">
        <div className="gigi-halo" aria-hidden />
        <div className="relative z-10 max-w-2xl">
          <div className="animate-victory flex items-center gap-4">
            <span className="relative flex h-14 w-14 items-center justify-center">
              <GigiOrb size="lg" tone="done" className="absolute inset-0" />
              <Check className="relative z-10 h-6 w-6 text-[#0a1410]" strokeWidth={3} />
            </span>
            <StatusPill label="Terminée" variant="muted" />
          </div>

          <h2 className="animate-rise animate-rise-1 mt-8 font-display text-[2.2rem] font-medium leading-[1.1] tracking-tight text-text-primary md:text-[3rem]">
            Mission accomplie.
          </h2>

          <p className="animate-rise animate-rise-2 mt-5 text-lg leading-relaxed text-text-secondary">
            {mission.title}
          </p>

          <p className="animate-rise animate-rise-3 mt-6 text-base leading-relaxed text-text-muted">
            Gigi pourra choisir la prochaine priorité. Pour aujourd&apos;hui, tu as fait ce qui
            comptait le plus.
          </p>
        </div>
      </section>
    );
  }

  // Calm resting states — postponed / rejected.
  const resting = RESTING_MESSAGE[mission.status];
  if (resting) {
    return (
      <section className="relative">
        <div className="gigi-halo-soft" aria-hidden />
        <div className="relative z-10 max-w-2xl">
          <StatusPill
            label={mission.status === "postponed" ? "Reportée" : "Pas maintenant"}
            variant="muted"
          />
          <h2 className="mt-7 font-display text-[2rem] font-medium leading-[1.12] tracking-tight text-text-primary md:text-[2.6rem]">
            {resting.title}
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-text-secondary">
            {resting.body}
          </p>
          <p className="mt-8 text-base text-text-muted">
            <span className="text-text-secondary">{mission.title}</span>
          </p>
        </div>
      </section>
    );
  }

  // Active states — recommended / in_progress. The hero.
  const isActive = mission.status === "in_progress";

  return (
    <section className="relative">
      <div className="gigi-halo" aria-hidden />

      <div className="relative z-10 max-w-2xl">
        <div className="animate-rise flex flex-wrap items-center gap-3">
          {isActive ? (
            <span className="gigi-active-ring ml-4 text-[13px] font-medium uppercase tracking-wide text-copper-soft">
              Mission en cours
            </span>
          ) : (
            <StatusPill label="Mission du jour" variant="warm" />
          )}
          <span className="text-sm text-text-muted">{mission.projectName}</span>
        </div>

        <h2 className="animate-rise animate-rise-1 mt-7 font-display text-[2.4rem] font-medium leading-[1.05] tracking-tight text-text-primary md:text-[3.6rem] md:leading-[1.02]">
          {mission.title}
        </h2>

        <p className="animate-rise animate-rise-2 mt-6 max-w-xl text-lg leading-relaxed text-text-secondary">
          {mission.reason}
        </p>

        {!isActive && (
          <p className="animate-rise animate-rise-2 mt-3 text-base text-text-muted">
            Le reste peut attendre.
          </p>
        )}

        <div className="animate-rise animate-rise-3 mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-text-muted">
          <span>{mission.estimatedDuration}</span>
          <span className="text-text-muted/40">·</span>
          <span>Impact {mission.expectedImpact.toLowerCase()}</span>
          <span className="text-text-muted/40">·</span>
          <span>
            Confiance <span className="text-copper-soft">{mission.confidence}%</span>
          </span>
        </div>

        <div className="animate-rise animate-rise-4 mt-10">
          <MissionActions
            status={mission.status}
            onStart={onStart}
            onComplete={onComplete}
            onPostpone={onPostpone}
            onReject={onReject}
          />
        </div>
      </div>
    </section>
  );
}
