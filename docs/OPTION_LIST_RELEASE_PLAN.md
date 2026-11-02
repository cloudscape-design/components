# OptionList release plan

How to land OptionList and the shared listbox engine as a sequence of small PRs instead of one large one. See
[LISTBOX_ARCHITECTURE.md](LISTBOX_ARCHITECTURE.md) for the target structure and
[LISTBOX_MIGRATION_PLAN.md](LISTBOX_MIGRATION_PLAN.md) for the A / B / C migration options. This plan reaches option
C in two phases.

## Target end state

Select, Multiselect and OptionList all depend on one internal engine in `src/internal/components/listbox/`. None of
them depends on another.

```
Select ──────┐
Multiselect ─┼──► internal/components/listbox  (hook, rendering, selection models)
OptionList ──┘
```

Autosuggest and PromptInput use only the pure helpers (`useAnnouncement`, `checkOptionValueField`).

Select does not render OptionList directly, because:

- **Focus model.** OptionList owns focus and handles keys on the list. Select keeps focus on the trigger or filter
  input and drives the list through `aria-activedescendant`. Wrapping OptionList would bring back the workarounds
  (faked focus, hidden highlight, re-highlight on open).
- **Dropdown-only features.** Virtual scrolling, filtering, loading status, groups and select-all would leak into
  OptionList's public API.
- **API coupling.** OptionList's public props would become a contract Select depends on, so any OptionList change
  could regress Select.

## Source branches

The finished code (option C plus the OptionList fixes) is on `dev-v3-amanabiy` and `backup-after-done`, both at
`785cc27ce`. `option-list-with-shared-dep` is an earlier, partial approach; don't use it as a source.

| Commit      | Change                                                                                  |
| ----------- | --------------------------------------------------------------------------------------- |
| `5d5b1f7ba` | Keyboard highlight scrolls into view (`scrollStrategy: 'nearest'`, OptionList only)     |
| `88710936f` | Focus entry scrolls to the selected option; mousedown on a focused list no longer leaks |
| `785cc27ce` | Multi focus entry uses list order; configurable `pages/option-list/scroll.page.tsx`     |

### What the branch contains, compared with `origin/main`

Checked with `git diff -M origin/main...dev-v3-amanabiy`: 109 files, +4609 / −1535, 16 commits. The branch started
from `edcc1f62d`; `origin/main` is 20 commits ahead of that (local `main` is behind `origin/main`).

1. **Rename `internal/components/options-list` → `internal/components/list-container`**, mostly unchanged files, with
   `use-highlight-option` → `use-highlighted-option` and `pages/options-list` → `pages/list-container`. Not in the
   stack; see "Optional, on request" below. Later PRs rewrite these paths back to `options-list`.
2. **Moves from `select/parts` and `select/utils` into `internal/components/listbox/`**, but most moved files were also
   edited (59–94% similar). `plain-list` became `list` and `use-native-search` became `use-type-ahead`.
3. **Moves into `internal/components/select-dropdown/`**: `use-select` → `use-select-dropdown`, `use-load-items`,
   `dropdown-customization`. Dropdown-only, so it belongs with the Select PR.
4. **New engine and component**: `listbox/use-listbox`, `listbox/index` (`Listbox`), `listbox/parts/item`,
   `listbox/selection/*`, `src/option-list/`, test-utils, dev pages, visual definitions, snapshots, and
   `selectable-item` divider changes.
5. **Edits outside the plan**: Autosuggest (`options-controller`, `plain-list`, `virtual-list`, `internal`,
   `interfaces`) and PromptInput (`core/menu-state`, `components/menu-dropdown`). Check each one: import-only edits
   go in the PR that causes them; behaviour edits need their own call-out in that PR.
6. **New Select and Multiselect tests**: `select-escape.test.tsx`, `multiselect-escape.test.tsx`, embedded test
   changes. These go with the engine PRs.

## How to build the PR branches

- **Base on `origin/main`**, not local `main`. Fetch first.
- **Stack the branches.** Each branch starts from the previous one, because each PR depends on the last while it is
  in review. Open each PR against the previous branch; after the parent merges, retarget the next PR to `main` and
  rebase it. The repo uses a merge queue, so only a PR targeting `main` can merge.
