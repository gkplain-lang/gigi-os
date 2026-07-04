import {
  MISSION_CATALOG,
  PROJECT_NAMES,
  PROJECT_STATUS,
  catalogToMission,
  type CatalogMission,
} from "./missionCatalog";
import {
  ACTION_PLAN_DRY_RUN_MESSAGE,
  buildActionPlanForProject,
  detectActionPlanIntent,
  getActionPlanStepsAsTasks,
} from "@/modules/actionPlans";
import {
  PREPARED_ACTION_DRY_RUN_MESSAGE,
  buildPreparedActionForProject,
  detectPreparedActionIntent,
} from "@/modules/preparedActions";
import { PREPARED_ACTION_TYPE_LABELS } from "@/modules/preparedActions/types";
import type {
  ConversationContext,
  ConversationIntent,
  GigiConversationResponse,
  NotNowItem,
} from "./conversationTypes";

/**
 * Local, deterministic decision "brain" — no AI, no API, no network.
 * It listens to the user's intent, respects an explicitly named project,
 * proposes a mission + an alternative, asks for clarification when vague,
 * and NEVER recommends a mission that is already completed.
 */

// ---------------------------------------------------------------- keywords

const REVENUE_KEYWORDS = [
  "argent",
  "revenu",
  "vendre",
  "vente",
  "gagner",
  "rentab",
  "rentable",
  "500",
  "euro",
  "eur",
  "cash",
  "chiffre d'affaire",
  "chiffre d affaire",
  "ca ",
  "lancement commercial",
  "monetis",
  "court terme",
];

const FOCUS_KEYWORDS = [
  "focus",
  "disperse",
  "dispersion",
  "trop de projet",
  "quoi faire aujourd'hui",
  "quoi faire aujourd hui",
  "faire aujourd'hui",
  "faire aujourd hui",
  "par quoi commencer",
  "je fais quoi",
  "prioritaire",
  "me concentrer",
  "concentr",
  "prochaine",
  "maintenant",
  "la suite",
  "et apres",
  "et ensuite",
];

const DAILY_REVIEW_KEYWORDS = [
  "revue du jour",
  "daily review",
  "fais ma revue",
  "fait ma revue",
  "mon bilan",
  "bilan",
  "review",
  "ou j en suis",
  "où j'en suis",
  "point sur",
  "recap",
  "récap",
  "qu est ce que je dois faire aujourd hui",
  "que faire aujourd hui",
];

const ALTERNATIVE_KEYWORDS = [
  "autre chose",
  "autre option",
  "une autre",
  "un autre",
  "propose autre",
  "propose-moi autre",
  "pas envie",
  "donne moi une autre",
  "donne-moi une autre",
  "autre mission",
  "change de mission",
  "une alternative",
  "autrement",
  "sinon",
  "pas ca",
];

const CREATIVE_KEYWORDS = [
  "idee creative",
  "creatif",
  "creative",
  "video",
  "tiktok",
  "contenu",
  "histoire",
  "narratif",
  "jeu",
  "gameplay",
  "inspiration",
  "story",
];

const MAINTENANCE_KEYWORDS = [
  "ranger",
  "organiser",
  "nettoyer",
  "menage",
  "github",
  "docs",
  "documentation",
  "bug",
  "verifier",
  "audit",
  "auditer",
  "refactor",
  "mettre de l'ordre",
  "mettre de l ordre",
  "remettre de l'ordre",
  "remettre de l ordre",
];

const UNCLEAR_KEYWORDS = [
  "je sais pas",
  "sais pas",
  "aucune idee",
  "aide moi",
  "aide-moi",
  "aidez moi",
  "bof",
  "perdu",
  "sais plus",
  "hmm",
];

// ---------------------------------------------------------------- helpers

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function detectProject(norm: string): string | null {
  if (/buildy ?crafts|(^|\W)crafts(\W|$)/.test(norm)) return "buildy-crafts";
  if (/buildy ?clear|(^|\W)clear(\W|$)/.test(norm)) return "buildy-clear";
  if (/linko/.test(norm)) return "linko";
  if (/1 ?millimetre|millimetre|1mm/.test(norm)) return "1millimetre";
  if (/dernier souvenir|souvenir/.test(norm)) return "le-dernier-souvenir";
  if (/gigi ?os|gigios/.test(norm)) return "gigi-os";
  return null;
}

