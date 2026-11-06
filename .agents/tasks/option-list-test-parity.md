# OptionList test parity with Select / Multiselect

Worktree: `/Users/amanabiy/Documents/components/.worktrees/option-list-rebase`, branch `feat/add-option-list` @ `24524f9b9`.

## Answer

No, not all of them. Most of the Select/Multiselect tests whose behavior applies to OptionList have an equivalent in `src/option-list/__tests__` (63 tests) or in the shared engine tests. **14 applicable behaviors have no test.** Two are high priority: `lang` on options, and group header content (description, labelTag, tags, disabledReason). Five are medium and seven are low. Everything else in the Select/Multiselect suites depends on things OptionList doesn't have, such as the trigger, the dropdown, filtering, virtual scroll, status/loading, select-all and tokens.

How I checked: I read `src/option-list/{interfaces.ts,internal.tsx,index.tsx}`, `src/test-utils/dom/option-list/index.ts`, every OptionList unit and integ test, the shared listbox/option/selectable-item code and tests, and listed every `describe`/`test` in the Select and Multiselect `__tests__` and `__integ__` folders. Each gap was confirmed by grepping the OptionList tests (for example, `lang` has 0 hits, the only `aria-checked` assertion is on the group header, and there is no `mouseMove` on a disabled option). I did not write or run any tests.

## API facts that decide applicability

- `OptionListProps.Option` has `value, label, lang, description, disabled, disabledReason, labelTag, tags, icon (ReactNode)`. It has no `iconName`, `iconUrl`, `iconSvg`, `iconAriaLabel` or `filteringTags`, so the Select icon-URL/SVG and filtering-tag tests don't apply.
- `OptionGroup extends Omit<Option, 'value'>`, so group headers accept `description`, `labelTag`, `tags`, `disabledReason` and `icon`.
- `toInternalOptions` (`internal.tsx`) spreads each option into an `OptionDefinition`, so `lang` reaches `internal/components/option/index.tsx:94` (`lang={option.lang}`).
- Selection, highlight, announcements and neighbour styling (`isNextSelected` / `isPreviousSelected`, `use-listbox.ts:235-261`) come from `useListbox`. Select uses `useSelect`, so the `use-select.test.ts` cases are not shared with OptionList, and `useListbox` itself has no direct unit test.
- Items render through `listbox/parts/item.tsx` → `SelectableItem`. `SelectableItem` emits `data-analytics-metadata` (select action, position, value, groupLabel) for enabled non-group items (`selectable-item/index.tsx:136-138`), so OptionList options carry the same item analytics as Select options. OptionList adds no component-level analytics metadata.
- The plain (non-virtual) list never passes `ariaSetsize` (`plain-list.tsx:97`), so `aria-setsize`/`aria-posinset` don't apply.
- Keyboard handling has no PageUp/PageDown, in Select or OptionList.
- Type-ahead (`listbox/use-type-ahead.ts`) uses `filterOptions(..., strict=true)`. That is a prefix match on `value`, `label`, `description`, `labelTag` and `tags`, and it accumulates characters for 500 ms.

## APPLIES & MISSING

