# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start Vite dev server (http://localhost:5173)
npm run build    # Production build to dist/
npm run lint     # ESLint check
npm run preview  # Preview production build
```

No test suite. The only manual testing path is running the dev server and checking pages visually. Playwright is installed (`npx playwright install chromium`) and can be used for scripted browser checks.

## Architecture: everything is in one file

`src/App.jsx` is the entire application (~1000+ lines). There are no other component files, no CSS files, no utility modules. `src/lifepath-v7.jsx` is an old backup — ignore it.

### File structure inside App.jsx (top to bottom)

1. **Design tokens** — `const T = {...}` — all colors and fonts as a single object. Reference as `T.ac`, `T.bl`, etc. Never hardcode hex colors; use tokens.

2. **Data constants** — `CATS` (8 filter categories), `C` (30 career objects keyed by id), `HORIZON` (30 horizon entries keyed by career id), `LIFE_BRANCHES` (7 life tree branches). Adding a career means adding to both `C` and `HORIZON`.

3. **Module-level helpers** — `CONF_COLORS`, `triggerCelebration(x, y)` (confetti burst via Web Animations API), `loadLS()` / `saveLS(state)` (localStorage read/write).

4. **Root component `LifePath`** — holds all state, wraps everything in `<Ctx.Provider>`. State lives here; pages access it via `useContext(Ctx)`.

5. **Module-level constants** — `BADGES` (12 badge objects with `check(ctx)` predicates), `ONBOARD_CAREER_IDS` (10 career ids offered during onboarding).

6. **`OnboardingFlow` component** — renders before any page when `onboardingDone===false`. 3 steps: name input → career pick → life branch pick. Calls `setUserName`, `setOnboardingDone(true)`, `setTreeBranches`, then navigates to the chosen career.

7. **Page components** — `HomePage`, `ExplorePage`, `CareerPage`, `MilestonePage`, `TreePage`, `TreeCatalogPage`, `TreeBranchPage`, `DailyPage`, `DashboardPage`, `ComparePage`. Each reads from `Ctx`; none accept props.
   - `DashboardPage` — welcome message, hero streak + daily score circle, 4 KPIs (jalons, objectifs cochés, jours actifs, skills), badges grid, active careers, arbre, global progress bar.
   - `ComparePage` — side-by-side table of two careers selected via `compareA`/`compareB` from `ExplorePage`. Requires both to be non-null; shows fallback otherwise.

8. **Helper components** — `HorizonCard` (AI risk / market growth / safety bars, sourced from `HORIZON`), `Sec` (labeled section wrapper).

### Routing

No router library. Navigation is `setPage(id)` where `page` is a `useState` string. The root render is a chain of `page==="x" ? <XPage/> : page==="y" ? ...`. To add a page: add a component, add a case to the render chain, add a `setPage("newpage")` call wherever it should be navigated to.

### Styling

All styles are inline JS objects (`style={{ color: T.ac, padding: 12 }}`). Tailwind CSS is loaded via the Vite plugin but is **not used** by the current codebase — don't add Tailwind classes. Global CSS (only `@keyframes` and scrollbar rules) lives in a single `<style>` JSX tag inside the root component render.

### State and localStorage

All state lives in the `LifePath` root component and flows down via `Ctx` context. Persisted state is flushed to `localStorage` key `"lifepath_v1"` (JSON) via `saveLS()` inside `useEffect` hooks that watch the relevant state variables.

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
  "activeDays": 1
}
```

Separate key `"lifepath_notif_date"` stores the last date a browser push notification was sent.

**Transient state (not persisted):** `notification` (toast string), `compareA`, `compareB` (career objects for side-by-side compare). These reset on page reload.

**Streak & daily score:** `streak` increments when `lastVisit === yesterday`; resets to 1 otherwise. `todayChecks` counts actions taken today (milestones, tree objectives) via `bumpToday()`. Score du jour = `min(100, round(todayChecks / 5 * 100))`. `activeDays` increments once per calendar day visited.

**Notifications:** call `notify(message, durationMs=2500)` from any component via `useCtx()`. Renders a fixed toast at top of screen (z-index 9999), visible even during onboarding.

### Career data shape

Each entry in `C`:
- Top-level: `id`, `e` (emoji), `t` (title), `c` (color from `T`), `cat`, `dur`, `cost`, `lv`, `sal` (`{j,m,s}`), `tag`, `sk[]`, `ss` (safety score 0–100)
- `ms[]` — milestones, each with: `p` (phase name), `d` (duration), `mo` (month range), `i` (emoji), `obj`, `tasks[]`, `dh[]` (daily habits), `res[]` (resources), `val[]` (validation criteria), `sku[]` (skills unlocked), `co` (cost), `cd` (cost detail)

Each entry in `HORIZON` (keyed by career id):
- `ss` (safety score 0–100), `ai` (AI risk 0–100, lower = safer), `gr` (market growth score 0–100), `timeline` (`{y5, y10, y20}`), `threats[]`, `drivers[]`, `verdict`
- Note: the career object itself also carries `c.ss` (safety score). `HORIZON[id]` adds the forward-looking metrics.
