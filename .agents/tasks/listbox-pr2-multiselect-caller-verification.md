# PR 2 follow-up verification: Multiselect uses `multiSelection`

Worktree: `/Users/amanabiy/Documents/components/.worktrees/pr2-selection-models`, branch
`refactor/selection-models-multiselect-caller` (HEAD `6212527e0`). Iteration 1 (no review file existed).
Not committed, not pushed (later step commits). `package-lock.json` was already modified before this step; not touched.

## Changes

- `src/multiselect/use-multiselect.tsx` (+12 / −49): builds
  `multiSelection(selectedOptions, { options: filteredOptions, allOptions: flatOptions, interactiveGroups: useInteractiveGroups })`
  once per render. `isAllSelected` = `selection.getGroupState(selectAllOption).selected`; `toggleAll` and
  `updateSelectedOption` fire `onChange` with `selection.getNextSelection(selectAllOption)` /
  `selection.getNextSelection({ option })`. `isSomeSelected` stays `selectedOptions.length > 0`. Removed
  `selectedValues`, `allNonParentOptions`, `filteredNonParentOptions`, `isAllVisibleSelectableSelected` and the
  `useMemo`, `findOptionIndex`, `isGroup` imports. Both explanatory comments kept.
- `src/internal/components/listbox/selection/interfaces.ts` (+4 / −1): `getNextSelection` doc comment says it does not
  check disabled, read-only or non-interactive options; callers must.
- New `src/multiselect/__tests__/selection-order.test.tsx` (3 tests, gaps not covered by existing tests): group
  choice while filtering selects only visible enabled children; choosing a partially selected group keeps other
  selections first, then appends all enabled group children in group order; select-all row disappears when filtering
  matches nothing. Ran and passed against the OLD implementation first (3/3), then against the new one.
- Not touched: Select, `useSelect`, OptionList, render code, styles, public API, existing test files, model
  implementations.

## Commands and results

| Command (cwd = WT) | Result |
| --- | --- |
| `git diff --stat origin/refactor/add-listbox-selection-models` | 6 files. Ours: `use-multiselect.tsx` 61 (+12/−49), `interfaces.ts` 5 (+4/−1). Others are not from this step: `package-lock.json` (pre-existing unstaged), `app-layout` skeleton + `input/styles.scss` = main commits #5155/#5185 (HEAD is the PR 2 commit rebased on `origin/main` 1f35242c3; the remote PR branch is based on c07a7e33a). New test file is untracked so not in the stat. |
| `git diff --stat origin/main -- src/select src/internal/components/option src/internal/components/options-list src/option-list` | empty |
| `git diff --stat -- 'src/**/__tests__/**'` | empty (no existing test file changed) |
| `TZ=UTC node_modules/.bin/jest -c jest.unit.config.js src/multiselect/__tests__/selection-order.test.tsx` (old code) | 3/3 pass |
| `npx eslint --fix --max-warnings 0 <3 files>` | exit 0 |
| `npx prettier --check <3 files>` | exit 0 |
| `npm run quick-build` (`/tmp/pr2-msel-quick-build.log`) | exit 0, no TS errors |
| `TZ=UTC node_modules/.bin/jest -c jest.unit.config.js src/multiselect src/internal/components/listbox src/select src/property-filter src/internal/components/chart-filter src/pie-chart src/area-chart src/mixed-line-bar-chart` (`/tmp/pr2-msel-unit-targeted.log`) | 71/71 suites; 1196 passed, 1 skipped; 17/17 snapshots |
| `npm run build` (`/tmp/pr2-msel-build.log`) | exit 0 (webpack warnings only) |
| `TZ=UTC npm run test:unit` (`/tmp/pr2-msel-unit.log`) | build-tools run: 2/2 suites, 8/8. Main run: 648/649 suites; 14207 passed, 162 skipped, 1 failed; 189/190 snapshots. Only failure: `test-utils-wrappers.test.tsx` › dom ElementWrapper snapshot (known parallel flake). |
| `TZ=UTC node_modules/.bin/jest -c jest.unit.config.js src/__tests__/snapshot-tests/test-utils-wrappers.test.tsx` | 2/2 pass, 2/2 snapshots, so the failure was the flake |

