import type {
  GitHubDryRunActionType,
  GitHubForbiddenActionType,
  GitHubPlanContext,
} from "./types";

export const GITHUB_DRY_RUN_ACTIONS: GitHubDryRunActionType[] = [
  "prepare_branch_plan",
  "prepare_commit_plan",
  "prepare_pull_request_plan",
  "prepare_merge_plan",
  "prepare_issue_plan",
  "prepare_release_note_plan",
];

export const GITHUB_FORBIDDEN_REAL_ACTIONS: GitHubForbiddenActionType[] = [
  "create_branch_real",
  "commit_real",
  "push_real",
  "create_pr_real",
  "merge_real",
  "delete_branch_real",
  "modify_repo_settings",
  "access_secrets",
  "read_private_repo_without_confirmation",
];

export const GITHUB_DRY_RUN_LABELS: Record<GitHubDryRunActionType, string> = {
  prepare_branch_plan: "Plan branche GitHub",
  prepare_commit_plan: "Plan commit GitHub",
  prepare_pull_request_plan: "Plan pull request GitHub",
  prepare_merge_plan: "Plan merge GitHub",
  prepare_issue_plan: "Plan issue GitHub",
  prepare_release_note_plan: "Plan release notes GitHub",
};

export const GITHUB_FORBIDDEN_LABELS: Record<GitHubForbiddenActionType, string> = {
  create_branch_real: "Création branche réelle",
  commit_real: "Commit git réel",
  push_real: "Push GitHub réel",
  create_pr_real: "Création PR réelle",
  merge_real: "Merge réel",
  delete_branch_real: "Suppression branche réelle",
  modify_repo_settings: "Modification paramètres repo",
  access_secrets: "Accès secrets GitHub",
  read_private_repo_without_confirmation: "Lecture repo privé sans confirmation",
};

export function isGitHubDryRunAction(type: string): type is GitHubDryRunActionType {
  return (GITHUB_DRY_RUN_ACTIONS as string[]).includes(type);
}

export function isGitHubForbiddenAction(type: string): type is GitHubForbiddenActionType {
  return (GITHUB_FORBIDDEN_REAL_ACTIONS as string[]).includes(type);
}

export function buildGitHubPlanSteps(
  action: GitHubDryRunActionType,
  ctx: GitHubPlanContext
): string[] {
  const msg = ctx.userMessage.trim().slice(0, 80);
  const steps: Record<GitHubDryRunActionType, string[]> = {
    prepare_branch_plan: [
      "Analyser la demande et le contexte projet local",
      `Proposer un nom de branche pour : « ${msg} »`,
      "Lister les fichiers / zones probablement concernés",
      "Documenter les commandes git suggérées (sans exécution)",
    ],
    prepare_commit_plan: [
      "Recenser les changements locaux décrits",
      "Proposer un message de commit structuré",
      "Vérifier qu'aucun secret ne serait inclus",
      "Documenter git add / commit suggérés (sans exécution)",
    ],
    prepare_pull_request_plan: [
      "Identifier branche source et cible",
      "Rédiger titre et description PR",
      "Lister checks recommandés avant merge",
      "Documenter gh pr create suggéré (sans appel API)",
    ],
    prepare_merge_plan: [
      "Vérifier branche source et cible",
      "Lister risques de conflit potentiels",
      "Proposer checklist pre-merge",
      "Documenter merge suggéré (sans exécution)",
    ],
    prepare_issue_plan: [
      "Structurer titre et corps d'issue",
      "Proposer labels et assignation",
      "Lier au contexte mission / projet local",
      "Documenter gh issue create suggéré (sans appel API)",
    ],
    prepare_release_note_plan: [
      "Synthétiser changements depuis historique local",
      "Proposer sections release notes",
      "Lister tags / version suggérés",
      "Documenter draft release (sans publication)",
    ],
  };
  return steps[action];
}

export function buildGitHubWouldDo(action: GitHubDryRunActionType): string[] {
  const map: Record<GitHubDryRunActionType, string[]> = {
    prepare_branch_plan: ["Proposer nom de branche", "Plan de travail documenté"],
    prepare_commit_plan: ["Message de commit suggéré", "Liste fichiers concernés"],
    prepare_pull_request_plan: ["Titre et description PR", "Checklist review"],
    prepare_merge_plan: ["Checklist pre-merge", "Plan de merge documenté"],
    prepare_issue_plan: ["Brouillon issue GitHub", "Labels suggérés"],
    prepare_release_note_plan: ["Brouillon release notes", "Version suggérée"],
  };
  return map[action];
}

export function buildGitHubWillNotDo(): string[] {
  return [
    "Appel API GitHub",
    "git commit / push / merge réels",
    "Création PR ou issue réelle",
    "Accès secrets ou repo privé",
    "Modification paramètres repository",
  ];
}

export function buildGitHubExpectedOutcome(action: GitHubDryRunActionType): string {
  return `[Dry-run GitHub] ${GITHUB_DRY_RUN_LABELS[action]} — plan documenté localement, aucune action externe.`;
}

