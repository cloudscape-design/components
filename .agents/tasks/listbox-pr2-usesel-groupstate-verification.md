# Verification: `useSelect` reads group state from the selection model (Multiselect only)

Iteration 1 (no review file existed; implemented from scratch). Worktree
`/Users/amanabiy/Documents/components/.worktrees/pr2-selection-models`, branch
`refactor/selection-models-multiselect-caller`, base `628dcf6ea`. Not committed (a later step commits).

## Changes

- `src/select/utils/use-select.ts` (+27 / -17)
  - New optional prop `selection?: SelectionModel`; `isAllSelected` / `isSomeSelected` props removed (no caller needs
    them: Select never passed them, `use-select.test.ts` doesn't either).
  - Old `getGroupState(OptionGroup)` renamed `getOptionGroupState`, body unchanged (Select path).
  - New `getGroupState(DropdownOption)`: `selection.getGroupState(option)` when a model is passed, otherwise the
    Select code.
  - Every group-state read goes through it: group rows, select-all `selected` / `indeterminate`, group neighbours
    (`isNextSelected` / `isPreviousSelected`), highlighted-group announcement.
  - Two `isGroup` gates kept (neighbours and announcement) so select-all is never treated as a selected neighbour or
    announced as selected, matching today. Code comment added at the neighbour gate.
- `src/multiselect/use-multiselect.tsx` (+6 / -15)
  - Passes `selection`; `isAllSelected` / `isSomeSelected` locals deleted.
  - `updateSelectedOption` is a plain function (no `useCallback`); `useCallback` dropped from the React import.
  - Stale comment replaced by one line pointing at the model, which already documents the disabled-option rule in
    `multi-selection.ts` `toggle`.
- `src/multiselect/__tests__/group-state.test.tsx` (new, 199 lines, 16 tests). No existing test file edited.
- Not changed: `src/select/internal.tsx`, `src/internal/components/listbox/selection/*`. `package-lock.json` was already
  modified before this step; left as is.

## Select-all truth table (Multiselect), confirmed by the new tests on old and new code

| # | Case | Before (selected / indeterminate) | After | Test |
| - | --- | --- | --- | --- |
| 1 | `options: []`, `enableSelectAll`, stale `selectedOptions: [x]` | row not rendered | row not rendered | pass |
| 2 | All selected | true / false | true / false | pass |
| 3 | Some selected | false / true | false / true | pass |
| 4 | None selected | false / false | false / false | pass |
| 5a | All selected, some filtered out | true / false | true / false | pass |
| 5b | All visible selected, a filtered-out one not | false / true | false / true | pass |
| 6a | `[1 disabled, 2]`, selected `[2]` | false / true | false / true | pass |
| 6b | `[1 disabled, 2]`, selected `[1, 2]` | true / false | true / false | pass |
| 7 | Selected value not in options | false / true | false / true | pass |

Empty list: the model would say `selected: true` (`[].every` is true) but the row is only added when
`filteredOptions.length > 0`, so it is never rendered or announced. Not observable, same before and after.

Group rows: all children selected → true / false, `aria-checked="true"`; some → false / true, `mixed`; enabled
children selected with a disabled child not → false / true, `mixed`. Neighbour styling and announcement tests also
pass on both.

## Commands and results

| Command (cwd = worktree) | Result |
| --- | --- |
| `git stash push -- src/select/utils/use-select.ts src/multiselect/use-multiselect.tsx` + `npm run quick-build` + `jest … group-state.test.tsx` + `git stash pop` | old code: quick-build 0, 16/16 pass (`/tmp/pr2-usesel-newtest-old.log`). Only those two paths stashed. |
| `npm run quick-build` + `jest … group-state.test.tsx` | new code: 0, 16/16 pass (`/tmp/pr2-usesel-newtest-new.log`) |
| `npx eslint --fix --max-warnings 0 <3 files>` | 0 |
| `npx prettier --check <3 files>` | 0 |
| `TZ=UTC jest -c jest.unit.config.js src/multiselect src/select src/internal/components/listbox src/property-filter src/internal/components/chart-filter src/pie-chart src/area-chart src/mixed-line-bar-chart` | 72/72 suites, 1212 pass, 1 skipped (`/tmp/pr2-usesel-unit-targeted.log`). All `use-select` importers are in these dirs. |
| `npm run build` | 0 (`/tmp/pr2-usesel-build.log`) |
| `TZ=UTC npm run test:unit` | 0. build-tools 2/2 suites (8 tests); main 650/650 suites, 14224 pass, 162 skipped. No flake this run (`/tmp/pr2-usesel-unit.log`). |
| Integ: `zsh /tmp/pr2-msel-integ/serve.sh` (loopback 127.0.0.1:8093) | `status=200` |
| `PATH=<chromedriver155>:$PATH NODE_OPTIONS=--experimental-vm-modules jest -c /tmp/pr2-msel-integ/jest.integ.config.js src/multiselect/__integ__/` | 3/3 suites, 45/45 (`/tmp/pr2-usesel-integ.log`) |
| same with `src/select/__integ__/ src/property-filter/__integ__/` | 8/8 suites, 91/91 (`/tmp/pr2-usesel-integ-other.log`) |
| `zsh /tmp/pr2-msel-integ/stop.sh`, then `kill` of the leftover webpack PID (cwd = this worktree) | "no listeners on 8093/8094/9515" |
| `git diff --stat HEAD` | `package-lock.json` (pre-existing), `use-multiselect.tsx` 21, `use-select.ts` 44 |
| `git diff 628dcf6ea -- src/select/internal.tsx` | empty |
| `git diff --stat 628dcf6ea -- src/internal/components/listbox/selection 'src/**/__tests__/**'` | empty |

Note: a first integ attempt ran before the dev server was up (`serve.sh` isn't executable, so it was invoked with
`zsh`); every test failed to connect. Those results were discarded and the suites rerun after `status=200`.

## Learning summary

- Lines: `use-select.ts` +27 / -17, `use-multiselect.tsx` +6 / -15, new test file +199.
- `isAllSelected` / `isSomeSelected`: removed from Multiselect and from `useSelect`. The model's select-all state uses
  the same expressions Multiselect computed before (`all.every(...)` over `flatOptions`, `selectedOptions.length > 0`),
  so every row of the truth table matches.
- Didn't fit the model cleanly:
  - Neighbours and announcement need an `isGroup` gate, not "anything the model has state for". The model returns
    select-all state, and routing it would mark the row after select-all as `previous-item-selected` and announce
    select-all as selected. The gate keeps today's behaviour.
  - Select path: with no model, a select-all row would now get `false / false` instead of `undefined / false`.
    Unreachable: Select never builds a select-all row.
  - The group formula still exists twice (model and `useSelect` for Select) until Select passes `singleSelection`.
  - `selection.selectionType` / `interactiveGroups` are not read by `useSelect` yet; `useInteractiveGroups` still drives
    interactivity.
- Memoization: dropped `useCallback`, `updateSelectedOption` is a plain function. Its deps included `selection`, which
  is rebuilt every render, so it never memoized. Nothing depends on its identity (only called from `selectOption` and
  `tokenOnDismiss`, both plain functions; no hook deps list contains it). `useMemo` on `selection` wouldn't hit either,
  because `prepareOptions` and `visibleOptions` return new arrays each render. Memoizing those is out of scope.

## Commit

`9af99ec7d` (new commit on top of `628dcf6ea`, hooks ran: lint-staged eslint + git-secrets, all passed).

```
$ git log --oneline origin/main..HEAD
9af99ec7d refactor: Read Multiselect group state from selection model
628dcf6ea refactor: Use selection models in Multiselect
6212527e0 refactor: Add shared listbox selection models
```
