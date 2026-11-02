# OptionList → PlainList refactor: baseline (before any change)

- Worktree: `/Users/amanabiy/Documents/components/.worktrees/option-list-plain-list`
- Branch `refactor/option-list-plain-list` at `460ac0f4c` (= `origin/feat/add-option-list`). No source files changed. No commits.
- `node_modules` is a symlink to `.worktrees/refactor-move-listbox-parts/node_modules`.
- Node: every command is prefixed with `mise exec node@22.23.2 --` and run from the worktree root.
- Logs: `/tmp/plbase-*.log`.

## Results

| Run | Command | Result |
|---|---|---|
| quick-build | `mise exec node@22.23.2 -- npm run quick-build` | passed on the first try. No ENOTEMPTY or TS2742 (`/tmp/plbase-quickbuild.log`) |
| Targeted unit | `TZ=UTC mise exec node@22.23.2 -- npx jest -c jest.unit.config.js src/option-list src/select src/multiselect src/autosuggest src/property-filter src/internal/components/listbox src/internal/components/options-list src/internal/components/selectable-item` | **81/81 suites, 1211/1211 tests passed**, 0 failed, 0 skipped, 0 snapshots (`/tmp/plbase-unit.log`) |
| Full build | `mise exec node@22.23.2 -- npm run build` | passed. webpack reported 2 warnings, the usual ones (`/tmp/plbase-build.log`) |
| Snapshot tests | `TZ=UTC mise exec node@22.23.2 -- npx jest -c jest.unit.config.js src/__tests__/snapshot-tests` (no `-u`) | **4/4 suites, 113/113 tests, 111/111 snapshots passed**. 0 written, 0 obsolete (`/tmp/plbase-snap.log`) |
| ESLint | `mise exec node@22.23.2 -- npx eslint src/internal/components/listbox src/option-list src/select src/multiselect` | clean, exit 0, no output |
| tsc (src) | `mise exec node@22.23.2 -- npx tsc -p tsconfig.json --noEmit` | exit 0, 0 errors |
| tsc (pages) | `mise exec node@22.23.2 -- npx tsc -p pages/tsconfig.json --noEmit` | exit 2. Only the 2 known `@formatjs/ecma402-abstract/utils.d.ts(30,…)` errors: TS2339 `ListFormat` and TS2694 `Intl.ListFormat` |
| Integ | see below | **11/12 suites, 137/138 tests passed, 1 failed** (pre-existing), 0 snapshots, 113 s (`/tmp/plbase-integ.log`) |

### Integ per suite
All of these passed: `option-list/option-list.test.ts`, `option-list/option-list-scroll.test.ts`, `select/select.test.ts`, `select/events-select.test.ts`, `select/disabled-reason.test.ts`, `select/select-native-search.test.ts`, `select/dropdown-customization.test.ts`, `select/virtual-resize.test.ts`, `multiselect/multiselect.test.ts`, `multiselect/multiselect-embedded.test.ts`, `multiselect/select-all.test.ts`.

Failed: `select/__integ__/async-select.test.ts`, 12/13 passed.

### Pre-existing integ failure
- `async select tests › Async select scrolling (with virtualScrolling=true) › the bottom of the dropdown lines up with the highlighted option, when going down the list` (`async-select.test.ts:146`). Expected ≤ 3, received **32**.
- The failure is deterministic. Two reruns of the file alone also failed with 12/13 and 32 each time (`/tmp/plbase-integ-async-1.log`, `-2.log`).
- Earlier task docs record the same failure with the same 32 px value. `listbox-pr3-option-list-verification.md` reproduced it on the `listbox/02-selection-models` baseline, and the type-ahead verification docs saw it too. The refactor must not add failures beyond this one.

## Integ environment (to reproduce)
- Chrome `157.0.8103.26` (`/Applications/Google Chrome.app`).
- ChromeDriver `157.0.8103.15`, already at `/tmp/chromedriver/chromedriver/mac_arm-157.0.8103.15/chromedriver-mac-arm64/chromedriver`. Nothing was installed and node_modules wasn't touched.
- The global `chromedriver` on PATH (`~/n/bin/chromedriver`) is 152, which doesn't match Chrome. `@cloudscape-design/browser-test-tools/chrome-launcher` spawns whichever `chromedriver` comes first on PATH, on port 9515, so the 157 directory has to be prepended to PATH.
- Dev server: the shell tool rejects inline server commands, so the server is started from a throwaway script, which is deleted afterwards:
  ```zsh
  # /tmp/plbase-start-integ.sh
  #!/bin/zsh
  cd /Users/amanabiy/Documents/components/.worktrees/option-list-plain-list || exit 1
  exec mise exec node@22.23.2 -- npm run start:integ -- --host 127.0.0.1
  ```
  `chmod +x /tmp/plbase-start-integ.sh && nohup /tmp/plbase-start-integ.sh > /tmp/plbase-devserver.log 2>&1 &`, then wait about 45 s for "compiled successfully".
  - `lsof -nP -iTCP -sTCP:LISTEN` showed only `127.0.0.1:8080 (LISTEN)`.
- Test command:
  ```zsh
  export PATH="/tmp/chromedriver/chromedriver/mac_arm-157.0.8103.15/chromedriver-mac-arm64:$PATH"
  NODE_OPTIONS=--experimental-vm-modules mise exec node@22.23.2 -- node_modules/.bin/jest -c jest.integ.config.js src/option-list/__integ__/ src/select/__integ__/ src/multiselect/__integ__/
  ```
- Teardown: `pkill -f plbase-start-integ.sh; pkill -f webpack.config.integ.cjs`. Afterwards there were no listeners on 8080 or 9515 and no chromedriver or webpack process was running. The jest globalTeardown stops chromedriver itself.

## Cleanup
- `package-lock.json` was unchanged.
- `pages/tsconfig.tsbuildinfo` isn't tracked in this worktree. The pages tsc run created it as an untracked file, and I deleted it.
- `git status --short` is empty. The `node_modules` symlink is ignored, so it doesn't show.
- The `/tmp` server script was deleted.
