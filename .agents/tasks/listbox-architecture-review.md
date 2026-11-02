# Review: docs/LISTBOX_ARCHITECTURE.md

Baseline: committed `HEAD` (b9c34f236). The working tree is mid-migration (staged renames to `list-container/`,
`select-dropdown/`), so every "current state" check below uses `git show HEAD:<path>`.

## Summary verdict

The layering works and doesn't need to be revisited. OptionList as the shared engine, a select-dropdown layer, and
reuse through `internal.tsx` all fit the repo, and nothing in the code blocks that direction. Most factual claims
are correct. Three things will fail as written:

- The `InternalOptionList` sample wraps the list in a root `<div>` and puts status in `__footer`. That breaks the
  dropdown's flex scroll layout and changes where status is rendered.
- Migration step 3 does not remove OptionList's dependency on `src/select`, and steps 2 and 3 create a temporary
  import cycle between `src/option-list` and `src/select`.
- `use-open-state` is also used by ButtonDropdown, so it can't move into `select-dropdown`.

## Part 1: factual claims

| Claim | Verdict | Evidence / fix wording |
|---|---|---|
| Files exist as named | TRUE, with one gap | All listed files exist at HEAD. `dropdown-customization.tsx` is in `select/utils/`, not `parts/`. The layout leaves out other moved utils: `use-load-items.ts`, `connect-options.ts`, `check-option-value-field.ts`, `use-announcement.ts`, `scroll-to-index.ts`, `get-item-props.ts`, `select/parts/common.ts` (`fallbackItemHeight`) and `select/parts/styles.scss`. Give each one a destination. |
| `use-highlight-option.ts` exports `useHighlightedOption` | TRUE | It also exports `HighlightType`, which `selectable-item/interfaces.ts:5` imports. |
| `useSelect` uses `useUniqueId('option-list')` | TRUE | `use-select.ts:125` |
| Single vs multi spread across three flags; `useInteractiveGroups` picks the Item | TRUE | `render-options.tsx:69` (`useInteractiveGroups ? MultiselectItem : Item`). Both item parts use `SelectableItem`. |
| OptionList imports from `select/parts` and `select/utils`, plus the workarounds | TRUE | Imports: `option-list/internal.tsx:16-21`. Workarounds: `filteringType: 'none'`, `keepOpen`, `embedded`, dummy `fireLoadItems` and `statusType` (108-113); `isFocused` and `isPointerInside` (117-118); re-highlight on focus (129); duplicated toggle (87); `useInteractiveGroups = isMulti` (54). |
| `DropdownOption` has about 68 references | PARTLY | 67 whole-word matches in 20 `src` files (71 if you count `NestedDropdownOption`), plus 5 in `pages`. Suggested wording: "about 70 references across about 20 files". |
| "dropdown" appears in about 400 files | TRUE (src only) | 409 files under `src`. |
| `UseButtonDropdownApi` and `UseHighlightedMenuApi` exist | TRUE | `use-button-dropdown.ts:29` and `use-highlighted-menu.ts:16`. Both are non-exported interfaces. |
| `getTriggerProps`, `getMenuProps` and `getOptionProps` exist | TRUE | All three are in `use-select.ts`. `getOptionProps` is also in `autosuggest/plain-list.tsx:27`. |
| `internal/components/menu-dropdown` exists | TRUE | |
| "Popup" only appears in ARIA attributes | PARTLY | It also appears in comments (`button/interfaces.ts:187`, `button-dropdown/internal.tsx:184`) but not in identifiers. The naming point still holds. |
| `__` prefix for internal-only props | TRUE | `button/internal.tsx:54-61` (`__iconClass`, `__focusable` and others), `InternalSelectProps.__inFilteringToken`. |
| Embedded Multiselect is "filter, footer", with the filter wired through `getComboboxInputProps` | FALSE | `multiselect/embedded.tsx` renders no filter input. Its only consumer is `property-filter/property-editor.tsx:93`, which passes `filteringText` (filtering happens outside) and `filteringType="manual"`. With `embedded`, `hasFilter` is false (`use-select.ts:81`), so the list itself takes focus (`tabIndex 0`, `options-list/index.tsx:129`) and handles the keyboard. The footer is a `DropdownFooter` sibling after the list. Suggested wording: "list with externally supplied `filteringText` and a status footer; the list owns focus". |
| Test-utils select by class names | TRUE, but incomplete | See the next section. |

