export const EXECUTION_EXPERIENCE_V45_DISCLAIMER =
  "V4.5 — Couche d'expérience visible. Gigi prépare et structure — aucune exécution réelle, validation humaine obligatoire.";

export const EXECUTION_CAPABILITY_BADGES = [
  "Local",
  "Simulation",
  "Humain requis",
  "Aucun connecteur actif",
] as const;

export interface ExecutionCapabilityCard {
  id: string;
  title: string;
  description: string;
  cta: string;
  href: string;
  badges: string[];
}

export const EXECUTION_CAPABILITY_CARDS: ExecutionCapabilityCard[] = [
  {
    id: "actions",
    title: "Préparer une action",
    description: "Transforme une intention en demande locale contrôlée.",
    cta: "Ouvrir Actions",
    href: "/actions",
    badges: ["Local", "Simulation", "Humain requis"],
  },
  {
    id: "permissions",
    title: "Contrôler les permissions",
    description: "Vois ce qui est autorisé en dry-run, refusé ou bloqué.",
    cta: "Ouvrir Permissions",
    href: "/permissions",
    badges: ["Local", "Simulation", "Aucun connecteur actif"],
  },
  {
    id: "manual-bridge",
    title: "Créer un pont manuel",
    description: "Prépare les étapes sans activer de connecteur réel.",
    cta: "Ouvrir Pont manuel",
    href: "/manual-bridge",
    badges: ["Local", "Copie manuelle", "Humain requis"],
  },
  {
    id: "command-packs",
    title: "Préparer des commandes",
    description: "Génère des commandes à relire et copier toi-même.",
    cta: "Ouvrir Packs commandes",
    href: "/command-packs",
    badges: ["Local", "Copie manuelle", "Aucun connecteur actif"],
  },
  {
    id: "local-review",
    title: "Analyser un résultat",
    description: "Colle une sortie ou un log pour une revue locale prudente.",
    cta: "Ouvrir Revue locale",
    href: "/local-review",
    badges: ["Local", "Résultat collé", "Humain requis"],
  },
];

export interface V4JourneyStep {
  step: number;
  title: string;
  description: string;
  href: string;
  badge: string;
}

export const V4_EXECUTION_JOURNEY_STEPS: V4JourneyStep[] = [
  {
    step: 1,
    title: "Mission",
    description: "Tu choisis ce qu'il faut faire.",
    href: "/",
    badge: "Local",
  },
  {
    step: 2,
    title: "Demande locale",
    description: "Gigi prépare une demande, avec risques et rollback.",
    href: "/actions",
    badge: "Simulation",
  },
  {
    step: 3,
    title: "Permissions",
    description: "Tu vois ce qui est en dry-run, refusé ou bloqué.",
    href: "/permissions",
    badge: "Humain requis",
  },
  {
    step: 4,
    title: "Pont manuel",
    description: "Gigi transforme l'action en étapes manuelles.",
    href: "/manual-bridge",
    badge: "Copie manuelle",
  },
  {
    step: 5,
    title: "Packs commandes",
    description: "Gigi prépare des commandes à copier.",
    href: "/command-packs",
    badge: "Copie manuelle",
  },
  {
    step: 6,
    title: "Revue locale",
    description: "Tu colles le résultat, Gigi l'analyse localement.",
    href: "/local-review",
    badge: "Résultat collé",
  },
];

export interface CapabilityDemoExample {
  id: string;
  label: string;
  prompt: string;
  hint: string;
}

export const CAPABILITY_DEMO_EXAMPLES: CapabilityDemoExample[] = [
  {
    id: "git-branch",
    label: "Prépare les commandes pour créer une branche Git",
    prompt: "Prépare les commandes git pour une branche locale",
    hint: "Ouvre /command-packs ou dis-le à Gigi sur /conversation",
  },
  {
    id: "github-pr",
    label: "Prépare une checklist GitHub PR",
    prompt: "Prépare les commandes pour GitHub PR",
    hint: "Modèle GitHub PR — lancement humain uniquement",
  },
  {
    id: "n8n",
    label: "Prépare un workflow n8n manuel",
    prompt: "Fais-moi un pack n8n",
    hint: "Sandbox — aucun connecteur actif",
  },
  {
    id: "build-result",
    label: "J'ai lancé npm run build, analyse ce résultat",
    prompt: "J'ai lancé npm run build — voici la sortie terminal :",
    hint: "Colle le résultat sur /local-review",
  },
  {
    id: "blocked",
    label: "Montre-moi ce qui est bloqué",
    prompt: "Montre-moi ce qui est bloqué en exécution",
    hint: "Centre de permissions — dry-run et refus locaux",
  },
];

export const V4_SETTINGS_JOURNEY = [
  { version: "V4.0", label: "Readiness", href: "/actions" },
  { version: "V4.1", label: "Permissions", href: "/permissions" },
  { version: "V4.2", label: "Pont manuel", href: "/manual-bridge" },
  { version: "V4.3", label: "Packs commandes", href: "/command-packs" },
  { version: "V4.4", label: "Revue locale", href: "/local-review" },
] as const;
