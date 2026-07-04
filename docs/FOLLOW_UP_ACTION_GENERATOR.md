# V2.3 — Follow-up Action Generator

> **De « voici ce que Gigi recommande » à « voici les prochaines actions proposées » — toujours local, toujours manuel.**

Version: `2.3`  
Status: Implemented (local proposals only)  
Product: **Gigi**

---

## 1. Objectif

Transformer une `ExecutionReview` V2.2 en **propositions d'actions de suivi** consultables, copiables et ajoutables manuellement à la file V1.9.

---

## 2. Différence Review V2.2 vs Follow-up V2.3

| V2.2 Review | V2.3 Follow-up |
|-------------|----------------|
| Analyse le journal | Propose des **actions concrètes** de suite |
| Décision + constats | Titres, objectifs, étapes, checklist |
| Clé `gigi-os-v22-execution-reviews` | Clé `gigi-os-v23-followup-actions` |

---

## 3. Types de propositions

| Type | Usage |
|------|--------|
| `fix` | Action corrective |
| `retry` | Relance d'exécution |
| `new_action` | Nouvelle action de suivi |
| `finalize` | Finalisation |
| `document` | Documentation du résultat |
| `archive` | Archivage / clôture |
| `clarify` | Compléter le rapport |
| `abandon` | Abandon documenté |

## 4. Statuts

| Statut | Signification |
|--------|---------------|
| `proposed` | Générée, en attente de choix |
| `selected` | Retenue par l'utilisateur |
| `added_to_queue` | Ajoutée à la file (`pending_review`) |
| `dismissed` | Ignorée |

---

## 5. Mapping depuis décisions V2.2

| Décision review | Propositions |
|-----------------|--------------|
| `completed_confirmed` | document, archive |
| `needs_fix` | fix |
| `needs_retry` | retry |
| `needs_new_action` | new_action |
| `abandoned_confirmed` | abandon, archive |
| `unclear` | clarify |

---

## 6. Ce que V2.3 ne fait PAS

```text
❌ Exécuter ou approuver automatiquement
❌ Lancer des commandes
❌ Modifier Git / GitHub / fichiers
❌ Appels Supabase, n8n, externes
❌ Modifier clés v19–v22
```

L'ajout à la file est **manuel** via « Ajouter à valider » → statut **`pending_review` uniquement**.

---

## 7. Stockage

Clé : **`gigi-os-v23-followup-actions`**

---

## 8. UI

`FollowUpActionPanel` intégré sous `ExecutionReviewPanel` dans `/actions` :

- Générer / régénérer propositions
- Copier une ou toutes
- Retenir / Ignorer
- **Ajouter à valider** → file V1.9

---

## 9. Exemple — needs_fix

```markdown
Type : Action corrective
Risque : medium
Titre : Corriger le problème signalé

Objectif : Résoudre le blocage identifié dans la review.

Pourquoi : Test échoué : Build — erreur TypeScript...
```

---

## 10. Suite — V2.4 History & Learning Loop (planned)

Archiver actions terminées, reviews, follow-ups et décisions pour améliorer les futures recommandations de mission — boucle locale d'apprentissage.

---

## Liens

- [EXECUTION_REPORT_REVIEW.md](./EXECUTION_REPORT_REVIEW.md) — V2.2
- [EXECUTION_LOGS_MANUAL_COMPLETION.md](./EXECUTION_LOGS_MANUAL_COMPLETION.md) — V2.1
