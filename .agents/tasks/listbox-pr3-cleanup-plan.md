# OptionList PR (#5180) cleanup plan

Worktree: `/Users/amanabiy/Documents/components/.worktrees/pr3-option-list` (branch `feat/add-option-list`, base `origin/refactor/add-listbox-selection-models`).
Always use absolute paths / `git -C <worktree>`. Commit locally, never push.

Goal: same structure as sibling components, fewer pages and tests.
Deliberate changes on top of the cleanup:
- Implement the approved API proposal, second revision (section 6): option groups, `icon` slot replacing the icon
  props, `renderOption`, `disabledReason` as ReactNode, test-utils `findGroupHeaders`/`findGroupHeaderByValue`,
  `findOptionsContainer` removed. OptionList is unreleased, so these are not breaking for consumers.
- The OptionList list prevents the browser's native Home/End scrolling, like it already does for ArrowUp/ArrowDown
  (CI fix, section 4). Approved by the user; documented as described in section 4a "What it means".

## 1. Sibling comparison (what "follow the structure" means here)

| Aspect | Siblings | OptionList today | Decision |
|---|---|---|---|
| Unit tests | Small components keep one `<name>.test.tsx` (radio-group 451 lines, tiles 350, token-group 336) plus `analytics-metadata.test.tsx`. Only large components (select, multiselect) split per feature. | One 598-line file | Keep one `src/option-list/__tests__/option-list.test.tsx`, trimmed to ~430 lines, regrouped by feature. No analytics metadata exists for OptionList, so no analytics test. |
| a11y | `toValidateA11y` inside the unit file; page-level a11y runs over every page via `src/__a11y__` | Same, but two a11y tests | Keep one `test.each` a11y test. |
| Integ | One file per page/feature: `segmented-control.test.ts`, `segmented-control-edge-case.test.ts`; select has `virtual-resize.test.ts` etc. Page objects inline unless shared (select/multiselect share `page-objects/`). | One file mixing two pages | Split into `option-list.test.ts` (simple page) and `option-list-scroll.test.ts` (scroll page). Page object stays inline in the scroll file (only user). |
| Pages | `simple.page.tsx` + `permutations.page.tsx` (bare `<h1>` + `ScreenshotArea` + `PermutationsView`, e.g. radio-group, token-group) + integ-specific pages | 5 pages | `simple`, `permutations`, `scroll` only. |
| Visual definitions | Added in a follow-up PR after the pages are on main: control-group pages landed in #5043, `test/definitions/visual/control-group.ts` in #5099; token in #5109. The visual runner compares the PR host with a baseline built from `origin/main`. | Added in this PR | Remove from this PR, add in a follow-up after merge. |
| test-classes | `src/<name>/test-classes/styles.scss` for test-utils-only classes (radio-group) | Same | Keep. |

## 2. File table

