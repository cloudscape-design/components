# OptionList PR (#5180) cleanup: pages, tests, listbox trim, groups and Home/End fix

The uncommitted change on `feat/add-option-list` (HEAD 5601acf6f) cuts OptionList down to the sibling-component shape. It keeps three pages (`simple`, `permutations`, `scroll`), one unit file, and two integ files split by page. It removes the visual definition and trims the shared listbox engine to what OptionList actually reaches. Two approved additions come with it: the API proposal's second revision (own `Option` type with an `icon` slot, one level of `OptionGroup`, `renderOption`, group-header test-utils, `findOptionsContainer`/`findOption` removed) and a Home/End `preventDefault` in the list key handler. The Home/End fix is the root cause of the CI integ failures, and the verification file backs it with a `scrollY` probe. Every coverage item in the brief is still asserted, `item.tsx`/`use-listbox.ts` coverage rose to about 97/100% lines, and only OptionList imports the trimmed engine files.
Watch for: the API and Home/End changes go beyond "cleanup". They are approved in the plan but must land as separate `feat:`/`fix:` commits and be described in the PR. The `OptionGroup` doc block omits `value`, which `findGroupHeaderByValue` depends on. The untracked `.agents/` directory in the worktree must stay out of the commits.

**Verdict**: APPROVED

## High-level view

OptionList now has its own public `Option` type. `internal.tsx` turns each option into the shared `OptionDefinition` (the `icon` slot becomes `__customIcon`) and keeps a map back to the consumer's objects. Because of that map, `onChange` and `renderOption` receive the original options, which the unit tests check by reference for both leaves and groups. Groups go through `flattenOptions`. Single selection follows Select's rules: headers are not highlightable and arrows skip them. Multi selection follows Multiselect's rules through `multiSelection(..., { interactiveGroups: true })`. All of this is the approved section 6 API, not a cleanup. The documenter and test-utils snapshot diffs match it.

The engine trim (`use-listbox.ts`, `listbox/index.tsx`, `parts/list.tsx`, `parts/item.tsx`) removes dropdown/combobox/select-all/virtual/sticky paths that no caller in this PR reaches. A grep confirms only `src/option-list/internal.tsx` imports `listbox/index` and `use-listbox`. `render-options.tsx` picks `ListboxItem` only when `selectionType` is set (OptionList), so Select's and Multiselect's own items are untouched. The stray `virtualIndex` prop that `render-options.tsx` still passes is dropped by `getBaseProps`.

The Home/End fix is scoped to the list key handler and leaves the shared `useMenuKeyboard` alone. A unit test checks `defaultPrevented` on the native event. The probe table in the verification file shows the page keeps moving after the highlight scroll without the fix and stays still with it. That is a root cause, not a retry or a sleep. The integ `PageDown` step is replaced by a programmatic scroll to the top, which takes out the other native-animation race. The visual `.screenshot-area` failure is put down to the baseline host (built from `origin/main`) having no `option-list/permutations` page. Deleting the definition and re-adding it after merge follows the control-group precedent.

Test and page structure now match radio-group/tiles/token-group: one unit file grouped by feature with a single `test.each` a11y test, a bare `<h1>` + `ScreenshotArea` + `PermutationsView` permutations page, and integ tests split per page with the page object inline. Every page left is used by an integ test or is the standard simple/permutations pair.

<details>
<summary>Issues (4)</summary>

1. **Scope beyond cleanup** — the public types, test-utils API and Home/End behaviour change. Per the plan the user approved all three, but the verbatim request only says "clean up". Land them as the separate `fix:` and `feat:` commits the verification file proposes, and add the Keyboard/API/visual-follow-up notes to the #5180 description, so a reviewer can tell them apart from the cleanup. (non-blocking, confirmed)
2. **`OptionGroup` doc omits `value`** — the `options` doc block in `interfaces.ts` lists `label`, `disabled`, `options` for groups, but `data-value` on headers and `findGroupHeaderByValue` rely on the group `value`. Add a `value` line (or update the proposal text). (non-blocking, confirmed)
3. **Untracked `.agents/` in the worktree** — `git status` shows `.agents/` untracked in the worktree. Stage files by name in the commit step so it is not committed. (non-blocking, confirmed)
4. **Hard-coded Home/End key codes in unit tests** — `option-list.test.tsx` defines `HOME = 36`/`END = 35`, while `src/internal/keycode` exports `KeyCode.home`/`KeyCode.end`, and the code under test uses those. Importing them would remove the magic numbers. (nit, confirmed)

</details>

<details>
<summary>Details</summary>

### Original-object mapping and groups in `internal.tsx`

