# Plan: `useSelect` reads group state from the selection model (Multiselect only)

Worktree (ALL paths absolute, relative paths land in the parent checkout):
`/Users/amanabiy/Documents/components/.worktrees/pr2-selection-models`, branch
`refactor/selection-models-multiselect-caller`, HEAD `628dcf6ea`. `package-lock.json` is already modified and
`.agents/` is untracked; do not stage either. Never push, never force, no `--no-verify`.

Below, `WT` = the worktree path.

## Findings from the code (read, not assumed)

- `useSelect` importers: `src/select/internal.tsx`, `src/select/parts/plain-list.tsx`, `src/select/parts/trigger.tsx`
  (types only), `src/multiselect/use-multiselect.tsx`, `src/select/__tests__/use-select.test.ts`.
- `isAllSelected` / `isSomeSelected` appear only in `use-select.ts`, `use-multiselect.tsx` and the model. Select never
  passes them, and `use-select.test.ts` `initialProps` (lines 67-77) does not pass them. So both props can be removed
  without touching any test file.
- Multiselect today already computes `isAllSelected = selection.getGroupState(selectAllOption).selected`, and
  `isSomeSelected = selectedOptions.length > 0`, which is the model's own internal `isSomeSelected` expression.
- Model group formula (`getOptionGroupState`) equals `useSelect.getGroupState` line for line. The only difference is the
  value Set: the model's Set includes falsy values, useSelect's skips them. Both filters guard with `!!item.value`, so
  the result is the same. Multiselect passes `interactiveGroups: true` and `useInteractiveGroups = true`: same flag.
- The model's `getGroupState` takes a `DropdownOption`; every call site in useSelect has the wrapper available
  (`option`, `options[index ± 1]`, `highlightedOption`), so no adaptation is needed beyond passing the wrapper.
- The select-all row is only added to `visibleOptions` when `enableSelectAll && filteredOptions.length`, so it always
  sits at index 0 and is never rendered when the visible list is empty.
- Two places must stay gated by `isGroup(...)`, not "anything the model knows about":
  - Neighbour state: the row at index 1 has select-all as its previous neighbour. Today `isGroup(selectAll.option)` is
    false, so `isPreviousSelected = __selectedOptionsSet.has(selectAllRow)` = false. Routing select-all through the model
    would make it `true` when all are selected, which changes the `previous-item-selected` styling. Keep the gate.
  - Announcement: a highlighted select-all row is never announced as selected today (`isGroup` false, not in the Set).
    Keep the gate.
- `updateSelectedOption`'s `useCallback([selection, onChange])` never memoizes: `selection` is rebuilt every render.
  Nothing depends on its identity: useSelect only calls it inside `selectOption` (a plain function) and no hook deps
  list contains it; `tokenOnDismiss` is a plain function too. `prepareOptions` is a plain function returning new
  arrays every render, so a `useMemo` around `selection` would also never hit unless `prepareOptions` and
  `visibleOptions` were memoized too.
- The stale comment's gist ("ignores disabled options so it doesn't get stuck") is already in the model:
  `multi-selection.ts` `toggle` says "Disabled options count as selected, so a group with a disabled child doesn't get
  stuck in one direction." Nothing to move.

## Select-all truth table (Multiselect)

Today: `selected = isAllSelected` (from the model), `indeterminate = !!undefined || (true && !isAllSelected &&
selectedOptions.length > 0)`. Model: `selected = isAllSelected`, `indeterminate = !isAllSelected && isSomeSelected`
with `isSomeSelected = selectedOptions.length > 0`. Same inputs, same expressions, so equal by construction. Read from
code; the new tests below confirm at runtime.

`isAllSelected` = every non-parent option in `flatOptions` (incl. filtered-out and disabled) has its value in the
selected Set.

