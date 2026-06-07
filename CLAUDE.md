# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start Vite dev server (http://localhost:5173)
npm run build    # Production build to dist/
npm run lint     # ESLint check
npm run preview  # Preview production build
```

No test suite. The only manual testing path is running the dev server and checking pages visually.

## Architecture: main file + one component

- **`src/App.jsx`** — the entire application (~1700+ lines). All pages, state, helpers.
- **`src/TreeVisual.jsx`** — standalone immersive tree visualization (Canvas + SVG). Reads localStorage directly (no context import). Props: `{ onBack }`.
- `src/lifepath-v7.jsx` — old backup, ignore.

### File structure inside App.jsx (top to bottom)

1. **Design tokens** — `const T = {...}` — all colors and fonts. Reference as `T.ac`, `T.bl`, etc. Never hardcode hex colors.

2. **Data constants** — `CATS`, `C` (30 career objects), `HORIZON` (30 horizon entries), `LIFE_BRANCHES` (7 life tree branches), `CAREER_LIST = Object.values(C)`.

3. **Module-level helpers** — `CONF_COLORS`, `triggerCelebration(x, y)`, `loadLS()`, `saveLS(state)`.

4. **Root component `LifePath`** — holds all state, wraps everything in `<Ctx.Provider>`. State lives here; pages access via `useCtx()`. Has a 350ms loading spinner on initial mount.

5. **Module-level constants** — `BADGES` (8 badge objects), `ONBOARD_CAREER_IDS`, `PILLARS_DEF` (5 life pillar definitions), `QUOTES` (30 motivational quotes).

6. **`OnboardingFlow` component** — 4 steps: name input → career pick → life branch pick → pillars configuration. Calls `setPillars`, `setUserName`, `setOnboardingDone`, `setTreeBranches`.

7. **Page components** — `HomePage`, `ExplorePage`, `CareerPage`, `MilestonePage`, `TreePage`, `TreeCatalogPage`, `TreeBranchPage`, `DailyPage`, `DashboardPage`, `ComparePage`, `SettingsPage`. Each reads from `Ctx`; none accept props.

8. **Helper components** — `HorizonCard`, `Sec`.

### Routing

No router library. Navigation is `setPage(id)` via `nav(page, career?, milestone?)`. Render chain:
```
page==="treevisual" → <TreeVisual onBack={...}/>
page==="settings"   → <SettingsPage/>
page==="home"       → <HomePage/>
... etc
```

### Styling

All styles are inline JS objects. No Tailwind (installed but unused). Global CSS (only `@keyframes` and utility classes like `.btn`, `.card`, `.tag`, `.fu`) lives in a single `<style>` JSX tag.

### State and localStorage

All state in `LifePath` root, context via `Ctx`. Persisted to `"lifepath_v1"` JSON key.

localStorage schema (`"lifepath_v1"` key):
```json
{
  "completedMs": {},
  "favorites": [],
  "treeBranches": [],
  "treeObjCompleted": {},
  "streak": 1,
  "todayDate": "YYYY-MM-DD",
  "todayChecks": 0,
  "lastVisit": "YYYY-MM-DD",
  "userName": "",
  "onboardingDone": false,
  "activeDays": 1,
  "pillars": null
}
```

Separate localStorage keys: `"lifepath_notif_date"`, `"lp_immersive"`, `"lp_notif"`.

`loadLS()` and `saveLS()` both have try/catch — safe in private mode.

### Career data shape

Each entry in `C`:
- Top-level: `id`, `e` (emoji), `t` (title), `c` (color), `cat`, `dur`, `cost`, `lv`, `sal` (`{j,m,s}`), `tag`, `sk[]`, `ss` (safety score)
- `ms[]` — milestones: `p`, `d`, `mo`, `i`, `obj`, `tasks[]`, `dh[]`, `res[]`, `val[]`, `sku[]`, `co`, `cd`

Each career now has **6 complete milestones** (enriched overnight).

### Pillars

`PILLARS_DEF` defines 5 life pillars: Corps 🏃, Mental 🧠, Social 🤝, Finance 💰, Personnel ✨.

`pillars` state shape: `{ corps: { enabled, goal, emoji, label }, ... }` — null if not configured.

Pillars are configurable in OnboardingFlow step 4 and in SettingsPage. Displayed in DailyPage below career tasks.

### Badges

`BADGES` — 8 badges with `check(ctx)` predicates:
- ✓ Premier pas, 🏁 Cap franchi, 🔥 Sur la lancée, ⭐ Momentum
- ✦ Co-piloté (always true), ◉ Profil complet, 🗺️ Explorateur, 🌐 Caméléon

DashboardPage fires `triggerCelebration()` when new badges are unlocked (via useRef + useEffect).

### TreeVisual.jsx

Standalone component with Canvas API (150 star particles) + SVG overlay (branch nodes). Reads localStorage directly via `loadData()`. Props: `{ onBack }`. Exported as default.
