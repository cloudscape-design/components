# Move shared option list parts to listbox

The branch moves the option-list parts that Select and Multiselect duplicate into `src/internal/components/listbox/`, in three commits on top of origin/main 544e4286a. The type-ahead hook `useNativeSearch` becomes `listbox/use-type-ahead.ts` (`useTypeAhead`, option `interactiveGroups`). `select/parts/item.tsx` and `multiselect-item.tsx` merge into `listbox/parts/item.tsx`, which picks its row with `selectionType: 'single' | 'multi'`. `render-options` passes `selectionType` and the dead `checkboxes`/`hasCheckbox` plumbing is removed. Finally `select/parts/plain-list.tsx` moves to `listbox/parts/plain-list.tsx`. The product output of Select and Multiselect is unchanged: in the product, Select never set `checkboxes` or `useInteractiveGroups` and both Multiselect call sites always set both, so one `selectionType` value reproduces every combination the product uses.

Watch for: two dev pages render differently because they used combinations the product never produces. `list-with-sticky-item` now shows checkboxes, and the single-with-checkbox permutations on `item.permutations` (a screenshot page) now render as multi rows (confirmed, dev pages only, non-blocking). The merged `item.tsx` is paired as a rename only at `-M30%`, so GitHub will likely show it as a 371-line add plus two deletes.

**Verdict**: APPROVED

## High-level view

The merged item keeps both former render functions as two explicit JSX branches over shared hooks, a shared `<Option>` element and a shared disabled-reason fragment. Compared line by line with origin/main, each branch matches its source file. Single keeps `disabled={option.disabled}`, the `show-label-tag` class, the check icon and the disabled reason inside `.item`. Multi keeps the combined `disabled`, `ariaChecked`/`ariaSelected` for indeterminate parents, `isSelectAll`, `afterHeader`, `useInteractiveGroups`, the checkbox with select-all included in `indeterminate`, and the disabled reason as a sibling of `.item`. The renderOption item builders are copied verbatim. They keep `virtualIndex ?? index`, and the child's `parent.disabled` still comes from the child, so none of the fix-branch changes (`parentProps.disabled`, dropped `virtualIndex`, description kept with custom content) leaked in. `{...baseProps}` still spreads last, so the `data-*` analytics attributes and `id` are unchanged.

The type-ahead and PlainList commits only change imports and names. `use-type-ahead.ts` keeps its logic and comments, and PlainList's sticky, `listBottom`, `scrollToIndex` and `withScrollbar` handling is untouched. All moved files still import `select/parts/styles.css.js`, the same as the existing `listbox/parts/option-group.tsx`, so class names and test-utils selectors stay the same. The verification note records no snapshot changes, and no snapshot files are in the diff.

`SelectionType` comes from `listbox/selection/interfaces.ts`, which is on origin/main from #5179 (5a5372a42). The branch does not depend on `origin/refactor/add-listbox-selection-models`. The merge-base is origin/main, and no package-lock, tsbuildinfo, `.agents` or `.kiro` files are committed. The untracked `pages/tsconfig.tsbuildinfo` in the worktree is unstaged.

The dev-page fallout follows from removing `hasCheckbox`. On `item.permutations`, the single-with-checkbox rows now render as multi rows. They still show the same checkbox and no check icon, and `SelectableItem.disabled` gives the same value because the fixture sets `DropdownOption.disabled`. They gain `aria-checked` and the `interactiveGroups` class. That class affects styling only on parents (dividers, group padding) and on the cursor, and none of these permutations is a parent, so the screenshot should not change (likely). `list-with-sticky-item` passed `useInteractiveGroups` without `checkboxes`, a combination the merged item can no longer render, so it now shows checkboxes. The page has no ScreenshotArea and no integ test references it.

<details>
<summary>Issues (3)</summary>

1. **Sticky-item dev page gains checkboxes** (confirmed, non-blocking): `pages/dropdown/list-with-sticky-item.page.tsx` now renders multi rows with checkboxes. Mention this in the PR description so reviewers know it is intended.
2. **Permutations screenshot mapping** (likely no visual diff, non-blocking): the `hasCheckbox: true` permutations on `pages/select/item.permutations.page.tsx` became `selectionType: 'multi'`. If visual regression reports a diff on this page, it comes from this mapping. Note it in the PR description.
3. **Item rename not detected at default similarity** (confirmed, non-blocking): `listbox/parts/item.tsx` pairs with `select/parts/item.tsx` only at `-M30%`. The PR will show a full add and two deletes, about 966 changed lines instead of the planned ~700. Tell reviewers in the PR description to compare each branch with its old file.

