export const ONBOARDING_GUIDE_STEPS = [
  {
    id: "what",
    title: "C'est quoi Gigi ?",
    body: "Un OS personnel mission-first : une seule mission prioritaire par jour pour réduire la dispersion.",
    bullets: [
      "Pas une todo-list — une décision",
      "Local-first, sans cloud obligatoire",
      "Pensé pour entrepreneurs, créateurs et builders",
    ],
  },
  {
    id: "how",
    title: "Comment Gigi travaille ?",
    body: "Un cycle simple que tu répètes chaque jour.",
    bullets: [
      "Mission → action → préparation",
      "Exécution manuelle hors Gigi",
      "Rapport → apprentissage → suite recommandée",
    ],
  },
  {
    id: "you",
    title: "Ce que tu dois faire",
    body: "Gigi propose — tu valides et tu exécutes.",
    bullets: [
      "Valider ou choisir une mission",
      "Suivre le CTA vers /actions",
      "Exécuter manuellement (Cursor, terminal, etc.)",
      "Coller un rapport et lire la suite",
    ],
  },
  {
    id: "limits",
    title: "Ce que Gigi ne fait pas",
    body: "Important pour tester sans fausses attentes.",
    bullets: [
      "Pas d'exécution automatique",
      "Pas de Git, n8n ou API depuis l'app",
      "Pas de cloud / sync automatique",
      "Pas de suppression de données sans toi",
    ],
  },
  {
    id: "start",
    title: "Commencer",
    body: "Choisis par où entrer dans l'app.",
    bullets: [],
  },
] as const;