| # | Case | Today selected / indeterminate | Model selected / indeterminate | Rendered? |
| - | --- | --- | --- | --- |
| 1 | `options: []`, `enableSelectAll` | `[].every` → true / `!true && …` → false | true / false | No: row omitted (`filteredOptions.length` is 0). Same if `selectedOptions` holds stale values. Not observable either way. |
| 1b | Options exist but filter matches nothing | depends on flat list / — | same | No: row omitted. |
| 2 | All selected | true / false | true / false | Yes |
| 3 | Some selected | false / true | false / true | Yes |
| 4 | None selected | false / false | false / false | Yes |
| 5a | All selected, some hidden by filter | true / false (checks `flatOptions`) | true / false | Yes |
| 5b | All visible selected, a hidden one not | false / true | false / true | Yes |
| 6a | Options `[1 disabled, 2]`, selected `[2]` | false / true (disabled must be selected too) | false / true | Yes |
| 6b | Options `[1 disabled, 2]`, selected `[1, 2]` | true / false | true / false | Yes |
| 7 | Selected value not in options, e.g. options `[1]`, selected `[x]` | false / true | false / true | Yes |

No case differs, so Multiselect stops passing `isAllSelected` / `isSomeSelected` and both props are removed from
`useSelect`. The earlier warning about empty lists applied to deriving `isSomeSelected` from `selected ||
indeterminate` of select-all (that would give true for case 1). This plan never does that: it reads the model's
`indeterminate`, which uses `selectedOptions.length > 0` directly.

Group rows (Multiselect, interactive groups): today `selected = __selectedOptionsSet.has(option) || groupState.selected`,
`indeterminate = groupState.indeterminate`; with the model only `groupState` changes source, and its value is the
same formula. Partially selected via a disabled unselected child → indeterminate true, selected false (both).

## Memoization decision

Drop the `useCallback` and make `updateSelectedOption` a plain arrow function. It is the simplest change and is exactly
behaviour-preserving: the callback's identity already changed every render, and no consumer keys on it. `useMemo` on
`selection` would not work without also memoizing `prepareOptions` output and `visibleOptions`, which is unrelated
scope. Remove `useCallback` from the React import.

## Implementation plan

- [ ] 1. `useSelect` accepts an optional selection model and routes every group-state read through one helper.
      Files: `WT/src/select/utils/use-select.ts`
      Edits:
      - Import `GroupState, SelectionModel` from `'../../internal/components/listbox/selection/interfaces'`.
      - `UseSelectProps`: remove `isAllSelected?` and `isSomeSelected?`; add
        `/** When provided, group and select-all checkbox state come from it. Select doesn't pass one. */ selection?: SelectionModel;`
        Add `selection` to the destructured params; remove `isAllSelected`, `isSomeSelected`.
      - Rename the existing `getGroupState(option: OptionGroup)` to `getOptionGroupState(group: OptionGroup): GroupState`
        with its body unchanged (Select path).
      - Add:
        ```ts
        // Only called for group rows and select-all.
        const getGroupState = (option: DropdownOption): GroupState => {
          if (selection) {
            return selection.getGroupState(option);
          }
          return isGroup(option.option) ? getOptionGroupState(option.option) : { selected: false, indeterminate: false };
        };
        ```
      - `getOptionProps`:
        ```ts
        const isSelectAll = option.type === 'select-all';
        const groupState = isSelectAll || isGroup(option.option) ? getGroupState(option) : undefined;
        const selected = isSelectAll ? !!groupState?.selected : __selectedOptionsSet.has(option) || !!groupState?.selected;
        const nextOption = options[index + 1];
        const isNextSelected = !!nextOption && isGroup(nextOption.option) ? getGroupState(nextOption).selected : __selectedOptionsSet.has(nextOption);
        // same shape for previousOption / isPreviousSelected with options[index - 1]
        indeterminate: !!groupState?.indeterminate,
        ```
        Keep the `isGroup` gate on neighbours (see findings: select-all neighbour must stay `false`).
        Note `__selectedOptionsSet.has(undefined)` is false, same as today's `has(options[index + 1])`.
      - Announcement: `isGroup(highlightedOption.option) && getGroupState(highlightedOption).selected` (keep the gate).
      - Select path note: with no `selection`, a select-all row would get `selected: false, indeterminate: false` instead
        of today's `undefined`/`undefined`. Select never builds select-all rows and never had `toggleAll`, so this branch
        is unreachable; group rows, neighbours and announcement are computed exactly as before.
      Verify: `cd WT && npx tsc -p tsconfig.json --noEmit` fails only in `use-multiselect.tsx` (it still passes the removed
      props) — that is expected and fixed in item 2. Do not commit between 1 and 2.