### Test-utils stylesheets (HEAD)

- Select: `select/parts/styles` (`placeholder`, `inline-label`), `select/styles`, `button-trigger`, `dropdown-status`, `input`.
- Multiselect: `select/parts/styles` (`inline-label`, `inline-token-list`), `multiselect`, `token`, `token-group`.
- `internal/option.ts`: `select/parts/styles['disabled-reason-tooltip']`. This class lives in `item.tsx`, so it moves with Item.
- `internal/chart-filter.ts`: `select/parts/styles.placeholder`.
- `internal/options-list.ts`: `options-list/styles['options-list']`.
- `internal/dropdown-host.ts`: `selectable-item`, `option`, `dropdown-status`, `dropdown`.
- OptionList: `option-list/test-classes`, `selectable-item`.

The compatibility constraint "parts keep their existing class names" can't be met by moving the `.scss` file. The
scoped name includes a hash of the file path
(`node_modules/@cloudscape-design/theming-build/build/tasks/postcss/generate-scoped-name.js`, `filenameHash`). Any
move of `select/parts/styles.scss` or `options-list/styles.scss` changes the class names. That includes
`awsui_options-list_19gcf` in `src/__tests__/snapshot-tests/__snapshots__/test-utils-selectors.test.tsx.snap:436`.

Suggested wording: "Moved styles get new hashed class names. Test-utils must import the new stylesheet paths, and
the test-utils selectors snapshot must be updated. Alternatively, leave the `.scss` in place and import it from the
new location." Because test-utils ship with the same package version, consumers are not affected.

## Part 2: consumers the doc missed

Non-test runtime importers of the files being moved, at HEAD:

- **Autosuggest**
  - `autosuggest-option.tsx` and `options-controller.ts` import `options-list/utils/test-indexes` and `use-highlight-option`.
  - `internal.tsx` imports `select/utils/check-option-value-field`.
  - `options-list.tsx` imports `select/utils/use-announcement`.
  - `plain-list.tsx` and `virtual-list.tsx` import `internal/components/options-list`.
- **ButtonDropdown**
  - `internal.tsx` imports `options-list`.
  - `utils/use-button-dropdown.ts:5` imports `options-list/utils/use-open-state`. This conflicts with the plan to move `use-open-state` into `select-dropdown`.
- **PromptInput**
  - `components/menu-dropdown.tsx` imports `select/utils/use-announcement`.
  - `core/menu-state.ts` imports `test-indexes` and `use-highlight-option`.
- **Layer 0 importing the list container**
  - `internal/components/option/utils/prepare-options.ts:4` imports `options-list/utils/test-indexes`.
  - `selectable-item/interfaces.ts:5` imports `HighlightType`.

  So "Layer 0 primitives" already depend on `options-list`. That's fine if `list-container` counts as layer 0, which the layer diagram does show.
- **PropertyFilter**: `property-editor.tsx:12` imports `multiselect/embedded`. It's the only embedded consumer.
- **`internal/components/chart-filter/index.tsx:9`** imports `InternalMultiselect`. It's an indirect consumer, and test-utils `chart-filter.ts` uses `select/parts` styles.
- **Dev pages**: `pages/dropdown/list-with-sticky-item.page.tsx` (PlainList, VirtualList), `pages/heroshot/overview.page.tsx` and `pages/options-list/simple.page.tsx` (OptionsList), `pages/select/item.permutations.page.tsx` (Item), `pages/select/trigger.permutations.page.tsx` (Trigger).
- **Tests**: `select/__tests__/*`, `button-dropdown/__tests__/button-dropdown-items.test.tsx`, `prompt-input/__tests__/prompt-input-token-mode.test.tsx`, `multiselect/__tests__/multiselect.test.tsx`.

