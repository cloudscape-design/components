# Plan: Select passes `singleSelection` to `useSelect`; `useSelect` drops its own group-state formula

Worktree (only place to work, absolute paths only):
`/Users/amanabiy/Documents/components/.worktrees/pr2-selection-models`, branch
`refactor/selection-models-multiselect-caller`, HEAD `9af99ec7d`. Relative paths land in the parent checkout.
Never push, never force, no `--no-verify`. `package-lock.json` is already modified before this step; leave it alone
and don't stage it.

## Key findings (from reading the code)

- `useSelect` callers (`grep -rn "useSelect\b" src`, excluding `useSelection`/`useSelector` hits in table/cards/area-chart):
  1. `src/select/internal.tsx:147`: no `selection` today. `selectedOptions: selectedOption ? [selectedOption] : []`,
     `updateSelectedOption: option => fireNonCancelableEvent(onChange, { selectedOption: option })`, no
     `useInteractiveGroups` (defaults to `false`).
  2. `src/multiselect/use-multiselect.tsx:156`: passes `selection = multiSelection(...)`.
  3. `src/select/__tests__/use-select.test.ts`: ~25 `renderHook(useSelect, …)` calls, none pass `selection`. One passes
     `useInteractiveGroups: true` (keyboard-navigation test, `selectedOptions: []`, no group-state assertion).
  - Type-only importers (`GetOptionProps`, `MenuProps`, `SelectTriggerProps`): `src/select/parts/plain-list.tsx`,
    `src/select/parts/trigger.tsx`. Unaffected.
- `jest.unit.config.js` runs `ts-jest` with `tsconfig.unit.json` (`strict: true`, includes `**/__tests__/**`), so a
  type error in `use-select.test.ts` fails that suite.
- In Select, `indeterminate` never reaches the DOM: `src/select/parts/item.tsx` doesn't read it (it's swallowed by
  `restProps` → `getBaseProps`), and `toSelectOptionGroupItem` (renderOption `group` item) has no `selected` /
  `indeterminate`. Observable group state in Select is only: group row `selected` (selectable-item `selected` class),
  neighbour `next-item-selected` / `previous-item-selected` classes, and `announceSelected` (groups aren't
  highlightable in Select, so the group branch of `announceSelected` is unreachable). `indeterminate` is visible only
  through `getOptionProps` at hook level.

## (b) Decision: `selection` required vs. fallback

All production callers will pass `selection`, but `use-select.test.ts` (not editable) calls `useSelect` without it.
Making the prop required would make that suite fail type-checking. Keeping the old fallback leaves the formula in
`useSelect`, which is what the task removes.

Decision: keep `selection?` optional in the type, and default it in the destructuring to
`selection = singleSelection(selectedOptions)`. Delete `getOptionGroupState`, `__selectedValuesSet` (its only use is
`getOptionGroupState`) and the fallback branch. `useSelect` then has one group-state source, the model.

Why this is behaviour-identical for every caller:
- Select: passes `singleSelection` explicitly; the default never kicks in.
- Multiselect: passes `multiSelection`; unchanged.
- `use-select.test.ts` without `selection`: identical to Select (same formula, see truth table). The one
  `useInteractiveGroups: true` test has `selectedOptions: []`, where the old fallback also returns false/false.
- Only theoretical difference: a caller with no `selection`, `useInteractiveGroups: true`, and a group whose children
  are all selected. Old fallback: `selected: true`; default model: `selected: false`. No caller does this (Multiselect
  always passes its model). Flagged here; document it in the prop's JSDoc ("defaults to single selection").

Rejected: making `selection` required (breaks an existing test file we may not edit). Rejected: keeping the fallback
(leaves the duplicate formula, the thing the user asked to remove).

## (a) Exact edits

### 1. `src/select/utils/use-select.ts`
- Add import: `import { singleSelection } from '../../internal/components/listbox/selection/single-selection';`
  (keep import order consistent with eslint `simple-import-sort`; `npx eslint --fix` will settle it).
- Prop JSDoc for `selection` (currently "When provided, group and select-all checkbox state come from it. Select
  doesn't pass one."): replace with
  `/** Source of group and select-all state. Defaults to single selection over \`selectedOptions\`. */`
  Type stays `selection?: SelectionModel`.
- Destructuring: `selection,` → `selection = singleSelection(selectedOptions),`.
- Delete the `__selectedValuesSet` `reduce` block.
- Delete `getOptionGroupState`.
- Replace `getGroupState` body with a direct call; keep the comment:
  ```ts
  // Only called for group rows and select-all.
  const getGroupState = (option: DropdownOption): GroupState => selection.getGroupState(option);
  ```
  (Keep the helper rather than inlining at 4 call sites; it keeps the diff small and the existing neighbour comment
  intact.)
- Imports: drop `OptionGroup` from `'../../types/option'` (now unused); keep `OptionDefinition`, `GroupState`,
  `SelectionModel`, `isGroup`, `isGroupInteractive`, `isInteractive`. `useInteractiveGroups` stays (still drives
  interactivity/highlighting).
- Nothing else changes: `__selectedOptions`, `__selectedOptionsSet`, neighbour `isGroup` gates, `announceSelected`.

### 2. `src/select/internal.tsx`
- Import `singleSelection` from `'../internal/components/listbox/selection/single-selection'`.
- Before the `useSelect` call:
  ```ts
  const selectedOptions = selectedOption ? [selectedOption] : [];
  const selection = singleSelection(selectedOptions);
  ```
  and pass `selectedOptions,` (same expression as today) and `selection,` to `useSelect`. Check `selectedOptions` /
  `selection` names don't clash with existing locals in `InternalSelect` (none found at read time; rename if eslint
  complains).