| File | Action | Notes |
|---|---|---|
| `src/option-list/index.tsx`, `styles.scss` | keep | |
| `src/option-list/interfaces.ts`, `internal.tsx`, `test-classes/styles.scss` | change | API proposal (section 6). |
| `src/test-utils/dom/option-list/index.ts` | change | Per the API proposal (section 6): remove `findOptionsContainer`/`findOption`, add `findGroupHeaders`/`findGroupHeaderByValue`, doc comments on `is*`. |
| `src/option-list/__tests__/option-list.test.tsx` | change | See sections 3 and 6 (no `findOptionsContainer`). |
| `src/option-list/__integ__/option-list.test.ts` | change | Keep only simple-page tests (section 3). |
| `src/option-list/__integ__/option-list-scroll.test.ts` | create (move) | Scroll tests moved here and fixed (sections 3, 4). |
| `pages/option-list/simple.page.tsx` | change | Keep only the `single` and `multi` sections (used by integ, incl. the Tab test that goes single → multi). Drop `icons`, `disabled`, `uncontrolled` sections and their fixtures (permutations + unit tests cover them). |
| `pages/option-list/permutations.page.tsx` | change | Standard permutations shape: bare `<h1>OptionList permutations</h1>` + `<ScreenshotArea disableAnimations={true}>` + `PermutationsView`, like `pages/radio-group/permutations.page.tsx`. Same permutations. |
| `pages/option-list/scroll.page.tsx` | change | Becomes the single configurable integ page. URL params: `container` = `wrapper` \| `root` \| `page` \| `dropdown`; `expandToViewport` (dropdown only); `selectionType`; `preselected` = `none` \| `near-end`. Fixed 100 options. Drops `optionCount`, `wrapper-max`, preselected `first`/`middle`/`last`/`several`. `container=dropdown` renders a minimal Button trigger + `Dropdown` + `OptionList` (the DIY single select from `in-dropdown.page.tsx`: open/close, focus into list on open, Escape/outside click close and return focus). Settings keep a `SegmentedControl` per param (URL-driven via `AppContext`). |
| `pages/option-list/scroll.scss` | change | Keep only `.fixed-height`; add `.dropdown-content { overflow: auto; }` from `in-dropdown.scss`. |
| `pages/option-list/in-dropdown.page.tsx` | delete | Merged into `scroll.page.tsx?container=dropdown`. The real Select/Multiselect comparison, DIY multiselect with filter, and the long ARIA comment were exploration for the open "OptionList inside Dropdown" API question. Only the minimal DIY select stays, because it backs the 2 dropdown integ tests (the only OptionList-in-Dropdown coverage). |
| `pages/option-list/in-dropdown.scss` | delete | Merged into `scroll.scss`. |
| `pages/option-list/dialog.page.tsx` | delete | No test uses it; exploration page. |
| `test/definitions/visual/option-list.ts` | delete | Re-add in a follow-up PR after merge (section 4b). |
| `src/internal/components/listbox/use-listbox.ts` | change | Trim to what OptionList uses (section 5) + Home/End `preventDefault` in the list key handler (section 4a). |
| `src/internal/components/listbox/index.tsx` | change | Drop props OptionList never passes: `listComponent`, `listBottom`, `hasDropdownStatus`, `filteringValue`, `firstOptionSticky` (section 5). Keep `renderOption`. |
| `src/internal/components/listbox/parts/list.tsx` | change | Drop `firstOptionSticky` / sticky measuring, `listBottom`, `hasDropdownStatus`; keep `renderOption` passthrough; keep both scroll strategies only if `list` is still used, otherwise only `nearest` (section 5). |
| `src/internal/components/listbox/parts/item.tsx` | change | Drop `renderOption`/`toRenderItem`/group/select-all/`parentProps`/`indeterminate`/`afterHeader` paths (section 5). Type imports from select/multiselect stay (allowed by the eslint rule). |
| `src/internal/components/listbox/parts/styles.scss` | change | Drop `.list-bottom` if `listBottom` is removed. |
| `src/internal/components/listbox/parts/render-options.tsx` | keep | `selectionType` switch to `ListboxItem` still needed. |
| `src/internal/components/listbox/parts/scroll-to-index.ts` | keep | `scrollOptionIntoView` is used by OptionList. |
| `src/internal/components/listbox/__tests__/scroll-to-index.test.ts` | change | Revert the two added `scrollOptionIntoView` tests (mock-heavy, `as any`; the behaviour is covered through OptionList unit scroll tests). File returns to its base content. |
| `src/internal/components/listbox/use-type-ahead.ts` + `__tests__/use-type-ahead.test.ts` | keep | Hook test matches the other `listbox/__tests__` hook tests. |
| `src/internal/components/options-list/index.tsx`, `utils/use-keyboard.ts` | keep | Optional `statusType`, `onMouseLeave`, optional `closeDropdown` are used by OptionList. |
| `src/internal/components/selectable-item/*` | keep | `hideTopDivider`. |
| `eslint.config.mjs` | change | Keep the rule; update the file list/comment if `index.tsx`/`item.tsx` no longer import select types (`allowTypeImports` can stay). |
| `build-tools/utils/pluralize.js`, `src/__tests__/required-props-for-components.ts` | keep | |
| `src/__tests__/snapshot-tests/__snapshots__/*` | keep (regenerate if needed) | Regenerate only if test-utils docs change. |

## 3. Tests

### Unit: `src/option-list/__tests__/option-list.test.tsx`

New describe order: `rendering`, `selection` (single, multi, controlled/uncontrolled), `disabled options`, `keyboard`, `focus and highlight`, `scrolling the highlighted option into view`, then top-level `ref`, base props, a11y.