function matchesAny(norm: string, keywords: string[]): boolean {
  return keywords.some((k) => norm.includes(normalize(k)));
}

function byScore(a: CatalogMission, b: CatalogMission): number {
  return b.score - a.score;
}

function projectMissions(pool: CatalogMission[], projectId: string): CatalogMission[] {
  return pool.filter((m) => m.projectId === projectId).sort(byScore);
}

function missionsWithAnyTag(pool: CatalogMission[], tags: string[]): CatalogMission[] {
  return pool.filter((m) => m.tags.some((t) => tags.includes(t))).sort(byScore);
}

function activeMissions(pool: CatalogMission[]): CatalogMission[] {
  return pool.filter((m) => m.status === "active").sort(byScore);
}

function deriveTasks(cm: CatalogMission): string[] {
  if (cm.subtasks && cm.subtasks.length >= 3) return cm.subtasks.slice(0, 3);
  return [
    `${cm.title} — poser la première petite étape`,
    "Avancer 45 minutes, sans rien ouvrir d'autre",
    "Noter où tu t'arrêtes pour reprendre facilement",
  ];
}

const NOT_NOW_ORDER = [
  "buildy-clear",
  "buildy-crafts",
  "linko",
  "1millimetre",
  "le-dernier-souvenir",
  "gigi-os",
];

const NOT_NOW_BASE: Record<string, string> = {
  "buildy-clear": "important pour le revenu",
  "buildy-crafts": "stratégique long terme",
  linko: "en pause",
  "1millimetre": "expérimental",
  "le-dernier-souvenir": "idée future",
  "gigi-os": "infrastructure",
};

function buildNotNow(selectedProjectId: string, intent: ConversationIntent): NotNowItem[] {
  return NOT_NOW_ORDER.filter((id) => id !== selectedProjectId).map((id) => {
    let reason = NOT_NOW_BASE[id];
    if (
      id === "buildy-clear" &&
      intent === "project_specific" &&
      selectedProjectId !== "buildy-clear"
    ) {
      reason = `important pour le revenu, mais tu as demandé ${PROJECT_NAMES[selectedProjectId]}`;
    }
    return { projectName: PROJECT_NAMES[id], reason };
  });
}

function secondOption(
  pool: CatalogMission[],
  selected: CatalogMission,
  sameProject: boolean
): CatalogMission | undefined {
  if (sameProject) {
    const inProject = projectMissions(pool, selected.projectId).filter((m) => m.id !== selected.id);
    if (inProject[0]) return inProject[0];
  }
  const rest = [...pool].sort(byScore).filter((m) => m.id !== selected.id);
  const differentProject = rest.filter((m) => m.projectId !== selected.projectId);
  const active = differentProject.filter((m) => m.status === "active");
  return active[0] ?? differentProject[0] ?? rest[0];
}

// ---------------------------------------------------------------- intent

interface DetectedIntent {
  intent: ConversationIntent;
  projectId: string | null;
  negatedProjectId: string | null;
}

export function detectIntent(objective: string): DetectedIntent {
  const norm = normalize(objective);
  const projectId = detectProject(norm);
  const isNegated = /\b(pas|sans|plutot que|au lieu de)\b/.test(norm) && projectId !== null;

  if (matchesAny(norm, ALTERNATIVE_KEYWORDS) || isNegated) {
    return {
      intent: "alternative",
      projectId: isNegated ? null : projectId,
      negatedProjectId: isNegated ? projectId : null,
    };
  }

  if (projectId) {
    return { intent: "project_specific", projectId, negatedProjectId: null };
  }

  if (matchesAny(norm, REVENUE_KEYWORDS)) {
    return { intent: "revenue", projectId: null, negatedProjectId: null };
  }

  if (matchesAny(norm, CREATIVE_KEYWORDS)) {
    return { intent: "creative", projectId: null, negatedProjectId: null };
  }

  if (matchesAny(norm, MAINTENANCE_KEYWORDS)) {
    return { intent: "maintenance", projectId: null, negatedProjectId: null };
  }

  if (matchesAny(norm, DAILY_REVIEW_KEYWORDS)) {
    return { intent: "daily_review", projectId: null, negatedProjectId: null };
  }

  if (matchesAny(norm, FOCUS_KEYWORDS)) {
    return { intent: "focus", projectId: null, negatedProjectId: null };
  }

  const wordCount = norm.trim().split(/\s+/).filter(Boolean).length;
  if (matchesAny(norm, UNCLEAR_KEYWORDS) || wordCount <= 2) {
    return { intent: "unclear", projectId: null, negatedProjectId: null };
  }

  return { intent: "general", projectId: null, negatedProjectId: null };
}

