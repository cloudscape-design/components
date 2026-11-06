# Pre-push cleanup of #5239 and #5180 on the shared listbox API

#5239 (`refactor/use-listbox-in-select`) gets one new commit, `a77424765` "refactor: Tidy the shared listbox API". `useListbox` now returns `listRenderProps`, sets `isMultiSelect` in `getListProps`, reads selected options from the selection model and drops `mouseHandlers`. Select, Multiselect and embedded Multiselect spread the shared props, and the Select-named list types are renamed. #5180 (`feat/add-option-list-v2`) is rebased onto it and gets one new commit, `c1fa5ab7e` "refactor: Tidy OptionList on the shared listbox API". That commit adapts OptionList to the new API, removes the dead `OptionsList.onMouseLeave`, switches to `prepareOptions` and `data-test-index`, moves the value checks into the memo, adds `getRootProps`, removes the second End press, and corrects the old commit message under "Correction:". Every required audit item is done, or partly done with a sound reason (B2 `interactiveGroups`). Select and Multiselect render the same DOM. No disallowed test or snapshot changed, and nothing was pushed.

Watch for: A6 quietly drops the dev warning for a group child without `value` in OptionList, and the commit message doesn't say so (confirmed, non-blocking). The rebased #5180 commits `df0ae79fb`..`8e6167746` no longer type-check on their own (confirmed, non-blocking if the PR is squash-merged).

**Verdict**: APPROVED

## High-level view

On #5239, `useListbox` builds `listRenderProps` (`ref: scrollToIndex`, `highlightType`, `screenReaderContent: announcement`, `getOptionProps`, `selectionType`). `useSelect` and `useMultiselect` pass it through, and all three list call sites spread it first, so their own props (`filteringValue`, `listBottom`, `hasDropdownStatus`, `firstOptionSticky`, `renderOption`, `listProps`) still apply on top. `isMultiSelect` now reaches `OptionsList` through `getListProps` → `getMenuProps` → `listProps`. The value is `true` for Multiselect, because `useMultiselect` passes a `multiSelection` model, and `undefined` for Select, so `aria-multiselectable` doesn't change. Select now gets an explicit `selectionType="single"`, which matches the existing default in `renderOptions` and `Item`.

B2 is partly done for a recorded reason. `selectedOptions` is read from `selection`, but `interactiveGroups` stays an input. A `use-select.test.ts` case combines `useInteractiveGroups: true` with the default `singleSelection`, so the two values can differ. `useSelect` still returns `scrollToIndex`, `highlightType`, `announcement` and `getOptionProps` next to `listRenderProps`, because its tests read them.

On #5180, OptionList spreads `listRenderProps` and overrides only `getOptionProps`, adding `hideTopDivider`, the test class and `data-value`. `prepareOptions(internalOptions, 'none', '')` produces the same `flatOptions` as `flattenOptions` and also generates the test indexes. `throughIndex` is 1-based and counts top-level options and group children while skipping `type: 'parent'` rows. That equals the old `leafIndex + 1`, so A5's switch to `data-test-index` is equivalent. As A4 expected, OptionList rows gain `data-test-index`, `data-group-index` and `data-child-index` and lose `data-option-index`; the component is unreleased. Ids, `aria-activedescendant` and `aria-multiselectable` are unchanged, because no hook was added or reordered and `isMultiSelect` now comes from `getListProps`.

<details>
<summary>Issues (2)</summary>

1. **A6 drops the child-level value warning** (confirmed, non-blocking). `checkOptionValueField('OptionList', 'options', options)` only checks top-level elements. Every OptionList group has `options`, so a group child without `value` no longer warns, and before this change it did. Either mention this in the `c1fa5ab7e` message ("like Select and Multiselect, group children aren't checked"), or keep checking the leaf options.
2. **Intermediate #5180 commits don't type-check** (confirmed, non-blocking). After the rebase, `df0ae79fb`..`8e6167746` still pass `menuProps`, `isMultiSelect` and `selectedOptions` to the new API, and only `c1fa5ab7e` fixes that. This is harmless if #5180 is squash-merged. If its commits land individually, fold the fix into those commits.

