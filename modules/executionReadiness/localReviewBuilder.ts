import {
  loadExecutionReadinessState,
  saveExecutionReadinessState,
} from "./executionReadinessStore";
import { getCommandPackById } from "./commandPackBuilder";
import type {
  LocalReviewAuditEntry,
  LocalReviewInput,
  LocalReviewSession,
  LocalReviewSessionStatus,
  LocalReviewType,
} from "./localReviewTypes";
import { getLocalReviewDisclaimer } from "./localReviewPolicy";
import {
  analyzeUserProvidedReviewInput,
  inferInputType,
} from "./localReviewSignals";

function newId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

function audit(
  type: LocalReviewAuditEntry["type"],
  message: string,
  status?: LocalReviewSessionStatus
): LocalReviewAuditEntry {
  return { id: newId("lr-audit"), at: nowIso(), type, message, status };
}

function saveSession(session: LocalReviewSession): LocalReviewSession {
  const state = loadExecutionReadinessState();
  const existing = state.localReviewSessions ?? [];
  saveExecutionReadinessState({
    ...state,
    localReviewSessions: [session, ...existing.filter((s) => s.id !== session.id)],
    lastUpdatedAt: session.updatedAt,
  });
  return session;
}

export function listLocalReviewSessions(limit?: number): LocalReviewSession[] {
  const sessions = loadExecutionReadinessState().localReviewSessions ?? [];
  const sorted = [...sessions].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return limit ? sorted.slice(0, limit) : sorted;
}

export function getLocalReviewSessionById(id: string): LocalReviewSession | undefined {
  return listLocalReviewSessions().find((s) => s.id === id);
}

export function createReviewSessionFromCommandPack(
  commandPackId: string,
  commandId?: string
): LocalReviewSession | undefined {
  const pack = getCommandPackById(commandPackId);
  if (!pack) return undefined;

  const cmd = commandId ? pack.commands.find((c) => c.id === commandId) : pack.commands[0];
  const timestamp = nowIso();

  const session: LocalReviewSession = {
    id: newId("lr-session"),
    title: `Revue · ${pack.title.slice(0, 48)}`,
    createdAt: timestamp,
    updatedAt: timestamp,
    sourceCommandPackId: pack.id,
    sourceCommandId: cmd?.id,
    reviewType: mapPackCategoryToReviewType(pack.category),
    status: "awaiting_user_input",
    confidence: "low",
    userProvidedInput: "",
    sanitizedPreview: "",
    inputs: [],
    detectedSignals: [],
    successSignals: [],
    warningSignals: [],
    errorSignals: [],
    humanChecks: [
      "Coller le résultat obtenu manuellement hors Gigi",
      "Gigi ne lit pas le terminal ni les fichiers",
      "Statut probable — validation humaine obligatoire",
      ...(cmd?.failureSigns ? [`Signes d'échec attendus : ${cmd.failureSigns}`] : []),
    ],
    recommendedNextSteps: [
      "Lancer la commande toi-même, puis coller la sortie ici",
      `Résultat attendu : ${pack.expectedOutcome}`,
    ],
    riskLevel: pack.riskLevel,
    hasSensitivePatternAlert: false,
    auditTrail: [
      audit(
        "review_session_created",
        `Revue créée depuis pack ${pack.id} — analyse locale uniquement.`,
        "awaiting_user_input"
      ),
    ],
    disclaimer: getLocalReviewDisclaimer(),
  };

  return saveSession(session);
}

function mapPackCategoryToReviewType(
  category: string
): LocalReviewType {
  if (category === "github_pr") return "github_response";
  if (category === "n8n_workflow") return "n8n_log";
  if (category === "browser_checklist") return "browser_note";
  if (category === "email_draft") return "email_note";
  if (category === "git_local") return "terminal_output";
  return "generic";
}

export function createEmptyReviewSession(title?: string): LocalReviewSession {
  const timestamp = nowIso();
  return saveSession({
    id: newId("lr-session"),
    title: title ?? "Revue locale",
    createdAt: timestamp,
    updatedAt: timestamp,
    reviewType: "generic",
    status: "awaiting_user_input",
    confidence: "low",
    userProvidedInput: "",
    sanitizedPreview: "",
    inputs: [],
    detectedSignals: [],
    successSignals: [],
    warningSignals: [],
    errorSignals: [],
    humanChecks: [
      "Coller un résultat obtenu manuellement",
      "Gigi analyse localement — aucune vérification réelle",
    ],
    recommendedNextSteps: ["Coller la sortie ou le log, puis analyser localement"],
    riskLevel: "medium",
    hasSensitivePatternAlert: false,
    auditTrail: [
      audit("review_session_created", "Revue locale créée — texte collé uniquement.", "awaiting_user_input"),
    ],
    disclaimer: getLocalReviewDisclaimer(),
  });
}

