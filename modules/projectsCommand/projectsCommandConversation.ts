import type { GigiConversationResponse } from "@/modules/conversation/conversationTypes";
import type { Project } from "@/modules/projects/projectTypes";
import { formatProjectsCommandSummary } from "./projectsCommandFormatter";
import { buildProjectsCommandViewModel } from "./projectsCommandViewModel";
import { PROJECTS_COMMAND_SAFETY_NOTE, type ProjectsCommandIntent } from "./types";

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function detectProjectIdFromText(norm: string, projects: Project[]): string | null {
  for (const p of projects) {
    const nameNorm = normalize(p.name);
    if (norm.includes(nameNorm) || norm.includes(normalize(p.id.replace(/-/g, " ")))) {
      return p.id;
    }
  }
  if (/buildy ?crafts|(^|\W)crafts(\W|$)/.test(norm)) return "buildy-crafts";
  if (/buildy ?clear|(^|\W)clear(\W|$)/.test(norm)) return "buildy-clear";
  if (/linko/.test(norm)) return "linko";
  if (/gigi ?os|gigios|(^|\W)gigi(\W|$)/.test(norm)) return "gigi-os";
  return null;
}

const PROJECTS_COMMAND_KEYWORDS = [
  "quel projet je dois avancer",
  "ou j en suis dans mes projets",
  "où j'en suis dans mes projets",
  "projet prioritaire",
  "quel projet est bloque",
  "quel projet est bloqué",
  "quelle mission pour ce projet",
  "montre mes projets",
  "prochaine mission projet",
  "sur quel projet je bosse",
  "mes projets",
  "centre projets",
  "projects command",
  "quel projet avancer",
  "projet bloque",
  "projet bloqué",
];

export function detectProjectsCommandIntent(
  objective: string,
  projects: Project[] = []
): ProjectsCommandIntent {
  const norm = normalize(objective);
  const isProjectsCommand = PROJECTS_COMMAND_KEYWORDS.some((k) =>
    norm.includes(normalize(k))
  );
  return {
    isProjectsCommand,
    projectId: detectProjectIdFromText(norm, projects),
  };
}

export interface ProjectsCommandConversationInput {
  projects: Project[];
  missionProjectId?: string;
  missionTitle?: string;
}

export function buildProjectsCommandConversationResponse(
  input: ProjectsCommandConversationInput
): GigiConversationResponse {
  const vm = buildProjectsCommandViewModel({
    projects: input.projects,
    missionProjectId: input.missionProjectId,
    missionTitle: input.missionTitle,
  });

  const recommended = vm.recommendedProject;
  const blocked = vm.projectCards.filter((c) => c.status === "blocked");

  const guidance = [
    "Ouvre /projects pour le centre projets complet.",
    "Chaque projet affiche mission possible, action active et apprentissage récent.",
    "Rien n'est exécuté automatiquement — tu valides et tu agis manuellement.",
  ];

  if (recommended) {
    return {
      intent: "projects_command",
      intentLabel: "Centre projets · Gigi V3.6",
      listen: formatProjectsCommandSummary(vm),
      needsClarification: false,
      priorityProjectName: recommended.projectName,
      projectsCommandRecommendedName: recommended.projectName,
      projectsCommandRecommendedReason:
        recommended.nextMissionReason ??
        recommended.summary ??
        "Projet le plus pertinent selon score local et mission du jour.",
      projectsCommandNextMissionTitle: recommended.nextMissionTitle,
      projectsCommandActiveActionTitle: recommended.activeActionTitle,
      projectsCommandPrimaryRoute: recommended.primaryCtaRoute,
      projectsCommandSummaryText: formatProjectsCommandSummary(vm),
      projectsCommandGuidance: guidance,
      projectsCommandBlockedMessage: PROJECTS_COMMAND_SAFETY_NOTE,
      finalMessage: blocked.length > 0
        ? `${blocked.length} projet(s) bloqué(s) — consulte /projects pour le détail.`
        : `Projet prioritaire : ${recommended.projectName} → /projects/${recommended.projectId}`,
    };
  }

  return {
    intent: "projects_command",
    intentLabel: "Centre projets · Gigi V3.6",
    listen: "Aucun projet configuré ou tous en pause — configure via /onboarding/setup.",
    needsClarification: false,
    projectsCommandSummaryText: formatProjectsCommandSummary(vm),
    projectsCommandGuidance: guidance,
    projectsCommandBlockedMessage: PROJECTS_COMMAND_SAFETY_NOTE,
    finalMessage: "Ouvre /projects ou /onboarding/setup pour ajouter des projets.",
  };
}
