# Step 2 verification: use useListbox directly in OptionList

Worktree: `/Users/amanabiy/Documents/components/.worktrees/option-list-on-use-listbox`
Branch: `feat/add-option-list-v2` (local only, not pushed). `feat/add-option-list` (17f00cd92) and the
`option-list-rebase` worktree were not touched.

## Rebase

- Start state: worktree on `refactor/option-list-on-use-listbox` at 8c14844e9, clean.
- `git switch -c feat/add-option-list-v2 17f00cd92`
- `git rebase --onto refactor/use-listbox-in-select 318ee8036 feat/add-option-list-v2`: 33 commits replayed,
  **no conflicts**. 17f00cd92's `onEscape` / `onKeyboardHighlight` additions applied cleanly next to Step 1's
  `scrollToIndex` + `activeDescendantId` in use-listbox.ts and use-listbox.test.tsx.
- Rebased 17f00cd92 is now `a434668dd`.

## Commits

New commit: `c2ebf9c1a` — `refactor: Use useListbox directly in OptionList` (parent a434668dd).

```
$ git -P log --oneline 318ee8036..feat/add-option-list-v2
c2ebf9c1a refactor: Use useListbox directly in OptionList
a434668dd refactor: Build OptionList on the shared useListbox hook
609965be7 chore: Simplify OptionList options documentation
3698234e7 chore: Split OptionList permutations into single and multi pages
4060e4b49 fix: Pass group headers to renderHighlightedAriaLive as the consumer's group
c505e13f9 fix: Require group values in OptionList
fff033ed5 refactor: Use shared keyboard navigation in OptionList
463bf5483 refactor: Use shared listbox helpers in OptionList
3105c0b6e chore: Remove OptionList import restriction from ESLint config
871a45b33 refactor: Use PlainList in OptionList
6d09ef973 revert: Restore Select and Multiselect type-ahead and renderOption behavior
6a58d5c6e fix: Add gap between icon and content in OptionList options
fd83c4ae0 test: Remove OptionList tests covered by listbox tests
9b32bf901 test: Prune redundant OptionList unit tests
c42a1eb84 test: Split OptionList unit tests by feature
3beb4c917 fix: Skip OptionList scroll when nothing is highlighted
ed657e8ce feat: Add renderHighlightedAriaLive to OptionList
ed95e0c5a fix: Require option values in OptionList
a885e31ed fix: Start OptionList keyboard focus on the selected option despite hover
6e842ac53 fix: Wrap OptionList arrow keys at the first and last highlightable options
a7cb59704 fix: Keep OptionList highlight in sync when options change
bde559410 fix: Scroll OptionList highlight on repeated keyboard navigation
32a9aa21e fix: Keep disabled reason description with custom OptionList options
464241d62 fix: Pass the group state as parent in OptionList renderOption
a4997ebda fix: Ignore handled keys in OptionList type-ahead
e3a8b35bc fix: Ignore non-matching group headers in OptionList type-ahead
ff44150b5 feat: Add OptionList renderOption item types
8558a7210 test: Drop duplicate root scroll container from OptionList scroll page
39082d006 chore: Use page templates for OptionList dev pages
8404c99ba test: Cover OptionList disabled reason tooltip Escape
4122239be fix: Use own i18n namespace in OptionList
a8a242b10 chore: Clean up OptionList tests and dev pages
374db32a0 fix: Prevent native page scroll on Home and End in OptionList
450526e85 feat: Add OptionList component
97391cac5 refactor: Move list scrolling and active descendant into useListbox
```

```
$ git -P show --stat HEAD
 .../listbox/__tests__/use-listbox.test.tsx         | 160 +++++++++++----
 src/internal/components/listbox/use-listbox.ts     |  99 ++++++++--
 src/option-list/internal.tsx                       | 115 +++++++++--
 src/option-list/use-option-list.ts                 | 217 ---------------------
 4 files changed, 310 insertions(+), 281 deletions(-)
```

## What changed

useListbox (all new options are optional; defaults keep Select/Multiselect as they are):
- `scrollOn?: 'highlight-change' | 'keyboard-request'` (default `'highlight-change'`). One scroll effect; its
  dependency is `highlightedIndex` in the default mode and a keyboard-request counter in `'keyboard-request'`
  mode. The counter increments on arrow/Home/End moves and on the returned setters, only in
  `'keyboard-request'` mode (no extra state updates for Select). Replaces `onKeyboardHighlight`, which is removed
  (nothing else used it).
- Returns `highlightOption(option)` and `goHome()`: keyboard highlight + scroll request.
- `keepHighlightOnOptionsChange?: boolean` (default false): previous-options pattern and `isSameOption` moved
  as-is from use-option-list.ts.
- `activeDescendant?: 'always' | 'when-highlighted'` (default `'always'`).
- `getParent` is optional and defaults to `() => undefined`.

src/option-list/internal.tsx calls useListbox directly (scrollOn 'keyboard-request',
keepHighlightOnOptionsChange, activeDescendant 'when-highlighted', spaceSelects 'always', no onEscape) and keeps
listRef, the pointer-down flag, the inline list props (focus entry in list order, blur reset), the root
onMouseLeave and `useTypeAhead({ isEnabled: true, ... highlightOption })`. `useForwardFocus` is still called after
the list hooks. src/option-list/use-option-list.ts is deleted.

