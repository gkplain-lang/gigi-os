"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  createGuidedProjectActionFlow,
  getGuidedProjectActionFlowById,
  listGuidedProjectActionFlows,
} from "@/modules/executionExperience/guidedActionBuilder";
import { generateGuidedActionSummary } from "@/modules/executionExperience/guidedActionSummary";
import { guidedActionPolicyNotes } from "@/modules/executionExperience/guidedActionPolicy";
import { useIsClient } from "@/components/settings/useIsClient";
import { GuidedActionBadges } from "./GuidedActionDisclaimer";
import { GuidedActionDisclaimer } from "./GuidedActionDisclaimer";
import { GuidedActionSummaryStats } from "./GuidedActionSummaryStats";
import { GuidedActionTemplateGallery } from "./GuidedActionTemplateGallery";
import { GuidedActionFlowList } from "./GuidedActionFlowList";
import { GuidedActionFlowDetail } from "./GuidedActionFlowDetail";
import { getActiveDailyPriorityMission } from "@/modules/missionComposer";

export function GuidedActionFlowPanel() {
  const isClient = useIsClient();
  const searchParams = useSearchParams();
  const flowFromUrl = searchParams.get("flow");
  const projectId = searchParams.get("projectId");
  const projectName = searchParams.get("projectName");
  const templateFromUrl = searchParams.get("template");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const effectiveSelectedId = selectedId ?? flowFromUrl;
  const [revision, setRevision] = useState(0);

  const refresh = useCallback(() => setRevision((r) => r + 1), []);

  const summary = useMemo(() => {
    if (!isClient) return null;
    void revision;
    return generateGuidedActionSummary();
  }, [isClient, revision]);

  const flows = useMemo(() => {
    if (!isClient) return [];
    void revision;
    return listGuidedProjectActionFlows();
  }, [isClient, revision]);

  const selected = useMemo(() => {
    if (!effectiveSelectedId) return null;
    void revision;
    return getGuidedProjectActionFlowById(effectiveSelectedId) ?? null;
  }, [effectiveSelectedId, revision]);

  if (!isClient || !summary) return null;

  const dailyMission = getActiveDailyPriorityMission();

  function handleCreateFromTemplate(templateId: string) {
    const flow = createGuidedProjectActionFlow({
      templateId,
      projectId: projectId ?? undefined,
      projectName: projectName ?? undefined,
      source: projectId ? "project" : "template",
    });
    setSelectedId(flow.id);
    refresh();
  }

  return (
    <div className="gigi-page-shell animate-fade-in">
      <div className="gigi-page-spotlight" aria-hidden />
      <div className="gigi-page-content">
        <PageHeader
          title="Parcours d'action guidée"
          meta="Choisis une action liée à ton projet. Gigi la prépare étape par étape, sans rien lancer automatiquement."
        />

        <section className="gigi-panel-raised mb-6 rounded-xl border border-indigo-500/30 p-5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-200/90">
            V4.6 · Guided Project Action Flow
          </p>
          <GuidedActionBadges className="mt-3" />
          <p className="mt-3 text-[13px] leading-relaxed text-text-secondary">
            Parcours guidé local — mission, permission, pont manuel, pack de commandes et revue
            locale. Tu valides chaque étape, tu copies, tu lances toi-même.
          </p>
          <GuidedActionDisclaimer className="mt-3" />
          <ul className="mt-3 space-y-1 text-[11.5px] text-text-muted">
            {guidedActionPolicyNotes().map((note) => (
              <li key={note}>· {note}</li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/actions" className="gigi-btn-secondary gigi-focus inline-flex rounded-lg px-3.5 py-2 text-[12.5px] font-medium">
              Centre d&apos;action →
            </Link>
            <Link href="/projects" className="gigi-focus inline-flex text-[12.5px] font-medium text-accent-soft hover:underline">
              Projets →
            </Link>
          </div>
        </section>

        {dailyMission && (
          <section className="mb-6 rounded-xl border border-emerald-500/25 bg-emerald-500/[0.04] p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-200/90">
              Partir d&apos;une mission · V4.7
            </p>
            <p className="mt-2 text-[13px] text-text-secondary">
              Mission du jour : « {dailyMission.title} » ({dailyMission.projectName}). Tu peux la
              transformer en parcours guidé — action explicite, aucune exécution réelle.
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              <Link
                href="/mission-composer"
                className="gigi-focus text-[12.5px] font-medium text-accent-soft hover:underline"
              >
                Mission du jour →
              </Link>
              {dailyMission.linkedGuidedFlowId && (
                <Link
                  href={`/guided-actions?flow=${dailyMission.linkedGuidedFlowId}`}
                  className="gigi-focus text-[12.5px] text-text-muted hover:underline"
                >
                  Parcours lié →
                </Link>
              )}
            </div>
          </section>
        )}

        <GuidedActionSummaryStats summary={summary} className="mb-6" />

        <GuidedActionTemplateGallery
          onCreate={handleCreateFromTemplate}
          limit={templateFromUrl ? undefined : undefined}
        />

        <div className="mb-8 mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <div>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
              Parcours existants
            </p>
            <GuidedActionFlowList
              flows={flows}
              selectedId={effectiveSelectedId}
              onSelect={setSelectedId}
            />
          </div>
          <div className="gigi-panel rounded-xl p-5 md:p-6">
            {selected ? (
              <GuidedActionFlowDetail flow={selected} onUpdated={refresh} />
            ) : (
              <p className="text-[13px] text-text-secondary">
                Sélectionne un parcours — objectif, étapes, liens V4 et journal local.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
