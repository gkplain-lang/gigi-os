# Gigi OS — Agents Foundation (V0.6.0)

Version: `0.6.0`  
Status: Dry-run only — aucune exécution externe  
Purpose: Fondations des agents contrôlés avec propositions d'action sécurisées.

---

## 1. Objectif V0.6.0

Après V0.5.4 (boucle d'exécution mission), Gigi sait **exécuter une mission localement**.

V0.6.0 introduit les **agents contrôlés** :

1. Détecter une intention d'action dans la conversation
2. Produire une **Action Proposal** structurée
3. Exécuter uniquement en **dry-run** (simulation locale)
4. Bloquer toute action externe réelle
5. Rappeler le niveau d'autonomie actif

Promesse V0.6 : *« Gigi peut préparer, jamais exécuter seul. »*

---

## 2. Niveaux d'autonomie

| Niveau | Signification | Statut V0.6 |
|--------|---------------|-------------|
| `level_0_manual_only` | Conseil uniquement | Disponible |
| `level_1_prepare_only` | Préparation sans effet réel | **Maximum actif** |
| `level_2_confirmed_action` | Action après confirmation | Réservé |
| `level_3_supervised_agent` | Agent supervisé | Réservé |
| `level_4_autonomous_agent` | Agent autonome | Réservé |

Module : `modules/agents/autonomyLevels.ts`

---

## 3. Action Proposal

Chaque proposition contient :

```text
id, title, description
projectId?, missionId?
actionType, riskLevel
autonomyLevelRequired
dryRunOnly, confirmationRequired
expectedOutcome
blockedReason? (si interdit)
createdAt
```

Module : `modules/agents/actionProposal.ts`

---

## 4. Actions dry-run autorisées

| Type | Description |
|------|-------------|
| `prepare_github_branch` | Plan de branche GitHub |
| `prepare_github_commit` | Plan de commit |
| `prepare_n8n_agent_plan` | Plan d'agent n8n (sans connexion) |
| `prepare_buildy_crafts_library_update` | Mise à jour bibliothèque Buildy Crafts |
| `prepare_supabase_backup_plan` | Plan backup manuel |
| `prepare_tomorrow_mission` | Mission de demain |
| `prepare_project_review` | Revue de projet |

---

## 5. Actions réelles interdites en V0.6

```text
send_email, modify_calendar, push_to_github, merge_branch
run_n8n_workflow, sync_supabase, restore_supabase
delete_data, publish_content, spend_money, call_external_api
```

Message utilisateur :

> Je peux préparer le plan, mais je ne peux pas l'exécuter automatiquement en V0.6.

Module : `modules/agents/actionSafety.ts`

---

## 6. Pipeline d'intégration

```
User message
  → askAiBrain()
  → applyDecisionQuality()   (V0.5.3 — inchangé)
  → applyAgentProposals()    (V0.6 — nouveau)
  → aiBrainToGigiResponse()
  → GigiAnswer (section dry-run optionnelle)
```

- Le contrat décisionnel mission reste prioritaire
- Les proposals sont **optionnelles** et **additive**
- Fallback local : détection par mots-clés, pas d'API externe

---

## 7. Garde-fous

- Pas de n8n branché
- Pas de Gmail, Calendar, GitHub API
- Pas de sync/restore Supabase automatique
- Pas d'appel API externe
- `executeActionDryRun()` simule uniquement des étapes locales
- OpenAI optionnel — fallback local fonctionne sans clé

---

## 8. UI & Dev

| Route | Rôle |
|-------|------|
| `/conversation` | Affiche proposals dry-run si détectées |
| `/dev/agents` | Diagnostic autonomie, actions autorisées/bloquées |

---

## 9. Tests manuels

1. « Gigi, update la bibliothèque Buildy Crafts » → proposal `prepare_buildy_crafts_library_update`
2. « merge cette branche » → proposal bloquée + message V0.6
3. « prépare un agent n8n » → plan dry-run, pas de connexion n8n
4. `/dev/agents` → niveau `level_1_prepare_only`, liste actions
5. `/conversation`, `/brain`, `/history`, `/dev/ai`, `/dev/execution` → OK
6. Fallback local sans OpenAI → OK
7. Aucune sync/restore automatique

---

## 10. Fichiers clés

```text
modules/agents/
  types.ts, autonomyLevels.ts, agentRegistry.ts
  actionRegistry.ts, actionProposal.ts, actionSafety.ts
  actionDryRun.ts, actionSummary.ts, index.ts

modules/ai/aiBrain.ts          — applyAgentProposals()
modules/ai/types.ts            — actionProposals?
components/conversation/GigiAnswer.tsx
app/dev/agents/
docs/AGENTS_FOUNDATION.md
```

---

## 11. Futur (V0.7+)

- Confirmation explicite (`level_2_confirmed_action`)
- Intégrations GitHub/n8n avec garde-fous
- Historique `action_proposed` / `action_confirmed`
