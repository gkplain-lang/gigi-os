# Guide testeur bêta — Gigi

> Document pour une personne externe qui teste Gigi pour la première fois.

---

## C'est quoi Gigi ?

**Gigi** est un OS personnel **mission-first** pour entrepreneurs, créateurs et builders.

Tagline : **« Une action. Aucun bruit. »**

Promesse :

1. Ouvre Gigi → il te dit quoi faire aujourd'hui.
2. Il prépare l'action et la suite.
3. **Tu** exécutes manuellement (hors Gigi).
4. Tu colles un rapport.
5. Gigi apprend localement et recommande la prochaine mission.

---

## Avant de commencer

- Utilise un navigateur récent (Chrome, Firefox, Safari).
- Pas de compte obligatoire pour tester le cœur de l'app.
- Tout est **local** sur ton appareil (localStorage).
- **Aucune exécution automatique** — c'est normal.

Parcours recommandé :

1. [Présentation](/landing)
2. [Démarrer](/onboarding)
3. [Mission du jour](/)
4. [Parcours bêta](/beta)

---

## Les 8 scénarios à tester

### 1. Mission du jour

**Action :** Ouvre `/` et lis la mission proposée.  
**Observer :** Titre clair, raison (« pourquoi cette action »), CTA vers `/actions` ou conversation.

### 2. Action dominante

**Action :** Va sur `/actions`.  
**Observer :** Une action principale, stepper d'étapes, message « rien n'est automatique ».

### 3. Modules avancés

**Action :** Ouvre les sections repliables (détails, modules V2).  
**Observer :** Tu peux approfondir sans perdre le fil principal.

### 4. Rapport d'exécution

**Action :** Après avoir fait quelque chose hors Gigi, colle un rapport dans le flux d'action.  
**Observer :** Intake local — Gigi ne vérifie pas GitHub ni le repo.

### 5. Apprentissage

**Action :** Consulte `/history`.  
**Observer :** Section apprentissage récent, ce que Gigi en tire.

### 6. Suite recommandée

**Action :** Retourne sur `/`.  
**Observer :** Mission suivante ou lien vers action / historique.

### 7. Demander à Gigi

**Action :** Sur `/conversation`, écris « je fais quoi ? ».  
**Observer :** Réponse locale, pilotage V3, pas de promesse d'autonomie.

### 8. Persistance

**Action :** Recharge la page après quelques interactions.  
**Observer :** Tes données locales sont intactes.

---

## Quoi observer (global)

- Clarté de la mission et des CTA
- Moments de confusion ou de dispersion
- Compréhension des limites (pas d'auto-exécution)
- Fluidité mission → action → rapport → suite

---

## Quoi ne pas attendre

| Gigi ne fait pas | Pourquoi |
|------------------|----------|
| Exécuter des commandes | Manuel par design |
| Modifier le repo | Hors scope bêta |
| Appeler GitHub / n8n / email | Pas de connecteurs réels |
| Sync cloud automatique | Local-first |
| Paiement / abonnement | Non implémenté |

---

## Donner un retour

1. **Page bêta** — [/beta](/beta) avec checklist et formulaire local.
2. **Page feedback** — [/feedback](/feedback) pour retours détaillés.

Questions utiles à couvrir dans ton retour :

- La mission était-elle claire ?
- Le CTA était-il évident ?
- À quel moment tu t'es perdu ?
- As-tu compris ce que Gigi **ne** fait pas ?
- Quelle étape t'a bloqué ?

**Aucun envoi automatique** — copie ton retour si tu veux le partager à l'équipe par un canal externe (email, etc.).

---

## Statut bêta actuel

**almost_beta_ready** — V3.4 livrée, V3.5 améliore l'entrée produit.

---

## Contact / suite

Après le test, note tes frictions sur `/beta` ou `/feedback`.  
Merci de tester avec l'esprit « une action, aucun bruit ».
