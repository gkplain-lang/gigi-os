import type { Mission } from "../missions/missionTypes";

export type CatalogProjectStatus = "active" | "paused" | "future";

export interface CatalogMission {
  id: string;
  projectId: string;
  title: string;
  reason: string;
  estimatedTime: string;
  impact: number;
  clarity: number;
  effort: number;
  score: number;
  tags: string[];
  status: CatalogProjectStatus;
  subtasks?: string[];
}

export const PROJECT_NAMES: Record<string, string> = {
  "buildy-clear": "Buildy Clear",
  "buildy-crafts": "Buildy Crafts",
  linko: "Linko",
  "1millimetre": "1Millimètre",
  "le-dernier-souvenir": "Le Dernier Souvenir",
  "gigi-os": "Gigi",
};

export const PROJECT_STATUS: Record<string, CatalogProjectStatus> = {
  "buildy-clear": "active",
  "buildy-crafts": "active",
  linko: "paused",
  "1millimetre": "paused",
  "le-dernier-souvenir": "future",
  "gigi-os": "active",
};

function computeScore(impact: number, clarity: number, effort: number): number {
  return impact * 5 + clarity * 3 + (10 - effort) * 2;
}

interface RawMission {
  id: string;
  projectId: string;
  title: string;
  reason: string;
  estimatedTime: string;
  impact: number;
  clarity: number;
  effort: number;
  tags: string[];
  subtasks?: string[];
}

