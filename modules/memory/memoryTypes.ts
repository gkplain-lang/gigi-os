export type MemoryCategory =
  | "decision"
  | "mission"
  | "project"
  | "blocker"
  | "goal";

export interface MemoryEntry {
  id: string;
  category: MemoryCategory;
  content: string;
  createdAt: string;
}
