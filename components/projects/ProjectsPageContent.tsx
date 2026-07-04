"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { ProjectList } from "@/components/projects/ProjectList";
import { useGigi } from "@/components/providers/GigiProvider";

export function ProjectsPageContent() {
  const { state, isHydrated, getMissionProjectLabel } = useGigi();

  if (!isHydrated) return null;

  const missionStatusLabel = getMissionProjectLabel(state.mission.projectId);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Projets"
        meta="Ton portefeuille. Gigi a déjà choisi la mission du jour — le reste attend son tour."
      />
      <ProjectList
        projects={state.projects}
        missionProjectId={state.mission.projectId}
        missionTitle={state.mission.title}
        missionStatusLabel={missionStatusLabel}
      />
    </div>
  );
}
