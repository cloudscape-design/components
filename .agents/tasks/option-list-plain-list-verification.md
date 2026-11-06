# OptionList → PlainList refactor: verification

- Worktree: `/Users/amanabiy/Documents/components/.worktrees/option-list-plain-list`
- Branch `refactor/option-list-plain-list`, base `origin/feat/add-option-list` (`460ac0f4c`).
- Commit: **`5297ed2ef` `refactor: Use PlainList in OptionList`**. It is the only commit in `git -P log --oneline origin/feat/add-option-list..HEAD`.
- `git diff --shortstat origin/feat/add-option-list..HEAD`: `3 files changed, 20 insertions(+), 87 deletions(-)`. Without the deleted `list.tsx` (78 lines), the product change is +20 / −9.
- First iteration. There was no review JSON.

## Changes

`src/internal/components/listbox/parts/plain-list.tsx` (+13 / −1):
- New optional prop `scrollStrategy?: 'menu' | 'ancestors'`, destructured with the default `'menu'`, and documented on `SelectListProps`.
- Imports `{ scrollOptionIntoView }` next to the default `scrollToIndex` from `./scroll-to-index`.
- `useImperativeHandle` calls `scrollOptionIntoView` when `scrollStrategy === 'ancestors'` and `scrollToIndex` otherwise. `scrollStrategy` is added to the deps. The `moveFocus`, `menuRef.current` and `!isSticky` guards are unchanged.
- Nothing else changed. `'menu'` runs the same code as before: `scrollBy` on the menu only, skipped when the menu is 15 px tall or less (AWSUI-60318). The sticky first option, `listBottom`, `hasDropdownStatus`, menuProps, the refs and `useContainerQuery`/`withScrollbar` are all untouched.

`src/internal/components/listbox/index.tsx` (+7 / −5):
- Renders `PlainList` with `menuProps={mergedListProps}`, `filteredOptions={options}`, `filteringValue=""`, `isMultiSelect={mergedListProps.isMultiSelect}` (keeps `aria-multiselectable`), `scrollStrategy="ancestors"`, and the same `getOptionProps`, `highlightType`, `selectionType`, `screenReaderContent` and `renderOption` as before.
- The ref type is now `SelectListProps.SelectListRef`. The comment now says `PlainList` instead of `List`. `ListboxProps` is unchanged.

`src/internal/components/listbox/parts/list.tsx`: removed with `git rm`. `scrollOptionIntoView` stays in `scroll-to-index.ts`. A grep of `src/` and `pages/` finds no remaining import of `parts/list` (the only hits are the unrelated test-utils `./list` wrapper and a stale built bundle in `pages/lib`).

Select, Multiselect, VirtualList and the sticky-item dev page don't pass `scrollStrategy`, so they take the default path. No `interfaces.ts` or other public type changed. No test file is in the diff, and no test expectation changed.

Known DOM-only difference, accepted in the fit check: OptionList's list element now gets inline `scroll-padding-block-start: 0px`, because PlainList always sets `stickyItemBlockSize`. Before, it had no inline value, which resolves to the same 0. No test asserts on it, and the integ scroll tests pass.

## Results (before = baseline, after = this commit)

| Check | Command | Before | After |
|---|---|---|---|
| quick-build | `mise exec node@22.23.2 -- npm run quick-build` | pass | pass on the first try, no ENOTEMPTY or TS2742 (`/tmp/plafter-quickbuild.log`) |
| Targeted unit | `TZ=UTC mise exec node@22.23.2 -- npx jest -c jest.unit.config.js src/option-list src/select src/multiselect src/autosuggest src/property-filter src/internal/components/listbox src/internal/components/options-list src/internal/components/selectable-item` | 81/81 suites, 1211/1211 tests | **81/81 suites, 1211/1211 tests**, 0 failed (`/tmp/plafter-unit.log`) |
| Full build | `mise exec node@22.23.2 -- npm run build` | pass, 2 webpack warnings | pass, the same 2 webpack asset-size warnings (`/tmp/plafter-build.log`) |
| Snapshots | `TZ=UTC mise exec node@22.23.2 -- npx jest -c jest.unit.config.js src/__tests__/snapshot-tests` (no `-u`) | 4/4 suites, 113/113 tests, 111/111 snapshots | **4/4, 113/113, 111/111**, 0 written, 0 obsolete (`/tmp/plafter-snap.log`) |
| ESLint | `mise exec node@22.23.2 -- npx eslint src/internal/components/listbox src/option-list src/select src/multiselect` | clean | clean, exit 0 |
| tsc (src) | `mise exec node@22.23.2 -- npx tsc -p tsconfig.json --noEmit` | 0 errors | 0 errors, exit 0 |
| tsc (pages) | `mise exec node@22.23.2 -- npx tsc -p pages/tsconfig.json --noEmit` | 2 known @formatjs errors | the same 2 @formatjs errors, 0 others |
| Integ | see below | 11/12 suites, 137/138 tests, 1 pre-existing failure | **11/12 suites, 137/138 tests**, the same 1 pre-existing failure (`/tmp/plafter-integ.log`) |
| Pre-commit hooks | `git commit` (no `--no-verify`) | n/a | passed |

### Integ details
- Setup was the same as the baseline: Chrome 157 with ChromeDriver 157.0.8103.15 prepended to PATH. The server ran from the throwaway script `/tmp/plafter-start-integ.sh` (`npm run start:integ -- --host 127.0.0.1`), which was deleted afterwards.
- Bind evidence: `lsof -nP -iTCP -sTCP:LISTEN` showed only `node 47647 … TCP 127.0.0.1:8080 (LISTEN)`.
- Command: `NODE_OPTIONS=--experimental-vm-modules mise exec node@22.23.2 -- node_modules/.bin/jest -c jest.integ.config.js src/option-list/__integ__/ src/select/__integ__/ src/multiselect/__integ__/`. It took 108.8 s.
- These passed: `option-list.test.ts`, `option-list-scroll.test.ts`, `select.test.ts`, `events-select.test.ts`, `disabled-reason.test.ts`, `select-native-search.test.ts`, `dropdown-customization.test.ts`, `virtual-resize.test.ts`, `multiselect.test.ts`, `multiselect-embedded.test.ts`, `select-all.test.ts`.
- This failed: `async-select.test.ts` › "Async select scrolling (with virtualScrolling=true) › the bottom of the dropdown lines up with the highlighted option, when going down the list". It expected ≤ 3 and received 32, the same failure with the same value as the baseline.
- Teardown: `pkill -f plafter-start-integ.sh; pkill -f webpack.config.integ.cjs`. Afterwards nothing listened on 8080 or 9515, and no chromedriver or webpack process was left.

## Cleanup
- `package-lock.json` was unchanged.
- `pages/tsconfig.tsbuildinfo` is untracked in this worktree, so `git checkout --` doesn't apply. I deleted it, as the baseline did.
- `git status --short` is empty after the commit.
- Only `src/internal/components/listbox/index.tsx`, `src/internal/components/listbox/parts/plain-list.tsx` and the deletion of `list.tsx` were staged, each by explicit path.
- Nothing was pushed. No other worktree or branch was touched.
