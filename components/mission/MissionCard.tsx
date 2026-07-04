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
      <div className="gigi-command-card rounded-xl p-6 pl-7">
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
            className="gigi-btn-primary gigi-focus inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-[14px] font-medium"
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
    <div className="gigi-hero-card p-6 pl-8 md:p-8 md:pl-10">
      <div
        className="pointer-events-none absolute -left-16 -top-20 h-52 w-52 rounded-full bg-accent/22 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-10 top-2 h-40 w-40 rounded-full bg-accent-2/12 blur-3xl"
        aria-hidden
      />

      <div className="relative flex flex-wrap items-center gap-2.5">
        {isActive ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(124,140,255,0.6)] bg-[rgba(124,140,255,0.22)] px-3.5 py-1 text-[12px] font-semibold text-white shadow-[0_0_20px_-4px_rgba(124,140,255,0.75)]">
            <span
              className="h-2 w-2 animate-pulse rounded-full bg-accent-soft shadow-[0_0_10px_rgba(165,180,252,1)]"
              aria-hidden
            />
            En cours
          </span>
        ) : (
          <StatusPill label="Mission du jour" variant="warm" />
        )}
        <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-0.5 text-[12px] font-medium text-accent-soft/90">
          {mission.projectName}
        </span>
        <span className="ml-auto hidden text-[12px] tabular-nums text-text-muted sm:block">
          {mission.estimatedDuration}
        </span>
      </div>

      <h2 className="relative mt-5 max-w-2xl text-[1.75rem] font-bold leading-[1.1] tracking-tight text-text-primary md:text-[2.15rem]">
        {mission.title}
      </h2>

      <p className="relative mt-3 max-w-xl text-[15px] leading-relaxed text-text-secondary">
        {mission.reason}
      </p>

      <div className="relative mt-7 rounded-xl border border-[rgba(124,140,255,0.28)] bg-[rgba(8,12,22,0.45)] p-4 backdrop-blur-[3px] md:p-5">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-accent-soft/80">
          Action principale
        </p>
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