// ---------------------------------------------------------------- copy

const INTENT_LABELS: Record<ConversationIntent, string> = {
  project_specific: "J'ai compris",
  revenue: "J'ai compris : revenu rapide",
  focus: "J'ai compris : remettre de l'ordre",
  daily_review: "Revue du jour",
  alternative: "J'ai compris : une autre option",
  creative: "J'ai compris : créatif / contenu",
  maintenance: "J'ai compris : rangement / audit",
  unclear: "Je veux être sûr de bien comprendre",
  general: "J'ai regardé tes projets",
  action_plan: "Plan d'action",
  prepared_action: "Action préparée",
};

function clarificationResponse(): GigiConversationResponse {
  return {
    intent: "unclear",
    intentLabel: INTENT_LABELS.unclear,
    listen: "Avant de te lancer, dis-moi juste une chose.",
    needsClarification: true,
    clarificationQuestion:
      "Tu veux avancer vers quoi aujourd'hui : revenu rapide, un projet précis, ou juste remettre de l'ordre ?",
    choices: [
      { label: "Revenu rapide", prompt: "Je veux gagner de l'argent rapidement" },
      { label: "Avancer un projet précis", prompt: "Que faire dans Buildy Crafts aujourd'hui ?" },
      { label: "Remettre de l'ordre", prompt: "Je me disperse, par quoi commencer ?" },
    ],
  };
}

function allDoneResponse(
  intent: ConversationIntent,
  listen: string,
  alt?: CatalogMission
): GigiConversationResponse {
  return {
    intent,
    intentLabel: INTENT_LABELS[intent],
    listen,
    needsClarification: false,
    alternative: alt
      ? { projectName: PROJECT_NAMES[alt.projectId], missionTitle: catalogToMission(alt).title }
      : undefined,
    finalMessage: "Le reste peut attendre.",
  };
}

// ---------------------------------------------------------------- main

function buildPreparedActionResponse(
  projectId: string,
  type: import("@/modules/preparedActions/types").PreparedActionType | null
): GigiConversationResponse {
  const projectName = PROJECT_NAMES[projectId] ?? projectId;
  const resolvedType = type ?? undefined;
  const plan = buildActionPlanForProject(projectId, projectName);
  const prepared = buildPreparedActionForProject(projectId, projectName, resolvedType ?? null, {
    plan: plan ?? undefined,
    sourceActionId: plan?.possibleFutureActions[0]?.id,
  });

  const typeLabel = PREPARED_ACTION_TYPE_LABELS[prepared.type];

  return {
    intent: "prepared_action",
    intentLabel: `${INTENT_LABELS.prepared_action} · ${typeLabel} · ${projectName}`,
    listen: `Voici l'action préparée — ${typeLabel.toLowerCase()} prêt à copier-coller, sans exécution.`,
    needsClarification: false,
    priorityProjectName: projectName,
    missionTitle: prepared.target ?? prepared.title,
    why: prepared.summary,
    preparedAction: prepared,
    preparedActionBlockedMessage: PREPARED_ACTION_DRY_RUN_MESSAGE,
    actionPlan: plan ?? undefined,
    finalMessage: "Valide, copie, puis exécute toi-même — Gigi ne lance rien.",
  };
}

function buildActionPlanResponse(
  objective: string,
  projectId: string,
  missionId: string | null
): GigiConversationResponse {
  const projectName = PROJECT_NAMES[projectId] ?? projectId;
  const plan = buildActionPlanForProject(projectId, projectName, missionId ?? undefined);

  if (!plan) {
    return {
      intent: "action_plan",
      intentLabel: INTENT_LABELS.action_plan,
      listen: `Je n'ai pas trouvé de plan pour ${projectName}.`,
      needsClarification: true,
      clarificationQuestion: "Quelle mission veux-tu transformer en plan d'action ?",
      choices: [
        { label: "Buildy Clear", prompt: "Gigi, avance Buildy Clear" },
        { label: "Buildy Crafts", prompt: "Gigi, prépare un plan pour Buildy Crafts" },
        { label: "Gigi", prompt: "Gigi, plan d'action pour Gigi OS" },
      ],
    };
  }

  return {
    intent: "action_plan",
    intentLabel: `${INTENT_LABELS.action_plan} · ${projectName}`,
    listen: `Voici comment exécuter « ${plan.title} » — étape par étape, sans rien lancer automatiquement.`,
    needsClarification: false,
    priorityProjectName: projectName,
    missionTitle: plan.title,
    why: plan.whyNow,
    tasks: getActionPlanStepsAsTasks(plan),
    actionPlan: plan,
    actionPlanBlockedMessage: ACTION_PLAN_DRY_RUN_MESSAGE,
    finalMessage: "Une action. Aucun bruit. Valide chaque étape avant d'exécuter.",
  };
}

