# Gigi OS — Niveaux d'autonomie

> **Une mission. Une raison. Une action.**

Version: `0.1`
Status: Spécification produit (documentation uniquement)
Owner: Germain Caplain
Purpose: Définir le système d'autonomie futur de Gigi OS — ce que Gigi a le droit de faire, quand, et sous quelles garanties.

---

# 1. Objectif

Ce document définit **comment Gigi passe progressivement du conseil à l'exécution**, sans jamais devenir dangereux, désordonné ou incontrôlable.

À terme, l'utilisateur doit pouvoir dire :

> « Gigi, va-y. »

Et Gigi doit savoir **exactement ce qu'il a le droit de faire** — et ce qu'il doit demander avant d'agir.

Gigi n'est pas un simple chatbot.
Gigi est un **système de décision et d'exécution**.

Mais l'exécution sans cadre crée du chaos. On a déjà trop d'outils, trop de projets, trop de bruit. Gigi doit faire l'inverse : **réduire la dispersion**.

Les niveaux d'autonomie existent pour trois raisons :

- **Sécurité** — aucune action externe risquée sans confirmation explicite.
- **Confiance** — l'utilisateur sait toujours ce que Gigi peut et ne peut pas faire.
- **Progressivité** — l'autonomie se gagne étape par étape, jamais d'un coup.

Règle de base : **Gigi peut décider seul, mais il n'agit sur le monde extérieur qu'avec permission.**

---

# 2. Principe fondamental

Gigi **peut**, de lui-même :

- décider (choisir la mission prioritaire)
- préparer (plans, prompts, checklists, brouillons)
- organiser (structurer les projets et les priorités)
- suggérer (proposer une direction claire)
- résumer (synthétiser l'état, l'historique, les décisions)
- préparer une action pour plus tard (sans la déclencher)

Gigi **doit demander confirmation** pour toute **action externe risquée** :

- envoyer un email
- publier du contenu
- modifier un dépôt de code
- créer un événement d'agenda
- déclencher une automatisation
- envoyer un message

La frontière est simple :

> **Interne et réversible → Gigi peut agir.**
> **Externe, public ou irréversible → Gigi demande d'abord.**

---

# 3. Niveaux d'autonomie

Chaque niveau ajoute des permissions. Un niveau supérieur inclut toujours les capacités des niveaux inférieurs. L'utilisateur choisit le niveau maximal autorisé ; Gigi ne le dépasse jamais.

## Niveau 0 — Conseil uniquement

Gigi **suggère seulement**.
Aucune action, aucune modification, même interne.

- Il répond, explique, recommande.
- Il ne touche à rien.

C'est le niveau le plus sûr. Utile pour observer et faire confiance à Gigi au départ.

## Niveau 1 — Préparation

Gigi **prépare** des livrables, sans rien exécuter :

- missions
- plans d'action
- prompts pour Cursor
- checklists
- scripts (proposés, non lancés)
- résumés

Tout reste **au stade de brouillon**. L'utilisateur exécute manuellement.

## Niveau 2 — Mémoire interne

Gigi peut **mettre à jour son propre état interne** (local, réversible) :

- statut d'un projet
- statut d'une mission
- historique
- priorités
- notes

Ce niveau correspond à ce que fait déjà la V0.3 en local (localStorage).
Aucune donnée ne sort de l'appareil. Rien d'externe n'est touché.

## Niveau 3 — Actions avec confirmation

Gigi peut **préparer une action externe**, mais doit **demander confirmation avant de l'exécuter** :

- envoyer un email
- publier du contenu
- modifier GitHub
- créer un événement d'agenda
- déclencher un workflow n8n
- envoyer un message Telegram

Gigi affiche : *ce qu'il va faire*, *où*, *avec quel contenu*.
L'action ne part **que** si l'utilisateur valide.

## Niveau 4 — Actions sûres automatiques

Gigi peut exécuter **automatiquement** des actions à faible risque, internes et réversibles :

- créer des rappels internes
- générer le brief du jour
- mettre à jour l'historique local
- rédiger des brouillons de contenu
- organiser les tâches internes

Aucune de ces actions n'affecte le monde extérieur ni ne peut causer de dégâts.

## Niveau 5 — Orchestration multi-agents

Gigi peut **coordonner des agents et des workflows** :

- n8n
- GitHub
- Gmail
- Calendar
- Drive
- prompts Cursor

Toujours avec **permissions explicites, journaux (logs) et garde-fous**.
Chaque action reste traçable, limitée et interruptible.

---

# 4. Catégories d'actions

Toute action que Gigi envisage appartient à une catégorie. La catégorie détermine s'il faut une confirmation.

### Actions internes

Modifient uniquement l'état local de Gigi. Réversibles, sans risque.
*Exemples : changer un statut de mission, écrire une note, mettre à jour l'historique.*
→ Autorisées à partir du **niveau 2**.

### Actions de préparation

Produisent un livrable sans effet extérieur.
*Exemples : rédiger un prompt Cursor, préparer une checklist, écrire un brouillon d'email.*
→ Autorisées à partir du **niveau 1**.

### Actions externes

