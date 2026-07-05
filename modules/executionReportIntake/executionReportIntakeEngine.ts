import type { ExecutionLogEntryType } from "@/modules/executionLogs/types";
import type {
  ExecutionReportIntake,
  ExecutionReportIntakeDecision,
  ExecutionReportIntakeReporter,
  ExecutionReportIntakeSection,
  ExecutionReportIntakeSource,
  ExecutionReportIntakeWarning,
  ParsedExecutionReport,
  ProposedLogEntry,
} from "./types";
import { EXECUTION_REPORT_INTAKE_ID_PREFIX } from "./types";
import { inferReporterFromParsed, parseExecutionReportText } from "./executionReportIntakeParser";

function nowIso(): string {
  return new Date().toISOString();
}

function id(prefix: string): string {
  return `${prefix}${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function hasTestFailure(parsed: ParsedExecutionReport): boolean {
  return parsed.testResults.some((r) => /fail|[ée]chou|ko/i.test(r));
}

function hasTestPass(parsed: ParsedExecutionReport): boolean {
  return parsed.testResults.some((r) => /ok|pass|r[ée]ussi/i.test(r));
}

export function determineIntakeDecision(parsed: ParsedExecutionReport): ExecutionReportIntakeDecision {
  const abandoned = parsed.uncertainties.some((u) => /abandon/i.test(u));
  if (abandoned) return "abandoned";

  const blocked = parsed.blockers.length > 0;
  const testsFailed = hasTestFailure(parsed);
  const testsPassed = hasTestPass(parsed) && !testsFailed;
  const hasFix = parsed.fixesNeeded.length > 0;
  const completed =
    parsed.finalSummary &&
    /termin[ée]|done|completed|succ[èe]s|r[ée]ussi/i.test(parsed.finalSummary) &&
    !blocked &&
    !testsFailed &&
    !hasFix;

  if (testsFailed) return "tests_failed";
  if (blocked) return "blocked";
  if (hasFix || testsFailed) return "needs_fix";
  if (completed) return "completed";
  if (parsed.stepsCompleted.length > 0 && (parsed.nextStepRecommendation || hasFix)) {
    return "partially_completed";
  }
  if (testsPassed) return "tests_passed";
  if (!parsed.finalSummary && parsed.stepsCompleted.length === 0) return "unclear";
  if (parsed.stepsCompleted.length > 0) return "partially_completed";
  return "unclear";
}

export function buildIntakeWarnings(
  parsed: ParsedExecutionReport,
  decision: ExecutionReportIntakeDecision,
  hasSourceRef: boolean
): ExecutionReportIntakeWarning[] {
  const warnings: ExecutionReportIntakeWarning[] = [
    {
      id: id("warn-"),
      type: "unverified_claim",
      label: "Déclaratif non vérifié",
      description: "Ce rapport est basé uniquement sur le texte collé. Gigi n'a pas vérifié le repo.",
      severity: "info",
    },
  ];

  if (parsed.testsRun.length === 0 && parsed.testResults.length === 0) {
    warnings.push({
      id: id("warn-"),
      type: "missing_tests",
      label: "Aucun test déclaré",
      description: "Le rapport ne mentionne aucun test lancé ou résultat.",
      severity: "warning",
    });
  }

  if (parsed.filesModified.length === 0) {
    warnings.push({
      id: id("warn-"),
      type: "missing_files",
      label: "Aucun fichier déclaré",
      description: "Aucun fichier modifié n'a été détecté dans le rapport.",
      severity: "warning",
    });
  }

  if (!parsed.finalSummary) {
    warnings.push({
      id: id("warn-"),
      type: "missing_final_summary",
      label: "Rapport final absent",
      description: "Aucun résumé final explicite n'a été détecté.",
      severity: "warning",
    });
  }

  if (parsed.commitPerformed && !parsed.commitHash) {
    warnings.push({
      id: id("warn-"),
      type: "unclear_commit",
      label: "Commit sans hash",
      description: "Un commit est déclaré mais aucun hash n'a été fourni.",
      severity: "warning",
    });
  }

  if (!hasSourceRef) {
    warnings.push({
      id: id("warn-"),
      type: "no_action_reference",
      label: "Aucune source liée",
      description: "Cet intake n'est rattaché à aucun handoff, workspace ou action.",
      severity: "info",
    });
  }

  if (decision === "completed" && hasTestFailure(parsed)) {
    warnings.push({
      id: id("warn-"),
      type: "tests_failed_but_completed",
      label: "Terminé mais tests KO",
      description: "Le rapport indique terminé alors que des tests ont échoué.",
      severity: "critical",
    });
  }

  if (decision === "completed" && parsed.blockers.length > 0) {
    warnings.push({
      id: id("warn-"),
      type: "blocked_but_marked_done",
      label: "Terminé malgré blocages",
      description: "Des blocages sont déclarés mais le statut semble terminé.",
      severity: "critical",
    });
  }

  if (hasTestFailure(parsed) && decision === "completed") {
    warnings.push({
      id: id("warn-"),
      type: "contradictory_status",
      label: "Statut contradictoire",
      description: "Tests échoués et statut terminé détectés simultanément.",
      severity: "critical",
    });
  }

  return warnings;
}

export function buildProposedLogEntries(parsed: ParsedExecutionReport): ProposedLogEntry[] {
  const entries: ProposedLogEntry[] = [];
  const ts = nowIso();

  const push = (type: ExecutionLogEntryType, message: string, confidence: number, sourceText?: string) => {
    entries.push({ id: id("plog-"), type, message, confidence, sourceText, createdAt: ts });
  };

  if (parsed.stepsCompleted.length > 0 || parsed.actionExecuted) {
    push("started", "Exécution manuelle déclarée dans le rapport", 0.85, parsed.actionExecuted);
  }

  parsed.stepsCompleted.forEach((step, i) => {
    push("step_completed", step, 0.8, step);
    if (i > 8) return;
  });

  parsed.testResults.forEach((result) => {
    if (/fail|[ée]chou|ko/i.test(result)) {
      push("test_failed", result, 0.85, result);
    } else if (/ok|pass|r[ée]ussi/i.test(result)) {
      push("test_passed", result, 0.85, result);
    } else {
      push("note", `Résultat test : ${result}`, 0.6, result);
    }
  });

  parsed.blockers.forEach((b) => push("blocked", b, 0.82, b));
  parsed.fixesNeeded.forEach((f) => push("fix_needed", f, 0.82, f));

  if (parsed.commitPerformed) {
    push(
      "manual_commit",
      parsed.commitHash ? `Commit déclaré — hash ${parsed.commitHash}` : "Commit manuel déclaré",
      parsed.commitHash ? 0.75 : 0.55,
      parsed.commitHash
    );
  }

  if (parsed.finalSummary && /termin[ée]|done|completed/i.test(parsed.finalSummary)) {
    push("completed_manually", parsed.finalSummary, 0.7, parsed.finalSummary);
  }

  if (parsed.uncertainties.some((u) => /abandon/i.test(u))) {
    push("abandoned", "Abandon déclaré dans le rapport", 0.75);
  }

  if (parsed.nextStepRecommendation) {
    push("note", `Prochaine étape : ${parsed.nextStepRecommendation}`, 0.65, parsed.nextStepRecommendation);
  }

  if (entries.length === 0 && parsed.finalSummary) {
    push("note", parsed.finalSummary, 0.5, parsed.finalSummary);
  }

  return entries;
}

function computeConfidence(parsed: ParsedExecutionReport, warnings: ExecutionReportIntakeWarning[]): number {
  let score = 40;
  if (parsed.actionExecuted) score += 10;
  if (parsed.filesModified.length) score += 8;
  if (parsed.stepsCompleted.length) score += 10;
  if (parsed.testResults.length) score += 10;
  if (parsed.finalSummary) score += 12;
  if (parsed.blockers.length) score += 5;
  const critical = warnings.filter((w) => w.severity === "critical").length;
  score -= critical * 15;
  score -= warnings.filter((w) => w.type === "missing_final_summary").length * 5;
  return Math.max(20, Math.min(95, score));
}

export function buildIntakeSections(
  rawReport: string,
  parsed: ParsedExecutionReport,
  proposedLogEntries: ProposedLogEntry[],
  proposedReviewSummary?: string
): ExecutionReportIntakeSection[] {
  const sections: ExecutionReportIntakeSection[] = [];
  let order = 0;

  const add = (type: ExecutionReportIntakeSection["type"], title: string, content: string) => {
    if (!content.trim()) return;
    sections.push({ id: id("sec-"), type, title, content, order: order++ });
  };

  add("raw_report", "Rapport brut", rawReport.slice(0, 2000));
  add(
    "parsed_summary",
    "Résumé parsé",
    [
      parsed.actionExecuted ? `Action : ${parsed.actionExecuted}` : "",
      parsed.executionDate ? `Date : ${parsed.executionDate}` : "",
      parsed.toolUsed ? `Outil : ${parsed.toolUsed}` : "",
      parsed.finalSummary ?? "",
    ]
      .filter(Boolean)
      .join("\n")
  );
  add("files_modified", "Fichiers modifiés déclarés", parsed.filesModified.map((f) => `* ${f}`).join("\n"));
  add("steps_completed", "Étapes réalisées", parsed.stepsCompleted.map((s) => `* ${s}`).join("\n"));
  add("commands_run", "Commandes déclarées", parsed.commandsRunManually.map((c) => `* ${c}`).join("\n"));
  add("tests_run", "Tests lancés", parsed.testsRun.map((t) => `* ${t}`).join("\n"));
  add("test_results", "Résultats des tests", parsed.testResults.map((t) => `* ${t}`).join("\n"));
  add("blockers", "Blocages", parsed.blockers.map((b) => `* ${b}`).join("\n"));
  add("fixes_needed", "Corrections nécessaires", parsed.fixesNeeded.map((f) => `* ${f}`).join("\n"));
  add(
    "manual_commit",
    "Commit manuel",
    parsed.commitPerformed !== undefined
      ? `Commit : ${parsed.commitPerformed ? "oui" : "non"}${parsed.commitHash ? ` · ${parsed.commitHash}` : ""}`
      : ""
  );
  add("final_report", "Rapport final", parsed.finalSummary ?? "");
  add("next_steps", "Prochaine étape", parsed.nextStepRecommendation ?? "");
  add(
    "proposed_log_entries",
    "Entrées de log proposées",
    proposedLogEntries.map((e) => `* [${e.type}] ${e.message}`).join("\n")
  );
  if (proposedReviewSummary) {
    add("proposed_review", "Review proposée", proposedReviewSummary);
  }

  return sections;
}

export interface IntakeBuildContext {
  title: string;
  source: ExecutionReportIntakeSource;
  reporter?: ExecutionReportIntakeReporter;
  sourceHandoffId?: string;
  sourceWorkspaceId?: string;
  sourceActionId?: string;
  sourceExecutionPlanId?: string;
  sourceExecutionLogId?: string;
  projectId?: string;
  missionId?: string;
}

export function createIntakeRecord(ctx: IntakeBuildContext, rawReport = ""): ExecutionReportIntake {
  const timestamp = nowIso();
  const parsed = rawReport.trim() ? parseExecutionReportText(rawReport) : {
    filesModified: [],
    stepsCompleted: [],
    commandsRunManually: [],
    testsRun: [],
    testResults: [],
    blockers: [],
    fixesNeeded: [],
    uncertainties: [],
  };

  const reporter =
    ctx.reporter ??
    (rawReport.trim() ? inferReporterFromParsed(parsed, rawReport) : "unknown");

  const hasSource = Boolean(
    ctx.sourceHandoffId || ctx.sourceWorkspaceId || ctx.sourceActionId || ctx.sourceExecutionPlanId
  );

  let decision: ExecutionReportIntakeDecision = "unclear";
  let proposedLogEntries: ProposedLogEntry[] = [];
  let warnings: ExecutionReportIntakeWarning[] = [];
  let confidence = 30;
  let proposedReviewSummary: string | undefined;

  if (rawReport.trim()) {
    decision = determineIntakeDecision(parsed);
    proposedLogEntries = buildProposedLogEntries(parsed);
    warnings = buildIntakeWarnings(parsed, decision, hasSource);
    confidence = computeConfidence(parsed, warnings);
    proposedReviewSummary = buildProposedReviewSummary(parsed, decision, proposedLogEntries);
  }

  const intake: ExecutionReportIntake = {
    id: `${EXECUTION_REPORT_INTAKE_ID_PREFIX}${Date.now()}`,
    title: ctx.title,
    status: "draft",
    source: ctx.source,
    reporter,
    decision: "unclear",
    rawReport,
    sourceHandoffId: ctx.sourceHandoffId,
    sourceWorkspaceId: ctx.sourceWorkspaceId,
    sourceActionId: ctx.sourceActionId,
    sourceExecutionPlanId: ctx.sourceExecutionPlanId,
    sourceExecutionLogId: ctx.sourceExecutionLogId,
    projectId: ctx.projectId,
    missionId: ctx.missionId,
    parsedReport: parsed,
    proposedLogEntries: [],
    proposedReviewSummary: undefined,
    confidence: 30,
    warnings: [],
    userNotes: [],
    createdAt: timestamp,
    updatedAt: timestamp,
    metadata: {},
  };

  if (rawReport.trim()) {
    intake.decision = decision;
    intake.proposedLogEntries = proposedLogEntries;
    intake.proposedReviewSummary = proposedReviewSummary;
    intake.confidence = confidence;
    intake.warnings = warnings;
    intake.status = warnings.some((w) => w.severity === "critical") ? "needs_review" : "ready_to_apply";
  }

  return intake;
}

export function parseIntakeReport(intake: ExecutionReportIntake, rawReport: string): ExecutionReportIntake {
  const parsed = parseExecutionReportText(rawReport);
  const reporter = inferReporterFromParsed(parsed, rawReport);
  const decision = determineIntakeDecision(parsed);
  const proposedLogEntries = buildProposedLogEntries(parsed);
  const hasSource = Boolean(
    intake.sourceHandoffId ||
      intake.sourceWorkspaceId ||
      intake.sourceActionId ||
      intake.sourceExecutionPlanId
  );
  const warnings = buildIntakeWarnings(parsed, decision, hasSource);
  const confidence = computeConfidence(parsed, warnings);
  const proposedReviewSummary = buildProposedReviewSummary(parsed, decision, proposedLogEntries);
  const timestamp = nowIso();

  return {
    ...intake,
    rawReport,
    reporter,
    decision,
    parsedReport: parsed,
    proposedLogEntries,
    proposedReviewSummary,
    confidence,
    warnings,
    status: warnings.some((w) => w.severity === "critical") ? "needs_review" : "ready_to_apply",
    updatedAt: timestamp,
  };
}

export function buildProposedReviewSummary(
  parsed: ParsedExecutionReport,
  decision: ExecutionReportIntakeDecision,
  entries: ProposedLogEntry[]
): string {
  const parts: string[] = [
    `Décision locale proposée : ${decision}.`,
    parsed.finalSummary ? `Résumé : ${parsed.finalSummary}` : "Résumé final absent ou incomplet.",
  ];
  if (parsed.blockers.length) parts.push(`Blocages déclarés : ${parsed.blockers.join(" · ")}.`);
  if (parsed.fixesNeeded.length) parts.push(`Corrections : ${parsed.fixesNeeded.join(" · ")}.`);
  parts.push(`${entries.length} entrée(s) de log proposée(s) — application manuelle requise.`);
  parts.push("Review basée sur le rapport collé — Gigi n'a pas vérifié le repo.");
  return parts.join(" ");
}

export function buildParsedSummaryText(intake: ExecutionReportIntake): string {
  const p = intake.parsedReport;
  const parts: string[] = [];
  if (p.actionExecuted) parts.push(`Action : ${p.actionExecuted}`);
  if (p.finalSummary) parts.push(p.finalSummary);
  else if (p.stepsCompleted.length) parts.push(`${p.stepsCompleted.length} étape(s) déclarée(s).`);
  if (p.blockers.length) parts.push(`Blocages : ${p.blockers.join(", ")}.`);
  if (p.testResults.length) parts.push(`Tests : ${p.testResults.join(" · ")}.`);
  return parts.join(" ") || "Rapport parsé — détails limités.";
}
