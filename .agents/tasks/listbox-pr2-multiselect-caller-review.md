# Multiselect as the first caller of the shared `multiSelection` model

`useMultiselect` drops its own option toggle, group toggle, select-all toggle and `isAllSelected` code and calls `multiSelection(selectedOptions, { options: filteredOptions, allOptions: flatOptions, interactiveGroups: true })` instead. The point is to prove the model from PR 2 against the existing Multiselect suites before OptionList uses it. Gating, `isSomeSelected`, and row/group rendering state stay in `useSelect`, which is unchanged. The change also adds the "does not check disabled, read-only or non-interactive" doc comment to `SelectionModel.getNextSelection` and three new gap tests. No model implementation changes.

Watch for: nothing blocking. The local branch is rebased onto `origin/main`, so diffing against the remote PR branch pulls in two unrelated main commits (confirmed). Publishing it will need a force-push to `refactor/add-listbox-selection-models`, or a separate branch.

**Verdict**: APPROVED

## High-level view

Every removed formula has an exact counterpart in `multi-selection.ts` (confirmed by side-by-side reading). Group toggle is `group.options` filtered to visible and enabled, then toggled with "disabled counts as selected". Option toggle appends on select and filters on deselect. Select-all ON iterates `all` in flat option order and keeps hidden selections. Select-all OFF filters out visible values. `isAllSelected` is `all.every(...)`. Matching uses the same `findOptionIndex` and value Sets as before, and the returned `OptionDefinition` references are the same, so the `onChange` detail shape, order and fire/no-fire cases all hold. `onChange` still fires once per call, with no conditions.

The caller contracts hold. R1: `useSelect.selectOption` (use-select.ts 141-144) is still the only dropdown entry point and gates before calling `toggleAll`/`updateSelectedOption`. R3: the model reads `OptionDefinition.disabled` through `item.option`, not the wrapper `disabled`. R4: `allOptions: flatOptions` and `options: filteredOptions` are passed as required. R5: row matching stays in `useSelect`. With empty options and select-all, `isAllSelected` stays `[].every(...) === true`. `isSomeSelected` correctly stays `selectedOptions.length > 0` and is not derived from the select-all group state.

The scope is clean. `git diff HEAD --stat` shows only `use-multiselect.tsx`, `interfaces.ts` and the known `package-lock.json`, plus the new untracked test file. No existing test file was edited, and Select, `useSelect`, OptionList, styles and public API are untouched. The verification file covers diff stat, quick-build, full build, eslint/prettier, targeted unit suites (71/71), full unit suite (one known flake, passed on its own re-run), Multiselect integ (45/45), Select and property-filter integ (91/91), and the learning section.

<details>
<summary>Issues (2)</summary>

1. **Branch base differs from the remote PR branch** (confirmed, non-blocking): HEAD `6212527e0` is the PR 2 commit rebased on `origin/main`, while `origin/refactor/add-listbox-selection-models` is at `a8338d870` on `c07a7e33a`. Decide whether to force-push the rebased PR 2 branch or put this change on its own branch on top of the remote one before publishing.
2. **Kept comment now sits above `fireNonCancelableEvent`** (confirmed, nit): the comment "ignores disabled options to prevent getting stuck" in `updateSelectedOption` describes logic that now lives in `multiSelection.toggle`, which has its own copy. Consider rewording it to say the model does this, e.g. "the model ignores disabled options…", so it doesn't read as orphaned.

</details>

<details>
<summary>Details</summary>

### Parity of the select-all and group paths

`toggleAll` used to inline `isAllVisibleSelectableSelected ? selected.filter(!visible) : allNonParent.filter(selected || (!disabled && visible))`. The model's `toggleAll` is the same expression over `visible = nonParentOptions(filteredOptions)` and `all = nonParentOptions(flatOptions)`. The model's `nonParentOptions` also strips `select-all`, which can't appear in `flatOptions` or `filteredOptions`, so the lists are identical. The group branch used to call `isGroup(option)` on the raw argument. It now wraps it as `{ option }` and the model calls `isGroup(option.option)`, which is the same check. A wrapper with no `type` can't hit the select-all branch, so a raw select-all-like option from token dismiss can't be misrouted. Token dismiss passes `selectedOptions[i]`, which may not be in `options`. It still goes through `toggle([option])` → found by value → removed, as before.

One quirk carries over unchanged and is recorded in the verification file: select-all ON reorders the selection to option order and drops selected values that aren't in `options`. It is out of scope here.

### New tests

`selection-order.test.tsx` locks in three behaviours the existing suites didn't cover, and the coder ran it against the old code first. The three cases are: a group pick under filtering selects only visible enabled children, a partially selected group re-appends all its enabled children after other selections, and the select-all row disappears when the filter matches nothing. The tests use public test-utils and are named by behaviour, per `tests.instructions.md`. The empty-options `isAllSelected` value isn't observable when the select-all row isn't rendered, so the existing `select-all.test.tsx` `options: []` case is the real guard for it.

Not tested at unit level: select-all ON with a selected value missing from `options` (the drop quirk). It's pre-existing and unchanged, so this is informational.

</details>

<details>
<summary>File map</summary>

- `src/multiselect/use-multiselect.tsx`: replaces inline selection logic with `multiSelection`; removes `useMemo`, `findOptionIndex` and `isGroup` imports.
- `src/internal/components/listbox/selection/interfaces.ts`: doc comment on `getNextSelection` saying it doesn't gate.
- `src/multiselect/__tests__/selection-order.test.tsx` (new, untracked): three gap tests for group-under-filter, group order, and select-all under empty filter.
- `package-lock.json`: known unrelated local change, ignored.

Full diff: `git -C .worktrees/pr2-selection-models diff HEAD` plus the untracked test file.

</details>
