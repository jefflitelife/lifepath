# LifePath 🌳

**Ton GPS de vie.** Explore des parcours de carrière, cultive ton arbre de vie, et progresse chaque jour vers la meilleure version de toi-même.

**Live** : [lifepath.vercel.app](https://lifepath.vercel.app)

---

## Stack technique

| Couche | Technologie |
|--------|-------------|
| UI | React 18 (JSX) |
| Build | Vite |
| Styles | Inline JS objects (no CSS framework) |
| Fonts | Syne + DM Sans (Google Fonts) |
| Persistance | localStorage (`lifepath_v1`) |
| Déploiement | Vercel (auto-deploy sur push `master`) |

Pas de router, pas de Redux, pas de backend.

---

## Lancer en local

```bash
# Cloner
git clone https://github.com/jefflitelife/lifepath.git
cd lifepath

# Installer
npm install

# Démarrer (http://localhost:5173)
npm run dev

# Build production
npm run build
```

---

## Structure des fichiers

```
lifepath/
├── public/
│   └── manifest.json        # PWA manifest
├── src/
│   ├── App.jsx              # Application complète (~1700 lignes)
│   ├── TreeVisual.jsx       # Mode Immersif Final Fantasy (Canvas + SVG)
│   └── main.jsx             # Point d'entrée React
├── index.html               # SEO, meta tags, favicon SVG 🌳
├── CLAUDE.md                # Guide architecture pour Claude Code
├── NEXT_STEPS.md            # Roadmap
└── README.md                # Ce fichier
```

### Organisation de App.jsx (top → bottom)

1. Design tokens `T` — couleurs et polices
2. Données — `C` (30 carrières), `HORIZON`, `LIFE_BRANCHES`, `CAREER_LIST`
3. Helpers — `triggerCelebration`, `loadLS`, `saveLS`
4. Composant root `LifePath` — tout le state, `<Ctx.Provider>`
5. Constantes — `BADGES` (8), `PILLARS_DEF` (5), `QUOTES` (30)
6. `OnboardingFlow` — 4 étapes : prénom → carrière → branche → piliers
7. Pages — Home, Explore, Career, Milestone, Tree, TreeCatalog, TreeBranch, Daily, Dashboard, Compare, Settings
8. Helpers — `HorizonCard`, `Sec`

---

## Fonctionnalités

### Parcours de carrière
- 30 métiers dans 8 catégories (tech, santé, commerce, art...)
- Chaque carrière : 6 jalons complets avec tâches, habitudes, ressources, coûts, compétences
- Comparateur côte à côte (ComparePage)
- Horizon IA : score de sécurité, risque IA, croissance marché, timeline 5/10/20 ans

### Arbre de Vie
- 7 branches de vie (sport, finances, créativité, parentalité, écologie...)
- Niveaux à débloquer (75% d'un niveau pour passer au suivant)
- Synergies entre branches (connexions déclenchées)
- Indicateur de progression global %
- Bouton "Partager mon arbre" (copie le texte)
- Mode Immersif Final Fantasy (Canvas starfield + SVG orbiting nodes)

### Piliers de Vie
- 5 piliers configurables : Corps 🏃, Mental 🧠, Social 🤝, Finance 💰, Personnel ✨
- Objectif hebdomadaire par pilier
- Affiché dans Ma Journée et Paramètres

### Dashboard
- Streak, score du jour, KPIs globaux
- Citation motivationnelle du jour (30 citations)
- Graphique hebdomadaire d'activité
- Prochaine étape mise en évidence
- 8 badges avec confetti au déverrouillage

### PWA
- Installable sur mobile (manifest.json)
- Notifications navigateur à 9h (si autorisées)
- Fonctionne en mode privé (localStorage try/catch)

---

## Design System

```js
T.bg  = "#070709"   // Fond principal
T.ac  = "#C8FF00"   // Accent lime
T.sf  = "#0f0f12"   // Surface card
T.tx  = "#EEEAE0"   // Texte principal
T.mt  = "#5a5a6e"   // Texte secondaire
T.fd  = "'Syne', sans-serif"    // Titres
T.fb  = "'DM Sans', sans-serif" // Corps de texte
```

---

## Roadmap

Voir [NEXT_STEPS.md](./NEXT_STEPS.md) pour la roadmap complète.

Prochaines priorités : Supabase backend, Auth, Stripe freemium, 50 métiers.

---

*Construit avec Claude Code · Déployé sur Vercel*
