# Listbox parity implementation plan

Goal: make the in-progress listbox refactor behaviour-neutral. Select, Multiselect (including the embedded
Multiselect used by PropertyFilter), Autosuggest, ButtonDropdown, PromptInput, PropertyFilter and chart-filter must
behave EXACTLY as at the pre-refactor baseline. The public OptionList is the ONLY component allowed to differ.

## Baseline / working-tree note (read this first)

The task brief says "baseline HEAD = b9c34f236" and "the refactor is uncommitted". The actual repository state is
different, and every item below is written against the real state:

- `git log` HEAD is **`eb7bdcc69`** ("refactor: adjust dependencies on plainlist accordingly"). The refactor is
  **already committed** here.
- **`b9c34f236`** ("chore: remove grouping") is the PRE-refactor baseline. Read baseline sources with
  `git show b9c34f236:<path>` (NOT `git show HEAD:`, which is the refactored code).
- Only three files are uncommitted (working tree vs HEAD): `eslint.config.mjs`, `src/multiselect/embedded.tsx`,
  `src/option-list/use-option-list.ts`. These three already contain a partial parity fix (an `embeddedBehavior`
  option that restores embedded-Multiselect focus — see item 1).
- The "working tree" the brief refers to = current HEAD `eb7bdcc69` + those three uncommitted edits.

Do NOT commit, stage, unstage, stash, reset, or `git checkout -- <file>`. The user may edit concurrently, so
**re-read every file immediately before editing it** — line numbers below are current but may shift.

## Build & test commands (discovered)

- Unit tests import from `lib/components`, so a build must run first: `npm run quick-build` (gulp quick-build,
  ~12 s). After editing `src`, re-run quick-build before re-running unit tests.
- Run a single unit suite: `TZ=UTC node_modules/.bin/jest -c jest.unit.config.js <path>`.
- Full unit suite via gulp (handles TZ/ESM env): `npm run test:unit`.
- Type-check: `npx tsc -p tsconfig.json --noEmit` and `npx tsc -p tsconfig.unit.json --noEmit` (the latter has ~50
  pre-existing/environmental errors unrelated to these files — compare counts, do not expect zero).
- Lint changed files: `npx eslint <paths>`; stylelint for `.scss`.
- Integration tests (Escape close, real focus): `npm run test:integ` (needs dev server + ChromeDriver). These are
  the real guard for Escape and focus; run them before raising the PR if the environment allows, but they are not
  required to land the unit-level parity fixes.

## Parity audit result (what actually diverges from baseline)

I compared `useOptionList` + `useSelectDropdown` + Select/Multiselect/embedded internals against baseline
`src/select/utils/use-select.ts`, `src/multiselect/use-multiselect.tsx`, `src/select/internal.tsx`,
`src/multiselect/internal.tsx`, `src/multiselect/embedded.tsx` (all at `b9c34f236`). Findings:

- **Regression 1 (embedded Multiselect focus): already fixed in the working tree, needs tests + verification.**
  `src/option-list/use-option-list.ts` now has an `embeddedBehavior: 'option-list' | 'embedded-multiselect'` prop.
  `src/multiselect/embedded.tsx` passes `embeddedBehavior: 'embedded-multiselect'`. In that mode a mount effect
  highlights the first selected option (or the first option) with the mouse highlight, matching baseline
  `use-select.ts` open-time effect for the always-open embedded dropdown; and `listProps.onFocus` highlights the
  first option only when nothing is highlighted (`goHomeWithKeyboard`), matching baseline `menuProps.onFocus`. It
  does NOT skip highlight on pointer focus and does NOT clear on mouse leave in this mode — correct per baseline.
  The public OptionList keeps `embeddedBehavior: 'option-list'` (the default), i.e. the new rules. **No code change
  needed; add the regression test in item 4 and confirm parity.**

- **Regression 2 (`singleSelection.getGroupState` empty-string value): NOT fixed. Fix in item 2.**