</details>

<details>
<summary>Details</summary>

### Item-by-item

| Item | Branch | Status | Evidence |
|---|---|---|---|
| A1 list render props | #5239 | done | `ListRenderProps` in `use-listbox.ts`. Spread in `select/internal.tsx`, `multiselect/internal.tsx` and `multiselect/embedded.tsx`. Each caller keeps its own props, which come after the spread. |
| A2 `isMultiSelect` | #5239 | done | `getListProps` sets `selection.selectionType === 'multi' \|\| undefined`, and `BaseListProps` now includes `isMultiSelect`. The prop is removed from `ListProps`, PlainList, VirtualListOpen and VirtualListClosed, and the literals are removed from Multiselect and embedded Multiselect. `OptionsList` still renders `aria-multiselectable` only when `isMultiSelect` is true. |
| B1 `mouseHandlers` | #5239 | done | Removed from `UseListboxApi` and from the return value. The test reads the handlers through `getListProps`. |
| B2 redundant inputs | #5239 | partly done, sound reason | `selectedOptions` input removed. `interactiveGroups` kept because the test-backed `useSelect` case differs (see the high-level view). |
| B4 + B5 types and names | #5239 | done | `ScrollToIndexRef` is in `listbox/interfaces.ts`, and `use-listbox.ts` no longer imports from `parts/plain-list`. `SelectListProps` → `ListProps`, namespace removed. `useUniqueId('select-list-')` unchanged. No `SelectListProps` or `SelectListRef` left in `src` or `pages`. |
| B6 `menuProps` → `listProps` | #5239 | done | PlainList, VirtualList, Select's local variable, both Multiselect call sites and the dev page are renamed. `getMenuProps` and `menuId` are kept in `useSelect`. The remaining `menuProps=` in `prompt-input/menu-dropdown.tsx` belongs to Autosuggest's list, which is out of scope. |
| B11 + B12 docstrings | #5239 | done | "undefined when `highlightedIndex` is -1". "whenever the highlighted index changes". |
| Adapt to #5239 | #5180 | done | `useOptionList` returns `listRenderProps` and `getRootProps`. It no longer passes `selectedOptions` or sets `isMultiSelect`. `git diff refactor/use-listbox-in-select feat/add-option-list-v2` on `plain-list.tsx`, `use-listbox.ts` and `options-list/index.tsx` shows only OptionList's own additions (`scrollStrategy`, optional `onEscape`/`getParent`, the `statusType` default). The rebase conflict resolution kept both sides. |
| B3 dead `onMouseLeave` | #5180 | done | Removed from `OptionsListProps`, its destructuring and the element. The `Omit` is gone. |
| A4 `prepareOptions` | #5180 | done | `prepareOptions(internalOptions, 'none', '')`. `flattenOptions` and `leafIndexes` removed. The group-header class uses `option.type === 'parent'`, which is the same set as before. |
| A5 `data-test-index` | #5180 | done, semantics equivalent | `generateTestIndexes` counts `child` and untyped items from 1 and skips `parent` rows, which equals `leafIndex + 1`. `get-item-props.ts` sets the attribute on the row. Only the selector in `findOptionByIndex` changed. |
| A6 value checks | #5180 | done, with issue 1 | Raw `options` passed. Both `Set` computations are inside the `useMemo`, and `warnOnce` still runs in render. |
| A11 `getRootProps` | #5180 | done | `getRootProps: () => ({ onKeyDown: onTypeAhead, onMouseLeave })` is spread after `className` and `ref`, the same position as the old explicit props. |
| B14 second End press | #5180 | done | Keys `[down, end, home, up]`, expected `['1', 'special', '0', 'special']`. |
| B13 commit wording | #5180 | done | The `Correction:` paragraph is in the `c1fa5ab7e` body. `8e6167746` (formerly `aa5383ed2`) was rebased but its message was not rewritten. |

### Process checks

