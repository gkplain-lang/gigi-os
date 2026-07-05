import type { ActionPlan, ActionPlanStep } from "@/modules/actionPlans/types";
import { buildActionPlanForProject } from "@/modules/actionPlans/actionPlanBuilder";
import { VALIDATION_DEFAULTS } from "@/modules/actionPlans/actionPlanSummary";
import { buildPreparedActionForProject } from "@/modules/preparedActions/preparedActionBuilder";
import type { PreparedAction } from "@/modules/preparedActions/types";
import type {
  MissionDecision,
  MissionDecisionCandidate,
} from "@/modules/missionDecision/types";
import { PROJECT_NAMES } from "@/modules/conversation/missionCatalog";
import type {
  MissionPlanBridgeOutput,
  MissionPlanBridgeRecord,
  MissionPlanBridgeRisk,
  MissionPlanBridgeValidationItem,
} from "./types";
import { MISSION_PLAN_BRIDGE_ID_PREFIX } from "./types";

function nowIso(): string {
  return new Date().toISOString();
}

function generateId(prefix: string): string {
  return `${prefix}${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function mapSeverity(
  severity: "info" | "positive" | "warning" | "critical"
): MissionPlanBridgeRisk["severity"] {
  if (severity === "positive") return "success";
  return severity;
}

export function mapCandidateRisks(candidate: MissionDecisionCandidate): MissionPlanBridgeRisk[] {
  if (candidate.risks.length > 0) {
    return candidate.risks.map((r) => ({
      id: r.id,
      label: r.label,
      description: r.description,
      severity: mapSeverity(r.severity),
      mitigation: r.mitigation,
    }));
  }
  return [
    {
      id: "risk-default-scope",
      label: "Scope trop large",
      description: "La mission peut devenir trop large pour une session.",
      severity: "warning",
      mitigation: "Limiter à un livrable concret avant de continuer.",
    },
    {
      id: "risk-default-context",
      label: "Contexte incomplet",
      description: "Le rapport précédent peut manquer de contexte.",
      severity: "info",
      mitigation: "Relire la décision V2.6 et la checklist avant d'agir.",
    },
  ];
}

export function mapCandidateChecklist(
  candidate: MissionDecisionCandidate
): MissionPlanBridgeValidationItem[] {
  const items = candidate.validationChecklist.length > 0
    ? candidate.validationChecklist
    : [
        "Périmètre clair",
        "Risques compris",
        "Validation définie",
        "Ajout queue en pending_review uniquement si validé par l'utilisateur",
      ];

  return items.map((label, i) => ({
    id: `check-${i + 1}`,
    label,
    completed: false,
    required: i < 3,
  }));
}

function defaultTailSteps(missionTitle: string): ActionPlanStep[] {
  return [
    {
      id: "step-tail-build",
      order: 900,
      title: "Relancer le build ou la vérification manuellement",
      description: "Contrôle local — Gigi ne lance rien.",
      estimatedTime: "15 min",
      doneDefinition: "Tu as vérifié le résultat toi-même.",
    },
    {
      id: "step-tail-log",
      order: 901,
      title: "Ajouter le résultat au journal d'exécution",
      description: "Trace manuelle dans /actions ou les logs V2.1.",
      estimatedTime: "10 min",
      doneDefinition: "Résultat consigné localement.",
    },
    {
      id: "step-tail-review",
      order: 902,
      title: "Générer une review V2.2",
      description: "Bilan local après exécution manuelle.",
      estimatedTime: "15 min",
      doneDefinition: "Review créée ou planifiée.",
    },
    {
      id: "step-tail-archive",
      order: 903,
      title: "Archiver l'apprentissage si terminé",
      description: "Historique V2.4 — sans sync cloud.",
      estimatedTime: "5 min",
      doneDefinition: `Mission « ${missionTitle} » clôturée dans l'historique.`,
    },
  ];
}

export function buildSyntheticPlanFromCandidate(
  candidate: MissionDecisionCandidate,
  projectId: string,
  projectName: string
): ActionPlan {
  const checklistSteps = candidate.validationChecklist.slice(0, 4);
  const coreTasks =
    checklistSteps.length > 0
      ? checklistSteps
      : [
          "Clarifier l'objectif de la mission",
          "Identifier le livrable principal",
          "Réduire le scope à une session de travail",
          "Valider le périmètre avant toute action",
        ];

  const steps: ActionPlanStep[] = coreTasks.map((task, i) => ({
    id: `step-${i + 1}`,
    order: i + 1,
    title: task,
    description: `Étape ${i + 1} pour « ${candidate.title} » — préparation uniquement.`,
    estimatedTime: i === 0 ? "30 min" : "20 min",
    doneDefinition: `${task} — terminé quand tu peux passer à la suite.`,
  }));

  const tail = defaultTailSteps(candidate.title);
  tail.forEach((s, i) => {
    s.order = steps.length + i + 1;
  });

  const allSteps = [...steps, ...tail];

  return {
    id: `plan-bridge-${projectId}-${candidate.id}`,
    projectId,
    missionId: candidate.missionId,
    title: candidate.title,
    summary: candidate.description,
    whyNow:
      candidate.reasons[0]?.description ??
      candidate.expectedImpact ??
      "Mission acceptée dans le centre de décision V2.6.",
    expectedOutcome: `Plan clair pour « ${candidate.title} » — sans exécution automatique.`,
    steps: allSteps,
    deliverables: [
      {
        id: "del-bridge-1",
        title: "Livrable principal",
        description: candidate.suggestedScope ?? `Résultat tangible pour ${projectName}.`,
      },
    ],
    risks: mapCandidateRisks(candidate).map((r) => ({
      id: r.id,
      risk: r.label,
      mitigation: r.mitigation ?? r.description,
    })),
    validationRequired: candidate.validationChecklist.length > 0
      ? candidate.validationChecklist
      : VALIDATION_DEFAULTS,
    possibleFutureActions: [
      {
        id: "fa-bridge-checklist",
        label: "Préparer une checklist",
        type: "checklist",
        description: `Checklist pour ${candidate.title}.`,
        requiresConfirmation: true,
        dryRunOnly: true,
      },
      {
        id: "fa-bridge-manual",
        label: "Tâche manuelle",
        type: "manual_task",
        description: "Action manuelle à valider avant exécution.",
        requiresConfirmation: true,
        dryRunOnly: true,
      },
    ],
    effort: "medium",
    confidence: candidate.confidence,
  };
}

