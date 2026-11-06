# PR 2 follow-up: Multiselect as the first caller of `multiSelection`

Worktree (WT): `/Users/amanabiy/Documents/components/.worktrees/pr2-selection-models`
Branch: `refactor/selection-models-multiselect-caller` (HEAD `6212527e0`, on origin/main `1f35242c3`).
Use absolute paths only; relative paths land in the parent workspace. Never push. Do not stage
`package-lock.json` or `.agents/`.

Goal: Multiselect's toggle / toggle-all / select-all-state logic goes through
`multiSelection(...)` so the existing Multiselect tests prove the model matches today's behaviour.
Only `src/multiselect/use-multiselect.tsx` changes behaviour-wise; `useSelect` is untouched.

## (a) Mapping: current Multiselect selection logic → model

Source: `WT/src/multiselect/use-multiselect.tsx` (line numbers at HEAD) and
`WT/src/select/utils/use-select.ts`.

| Current code | Replacement | Notes |
| --- | --- | --- |
| `selectAllOption` (117-121) | stays in caller | Render/i18n concern; also the input passed to the model for select-all. |
| `visibleOptions` (123-124) | stays in caller | Feeds `useSelect` / native search; not selection logic. |
| `allNonParentOptions` (127) | `allOptions: flatOptions` | Model's `nonParentOptions` filters `parent` and `select-all`; `flatOptions` has no select-all. R4. |
| `filteredNonParentOptions` (129) | `options: filteredOptions` | Visible list. Pass `filteredOptions`, not `visibleOptions` (both work; the former avoids relying on the select-all filter). |
| `selectedValues` useMemo (131) | removed (model builds its own `Set`) | Only used by the selection code. |
| `isSomeSelected` (133) | stays in caller: `selectedOptions.length > 0` | `useSelect` API needs it as a separate flag. The model has no direct accessor; deriving it from `getGroupState(selectAll)` (`selected \|\| indeterminate`) is NOT equivalent for empty lists (see c1). |
| `isAllVisibleSelectableSelected` (134-135) | internal to model (`toggleAll` branch) | Same formula (multi-selection.ts `isAllVisibleSelectableSelected`). |
| `isAllSelected` (136) | `selection.getGroupState(selectAllOption).selected` | Same formula against `allOptions`. Passed to `useSelect` unchanged in name. |
| `toggleAll` (138-148) | `() => fireNonCancelableEvent(onChange, { selectedOptions: selection.getNextSelection(selectAllOption) })` | Same two branches, same filter order. Gating stays in `useSelect.selectOption` (R1). |
| `updateSelectedOption` group branch (168-172) | `selection.getNextSelection({ option })` | Model: `group.options.filter(visible && !disabled)` then `toggle` = today's `intersection` + `isAllChildrenSelected` + `select/unselect`. |
| `updateSelectedOption` option branch (173-177) | same call `selection.getNextSelection({ option })` | `{ option }` has no `type`, so it can never be treated as select-all. |
| `fireNonCancelableEvent(onChange, …)` in `updateSelectedOption` (179-181) | stays in caller | Fired unconditionally after every call, exactly as today. |
| `tokenOnDismiss` → `updateSelectedOption(selectedOptions[i])` (289-296) | unchanged | Goes through the new `updateSelectedOption`; model finds it selected by value → removes (C10). |
| Interactivity / disabled gating: `useSelect.selectOption` (use-select.ts 136-147, `isGroupInteractive`) | stays in caller (`useSelect`, unchanged) | R1. Read-only never opens the dropdown (unchanged). |
| Group checkbox state: `useSelect.getGroupState` + `__selectedValuesSet` (use-select.ts 87-92, 274-281) | stays in `useSelect` (unchanged) | Computed inside `getOptionProps`, which is shared with Select; the step brief says leave useSelect unchanged. The model's `getGroupState` for groups has the same formula (C7) but is not wired in this PR. |
| Select-all row `selected`/`indeterminate` (use-select.ts 288, 306) | stays in `useSelect`, fed by `isAllSelected` / `isSomeSelected` from the caller | `indeterminate = !isAllSelected && isSomeSelected` = model's select-all `indeterminate`. |
| Row `selected` via `connectOptionsByValue` (use-select.ts 85-86) | stays in `useSelect` | R5. |

Decisions:
- Build the model once per render: `const selection = multiSelection(selectedOptions, { options: filteredOptions, allOptions: flatOptions, interactiveGroups: useInteractiveGroups })`.
  `useInteractiveGroups` is the existing `true` constant (line 110), so `interactiveGroups` only documents intent;
  it has no effect on `getNextSelection` and the model's group `getGroupState` is not used here. No `useMemo`:
  today's derived arrays are also rebuilt every render, and `filteredOptions`/`flatOptions` are new arrays each render,
  so memoising would never hit.
