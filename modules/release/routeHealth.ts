import type { RouteHealthEntry } from "./types";

export function getCriticalRouteHealth(): RouteHealthEntry[] {
  return [
    { path: "/", label: "Mission du jour", role: "user", available: true },
    { path: "/conversation", label: "Conversation Gigi", role: "user", available: true },
    { path: "/brain", label: "Décision", role: "user", available: true },
    { path: "/projects", label: "Projets", role: "user", available: true },
    { path: "/history", label: "Historique", role: "user", available: true },
    { path: "/memory", label: "Mémoire", role: "user", available: true },
    { path: "/feedback", label: "Feedback", role: "user", available: true },
    { path: "/dev/ai", label: "Dev · AI", role: "dev", available: true },
    { path: "/dev/execution", label: "Dev · Execution", role: "dev", available: true },
    { path: "/dev/agents", label: "Dev · Agents", role: "dev", available: true },
    { path: "/dev/daily-review", label: "Dev · Daily Review", role: "dev", available: true },
    { path: "/dev/automation", label: "Dev · Automation", role: "dev", available: true },
    { path: "/dev/integrations", label: "Dev · Integrations", role: "dev", available: true },
    { path: "/dev/beta", label: "Dev · Beta", role: "dev", available: true },
    { path: "/dev/release", label: "Dev · Release V1.0", role: "dev", available: true },
  ];
}