- **Rebuild, don't cherry-pick.** The branch history interleaves moves, edits and a revert, and `main` has moved.
  - Moves: `git mv` the `origin/main` version of each file and fix imports, so the diff is a pure rename.
  - Logic: bring the final file in with `git checkout backup-after-done -- <path>`, then review the diff against the
    previous branch.
- **Each branch builds and passes its tests on its own** before you start the next one.
- **Keep out:** `pages/tsconfig.tsbuildinfo`, `.agents/`, `.kiro/`, and the `docs/LISTBOX_*` and
  `docs/OPTION_LIST_RELEASE_PLAN.md` planning docs (unless the team wants them in the repo).
- **Branch names**: `listbox/01-…` to `listbox/06-…`, or your team's prefix if required.

## Phase 1: Ship OptionList on the shared engine

Select and Multiselect only get file moves. Their behaviour hook (`useSelect`) stays until phase 2.

### PR 1: Move list rendering and helpers into internal listbox

Branch `listbox/01-move-list-helpers` (`9306cae1c`, on `origin/main`). Title:
`refactor: Move list rendering and helpers into internal listbox`

- Pure `git mv` of the `origin/main` versions into `src/internal/components/listbox/`: `parts/common`,
  `parts/option-group`, `parts/get-item-props`, `parts/render-options`, `parts/scroll-to-index`, `use-announcement`,
  `utils/connect-options`, `utils/check-option-value-field`, and the tests for `connect-options`, `get-item-props`,
  `scroll-to-index` and `use-announcement`. Import updates in Select, Multiselect, Autosuggest and PromptInput. 20
  files, +42 / −42.
- Imports from `internal/components/options-list` keep their current name; there is no rename in this stack.
- **Stays in `src/select`**: `parts/item` and `parts/multiselect-item` (they use `select/parts/styles.scss`; the new
  `listbox/parts/item` arrives in PR 3), `plain-list`, `virtual-list`, `use-native-search`, `use-select`,
  `use-load-items`, `dropdown-customization`.
- **Not here**: the edits these files received later on `backup-after-done`, `plain-list` → `list`, and
  `use-native-search` → `use-type-ahead`.
- Remaining imports from `listbox/` back into `src/select` and `src/multiselect` (list them in the PR description):
  `option-group` uses `select/parts/styles.css`; `render-options` uses `select/parts/item`,
  `select/parts/multiselect-item`, and the `SelectProps` / `MultiselectProps` types; `use-announcement` uses the
  `SelectProps` types. PR 3 removes most of them.
- Verification: Select, Multiselect, Autosuggest and PromptInput unit and integ tests, and visual regression, all
  unchanged.

### Optional, on request: Rename options-list to list-container

Not part of the stack. Do it only if reviewers ask, as its own PR after the stack or on top of whichever PR is open.

- `git mv` of `src/internal/components/options-list` → `list-container` (tests, `__integ__`),
  `use-highlight-option` → `use-highlighted-option`, `pages/options-list` → `pages/list-container`, import updates in
  every caller. No logic changes.
- Changes the test-utils root selector hash (`awsui_options-list_19gcf` → `awsui_options-list_76huo`) and the dev page
  URL; call both out in the PR.
- A version on the old base exists as `listbox/01-list-container-rename` (`de0b6293a`); rebase or redo it when needed.
- Cost of skipping it: files taken from `backup-after-done` import `list-container` paths and the
  `ListContainer` / `ListContainerProps` / `useHighlightedOption` names. Each later PR rewrites those back to
  `options-list` (`OptionsList`, `OptionsListProps`, `use-highlight-option`) when it brings files over.

### PR 2: Shared selection models

Branch `listbox/02-selection-models`. Title: `refactor: Add shared listbox selection models`

- `listbox/selection/interfaces`, `single-selection` and `multi-selection`, with their unit tests, taken from
  `backup-after-done`.