export function buildPlanDraftForCandidate(
  candidate: MissionDecisionCandidate
): ActionPlan | null {
  const projectId = candidate.projectId;
  if (!projectId) return null;

  const projectName =
    candidate.metadata?.projectName ??
    PROJECT_NAMES[projectId as keyof typeof PROJECT_NAMES] ??
    projectId;

  if (candidate.missionId) {
    const existing = buildActionPlanForProject(
      projectId,
      projectName,
      candidate.missionId
    );
    if (existing) return existing;
  }

  return buildSyntheticPlanFromCandidate(candidate, projectId, projectName);
}

export function buildConversationPromptFromBridge(
  record: MissionPlanBridgeRecord
): string {
  const reasons = record.metadata?.reasonsSummary ?? "Mission acceptée localement.";
  const risks =
    record.risks.length > 0
      ? record.risks.map((r) => r.label).join(", ")
      : "Scope et contexte à confirmer";
  const checklist = record.validationChecklist.map((c) => c.label).join(", ");

  return (
    `Gigi, transforme cette mission acceptée en plan d'action détaillé : ${record.missionTitle}. ` +
    `Contexte : ${reasons}. Risques : ${risks}. Checklist : ${checklist}. ` +
    "Reste en préparation uniquement, sans exécution."
  );
}

export function buildPreparedActionDraftForBridge(
  record: MissionPlanBridgeRecord,
  plan: ActionPlan
): PreparedAction | null {
  const projectId = record.projectId ?? plan.projectId;
  const projectName =
    record.metadata?.projectName ??
    PROJECT_NAMES[projectId as keyof typeof PROJECT_NAMES] ??
    projectId;

  const previewId = plan.possibleFutureActions[0]?.id ?? "fa-bridge-manual";

  const prepared = buildPreparedActionForProject(projectId, projectName, "manual_task", {
    plan,
    sourceActionId: previewId,
  });

  return {
    ...prepared,
    sourceActionId: `${MISSION_PLAN_BRIDGE_ID_PREFIX}${record.id}`,
    summary: `Préparer une action ciblée pour « ${record.missionTitle} », à valider avant toute exécution.`,
  };
}

export function createBridgeRecordFromDecision(
  decision: MissionDecision,
  candidate: MissionDecisionCandidate
): MissionPlanBridgeRecord {
  const timestamp = nowIso();
  const id = generateId(MISSION_PLAN_BRIDGE_ID_PREFIX);

  const reasonsSummary =
    candidate.reasons.length > 0
      ? candidate.reasons.map((r) => `${r.label}: ${r.description}`).join(" · ")
      : undefined;

  const base: MissionPlanBridgeRecord = {
    id,
    source: "mission_decision",
    status: "ready",
    missionDecisionId: decision.id,
    missionCandidateId: candidate.id,
    projectId: candidate.projectId,
    missionId: candidate.missionId,
    title: `Bridge · ${candidate.title}`,
    missionTitle: decision.finalUserChoice ?? candidate.title,
    missionDescription: candidate.description,
    acceptedAt: decision.decidedAt ?? timestamp,
    outputs: [],
    validationChecklist: mapCandidateChecklist(candidate),
    risks: mapCandidateRisks(candidate),
    createdAt: timestamp,
    updatedAt: timestamp,
    metadata: {
      projectName: candidate.metadata?.projectName ?? candidate.projectId ?? "",
      reasonsSummary: reasonsSummary ?? "",
      decisionStatus: decision.status,
    },
  };

  return {
    ...base,
    conversationPrompt: buildConversationPromptFromBridge(base),
  };
}

export function appendBridgeOutput(
  record: MissionPlanBridgeRecord,
  type: MissionPlanBridgeOutput["type"],
  title: string,
  description: string,
  relatedId?: string
): MissionPlanBridgeRecord {
  const output: MissionPlanBridgeOutput = {
    id: generateId("mpb-out-"),
    type,
    title,
    description,
    status: "proposed",
    createdAt: nowIso(),
    relatedId,
  };
  return {
    ...record,
    outputs: [output, ...record.outputs],
    updatedAt: nowIso(),
  };
}

export function getAcceptedCandidateFromDecision(
  decision: MissionDecision
): MissionDecisionCandidate | undefined {
  if (!["accepted", "converted_to_plan"].includes(decision.status)) return undefined;
  const id = decision.selectedCandidateId;
  if (!id) return undefined;
  return decision.candidates.find((c) => c.id === id);
}
