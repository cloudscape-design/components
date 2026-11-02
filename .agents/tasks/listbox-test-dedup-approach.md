# Deduplicating Select / Multiselect / OptionList tests: which approach

Worktree `/Users/amanabiy/Documents/components/.worktrees/option-list-rebase`, branch `feat/add-option-list` @ `24524f9b9`. Read-only. One throwaway prototype test was written, run and deleted. `git status` is clean at the end.

## Recommendation

Use the **hybrid**. Test shared `Item` rendering once in a new `src/internal/components/listbox/__tests__/item.test.tsx`, which renders the internal `Item` directly with `describe.each(['single', 'multi'])`. Add the type-ahead matching cases to the existing `use-type-ahead.test.ts`. Keep explicit per-component tests for keyboard, highlight, selection, and one wiring test per component for each shared feature. Delete only the component tests whose assertion is now made by the shared test and whose component wiring is still proven by another test in the same file.

The three strongest reasons:

1. **There is direct precedent, and the shared module already has a test folder.** Internal parts are already rendered and tested in isolation: `internal/components/option/__tests__/option.test.tsx` (29 tests, renders `<Option>` and wraps it with `test-utils/dom/internal/option`), `selectable-item/__tests__/selectable-item.test.tsx`, and `options-list/__tests__/options-list.test.tsx`. `listbox/__tests__/` already holds `use-type-ahead.test.ts`, `get-item-props.test.ts` and `use-announcement.test.ts`. `Item` is the only shared listbox part without a test (`grep parts/item` in `__tests__`: 0 hits).
2. **It is feasible with small fixtures.** `Item` takes a plain `DropdownOption` (`{ type?, option, disabled? }`) plus flags (`highlighted`, `selected`, `selectionType`, `renderOption`, `parentProps`). The prototype rendered `<div role="listbox"><Item index={0} option={…} selectionType={…} /></div>` and asserted through `OptionWrapper` (test-utils). Five of six cases passed on the first run: `lang` and group header description/labelTag/tags in single and multi mode, and the multi disabled header's `aria-describedby` plus tooltip. The sixth case failed for a real reason: in single mode a group header has no `role="option"`, because headers only become interactive in multi mode. The shared test has to encode that difference, and it is clearer to have it written down once.
3. **It fits the repo's test conventions and keeps failures readable.** `tests.instructions.md` says to test through the public surface with test-utils, and allows exceptions where needed. The internal `option.test.tsx` already works this way with `OptionWrapper`, and `item.test.tsx` would do the same. Each failure points at one plain test in one file. A contract suite (B) would report failures from a shared file through an adapter that hides wrapper differences, so the reader has to work out which component and which adapter branch failed.

## Comparison

Counts are test definitions (`test`/`test.each` blocks). Gap 8 (item analytics) is deferred in every approach, as the parity report recommends.

| | Added | Removed | Net | Precedent in repo | Risk | Failure readability | Effort |
|---|---|---|---|---|---|---|---|
| **A, pure** (shared layer, and also delete component lang/group-content/disabled-reason tests) | ~18 | ~20 | ~−2 | Strong (option, selectable-item, options-list tests) | Medium: drops each component's guard on its own option conversion, and Select's `expandToViewport` disabled-reason variants | Good | Medium |
| **B, contract suite** run per component through an adapter | ~14 in the suite, ×3 runs, plus ~60–80 adapter lines | ~25 | ~−11 defs, but +42 runs | Partial: `checkbox/__tests__/common-tests.tsx` (`createCommonTests`, used by checkbox and toggle) and `mixed-line-bar-chart/__tests__/test-chart-series-details.tsx` (used by 3 charts). Both precedents share one wrapper (`AbstractSwitchWrapper`) or one props shape. | High: the wrappers differ (see below), and the `renderOption` item types differ per component (Select has `trigger`, Multiselect has `select-all`) | Poor: the stack is in the shared file and the behavior depends on adapter branches | High |
| **C, status quo** (13 tests added to OptionList only) | 13 | 0 | +13 | n/a | Low | Good | Low |
| **Hybrid (recommended)** | 18 | 10 | +8 | Strong | Low | Good | Medium-low |

