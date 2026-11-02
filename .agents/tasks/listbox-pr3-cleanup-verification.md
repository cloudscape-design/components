# OptionList PR (#5180) cleanup — verification (iteration 1)

Worktree `/Users/amanabiy/Documents/components/.worktrees/pr3-option-list`, branch `feat/add-option-list`,
HEAD 5601acf6f on `origin/refactor/add-listbox-selection-models` 228673d20 (already rebased; nothing new to pull).
Nothing committed (per step brief). `npm-lock-churn` stash untouched. `package-lock.json` and
`pages/tsconfig.tsbuildinfo` are not modified (a tsbuildinfo created by `tsc -p pages` was deleted).

## Product bug found (must be its own `fix:` commit)

Home/End in a focused OptionList also ran the browser's native Home/End scroll of the page or scroll container,
which races the highlight scroll. That is the root cause of the CI integ failures (not viewport, not timing in
the test). Probe on `scroll?container=page` (End, read `scrollY` now and after 600 ms; then Home):

| | End now | End +600 ms | Home now | Home +600 ms |
|---|---|---|---|---|
| without fix | 2753 | 2797 | 462 | 0 |
| with fix | 2753 | 2753 | 462 | 462 |

Without the fix the page keeps moving after our scroll (animated native scroll), and Home ends at `scrollY=0`
regardless of where option 1 is. Fix: `use-listbox.ts` list key handler calls `preventDefault()` for Home/End
before the shared `useMenuKeyboard` (unchanged, so Select/Multiselect unaffected). Unit test:
"Home and End move the highlight without the browser scrolling the page". Probe test deleted.

## Proposed commit split (for the commit step)

1. `fix:` Home/End `preventDefault` + WHY comment in `use-listbox.ts` (`listKeyDownHandler`), the unit test above.
2. `feat:` API proposal (section 6): `interfaces.ts`, `internal.tsx` (icon slot, groups, `renderOption`,
   original-object mapping), `test-classes/styles.scss`, test-utils, group/icon/renderOption/disabledReason unit
   tests, groups integ test, page additions (icon slot, groups section, grouped + renderOption permutations),
   `documenter.test.ts.snap` + `test-utils-selectors.test.tsx.snap`.
3. `refactor:`/`chore:` listbox trim (`use-listbox.ts`, `index.tsx`, `parts/list.tsx`, `parts/item.tsx`,
   `parts/styles.scss`).
4. `test:`/`chore:` unit test regrouping, integ split, revert of `scroll-to-index.test.ts`, page deletions and
   scroll-page merge, visual definition deletion.

Several files (`use-listbox.ts`, `option-list.test.tsx`, pages) carry hunks for more than one commit and need
`git add -p`.

## Files

Deleted: `pages/option-list/dialog.page.tsx`, `pages/option-list/in-dropdown.page.tsx`,
`pages/option-list/in-dropdown.scss`, `test/definitions/visual/option-list.ts`.

Created (moved from `option-list.test.ts`): `src/option-list/__integ__/option-list-scroll.test.ts`.

Changed:
- `src/option-list/interfaces.ts` — own `Option` with `icon`, `OptionGroup`, `Options = ReadonlyArray<Option | OptionGroup>`,
  `renderOption?: SelectProps.SelectOptionItemRenderer` (type import), proposal doc texts, `selectedOptions` doc with the uncontrolled sentence.
- `src/option-list/internal.tsx` — converts options (`icon` → `__customIcon`) and maps back to the consumer's objects for
  `onChange` and `renderOption`; `flattenOptions`; `multiSelection(..., { interactiveGroups: true })`; `getParent`;
  leaf-only `data-option-index`, `group-header` test class; duplicate-value warning and value check over leaf options.
- `src/option-list/test-classes/styles.scss` — `.group-header`.
- `src/test-utils/dom/option-list/index.ts` — removed `findOptionsContainer`, `OptionListOptionWrapper.findOption`
  (now private `findOptionContent`); added `findGroupHeaders`, `findGroupHeaderByValue`; doc comments on `is*`.
- `src/internal/components/listbox/use-listbox.ts` — trimmed to what OptionList uses (removed `onSelectOption`,
  `onEscape`, `embedded`/`embeddedBehavior` + mount effect, `typeAhead` flag, `renderHighlightedAriaLive`,
  `highlightOption`, `highlightFirstOption`, `clearHighlight`, `selectHighlightedOption`, `highlightedOption`,
  `announceSelected` from the API, `getComboboxInputProps`/`inputKeyDownHandler`; kept `getParent`, group branches);
  Home/End fix.
- `src/internal/components/listbox/index.tsx` — dropped `listComponent`, `listBottom`, `hasDropdownStatus`,
  `filteringValue`, `firstOptionSticky`, `scrollStrategy`.
- `src/internal/components/listbox/parts/list.tsx` — only the `nearest` scroll strategy, no sticky option / list bottom.
- `src/internal/components/listbox/parts/item.tsx` — removed select-all, `virtualIndex`, `afterHeader`, multi
  disabled-reason fallback.
- `src/internal/components/listbox/parts/styles.scss` — removed `.list-bottom`.
- `src/internal/components/listbox/__tests__/scroll-to-index.test.ts` — reverted to base content.
- `src/option-list/__tests__/option-list.test.tsx` — regrouped (rendering, selection, disabled, keyboard, focus and
  highlight, option groups, renderOption, top-level); `warnOnce` mock; listbox by `[role="listbox"]`; Escape
  propagation; pointer focus no highlight; disabled-reason tooltip; Home/End preventDefault; one a11y `test.each`.
