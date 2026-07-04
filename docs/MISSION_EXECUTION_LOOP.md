# Gigi OS — Boucle d'exécution mission (V0.5.4)

Version: `0.5.4`  
Status: Exécution mission-first — localStorage principal  
Purpose: Transformer la mission choisie en boucle d'exécution claire.

---

## 1. Objectif V0.5.4

Après V0.5.3 (qualité décisionnelle), Gigi sait **choisir** une mission structurée.

V0.5.4 améliore la **boucle d'exécution** :

1. Démarrer une mission
2. Afficher les 3 tâches concrètes
3. Suivre l'état de la mission
4. Terminer une mission
5. Reporter une mission
6. Marquer « pas maintenant »
7. Enregistrer un historique lisible
8. Préparer la suite après exécution

Promesse inchangée : *« Ouvre Gigi. Sache quoi faire. Exécute. »*

---

## 2. Phases d'exécution

| Phase V0.5.4 | MissionStatus existant | Signification |
|--------------|------------------------|---------------|
| `proposed` | `recommended` | Mission recommandée, pas encore démarrée |
| `active` | `in_progress` | Mission en cours |
| `completed` | `completed` | Mission terminée |
| `postponed` | `postponed` | Reportée |
| `dismissed` | `rejected_for_now` | Pas maintenant |

Migration douce via `migrateExecutionState()` — les anciens statuts (`started`, `rejected`) sont normalisés.

---

## 3. Actions mission

| Action | Effet | Historique |
|--------|-------|------------|
| Appliquer (conversation) | Mission `proposed` + tâches | `decision_created` |
| Démarrer | `active` | `mission_started` |
| Terminer | `completed` + id dans `completedMissionIds` | `mission_completed` |
| Reporter | `postponed` | `mission_postponed` |
| Pas maintenant | `dismissed` | `mission_rejected` |
| Préparer la suite | Prochaine mission via cerveau local | `decision_created` |

Module : `modules/missionExecution/missionActions.ts`

---

## 4. Historique enrichi

Chaque événement d'exécution peut inclure `meta` :

```typescript
{
  missionId?: string;
  projectId?: string;
  projectName?: string;
  reason?: string;
  nextStep?: string;
}
```

Rétrocompatible — les événements existants sans `meta` restent valides.

---

## 5. executionHints (localStorage)

Clé principale inchangée : `gigi-os-v03-state`

Nouveau champ optionnel :

```typescript
executionHints?: {
  tasks?: string[];
  nextStep?: string | null;
  reason?: string | null;
  appliedAt?: string;
}
```

Rempli quand l'utilisateur **applique** une mission depuis `/conversation` (tâches + prochaine étape V0.5.3).

---

## 6. Intégration UI

| Surface | Changement |
|---------|------------|
| `/` (mission) | Tâches depuis `execution.tasks` |
| `/conversation` | Indication première tâche + mémorisation locale |
| `/history` | Affichage projet / nextStep si `meta` présent |
| `/dev/execution` | Diagnostic phase, événement, nextStep |

Pas de refonte design — enrichissements textuels uniquement.

---

## 7. Garde-fous

- Pas d'agent externe
- Pas de n8n / Gmail / Calendar / GitHub auto
- Pas de sync / restore automatique
- Fallback local intact (cerveau `askGigi`)
- Supabase reste manuel
- `OPENAI_API_KEY` serveur uniquement

---

## 8. Tests manuels

1. `/conversation` → demander une mission → Appliquer
2. `/` → vérifier 3 tâches → Démarrer → Terminer
3. `/history` → événements avec projet / suite
4. Reporter / Pas maintenant → états corrects
5. Mission terminée → non reproposée par Gigi
6. `/dev/execution` → diagnostic cohérent
7. Sans clé OpenAI → fallback local OK
8. `npm run build`
9. `.env.local` absent du git status

---

## 9. Fichiers clés

```
modules/missionExecution/
  types.ts
  executionState.ts
  executionEvents.ts
  missionActions.ts
  executionSummary.ts
  index.ts

components/providers/GigiProvider.tsx
app/dev/execution/
docs/MISSION_EXECUTION_LOOP.md
```

Voir aussi : `docs/MISSION_SYSTEM.md`, `docs/AI_DECISION_QUALITY.md`

---

## 10. Futur

| Version | Objectif |
|---------|----------|
| V0.6 | Agents contrôlés avec confirmation explicite |
