import type { PreparedActionType } from "@/modules/preparedActions/types";
import type {
  ExecutionCommand,
  ExecutionMode,
  ExecutionPlanBuildInput,
  ExecutionRisk,
  ExecutionRollbackStep,
  ExecutionStep,
  ExecutionTargetFile,
  ExecutionTest,
  ExecutionValidationItem,
} from "./types";
import {
  DEFAULT_EXPECTED_REPORT,
  DEFAULT_SAFETY_NOTES,
} from "./executionPlanSummary";

function steps(...items: Omit<ExecutionStep, "id" | "order">[]): ExecutionStep[] {
  return items.map((item, i) => ({ ...item, id: `ex-step-${i + 1}`, order: i + 1 }));
}

function commands(...items: Omit<ExecutionCommand, "id">[]): ExecutionCommand[] {
  return items.map((item, i) => ({ ...item, id: `ex-cmd-${i + 1}` }));
}

function tests(...items: Omit<ExecutionTest, "id">[]): ExecutionTest[] {
  return items.map((item, i) => ({ ...item, id: `ex-test-${i + 1}` }));
}

function risks(...items: Omit<ExecutionRisk, "id">[]): ExecutionRisk[] {
  return items.map((item, i) => ({ ...item, id: `ex-risk-${i + 1}` }));
}

function rollback(...items: Omit<ExecutionRollbackStep, "id">[]): ExecutionRollbackStep[] {
  return items.map((item, i) => ({ ...item, id: `ex-rb-${i + 1}` }));
}

function validation(...items: Omit<ExecutionValidationItem, "id">[]): ExecutionValidationItem[] {
  return items.map((item, i) => ({ ...item, id: `ex-val-${i + 1}` }));
}

function targetFiles(paths: string[], reason: string, risk: "low" | "medium" | "high" = "medium"): ExecutionTargetFile[] {
  return paths.map((path) => ({ path, reason, riskLevel: risk }));
}

const BASE_ROLLBACK: Omit<ExecutionRollbackStep, "id">[] = [
  { title: "Annuler les changements locaux", description: "git checkout -- <fichier> ou git restore . si nécessaire" },
  { title: "Abandonner la branche", description: "Ne pas merger — supprimer la branche locale si le plan échoue" },
  { title: "Revenir à l'état validé", description: "La file /actions conserve l'action validée — repartir du plan" },
];

const BASE_VALIDATION: Omit<ExecutionValidationItem, "id">[] = [
  { label: "Build OK (npm run build)", required: true },
  { label: "Diff relu — scope minimal", required: true },
  { label: "Aucun .env.local dans le diff", required: true },
  { label: "Parcours manuel testé si UI touchée", required: false },
  { label: "Rapport rédigé pour Gigi / notes perso", required: true },
];

function modeForType(type: PreparedActionType): ExecutionMode {
  if (type === "cursor_prompt") return "cursor_guided";
  if (type === "branch_plan" || type === "pr_plan") return "manual_guided";
  return "manual_guided";
}

