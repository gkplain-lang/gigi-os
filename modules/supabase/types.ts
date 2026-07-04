/**
 * V0.4.1 — Supabase row types.
 * Aligned with docs/SUPABASE_PLAN.md and supabase/schema.sql.
 *
 * These types describe the future persistent schema. The app does NOT use them
 * yet — it still relies on localStorage (`gigi-os-v03-state`) until V0.4.2/V0.4.3.
 */

export type MissionStatusRow =
  | "recommended"
  | "available"
  | "in_progress"
  | "completed"
  | "postponed"
  | "rejected_for_now"
  | "archived";

export type ProjectStatusRow = "active" | "paused" | "completed" | "future" | "archived";

export type HistoryEventTypeRow =
  | "mission_recommended"
  | "mission_applied"
  | "mission_started"
  | "mission_completed"
  | "mission_postponed"
  | "mission_rejected"
  | "project_created"
  | "project_updated"
  | "decision_made"
  | "conversation_started"
  | "local_data_imported"
  | "autonomy_action_requested"
  | "autonomy_action_completed";

export type AutonomyActionType = "internal" | "preparation" | "external" | "sensitive";
export type ConfirmationStatus = "auto" | "confirmed" | "rejected";
export type AutonomyResult = "success" | "failure" | "cancelled" | "pending";

export interface Profile {
  id: string;
  email: string | null;
  display_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectRow {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  status: ProjectStatusRow;
  priority: string | null;
  strategic_value: number | null;
  business_impact: number | null;
  completion_proximity: number | null;
  urgency: number | null;
  clarity: number | null;
  effort_efficiency: number | null;
  risk_of_delay: number | null;
  created_at: string;
  updated_at: string;
}

export interface MissionRow {
  id: string;
  user_id: string;
  project_id: string | null;
  title: string;
  reason: string | null;
  status: MissionStatusRow;
  score: number | null;
  estimated_time: string | null;
  impact: number | null;
  clarity: number | null;
  effort: number | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

export interface HistoryEventRow {
  id: string;
  user_id: string;
  project_id: string | null;
  mission_id: string | null;
  type: HistoryEventTypeRow;
  title: string;
  description: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface ConversationMessageRow {
  id: string;
  user_id: string;
  role: "user" | "gigi";
  content: string;
  detected_intent: string | null;
  recommended_mission_id: string | null;
  created_at: string;
}

export interface DecisionLogRow {
  id: string;
  user_id: string;
  selected_project_id: string | null;
  selected_mission_id: string | null;
  score_breakdown: Record<string, unknown> | null;
  why_selected: string | null;
  why_not_others: Record<string, unknown> | null;
  created_at: string;
}

export interface AutonomyLogRow {
  id: string;
  user_id: string;
  action_type: AutonomyActionType;
  project_id: string | null;
  mission_id: string | null;
  autonomy_level: number;
  confirmation_required: boolean;
  confirmation_status: ConfirmationStatus;
  result: AutonomyResult;
  created_at: string;
}

export interface UserSettingsRow {
  id: string;
  user_id: string;
  preferred_language: string | null;
  autonomy_level: number;
  daily_brief_time: string | null;
  focus_mode: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Minimal Database shape for the typed Supabase client.
 * Kept intentionally light for V0.4.1 (Row types only).
 */
export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Partial<Profile>; Update: Partial<Profile> };
      projects: { Row: ProjectRow; Insert: Partial<ProjectRow>; Update: Partial<ProjectRow> };
      missions: { Row: MissionRow; Insert: Partial<MissionRow>; Update: Partial<MissionRow> };
      history_events: {
        Row: HistoryEventRow;
        Insert: Partial<HistoryEventRow>;
        Update: Partial<HistoryEventRow>;
      };
      conversation_messages: {
        Row: ConversationMessageRow;
        Insert: Partial<ConversationMessageRow>;
        Update: Partial<ConversationMessageRow>;
      };
      decision_logs: {
        Row: DecisionLogRow;
        Insert: Partial<DecisionLogRow>;
        Update: Partial<DecisionLogRow>;
      };
      autonomy_logs: {
        Row: AutonomyLogRow;
        Insert: Partial<AutonomyLogRow>;
        Update: Partial<AutonomyLogRow>;
      };
      user_settings: {
        Row: UserSettingsRow;
        Insert: Partial<UserSettingsRow>;
        Update: Partial<UserSettingsRow>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