**Cycle check.** At HEAD nothing in `src/select` or `src/multiselect` imports `src/option-list`, so there is no
cycle today. The parts that move into option-list do import Select and Multiselect types:

- `plain-list.tsx:11-12` imports `MultiselectProps` and `SelectProps` for `renderOption`.
- `render-options.tsx` imports both.
- `item.tsx:18` imports `SelectProps`.
- `use-announcement.ts` imports `SelectProps` (`ContainingOptionAndGroupString`).
- `plain-list.tsx` imports `GetOptionProps` and `MenuProps` from `use-select`.

After the move, `src/option-list` would import `src/select` and `src/multiselect`, which breaks the doc's own rule
and the proposed ESLint lock. These renderer and props types need a neutral home first, for example
`option-list/interfaces.ts` or `internal/components/option/interfaces.ts`.

## Part 3: design issues

### HIGH: root wrapper inside the dropdown breaks the scroll layout (suspicion 2, confirmed)

Today Select's `content` is the `OptionsList` element itself. It is a direct child of `.dropdown-content`, which is
`display: flex; flex-direction: column` (`dropdown/internal.tsx:200-204`, `dropdown/styles.scss:138-141`). The list
scrolls because of `flex: 1 1 auto; min-block-size: 0; overflow-y: auto` (`options-list/styles.scss:19-21`).

The sample wraps it in `<div className={styles.root}>`, and `option-list/styles.scss` sets `.root { display: block }`.
The flex item becomes the wrapper, so the list no longer shrinks, and the header and footer stop pinning around a
scrolling list.

Fix: when `__controller` is set, render without the root, or give the root the same flex properties. Better still,
take the second option in your open question: Select renders `List` from `option-list/parts` directly. The current
wording "must not add a wrapper, or the element must be checked" contradicts the sample, so make it a hard
requirement.

### HIGH: `__footer` merges two status placements (suspicion 3, confirmed)

Status is rendered in two places today:

- **Non-sticky status** (pending, load-more, error during pagination) renders inside the scroll container as
  `<div role="option" class="list-bottom">` through `listBottom` (`select/internal.tsx:311-313`,
  `plain-list.tsx:114`). It has to scroll with the options and sit after the last one for scroll-to-load-more.
- **Sticky status** renders in the Dropdown `footer` slot through `composeDropdownContent`, together with the
  public `renderDropdownFooter` (`select/internal.tsx:236-237`; the same in `multiselect/internal.tsx`).

A single `__footer` after the list but inside the root matches neither placement. Non-sticky status would stop
scrolling with the options. Sticky status would leave the dropdown footer slot, which changes the DOM under
`dropdown/test-classes` `footer`. The live region (`dropdown-footer/index.tsx:20`, `InternalLiveRegion`) and
`aria-describedby={footerId}` keep working only if the id is preserved (not verified).

Fix: replace `__footer` with `__listBottom` (inside the list, non-sticky only), and keep sticky status in the
Dropdown `footer` owned by Layer 2. Embedded Multiselect keeps its sibling `DropdownFooter`.

### HIGH: migration order creates a cycle, and step 3's claim is false (suspicion 9, confirmed)

- **Step 2** puts `useOptionList` in `src/option-list` while `useSelect` stays in `src/select/utils` and wraps
  it. OptionList still calls `useSelect` (`option-list/internal.tsx:21`), giving
  option-list → select → option-list.
