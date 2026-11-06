# What Select/Multiselect and the OptionList listbox engine can share

Read-only analysis of `.worktrees/pr3-option-list` at `9e4db4e02` (stacked on `origin/refactor/add-listbox-selection-models`, #5179), the four local fix branches, and `origin/main` (`2f15b033e`, which includes #5178). No builds or tests were run. Line counts are estimates from reading the code.

## Summary

- There are two real wins: the type-ahead hook and the option row component. Once the fix PR lands, both are copies of what OptionList adds.
  - `select/utils/use-native-search.ts` on `fix/multiselect-type-ahead` and `listbox/use-type-ahead.ts` differ only in names (`useNativeSearch`→`useTypeAhead`, `useInteractiveGroups`→`interactiveGroups`) and import paths.
  - `listbox/parts/item.tsx` is `select/parts/item.tsx` and `select/parts/multiselect-item.tsx` merged behind `selectionType: 'single' | 'multi'`. It already includes the `fix/render-option-parent-disabled` behavior. To serve Select and Multiselect it is missing five things: `virtualIndex`, the select-all row, `afterHeader`, `DropdownOption.disabledReason`, and `isSelectAll`.
- Several pieces are already shared and need no work: highlight state (`useHighlightedOption`), `useMenuKeyboard`, `useAnnouncement` (including `renderHighlightedAriaLive`), `connectOptionsByValue`, `checkOptionValueField`, `renderOptions`, `getItemProps`, `OptionGroup`, `scroll-to-index.ts`, and the selection models.
- Some code is shareable with a small helper, but has only one consumer until OptionList exists: the arrow-key wrap logic, Home/End prevention, and the `getOptionProps`/`isSelectedAt`/`announceSelected` logic.
- Some code should not be shared now, because OptionList differs on purpose: focus entry, the scroll strategy, the highlight following its option when options change, and the `List` component compared with `PlainList`/`VirtualList`.
- Recommendation: make one `refactor:` PR, **"refactor: Share option rendering and type-ahead between Select and Multiselect"**. Stack it on the fix PR. It does not need #5179. It changes about 600 lines, with a net reduction of about 150 product lines, and the risk is low. It removes `item.tsx`, `styles.scss` and `use-type-ahead.ts` (plus its test) from the OptionList stack. The type-ahead PR shrinks to wiring only (about 10 product lines), and the disabled PR shrinks to public types and a test-util method.
- An optional second PR, **"refactor: Share listbox keyboard wrap and option props"**, stacked on #5179 and the fix PR, moves the remaining shared logic out of `use-select.ts`. Then no OptionList PR touches Select code.
- Copilot items:
  - The type-ahead group/child value collision can be fixed in one place after the move. It is a real Multiselect bug, so fix it in the fix PR.
  - Stable row keys were already fixable in one place, because `render-options.tsx` was moved to `listbox/parts` in #5178. Sharing the row component does not change that, so keep this item deferred.

## Candidate table

Legend: A = identical or near-identical, move as-is. B = shareable with a small option. C = don't share now.
"Sel lines removed" = lines removed from Select/Multiselect. "OL lines removed" = lines removed from the OptionList stack. "New" = lines of new option/param code.

| # | OptionList piece | Select/Multiselect piece | Cat. | Sel lines removed | OL lines removed | New | Risk to Select/Multiselect, and covering tests |
|---|---|---|---|---|---|---|---|
| 1 | `listbox/use-type-ahead.ts` (94) + `__tests__/use-type-ahead.test.ts` (121) | `select/utils/use-native-search.ts` (99, after `fix/multiselect-type-ahead`) + `select/__tests__/use-native-search.test.ts` (67, from the fix branch) | **A**: rename the file and the `useInteractiveGroups` prop, update 2 call sites (`select/internal.tsx:174`, `multiselect/use-multiselect.tsx:174`), and merge the 2 unit test files into one | about 99 (file) + about 40 (duplicate tests after the merge) | 94 + 121 (they exist already) | 0 | None if done after the fix PR. Covered by `select/__tests__/native-search.test.tsx` and `multiselect/__tests__/native-search.test.tsx` (fix branch), `select.test.tsx` and `multiselect.test.tsx` type-ahead cases, and `multiselect/__integ__/multiselect.test.ts`. |
| 2 | `listbox/parts/item.tsx` (259) | `select/parts/item.tsx` (218) + `select/parts/multiselect-item.tsx` (225), after `fix/render-option-parent-disabled` | **B**: add `virtualIndex` (the renderOption `index` becomes `virtualIndex ?? index`, for both the item and `parentProps`), the select-all branch (`isSelectAll` on `SelectableItem`, a `type: 'select-all'` render item, a checkbox `indeterminate` for select-all), `afterHeader={option.afterHeader}`, and `option.disabledReason \|\| wrappedOption.disabledReason`. Drop `hasCheckbox`: Select never passes `checkboxes`, and Multiselect always does (`multiselect/internal.tsx:257`, `embedded.tsx:86`), so `selectionType` covers it. | about 443 | 259 (exists already) | about 30 | Low; the DOM order and props match. Diffing the two files shows the same `SelectableItem` props, the same `.item`/checkbox/check/description placement, and the same parent-disabled and kept-description behavior from the fix branch. Covered by `select/__tests__/{render-option,disabled,select,select-a11y,virtual-scroll,analytics-metadata,group-state}`, `multiselect/__tests__/{render-option,select-all,multiselect,multiselect-embedded,group-state,analytics-metadata}`, and visual regression. One leak: renderOption `index` under virtual scroll (tested in `virtual-scroll.test.tsx`). |
| 3 | `listbox/parts/render-options.tsx` `selectionType` branch (+17) | `render-options.tsx` picks `useInteractiveGroups ? MultiselectItem : Item` (on main since #5178) | **A** after #2: always render `ListboxItem`. `PlainList`/`VirtualList` pass `selectionType` from `isMultiSelect`. | about 8 | 17 | about 3 | None |
| 4 | `listbox/parts/styles.scss` (36: `.item`, `.checkbox`, `.selected-icon`, `.show-label-tag`, `.disabled-reason-tooltip`) | the same rules in `select/parts/styles.scss` | **A**: keep the rules in `select/parts/styles.scss`, have `ListboxItem` import `select/parts/styles.css.js` (as `listbox/parts/option-group.tsx` already does), and delete the listbox copy | 0 | 36 | 0 | None. Moving the rules instead would change the `select` entry in the test-utils selectors snapshot. `OptionWrapper.findDisabledReason` (`test-utils/{dom,selectors}/internal/option.ts`) looks up `select/parts` `disabled-reason-tooltip`. As a side effect, keeping one class makes OptionList's tooltip findable through that same wrapper, which the separate listbox class breaks today. |
| 5 | `listbox/parts/scroll-to-index.ts` `scrollOptionIntoView` | the default export (`scrollBy` with the 15px guard) | **C**: already in one file. OptionList scrolls through ancestors on purpose; Select must only scroll the menu (AWSUI-60318). | 0 | 0 | 0 | n/a |
| 6 | `use-listbox.ts` wrap (`goUp`/`goDown`, about 14 lines) | `use-select.ts` `goUp`/`goDown` after `fix/select-empty-group-wrap` | **B**: the code is identical after the fix. Extract `getWrappingNavigation({ options, highlightedIndex, isHighlightable, moveHighlight, goHome, goEnd })` next to `useHighlightedOption`. | about 12 | about 12 | about 18 | Low. Covered by `select/__tests__/arrow-key-wrap.test.tsx` (fix branch), `use-select.test.ts`, `use-highlight-option.test.ts`. |
| 7 | `use-listbox.ts` `listKeyDownHandler` Home/End `preventDefault` (about 9 lines) | `useMenuKeyboard` `preventNativeHomeEnd` (fix branch) | **A** after the fix: OptionList passes `preventNativeHomeEnd: true` and deletes its wrapper. This change can go straight into the OptionList Core PR, because it doesn't touch Select. | 0 | about 9 | 0 | None. Covered by `options-list/__tests__/use-keyboard.test.ts`. |
| 8 | `use-listbox.ts` `isSelectedAt` + `getOptionProps` + `announceSelected` (about 35 lines) | `use-select.ts` `getOptionProps` + `announceSelected` (about 35 lines) | **B**: one pure helper, `getListboxOptionProps({ option, index, options, selection, selectedSet, highlightedOption, isHighlightable, listId })` with the select-all branch, plus `isAnnouncedSelected`. The select-all branch is unreachable for OptionList. | about 30 | about 30 | about 40 | Low to medium: the select-all neighbor rule ("select-all never counts as a selected neighbour"). Covered by `select/__tests__/group-state.test.tsx`, `multiselect/__tests__/{group-state,select-all,selection-order}.test.tsx`, `use-select.test.ts`. Needs #5179 (`selection.getGroupState`). |
| 9 | highlight state (`useHighlightedOption`) | same | **already shared** | 0 | 0 | 0 | n/a |
| 10 | `use-listbox.ts` options-change highlight follow (`isSameOption`, about 25 lines) | Select resets the highlight on filter change (`getFilterProps.onChange`) | **C**: OptionList-only behavior. Adopting it would change Select's highlight after filtering. | 0 | 0 | 0 | n/a |
| 11 | `use-listbox.ts` `onFocus` (selected option first, even after hover) | `use-select.ts` open effect (mouse vs keyboard open, `highlightFirstOptionWithMouse`) | **C**: the difference is intentional | 0 | 0 | 0 | n/a |
| 12 | `use-announcement.ts`, `renderHighlightedAriaLive` | same hook, used by `select/internal.tsx:269` and `use-multiselect.tsx:206` | **already shared** (#5178/#5179) | 0 | 0 | 0 | n/a |
| 13 | `utils/connect-options.ts`, `utils/check-option-value-field.ts`, `selection/*`, `parts/get-item-props.ts`, `parts/option-group.tsx`, `parts/common.ts` | same | **already shared** (#5178/#5179) | 0 | 0 | 0 | n/a |
| 14 | `listbox/parts/list.tsx` (78) + `listbox/index.tsx` (56) | `select/parts/plain-list.tsx` (122), `virtual-list.tsx` (138) | **C for this PR**: `PlainList` adds sticky, `listBottom`, dropdown status and `scrollBy`. A `scrollMode` prop could later fold `List` into `PlainList`, but that only serves OptionList, so it belongs in the Core PR if wanted. | 0 | 0 | 0 | n/a |

## Copilot items that were deferred

- **Type-ahead lookup when a group and a child share a value.**
  - Cause: `findMatchingOption` finds the current child with `matchingOptions.map(o => o.option.value).indexOf(currentHighlight.value)`. With interactive groups, a group header with the same value comes first in that list, so the cycle restarts from the wrong place.
  - Fix: `matchingOptions.findIndex(({ option }) => option === currentHighlight)`. This works for groups and children, so the `isGroup` branch goes away. Identity matching is safe, because the hook filters each option on its own (`filterOptions([option], …)`) and keeps the original `DropdownOption`, and `highlightedOption.option` comes from the same array.
  - This is a real Multiselect bug, not only an OptionList one. Add it as a commit on `fix/multiselect-type-ahead` with a Multiselect test. Then the refactor moves fixed code, and the OptionList type-ahead PR gets it for free.
- **Row keys by stable identity** (`key={globalIndex}` in `render-options.tsx`). This was already fixable in one place, because the file has been shared since #5178. Sharing the item doesn't change that. Keep it deferred:
  - Values are optional in Select and Multiselect, so the key needs an index fallback.
  - Duplicate values would produce duplicate keys.
  - `VirtualList` attaches `measureRef` by index.
  - All three would need their own tests.

## Recommended scope

### PR A: `refactor: Share option rendering and type-ahead between Select and Multiselect`

Base: `main` after the fix PR merges. It does not need #5179, because nothing in it uses `SelectionModel`. If #5179 merges first, rebase; the only overlap is import lines in `use-multiselect.tsx`.

1. `git mv src/select/utils/use-native-search.ts src/internal/components/listbox/use-type-ahead.ts`. Rename `useNativeSearch` to `useTypeAhead` and the prop `useInteractiveGroups` to `interactiveGroups`. Update `select/internal.tsx` and `multiselect/use-multiselect.tsx`. Move `select/__tests__/use-native-search.test.ts` to `listbox/__tests__/use-type-ahead.test.ts`. Keep the component-level `native-search.test.tsx` files.
2. Create `src/internal/components/listbox/parts/item.tsx`: the OptionList version plus `virtualIndex`, select-all, `afterHeader` and `DropdownOption.disabledReason`, with styles imported from `select/parts/styles.css.js`. Delete `select/parts/item.tsx` and `select/parts/multiselect-item.tsx`. In `use-select.ts`, take `ItemProps` from the new path.
3. `render-options.tsx`: render `ListboxItem` with `selectionType`. `plain-list.tsx` and `virtual-list.tsx` pass `selectionType={isMultiSelect ? 'multi' : 'single'}`. Drop `hasCheckbox` from `get-item-props.ts` and its test.
4. Verify with `npm run build` (snapshots unchanged), `npx jest -c jest.unit.config.js src/select src/multiselect src/internal/components/listbox src/internal/components/options-list` (see `docs/RUNNING_TESTS.md`), and the Select/Multiselect integ and visual tests in CI.

Size: about 600 changed lines (most of it moved code), a net reduction of about 150 product lines, and about 40 duplicate test lines removed. Risk: low. No public types change. The DOM, classes and test-utils selectors stay the same.

### PR B (optional): `refactor: Share listbox keyboard wrap and option props`

Base: #5179 + the fix PR. It covers rows #6 and #8 (and #7 if `use-listbox` exists by then; otherwise #7 goes into OptionList Core). It changes about 120 lines, and the risk is low to medium (the select-all neighbor rule).

The trade-off: before OptionList lands, these helpers have only one consumer (`use-select`). Do PR B only if the goal is that no OptionList PR touches `src/select` or `src/multiselect`. Otherwise, the OptionList Core PR can extract these helpers. One PR with A+B is possible (about 700 lines), but it would then need #5179 and would mix a pure move with logic extraction. Keep them as two PRs.

## Impact on the OptionList 5-PR stack

Product-line estimates are from `option-list-feature-split.md`.

| PR | Before | After PR A | After PR A+B |
|---|---|---|---|
| 1 Core | about 1,000 | about 790 (drops about 140 lines of `item.tsx`, 36 of `styles.scss`, 17 of the `render-options` branch, and uses `preventNativeHomeEnd`) | about 730 (also drops the `use-listbox` wrap and option-props code) |
| 2 Disabled | about 45 | about 10 (only the public `disabled`/`disabledReason` fields and `isDisabled` test-util; the tooltip and description are in the shared item) | same |
| 3 Groups | about 115 | about 100 (the item group parts are shared) | about 80 (the `groupState`/`isSelectedAt` group branches are shared) |
| 4 Type-ahead | about 100 + 190 tests | about 10 product lines + OptionList tests (`onTypeAhead` wiring only; the hook and its unit test already exist) | same |
| 5 Custom rendering | about 160 | about 85 (only the OptionList `Item` types, `renderOriginalOption` and the passthrough; `toRenderItem` is shared) | same |

- **PRs that disappear:** Disabled and Type-ahead become too small to stand alone. Fold Disabled into Core and Type-ahead into Groups, which gives three PRs: Core (with disabled), Groups (with type-ahead), and Custom rendering. Folding type-ahead into Groups keeps its group-header regression test next to the group code, as the earlier split analysis recommended.
- **Split work that goes away:** the subtractive splitting of `item.tsx` across PRs 1, 2, 3 and 5 is no longer needed, because the full item already exists on main. OptionList PRs only add public API and wiring.
- **Merge order:** fix PR → (#5179, PR A in either order) → PR B (optional) → OptionList Core → Groups → Custom rendering. OptionList Core still needs #5179.
