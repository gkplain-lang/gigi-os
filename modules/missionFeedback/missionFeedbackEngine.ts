import type { HistoryLearningEntry } from "@/modules/historyLearning/types";
import { listHistoryEntries } from "@/modules/historyLearning/historyLearningStore";
import type {
  ManualMissionFeedback,
  MissionFeedbackSignal,
  MissionFeedbackSignalType,
  MissionFeedbackSource,
  ScoreableMission,
} from "./types";

const VAGUE_KEYWORDS = ["flou", "pas clair", "unclear", "ambigu", "vague"];
const BIG_KEYWORDS = ["trop gros", "trop grand", "trop large", "scope", "trop ambitieux"];

function nowIso(): string {
  return new Date().toISOString();
}

function sigId(type: string, n: number): string {
  return `mfsig-${type}-${n}-${Date.now()}`;
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function matchMissionId(entry: HistoryLearningEntry, missions: ScoreableMission[]): string | undefined {
  if (entry.missionId) return entry.missionId;
  const hay = normalize(`${entry.title} ${entry.summary}`);
  for (const m of missions) {
    const titleNorm = normalize(m.title);
    const words = titleNorm.split(/\s+/).filter((w) => w.length > 4);
    if (words.some((w) => hay.includes(w))) return m.missionId;
  }
  return undefined;
}

function pushSignal(
  signals: MissionFeedbackSignal[],
  partial: Omit<MissionFeedbackSignal, "id" | "createdAt">,
  counter: { n: number }
): void {
  signals.push({
    id: sigId(partial.type, counter.n++),
    createdAt: nowIso(),
    ...partial,
  });
}

function historySource(entry: HistoryLearningEntry): MissionFeedbackSource {
  if (entry.source === "execution_review") return "execution_review";
  if (entry.source === "follow_up_action") return "follow_up_action";
  return "history_learning";
}

function signalsFromManualFeedback(
  feedback: ManualMissionFeedback[],
  missions: ScoreableMission[]
): MissionFeedbackSignal[] {
  const signals: MissionFeedbackSignal[] = [];
  const counter = { n: 1 };

  for (const fb of feedback) {
    let type: MissionFeedbackSignalType = "manual_review_required";
    let severity: MissionFeedbackSignal["severity"] = "info";

    switch (fb.sentiment) {
      case "useful":
        type = "high_impact";
        severity = "positive";
        break;
      case "completed":
        type = "often_completed";
        severity = "positive";
        break;
      case "too_vague":
        type = "too_vague";
        severity = "warning";
        break;
      case "too_big":
        type = "needs_smaller_scope";
        severity = "warning";
        break;
      case "blocked":
        type = "recurring_blocker";
        severity = "critical";
        break;
      case "not_useful":
        type = "low_impact";
        severity = "warning";
        break;
    }

    const missionId =
      fb.missionId ??
      (fb.projectId
        ? missions.find((m) => m.projectId === fb.projectId)?.missionId
        : undefined);

    pushSignal(signals, {
      type,
      severity,
      source: "manual",
      label: `Feedback manuel : ${fb.sentiment}`,
      description: fb.note,
      projectId: fb.projectId,
      missionId,
      confidence: 75,
    }, counter);
  }

  return signals;
}

function textMentionsVague(text: string): boolean {
  const norm = normalize(text);
  return VAGUE_KEYWORDS.some((k) => norm.includes(normalize(k)));
}

function textMentionsTooBig(text: string): boolean {
  const norm = normalize(text);
  return BIG_KEYWORDS.some((k) => norm.includes(normalize(k)));
}

export function buildSignalsFromHistory(
  missions: ScoreableMission[],
  manualFeedback: ManualMissionFeedback[] = []
): MissionFeedbackSignal[] {
  const entries = listHistoryEntries();
  const signals: MissionFeedbackSignal[] = [];
  const counter = { n: 1 };

  signals.push(...signalsFromManualFeedback(manualFeedback, missions));

  const blockersByProject = new Map<string, number>();
  const abandonedByProject = new Map<string, number>();
  const successByProject = new Map<string, number>();
  const missingReportCount = new Map<string, number>();

  for (const entry of entries) {
    const projectId = entry.projectId;
    const missionId = matchMissionId(entry, missions);
    const source = historySource(entry);

    if (projectId) {
      const hasBlocker = entry.signals.some((s) => s.type === "blocker") || entry.status === "blocked";
      if (hasBlocker) {
        blockersByProject.set(projectId, (blockersByProject.get(projectId) ?? 0) + 1);
      }
      if (entry.outcome === "abandoned" || entry.status === "abandoned") {
        abandonedByProject.set(projectId, (abandonedByProject.get(projectId) ?? 0) + 1);
      }
      if (entry.outcome === "success" || entry.status === "completed") {
        successByProject.set(projectId, (successByProject.get(projectId) ?? 0) + 1);
      }
      if (entry.signals.some((s) => s.type === "missing_report")) {
        missingReportCount.set(projectId, (missingReportCount.get(projectId) ?? 0) + 1);
      }
    }

    if (entry.outcome === "success" || entry.status === "completed") {
      pushSignal(signals, {
        type: "often_completed",
        severity: "positive",
        source,
        label: "Exécution terminée avec succès",
        description: entry.summary,
        projectId,
        missionId,
        relatedHistoryEntryId: entry.id,
        confidence: 70,
      }, counter);
    }

    if (entry.outcome === "abandoned" || entry.status === "abandoned") {
      pushSignal(signals, {
        type: "often_abandoned",
        severity: "warning",
        source,
        label: "Action ou mission abandonnée",
        description: entry.summary,
        projectId,
        missionId,
        relatedHistoryEntryId: entry.id,
        confidence: 72,
      }, counter);
    }

    if (entry.metadata?.reviewDecision === "completed_confirmed" || entry.outcome === "success") {
      pushSignal(signals, {
        type: "high_impact",
        severity: "positive",
        source,
        label: "Impact positif confirmé",
        description: entry.title,
        projectId,
        missionId,
        relatedHistoryEntryId: entry.id,
        confidence: 68,
      }, counter);
    }

    if (
      entry.metadata?.reviewDecision === "needs_fix" ||
      entry.metadata?.reviewDecision === "needs_retry" ||
      entry.status === "blocked"
    ) {
      pushSignal(signals, {
        type: "follow_up_required",
        severity: "warning",
        source,
        label: "Suite ou correction nécessaire",
        description: entry.summary,
        projectId,
        missionId,
        relatedHistoryEntryId: entry.id,
        confidence: 65,
      }, counter);
    }

    for (const hs of entry.signals) {
      if (hs.type === "failed_test") {
        pushSignal(signals, {
          type: "test_required",
          severity: "critical",
          source,
          label: "Test à relancer",
          description: hs.description,
          projectId,
          missionId,
          relatedHistoryEntryId: entry.id,
          confidence: 70,
        }, counter);
      }
      if (hs.type === "missing_report") {
        pushSignal(signals, {
          type: "needs_clearer_validation",
          severity: "warning",
          source,
          label: "Validation insuffisamment documentée",
          description: hs.description,
          projectId,
          missionId,
          relatedHistoryEntryId: entry.id,
          confidence: 68,
        }, counter);
      }
      if (hs.type === "follow_up_created") {
        pushSignal(signals, {
          type: "follow_up_required",
          severity: "info",
          source: "follow_up_action",
          label: "Action de suivi créée",
          description: hs.description,
          projectId,
          missionId,
          relatedHistoryEntryId: entry.id,
          confidence: 72,
        }, counter);
      }
      if (hs.type === "fix_created") {
        pushSignal(signals, {
          type: "manual_review_required",
          severity: "warning",
          source,
          label: "Correction manuelle requise",
          description: hs.description,
          projectId,
          missionId,
          relatedHistoryEntryId: entry.id,
          confidence: 66,
        }, counter);
      }
    }

    for (const note of entry.learnings) {
      const text = `${note.title} ${note.content}`;
      if (textMentionsVague(text)) {
        pushSignal(signals, {
          type: "too_vague",
          severity: "warning",
          source: "history_learning",
          label: "Mission ou action perçue comme floue",
          description: note.content,
          projectId,
          missionId,
          relatedHistoryEntryId: entry.id,
          confidence: 60,
        }, counter);
      }
      if (textMentionsTooBig(text)) {
        pushSignal(signals, {
          type: "needs_smaller_scope",
          severity: "warning",
          source: "history_learning",
          label: "Scope trop large signalé",
          description: note.content,
          projectId,
          missionId,
          relatedHistoryEntryId: entry.id,
          confidence: 62,
        }, counter);
      }
    }

    if (entry.source === "follow_up_action" && entry.sourceFollowUpActionIds?.length) {
      pushSignal(signals, {
        type: "documentation_needed",
        severity: "info",
        source: "follow_up_action",
        label: "Documentation ou clôture de suivi",
        description: entry.summary,
        projectId,
        missionId,
        relatedHistoryEntryId: entry.id,
        confidence: 55,
      }, counter);
    }
  }

  for (const [projectId, count] of blockersByProject) {
    if (count >= 2) {
      pushSignal(signals, {
        type: "recurring_blocker",
        severity: "critical",
        source: "inferred",
        label: "Blocage récurrent sur le projet",
        description: `${count} entrée(s) avec blocage détecté(s) localement.`,
        projectId,
        confidence: Math.min(90, 50 + count * 10),
      }, counter);
    }
  }

  for (const [projectId, count] of successByProject) {
    if (count >= 1) {
      pushSignal(signals, {
        type: "unblocker",
        severity: "positive",
        source: "inferred",
        label: "Mission qui débloque le projet",
        description: `${count} succès local(aux) enregistré(s) pour ce projet.`,
        projectId,
        confidence: Math.min(85, 55 + count * 8),
      }, counter);
    }
  }

  for (const [projectId, count] of abandonedByProject) {
    if (count >= 2) {
      pushSignal(signals, {
        type: "often_abandoned",
        severity: "warning",
        source: "inferred",
        label: "Abandons récurrents sur le projet",
        description: `${count} abandon(s) signalé(s) — clarifier avant de recommander.`,
        projectId,
        confidence: Math.min(88, 52 + count * 12),
      }, counter);
    }
  }

  for (const [projectId, count] of missingReportCount) {
    if (count >= 2) {
      pushSignal(signals, {
        type: "needs_clearer_validation",
        severity: "warning",
        source: "inferred",
        label: "Validation floue récurrente",
        description: `${count} rapport(s) final(aux) manquant(s) sur ce projet.`,
        projectId,
        confidence: 65,
      }, counter);
    }
  }

  return signals;
}

export function createManualFeedbackId(): string {
  return `mfmanual-${Date.now()}`;
}
