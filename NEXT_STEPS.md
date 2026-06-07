# NEXT_STEPS.md

## ✅ Complétées (overnight session 2026-06-07)

- **Étape 1** — TreeVisual.jsx (Mode Immersif Final Fantasy) — Canvas starfield + SVG branch nodes
- **Étape 2** — Dashboard amélioré — citations, graphique hebdo, prochaine étape, branches actives
- **Étape 3** — Page Paramètres — toggles immersif/notifs, piliers, prénom, reset, à propos
- **Étape 4** — 20 métiers enrichis à 6 jalons complets chacun (4 groupes de 5)
- **Étape 5** — Piliers de Vie configurables — onboarding step 4, DailyPage, SettingsPage
- **Étape 6** — 8 badges avec détection automatique + confetti au déverrouillage
- **Étape 7** — Arbre de vie amélioré — % global, synergies actives, cartes visuelles, partager
- **Étape 8** — SEO + PWA — meta tags, og:, theme-color, favicon SVG 🌳, manifest.json
- **Étape 9** — Performance — spinner lime, useMemo ExplorePage, localStorage try/catch confirmé
- **Étape 10** — Documentation — CLAUDE.md, NEXT_STEPS.md, README.md

---

## À venir — Priorité haute

### Backend & persistance — Supabase

Remplacer le localStorage par une vraie base de données pour synchroniser la progression entre appareils.

- Créer un projet Supabase, tables : `users`, `progress` (completedMs, treeBranches, treeObjCompleted, pillars), `streaks`
- `loadLS()` / `saveLS()` → remplacer par appels Supabase client (`@supabase/supabase-js`)
- Gérer le mode offline-first : écrire en localStorage en premier, syncer en arrière-plan
- Migration : importer le localStorage existant au premier login

### Auth — authentification utilisateur

- Supabase Auth (email magic link ou Google OAuth)
- Adapter `OnboardingFlow` : si utilisateur connu → skip étapes déjà complétées
- Protéger les routes Dashboard, TreePage
- Stocker `userName` et `pillars` côté Supabase

### Monétisation — Stripe

- Modèle freemium : Free (5 parcours) / Pro (tout)
- Stripe Checkout ou Customer Portal
- Webhook Supabase pour update statut abonnement

## À venir — Priorité normale

### Catalogue étendu — 50 métiers

- 20 parcours supplémentaires dans les catégories sous-représentées : `care`, `trade`, `law`, `science`
- Même schéma 6 jalons que les 30 existants

### Service Worker — offline PWA

- Cache des assets statiques
- Page offline fallback
- Push notifications natives (via service worker)

### Analytics & onboarding

- Tracking d'événements anonyme (Plausible ou umami)
- A/B test du flow onboarding
- NPS après 7 jours d'utilisation
