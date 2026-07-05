"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import {
  getActiveDailyPriorityMission,
  getStaticMissionSuggestions,
  createMissionCandidateFromProject,
} from "@/modules/missionComposer";
import { useIsClient } from "@/components/settings/useIsClient";
import { DailyPriorityMissionCard } from "./DailyPriorityMissionCard";

interface MissionComposerHomePanelProps {
  projects: Array<{ id: string; name: string }>;
  className?: string;
}

export function MissionComposerHomePanel({ projects, className }: MissionComposerHomePanelProps) {
  const isClient = useIsClient();
  const [revision, setRevision] = useState(0);
  const refresh = useCallback(() => setRevision((r) => r + 1), []);

  const daily = useMemo(() => {
    if (!isClient) return undefined;
    void revision;
    return getActiveDailyPriorityMission();
  }, [isClient, revision]);

  const firstProject = projects[0];
  const staticSuggestions = firstProject
    ? getStaticMissionSuggestions(firstProject.id, firstProject.name)
    : [];

  if (!isClient) return null;

  function handleCreateFromSuggestion(templateId: string, projectId: string, projectName: string) {
    createMissionCandidateFromProject({ projectId, projectName, templateId });
    refresh();
  }

  return (
    <section
      className={`rounded-xl border border-emerald-500/30 bg-emerald-500/[0.06] p-5 ${className ?? ""}`}
      aria-label="Composer la mission du jour"
    >
      <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-200/90">
        Mission-first · V4.7
      </p>
      <h2 className="mt-1 text-[15px] font-semibold text-text-primary">
        Composer la mission du jour
      </h2>
      <p className="mt-1 text-[12.5px] text-text-secondary">
        Choisis une seule mission prioritaire. Gigi t&apos;aide à la transformer en parcours guidé,
        sans rien lancer automatiquement. Aegis avance mieux quand une seule mission est choisie.
      </p>

      {daily ? (
        <div className="mt-4">
          <DailyPriorityMissionCard mission={daily} compact />
        </div>
      ) : (
        <>
          <p className="mt-4 text-[11px] font-medium uppercase tracking-wider text-text-muted">
            Missions possibles (suggestions — non persistées)
          </p>
          <ul className="mt-2 space-y-2">
            {staticSuggestions.map((s) => (
              <li
                key={s.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/30 px-3 py-2"
              >
                <div>
                  <p className="text-[12.5px] font-medium text-text-primary">{s.title}</p>
                  <p className="text-[11px] text-text-muted">
                    {s.projectName} · {s.outcome}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleCreateFromSuggestion(s.id, s.projectId, s.projectName)
                  }
                  className="gigi-btn-secondary gigi-focus shrink-0 rounded-lg px-2.5 py-1 text-[11px] font-medium"
                >
                  Créer candidate
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      <Link
        href="/mission-composer"
        className="gigi-focus mt-4 inline-flex rounded-lg bg-emerald-500/15 px-4 py-2 text-[12.5px] font-medium text-emerald-100 hover:bg-emerald-500/25"
      >
        Composer la mission du jour →
      </Link>
    </section>
  );
}
