# Gigi OS — V0.8 Integrations Alpha

> Première couche d'intégrations externes contrôlées — **GitHub en dry-run uniquement**.

Version: `0.8.0`  
Status: Implemented (dry-run)  
Branch: `v0.8-integrations-alpha`

---

## 1. Objectif V0.8

Préparer la première intégration externe (GitHub) sans exécution réelle par défaut :

- reconnaître les demandes GitHub ;
- produire des **Integration Proposals** dry-run ;
- compléter Action Proposals (ponctuel) ou Automation Proposals (récurrent) ;
- expliquer permissions, risques et actions bloquées ;
- demander confirmation ;
- **ne jamais appeler l'API GitHub** ;
- **ne jamais exécuter git** (commit, push, merge).

V0.8 ne branche **pas** n8n, Gmail, Calendar, ni sync/restore Supabase automatique.

---

## 2. Pourquoi GitHub en premier

- Mesurer l'avancement projet (commits, PR, issues) ;
- Enrichir l'historique Gigi OS ;
- Préparer les workflows Cursor / dev plus tard ;
- Intégration à faible risque si limitée au dry-run.

---

## 3. Statuts d'intégration

| Statut | Description |
|--------|-------------|
| `not_configured` | Aucune connexion |
| `dry_run_only` | **GitHub V0.8 — défaut** |
| `ready_for_confirmation` | Plan prêt, exécution future possible |
| `disabled` | Intégration désactivée |
| `blocked` | Action réelle interdite |

---

## 4. Module `modules/integrations/`

```text
types.ts                  — IntegrationProposal, statuts
integrationRegistry.ts    — intégrations disponibles
integrationStatus.ts      — statut par intégration
integrationSafety.ts      — garde-fous V0.8
integrationDryRun.ts      — simulation locale
integrationPermissions.ts — permissions
integrationProposal.ts    — détection + applyIntegrationProposals
integrationSummary.ts     — résumé dev
github/                   — sous-module GitHub alpha
```

Pipeline IA :

```text
applyDecisionQuality → applyAgentProposals → applyAutomationProposals → applyIntegrationProposals → applyDailyReviewEnrichment
```

---

## 5. Actions GitHub dry-run (plan uniquement)

- `prepare_branch_plan`
- `prepare_commit_plan`
- `prepare_pull_request_plan`
- `prepare_merge_plan`
- `prepare_issue_plan`
- `prepare_release_note_plan`

Aucune n'appelle l'API GitHub. Aucune n'exécute git.

---

## 6. Actions interdites en réel V0.8

- `create_branch_real`, `commit_real`, `push_real`
- `create_pr_real`, `merge_real`, `delete_branch_real`
- `modify_repo_settings`, `access_secrets`
- `read_private_repo_without_confirmation`

Message : *« Je peux préparer le plan GitHub, mais je ne peux pas l'exécuter automatiquement en V0.8. »*

---

## 7. Action vs Automation vs Integration

| Demande | Résultat |
|---------|----------|
| Ponctuelle (« commit ça ») | Action Proposal + Integration Proposal GitHub |
| Récurrente (« review GitHub chaque semaine ») | Automation Proposal + Integration Proposal |
| Merge / push réel | Bloqué + plan dry-run |

---

## 8. UI conversation

`IntegrationProposalCard` affiche :

- intégration, statut, action proposée ;
- permissions, risque, résultat attendu ;
- ce qui serait fait / ne sera pas fait ;
- boutons locaux : Préparer dry-run, Voir détails, Annuler.

---

## 9. Page dev

`/dev/integrations` — statut global, GitHub dry-run / bloqué, exemple de plan.

Liens depuis `/dev/agents`, `/dev/automation`, `/dev/ai`.

---

## 10. Permissions futures (V0.9+)

- `github_read_commits`, `github_read_issues`
- `github_create_pr` (avec confirmation)
- Token OAuth stocké côté serveur uniquement — **pas en V0.8**

---

## 11. Tests manuels

1. `npm run build` — OK
2. « Gigi, prépare une branche GitHub pour V0.8 » → plan branche dry-run
3. « commit ça » → plan commit, pas de git réel
4. « merge dans main » → bloqué + plan merge
5. « ouvre une PR » → plan PR, pas d'API
6. « automatise une review GitHub chaque semaine » → Automation + Integration dry-run
7. Fallback local sans OpenAI
8. `.env.local` absent du git
9. Aucune variable `NEXT_PUBLIC_*` IA

---

## 12. Contraintes permanentes

- localStorage source principale ;
- pas de modification `.env.local` ;
- intégration réelle désactivée par défaut ;
- dry-run sauf mode dev explicite (non activé en V0.8).
