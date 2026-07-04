"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { ProjectList } from "@/components/projects/ProjectList";
import { useGigi } from "@/components/providers/GigiProvider";
import { REFINED_PAGE_META } from "@/modules/dailyUseRefinement";

export function ProjectsPageContent() {
  const { state, isHydrated, getMissionProjectLabel } = useGigi();

  if (!isHydrated) return null;

  const missionStatusLabel = getMissionProjectLabel(state.mission.projectId);

  return (
    <div className="gigi-page-shell animate-fade-in">
      <div className="gigi-page-spotlight" aria-hidden />
      <div className="gigi-page-content">
        <PageHeader title="Projets" meta={REFINED_PAGE_META.projects} />
        <ProjectList
        projects={state.projects}
        missionProjectId={state.mission.projectId}
        missionTitle={state.mission.title}
        missionStatusLabel={missionStatusLabel}
        />
      </div>
    </div>
  );
}
