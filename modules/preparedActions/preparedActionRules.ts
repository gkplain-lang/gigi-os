import type { PreparedActionBuildInput, PreparedActionType } from "./types";
import {
  PREPARED_SAFETY_DEFAULTS,
  PREPARED_VALIDATION_DEFAULTS,
} from "./preparedActionSummary";

interface ProjectContext {
  files: string[];
  focus: string;
  tests: string[];
}

const PROJECT_CONTEXT: Record<string, ProjectContext> = {
  "buildy-clear": {
    files: ["app/(marketing)/page.tsx", "components/landing/Hero.tsx", "lib/copy/salesPage.ts"],
    focus: "Finaliser la page de vente Buildy Clear — promesse, preuves, objections, CTA, tunnel Systeme.io",
    tests: ["npm run build", "Parcours landing → checkout → confirmation", "CTA visible above the fold"],
  },
  "buildy-crafts": {
    files: ["data/materials/", "modules/crafts/framing/", "modules/crafts/openings/"],
    focus: "Stabiliser charpente/ouvertures et compléter la base DATA matériaux",
    tests: ["npm run build", "Scénario devis charpente type", "Scénario ouvertures type"],
  },
  "gigi-os": {
    files: [
      "modules/actionPlans/",
      "modules/preparedActions/",
      "components/actionPlans/",
      "modules/conversation/conversationBrain.ts",
    ],
    focus: "Améliorer Gigi — plans d'action, actions préparées, conversation locale",
    tests: ["npm run build", "Routes /projects/[id]", "Conversation ?ask= dry-run"],
  },
  linko: {
    files: ["docs/linko-artisan-profile.md", "components/artisan/ProfileTemplate.tsx"],
    focus: "Définir la fiche artisan Linko — structure, preuves, contact",
    tests: ["npm run build", "Relecture fiche exemple"],
  },
  "1millimetre": {
    files: ["game/mechanics/placement.ts", "game/feedback/"],
    focus: "Améliorer le feeling de gameplay puzzle",
    tests: ["npm run build", "Session test 15 min niveau pilote"],
  },
  "le-dernier-souvenir": {
    files: ["docs/narrative-bible.md", "content/chapter-1-outline.md"],
    focus: "Structurer l'univers narratif — bible, chapitre pilote",
    tests: ["Relecture bible 3 actes", "Scène pilote relue"],
  },
};

function ctx(projectId: string): ProjectContext {
  return (
    PROJECT_CONTEXT[projectId] ?? {
      files: ["README.md"],
      focus: `Avancer le projet ${projectId}`,
      tests: ["npm run build", "Vérification manuelle du livrable"],
    }
  );
}

function baseSafety(extra: string[] = []): string[] {
  return [...PREPARED_SAFETY_DEFAULTS, ...extra];
}

export function buildCursorPromptBody(input: PreparedActionBuildInput): string {
  const c = ctx(input.projectId);
  const objective = input.planTitle ?? c.focus;

  return [
    `Projet : ${input.projectName}`,
    `Objectif : ${objective}`,
    input.planSummary ? `Contexte : ${input.planSummary}` : "",
    "",
    "Règles strictes :",
    "- Ne touche jamais à .env.local",
    "- Ne modifie pas localStorage keys",
    "- Ne fais aucun commit sans validation",
    "- Ne merge pas dans main",
    "- Minimise le scope — diff focalisé uniquement",
    "- Match les conventions existantes du repo",
    "",
    "Fichiers probables :",
    ...c.files.map((f) => `- ${f}`),
    "",
    "Étapes attendues :",
    "1. Lire le code existant autour des fichiers cibles",
    "2. Implémenter le changement minimal qui sert l'objectif",
    "3. Vérifier qu'aucune route existante n'est cassée",
    "4. Lancer les tests listés ci-dessous",
    "5. Donner un rapport : fichiers modifiés, ce qui a changé, ce qui reste",
    "",
    "Tests à lancer :",
    ...c.tests.map((t) => `- ${t}`),
    "",
    "Rapport attendu :",
    "- Résumé en 3 bullets",
    "- Liste des fichiers touchés",
    "- Risques ou points à valider manuellement",
    "- Confirmation : aucun commit effectué",
  ]
    .filter(Boolean)
    .join("\n");
}

