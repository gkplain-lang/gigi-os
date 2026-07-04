function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

const AUTOMATION_KEYWORDS = [
  "automatise",
  "automatiser",
  "automatiquement",
  "tous les jours",
  "tous les matins",
  "chaque matin",
  "chaque jour",
  "chaque semaine",
  "toutes les semaines",
  "hebdo",
  "rappelle moi",
  "rappelle-moi",
  "surveille",
  "surveillance",
  "quand ",
  "des que",
  "dès que",
  "declenche",
  "declencheur",
  "schedule",
  "cron",
  "check mes projets",
  "projets dormants",
  "prepare un agent",
  "preparer un agent",
  "prepare n8n",
  "preparer n8n",
  "agent n8n",
  "fais-le tous les jours",
];

const SIMPLE_ACTION_ONLY = [
  "update la bibliotheque",
  "mettre a jour la bibliotheque",
  "merge cette branche",
  "commit ",
  "sync supabase",
  "envoie ",
];

/** True when message implies repetition, schedule, trigger, or surveillance. */
export function isAutomationIntent(message: string): boolean {
  const norm = normalize(message);
  const hasAutomationKw = AUTOMATION_KEYWORDS.some((k) => norm.includes(normalize(k)));

  if (!hasAutomationKw) return false;

  const isSimpleOnly = SIMPLE_ACTION_ONLY.some(
    (k) => norm.includes(normalize(k)) && !hasScheduleOrRepeat(norm)
  );

  return !isSimpleOnly || hasScheduleOrRepeat(norm);
}

function hasScheduleOrRepeat(norm: string): boolean {
  return /tous les|chaque|hebdo|semaine|matin|surveille|quand|automatique|automatise/.test(norm);
}

export function supersedesActionProposal(message: string): boolean {
  return isAutomationIntent(message);
}
