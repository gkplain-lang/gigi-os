# Gigi V4.2 — Real Connector Sandbox / Manual Bridge

> **Phrase produit V4.2 :** « Gigi prépare le pont manuel — tu copies, tu valides, tu lances hors Gigi. »

Version: `4.2`  
Status: Implemented (sandbox / manual bridge — no real execution)  
Branch: `v4.2-real-connector-sandbox-manual-bridge`

---

## 1. Objectif

Préparer la transition post-V4.1 avec une couche **sandbox connecteurs** et **pont manuel d'exécution** — sans activer aucun connecteur réel.

Gigi peut :

- lister les connecteurs sandbox (shell, git, GitHub, n8n, etc.) — tous **non actifs** ;
- générer des **paquets d'exécution manuelle** (étapes, commandes copiables, rollback) ;
- relier un paquet à une permission V4.1 ;
- tracer un journal local ;
- exporter en JSON.

Gigi ne peut **pas** en V4.2 :

- exécuter shell, Git, GitHub, n8n, API, email, calendrier ;
- stocker secrets, tokens ou credentials ;
- activer un connecteur ;
- auto-approuver ou créer une permission permanente.

---

## 2. Ce que V4.2 ajoute

| Fonctionnalité | Description |
|----------------|-------------|
| Registry sandbox | 9 connecteurs documentés, statut `manual_bridge_only` |
| Manual Execution Packet | Paquet local avec checklist, étapes, texte copiable |
| Génération depuis permission | CTA « Préparer un paquet manuel » depuis V4.1 |
| Expiration packets | TTL 7 jours, sync au chargement |
| Export JSON | Paquet ou état complet — téléchargement manuel |
| Route `/manual-bridge` | Panel complet |
| Intégrations | `/actions`, `/permissions`, `/settings`, `/history`, conversation |

---

## 3. Ce que V4.2 ne fait pas

- Exécution réelle ou connecteur actif
- Appels réseau (fetch, GitHub API, n8n, etc.)
- Stockage de secrets (noms autorisés, jamais valeurs)
- Scheduler / background job
- Sync cloud
- Modification Supabase, auth, providers, paiement

---

## 4. Registry connecteurs sandbox

Chemin : `modules/executionReadiness/manualBridgeRegistry.ts`

Connecteurs : shell, file_write, git, github, n8n, browser, email, calendar, external_api.

Tous : `manual_bridge_only` — connecteur non actif.

---

## 5. Manual execution packets

Chemin : `modules/executionReadiness/manualBridgePackets.ts`

Statuts : `draft`, `ready_for_human_review`, `copied_by_human`, `marked_done_by_human`, `cancelled`, `expired`.

« Marqué fait par l'humain » = déclaration locale — Gigi ne vérifie pas l'exécution.

---

## 6. Pourquoi aucun connecteur réel

V4.2 pose le contrat produit avant toute activation connecteur : validation humaine, sandbox, audit local, zéro autonomie dangereuse. V4.3+ pourra explorer des adaptateurs locaux contrôlés.

---

## 7. Secrets : noms uniquement

Les paquets peuvent lister `GITHUB_TOKEN (nom seulement — jamais stocké dans Gigi)` — **jamais** la valeur.

---

## 8. Relation avec V4.1

- Même clé localStorage : `gigi-os-v40-execution-readiness`
- Champ étendu : `manualBridgePackets[]`
- Création paquet depuis une `ExecutionReadinessRequest`
- Audit `manual_packet_created` sur la request source

---

## 9. Export JSON local

- État : `gigi-manual-bridge-v4-2-YYYY-MM-DD.json`
- Paquet : `gigi-manual-packet-{id}.json`
- Aucun envoi réseau

---

## 10. Tests manuels

1. Ouvrir `/manual-bridge` — registry + stats
2. Créer un paquet manuel
3. Depuis `/permissions` — détail permission → « Préparer un paquet manuel »
4. Copier une instruction — marquer « copié par l'humain »
5. Marquer « fait par l'humain » — vérifier audit
6. Export JSON paquet et état complet
7. `/actions` — embed pont manuel
8. `/settings` — résumé V4.2
9. `/history` — journal pont manuel
10. Conversation : « prépare un paquet manuel », « quels connecteurs »
11. Recharger — persistance localStorage

---

## 11. Limites connues

- Expiration au chargement — pas de cron
- Connecteurs listés mais non branchés
- Vérification d'exécution réelle : jamais en V4.2

---

## 12. Préparation V4.3

**First Controlled Local Adapter / Human-Launched Command Packs** — adaptateurs locaux strictement contrôlés, toujours lancés par l'humain hors Gigi ou via validation explicite.

Voir [ROADMAP.md](./ROADMAP.md).

---

## 13. Références

- [V4_1_EXECUTION_PERMISSION_CENTER.md](./V4_1_EXECUTION_PERMISSION_CENTER.md)
- [V4_EXECUTION_POLICY.md](./V4_EXECUTION_POLICY.md)
- [ROADMAP.md](./ROADMAP.md)
