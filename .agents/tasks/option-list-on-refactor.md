# OptionList (#5180) rebuilt on refactor/move-shared-listbox-parts

## Result

- Worktree: `/Users/amanabiy/Documents/components/.worktrees/option-list-rebase`
- Branch: `feat/add-option-list`, HEAD `24524f9b9d33df38ba731320d15748401396350b`
- Base: `refactor/move-shared-listbox-parts` = `6c48dd2c1` (unchanged)
- 22 commits on top of the base (23 original minus the dropped `f8188ea94`). Nothing pushed. Working tree clean.
- `origin/feat/add-option-list` is still `4925c401c`. Local and remote have diverged, as expected before the force-push.

## Backups (created by the setup step)

- `backup/feat-add-option-list-local` at `9e4db4e02` (the old local branch)
- `backup/feat-add-option-list-origin-4925c401c` at `4925c401c` (the pushed PR head)
- `feat/add-option-list-rebased` (`18fc07088`) and the other protected branches/worktrees were not modified.

## How it was built

1. Created a temporary branch from `refactor/move-shared-listbox-parts`.
2. Cherry-picked the commits of the reference rebase `feat/add-option-list-rebased` (`bd8f0792b..18fc07088`). Those commits already carry the shared-code resolutions: OptionList uses the shared `listbox/parts/item.tsx` and `render-options.tsx`, its own item and the duplicate item styles are gone, and the `with groups` type-ahead tests are merged into the shared test file.
3. For every commit, `src/internal/components/listbox/use-listbox.ts` was taken from the matching original commit on `origin/feat/add-option-list`. The reference had changed it to use a `preventNativeHomeEnd` option on the shared `useMenuKeyboard` (fix-branch commit `6792d0dc3`, not wanted here). The original version keeps the Home/End `preventDefault` inside the OptionList list key handler, as reviewed on #5180.
4. The 4 type-ahead/item fixes were folded in with `cherry-pick -n` of the fix-branch commit plus the OptionList commit (see "Shared-code changes").
5. Moved `feat/add-option-list` to the result with `git checkout -B feat/add-option-list` and deleted the temporary branch. No `reset --hard`, no `rebase -i`.

Check against both sources at HEAD:
- `git diff 4925c401c HEAD` limited to OptionList-only files (`src/option-list`, `src/test-utils`, `pages/option-list`, `src/i18n`, `use-listbox.ts`, `listbox/index.tsx`, `parts/list.tsx`, `scroll-to-index.ts`, `options-list/`): only `pages/option-list/simple.page.tsx` (+7 / -154), which is exactly the reverse of the dropped commit `f8188ea94`.
- `git diff 18fc07088 HEAD` (vs the reference): only the excluded fix-branch commits (`6792d0dc3` Home/End, `58dad9856` Select wrap, `bd8f0792b` identity lookup) and the use-listbox Home/End difference from step 3.

## Commit mapping (old -> new)

| Old (origin) | New | Subject |
|---|---|---|
| `a5816e70d` | `7f3a9ed67` | feat: Add OptionList component |
| `b8992c3c3` | `8236d2fcf` | fix: Prevent native page scroll on Home and End in OptionList |
| `789fe5fed` | `a0d9caedc` | chore: Clean up OptionList tests and dev pages |
| `69c5809c1` | `d28511e7b` | fix: Use own i18n namespace in OptionList |
| `8759506c3` | `6791b4db1` | test: Cover OptionList disabled reason tooltip Escape |
| `28ad595df` | `83906c4e4` | chore: Use page templates for OptionList dev pages |
| `3c889b6bf` | `2b52ea7b4` | test: Drop duplicate root scroll container from OptionList scroll page |
| `62a031af8` | `0682b4a8a` | feat: Add OptionList renderOption item types |
| `fe813fa8d` | `b5f875a26` | fix: Ignore non-matching group headers in OptionList type-ahead (+ `5f8b96389`) |
| `fde3009e1` | `ad1132a99` | fix: Ignore handled keys in OptionList type-ahead (+ `e7429e11f`) |
| `4a2e5c9da` | `e0bed93c2` | fix: Pass the group state as parent in OptionList renderOption (+ `6b95bbf8c`) |
| `4cc525300` | `eb9030d45` | fix: Keep disabled reason description with custom OptionList options (+ `7626adb9a`) |
| `8aa783f65` | `71d4d115a` | fix: Scroll OptionList highlight on repeated keyboard navigation |
| `fd8244d89` | `40188c784` | fix: Keep OptionList highlight in sync when options change |
| `e8e80e4d7` | `5f315f718` | fix: Wrap OptionList arrow keys at the first and last highlightable options |
| `f62ff01ff` | `fcb0f5ce0` | fix: Start OptionList keyboard focus on the selected option despite hover |
| `a789ffbba` | `ae81b90a7` | fix: Require option values in OptionList |
| `083f6141f` | `ee4e70777` | feat: Add renderHighlightedAriaLive to OptionList |
| `3d9eddd33` | `71725135a` | fix: Skip OptionList scroll when nothing is highlighted |
| `a8f6dc028` | `dcdb8ea3c` | test: Split OptionList unit tests by feature |
| `a212bfcef` | `25f380c96` | test: Prune redundant OptionList unit tests |
| `4925c401c` | `24524f9b9` | test: Remove OptionList tests covered by listbox tests |