| # | Priority | Select/Multiselect source test | OptionList test to add | Target file |
|---|---|---|---|---|
| 1 | high | select.test.tsx `renders lang on options`; multiselect.test.tsx `renders lang on options` | Render `{ value: 'a', lang: 'de' }` and expect `findOptionByValue('a').getElement()` to have `lang="de"`. `lang` is in the documented API and has no test anywhere. | option-list.test.tsx › rendering |
| 2 | high | select.test.tsx `group options can have description, label tag, tags`; multiselect.test.tsx `group options can have description, label tag, tags, disabled reason` | A group with `description`, `labelTag`, `tags`, `disabled` and `disabledReason`: `findGroupHeaderByValue` returns the label, description, labelTag and tags. In multi mode the disabled header gets an `aria-describedby` with the reason, and the tooltip shows when the header is highlighted with the keyboard. | group-state.test.tsx |
| 3 | medium | select group-state.test.tsx `Select group row state` (both tests) | Single mode, child `lambda` selected: `findGroupHeaderByValue('compute').isSelected()` is false, the option is selected, and the rows next to it have no `next-item-selected`/`previous-item-selected` class. Also cover a group with one child. | group-state.test.tsx › single selection |
| 4 | medium | multiselect group-state.test.tsx `announces a fully selected group as selected` | Multi mode, both children of `compute` selected, `selectedAriaLabel="Selected"`: highlight the header with Home and expect the header text/live content to start with "Selected". This covers the group branch at `use-listbox.ts:259-261`. | i18n.test.tsx (or group-state › multi) |
| 5 | medium | select disabled.test.tsx `open tooltip when the item is highlighted` (mouse); select integ disabled-reason `shows disabled reason on hover` | `mouseMove` over the disabled option with a reason shows the tooltip with its content, and moving to an enabled option hides it. Only the keyboard path is tested today. | disabled.test.tsx |
| 6 | medium | select/multiselect render-option.test.tsx `allows selection with custom rendered options`, `reflects highlighted state` | With `renderOption`, clicking a custom option and pressing Enter fire `onChange` with the original option, and a highlighted item receives `highlighted: true`. | render-option.test.tsx |
| 7 | medium | select integ select-native-search `multi character search`, `extended option, searches entire option`, `no match - no selection`; multiselect integ type-ahead cases | Typing `'s','e'` quickly highlights the option whose label starts with "Se". A prefix that matches only a `description` or `tags` value highlights that option. A key with no match leaves the highlight and selection unchanged. The OptionList and shared tests only use single characters. | keyboard.test.tsx |
| 8 | medium (needs a decision) | select/multiselect analytics-metadata.test.tsx `with simple items`, `with groups…` (item part only) | `getGeneratedAnalyticsMetadata(findOptionByValue(...))` gives `{action:'select', detail:{label, position, value}}`, adds `groupLabel` and `"g,i"` position for grouped options, and gives no action for disabled options. Decide first whether OptionList should also emit component-level metadata. | new analytics-metadata.test.tsx |
| 9 | low | select.test.tsx `finds option by value with special characters` | `findOptionByValue('a"b\\c')` and `findGroupHeaderByValue` with special characters return the element. This exercises `escapeSelector` in the OptionList wrapper. | option-list.test.tsx › rendering |
| 10 | low | select/multiselect disabled `has no tooltip without disabledReason`, `has no disabledReason a11y attributes by default` | A disabled option without a reason shows no tooltip when highlighted, and enabled or reasonless options have no `aria-describedby` and no hidden `span`. | disabled.test.tsx |
| 11 | low | multiselect.test.tsx `Option should have aria-checked` | In multi mode, leaf options have `aria-checked` set to true or false to match `aria-selected`. Today only the group header's `aria-checked` is asserted. | option-list.test.tsx › selection (multi) |
| 12 | low | multiselect `allows deselecting options programmatically via empty array`; select `allows deselecting an option programmatically` | Controlled: rerender with `selectedOptions={[]}` and expect `findSelectedOptions()` to be empty. | option-list.test.tsx › selection |
| 13 | low | multiselect group-state `a row next to a fully selected group is styled as having a selected neighbour` | Multi mode, a fully selected group after a top-level option: that option has `next-item-selected` and the first child has `previous-item-selected`. | group-state.test.tsx › multi |
| 14 | low | multiselect.test.tsx `tolerates options with { options: undefined }…` | `{ value: 'x', options: undefined }` renders as an option, not a group header. | group-state.test.tsx |

Related gap outside the test suite: `OptionListOptionWrapper` has no `findDisabledReason()`. Select's option wrapper has one, so OptionList tests use `createWrapper().findTooltip()` instead. That is an API question; no test is missing because of it.

## APPLIES & COVERED

| Select/Multiselect test(s) | Covered by |
|---|---|
| select `selects top-level option`, `selects an option in a group`; events-select integ (Enter/Space/mouse fire change); multiselect `fires change event when user selects/deselects…` | option-list.test › `single: clicking replaces the selection…`, `multi: clicking toggles options…`; keyboard › `Enter and Space select…`; integ option-list `selects an option with a click…`, `selects with the keyboard…` |
| select `correctly identifies disabled options`; disabled `can not select disabled with reason option`; multiselect `group selection allows only the selection of enabled options` | disabled › `marks disabled options and ignores clicks…`, `keyboard can reach a disabled option but Enter does not select it`; group-state › `a disabled group disables its options`, `choosing a group header toggles its enabled options…` |
| select `allows setting a disabled option through API and display it` | disabled › `a selected disabled option stays selected and cannot be deselected in multi mode` |
| disabled `has no tooltip open by default`, `open tooltip when the item is highlighted` (keyboard), `has disabledReason a11y attributes`, `closes tooltip when Esc is pressed…` | disabled › `describes the disabled option with its disabled reason`, `Escape closes the disabled reason tooltip…` |
| render-option `keeps the disabled reason description for screen readers with custom content` | disabled › `describes the disabled option … when renderOption is used (single/multi)` |
| render-option `renders custom option content`, `receives correct item properties for item/group option`, `renders children within groups`, `receives correct parent attribute`, `reflects selected/disabled state`, `parent reflects the disabled state of the group…`, multiselect `reflects partial selection state for parent option` | render-option › all three tests |
| select-a11y `with opened dropdown` (axe), `Option should have aria-selected`; multiselect `renders aria-multiselectable="true"` | option-list-a11y › `is accessible` ×4; option-list › `single: marks only the selected option with aria-selected…`, `multi: marks the listbox multiselectable…` |
| select-a11y `renders screen reader content for highlighted selected option`; select/multiselect i18n `supports providing selectedAriaLabel` | i18n › both tests; shared use-announcement.test |
| select-a11y `renders screen reader content for highlighted option with custom text` | option-list-a11y › renderHighlightedAriaLive ×2 |
| options-list `supports ariaLabelledby` | option-list › `renders a labelled, focusable listbox…`, `passes aria-labelledby and aria-describedby…` |
| multiselect `allows deselecting an option without object equality` | option-list › `controlled: matches selected options by value, not by reference`; shared connect-options.test |
| use-select / single selection "only first selectedOption used" | shared single-selection.test › `only the first selected option is kept` |
| multiselect group tests (select group, deselect group, partial group appends, deselect keeps others); multiselect group-state `Multiselect group checkbox state` | group-state › multi ×3; shared multi-selection.test (`deselecting a group keeps selections outside the group`, `newly chosen options are appended…`, `toggling a group only toggles its enabled children`) |
| select group-state `useSelect group state with single selection` (logic) | shared single-selection.test ×4 |
| select/multiselect native-search (unit) and multiselect integ type-ahead (single key, cycling, groups) | keyboard › `type-ahead after Space selects…`; group-state › type-ahead ×3; highlight › `a keyboard highlight of the hovered option…`; shared use-type-ahead.test |
| use-select / select integ arrow navigation, wrap-around, Home/End, highlighting the selected option on entry, `input aria-activedescendant is same as highlighted option id` | keyboard › `focus highlights the first option, arrows move with wrap-around, Home and End jump`, `blur clears…`; highlight › focus-entry ×7; group-state › wrap tests |
| select integ `Selected item should scroll into view…`, `should not scroll the parent container…` | highlight › scroll tests; integ option-list-scroll ×3 |
| select test-utils `findGroups`, `findGroup` | group-state › `renders each group labelled by its header…` (`findGroupHeaders`, `findGroupHeaderByValue`, `findOptionByIndex`) |
| option label/description/labelTag/tags/icon rendering | option-list › `renders label and description`, `renders icon, label tag and tags`; shared option.test |
| feature metrics/base props | option-list › `passes id, className and data attributes`; generic `src/__tests__` suites via required-props-for-components |

