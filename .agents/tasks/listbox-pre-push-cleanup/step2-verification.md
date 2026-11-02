# Step 2 verification: #5180 pre-push cleanup

Worktree `.worktrees/option-list-on-use-listbox`, branch `feat/add-option-list-v2`. Not pushed.

## Start state

- Branch `feat/add-option-list-v2`, HEAD `aa5383ed2` on `5dc61eeb4` (33 commits on top), clean apart from untracked `pages/tsconfig.tsbuildinfo`. Matched the expected state.
- Backup: `backup/feat-add-option-list-v2-aa5383ed2` → `aa5383ed2`.

## Rebase

`git rebase --onto refactor/use-listbox-in-select 5dc61eeb4 feat/add-option-list-v2` (onto `a77424765`).

One conflict, in commit 25/33 `df2e92f17 refactor: Use PlainList in OptionList` (now `df0ae79fb`), file `src/internal/components/listbox/parts/plain-list.tsx`, in the PlainList parameter list. Resolution kept both sides: Step 1's `}: ListProps, ref: React.Ref<ScrollToIndexRef>` plus the OptionList commit's `scrollStrategy = 'menu',` destructuring (the `scrollStrategy` prop, docstring and `scrollOptionIntoView` switch merged cleanly). All other 32 commits applied without conflicts. After the rebase, `git diff backup/feat-add-option-list-v2-aa5383ed2 HEAD` was exactly the 11-file Step 1 diff (no OptionList content lost).

The rebased commits before the new commit still use the old API in `src/option-list/internal.tsx` and `use-option-list.ts` (`menuProps`, `isMultiSelect` prop, `selectedOptions` input), so `df0ae79fb`..`8e6167746` don't type-check on their own; the new commit fixes that. History of those commits was not rewritten beyond the rebase.

## New commit

`c1fa5ab7ed51d95e8daaf36910044db077940d26` `refactor: Tidy OptionList on the shared listbox API`

```
 .../options-list/index.tsx          |  3 -
 .../__tests__/highlight.test.tsx    |  4 +-
 src/option-list/internal.tsx        | 80 +++++--------
 src/option-list/use-option-list.ts  | 24 +---
 .../dom/option-list/index.ts        |  2 +-
 5 files changed, 40 insertions(+), 73 deletions(-)
```

Body ends with a `Correction:` paragraph for B13 (see below).

## `git log --oneline 318ee8036..HEAD`

```
c1fa5ab7e refactor: Tidy OptionList on the shared listbox API
8e6167746 refactor: Build OptionList on the shared useListbox hook
2acb991cd chore: Simplify OptionList options documentation
d8be2d4dd chore: Split OptionList permutations into single and multi pages
8fd774bc5 fix: Pass group headers to renderHighlightedAriaLive as the consumer's group
8968e0c19 fix: Require group values in OptionList
4db5ce7ca refactor: Use shared keyboard navigation in OptionList
979ee253d refactor: Use shared listbox helpers in OptionList
ddd8dc10a chore: Remove OptionList import restriction from ESLint config
df0ae79fb refactor: Use PlainList in OptionList
1a02830c3 revert: Restore Select and Multiselect type-ahead and renderOption behavior
555fd999b fix: Add gap between icon and content in OptionList options
c293b4d95 test: Remove OptionList tests covered by listbox tests
f5a626159 test: Prune redundant OptionList unit tests
67af29cf8 test: Split OptionList unit tests by feature
9fd42dca3 fix: Skip OptionList scroll when nothing is highlighted
869dd21d9 feat: Add renderHighlightedAriaLive to OptionList
f94b5db23 fix: Require option values in OptionList
9de77c1a5 fix: Start OptionList keyboard focus on the selected option despite hover
afb54a866 fix: Wrap OptionList arrow keys at the first and last highlightable options
aac86b2e2 fix: Keep OptionList highlight in sync when options change
2a2c1186c fix: Scroll OptionList highlight on repeated keyboard navigation
195c7e09e fix: Keep disabled reason description with custom OptionList options
058538c78 fix: Pass the group state as parent in OptionList renderOption
f99386ab1 fix: Ignore handled keys in OptionList type-ahead
ee3eb7f20 fix: Ignore non-matching group headers in OptionList type-ahead
cf0d0365b feat: Add OptionList renderOption item types
54dcf4727 test: Drop duplicate root scroll container from OptionList scroll page
1aefeb0f5 chore: Use page templates for OptionList dev pages
3479e624a test: Cover OptionList disabled reason tooltip Escape
61aa6f9e7 fix: Use own i18n namespace in OptionList
bdbe06cd0 chore: Clean up OptionList tests and dev pages
fd35d1bee fix: Prevent native page scroll on Home and End in OptionList
8c3018821 feat: Add OptionList component
a77424765 (refactor/use-listbox-in-select) refactor: Tidy the shared listbox API
5dc61eeb4 refactor: Share base list props through useListbox
97391cac5 refactor: Move list scrolling and active descendant into useListbox
```

