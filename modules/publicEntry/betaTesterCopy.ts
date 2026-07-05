export const BETA_TESTER_STATUS = {
  label: "Statut bêta",
  value: "almost_beta_ready",
  version: "V3.4.0 · V3.5 en cours",
} as const;

export const BETA_TESTER_SCENARIOS = [
  {
    n: 1,
    title: "Mission du jour",
    action: "Ouvre / et comprends la mission proposée.",
    observe: "Titre clair, raison, CTA évident vers /actions ou conversation.",
  },
  {
    n: 2,
    title: "Action dominante",
    action: "Va sur /actions — repère l'action principale et l'étape active.",
    observe: "Stepper, message sécurité, pas d'exécution auto.",
  },
  {
    n: 3,
    title: "Modules avancés",
    action: "Ouvre les sections repliables sans te perdre.",
    observe: "V2/V3 restent accessibles mais secondaires.",
  },
  {
    n: 4,
    title: "Rapport d'exécution",
    action: "Colle un rapport manuel après exécution hors Gigi.",
    observe: "Intake local, pas de vérification repo.",
  },
  {
    n: 5,
    title: "Apprentissage",
    action: "Consulte /history — ce que Gigi en tire.",
    observe: "Apprentissage déclaratif, pas de sync cloud.",
  },
  {
    n: 6,
    title: "Suite recommandée",
    action: "Retourne sur / — mission ou action suivante.",
    observe: "Boucle mission → action → rapport → suite.",
  },
  {
    n: 7,
    title: "Demander à Gigi",
    action: 'Dans /conversation, demande « je fais quoi ? ».',
    observe: "Réponse locale, pilotage V3, pas d'autonomie.",
  },
  {
    n: 8,
    title: "Persistance locale",
    action: "Recharge la page après quelques actions.",
    observe: "Données localStorage intactes (gigi-os-v03-state, etc.).",
  },
] as const;

export const BETA_TESTER_LIMITS = [
  "Pas d'exécution automatique",
  "Pas d'appel GitHub, Supabase, n8n, email",
  "Pas de paiement ni checkout",
  "Pas de sync cloud",
  "Feedback stocké localement uniquement",
] as const;

export const BETA_TESTER_EXPECTED = [
  "Une mission claire par session",
  "Un flux /actions compréhensible",
  "Des CTA manuels explicites",
  "Un historique et apprentissage locaux",
  "Des limites annoncées honnêtement",
] as const;

export const BETA_FEEDBACK_PROMPTS = [
  "La mission était-elle claire ?",
  "Le CTA était-il évident ?",
  "À quel moment tu t'es perdu ?",
  "As-tu compris ce que Gigi ne fait pas ?",
  "Quelle étape t'a bloqué ?",
] as const;