- [ ] 2. Multiselect passes the model and drops the duplicated state; tidy the callback.
      Files: `WT/src/multiselect/use-multiselect.tsx`
      Edits:
      - Delete `const isSomeSelected = …` and `const isAllSelected = …`.
      - In the `useSelect({...})` call: remove `isAllSelected,` and `isSomeSelected,`; add `selection,`.
      - Replace the `useCallback` block with:
        ```ts
        const updateSelectedOption = (option: OptionDefinition | OptionGroup) => {
          fireNonCancelableEvent(onChange, { selectedOptions: selection.getNextSelection({ option }) });
        };
        ```
        (stale comment removed; its gist already lives in the model's `toggle`.)
      - React import becomes `import React, { useEffect, useRef } from 'react';`.
      - Keep `useInteractiveGroups` passed to useSelect (still drives interactivity, highlighting, keyboard).
      No model change; do not edit `multi-selection.ts` or `single-selection.ts`. No change to `src/select/internal.tsx`.
      Verify: `cd WT && npm run quick-build > /tmp/pr2-usesel-quick-build.log 2>&1; echo $?` → 0, no TS errors.

- [ ] 3. Add a new test file covering the gaps (no edits to existing test files).
      Existing coverage checked: `select-all.test.tsx` covers toggling and the hidden row for `options: []` but never
      asserts the select-all checkbox `selected`/`indeterminate`; `render-option.test.tsx` checks group `selected:false`
      for partial selection but not `indeterminate`, not a fully selected group; `multiselect.test.tsx:680` checks group
      `aria-checked="mixed"` only; no test checks group neighbour styling or the highlighted-group "selected"
      announcement.
      File: `WT/src/multiselect/__tests__/group-state.test.tsx` (style of `selection-order.test.tsx`: render
      `Multiselect` from `lib/components`, `createWrapper`). Use `renderOption = jest.fn(() => <div>Custom</div>)` and
      read the last render's `item` for a given `type` (`'select-all'` / `'group'`) to assert `selected` and
      `indeterminate`. Tests:
      - Select-all `test.each` over cases 2, 3, 4, 5a, 5b (with `filteringType: 'auto'` and
        `findFilteringInput()!.setInputValue(...)`), 6a, 6b, 7 from the truth table → expected `{selected, indeterminate}`.
      - Case 1: `options: []`, `enableSelectAll`, `selectedOptions: [{ value: 'x' }]` → `renderOption` never receives an
        item with `type: 'select-all'` and `findSelectAll()` is null.
      - Group row: all children selected → `{selected:true, indeterminate:false}` and the group element
        `aria-checked="true"`; one of two enabled children selected → `{selected:false, indeterminate:true}`; enabled
        children selected but a disabled child not → `{selected:false, indeterminate:true}`.
      - Neighbours (import `selectableStyles` from `'../../../lib/components/internal/components/selectable-item/styles.css.js'`):
        with options `[group(a,b), {value:'c'}]` and `a,b` selected, the `c` row has `previous-item-selected`; with
        `enableSelectAll` and all options selected, the first row after select-all does NOT have
        `previous-item-selected` (locks the `isGroup` gate).
      - Announcement: `selectedAriaLabel="Selected"`, group fully selected; open the dropdown, move highlight to the group
        row with `findOptionsContainer()!.keydown(KeyCode.up/down)` until `findHighlightedOption()` is the group, then
        `findDropdown().findHighlightedAriaLiveRegion()` text starts with `Selected`. With `enableSelectAll`, all
        selected, select-all highlighted → live region text does not start with `Selected`.
      Run the new file against the pre-change code FIRST to prove it encodes today's behaviour:
      `cd WT && git stash push -- src/select/utils/use-select.ts src/multiselect/use-multiselect.tsx && npm run quick-build > /tmp/pr2-usesel-qb-old.log 2>&1 && TZ=UTC node_modules/.bin/jest -c jest.unit.config.js src/multiselect/__tests__/group-state.test.tsx; git stash pop`
      (stash only those two paths; never `git stash` the whole tree, `package-lock.json` must stay as is).
      Then rebuild (`npm run quick-build`) and run it again on the new code.
      Verify: all new tests pass on old code and new code.

- [ ] 4. Lint, format, full verification.
      Commands (cwd `WT`, logs in `/tmp`):
      - `npx eslint --fix --max-warnings 0 src/select/utils/use-select.ts src/multiselect/use-multiselect.tsx src/multiselect/__tests__/group-state.test.tsx` → exit 0
      - `npx prettier --check <same 3 files>` → exit 0
      - `TZ=UTC node_modules/.bin/jest -c jest.unit.config.js src/multiselect src/select src/internal/components/listbox src/property-filter src/internal/components/chart-filter src/pie-chart src/area-chart src/mixed-line-bar-chart > /tmp/pr2-usesel-unit-targeted.log 2>&1` → all pass (previous baseline 71 suites)
      - `npm run build > /tmp/pr2-usesel-build.log 2>&1` → exit 0 (needed for documenter snapshots)
      - `TZ=UTC npm run test:unit > /tmp/pr2-usesel-unit.log 2>&1` → all pass. Known flake:
        `src/__tests__/snapshot-tests/test-utils-wrappers.test.tsx` under parallel load; if only that fails, rerun it alone
        and record both results.
      - Scope checks: `git diff --stat -- 'src/**/__tests__/**'` lists no existing test file (new file is untracked until
        staged); `git diff --stat -- src/select/internal.tsx src/internal/components/listbox/selection` is empty.
      - Integration (same approach as `listbox-pr2-multiselect-caller-verification.md`; loopback only, never the user's
        :8080 server). Helpers already exist in `/tmp/pr2-msel-integ/` (`jest.integ.config.js`, `setup.integ.js` with
        baseUrl `http://127.0.0.1:8093`, `serve.sh`, `stop.sh`). If missing, recreate them from the repo's
        `jest.integ.config.js` with only the baseUrl changed, without editing repo files.
        1. `/tmp/pr2-msel-integ/serve.sh` → `status=200`
        2. `PATH=/tmp/listbox-04-chromedriver/chromedriver/mac_arm-155.0.8059.85/chromedriver-mac-arm64:$PATH NODE_OPTIONS=--experimental-vm-modules node_modules/.bin/jest -c /tmp/pr2-msel-integ/jest.integ.config.js src/multiselect/__integ__/ > /tmp/pr2-usesel-integ.log 2>&1` → 3/3 suites pass
        3. Same with `src/select/__integ__/ src/property-filter/__integ__/ > /tmp/pr2-usesel-integ-other.log` → 8/8 suites
           pass (an `async-select` virtual-scroll test was flaky before; rerun once if it alone fails and record it)
        4. `/tmp/pr2-msel-integ/stop.sh` → "no listeners on 8093/8094/9515"

- [ ] 5. Record results and commit locally.
      Write `/Users/amanabiy/Documents/components/.agents/tasks/listbox-pr2-usesel-groupstate-verification.md`
      (changes, the truth table with test results, command table, memoization decision, the two `isGroup` gates kept and
      why, `git diff --numstat` for the two source files).
      Commit by path only: `git -C WT add src/select/utils/use-select.ts src/multiselect/use-multiselect.tsx src/multiselect/__tests__/group-state.test.tsx`
      then `git -C WT commit -m "refactor: Read Multiselect group state from the selection model"`. Hooks run normally.
      Do not stage `package-lock.json` or `.agents/`. Do not push.

## Gaps and assumptions

- `selection.selectionType` / `selection.interactiveGroups` are not used by useSelect in this change;
  `useInteractiveGroups` still drives interactivity. Wiring those is a later step.
- The Select path stays on `getOptionGroupState`; the formula therefore still exists twice (model + useSelect) until
  Select passes `singleSelection`. That's the agreed scope.