- **Regression 3 (Escape): already correct in the working tree, needs tests + verification.** Baseline
  `options-list/utils/use-keyboard.ts` always called `event.stopPropagation(); closeDropdown()` on Escape. The
  refactored `list-container/utils/use-keyboard.ts:46-51` guards on `closeDropdown` being defined. The Select/
  Multiselect dropdown passes `onEscape: closeAndFocusTrigger` (`use-select-dropdown.ts:96-100`), so Escape closes
  + refocuses trigger + stops propagation — matches baseline. Embedded Multiselect passes `onEscape: () => {}`
  (`embedded.tsx:76`), so Escape stops propagation but does nothing — matches baseline embedded branch
  (`if (!embedded)` was false). Public OptionList passes no `onEscape`, so Escape propagates — the intended change.
  **No code change needed; add the regression tests in item 4 and confirm parity.**

The rest of the audit (highlight-on-open mouse vs keyboard with/without filter; focus routing filter-vs-list and
back-to-trigger; closed/open type-ahead; Home/End/PageUp/PageDown/Space/Enter/Tab; select-all checked over
allOptions and toggle over visible enabled; group toggle over visible enabled children; disabled options;
load-more/status placement; announcements; aria ids/attributes; DOM/class names apart from hash churn) was checked
line-for-line and is **already equivalent** to baseline — see the per-area notes in item 0. No code changes are
required for those; they are covered by existing suites plus the new tests below.

---

## Implementation items

- [ ] 0. Confirm the no-change audit areas against baseline before touching anything (read-only sanity pass).
      Re-verify each equivalence by reading both sides, so later edits don't silently regress a now-correct area.
      Check, with `git show b9c34f236:<path>` vs the working tree:
      - Highlight on open: `use-select-dropdown.ts` effect (`useEffect` near `prevOpen`, ~line 177-196) vs baseline
        `use-select.ts` open effect. Keyboard open → selected else first (keyboard highlight); mouse open → selected
        (if present & visible) else first (mouse highlight); with filter → nothing. Equivalent.
      - Focus routing: `activeRef = hasFilter ? filterRef : optionList.listRef` and the focus effect
        (`use-select-dropdown.ts`), trigger `onFocus: closeDropdown`, close refocuses trigger. Equivalent to
        baseline `activeRef`/`focusActiveRef`.
      - `preventNativeSpace`: list handler `true`; combobox-input handler
        `!!highlightedOption && highlightType.type === 'keyboard'` (`use-option-list.ts` ~line 210-214) ==
        baseline `!hasFilter || (highlightedOption && highlightType.type === 'keyboard')`. Equivalent.
      - Up/Down wrap and child-boundary rule in `navigation` (`use-option-list.ts` ~line 170-192) == baseline
        `activeKeyDownHandler.goUp/goDown`. Equivalent.
      - Closed/open type-ahead: Select `select/internal.tsx` `handleTypeAhead` (closed → `selectOption`, open →
        keyboard highlight) and Multiselect `multiselect/internal.tsx` `handleTypeAhead` (enabled only while open)
        == baseline `select/internal.tsx` and `use-multiselect.tsx` `useNativeSearch`. Equivalent.
      - Select-all + group selection: `multi-selection.ts` (`isAllSelected` over `all`, `toggleAll`/group toggle
        over visible enabled, group state uses `!!item.value`) == baseline `use-multiselect.tsx` lines ~110-170.
        Equivalent.
      - Status placement: non-sticky status → `__footer` (list `listBottom`); sticky status → Dropdown `footer`
        via `composeDropdownContent`. Matches baseline placement.
      Files: none modified. Verify: no code change; this is a reading gate. If any area is NOT equivalent, STOP and
      add a numbered fix item for it before continuing.

- [ ] 1. (Regression 1) Verify the already-present embedded-Multiselect focus fix is intact; do not rewrite it.
      Re-read `src/option-list/use-option-list.ts` and `src/multiselect/embedded.tsx`. Confirm: `embeddedBehavior`
      prop exists with the two documented variants; the mount-highlight `useEffect` runs only when
      `embedded && !isOptionListBehavior && options.length > 0` and highlights selected-else-first with the MOUSE
      highlight; the `else if (embedded)` branch sets `onFocus` → `goHomeWithKeyboard()` only when nothing is
      highlighted and `onBlur` → `resetHighlightWithKeyboard()`, with NO pointer-skip and NO mouse-leave clear;
      and `embedded.tsx` passes `embeddedBehavior: 'embedded-multiselect'`. The public OptionList path
      (`StandaloneOptionList` in `option-list/internal.tsx`) must NOT pass `embeddedBehavior`, so it keeps the
      `'option-list'` default (new rules).
      Files: none expected (verification only). If the fix is missing or altered, restore it exactly as described,
      editing only `src/option-list/use-option-list.ts` and `src/multiselect/embedded.tsx`.
      Verify: `npm run quick-build` then `TZ=UTC node_modules/.bin/jest -c jest.unit.config.js src/property-filter`
      — PropertyFilter suites pass (they render the embedded Multiselect). Full parity is asserted by the new test
      in item 4.

