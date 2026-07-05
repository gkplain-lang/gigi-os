# Gigi V3.0 — Closed Loop Mission OS

> **Version :** V3.0  
> **Statut :** Implémentée (couche UX mission-first)  
> **Prérequis :** V2.12.0 — [V3_READINESS_AUDIT.md](./V3_READINESS_AUDIT.md)

---

## Objectif V3.0

Transformer la boucle fermée V2.x en une **expérience centrale simple** :

```text
Mission → Préparation → Exécution manuelle → Retour → Apprentissage → Suite
```

L'utilisateur n'a plus besoin de connaître V2.7 bridge, V2.8 workspace, V2.9 handoff, V2.10 intake ou V2.11 lifecycle — il voit **une mission, une étape, une prochaine action**.

---

## Différence V2.x vs V3.0

| V2.x | V3.0 |
|------|------|
| Modules empilés sur `/actions` | Hub `ClosedLoopMissionOS` sur `/` |
| Labels techniques (Bridge V2.7, etc.) | Langage produit FR |
| 6 panneaux à découvrir | Prochaine action unique + CTA |
| Cycle lifecycle en panel avancé | Phases UX : Mission · Préparation · Exécution · Retour · Apprentissage · Suite |
| Données dans 19 clés localStorage | **Même clés** — lecture/agrégation uniquement |

V3.0 **ne remplace pas** les modules V2.x. Elle **orchestrre** leur lecture via `modules/missionOS/`.

---

## Promesse V3

```text
Ouvre Gigi.
Il te dit quoi faire aujourd'hui.
Il prépare la suite.
Tu exécutes manuellement.
Tu colles le rapport.
Gigi comprend le résultat.
Il recommande la prochaine mission.
```

Tagline : **« Une action. Aucun bruit. »**

---

## Phases UX

| Phase | Label UI | Modules V2 derrière |
|-------|----------|---------------------|
| Mission | Choisir / valider la mission | missionDecision, missionFeedback |
| Préparation | Valider, plan, workspace | actionQueue, executionPlans, safeActionWorkspace, missionPlanBridge |
| Exécution manuelle | Passation Cursor / humain | manualExecutionHandoff |
| Retour | Rapport d'exécution | executionReportIntake, executionLogs |
| Apprentissage | Review, follow-up, historique | executionReviews, followUpActions, historyLearning |
| Suite | Prochaine mission | missionDecision, closedLoopLifecycle |

---

## Architecture V3.0

### Module léger `modules/missionOS/`

- `types.ts` — phases, readiness, view model
- `missionOSViewModel.ts` — agrégation depuis stores V2.x (preview lifecycle sans persist)
- `missionOSProgress.ts` — % progression cycle
- `missionOSNextStep.ts` — mapping next step → CTA
- `missionOSFormatter.ts` — textes copyables
- `missionOSConversation.ts` — intent « pilotage mission »

**Aucune nouvelle clé localStorage.** État UI recalculé à la lecture.

### Composants `components/missionOS/`

- `ClosedLoopMissionOS.tsx` — bloc principal
- `MissionOSHero`, `MissionOSCurrentStep`, `MissionOSNextAction`, `MissionOSProgress`
- `MissionOSCyclePreview`, `MissionOSLearningPreview`, `MissionOSSafetyNote`
- `MissionOSActionsBanner` — vue V3 sur `/actions`

---

## Intégrations

| Route | Intégration |
|-------|-------------|
| `/` | `ClosedLoopMissionOS` full — mission du jour + cycle |
| `/actions` | `MissionOSActionsBanner` + labels simplifiés |
| `/history` | `ClosedLoopMissionOS` compact + hint suite |
| `/projects/[id]` | `ClosedLoopMissionOS` compact + hint plan → file |
| `/conversation` | Intent `mission_os` — « qu'est-ce que je fais maintenant ? » |

---

## Limites de sécurité (inchangées)

Gigi V3.0 **ne fait pas** :

- exécuter de commande
- vérifier Git / GitHub / repo
- appeler Supabase, n8n ou API externe
- auto-approuver, auto-compléter, auto-fermer un cycle
- sync / restore cloud
- créer de paiement ou landing

Toute action reste **clic utilisateur explicite**.

---

## Parcours utilisateur cible

1. Ouvrir `/` → voir mission + étape + CTA
2. Suivre le CTA vers `/actions` ou `/projects`
3. Valider → workspace → passation → coller rapport
4. `/history` pour archiver et feedback
5. Retour `/` pour la suite

---

## Critères d'acceptation V3.0

- [x] Hub mission sur `/` avec prochaine action unique
- [x] Vue V3 sur `/actions`
- [x] Hints sur `/history` et `/projects/[id]`
- [x] Intent conversation `mission_os`
- [x] Labels UX simplifiés (plus de « Bridge V2.7 » visible)
- [x] Aucune nouvelle clé localStorage
- [x] Modules V2.x préservés
- [x] `npm run build` OK

---

## Non simplifié en V3.0 (volontairement)

- Cartes `QueuedActionCard` complètes (panneaux V2.x toujours accessibles)
- Filtres `/actions` avancés (filtre par statut inchangé)
- Routes dev `/dev/*`
- Lint global providers (dette V2.12)

---

## Prochaines étapes

### V3.1 — Mission Command Center UX (planned)

- Centre mission encore plus épuré
- CTA unique dominant
- Moins de bruit visuel (Decision Center + MissionOS fusion progressive)

### V3.2 — Action stepper (planned)

- Onglets Détails | Préparation | Passation | Rapport | Cycle sur `/actions`

### V3.3 — Onboarding cycle (planned)

- Premier parcours boucle guidée

### V3.4 — Polish lint providers (planned)

- Hydration patterns sans dette React Compiler

---

## Références

- [V3_SCOPE.md](./V3_SCOPE.md)
- [V3_READINESS_AUDIT.md](./V3_READINESS_AUDIT.md)
- [CLOSED_LOOP_ACTION_LIFECYCLE.md](./CLOSED_LOOP_ACTION_LIFECYCLE.md)