Why B's adapter is expensive (from `src/test-utils/dom`):
- Select and Multiselect find options with `findDropdown().findOption(n)` / `findOptionByValue` (`internal/dropdown-host.ts:188-216`). Those return `OptionWrapper` on the inner `.option` element, which has `findDisabledReason` but no `isSelected` or `isHighlighted`. OptionList returns `OptionListOptionWrapper` on the selectable-item element (`option-list/index.ts:84-131`), which has `isSelected`, `isHighlighted` and `isDisabled`. Attributes such as `aria-describedby` and `aria-checked` sit on different elements relative to each wrapper.
- Group headers: Select and Multiselect use `findGroup(index)` (a plain `ElementWrapper`), while OptionList uses `findGroupHeaderByValue`.
- Setup: Select and Multiselect need `openDropdown()` and keyboard events on the trigger or filter. OptionList needs `fireEvent.focus` and keydown on the `role="listbox"` element. Select's disabled tests also run under `describe.each([false, true])('expandToViewport=%s')` (`select/__tests__/disabled.test.tsx:36`), which the other components have no equivalent for.

## Ownership under the hybrid

### The 14 gaps (from `option-list-test-parity.md`)

| # | Behavior | Owner | Why |
|---|---|---|---|
| 1 | `lang` on options | **item.test** (single+multi) | Rendered by `Item` → `Option` (`option/index.tsx:94`). OptionList's `toInternalOptions` spreads the whole option, and its label/description tests already guard that spread. |
| 2 | Group header content; multi disabled header reason + tooltip | **item.test** | Pure `Item` rendering. The prototype proved it. Single headers have no `role=option`, so the reason part is multi only. |
| 3 | Single: group header never selected, no neighbour classes | OptionList `group-state.test` | Comes from `useListbox` (`isNextSelected`, `use-listbox.ts:235-261`) |
| 4 | Fully selected group announced as "Selected" | OptionList `i18n.test` | `useListbox` group branch (`use-listbox.ts:259-261`) |
| 5 | Mouse hover on a disabled option shows the tooltip | OptionList `disabled.test` | Mouse highlight is `useListbox` wiring. The tooltip itself is checked in item.test. |
| 6 | `renderOption`: click/Enter select; `highlighted: true` payload | Split: payload in **item.test**, click/Enter in OptionList `render-option.test` | The payload is built by `Item` (`toSelectOptionItem`). Selection is component wiring. |
| 7 | Multi-char type-ahead, match on description/tags, no-match | **use-type-ahead.test.ts** | Pure hook logic (`filterOptions(..., strict)`, 500 ms buffer). Use jest fake timers. |
| 8 | Item analytics | Deferred | Waits on the component-level analytics decision |
| 9 | `findOptionByValue` / `findGroupHeaderByValue` with special characters | OptionList `option-list.test` | Tests the OptionList test-utils wrapper (`escapeSelector`) |
| 10 | No tooltip and no `aria-describedby` without a reason | **item.test** | `Item` computes `disabledReason` and `descriptionId` |
| 11 | Multi leaf `aria-checked` | **item.test** (multi) | `Item` sets `ariaChecked` (multi branch) |
| 12 | Controlled `selectedOptions={[]}` empties the selection | OptionList `option-list.test` | `useControllable`/`useListbox` |
| 13 | Neighbour styling next to a fully selected group | OptionList `group-state.test` | `useListbox` |
| 14 | `{ options: undefined }` renders as an option | OptionList `group-state.test` | OptionList flattening |

Added: item.test 7 definitions (gaps 1, 2, 10, 11, the gap 6 payload, plus the 2 moved duplicates below), use-type-ahead 3, OptionList 8. Total 18.

### Known duplicate groups