- No callers yet: Select and Multiselect stay on `useSelect`, and OptionList adopts the models in PR 3. Say so in
  the PR description so reviewers judge the models on their own (re-select returns `[option]`, group state, select
  all, disabled and read-only options).
- Verification: the selection unit tests, plus the full unit suite to confirm nothing else changed.

### PR 3: OptionList component

Branch `listbox/03-option-list`. Title: `feat: Add OptionList component`

- Engine pieces with OptionList as the only caller: `use-listbox`, `Listbox`, `List`, `use-type-ahead`, the
  `scrollStrategy` option, and the edits to the moved helpers that OptionList needs (each must leave Select and
  Multiselect behaviour unchanged).
- Uses the selection models from PR 2 for `onChange`.
- `src/option-list/`, `selectable-item` divider changes, test-utils (`src/test-utils/dom/option-list`), dev pages
  (`pages/option-list/`), visual definitions, documenter and test-utils snapshots, and the three fixes listed above.
- This is the public API change. Settle the "API decisions before release" items and finish API review before
  opening it for merge.

## Phase 2: Move Select and Multiselect onto the engine

### PR 4: Select

Branch `listbox/04-select-engine`. Title: `refactor: Use shared listbox engine in Select`

- Moves `use-select` → `select-dropdown/use-select-dropdown`, `use-load-items`, `dropdown-customization` into
  `internal/components/select-dropdown/`.
