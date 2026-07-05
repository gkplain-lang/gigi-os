import type { CommandPackTemplateDefinition } from "./commandPackTypes";

const PLACEHOLDER_NOTE =
  "Remplace les placeholders (<...>) manuellement — Gigi ne stocke aucun secret.";

export const COMMAND_PACK_TEMPLATES: CommandPackTemplateDefinition[] = [
  {
    id: "git_local",
    title: "Git local — pack manuel",
    description: "Commandes Git à copier dans ton terminal — aucune exécution depuis Gigi.",
    connectorId: "git",
    riskLevel: "high",
    humanGoal: "Inspecter et committer des changements locaux en toute conscience.",
    environmentAssumptions: [
      "Repo Git initialisé localement",
      "Branche de travail identifiée",
      PLACEHOLDER_NOTE,
    ],
    prerequisites: [
      "Vérifier git status avant toute action",
      "Sauvegarder ou stasher les changements non désirés",
    ],
    preflightChecklist: [
      "Je suis sur la bonne branche (<BRANCH_NAME>)",
      "git status ne montre rien d'inattendu",
      "Rollback plan lu",
    ],
    postRunChecklist: [
      "git log -1 confirme le commit attendu",
      "Tests locaux passés (si applicable)",
      "Marquer le statut dans Gigi (déclaratif)",
    ],
    commands: [
      {
        label: "Statut du repo",
        commandText: "git status",
        explanation: "Voir les fichiers modifiés avant d'agir.",
        riskLevel: "low",
        requiresHumanEdit: false,
        placeholders: [],
        expectedOutput: "Liste des fichiers modifiés/staged",
      },
      {
        label: "Diff des changements",
        commandText: "git diff",
        explanation: "Relire chaque ligne avant commit.",
        riskLevel: "low",
        requiresHumanEdit: false,
        placeholders: [],
      },
      {
        label: "Commit (après revue)",
        commandText: 'git add -p\ngit commit -m "<MESSAGE>"',
        explanation: "Staging interactif — ne pas copier aveuglément.",
        riskLevel: "high",
        requiresHumanEdit: true,
        placeholders: ["<MESSAGE>"],
        failureSigns: "Hook pre-commit échoue, mauvais fichiers staged",
        rollbackHint: "git reset --soft HEAD~1 si commit prématuré",
      },
    ],
    rollbackCommands: [
      {
        label: "Annuler dernier commit (soft)",
        commandText: "git reset --soft HEAD~1",
        explanation: "Garde les changements staged — à utiliser avec prudence.",
        riskLevel: "high",
        requiresHumanEdit: false,
        placeholders: [],
      },
    ],
    expectedOutcome: "Commit local créé manuellement avec message explicite.",
    knownRisks: ["Commit sur mauvaise branche", "Fichiers sensibles inclus"],
    requiredSecretsNames: [],
  },
  {
    id: "github_pr",
    title: "GitHub PR — checklist manuelle",
    description: "Checklist PR sans appel API GitHub depuis Gigi.",
    connectorId: "github",
    riskLevel: "critical",
    humanGoal: "Ouvrir une PR proprement via CLI ou interface GitHub.",
    environmentAssumptions: ["Remote origin configuré", "Branche poussée", PLACEHOLDER_NOTE],
    prerequisites: ["Tests locaux OK", "Diff relu", "Aucun secret dans le diff"],
    preflightChecklist: [
      "Branche <BRANCH_NAME> poussée sur origin",
      "Token <TOKEN_NAME_ONLY> disponible localement (hors Gigi)",
      "Description PR préparée",
    ],
    postRunChecklist: ["PR visible sur GitHub", "Reviewers assignés", "CI déclenchée (humain)"],
    commands: [
      {
        label: "Créer PR via gh CLI (exemple)",
        commandText:
          'gh pr create --title "<PR_TITLE>" --body "<PR_BODY>" --base main --head <BRANCH_NAME>',
        explanation: "Exécuter dans ton terminal — Gigi ne lance pas gh.",
        riskLevel: "critical",
        requiresHumanEdit: true,
        placeholders: ["<PR_TITLE>", "<PR_BODY>", "<BRANCH_NAME>"],
        expectedOutput: "URL de la PR",
        failureSigns: "Auth failed, branche introuvable",
      },
    ],
    rollbackCommands: [
      {
        label: "Fermer PR (interface)",
        commandText: "# Fermer la PR manuellement sur github.com — aucune action Gigi",
        explanation: "Rollback via UI GitHub.",
        riskLevel: "medium",
        requiresHumanEdit: false,
        placeholders: [],
      },
    ],
    expectedOutcome: "PR ouverte manuellement sur GitHub.",
    knownRisks: ["Token exposé", "PR vers mauvaise base"],
    requiredSecretsNames: ["GITHUB_TOKEN (nom seulement — jamais stocké dans Gigi)"],
  },
  {
    id: "n8n_workflow",
    title: "n8n workflow — checklist manuelle",
    description: "Étapes pour configurer/déclencher un workflow n8n manuellement.",
    connectorId: "n8n",
    riskLevel: "critical",
    humanGoal: "Préparer un workflow n8n sans déclenchement depuis Gigi.",
    environmentAssumptions: ["Instance n8n accessible", PLACEHOLDER_NOTE],
    prerequisites: ["Workflow ID connu", "Credentials configurés dans n8n (hors Gigi)"],
    preflightChecklist: ["Workflow en mode test", "Payload relu", "Pas de prod sans validation"],
    postRunChecklist: ["Exécution visible dans n8n", "Logs vérifiés", "Erreurs documentées"],
    commands: [
      {
        label: "Payload exemple (JSON)",
        commandText:
          '{\n  "workflowId": "<WORKFLOW_ID>",\n  "data": {}\n}\n# Coller dans n8n manuellement — ne pas appeler depuis Gigi',
        explanation: "Structure à reproduire dans l'UI n8n.",
        riskLevel: "high",
        requiresHumanEdit: true,
        placeholders: ["<WORKFLOW_ID>"],
      },
    ],
    rollbackCommands: [],
    expectedOutcome: "Workflow testé manuellement dans n8n.",
    knownRisks: ["Déclenchement prod accidentel", "Webhook public"],
    requiredSecretsNames: ["N8N_API_KEY (nom seulement — jamais stocké dans Gigi)"],
  },
  {
    id: "browser_checklist",
    title: "Navigateur — checklist manuelle",
    description: "Étapes à suivre manuellement dans le navigateur.",
    connectorId: "browser",
    riskLevel: "medium",
    humanGoal: "Vérifier une page ou action web sans automation Gigi.",
    environmentAssumptions: ["Navigateur à jour", PLACEHOLDER_NOTE],
    prerequisites: ["URL validée", "Compte connecté si nécessaire"],
    preflightChecklist: ["URL correcte (<URL>)", "Pas de données sensibles visibles"],
    postRunChecklist: ["Capture ou notes prises", "Action confirmée visuellement"],
    commands: [
      {
        label: "Ouvrir URL",
        commandText: "https://<DOMAIN>/<PATH>\n# Ouvrir manuellement dans le navigateur",
        explanation: "Copier l'URL — ne pas automatiser.",
        riskLevel: "low",
        requiresHumanEdit: true,
        placeholders: ["<DOMAIN>", "<PATH>"],
      },
    ],
    rollbackCommands: [],
    expectedOutcome: "Action navigateur effectuée manuellement.",
    knownRisks: ["Phishing", "Session partagée"],
    requiredSecretsNames: [],
  },
  {
    id: "file_edit",
    title: "Édition fichier — checklist manuelle",
    description: "Checklist pour modifier des fichiers hors Gigi.",
    connectorId: "file_write",
    riskLevel: "high",
    humanGoal: "Éditer des fichiers localement avec rollback documenté.",
    environmentAssumptions: ["Backup ou git disponible", PLACEHOLDER_NOTE],
    prerequisites: ["Chemins validés", "Permissions fichiers OK"],
    preflightChecklist: ["Fichier <FILE_PATH> identifié", "Backup ou commit préalable"],
    postRunChecklist: ["Diff relu", "App/build OK si applicable"],
    commands: [
      {
        label: "Ouvrir fichier",
        commandText: "# Éditer manuellement : <FILE_PATH>",
        explanation: "Utiliser ton éditeur — Gigi n'écrit pas le fichier.",
        riskLevel: "medium",
        requiresHumanEdit: true,
        placeholders: ["<FILE_PATH>"],
      },
    ],
    rollbackCommands: [
      {
        label: "Restaurer depuis git",
        commandText: "git checkout -- <FILE_PATH>",
        explanation: "Annuler modifications non commitées — copier hors Gigi.",
        riskLevel: "high",
        requiresHumanEdit: true,
        placeholders: ["<FILE_PATH>"],
      },
    ],
    expectedOutcome: "Fichiers modifiés manuellement avec validation humaine.",
    knownRisks: ["Écrasement de données", "Mauvais chemin"],
    requiredSecretsNames: [],
  },
  {
    id: "email_draft",
    title: "Email brouillon — checklist manuelle",
    description: "Brouillon email à copier — aucun envoi depuis Gigi.",
    connectorId: "email",
    riskLevel: "medium",
    humanGoal: "Préparer un email à envoyer manuellement.",
    environmentAssumptions: ["Client email disponible", PLACEHOLDER_NOTE],
    prerequisites: ["Destinataires validés", "Ton et contenu relus"],
    preflightChecklist: ["Pas de secret dans le corps", "Pièces jointes vérifiées"],
    postRunChecklist: ["Email envoyé manuellement", "Copie archivée si besoin"],
    commands: [
      {
        label: "Corps du brouillon",
        commandText: "Objet: <SUBJECT>\n\nBonjour,\n\n<CORPS>\n\n— Signature",
        explanation: "Copier dans ton client email — Gigi n'envoie rien.",
        riskLevel: "medium",
        requiresHumanEdit: true,
        placeholders: ["<SUBJECT>", "<CORPS>"],
      },
    ],
    rollbackCommands: [],
    expectedOutcome: "Email envoyé manuellement par l'humain.",
    knownRisks: ["Envoi au mauvais destinataire", "Fuite de données"],
    requiredSecretsNames: [],
  },
];

export function getCommandPackTemplate(id: CommandPackTemplateDefinition["id"]) {
  return COMMAND_PACK_TEMPLATES.find((t) => t.id === id);
}

export function listCommandPackTemplates() {
  return [...COMMAND_PACK_TEMPLATES];
}