| Group | Today | Owner | Delete | Keep (wiring) |
|---|---|---|---|---|
| D1 renderOption `parent.disabled` reflects the group | select `render-option` "parent reflects…", multiselect same, option-list `render-option` `test.each` single/multi | item.test (`describe.each` single/multi, via `parentProps`) | all 3 (Select 1, Multiselect 1, OptionList 1 def/2 cases) | Select/Multiselect "receives correct parent attribute for child item in group" still prove `parentProps` is wired |
| D2 Disabled reason kept for screen readers with custom content | select `render-option` "keeps the disabled reason…", multiselect same, option-list `disabled` "…when renderOption is used (%s)" | item.test | all 3 | the plain disabled-reason tests in each component |
| D3 Type-ahead group semantics | use-type-ahead (5 group cases), multiselect `native-search` (5), select `native-search` (3), option-list `group-state` type-ahead (3) | use-type-ahead.test | multiselect "highlights the matching option inside a group rather than the group", "highlights a group when its own label matches", "repeating a character does not cycle…"; option-list "multi: repeating a key cycles…" (4) | per component, one test proving the `useInteractiveGroups` flag (Multiselect "Enter after typing selects only…", Select "typing a group label prefix…", OptionList "multi: highlights…" and "single: skips…") and one Space-then-type test proving the handled-key flag |
| D4 Disabled-reason tooltip/a11y (select `disabled.test`, multiselect "Disabled item with reason") | — | leave | none | These run with `expandToViewport` (portal) and dropdown-close behavior that is component-specific. Deleting them buys little and widens the diff. |
| D5 Select/Multiselect `renders lang`, "group options can have description…" | — | leave (optional later) | none | They guard each component's option conversion. They are 1-assert tests. |

Removed: 2 + 2 + 2 + 4 = 10. Net +8.

## Coverage impact

I ran jest with `--coverage` on `select` + `multiselect` `render-option.test.tsx`, then again with the D1/D2 tests excluded (`-t '^(?!.*(parent reflects|keeps the disabled reason)).*'`). For `listbox/parts/item.tsx`, line coverage stayed at 75% and branch coverage went from 67.12% to 63.69%. The branches that drop (the `parentProps.disabled` mapping and the hidden description with `renderResult`) are shared code. The OptionList suite covers them today, and item.test would cover them after the change. Select's own wiring of `renderOption` is still proven by "renders custom option content", "receives correct item properties for item/group/trigger option" and "allows selection with custom rendered options". No Select-only or Multiselect-only branch loses coverage, because `Item` has no component-specific branch other than `selectionType`, and item.test runs both values.

## Commit plan (on `feat/add-option-list`; PR titles use `test:`)

1. `test: Add shared listbox item tests`. Add `src/internal/components/listbox/__tests__/item.test.tsx`. Use a `renderItem(props)` helper that renders `<div role="listbox"><Item index={0} …/></div>` from `lib/components/internal/components/listbox/parts/item` and wraps the `.option` root with `test-utils/dom/internal/option`. Cases: gaps 1, 2, 10, 11, the gap 6 payload, D1 and D2, with `describe.each(['single','multi'])` where both modes apply. Verify with `mise exec node@22.23.2 -- env TZ=UTC npx jest -c jest.unit.config.js src/internal/components/listbox`.
2. `test: Cover multi-character and field matching in type-ahead`. Add 3 cases (gap 7) to `listbox/__tests__/use-type-ahead.test.ts`, using `jest.useFakeTimers()` for the 500 ms buffer.
3. `test: Add OptionList tests for listbox wiring gaps`. Add gaps 3, 13 and 14 to `option-list/__tests__/group-state.test.tsx`, gap 4 to `i18n.test.tsx`, gap 5 to `disabled.test.tsx`, gap 6 click/Enter to `render-option.test.tsx`, and gaps 9 and 12 to `option-list.test.tsx`. Verify with `jest … src/option-list`.
4. `test: Remove listbox tests now covered by shared tests`. Delete D1 and D2 from `select/__tests__/render-option.test.tsx`, `multiselect/__tests__/render-option.test.tsx`, `option-list/__tests__/render-option.test.tsx` and `option-list/__tests__/disabled.test.tsx`. Delete the D3 tests from `multiselect/__tests__/native-search.test.tsx` and `option-list/__tests__/group-state.test.tsx`. Verify with `jest … src/select src/multiselect src/option-list src/internal/components/listbox`, and confirm the `item.tsx` coverage does not drop using `--coverage --collectCoverageFrom='**/listbox/parts/item.*'` across these folders.

Keep commit 4 separate so reviewers can see each deletion next to the shared test that replaces it, and can drop that commit if they want to keep the Select/Multiselect tests.

## Final state

`git -C …/option-list-rebase status --short` is empty. The prototype file `src/internal/components/listbox/__tests__/zz-proto-item.test.tsx` was deleted, and `/tmp/x` was removed.