- Select switches from `useSelect` to the shared engine and selection models. It keeps its own `VirtualList`.
- Adds `select-escape.test.tsx`.
- Highest risk (focus and keyboard). Gate on integ tests and `global-scroll-padding.page.tsx` (#3798).

### PR 5: Multiselect

Branch `listbox/05-multiselect-engine`. Title: `refactor: Use shared listbox engine in Multiselect`

- Standard and embedded Multiselect on the engine, plus the parity fixes from `01c2810a7` (embedded focus,
  empty-value group state). Deletes `src/select/parts/multiselect-item.tsx`. Adds `multiselect-escape.test.tsx`.
- PR 4 and PR 5 can be one PR if reviewers prefer a single engine swap, at the cost of a larger revert.

### PR 6: Cleanup

Branch `listbox/06-cleanup`. Title: `chore: Remove unused select list utilities`

- Deletes `select/parts/plain-list`, `select/utils/use-native-search`, `select/utils/use-select` and anything else in
  `src/select` without callers.
- After this PR, `git diff origin/main backup-after-done` (minus planning files) should match the stack. Any
  remaining difference is either missed work or something deliberately dropped; list it in the PR.

## Trade-offs

- **Engine designed for one caller first.** PR 3 ships `useListbox` with only OptionList using it. The full branch
  already runs Select and Multiselect on it, so it should fit, but PR 4 or 5 may still need small engine changes.
- **Alternative order.** Moving PR 3 after PR 5 proves the engine on Select before it backs a public component. The
  cost is that OptionList waits behind the two riskiest PRs.
- **Rebase cost.** `origin/main` keeps moving. The Select and Multiselect files in phase 2 are the most likely to
  conflict, so keep phase 1 short.

## Decision: OptionList inside Dropdown

Customers can compose a basic select or multiselect from the public `Dropdown`, `Button` and `OptionList`. The test
page `pages/option-list/in-dropdown.page.tsx` shows both next to the real Select and Multiselect. Decide before API
review whether this is a supported pattern or not recommended.

### Tier 1: fix before release (helps inline use too)

- **Listbox id.** `id` lands on the root `<div>`; the `role="listbox"` element gets a generated id, so a trigger's
  `aria-controls` points at the wrong element. Forward `id` to the listbox, or expose it through the ref.
- **Selection event on re-select (verified, works).** Choosing the already selected option fires `onChange`, because
  `singleSelection.getNextSelection` always returns `[option]`, so the test page can close on it. This is a contract
  dropdown builds rely on: lock it in with a unit test and mention it in the `onChange` API docs.
- **Keyboard highlight scrolls into view (fixed, `5d5b1f7ba`).** `listbox/parts/scroll-to-index.ts` only scrolled the
  `role="listbox"` element, which is never OptionList's scroll container. Select used `scrollElementIntoView` until
  `61712b8d0` (#3798) switched to manual scrolling because opening a Select scrolled the page. OptionList now uses
  `scrollElementIntoView` for keyboard highlights only (`highlightType.moveFocus`, same rule as Autosuggest); Select
  keeps its manual scroll. Integ tests written, not yet run. Re-check
  `pages/app-layout/global-scroll-padding.page.tsx` for Select.
- **Focus entry scrolls to the selected option (fixed, `88710936f`, `785cc27ce`).** Keyboard or programmatic focus
  (`ref.focus()`) highlights the selected option and scrolls it into view; in multi, the first selected in list order,
  as the ARIA listbox pattern describes. Focus from a click adds no highlight. A mousedown on an already focused list
  no longer leaves the pointer flag set, which had broken reopening a dropdown with the mouse. Select and Multiselect
  keep their own open-time rule (`use-select-dropdown.ts`, selection order).

### Tier 2: external control (the real decision)

The list only works while it has focus: the key handler is on the root and focus goes to the list. A filter input in
the `Dropdown` header cannot move the highlight or select. Supporting it needs an API such as `ref.handleKeyDown(event)`
plus the highlighted option id for `aria-activedescendant`. This is what makes a combobox possible, and it puts Select's
focus model into OptionList's public API.

### Tier 3: parity with Select and Multiselect

| Missing in OptionList            | Select / Multiselect has                                       |
| -------------------------------- | -------------------------------------------------------------- |
| Option groups                    | `OptionGroup`, group select in Multiselect                     |
| Virtual scrolling                | `virtualScroll` via `VirtualList`                              |
| Empty, loading, error, load more | `empty`, `statusType`, `onLoadItems`                           |
| Filter match highlighting        | `filteringText` highlighting                                   |
| Select all                       | `enableSelectAll`                                              |
| Form props                       | `invalid`, `readOnly`, `disabled`, `controlId`, `ariaRequired` |

### Recommendation

- Ship tier 1 with PR 3.
- Hold tier 2 until a concrete customer need. The shared engine already supports it, so it can be added later without
  a breaking change.
- Do not pursue tier 3. Tiers 2 and 3 together rebuild Select on OptionList; document "use Select or Multiselect for
  dropdowns" instead.
- Before deciding, run the test page with VoiceOver next to the real Select and Multiselect, and record the
  differences here.

## API decisions before release

These are breaking to change after release, so settle them in API review.

- **i18n namespace.** `option-list/internal.tsx` calls `useInternalI18n('select')`, so `selectedAriaLabel` comes from
  Select's messages and customer `I18nProvider` messages for `option-list` do not apply. Decide whether OptionList gets
  its own `option-list` namespace.
- **FormField integration.** Select and Multiselect are covered by
  `src/__tests__/functional-tests/form-field-controls-integration.test.tsx`; OptionList is not. Decide whether it
  takes label, description and `controlId` from `FormField`. If yes, add it to that test.
- **Listbox id.** See tier 1.
- **Docs.** `onChange` fires on every pick, including re-select. Option groups are not supported. Guidance on when to
  use OptionList instead of Select or Multiselect.

## Test plan

### Shared repo suites

- [ ] Full unit suite passes, including `src/__tests__/functional-tests` (`base-props-support`, `ssr`,
      `public-exports`, `naming-convention`, `use-base-component`, `use-telemetry-usage`, `test-utils`).
- [ ] Shared tests render OptionList with valid values for its required props (`options`, `selectionType`); check
      `src/__tests__/required-props-for-components.ts`.
- [ ] Documenter, test-utils wrappers and selectors snapshots reviewed as API (existing failures from `b9c34f236`).
- [ ] Test-utils `findOptionList` methods complete, named like Select's, working for DOM and selector wrappers.
- [ ] React 18 build (`build:react18`) and bundle-size report.

### Integration and regression

- [ ] OptionList integ suite: scroll page across containers × single / multi, preselected, and in-dropdown tests.
- [ ] Select and Multiselect integ suites, plus `pages/app-layout/global-scroll-padding.page.tsx` (#3798).
- [ ] Autosuggest and PromptInput unit tests (they share listbox helpers).

### Behaviour

- [ ] Controlled and uncontrolled; warning when `selectedOptions` is set without `onChange`.
- [ ] `onChange` detail for single and multi, and on re-select.
- [ ] Keyboard: arrows with wrap-around, Home, End, Space, Enter, type-ahead, Tab in and out, Shift+Tab back.
- [ ] Mouse and touch: hover highlights without scrolling, click selects, disabled option does nothing; tap on a real
      or emulated touch device, then reopen and confirm the selected option is shown.
- [ ] Focus entry: selected option, first selected in list order for multi, otherwise first option; no highlight on
      click focus.
- [ ] Edge cases: empty `options`; duplicate values (warning); selected value not in `options`; selected option that
      is disabled; new `selectedOptions` object identities each render; options changing while focused (filter out the
      highlighted option in the DIY multiselect).
- [ ] Content: long labels, descriptions, tags, icons, `lang`.
- [ ] `ref.focus()` inline, in Dropdown (`expandToViewport` on and off) and in a Modal (`pages/option-list/dialog.page.tsx`).
- [ ] 1000 options on the scroll page: render time and keyboard responsiveness (no virtual scroll).

### Accessibility

- [ ] `toValidateA11y` for single, multi, disabled and empty states, and on the dev pages.
- [ ] ARIA: `role="listbox"`, `aria-multiselectable`, `aria-selected`, `aria-disabled`, `aria-activedescendant`
      following the highlight, label from `ariaLabel` or `ariaLabelledby`.
- [ ] Screen readers: VoiceOver with Safari, NVDA or JAWS with Chrome. Name, option, selected state and position on
      tab-in and while navigating; compare with Select and Multiselect.
- [ ] 400% zoom and reflow, forced colors (highlight and checkboxes visible), RTL, `prefers-reduced-motion`.

### Visual

- [ ] `test/definitions/visual/option-list.ts`: single and multi, selected, disabled, keyboard highlight,
      descriptions and tags, long labels, scrolled long list.
- [ ] Visual Refresh and Classic, light and dark, comfortable and compact; narrow containers.

## Notes

- **Merged means released.** Cloudscape publishes from main, so a merged component folder and documenter snapshot are
  public API. If OptionList needs to land before it is announced, confirm with the team how unreleased components are
  handled. Do not rely on a dev page alone to hide it.
- **Do not commit `pages/tsconfig.tsbuildinfo`.** It is a build artifact currently in the diff.
- **PR titles** follow `type: subject` with no scope. Allowed types: `chore`, `feat`, `fix`, `refactor`, `test`,
  `revert`. Use `chore:` for documentation.

## Checklist

- [x] Finished code committed (`785cc27ce` on `dev-v3-amanabiy` and `backup-after-done`)
- [x] Decided: no list-container rename in the stack (optional, on request); selection models as a separate PR (PR 2)
- [x] PR 1 (helper moves) branch built from `origin/main` (`9306cae1c`)
- [ ] PR 1 merged, Select / Multiselect / Autosuggest / PromptInput tests and visual regression
      unchanged
- [ ] PR 2 (selection models) merged
- [ ] Autosuggest and PromptInput edits on the branch assigned to a PR or dropped
- [x] Keyboard scroll-into-view fixed (`5d5b1f7ba`)
- [x] Focus entry scrolls to the selected option, list order for multi (`88710936f`, `785cc27ce`)
- [ ] Integ tests for the scroll fixes run and green
- [ ] Listbox id forwarded; re-select `onChange` covered by a test
- [ ] API decisions recorded: i18n namespace, FormField integration
- [ ] Test plan complete
- [ ] VoiceOver comparison done and "OptionList inside Dropdown" decision recorded
- [ ] OptionList API review approved
- [ ] PR 3 (OptionList) merged, `tsbuildinfo` excluded
- [ ] PR 4 (Select on engine) merged
- [ ] PR 5 (Multiselect on engine) merged
- [ ] PR 6 (cleanup) merged; remaining diff against `backup-after-done` listed or empty
