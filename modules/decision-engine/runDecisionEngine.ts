import type { Project } from "../projects/projectTypes";
import type { Mission } from "../missions/missionTypes";
import { calculateMissionScore, buildScoreCriteria } from "./calculateMissionScore";
import { deriveScoresFromProject, getStatusPenalty } from "./projectScores";
import type { DecisionExplanation, AlternativeConsidered } from "./decisionTypes";
import type { ProjectRawScores } from "./projectScores";

export interface DecisionScore {
  projectId: string;
  projectName: string;
  score: number;
  rawScores: ProjectRawScores;
}

const ALTERNATIVE_REASONS: Record<string, string> = {
  "buildy-crafts": "Stratégique, mais pas le chemin le plus rapide vers le revenu aujourd'hui.",
  linko: "Important, mais en pause.",
  "1millimetre": "Expérimental.",
  "le-dernier-souvenir": "Idée créative future.",
  "gigi-os": "Infrastructure — utile, mais pas l'action revenu du jour.",
};

const REASONING_BY_PROJECT: Record<string, string> = {
  "buildy-clear":
    "Le projet est presque prêt, la prochaine étape est claire, et finaliser la page de vente débloque le lancement — trafic, visibilité, premières ventes.",
  "buildy-crafts":
    "Grande vision à long terme, mais pas l'action la plus urgente pour le revenu immédiat.",
  linko: "Projet prometteur, actuellement en pause.",
  "1millimetre": "Expérimentation intéressante, faible urgence.",
  "le-dernier-souvenir": "Projet créatif pour plus tard.",
  "gigi-os": "Outil interne utile, mais pas la priorité revenu du jour.",
};

function buildMissionFromProject(project: Project, confidence: number): Mission {
  const title =
    project.id === "buildy-clear"
      ? "Finaliser la page de vente Buildy Clear."
      : project.nextAction.endsWith(".")
        ? project.nextAction
        : `${project.nextAction}.`;

  const reason =
    project.id === "buildy-clear"
      ? "C'est ce qui te rapproche le plus du revenu. Buildy Clear est presque prêt — une page claire te sépare encore du lancement."
      : `${project.name} mérite ton attention : ${project.nextAction}`;

  return {
    id: `mission-${project.id}`,
    title,
    projectId: project.id,
    projectName: project.name,
    reason,
    estimatedDuration: project.id === "buildy-clear" ? "~45 min" : "~1 h",
    expectedImpact: project.businessPotential >= 8 ? "Élevé" : "Moyen",
    confidence,
    status: "recommended",
  };
}

export function scoreAllProjects(projects: Project[]): DecisionScore[] {
  return projects
    .map((project) => {
      const rawScores = deriveScoresFromProject(project);
      const baseScore = calculateMissionScore(rawScores);
      const penalty = getStatusPenalty(project);
      return {
        projectId: project.id,
        projectName: project.name,
        score: Math.round(baseScore * penalty),
        rawScores,
      };
    })
    .sort((a, b) => b.score - a.score);
}

export function selectBestProject(projects: Project[]): DecisionScore {
  const scored = scoreAllProjects(projects);
  return scored[0];
}

export function explainDecisionFromProjects(projects: Project[]): DecisionExplanation {
  const scored = scoreAllProjects(projects);
  const winner = scored[0];
  const winnerProject = projects.find((p) => p.id === winner.projectId)!;
  const mission = buildMissionFromProject(winnerProject, winner.score);

  const alternatives: AlternativeConsidered[] = scored.slice(1).map((entry) => ({
    projectName: entry.projectName,
    reason:
      ALTERNATIVE_REASONS[entry.projectId] ??
      (entry.score < winner.score - 15
        ? "Moins prioritaire pour aujourd'hui."
        : "Proche, mais pas le meilleur choix maintenant."),
  }));

  return {
    missionTitle: mission.title,
    projectName: mission.projectName,
    finalScore: winner.score,
    reasoning:
      REASONING_BY_PROJECT[winner.projectId] ??
      `${winner.projectName} obtient le meilleur score parmi tes projets actifs.`,
    criteria: buildScoreCriteria(winner.rawScores),
    alternatives,
  };
}

export { buildMissionFromProject };
