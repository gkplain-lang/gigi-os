import type { IntegrationId } from "./types";

export const AVAILABLE_INTEGRATIONS: IntegrationId[] = ["github"];

export const INTEGRATION_LABELS: Record<IntegrationId, string> = {
  github: "GitHub",
};
