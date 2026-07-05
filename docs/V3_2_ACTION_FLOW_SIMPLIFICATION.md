# Gigi V3.2 — Action Flow Simplification

## Objectif

Simplifier `/actions` pour que l'utilisateur comprenne en quelques secondes quelle action regarder, dans quel état elle est, et quel bouton cliquer — sans perdre les modules V2 existants.

**Tagline produit :** « Une action. Aucun bruit. »

V3.2 est une **couche UX read-only** : aucune nouvelle persistence, aucune exécution automatique.

---

## Différence V3.1 → V3.2

| V3.1 | V3.2 |
|------|------|
| Stepper léger + toutes les cartes visibles | **Action dominante** + stepper + détails repliés |
| Page « Actions à valider » | Page **« Flux d'action »** |
| Priorité basique (statut file) | Priorité flux (rapport → passation → espace → validation → préparation → cycle) |
| Cartes toujours au premier plan | Cartes dans **« Modules avancés »** (`<details>`) |

V3.0/V3.1 restent la base (view model `missionOS`, Command Center sur `/`).

---

## Structure de `/actions`

### Haut de page

- **Titre :** Flux d'action
- **Sous-titre :** Une action à la fois. Prépare, exécute manuellement, colle le rapport.

### Bloc dominant (`ActionFlowPrimaryCard`)

- Action à faire maintenant
- État (étape + statut + % cycle)
- Pourquoi cette action
- CTA principal + secondaire
- Blocages éventuels

### Stepper / tabs (`ActionFlowStageTabs`)

Décision → Validation → Préparation → Passation → Rapport → Cycle

Compteurs par étape, étape active mise en évidence.

### Empty state

Si aucune action / mission non décidée.

### Sécurité

« Gigi prépare et guide. Il n'exécute rien sans toi. »

### Détails repliés (`ActionFlowDetails`)

1. **File complète** — liste cliquable avec ancres `#action-{id}`
2. **Modules avancés** — filtres, `QueuedActionCard`, plans, espace sécurisé, passation, rapport, cycle

Rien n'est supprimé : `ActionQueueProvider`, cartes V2, panels existants.

---

## Action dominante — logique de priorité

Synthèse locale (`buildActionFlowViewModel`) — **affichage uniquement**, jamais d'écriture de statut.

Ordre de priorité :

1. Action validée avec rapport attendu
2. Passation prête / en attente de rapport
3. Espace sécurisé prêt (passation à créer)
4. Action `pending_review` à valider
5. Action validée à préparer (plan / espace)
6. Cycle `needs_review` / `needs_follow_up`
7. Empty state

Partagé avec le Mission Command Center via `pickPrimaryActionForFlow()`.

---

## Stages du flux

| Stage | Label UI | Exemples de statut |
|-------|----------|-------------------|
| `decide` | Décision | À décider |
| `validate` | Validation | À valider |
| `prepare` | Préparation | À préparer |
| `handoff` | Passation | En passation |
| `report` | Rapport | Rapport attendu / à traiter |
| `cycle` | Cycle | Cycle à finaliser |
| `done` | Terminé | Terminé |

---

## CTA unique

Le CTA pointe vers :

- `/#mission-decision` — décision mission
- `/actions#action-{id}` — ancre sur la carte prioritaire (modules avancés)
- `/` — suite après cycle terminé

Harmonisé avec `/` via `enrichMissionOSCommandCenter` + `pickPrimaryActionForFlow`.

---

## Labels simplifiés (UI)

| Interne | Affichage |
|---------|-----------|
| queue | file d'actions |
| pending_review | à valider |
| approved | validée |
| workspace | espace sécurisé |
| handoff | passation |
| intake | rapport |
| lifecycle | cycle complet |
| execution plan | plan d'exécution |

Types TypeScript inchangés.

---

## Conversation

Intent `mission_os` enrichi pour :

- « où est l'action », « je dois cliquer où », « valider quoi », « rapport où », « passation cursor », etc.

Réponse : action prioritaire, étape, bouton, route `/actions` ou ancre, sécurité.

---

## Limites de sécurité

- Aucune exécution réelle
- Aucun appel externe (Git, GitHub, Supabase, n8n)
- Aucune validation / clôture automatique
- Aucune nouvelle clé localStorage
- Aucune migration de données
- Modules V2 intacts sous `<details>`

---

## Critères d'acceptation

- [ ] `/actions` : action dominante visible immédiatement
- [ ] Étape active + CTA clair
- [ ] File et modules V2 accessibles en replié
- [ ] `/` : CTA cohérent avec `/actions`
- [ ] Conversation oriente vers `/actions` si pertinent
- [ ] `npm run build` OK
- [ ] Lint ciblé `missionOS` + `actionQueue` OK

---

## Recommandation V3.3 — Learning & Next Mission Loop

- Après rapport/review : surface « ce que Gigi a appris »
- Lien explicite history → missionFeedback → prochaine mission
- Recommandation mission suivante plus visible sur `/` et `/history`
- Boucle apprentissage sans auto-accepter la mission suivante

Voir [ROADMAP.md](./ROADMAP.md).
