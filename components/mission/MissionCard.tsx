import Link from "next/link";
import { MessageCircle } from "lucide-react";
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

const RESTING: Partial<Record<MissionStatus, { pill: string; title: string; body: string }>> = {
  postponed: {
    pill: "Reportée",
    title: "Mission reportée.",
    body: "Gigi garde cette priorité en mémoire. Elle reviendra au bon moment.",
  },
  rejected_for_now: {
    pill: "Pas maintenant",
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
  const resting = RESTING[mission.status];
  if (resting) {
    return (
      <div className="gigi-panel rounded-xl p-6">
        <StatusPill label={resting.pill} variant="muted" />
        <h2 className="mt-4 text-[1.4rem] font-semibold tracking-tight text-text-primary">
          {resting.title}
        </h2>
        <p className="mt-2.5 text-[14px] leading-relaxed text-text-secondary">{resting.body}</p>
        <p className="mt-4 text-[13px] text-text-muted">
          Concernée : <span className="text-text-secondary">{mission.title}</span>
        </p>
        <div className="mt-5">
          <Link
            href="/conversation"
            className="gigi-btn gigi-focus inline-flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-[14px]"
          >
            <MessageCircle className="h-4 w-4" />
            Demander une autre priorité
          </Link>
        </div>
      </div>
    );
  }

  const isActive = mission.status === "in_progress";

  return (
    <div className="gigi-panel rounded-xl p-6">
      <div className="flex flex-wrap items-center gap-2.5">
        {isActive ? (
          <span className="inline-flex items-center gap-1.5 rounded-md border border-[rgba(142,167,194,0.35)] bg-accent-dim px-2 py-0.5 text-[12px] font-medium text-accent-soft">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
            En cours
          </span>
        ) : (
          <StatusPill label="Mission du jour" variant="warm" />
        )}
        <span className="text-[13px] text-text-muted">{mission.projectName}</span>
      </div>

      <h2 className="mt-3.5 text-[1.5rem] font-semibold leading-[1.15] tracking-tight text-text-primary md:text-[1.7rem]">
        {mission.title}
      </h2>

      <p className="mt-2.5 text-[14.5px] leading-relaxed text-text-secondary">{mission.reason}</p>

      <div className="mt-5 border-t border-border pt-5">
        <MissionActions
          status={mission.status}
          onStart={onStart}
          onComplete={onComplete}
          onPostpone={onPostpone}
          onReject={onReject}
        />
      </div>
    </div>
  );
}