export function askGigi(
  objective: string,
  _projects: unknown,
  context: ConversationContext = {}
): GigiConversationResponse {
  const preparedIntent = detectPreparedActionIntent(objective);
  if (preparedIntent.isPreparedAction) {
    const projectId =
      preparedIntent.projectId ??
      context.currentProjectId ??
      detectProject(normalize(objective));
    if (projectId) {
      return buildPreparedActionResponse(projectId, preparedIntent.type);
    }
    return {
      intent: "prepared_action",
      intentLabel: INTENT_LABELS.prepared_action,
      listen: "Tu veux une action préparée — dis-moi sur quel projet et quel type.",
      needsClarification: true,
      clarificationQuestion: "Quelle action préparer ?",
      choices: [
        { label: "Prompt Cursor · Buildy Clear", prompt: "Gigi, prépare le prompt Cursor pour Buildy Clear" },
        { label: "Checklist · Buildy Crafts", prompt: "Gigi, fais-moi une checklist pour Buildy Crafts" },
        { label: "Branche · Gigi OS", prompt: "Gigi, prépare la branche pour Gigi OS" },
      ],
    };
  }

  const planIntent = detectActionPlanIntent(objective);
  if (planIntent.isActionPlan) {
    const projectId =
      planIntent.projectId ??
      context.currentProjectId ??
      detectProject(normalize(objective));
    if (projectId) {
      return buildActionPlanResponse(objective, projectId, planIntent.missionId);
    }
    return {
      intent: "action_plan",
      intentLabel: INTENT_LABELS.action_plan,
      listen: "Tu veux un plan d'action — dis-moi sur quel projet.",
      needsClarification: true,
      clarificationQuestion: "Sur quel projet veux-tu un plan d'action concret ?",
      choices: [
        { label: "Buildy Clear", prompt: "Gigi, avance Buildy Clear" },
        { label: "Buildy Crafts", prompt: "Gigi, prépare un plan pour Buildy Crafts" },
        { label: "Gigi OS", prompt: "Gigi, plan d'action pour améliorer Gigi" },
      ],
    };
  }

  const detected = detectIntent(objective);
  const { intent } = detected;

  if (intent === "unclear") {
    return clarificationResponse();
  }

  // Exclude every completed mission — they must never be recommended again.
  const completed = new Set(context.completedMissionIds ?? []);
  const pool = MISSION_CATALOG.filter((m) => !completed.has(m.id));
  const hasCompleted = completed.size > 0;

  let selected: CatalogMission | undefined;
  let sameProjectAlternative = false;
  let warning: string | undefined;
  let listen: string;
  let intentLabel: string = INTENT_LABELS[intent];

  if (intent === "project_specific" && detected.projectId) {
    const pid = detected.projectId;
    const available = projectMissions(pool, pid);
    intentLabel = `${INTENT_LABELS.project_specific} : ${PROJECT_NAMES[pid]}`;

    if (available.length === 0) {
      const globalAlt = activeMissions(pool)[0];
      return allDoneResponse(
        "project_specific",
        `Toutes les missions importantes de ${PROJECT_NAMES[pid]} sont terminées pour l'instant.`,
        globalAlt
      );
    }

    selected = available[0];
    sameProjectAlternative = true;

    const status = PROJECT_STATUS[pid];
    if (status === "paused") {
      listen = `Ok, je reste sur ${PROJECT_NAMES[pid]}. C'est en pause, donc je choisis une mission courte et claire.`;
      warning = "Mais si ton objectif est le revenu court terme, Buildy Clear reste plus urgent.";
    } else if (status === "future") {
      listen = `Ok, je reste sur ${PROJECT_NAMES[pid]}. C'est un projet pour plus tard, donc on capture juste l'intention.`;
      warning = "Si tu cherches du concret aujourd'hui, Buildy Clear avance plus vite.";
    } else {
      listen = `Ok, je reste sur ${PROJECT_NAMES[pid]}.`;
      if (pid !== "buildy-clear") {
        warning =
          "Je garde Buildy Clear en tête pour le revenu, mais je reste sur ce que tu m'as demandé.";
      }
    }
  } else if (intent === "revenue") {
    selected = missionsWithAnyTag(pool, ["revenue"])[0];
    listen = "Je vois que tu cherches surtout du revenu rapide.";
  } else if (intent === "creative") {
    selected = missionsWithAnyTag(pool, ["creative", "video", "content", "story", "game"])[0];
    listen = "Envie de créer un peu. Cadrons ça pour que ce soit utile.";
    if (selected && selected.projectId !== "buildy-clear") {
      warning =
        "Sympa à faire — mais garde en tête que ce n'est pas ce qui rapproche le plus du revenu.";
    }
  } else if (intent === "maintenance") {
    selected = missionsWithAnyTag(pool, ["maintenance", "audit", "docs"])[0];
    listen = "Ok, on remet un peu d'ordre.";
  } else if (intent === "alternative") {
    const excludeId = context.excludeMissionId ?? context.currentMissionId;
    const excludeProject =
      detected.negatedProjectId ?? context.excludeProjectId ?? context.currentProjectId;
    const withinProject = detected.projectId;

    let altPool = [...pool].sort(byScore).filter((m) => m.id !== excludeId);
    if (withinProject) {
      altPool = altPool.filter((m) => m.projectId === withinProject);
    } else if (excludeProject) {
      const diff = altPool.filter((m) => m.projectId !== excludeProject);
      if (diff.length) altPool = diff;
    }
    const active = altPool.filter((m) => m.status === "active");
    selected = active[0] ?? altPool[0];
    listen = "Ok, autre chose. Voilà une option différente, crédible.";
    intentLabel = withinProject
      ? `${INTENT_LABELS.alternative} · ${PROJECT_NAMES[withinProject]}`
      : INTENT_LABELS.alternative;
  } else if (intent === "focus") {
    selected = activeMissions(pool)[0];
    listen = hasCompleted
      ? "Ta dernière mission est terminée. Voici la suite la plus claire."
      : "Tu n'as pas besoin de tout avancer aujourd'hui.";
  } else if (intent === "daily_review") {
    selected = activeMissions(pool)[0];
    listen = "Voici ta revue du jour. Une mission claire suffit.";
    intentLabel = INTENT_LABELS.daily_review;
  } else {
    // general
    selected = activeMissions(pool)[0];
    listen = hasCompleted
      ? "La précédente est terminée. Voici le prochain mouvement le plus clair."
      : "J'ai regardé tes projets. Voici le mouvement le plus clair.";
  }

  // Nothing left to recommend anywhere.
  if (!selected) {
    return allDoneResponse(
      intent,
      "Tes missions importantes sont terminées pour aujourd'hui. Tu peux souffler."
    );
  }

  const alt = secondOption(pool, selected, sameProjectAlternative);
  const mission = catalogToMission(selected);

  const finalMessageByIntent: Record<ConversationIntent, string> = {
    project_specific: `Reste dans ${PROJECT_NAMES[selected.projectId]}. Une mission claire suffit.`,
    revenue: "Une action. Aucun bruit. Démarre ici.",
    focus: "Le reste peut attendre.",
    daily_review: "Le reste peut attendre — concentre-toi sur cette mission.",
    alternative: "Tu peux avancer sans tout rouvrir.",
    creative: "Amuse-toi, mais garde le cap.",
    maintenance: "Un peu d'ordre, puis on repart.",
    general: "Le reste peut attendre.",
    unclear: "",
    action_plan: "Valide chaque étape avant d'exécuter.",
    prepared_action: "Valide, copie, puis exécute toi-même.",
  };

  return {
    intent,
    intentLabel,
    listen,
    needsClarification: false,
    priorityProjectName: PROJECT_NAMES[selected.projectId],
    mission,
    missionTitle: mission.title,
    why: selected.reason,
    tasks: deriveTasks(selected),
    warning,
    alternative: alt
      ? { projectName: PROJECT_NAMES[alt.projectId], missionTitle: catalogToMission(alt).title }
      : undefined,
    notNow: buildNotNow(selected.projectId, intent),
    finalMessage: finalMessageByIntent[intent],
  };
}
