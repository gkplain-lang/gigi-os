"use client";

import Link from "next/link";
import { useMemo } from "react";
import { getActiveDailyPriorityMission } from "@/modules/missionComposer";
import { getLatestMissionReview } from "@/modules/missionReview";
import { useIsClient } from "@/components/settings/useIsClient";

interface MissionReviewHomePanelProps {
  className?: string;
}

export function MissionReviewHomePanel({ className }: MissionReviewHomePanelProps) {
  const isClient = useIsClient();

  const daily = useMemo(() => {
    if (!isClient) return undefined;
    return getActiveDailyPriorityMission();
  }, [isClient]);

  const latest = useMemo(() => {
    if (!isClient) return undefined;
    return getLatestMissionReview();
  }, [isClient]);

  if (!isClient) return null;

  return (
    <section
      className={`rounded-xl border border-violet-500/30 bg-violet-500/[0.05] p-5 ${className ?? ""}`}
      aria-label="Revue de mission"
    >
      <p className="text-[10px] font-semibold uppercase tracking-wider text-violet-200/90">
        Boucle quotidienne · V4.8
      </p>
      <h2 className="mt-1 text-[15px] font-semibold text-text-primary">Revue de mission</h2>
      <p className="mt-1 text-[12.5px] text-text-secondary">
        Fais le bilan de la mission du jour, puis choisis la décision suivante — local uniquement,
        validation humaine obligatoire.
      </p>

      {daily ? (
        <p className="mt-3 text-[12.5px] text-text-secondary">
          Mission à revoir : <span className="font-medium text-text-primary">{daily.title}</span>
          {daily.projectName ? ` · ${daily.projectName}` : ""}
        </p>
      ) : (
        <p className="mt-3 text-[12px] text-text-muted">
          Aucune mission du jour —{" "}
          <Link href="/mission-composer" className="text-accent-soft hover:underline">
            composer une mission
          </Link>{" "}
          d&apos;abord.
        </p>
      )}

      {latest && (
        <p className="mt-2 text-[12px] text-text-muted">
          Dernière décision :{" "}
          <span className="text-accent-soft">{latest.recommendedNextAction}</span>
        </p>
      )}

      <Link
        href="/mission-review"
        className="gigi-focus mt-4 inline-flex rounded-lg bg-violet-500/15 px-4 py-2 text-[12.5px] font-medium text-violet-100 hover:bg-violet-500/25"
      >
        Faire la revue de mission →
      </Link>
    </section>
  );
}
