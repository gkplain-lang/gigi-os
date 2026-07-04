# Gigi OS — V0.7 Automation Preparation

> Préparer l’architecture des automatisations contrôlées — **dry-run uniquement**.

Version: `0.7.0`  
Status: Implemented (dry-run)  
Branch: `v0.7-automation-preparation`

---

## 1. Objectif V0.7

Gigi OS doit pouvoir :

- reconnaître une demande d’automatisation ;
- préparer un plan d’automatisation ;
- expliquer ce qui serait automatisé ;
- expliquer les risques ;
- indiquer les permissions nécessaires ;
- générer une **Automation Proposal** dry-run ;
- demander confirmation ;
- enregistrer localement une intention si l’utilisateur confirme en dry-run ;
- **ne jamais exécuter automatiquement**.

V0.7 ne branche **pas** n8n, ne lance **pas** d’agent réel, n’appelle **aucune** API externe (Gmail, Calendar, GitHub, Supabase sync/restore, etc.).

---

## 2. Action vs automatisation

| | Action Proposal (V0.6) | Automation Proposal (V0.7) |
|---|---|---|
| **Nature** | Action ponctuelle | Répétition, calendrier, déclencheur, surveillance |
| **Exemples** | « Mets à jour la bibliothèque » | « Automatise la revue du jour tous les matins » |
| **Exécution V0.7** | Dry-run uniquement | Dry-run uniquement |
| **UI** | `ActionProposalCard` | `AutomationProposalCard` |

Si une demande implique répétition, calendrier, déclencheur ou surveillance, Gigi produit une **Automation Proposal** et remplace les Action Proposals simples.

---

## 3. Module `modules/automation/`

```text
types.ts                 — AutomationProposal, types dry-run / interdits
automationRegistry.ts    — 10 automatisations dry-run + 11 interdites
automationIntent.ts      — détection intention (mots-clés)
automationPlan.ts        — étapes, déclencheur, résultat attendu
automationPermissions.ts — permissions par type
automationSafety.ts      — garde-fous V0.7
automationDryRun.ts      — simulation locale
automationProposal.ts    — détection + pipeline applyAutomationProposals
automationSummary.ts     — résumé dev
index.ts                 — exports publics
```

Pipeline IA (`askAiBrain`) :

```text
applyDecisionQuality → applyAgentProposals → applyAutomationProposals → applyDailyReviewEnrichment
```

---

## 4. Automatisations dry-run (plan uniquement)

- `daily_review_reminder`
- `weekly_project_review`
- `buildy_crafts_library_update_plan`
- `buildy_clear_launch_checklist`
- `gigi_os_git_branch_plan`
- `n8n_agent_plan`
- `content_publication_plan`
- `supabase_backup_plan`
- `project_stale_check`
- `tomorrow_mission_preparation`

---

## 5. Automatisations interdites en exécution réelle

Ces types produisent un **plan dry-run** avec statut `blocked` :

- `send_email`
- `publish_video`
- `push_to_github`
- `merge_branch`
- `run_n8n_workflow`
- `sync_supabase`
- `restore_supabase`
- `delete_data`
- `spend_money`
- `call_external_api`
- `modify_calendar`

Message utilisateur : *« Je peux préparer le plan d'automatisation, mais je ne peux pas l'exécuter automatiquement en V0.7. »*

---

## 6. Automation Proposal

Champs principaux :

- `id`, `title`, `description`, `automationType`
- `projectId?`, `missionId?`
- `triggerType`, `triggerDescription`
- `requiredPermissions`, `riskLevel`
- `dryRunOnly: true`, `confirmationRequired: true`
- `expectedOutcome`, `steps`, `blockedActions`
- `createdAt`, `confirmationStatus?`, `blockedReason?`

---

## 7. Détection d’intention

Mots-clés déclencheurs (extrait) :

- « automatise », « tous les matins », « chaque semaine »
- « rappelle-moi », « surveille », « quand X arrive »
- « prépare un agent n8n », « publie automatiquement »
- « check mes projets tous les matins »

Fonctions : `isAutomationIntent()`, `detectAutomationProposals()`, `applyAutomationProposals()`.

---

## 8. Confirmation obligatoire

Dans `/conversation`, `AutomationProposalCard` propose :

- **Préparer en dry-run** — simulation locale (`confirmAutomationDryRunLocally`)
- **Voir les risques** — étapes + actions bloquées
- **Annuler** — statut local `cancelled`

Aucun webhook, cron, n8n ou appel API.

---

## 9. Pourquoi n8n n’est pas branché

V0.7 prépare le **format**, les **permissions**, les **risques** et l’**UX de confirmation** avant toute intégration. Brancher n8n maintenant créerait un risque d’exécution non contrôlée. La connexion n8n est prévue pour V0.8+.

---

## 10. Pages dev

- `/dev/automation` — statut V0.7, listes dry-run / interdites, exemple de proposal
- Liens depuis `/dev/agents`, `/dev/ai`, `/dev/daily-review`

---

## 11. Tests manuels

1. `npm run build` — doit passer sans erreur.
2. `/conversation` — demander : *« Gigi, automatise la revue du jour tous les matins »* → Automation Proposal dry-run.
3. *« prépare un agent n8n pour update Buildy Crafts »* → plan `n8n_agent_plan`, n8n non branché.
4. *« publie automatiquement mes vidéos »* → plan bloqué + message V0.7.
5. *« surveille mes projets dormants chaque semaine »* → `project_stale_check` dry-run.
6. Vérifier fallback local sans `OPENAI_API_KEY`.
7. Vérifier que `.env.local` n’est pas dans git.
8. Vérifier qu’aucune variable `NEXT_PUBLIC_*` IA n’existe.

---

## 12. Contraintes permanentes

- `localStorage` reste la source principale (`gigi-os-v03-state`).
- Pas de modification de `.env.local`.
- Pas de clé IA côté client.
- Toute automatisation reste dry-run en V0.7.