const RAW: RawMission[] = [
  // ---- Buildy Clear (revenu court terme) ----
  {
    id: "bc-sales-page",
    projectId: "buildy-clear",
    title: "Finaliser la page de vente Buildy Clear",
    reason:
      "Buildy Clear est le projet le plus proche du revenu court terme. Une page claire te sépare encore du lancement.",
    estimatedTime: "~45 min",
    impact: 9,
    clarity: 9,
    effort: 3,
    tags: ["revenue", "launch"],
    subtasks: [
      "Finaliser le titre et la promesse de la page",
      "Vérifier que l'offre à 49 € est claire",
      "Préparer une première vidéo TikTok pour envoyer du trafic",
    ],
  },
  {
    id: "bc-checkout",
    projectId: "buildy-clear",
    title: "Vérifier le tunnel de paiement",
    reason: "Un paiement qui bloque, c'est du revenu perdu. Mieux vaut s'en assurer avant le trafic.",
    estimatedTime: "~30 min",
    impact: 8,
    clarity: 8,
    effort: 3,
    tags: ["revenue"],
  },
  {
    id: "bc-offer",
    projectId: "buildy-clear",
    title: "Préparer l'offre à 49 €",
    reason: "Une offre nette et sans ambiguïté rend la décision d'achat simple.",
    estimatedTime: "~30 min",
    impact: 8,
    clarity: 7,
    effort: 3,
    tags: ["revenue", "offer"],
  },
  {
    id: "bc-objections",
    projectId: "buildy-clear",
    title: "Écrire les objections principales",
    reason: "Répondre aux doutes avant qu'ils n'arrivent, c'est ce qui débloque les ventes.",
    estimatedTime: "~30 min",
    impact: 7,
    clarity: 7,
    effort: 3,
    tags: ["revenue", "copy"],
  },
  {
    id: "bc-tiktok",
    projectId: "buildy-clear",
    title: "Préparer une vidéo TikTok de vente",
    reason: "Une vidéo simple peut envoyer les premiers visiteurs vers la page.",
    estimatedTime: "~40 min",
    impact: 7,
    clarity: 6,
    effort: 4,
    tags: ["revenue", "creative", "video", "acquisition"],
    subtasks: [
      "Choisir un angle simple et honnête",
      "Filmer une démo de 30 secondes",
      "Écrire une légende avec un appel clair",
    ],
  },
  {
    id: "bc-checklist",
    projectId: "buildy-clear",
    title: "Créer une checklist gratuite d'acquisition",
    reason: "Un petit cadeau utile attire les premiers contacts intéressés.",
    estimatedTime: "~40 min",
    impact: 7,
    clarity: 6,
    effort: 4,
    tags: ["revenue", "acquisition", "content"],
  },

  // ---- Buildy Crafts (long terme, produit) ----
  {
    id: "bcr-list-modules",
    projectId: "buildy-crafts",
    title: "Lister les modules manquants de la bibliothèque",
    reason:
      "Buildy Crafts est un projet long terme. Aujourd'hui, la meilleure action est de clarifier ce qui manque avant d'ajouter du contenu ou du code.",
    estimatedTime: "~45 min",
    impact: 8,
    clarity: 9,
    effort: 3,
    tags: ["longterm", "clarity", "product"],
    subtasks: [
      "Lister les catégories manquantes : charpente, ouvertures, menuiserie avancée",
      "Classer les ajouts par priorité métier",
      "Préparer une liste claire pour Cursor ou l'assistant devis",
    ],
  },
  {
    id: "bcr-prioritize",
    projectId: "buildy-crafts",
    title: "Prioriser les ajouts charpente / ouvertures / menuiserie avancée",
    reason: "Choisir l'ordre évite de tout ouvrir en même temps.",
    estimatedTime: "~40 min",
    impact: 7,
    clarity: 8,
    effort: 4,
    tags: ["longterm", "product"],
  },
  {
    id: "bcr-audit-devis",
    projectId: "buildy-crafts",
    title: "Auditer l'assistant devis",
    reason: "Repérer où le devis se trompe rend l'outil fiable pour les artisans.",
    estimatedTime: "~1 h",
    impact: 8,
    clarity: 7,
    effort: 5,
    tags: ["longterm", "maintenance", "audit"],
    subtasks: [
      "Repérer les cas où le devis se trompe",
      "Noter les 3 corrections les plus utiles",
      "Préparer un test simple pour vérifier",
    ],
  },
  {
    id: "bcr-plan-materials",
    projectId: "buildy-crafts",
    title: "Préparer le plan d'ajout de 10 000 matériaux",
    reason: "Un plan clair évite un chantier de données interminable.",
    estimatedTime: "~1 h",
    impact: 8,
    clarity: 6,
    effort: 7,
    tags: ["longterm", "product"],
  },
  {
    id: "bcr-structure-content",
    projectId: "buildy-crafts",
    title: "Structurer les contenus à relier au devis",
    reason: "Relier proprement le contenu au devis rend l'app cohérente.",
    estimatedTime: "~45 min",
    impact: 7,
    clarity: 7,
    effort: 5,
    tags: ["longterm", "product"],
  },
  {
    id: "bcr-check-calculators",
    projectId: "buildy-crafts",
    title: "Vérifier les calculateurs prioritaires",
    reason: "Des calculs justes, c'est la confiance des artisans.",
    estimatedTime: "~40 min",
    impact: 7,
    clarity: 7,
    effort: 4,
    tags: ["longterm", "maintenance"],
  },

  // ---- Linko (stratégique, en pause) ----
  {
    id: "lk-positioning",
    projectId: "linko",
    title: "Clarifier le positionnement de Linko",
    reason:
      "Linko est en pause. La meilleure action n'est pas de tout relancer, mais de clarifier ce que c'est, pour décider plus tard sereinement.",
    estimatedTime: "~30 min",
    impact: 7,
    clarity: 8,
    effort: 2,
    tags: ["strategy", "clarity"],
    subtasks: [
      "Écrire en une phrase le problème que Linko résout",
      "Vérifier que le nom est disponible",
      "Décider d'une date pour trancher",
    ],
  },
  {
    id: "lk-ideal-profile",
    projectId: "linko",
    title: "Définir la fiche entreprise idéale",
    reason: "Savoir à qui ça s'adresse rend tout le reste plus simple.",
    estimatedTime: "~30 min",
    impact: 6,
    clarity: 7,
    effort: 3,
    tags: ["strategy", "product"],
  },
  {
    id: "lk-review-criteria",
    projectId: "linko",
    title: "Lister les critères d'avis vérifiés",
    reason: "La confiance passe par des avis crédibles et vérifiables.",
    estimatedTime: "~30 min",
    impact: 6,
    clarity: 7,
    effort: 3,
    tags: ["product"],
  },
  {
    id: "lk-acquisition",
    projectId: "linko",
    title: "Préparer une stratégie d'acquisition artisans",
    reason: "Sans premiers artisans, pas de valeur. Mais ça peut attendre la reprise.",
    estimatedTime: "~45 min",
    impact: 7,
    clarity: 6,
    effort: 5,
    tags: ["strategy", "acquisition"],
  },
  {
    id: "lk-promise",
    projectId: "linko",
    title: "Écrire la promesse utilisateur",
    reason: "Une promesse claire guide tout le produit.",
    estimatedTime: "~25 min",
    impact: 6,
    clarity: 7,
    effort: 2,
    tags: ["clarity", "copy"],
  },

  // ---- 1Millimètre (jeu expérimental, en pause) ----
  {
    id: "mm-gameplay-loop",
    projectId: "1millimetre",
    title: "Revoir la boucle de gameplay",
    reason: "1Millimètre est une expérimentation. Aujourd'hui, l'objectif est d'apprendre, pas de finir.",
    estimatedTime: "~40 min",
    impact: 6,
    clarity: 6,
    effort: 4,
    tags: ["creative", "game"],
    subtasks: [
      "Rejouer la boucle et noter ce qui est fun",
      "Retirer une friction inutile",
      "Tester la nouvelle sensation",
    ],
  },
  {
    id: "mm-modes",
    projectId: "1millimetre",
    title: "Définir 3 modes de jeu",
    reason: "Quelques modes clairs valent mieux qu'une infinité d'idées floues.",
    estimatedTime: "~40 min",
    impact: 6,
    clarity: 6,
    effort: 4,
    tags: ["creative", "game"],
  },
  {
    id: "mm-monetization",
    projectId: "1millimetre",
    title: "Clarifier la monétisation pub",
    reason: "Savoir comment ça pourrait rapporter, sans se disperser dessus maintenant.",
    estimatedTime: "~30 min",
    impact: 6,
    clarity: 6,
    effort: 4,
    tags: ["revenue", "game"],
  },
  {
    id: "mm-cut-feedback",
    projectId: "1millimetre",
    title: "Améliorer le feedback de coupe",
    reason: "Une sensation de jeu nette, c'est ce qui donne envie de rejouer.",
    estimatedTime: "~40 min",
    impact: 5,
    clarity: 6,
    effort: 4,
    tags: ["creative", "game", "polish"],
  },
  {
    id: "mm-loop-simple",
    projectId: "1millimetre",
    title: "Écrire une boucle addictive simple",
    reason: "La simplicité est souvent ce qui accroche le plus.",
    estimatedTime: "~30 min",
    impact: 6,
    clarity: 6,
    effort: 4,
    tags: ["creative", "game"],
  },

  // ---- Le Dernier Souvenir (créatif, futur) ----
  {
    id: "ds-concept",
    projectId: "le-dernier-souvenir",
    title: "Clarifier le concept",
    reason:
      "Le Dernier Souvenir est une idée créative pour plus tard. Aujourd'hui, il s'agit juste de capturer l'intention, pas de lancer le projet.",
    estimatedTime: "~25 min",
    impact: 5,
    clarity: 6,
    effort: 2,
    tags: ["creative", "story", "clarity"],
    subtasks: [
      "Écrire le concept en 3 lignes",
      "Poser le ton et l'ambiance",
      "Ranger l'idée pour y revenir",
    ],
  },
  {
    id: "ds-pitch",
    projectId: "le-dernier-souvenir",
    title: "Écrire le pitch",
    reason: "Un pitch court fige l'essence de l'histoire.",
    estimatedTime: "~25 min",
    impact: 5,
    clarity: 6,
    effort: 2,
    tags: ["creative", "story"],
  },
  {
    id: "ds-format",
    projectId: "le-dernier-souvenir",
    title: "Définir le format",
    reason: "Choisir le format oriente toutes les idées suivantes.",
    estimatedTime: "~30 min",
    impact: 5,
    clarity: 5,
    effort: 3,
    tags: ["creative", "story"],
  },
  {
    id: "ds-scenes",
    projectId: "le-dernier-souvenir",
    title: "Lister les premières scènes ou idées",
    reason: "Capturer les images fortes avant qu'elles ne s'échappent.",
    estimatedTime: "~30 min",
    impact: 5,
    clarity: 5,
    effort: 3,
    tags: ["creative", "story"],
  },

  // ---- Gigi OS (outil interne / futur produit) ----
  {
    id: "go-test-proto",
    projectId: "gigi-os",
    title: "Tester le prototype conversationnel",
    reason:
      "Gigi est ton OS personnel en construction. Le tester révèle vite ce qui sonne juste ou faux.",
    estimatedTime: "~30 min",
    impact: 7,
    clarity: 7,
    effort: 3,
    tags: ["product", "learning"],
    subtasks: [
      "Tester la conversation avec 3 objectifs différents",
      "Noter ce qui sonne faux",
      "Corriger une réponse à la fois",
    ],
  },
  {
    id: "go-decision-engine",
    projectId: "gigi-os",
    title: "Améliorer le moteur de décision",
    reason: "Un meilleur choix de mission, c'est le cœur de Gigi.",
    estimatedTime: "~1 h",
    impact: 7,
    clarity: 6,
    effort: 5,
    tags: ["product"],
  },
  {
    id: "go-memory",
    projectId: "gigi-os",
    title: "Préparer la future mémoire persistante de Gigi",
    reason: "Poser les bases pour que Gigi se souvienne, plus tard.",
    estimatedTime: "~1 h",
    impact: 6,
    clarity: 6,
    effort: 6,
    tags: ["product", "infra"],
  },
  {
    id: "go-integrations",
    projectId: "gigi-os",
    title: "Définir les premières intégrations utiles",
    reason: "Choisir quoi connecter en premier, sans se disperser.",
    estimatedTime: "~45 min",
    impact: 6,
    clarity: 5,
    effort: 6,
    tags: ["product", "strategy"],
  },
  {
    id: "go-audit-prompt",
    projectId: "gigi-os",
    title: "Écrire le prompt d'audit V0.3",
    reason: "Un audit clair garde le prototype sous contrôle.",
    estimatedTime: "~30 min",
    impact: 6,
    clarity: 7,
    effort: 3,
    tags: ["maintenance", "docs"],
  },
];

export const MISSION_CATALOG: CatalogMission[] = RAW.map((m) => ({
  ...m,
  score: computeScore(m.impact, m.clarity, m.effort),
  status: PROJECT_STATUS[m.projectId],
}));

/** Stable id of the mission Gigi recommends by default on first open. */
export const DEFAULT_MISSION_ID = "bc-sales-page";

/** Convert a catalog mission into a V0.3 Mission, preserving its stable id. */
export function catalogToMission(cm: CatalogMission): Mission {
  return {
    id: cm.id,
    title: cm.title.endsWith(".") ? cm.title : `${cm.title}.`,
    projectId: cm.projectId,
    projectName: PROJECT_NAMES[cm.projectId] ?? cm.projectId,
    reason: cm.reason,
    estimatedDuration: cm.estimatedTime,
    expectedImpact: cm.impact >= 8 ? "Élevé" : cm.impact >= 5 ? "Moyen" : "Faible",
    confidence: cm.score,
    status: "recommended",
  };
}

export function getCatalogMission(id: string): CatalogMission | undefined {
  return MISSION_CATALOG.find((m) => m.id === id);
}
