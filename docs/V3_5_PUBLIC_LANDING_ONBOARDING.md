# Gigi V3.5 — Public Landing & Onboarding

> **Route B** — Rendre Gigi compréhensible et testable avant V4.

Version: `3.5`  
Status: Implementation (pending commit)  
Branch: `v3.5-public-landing-onboarding`

---

## 1. Objectif

Avant le futur « Gigi, fais-le » (V4), un testeur externe doit pouvoir :

- comprendre ce qu'est Gigi ;
- suivre un onboarding clair ;
- tester le parcours mission-first ;
- savoir ce que Gigi ne fait pas.

**Sans** paiement, auth forcée, cloud, exécution réelle.

---

## 2. Pourquoi Route B avant V4

V3.4 a stabilisé le parcours bêta (`almost_beta_ready`).  
V3.5 ajoute la **couche d'entrée produit** — présentation, découverte, checklist testeur.  
V4 reste le socle permissions / exécution contrôlée (branche séparée).

---

## 3. Livrables V3.5

| Route | Rôle |
|-------|------|
| `/landing` | Présentation produit — promesse, flow, limites |
| `/onboarding` | Guide découverte 5 étapes (sans setup) |
| `/onboarding/setup` | Assistant configuration projets (existant) |
| `/beta` | Checklist testeur, scénarios, statut bêta |
| `/` | Liens discrets vers onboarding / landing / bêta |

---

## 4. Navigation

Section **Découverte** dans la sidebar :

- Présentation → `/landing`
- Démarrer → `/onboarding`
- Bêta → `/beta`

Liens footer : Feedback, Parcours bêta.

---

## 5. localStorage

**Aucune nouvelle clé V3.5.**

- Guide onboarding : état en mémoire React (`useState`)
- Setup projets : `gigi-os-v03-state` (existant)
- Feedback bêta : `gigi-os-v09-beta-feedback` (existant)

---

## 6. Limites

- Pas d'exécution auto
- Pas d'appels externes
- Pas de paiement / checkout
- Pas de modification auth / providers / Supabase
- `/` reste le Mission Command Center

---

## 7. Critères d'acceptation

- [ ] `/landing` explique promesse + limites
- [ ] `/onboarding` guide en 5 étapes
- [ ] `/beta` liste 8 scénarios testeur
- [ ] Navigation vers Mission, Actions, History
- [ ] Build OK, lint ciblé OK
- [ ] Design cohérent (sombre, sobre, existant)

---

## 8. Prochaine étape — V3.6 (non codée)

**V3.6 — Projects Command Center**

- liste projets stratégique ;
- état et prochaine mission par projet ;
- détail projet renforcé ;
- historique et action active par projet.

---

## 9. Références

- [BETA_TESTER_GUIDE.md](./BETA_TESTER_GUIDE.md)
- [V3_4_PUBLIC_BETA_READINESS.md](./V3_4_PUBLIC_BETA_READINESS.md)
