# V2.5 — Mission Recommendation Feedback Loop

> **De « historique local » à « meilleure mission demain » — scoring indicatif, explications claires, zéro exécution.**

Version: `2.5`  
Status: Implemented (local feedback only)  
Product: **Gigi**

---

## 1. Objectif

Utiliser l'historique V2.4 (`gigi-os-v24-history-learning-loop`) pour **affiner les recommandations de missions** : éviter le flou, signaler les abandons récurrents, prioriser ce qui débloque un projet.

---

## 2. History Learning V2.4 vs Mission Feedback V2.5

| V2.4 History Learning | V2.5 Mission Feedback |
|----------------------|------------------------|
| Archive exécutions, reviews, follow-ups | **Lit** ces archives pour scorer les missions |
| Signaux d'exécution (`blocker`, `missing_report`, …) | Signaux **mission** (`recurring_blocker`, `too_vague`, …) |
| Clé `gigi-os-v24-history-learning-loop` | Clé `gigi-os-v25-mission-feedback-loop` |
| Panneau sur `/history` | Badges projet + « Pourquoi cette mission ? » |

Les deux boucles sont complémentaires — V2.5 ne modifie pas V2.4.

---

## 3. Stockage

Clé localStorage : **`gigi-os-v25-mission-feedback-loop`**

Structure : `{ signals, scores, manualFeedback, generatedAt, version }`

---

## 4. Signaux mission

| Signal | Déclencheur typique |
|--------|---------------------|
| `unblocker` | Succès répétés sur un projet |
| `recurring_blocker` | ≥ 2 blocages sur un projet |
| `too_vague` | Note ou apprentissage « flou / pas clair » |
| `often_abandoned` | Abandons récurrents |
| `often_completed` | Exécutions terminées avec succès |
| `needs_smaller_scope` | Note « trop gros / scope » |
| `needs_clearer_validation` | Rapports finaux manquants |
| `high_impact` | Review `completed_confirmed` / succès |
| `low_impact` | Feedback manuel « peu utile » |
| `follow_up_required` | Follow-up ou review needs_fix |
| `documentation_needed` | Archivage follow-up document |
| `test_required` | Signal `failed_test` dans l'historique |
| `manual_review_required` | Correction manuelle signalée |

---

## 5. Scoring (0–100)

Base **50**, puis ajustements :

| Règle | Delta |
|-------|-------|
| Succès / completed lié | +20 |
| `unblocker` | +15 |
| `high_impact` | +15 |
| Follow-up clair | +10 |
| `recurring_blocker` | −20 |
| `often_abandoned` | −15 |
| `too_vague` | −15 |
| Validation floue | −10 |
| Scope trop large | −10 |

Score clampé entre **0** et **100**.

---

## 6. Décisions

| Score | Décision |
|-------|----------|
| 80–100 | `strongly_recommended` |
| 60–79 | `recommended` |
| 40–59 | `neutral` |
| 20–39 | `needs_clarification` |
| 0–19 | `not_recommended` |

Le scoring est **indicatif** — Gigi explique les raisons et les risques, sans prétendre à une vérité absolue.

---

## 7. Feedback manuel

Sentiments : `useful`, `not_useful`, `too_big`, `too_vague`, `blocked`, `completed`

Enregistrés localement et intégrés à la régénération des signaux.

---

## 8. UI

| Emplacement | Contenu |
|-------------|---------|
| `/` (mission du jour) | Bloc « Pourquoi cette mission ? » |
| `/projects/[id]` | Badge sur chaque mission + panneau feedback |
| `/history` | Synthèse + lien vers mission/projet |
| Conversation | Intent `mission_feedback` |

Le flag `recommended` V1.6 **n'est pas remplacé** — V2.5 ajoute une couche explicative.

---

## 9. Exemple copiable

```text
# Mission Feedback — Gigi V2.5

Mission : Corriger le build après erreur TypeScript
Décision : recommended
Score : 72/100
Confiance : 68%

Pourquoi :
* Cette mission résout un blocage identifié localement.
* Une action de suivi est déjà claire dans l'historique.

Risques :
* Validation ou rapport final souvent insuffisant.

Clarification suggérée :
Définir précisément le résultat attendu, le test à relancer et le critère de « terminé ».

Limite :
Feedback basé uniquement sur l'historique local et les déclarations manuelles.
```

---

## 10. Ce que V2.5 ne fait PAS

```text
❌ Remplacer le catalogue ou le moteur mission V0.3
❌ Modifier automatiquement la mission du jour
❌ Exécuter des actions
❌ Appels GitHub, Supabase, n8n, externes
❌ Sync cloud ou mémoire distante
❌ Modifier les clés v03–v24
❌ Supprimer missions, projets ou actions existants
```

---

## 11. Suite — V2.6 (planned)

**Mission Decision Center** : comparer plusieurs missions candidates, accepter/refuser explicitement, transformer en plan/action, historique des décisions — toujours sans exécution réelle.

Voir [ROADMAP.md](./ROADMAP.md).