- [ ] 2. (Regression 2) Restore baseline `singleSelection.getGroupState` semantics: ignore children with falsy
      `value`. In `src/option-list/selection/single-selection.ts`, the `getGroupState` child count currently is
      `children.filter(child => child.value === selectedValue)`. Baseline (`use-select.ts` `getGroupState` +
      `__selectedValuesSet`) counted only truthy values (`!!item.value`). Change the count so a child with
      `value === ''` (or any falsy value) is never counted even when `selectedValue` is also falsy. Keep
      `selected: false` (single-select groups are never selected) and keep `indeterminate = totalSelected > 0 &&
      totalSelected !== children.length`. Concretely, guard the filter with the child's truthiness, e.g.
      `children.filter(child => !!child.value && child.value === selectedValue)`, and keep the existing
      `selectedValue === undefined ? 0 : ...` short-circuit (or fold it into the same guard).
      Note: `singleSelection` is used by BOTH Select (`select/internal.tsx:130`) and the public OptionList
      (`option-list/internal.tsx:172`), so this is a real Select-facing parity fix, not OptionList-only.
      Files: src/option-list/selection/single-selection.ts
      Verify: `npm run quick-build` then
      `TZ=UTC node_modules/.bin/jest -c jest.unit.config.js src/option-list/selection src/select` — the new
      single-selection unit test (item 3) and existing Select suites pass.

- [ ] 3. Add pure unit tests for the selection models.
      Create `src/option-list/selection/__tests__/single-selection.test.ts` and
      `src/option-list/selection/__tests__/multi-selection.test.ts`. These are pure-function tests (no rendering):
      import `singleSelection`/`multiSelection`, build `ListOption[]` via
      `flattenOptions` from `src/internal/components/option/utils/flatten-options` (see the pattern in
      `src/internal/components/select-dropdown/__tests__/use-select-dropdown.test.ts`), and assert the returned
      `getGroupState(...)` and `getNextSelection(...)` values directly. Name tests by observable behaviour, not
      util names (per `.github/instructions/tests.instructions.md`).
      single-selection.test.ts cases:
      - choosing an option returns `[thatOption]` (`getNextSelection`).
      - re-choosing the already-selected option still returns it selected (single keeps selection).
      - group with a selected child whose `value === ''` is NOT counted: `getGroupState(group).indeterminate`
        is `false` (this is the regression-2 guard; reason from baseline `!!item.value`).
      - group where some-but-not-all children match the selected value → `indeterminate: true`, `selected: false`.
      - group where the (single) selected child is the only child → `indeterminate: false` (totalSelected ===
        children.length), `selected: false`.
      multi-selection.test.ts cases (build config `{ options, allOptions, interactiveGroups: true }`):
      - toggle: choosing an unselected option adds it; choosing a selected option removes it.
      - option with empty-string value toggles like any other (multi uses `findOptionIndex` by value/ref).
      - group with a disabled child: `getNextSelection(group)` toggles only visible ENABLED children (disabled
        child is excluded from the toggle set).
      - group toggle limited to VISIBLE enabled children: when `options` (visible) is a filtered subset of
        `allOptions`, toggling the group only affects children present in `options`.
      - select-all checked state computed over `allOptions` incl. filtered-out:
        `getGroupState({type:'select-all',...}).selected` is `true` only when every non-parent option in
        `allOptions` is selected (not just the visible ones).
      - select-all toggle only changes visible enabled options and KEEPS hidden selections: with a value selected
        that is in `allOptions` but not in `options`, `getNextSelection(selectAll)` retains that hidden value while
        toggling the visible enabled ones.
      - indeterminate: select-all is `indeterminate` when `!isAllSelected && isSomeSelected`; a group is
        `indeterminate` when `hasSelected && !allSelected`.
      Files: src/option-list/selection/__tests__/single-selection.test.ts,
      src/option-list/selection/__tests__/multi-selection.test.ts
      Verify: `npm run quick-build` then
      `TZ=UTC node_modules/.bin/jest -c jest.unit.config.js src/option-list/selection` — all new tests pass.