- Keep `updateSelectedOption` in `useCallback` with deps `[selection, onChange]` (the old deps already changed every
  render because `filteredNonParentOptions` is rebuilt; no consumer relies on its identity).
- `updateSelectedOption` keeps its `(option: OptionDefinition | OptionGroup)` signature, because `useSelect`'s
  `updateSelectedOption: (option: OptionDefinition) => void` prop and `tokenOnDismiss` call it with a raw option.
  Wrap with `{ option }` (a valid `DropdownOption`; no cast needed).
- Remove now-unused imports from use-multiselect.tsx: `findOptionIndex`, `isGroup`, `useMemo` (check `useMemo` has no
  other use first — it has none at HEAD). Keep `OptionDefinition`, `OptionGroup` (still used by the callback signature
  and `getParent`). Add `import { multiSelection } from '../internal/components/listbox/selection/multi-selection';`
  and let `eslint --fix` sort imports.
- Keep the existing explanatory comment at 152-153 ("ignores disabled options to prevent getting stuck…") — the model
  has the equivalent comment in `toggle`; do not drop the rationale from the caller either: move it as a one-line
  comment above the `getNextSelection` call (repo rule: never silently drop an explanatory comment in a refactor).
  Keep the `// Includes visible and non-visible (filtered out) options` comment next to `allOptions: flatOptions`.

## (b) Caller contracts to keep

- R1 No gating in the model. `useSelect.selectOption` must stay the only entry for dropdown picks and keep rejecting
  non-interactive rows (`isGroupInteractive`: wrapper `disabled`, incl. groups whose children are all disabled) before
  `updateSelectedOption`/`toggleAll` run. Read-only/disabled Multiselect never opens the dropdown; token dismiss is not
  rendered for disabled tokens (unchanged).
- R3 Group toggle and select-all read `OptionDefinition.disabled`, not the `flattenOptions` wrapper `disabled`
  (children of a disabled group). Parity with today (`allNonParentOptions` maps to `item.option`).
- R4 `allOptions: flatOptions` (all, incl. filtered-out) and `options: filteredOptions` (visible). Omitting
  `allOptions` would compute `isAllSelected` and select-all ON against the visible list only and drop hidden selections.
- R5 Row `selected` matching (`connectOptionsByValue`) stays in `useSelect`.
- onChange: fired once per `updateSelectedOption` / `toggleAll` call, with `{ selectedOptions }` only, including the
  "no-op" cases where content is unchanged (e.g. toggling a group whose visible enabled children are all selected
  except disabled ones, or choosing a disabled-but-somehow-reached option). Today it always fires; keep that.

## (c) Behaviour differences / risks (all "verify during implementation")

c1. Empty options with `enableSelectAll` (and `options: []`): today `allNonParentOptions = []` →
    `isAllSelected = [].every(...) = true`; model `all = []` → `true`. Same value. `isSomeSelected` stays
    `selectedOptions.length > 0` in the caller, so `false`. The select-all row is not rendered anyway
    (`visibleOptions` only prepends it when `filteredOptions.length`). Expected: match, no caller workaround needed.
    Verify: `select-all.test.tsx` line ~110 (`options: []`) passes; plus the new test in item 3 (filtering hides
    everything → no select-all row, no onChange).
    Pitfall to avoid: deriving `isSomeSelected` from `getGroupState(selectAll)` would give `true` here.
c2. Order of `selectedOptions` in onChange detail — must be identical:
    - Option select: today `selected.filter(not option).concat([option])` → appended. Model `toggle` identical.
    - Group select when partially selected: today `union` removes the group's already-selected visible children and
      re-appends ALL visible enabled children in group order (they move to the end). Model `toggle` does the same
      (`filter(findOptionIndex(toToggle) === -1).concat(toToggle)`). Not covered by existing Multiselect tests →
      new test in item 3.
    - Group deselect / option deselect: `selectedOptions.filter(...)`, original order kept, both sides.
    - Select-all ON: today and model iterate `allNonParentOptions`/`all` (flat option order), NOT the previous
      selection order — so a pre-existing selection is reordered to option order, and selections not in `options`
      at all (e.g. a token whose value is absent from options) are DROPPED by select-all ON. Same in both; record as an
      existing quirk, do not fix. Covered for order by `select-all.test.tsx` "selects all options when some … are
      selected"; add the "outside value dropped" case to the new test only if it is not covered (check first).
    - Select-all OFF: `selectedOptions.filter(not visible)`, original order, both sides.
c3. Object identity in onChange detail: today option/group/select-all branches return the same `OptionDefinition`
    references (`option` arg, `group.options[i]`, `flatOptions[i].option`). Model returns `option.option` (= the arg),
    `group.options[i]`, `allOptions[i].option` — same references. Tests use `toEqual`/`objectContaining`, so a
    mismatch would not fail them; reason about it but no test needed.
