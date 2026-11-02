# Verification: Select passes `singleSelection` to `useSelect`; `useSelect` drops its own group-state formula

Iteration 1 (no review file existed; implemented from scratch). Worktree
`/Users/amanabiy/Documents/components/.worktrees/pr2-selection-models`, branch
`refactor/selection-models-multiselect-caller`, base `9af99ec7d`. Not committed (a later step commits).

## Changes

- `src/select/internal.tsx` (+4 / -1)
  - Imports `singleSelection`.
  - `const selectedOptions = selectedOption ? [selectedOption] : [];` (same expression as before), passed as
    `selectedOptions` and as `selection: singleSelection(selectedOptions)`.
  - `updateSelectedOption` unchanged (item 3 skipped, see below).
- `src/select/utils/use-select.ts` (+5 / -25)
  - `selection` stays optional in the type but defaults in the destructuring:
    `selection = singleSelection(selectedOptions)`. JSDoc updated to say so.
  - Deleted `__selectedValuesSet` (its only use was `getOptionGroupState`), `getOptionGroupState`, and the fallback
    branch. `getGroupState` is now `option => selection.getGroupState(option)`.
  - Dropped now-unused `OptionGroup` import. `useInteractiveGroups`, `isGroup` gates, `__selectedOptionsSet`,
    `announceSelected` unchanged.
- `src/select/__tests__/group-state.test.tsx` (new, 133 lines, 6 tests). No existing test file edited.
- Not changed: `src/internal/components/listbox/selection/*`, `src/multiselect/*` (`git diff 9af99ec7d` on both is
  empty). `package-lock.json` was already modified before this step; left alone.

## `useSelect` callers

1. `src/select/internal.tsx` — now passes `singleSelection(...)`.
2. `src/multiselect/use-multiselect.tsx` — passes `multiSelection(...)` (unchanged).
3. `src/select/__tests__/use-select.test.ts` — ~25 `renderHook(useSelect, …)` calls, none pass `selection`.

Type-only importers (`GetOptionProps`, `MenuProps`, `SelectTriggerProps`): `src/select/parts/plain-list.tsx`,
`src/select/parts/trigger.tsx`. Unaffected.

## Fallback: could it be deleted?

The formula was deleted; the prop was not made required. Caller 3 is an existing test file (not editable in this
step). It compiles under `strict` ts-jest, so a required prop would fail that suite's type check. The fallback is now
the same model Select passes (`singleSelection(selectedOptions)`), not a second formula. `useSelect` has one source of
group state.

Theoretical difference, not reachable today: a caller that omits `selection`, sets `useInteractiveGroups: true`, and
has a group with every child selected. The old fallback said `selected: true`, the default model says `false`. Only
Multiselect uses interactive groups, and it always passes its model. The one `use-select.test.ts` test with
`useInteractiveGroups: true` has `selectedOptions: []`, so both give false / false there.

To make `selection` required later, `use-select.test.ts` has to pass `selection` (a one-line change to its
`initialProps`).

## Group-state truth table (Select, `useInteractiveGroups = false`)

Old = `getOptionGroupState` (values set from truthy `selectedOptions[].value`). New = `singleSelection().getGroupState`.

| # | Case | Before (selected / indeterminate) | After | Test |
| - | --- | --- | --- | --- |
| 1 | No selection | false / false | false / false | `use-select.test.ts` default props (group rows) |
| 2 | Selected child is the group's only child | false / false | false / false | new DOM test; `use-select.test.ts` "only option" |
| 3 | Group of 3, one child selected | false / true | false / true | new hook test + new DOM test |
| 4 | Selected value not in options | false / false | false / false | new hook test |
| 5a | Selected `{ value: '' }`, child with `value: ''` | false / false | false / false | `single-selection.test.ts` |
| 5b | Selected option with `value` undefined | false / false | false / false | `single-selection.test.ts` |
| 6 | Same value in two groups (2 children each) | both false / true | both false / true | new hook test |
| 7 | Non-group option | false / false | false / false | `single-selection.test.ts` |
| 8 | Select-all row | never built by Select | never built | n/a |

New test "omitting selection gives the same option props as passing single selection" compares every
`getOptionProps` result (minus the per-hook `id`) for a flat list + 3-child group with one selected. It passes on old
code (old fallback vs model) and new code (default model vs explicit model).

