# V4.7 — Project Mission Composer / Daily Guided Execution

## 1. Objectif

Aegis est **mission-first**. V4.7 ajoute une couche pour :

- proposer des **missions candidates** par projet ;
- choisir **une seule mission du jour** ;
- expliquer **pourquoi** elle est prioritaire ;
- la **transformer en parcours guidé V4.6** par action explicite.

Tout reste **local**, **déclaratif**, **sans exécution réelle**.

## 2. Pourquoi V4.7 est importante

V4.6 structure l’exécution contrôlée (parcours guidé). V4.7 répond à la question produit centrale :

> Quelle mission unique dois-je choisir aujourd’hui pour avancer sans dispersion ?

## 3. Ce que V4.7 ajoute

- Modèles `ProjectMissionCandidate` et `DailyPriorityMission`
- Scoring mission-first (impact, urgence, effort)
- Templates de missions (focus, exécution, planning, code, revue, stratégie)
- Route `/mission-composer` + SideNav « Mission du jour »
- Intégrations : `/`, projets, `/guided-actions`, `/actions`, settings, history, conversation
- Schéma localStorage v6 dans `gigi-os-v40-execution-readiness`

## 4. Ce que V4.7 ne fait pas

- Aucune exécution réelle
- Aucun connecteur actif
- Aucun fetch réseau
- Aucune lecture terminal/fichier/API
- Aucune permission permanente
- Aucune auto-création silencieuse persistée
- Aucune vérification réelle de complétion (`completed_by_human` = déclaratif)

## 5. Modèles

### ProjectMissionCandidate

Candidat mission lié à un projet — créé par **clic explicite** uniquement.

Statuts : `suggested`, `shortlisted`, `selected_for_today`, `converted_to_guided_flow`, `dismissed`, `archived`.

### DailyPriorityMission

Mission du jour unique — choisie par l’utilisateur.

Statuts : `selected`, `in_progress`, `converted_to_guided_flow`, `completed_by_human`, `cancelled`.

## 6. Scoring mission-first

Score 10–100 basé sur impact, urgence et pénalité d’effort. Affiché dans l’UI pour aider le choix — pas de décision automatique.

## 7. Mission du jour

Une seule mission active à la fois. En choisir une nouvelle annule la précédente (statut `cancelled`).

## 8. Intégration projets

Sur `/projects/[projectId]` : section « Missions possibles » avec création de candidates et CTAs.

## 9. Conversion mission → guided action flow

`convertMissionToGuidedActionFlow()` appelle `createGuidedFlowFromMission()` (V4.6). Local uniquement.

`isMissionComposerExecutionBlocked()` retourne toujours `true`.

## 10. Stockage local

Clé : `gigi-os-v40-execution-readiness`  
Version : **6**  
Champs : `projectMissionCandidates[]`, `dailyPriorityMissions[]`  
Fallback : `[]` si absent. Compatible V4.0–V4.6.

## 11. Sécurité et wording

Wording autorisé : mission recommandée, parcours guidé, Gigi prépare, tu choisis, tu valides, local uniquement.

Interdit comme promesse UI : Gigi exécute/lance/modifie, exécution automatique, connecteur actif, etc.

## 12. Tests manuels

1. Ouvrir `/` — panneau V4.7 visible au-dessus de V4.5
2. Créer une candidate depuis `/mission-composer`
3. Choisir comme mission du jour
4. Transformer en parcours guidé → vérifier `/guided-actions`
5. Vérifier settings et history
6. Demander à Gigi « quelle est ma mission du jour ? »

## 13. Limites connues

- Suggestions UI sur `/` non persistées tant que l’utilisateur ne clique pas
- Pas de sync cloud
- Complétion humaine non vérifiée

## 14. Préparation V4.8

**Daily Mission Review / Execution Reflection** — revue de fin de journée sur la mission choisie et le parcours guidé associé.
