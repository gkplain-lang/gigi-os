import {
  getActiveDailyPriorityMission,
  listActiveMissionCandidates,
  listProjectMissionCandidates,
} from "./missionComposerBuilder";
import type { MissionComposerGlobalSummary } from "./missionComposerTypes";

export function generateMissionComposerSummary(): MissionComposerGlobalSummary {
  const all = listProjectMissionCandidates();
  const active = listActiveMissionCandidates();
  const daily = getActiveDailyPriorityMission();
  const convertedCount = all.filter(
    (c) => c.status === "converted_to_guided_flow"
  ).length;

  const hasDailyMission = Boolean(daily);
  let summaryText: string;

  if (daily) {
    summaryText = `Mission du jour : « ${daily.title} » (${daily.projectName}) — ${
      daily.status === "converted_to_guided_flow"
        ? "parcours guidé créé"
        : "en attente de conversion ou avancement"
    }.`;
  } else if (active.length > 0) {
    summaryText = `${active.length} mission(s) candidate(s) — choisis une mission prioritaire pour réduire la dispersion.`;
  } else {
    summaryText =
      "Aucune mission du jour — compose une mission depuis un projet pour avancer avec focus.";
  }

  return {
    totalCandidates: all.length,
    activeCandidates: active.length,
    hasDailyMission,
    dailyMissionTitle: daily?.title,
    convertedCount,
    summaryText,
  };
}
