import type { GuidedActionTemplateDefinition, GuidedFlowStepId } from "./guidedActionTypes";

const FULL_V4_PATH: GuidedFlowStepId[] = [
  "action_goal",
  "local_request",
  "permission",
  "manual_bridge",
  "command_pack",
  "local_review",
];

const REQUEST_PACK_REVIEW: GuidedFlowStepId[] = [
  "action_goal",
  "local_request",
  "command_pack",
  "local_review",
];

const PACK_REVIEW: GuidedFlowStepId[] = ["action_goal", "command_pack", "local_review"];

export const GUIDED_ACTION_TEMPLATES: GuidedActionTemplateDefinition[] = [
  {
    id: "git-branch",
    title: "Préparer une branche Git",
    description: "Structurer les étapes pour une branche locale — copie manuelle uniquement.",
    category: "code",
    actionGoal: "Préparer les commandes git pour une branche locale",
    riskLevel: "low",
    suggestedCapability: "git_operation",
    suggestedRoute: "/command-packs",
    stepIds: FULL_V4_PATH,
    whyUseful: "Clarifie permission, pont manuel, pack et revue avant toute action git.",
  },
  {
    id: "github-pr",
    title: "Préparer une PR GitHub",
    description: "Checklist et commandes pour une PR — sandbox, aucun connecteur actif.",
    category: "collaboration",
    actionGoal: "Préparer une checklist GitHub PR",
    riskLevel: "medium",
    suggestedCapability: "github_operation",
    suggestedRoute: "/command-packs",
    stepIds: FULL_V4_PATH,
    whyUseful: "Relie mission projet → permission → pack → revue du résultat collé.",
  },
  {
    id: "n8n-workflow",
    title: "Préparer un workflow n8n",
    description: "Paquet manuel pour un workflow n8n — lancement humain obligatoire.",
    category: "automation",
    actionGoal: "Préparer un workflow n8n manuel",
    riskLevel: "medium",
    suggestedCapability: "n8n_workflow",
    suggestedRoute: "/manual-bridge",
    stepIds: FULL_V4_PATH,
    whyUseful: "Guide sans activer n8n — étapes copiables et validation locale.",
  },
  {
    id: "launch-checklist",
    title: "Préparer une checklist de lancement",
    description: "Demande locale + pack checklist + revue — sans exécution réelle.",
    category: "product",
    actionGoal: "Préparer une checklist de lancement produit",
    riskLevel: "low",
    suggestedCapability: "documentation_only",
    suggestedRoute: "/actions",
    stepIds: REQUEST_PACK_REVIEW,
    whyUseful: "Idéal pour structurer un lancement sans connecteur externe.",
  },
  {
    id: "build-result-review",
    title: "Analyser un résultat de build",
    description: "Pack de commandes puis revue locale du résultat collé.",
    category: "verification",
    actionGoal: "Analyser un résultat npm run build collé manuellement",
    riskLevel: "low",
    suggestedCapability: "local_only",
    suggestedRoute: "/local-review",
    stepIds: PACK_REVIEW,
    whyUseful: "Tu lances le build toi-même, Gigi prépare l'analyse locale du texte collé.",
  },
];

export function getGuidedActionTemplate(id: string): GuidedActionTemplateDefinition | undefined {
  return GUIDED_ACTION_TEMPLATES.find((t) => t.id === id);
}

export function listGuidedActionTemplates(limit?: number): GuidedActionTemplateDefinition[] {
  return limit ? GUIDED_ACTION_TEMPLATES.slice(0, limit) : GUIDED_ACTION_TEMPLATES;
}

export const GUIDED_STEP_DEFINITIONS: Record<
  GuidedFlowStepId,
  { label: string; description: string; route: string }
> = {
  action_goal: {
    label: "Objectif d'action",
    description: "Tu choisis ce qu'il faut préparer pour le projet.",
    route: "/guided-actions",
  },
  local_request: {
    label: "Demande locale",
    description: "Gigi prépare une demande avec risques et rollback.",
    route: "/actions",
  },
  permission: {
    label: "Permission locale",
    description: "Tu vois dry-run, refus et blocages — validation humaine.",
    route: "/permissions",
  },
  manual_bridge: {
    label: "Pont manuel",
    description: "Gigi transforme l'action en étapes manuelles sandbox.",
    route: "/manual-bridge",
  },
  command_pack: {
    label: "Pack de commandes",
    description: "Gigi prépare des commandes à copier toi-même.",
    route: "/command-packs",
  },
  local_review: {
    label: "Revue locale",
    description: "Tu colles le résultat — analyse locale prudente.",
    route: "/local-review",
  },
};
