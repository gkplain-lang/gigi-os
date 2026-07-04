import type {
  ActionPlan,
  ActionPlanDeliverable,
  ActionPlanRisk,
  ActionPlanStep,
  PreparedActionPreview,
} from "./types";
import { VALIDATION_DEFAULTS } from "./actionPlanSummary";

type PlanTemplate = Omit<ActionPlan, "id" | "projectId" | "missionId">;

function steps(...items: Omit<ActionPlanStep, "id" | "order">[]): ActionPlanStep[] {
  return items.map((item, i) => ({
    ...item,
    id: `step-${i + 1}`,
    order: i + 1,
  }));
}

function deliverables(...items: Omit<ActionPlanDeliverable, "id">[]): ActionPlanDeliverable[] {
  return items.map((item, i) => ({ ...item, id: `del-${i + 1}` }));
}

function risks(...items: Omit<ActionPlanRisk, "id">[]): ActionPlanRisk[] {
  return items.map((item, i) => ({ ...item, id: `risk-${i + 1}` }));
}

function futureActions(...items: Omit<PreparedActionPreview, "requiresConfirmation" | "dryRunOnly">[]): PreparedActionPreview[] {
  return items.map((item) => ({
    ...item,
    requiresConfirmation: true as const,
    dryRunOnly: true as const,
  }));
}

const STANDARD_FUTURE_SALES = futureActions(
  {
    id: "fa-cursor",
    label: "Générer un prompt Cursor",
    type: "cursor_prompt",
    description: "Prompt pour réécrire une section de la page de vente.",
  },
  {
    id: "fa-checklist",
    label: "Préparer une checklist tunnel",
    type: "checklist",
    description: "Liste de vérification landing → checkout → confirmation.",
  },
  {
    id: "fa-branch",
    label: "Préparer une branche Git",
    type: "branch_plan",
    description: "Nom de branche et scope de changements — sans création réelle.",
  },
  {
    id: "fa-draft",
    label: "Préparer un brouillon de copy",
    type: "file_draft",
    description: "Structure hero + objections en markdown — sans écriture fichier.",
  }
);

