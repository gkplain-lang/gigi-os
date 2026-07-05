import type { MissionComposerTemplateDefinition } from "./missionComposerTypes";

export const MISSION_COMPOSER_TEMPLATES: MissionComposerTemplateDefinition[] = [
  {
    id: "clarify-next-step",
    title: "Clarifier la prochaine étape du projet",
    description: "Décider ce qui compte vraiment aujourd'hui — local uniquement.",
    outcome: "Décision claire sur la prochaine étape",
    reason: "Réduit la dispersion et clarifie le focus du jour.",
    category: "focus",
    urgency: "medium",
    impact: "medium",
    effort: "low",
    riskLevel: "low",
    suggestedRoute: "/mission-composer",
  },
  {
    id: "prepare-guided-path",
    title: "Préparer un parcours guidé pour avancer",
    description: "Transformer l'intention en parcours V4.6 — tu valides chaque étape.",
    outcome: "Action structurée via parcours guidé",
    reason: "Relie mission et exécution contrôlée sans lancer quoi que ce soit.",
    category: "execution",
    urgency: "high",
    impact: "high",
    effort: "medium",
    riskLevel: "low",
    suggestedGuidedActionTemplateId: "launch-checklist",
    suggestedRoute: "/guided-actions",
  },
  {
    id: "compose-daily-mission",
    title: "Transformer une idée en mission du jour",
    description: "Choisir une mission prioritaire unique pour Aegis.",
    outcome: "Mission du jour définie",
    reason: "Aegis avance mieux avec une seule mission choisie.",
    category: "planning",
    urgency: "high",
    impact: "high",
    effort: "low",
    riskLevel: "low",
    suggestedRoute: "/mission-composer",
  },
  {
    id: "prepare-command-pack",
    title: "Préparer un pack de commandes sans exécution",
    description: "Mission orientée vers des commandes à copier toi-même.",
    outcome: "Pack relisible préparé",
    reason: "Prépare sans exécuter — contrôle humain obligatoire.",
    category: "code",
    urgency: "medium",
    impact: "high",
    effort: "medium",
    riskLevel: "low",
    suggestedGuidedActionTemplateId: "git-branch",
    suggestedRoute: "/command-packs",
  },
  {
    id: "analyze-pasted-result",
    title: "Analyser un résultat collé",
    description: "Mission de revue locale sur un résultat obtenu manuellement.",
    outcome: "Statut probable via revue locale",
    reason: "Tu colles, Gigi analyse localement — aucune lecture auto.",
    category: "review",
    urgency: "medium",
    impact: "medium",
    effort: "low",
    riskLevel: "low",
    suggestedGuidedActionTemplateId: "build-result-review",
    suggestedRoute: "/local-review",
  },
  {
    id: "reduce-dispersion",
    title: "Réduire la dispersion d'un projet",
    description: "Choisir une seule prochaine action pour ce projet.",
    outcome: "Une seule prochaine action identifiée",
    reason: "Focus du jour — moins de dispersion, plus de clarté.",
    category: "strategy",
    urgency: "high",
    impact: "high",
    effort: "low",
    riskLevel: "low",
    suggestedRoute: "/mission-composer",
  },
];

export function getMissionComposerTemplate(id: string): MissionComposerTemplateDefinition | undefined {
  return MISSION_COMPOSER_TEMPLATES.find((t) => t.id === id);
}

/** Suggestions UI-only — non persistées automatiquement. */
export function getStaticMissionSuggestions(
  projectId: string,
  projectName: string
): Array<MissionComposerTemplateDefinition & { projectId: string; projectName: string }> {
  return MISSION_COMPOSER_TEMPLATES.slice(0, 3).map((t) => ({
    ...t,
    projectId,
    projectName,
  }));
}
