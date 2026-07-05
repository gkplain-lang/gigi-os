# V2.11 — Closed Loop Action Lifecycle

> **Une vue cycle qui relie toutes les briques — local, déclaratif, sans vérification repo.**

Version: `2.11`  
Status: Implemented (local lifecycle aggregation)  
Product: **Gigi**

---

## 1. Objectif

Relier officiellement toute la chaîne d'action dans un **cycle fermé local** :

```
Mission → plan → action → workspace → handoff → rapport → log → review → follow-up → historique → feedback
```

V2.11 répond à : où en est l'action ? qu'est-ce qui manque ? quelle est la prochaine étape ? la boucle est-elle fermée ?

---

## 2. Modules V2.0–V2.10 vs Lifecycle V2.11

| V2.0–V2.10 | V2.11 Lifecycle |
|------------|-----------------|
| Chaque brique gère son domaine | **Agrège et lit** toutes les briques |
| Pas de vue globale | Timeline + statut + santé + next steps |
| Clés séparées | Clé `gigi-os-v211-closed-loop-action-lifecycle` |

---

## 3. Stockage

Clé localStorage : **`gigi-os-v211-closed-loop-action-lifecycle`**

---

## 4. Statuts lifecycle

`draft` · `active` · `waiting_for_user` · `waiting_for_execution` · `waiting_for_report` · `needs_review` · `needs_follow_up` · `learning_ready` · `closed` · `archived` · `blocked` · `unclear`

---

## 5. Stages (15)

`mission_decided` → `plan_created` → `action_prepared` → `action_queued` → `action_approved` → `execution_plan_created` → `workspace_created` → `handoff_created` → `report_intake_created` → `log_updated` → `review_created` → `follow_up_created` → `history_archived` → `mission_feedback_updated` → `cycle_closed`

---

## 6. Health

`healthy` · `incomplete` · `risky` · `blocked` · `unclear`

---

## 7. Next steps

Recommandations locales : `choose_mission`, `approve_action`, `create_handoff`, `paste_report`, `apply_report_to_log`, `generate_review`, `create_follow_up`, `close_cycle`, etc.

**Aucune exécution automatique** — chaque étape reste manuelle.

---

## 8. Clôture & archivage

- **Fermer cycle** : clic utilisateur → `userClosed: true`, statut `closed`
- **Archiver** : archive uniquement le record V2.11
- Les sources (log, review, handoff…) ne sont **pas** modifiées automatiquement

---

## 9. Ce que Gigi ne fait PAS

- Ne vérifie pas Git, GitHub, fichiers ou build
- N'applique pas au log automatiquement
- Ne génère pas review/follow-up automatiquement
- Ne ferme ni n'archive sans clic utilisateur
- Ne prétend pas que le cycle est vérifié techniquement

---

## 10. UI

| Route | Intégration |
|-------|-------------|
| `/actions` | « Cycle complet » |
| Workspace / Handoff / Intake | Accès cycle |
| `/history` | Cycles récents |
| `/conversation` | Intent `closed_loop_lifecycle` |

---

## 11. Suite produit

**V2.12 — V3 Readiness Audit & Stabilisation** : audit flux fermé, lint, localStorage, routes, sécurité.

Voir [ROADMAP.md](./ROADMAP.md).