export function forbiddenActionForDryRun(
  dryAction: GitHubDryRunActionType
): GitHubForbiddenActionType | undefined {
  const map: Partial<Record<GitHubDryRunActionType, GitHubForbiddenActionType>> = {
    prepare_branch_plan: "create_branch_real",
    prepare_commit_plan: "commit_real",
    prepare_pull_request_plan: "create_pr_real",
    prepare_merge_plan: "merge_real",
  };
  return map[dryAction];
}

interface IntentMatch {
  dryAction?: GitHubDryRunActionType;
  forbiddenAction?: GitHubForbiddenActionType;
  keywords: string[];
  priority: number;
}

const GITHUB_INTENT_PATTERNS: IntentMatch[] = [
  { forbiddenAction: "push_real", keywords: ["push", "pousse sur github"], priority: 11 },
  { forbiddenAction: "merge_real", keywords: ["merge dans", "merger dans", "fusionne dans"], priority: 11 },
  { forbiddenAction: "create_branch_real", keywords: ["cree la branche", "crée la branche", "create branch now"], priority: 10 },
  { forbiddenAction: "commit_real", keywords: ["git commit", "commit maintenant", "commit now"], priority: 10 },
  { forbiddenAction: "create_pr_real", keywords: ["cree la pr", "crée la pr", "create pr now"], priority: 10 },
  { forbiddenAction: "delete_branch_real", keywords: ["supprime la branche", "delete branch"], priority: 10 },
  { forbiddenAction: "access_secrets", keywords: ["secret github", "token github", "gh token"], priority: 10 },
  { forbiddenAction: "modify_repo_settings", keywords: ["parametres repo", "settings repo"], priority: 9 },
  {
    dryAction: "prepare_merge_plan",
    keywords: ["merge", "merger", "fusionne"],
    priority: 9,
  },
  {
    dryAction: "prepare_pull_request_plan",
    keywords: ["pull request", " ouvre une pr", "ouvre une pr", "ouvre pr", " ouvre pr", "pr github"],
    priority: 8,
  },
  {
    dryAction: "prepare_commit_plan",
    keywords: ["commit", "commiter"],
    priority: 7,
  },
  {
    dryAction: "prepare_branch_plan",
    keywords: ["branche github", "branch github", "branche pour", "branch for", "cree une branche", "crée une branche", "prepare une branche", "prépare une branche"],
    priority: 8,
  },
  {
    dryAction: "prepare_branch_plan",
    keywords: ["branche", "branch", "checkout -b"],
    priority: 6,
  },
  {
    dryAction: "prepare_issue_plan",
    keywords: ["issue github", "ouvre une issue", "ticket github"],
    priority: 7,
  },
  {
    dryAction: "prepare_release_note_plan",
    keywords: ["release note", "notes de release", "changelog github"],
    priority: 7,
  },
  {
    dryAction: "prepare_branch_plan",
    keywords: ["review github", "revue github"],
    priority: 7,
  },
];

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

export function isGitHubIntent(message: string): boolean {
  const norm = normalize(message);
  const githubSignals = ["github", "git ", " branche", "branch", "commit", "merge", " pull request", "pr ", " issue", "release note", "repo "];
  return GITHUB_INTENT_PATTERNS.some((p) =>
    p.keywords.some((kw) => norm.includes(normalize(kw)))
  ) || githubSignals.some((s) => norm.includes(normalize(s)));
}

export function matchGitHubIntents(message: string): IntentMatch[] {
  const norm = normalize(message);
  return GITHUB_INTENT_PATTERNS.filter((p) =>
    p.keywords.some((kw) => norm.includes(normalize(kw)))
  ).sort((a, b) => b.priority - a.priority);
}

export function resolvePrimaryGitHubAction(message: string): {
  dryAction: GitHubDryRunActionType;
  forbiddenAction?: GitHubForbiddenActionType;
} {
  const matches = matchGitHubIntents(message);
  const top = matches[0];

  if (top?.forbiddenAction && top.dryAction) {
    return { dryAction: top.dryAction, forbiddenAction: top.forbiddenAction };
  }
  if (top?.forbiddenAction) {
    const dryMap: Partial<Record<GitHubForbiddenActionType, GitHubDryRunActionType>> = {
      merge_real: "prepare_merge_plan",
      commit_real: "prepare_commit_plan",
      push_real: "prepare_commit_plan",
      create_branch_real: "prepare_branch_plan",
      create_pr_real: "prepare_pull_request_plan",
      delete_branch_real: "prepare_branch_plan",
    };
    return {
      dryAction: dryMap[top.forbiddenAction] ?? "prepare_branch_plan",
      forbiddenAction: top.forbiddenAction,
    };
  }
  if (top?.dryAction) {
    return { dryAction: top.dryAction };
  }

  return { dryAction: "prepare_branch_plan" };
}
