# useSelect reads Multiselect group state from the selection model

`useSelect` gains an optional `selection?: SelectionModel` and drops the `isAllSelected` / `isSomeSelected` props. When a model is passed (Multiselect only), every group-state read goes through `selection.getGroupState(DropdownOption)`: group rows, select-all `selected` / `indeterminate`, group neighbours, and the highlighted-group announcement. Without a model (Select), the old formula runs unchanged under the new name `getOptionGroupState`. Multiselect passes its existing `multiSelection` model, deletes its duplicated select-all locals, and turns `updateSelectedOption` from a `useCallback` that never memoized into a plain function. A new test file locks select-all, group, neighbour and announcement state, and the coder ran it against both the old and new code.

Watch for: nothing blocking. One small thing: `package-lock.json` shows up in `git diff 628dcf6ea`, but it was already modified before this change (plan and verification both say so). It must stay out of the commit.

**Verdict**: APPROVED

## High-level view

The routing is a single `getGroupState(DropdownOption)` helper. With a model it hands off to the model; without one it calls the old group formula for groups and returns `{false, false}` for anything else. The only reachable new value on the Select path would be a select-all row, and Select never builds one, so Select behaviour is the same as before (confirmed by reading `src/select/internal.tsx`, which is unchanged and passes no `toggleAll` or select-all row).

Select-all state now comes from the model's `{ selected: isAllSelected, indeterminate: !isAllSelected && isSomeSelected }`. That uses the same expressions Multiselect computed before: `all.every(...)` over `flatOptions` and `selectedOptions.length > 0`. So removing the two props is identical, not approximate (confirmed). Empty lists can't diverge, because the select-all row is only added when `filteredOptions.length > 0`.

Neighbour and announcement reads stay behind an `isGroup` check on purpose. The model does return state for select-all, so without the check the row under select-all would pick up `previous-item-selected`, and select-all would be announced as selected. Both checks are kept, a comment explains why, and new tests lock both cases.

The memoization change is behaviour-preserving. `selection` is rebuilt every render, so the old `useCallback` deps changed every time. The only callers (`selectOption`, `tokenOnDismiss`) are plain functions and no hook deps list includes the callback. The stale comment is replaced with one line pointing at the model, whose `toggle` already documents the disabled-option rule.

<details>
<summary>Issues (2)</summary>

1. **Pre-existing package-lock.json change** — it shows up in the diff against `628dcf6ea` but isn't part of this work. Stage the three source/test files by path only, as the plan says (non-blocking, confirmed).
2. **Opaque failure in the test helper** — `lastRenderedItem` indexes `calls[calls.length - 1]` with no guard. If a regression stops rendering the row, the test fails with a TypeError instead of a clear assertion. Optional: assert `calls.length > 0` first (non-blocking, confirmed).

</details>

<details>
<summary>Details</summary>

### Equivalence of the group path under the model

The model's `getOptionGroupState` is the same as useSelect's line for line, including the `!!item.value` guard and the `interactiveGroups` gate on `selected`. Multiselect builds the model with `interactiveGroups: useInteractiveGroups` (`true`), the same flag useSelect received. The model's value Set comes straight from `selectedOptions`. Group children are always real options, and both formulas skip falsy values, so the counts agree (confirmed by reading `multi-selection.ts` and `use-select.ts`). Group rows still OR in `__selectedOptionsSet.has(option)` as before.

### Select-all and neighbour gating

```
index 0  select-all   ← model says selected:true when all selected
index 1  option "1"   ← isPreviousSelected must stay false
```

Before the change, `isGroup(selectAll.option)` was false, so `isPreviousSelected` fell back to `__selectedOptionsSet.has(selectAllRow)`, which is always false. The new code keeps the same check and fallback, now on the `DropdownOption` wrapper (`has(undefined)` at the list edges is still false). The test "the row after select-all is not styled as having a selected neighbour" locks this.

### Test coverage

The new `group-state.test.tsx` covers the full select-all truth table: all, some and none selected; filtered-out options both ways; disabled options both ways; a stale selected value; and the empty list where the row isn't rendered. It also covers group `selected` / `indeterminate` and `aria-checked` (including the disabled-child case), neighbour classes in both directions, and the announcement for a selected group versus select-all. The verification log shows 16/16 passing on the stashed old code and on the new code. That shows the tests describe current behaviour and the change keeps it. No existing test file was edited, and `src/select/internal.tsx` and `listbox/selection/*` have no diff (confirmed with `git diff --stat`).

Not tested: the Select path with a model passed, and the no-model fallback for a non-group row. Neither is reachable from a public component today.

</details>

<details>
<summary>File map</summary>

- `src/select/utils/use-select.ts` — `selection` prop replaces `isAllSelected`/`isSomeSelected`; `getOptionGroupState` rename; new `getGroupState(DropdownOption)` routing; neighbour/announcement keep the `isGroup` check.
- `src/multiselect/use-multiselect.tsx` — passes `selection`; drops the select-all locals; `updateSelectedOption` is a plain function; `useCallback` import removed; comment tidied.
- `src/multiselect/__tests__/group-state.test.tsx` — new, 16 tests.
- Full diff: `git -C .worktrees/pr2-selection-models diff 628dcf6ea -- src` plus the untracked test file.

</details>
