# Gigi V3.4 — Public Beta Readiness

## Résumé V3

Gigi V3 est un **OS mission-first local** pour entrepreneurs et builders :

1. **Mission du jour** (`/`)
2. **Flux d'action** (`/actions`)
3. **Exécution manuelle** (hors app)
4. **Rapport collé** (modules avancés)
5. **Apprentissage** (`/history` + bloc sur `/`)
6. **Suite recommandée** (read-only, tu décides)

Tagline : **« Une action. Aucun bruit. »**

---

## Parcours bêta attendu

```
/  → mission + CTA + apprentissage (replié)
     ↓
/actions  → action dominante + stepper + modules avancés (repliés)
     ↓
(exécution manuelle hors Gigi)
     ↓
/actions  → coller rapport · review · cycle
     ↓
/history  → apprentissage récent + archive
     ↓
/  → prochaine mission recommandée (sans auto-accepter)
```

Conversation : guide vers `/`, `/actions`, `/history` — **n'exécute rien**.

---

## Checklist testeur

### Compréhension (< 5 min)

- [ ] Ouvrir `/` — mission et CTA compris sans lire la doc
- [ ] Comprendre « Pourquoi cette action » et l'étape actuelle
- [ ] Voir le bloc apprentissage (détails repliables)
- [ ] Lire le rappel sécurité (pas d'exécution auto)

### Flux d'action

- [ ] `/actions` — action dominante visible
- [ ] Stepper : étape active identifiable
- [ ] Ouvrir « Modules avancés » — cartes V2 accessibles
- [ ] Ancre `#action-{id}` depuis CTA `/`

### Rapport & apprentissage

- [ ] Coller un rapport (module avancé) — aucune auto-application
- [ ] `/history` — section « Apprentissage récent » lisible
- [ ] Modules techniques repliés par défaut
- [ ] CTAs vers `/` et `/actions`

### Conversation

- [ ] « je fais quoi » → mission, étape, action, route
- [ ] « on a appris quoi » → apprentissage + suite
- [ ] « où cliquer » → orientation `/actions`
- [ ] Aucune impression que Gigi agit seul

### Persistance

- [ ] Recharger la page — données localStorage intactes
- [ ] Aucune sync cloud involontaire

---

## Scénarios manuels documentés

| # | Scénario | Critère de réussite |
|---|----------|-------------------|
| 1 | Première ouverture | Mission + CTA clairs en < 5 s |
| 2 | Aller sur `/actions` | Action dominante + prochain bouton |
| 3 | Modules avancés | Accessibles sans perdre le fil |
| 4 | Coller un rapport | Manuel, pas d'auto-log |
| 5 | Voir apprentissage | Bloc `/` ou `/history` cohérent |
| 6 | Prochaine mission | Recommandation visible, pas auto-acceptée |
| 7 | « je fais quoi » | Réponse structurée + sécurité |
| 8 | Rechargement | État local préservé |

---

## Limites connues (bêta)

- **Pas d'exécution réelle** depuis l'app
- **Pas de vérification Git/GitHub/repo**
- **Pas de sync Supabase** automatique
- **Lint global** : 12 erreurs préexistantes dans providers (hors V3)
- **ConversationPageContent** : warning setState in effect (préexistant)
- Modules V2 nombreux — volontairement repliés, pas supprimés

---

## Dettes restantes (documentées, non bloquantes bêta)

| Zone | Dette | Action V4+ |
|------|-------|------------|
| `GigiProvider` | preserve-manual-memoization | Refactor prudent |
| Providers V2 | setState in useEffect | Pattern queueMicrotask ou init |
| `ConversationPageContent` | ask() in useEffect | Refactor init URL |
| Lint modules non-V3 | unused vars divers | Nettoyage ciblé |

**Aucune correction provider lourde en V3.4** — risque régression.

---

## Sécurité

- Aucune clé API exposée
- Aucune nouvelle clé localStorage V3.4
- Aucune auto-validation / auto-mission / auto-action
- `.env.local` non requis pour la bêta locale

---

## localStorage

Clés protégées — voir spec V3.4 mission. **Aucune migration V3.4.**

---

## Routes à tester

| Route | Focus |
|-------|-------|
| `/` | Command Center + apprentissage |
| `/actions` | Flux V3.2 |
| `/history` | Apprentissage récent |
| `/conversation` | Intents V3 |
| `/projects/[id]` | Hint suite si pertinent |

---

## Conversations à tester

- je fais quoi
- où j'en suis
- où cliquer / je dois cliquer où
- on a appris quoi
- c'est quoi la suite
- mission du jour
- rapport où / cycle où

---

## Bugs

| Sévérité | Description |
|----------|-------------|
| Bloquant bêta | Build fail, crash page principale, perte localStorage |
| Non bloquant | Lint providers, wording mineur, empty states vides |

**État au audit V3.4 : aucun bug bloquant identifié en build statique.**

---

## Décision finale

### **`almost_beta_ready`**

**Justification :**

- Parcours V3 complet, documenté, build OK
- Lint ciblé V3 OK
- UX stabilisée (labels, repliés, CTA cohérents)
- Dette lint providers documentée — non corrigée (risque)
- Validation humaine externe recommandée avant `beta_ready`

**Pour passer à `beta_ready` :**

1. Faire tourner la checklist testeur par 1–2 personnes externes
2. Valider un cycle complet avec vraies données locales
3. Optionnel : corriger lint providers à faible risque

---

## Recommandation après V3.4

**V4.0 — Controlled Real Execution Readiness** : garde-fous pour exécution contrôlée future, sans autonomie totale.

Voir [V3_RELEASE_NOTES.md](./V3_RELEASE_NOTES.md) et [ROADMAP.md](./ROADMAP.md).
