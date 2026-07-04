import { mockProjects } from "@/data/mockProjects";
import type { Project } from "@/modules/projects/projectTypes";

export const SUGGESTED_PROJECT_IDS = [
  "gigi-os",
  "buildy-crafts",
  "buildy-clear",
  "linko",
] as const;

export type SuggestedProjectId = (typeof SUGGESTED_PROJECT_IDS)[number];

export const SUGGESTED_PROJECT_LABELS: Record<SuggestedProjectId, string> = {
  "gigi-os": "Aegis",
  "buildy-crafts": "Buildy Crafts",
  "buildy-clear": "Buildy Clear",
  linko: "Linko",
};

export function getSuggestedProjectTemplates(): Project[] {
  return mockProjects
    .filter((p) => SUGGESTED_PROJECT_IDS.includes(p.id as SuggestedProjectId))
    .map((p) => ({ ...p }));
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 32);
}

export function createCustomProject(name: string): Project {
  const trimmed = name.trim();
  const id = `custom-${slugify(trimmed) || "projet"}-${Date.now().toString(36)}`;

  return {
    id,
    name: trimmed,
    description: "Projet ajouté lors de la configuration initiale.",
    status: "active",
    progress: 10,
    priority: "medium",
    nextAction: `Définir la prochaine étape concrète pour ${trimmed}.`,
    businessPotential: 7,
    strategicValue: 7,
    urgency: 6,
    estimatedEffort: 5,
    clarity: 5,
  };
}

export function buildProjectsFromOnboardingSelection(
  selectedIds: string[],
  customNames: string[]
): Project[] {
  const templates = getSuggestedProjectTemplates();
  const fromTemplates = templates.filter((p) => selectedIds.includes(p.id));
  const customs = customNames.filter((n) => n.trim()).map(createCustomProject);
  return [...fromTemplates, ...customs];
}
