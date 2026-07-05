"use client";

import { MissionComposerPanel } from "@/components/missionComposer/MissionComposerPanel";
import { useGigi } from "@/components/providers/GigiProvider";

export function MissionComposerPageContent() {
  const { state, isHydrated } = useGigi();

  if (!isHydrated) return null;

  const projects = state.projects.map((p) => ({ id: p.id, name: p.name }));

  return <MissionComposerPanel projects={projects} />;
}
