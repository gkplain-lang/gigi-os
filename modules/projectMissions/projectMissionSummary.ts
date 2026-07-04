import { PROJECT_CONTEXT_LABELS } from "@/data/projectLabels";
import type { Project } from "@/modules/projects/projectTypes";
import type { ProjectDetailSummary } from "./types";

const PRIORITY_SCORE: Record<string, number> = {
  critical: 95,
  high: 78,
  medium: 55,
  low: 32,
};

export function computeProjectScore(project: Project): number {
  return Math.round(
    (PRIORITY_SCORE[project.priority] ?? 50) * 0.4 + project.progress * 0.6
  );
}

export function getProjectDetailSummary(
  project: Project,
  options?: { isMissionProject?: boolean }
): ProjectDetailSummary {
  const score = computeProjectScore(project);
  const contextLabel = PROJECT_CONTEXT_LABELS[project.id];
  const isMissionProject = options?.isMissionProject ?? false;

  const whyItMatters = buildWhyItMatters(project);
  const { whyToday, whyNotToday } = buildWhyToday(project, isMissionProject, contextLabel);
  const recommendedAction = buildRecommendedAction(project, isMissionProject);

  return {
    score,
    whyItMatters,
    whyToday,
    whyNotToday,
    recommendedAction,
  };
}

function buildWhyItMatters(project: Project): string {
  const parts = [project.description];
  if (project.businessPotential >= 8) {
    parts.push("Fort potentiel business.");
  }
  if (project.strategicValue >= 8) {
    parts.push("Valeur stratégique élevée pour ton portefeuille.");
  }
  return parts.join(" ");
}

function buildWhyToday(
  project: Project,
  isMissionProject: boolean,
  contextLabel?: string
): { whyToday: string; whyNotToday?: string } {
  if (isMissionProject) {
    return {
      whyToday:
        "Gigi a choisi ce projet pour ta mission du jour — c'est la priorité active maintenant.",
      whyNotToday: "Les autres projets actifs peuvent attendre sans perdre de momentum.",
    };
  }

  if (project.status === "paused" || project.status === "postponed") {
    return {
      whyToday: contextLabel ?? "Projet en pause — pas de pression aujourd'hui.",
      whyNotToday:
        "Concentre ton énergie sur les projets actifs. Celui-ci reste en mémoire pour plus tard.",
    };
  }

  if (project.status === "future" || project.status === "archived") {
    return {
      whyToday: "Projet futur — utile à garder en vue, pas à exécuter aujourd'hui.",
      whyNotToday: "Aucune urgence. Reviens quand un projet actif sera stabilisé.",
    };
  }

  if (project.urgency >= 8) {
    return {
      whyToday: `Urgence élevée (${project.urgency}/10) et statut actif — bon candidat si tu veux changer de focus.`,
    };
  }

  if (project.urgency <= 4) {
    return {
      whyToday: contextLabel ?? "Actif mais pas la priorité du jour.",
      whyNotToday: "D'autres projets ont plus d'impact immédiat aujourd'hui.",
    };
  }

  return {
    whyToday: contextLabel ?? "Projet actif — avance quand la mission du jour le permet.",
  };
}

function buildRecommendedAction(
  project: Project,
  isMissionProject: boolean
): ProjectDetailSummary["recommendedAction"] {
  if (project.status === "paused" || project.status === "future") {
    return {
      action: project.nextAction,
      whyNow: "Pour préparer la reprise — sans exécuter aujourd'hui.",
      canIgnore: "Tu peux ignorer ce projet jusqu'à ce qu'il redevienne actif.",
    };
  }

  if (isMissionProject) {
    return {
      action: project.nextAction,
      whyNow: "Aligné avec ta mission du jour — c'est le bon fil conducteur.",
      canIgnore: "Si tu changes d'avis, parle à Gigi pour une autre priorité.",
    };
  }

  if (project.id === "buildy-clear") {
    return {
      action: "Finalise la page de vente avant de créer plus de contenu.",
      whyNow: "C'est le chemin le plus direct vers un revenu.",
      canIgnore: "Contenu TikTok et polish peuvent attendre la page.",
    };
  }

  return {
    action: project.nextAction,
    whyNow: `Impact potentiel ${project.businessPotential}/10 — avance sur l'action la plus claire.`,
    canIgnore: "Les missions secondaires du catalogue peuvent attendre.",
  };
}