- [ ] 4. Add regression tests proving parity with baseline for focus and Escape.
      Follow existing patterns: use official test-utils (`createWrapper().findMultiselect()`, `.findSelect()`,
      `.findDropdown()`, `.findOptionList()`), assert observable effects (which option is highlighted, dropdown
      open/closed, focus target, propagation), and reason each expectation from baseline code in a comment.
      4a. Embedded Multiselect focus highlights the first option even when a later option is selected.
          Add to a PropertyFilter test (the only embedded consumer), e.g. a new
          `src/property-filter/__tests__/property-filter-embedded-multiselect-focus.test.tsx`, or extend
          `property-filter-enum-tokens.test.tsx`. Render a PropertyFilter whose enum property editor shows the
          embedded Multiselect with a selected option that is NOT the first, open the editor, move focus into the
          list with the keyboard (not a pointer), and assert the FIRST option is highlighted (baseline
          `goHomeWithKeyboard` on focus when nothing is highlighted). Reason: baseline embedded `menuProps.onFocus`
          always went Home; the `embedded-multiselect` behaviour restores that.
      4b. Escape closes Select and Multiselect dropdowns and returns focus to the trigger.
          Add to `src/select/__tests__/` and `src/multiselect/__tests__/` (or a shared file). Open the dropdown,
          fire Escape on the active element (filter input when filtering, else the list), assert the dropdown is
          closed (`wrapper.findDropdown().findOpenDropdown()` is null) and `document.activeElement` is the trigger.
          Reason: `use-select-dropdown.ts` `onEscape: closeAndFocusTrigger`. (Full real-focus coverage is integ;
          the unit test asserts the handler path and close.)
      4c. Embedded Multiselect Escape does not propagate.
          Render the embedded Multiselect inside a container with an `onKeyDown`/Escape spy (or a Modal-like
          wrapper), focus the list, fire Escape, and assert the outer handler was NOT called (propagation stopped)
          AND the list did not change selection. Reason: `embedded.tsx` `onEscape: () => {}` keeps
          `event.stopPropagation()` in `use-keyboard.ts`.
      4d. Public OptionList keeps its new focus rules (guard against accidentally reverting OptionList).
          `src/option-list/__tests__/option-list.test.tsx` already asserts: no highlight before interaction;
          keyboard focus highlights the selected option with keyboard style; mouse leave clears highlight; blur
          clears highlight; and (separately) Escape does not change selection. Confirm these pass unchanged; add an
          explicit assertion only if a gap is found (e.g. that focusing from a pointer `mousedown`+`focus` adds no
          keyboard highlight, if not already covered). Do NOT weaken these to match the embedded variant.
      Files: src/property-filter/__tests__/<new or extended>.test.tsx,
      src/select/__tests__/<new or extended>.test.tsx, src/multiselect/__tests__/<new or extended>.test.tsx,
      src/option-list/__tests__/option-list.test.tsx (only if a gap is found)
      Verify: `npm run quick-build` then
      `TZ=UTC node_modules/.bin/jest -c jest.unit.config.js src/select src/multiselect src/property-filter src/option-list`
      — all suites, including the new regression tests, pass.

