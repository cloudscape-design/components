# Shared embedded-list focus handling in useListbox, used by embedded Multiselect and OptionList

The rewrite replaces the `focus: { entry, skipAfterPointerDown }` setting from the previous tip with one `embedded` flag on `useListbox().getListProps`. With the flag, the list gets embedded Multiselect's current handlers from origin/main: focus highlights the first option with the keyboard style if nothing is highlighted, and blur clears the highlight. `useSelect` passes its existing `embedded` prop, so its inline `if (embedded)` block moves into the shared hook. `useOptionList` passes `embedded: true` and drops the selected-option focus entry and the pointer-down guard. Moving focus to the selected option is recorded as follow-up 4 in the stack plan. The four commits keep their subjects, every file lives in the commit that owns it, and only the commit 1 and 2 bodies and the OptionList tests changed beyond the hook code.

Watch for: nothing blocking. Two non-blocking notes: a tap or click on an unfocused OptionList with no prior hover now briefly puts a keyboard highlight on the first option, as embedded Multiselect does on main (likely); and the scroll dev page's "Already selected" setting no longer affects focus until the follow-up lands (confirmed, intentional).

**Verdict**: APPROVED

## High-level view

`getListProps({ withKeyboard, embedded? })` is the only new focus API. `ListFocusOptions`, the entry values, `skipAfterPointerDown`, the `pointerDown` ref and the `onMouseDown` handler are gone. `BaseListProps` gains only `onFocus` and `onBlur`. `OptionsList` lost the named `onMouseDown` prop, and its diff against `c7d7fce91` now shows only the optional `statusType` that OptionList needs. The docstring is short and names selected-option focus as a follow-up.

Select and Multiselect behavior matches origin/main. Under `src/select` and `src/multiselect`, the diff touches only `use-select.ts`: one `getListProps` call replaces the 10-line `if (embedded)` block. The shared handlers run the same calls (`goHomeWithKeyboard` when there is no `highlightedOption`, `resetHighlightWithKeyboard` on blur) on the same `useHighlightedOption` state that `useSelect` destructures from `listbox`. The `goHomeWithKeyboard` and `resetHighlightWithKeyboard` locals in `use-select.ts` are still used elsewhere, so nothing is left unused. No Select or Multiselect test changed.

OptionList now follows the same rule. `use-option-list.ts` has no focus, blur or mousedown code of its own. It keeps the root `onMouseLeave` reset and type-ahead, and its imports are all used. No OptionList doc text, comment, dev page or documenter snapshot claims focus moves to the selected option. `highlight.test.tsx` and `option-list-scroll.test.ts` now expect the first option on focus, a kept hover highlight, and a reset on blur. The `use-listbox.test.tsx` focus tests shrank to one three-test `embedded` block.

Evidence is complete. The verification note records quick-build, tsc, the targeted jest run (83 suites, 1241 tests), the full build, snapshot tests without `-u`, and eslint on the final tip. It also records per-commit quick-build and tsc. For the iteration-2 message-only amend, I confirmed that the tree of the final tip `599443dd1` equals that of the tested `fe3484273` (`git diff --quiet` passes). Integration tests were not run because port 8080 was busy, and the note says so.

<details>
<summary>Issues (2)</summary>

1. **Pointer focus without hover (non-blocking, likely)**: without the pointer-down guard, a tap on an unfocused OptionList with no prior mousemove makes focus put a keyboard highlight on the first option before the mouseup selects the tapped row. Embedded Multiselect on main does the same thing, so this is an accepted trade-off. Revisit it with follow-up 4.
2. **Scroll page preselection is now inert for focus (non-blocking, confirmed)**: `pages/option-list/scroll.page.tsx` still offers "Already selected: Option 81", and the integ test now asserts focus lands on `Option 1`. Keep the page for the follow-up, or add a comment so readers don't expect focus to jump there.

</details>

<details>
<summary>Details</summary>

### Pointer entry after dropping skipAfterPointerDown

The previous tip used `skipAfterPointerDown` so that focus caused by a mousedown did not change the highlight. With only the `embedded` rule, a mouse user who hovered first keeps the hover highlight on focus. The new `highlight.test.tsx` case "focus keeps a hover highlight, so a click selects the hovered option" covers this. Touch input and a click with no mousemove before it take the `!highlightedOption` branch. Focus then sets a keyboard highlight on the first option, and the mouseup selects the row under the pointer. Selection stays correct because `onMouseUp` resolves the item index from the event target. The visible keyboard ring on option 1 is a brief cosmetic flash. Embedded Multiselect on main behaves the same way, and the user chose shared behavior over per-component settings (likely, not exercised in a browser here).

### Tests and dev page after the rule change

The `preselected=near-end` scroll page variant now only checks that selection doesn't steer focus. The stack plan's follow-up 4 records the open work: moving focus to the selected option for OptionList and embedded Multiselect, selection order versus list order, and the selection order that the Select dropdown's open effect uses today.

</details>

<details>
<summary>File map</summary>

- `src/internal/components/listbox/use-listbox.ts`: `embedded` flag in `getListProps`, `onFocus`/`onBlur` in `BaseListProps`, docstrings (commit 1).
- `src/internal/components/listbox/__tests__/use-listbox.test.tsx`: an `embedded` describe and an optional-`onEscape` test (commit 1).
- `src/select/utils/use-select.ts`: the inline embedded handlers become `getListProps({ withKeyboard: !hasFilter, embedded })` (commit 1).
- `src/internal/components/options-list/index.tsx`: only the optional `statusType`; the `onMouseDown` prop is gone (commit 1).
- `src/option-list/use-option-list.ts`: `getListProps({ withKeyboard: true, embedded: true })`, docstring (commit 2).
- `src/option-list/__tests__/highlight.test.tsx`, `src/option-list/__integ__/option-list-scroll.test.ts`: expectations follow the new rule (commit 4).
- Commit 3 (dev pages): tree unchanged.
- Full diff: `git -C .worktrees/option-list-on-use-listbox range-diff c7d7fce91 backup/feat-add-option-list-v2-9c86b7efc feat/add-option-list-v2`.

</details>
