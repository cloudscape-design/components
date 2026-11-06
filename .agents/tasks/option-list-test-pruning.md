# OptionList unit tests: what to remove, what to merge

Worktree: `.worktrees/pr3-option-list` @ `5bd362948`. Read-only analysis; nothing was changed.

## Summary

- About 6 tests can be removed and 3 more folded into neighbours, taking the suite from 78 to about 69 test cases. 3–4 more pairs could be collapsed into `test.each`, which shortens the code but leaves the case count unchanged.
- No file merges are needed. The current 8 files (plus `common.tsx`) mirror Select and Multiselect: `i18n`, `render-option`, `group-state`, `disabled`, and `*-a11y` with `renderHighlightedAriaLive` all match. Select keeps `renderHighlightedAriaLive` in `select-a11y.test.tsx` too. The one optional merge is `keyboard.test.tsx` into `highlight.test.tsx` (see the merge table). I don't recommend it.
- Coverage shouldn't drop noticeably. Today, the OptionList tests alone cover `lib/components/option-list` at 98.6% of statements and 94.1% of branches, and `listbox/use-listbox` at 98.9% / 95.9%. (I collected coverage from `lib/**/*.js`: the tests import `lib/`, so collecting from `src/` reports 0%.) Every candidate below renders code paths that other tests also exercise. Line coverage should stay the same, and at most one or two branch counts in `single-selection.ts` may change in an OptionList-only run. The listbox unit tests still cover those branches.

## Removal / fold table