## Items

| Item | Status | Notes |
|---|---|---|
| Adapt to Step 1 | done | `useOptionList` returns `listRenderProps` from `useListbox`; `InternalOptionList` spreads it onto `PlainList` and overrides `getOptionProps` (calls `listRenderProps.getOptionProps`, then adds `hideTopDivider`, test class, `data-value`). `menuProps` → `listProps`. The `isMultiSelect` PlainList prop and the `isMultiSelect` entry in `useOptionList`'s list props are gone; `getListProps` sets it. `selectedOptions` input to `useListbox` dropped (B2 partly done in Step 1); `interactiveGroups: selection.interactiveGroups` kept because Step 1 kept that input. `scrollToIndex`, `highlightType`, `announcement`, `getOptionProps` are no longer returned separately by `useOptionList`. |
| B3 | done | `onMouseLeave` removed from `OptionsListProps`, its destructuring and the `<Tag onMouseLeave>`; `options-list/index.tsx` now differs from #5239 only by the `statusType` default. `use-option-list.ts` types `listProps` as plain `ListElementProps` (no `Omit`). |
| A4 | done | `prepareOptions(internalOptions, 'none', '')` in the `useMemo` gives `flatOptions` and `parentMap` and runs `generateTestIndexes`. `flattenOptions` import and `leafIndexes` map removed. The group-header test class now checks `option.type === 'parent'`, which is the same set as "not in `leafIndexes`". Rows now also carry `data-test-index`, `data-group-index`, `data-child-index` (DOM addition on an unreleased component). |
| A5 | done | Semantics match: `generateTestIndexes` gives `throughIndex` 1-based, counting top-level options and group children in list order and skipping `type: 'parent'` rows, i.e. `leafIndex + 1`. `getItemProps` sets it as `data-test-index` on the same row element (through `getBaseProps`) for both top-level and nested rows. `findOptionByIndex` now uses `[data-test-index="${index}"]`; `data-option-index` and `leafIndexes` removed. Covered by the unchanged `group-state.test.tsx` (`findOptionByIndex(3)` with groups → `s3`) and the other `findOptionByIndex` uses in OptionList tests. test-utils snapshots unchanged (they record class selectors, not attributes). |
| A6 | done | `checkOptionValueField('OptionList', 'options', options)` with the raw options, like Select. The value and group-value lists and their `Set` sizes are computed inside the `useMemo` (`hasDuplicateValues`, `hasDuplicateGroupValues`); `warnOnce` stays in render. **Nuance**: before, the check ran on leaf options, so a group child without `value` warned; now, like Select and Multiselect, only top-level elements are checked, so a child without `value` inside a group no longer triggers this dev warning (two or more such children still trigger the duplicate-value warning). Dev-only warning, no test covers it. |
| A11 | done | `useOptionList` returns `getRootProps: () => ({ onKeyDown: onTypeAhead, onMouseLeave })`; root `<div {...getRootProps()}>`. |
| B14 | done | `highlight.test.tsx` "keyboard moves scroll the highlighted option into view": keys `[down, end, home, up]`, expected `['1', 'special', '0', 'special']`. |
| B13 | done | No history rewrite of `8e6167746` (was `aa5383ed2`). New commit body: "Correction: the message of 'refactor: Build OptionList on the shared useListbox hook' says that aria-activedescendant is always set, also when no option is highlighted. That is wrong: it is not set when no option is highlighted. The behavior that comes back in the follow-up is that aria-activedescendant can name a row that no longer exists after the options shrink." |