- **Step 3** moves the parts, but OptionList still imports `useSelect`, `check-option-value-field`,
  `connect-options` and `use-announcement` (lines 17-21) until step 4. The moved parts also import types from
  `select/interfaces` and `use-select`. So "after this step OptionList no longer imports from `src/select`" is
  false.
- **Steps 3 and 6** change hashed class names and therefore the test-utils selectors snapshot (see Part 1).
  Each step has to update test-utils imports and the snapshot.

Fix: add a step 0 that moves the shared utils, the parts and the renderer/props types into `src/option-list` with
no behaviour change, and updates every consumer listed in Part 2. Then split the hook, then move OptionList onto
`useOptionList` (current step 4) before deleting `useSelect`.

### HIGH: `use-open-state` has a non-select consumer

`button-dropdown/utils/use-button-dropdown.ts:5` uses it. Moving it into `select-dropdown` would make ButtonDropdown
depend on the select layer. Keep it in `list-container/utils` (or a neutral `internal/hooks`) and fix the folder
layout and the "Names kept" list to match.

### MEDIUM: conditional hook (suspicion 1, confirmed)

`rest.__listOptions ?? useMemo(...)` calls `useMemo` only when `__listOptions` is nullish.
`eslint.config.mjs:36` enables `reactHooksPlugin.configs['recommended-latest']`, so `rules-of-hooks` reports it.
Fix: always call `useMemo`, then pick `rest.__listOptions ?? defaultListOptions`.

### MEDIUM: select-all isn't fully modelled (suspicion 4, confirmed)

Today select-all is a synthetic option, `{ type: 'select-all', afterHeader, option: { label } }`, that the caller
prepends (`use-multiselect.tsx:117-124`). Its state and its toggle use different option sets:

- **Checked** uses all options, including filtered-out ones (`isAllSelected`, line 136).
- **Indeterminate** is `!isAllSelected && isSomeSelected` (`use-select.ts` `getOptionProps`).
- **Toggle** works on the visible, filtered, enabled options (`isAllVisibleSelectableSelected` and `toggleAll`,
  lines 134-150). Toggling deselects only the visible options and keeps hidden selections.
- **Group toggle** also intersects with the filtered options (line 169).

`multiSelection(selected, { options })` takes a single option set, so it can't express "state over all, toggle
over visible".

Fix: use the config `{ allOptions, visibleOptions, interactiveGroups, enableSelectAll }`, and state who creates the
select-all `ListOption`. Sticky select-all (`firstOptionSticky`, `multiselect/internal.tsx:250`) is a rendering
concern and should be listed as a `List` prop.

### MEDIUM: list props are under-specified for virtual scroll and rendering (suspicion 5, confirmed)

The list parts need inputs that `getListProps()` and `InternalOptionListProps` don't mention:

- **`open`**: VirtualList switches between `VirtualListOpen` and `VirtualListClosed` on `menuProps.open`
  (`virtual-list.tsx:19`). OptionsList renders children only when `open` (`options-list/index.tsx:136`).
- **`statusType`**: OptionsList fires load-more on open while pending (`options-list/index.tsx:103`).
- **`filteringValue`**: used for match highlighting and as an `estimateSize` dependency.
- **`firstOptionSticky`**: used for sticky select-all.
- **`renderOption`**: the public custom renderer on Select and Multiselect.
- **Item flags**: `hasDropdownStatus` (for `padBottom`) and `screenReaderContent`.
- **The imperative scroll ref**: a `scrollToIndex` that the parent calls on `highlightedIndex` changes and gates
  on `highlightType.moveFocus`.

Fix: list the full `ListProps` and state who owns the scroll-to-highlight effect. It belongs in `List` and
`VirtualList` themselves, not in each caller.

### MEDIUM: focus rules conflict with how Select opens (suspicion 6)

