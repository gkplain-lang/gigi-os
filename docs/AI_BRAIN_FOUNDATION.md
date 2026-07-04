# Gigi OS — Fondation Cerveau IA (V0.5)

Version: `0.5.0`  
Status: Foundation — IA optionnelle, fallback local obligatoire  
Purpose: Préparer l'IA sans remplacer le cerveau déterministe.

---

## 1. Rôle de V0.5

V0.5 introduit une **couche IA optionnelle** au-dessus du système existant :

- Comprendre les messages utilisateur
- Proposer une mission plus intelligente (si IA disponible)
- Expliquer priorités et alternatives
- Dire « pas maintenant »
- Préparer le futur système d'agents

**Sans** :

- Remplacer `conversationBrain.ts`
- Remplacer le decision engine
- Exécuter des actions automatiques
- Exposer des clés API côté client

---

## 2. IA optionnelle — local fallback obligatoire

```
Utilisateur → askAiBrain()
                 ├─ IA configurée ? → POST /api/ai/brain (serveur)
                 │                      ├─ succès → AiBrainResponse
                 │                      └─ échec → localFallback
                 └─ non configurée → localFallback (askGigi)
```

L'app **fonctionne identiquement** sans `OPENAI_API_KEY`.

---

## 3. Architecture provider

| Couche | Fichier | Rôle |
|--------|---------|------|
| Config | `aiConfig.ts` | Lit env **serveur uniquement** |
| Safety | `safety.ts` | Bloque actions externes |
| Prompt | `promptBuilder.ts` | Contexte court + JSON strict |
| Fallback | `localFallbackProvider.ts` | `askGigi()` existant |
| Provider | `aiProvider.ts` | Appel `/api/ai/brain` |
| Orchestrator | `aiBrain.ts` | `askAiBrain()` |
| Adapter | `responseAdapter.ts` | AI ↔ conversation UI |

Routes serveur :

- `GET /api/ai/status` — disponibilité (sans secret)
- `POST /api/ai/brain` — inférence OpenAI (si configurée)

---

## 4. Variables d'environnement

Fichier template : `.env.local.example`

```env
AI_PROVIDER=openai
OPENAI_API_KEY=          # serveur uniquement — jamais NEXT_PUBLIC_
AI_MODEL=gpt-4o-mini
```

Règles :

- Clé IA **locale** — ne jamais committer `.env.local`
- Ne **jamais** coller la clé dans le chat Cursor
- Redémarrer `npm run dev` après modification

---

## 5. Sécurité V0.5

- L'IA **suggère** — ne **exécute** pas
- Actions externes bloquées : email, publish, delete, payment, n8n, GitHub API
- Une seule mission prioritaire
- Missions terminées jamais reproposées
- `safety.level` : `safe` | `needs_confirmation` | `blocked`
- Pas de log des prompts complets en production
- Pas de clé dans les logs

---

## 6. Intégration app

| Surface | Comportement |
|---------|--------------|
| `/conversation` | `askAiBrain()` + badge moteur discret |
| `/brain` | Badge IA disponible / local |
| `/dev/ai` | Test provider + sécurité |

localStorage `gigi-os-v03-state` **inchangé** par l'IA.

---

## 7. Ce que V0.5 ne fait pas

- Auto-sync ou auto-restore
- Agents n8n
- Gmail / Calendar / GitHub / Stripe
- Exécution d'actions sensibles
- Remplacement du scoring déterministe sur `/brain`

---

## 8. Pourquoi pas n8n en V0.5

n8n implique des **actions externes** et des webhooks. V0.5 se concentre sur :

1. Comprendre et suggérer
2. Valider la sécurité
3. Garder le fallback local

Les agents et automations arrivent après validation terrain (V0.5.2+).

---

## 9. Plan futur

| Version | Objectif |
|---------|----------|
| V0.5.1 | Raffiner prompts + tests réels OpenAI |
| V0.5.2 | Explications IA enrichies sur `/brain` |
| V0.6+ | Agents contrôlés avec confirmation explicite |

---

## 10. Fichiers V0.5

```
modules/ai/
  types.ts
  aiConfig.ts
  safety.ts
  promptBuilder.ts
  localFallbackProvider.ts
  responseAdapter.ts
  aiProvider.ts
  aiBrain.ts
  useAiAvailability.ts
  index.ts

app/api/ai/status/route.ts
app/api/ai/brain/route.ts
app/dev/ai/
components/ai/AiEngineBadge.tsx
.env.local.example
docs/AI_BRAIN_FOUNDATION.md
```

---

## 11. Tests manuels

1. Sans `OPENAI_API_KEY` : conversation identique au local
2. `/dev/ai` : statut not_configured
3. Avec clé valide : mode IA assistée possible
4. Couper réseau / clé invalide : fallback local
5. Appliquer mission / proposer autre chose : inchangé
6. `.env.local` absent du git status
