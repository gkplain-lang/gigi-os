import { mockProjects } from "@/data/mockProjects";
import type { Project } from "@/modules/projects/projectTypes";
import type { GigiLocalState } from "@/modules/storage/gigiStateTypes";

export interface RestoreStarterProjectsResult {
  ok: boolean;
  addedCount: number;
  backupOk: boolean;
  backupKey?: string;
  error?: string;
}

export function mergeMissingStarterProjects(existing: Project[]): {
  projects: Project[];
  addedCount: number;
  addedIds: string[];
} {
  const existingIds = new Set(existing.map((p) => p.id));
  const existingNames = new Set(existing.map((p) => p.name.toLowerCase().trim()));

  const toAdd = mockProjects.filter(
    (p) => !existingIds.has(p.id) && !existingNames.has(p.name.toLowerCase().trim())
  );

  return {
    projects: [...existing, ...toAdd.map((p) => ({ ...p }))],
    addedCount: toAdd.length,
    addedIds: toAdd.map((p) => p.id),
  };
}

export function restoreStarterProjectsState(state: GigiLocalState): {
  state: GigiLocalState;
  addedCount: number;
  addedIds: string[];
} {
  const { projects, addedCount, addedIds } = mergeMissingStarterProjects(state.projects);
  return {
    state: { ...state, projects },
    addedCount,
    addedIds,
  };
}

export const STARTER_PROJECTS_RESTORE_HINT =
  "Cette action ajoute les projets de départ manquants. Elle ne supprime pas tes données.";

export const ONBOARDING_RESET_HINT =
  "Remet uniquement l'onboarding à zéro. Projets, historique et mission sont conservés.";
