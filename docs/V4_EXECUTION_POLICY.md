# Gigi — Execution Policy (V4)

> Règles de sécurité pour l'exécution contrôlée. V4.0 = simulation et permissions uniquement.

---

## 1. Principes

1. **Local-first** — état permission dans `gigi-os-v40-execution-readiness`.
2. **Dry-run par défaut** — toute capacité sensible passe par simulation.
3. **Approbation humaine** — « Approuver dry-run » n'exécute rien.
4. **Aucune autorisation permanente** — chaque demande est révocable.
5. **Audit trail** — chaque création et décision est tracée localement.

---

## 2. Capabilities

| Capability | V4.0 mode | Exécution réelle |
|------------|-----------|------------------|
| `documentation_only` | dry_run | N/A (local) |
| `local_only` | dry_run | N/A (local) |
| `file_read` | approval_required | **Bloquée** |
| `file_write` | approval_required | **Bloquée** |
| `shell_command` | approval_required | **Bloquée** |
| `git_operation` | approval_required | **Bloquée** |
| `github_operation` | approval_required | **Bloquée** |
| `n8n_workflow` | approval_required | **Bloquée** |
| `browser_action` | approval_required | **Bloquée** |
| `email_draft` | approval_required | **Brouillon local seulement** |
| `calendar_draft` | approval_required | **Brouillon local seulement** |
| `external_api` | approval_required | **Bloquée** |

---

## 3. Risk levels

| Level | Signification |
|-------|---------------|
| `low` | Documentation / local uniquement |
| `medium` | Périmètre à confirmer |
| `high` | Rollback + preuves requis |
| `critical` | Simulation seule en V4.0 |
| `blocked` | Non exécutable même avec approbation |

---

## 4. Permission statuses

| Status | Description |
|--------|-------------|
| `draft` | Brouillon local |
| `needs_review` | Capacité sensible détectée |
| `awaiting_user_approval` | Contexte demandé |
| `approved_for_dry_run` | Simulation autorisée — **pas d'exécution** |
| `rejected` | Refusée |
| `simulated_only` | Marquée simulation V4.0 |
| `blocked` | Policy bloque |
| `archived` | Archivée |

---

## 5. Actions interdites (V4.0)

- Vraie exécution shell depuis l'app
- Écriture fichier depuis l'app
- Appel GitHub / n8n / API externe
- Email ou calendrier réel
- Suppression de données
- Action irréversible
- Accès secret / token
- Sync / restore Supabase automatique
- Approbation ou complétion automatique d'actions

---

## 6. Approval flow

```text
Action dominante (/actions)
  → Créer demande readiness (local)
  → Afficher risque + scopes + rollback
  → Utilisateur décide :
       approve_dry_run | reject | request_more_context | mark_simulated_only | archive
  → Audit trail mis à jour
  → Aucune exécution
```

---

## 7. Exemples autorisés en simulation

- Préparer une demande depuis une action `cursor_prompt` (doc + local)
- Approuver dry-run pour un plan `pr_plan` (GitHub simulé, scope interdit en réel)
- Archiver une demande après handoff manuel

---

## 8. Exemples bloqués

- « Gigi, push sur main » → préparation possible, exécution refusée
- « Lance n8n workflow X » → scope simulé, aucun appel
- « Écris dans .env.local » → interdit (forbidden targets)

---

## 9. Règles futurs connecteurs (V4.1+)

- Un connecteur = une validation produit explicite
- Scope réutilisable avec expiration
- Confirmation forte (double validation)
- Journal local enrichi
- Rollback documenté par connecteur
- Jamais d'autonomie totale

---

## 10. Référence code

- Policy : `modules/executionReadiness/executionReadinessPolicy.ts`
- Risque : `modules/executionReadiness/executionReadinessRisk.ts`
- Service : `modules/executionReadiness/executionReadinessService.ts`
