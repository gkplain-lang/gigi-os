# Gigi OS — Daily Review System (V0.6.1)

Version: `0.6.1`  
Status: Read-only — localStorage first  
Purpose: Revue quotidienne dérivée de l'état local, sans action externe.

---

## 1. Objectif V0.6.1

Après V0.6 (agents foundation dry-run), Gigi peut **analyser** l'état local pour produire une revue du jour :

1. Ce qui a été fait récemment
2. Mission active ou proposée
3. Missions reportées / ignorées
4. Projets qui stagnent
5. Blocages possibles
6. Meilleure mission du jour
7. Suite à préparer

Promesse : *« Ouvre Gigi le matin. Sache où tu en es. Choisis une mission. »*

---

## 2. DailyReviewSnapshot

Module : `modules/dailyReview/reviewBuilder.ts`

| Champ | Description |
|-------|-------------|
| `date` | Date ISO du jour |
| `currentMission` | Mission courante + phase |
| `activeMission` | Mission en cours si phase `active` |
| `completedMissionsRecent` | Terminées récemment |
| `postponedMissionsRecent` | Reportées |
| `dismissedMissionsRecent` | « Pas maintenant » |
| `recentHistoryEvents` | Événements today/yesterday |
| `staleProjects` | Projets sans activité récente |
| `possibleBlockers` | Blocages détectés |
| `suggestedFocus` | Focus recommandé |
| `ignoredToday` | Projets à ignorer aujourd'hui |
| `nextStep` | Prochaine étape |
| `confidenceScore` | Score 0–1 |
| `shortSummary` | Bilan court pour la conversation |

---

## 3. Signaux analysés

| Signal | Source |
|--------|--------|
| Mission terminée récemment | `history` type `mission_completed` |
| Mission active | `buildExecutionSnapshot()` phase `active` |
| Mission reportée | `postponedMissionIds` + historique |
| Projet sans activité | `detectStaleProjects()` |
| Dispersion projets | Compte de `projectId` distincts dans l'historique récent |
| Pas de completion récente | Absence d'événements `mission_completed` |
| Terminée sans nextStep | Dernier event sans `meta.nextStep` |

---

## 4. Projets stale

Un projet est **stale** s'il existe dans les projets mais n'a pas d'événement récent associé.

Détection robuste :
- `meta.projectId` si présent
- Sinon correspondance par nom de projet dans le titre de l'événement
- Les anciens événements sans meta ne cassent pas le builder

---

## 5. Blocages possibles

Types : `postponed_mission`, `dismissed_mission`, `no_active_mission`, `no_recent_completion`, `completed_without_next_step`, `project_switching`, `stale_project`.

Module : `modules/dailyReview/blockers.ts`

---

## 6. Intégration conversation

Pipeline :

```
User message (bilan / review / quoi faire aujourd'hui)
  → askAiBrain()
  → applyDecisionQuality()   (V0.5.3 — contrat mission inchangé)
  → applyAgentProposals()    (V0.6 — dry-run inchangé)
  → applyDailyReviewEnrichment()  (V0.6.1 — nouveau)
  → GigiAnswer (bilan + mission + tâches)
```

Phrases déclencheuses :
- « Gigi, fais ma revue du jour »
- « qu'est-ce que je dois faire aujourd'hui ? »
- « où j'en suis ? »
- « bilan », « review »

Intent local : `daily_review` dans `conversationBrain.ts`

---

## 7. Garde-fous

- **Read-only** : `buildDailyReviewSnapshot()` ne modifie jamais l'état
- Pas de sync Supabase
- Pas de restore
- Pas de n8n, agent réel, Gmail, Calendar, GitHub API
- Fallback local sans OpenAI
- Contrat décisionnel V0.5.3 préservé (mission + 3 tâches + ignore + risque + nextStep)
- Boucle exécution V0.5.4 inchangée
- Action Proposals V0.6 inchangées

---

## 8. UI & Dev

| Route | Rôle |
|-------|------|
| `/conversation` | Bilan + mission recommandée |
| `/dev/daily-review` | Diagnostic snapshot complet |

---

## 9. Tests manuels

1. « Gigi, fais ma revue du jour » → bilan structuré + mission
2. « qu'est-ce que je dois faire aujourd'hui ? » → mission-first + bilan
3. Mission terminée → non reproposée (`completedMissionIds`)
4. `/dev/daily-review` → snapshot, stale, blocages
5. Historique sans meta → pas de crash
6. Routes existantes OK (`/brain`, `/history`, `/dev/*`)
7. Fallback local sans clé OpenAI

---

## 10. Fichiers clés

```text
modules/dailyReview/
  types.ts, reviewWindow.ts, reviewSignals.ts
  staleProjects.ts, blockers.ts, reviewBuilder.ts
  reviewSummary.ts, reviewNotNow.ts, index.ts

modules/ai/aiBrain.ts — applyDailyReviewEnrichment()
components/conversation/GigiAnswer.tsx
app/dev/daily-review/
docs/DAILY_REVIEW_SYSTEM.md
```
