# Verification: refactor/use-listbox-in-select (iteration 1)

- Worktree: `/Users/amanabiy/Documents/components/.worktrees/listbox-use-listbox`
- Base: `origin/refactor/move-shared-listbox-parts` (`33cfa9917`)
- Node: `mise exec node@22.23.2 --` for every npm/npx command
- Logs: `.agents/tasks/use-listbox-in-select/logs/c1-*.log` (commit 1), `logs/c2-*.log` (commit 2 / final)
- No review.json existed, so this is the first implementation. Nothing pushed.

## Commits

```
$ git -P log --oneline origin/refactor/move-shared-listbox-parts..HEAD
2a861fe1b refactor: Build useSelect on a shared useListbox hook
e468024a7 refactor: Move listbox list prop types into the listbox folder
```

`git status -sb`: `## refactor/use-listbox-in-select...origin/refactor/move-shared-listbox-parts [ahead 2]`, working tree clean.

Optional commit 3 (tidy leftovers) skipped: ESLint reports no unused code and no dead code is left in `use-select.ts` or `use-multiselect.tsx` (`hasSelectedOption` is still an effect dependency).

## Files changed (base..HEAD)

```
src/internal/components/listbox/__tests__/use-listbox.test.tsx | 268 (new)
src/internal/components/listbox/interfaces.ts                  |  13 (new)
src/internal/components/listbox/parts/plain-list.tsx           |   4 +-
src/internal/components/listbox/use-listbox.ts                 | 148 (new)
src/internal/components/options-list/utils/use-keyboard.ts     |  19 +-
src/select/utils/use-select.ts                                 | 125 +-/
```

Not changed: `select/internal.tsx`, `multiselect/*`, `select/parts/virtual-list.tsx`, autosuggest, property-filter.

## Sizes

- `wc -l src/select/utils/use-select.ts`: 315 (baseline 350)
- `wc -l src/internal/components/listbox/use-listbox.ts`: 148

## Results

| Check | Command | Commit 1 | Final (commit 2) | Baseline |
|---|---|---|---|---|
| TSC | `npx tsc -p tsconfig.json --noEmit` | exit 0, no output | exit 0, no output | clean |
| ESLint | c1: `npx eslint src/internal/components/listbox src/select/utils/use-select.ts`; c2: `npx eslint src/internal/components/listbox src/internal/components/options-list src/select src/multiselect` | 0 problems | 0 problems | 0 |
| Quick build | `npm run quick-build` | (artifacts from baseline reused) | exit 0 | exit 0 |
| Unit | `TZ=UTC npx jest -c jest.unit.config.js src/select src/multiselect src/autosuggest src/property-filter src/internal/components/listbox src/internal/components/options-list src/internal/components/selectable-item` | 74/74 suites, 1157/1157 tests | 75/75 suites, 1175/1175 tests | 74 / 1157 |
| Build | `npm run build` | - | exit 0 (webpack compiled with 2 warnings, same as baseline) | exit 0, 2 warnings |
| Snapshot (no `-u`) | `TZ=UTC npx jest -c jest.unit.config.js src/__tests__/snapshot-tests` | - | 4/4 suites, 112/112 tests, 110/110 snapshots passed | same |
| Functional | `TZ=UTC npx jest -c jest.unit.config.js src/__tests__/functional-tests` | - | 10/10 suites, 1969/1969 tests | same |

The extra unit suite and 18 tests are all from the new `use-listbox.test.tsx` (Space modes x4, Escape x2, Home/End x2, choosing x4, mouse x2, getOptionProps x3, announceSelected x1).

## No existing test changed

```
$ git -P diff --stat origin/refactor/move-shared-listbox-parts..HEAD -- '**/__tests__/**'
 .../listbox/__tests__/use-listbox.test.tsx | 268 +++++++++++++++++++
 1 file changed, 268 insertions(+)
```

Only the new file. The plan suggested adding cases to the existing `use-keyboard.test.ts`; that was not done because the brief forbids editing existing test files. The new `useMenuKeyboard` options (`preventNativeHomeEnd`, optional `closeDropdown`) are covered through `useListbox` in the new suite instead.

## Cleanup

`git checkout -- pages/tsconfig.tsbuildinfo package-lock.json` after builds: `pages/tsconfig.tsbuildinfo` is untracked (pathspec error, as at baseline); `package-lock.json` unchanged. Staged by explicit path only.

## Behavior notes for the reviewer

- `preventNativeSpace`: base `!hasFilter || (highlightedOption && keyboard)` equals new `spaceSelects === 'always' || (...)` with `spaceSelects: hasFilter ? 'keyboard-highlight' : 'always'`.
- Escape: `useSelect` always passes `onEscape`, so Escape still always calls `stopPropagation`; the body (focus trigger + close when not embedded) is unchanged.
- Home/End: `useSelect` does not pass `preventNativeHomeEnd`, so no `preventDefault` as on base.
- Wrap: `getListboxNavigation` still receives `highlightedOption`.
- Ids: `useUniqueId('option-list')` (now inside `useListbox`) is still called before `useUniqueId('dialog')`; `useOpenState`/`useHighlightedOption` call no `useId`.
- Selected rows come from `selection.selectedOptions` instead of the `selectedOptions` prop. All callers build `selection` from `selectedOptions` (`singleSelection` keeps the first item; Select passes at most one); documented on `UseSelectProps.selection`.
- Prototype parts from section D of the plan (onKeyboardHighlight wrappers, announcement in the hook, `preventNativeHomeEnd: !hasFilter`, nav without `highlightedOption`) were not ported.