- Dropped: `f8188ea94 chore: add settings to make it easier to test` (only touched `pages/option-list/simple.page.tsx`).
- Empty commits: none. No squashing.
- Subjects are unchanged. Bodies: the feat commit body comes from the reference (it describes reusing the shared item, render-options and use-type-ahead instead of adding a copy). The 4 folded fix commits have new bodies that end with "Select and Multiselect get the same fix ...". All other bodies are identical to the originals.

## Conflicts and resolutions

- `use-listbox.ts` (in `789fe5fed` and `e8e80e4d7` replays): conflict between the reference's `preventNativeHomeEnd` form and the original handler. Resolved to the original commit's file each time.
- `listbox/__tests__/use-type-ahead.test.ts` (in `fe813fa8d` replay): the reference commit's context included the identity-lookup test from `bd8f0792b`. Dropped that test and kept only OptionList's extra case ("repeated key cycles only through matching options and skips disabled ones").
- Shared files resolved as in the reference (no conflicts in this replay):
  - `listbox/parts/item.tsx`: shared item kept. OptionList's separate item was never added. Only addition is the optional `hideTopDivider` prop passed to `SelectableItem`. `virtualIndex` and select-all `indeterminate` are unchanged.
  - `listbox/parts/render-options.tsx`: identical to the base. OptionList's 3-way item choice was dropped. `hideTopDivider` reaches the item through `getOptionProps` in `option-list/internal.tsx`, so no new render-options prop was needed.
  - `listbox/use-type-ahead.ts` and its test: the moved shared version, identifiers `useTypeAhead` / `interactiveGroups`. `use-listbox.ts` calls `useTypeAhead({ ..., interactiveGroups })`.
  - `listbox/parts/styles.scss`: the feat commit adds only `.list-bottom` (used by the early `list.tsx`), and `789fe5fed` deletes it, as in the original. The duplicate `.item/.checkbox/.selected-icon/.show-label-tag/.disabled-reason-tooltip` rules never appear. The shared item uses `select/parts/styles.css.js`. OptionList tests and test-utils do not reference the old listbox tooltip class (grep for `disabled-reason`, `findDisabledReason`, `listbox/parts/styles` under `src/option-list` and `src/test-utils/dom/option-list` returns nothing). `OptionWrapper.findDisabledReason` in `src/test-utils/{dom,selectors}/internal/option.ts` is unchanged.
  - `eslint.config.mjs`: the OptionList import rule no longer lists `listbox/parts/item.tsx`, because the shared item imports the Select item styles at runtime. The comment says so.
  - `listbox/parts/list.tsx` stays separate from PlainList. `scroll-to-index.ts` adds `scrollOptionIntoView` with the `index < 0` guard; the default export is unchanged.
  - `options-list/utils/use-keyboard.ts`: only the feat commit's change (optional `closeDropdown`). No Home/End change.

## Shared-code changes that affect Select and Multiselect

| OptionList commit | Shared change | Select/Multiselect effect | Tests added (from fix branch) |
|---|---|---|---|
| `b5f875a26` (folds `5f8b96389`) | `use-type-ahead.ts`: match each option on its own content | Multiselect type-ahead no longer lands on non-matching group headers (or children of a matching group). Select: regression test only. | `use-type-ahead.test.ts` `with groups` describe; `select/__tests__/native-search.test.tsx` (new); `multiselect/__tests__/native-search.test.tsx` (new); `multiselect/__integ__/multiselect.test.ts` expectation update |
| `ad1132a99` (folds `e7429e11f`) | `use-type-ahead.ts`: skip `event.defaultPrevented` | Select and Multiselect type-ahead ignores keys already handled (e.g. Space) | hook case "ignores a key event that was already handled"; Select and Multiselect native-search cases |
| `e0bed93c2` (folds `6b95bbf8c`) | `parts/item.tsx`: `parent.disabled` uses the group's state | Select and Multiselect `renderOption` get `item.parent.disabled` from the group, not the option | `select/__tests__/render-option.test.tsx`, `multiselect/__tests__/render-option.test.tsx` |
| `eb9030d45` (folds `7626adb9a`) | `parts/item.tsx`: disabled-reason description stays mounted with custom content | Select and Multiselect custom options keep a valid `aria-describedby` target; tooltip still default-content only | same render-option test files |