- `updateSelectedOption` unchanged (see (d)).

### 3. No changes to
`src/internal/components/listbox/selection/*` (model), `src/multiselect/*`, any existing test file, public
interfaces. The comment in `single-selection.ts` that cites "baseline `use-select.ts` built `__selectedValuesSet`" stays
(model files out of scope); it remains true as history.

## (c) Group-state truth table (Select, `useInteractiveGroups = false`, at most one selected option)

Old = `getOptionGroupState`: `values = { v : v ∈ selectedOptions.map(value), !!v }`;
`total = children.filter(c => !!c.value && values.has(c.value)).length`;
`selected = total>0 && total===len && false`; `indeterminate = total>0 && total!==len`.
New = `singleSelection(...).getGroupState`: `sv = selectedOptions[0]?.value`;
`total = sv===undefined ? 0 : children.filter(c => !!c.value && c.value===sv).length`;
`selected = false`; `indeterminate = total>0 && total!==len`.
With ≤ 1 selected option, `values.has(x)` ⇔ `!!sv && x===sv`, and the `!!c.value` guard covers falsy `sv`.

| # | Case | Old (sel / indet) | New (sel / indet) | Same? |
| - | --- | --- | --- | --- |
| 1 | No selection (`selectedOption` null) | false / false | false / false | yes |
| 2 | Selected child is the group's only child | false / false (total 1 = len 1) | false / false | yes |
| 3 | Group of 3, one child selected | false / true | false / true | yes |
| 3b | Group of 3, unselected group next to the selected one | false / false | false / false | yes |
| 4 | Selected value not in any option | false / false (total 0) | false / false | yes |
| 5a | Selected `{ value: '' }`, a child has `value: ''` | false / false (`''` not added; child guarded) | false / false (child guarded) | yes |
| 5b | Selected option with `value` undefined | false / false | false / false (`sv === undefined`) | yes |
| 6 | Same value in two groups (each ≥ 2 children) | both groups false / true | both false / true | yes |
| 6b | Same value twice in one group of 2 | false / false (total 2 = len) | false / false | yes |
| 7 | Non-group option passed to `getGroupState` | false / false | false / false | yes |
| 8 | Select-all row | never built by Select | never built | n/a |

Derived values (all identical because `selected` is false in both): group-row `selected`
(`__selectedOptionsSet.has(group) || false` → false), neighbour `isNextSelected` / `isPreviousSelected` for group
neighbours (false), `highlightedGroupSelected` (false; groups not highlightable in Select anyway).

No behaviour difference found for Select or Multiselect. Only difference is the theoretical no-`selection` +
`useInteractiveGroups: true` + all-children-selected case described in (b), which no caller reaches.

## (d) Optional item 3: `selection.getNextSelection(option)[0]` in Select — skip

`updateSelectedOption` receives an `OptionDefinition` (useSelect already unwrapped `optionToSelect.option`). Using the
model would mean `selection.getNextSelection({ option })[0]`, which returns the same object (`[option.option]`), so
`event.detail.selectedOption` identity is unchanged. It adds a wrapper object, an array allocation, and an `[0]` unwrap
for no behaviour or readability gain; Select's single-select semantics are already in the one line. Skip it and say so
in the commit/PR notes. Revisit if `useSelect` later passes `DropdownOption` to `updateSelectedOption`.

## (e) Test gaps and tests to add

Searched: `src/select/__tests__/*` (no `indeterminate`, `aria-checked`, `next-item-selected` /
`previous-item-selected`, or group-header-selected assertions; `select.test.tsx` "selects an option in a group" only
checks the trigger), `src/select/__integ__/*`, and
`src/internal/components/listbox/selection/__tests__/single-selection.test.ts` (covers the model formula: empty-string
value, some-not-all, only child, non-group, first-entry-only, undefined value). Existing `use-select.test.ts` covers
case 2 at hook level (group row props incl. `isNextSelected: true`).

Gaps (Select wiring, not the model):
- Hook level with an explicit `selection`: group of several children with one selected → `indeterminate: true`,
  `selected: false`; same value in two groups → both indeterminate; value not in options → false/false. Also one test
  that omitting `selection` gives the same `getOptionProps` as passing `singleSelection(selectedOptions)` (pins the
  default).
- Component level (Select DOM): with a selected child in a multi-child group, the group header row has no
  `selected` class and the rows next to the header have no `next-item-selected` / `previous-item-selected` coming
  from the header; the selected child row has the `selected` class.