</details>

<details>
<summary>Details</summary>

### Merged item vs the two originals

Checked against `git show origin/main:src/select/parts/{item,multiselect-item}.tsx`:

- `disabledReason`: single reads `wrappedOption.disabledReason`, multi reads `option.disabledReason || wrappedOption.disabledReason`. Both gate it on `disabled`, as before.
- Checkbox: multi renders it under `!renderResult` alone. This equals the old `!renderResult && hasCheckbox`, because Multiselect always passed `checkboxes={true}`. Single drops the checkbox branch, which was unreachable for Select.
- Single check icon: `!renderResult && !isParent && selected` equals the old condition with `hasCheckbox=false`.
- `indeterminate` is now destructured in the single branch and ignored. Before, it went into `restProps`, and `getBaseProps` dropped it. Output is the same.
- `useMergeRefs` moved from inline JSX to just after the `useEffect`. The order is fixed across renders, so React keeps working. It now runs before the user's `renderOption` call instead of after. That only matters if a `renderOption` callback calls hooks, which is already unsupported. No behavior change.
- `ItemParentProps` makes `indeterminate`, `highlighted` and `selected` optional, and a private `MultiselectItemParentProps` keeps the required form for `toMultiselectOptionGroupItem`. The parent object from render-options is unchanged.

The typed casts per branch (`renderOption as SelectProps.SelectOptionItemRenderer` / `as MultiselectProps.MultiselectOptionItemRenderer`) avoid `as any` and match the plan.

### Commit structure

`23eae758a` (type-ahead), `586bfedd2` (item merge plus plumbing) and `ccd5025fe` (PlainList) each build on their own, according to the verification note. `git log --stat -M` shows the hook, its test and `plain-list.tsx` as renames. The item merge is a delete and an add at default similarity (see Issues). No file outside the stated scope is touched. `virtual-list.tsx`, `use-select.ts` and `use-multiselect.tsx` change only in imports, prop names and the `interactiveGroups` key.

### Verification evidence

The verification note records `npm run build`, quick-build after each commit, 56/56 suites and 801/801 tests (matching the baseline), snapshot tests at 110/110 with no `-u`, clean eslint, and clean root `tsc`. `pages/tsconfig.json` shows only two pre-existing `@formatjs` `Intl.ListFormat` errors from the shared node_modules overlay. Not re-run, per the step instructions. A grep of `src` and `pages` finds no remaining references to `hasCheckbox`, `checkboxes=`, `useNativeSearch`, or the old `select/parts/{item,multiselect-item,plain-list}` paths.

</details>

<details>
<summary>File map</summary>

- `src/internal/components/listbox/use-type-ahead.ts` (renamed from `select/utils/use-native-search.ts`): import paths updated, `useTypeAhead` and `interactiveGroups` renames.
- `src/internal/components/listbox/__tests__/use-type-ahead.test.ts` (renamed): imports and names.
- `src/internal/components/listbox/parts/item.tsx` (new): merged single/multi row.
- `src/select/parts/item.tsx`, `src/select/parts/multiselect-item.tsx`: deleted.
- `src/internal/components/listbox/parts/render-options.tsx`: `selectionType` replaces `checkboxes`/`useInteractiveGroups`, and it always renders `Item`.
- `src/internal/components/listbox/parts/get-item-props.ts` and its test: `checkboxes`/`hasCheckbox` removed.
- `src/internal/components/listbox/parts/plain-list.tsx` (renamed from `select/parts/plain-list.tsx`): imports updated, `selectionType` prop.
- `src/select/parts/virtual-list.tsx`: `selectionType` prop, `SelectListProps` import path.
- `src/select/internal.tsx`, `src/multiselect/{internal,embedded,use-multiselect}.tsx`, `src/select/utils/use-select.ts`: import paths, `selectionType="multi"`, and the `interactiveGroups` key.
- `pages/select/item.permutations.page.tsx`, `pages/dropdown/list-with-sticky-item.page.tsx`: new import paths and `selectionType` mapping.

Full diff: `git -C .worktrees/refactor-move-listbox-parts -P diff -M origin/main...HEAD`.

</details>