export const MISSION_PLAN_TEMPLATES: Record<string, PlanTemplate> = {
  "bc-sales-page": {
    title: "Finaliser la page de vente Buildy Clear",
    summary:
      "Structurer et optimiser la page de vente pour convertir les visiteurs en clients payants.",
    whyNow: "C'est le chemin le plus direct vers un premier revenu — tout le reste peut attendre.",
    expectedOutcome:
      "Une page de vente claire avec promesse, preuves, objections traitées et CTA testé.",
    effort: "medium",
    confidence: 0.88,
    steps: steps(
      {
        title: "Clarifier la promesse",
        description: "Une phrase qui dit qui tu aides, avec quel résultat, en combien de temps.",
        estimatedTime: "45 min",
        doneDefinition: "Hero avec promesse + sous-titre validés sur papier.",
      },
      {
        title: "Renforcer les preuves",
        description: "Témoignages, chiffres, captures ou démonstration du résultat.",
        estimatedTime: "1 h",
        doneDefinition: "Bloc preuve avec au moins 2 éléments crédibles.",
      },
      {
        title: "Ajouter section objections",
        description: "Répondre aux 3 freins principaux : prix, temps, « est-ce pour moi ? ».",
        estimatedTime: "45 min",
        doneDefinition: "3 objections + réponses courtes intégrées.",
      },
      {
        title: "Préparer le CTA",
        description: "Un seul appel à l'action principal, visible sans scroll excessif.",
        estimatedTime: "30 min",
        doneDefinition: "CTA unique avec texte d'action clair.",
      },
      {
        title: "Tester le tunnel",
        description: "Parcours complet landing → checkout Systeme.io → confirmation.",
        estimatedTime: "30 min",
        doneDefinition: "Checklist tunnel validée de bout en bout.",
      }
    ),
    deliverables: deliverables(
      { title: "Copy section hero", description: "Promesse + sous-titre + CTA principal." },
      { title: "Bloc preuve", description: "Témoignages, chiffres ou démo visuelle." },
      { title: "Checklist tunnel", description: "Étapes de vérification Systeme.io." }
    ),
    risks: risks(
      {
        risk: "Perfectionner le design avant la copy",
        mitigation: "Valider le message d'abord, le visuel ensuite.",
      },
      {
        risk: "Créer du contenu TikTok avant la page",
        mitigation: "Reporter le contenu jusqu'à ce que la page convertisse.",
      }
    ),
    validationRequired: VALIDATION_DEFAULTS,
    possibleFutureActions: STANDARD_FUTURE_SALES,
  },

  "bc-offer-clarity": {
    title: "Clarifier l'offre Buildy Clear",
    summary: "Définir une offre nette : cible, promesse, livrable, prix et différenciation.",
    whyNow: "Sans offre claire, la page de vente ne convertira pas.",
    expectedOutcome: "Fiche offre d'une page : qui, quoi, pourquoi, combien.",
    effort: "low",
    confidence: 0.85,
    steps: steps(
      {
        title: "Identifier la cible",
        description: "Un profil client précis — pas « tout le monde ».",
        estimatedTime: "30 min",
        doneDefinition: "1 persona avec problème principal.",
      },
      {
        title: "Formuler la promesse",
        description: "Résultat concret en une phrase.",
        estimatedTime: "30 min",
      },
      {
        title: "Définir le livrable et le prix",
        description: "Ce que le client reçoit et à quel tarif.",
        estimatedTime: "30 min",
      }
    ),
    deliverables: deliverables(
      { title: "Fiche offre", description: "Document une page avec les 4 piliers." }
    ),
    risks: risks({
      risk: "Offre trop large",
      mitigation: "Couper jusqu'à ce qu'un client type dise « c'est pour moi ».",
    }),
    validationRequired: VALIDATION_DEFAULTS,
    possibleFutureActions: futureActions(
      {
        id: "fa-content",
        label: "Préparer un plan de contenu",
        type: "content_plan",
        description: "Angles de communication alignés sur l'offre.",
      }
    ),
  },

  "bcraft-framing": {
    title: "Prioriser charpente / ouvertures — Buildy Crafts",
    summary: "Stabiliser le module charpente pour crédibiliser l'assistant devis.",
    whyNow: "Impact produit fort — c'est ce que les utilisateurs cibles attendent en premier.",
    expectedOutcome: "Module charpente/ouvertures fiable sur 2 scénarios types.",
    effort: "high",
    confidence: 0.84,
    steps: steps(
      {
        title: "Lister les cas charpente",
        description: "Inventorier les scénarios les plus fréquents.",
        estimatedTime: "1 h",
      },
      {
        title: "Valider les règles de calcul",
        description: "Vérifier les formules et unités sur chaque cas.",
        estimatedTime: "2 h",
      },
      {
        title: "Tester 2 scénarios complets",
        description: "De la saisie au devis final, sans erreur bloquante.",
        estimatedTime: "1 h 30",
      },
      {
        title: "Documenter les écarts",
        description: "Noter ce qui manque pour les cas suivants.",
        estimatedTime: "30 min",
      }
    ),
    deliverables: deliverables(
      { title: "Liste cas charpente", description: "Scénarios prioritaires documentés." },
      { title: "Rapport test 2 scénarios", description: "Résultats + écarts identifiés." }
    ),
    risks: risks(
      {
        risk: "Élargir à tous les corps de métier",
        mitigation: "Finir charpente avant d'ouvrir d'autres modules.",
      },
      {
        risk: "Ajouter des matériaux en parallèle",
        mitigation: "Matériaux après validation charpente.",
      }
    ),
    validationRequired: VALIDATION_DEFAULTS,
    possibleFutureActions: futureActions(
      {
        id: "fa-data",
        label: "Préparer liste DATA matériaux",
        type: "research_plan",
        description: "Inventaire des entrées à normaliser ensuite.",
      },
      {
        id: "fa-cursor",
        label: "Prompt Cursor audit devis",
        type: "cursor_prompt",
        description: "Prompt pour revue automatisée des outputs.",
      }
    ),
  },

  "bcraft-materials": {
    title: "Ajouter matériaux manquants — Buildy Crafts",
    summary: "Compléter la base DATA pour les matériaux les plus utilisés en chantier.",
    whyNow: "Débloque des scénarios réalistes — fondation pour les prochains modules.",
    expectedOutcome: "Top 20 matériaux normalisés avec unités et prix de référence.",
    effort: "medium",
    confidence: 0.8,
    steps: steps(
      { title: "Inventorier les matériaux critiques", description: "Ceux qui bloquent les devis actuels.", estimatedTime: "45 min" },
      { title: "Normaliser unités et formats", description: "Cohérence m², ml, u, kg.", estimatedTime: "1 h" },
      { title: "Importer ou saisir les entrées", description: "Batch des 20 premiers.", estimatedTime: "2 h" },
      { title: "Valider sur 1 devis test", description: "Vérifier que les matériaux remontent.", estimatedTime: "30 min" }
    ),
    deliverables: deliverables({ title: "Liste DATA matériaux", description: "20 entrées normalisées." }),
    risks: risks({ risk: "Trop de matériaux d'un coup", mitigation: "Top 20 d'abord, le reste en V2." }),
    validationRequired: VALIDATION_DEFAULTS,
    possibleFutureActions: futureActions(
      { id: "fa-checklist", label: "Checklist import DATA", type: "checklist", description: "Étapes d'import sans exécution." }
    ),
  },

  "gigi-mission-engine": {
    title: "Améliorer le moteur de mission — Gigi",
    summary: "Renforcer la priorisation explicable et les suggestions par projet.",
    whyNow: "C'est le cœur de la promesse « Sache quoi faire » — impact direct sur l'usage quotidien.",
    expectedOutcome: "Missions plus claires, plans d'action structurés, moins de friction décisionnelle.",
    effort: "medium",
    confidence: 0.86,
    steps: steps(
      { title: "Cartographier le parcours décision", description: "De la question utilisateur à la mission proposée.", estimatedTime: "1 h" },
      { title: "Renforcer les explications « pourquoi »", description: "Chaque mission doit dire pourquoi maintenant.", estimatedTime: "1 h" },
      { title: "Lier projets → missions → plans", description: "Chaîne complète sans appel externe.", estimatedTime: "2 h" },
      { title: "Tester 3 scénarios utilisateur", description: "Revenu, focus, projet spécifique.", estimatedTime: "45 min" }
    ),
    deliverables: deliverables(
      { title: "Carte parcours décision", description: "Flux question → mission → plan." },
      { title: "Checklist qualité mission", description: "Critères why/tasks/next." }
    ),
    risks: risks({ risk: "Complexifier le moteur", mitigation: "Local-first, pas d'IA obligatoire." }),
    validationRequired: VALIDATION_DEFAULTS,
    possibleFutureActions: futureActions(
      { id: "fa-cursor", label: "Prompt Cursor tests moteur", type: "cursor_prompt", description: "Scénarios de test automatisables." },
      { id: "fa-branch", label: "Plan branche feature", type: "branch_plan", description: "Découpage PR reviewable." }
    ),
  },

  "gigi-controlled-actions": {
    title: "Préparer actions contrôlées — Gigi",
    summary: "Concevoir le système d'actions futures avec validation explicite.",
    whyNow: "V1.8 — poser les garde-fous avant toute exéction réelle.",
    expectedOutcome: "Spec dry-run : types d'actions, confirmation, audit trail.",
    effort: "high",
    confidence: 0.78,
    steps: steps(
      { title: "Lister les actions futures", description: "Git, fichiers, prompts, checklists.", estimatedTime: "1 h" },
      { title: "Définir le flux de validation", description: "Proposer → confirmer → exécuter (V1.8+).", estimatedTime: "1 h 30" },
      { title: "Prototyper en dry-run", description: "UI preview sans effet de bord.", estimatedTime: "2 h" }
    ),
    deliverables: deliverables({ title: "Spec actions contrôlées", description: "Types, garde-fous, limites V1.7." }),
    risks: risks({ risk: "Exécuter trop tôt", mitigation: "V1.7 = plans uniquement, V1.8 = actions avec accord." }),
    validationRequired: VALIDATION_DEFAULTS,
    possibleFutureActions: futureActions(
      { id: "fa-manual", label: "Matrice actions / risques", type: "manual_task", description: "Tableau de décision avant V1.8." }
    ),
  },

  "linko-artisan-profile": {
    title: "Définir la fiche artisan — Linko",
    summary: "Structure minimale d'une fiche pro : services, zone, contact, preuves.",
    whyNow: "Cœur du produit — sans fiche, pas de valeur pour l'artisan ni le client.",
    expectedOutcome: "Template fiche + 1 exemple rempli pour un artisan type.",
    effort: "medium",
    confidence: 0.83,
    steps: steps(
      { title: "Définir les champs obligatoires", description: "Nom, métier, zone, services, contact.", estimatedTime: "45 min" },
      { title: "Ajouter bloc preuves", description: "Avis, photos chantier, certifications.", estimatedTime: "45 min" },
      { title: "Rédiger un exemple complet", description: "Fiche fictive mais crédible.", estimatedTime: "1 h" },
      { title: "Valider avec 1 persona artisan", description: "Est-ce qu'il comprend en 30 secondes ?", estimatedTime: "30 min" }
    ),
    deliverables: deliverables(
      { title: "Template fiche artisan", description: "Structure + wireframe textuel." },
      { title: "Exemple rempli", description: "Artisan plombier fictif complet." }
    ),
    risks: risks({ risk: "Trop de champs", mitigation: "MVP : 8 champs max au lancement." }),
    validationRequired: VALIDATION_DEFAULTS,
    possibleFutureActions: futureActions(
      { id: "fa-content", label: "Plan acquisition pro", type: "content_plan", description: "Message d'approche artisans cibles." }
    ),
  },

  "linko-claim-flow": {
    title: "Définir le claim flow — Linko",
    summary: "Parcours pour qu'un artisan revendique et personnalise sa page.",
    whyNow: "Nécessaire avant acquisition — mais après la fiche artisan.",
    expectedOutcome: "Schéma du parcours claim en 4 étapes max.",
    effort: "medium",
    confidence: 0.8,
    steps: steps(
      { title: "Identifier le déclencheur", description: "Comment l'artisan découvre sa fiche.", estimatedTime: "30 min" },
      { title: "Définir la vérification", description: "Email, SMS ou code — sans implémentation.", estimatedTime: "45 min" },
      { title: "Mapper l'édition post-claim", description: "Ce qu'il peut modifier immédiatement.", estimatedTime: "45 min" }
    ),
    deliverables: deliverables({ title: "Schéma claim flow", description: "4 étapes avec écrans textuels." }),
    risks: risks({ risk: "Flow trop long", mitigation: "Max 4 étapes, claim en moins de 2 min." }),
    validationRequired: VALIDATION_DEFAULTS,
    possibleFutureActions: futureActions(
      { id: "fa-checklist", label: "Checklist claim MVP", type: "checklist", description: "Critères go/no-go avant dev." }
    ),
  },

  "1mm-gameplay": {
    title: "Améliorer le feeling de gameplay — 1 Millimètre",
    summary: "Affiner la sensation de placement et de satisfaction puzzle.",
    whyNow: "Utile seulement si tu veux y revenir — le cœur du plaisir est le gameplay.",
    expectedOutcome: "2 mécaniques de feedback améliorées + test sur 1 niveau.",
    effort: "medium",
    confidence: 0.75,
    steps: steps(
      { title: "Identifier le moment de satisfaction", description: "Quand le joueur se sent bien ?", estimatedTime: "45 min" },
      { title: "Renforcer le feedback visuel", description: "Snap, particules, son — choisir 1 axe.", estimatedTime: "1 h 30" },
      { title: "Tester sur 1 niveau", description: "Session 15 min avec retour honnête.", estimatedTime: "30 min" }
    ),
    deliverables: deliverables({ title: "Note gameplay", description: "Ce qui marche / ce qui bloque." }),
    risks: risks({ risk: "Polish avant mécanique", mitigation: "Gameplay d'abord, visuel ensuite." }),
    validationRequired: VALIDATION_DEFAULTS,
    possibleFutureActions: futureActions(
      { id: "fa-manual", label: "Liste niveaux test", type: "manual_task", description: "3 niveaux représentatifs à valider." }
    ),
  },

  "lds-bible": {
    title: "Structurer l'univers — Le Dernier Souvenir",
    summary: "Bible narrative : arc, personnages, ton et structure en 3 actes.",
    whyNow: "Première brique si le projet redevient actif — sans bible, pas de direction.",
    expectedOutcome: "Document bible 3-5 pages avec arc principal et personnages clés.",
    effort: "medium",
    confidence: 0.76,
    steps: steps(
      { title: "Poser le pitch en une phrase", description: "De quoi parle l'histoire ?", estimatedTime: "30 min" },
      { title: "Définir les personnages clés", description: "3 personnages max avec motivation.", estimatedTime: "1 h" },
      { title: "Structurer en 3 actes", description: "Setup, confrontation, résolution.", estimatedTime: "1 h 30" },
      { title: "Esquisser chapitre / prototype", description: "Premier chapitre ou scène pilote.", estimatedTime: "2 h" }
    ),
    deliverables: deliverables(
      { title: "Bible narrative", description: "Arc + personnages + ton." },
      { title: "Assets narratifs initiaux", description: "Esquisse chapitre 1 ou scène pilote." }
    ),
    risks: risks({ risk: "Trop de worldbuilding", mitigation: "1 histoire, 1 conflit, 3 personnages." }),
    validationRequired: VALIDATION_DEFAULTS,
    possibleFutureActions: futureActions(
      { id: "fa-content", label: "Plan assets narratifs", type: "content_plan", description: "Liste des assets à produire ensuite." }
    ),
  },
};

export function getMissionPlanTemplate(missionId: string): PlanTemplate | undefined {
  return MISSION_PLAN_TEMPLATES[missionId];
}