Hook order / ids: useListbox is still the first hook after `useControllable` in OptionList and its
`useUniqueId('option-list')` is still its first call, so ids are unchanged (snapshots pass unchanged).

## Line counts

| File | Before (a434668dd) | After (c2ebf9c1a) |
|---|---|---|
| src/internal/components/listbox/use-listbox.ts | 204 | 277 |
| src/select/utils/use-select.ts | 326 | 326 |
| src/option-list/internal.tsx | 226 | 307 |
| src/option-list/use-option-list.ts | 217 | deleted |
| OptionList total (internal + hook) | 443 | 307 |

## Commands and results (all Node 22 via `mise exec node@22.23.2 --`, in the worktree)

| Command | Result |
|---|---|
| `npm run quick-build` (before change) | pass |
| Baseline `TZ=UTC npx jest -c jest.unit.config.js src/select src/multiselect src/autosuggest src/property-filter src/internal/components/listbox src/internal/components/options-list src/internal/components/selectable-item src/option-list` | 83 suites / 1247 tests passed |
| Baseline `npx jest ... src/option-list` | 8 suites / 67 tests passed |
| `npx prettier --write` + `npx eslint` on the 3 changed files | pass (exit 0) |
| `npx tsc -p tsconfig.json --noEmit` | pass (exit 0) |
| `npx tsc -p pages/tsconfig.json --noEmit` | only the 2 known `@formatjs/ecma402-abstract` `Intl.ListFormat` errors |
| `npm run quick-build` (after change) | pass |
| Same jest set after change | 83 suites / 1253 tests passed |
| `npx jest ... src/option-list` after | 8 suites / 67 tests passed |
| `npm run build` | pass (2 usual webpack size warnings) |
| `TZ=UTC npx jest -c jest.unit.config.js src/__tests__/snapshot-tests --ci` (no `-u`) | 4 suites / 113 tests, 111 snapshots passed, none written |
| `git -P diff --stat HEAD~1 -- '**/__tests__/**'` | only `use-listbox.test.tsx` |
| `git -P diff --stat 17f00cd92 HEAD -- src/option-list/__tests__` | empty (OptionList tests unchanged) |
| `git -P diff refactor/use-listbox-in-select feat/add-option-list-v2 -- src/select src/multiselect` | empty (0 lines) |
| `git checkout -- package-lock.json` | done (it was not modified). `pages/tsconfig.tsbuildinfo` is untracked, so there is nothing to check out; it is left as an untracked build artifact. |

## Test counts

- Before: 83 suites / 1247 tests. After: 83 suites / 1253 tests.
- Difference: the 3 `onKeyboardHighlight` cases were removed with the option, 9 cases added:
  - scrollOn 'keyboard-request': arrows/Home/End scroll incl. repeated End on the same index; mouse move doesn't
    scroll; `highlightOption`/`goHome` scroll even when the index stays.
  - default mode: setters highlight with keyboard type and scroll only on index change.
  - keepHighlightOnOptionsChange: follows to the new index keeping mouse type without scrolling; clears when the
    option is gone; default keeps the index.
  - activeDescendant: 'always' keeps the id of an index with no option; 'when-highlighted' returns undefined.
- OptionList: 67 tests before and after, test files unchanged.
- Snapshots: 111/111 passed unchanged.

## Integration verification (first iteration, no review file present)

`.agents/tasks/option-list-direct-use-listbox-review.json` did not exist, so only integration checks were run. Nothing was changed.

| Check | Result |
|---|---|
| `refactor/use-listbox-in-select` | 97391cac5, parent 318ee8036; worktree `listbox-use-listbox` clean, `[ahead 1]` of origin |
| `feat/add-option-list-v2` | c2ebf9c1a (parent a434668dd); 34 commits on top of Step 1; Step 1 is an ancestor; worktree clean except untracked `pages/tsconfig.tsbuildinfo` |
| `git -P diff refactor/use-listbox-in-select feat/add-option-list-v2 -- src/select src/multiselect` | empty (0 lines) |
| `src/option-list/use-option-list.ts` on v2 | does not exist |
| `git ls-remote origin` | `refactor/use-listbox-in-select` = 318ee8036, `feat/add-option-list` = 24173f991, no `feat/add-option-list-v2` on origin. `git branch -r --contains` is empty for both local branches, so nothing has been pushed |
| `feat/add-option-list` | 17f00cd92; `option-list-rebase` worktree at 17f00cd92, `[ahead 1]`, no tracked changes (only untracked `pages/tsconfig.tsbuildinfo`) |
| `diff <(git diff 17f00cd92 a434668dd) <(git diff 318ee8036 97391cac5)` | only blob hashes and hunk line offsets differ, so the rebase added exactly the Step 1 change on top of 17f00cd92 |
| `**/__tests__/**` diff-stat | Step 1 commit: only `use-listbox.test.tsx` (+25). Step 2 commit: only `use-listbox.test.tsx` |
| `git -P diff --stat 17f00cd92 feat/add-option-list-v2 -- src/option-list/__tests__` | empty |
