# V1.6 — Project Detail & Mission Suggestions

> **Ouvre Gigi. Sache quoi faire. Exécute.**

Version: `1.6`  
Status: Implemented (local-only)  
Product: **Gigi** (produit + assistant)

---

## 1. Objectif

Passer de « Je vois mes projets » à **« Je sais quoi faire sur ce projet maintenant »**.

Chaque projet dans `/projects` est cliquable et mène à une vue détail actionnable avec :

- contexte et score du projet ;
- pourquoi il compte aujourd'hui (ou non) ;
- prochaine action recommandée ;
- missions possibles (catalogue local) ;
- deep-link vers Gigi pour trancher ou préparer une mission.

---

## 2. Données locales

Tout repose sur les données déjà présentes dans l'app :

| Source | Usage |
|--------|--------|
| `state.projects` (GigiProvider / localStorage) | Projets affichés |
| `data/mockProjects.ts` | Seeds initiaux |
| `data/projectLabels.ts` | Labels contexte « aujourd'hui » |
| `modules/projectMissions/` | Missions possibles + résumé détail |
| `state.history` | Historique filtré par `meta.projectId` ou nom projet |

**Aucune nouvelle clé localStorage.**  
**Aucune persistance Supabase.**  
**Aucun appel externe ou IA obligatoire.**

---

## 3. Routes

| Route | Comportement |
|-------|----------------|
| `/projects` | Liste — cartes cliquables avec affordance « Voir les missions possibles » |
| `/projects/[projectId]` | Détail projet + missions + prochaine action |
| `/projects/projet-inexistant` | État « Projet introuvable » + retour `/projects` |
| `/conversation?ask=...` | Deep-link prérempli (Demander à Gigi) |

---

## 4. Module `modules/projectMissions/`

```
modules/projectMissions/
├── types.ts                      # ProjectMissionSuggestion, ProjectDetailSummary, …
├── projectMissionRules.ts        # Catalogues par projectId
├── projectMissionSummary.ts      # Score, why today, prochaine action
├── projectMissionSuggestions.ts  # buildProjectDetailContext, hrefs Gigi
└── index.ts
```

### Mission possible (`ProjectMissionSuggestion`)

- `id`, `title`, `description`
- `impact`, `effort`, `urgency` (1–10)
- `recommended`, `reason`
- `suggestedTasks?`, `projectId`

Catalogues couvrant : Buildy Clear, Buildy Crafts, Linko, Gigi OS, 1 Millimètre, Le Dernier Souvenir + fallback générique.

### Prochaine action (`ProjectRecommendedAction`)

- `action` — « Commence par… »
- `whyNow` — « Pourquoi maintenant… »
- `canIgnore` — « Ce que tu peux ignorer… »

---

## 5. Deep-links Gigi

| Bouton | URL pattern |
|--------|-------------|
| Demander à Gigi (projet) | `/conversation?ask=Gigi, quelle mission est prioritaire pour le projet {name} aujourd'hui ?` |
| Préparer comme mission | `/conversation?ask=Gigi, prépare la mission « {title} » pour le projet {name}…` |
| Demander à Gigi de la choisir | `/conversation?ask=Gigi, est-ce que je devrais choisir la mission « {title} »…` |

Via `getConversationAskHref()` — **simulation uniquement**, pas d'écrasement de la mission du jour.

---

## 6. UI

- **Intensité** : détail 6/10, cartes missions 5/10
- Hero projet, score, progression
- Carte « Prochaine action »
- Liste missions possibles avec badges I/E/U
- Rail latéral : pourquoi ce projet, aujourd'hui, signaux, historique
- Cohérent design V1.5.3 / V1.5.4 (Gigi brand)

---

## 7. Limites V1.6

- Missions = catalogue local statique, pas de génération IA
- « Préparer comme mission » = deep-link conversation, pas d'application automatique
- Historique projet = filtre best-effort sur `history` existant
- Pas de sync cloud, pas d'agents réels, pas de n8n

---

## 8. Prochaines étapes (V1.7+)

- **V1.7** — Appliquer une mission choisie avec confirmation explicite
- **V1.8** — Missions générées par le decision engine / IA locale
- Historique projet persisté avec `meta.projectId` systématique
- Suggestions mises à jour selon progression réelle

---

## 9. Fichiers clés

| Fichier | Rôle |
|---------|------|
| `app/projects/[projectId]/page.tsx` | Route dynamique |
| `components/projects/ProjectDetailPageContent.tsx` | Vue détail |
| `components/projects/ProjectMissionCard.tsx` | Carte mission |
| `components/projects/ProjectCard.tsx` | Lien vers détail |