| Current test | Action | Notes |
|---|---|---|
| rendering › labelled, focusable listbox with an option per item | keep | |
| rendering › label and description | keep | |
| rendering › icon by name | merge | With "label tag and tags" → "renders icon, label tag and tags". |
| rendering › label tag and tags | merge | See above. |
| rendering › label as the option title, not the value | delete | Raw `[title]` query on shared `Option` rendering, an implementation detail of the shared Option component. |
| rendering › aria-labelledby and aria-describedby | keep | |
| rendering › empty listbox | keep | |
| rendering › warns about duplicate values | keep, change | Mock `warnOnce` from `@cloudscape-design/component-toolkit/internal` and assert `('OptionList', message)` (tests.instructions.md) instead of spying `console.warn`. |
| rendering › same options array works for Select-style data | delete | Duplicate of "label and description". |
| disabled › marks disabled and ignores clicks (single/multi) | keep | |
| disabled › keyboard reaches disabled, Enter does not select | keep | |
| disabled › selected disabled option stays selected (multi) | keep | |
| disabled › describes with disabled reason | keep | |
| disabled › a11y with disabled options | merge | Into the final a11y `test.each` (render with disabled options there). |
| single › aria-selected and check mark | keep | Move to `selection`. |
| single › click replaces, repeat click keeps selected (onChange on re-select) | keep | |
| single › onChange returns original option objects | keep | |
| single › uses only the first selected option | keep | |
| single › clicking the description selects (whole row) | delete | Covered in a real browser by integ "selects an option with a click anywhere on the row"; the unit version only checks event bubbling. |
| single › hovering highlights, leaving clears | merge | With scroll › "mouse hover highlights without scrolling" → one test in `focus and highlight`: hover highlights, does not scroll, leaving clears. |
| single › no highlight before interaction | keep | Move to `focus and highlight`. |
| single › keyboard focus highlights selected with keyboard style | merge | Into scroll › "focus entry highlights and scrolls to the selected option" (add the `is-keyboard` assertion there; one highlighted option). |
| multi › multiselectable and a checkbox per option | keep, change | Replace weak `findAll('svg').length >= 3` with per-option `aria-selected` assertions. |
| multi › toggles and keeps selection order | keep | |
| keyboard › focus, arrows wrap, Home/End | keep | Also assert Home/End `preventDefault` (fire keydown via `createEvent` and check `defaultPrevented`) for the section 4a fix. |
| keyboard › Enter and Space select | keep | |
| keyboard › Escape does not change the selection | keep, change | Assert Escape is not handled: wrap in a `<div onKeyDown={spy}>` and assert the spy receives the Escape keydown (propagation not stopped), plus no `onChange`. Remove the meaningless `findOptions().toHaveLength(3)`. |
| keyboard › type-ahead highlights | keep | |
| keyboard › blur clears the highlight | keep | |
| scroll › focus entry → first option | keep | |
| scroll › focus entry → selected option | keep | Absorbs the keyboard-style assertion. |
| scroll › first selected in list order, not selection order | keep | |
| scroll › focus from a pointer does not scroll | keep, change | Also assert `findHighlightedOption()` is null (pointer focus adds no highlight). |
| scroll › focus after selecting with the mouse | keep | Covers the pointer flag not leaking. |
| scroll › arrow keys scroll | merge | With "End, Home and wrap-around ArrowUp scroll" → one test "keyboard moves scroll the highlighted option into view". |
| scroll › End, Home, wrap ArrowUp | merge | See above. |
| scroll › type-ahead scrolls | delete | Same mechanism as arrow scrolling (any keyboard highlight change goes through `Listbox`'s effect); type-ahead highlighting is kept in `keyboard`. |
| scroll › mouse hover no scroll | merge | See hover test above. |
| scroll › focusing again after blur | delete | Covered by "blur clears the highlight" + "focus entry → first option". |
| state › controlled, no change without consumer update | keep | |
| state › matches by value | keep | |
| state › ignores unmatched selected options | keep | |
| state › uncontrolled | keep | |
| ref.focus() | keep | |
| announces selected state of highlighted option | keep | Rename to "announces the highlighted option as selected with `i18nStrings.selectedAriaLabel`". |
| hides the top divider of the first option only | keep | Only coverage of `hideTopDivider`; scoped class assertion is allowed (no test-utils for it). |
| passes id, className, data attributes to the root | keep | |
| is accessible (single/multi) | keep | Now renders with a disabled option (absorbs the disabled a11y test). |

Net: 47 tests → ~38. Required coverage retained: single/multi controlled/uncontrolled, onChange on re-select, disabled, arrows/wrap/Home/End/Space/Enter/type-ahead, focus-entry rules (selected, first selected in list order, pointer focus no highlight), scroll into view, hover no scroll, Escape not handled, a11y, test-utils methods (all used), `ref.focus()`.

### Integ

`src/option-list/__integ__/option-list.test.ts` (simple page):

| Test | Action |
|---|---|
| selects with a click anywhere on the row | keep |
| selects with the keyboard: Tab, arrows, Enter | keep |
| toggles several options in multi selection | delete (unit "toggles and keeps selection order" covers it; no real-browser-only behaviour) |
| Tab leaves the list after one stop | keep |

`src/option-list/__integ__/option-list-scroll.test.ts` (scroll page, moved from the old file):

| Test | Action |
|---|---|
| container × selectionType "keeps the highlighted option visible" (4 × 2 = 8 tests, 40 ArrowDowns each, ~25 s each on CI) | change: `container` ∈ `wrapper`, `root`, `page` only, single selection only (selection type does not change scrolling; unit covers multi). `arrowDownCount` 30. Fold the trailing `End` → "Option 100" check into the helper's End step. Replace the `PageDown` step with a deterministic programmatic scroll of the scroll container (`browser.execute` setting `scrollTop`/`window.scrollTo`), then ArrowDown must bring the highlight back. |
| container × "focus entry scrolls to a preselected option near the end" (4) | keep for `wrapper`, `root`, `page` (3) |
| dropdown × expandToViewport × diy-select / diy-multiselect (4) | change: `container=dropdown`, `expandToViewport` ∈ false/true, single only (2). Keeps "focus moves into the list, page does not scroll on open, highlight stays visible". |

Integ count: 20 → 11, and roughly half the CI time.

## 4. CI failures

### 4a. Integ "keeps the highlighted option visible" (React 16 and 18, shard 1/4)

Evidence (CI log, run 40311037184): every keyboard-scrolling test fails, deterministically (jest retries 3 times). Failures are at line 65 (after `Home`, following `End`) or line 68 (after `ArrowUp` wrap, following `Home`). Single ArrowDown steps and `End` pass. Window size is explicit (`useBrowser({ width: 1200, height: 800 })`), so viewport is not the cause. No `scroll-behavior: smooth` in `src/` or `pages/`, and `scrollElementIntoView` uses instant `scrollIntoView({ block: 'nearest' })`.

Root-cause hypothesis: `useMenuKeyboard` calls `preventDefault` for ArrowUp/ArrowDown but not Home/End. In Select the focused element is the trigger or the filter input, where Home/End move the caret, so this never mattered. In OptionList the focused element is the listbox inside a scroll container, so after our handler scrolls the highlighted option into view, Chrome runs its native Home/End default action: an animated (smooth) keyboard scroll of the nearest scroll container/page. On the loaded CI runner (3 jest workers per CPU, each key ~0.5 s) the animation is still running when the next assertion or the next instant scroll happens:
- `Home` after `End`: End's native animation toward the bottom is still running and pulls the list away from option 1.
- `ArrowUp` wrap after `Home`: our instant scroll to option 100 is overtaken by Home's still-running animation toward the top.
Locally the animation finishes between steps, so tests pass. This is a real product bug, not only a test issue: a keyboard user pressing Home/End gets the list scrolled twice (and the page scrolled for `container=page`).

Fix (root cause, no sleeps):
1. In `use-listbox.ts`, wrap only the list key handler (`listKeyDownHandler`, not `inputKeyDownHandler`, which must keep caret movement for a future filter input) so Home and End call `event.preventDefault()` before delegating. Shared `useMenuKeyboard` stays unchanged, so Select/Multiselect are untouched.
2. Unit test asserting Home/End keydown is `defaultPrevented` (section 3).
3. Replace the test's `PageDown` step (native, animated, same race) with a programmatic instant scroll, as in section 3.

What it means (document this):
- For users: with focus in an OptionList, Home and End move the highlight to the first or last option and scroll only
  as far as needed to show it (`scrollIntoView({ block: 'nearest' })`). The browser no longer also scrolls the page or
  the surrounding scroll container to its top or bottom. PageUp/PageDown keep native scrolling and do not move the
  highlight. This matches the ARIA listbox pattern and how ArrowUp/ArrowDown already behave. Select and Multiselect
  are unchanged (their focus sits in a trigger or filter input, where Home/End move the caret).
- Where it is documented:
  1. Code comment on the Home/End `preventDefault` wrapper in `use-listbox.ts` (the WHY: native Home/End scrolls the
     container and races the highlight scroll; inputs are excluded because Home/End move the caret there).
  2. Unit test titled by the behaviour: "Home and End move the highlight without the browser scrolling the page".
  3. PR #5180 description: a "Keyboard" note stating the behaviour above, and that it is OptionList-only.
  4. The component's keyboard interaction list for the website docs (handed to the documentation phase; no API doc
     comment change, since it is not a prop).