`toInternalOptions` copies every leaf and group and records `internal → original` in `originals`. `onChange` maps the next selection through `originals.get(option) ?? option`. In controlled multi mode, the options kept from `selectedOptions` are already consumer objects, so the fallback returns them unchanged and only newly chosen internal copies are mapped. The unit tests "onChange returns the original option objects" (with an `icon`) and "onChange returns the original options and never a group" check this by `toBe`. `renderOriginalOption` maps `item.option` and `item.parent.option` the same way. The renderOption test checks the exact item shapes for single (group, and item with parent) and multi (group with `indeterminate`/`selected`/`highlighted`). The duplicate-value warning and `checkOptionValueField` run over leaves only, and `data-option-index` counts leaves only, matching the test-utils docs ("Group headers are not counted").

### Home/End and the CI integ race

```ts
const listKeyDownHandler: CancelableEventHandler<BaseKeyDetail> = event => {
  if (event.detail.keyCode === KeyCode.home || event.detail.keyCode === KeyCode.end) {
    event.preventDefault();
  }
  menuKeyDownHandler(event);
};
```

This is an OptionList-only behaviour change. Home/End no longer scroll the page or the surrounding container to its top or bottom. It is the reason the change needs its own `fix:` commit and a PR note (issue 1). The verification file records integ runs of 12/12, three times in a row, plus once with `--maxWorkers=1` under parallel load with no retries. That is reasonable evidence for the CI flake, though the change has not run on CI itself yet.

### Coverage kept vs. the brief

The unit file still asserts:

- Selection: single and multi, controlled, value matching and uncontrolled. `onChange` fires on re-select.
- Disabled options: clicks ignored, keyboard reaches them but Enter does not select, a selected disabled option stays selected, and the disabled reason is shown through both `aria-describedby` and the tooltip.
- Keyboard: arrows with wrap-around, Home/End plus `defaultPrevented`, Enter and Space, type-ahead, and blur.
- Focus entry: highlights the first option, the selected option (with the keyboard style), or the first selected option in list order. Focus from a pointer adds no highlight and does not scroll.
- Scrolling: keyboard moves scroll the highlight into view, and mouse hover highlights without scrolling.
- Escape propagates to a parent `onKeyDown`, with no `onChange`.
- a11y over single/multi, flat and grouped.
- `ref.focus()`, and every test-utils method (`findGroupHeaders`, `findGroupHeaderByValue`, `findHighlightedOption`, `findSelectedOptions`, `findOptionByIndex`/`ByValue`, `findLabel`/`Description`/`LabelTag`/`Tags`, `is*`).

The integ scroll matrix (wrapper/root/page × keyboard scrolling + preselected near-end, plus Dropdown × `expandToViewport`) keeps real-browser scroll-into-view and the "page does not scroll on open" check. The removed `scrollOptionIntoView` mock tests are covered through OptionList's unit scroll tests. Line 194 of `item.tsx` (tooltip `onEscape`) is the only uncovered line left. Leaving it uncovered instead of adding a filler test is justified.

</details>

<details>
<summary>File map</summary>

- `src/option-list/interfaces.ts` — own `Option` with `icon`, `OptionGroup`, `Options`, `renderOption`, proposal doc text.
- `src/option-list/internal.tsx` — option conversion and original mapping, groups, `renderOption` passthrough, leaf-only index/test classes.
- `src/option-list/test-classes/styles.scss` — `.group-header`.
- `src/test-utils/dom/option-list/index.ts` — removed `findOptionsContainer`/`findOption`, added group-header finders, `is*` docs.
- `src/internal/components/listbox/use-listbox.ts` — trimmed API, Home/End `preventDefault`.
- `src/internal/components/listbox/index.tsx`, `parts/list.tsx`, `parts/item.tsx`, `parts/styles.scss` — removed unreachable props/paths.
- `src/internal/components/listbox/__tests__/scroll-to-index.test.ts` — reverted to base.
- `src/option-list/__tests__/option-list.test.tsx` — regrouped, new group/renderOption/tooltip/Home-End/Escape tests.
- `src/option-list/__integ__/option-list.test.ts` — simple page only, plus a group-header click.
- `src/option-list/__integ__/option-list-scroll.test.ts` — new; scroll matrix and Dropdown cases.
- `pages/option-list/{simple,permutations,scroll}.page.tsx`, `scroll.scss` — trimmed/standardised; dropdown merged into `scroll`.
- Deleted: `pages/option-list/dialog.page.tsx`, `in-dropdown.page.tsx`, `in-dropdown.scss`, `test/definitions/visual/option-list.ts`.
- Snapshots: `documenter.test.ts.snap`, `test-utils-selectors.test.tsx.snap`.

Full diff: `git -C /Users/amanabiy/Documents/components/.worktrees/pr3-option-list diff HEAD`.

</details>
