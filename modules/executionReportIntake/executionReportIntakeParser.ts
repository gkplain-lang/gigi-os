import type {
  ExecutionReportIntakeReporter,
  ParsedExecutionReport,
} from "./types";

const TEMPLATE_FIELDS: { key: keyof ParsedExecutionReport; patterns: RegExp[] }[] = [
  {
    key: "actionExecuted",
    patterns: [/action ex[ée]cut[ée]e\s*:\s*(.+)/i, /action\s*:\s*(.+)/i],
  },
  {
    key: "executionDate",
    patterns: [/date\s*:\s*(.+)/i],
  },
  {
    key: "toolUsed",
    patterns: [/outil utilis[ée]\s*:\s*(.+)/i, /tool\s*:\s*(.+)/i],
  },
];

function emptyParsed(): ParsedExecutionReport {
  return {
    filesModified: [],
    stepsCompleted: [],
    commandsRunManually: [],
    testsRun: [],
    testResults: [],
    blockers: [],
    fixesNeeded: [],
    uncertainties: [],
  };
}

function extractScalar(text: string, patterns: RegExp[]): string | undefined {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]?.trim()) return match[1].trim();
  }
  return undefined;
}

function extractListSection(text: string, headers: string[]): string[] {
  const lines = text.split("\n");
  const items: string[] = [];
  let capturing = false;

  for (const line of lines) {
    const trimmed = line.trim();
    const lower = trimmed.toLowerCase();

    if (headers.some((h) => lower.startsWith(h.toLowerCase()))) {
      capturing = true;
      const inline = trimmed.split(":").slice(1).join(":").trim();
      if (inline && inline !== "") items.push(inline.replace(/^[-*]\s*/, ""));
      continue;
    }

    if (capturing) {
      if (/^[a-zàâäéèêëïîôùûüç\s]+:/i.test(trimmed) && !trimmed.startsWith("-") && !trimmed.startsWith("*")) {
        break;
      }
      if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
        items.push(trimmed.replace(/^[-*]\s*/, "").trim());
      } else if (trimmed && !trimmed.startsWith("#")) {
        items.push(trimmed);
      } else if (!trimmed) {
        continue;
      }
    }
  }

  return items.filter(Boolean);
}

const FILE_PATH_PATTERN =
  /(?:^|\s)((?:components|modules|app|docs|lib|data|public)\/[a-zA-Z0-9_./-]+\.[a-z]{2,4})/g;

const COMMAND_PATTERN =
  /(?:npm run [a-z-]+|npm test|yarn [a-z-]+|git (?:status|commit|push|pull|checkout|branch)[^\n]*|npx [^\n]+)/gi;

function detectFilesInText(text: string): string[] {
  const found = new Set<string>();
  let match: RegExpExecArray | null;
  const pattern = new RegExp(FILE_PATH_PATTERN.source, "g");
  while ((match = pattern.exec(text)) !== null) {
    found.add(match[1].trim());
  }
  return [...found];
}

function detectCommandsInText(text: string): string[] {
  const matches = text.match(COMMAND_PATTERN) ?? [];
  return [...new Set(matches.map((m) => m.trim()))];
}

function detectReporterFromText(text: string): ExecutionReportIntakeReporter {
  const lower = text.toLowerCase();
  if (/cursor/.test(lower)) return "cursor";
  if (/humain|human/.test(lower)) return "human";
  if (/\bmoi\b|self/.test(lower)) return "self";
  if (/g[ée]n[ée]rique|generic/.test(lower)) return "generic";
  return "unknown";
}

function parseCommitInfo(text: string): { performed?: boolean; hash?: string } {
  const commitLine = text.match(/commit r[ée]alis[ée]\s*\?\s*(.+)/i);
  const hashLine = text.match(/hash commit[^\n:]*:\s*(.+)/i);
  let performed: boolean | undefined;
  if (commitLine?.[1]) {
    const val = commitLine[1].trim().toLowerCase();
    if (/^oui|yes|true/.test(val)) performed = true;
    else if (/^non|no|false/.test(val)) performed = false;
  }
  if (/\bcommit (?:fait|r[ée]alis[ée]|effectu[ée])\b/i.test(text)) performed = true;
  return { performed, hash: hashLine?.[1]?.trim() };
}

