import { mockMissions } from "@/data/mockMissions";

export function selectMission() {
  return mockMissions.find((m) => m.status === "recommended") ?? mockMissions[0];
}
