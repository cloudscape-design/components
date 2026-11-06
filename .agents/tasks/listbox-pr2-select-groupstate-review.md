# Select reads group state from `singleSelection`; `useSelect` drops its own formula

Select now builds `singleSelection(selectedOptions)` and passes it to `useSelect` next to the same `selectedOptions` array it already passed, so Select and Multiselect both get group state from a selection model. `useSelect` deletes `getOptionGroupState` and `__selectedValuesSet`, and `getGroupState` becomes a one-line delegate to the model. `selection` stays optional and defaults to `singleSelection(selectedOptions)`, because the existing `use-select.test.ts` (which this step may not edit) calls `useSelect` without it. The optional `getNextSelection` swap in Select's `updateSelectedOption` was skipped, and the skip is justified. Watch for: the default-parameter fallback keeps a test-only call shape alive in production code, and it differs from the old formula for a hypothetical caller with `useInteractiveGroups: true` and no model (possible, not reachable today; non-blocking).

**Verdict**: APPROVED

## High-level view

Select's change is minimal. The `selectedOption ? [selectedOption] : []` expression moved into a local, and that one array feeds both `selectedOptions` and the model, so the option source is unchanged. `updateSelectedOption` and the change event detail are untouched.

In `useSelect`, only the group-state path changed. I compared the deleted formula with `singleSelection.getGroupState` for Select (`useInteractiveGroups` false, at most one selected option). The old `selected` was always false because `useInteractiveGroups` was false, and the model hardcodes false. The old `indeterminate` counted children with a truthy value in a set of truthy selected values. The model counts children with a truthy value equal to the single selected value, or 0 when it's undefined. That gives the same results for no selection, a one-child group (false/false), several children (false/true), a value not in the options, `''`/undefined values (never counted), and the same value in two groups (both indeterminate). `__selectedValuesSet` had no other users; grep shows it only in comments in `single-selection.ts` and its test.

Making `selection` required was blocked only by the existing test file. The reason is in the verification file, and the plan allows that outcome. The model files, Multiselect, existing tests, and public interfaces are untouched. The build ran with no documenter or snapshot diff.

<details>
<summary>Issues (2)</summary>

1. **Fallback default diverges for interactive groups** (possible, non-blocking): a caller that omits `selection` and sets `useInteractiveGroups: true` would now get `selected: false` for a fully selected group, where the old code returned true. No caller does this today. Make `selection` required in a follow-up once `use-select.test.ts` can pass a model.
2. **Equivalence test leans on the test seam** (non-blocking): after the change, "omitting selection gives the same option props as passing single selection" compares the default model with the same model passed explicitly. It's a useful guard against old-vs-new drift (it passed on both), but it should go when `selection` becomes required.

</details>

<details>
<summary>Details</summary>

### Default model instead of a required prop

```ts
selection = singleSelection(selectedOptions),
```

This replaces a second formula with the same model Select uses, so `useSelect` now has one source of group state. That's the main goal. The cost is that `useSelect` still has a "no model" call shape. That shape exists only for `use-select.test.ts`, and it quietly gives single-selection semantics even when `useInteractiveGroups` is true (possible divergence, described in the verification file and confirmed by reading `single-selection.ts`, which returns `selected: false` unconditionally). `singleSelection` also uses only `selectedOptions[0]`, while the old set used every entry. That only matters for a no-model caller passing several selected options, which again means only the existing hook tests, and those pass unchanged. The JSDoc on `selection` describes the default accurately.

### Test coverage

The new `group-state.test.tsx` covers the cases the plan's truth table needed that existing suites didn't cover at hook level: an indeterminate multi-child group, a shared value across two groups, and a value not in the options. It also adds DOM checks that a group header and its neighbours don't pick up `selected` / `next-item-selected` / `previous-item-selected` classes when a child is selected. The empty-string/undefined rows are already covered by `single-selection.test.ts`. Not tested: `indeterminate` in the DOM. Select's `item.tsx` doesn't render it, so there's nothing to observe there.

### Evidence

The verification file records quick-build, `npm run build` (no snapshot/documenter changes), eslint and prettier on the three files, targeted unit suites (87 + 97 suites), the full `test:unit` (651/651), and select/multiselect/property-filter integ (11 suites, 136 tests). It also shows the new tests passing on the unchanged source before the edit. The integ server was bound to loopback and stopped afterwards.

</details>

<details>
<summary>File map</summary>

- `src/select/internal.tsx`: hoists `selectedOptions` and passes `selection: singleSelection(selectedOptions)`.
- `src/select/utils/use-select.ts`: `selection` defaults to `singleSelection(selectedOptions)`; deletes `__selectedValuesSet`, `getOptionGroupState`, the fallback branch, and the `OptionGroup` import.
- `src/select/__tests__/group-state.test.tsx` (new): hook-level group-state truth table, default-vs-explicit equivalence, and DOM group-row class checks.

Full diff: `git -C .worktrees/pr2-selection-models diff 9af99ec7d -- src`

</details>
