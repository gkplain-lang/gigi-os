import type {
  MissionOSBuildInput,
  MissionOSPhase,
  MissionOSViewModel,
  MissionOSTimelineItem,
} from "./types";
import {
  MISSION_OS_PHASE_LABELS,
  MISSION_OS_READINESS_LABELS,
  MISSION_OS_SAFETY_NOTE_V31,
} from "./types";
import { MISSION_OS_PHASE_ORDER, phaseIndex } from "./missionOSProgress";

const IMPACT_PRIORITY: Record<string, string> = {
  Élevé: "Priorité haute",
  Moyen: "Priorité moyenne",
  Faible: "Priorité basse",
};

function buildTimelineItems(currentPhase: MissionOSPhase): MissionOSTimelineItem[] {
  const currentIdx = phaseIndex(currentPhase);
  return MISSION_OS_PHASE_ORDER.map((phase, idx) => ({
    phase,
    label: MISSION_OS_PHASE_LABELS[phase],
    status: idx < currentIdx ? "done" : idx === currentIdx ? "current" : "upcoming",
  }));
}

function resolveSecondaryCta(
  primaryRoute: string
): { label: string; route: string } {
  if (primaryRoute.startsWith("/conversation")) {
    return { label: "Ouvrir les actions", route: "/actions" };
  }
  if (primaryRoute === "/actions") {
    return { label: "Demander à Gigi", route: "/conversation?ask=quelle%20est%20ma%20prochaine%20action" };
  }
  if (primaryRoute === "/" || primaryRoute.startsWith("/#")) {
    return { label: "Ouvrir les actions", route: "/actions" };
  }
  return {
    label: "Demander à Gigi",
    route: "/conversation?ask=quelle%20est%20ma%20prochaine%20action",
  };
}

export function enrichMissionOSCommandCenter(
  base: Omit<
    MissionOSViewModel,
    | "primaryReason"
    | "commandTitle"
    | "commandSubtitle"
    | "primaryCtaLabel"
    | "primaryCtaRoute"
    | "timelineItems"
    | "hasActiveCycle"
    | "safetyNote"
  >,
  input: MissionOSBuildInput
): MissionOSViewModel {
  const secondary = resolveSecondaryCta(base.nextActionRoute);
  const hasActiveCycle = Boolean(base.activeLifecycleId || base.activeActionId);
  const needsEmpty =
    !hasActiveCycle && base.readiness === "needs_user_decision";

  return {
    ...base,
    primaryReason: base.reasons[0] ?? "Gigi recommande de trancher une mission aujourd'hui.",
    confidenceLabel: input.missionConfidence
      ? `${input.missionConfidence}% confiance`
      : undefined,
    priorityLabel: input.missionImpact
      ? (IMPACT_PRIORITY[input.missionImpact] ?? input.missionImpact)
      : undefined,
    blockerLabel: base.risks[0] ?? (base.readiness === "unclear" ? "Statut à clarifier" : undefined),
    commandTitle: "Mission du jour",
    commandSubtitle: `${MISSION_OS_READINESS_LABELS[base.readiness]} · ${MISSION_OS_PHASE_LABELS[base.currentPhase]}`,
    primaryCtaLabel: base.nextActionLabel,
    primaryCtaRoute: base.nextActionRoute,
    secondaryCtaLabel: secondary.label,
    secondaryCtaRoute: secondary.route,
    timelineItems: buildTimelineItems(base.currentPhase),
    hasActiveCycle,
    activeActionTitle: base.activeActionId ? base.currentMissionTitle : undefined,
    nextMissionHint: base.currentPhase === "next_mission" ? "Choisis la suite sur la page Mission." : undefined,
    emptyStateTitle: needsEmpty ? "Aucune action en cours" : undefined,
    emptyStateDescription: needsEmpty
      ? "Décide ta mission du jour pour lancer la boucle — Gigi ne choisit rien à ta place."
      : undefined,
    safetyNote: MISSION_OS_SAFETY_NOTE_V31,
  };
}
