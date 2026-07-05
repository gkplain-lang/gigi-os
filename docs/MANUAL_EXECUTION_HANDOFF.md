# V2.9 — Manual Execution Handoff

> **Gigi prépare, tu copies, Cursor/humain exécute, tu rapportes — sans envoi automatique.**

Version: `2.9`  
Status: Implemented (local copy-only handoff)  
Product: **Gigi**

---

## 1. Objectif

Générer un **paquet de passation manuel** copiable pour exécuter une action en dehors de Gigi (Cursor, humain, soi-même).

Chaîne :
```
Gigi prépare → humain/Cursor exécute → utilisateur colle le rapport dans Gigi
```

---

## 2. Workspace V2.8 vs Handoff V2.9

| V2.8 Safe Action Workspace | V2.9 Manual Execution Handoff |
|---------------------------|----------------------------|
| Agrège le contexte local | **Formate** un paquet exportable |
| Readiness + checklist | + prompt Cursor + template rapport |
| Préparation avant exécution | **Passation** vers l'exécutant |
| Clé `gigi-os-v28-safe-action-workspaces` | Clé `gigi-os-v29-manual-execution-handoffs` |

---

## 3. Stockage

Clé localStorage : **`gigi-os-v29-manual-execution-handoffs`**

---

## 4. Sources

| Source | Description |
|--------|-------------|
| `safe_action_workspace` | Depuis workspace V2.8 |
| `action_queue` | Depuis action file V1.9 |
| `execution_plan` | Depuis plan V2.0 |
| `mission_plan_bridge` | Via workspace/bridge V2.7 |
| `prepared_action` | Action préparée V1.8 |
| `manual` | Fallback |

---

## 5. Cibles

| Cible | Usage |
|-------|--------|
| `cursor` | Prompt Cursor copiable |
| `human` | Instructions pour un humain |
| `self` | Exécution par soi-même |
| `generic` | Format neutre |

---

## 6. Statuts handoff

| Statut | Signification |
|--------|---------------|
| `draft` | Brouillon |
| `ready_to_copy` | Prêt à copier |
| `copied` | Copié par l'utilisateur |
| `handed_off` | Marqué passé à l'exécutant |
| `waiting_for_report` | En attente de rapport |
| `report_received` | Rapport reçu (manuel) |
| `archived` | Archivé |
| `cancelled` | Annulé |

---

## 7. Sections du handoff

`context`, `objective`, `scope`, `safety_rules`, `prerequisites`, `files`, `manual_steps`, `theoretical_commands`, `tests`, `success_criteria`, `risks`, `rollback`, `expected_report`, `next_steps`, `notes`

---

## 8. Prompt Cursor

Généré localement, **copié manuellement** par l'utilisateur.

Contient : périmètre, règles de sécurité, plan, tests, rollback, template de rapport.

Gigi **ne déclenche pas** Cursor et **n'envoie pas** le prompt.

---

## 9. Template de rapport attendu

Modèle à recopier dans Gigi après exécution :

- Action exécutée, date, outil utilisé
- Fichiers modifiés, étapes, commandes
- Tests et résultats
- Blocages, corrections
- Commit oui/non, hash
- Rapport final, prochaine étape

*(V2.10 — Execution Report Intake prévu pour ingestion structurée)*

---

## 10. Règles de sécurité (incluses)

- Ne touche pas à `.env.local`
- Ne commit pas sans validation
- Ne lance aucun service externe
- Ne fais aucune sync/restore
- Ne change pas le périmètre

---

## 11. Ce que Gigi ne fait PAS

- N'envoie pas le handoff à Cursor
- N'exécute aucune commande
- Ne vérifie pas le repo
- N'approuve pas d'action
- Ne marque pas terminé automatiquement
- Ne synchronise rien dans le cloud

---

## 12. UI

| Route | Intégration |
|-------|-------------|
| `/actions` | « Créer handoff » sur cartes action |
| Workspace V2.8 | « Créer handoff » dans le workspace |
| `/history` | Handoffs récents |
| `/conversation` | Intent `manual_execution_handoff` |

---

## 13. Suite produit

**V2.10 — Execution Report Intake** : coller le rapport reçu → log V2.1 + review V2.2 proposée, localement.

Voir [ROADMAP.md](./ROADMAP.md).