| # | File › test | Action | Covered instead by | Confidence |
|---|---|---|---|---|
| R1 | keyboard › `type-ahead highlights the matching option` | Remove | keyboard › `type-ahead after Space selects moves the highlight…` (same `'t'`→`c` assertion after focus); group-state › type-ahead ×3; listbox `use-type-ahead.test.ts` › `should highlight the correct option when a key is pressed` | High |
| R2 | keyboard › `Home and End move the highlight without the browser scrolling the page` | Fold: add the `defaultPrevented` checks for End/Home into the first keyboard test (it already asserts the Home/End highlight) | keyboard › `focus highlights the first option, arrows move with wrap-around, Home and End jump` | High |
| R3 | i18n › `announces the highlighted option as selected with i18nStrings.selectedAriaLabel` | Remove | i18n › `i18nStrings.selectedAriaLabel takes precedence over the provider message` (asserts `Picked` is rendered) | Medium-high |
| R4 | option-list › selection › `single: uses only the first selected option` | Remove | `listbox/selection/__tests__/single-selection.test.ts` › `only the first selected option is kept`. The OptionList-side wiring to `singleSelection` is already covered by the other `single:` tests. | Medium |
| R5 | option-list › rendering › `hides the top divider of the first option only` | Remove (asserts the `hide-top-divider` CSS class, an implementation detail; no Select/Multiselect test does this) | None needed: the code path runs on every render. If you want to keep a visual check, a screenshot test is the place. | Medium |
| R6 | highlight › `does not show a highlight before the user interacts with the list` | Remove | keyboard › `blur clears the highlight…` (asserts no `aria-activedescendant` before focus); highlight › `focus from a pointer adds no highlight` (with `initialSelected: ['special']`) | Medium |
| R7 | group-state › `announces the group of the highlighted option` | Remove | `listbox/__tests__/use-announcement.test.ts` › `…highlighted option in a group` + the 3 group-repeat tests; a11y › `renderHighlightedAriaLive` › `receives … the group`. The i18n tests already cover the default announcement wiring. | Medium |
| R8 | highlight › `repeating a keyboard move that keeps the highlight scrolls it into view again` | Fold into `keyboard moves scroll the highlighted option into view`: key sequence `[down, end, end, home, up]`, expected `['1','special','special','0','special']`, call count 5 | Same test | Medium (keeps the regression assertion) |
| R9 | disabled › `shows the disabled reason tooltip when a disabled option is highlighted with the keyboard` | Fold: the Escape test already asserts that the tooltip appears on keyboard highlight; move its ReactNode `disabledReason` (`<b>Needs a quota</b>`) content check there | disabled › `Escape closes the disabled reason tooltip…` | Medium |
| — | option-list › `onChange returns the original option objects` | Keep (low-confidence duplicate of group-state › `onChange returns the original options and never a group`, but it's the only single-selection identity check and the only one with an `icon`, which the internal conversion touches) | — | Low |
| — | integ › `clicking a group header selects its enabled options` | Keep both. The unit test (group-state › `choosing a group header toggles…`) is broader, and the integ test checks a real click. | — | — |
| — | `__integ__/option-list-scroll.test.ts` vs the highlight scroll unit tests | Keep both. The unit tests check *when* scrolling happens (call/no-call), and the integ tests check real visibility in a wrapper, the page, and a Dropdown. | — | — |

### KEEP-REQUIRED (regression tests from the Copilot review fixes)

- Type-ahead: keyboard › `type-ahead after Space selects…`; group-state › type-ahead › all 3. `single: skips the options of a group whose label matches` mirrors `use-type-ahead.test.ts` › `non-interactive groups…`, but keep it as component wiring.
- `parent.disabled`: render-option › `%s: parent reflects the group state, not the disabled state of the option`.
- `aria-describedby` with custom content: disabled › `describes the disabled option with its disabled reason when renderOption is used (%s)`.
- Scroll on keyboard moves: highlight › `keyboard moves scroll…` (and the R8 fold target), `a keyboard highlight of the hovered option scrolls it into view`.
- Highlight reconcile on options change: the whole `OptionList highlight when options change` describe (4 tests).
- Arrow wrap: group-state › `arrows wrap at the first and last options when the list starts and ends with an empty group`, `arrows still wrap when the list starts with a group that has options`.
- Keyboard focus on the selected option despite hover: highlight › `keyboard focus entry replaces a hover highlight with the selected option` (and its "nothing selected" sibling).
- `renderHighlightedAriaLive`: a11y › both tests.
- No scroll on grouped mount: highlight › `does not scroll when a grouped list mounts without a highlight`.

### `test.each` collapses (less code, same case count)

| # | Tests | How |
|---|---|---|
| C1 | highlight › `keyboard focus entry replaces a hover highlight with the selected option` + `…with the first option when nothing is selected` | `test.each([{ initialSelected: ['special'], expected: 'special' }, { initialSelected: [], expected: '0' }])` |
| C2 | disabled › `describes the disabled option with its disabled reason` + the `renderOption` `test.each` | One `test.each` over `default`, `renderOption single`, `renderOption multi`. Keep the tooltip-null assertion only for the `renderOption` rows. |
| C3 | option-list › `single: marks only the selected option…` + `multi: marks the listbox multiselectable…` | `test.each` over `{selectionType, initialSelected, ariaSelected, labels, multiselectable}` |
| C4 (optional) | option-list › `controlled: matches selected options by value` + `ignores selected options that do not match an option` | One test: `selectedOptions={[{ value: 'missing' }, { value: 'c' }]}` → `['Third']`, then rerender. The low-level matching is already in `connect-options.test.ts`. |

## Merge table (files)

| Candidate | Recommendation | Tradeoff |
|---|---|---|
| `i18n.test.tsx` (41 lines, 2 tests after R3) | Keep separate | Select (85 lines) and Multiselect (87 lines) both keep `i18n.test.tsx`; the size is fine. |
| `option-list-a11y.test.tsx` (59 lines) | Keep separate | Matches `select-a11y.test.tsx`, which also holds the `renderHighlightedAriaLive` tests. |
| `render-option.test.tsx`, `group-state.test.tsx`, `disabled.test.tsx` | Keep separate | Same names as in Select/Multiselect. |
| `keyboard.test.tsx` (108 lines, 5 tests after R1/R2) into `highlight.test.tsx` (252 lines) | Optional, not recommended | Pro: both cover navigation state, and the `scrollIntoView` mock wouldn't hurt the keyboard tests. Con: `highlight.test.tsx` grows to ~330 lines (back toward the "a lot in one file" problem), and `highlight` is already OptionList-specific because it's the only file that mocks `scrollIntoView`. Select keeps its keyboard tests in `select.test.tsx`, so neither layout is a direct parallel. |
| `keyboard.test.tsx` into `option-list.test.tsx` (Select-style) | Not recommended | Matches Select's layout but grows the main file to ~330 lines, which undoes the split the user asked for. |

## Resulting numbers

- Tests: 78 → about 69 (6 removals R1, R3–R7 and 3 folds R2, R8, R9). C1–C4 cut about 40–60 lines without changing the count.
- Files: 8 test files + `common.tsx`, unchanged (7 + `common.tsx` if you take the optional keyboard→highlight merge).
- Coverage: should stay within rounding of the current numbers (`option-list` 98.6/94.1, `use-listbox` 98.9/95.9). Re-check after the edits with:
  `TZ=UTC npx jest -c jest.unit.config.js src/option-list --coverage --collectCoverageFrom='lib/components/option-list/**/*.js' --collectCoverageFrom='lib/components/internal/components/listbox/**/*.js' --coverageReporters=text`
  (Collecting from `src/**` reports 0% because the tests import from `lib/`.)

## Recommendation

Apply R1–R9 and C1–C3 in one commit (for example `test: Prune redundant OptionList unit tests`). Keep the file layout as it is. It already matches Select/Multiselect naming. R4–R7 are medium confidence; drop them if you'd rather keep component-level confirmation of behaviour the listbox tests already pin.