Diagnostic for the implementer before the fix (then remove): a temporary integ probe on `scroll?container=page` that presses `End` on the focused list and reads `window.scrollY` immediately and after 500 ms; different values confirm native animated scrolling. If the probe shows no animation, stop and report: the next suspect is React 16's passive effect (`Listbox`'s `useEffect` scroll) running after `browser.execute`; the fix would then be `useLayoutEffect` in `Listbox` for the scroll call.

### 4b. Visual "OptionList › permutations": `.screenshot-area is not visible upon waiting`

Root cause: `test/definitions/utils.ts` loads every page on the PR host and on the baseline host built from `origin/main`. `option-list/permutations` does not exist on main, so `waitForVisible('.screenshot-area')` fails on the baseline. The PR page itself renders a `.screenshot-area` (via `SimplePage screenshotArea`).
Fix: delete `test/definitions/visual/option-list.ts` from this PR and add it in a follow-up after merge (control-group precedent: #5043 then #5099). Still convert the permutations page to the standard shape so the follow-up just adds the definition.

## 5. Coverage (Codecov patch 83%; gaps `parts/item.tsx` 62% / 25 lines, `use-listbox.ts` 17 lines)

With groups added (section 6), the group branches become reachable and are covered by the new group tests. They are no longer in the removal list below.

`renderOption` is also exposed now (section 6), so `toRenderItem`, `toSingleGroupItem`, `toMultiGroupItem` and `parentProps` become reachable and stay. The remaining uncovered lines are not reachable from OptionList: it has no select-all, no dropdown mode and no filter input. They exist only for the planned Select/Multiselect migration. Behaviour tests through OptionList cannot reach them and filler tests are against the repo rules, so remove them from this PR; the migration PRs add each piece back with the Select/Multiselect tests that exercise it.

Remove (dead in this PR):
- `use-listbox.ts`: `onSelectOption`, `onEscape`/`closeDropdown`, `embedded` (always true) and the non-embedded branches, `embeddedBehavior` + `'embedded-multiselect'` + the mount-highlight effect, `typeAhead` flag (always on), `getParent`, `renderHighlightedAriaLive` (and the `SelectProps` type import), `highlightOption`, `highlightFirstOption`, `clearHighlight`, `selectHighlightedOption`, `getComboboxInputProps` + `inputKeyDownHandler`. KEEP `getParent` (OptionList passes it for group announcements), the child-of-group branch in `goUp`, and the group branches in `getOptionProps`/`isSelectedAt`/`announceSelected`. Keep `selection`, `listId`, `listRef`, `highlightedIndex`, `highlightType`, `announcement`, `selectOption`, `getListProps`, `getOptionProps`, `onTypeAhead` (check `highlightedOption`/`announceSelected` for external use before removing from the API).
- `parts/item.tsx`: `isSelectAll` and the `select-all` branch in `toRenderItem`, `afterHeader`, `virtualIndex`; multi `disabledReason` fallback to the list option (select-all only). KEEP `renderOption`, `toRenderItem`, group converters, `parentProps`, `isParent`/`isChild`, `indeterminate`.
- `index.tsx` / `parts/list.tsx`: props listed in section 2 except `renderOption` (now used), sticky first option and `listBottom`; `scrollStrategy` if only `nearest` remains (then OptionList stops passing it).
Keep `use-type-ahead.ts` `interactiveGroups` param only if its existing hook test covers it; otherwise leave the hook as-is (it has its own test).

Remaining reachable lines: covered by the kept unit tests (disabled reason tooltip on highlight + Escape on the tooltip is the one reachable gap in `item.tsx`; add a behaviour test "shows the disabled reason tooltip when a disabled option is highlighted with the keyboard" using `wrapper.findOptionByValue(...)` and the tooltip test-utils, not raw classes).

Decision (user, approved): remove this code. Select/Multiselect do not use the shared engine in this PR, so removal does not affect them. Each migration PR re-adds the piece it needs with the tests that exercise it. Do not touch `selection/multi-selection.ts` (select-all logic there is from #5179 and used by Multiselect).

## 6. Implement the approved API proposal (second revision)

Source: "API Proposal: New option List component" (second revision), pasted by the user. Gap analysis against the current branch:

| Proposal item | Current branch | Work |
|---|---|---|
| Option groups, one level | Not supported ("Option groups are not supported") | Add (below). |
| `Ref.focus()` | Implemented (`useForwardFocus`), unit test exists | None. |
| `icon` slot replaces `iconName`/`iconUrl`/`iconSvg`/`iconAlt`/`iconAriaLabel` | `Option = OptionDefinition`, icon props documented | Add own `Option` type with `icon`; map to the internal `Option` `__customIcon` (`src/internal/components/option/interfaces.ts`). |
| `disabledReason: ReactNode` | `OptionDefinition.disabledReason` is already `ReactNode`; doc says `string` | Doc fix only. Unit test with a ReactNode reason. |
| `renderOption?: SelectProps.SelectOptionItemRenderer` | Not exposed; engine supports it in `parts/item.tsx` | Add prop, pass through `Listbox`. |
| Remove `findOptionsContainer` test util | Present, used by unit + integ tests | Remove; tests target the listbox by role (see below). |
| `findGroupHeaders()`, `findGroupHeaderByValue(value)` returning `OptionListOptionWrapper` | Missing | Add. |
| `findOptions`/`findOptionByIndex`/`findSelectedOptions` exclude group headers | n/a | Leaf-only `testClasses.option`; headers get `testClasses['group-header']`. |
| `OptionListOptionWrapper`: `findLabel`, `findDescription`, `findLabelTag`, `findTags`, `isSelected`, `isHighlighted`, `isDisabled` | Has these plus `findOption()` | Remove `findOption()` (not in proposal). Add doc comments to the `is*` methods. |
| Doc text for `ariaLabel`/`ariaLabelledby`, `selectedOptions` | Longer texts | Use the proposal text verbatim. |

Proposal corrections (approved by the user; implement these, and the author updates the proposal doc to match):
- Types: `Option` is OptionList's own interface with an `icon` slot (no `iconName`/`iconUrl`/`iconSvg`/`iconAlt`/`iconAriaLabel`), `OptionGroup extends Option` with `options`, and `Options = ReadonlyArray<Option | OptionGroup>`. The proposal's `Option = OptionDefinition` / `Options = ReadonlyArray<Option>` is superseded.
- `selectedOptions` doc: proposal text plus the uncontrolled sentence, i.e.
  "The selected options. Options are matched by `value`. In single selection, only the first option of the array is used.
  If you don't provide this property, the component manages its selection internally."
  Uncontrolled behaviour and its unit test stay.

### Types (`src/option-list/interfaces.ts`)

```ts
export namespace OptionListProps {
  export type SelectionType = 'single' | 'multi';
  export interface Option {
    value?: string;
    label?: string;
    lang?: string;
    description?: string;
    disabled?: boolean;
    disabledReason?: React.ReactNode;
    labelTag?: string;
    tags?: ReadonlyArray<string>;
    icon?: React.ReactNode;
  }
  export interface OptionGroup extends Option {
    options: ReadonlyArray<Option>;
  }
  export type Options = ReadonlyArray<Option | OptionGroup>;
  export interface ChangeDetail { selectedOptions: ReadonlyArray<Option>; }
  export interface I18nStrings { selectedAriaLabel?: string; }
  export interface Ref { focus(): void; }
}
```
Plus `renderOption?: SelectProps.SelectOptionItemRenderer` (type-only import, allowed by the eslint rule) with doc "Specifies a render function to render custom options." `options` doc block copied from the proposal.

Decisions:
- Icon mapping: in `internal.tsx`, convert each public option to an internal `OptionDefinition` with `__customIcon: option.icon` before flattening; keep a `Map` from internal back to the public object so `onChange` returns the consumer's original objects (existing "onChange returns the original option objects" test must keep passing). Rationale: the shared `Option` renderer already supports `__customIcon`, so no engine change.
- `renderOption` item shape: pass the item the engine already builds by `selectionType` (`toRenderItem` in `parts/item.tsx`). For multi, group items carry extra `selected`/`highlighted`/`indeterminate` fields; `MultiselectOptionGroupItem` is a structural superset of `SelectOptionGroupItem`, so it satisfies the declared `SelectOptionItemRenderer` type and gives multi renderers the checkbox state. `item.option` is the consumer's original option (map back as above). No `select-all` or `trigger` items are produced.
- Single selection: Select rules. Headers not highlightable or selectable; arrows skip them (`goUp` child-of-group branch).
- Multi selection: Multiselect rules. `multiSelection(selectedOptions, { options: listOptions, interactiveGroups: true })`. Header checkbox checked when all children selected, `aria-checked="mixed"` when some; choosing it (click, Enter, Space) selects or deselects its enabled children. A disabled group disables its children (`flattenOptions`).
- Announcements: `getParent: option => parentMap.get(option)?.option` so the group label is announced.
- Duplicate-value warning and `checkOptionValueField` run over leaf options.
- `data-option-index` = 1-based leaf index; `data-value` on leaves and headers (headers use the group `value`).

### Test-utils (`src/test-utils/dom/option-list/index.ts`)
- Remove `findOptionsContainer()` and `OptionListOptionWrapper.findOption()` (label/description/tags finders call the internal `OptionWrapper` directly).
- Add `findGroupHeaders(): Array<OptionListOptionWrapper>` and `findGroupHeaderByValue(value: string): OptionListOptionWrapper | null`, static selectors `.${styles['group-header']}` and `[data-value="..."]` with `escapeSelector`.
- `isSelected` on a multi header reports all-children-selected (selectable-item `selected` class), matching Multiselect.
- `src/option-list/test-classes/styles.scss`: add `.group-header`.

### Tests
Replacing `findOptionsContainer` in tests: unit tests fire keys / focus on `wrapper.find('[role="listbox"]')!` (scoped role selector; no public finder exists after the removal, which the tests rule allows). Integ tests assert focus with `page.isFocused(\`${listSelector} [role="listbox"]\`)`; the scroll page object builds selectors the same way. Simple-page integ "Tab leaves the list" keeps the same assertions on the role selector.

New unit tests (`describe('option groups')`, plus additions elsewhere):
- each group renders `role="group"` labelled by its header; `findGroupHeaders()` / `findGroupHeaderByValue()` return headers, `findOptions()` and `findOptionByIndex()` exclude them.
- single: clicking a header does nothing; arrows skip headers; ArrowUp from the first child of the first group wraps to the last option.
- multi: header unchecked / `aria-checked="mixed"` / checked (`isSelected()`) as children are selected.
- multi: click, Enter and Space on a header select its enabled children; again deselects them; a disabled child keeps its state.
- multi: disabled group: header and children `isDisabled()`, clicks ignored.
- `onChange` never contains group objects and returns original option objects.
- the live region announces the group label for a highlighted child.
- `icon` slot renders the given node inside the option; `iconName` etc. are not part of the type (compile-time only, no runtime test).
- `disabledReason` as a ReactNode is shown in the tooltip when the disabled option is keyboard-highlighted (also the item.tsx coverage gap).
- `renderOption`: custom content is rendered for options and headers; receives `{ item: { type: 'item', option, selected, highlighted, disabled, parent } }` with the original option, and `type: 'group'` for headers; multi headers also get `indeterminate`.
- a11y `test.each` adds grouped single and multi cases.
Integ (`option-list.test.ts`): clicking a group header in the simple page `groups` section selects its enabled children.

### Pages
- `simple.page.tsx`: keep `single`, `multi`; add `groups` (multi, two groups, one with a disabled child). Use the `icon` slot (`<Icon name="settings" />`) on one option.
- `permutations.page.tsx`: icon permutation uses `icon: <Icon name="settings" />`; add a grouped option set (single and multi); add one `renderOption` permutation.
- Dialog example from the proposal stays out of the pages (no test uses it; it is the documentation example).

### Snapshots
`documenter.test.ts.snap` and `test-utils-*.snap` change: new `OptionGroup`, `icon`, `renderOption`, removed icon props and `findOptionsContainer`/`findOption`, new group header finders. Review the diff matches the proposal exactly.

## Implementation order

- [ ] 0. API proposal (section 6): interfaces (own `Option` with `icon`, `OptionGroup`, `renderOption`, proposal doc text), internal (icon mapping + original-object map, `flattenOptions`, `interactiveGroups` for multi, `getParent`, header classes/attributes, `renderOption` passthrough), test-classes, test-utils (remove `findOptionsContainer`/`findOption`, add group header finders), update existing tests off `findOptionsContainer`, new group/icon/renderOption/disabledReason tests, pages, snapshots.
      Verify: `npm run quick-build`; `TZ=UTC node_modules/.bin/jest -c jest.unit.config.js src/option-list src/internal/components/listbox src/select src/multiselect` passes; after `npm run build`, `TZ=UTC npx jest -u -c jest.unit.config.js src/__tests__/snapshot-tests` and check the documenter/test-utils diff matches section 6 exactly.

- [ ] 1. Listbox trim (section 5, removal approved) + Home/End `preventDefault` in the list key handler with the WHY comment (section 4a "What it means"); update `eslint.config.mjs` comment/list if needed.
      Files: `src/internal/components/listbox/{use-listbox.ts,index.tsx,parts/list.tsx,parts/item.tsx,parts/styles.scss}`, `src/option-list/internal.tsx`, `eslint.config.mjs`.
      Verify: `npm run quick-build`; `TZ=UTC node_modules/.bin/jest -c jest.unit.config.js src/option-list src/internal/components/listbox src/select src/multiselect` passes; `npx eslint src/option-list src/internal/components/listbox` clean.
- [ ] 2. Unit test cleanup (section 3) incl. new Home/End `preventDefault`, Escape propagation, pointer-focus no-highlight, disabled-reason tooltip tests; revert added `scrollOptionIntoView` tests.
      Files: `src/option-list/__tests__/option-list.test.tsx`, `src/internal/components/listbox/__tests__/scroll-to-index.test.ts`.
      Verify: `TZ=UTC node_modules/.bin/jest -c jest.unit.config.js src/option-list src/internal/components/listbox --coverage --collectCoverageFrom='src/internal/components/listbox/**' --collectCoverageFrom='src/option-list/**'` passes; `item.tsx` and `use-listbox.ts` near 100% lines.
- [ ] 3. Pages: delete `dialog.page.tsx`, `in-dropdown.page.tsx`, `in-dropdown.scss`; merge dropdown into `scroll.page.tsx`/`scroll.scss`; trim `simple.page.tsx`; convert `permutations.page.tsx`. Delete `test/definitions/visual/option-list.ts`. (Pages also get the section 6 additions if step 0 did not already add them.)
      Verify: `npm run quick-build`; `npx eslint pages/option-list`; `npm run lint:stylelint`; open `#/light/option-list/scroll?container=dropdown` etc. in `npm start` and check each container renders.
- [ ] 4. Integ: split into `option-list.test.ts` and `option-list-scroll.test.ts` with the reduced matrix, programmatic scroll instead of PageDown. Run the section 4a diagnostic first (then delete it).
      Verify: with `npm run start:integ` running, `NODE_OPTIONS=--experimental-vm-modules node_modules/.bin/jest -c jest.integ.config.js src/option-list/__integ__/` passes; run it 3 times in a row, and once with `--maxWorkers=1` under CPU load (e.g. alongside another integ run) to approximate CI.
- [ ] 5. Final snapshot regeneration after all changes.
      Verify: `npm run build` then `TZ=UTC npx jest -u -c jest.unit.config.js src/__tests__/snapshot-tests`; diff matches section 6.
- [ ] 6. Full check, and write the PR #5180 description notes: Keyboard (Home/End, section 4a), API changes vs proposal (section 6 corrections), visual definition follow-up (section 4b).
      Verify: `npm run lint`; `npm run test:unit`; `git diff --stat origin/refactor/add-listbox-selection-models...HEAD` shows fewer files/lines; documenter snapshot unchanged for OptionList props (no public API change).

## Verification checklist

- [ ] OptionList API matches the approved proposal (section 6 table); documenter/test-utils snapshot diff reviewed against it.
- [ ] Group behaviour matches Select (single) and Multiselect (multi).
- [ ] Select/Multiselect unit tests unchanged and passing (shared `useMenuKeyboard` untouched).
- [ ] Unit tests: all required behaviours from section 3 still asserted.
- [ ] Integ: `option-list.test.ts` and `option-list-scroll.test.ts` pass locally, repeatedly.
- [ ] No `test/definitions/visual/option-list.ts` in the diff; follow-up noted in the PR description.
- [ ] Pages: only `simple`, `permutations`, `scroll`; every page used by a test.
- [ ] Lint (eslint, stylelint, prettier) clean; no new comments that restate code.
- [ ] Commits local only, not pushed.

## Notes / out of scope

- `internal.tsx` reads i18n from the `select` namespace (`useInternalI18n('select')`), so an I18nProvider's Select `selectedAriaLabel` applies to OptionList. Not changed here (behaviour); flag for a decision before release.
