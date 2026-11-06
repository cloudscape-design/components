# Pre-push cleanup: #5239 and #5180

Each branch has one new local commit. Nothing has been pushed. The review verdict is **APPROVED** after one review round, with two non-blocking findings (see "Review").

## New commits

### #5239 `refactor/use-listbox-in-select` (worktree `.worktrees/listbox-use-listbox`)

`a7742476571328ba50f495d8dad79e56c59d793e` "refactor: Tidy the shared listbox API", parent `5dc61eeb4`. The branch is 3 commits ahead of `origin/refactor/use-listbox-in-select` (`318ee8036`).

```
 .../list-with-sticky-item.page.tsx  |  2 +-
 .../__tests__/use-listbox.test.tsx  | 52 ++++++-----
 .../listbox/interfaces.ts           |  3 +
 .../listbox/parts/plain-list.tsx    | 27 ++----
 .../listbox/use-listbox.ts          | 60 ++++++++-----
 src/multiselect/embedded.tsx        |  9 +-
 src/multiselect/internal.tsx        |  9 +-
 src/multiselect/use-multiselect.tsx | 10 +--
 src/select/internal.tsx             | 14 +--
 src/select/parts/virtual-list.tsx   | 44 +++++----
 src/select/utils/use-select.ts      |  2 +-
 11 files changed, 113 insertions(+), 119 deletions(-)
```

### #5180 `feat/add-option-list-v2` (worktree `.worktrees/option-list-on-use-listbox`)

The 33 OptionList commits were rebased onto `a77424765`. The old head `aa5383ed2` is now `8e6167746`. There was one conflict, in `plain-list.tsx` during `df0ae79fb` "refactor: Use PlainList in OptionList", and the resolution kept both sides. A new commit sits on top:

`c1fa5ab7ed51d95e8daaf36910044db077940d26` "refactor: Tidy OptionList on the shared listbox API", parent `8e6167746`.

```
 .../options-list/index.tsx          |  3 -
 .../__tests__/highlight.test.tsx    |  4 +-
 src/option-list/internal.tsx        | 80 +++++--------
 src/option-list/use-option-list.ts  | 24 +---
 .../dom/option-list/index.ts        |  2 +-
 5 files changed, 40 insertions(+), 73 deletions(-)
```

**Backup branch:** `backup/feat-add-option-list-v2-aa5383ed2` → `aa5383ed2` (the pre-rebase head).

## Items on #5239

| Item | Status | Notes |
|---|---|---|
| A1 list render props | done | `useListbox` returns `listRenderProps`: `ref`, `highlightType`, `screenReaderContent`, `getOptionProps` and `selectionType`. Select, Multiselect and embedded Multiselect spread it, and each keeps its own props after the spread. Select now passes `selectionType="single"` explicitly. That is already the default, so the output doesn't change. |
| A2 `isMultiSelect` | done | `getListProps` sets `isMultiSelect` from the selection model. The prop and the literals are removed from the list components and from Multiselect. `aria-multiselectable` doesn't change. |
| B1 `mouseHandlers` | done | Removed from `UseListboxApi`. The test reads the handlers through `getListProps`. |
| B2 redundant inputs | partly done | The `selectedOptions` input was removed. **`interactiveGroups` was skipped** because a `use-select.test.ts` case combines `useInteractiveGroups: true` with the default `singleSelection` (`interactiveGroups: false`), so the two values really differ. |
| B4 `ScrollToIndexRef` | done | Moved to `listbox/interfaces.ts`. `use-listbox.ts` no longer imports from `parts/plain-list`. |
| B5 renames | done | `SelectListProps` → `ListProps` and `SelectListRef` → `ScrollToIndexRef`, with the namespace removed. The `useUniqueId('select-list-')` prefix is unchanged. |
| B6 `menuProps` → `listProps` | done | Renamed in PlainList, VirtualList, Select, Multiselect and the dev page. `getMenuProps` and `menuId` in `useSelect` are kept, and Autosuggest's `menuProps` is untouched. |
| B11 docstring | done | `activeDescendantId` doc: "undefined when `highlightedIndex` is -1". |
| B12 docstring | done | `scrollToIndex` doc: "whenever the highlighted index changes". |

## Items on #5180

