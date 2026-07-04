# V2.4 — History & Learning Loop

> **De « action terminée » à « trace utile pour la prochaine fois » — local, déclaratif, sans sync cloud.**

Version: `2.4`  
Status: Implemented (local archive only)  
Product: **Gigi**

---

## 1. Objectif

Quand une action arrive au bout de la chaîne V1.9 → V2.3 (terminée, abandonnée, bloquée, reviewée ou transformée en follow-up), Gigi peut **archiver une entrée d'historique** exploitable pour les futures recommandations — sans exécution réelle ni vérification externe.

---

## 2. Historique simple vs Learning Loop

| Historique missions (`state.history`) | Learning Loop V2.4 |
|---------------------------------------|---------------------|
| Timeline des missions et événements produit | Trace des **exécutions** et **reviews** |
| Géré par `GigiProvider` | Clé dédiée `gigi-os-v24-history-learning-loop` |
| Lecture seule côté missions | Signaux, apprentissages, recommandations futures |

Les deux coexistent sur `/history` : timeline en haut, panneau V2.4 en dessous.

---

## 3. Stockage

Clé localStorage : **`gigi-os-v24-history-learning-loop`**

Structure : `{ entries: HistoryLearningEntry[], lastUpdatedAt? }`

Les clés v19–v23 ne sont **pas modifiées** par l'archivage.

---

## 4. Sources possibles

| Source | Origine |
|--------|---------|
| `action_queue` | Action V1.9 (futur) |
| `execution_plan` | Plan V2.0 |
| `execution_log` | Journal V2.1 |
| `execution_review` | Review V2.2 |
| `follow_up_action` | Proposition V2.3 |
| `manual` | Note saisie sur `/history` |

---

## 5. Statuts

| Statut | Signification |
|--------|---------------|
| `completed` | Action/review clôturée positivement |
| `abandoned` | Abandon confirmé |
| `blocked` | Blocage signalé |
| `needs_follow_up` | Suite nécessaire (fix, retry, etc.) |
| `unclear` | Incertain |
| `archived` | Entrée archivée manuellement |

---

## 6. Outcomes

| Outcome | Signification |
|---------|---------------|
| `success` | Résultat confirmé |
| `partial_success` | Avancement partiel |
| `failed` | Échec déclaré |
| `abandoned` | Abandonné |
| `blocked` | Bloqué |
| `unclear` | Incertain |

Mapping review → archive :

| Décision V2.2 | Statut | Outcome |
|---------------|--------|---------|
| `completed_confirmed` | `completed` | `success` |
| `needs_fix` / `needs_retry` / `needs_new_action` | `needs_follow_up` | `partial_success` |
| `abandoned_confirmed` | `abandoned` | `abandoned` |
| `unclear` | `unclear` | `unclear` |

---

## 7. Signaux détectés (local)

Le moteur analyse **uniquement** les données déclarées par l'utilisateur :

| Signal | Déclencheur typique |
|--------|---------------------|
| `completed_action` | Statut `completed_manually` |
| `failed_test` | Entrée journal `test_failed` |
| `blocker` | Statut `blocked` ou finding blocker |
| `fix_created` | Review `needs_fix` + follow-up fix |
| `retry_needed` | Review `needs_retry` |
| `follow_up_created` | Follow-up V2.3 créé |
| `manual_commit` | Entrée journal `manual_commit` |
| `missing_report` | Action terminée sans `finalReport` |
| `decision_confirmed` | Review `completed_confirmed` |
| `recurring_pattern` | Même type de blocage ≥ 2 fois |
| `learning_note` | Note manuelle ajoutée |

---

## 8. Notes d'apprentissage

Notes locales (`HistoryLearningNote`) attachées à une entrée ou créées via le formulaire manuel sur `/history`.

---

## 9. Recommandations futures

`RecommendedFutureBehavior` : suggestions textuelles avec `appliesTo` et `confidence` — **non exécutées**, copiables uniquement.

---

## 10. UI

| Emplacement | Action |
|-------------|--------|
| `/history` | `HistoryLearningPanel` — synthèse, liste, notes manuelles |
| `/actions` → Review | « Archiver dans l'historique », « Copier synthèse » |
| Follow-up V2.3 | Archivage par proposition |
| Conversation | Intent `history_learning` |

---

## 11. Exemple d'entrée copiable

```text
# History Entry — Gigi V2.4

Titre : Correction du build après erreur TypeScript
Statut : completed
Résultat : partial_success

Résumé :
L'action a été exécutée manuellement. Un blocage TypeScript a été identifié...

Signaux :
· Test échoué détecté
· Blocage signalé
· Action corrective proposée

Apprentissages :
· Toujours relancer le build après modification TypeScript.

Recommandations futures :
· Pour les blocages TypeScript, générer une follow-up action dédiée.

Limite :
Cette entrée est basée uniquement sur les données locales et les déclarations manuelles de l'utilisateur.
```

---

## 12. Ce que V2.4 ne fait PAS

```text
❌ Exécuter des actions
❌ Lancer des commandes
❌ Modifier Git / GitHub / fichiers externes
❌ Appels Supabase, n8n, API externes
❌ Sync ou mémoire cloud
❌ Supprimer automatiquement actions/reviews/logs existants
❌ Modifier les statuts v19–v23
❌ Prétendre vérifier le repo
```

---

## 13. Suite — V2.5 (planned)

**Mission Recommendation Feedback Loop** : utiliser l'historique V2.4 pour affiner les missions recommandées (éviter le flou, prioriser les déblocages, tenir compte des abandons récurrents) — toujours sans exécution réelle.

Voir [ROADMAP.md](./ROADMAP.md).
