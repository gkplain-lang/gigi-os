import {
  getMissionRecommendationScore,
  listMissionFeedbackSignals,
} from "@/modules/missionFeedback";
import { PROJECT_STATUS } from "@/modules/conversation/missionCatalog";
import type {
  MissionDecisionCandidateSource,
  MissionDecisionReason,
  MissionDecisionRisk,
  MissionDecisionSeverity,
} from "./types";

export interface ScoreCandidateInput {
  missionId: string;
  projectId: string;
  title: string;
  description: string;
  source: MissionDecisionCandidateSource;
  catalogImpact?: number;
  catalogClarity?: number;
  subtasks?: string[];
  isFollowUp?: boolean;
}

export interface ScoredCandidateResult {
  score: number;
  confidence: number;
  reasons: MissionDecisionReason[];
  risks: MissionDecisionRisk[];
  validationChecklist: string[];
  feedbackScoreId?: string;
}

function reasonId(type: string): string {
  return `mreason-${type}-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`;
}

function riskId(label: string): string {
  return `mrisk-${label.slice(0, 8)}-${Date.now()}`;
}

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

export function scoreDecisionCandidate(input: ScoreCandidateInput): ScoredCandidateResult {
  const feedback = getMissionRecommendationScore(input.missionId);
  let score = feedback?.score ?? 50;
  const reasons: MissionDecisionReason[] = [];
  const risks: MissionDecisionRisk[] = [];
  const confidence = feedback?.confidence ?? 45;

  if (feedback) {
    feedback.reasons.forEach((r) => {
      reasons.push({
        id: reasonId("high_score"),
        type: "high_score",
        label: r.slice(0, 60),
        description: r,
        weight: 10,
        severity: "positive",
      });
    });
    feedback.risks.forEach((r) => {
      risks.push({
        id: riskId(r),
        label: r.slice(0, 50),
        description: r,
        severity: "warning",
      });
    });
  }

  const signals = listMissionFeedbackSignals({ projectId: input.projectId });

  if (signals.some((s) => s.type === "unblocker")) {
    score += 20;
    reasons.push({
      id: reasonId("unblocker"),
      type: "unblocker",
      label: "Débloque le projet",
      description: "Signal unblocker détecté dans l'historique local.",
      weight: 20,
      severity: "positive",
    });
  }

  if (signals.some((s) => s.type === "high_impact")) {
    score += 15;
    reasons.push({
      id: reasonId("high_impact"),
      type: "high_impact",
      label: "Impact élevé",
      description: "Historique local avec impact positif.",
      weight: 15,
      severity: "positive",
    });
  }

  if (input.subtasks && input.subtasks.length >= 2) {
    score += 10;
    reasons.push({
      id: reasonId("clear_validation"),
      type: "clear_validation",
      label: "Validation claire",
      description: "Étapes ou checklist disponibles.",
      weight: 10,
      severity: "positive",
    });
  }

  if (input.isFollowUp) {
    score += 10;
    reasons.push({
      id: reasonId("follow_up_required"),
      type: "follow_up_required",
      label: "Suite d'exécution",
      description: "Action de suivi issue d'une review locale.",
      weight: 10,
      severity: "info",
    });
  }

  if (PROJECT_STATUS[input.projectId] === "active") {
    score += 10;
    reasons.push({
      id: reasonId("urgent"),
      type: "urgent",
      label: "Projet actif",
      description: "Projet marqué actif dans le portefeuille local.",
      weight: 10,
      severity: "positive",
    });
  }

  if (signals.some((s) => s.type === "too_vague")) {
    score -= 20;
    reasons.push({
      id: reasonId("too_vague"),
      type: "too_vague",
      label: "Mission perçue comme floue",
      description: "Feedback ou historique signalant un manque de clarté.",
      weight: -20,
      severity: "warning",
    });
    risks.push({
      id: riskId("flou"),
      label: "Clarté insuffisante",
      description: "Définir le résultat attendu avant de lancer.",
      severity: "warning",
      mitigation: "Ajouter critère de « terminé » explicite.",
    });
  }

  if (signals.some((s) => s.type === "often_abandoned")) {
    score -= 15;
    risks.push({
      id: riskId("abandon"),
      label: "Abandons récurrents",
      description: "Ce type de mission est souvent abandonné localement.",
      severity: "warning",
    });
  }

  if (signals.some((s) => s.type === "recurring_blocker")) {
    score -= 15;
    reasons.push({
      id: reasonId("recurring_blocker"),
      type: "recurring_blocker",
      label: "Blocage récurrent",
      description: "Blocages répétés sur ce projet.",
      weight: -15,
      severity: "critical",
    });
    risks.push({
      id: riskId("blocker"),
      label: "Blocage non résolu",
      description: "Un blocage récurrent persiste — clarifier avant d'avancer.",
      severity: "critical",
      mitigation: "Résoudre ou documenter le blocage connu.",
    });
  }

  if (signals.some((s) => s.type === "needs_smaller_scope")) {
    score -= 10;
    reasons.push({
      id: reasonId("too_large"),
      type: "too_large",
      label: "Scope trop large",
      description: "Réduire la portée pour avancer.",
      weight: -10,
      severity: "warning",
    });
  }

  if ((input.catalogClarity ?? 10) < 6) {
    score -= 10;
    reasons.push({
      id: reasonId("missing_context"),
      type: "missing_context",
      label: "Contexte limité",
      description: "Clarté catalogue faible — préciser avant exécution.",
      weight: -10,
      severity: "info",
    });
  }

  if (input.catalogImpact && input.catalogImpact >= 8) {
    reasons.push({
      id: reasonId("high_impact"),
      type: "high_impact",
      label: "Impact business élevé",
      description: `Impact catalogue ${input.catalogImpact}/10.`,
      weight: 8,
      severity: "positive",
    });
  }

  const validationChecklist: string[] = input.subtasks?.length
    ? [...input.subtasks]
    : [
        "Définir le résultat attendu",
        "Exécuter manuellement (hors app)",
        "Enregistrer le retour dans /actions",
      ];

  if (reasons.length === 0) {
    reasons.push({
      id: reasonId("manual"),
      type: "manual_reason",
      label: "Candidate du catalogue",
      description: input.description,
      weight: 0,
      severity: "info",
    });
  }

  return {
    score: clamp(score),
    confidence: clamp(confidence),
    reasons: reasons.slice(0, 6),
    risks: risks.slice(0, 4),
    validationChecklist,
    feedbackScoreId: feedback?.missionId,
  };
}

export function pickRecommendedCandidate<
  T extends { score: number; risks: MissionDecisionRisk[]; reasons: MissionDecisionReason[] }
>(candidates: T[]): T | undefined {
  if (candidates.length === 0) return undefined;
  return candidates[0];
}

export function severityWeight(severity: MissionDecisionSeverity): number {
  switch (severity) {
    case "critical":
      return 3;
    case "warning":
      return 2;
    case "positive":
      return 1;
    default:
      return 0;
  }
}
