import type {
  LocalReviewConfidence,
  LocalReviewInputType,
  LocalReviewSessionStatus,
  LocalReviewSignalReport,
} from "./localReviewTypes";

const SUCCESS_KEYWORDS = [
  "success",
  "done",
  "completed",
  "merged",
  "pushed",
  "created",
  " ok",
  "passed",
  "build successful",
  "succès",
  "terminé",
  "réussi",
];

const WARNING_KEYWORDS = [
  "warning",
  "deprecated",
  "skipped",
  "retry",
  "pending",
  "unstable",
  "avertissement",
  "attention",
  "en attente",
];

const ERROR_KEYWORDS = [
  "error",
  "failed",
  "denied",
  "unauthorized",
  "forbidden",
  "conflict",
  "rejected",
  "missing",
  "not found",
  "timeout",
  "erreur",
  "échec",
  "refusé",
  "interdit",
];

const SENSITIVE_PATTERNS: { label: string; regex: RegExp }[] = [
  { label: "token", regex: /\btoken\b/i },
  { label: "secret", regex: /\bsecret\b/i },
  { label: "password", regex: /\bpassword\b/i },
  { label: "private key", regex: /private[\s_-]?key/i },
  { label: "api_key", regex: /\bapi[_-]?key\b/i },
  { label: "bearer", regex: /\bbearer\s+[a-z0-9._-]{8,}/i },
  { label: "ghp_", regex: /\bghp_[a-zA-Z0-9]{20,}\b/ },
  { label: "sk-", regex: /\bsk-[a-zA-Z0-9]{16,}\b/ },
  { label: "webhook", regex: /\bwebhook[_-]?url\b/i },
  { label: ".env", regex: /\.env\b/i },
];

function normalize(text: string): string {
  return text.toLowerCase();
}

function findMatches(text: string, keywords: string[]): string[] {
  const norm = normalize(text);
  return keywords.filter((k) => norm.includes(k.trim())).map((k) => k.trim());
}

export function detectSensitivePatterns(text: string): string[] {
  const found: string[] = [];
  for (const { label, regex } of SENSITIVE_PATTERNS) {
    if (regex.test(text)) found.push(label);
  }
  return [...new Set(found)];
}

export function sanitizePreview(text: string, maxLen = 280): string {
  let preview = text.slice(0, maxLen);
  if (text.length > maxLen) preview += "…";
  preview = preview.replace(/\bghp_[a-zA-Z0-9]{8,}\b/g, "[REDACTED]");
  preview = preview.replace(/\bsk-[a-zA-Z0-9]{8,}\b/g, "[REDACTED]");
  preview = preview.replace(/\bbearer\s+[a-z0-9._-]{8,}/gi, "bearer [REDACTED]");
  return preview;
}

export function detectReviewSignals(text: string): LocalReviewSignalReport {
  const successSignals = findMatches(text, SUCCESS_KEYWORDS);
  const warningSignals = findMatches(text, WARNING_KEYWORDS);
  const errorSignals = findMatches(text, ERROR_KEYWORDS);
  return {
    successSignals,
    warningSignals,
    errorSignals,
    detectedSignals: [...successSignals, ...warningSignals, ...errorSignals],
  };
}

export function inferReviewStatus(signals: LocalReviewSignalReport): LocalReviewSessionStatus {
  const { successSignals, warningSignals, errorSignals } = signals;
  if (errorSignals.length > 0 && successSignals.length === 0) return "likely_failed";
  if (errorSignals.length > successSignals.length) return "likely_failed";
  if (warningSignals.length > 0 || (errorSignals.length > 0 && successSignals.length > 0)) {
    return "needs_attention";
  }
  if (successSignals.length > 0 && errorSignals.length === 0) return "likely_success";
  return "inconclusive";
}

export function inferConfidence(signals: LocalReviewSignalReport): LocalReviewConfidence {
  const total =
    signals.successSignals.length + signals.warningSignals.length + signals.errorSignals.length;
  if (total >= 3) return "high";
  if (total >= 1) return "medium";
  return "low";
}

export interface LocalReviewAnalysisResult {
  signals: LocalReviewSignalReport;
  status: LocalReviewSessionStatus;
  confidence: LocalReviewConfidence;
  sensitivePatterns: string[];
  sanitizedPreview: string;
  redactionWarnings: string[];
  humanChecks: string[];
  recommendedNextSteps: string[];
}

export function analyzeUserProvidedReviewInput(
  rawText: string,
  context?: { expectedOutcome?: string; failureSigns?: string }
): LocalReviewAnalysisResult {
  const trimmed = rawText.trim();
  const signals = detectReviewSignals(trimmed);
  const sensitivePatterns = detectSensitivePatterns(trimmed);
  const status = trimmed.length === 0 ? "awaiting_user_input" : inferReviewStatus(signals);
  const confidence = inferConfidence(signals);

  const redactionWarnings =
    sensitivePatterns.length > 0
      ? [
          "Motif sensible détecté dans le texte collé — retire les secrets avant sauvegarde si possible.",
          `Patterns : ${sensitivePatterns.join(", ")}`,
        ]
      : [];

  const humanChecks = [
    "Confirmer humainement que le résultat correspond à l'action attendue",
    "Gigi n'a pas vérifié le système — statut probable uniquement",
    ...(context?.failureSigns ? [`Signes d'échec attendus : ${context.failureSigns}`] : []),
    ...(sensitivePatterns.length > 0
      ? ["Retirer ou remplacer tout secret avant partage futur"]
      : []),
  ];

  const recommendedNextSteps: string[] = [];
  if (status === "likely_success") {
    recommendedNextSteps.push("Valider humainement le résultat avant de continuer");
    recommendedNextSteps.push("Marquer le pack de commandes source si applicable");
  } else if (status === "likely_failed") {
    recommendedNextSteps.push("Relire la commande et le contexte");
    recommendedNextSteps.push("Consulter le rollback manuel du pack source");
  } else if (status === "needs_attention") {
    recommendedNextSteps.push("Relire les avertissements dans la sortie collée");
    recommendedNextSteps.push("Ne pas continuer sans validation humaine");
  } else if (status === "inconclusive") {
    recommendedNextSteps.push("Coller plus de contexte ou une sortie plus complète");
    recommendedNextSteps.push("Vérifier manuellement hors Gigi");
  }

  if (context?.expectedOutcome) {
    recommendedNextSteps.push(`Résultat attendu (pack) : ${context.expectedOutcome}`);
  }

  return {
    signals,
    status,
    confidence,
    sensitivePatterns,
    sanitizedPreview: sanitizePreview(trimmed),
    redactionWarnings,
    humanChecks,
    recommendedNextSteps,
  };
}

export function inferInputType(label?: string): LocalReviewInputType {
  const norm = (label ?? "").toLowerCase();
  if (/terminal|shell|git/.test(norm)) return "terminal_output";
  if (/github|gh|pr/.test(norm)) return "api_response";
  if (/n8n|workflow/.test(norm)) return "log";
  if (/browser|navigateur/.test(norm)) return "browser_note";
  if (/email|mail/.test(norm)) return "email_note";
  return "freeform";
}
