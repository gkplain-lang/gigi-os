# Gigi V3.3 — Learning & Next Mission Loop

## Objectif

Rendre visible et utile la boucle d'apprentissage après rapport, review ou cycle — sans exécution automatique ni nouvelle persistence.

**Promesse V3 complète :** Gigi comprend le résultat et recommande la prochaine mission (tu décides).

---

## Différence V3.2 → V3.3

| V3.2 | V3.3 |
|------|------|
| Flux d'action dominant sur `/actions` | **Apprentissage synthétisé** après cycle |
| Peu de lien review → suite | Review / follow-up → **recommandation read-only** |
| Historique dense | Section **« Apprentissage récent »** sur `/history` |
| Command Center sans leçon | Bloc **« Ce que Gigi a appris »** sur `/` |

---

## Sources utilisées (read-only)

Synthèse locale depuis modules V2 existants :

| Module | Donnée |
|--------|--------|
| `historyLearning` | Entrées, signaux, leçons, motifs récurrents |
| `missionFeedback` | Scores mission, signaux feedback |
| `executionReviews` | Dernière review, décision, findings |
| `followUpActions` | Propositions de suivi (fix, doc, retry…) |
| `closedLoopLifecycle` | Cycle actif, statut |
| `executionReportIntake` | Dernier rapport collé |

**Aucune nouvelle clé localStorage.**

---

## Structure Learning Loop

### View model : `MissionLearningViewModel`

Produit par `buildMissionLearningViewModel()` :

- Dernier résultat (`whatHappened`)
- Ce que Gigi en tire (`whatGigiLearned`)
- Ce que ça change (`whatChanged`)
- Signaux (`learningSignals` / labels)
- Blocage éventuel
- Prochaine mission recommandée (titre, raison, route)
- CTA action (`recommendedNextActionLabel` / route)
- Type de recommandation (`recommendationKind`)

### Prochaine mission : `resolveNextMissionRecommendation()`

Priorité read-only :

1. Follow-up proposé (correction, doc, clarification)
2. Review récente (`needs_fix`, `needs_retry`, `completed_confirmed`)
3. Score missionFeedback (`getBestDailyMissionRecommendation`)
4. Fallback : choisir manuellement sur `/#mission-decision`

Types :

- `next_mission_probable`
- `correction_recommended`
- `documentation_recommended`
- `clarification_recommended`
- `next_mission_unclear`

---

## Intégrations UI

### `/` — `MissionLearningPanel`

Sous le Mission Command Center :

- Dernier résultat, apprentissage, impact
- Suite recommandée + CTAs (historique, mission, action)

### `/history` — `RecentLearningSection`

En tête de page :

- 3–5 signaux max
- Conclusion simple
- Suite suggérée + liens `/` et `/actions`

### `/actions` — encart léger

Dans `ActionFlowView` : rappel post-rapport + lien apprentissage.

### `/projects/[id]`

Indication « Suite recommandée » si le view model pointe vers ce projet.

### Conversation

Intent détecté avant `mission_os` :

- « on a appris quoi », « c'est quoi la suite », « est-ce que c'est fini », etc.
- Réponse format : résultat, apprentissage, changement, suite, action, sécurité

---

## Ce que Gigi ne fait PAS

- N'accepte aucune mission automatiquement
- Ne crée aucune action en file
- N'applique aucun log / review / follow-up
- Ne ferme aucun cycle
- N'appelle aucun service externe
- Ne modifie aucune entrée d'historique

---

## Critères d'acceptation

- [ ] `/` : bloc apprentissage visible et utile
- [ ] `/history` : section apprentissage récent
- [ ] `/actions` : encart post-rapport sans alourdir V3.2
- [ ] Conversation : « on a appris quoi » / « c'est quoi la suite »
- [ ] Build OK, lint ciblé OK
- [ ] Aucune nouvelle clé localStorage

---

## Recommandation V3.4 — Stabilisation & Public Beta Readiness

- Lint ciblé providers + dette globale
- Parcours complet testé (mission → actions → rapport → history → suite)
- Docs bêta, audit localStorage, erreurs visibles
- Harmonisation labels V2 restants

Voir [ROADMAP.md](./ROADMAP.md).