Multiselect users (grep for imports of `multiselect/`): `property-filter/property-editor.tsx` (embedded),
`property-filter/token-editor-inputs.tsx`, `internal/components/chart-filter` (used by pie/area/mixed-line-bar charts).
All covered by the targeted run. `src/collection-select-filter` does not exist in this repo.

## Integration

Setup: `/tmp/pr2-msel-integ/{setup.integ.js,jest.integ.config.js}` = repo config with `baseUrl`
`http://127.0.0.1:8093` (no repo file changed). Dev server via `/tmp/pr2-msel-integ/serve.sh`
(`webpack serve --config pages/webpack.config.integ.cjs --host 127.0.0.1 --port 8093`, loopback only; the user's
:8080 server was not used). ChromeDriver 155 from `/tmp/listbox-04-chromedriver/.../chromedriver-mac-arm64` put first
on PATH.

| Command | Result |
| --- | --- |
| `PATH=<driver155>:$PATH NODE_OPTIONS=--experimental-vm-modules node_modules/.bin/jest -c /tmp/pr2-msel-integ/jest.integ.config.js src/multiselect/__integ__/` (`/tmp/pr2-msel-integ.log`) | 3/3 suites (`multiselect`, `multiselect-embedded`, `select-all`), 45/45 pass |
| same with `src/select/__integ__/ src/property-filter/__integ__/` (`/tmp/pr2-msel-integ-other.log`) | 8/8 suites, 91/91 pass, no retries logged. The `async-select` virtual-scroll test that failed in earlier runs passed this time. |

Afterwards the dev server was stopped. No listeners remain on 8093, 8094 or 9515.

## Learning

- Size: `use-multiselect.tsx` `git diff --numstat` = 12 added, 49 removed (net −37).
- Mapped with no model change:
  - option toggle
  - group toggle (visible ∩ enabled children, then toggle with "disabled counts as selected")
  - select-all toggle (keeps hidden selections, adds visible enabled ones, iterates in flat option order)
  - `isAllSelected` against all options incl. filtered-out (R4)

  The model formulas are the old ones line for line: same `findOptionIndex`/value-Set matching, same filter order, same
  object references in the `onChange` detail.
- Stayed in the caller, and why:
  - Gating (R1): `useSelect.selectOption` still rejects non-interactive rows before calling the caller.
  - `isSomeSelected`: the `useSelect` API needs it, and the model doesn't expose it. Deriving it from
    `getGroupState(selectAll)` would be wrong for empty lists.
  - `onChange` firing: still fires once per call, unconditionally, with `{ selectedOptions }`.
  - Group checkbox and row `selected` state (R5): computed inside the shared `useSelect.getOptionProps`, so left
    unchanged. That means group-state logic now exists twice (`useSelect.getGroupState` and the model) until
    `useSelect` or OptionList uses the model.
- Friction:
  - `useSelect` and token dismiss pass a raw `OptionDefinition`, so the caller wraps it as `{ option }`.
  - `interactiveGroups` is passed for intent only. `getNextSelection` ignores it, and the model's group state isn't
    wired here.
  - `updateSelectedOption`'s `useCallback` deps are now `[selection, onChange]`. They change every render, same as
    before: the old deps included `filteredNonParentOptions`, which was also rebuilt every render.
- Behaviour differences found: none. Empty options + `enableSelectAll`: old `isAllSelected` = `[].every(...)` =
  `true`, model = `true`, so they're the same and no caller workaround is needed. `isSomeSelected` = `false` either way,
  and the select-all row is not rendered (it is only added when `filteredOptions.length`). Covered by
  `select-all.test.tsx` (`options: []`) and the new "filtering matches nothing" test.
- Quirk this change keeps (not fixed): select-all ON reorders the selection to option order. It also drops selected
  values that are not in `options`. The old code did the same.

## Commit

Commit `628dcf6ea` on `refactor/selection-models-multiselect-caller`. Hooks ran normally: lint-staged eslint --fix
made no changes, git-secrets passed. Staged by path: `use-multiselect.tsx`, `selection/interfaces.ts`,
`__tests__/selection-order.test.tsx` (3 files, +86/−50). Not staged: `package-lock.json`, `.agents/`. Not pushed.

```
$ git log --oneline origin/main..HEAD
628dcf6ea refactor: Use selection models in Multiselect
6212527e0 refactor: Add shared listbox selection models
```
