"use client";

import { useCallback, useState } from "react";
import {
  MISSION_COMPOSER_TEMPLATES,
  createMissionCandidateFromProject,
  listMissionCandidatesByProject,
} from "@/modules/missionComposer";
import { MissionCandidateList } from "./MissionCandidateList";

interface MissionComposerProjectSectionProps {
  projectId: string;
  projectName: string;
}

export function MissionComposerProjectSection({
  projectId,
  projectName,
}: MissionComposerProjectSectionProps) {
  const [revision, setRevision] = useState(0);
  const refresh = useCallback(() => setRevision((r) => r + 1), []);

  void revision;
  const existing = listMissionCandidatesByProject(projectId);

  function handleCreate(templateId: string) {
    createMissionCandidateFromProject({ projectId, projectName, templateId });
    refresh();
  }

  return (
    <section className="gigi-panel-raised rounded-xl border border-emerald-500/20 p-5">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-200/90">
        Missions possibles · V4.7
      </p>
      <p className="mt-2 text-[13px] text-text-secondary">
        Choisis ou compose une mission prioritaire pour {projectName} — local uniquement, aucune
        exécution réelle.
      </p>

      {existing.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-text-muted">
            Candidates persistées
          </p>
          <MissionCandidateList
            projectId={projectId}
            revision={revision}
            onRefresh={refresh}
          />
        </div>
      )}

      <p className="mt-4 text-[11px] font-medium uppercase tracking-wider text-text-muted">
        Créer une candidate (action explicite)
      </p>
      <ul className="mt-2 space-y-2">
        {MISSION_COMPOSER_TEMPLATES.slice(0, 4).map((t) => (
          <li
            key={t.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/30 px-3 py-2"
          >
            <div>
              <p className="text-[12.5px] font-medium text-text-primary">{t.title}</p>
              <p className="text-[11px] text-text-muted">{t.outcome}</p>
            </div>
            <button
              type="button"
              onClick={() => handleCreate(t.id)}
              className="gigi-btn-secondary gigi-focus shrink-0 rounded-lg px-2.5 py-1 text-[11px] font-medium"
            >
              Créer candidate
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
