# Gigi OS — Qualité décisionnelle IA (V0.5.3)

Version: `0.5.3`  
Status: Contrat de décision structuré — IA assistée + fallback local  
Purpose: Gigi donne toujours une décision claire, actionnable et unique.

---

## 1. Objectif V0.5.3

Gigi OS est un **cockpit de décision mission-first**.

Promesse : *« Ouvre Gigi. Sache quoi faire. Exécute. »*

V0.5.3 garantit que chaque réponse (IA ou fallback local) vise ce format :

1. **Mission prioritaire du jour** — une seule
2. **Pourquoi cette mission** — justification courte
3. **3 tâches concrètes** — exactement trois
4. **Ce qu'il faut ignorer aujourd'hui** — liste `notNow`
5. **Risque principal** — si la mission n'est pas faite
6. **Prochaine étape** — après exécution

Gigi **n'est pas une todo-list**. Il choisit, tranche et réduit la dispersion.

---

## 2. Contrat de décision

Module : `modules/ai/decisionQuality/`

| Fichier | Rôle |
|---------|------|
| `decisionContract.ts` | Règles + schéma JSON attendu |
| `decisionFormatter.ts` | Normalise tâches, risque, prochaine étape |
| `decisionValidator.ts` | Vérifie le contrat post-réponse |
| `decisionFallback.ts` | Répare ou bascule fallback local |
| `decisionQualitySummary.ts` | Résumé pour `/dev/ai` |

Type principal : `GigiDecisionContract` (voir `types.ts`).

---

## 3. Pipeline

```
askAiBrain()
  → enrichAiBrainRequest()        # projet explicite V0.5.1
  → OpenAI ou fallback local
  → applyProjectIntentGuard()     # V0.5.1
  → applyDecisionQuality()        # V0.5.3
      ├─ enrichAiBrainDecision()
      ├─ validateDecisionQuality()
      ├─ repair si incomplet
      └─ fallback local si toujours faible
  → aiBrainToGigiResponse()        # UI /conversation
```

---

## 4. Garde-fous

Conservés de V0.5 / V0.5.1 / V0.5.2 :

- Projet explicite (Buildy Crafts, Linko, Buildy Clear…)
- `AI_PROJECT_MISMATCH`
- Contexte mémoire borné
- Missions terminées exclues
- Pas de sync / restore automatique
- Pas d'action externe
- `OPENAI_API_KEY` serveur uniquement

Ajouts V0.5.3 :

- Validation 3 tâches, notNow, risque, prochaine étape
- Blocage des claims « j'ai synchronisé / restauré »
- Enrichissement automatique du fallback local

---

## 5. Fallback local

Si l'IA est absente, indisponible ou produit une réponse faible :

1. `askGigi()` (cerveau local existant)
2. `enrichAiBrainDecision()` complète risque + prochaine étape + 3 tâches
3. L'expérience `/conversation` reste fonctionnelle sans clé OpenAI

---

## 6. Intégration UI

| Surface | Changement |
|---------|------------|
| `/conversation` | Affiche risque + prochaine étape (champs existants enrichis) |
| `/dev/ai` | Panneau « Decision Quality » |
| `/brain` | Inchangé (decision engine local) |

Pas de refonte design — ajouts textuels dans le panneau Gigi existant.

---

## 7. Tests manuels

1. **Sans clé IA** : `/conversation` → fallback local structuré
2. **Avec clé IA** : `/dev/ai` → contrat complet = Oui
3. « Gigi, choisis ma mission prioritaire du jour » → une mission claire
4. « Que faire dans Buildy Crafts aujourd'hui ? » → `buildy-crafts`
5. « Que faire dans Linko aujourd'hui ? » → `linko`
6. « Je veux gagner de l'argent rapidement » → Buildy Clear possible
7. Vérifier 3 tâches, quoi ignorer, risque, prochaine étape
8. `.env.local` absent du git status

```bash
npm run build
```

---

## 8. Futur

| Version | Objectif |
|---------|----------|
| V0.6 | Agents contrôlés avec confirmation explicite |
| V0.6+ | n8n / automations — jamais sans garde-fous |

Voir aussi : `docs/AI_BRAIN_FOUNDATION.md`, `docs/AI_MEMORY_CONTEXT.md`
