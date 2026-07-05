# Gigi V3.6 — Projects Command Center

> **Route B** — Rendre `/projects` stratégique et actionnable.

Version: `3.6`  
Status: Implementation (pending commit)  
Branch: `v3.6-projects-command-center`

---

## 1. Objectif

Transformer la page projets en centre de commandement :

- quel projet mérite l'attention ;
- quelle mission est recommandée par projet ;
- quelle action est active ;
- ce qui bloque ;
- ce qui a été appris ;
- où cliquer pour avancer.

**Sans** exécution automatique, sans nouvelle persistence lourde.

---

## 2. Module `projectsCommand`

Chemin : `modules/projectsCommand/`

| Fichier | Rôle |
|---------|------|
| `types.ts` | Types statut, priorité, cartes, view model |
| `projectsCommandPriority.ts` | Scoring projet recommandé |
| `projectsCommandViewModel.ts` | Synthèse lecture seule depuis données locales |
| `projectsCommandFormatter.ts` | Labels FR |
| `projectsCommandConversation.ts` | Intent conversation |
| `index.ts` | Exports |

Sources de données (lecture seule) :

- `state.projects` (GigiProvider)
- `gigi-os-v19-action-queue` (actions par projectId)
- missions possibles (`projectMissions`)
- apprentissage (`missionOSLearningLoop`)

---

## 3. UI `/projects`

- **ProjectsCommandCenter** — stats globales
- **ProjectsPriorityCard** — projet recommandé
- **ProjectsCommandFilters** — filtres simples
- **ProjectCommandCardView** — cartes scannables

---

## 4. UI `/projects/[projectId]`

- **ProjectDetailCommandStrip** — commande projet
- **ProjectDetailActiveAction** — action active
- **ProjectDetailLearning** — apprentissage projet
- **Missions possibles** — préservées (`#missions`)

---

## 5. Intégrations légères

| Route | Changement |
|-------|------------|
| `/` | Lien projet secondaire dans Mission Command Center |
| `/actions` | Lien projet sur action dominante |
| `/history` | Lien centre projets dans apprentissage récent |
| Conversation | Intent `projects_command` |

---

## 6. localStorage

**Aucune nouvelle clé** — filtres UI en `useState` React.

---

## 7. Limites

- Pas de création/acceptation auto de projet, mission ou action
- Pas d'appels externes
- View model synthétise uniquement

---

## 8. Critères d'acceptation

- [ ] `/projects` montre priorité et filtres
- [ ] Détail projet renforce missions possibles
- [ ] Conversation répond aux questions projets
- [ ] Build OK, lint ciblé OK

---

## 9. Prochaine étape — V3.7 (non codée)

**Settings & Local Data Control** — export/import, reset contrôlé, préférences mission, mode prudence, version/build.

---

## 10. Références

- [ROADMAP.md](./ROADMAP.md)
- [V3_5_PUBLIC_LANDING_ONBOARDING.md](./V3_5_PUBLIC_LANDING_ONBOARDING.md)
