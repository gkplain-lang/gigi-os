import type { Mission, MissionStatus } from "@/modules/missions/missionTypes";
import { StatusPill } from "@/components/ui/StatusPill";
import { MissionActions } from "./MissionActions";

interface MissionCardProps {
  mission: Mission;
  onStart: () => void;
  onComplete: () => void;
  onPostpone: () => void;
  onReject: () => void;
}

const STATUS_PILL: Partial<Record<MissionStatus, { label: string; variant: "warm" | "muted" }>> = {
  recommended: { label: "Mission du jour", variant: "warm" },
  in_progress: { label: "En cours", variant: "warm" },
  completed: { label: "Terminée", variant: "muted" },
  postponed: { label: "Reportée", variant: "muted" },
  rejected_for_now: { label: "Pas maintenant", variant: "muted" },
};

const STATUS_MESSAGE: Partial<Record<MissionStatus, string>> = {
  completed: "Mission terminée. Gigi pourra choisir la prochaine priorité.",
  postponed: "Mission reportée. Gigi garde cette priorité en mémoire.",
  rejected_for_now: "Pas maintenant. Gigi peut proposer une autre priorité.",
};

export function MissionCard({
  mission,
  onStart,
  onComplete,
  onPostpone,
  onReject,
}: MissionCardProps) {
  const pill = STATUS_PILL[mission.status] ?? STATUS_PILL.recommended!;
  const statusMessage = STATUS_MESSAGE[mission.status];
  const showActions = mission.status === "recommended" || mission.status === "in_progress";

  return (
    <section className="relative">
      <div className="gigi-halo" aria-hidden />

      <div className="relative z-10 max-w-3xl">
        <div className="flex items-center gap-3">
          <StatusPill label={pill.label} variant={pill.variant} />
          <span className="text-sm text-text-muted">{mission.projectName}</span>
        </div>

        <h2 className="mt-7 font-display text-[2.3rem] font-medium leading-[1.08] tracking-tight text-text-primary md:text-[3.4rem]">
          {mission.title}
        </h2>

        <p className="mt-6 max-w-xl text-lg leading-relaxed text-text-secondary">
          {mission.reason}
        </p>

        {!statusMessage && (
          <p className="mt-4 text-base text-text-muted">Le reste peut attendre.</p>
        )}

        {statusMessage && (
          <p className="mt-6 text-lg leading-relaxed text-text-secondary">{statusMessage}</p>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-text-muted">
          <span>{mission.estimatedDuration}</span>
          <span className="text-text-muted/40">·</span>
          <span>Impact {mission.expectedImpact.toLowerCase()}</span>
          <span className="text-text-muted/40">·</span>
          <span>
            Confiance <span className="text-copper-soft">{mission.confidence}%</span>
          </span>
        </div>

        {showActions && (
          <div className="mt-10">
            <MissionActions
              status={mission.status}
              onStart={onStart}
              onComplete={onComplete}
              onPostpone={onPostpone}
              onReject={onReject}
            />
          </div>
        )}
      </div>
    </section>
  );
}
