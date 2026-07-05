# Gigi V3 — Release Notes

## Qu'est-ce que Gigi V3 ?

**Gigi V3** est la couche **Mission OS** : un parcours mission-first, entièrement **manuel** et **local-first**.

Tagline : **« Une action. Aucun bruit. »**

Promesse : **Ouvre Gigi. Sache quoi faire. Exécute.** (hors de l'app, par toi.)

---

## Ce qui change depuis V2

| V2 | V3 |
|----|-----|
| Nombreuses cartes et modules visibles | **Une mission, une action, un CTA** |
| Jargon technique (bridge, intake, lifecycle…) | Labels produit simplifiés |
| Pilotage dispersé | **Command Center** sur `/` |
| File d'actions dense | **Flux d'action** guidé sur `/actions` |
| Historique riche mais bruyant | **Apprentissage récent** + modules repliés |

Les modules V2 **restent accessibles** — ils ne sont pas supprimés.

---

## V3.0 — Closed Loop Mission OS

- View model `missionOS` (synthèse locale read-only)
- Intégration `/`, `/actions`, `/history`, projets, conversation
- Boucle : mission → préparation → exécution → rapport → apprentissage → suite

## V3.1 — Mission Command Center UX

- Hub `/` mission-first : CTA unique, timeline, raison principale
- Stepper léger sur `/actions`
- Conversation `mission_os` enrichie

## V3.2 — Action Flow Simplification

- `/actions` : action dominante, stepper par état
- Modules V2 repliés sous « Modules avancés »
- Priorité d'action partagée avec `/`

## V3.3 — Learning & Next Mission Loop

- Bloc « Ce que Gigi a appris » sur `/`
- Section apprentissage récent sur `/history`
- Recommandation read-only de prochaine mission
- Conversation : « on a appris quoi », « c'est quoi la suite »

## V3.4 — Stabilisation & Public Beta Readiness

- Harmonisation labels V3 (sans numéros de version dans l'UI)
- `/history` : modules techniques repliés
- Apprentissage repliable sur `/`
- Docs bêta + checklist testeurs
- Dette lint documentée (providers hors scope)

---

## Ce qui reste manuel

- Valider / rejeter une action
- Créer plan, espace sécurisé, passation
- Exécuter hors Gigi (Cursor, terminal, humain)
- Coller le rapport d'exécution
- Archiver l'apprentissage
- Accepter la mission suivante
- Toute écriture localStorage métier

**Gigi ne vérifie pas Git, GitHub, ni les fichiers du repo.**

---

## Après V3

**V4.0 — Controlled Real Execution Readiness** (planifié, non codé) :

- Préparation au « Gigi, fais-le » avec garde-fous stricts
- Permissions, sandbox, audit trail, rollback
- Jamais d'autonomie totale au départ

Voir [ROADMAP.md](./ROADMAP.md).
