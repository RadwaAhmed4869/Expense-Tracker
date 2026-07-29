# CLAUDE.md

Standing guidance for working in this repo. Task-specific plans live separately in `.claude/plans` — this file is the durable, cross-session baseline.

## Guardrails (read first)

- No backend. Everything is client-side React + `localStorage`. Don't introduce a server/API without an explicit ask.
- `expenses` (the transaction list) is **not persisted** — it resets to `dummyExpenses` on refresh, by design. Only game state (XP/level/streak/budgets/quests/badges), theme, and language persist to `localStorage`.
- Every user-facing string must go through `t("key")` from `useLanguage()` — never hardcode English (or any) text in JSX. Add new keys to **both** `en` and `ar` blocks in `src/i18n/translations.js` in the same edit.
- Any bare "number / number" or "number - number" string rendered inside RTL-flowing text needs `dir="ltr"` on its wrapping element, or it visually reverses under Arabic (see `QuestsPanel.js`'s progress span). Letters (e.g. "XP") act as a strong-direction anchor and don't need this; pure digit+punctuation runs do.
- Quest/badge display text (titles, descriptions) must be computed from translation keys **at render time** from structured data (`type`, `target`, `category`), never baked into stored objects — anything written to `localStorage` needs to survive a language switch.
- Category enum is fixed: `food | health | clothes | hobby | electronics`. It's defined once in `src/utils/questDefinitions.js` (`EXPENSE_CATEGORIES`) — import it, don't re-hardcode the list.

## Project overview

A gamified expense tracker: a standard "log expenses, filter by year" app layered with a lightweight budgeting game (XP, levels, streaks, quests, budgets, badges). The whole UI lives in one `100dvh` viewport, no outer page scroll: GameBar + Quests/Budget/Badges fill the top half, Add Expense + Recent Expenses fill the bottom half side-by-side, and each panel scrolls internally if its content overflows.

- **Stack**: Create React App (`react-scripts` 5), React 18, plain CSS (no Tailwind/CSS-in-JS/CSS modules), `@fortawesome/*` (installed, mostly unused), deployed via `gh-pages`. `react-csv` remains in `package.json` but is currently unused (the chart/CSV-export feature was removed) — a candidate for uninstalling if nothing picks it back up.
- **State management**: no Redux/Zustand. Three React Contexts, each with its own `useReducer` or `useState` + `localStorage` sync:
  - `GameContext` (`src/context/GameContext.js`) — XP, level, streak, budgets, quests, unlocked badges, toast queue. Reducer-based; business logic lives in pure functions in `src/utils/gameLogic.js`, not inline in the reducer.
  - `ThemeContext` — `'dark' | 'light'`, toggles a `data-theme` attribute on `<html>`.
  - `LanguageContext` — `'en' | 'ar'`, toggles `dir`/`lang` on `<html>`, exposes `t(key, params)`.
  - `expenses` itself stays as plain `useState` in `App.js`, prop-drilled down — not in Context, since only one subtree needs it.
- **Provider nesting** (`src/index.js`): `ThemeProvider > LanguageProvider > GameProvider > App`.
- **Persistence** (`src/utils/storage.js`): small `loadX`/`saveX` pairs per concern, each wrapped in try/catch, each its own `localStorage` key namespaced `expense-tracker:<thing>`. Follow this exact pattern for any new persisted concern rather than inventing a new one.
- **Theming**: CSS custom properties defined in `src/index.css` under `:root` (dark defaults) and `:root[data-theme="light"]` (overrides). Every color in every component CSS file should reference a `var(--color-*)`, never a hex/rgb literal, so both themes stay correct automatically.
- **i18n**: flat key-value dictionaries per language in `src/i18n/translations.js`, `{token}`-style interpolation via `interpolate()`. No nested namespaces, no ICU plurals — keep it simple and flat.
- **RTL**: driven entirely by the `dir` attribute + CSS logical properties (`margin-inline-end`, `inset-inline-end`, `text-align: start/end`) rather than physical `left`/`right`, so the mirroring is automatic. Physical `left`/`right` should be a deliberate, called-out exception (e.g. a control intentionally pinned to one visual corner regardless of language), not a default.

## Conventions

- **Folder structure**: `src/components/<Group>/<Name>.js` + co-located `<Name>.css` (one CSS file per component, imported directly in the JS file). Groups seen so far: `UI`, `Expenses`, `NewExpense`, `Game`, `Tour`. Cross-cutting logic goes in `src/context/`, `src/utils/`, `src/i18n/` — not inside a component folder.
- **Full-height panel pattern**: every top-level panel (`QuestsPanel`, `BudgetSettings`, `BadgesShelf`, `NewExpense`, `Expenses`) is a `Card` laid out as `flex: 1 1 0; min-height: 0; display: flex; flex-direction: column`, with a `flex: 0 0 auto` `<h2 className="panel-title">` header and a `flex: 1; min-height: 0; overflow-y: auto` body div. New panels should follow this exact shape so they compose correctly inside the `100dvh` layout instead of growing past the viewport.
- **Component style**: functional components, `props.x` access style predominates in older files (not destructured), newer files mix destructuring — either is fine, match the file you're editing.
- **Exports**: default export per component file.
- **IDs**: use `crypto.randomUUID()` for any new entity id (budgets, quests, toasts already do this) — don't reintroduce `Math.random().toString()`.
- **Money/amounts**: always store and compare as numbers (`parseFloat`), never raw form-input strings — a prior bug had amounts stored as strings, breaking sums.
- **Adding a new persisted/global concern**: mirror the existing Context pattern — a `src/context/XContext.js` with a provider, a `useX()` hook that throws if used outside the provider, lazy `useReducer`/`useState` init from a `loadX()` call, and a `useEffect` that calls `saveX()` on every state change.
- **Adding new UI copy**: add the key to both `en` and `ar` in `translations.js` in the same commit/edit as the component change — never leave one language stale.
- **Comments**: none by default; only for non-obvious *why* (a workaround, a subtle invariant), never restating *what* the code does.

## Verifying layout/visual changes against a reference image

When a task includes a reference screenshot (a design mockup, an annotated wireframe, etc.), don't stop after one pass:

1. Take a screenshot of the actual running app (see the Playwright approach under "Known gotchas" below) — never a separate static mockup.
2. Compare section-by-section against the reference: spacing/padding, alignment, colors (should trace back to a `var(--color-*)`, not a literal), overflow/scroll behavior, responsive breakpoints.
3. Fix every mismatch found, in the real components/CSS.
4. Re-screenshot and compare again.
5. Repeat at least 2 comparison rounds (in both light and dark theme, since this app's colors are theme-driven) before calling the change done.

This is the same discipline `.claude/rules/website-design.md` describes for one-off Tailwind/Puppeteer static mockups, adapted here for this app: no Tailwind CDN, no standalone `index.html`, no new dependencies — verification always targets the real component tree via the existing headless-Playwright script approach.

## Known gotchas from this session

- CRA's default `react-scripts start` fails silently-ish with "Something is already running on port 3000" if a prior dev server wasn't cleanly killed — check `netstat -ano | grep 3000` and `taskkill //PID <pid> //F` before restarting if you see this.
- `Card.js` originally didn't spread rest props — if you need to pass `data-*`/`id`/etc. through a `Card`, check it currently supports that before assuming it does.
- The date `<input type="date">` in `ExpenseForm.js` has its `max` bound to "today" (computed live) — don't hardcode a future/past year here again; it silently blocks all submissions past that date with no visible error beyond the browser's native tooltip.
- Verifying UI changes in this sandboxed environment: no system browser available. Use a headless Playwright script (installed ad hoc into the scratchpad dir, not the project's `package.json`) driven via a throwaway `.js` file + `node`, screenshot, then read the screenshot image back — there is no `chromium-cli` tool available here.