Derived DOM state (all false because `selected` is false both ways): group header `selected` class, neighbour
`next-item-selected` / `previous-item-selected` from a group header, highlighted-group announcement (groups aren't
highlightable in Select). `indeterminate` is never rendered by Select's `item.tsx`, so it's only observable at hook
level.

## Item 3: `selection.getNextSelection(option)[0]` in Select — skipped

`updateSelectedOption` receives an `OptionDefinition` (`useSelect` already unwrapped `optionToSelect.option`). Using
the model would need `selection.getNextSelection({ option })[0]`, which returns the same object, so
`event.detail.selectedOption` identity would not change. It adds a wrapper object and an array for no behaviour or
readability gain. Revisit if `useSelect` starts passing `DropdownOption` to `updateSelectedOption`.

## Commands and results

| Command (cwd = worktree) | Result |
| --- | --- |
| New test file written first, `npm run quick-build` + `TZ=UTC npx jest -c jest.unit.config.js src/select/__tests__/group-state.test.tsx` on unchanged source | quick-build 0; 6/6 pass (`/tmp/pr2-selgs-qb-old.log`, `/tmp/pr2-selgs-newtest-old.log`). First run failed only on per-hook unique `id`s in the equivalence test; the test now drops `id` before comparing. |
| Edits applied; `npm run quick-build` + same jest | 0; 6/6 pass (`/tmp/pr2-selgs-qb.log`, `/tmp/pr2-selgs-newtest-new.log`) |
| `npx eslint --fix --max-warnings 0 <3 files>` | 0 |
| `npx prettier --check <3 files>` | 0 |
| `TZ=UTC npx jest -c jest.unit.config.js src/select src/multiselect src/internal/components/listbox src/property-filter src/autosuggest src/internal/components/chart-filter src/pie-chart src/area-chart src/mixed-line-bar-chart` | 87/87 suites, 1484 pass, 1 skipped (`/tmp/pr2-selgs-unit-targeted.log`). `use-select.test.ts` unchanged and passing. |
| Other Select/Multiselect importers (grep): `TZ=UTC npx jest … src/code-editor src/date-range-picker src/s3-resource-selector src/segmented-control src/collection-preferences src/table src/time-input src/pagination` | 97/97 suites, 1727 pass, 9 skipped (`/tmp/pr2-selgs-unit-importers.log`) |
| `npm run build` | 0 (`/tmp/pr2-selgs-build.log`). 2 webpack asset-size warnings, same as the previous step's build. `git status` shows no snapshot/documenter changes. |
| `TZ=UTC npm run test:unit` | 0. build-tools 2/2 suites (8 tests); main 651/651 suites, 14230 pass, 162 skipped. No flake (`/tmp/pr2-selgs-unit.log`). |
| Integ: `zsh /tmp/pr2-msel-integ/serve.sh` (loopback 127.0.0.1:8093, config points at this worktree) | `status=200` |
| `PATH=/tmp/listbox-04-chromedriver/…/chromedriver-mac-arm64:$PATH NODE_OPTIONS=--experimental-vm-modules npx jest -c /tmp/pr2-msel-integ/jest.integ.config.js src/select/__integ__/ src/multiselect/__integ__/ src/property-filter/__integ__/` | 11/11 suites, 136/136 (`/tmp/pr2-selgs-integ.log`) |
| `zsh /tmp/pr2-msel-integ/stop.sh`, then `kill` of leftover webpack PID 91742 (cwd = this worktree) | no listeners on 8093/8094/9515 |
| `git diff 9af99ec7d -- src/internal/components/listbox/selection src/multiselect` | empty |
| `git diff 9af99ec7d --stat -- 'src/**/__tests__/**'` | empty (only the new untracked test file) |

## Summary

```
$ git diff --stat 9af99ec7d
 package-lock.json              | 27 +++++++++++++--------------   (pre-existing, not part of this change)
 src/select/internal.tsx        |  5 ++++-
 src/select/utils/use-select.ts | 30 +++++-------------------------
untracked: src/select/__tests__/group-state.test.tsx  +133
```

- Source: +9 / -26 across the two files.
- Fallback formula deleted; `selection` kept optional with a `singleSelection(selectedOptions)` default, because
  `use-select.test.ts` (not editable here) calls `useSelect` without it.
- Callers: Select (now passes the model), Multiselect (already did), `use-select.test.ts` (uses the default).
- Item 3 skipped: no behaviour or readability gain.
- No behaviour difference found for Select or Multiselect.
