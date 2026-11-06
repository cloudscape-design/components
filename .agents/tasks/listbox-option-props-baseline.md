# Baseline: listbox option props refactor (feat/add-option-list)

Worktree: `/Users/amanabiy/Documents/components/.worktrees/option-list-rebase`

## 1. Preflight (PASS)

- Branch: `feat/add-option-list`
- HEAD: `f125d7ab0`; origin/feat/add-option-list: `5297ed2ef`; 1 commit ahead
- `git status --short`: empty

## 2. Unit baseline (PASS)

Commands (from worktree root):

```
mise exec node@22.23.2 -- npm run quick-build
TZ=UTC mise exec node@22.23.2 -- npx jest -c jest.unit.config.js src/option-list src/select src/multiselect src/autosuggest src/property-filter src/internal/components/listbox src/internal/components/options-list src/internal/components/selectable-item
```

- quick-build: exit 0 (~22 s)
- Test Suites: 81 passed, 0 failed, 81 total
- Tests: 1211 passed, 0 failed, 1211 total
- Failures: none

## 3. Integ baseline

PENDING. Port 8080 is held by the user's `npm start` from this worktree:

- pid 75818 `npm-run-all --parallel start:watch start:dev`
  - pid 75876 `gulp watch`
  - pid 75886 `webpack serve --config pages/webpack.config.cjs` (listening on `*:8080`, cwd = this worktree)

This is the dev build (`pages/webpack.config.cjs`), not the integ build (`pages/webpack.config.integ.cjs`, which sets `devServer.client: false, hot: false`). The integ setup hardcodes `baseUrl: 'http://localhost:8080'` (`build-tools/integ/setup.integ.js`), so a separate integ server cannot run on another port without editing source. Waiting on the user for direction.

## 4. Integ recipe (partial)

- Chrome: 157.0.8103.26
- ChromeDriver: `/tmp/chromedriver/chromedriver/mac_arm-157.0.8103.15/chromedriver-mac-arm64/chromedriver` (major 157 matches). `@cloudscape-design/browser-test-tools/chrome-launcher` spawns `chromedriver` from `PATH` on port 9515, so prepend its directory to `PATH`.