| Item | Status | Notes |
|---|---|---|
| Adapt to #5239 | done | `useOptionList` returns `listRenderProps`. OptionList spreads it and overrides only `getOptionProps`, adding `hideTopDivider`, the test class and `data-value`. The `selectedOptions` input and the `isMultiSelect` prop are dropped. |
| B3 dead `onMouseLeave` | done | Removed from `OptionsListProps`, its destructuring and the element, so the `Omit` is no longer needed. |
| A4 `prepareOptions` | done | Uses `prepareOptions(internalOptions, 'none', '')`, and `flattenOptions` and `leafIndexes` are removed. Rows gain `data-test-index`, `data-group-index` and `data-child-index`. This DOM change is fine because OptionList is unreleased. |
| A5 `data-test-index` | done | `findOptionByIndex` uses `[data-test-index="N"]`. Its numbering is the same as the old `leafIndex + 1`: 1-based, with group headers skipped. |
| A6 value checks | done, with a caveat | `checkOptionValueField` now gets the raw `options`, like Select. The `Set` computations moved into the `useMemo`. **Caveat:** a group child without `value` no longer gets the missing-value dev warning, and the commit message doesn't mention it. |
| A11 `getRootProps` | done | `getRootProps: () => ({ onKeyDown: onTypeAhead, onMouseLeave })` is spread on the root, in the same position as the old explicit props. |
| B14 second End press | done | The keys are now `[down, end, home, up]` and the expected values are `['1', 'special', '0', 'special']`. |
| B13 commit wording | done | The `c1fa5ab7e` body has a `Correction:` paragraph. `8e6167746` itself was not rewritten. |

## Tests

| Branch | Before | After |
|---|---|---|
| #5239, listbox, select, multiselect, autosuggest and related suites | 75 suites, 1178 tests | 75 suites, 1178 tests, all pass |
| #5239, functional tests | n/a | 10 suites, 1969 tests, all pass |
| #5180, same suites plus `src/option-list` | no usable baseline (see below) | 83 suites, 1241 tests, all pass |
| #5180, `src/option-list` only | n/a | 8 suites, 62 tests, all pass |
| #5180, functional tests | n/a | 10 suites, 1987 tests, all pass |

The rebased #5180 tree doesn't build before `c1fa5ab7e`, because the intermediate commits still use the old API. A baseline run at `aa5383ed2` in a temporary worktree failed on symlinked `node_modules`. The 1241 tests break down as 1178 from #5239, plus 62 OptionList tests, plus 1 `use-listbox` test added by `aa5383ed2`. This step added and removed no tests. B14 only changes the key presses inside one test.

`quick-build`, `build`, `tsc` (root, plus pages with only the 2 known @formatjs errors) and eslint pass on both branches.

**Not run:** the OptionList integ tests were not run locally because port 8080 is in use. They cover the Home/End risk from audit item B15, so check them in CI.

## Snapshots

- #5239: 4 suites, 112 tests, 110 snapshots passed, unchanged. Run without `-u`.
- #5180: 4 suites, 113 tests, 111 snapshots passed, unchanged. Run without `-u`.
- A5 produced no test-utils snapshot diff. The snapshot records class selectors, and A5 changed only the attribute inside a selector string.

## Review

**APPROVED** in 1 review round, after one fix-log sanity pass that found no omissions and made no code changes. Non-blocking findings:

1. **A6 warning scope.** A group child without `value` no longer warns in OptionList. Two such children still trigger the duplicate-value warning. The TypeScript types require `value`, so only untyped JS consumers are affected. You can either mention this in the `c1fa5ab7e` message or keep checking the leaf options.
2. **Intermediate commits don't type-check.** `df0ae79fb`..`8e6167746` don't type-check on their own, and only `c1fa5ab7e` fixes them. This is harmless if #5180 is squash-merged.

Other checks passed:
- `git diff refactor/use-listbox-in-select feat/add-option-list-v2 -- src/select src/multiselect` is empty.
- Neither commit includes a lockfile, tsconfig, tsbuildinfo, `.agents/` or `.kiro/` file.
- Both worktrees show only the untracked `pages/tsconfig.tsbuildinfo`.
- `feat/add-option-list` (`17f00cd92`) and `.worktrees/option-list-rebase` are untouched.
- The remote heads are unchanged: `feat/add-option-list` = `24173f991` and `refactor/use-listbox-in-select` = `318ee8036`.

## Push commands (not run)

```bash
git push origin refactor/use-listbox-in-select
git push --force-with-lease=feat/add-option-list:24173f991 origin feat/add-option-list-v2:feat/add-option-list
```

Push #5239 first, because #5180 is built on `a77424765`.