export function buildRulesForType(input: ExecutionPlanBuildInput): {
  executionMode: ExecutionMode;
  objective: string;
  steps: ExecutionStep[];
  commands: ExecutionCommand[];
  tests: ExecutionTest[];
  risks: ExecutionRisk[];
  rollbackPlan: ExecutionRollbackStep[];
  validationChecklist: ExecutionValidationItem[];
  targetFiles: ExecutionTargetFile[];
} {
  const files = input.relatedFiles ?? [];
  const baseTargets = targetFiles(files.length ? files : ["README.md"], "Fichiers liés à l'action préparée");

  switch (input.preparedActionType) {
    case "cursor_prompt":
      return {
        executionMode: "cursor_guided",
        objective: `Exécuter via Cursor : ${input.preparedActionTitle}`,
        targetFiles: baseTargets,
        steps: steps(
          {
            title: "Ouvrir Cursor sur le repo",
            description: "Vérifier que tu es sur la bonne branche et que le working tree est propre.",
            actor: "user",
            doneDefinition: "Cursor ouvert, bon dossier projet.",
          },
          {
            title: "Coller le prompt préparé",
            description: "Utilise le contenu de l'action validée — ne modifie pas le scope sans raison.",
            actor: "cursor",
            doneDefinition: "Prompt envoyé à Cursor avec contexte complet.",
          },
          {
            title: "Relire le diff proposé",
            description: "Vérifie chaque fichier — refuse les changements hors scope.",
            actor: "user",
            doneDefinition: "Diff validé ou ajusté manuellement.",
          },
          {
            title: "Lancer le build",
            description: "npm run build — corriger les erreurs TypeScript avant de continuer.",
            actor: "user",
            doneDefinition: "Build vert.",
          },
          {
            title: "Vérifier l'UI / parcours",
            description: "Test manuel du parcours concerné (page, tunnel, etc.).",
            actor: "user",
            doneDefinition: "Parcours OK ou écarts notés.",
          },
          {
            title: "Préparer le commit si validé",
            description: "Message clair — ne committer que si tu valides le résultat.",
            actor: "user",
            doneDefinition: "Commit prêt ou décision de ne pas committer documentée.",
          }
        ),
        commands: commands(
          { command: "npm run build", description: "Vérifier compilation", runBy: "user_manual_only", required: true },
          { command: "git status", description: "Voir les fichiers modifiés", runBy: "user_manual_only", required: true },
          { command: "git diff", description: "Relire le diff avant commit", runBy: "user_manual_only", required: true }
        ),
        tests: tests(
          { label: "Build production", command: "npm run build", description: "Aucune erreur TypeScript" },
          { label: "Parcours utilisateur", description: "Test manuel du changement visible" }
        ),
        risks: risks(
          { risk: "Cursor élargit le scope", mitigation: "Rappeler le prompt : diff minimal uniquement" },
          { risk: "Commit prématuré", mitigation: "Build + relecture obligatoires avant git commit" },
          { risk: "Régression UI", mitigation: "Test manuel sur la route/page concernée" }
        ),
        rollbackPlan: rollback(...BASE_ROLLBACK),
        validationChecklist: validation(...BASE_VALIDATION),
      };

    case "checklist":
      return {
        executionMode: "manual_guided",
        objective: `Suivre la checklist : ${input.preparedActionTitle}`,
        targetFiles: baseTargets,
        steps: steps(
          {
            title: "Ouvrir la checklist préparée",
            description: "Copie le contenu de l'action validée dans un doc ou garde-le visible.",
            actor: "user",
            doneDefinition: "Checklist accessible.",
          },
          {
            title: "Cocher chaque point Avant",
            description: "Ne pas sauter les prérequis.",
            actor: "user",
            doneDefinition: "Section Avant complète.",
          },
          {
            title: "Exécuter section Pendant",
            description: "Une étape à la fois — noter les blocages.",
            actor: "user",
            doneDefinition: "Points pendant traités ou reportés.",
          },
          {
            title: "Compléter section Après + Validation",
            description: "Tests et relecture finale.",
            actor: "user",
            doneDefinition: "Checklist complète ou écarts documentés.",
          },
          {
            title: "Revenir dans Gigi",
            description: "Mettre à jour le statut ou noter la suite.",
            actor: "user",
            doneDefinition: "Prochaine action claire.",
          }
        ),
        commands: commands(
          { command: "npm run build", description: "Si la checklist inclut une vérif technique", runBy: "user_manual_only", required: false }
        ),
        tests: tests({ label: "Checklist validation", description: "Tous les points requis cochés" }),
        risks: risks({ risk: "Sauter des étapes", mitigation: "Cocher réellement — pas de checkbox fantôme" }),
        rollbackPlan: rollback(...BASE_ROLLBACK),
        validationChecklist: validation(...BASE_VALIDATION),
      };

    case "branch_plan":
      return {
        executionMode: "manual_guided",
        objective: `Créer et utiliser une branche Git pour : ${input.preparedActionTitle}`,
        targetFiles: baseTargets,
        steps: steps(
          {
            title: "Synchroniser main",
            description: "git checkout main && git pull — partir d'une base à jour.",
            actor: "user",
            doneDefinition: "main à jour localement.",
          },
          {
            title: "Créer la branche proposée",
            description: "Utilise le nom suggéré dans l'action préparée.",
            actor: "user",
            doneDefinition: "Branche créée et active.",
          },
          {
            title: "Implémenter le changement",
            description: "Scope minimal — une intention par branche.",
            actor: "user",
            doneDefinition: "Changements prêts à committer.",
          },
          {
            title: "Build + tests",
            description: "npm run build avant tout push.",
            actor: "user",
            doneDefinition: "Build OK.",
          },
          {
            title: "Commit et push manuels",
            description: "Message de commit proposé dans l'action — adapter si besoin.",
            actor: "user",
            doneDefinition: "Branche poussée ou décision de ne pas pousser.",
          }
        ),
        commands: commands(
          ...(input.suggestedCommands ?? ["git checkout main", "git pull origin main", "git checkout -b feat/branch"]).map(
            (cmd, i) => ({
              command: cmd,
              description: i === 0 ? "Base à jour" : "Commande suggérée dans le plan de branche",
              runBy: "user_manual_only" as const,
              required: i < 2,
            })
          ),
          { command: "npm run build", description: "Avant push", runBy: "user_manual_only", required: true },
          { command: "git push -u origin HEAD", description: "Pousser la branche — manuel uniquement", runBy: "user_manual_only", required: false }
        ),
        tests: tests(
          { label: "Build", command: "npm run build", description: "Compilation OK" },
          { label: "Branche isolée", description: "Pas de commit sur main directement" }
        ),
        risks: risks(
          { risk: "Force push", mitigation: "Interdit — jamais git push --force sur main" },
          { risk: "Branche trop large", mitigation: "Une feature = une branche focalisée" }
        ),
        rollbackPlan: rollback(...BASE_ROLLBACK),
        validationChecklist: validation(...BASE_VALIDATION),
      };

    case "pr_plan":
      return {
        executionMode: "manual_guided",
        objective: `Préparer une PR pour : ${input.preparedActionTitle}`,
        targetFiles: baseTargets,
        steps: steps(
          { title: "Finaliser la branche", description: "Build OK, diff minimal.", actor: "user", doneDefinition: "Branche prête." },
          { title: "Rédiger titre et description PR", description: "Utiliser le template de l'action préparée.", actor: "user", doneDefinition: "Texte PR prêt à coller." },
          { title: "Remplir la checklist PR", description: "Test plan, scope, risques.", actor: "user", doneDefinition: "Checklist complète." },
          { title: "Ouvrir la PR sur GitHub", description: "Manuellement — Gigi ne crée pas la PR.", actor: "user", doneDefinition: "PR ouverte ou brouillon sauvegardé." }
        ),
        commands: commands(
          { command: "npm run build", description: "Dernière vérif avant PR", runBy: "user_manual_only", required: true }
        ),
        tests: tests({ label: "PR checklist", description: "Tous les points requis cochés" }),
        risks: risks({ risk: "PR trop grosse", mitigation: "Découper si > 400 lignes utiles" }),
        rollbackPlan: rollback(...BASE_ROLLBACK),
        validationChecklist: validation(...BASE_VALIDATION),
      };

    case "content_plan":
      return {
        executionMode: "manual_guided",
        objective: `Produire le contenu : ${input.preparedActionTitle}`,
        targetFiles: targetFiles(["docs/content/", "marketing/"], "Emplacements contenu suggérés", "low"),
        steps: steps(
          { title: "Relire le plan de contenu", description: "Angle, structure, CTA.", actor: "user", doneDefinition: "Plan compris." },
          { title: "Rédiger le premier jet", description: "Hook + corps + CTA.", actor: "user", doneDefinition: "Draft v1 prêt." },
          { title: "Vérifier cohérence offre", description: "Aligné page de vente / promesse.", actor: "user", doneDefinition: "Message cohérent." },
          { title: "Publication manuelle", description: "TikTok, landing, etc. — hors Gigi.", actor: "user", doneDefinition: "Publié ou planifié." }
        ),
        commands: [],
        tests: tests({ label: "Relecture CTA", description: "Un seul appel à l'action clair" }),
        risks: risks({ risk: "Contenu avant offre claire", mitigation: "Valider l'offre d'abord si doute" }),
        rollbackPlan: rollback(...BASE_ROLLBACK),
        validationChecklist: validation(...BASE_VALIDATION),
      };

    case "file_draft":
      return {
        executionMode: "manual_guided",
        objective: `Intégrer le brouillon : ${input.preparedActionTitle}`,
        targetFiles: baseTargets,
        steps: steps(
          { title: "Relire le brouillon", description: "Contenu dans l'action préparée.", actor: "user", doneDefinition: "Brouillon validé ou ajusté." },
          { title: "Copier vers l'emplacement cible", description: "Manuellement — pas d'écriture auto Gigi.", actor: "user", doneDefinition: "Fichier mis à jour." },
          { title: "Tester l'intégration", description: "Build + vérif visuelle si applicable.", actor: "user", doneDefinition: "Intégration OK." }
        ),
        commands: commands(
          { command: "npm run build", description: "Après intégration", runBy: "user_manual_only", required: true }
        ),
        tests: tests({ label: "Build post-intégration", command: "npm run build", description: "Pas de régression" }),
        risks: risks({ risk: "Écraser du contenu existant", mitigation: "Diff avant sauvegarde" }),
        rollbackPlan: rollback(...BASE_ROLLBACK),
        validationChecklist: validation(...BASE_VALIDATION),
      };

    default:
      return {
        executionMode: modeForType(input.preparedActionType),
        objective: `Exécuter manuellement : ${input.preparedActionTitle}`,
        targetFiles: baseTargets,
        steps: steps(
          { title: "Clarifier l'objectif", description: input.preparedActionSummary, actor: "user", doneDefinition: "Objectif une phrase." },
          { title: "Exécuter l'étape principale", description: "Suivre le corps de l'action préparée.", actor: "user", doneDefinition: "Étape faite ou bloquée." },
          { title: "Tester", description: "npm run build ou vérif manuelle.", actor: "user", doneDefinition: "Test OK." },
          { title: "Rapporter", description: "Notes pour la prochaine session.", actor: "user", doneDefinition: "Rapport court rédigé." }
        ),
        commands: commands(
          { command: "npm run build", description: "Vérification standard", runBy: "user_manual_only", required: false }
        ),
        tests: tests({ label: "Vérification manuelle", description: "Objectif de l'action atteint" }),
        risks: risks({ risk: "Scope flou", mitigation: "Couper jusqu'à une action faisable" }),
        rollbackPlan: rollback(...BASE_ROLLBACK),
        validationChecklist: validation(...BASE_VALIDATION),
      };
  }
}

export { DEFAULT_EXPECTED_REPORT, DEFAULT_SAFETY_NOTES };