Today, with a filter, focus moves to the filter and it carries `aria-activedescendant` (`getFilterProps`). Without
a filter, focus moves to the list element inside the dropdown (`activeRef = menuRef`, `use-select.ts:84`; effect at
line 356; `tabIndex -1`), and the list handles the keyboard. The trigger never keeps focus while the dropdown is
open. So `getListProps` plus `getComboboxInputProps` covers the cases.

The conflict is the proposed rule "keyboard focus on the list highlights the selected or first option with a
keyboard highlight". A mouse-opened Select focuses the list programmatically, so the list would apply a keyboard
highlight and override the mouse highlight that `useSelect` sets today (`setHighlightedIndexWithMouse`). The
ordering of Layer 2's highlight-on-open against the list's `onFocus` is unspecified.

Fix: Layer 2 sets the highlight before it focuses, and the list's `onFocus` highlights only when nothing is
highlighted (that is today's embedded behaviour, `use-select.ts` `menuProps.onFocus`).

Also, closed-trigger type-ahead in Select selects directly (`highlightOption: !isOpen ? selectOption : ...`,
`select/internal.tsx:164`; listener on the root div at line 288). Multiselect enables it only while open
(`use-multiselect.tsx:222`). That is Layer 2 behaviour that `useOptionList`'s `typeAhead` doesn't cover, so list it
under Layer 2.

### LOW-MEDIUM: `__controller` duplicates sources of truth (suspicion 7)

An ignored internal `useOptionList` is mostly harmless:

- `useUniqueId` is cheap, and only the active controller's ids reach the DOM.
- No listeners attach unless its props are spread.
- Its announcement is empty because it never highlights.
- If it holds effects such as an announcement `requestAnimationFrame`, they run idle (not verified, since the hook
  doesn't exist yet).

The real problem is that Select passes options and selection twice: once to `useOptionList` and again as
`__listOptions` and `__selection`. These can drift.

Fix: have `UseOptionListApi` expose `options` and `selection`, so `InternalOptionList` reads them from the
controller. Or take the open question's second option and avoid `__controller` altogether. That also fixes the
wrapper issue.

### OK: select-dropdown placement in `internal/components` (suspicion 8, refuted)

The repo already has internal components that import component internals:

- `internal/components/chart-filter/index.tsx:9` imports `../../../multiselect/internal`.
- `autosuggest-input/index.tsx:11,20` imports `dropdown/internal` and `input/internal`.
- `dropdown-status/index.tsx:5` imports `link/internal`.

`select-dropdown` importing `src/option-list` follows the same pattern.

### LOW: other notes

- **Embedded Multiselect** needs no select-dropdown and no combobox input, only `InternalOptionList` with
  `multiSelection`, an external `filteringText`, and a sibling status footer. Simplify the table row and the
  section.
- **Moving `use-announcement` into `option-list`** makes Autosuggest and PromptInput import from
  `src/option-list`. That's allowed by the convention, but the doc should list it.

## Things that are fine

- **No separate internal listbox.** It matches the repo convention; `button/internal` is imported in 57 non-test
  files.
- **Selection strategy object.** Replacing `checkboxes`, `isMultiSelect` and `useInteractiveGroups` with
  `selectionType` and `interactiveGroups` is grounded: `render-options.tsx:69` and `get-item-props.ts`
  (`hasCheckbox: checkboxes`).
- **Telemetry.** Select and Multiselect using `InternalOptionList` avoids the `useBaseComponent('OptionList')` call
  in `option-list/index.tsx:15`.
- **Analytics.** Metadata lives in `selectable-item/analytics-metadata`, which doesn't move.
- **Single `Item`.** Both `item.tsx` and `multiselect-item.tsx` already wrap `SelectableItem` and `CheckboxIcon`, so
  merging them is mechanical.
- **Renames.** `PlainList` → `List`, `use-native-search` → `use-type-ahead`, `use-highlight-option` →
  `use-highlighted-option` and `options-list` → `list-container` are reasonable. Budget the class-hash churn when
  doing them.