## N/A groups

- **Trigger, placeholder, inline label, autoFocus** (select.test `renders selected option`, `Placeholder Support`, `Inline Label`; trigger.test; multiselect `Trigger should…`, `associate label…`): OptionList has no trigger.
- **Dropdown open/close, keepOpen, expandToViewport, Escape closing, focus return** (select `opens and closes dropdown`, Space/Enter open; multiselect keepOpen; events-select blur; dropdown-customization; select integ open/close; multiselect-embedded): OptionList has no dropdown. Escape-passthrough is covered by keyboard › `Escape is not handled…`.
- **Filtering and filtering results, onLoadItems, recovery, status types, footer live announcements** (filter.test, use-load-items.test, async-select integ, `Dropdown states`, i18n recoveryText/errorIconAriaLabel): these props don't exist on OptionList.
- **Virtual scroll and resize** (virtual-scroll.test, virtual-resize integ, `aria-multiselectable … with virtual scroll`, disabled-reason integ scroll-away): OptionList has no virtualScroll or own scroll container.
- **Select-all** (select-all.test, select-all integ, multiselect group-state select-all, selection-order select-all): not in the API.
- **Tokens, inline tokens, tokenLimit, deselectAriaLabel, dismiss** (multiselect tokens/Token group/inline tokens, i18n deselectAriaLabel): not in the API.
- **Form field, aria-required, control-group, controlId** (control-group tests, `listbox should receive aria-required`, analytics `within a formfield`): not in the API.
- **Component-level analytics (trigger, disabled/readonly component, selected values) and feature metrics** (analytics trigger/readonly/selectedOption parts; *-feature-metrics.test for dropdown customization): no trigger or readOnly, and dropdown customization is not in the API. Item-level analytics is gap #8.
- **disabled/readOnly component, `throws an error when … closed dropdown/invalid index`** (Select test-utils selection helpers): not in the API.
- **Icon by name, URL or SVG, `iconAriaLabel`, `filteringTags`**: not in the OptionList API. `icon` is a ReactNode and is covered.
- **`aria-setsize`/`aria-posinset`, PageUp/PageDown, drag-to-select, mouse-up closing**: not rendered or not implemented for an inline list.
- **useSelect hook internals** (use-select.test getTriggerProps/getFilterProps/aria-haspopup): OptionList uses `useListbox`. The equivalent behavior is covered above.
- **Multiselect `deselecting via undefined`**: in OptionList, `selectedOptions={undefined}` means uncontrolled (`useControllable`), so this Select semantic doesn't carry over.

## Recommendation

Add gaps 1–7 and 9–14 in #5180. They are all small unit tests in the existing OptionList test files, they test behavior #5180 ships (`lang` and group header content are documented in `interfaces.ts`), and none needs new fixtures beyond what `common.tsx` provides. That is about 13 tests, which brings the suite to roughly 76.

Put gap 8 (item analytics) in a follow-up, or hold it until someone decides whether OptionList should also emit component-level analytics metadata (`component.name`/label) like Select. The test's expected output depends on that decision.

The missing `findDisabledReason()` on `OptionListOptionWrapper` can be part of that follow-up if test-utils parity with Select is wanted.
