"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { DailyPriorityMission } from "@/modules/missionComposer";
import { MissionStatusBadge } from "./MissionStatusBadge";

interface DailyPriorityMissionCardProps {
  mission: DailyPriorityMission;
  compact?: boolean;
}

export function DailyPriorityMissionCard({
  mission,
  compact = false,
}: DailyPriorityMissionCardProps) {
  const router = useRouter();

  function goGuided() {
    if (mission.linkedGuidedFlowId) {
      router.push(`/guided-actions?flow=${mission.linkedGuidedFlowId}`);
    } else {
      router.push("/guided-actions");
    }
  }

  return (
    <article
      className={`rounded-xl border border-emerald-500/30 bg-emerald-500/[0.05] ${compact ? "p-4" : "p-5"}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-200/90">
            Mission du jour · V4.7
          </p>
          <h3 className="mt-1 text-[15px] font-semibold text-text-primary">{mission.title}</h3>
          {!compact && (
            <p className="mt-1 text-[12.5px] text-text-secondary">{mission.description}</p>
          )}
        </div>
        <MissionStatusBadge status={mission.status} variant="daily" />
      </div>

      <dl className="mt-3 grid gap-2 text-[12px] sm:grid-cols-2">
        <div>
          <dt className="text-text-muted">Projet</dt>
          <dd className="font-medium text-text-primary">{mission.projectName}</dd>
        </div>
        <div>
          <dt className="text-text-muted">Outcome</dt>
          <dd className="font-medium text-text-primary">{mission.outcome}</dd>
        </div>
      </dl>

      {!compact && (
        <p className="mt-2 text-[11.5px] text-text-muted">
          <span className="font-medium text-text-secondary">Pourquoi :</span> {mission.selectedReason}
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {mission.status === "converted_to_guided_flow" ? (
          <button
            type="button"
            onClick={goGuided}
            className="gigi-btn-secondary gigi-focus rounded-lg px-3 py-1.5 text-[12px] font-medium"
          >
            Voir le parcours guidé
          </button>
        ) : (
          <Link
            href="/mission-composer"
            className="gigi-btn-secondary gigi-focus inline-flex rounded-lg px-3 py-1.5 text-[12px] font-medium"
          >
            Gérer la mission
          </Link>
        )}
        <Link
          href={`/projects/${encodeURIComponent(mission.projectId)}`}
          className="gigi-focus rounded-lg px-3 py-1.5 text-[12px] text-text-muted hover:text-text-secondary"
        >
          Voir le projet
        </Link>
      </div>
    </article>
  );
}