Not included (stay for the later fix PR): `6792d0dc3` Home/End for Select/Multiselect, `58dad9856` Select wrap, `bd8f0792b` identity lookup.

Select/Multiselect Home/End unchanged vs base: `git diff refactor/move-shared-listbox-parts HEAD -- src/select src/multiselect src/internal/components/options-list` shows no change to `use-select.ts`, `use-multiselect.tsx` or the Home/End branches of `use-keyboard.ts` (only optional `closeDropdown`, which Select and Multiselect always pass). `git grep preventNativeHomeEnd -- src` returns nothing. The base's Select/Multiselect suites pass (below).

## Files outside OptionList-only areas (`git diff --stat refactor/move-shared-listbox-parts...HEAD`)

| File | Why |
|---|---|
| `build-tools/utils/pluralize.js` (+1) | OptionList -> OptionLists for test-utils generation |
| `eslint.config.mjs` (+29) | Rule: OptionList and listbox engine files may only type-import from select/multiselect |
| `src/__tests__/required-props-for-components.ts` (+1) | `option-list` entry for the shared functional suites |
| `src/__tests__/snapshot-tests/__snapshots__/*.snap` (+626, 0 deletions) | OptionList documenter + test-utils entries only |
| `src/i18n/messages-types.ts`, `src/i18n/messages/all.*.json` (+3 each) | Own `option-list` i18n namespace |
| `src/internal/components/listbox/parts/item.tsx` (+12/-2) | `hideTopDivider` pass-through; group `parent.disabled` fix; disabled-reason description fix |
| `src/internal/components/listbox/use-type-ahead.ts` (+5/-2) | Group-header and defaultPrevented fixes |
| `src/internal/components/listbox/__tests__/use-type-ahead.test.ts` (+91) | Tests for those fixes, incl. merged `with groups` block |
| `src/internal/components/listbox/parts/scroll-to-index.ts` (+17) | Additive `scrollOptionIntoView` |
| `src/internal/components/options-list/index.tsx` (+8/-2) | Optional `statusType` (default `finished`), `onMouseLeave` |
| `src/internal/components/options-list/utils/use-keyboard.ts` (+7/-2) | Optional `closeDropdown` |
| `src/internal/components/selectable-item/{index.tsx,interfaces.ts,styles.scss}` (+9) | Optional `hideTopDivider` |
| `src/select/__tests__/{native-search,render-option}.test.tsx`, `src/multiselect/__tests__/{native-search,render-option}.test.tsx`, `src/multiselect/__integ__/multiselect.test.ts` | Tests for the shared fixes above |

OptionList-only: `src/option-list/**`, `listbox/use-listbox.ts`, `listbox/index.tsx`, `listbox/parts/list.tsx`, `src/test-utils/dom/option-list/index.ts`, `pages/option-list/**`.

Shortstat: `60 files changed, 3797 insertions(+), 15 deletions(-)`.

`git grep -n "select/parts/item\|multiselect-item\|useNativeSearch\|hasCheckbox" -- src pages` matches only the pre-existing `hasCheckboxItems` helper in `src/button-dropdown/index.tsx` and `src/button-dropdown/utils/utils.ts` (same on the base, unrelated to listbox). No hits for the removed item files, `useNativeSearch`, or the `hasCheckbox` prop.

## Verification (Node 22: `mise exec node@22.23.2 -- ...`, cwd = worktree, at HEAD `24524f9b9`)