export function buildChecklistBody(input: PreparedActionBuildInput): string {
  const c = ctx(input.projectId);
  const focus = input.planTitle ?? c.focus;

  return [
    `Checklist — ${input.projectName}`,
    `Mission : ${focus}`,
    "",
    "## Avant",
    "- [ ] Objectif de la session défini (1 seule chose)",
    "- [ ] Fichiers / zone de travail identifiés",
    "- [ ] Branche locale à jour (si applicable)",
    "- [ ] Build actuel OK : npm run build",
    "",
    "## Pendant",
    "- [ ] Avancer étape par étape sans ouvrir d'autres sujets",
    "- [ ] Noter les blocages au fur et à mesure",
    "- [ ] Garder le scope minimal",
    "",
    "## Après",
    ...c.tests.map((t) => `- [ ] Test : ${t}`),
    "- [ ] Relecture du diff",
    "- [ ] Aucun secret ou .env exposé",
    "",
    "## Validation",
    "- [ ] Livrable conforme à l'objectif",
    "- [ ] Prêt à committer OU liste claire de ce qui manque",
    "- [ ] Aucune action automatique lancée par Gigi",
  ].join("\n");
}

export function buildBranchPlanBody(input: PreparedActionBuildInput): string {
  const c = ctx(input.projectId);
  const slug = input.projectId.replace(/-/g, "-").slice(0, 20);
  const branchName = `feat/${slug}-${input.missionId?.slice(0, 12) ?? "prep-action"}`;

  return [
    `Plan de branche Git — ${input.projectName}`,
    "",
    `Branche proposée : ${branchName}`,
    `Objectif : ${input.planTitle ?? c.focus}`,
    "",
    "Fichiers probables à modifier :",
    ...c.files.map((f) => `- ${f}`),
    "",
    "Étapes théoriques (à lancer manuellement) :",
    `1. git checkout main && git pull origin main`,
    `2. git checkout -b ${branchName}`,
    "3. Implémenter le changement (scope minimal)",
    "4. npm run build",
    "5. git add <fichiers pertinents>",
    `6. git commit -m "<message descriptif>"`,
    "7. git push -u origin HEAD",
    "",
    "Message de commit proposé :",
    `"Add ${input.planTitle ?? "controlled preparation"} for ${input.projectName}"`,
    "",
    "Tests avant PR :",
    ...c.tests.map((t) => `- ${t}`),
    "",
    "⚠️ Gigi ne crée aucune branche. Copie-colle ces étapes si tu valides.",
  ].join("\n");
}

export function buildFileDraftBody(input: PreparedActionBuildInput): string {
  const c = ctx(input.projectId);
  const path = c.files[0] ?? `docs/${input.projectId}-draft.md`;

  return [
    `Brouillon — ${input.projectName}`,
    `Emplacement suggéré : ${path}`,
    "",
    "---",
    "",
    `# ${input.planTitle ?? c.focus}`,
    "",
    "## Promesse / objectif",
    "[À compléter — une phrase claire]",
    "",
    "## Points clés",
    "1. ",
    "2. ",
    "3. ",
    "",
    "## Preuves / objections",
    "- Objection 1 → réponse",
    "- Objection 2 → réponse",
    "",
    "## CTA",
    "[Texte d'appel à l'action]",
    "",
    "---",
    "Note : brouillon à valider — Gigi n'a écrit aucun fichier.",
  ].join("\n");
}

export function buildContentPlanBody(input: PreparedActionBuildInput): string {
  return [
    `Plan de contenu — ${input.projectName}`,
    "",
    `Angle : ${input.planSummary ?? "Montrer le problème résolu concrètement"}`,
    "",
    "Structure proposée :",
    "1. Hook (3 secondes) — douleur ou curiosité",
    "2. Problème — en 2 phrases",
    "3. Solution — ce que le produit fait",
    "4. Preuve — chiffre, démo ou témoignage",
    "5. CTA — une action claire",
    "",
    "Livrables :",
    "- 1 script court (TikTok / Reels)",
    "- 1 accroche texte pour landing",
    "- 1 CTA aligné page de vente",
    "",
    "CTA recommandé :",
    "« Voir comment [produit] résout [problème] »",
  ].join("\n");
}

export function buildResearchPlanBody(input: PreparedActionBuildInput): string {
  return [
    `Plan de recherche / données — ${input.projectName}`,
    "",
    "Objectif : inventorier ce qui manque avant implémentation",
    "",
    "Liste à compléter :",
    "- [ ] Entrées DATA existantes",
    "- [ ] Entrées manquantes prioritaires",
    "- [ ] Unités et formats à normaliser",
    "- [ ] Sources de vérité (docs, exports, échantillons)",
    "- [ ] Cas limites à documenter",
    "",
    "Critère de fin :",
    "Top 20 entrées identifiées avec format validé.",
  ].join("\n");
}