c4. Value matching: model `toggle` uses `findOptionIndex` (reference OR `value`), select-all uses value Sets — same
    helpers/semantics as today. Group `getGroupState` falsy-value guard is not involved (useSelect keeps its own).
c5. `interactiveGroups: true` is passed; `getNextSelection` ignores it. If someone later sets Multiselect groups
    non-interactive, gating must still come from `useSelect` (R1).
c6. Filtering with `filteringType="manual"`: `filteredOptions === flatOptions`, so visible = all. Same both sides.
c7. Embedded Multiselect (`src/multiselect/embedded.tsx`, used by property-filter token editor) and chart-filter use
    the same `useMultiselect` → covered by their suites in item 4.
c8. Readonly typing: model returns `ReadonlyArray<OptionDefinition>`; `MultiselectProps.MultiselectChangeDetail`
    (`selectedOptions: ReadonlyArray<Option>`) accepts it. Verify with quick-build (tsc).

No model change is expected. If one turns out to be needed, it must come with a failing Multiselect test first.

## (d) Files to change

- `WT/src/multiselect/use-multiselect.tsx` — use `multiSelection` as mapped in (a).
- `WT/src/internal/components/listbox/selection/interfaces.ts` — doc comment on `SelectionModel.getNextSelection`:
  ```ts
  /**
   * Returns the selection that results from the user choosing `option`.
   * Does not check whether `option` is disabled, read-only or non-interactive; callers must do that first.
   */
  ```
