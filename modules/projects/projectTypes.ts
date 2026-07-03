export type ProjectStatus = "active" | "paused" | "future" | "archived" | "completed";
export type ProjectPriority = "critical" | "high" | "medium" | "low";
export type ProjectHealth = "ready_to_launch" | "healthy" | "unclear" | "paused" | "blocked";

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  priority: ProjectPriority;
  nextAction: string;
  blocker?: string;
  businessPotential: number;
  strategicValue: number;
  urgency: number;
  estimatedEffort: number;
  clarity: number;
}
