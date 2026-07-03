"use client";

import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProjectList } from "@/components/projects/ProjectList";
import { useGigi } from "@/components/providers/GigiProvider";

export function ProjectsPageContent() {
  const { state, isHydrated, getMissionProjectLabel } = useGigi();

  if (!isHydrated) return null;

  const missionStatusLabel = getMissionProjectLabel("buildy-clear");

  return (
    <div>
      <SectionHeader
        title="Projets"
        subtitle="Juste pour te situer. Gigi a déjà choisi la mission du jour — le reste attend son tour."
      />
      <ProjectList
        projects={state.projects}
        missionProjectId={state.mission.projectId}
        missionStatusLabel={missionStatusLabel}
      />
    </div>
  );
}
