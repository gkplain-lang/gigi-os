import type { Mission } from "@/modules/missions/missionTypes";

export const mockMissions: Mission[] = [
  {
    id: "mission-buildy-clear-sales",
    title: "Finaliser la page de vente Buildy Clear.",
    projectId: "buildy-clear",
    projectName: "Buildy Clear",
    reason:
      "C'est ce qui te rapproche le plus du revenu. Buildy Clear est presque prêt — une page claire te sépare encore du lancement.",
    estimatedDuration: "~45 min",
    expectedImpact: "Élevé",
    confidence: 87,
    status: "recommended",
    steps: [
      "Ouvrir l'éditeur de la page de vente",
      "Réécrire le titre principal",
      "Affiner l'appel à l'action",
      "Relire la page entière",
    ],
  },
];