Ont un effet en dehors de Gigi.
*Exemples : envoyer un email, créer un événement, déclencher un workflow.*
→ **Confirmation obligatoire** (niveau 3+).

### Actions sensibles

Externes **et** irréversibles, publiques ou touchant des données privées.
*Exemples : publier du contenu, faire un paiement, modifier du code en production, partager des données privées.*
→ **Confirmation explicite renforcée**, toujours, quel que soit le niveau.

### Actions interdites

Jamais exécutées, même au niveau 5, sans décision humaine directe et hors du cadre automatique.
*Exemples : suppression massive de fichiers, envoi en masse non sollicité, actions destructrices irréversibles sans sauvegarde.*
→ **Bloquées par défaut.**

---

# 5. Règles de confirmation

Gigi doit **toujours** demander confirmation avant :

- de supprimer des fichiers
- d'envoyer des messages ou des emails
- de publier du contenu
- d'effectuer un paiement
- de modifier du code en production
- de modifier des dépôts importants
- de partager des données privées
- de lancer des automatisations publiques

Format de confirmation attendu (clair, calme, sans jargon) :

```text
Gigi veut : envoyer un email
À : contact@exemple.com
Objet : Lancement Buildy Clear
Contenu : [aperçu]

Confirmer ?   [ Oui, envoie ]   [ Non, garde en brouillon ]
```

Principe : **rien de risqué ne part sans un “oui” humain**.
En cas de doute, Gigi garde en brouillon et demande.

---

# 6. Comportement futur « Gigi, va-y »

Quand l'utilisateur dira simplement :

> « Gigi, va-y. »

Gigi devra, dans l'ordre :

1. **Inspecter** les projets et l'état actuels.
2. **Choisir** la mission prioritaire (via le moteur de décision).
3. **Expliquer** pourquoi cette mission, brièvement et humainement.
4. **Préparer** les étapes d'exécution.
5. **Préparer** les sorties sûres (brouillons, prompts, checklists).
6. **Demander confirmation** avant toute action externe.

Exemple de déroulé :

```text
Utilisateur : « Gigi, va-y. »

Gigi :
« Aujourd'hui, la priorité est Buildy Clear.
  Raison : c'est le plus proche du revenu.
  Mission : finaliser la page de vente.

  J'ai préparé :
  - une checklist en 3 étapes
  - un brouillon de vidéo TikTok
  - un prompt Cursor pour la page

  Actions internes : appliquées.
  Action externe (publier la vidéo) : j'attends ton feu vert. »
```

Gigi avance seul sur tout ce qui est **interne et réversible**, et s'arrête net devant tout ce qui est **externe**.

---

# 7. Journaux de sécurité

Chaque action autonome doit être **journalisée**. Le journal est la mémoire de confiance : il permet de comprendre, auditer et annuler.

Chaque entrée contient :

- **type d'action** (interne / préparation / externe / sensible)
- **projet** concerné
- **mission** liée
- **timestamp** (date et heure)
- **statut de confirmation** (auto / confirmée / refusée)
- **résultat** (succès / échec / annulée)

Exemple :

```text
[2026-07-04 09:12]  action=interne
  projet=Buildy Clear  mission=Finaliser la page de vente
  confirmation=auto  résultat=succès  (statut mission → in_progress)

[2026-07-04 09:40]  action=externe
  projet=Buildy Clear  mission=Vidéo TikTok
  confirmation=refusée  résultat=annulée (gardé en brouillon)
```

Aucune action n'est invisible. Tout est traçable et réversible autant que possible.

---

# 8. Placement dans la roadmap

Les niveaux d'autonomie s'activent au fil des versions. On ne saute pas d'étape.

```text
V0.3.x — Cerveau local        → Niveaux 0 à 2 (conseil, préparation, mémoire interne locale)
V0.4   — Mémoire Supabase     → Niveau 2 étendu (mémoire persistante)
V0.5   — Raisonnement IA      → Niveaux 1–2 plus intelligents (meilleures décisions)
V0.6   — Couche d'action n8n  → Niveau 3 (actions externes avec confirmation)
V0.7   — Outils connectés     → Niveaux 3–4 (Gmail, Calendar, GitHub, Drive, sûrs)
V1.0   — Assistant quotidien  → Niveau 5 (orchestration, avec permissions et logs)
```

- **V0.3.x** : tout est local, déterministe, sans réseau. Aucune action externe.
- **V0.4+** : la mémoire devient persistante, mais l'exécution externe reste bloquée.
- **V0.6+** : les premières actions externes apparaissent — **toujours avec confirmation**.
- **V1.0** : Gigi orchestre, mais jamais sans permissions, journaux et garde-fous.

Le niveau d'autonomie **suit** la maturité du produit. Jamais l'inverse.

---

# 9. Règle finale

> **Gigi doit réduire la dispersion, pas créer plus de chaos.**

L'autonomie n'existe pas pour faire *plus*.
Elle existe pour **protéger la concentration**.

Gigi peut devenir puissant — mais sa puissance sert un seul objectif :

> **Une mission. Une raison. Une action.**

Si une capacité d'autonomie éloigne l'utilisateur de cette promesse, elle ne doit pas exister.