- New: `WT/src/multiselect/__tests__/selection-order.test.tsx` — gap tests through the public surface
  (`createWrapper().findMultiselect()` / `renderMultiselect` pattern from `src/multiselect/__tests__/common.ts`;
  read it first):
  1. Group with filtering (`filteringType="auto"`, `wrapper.findFilteringInput().setInputValue(...)`): choosing the
     group selects only its visible enabled children.
  2. Partially selected group → choosing it fires `selectedOptions` with prior non-group selections first, then all
     visible enabled group children in group order (c2).
  3. `enableSelectAll` + filtering text that matches nothing → no select-all row is rendered
     (`findDropdown().findSelectAll()` null — confirm the test-utils finder name in
     `WT/src/test-utils/dom/multiselect/index.ts`).
  Write these against HEAD BEFORE changing use-multiselect.tsx and confirm they pass on the old code (they lock in
  today's behaviour); then they must still pass after the change. Name tests by observable behaviour.
- Not touched: Select, `useSelect`, OptionList, render code, styles, public API, existing Multiselect test files,
  the model implementations (unless justified per c-end).

## (e) Plan and verification

All commands run with `cwd` = WT. Logs to `/tmp/pr2-msel-*.log`.

- [ ] 1. Add the new gap tests (file above) against unchanged code.
      Files: `src/multiselect/__tests__/selection-order.test.tsx`
      Verify: `TZ=UTC node_modules/.bin/jest -c jest.unit.config.js src/multiselect/__tests__/selection-order.test.tsx`
      → all pass on the old implementation.

- [ ] 2. Add the `getNextSelection` doc comment in `interfaces.ts`, then switch `use-multiselect.tsx` to
      `multiSelection` per (a): build `selection`, replace `isAllSelected`, `toggleAll`, `updateSelectedOption`;
      remove `selectedValues`, `allNonParentOptions`, `filteredNonParentOptions`, `isAllVisibleSelectableSelected`
      and unused imports; keep `isSomeSelected = selectedOptions.length > 0`; keep/move the explanatory comments.
      Files: `src/multiselect/use-multiselect.tsx`, `src/internal/components/listbox/selection/interfaces.ts`
      Verify:
      - `npm run quick-build > /tmp/pr2-msel-quick-build.log 2>&1` → exit 0 (tsc clean).
      - `npx eslint --max-warnings 0 src/multiselect/use-multiselect.tsx src/multiselect/__tests__/selection-order.test.tsx src/internal/components/listbox/selection/interfaces.ts`
        → exit 0 (run `--fix` once for import sort if needed).
      - `npx prettier --check` on the same three files → exit 0.
      - `git diff --stat` → only the three files (+ the pre-existing unstaged `package-lock.json`).
      - `git diff origin/main --stat -- src/select src/internal/components/option src/internal/components/options-list src/option-list`
        → empty.

- [ ] 3. Targeted unit tests (existing test files unchanged; `git diff --stat -- 'src/**/__tests__/**'` shows only the
      new file).
      Verify: `TZ=UTC node_modules/.bin/jest -c jest.unit.config.js src/multiselect src/internal/components/listbox src/select src/property-filter src/internal/components/chart-filter src/pie-chart src/area-chart src/mixed-line-bar-chart > /tmp/pr2-msel-unit-targeted.log 2>&1`
      → all suites pass. (`src/collection-select-filter` does not exist in this repo; Multiselect consumers found by
      grep: `src/property-filter/{property-editor,token-editor-inputs}.tsx`, `src/internal/components/chart-filter`
      → used by pie-chart, area-chart, mixed-line-bar-chart; plus `pages/multiselect/*`.)

- [ ] 4. Full unit suite.
      Verify: `TZ=UTC npm run test:unit > /tmp/pr2-msel-unit.log 2>&1`. Expected passes except the known non-issues
      from the PR 2 note: `snapshot-tests/documenter.test.ts` and `style-docs.test.ts` need full-build artifacts
      (run `npm run build` first to clear them), `test-utils-wrappers.test.tsx` parallel flake (re-run alone:
      `TZ=UTC node_modules/.bin/jest -c jest.unit.config.js src/__tests__/snapshot-tests/test-utils-wrappers.test.tsx`).
      No snapshot updates expected; if any snapshot changes, stop and report — it means behaviour/API changed.

- [ ] 5. Full build (pages for the integ server).
      Verify: `npm run build > /tmp/pr2-msel-build.log 2>&1` → exit 0 (webpack size warnings only).

- [ ] 6. Multiselect integ suite (per RUNNING_TESTS.md + PR 3 note). Do NOT use or touch the user's :8080 server.
      - ChromeDriver on PATH is 152 vs Chrome 155; reuse
        `/tmp/listbox-04-chromedriver/chromedriver/mac_arm-155.0.8059.85/chromedriver-mac-arm64` (exists). If gone:
        `node_modules/.bin/browsers install chromedriver@155.0.8059.85 --path /tmp/pr2-msel-chromedriver`.
      - Create `/tmp/pr2-msel-integ/setup.integ.js` (copy of `/tmp/listbox-04-integ/setup.integ.js` with `paths` →
        WT and `baseUrl: 'http://127.0.0.1:8093'`) and `/tmp/pr2-msel-integ/jest.integ.config.js`
        (`require('<WT>/jest.integ.config.js')`, `rootDir: <WT>`, `reporters: ['default']`, `maxWorkers: 4`,
        `setupFilesAfterEnv: ['/tmp/pr2-msel-integ/setup.integ.js']`). No repo file changes.
      - Dev server, loopback only, background:
        `node_modules/.bin/webpack serve --config pages/webpack.config.integ.cjs --host 127.0.0.1 --port 8093`
        (wait until it serves `http://127.0.0.1:8093/`).
      - Run: `PATH=/tmp/listbox-04-chromedriver/chromedriver/mac_arm-155.0.8059.85/chromedriver-mac-arm64:$PATH NODE_OPTIONS=--experimental-vm-modules node_modules/.bin/jest -c /tmp/pr2-msel-integ/jest.integ.config.js src/multiselect/__integ__/ > /tmp/pr2-msel-integ.log 2>&1`
        → 3 suites (`multiselect`, `multiselect-embedded`, `select-all`) pass.
      - Then `src/select/__integ__/ src/property-filter/__integ__/` the same way. Known pre-existing failure:
        `select/__integ__/async-select.test.ts` › virtualScrolling=true › "bottom of the dropdown lines up…"
        (32 vs ≤3) — failed on the PR 2 baseline too. Any other failure: re-run against a baseline build of HEAD
        before this change to classify it as pre-existing or caused by this change: `git archive 6212527e0` →
        `/tmp/pr2-msel-baseline`, symlink WT `node_modules` into it (no install), `npm run build`, serve on
        127.0.0.1:8094. Do not use `git stash` (it would touch the unstaged `package-lock.json`).
      - Stop the dev server afterwards; confirm no listeners on 8093/8094/9515 (`lsof -iTCP -sTCP:LISTEN`).

- [ ] 7. Commit locally (no push): stage only the three files by name; message
      `refactor: Use shared selection model in Multiselect` with a body listing the caller contracts (R1, R3, R4, R5,
      onChange always fires) and the c1/c2 findings. Record results (commands + pass counts) in
      `/Users/amanabiy/Documents/components/.agents/tasks/listbox-pr2-multiselect-caller-verification.md`.

## Learning-goal notes to report back

- Fit: the model expresses all of Multiselect's toggle, group-toggle, select-all toggle and select-all state with no
  model change (to be confirmed by item 3/6). What stays outside is gating (R1), the `isSomeSelected` flag the
  `useSelect` API wants, and group/row rendering state inside the shared `useSelect`.
- Friction points to report: the model takes `DropdownOption` while `useSelect` hands the caller a raw
  `OptionDefinition` (needs `{ option }` wrapping); `isSomeSelected` is not exposed by the model; group checkbox state
  is duplicated between `useSelect.getGroupState` and the model until `useSelect` (or OptionList) consumes the model.
