import { PROJECT_NAMES } from "../conversation/missionCatalog";
import type { NotNowItem } from "../conversation/conversationTypes";

const NOT_NOW_ORDER = [
  "buildy-clear",
  "buildy-crafts",
  "linko",
  "1millimetre",
  "le-dernier-souvenir",
  "gigi-os",
];

const NOT_NOW_BASE: Record<string, string> = {
  "buildy-clear": "important pour le revenu",
  "buildy-crafts": "stratégique long terme",
  linko: "en pause",
  "1millimetre": "expérimental",
  "le-dernier-souvenir": "idée future",
  "gigi-os": "infrastructure",
};

export function buildNotNow(selectedProjectId: string): NotNowItem[] {
  return NOT_NOW_ORDER.filter((id) => id !== selectedProjectId).map((id) => ({
    projectName: PROJECT_NAMES[id],
    reason: NOT_NOW_BASE[id],
  }));
}
