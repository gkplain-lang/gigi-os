export type MissionImpact = "Élevé" | "Moyen" | "Faible";
export type MissionStatus =
  | "recommended"
  | "in_progress"
  | "completed"
  | "postponed"
  | "rejected_for_now";

export interface Mission {
  id: string;
  title: string;
  projectId: string;
  projectName: string;
  reason: string;
  estimatedDuration: string;
  expectedImpact: MissionImpact;
  confidence: number;
  status: MissionStatus;
  steps?: string[];
}
