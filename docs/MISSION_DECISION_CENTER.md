# V2.6 — Mission Decision Center

> **De « mission recommandée » à « tu décides en connaissance de cause » — local, manuel, explicatif.**

Version: `2.6`  
Status: Implemented (local decisions only)  
Product: **Gigi**

---

## 1. Objectif

Centraliser le **choix de la mission du jour** : comparer plusieurs candidates, expliquer scores/risques, enregistrer la décision utilisateur (accepter, refuser, reporter, clarifier).

---

## 2. Feedback V2.5 vs Décision V2.6

| V2.5 Mission Feedback | V2.6 Mission Decision |
|----------------------|------------------------|
| Score et signaux par mission | **Comparaison** et **choix explicite** |
| Explique « pourquoi » | Enregistre « qu'est-ce que tu as décidé » |
| Clé `gigi-os-v25-mission-feedback-loop` | Clé `gigi-os-v26-mission-decision-center` |
| Badges sur fiches projet | Centre sur `/` (Mission du jour) |

---

## 3. Stockage

Clé localStorage : **`gigi-os-v26-mission-decision-center`**

Structure : `{ decisions, currentDecisionId, generatedAt, version }`

---

## 4. Sources des candidates

| Source | Origine |
|--------|---------|
| `project_mission` | Catalogue / fiches projet |
| `recommended_mission` | Mission du jour actuelle |
| `follow_up_action` | Propositions V2.3 non ignorées |
| `action_queue` | (réservé futur) |
| `manual` | (réservé futur) |
| `inferred` | Agrégation locale |

---

## 5. Statuts de décision

| Statut | Signification |
|--------|---------------|
| `draft` | Brouillon, pas de candidate |
| `recommended` | Recommandation générée |
| `accepted` | Acceptée par l'utilisateur |
| `rejected` | Refusée |
| `postponed` | Reportée |
| `needs_clarification` | À clarifier avant lancement |
| `converted_to_plan` | Lien plan ouvert (manuel) |
| `archived` | Archivée |

---

## 6. Scoring décision (0–100)

- Base : score V2.5 si disponible, sinon **50**
- +20 unblocker · +15 high_impact · +10 validation claire · +10 follow-up · +10 projet actif
- −20 too_vague · −15 often_abandoned · −15 recurring_blocker · −10 missing_context · −10 scope large

Score **indicatif** — Gigi explique, l'utilisateur tranche.

---

## 7. Choix utilisateur

Actions manuelles uniquement :

- **Accepter** — enregistre `accepted`, ne modifie pas automatiquement `state.mission`
- **Refuser** — `rejected`
- **Reporter** — `postponed`
- **À clarifier** — `needs_clarification`
- **Transformer en plan** — deep-link `/projects/[id]?plan=…` — statut `converted_to_plan`

Aucune action approuvée, aucune exécution, aucune commande.

---

## 8. UI

| Emplacement | Contenu |
|-------------|---------|
| `/` | `MissionDecisionCenter` — candidates, actions, historique |
| `/projects/[id]` | Lien « Comparer dans le centre de décision » |
| `/history` | Décisions récentes |
| Conversation | Intent `mission_decision` |

Le `MissionCard` et le catalogue V1.6 **restent en place**.

---

## 9. Exemple copiable

```text
# Mission Decision — Gigi V2.6

Date : 2026-07-05
Décision : accepted
Mission choisie : Finaliser la page de vente Buildy Clear
Score : 82/100

Pourquoi :
* Débloque le projet
* Projet actif

Checklist :
* Revoir le hero
* Tester le CTA

Limite :
Décision locale — Gigi ne vérifie pas le repo.
```

---

## 10. Ce que V2.6 ne fait PAS

```text
❌ Accepter une mission automatiquement
❌ Approuver une action dans la queue
❌ Exécuter, lancer des commandes, Git
❌ Appels externes ou sync cloud
❌ Remplacer le moteur mission V0.3
❌ Modifier clés v03–v25
```

---

## 11. Suite — V2.7 (planned)

**Mission-to-Plan Decision Bridge** : enchaînement fluide mission acceptée → plan V1.7 → action préparée V1.8 → ajout manuel queue `pending_review`.

Voir [ROADMAP.md](./ROADMAP.md).