Add one new file `src/select/__tests__/group-state.test.tsx` (pattern: `src/multiselect/__tests__/group-state.test.tsx`
for component tests with `selectableStyles` from
`../../../lib/components/internal/components/selectable-item/styles.css.js` and `rowOf`; pattern:
`src/select/__tests__/use-select.test.ts` for `renderHook(useSelect, …)` with `flattenOptions`). Tests:
1. `useSelect` + `singleSelection`: several children, one selected → group props `selected: false, indeterminate: true`.
2. Same value in two groups → both group rows `indeterminate: true`.
3. Selected value not in options → group rows false/false.
4. No `selection` vs `selection: singleSelection(selectedOptions)` → `getOptionProps` equal for every flat option.
5. Select render, `selectedOption` = second child of a 3-child group, open dropdown: header row lacks `selected`;
   option row after header lacks `previous-item-selected`; selected child row has `selected`.
6. Select render, `selectedOption` = only child of a group: header row lacks `selected` (guards against interactive
   semantics leaking in).

Run the new file on the old code too (stash only the two source files) to prove they describe existing behaviour.

## (f) Verification (cwd = worktree for every command)

1. Before editing, old-code baseline for the new tests: write the test file first, then
   `npm run quick-build > /tmp/pr2-selgs-qb-old.log 2>&1` and
   `TZ=UTC npx jest -c jest.unit.config.js src/select/__tests__/group-state.test.tsx > /tmp/pr2-selgs-newtest-old.log 2>&1`
   → all pass. (Tests 1–3 and 4 use `singleSelection` / omit `selection`, both valid on old code.)
2. Apply edits (a)1–2. `npm run quick-build > /tmp/pr2-selgs-qb.log 2>&1` → exit 0.
3. `TZ=UTC npx jest -c jest.unit.config.js src/select/__tests__/group-state.test.tsx` → all pass.
4. `npx eslint --fix --max-warnings 0 src/select/utils/use-select.ts src/select/internal.tsx src/select/__tests__/group-state.test.tsx`
   → 0; `npx prettier --check` same 3 files → 0.
5. Targeted unit:
   `TZ=UTC npx jest -c jest.unit.config.js src/select src/multiselect src/internal/components/listbox src/property-filter src/internal/components/chart-filter src/pie-chart src/area-chart src/mixed-line-bar-chart > /tmp/pr2-selgs-unit-targeted.log 2>&1`
   → all suites pass (in particular `use-select.test.ts` still type-checks and passes unchanged).
6. `npm run build > /tmp/pr2-selgs-build.log 2>&1` → 0 (includes tsc, API docs/snapshot generation; confirm
   `git status` shows no snapshot/documenter changes — no public API change expected).
7. `TZ=UTC npm run test:unit > /tmp/pr2-selgs-unit.log 2>&1` → 0 (record suite/test counts).
8. Integ (loopback only): `zsh /tmp/pr2-msel-integ/serve.sh` (serves 127.0.0.1:8093; wait for `status=200` before
   running tests), then
   `PATH=<chromedriver dir>:$PATH NODE_OPTIONS=--experimental-vm-modules npx jest -c /tmp/pr2-msel-integ/jest.integ.config.js src/select/__integ__/ src/multiselect/__integ__/ src/property-filter/__integ__/ > /tmp/pr2-selgs-integ.log 2>&1`
   → all pass. Then `zsh /tmp/pr2-msel-integ/stop.sh` and make sure no listeners remain on 8093/8094/9515 (kill only
   a leftover webpack PID whose cwd is this worktree). If the harness is missing or the config points at another
   worktree, check `jest.integ.config.js`/`serve.sh` paths first and note it rather than editing other worktrees.
9. Scope checks: `git diff --stat HEAD` → only `src/select/utils/use-select.ts`, `src/select/internal.tsx`, new
   `src/select/__tests__/group-state.test.tsx` (+ pre-existing `package-lock.json`);
   `git diff HEAD -- src/internal/components/listbox/selection src/multiselect` empty;
   `git diff HEAD --stat -- 'src/**/__tests__/**'` shows only the new file.
10. Write results to `/Users/amanabiy/Documents/components/.agents/tasks/listbox-pr2-select-groupstate-verification.md`
    in the same shape as `listbox-pr2-usesel-groupstate-verification.md` (changes, truth table with test results,
    commands/results table, learning summary incl. the item-3 skip and the default-model decision).
11. Commit (when the workflow's commit step says so): stage the three files by name,
    `git commit -m "refactor: Read Select group state from selection model"`; hooks must pass.

## Implementation checklist

- [ ] 1. Add `src/select/__tests__/group-state.test.tsx` (tests 1–6 above); run it on unchanged code → pass.
      Verify: step (f)1.
- [ ] 2. Edit `src/select/utils/use-select.ts`: default `selection = singleSelection(selectedOptions)`, delete
      `__selectedValuesSet` + `getOptionGroupState` + fallback, update JSDoc, drop `OptionGroup` import.
      Edit `src/select/internal.tsx`: build and pass `selectedOptions` + `selection = singleSelection(...)`.
      Verify: (f)2–4.
- [ ] 3. Full verification (f)5–9 and write the verification file (f)10.
- [ ] 4. Commit locally (f)11; no push.
