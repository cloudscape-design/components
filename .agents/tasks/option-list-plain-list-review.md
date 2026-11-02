# Use PlainList in OptionList

OptionList's internal `Listbox` now renders the shared `PlainList` (`listbox/parts/plain-list.tsx`) instead of its own `List`, and `listbox/parts/list.tsx` is deleted. To keep OptionList's scroll behavior, `PlainList` gets one optional internal prop, `scrollStrategy?: 'menu' | 'ancestors'`, defaulting to `'menu'`. The default runs the existing `scrollToIndex`, so Select and Multiselect are unaffected. `'ancestors'` calls the existing `scrollOptionIntoView`. The product change is +20/−9 lines outside the deleted file, in a single local commit `5297ed2ef refactor: Use PlainList in OptionList`.

Watch for: OptionList's list element now carries an inline `scroll-padding-block-start: 0px` (confirmed, non-blocking, already accepted in the fit doc).

**Verdict**: APPROVED

## High-level view

The default path of `PlainList` is unchanged. The only edit inside the component is a ternary that picks `scrollOptionIntoView` when `scrollStrategy === 'ancestors'` and the original `scrollToIndex` otherwise. The `moveFocus`, `menuRef.current` and `!isSticky` guards, the sticky-option measurement, `listBottom`, `hasDropdownStatus`, the merged refs and the `useContainerQuery` width logic are untouched. Select and Multiselect don't pass the new prop, so they keep the menu-only `scrollBy` with the ≤ 15 px skip (AWSUI-60318).

OptionList keeps its behavior. `Listbox` passes `scrollStrategy="ancestors"`, so keyboard moves still scroll through scrollable ancestors, and mouse highlights still don't because of the `moveFocus` guard. Mount-time `-1` is still skipped by the `index < 0` guard in `scrollOptionIntoView`. `filteringValue=""`, `selectionType`, `screenReaderContent`, `getOptionProps`, `renderOption` and the `select-list-` id prefix match what `List` passed to `renderOptions`. `isMultiSelect` is passed explicitly from the merged list props, which gives the same `aria-multiselectable` as the old spread. With `firstOptionSticky` undefined, `isSticky` is always false.

The one observable difference is DOM-only. `PlainList` always passes `stickyItemBlockSize` (0 here), so `OptionsList` writes `scroll-padding-block-start: 0px` where it previously wrote nothing. `auto` resolves to 0, and the list isn't the scroll container in OptionList anyway, so scrolling is unaffected. No consumer passes `stickyItemBlockSize` through `listProps` (`option-list/internal.tsx:193`), so the override can't clobber a caller value.

The evidence is complete and matches the baseline: 1211/1211 targeted unit tests, 111/111 snapshots with none written, 137/138 integ tests with the same pre-existing `async-select` failure (expected ≤ 3, received 32), tsc and ESLint clean. No test file is in the diff. `list.tsx` is removed, and nothing in `src/` imports `parts/list`. The commit is the only one ahead of `origin/feat/add-option-list`, the working tree is clean, no remote branch contains it, and only the three intended paths are in it. The commit message has the requested title, and no public `interfaces.ts` changed.

<details>
<summary>Issues (1)</summary>

1. **Inline scroll-padding on OptionList's list (non-blocking)**: the list element gains `scroll-padding-block-start: 0px` because `PlainList` always sets `stickyItemBlockSize`. It doesn't change behavior. Accept it, as the fit doc recommends. Removing it would mean changing PlainList's default path.

</details>

<details>
<summary>Details</summary>

### `scrollStrategy` switch in PlainList

```tsx
const scroll = scrollStrategy === 'ancestors' ? scrollOptionIntoView : scrollToIndex;
scroll({ index, menuEl: menuRef.current });
```

Both functions have the same `{ index, menuEl }` signature, and `scrollStrategy` is added to the `useImperativeHandle` deps, so a prop change rebuilds the handle. The default `'menu'` reaches the same `scrollToIndex` call as before.

### Prop mapping from List to PlainList

`listProps` becomes `menuProps` and `options` becomes `filteredOptions`, and the old hardcoded `filteringValue: ''` becomes the `filteringValue=""` prop. `ListElementProps` and `MenuProps` both type-check against `OptionsList`'s props (tsc is clean). `PlainList` spreads `menuProps` before `ref`, `stickyItemBlockSize` and `isMultiSelect`. `ref` was already merged the same way in `List`, and `isMultiSelect` is passed with the same value it had in the spread. `useContainerQuery`'s callback now reads `stickyOptionRef.current`, which is always null in OptionList, so it only returns the width pair as before.

</details>

<details>
<summary>File map</summary>

- `src/internal/components/listbox/parts/plain-list.tsx`: adds the optional `scrollStrategy` prop and the ternary in `useImperativeHandle`.
- `src/internal/components/listbox/index.tsx`: renders `PlainList` with the mapped props and `scrollStrategy="ancestors"`, uses the new ref type, and updates the comment.
- `src/internal/components/listbox/parts/list.tsx`: deleted.

Full diff: `git -C .worktrees/option-list-plain-list -P diff origin/feat/add-option-list..HEAD`

</details>
