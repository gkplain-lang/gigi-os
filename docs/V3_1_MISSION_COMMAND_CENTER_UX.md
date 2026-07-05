# Gigi V3.1 — Mission Command Center UX

> **Version :** V3.1  
> **Prérequis :** V3.0.0 — [V3_CLOSED_LOOP_MISSION_OS.md](./V3_CLOSED_LOOP_MISSION_OS.md)

---

## Objectif V3.1

Renforcer le hub mission créé en V3.0 pour qu’un utilisateur comprenne en **5 secondes** :

- sa mission prioritaire
- pourquoi c’est celle-là
- où il en est dans le cycle
- l’action unique à faire maintenant
- où cliquer
- ce que Gigi ne fait pas automatiquement

---

## Différence V3.0 vs V3.1

| V3.0 | V3.1 |
|------|------|
| Bloc `ClosedLoopMissionOS` multi-panneaux | **Mission Command Center** dominant |
| Plusieurs CTA visibles | **Un CTA principal** + secondaire discret |
| MissionDecisionCenter toujours visible | Decision Center **repliable** |
| Bannière simple sur `/actions` | **Stepper flux d’action** 6 étapes |
| View model basique | View model enrichi (raison, confiance, timeline, CTA) |

Aucune nouvelle clé localStorage. Aucune persistence produit.

---

## Structure Mission Command Center

Composant principal : `components/missionOS/MissionCommandCenter.tsx`

| Bloc | Contenu |
|------|---------|
| Header | Mission dominante, priorité, confiance |
| Pourquoi | `primaryReason` |
| Étape actuelle | Phase, progression % |
| CTA dominant | `primaryCtaLabel` → `primaryCtaRoute` |
| Fil du cycle | Timeline 6 phases |
| Sécurité | « Gigi prépare et guide. Il n'exécute rien sans toi. » |
| Décision (repliable) | `MissionDecisionCenter` intégré |

Sous-composants : `MissionCommandCTA`, `MissionCommandTimeline`.

---

## View model enrichi

Module : `modules/missionOS/missionOSCommandCenter.ts`

Champs ajoutés à `MissionOSViewModel` :

- `primaryReason`, `confidenceLabel`, `priorityLabel`, `blockerLabel`
- `commandTitle`, `commandSubtitle`
- `primaryCtaLabel`, `primaryCtaRoute`
- `secondaryCtaLabel`, `secondaryCtaRoute`
- `timelineItems`, `hasActiveCycle`
- `emptyStateTitle`, `emptyStateDescription`

Lecture seule — agrégation depuis modules V2.x existants.

---

## Stepper `/actions`

Composant : `MissionOSActionFlowStepper.tsx`  
Module : `missionOSActionFlow.ts`

Étapes : Décision → Validation → Préparation → Passation → Rapport → Cycle

Affiche l’étape active, l’action prioritaire et le bouton suivant. Les cartes V2.x restent intactes.

---

## Labels UI simplifiés

- Mission du jour
- Action à faire maintenant
- Pourquoi cette action
- Étape actuelle
- Passation Cursor / humain
- Rapport d'exécution
- Cycle complet
- Espace d'action sécurisé

Pas de numéros V2.x dans l’UI principale.

---

## Conversation

Intent `mission_os` enrichi — mots-clés : « je fais quoi », « résume mon cycle », « prochaine action », etc.

Format réponse :

- Mission
- Étape actuelle
- Action maintenant
- Pourquoi
- Route
- Sécurité

---

## Limites de sécurité

Identiques à V3.0 :

- Pas d’exécution, pas d’appel externe, pas d’auto-validate
- Pas de sync cloud
- Pas de nouvelle clé localStorage

---

## Critères d’acceptation V3.1

- [x] `/` affiche mission dominante + CTA unique + timeline + sécurité
- [x] Decision Center repliable, non supprimé
- [x] `/actions` affiche stepper flux + cartes conservées
- [x] Conversation `mission_os` format simple
- [x] Build OK, lint missionOS OK

---

## Recommandation V3.2 — Action Flow Simplification

- Progressive disclosure sur `QueuedActionCard`
- Vues par état (À valider / En cours / Retour)
- Action active dominante — une seule carte expanded
- Intake et cycle plus guidés

---

## Références

- [V3_CLOSED_LOOP_MISSION_OS.md](./V3_CLOSED_LOOP_MISSION_OS.md)
- [ROADMAP.md](./ROADMAP.md)