- [ ] 5. (Cleanup) Move `use-open-state.ts` into `list-container/utils` and update all imports.
      The file is git-tracked at `src/internal/components/select-dropdown/use-open-state.ts`, so use `git mv`:
      `git mv src/internal/components/select-dropdown/use-open-state.ts src/internal/components/list-container/utils/use-open-state.ts`
      (do NOT commit). Then move its test the same way:
      `git mv src/internal/components/select-dropdown/__tests__/use-open-state.test.ts src/internal/components/list-container/utils/__tests__/use-open-state.test.ts`
      (create the `__tests__` dir if needed) and fix the test's relative import of `../use-open-state` →
      `../use-open-state` still resolves if the test sits in `list-container/utils/__tests__/`; adjust the
      `render-hook` import depth (`../../../../__tests__/render-hook` from the new location — recount the `../`).
      Update the two runtime importers to the new path:
      - `src/button-dropdown/utils/use-button-dropdown.ts:5`:
        `../../internal/components/select-dropdown/use-open-state` →
        `../../internal/components/list-container/utils/use-open-state`.
      - `src/internal/components/select-dropdown/use-select-dropdown.ts:24`: `./use-open-state` →
        `../list-container/utils/use-open-state`.
      Grep to confirm no other references remain:
      `grep -rn "select-dropdown/use-open-state" src`.
      This also removes ButtonDropdown's dependency on the select-dropdown folder (it then depends only on
      list-container, which is layer 0).
      Files: src/internal/components/list-container/utils/use-open-state.ts (moved),
      src/internal/components/list-container/utils/__tests__/use-open-state.test.ts (moved),
      src/button-dropdown/utils/use-button-dropdown.ts,
      src/internal/components/select-dropdown/use-select-dropdown.ts
      Verify: `npm run quick-build` then
      `TZ=UTC node_modules/.bin/jest -c jest.unit.config.js src/internal/components/list-container src/button-dropdown src/select src/multiselect`
      — the moved `useOpenState` test and all consumers pass; `npx tsc -p tsconfig.json --noEmit` has no NEW errors.

- [ ] 6. (Cleanup) Make the `SelectProps` import in `prepare-options.ts` type-only.
      In `src/internal/components/option/utils/prepare-options.ts:3`, change
      `import { SelectProps } from '../../../../select/interfaces';` to
      `import type { SelectProps } from '../../../../select/interfaces';`. `SelectProps` is used only in type
      positions here (`SelectProps.Options`, `SelectProps.FilteringType`), so this is a pure annotation. It keeps
      layer-0 `option` from carrying a runtime edge into `select`.
      Files: src/internal/components/option/utils/prepare-options.ts
      Verify: `npx tsc -p tsconfig.json --noEmit` (no new errors) and `npx eslint
      src/internal/components/option/utils/prepare-options.ts` (clean).

- [ ] 7. Final full verification pass.
      Run `npm run quick-build`, then the full targeted unit set in one go:
      `TZ=UTC node_modules/.bin/jest -c jest.unit.config.js src/option-list src/select src/multiselect src/property-filter src/autosuggest src/button-dropdown src/prompt-input src/internal/components/select-dropdown src/internal/components/list-container src/internal/components/option`.
      Then the test-utils selectors snapshot: `npm run build` (for docs/styleDocs) then
      `TZ=UTC node_modules/.bin/jest -c jest.unit.config.js src/__tests__/snapshot-tests/__snapshots__/test-utils-selectors.test.tsx` —
      expect PASS (moving `use-open-state.ts`, a `.ts` not `.scss`, does not change hashed class names, so no
      snapshot churn beyond what already exists; the pre-existing `documenter` snapshot failures from the baseline
      grouping-removal are unrelated and out of scope). Run `npx eslint` over all changed files and confirm the
      `no-restricted-imports` rule in `eslint.config.mjs` still passes (no new runtime select/multiselect imports in
      `src/option-list` or `src/internal/components/select-dropdown`).
      If the environment allows a dev server + ChromeDriver, run `npm run test:integ` for `src/select`,
      `src/multiselect`, `src/internal/components/list-container`, `src/option-list` to cover Escape-close and real
      focus; if not available, state that integ was not run.
      Files: none (verification only).
      Verify: all targeted unit suites pass; selectors snapshot passes; eslint clean; tsc shows no NEW errors vs the
      pre-change baseline counts.

## Known behaviour differences table (file:line, working tree vs baseline b9c34f236)

| # | Area | Baseline (b9c34f236) | Working tree | Status | Fixed by |
|---|------|----------------------|--------------|--------|----------|
| 1 | Embedded Multiselect focus/mount highlight | `use-select.ts` open effect highlights selected-else-first; `menuProps.onFocus` → `goHomeWithKeyboard()` when nothing highlighted; no pointer-skip; no mouse-leave clear | `use-option-list.ts` mount effect + `else if (embedded)` branch under `embeddedBehavior: 'embedded-multiselect'` (`embedded.tsx:76`) | Already fixed (uncommitted) | item 1 verify + item 4a test |
| 2 | `singleSelection.getGroupState` empty value | counted only `!!item.value` (`use-select.ts` `getGroupState` + `__selectedValuesSet`) | `single-selection.ts` `getGroupState` counts `child.value === selectedValue` incl. `''` | NOT fixed | item 2 |
| 3 | Escape (dropdown close + focus trigger; embedded stop-propagation) | `options-list/.../use-keyboard.ts` always `stopPropagation()` + `closeDropdown()` | `list-container/.../use-keyboard.ts:46-51` guards on `onEscape`; dropdown passes `closeAndFocusTrigger`, embedded passes `() => {}` | Already correct | item 4b/4c tests |
| — | Public OptionList Escape propagation | stopped propagation | propagates (no `onEscape`) | Intended change (allowed) | leave as-is; item 4d guards focus rules |