- `src/option-list/__integ__/option-list.test.ts` — simple page only; added group header click test.
- `pages/option-list/simple.page.tsx` — `single`, `multi`, `groups`; icon slot on one option.
- `pages/option-list/permutations.page.tsx` — bare `<h1>` + `ScreenshotArea disableAnimations` + `PermutationsView`;
  icon slot; grouped options; one `renderOption` permutation.
- `pages/option-list/scroll.page.tsx` / `scroll.scss` — `container` = wrapper|root|page|dropdown, `expandToViewport`,
  `selectionType`, `preselected` = none|near-end; 100 options; minimal Button + Dropdown + OptionList for `dropdown`.
- Snapshots: `documenter.test.ts.snap`, `test-utils-selectors.test.tsx.snap` (reviewed: diff is exactly the section 6
  API: new types/`renderOption`/doc texts, `findGroupHeaders`/`findGroupHeaderByValue` added,
  `findOptionsContainer`/`findOption` removed, `group-header` selector). `test-utils-wrappers` snapshot unchanged.

Left as is:
- `parts/render-options.tsx`, `parts/option-group.tsx`, `parts/scroll-to-index.ts` default export, `parts/common.ts`:
  still used by Select/Multiselect.
- `use-type-ahead.ts` (+ its test), `options-list` and `selectable-item` changes: used by OptionList.
- `eslint.config.mjs`: file list still accurate (`item.tsx` keeps type-only select imports; rule unchanged).
- `useInternalI18n('select')` namespace in `internal.tsx` (behaviour; flagged in the plan for a decision before release).
- `item.tsx` line 194 (tooltip `onEscape`) uncovered; covering it needs an Escape on the tooltip, not added (no filler).

## Commands and results

| Check | Command | Result |
|---|---|---|
| eslint | `npx eslint <changed .ts/.tsx/.mjs> src/option-list/__integ__/option-list-scroll.test.ts eslint.config.mjs` | clean |
| prettier | `npx prettier --check <changed files>` | clean |
| stylelint | `npm run lint:stylelint` | clean |
| quick-build | `npm run quick-build` | pass |
| full build | `npm run build` | pass (exit 0) |
| snapshots | `TZ=UTC npx jest -u -c jest.unit.config.js src/__tests__/snapshot-tests --maxWorkers=1` | 4 updated (expected, above), 112 tests pass |
| unit | `TZ=UTC node_modules/.bin/jest -c jest.unit.config.js src/option-list src/internal/components/listbox src/select src/multiselect src/autosuggest src/button-dropdown` | 72 suites, 1237 passed, 1 skipped (pre-existing) |
| unit `src/__tests__` | `TZ=UTC node_modules/.bin/jest -c jest.unit.config.js src/__tests__ --maxWorkers=1` | 16 suites, 2086 passed, 110 snapshots pass |
| integ | `npm run start:integ` + `NODE_OPTIONS=--experimental-vm-modules node_modules/.bin/jest -c jest.integ.config.js src/option-list/__integ__/` | 12/12 pass, 3 runs in a row, no retries |
| integ under load | same with `--maxWorkers=1` while `src/select/__integ__` ran in parallel | 12/12 pass, no retries |
| pages / visual | temp integ probe loading `option-list/permutations`, `simple`, `scroll?container=dropdown`, `scroll?container=root`, waiting for `.screenshot-area` | all render `.screenshot-area` (permutations: 52 listboxes); probe deleted |

Window size: CI uses the same `jest.integ.config.js` / `ChromeHeadlessIntegration` setup; the scroll tests set
`useBrowser({ width: 1200, height: 800 })` explicitly, the simple-page tests use the default, same as CI.
Local ChromeDriver (152) did not match Chrome 155, so the integ runs used ChromeDriver 155.0.8059.85 from Chrome for
Testing in `/tmp/cd155` via `PATH` (no global change).

Visual test: `test/definitions/visual/option-list.ts` is removed from this PR (baseline from `origin/main` has no
`option-list/permutations` page, which is the cause of "`.screenshot-area` is not visible upon waiting"); re-add it in
a follow-up after merge. The permutations page itself renders `.screenshot-area`. The visual runner was not run.

## Counts

| | before (5601acf6f) | after |
|---|---|---|
| OptionList unit tests | 50 | 53 (~38 of the old ones kept/merged + 15 for groups, `renderOption`, icon slot, tooltip, Home/End, Escape) |
| listbox `__tests__` | 65 | 63 (2 `scrollOptionIntoView` mock tests reverted) |
| OptionList integ tests | 20 | 12 (simple 4 incl. new group test, scroll 3×2, dropdown 2) |

Before counts derived from the base run (8 suites, 115 tests) minus the unchanged listbox suites.

## Coverage (`jest --coverage` scoped to the built files, `src/option-list` + `src/internal/components/listbox` tests)

| File | before stmts / branch / lines | after stmts / branch / lines |
|---|---|---|
| `listbox/parts/item.tsx` | 73.68 / 43.58 / 77.14 (uncovered 96-107, 205) | 97.05 / 89.65 / 96.77 (uncovered 194) |
| `listbox/use-listbox.ts` | 84 / 74.74 / 85.1 (uncovered 146-150, 166-169, 174, 258-264, 332) | 98.43 / 95.58 / 100 |
| `listbox/parts/list.tsx`, `listbox/index.tsx`, `option-list/*` | — | 100 lines |

## PR #5180 description notes to add

- Keyboard: with focus in an OptionList, Home/End move the highlight to the first/last option and scroll only as far as
  needed; the browser no longer also scrolls the page or container. PageUp/PageDown keep native scrolling. OptionList only.
- API vs proposal: own `Option` type with `icon` slot (no icon props), `OptionGroup`, `Options` includes groups,
  `selectedOptions` doc includes the uncontrolled sentence.
- Visual regression definition follows in a separate PR after merge.