export function buildCollaboratorBriefBody(input: PreparedActionBuildInput): string {
  return [
    `Brief — ${input.projectName}`,
    "",
    `Mission : ${input.planTitle ?? ctx(input.projectId).focus}`,
    "",
    "Contexte :",
    input.planSummary ?? "Projet actif dans le portefeuille Gigi.",
    "",
    "Attendu :",
    "- Livrable concret en fin de session",
    "- Scope défini à l'avance — pas d'élargissement",
    "- Rapport court : fait / bloqué / prochaine étape",
    "",
    "Critères de réussite :",
    "- Objectif de la mission atteint ou écart documenté",
    "- Tests listés passés",
    "- Aucun changement hors scope",
  ].join("\n");
}

export function buildPrPlanBody(input: PreparedActionBuildInput): string {
  const c = ctx(input.projectId);
  return [
    `Plan de PR — ${input.projectName}`,
    "",
    `Titre PR proposé : ${input.planTitle ?? c.focus}`,
    "",
    "## Summary",
    "- [1-2 bullets du changement]",
    "",
    "## Test plan",
    ...c.tests.map((t) => `- [ ] ${t}`),
    "",
    "## Checklist",
    "- [ ] Build OK",
    "- [ ] Pas de .env.local dans le diff",
    "- [ ] Scope minimal",
    "- [ ] Documentation mise à jour si pertinent",
    "",
    "⚠️ PR non créée par Gigi — modèle à copier.",
  ].join("\n");
}

export function buildManualTaskBody(input: PreparedActionBuildInput): string {
  return [
    `Tâche manuelle — ${input.projectName}`,
    "",
    `Objectif : ${input.planTitle ?? ctx(input.projectId).focus}`,
    "",
    "Étapes :",
    "1. Lire le contexte projet dans Gigi",
    "2. Choisir une seule sous-tâche faisable aujourd'hui",
    "3. Exécuter 45-90 minutes max",
    "4. Noter le résultat pour la prochaine session",
    "",
    "Definition of done :",
    "Tu peux expliquer en une phrase ce qui a avancé.",
  ].join("\n");
}

export function buildBodyForType(input: PreparedActionBuildInput): string {
  switch (input.type) {
    case "cursor_prompt":
      return buildCursorPromptBody(input);
    case "checklist":
      return buildChecklistBody(input);
    case "branch_plan":
      return buildBranchPlanBody(input);
    case "file_draft":
      return buildFileDraftBody(input);
    case "content_plan":
      return buildContentPlanBody(input);
    case "research_plan":
      return buildResearchPlanBody(input);
    case "collaborator_brief":
      return buildCollaboratorBriefBody(input);
    case "pr_plan":
      return buildPrPlanBody(input);
    case "manual_task":
    default:
      return buildManualTaskBody(input);
  }
}

export function inferTypeFromSourceId(sourceActionId: string): PreparedActionType | null {
  if (sourceActionId.includes("cursor")) return "cursor_prompt";
  if (sourceActionId.includes("checklist")) return "checklist";
  if (sourceActionId.includes("branch")) return "branch_plan";
  if (sourceActionId.includes("draft")) return "file_draft";
  if (sourceActionId.includes("content")) return "content_plan";
  if (sourceActionId.includes("data") || sourceActionId.includes("research")) return "research_plan";
  if (sourceActionId.includes("manual")) return "manual_task";
  if (sourceActionId.includes("pr")) return "pr_plan";
  return null;
}

export function defaultTypeForProject(projectId: string): PreparedActionType {
  if (projectId === "buildy-clear") return "cursor_prompt";
  if (projectId === "buildy-crafts") return "checklist";
  if (projectId === "gigi-os") return "branch_plan";
  return "checklist";
}

export function getRelatedFiles(projectId: string): string[] {
  return ctx(projectId).files;
}

export function getSuggestedCommands(type: PreparedActionType, projectId: string): string[] | undefined {
  if (type === "branch_plan") {
    const slug = projectId.replace(/-/g, "-").slice(0, 20);
    return [
      "git checkout main && git pull origin main",
      `git checkout -b feat/${slug}-prep-action`,
      "npm run build",
    ];
  }
  if (type === "cursor_prompt") {
    return ["npm run build"];
  }
  return undefined;
}

export function getSafetyNotes(type: PreparedActionType): string[] {
  const extra: Partial<Record<PreparedActionType, string[]>> = {
    cursor_prompt: ["Relire le diff avant commit", "Ne pas élargir le scope dans Cursor"],
    branch_plan: ["Ne pas force push", "Ne pas merger sans review"],
    checklist: ["Cocher seulement ce qui est vraiment fait"],
  };
  return baseSafety(extra[type] ?? []);
}

export { PREPARED_VALIDATION_DEFAULTS };