## Commands (in the worktree, all via `mise exec node@22.23.2 --`)

| Command | Result |
|---|---|
| `npm run quick-build` (baseline, rebased tree before edits) | fail, expected: `option-list/internal.tsx` passes `menuProps` to PlainList, `use-option-list.ts` passes `selectedOptions` to `useListbox` (old API) |
| jest list (baseline, rebased tree before edits) | 62 suites fail to run (incomplete lib from the failed build), 21 pass / 205 tests. Not a usable baseline |
| Baseline attempt at `aa5383ed2` in a temp worktree `/tmp/ol-baseline-aa5383ed2` with symlinked node_modules | quick-build failed (TS2742 from the symlinked node_modules path), not a usable baseline; temp worktree removed |
| `npm run quick-build` (after) | pass |
| `TZ=UTC npx jest -c jest.unit.config.js src/select src/multiselect src/autosuggest src/property-filter src/internal/components/listbox src/internal/components/options-list src/internal/components/selectable-item src/option-list` (after) | 83 suites, 1241 tests, all pass |
| `TZ=UTC npx jest -c jest.unit.config.js src/option-list` (after) | 8 suites, 62 tests, all pass |
| `TZ=UTC npx jest -c jest.unit.config.js src/__tests__/functional-tests` | 10 suites, 1987 tests, all pass |
| `npx eslint` on the 5 changed files | clean |
| `npx tsc -p tsconfig.json --noEmit` | pass |
| `npx tsc -p pages/tsconfig.json --noEmit` | only the 2 known @formatjs errors; no dev page needed changes |
| `npm run build` | pass |
| `TZ=UTC npx jest -c jest.unit.config.js src/__tests__/snapshot-tests` (no `-u`) | 4 suites, 113 tests, 111 snapshots passed; unchanged |
| `git -P diff refactor/use-listbox-in-select feat/add-option-list-v2 -- src/select src/multiselect` | empty |
| `git checkout -- pages/tsconfig.tsbuildinfo package-lock.json` | tsbuildinfo is untracked (pathspec error, left untracked, not staged); package-lock.json unchanged |

## Test counts

No runnable baseline after the rebase (see above). Comparison instead:

- Step 1 (`refactor/use-listbox-in-select`): the same list without `src/option-list` = 75 suites, 1178 tests.
- After: 83 suites, 1241 tests = 1178 + 62 OptionList tests (8 suites) + 1 `use-listbox.test.tsx` test added by `aa5383ed2`.
- No test was added or removed by this step: the only test edit (B14) changes key presses inside one test. Test files vs the backup branch differ only as shown below.

## Snapshots

Unchanged (documenter and test-utils). A5 changed only an attribute in a selector string inside a method, which the snapshots don't record.

## Test-file diffs vs `backup/feat-add-option-list-v2-aa5383ed2`

`git diff backup/feat-add-option-list-v2-aa5383ed2 HEAD -- '*__tests__*' src/test-utils`:

- `src/internal/components/listbox/__tests__/use-listbox.test.tsx`: Step 1's diff (mouse handlers via `getListProps`, `selectedOptions` input removed), identical to the diff in `step1-verification.md`.
- `src/option-list/__tests__/highlight.test.tsx` (B14):

```diff
-    const scrolledValues = [KeyCode.down, KeyCode.end, KeyCode.end, KeyCode.home, KeyCode.up].map(keyCode => {
+    const scrolledValues = [KeyCode.down, KeyCode.end, KeyCode.home, KeyCode.up].map(keyCode => {
       pressKey(listbox, keyCode);
       return lastScrolledValue();
     });
-    expect(scrolledValues).toEqual(['1', 'special', 'special', '0', 'special']);
+    expect(scrolledValues).toEqual(['1', 'special', '0', 'special']);
```

- `src/test-utils/dom/option-list/index.ts` (A5):

```diff
-    return this.findComponent(`.${styles.option}[data-option-index="${index}"]`, OptionListOptionWrapper);
+    return this.findComponent(`.${styles.option}[data-test-index="${index}"]`, OptionListOptionWrapper);
```

No other test file changed.