function detectTestSignals(text: string): { testsRun: string[]; testResults: string[] } {
  const testsRun: string[] = [];
  const testResults: string[] = [];
  const lower = text.toLowerCase();

  const patterns = [
    { run: "npm run build", ok: /build\s*(?:ok|passed|success|r[ée]ussi)/i, fail: /build\s*(?:fail|failed|[ée]chou[ée]|ko)/i },
    { run: "npm run lint", ok: /lint\s*(?:ok|passed|success|r[ée]ussi)/i, fail: /lint\s*(?:fail|failed|[ée]chou[ée]|ko)/i },
    { run: "npm test", ok: /test\s*(?:ok|passed|success|r[ée]ussi)/i, fail: /test\s*(?:fail|failed|[ée]chou[ée]|ko)/i },
  ];

  for (const p of patterns) {
    if (lower.includes(p.run.replace("npm run ", "")) || lower.includes(p.run)) {
      testsRun.push(p.run);
    }
    if (p.ok.test(text)) testResults.push(`${p.run} : OK`);
    if (p.fail.test(text)) testResults.push(`${p.run} : failed`);
  }

  if (/build ok/i.test(text)) testResults.push("Build : OK");
  if (/build failed|build fail/i.test(text)) testResults.push("Build : failed");
  if (/lint ok/i.test(text)) testResults.push("Lint : OK");
  if (/test failed|tests failed/i.test(text)) testResults.push("Tests : failed");
  if (/test passed|tests passed/i.test(text)) testResults.push("Tests : OK");

  return { testsRun: [...new Set(testsRun)], testResults: [...new Set(testResults)] };
}

function detectBlockers(text: string): string[] {
  const blockers = extractListSection(text, ["blocages", "blocage", "blockers", "blocked"]);
  const extra: string[] = [];
  if (/\bbloqu[ée]\b|\bblocked\b/i.test(text)) {
    const lines = text.split("\n").filter((l) => /\bbloqu[ée]\b|\bblocked\b|\berreur\b|\bfailed\b/i.test(l));
    extra.push(...lines.map((l) => l.trim()).filter(Boolean));
  }
  return [...new Set([...blockers, ...extra])];
}

export function parseExecutionReportText(rawReport: string): ParsedExecutionReport {
  const parsed = emptyParsed();
  const text = rawReport.trim();
  if (!text) return parsed;

  for (const field of TEMPLATE_FIELDS) {
    const val = extractScalar(text, field.patterns);
    if (!val) continue;
    if (field.key === "actionExecuted") parsed.actionExecuted = val;
    else if (field.key === "executionDate") parsed.executionDate = val;
    else if (field.key === "toolUsed") parsed.toolUsed = val;
  }

  parsed.filesModified = extractListSection(text, [
    "fichiers modifiés",
    "fichiers modifies",
    "files modified",
  ]);
  if (parsed.filesModified.length === 0) {
    parsed.filesModified = detectFilesInText(text);
  }

  parsed.stepsCompleted = extractListSection(text, [
    "étapes réalisées",
    "etapes realisees",
    "steps completed",
    "étapes",
  ]);

  parsed.commandsRunManually = extractListSection(text, [
    "commandes lancées manuellement",
    "commandes lancees manuellement",
    "commands run",
  ]);
  if (parsed.commandsRunManually.length === 0) {
    parsed.commandsRunManually = detectCommandsInText(text);
  }

  parsed.testsRun = extractListSection(text, ["tests lancés", "tests lances", "tests run"]);
  const testSignals = detectTestSignals(text);
  if (parsed.testsRun.length === 0) parsed.testsRun = testSignals.testsRun;
  parsed.testResults = extractListSection(text, [
    "résultat des tests",
    "resultat des tests",
    "test results",
  ]);
  if (parsed.testResults.length === 0) parsed.testResults = testSignals.testResults;

  parsed.blockers = detectBlockers(text);
  parsed.fixesNeeded = extractListSection(text, [
    "corrections nécessaires",
    "corrections necessaires",
    "fixes needed",
  ]);
  if (parsed.fixesNeeded.length === 0 && /\bcorrection\b|\bfix needed\b|\bneeds fix\b/i.test(text)) {
    parsed.fixesNeeded.push("Correction mentionnée dans le rapport");
  }

  const commit = parseCommitInfo(text);
  parsed.commitPerformed = commit.performed;
  parsed.commitHash = commit.hash;

  parsed.finalSummary =
    extractScalar(text, [/rapport final\s*:\s*(.+)/i]) ??
    extractListSection(text, ["rapport final"])[0];

  parsed.nextStepRecommendation =
    extractScalar(text, [/prochaine [ée]tape[^\n:]*:\s*(.+)/i]) ??
    extractListSection(text, ["prochaine étape", "prochaine etape", "next step"])[0];

  if (!parsed.actionExecuted && parsed.finalSummary) {
    parsed.uncertainties.push("Action exécutée non identifiée explicitement");
  }
  if (/\babandon|\babandoned\b/i.test(text)) {
    parsed.uncertainties.push("Abandon mentionné dans le rapport");
  }

  return parsed;
}

export function inferReporterFromParsed(
  parsed: ParsedExecutionReport,
  rawReport: string
): ExecutionReportIntakeReporter {
  if (parsed.toolUsed) {
    const lower = parsed.toolUsed.toLowerCase();
    if (/cursor/.test(lower)) return "cursor";
    if (/humain|human/.test(lower)) return "human";
    if (/moi|self/.test(lower)) return "self";
    if (/g[ée]n[ée]rique|generic/.test(lower)) return "generic";
  }
  return detectReporterFromText(rawReport);
}