export function saveReviewInput(
  sessionId: string,
  rawText: string,
  label = "Résultat collé",
  userConfirmedNoSecrets?: boolean
): LocalReviewSession | undefined {
  const session = getLocalReviewSessionById(sessionId);
  if (!session) return undefined;

  const pack = session.sourceCommandPackId
    ? getCommandPackById(session.sourceCommandPackId)
    : undefined;
  const cmd = pack?.commands.find((c) => c.id === session.sourceCommandId);

  const analysis = analyzeUserProvidedReviewInput(rawText, {
    expectedOutcome: pack?.expectedOutcome,
    failureSigns: cmd?.failureSigns,
  });

  const input: LocalReviewInput = {
    id: newId("lr-input"),
    createdAt: nowIso(),
    inputType: inferInputType(label),
    label,
    rawText,
    redactionWarnings: analysis.redactionWarnings,
    detectedSensitivePatterns: analysis.sensitivePatterns,
    userConfirmedNoSecrets,
  };

  const auditEvents: LocalReviewAuditEntry[] = [
    audit("input_saved_by_human", "Résultat enregistré — fourni par l'utilisateur."),
  ];
  if (analysis.sensitivePatterns.length > 0) {
    auditEvents.unshift(
      audit(
        "sensitive_pattern_detected",
        `Motifs sensibles détectés : ${analysis.sensitivePatterns.join(", ")}`
      )
    );
  }

  return saveSession({
    ...session,
    updatedAt: nowIso(),
    userProvidedInput: rawText,
    sanitizedPreview: analysis.sanitizedPreview,
    inputs: [input, ...session.inputs],
    status: analysis.status === "awaiting_user_input" ? "review_ready" : analysis.status,
    confidence: analysis.confidence,
    detectedSignals: analysis.signals.detectedSignals,
    successSignals: analysis.signals.successSignals,
    warningSignals: analysis.signals.warningSignals,
    errorSignals: analysis.signals.errorSignals,
    humanChecks: analysis.humanChecks,
    recommendedNextSteps: analysis.recommendedNextSteps,
    hasSensitivePatternAlert: analysis.sensitivePatterns.length > 0,
    auditTrail: [
      ...auditEvents,
      audit(
        "local_review_analyzed",
        `Analyse locale — statut probable : ${analysis.status}`,
        analysis.status
      ),
      ...session.auditTrail,
    ],
  });
}

export function analyzeExistingReviewSession(
  sessionId: string
): LocalReviewSession | undefined {
  const session = getLocalReviewSessionById(sessionId);
  if (!session || !session.userProvidedInput.trim()) return session;

  const pack = session.sourceCommandPackId
    ? getCommandPackById(session.sourceCommandPackId)
    : undefined;
  const cmd = pack?.commands.find((c) => c.id === session.sourceCommandId);

  const analysis = analyzeUserProvidedReviewInput(session.userProvidedInput, {
    expectedOutcome: pack?.expectedOutcome,
    failureSigns: cmd?.failureSigns,
  });

  return saveSession({
    ...session,
    updatedAt: nowIso(),
    sanitizedPreview: analysis.sanitizedPreview,
    status: analysis.status,
    confidence: analysis.confidence,
    detectedSignals: analysis.signals.detectedSignals,
    successSignals: analysis.signals.successSignals,
    warningSignals: analysis.signals.warningSignals,
    errorSignals: analysis.signals.errorSignals,
    humanChecks: analysis.humanChecks,
    recommendedNextSteps: analysis.recommendedNextSteps,
    hasSensitivePatternAlert: analysis.sensitivePatterns.length > 0,
    auditTrail: [
      audit(
        "local_review_analyzed",
        `Ré-analyse locale — statut probable : ${analysis.status}`,
        analysis.status
      ),
      ...session.auditTrail,
    ],
  });
}

export function updateReviewSessionStatus(
  sessionId: string,
  status: LocalReviewSessionStatus,
  reason?: string
): LocalReviewSession | undefined {
  const session = getLocalReviewSessionById(sessionId);
  if (!session) return undefined;

  const auditType: LocalReviewAuditEntry["type"] =
    status === "inconclusive"
      ? "marked_inconclusive"
      : status === "archived"
        ? "archived"
        : "status_change";

  return saveSession({
    ...session,
    status,
    updatedAt: nowIso(),
    auditTrail: [
      audit(auditType, reason ?? `Statut → ${status}`, status),
      ...session.auditTrail,
    ],
  });
}