## Verification evidence (first iteration)

All commands run from the repo root. Long output saved under `/tmp`.

- `npx gulp quick-build` — EXIT 0 (`/tmp/qb2.log`). Required before unit tests (they import `lib/components`).
- `npx tsc -p tsconfig.json --noEmit` — EXIT 0, 0 `error TS` (`/tmp/tsc.log`).
- `npx eslint <all changed files>` — EXIT 0, clean (`/tmp/eslint.log`). Includes the two `no-restricted-imports`
  guarded folders `src/option-list` + `src/internal/components/select-dropdown` (+ `list-container`) — EXIT 0
  (`/tmp/eslint2.log`), so the move of `use-open-state.ts` added no restricted runtime edge.
- Selection pure unit tests `TZ=UTC jest -c jest.unit.config.js src/option-list/selection` — 2 suites, 15 tests,
  all pass (`/tmp/selection.log`).
- Regression tests `jest ...multiselect-embedded.test.tsx select-escape.test.tsx multiselect-escape.test.tsx
  option-list.test.tsx` — 4 suites, 60 tests, all pass (`/tmp/reg.log`).
- Full targeted unit set `jest -c jest.unit.config.js src/select src/multiselect src/option-list
  src/internal/components/select-dropdown src/internal/components/list-container src/internal/components/option
  src/internal/components/selectable-item src/autosuggest src/button-dropdown src/prompt-input src/property-filter
  src/internal/components/chart-filter` — 112 suites, 2624 passed, 1 skipped, 0 failed (`/tmp/unit.log`).
- Test-utils selectors snapshot `jest ...src/__tests__/snapshot-tests/test-utils-selectors.test.tsx` — 1 suite,
  1 test, snapshot passes, no churn (`/tmp/selectors.log`). Moving `use-open-state.ts` (a `.ts`, not `.scss`)
  changed no hashed class names.
- Integration tests (`npm run test:integ`) — NOT run (need a dev server + ChromeDriver). Escape-close and
  real-focus are additionally covered at unit level by the new tests; integ is the only outstanding guard.

Known pre-existing failures at HEAD (not re-run, out of scope): documenter snapshot, option-list functional-tests,
prefer-live-region eslint test, ESM theming/flashbar suites.

## Decisions and assumptions

- **Decision: do not restructure the workflow.** The work is one small, tightly-coupled, behaviour-neutral parity
  pass (one real code fix in item 2, two mechanical cleanups, and tests) over a single shared worktree. It does not
  split into independent features, so the existing implement-and-review loop runs this plan. The loop stop contract
  is preserved: the reviewer writes `/.agents/tasks/listbox-parity-review.json` with `verdict: APPROVED` as the
  loop's last step.
- **Assumption: the three uncommitted edits are the intended state and stay.** Items 1/3 verify rather than rewrite
  them. If a concurrent edit has removed or changed them, item 1 restores the embedded-focus fix exactly as
  specified.
- **Assumption on regression 2 scope:** the task said "unless the single selection model is used only by the public
  OptionList". It is NOT — Select uses it too (`select/internal.tsx:130`). So the fix matches baseline for safety
  and correctness, not merely for OptionList.
- **Baseline reference corrected:** all baseline reads use `git show b9c34f236:` because HEAD has moved past the
  baseline the brief assumed (`eb7bdcc69` is the committed refactor). This is called out at the top so the
  implementer does not read refactored code as "baseline".
- **No `.scss` moves**, so no hashed-class-name churn and no selectors-snapshot update is required by this plan
  (unlike the earlier migration). `use-open-state.ts` is pure TS.
