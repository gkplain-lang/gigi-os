import { PRODUCT_TAGLINE } from "@/lib/branding";

export const LANDING_HERO = {
  tagline: PRODUCT_TAGLINE,
  subtitle:
    "Gigi t'aide à choisir la mission la plus importante, à préparer l'action, à exécuter manuellement, puis à apprendre de ce qui s'est passé.",
  primaryCta: "Ouvrir l'app",
  primaryHref: "/",
  secondaryCta: "Voir le parcours bêta",
  secondaryHref: "/beta",
} as const;

export const LANDING_PROBLEM = {
  title: "Le problème",
  items: [
    "Trop de projets en parallèle",
    "Trop d'idées, pas assez de clarté",
    "Difficulté à choisir quoi faire aujourd'hui",
    "Dispersion au lieu d'une action nette",
  ],
} as const;

export const LANDING_SOLUTION = {
  title: "La réponse Gigi",
  items: [
    "Une mission prioritaire par jour",
    "Transformée en action concrète",
    "Plan et préparation avant l'exécution",
    "Exécution manuelle — tu restes aux commandes",
    "Apprentissage local à partir de ton rapport",
    "Suite recommandée pour demain",
  ],
} as const;

export const LANDING_HOW_IT_WORKS = {
  title: "Comment ça marche",
  steps: [
    { n: 1, label: "Mission du jour", detail: "Gigi tranche — une seule priorité." },
    { n: 2, label: "Action dominante", detail: "Sur /actions, l'étape claire à suivre." },
    { n: 3, label: "Exécution manuelle", detail: "Hors Gigi — Cursor, terminal, toi." },
    { n: 4, label: "Rapport", detail: "Tu colles ce qui s'est passé." },
    { n: 5, label: "Apprentissage", detail: "Gigi comprend le résultat localement." },
    { n: 6, label: "Suite recommandée", detail: "Prochaine mission ou action." },
  ],
} as const;

export const LANDING_AUDIENCE = {
  title: "Pour qui",
  items: [
    "Entrepreneurs et indépendants",
    "Créateurs avec plusieurs projets",
    "Builders qui veulent moins de bruit",
    "Personnes qui savent quoi faire — mais pas par où commencer",
  ],
} as const;

export const LANDING_SAFETY = {
  title: "Ce que Gigi ne fait pas encore",
  items: [
    "Il n'exécute rien automatiquement",
    "Il ne touche pas au repo ni aux fichiers",
    "Il ne lance aucune commande",
    "Il n'appelle aucun service externe",
    "Il ne remplace pas ta validation humaine",
  ],
  note: "Version locale, manuelle, pensée pour tester le flow mission-first.",
} as const;

export const LANDING_BETA = {
  title: "Tester Gigi",
  body: "La bêta V3 est presque prête — parcours guidé, checklist et retours locaux.",
  cta: "Commencer le test bêta",
  href: "/beta",
} as const;
