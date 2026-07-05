# V5.0 — MVP Product Polish

## 1. Objectif

Transformer Aegis en MVP utilisable, clair et agréable. Priorité : rendre l'expérience évidente en moins de 30 secondes.

## 2. Pourquoi V5.0 existe

Les versions V4.0 à V4.8 ont ajouté beaucoup de modules. V5.0 n'ajoute pas de grosse couche fonctionnelle : elle organise, allège et clarifie autour de la boucle mission-first.

## 3. Ce qui a été simplifié

- Accueil recentré en cockpit mission-first
- Modules techniques V4 regroupés dans un bloc replié (`AdvancedModulesCompact`)
- Navigation réordonnée (mission-first en haut, modules avancés groupés)
- Empty states plus clairs, CTA principaux affirmés

## 4. Nouveau cockpit mission-first

Ordre sur `/` :
1. Hero mission-first (`MissionFocusHero`)
2. Mission du jour (`MissionComposerHomePanel`)
3. Prochaine action (`NextActionCard`) + Revue/décision (`ReviewPromptCard`)
4. Revue de mission (`MissionReviewHomePanel`)
5. Projets prioritaires (`ProjectMomentumStrip`)
6. Modules avancés compacts (repliés)

## 5. Pages polishées

- `/` — cockpit
- SideNav — réordonné + section « Modules avancés »
- Conversation — intent d'orientation « Aegis en 30 secondes »

## 6. Navigation

Ordre : Mission · Projets · Mission du jour · Revue mission · Actions guidées · Actions · Gigi · Décision · Historique. Modules avancés (Revue locale, Packs, Pont manuel, Permissions) groupés en bas.

## 7. Wording

Uniquement wording autorisé : mission prioritaire, prochaine action, revue locale, décision suivante, Gigi prépare, tu valides, aucune exécution réelle.

## 8. Sécurité

Aucune exécution réelle, aucun connecteur, aucun fetch réseau, aucun secret. Couche purement UX réutilisant les données locales existantes.

## 9. Ce que V5.0 ne fait pas

- Aucune nouvelle couche de stockage
- Aucune nouvelle donnée persistée hors action utilisateur existante
- Aucune modification des modèles V4.6/V4.7/V4.8
- Aucune dépendance UI ajoutée

## 10. Tests manuels

1. Ouvrir `/` — comprendre mission/action/revue en < 30s
2. Déplier « Modules avancés »
3. Vérifier NextActionCard / ReviewPromptCard selon l'état
4. Demander à Gigi « résume-moi Aegis » / « je suis perdu »
5. Vérifier navigation réordonnée

## 11. Limites connues

- Cockpit réutilise les composants existants (pas de refonte visuelle totale)
- Réflexion et scoring restent rule-based

## 12. Préparation V5.1

**Gigi Assistant Quality Pass** — amélioration de la qualité des réponses de Gigi (préparation couche assistant).