| Command | Result |
|---|---|
| `npm run build` | exit 0 (no ENOTEMPTY rerun needed) |
| `TZ=UTC npx jest -c jest.unit.config.js src/__tests__/snapshot-tests -u` | 4 suites, 113 tests, 111 snapshots passed; no snapshot file changed |
| `TZ=UTC npx jest -c jest.unit.config.js src/option-list src/select src/multiselect src/autosuggest src/property-filter src/internal/components/listbox src/internal/components/options-list src/internal/components/selectable-item src/test-utils src/__tests__` | exit 0. Test Suites: 99 passed / 99. Tests: 3338 passed / 3338. Snapshots: 111 passed. (The build-tools eslint structuredClone failure is not in this path set and did not occur.) |
| `TZ=UTC npx jest -c jest.unit.config.js src/option-list` | 8 suites, 69 tests passed (common.tsx is the shared helper) |
| `TZ=UTC npx jest ... src/select/__tests__/native-search.test.tsx src/multiselect/__tests__/native-search.test.tsx src/select/__tests__/render-option.test.tsx src/multiselect/__tests__/render-option.test.tsx src/internal/components/listbox/__tests__/use-type-ahead.test.ts` | 5 suites, 41 tests passed |
| `npx eslint src/option-list src/internal/components/listbox src/internal/components/options-list src/internal/components/selectable-item src/select/__tests__ src/multiselect/__tests__ src/multiselect/__integ__ src/test-utils/dom/option-list pages/option-list eslint.config.mjs build-tools/utils/pluralize.js src/__tests__/required-props-for-components.ts` | exit 0, no output |
| `npx stylelint src/internal/components/selectable-item/styles.scss "src/option-list/**/*.scss" "pages/option-list/*.scss"` | exit 0 |
| `npx tsc -p tsconfig.json --noEmit` | exit 0 |
| `npx tsc -p pages/tsconfig.json --noEmit` | only the 2 known `@formatjs/ecma402-abstract` `Intl.ListFormat` errors |
| Per-commit `npx tsc -p tsconfig.json --noEmit` on each of the 21 intermediate commits (detached checkout in the worktree, then back to the branch) | all exit 0, 0 errors |

Integ:
- Installed Chrome is 156.0.8078.49; the ChromeDriver on PATH (`~/.local/bin`) is 149. Downloaded ChromeDriver 156.0.8078.73 with the repo's `node_modules/.bin/browsers install chromedriver@156 --path /tmp/chromedriver` (nothing in node_modules changed) and put it first on PATH.
- Server: `npm run start:integ -- --host 127.0.0.1` in the background (lsof confirmed `127.0.0.1:8080` only). Stopped afterwards; ports 8080 and 9515 free.
- `NODE_OPTIONS=--experimental-vm-modules node_modules/.bin/jest -c jest.integ.config.js src/option-list/__integ__/`: 2 suites, 10 tests passed.
- `... src/multiselect/__integ__/multiselect.test.ts` (expectation updated by the folded fix): 1 suite, 34 tests passed.

Cleanup: `git checkout -- package-lock.json` (no change); `pages/tsconfig.tsbuildinfo` was untracked here (created by the pages tsc run) and was deleted. `git status` clean. Nothing was staged from `.agents/`, `.kiro/`, `node_modules`, `package-lock.json`, `pages/tsconfig.tsbuildinfo` or `repro-mount-scroll.page.tsx`.

## Fix-branch commits now included here

`5f8b96389`, `e7429e11f`, `6b95bbf8c`, `7626adb9a` (folded into the OptionList commits above). When `fix/select-multiselect-listbox-alignment` is rebuilt on this branch, it should keep only:
- `6792d0dc3` fix: Prevent page scroll on Home and End in Select and Multiselect
- `58dad9856` fix: Wrap Select arrow keys at the first and last highlightable options
- `bd8f0792b` fix: Find the highlighted option by identity in Multiselect type-ahead

Note for that rebuild: `6792d0dc3` adds `preventNativeHomeEnd` to `useMenuKeyboard`. The reference branch also switched OptionList's `use-listbox.ts` to that option; the fix PR can do the same then.

## Commands for you (not run)

```
git -C /Users/amanabiy/Documents/components/.worktrees/option-list-rebase push --force-with-lease=feat/add-option-list:4925c401c origin feat/add-option-list
gh pr edit 5180 --base refactor/move-shared-listbox-parts
```

Why the base change: #5180 currently targets `main`. The branch now sits on `refactor/move-shared-listbox-parts` (4 commits not yet on main: type-ahead move, shared item, PlainList move, duplicate test removal). Against `main`, #5180's diff would include those refactor commits. With the refactor branch as base, the diff shows only the 22 OptionList commits. After the refactor PR merges, GitHub retargets #5180 to `main` automatically if the refactor branch is deleted on merge; otherwise run `gh pr edit 5180 --base main`.
