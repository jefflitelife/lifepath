# NEXT_STEPS.md

Fonctionnalités restantes à implémenter, par priorité décroissante.

## Backend & persistance — Supabase

Remplacer le localStorage par une vraie base de données pour synchroniser la progression entre appareils.

- Créer un projet Supabase, tables : `users`, `progress` (completedMs, treeBranches, treeObjCompleted), `streaks`
- `loadLS()` / `saveLS()` → remplacer par appels Supabase client (`@supabase/supabase-js`)
- Gérer le mode offline-first : écrire en localStorage en premier, syncer en arrière-plan
- Migration : importer le localStorage existant au premier login

## Auth — authentification utilisateur

Permettre de retrouver sa progression sur n'importe quel appareil.

- Supabase Auth (email magic link ou Google OAuth)
- Adapter `OnboardingFlow` : si utilisateur connu → skip étapes déjà complétées
- Protéger les routes qui nécessitent un compte (Dashboard, TreePage)
- Stocker `userName` côté Supabase plutôt qu'en localStorage

## Monétisation — Stripe

Modèle freemium : parcours de base gratuits, parcours premium et fonctions avancées payants.

- Intégrer Stripe Checkout ou Stripe Customer Portal
- Définir les tiers : Free (5 parcours, arbre limité) / Pro (tout débloquer)
- Gate côté client sur `DashboardPage` et `ComparePage` pour les non-abonnés
- Webhook Supabase pour mettre à jour le statut abonnement en temps réel

## TreeVisual — arbre de vie visuel

Remplacer la grille de cartes `TreePage` par une visualisation en arbre SVG ou Canvas.

- Nœuds = branches (`treeBranches`), reliés par les `connections` de `LIFE_BRANCHES`
- Nœuds actifs colorés, nœuds verrouillés en grisé
- Cliquer un nœud → `nav("treebranch")` avec la branche sélectionnée
- Animation de "croissance" quand une nouvelle branche est ajoutée (Web Animations API, cohérent avec `triggerCelebration`)

## Catalogue étendu — 50 métiers

Passer de 30 à 50 parcours dans `C` et `HORIZON`.

- 20 parcours supplémentaires à ajouter dans les catégories sous-représentées : `care`, `trade`, `law`, `science`
- Chaque entrée suit le même schéma (voir section "Career data shape" dans CLAUDE.md)
- Ajouter les entrées correspondantes dans `HORIZON` (champs `ss`, `ai`, `gr`, `timeline`, `verdict`)
- Mettre à jour `CAREER_LIST` (dérivé de `Object.values(C)`) — aucun autre changement nécessaire