| Check | Result |
|---|---|
| One cleanup commit per branch | `a77424765` on `5dc61eeb4`. `c1fa5ab7e` on `8e6167746`. `a77424765` is an ancestor of `feat/add-option-list-v2`. |
| Test changes | #5239: only `listbox/__tests__/use-listbox.test.tsx` (B1 and B2 mechanical changes). #5180, against the backup: that same file, plus `highlight.test.tsx` (B14) and the `test-utils/dom/option-list` selector (A5). No other test file changed. |
| Snapshots | No snapshot file in either commit. The coder ran the snapshot suites without `-u` and they passed: 110/110 on #5239, 111/111 on #5180. The test-utils snapshot is unchanged because it records class selectors, not attributes. |
| `git diff refactor/use-listbox-in-select feat/add-option-list-v2 -- src/select src/multiselect` | empty |
| Staged or committed artifacts | No `package-lock.json`, `tsconfig.json`, `pages/tsconfig.tsbuildinfo`, `.agents/` or `.kiro/` in either commit. All three worktrees show only `?? pages/tsconfig.tsbuildinfo`. |
| Nothing pushed | `ls-remote` shows `feat/add-option-list` = `24173f991` and `refactor/use-listbox-in-select` = `318ee8036`. There is no remote `-v2` branch. #5239 is 3 commits ahead of origin. |
| Untouched branch and worktree | `feat/add-option-list` = `17f00cd92` (reflog unchanged). `.worktrees/option-list-rebase` HEAD = `17f00cd92`, clean apart from the untracked tsbuildinfo. |
| Backup branch | `backup/feat-add-option-list-v2-aa5383ed2` → `aa5383ed2` |
| Builds and tests (coder's record) | quick-build, build, `tsc` (root and pages, with only the 2 known @formatjs errors), eslint, unit tests (1178 tests on #5239, 1241 on #5180) and functional tests all pass on both branches. Not re-run here. |

### A6 warning scope

Before, the check ran on the leaf options (top-level options and group children). Now it runs on `options`, where `checkOptionValueField` accepts any element that has `options` or `value`. OptionList requires `value` on groups (`8968e0c19`), and every group has `options`, so group children are never inspected. One child without `value` now produces no warning. Two such children still trigger the duplicate-value warning, because `values` comes from the flattened leaves. `value` is required in the TypeScript types, so only untyped JS consumers lose the warning. No test covers it. The audit said "the result is the same", which is not quite right. The coder caught the difference in `step2-verification.md`, but the commit message only says "as in Select and Multiselect".

</details>

<details>
<summary>File map</summary>

#5239 `a77424765`:
- `src/internal/components/listbox/use-listbox.ts`: `ListRenderProps`, `isMultiSelect` in `getListProps`, `selectedOptions` read from `selection`, `mouseHandlers` removed, docstrings
- `src/internal/components/listbox/interfaces.ts`: `ScrollToIndexRef`
- `src/internal/components/listbox/parts/plain-list.tsx`, `src/select/parts/virtual-list.tsx`: `ListProps`, `listProps`, `isMultiSelect` prop removed
- `src/select/internal.tsx`, `src/select/utils/use-select.ts`: spread and return `listRenderProps`, `selectedOptions` input dropped
- `src/multiselect/internal.tsx`, `src/multiselect/embedded.tsx`, `src/multiselect/use-multiselect.tsx`: spread `listRenderProps`, literals removed
- `pages/dropdown/list-with-sticky-item.page.tsx`: `menuProps` → `listProps`
- `src/internal/components/listbox/__tests__/use-listbox.test.tsx`: mechanical B1/B2 changes

#5180 `c1fa5ab7e`:
- `src/option-list/internal.tsx`: `prepareOptions`, memoized checks, `listRenderProps` spread, `getRootProps`
- `src/option-list/use-option-list.ts`: new API, `getRootProps`
- `src/internal/components/options-list/index.tsx`: `onMouseLeave` removed
- `src/test-utils/dom/option-list/index.ts`: `data-test-index`
- `src/option-list/__tests__/highlight.test.tsx`: B14

Full diffs: `git -P show a77424765`, `git -P show c1fa5ab7e`, `git -P diff backup/feat-add-option-list-v2-aa5383ed2 feat/add-option-list-v2`.

</details>
