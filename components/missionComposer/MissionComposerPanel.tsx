"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  getActiveDailyPriorityMission,
  generateMissionComposerSummary,
  missionComposerPolicyNotes,
  MISSION_COMPOSER_TEMPLATES,
  createMissionCandidateFromProject,
  selectDailyPriorityMission,
  convertMissionToGuidedActionFlow,
  updateDailyPriorityMissionStatus,
} from "@/modules/missionComposer";
import { useIsClient } from "@/components/settings/useIsClient";
import { MissionComposerBadges, MissionComposerDisclaimer } from "./MissionComposerDisclaimer";
import { MissionComposerStats } from "./MissionComposerStats";
import { DailyPriorityMissionCard } from "./DailyPriorityMissionCard";
import { MissionCandidateList } from "./MissionCandidateList";
import { MissionComposerProjectStrip } from "./MissionComposerProjectStrip";
import { MissionReviewComposerEmbed } from "@/components/missionReview/MissionReviewComposerEmbed";

interface MissionComposerPanelProps {
  projects: Array<{ id: string; name: string }>;
}

export function MissionComposerPanel({ projects }: MissionComposerPanelProps) {
  const isClient = useIsClient();
  const router = useRouter();
  const [revision, setRevision] = useState(0);
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id ?? "");

  const refresh = useCallback(() => setRevision((r) => r + 1), []);

  const summary = useMemo(() => {
    if (!isClient) return null;
    void revision;
    return generateMissionComposerSummary();
  }, [isClient, revision]);

  const daily = useMemo(() => {
    if (!isClient) return undefined;
    void revision;
    return getActiveDailyPriorityMission();
  }, [isClient, revision]);

  if (!isClient || !summary) return null;

  const selectedProject = projects.find((p) => p.id === selectedProjectId) ?? projects[0];
  const policyNotes = missionComposerPolicyNotes();

  function handleCreateTemplate(templateId: string) {
    if (!selectedProject) return;
    const candidate = createMissionCandidateFromProject({
      projectId: selectedProject.id,
      projectName: selectedProject.name,
      templateId,
    });
    selectDailyPriorityMission(candidate.id);
    refresh();
  }

  function handleConvertDaily() {
    if (!daily) return;
    const result = convertMissionToGuidedActionFlow(undefined, daily.id);
    refresh();
    if (result?.flow) router.push(`/guided-actions?flow=${result.flow.id}`);
  }

  function handleCompleteDaily() {
    if (!daily) return;
    updateDailyPriorityMissionStatus(daily.id, "completed_by_human");
    refresh();
  }

  return (
    <div className="gigi-page-shell animate-fade-in">
      <div className="gigi-page-spotlight" aria-hidden />
      <div className="gigi-page-content">
        <PageHeader
          title="Composer la mission du jour"
          meta="Choisis une seule mission prioritaire. Gigi t'aide à la transformer en parcours guidé, sans rien lancer automatiquement."
        />

        <section className="gigi-panel-raised mb-6 rounded-xl border border-emerald-500/30 p-5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-200/90">
            V4.7 · Project Mission Composer
          </p>
          <MissionComposerBadges className="mt-3" />
          <MissionComposerDisclaimer className="mt-3" />
          <p className="mt-3 text-[13px] text-text-secondary">{summary.summaryText}</p>
          <MissionComposerStats revision={revision} />
        </section>

        <section className="mb-6">
          <h2 className="text-[14px] font-semibold text-text-primary">1. Mission du jour</h2>
          {daily ? (
            <div className="mt-3 space-y-3">
              <DailyPriorityMissionCard mission={daily} />
              <div className="flex flex-wrap gap-2">
                {daily.status !== "converted_to_guided_flow" && (
                  <button
                    type="button"
                    onClick={handleConvertDaily}
                    className="gigi-btn-secondary gigi-focus rounded-lg px-3 py-1.5 text-[12px] font-medium"
                  >
                    Transformer en parcours guidé
                  </button>
                )}
                {daily.status !== "completed_by_human" && (
                  <button
                    type="button"
                    onClick={handleCompleteDaily}
                    className="gigi-focus rounded-lg border border-border/40 px-3 py-1.5 text-[12px] text-text-muted"
                  >
                    Marquer terminée (humain)
                  </button>
                )}
                {daily.linkedGuidedFlowId && (
                  <Link
                    href={`/guided-actions?flow=${daily.linkedGuidedFlowId}`}
                    className="gigi-focus text-[12px] text-accent-soft hover:underline"
                  >
                    Voir parcours guidé →
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <p className="mt-2 text-[13px] text-text-secondary">
              Aucune mission du jour — choisis une candidate ci-dessous ou crée-en une depuis un
              projet.
            </p>
          )}
        </section>

        <MissionReviewComposerEmbed />

        <section className="mb-6">
          <h2 className="text-[14px] font-semibold text-text-primary">2. Missions possibles</h2>
          <MissionCandidateList revision={revision} onRefresh={refresh} />
        </section>

        <section className="mb-6">
          <h2 className="text-[14px] font-semibold text-text-primary">
            3. Créer une candidate (action explicite)
          </h2>
          {projects.length > 1 && (
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="gigi-focus mt-2 rounded-lg border border-border/40 bg-surface-2/30 px-3 py-1.5 text-[12px] text-text-primary"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          )}
          <ul className="mt-3 space-y-2">
            {MISSION_COMPOSER_TEMPLATES.map((t) => (
              <li
                key={t.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/30 px-3 py-2.5"
              >
                <div>
                  <p className="text-[12.5px] font-medium text-text-primary">{t.title}</p>
                  <p className="text-[11px] text-text-muted">{t.outcome}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCreateTemplate(t.id)}
                  disabled={!selectedProject}
                  className="gigi-btn-secondary gigi-focus shrink-0 rounded-lg px-2.5 py-1 text-[11px] font-medium disabled:opacity-50"
                >
                  Créer et choisir comme mission du jour
                </button>
              </li>
            ))}
          </ul>
        </section>

        <div className="mb-6">
          <MissionComposerProjectStrip projects={projects} />
        </div>

        <section className="rounded-xl border border-border/30 p-4">
          <h2 className="text-[13px] font-medium text-text-primary">Rappels locaux</h2>
          <ul className="mt-2 list-inside list-disc text-[11.5px] text-text-muted">
            {policyNotes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
          <div className="mt-3 flex flex-wrap gap-3">
            <Link href="/guided-actions" className="gigi-focus text-[12px] text-accent-soft hover:underline">
              Parcours guidés V4.6 →
            </Link>
            <Link href="/projects" className="gigi-focus text-[12px] text-text-muted hover:underline">
              Projets →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
