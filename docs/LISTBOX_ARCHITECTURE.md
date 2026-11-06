# Listbox architecture

How Select, Multiselect and OptionList are structured around one list engine. See [Current state](#current-state)
for what this replaced and [Naming](#naming) for the reasoning behind the names.

## Goals

- One list engine that works inline and inside a dropdown, without "always open dropdown" emulation.
- Selection behaviour (single, multi, groups, select-all) defined once, as data, not as boolean flags.
- Follow the repo's composition convention: components reuse each other through `internal.tsx`, the way
  `InternalButton` is used across the library. No parallel internal copy of a public component.
- No runtime import cycles: the list engine doesn't depend on the components built on it.

## OptionList is the shared list

OptionList is "an interactive list of options": highlight, keyboard, selection and rendering. That's the same
thing Select and Multiselect show inside their dropdown. So instead of adding a separate internal listbox,
`src/option-list` owns the engine and Select and Multiselect compose it, the same way they already compose
`InternalBox` or `InternalButton`.

- The public `index.tsx` stays a thin wrapper (`useBaseComponent`, analytics). Other components import
  `src/option-list/internal` and its hook, never `index.tsx`, so no OptionList telemetry fires inside Select.
- Features Select needs but OptionList doesn't expose publicly (groups, load-more, a custom list component, external
  control) are `__`-prefixed internal props on `InternalOptionList`, like `__iconClass` on `InternalButton`.
  Exposing any of them publicly later is a separate API decision.

## Layers

```
Layer 3  Select, Multiselect          src/select, src/multiselect
            │
Layer 2  Select dropdown              src/internal/components/select-dropdown
            │   "an option list inside a dropdown": open state, trigger, filter, focus routing, status footer
            │
Layer 1  OptionList                   src/option-list
            │   "an interactive list of options": highlight, keyboard, selection, rendering
            │
Layer 0  Primitives                   src/internal/components/option
                                      src/internal/components/list-container
                                      src/internal/components/selectable-item
```

| Component              | Layer 1 (option list)       | Layer 2 (select dropdown) | Extras                                  |
| ---------------------- | --------------------------- | ------------------------- | --------------------------------------- |
| OptionList             | itself                      | no                        |                                         |
| Select                 | `singleSelection()`         | yes                       | async loading                           |
| Multiselect            | `multiSelection({...})`     | yes                       | token group, async                      |
| Multiselect (embedded) | `multiSelection({...})`     | no                        | external `filteringText`, status footer |
| Autosuggest            | layer 0, `use-announcement` | no                        | combobox input                          |
| PromptInput menus      | layer 0, `use-announcement` | no                        | combobox input                          |
| ButtonDropdown         | layer 0 only                | no                        | `role="menu"`                           |

## Folder layout

```
src/internal/components/
  option/                    # row content (label, description, tags, icon, highlight-match)
    interfaces.ts            # ListOption (was DropdownOption)
    utils/                   # flatten/prepare/filter options

  list-container/            # was options-list
    index.tsx                # ListContainer: <div role=listbox|menu|list>, scroll-to-load-more, data-mouse-target
    utils/
      use-highlighted-option.ts   # was use-highlight-option.ts
      use-keyboard.ts
      use-ids.ts
      use-open-state.ts      # shared with ButtonDropdown, so it stays here
      test-indexes.ts

  select-dropdown/           # dropdown-only behaviour extracted from use-select.ts
    use-select-dropdown.ts
    use-load-items.ts
    trigger.tsx
    filter.tsx
    dropdown-customization.tsx

src/option-list/
  index.tsx                  # public wrapper
  internal.tsx               # InternalOptionList = ControlledOptionList | StandaloneOptionList
  interfaces.ts
  use-option-list.ts         # list engine
  use-type-ahead.ts          # was select/utils/use-native-search.ts
  use-announcement.ts        # also used by Autosuggest and PromptInput
  utils/
    check-option-value-field.ts
    connect-options.ts
  selection/
    interfaces.ts            # SelectionModel
    single-selection.ts
    multi-selection.ts
  parts/                     # moved from select/parts
    list.tsx                 # was plain-list.tsx
    item.tsx                 # merges item.tsx + multiselect-item.tsx
    option-group.tsx
    render-options.tsx
    get-item-props.ts
    scroll-to-index.ts
    common.ts                # fallbackItemHeight
    styles.scss

src/select/                  # InternalOptionList + select-dropdown
  parts/virtual-list.tsx     # VirtualList: only Select and Multiselect virtualize, so it stays here
src/multiselect/             # InternalOptionList + select-dropdown + token group
```

Select-dropdown sits in `internal/components` because it isn't a component on its own and has two consumers.
Importing `src/option-list` from there has precedent: `internal/components/chart-filter` imports
`multiselect/internal` and `dropdown-status` imports `link/internal`.

## Layer 1: OptionList

### Selection model

Selection behaviour is a strategy object. It replaces `useInteractiveGroups`, `checkboxes` and `isMultiSelect`.

```ts
// option-list/selection/interfaces.ts
export interface SelectionModel {
  /** Same values as the public OptionList `selectionType`. Drives aria-multiselectable and the row style. */
  selectionType: 'single' | 'multi';
  /** Whether group headers can be highlighted and toggled. Replaces `useInteractiveGroups`. */
  interactiveGroups: boolean;

  /** Rows are matched to these by `value` inside useOptionList (first option with that value wins). */
  selectedOptions: ReadonlyArray<OptionDefinition>;
  /** For group headers and select-all. */
  getGroupState(option: ListOption): { selected: boolean; indeterminate: boolean };
  /** Returns the selection that results from the user choosing `option`. Pure. */
  getNextSelection(option: ListOption): ReadonlyArray<OptionDefinition>;
}
```

```ts
// option-list/selection/single-selection.ts
export function singleSelection(selectedOptions: ReadonlyArray<OptionDefinition>): SelectionModel;
// Choosing the selected option again keeps it selected.

// option-list/selection/multi-selection.ts
export function multiSelection(
  selectedOptions: ReadonlyArray<OptionDefinition>,
  config: {
    options: ReadonlyArray<ListOption>; // visible (filtered) options
    allOptions?: ReadonlyArray<ListOption>; // every option; defaults to `options`
    interactiveGroups?: boolean;
  }
): SelectionModel;
```

Multi selection rules, unchanged from the previous `useMultiselect`:

- Choosing an option toggles it.
- Choosing a group toggles its visible, enabled children.
- Select-all is a synthetic `{ type: 'select-all' }` option that Multiselect prepends when `enableSelectAll` is
  set. Its checked state is computed over `allOptions`, including filtered-out ones. Toggling it only changes
  visible, enabled options, so hidden selections are kept.

Selection models are pure functions of their inputs, so they can be unit-tested without rendering.

### `useOptionList`

Knows nothing about opening, triggers, filters or loading.

```ts
// option-list/use-option-list.ts
interface UseOptionListProps {
  options: ReadonlyArray<ListOption>; // visible options; filtering is the caller's job
  selection: SelectionModel;
  onChange: (selectedOptions: ReadonlyArray<OptionDefinition>) => void;
  /** Called after an option is chosen. The select dropdown uses this to close. */
  onSelectOption?: (option: ListOption) => void;
  /** true (default) for inline lists: a tab stop with its own focus rules. useSelectDropdown passes false. */
  embedded?: boolean;
  /**
   * Embedded only. Picks which inline focus rules apply, so each caller keeps the behaviour it had before the
   * list engine was shared.
   *
   * - `option-list` (default): the new rules, used only by the public OptionList. See below.
   * - `embedded-multiselect`: embedded Multiselect's previous rules, unchanged.
   */
  embeddedBehavior?: 'option-list' | 'embedded-multiselect';
  /** Undefined means Escape is not handled and propagates. */
  onEscape?: () => void;
  typeAhead?: boolean; // defaults to `embedded`; Select and Multiselect run type-ahead themselves
  getParent?: (option: ListOption) => OptionGroup | undefined; // for group announcements
  renderHighlightedAriaLive?: SelectProps.ContainingOptionAndGroupString;
  i18nStrings?: { selectedAriaLabel?: string };
}

interface UseOptionListApi {
  selection: SelectionModel;
  listId: string;
  listRef: React.RefObject<HTMLDivElement>;
  highlightedOption: ListOption | undefined;
  highlightedIndex: number;
  highlightType: HighlightType;

  highlightOption(option: ListOption, source: HighlightType['type']): void;
  highlightFirstOption(source: HighlightType['type']): void;
  clearHighlight(): void;
  selectOption(option?: ListOption): void; // defaults to the highlighted option

  /** Spread onto the list. Keyboard, mouse, focus/blur and aria-activedescendant. */
  getListProps(): ListProps;
  getOptionProps(option: ListOption, index: number): ItemProps;
  /**
   * Props for an input that keeps focus while it drives the list (combobox pattern), such as the filter.
   * When used, the caller does not spread the keyboard part of getListProps.
   */
  getComboboxInputProps(): { onKeyDown: KeyboardHandler; ariaActiveDescendant: string | undefined };

  announceSelected: boolean;
  announcement: string;
  onTypeAhead(event: React.KeyboardEvent): void; // attach to a container; no-op when typeAhead is off
}
```

Focus rules for inline lists with `embeddedBehavior: 'option-list'` (the default, used only by the public
OptionList):

- Keyboard focus with nothing highlighted highlights the first selected option, or the first option.
- Focus from a pointer doesn't add a keyboard highlight.
- Blur clears the highlight. Mouse movement highlights with a mouse highlight; leaving the list clears it.
- Nothing is highlighted on mount.

Embedded Multiselect passes `embeddedBehavior: 'embedded-multiselect'` and keeps its previous rules instead: on
mount it highlights the selected option (or the first one) with a mouse highlight, and keyboard focus highlights
the first option only when nothing is highlighted, with no pointer skip and no mouse-leave clear.

Inside a dropdown (`embedded: false`) the list's focus handler doesn't highlight. Layer 2 sets the highlight on
open, before it moves focus, so a mouse-opened Select keeps its mouse highlight.

### Rendering parts

`List` (in `option-list/parts`) and `VirtualList` (in `select/parts`) share one props interface, `ListProps`. Besides the spread from `getListProps()`, they take:

| Prop                  | Purpose                                                                                           |
| --------------------- | ------------------------------------------------------------------------------------------------- |
| `open`                | VirtualList switches between open and closed modes; the container renders children only when open |
| `statusType`          | The container fires load-more on open while `pending`                                             |
| `filteringValue`      | Match highlighting, and a size-estimate dependency in VirtualList                                 |
| `firstOptionSticky`   | Sticky select-all                                                                                 |
| `renderOption`        | Public custom renderer on Select and Multiselect                                                  |
| `listBottom`          | Non-sticky status row, rendered inside the scroll container after the last option                 |
| `screenReaderContent` | Announcement text                                                                                 |

Scroll-to-highlight is owned by `InternalOptionList`: it calls the list's imperative `scrollToIndex` ref when
`highlightedIndex` changes, and `List`/`VirtualList` scroll only when `highlightType.moveFocus` is set. Callers
don't run the effect themselves.

`Item` takes `selectionType` (check mark for `single`, checkbox for `multi`) instead of switching between two
components. It builds on `internal/components/selectable-item`.

### `InternalOptionList`

Two render paths, chosen once by whether a controller is passed. Each path calls its hooks unconditionally.

```ts
// option-list/internal.tsx
type InternalOptionListProps = StandaloneOptionListProps | ControlledOptionListProps;

interface ControlledOptionListProps {
  /** Renders ControlledOptionList: no root element, no own useOptionList. */
  __controller: UseOptionListApi;
  /** The options the controller was created with (flattened, filtered, with select-all). */
  __listOptions: ReadonlyArray<ListOption>;
  /** Merged over the controller's list props: aria attributes, statusType, onLoadMore, ariaRequired. */
  __listProps?: Partial<ListElementProps>;
  /** List component to render; defaults to List. Select and Multiselect pass VirtualList when virtualScroll is set. */
  __listComponent?: ListComponentType;
  /** Non-sticky status, rendered as the list's `listBottom` row. */
  __footer?: React.ReactNode;
  __hasDropdownStatus?: boolean;
  __filteringValue?: string;
  __firstOptionSticky?: boolean;
  __renderOption?: ItemProps['renderOption'];
}

const InternalOptionList = React.forwardRef((props, ref) =>
  props.__controller ? <ControlledOptionList {...props} /> : <StandaloneOptionList {...props} ref={ref} />
);
```

- **`StandaloneOptionList`** (the public OptionList) owns state with `useControllable`, builds the selection model
  from `selectionType`, calls `useOptionList({ embedded: true })`, and renders the root
  `<div {...getBaseProps(rest)}>` around `List`.
- **`ControlledOptionList`** renders `List`, or the component passed as `__listComponent`, directly with the caller's controller. It renders no
  root element, so the list stays the direct flex child of `.dropdown-content`, which is what lets it shrink
  and scroll between the dropdown header and footer.

None of the previous workarounds remain: `isFocused`, `isPointerInside`, re-highlighting on focus, dummy
`statusType`/`fireLoadItems`, and the duplicated toggle logic.

## Layer 2: Select dropdown

Takes the list configuration, creates the option list with `useOptionList({ embedded: false })`, and adds
everything a dropdown needs. It creates the list itself because closing on select and on Escape need the
dropdown's open state.

```ts
// select-dropdown/use-select-dropdown.ts
interface UseSelectDropdownProps {
  list: Omit<UseOptionListProps, 'embedded' | 'typeAhead' | 'onSelectOption' | 'onEscape'>;
  closeOnSelect: boolean; // Select: true. Multiselect: !keepOpen
  filtering?: { onChange: (filteringText: string) => void; onDelayedChange?: (filteringText: string) => void };
  statusType: DropdownStatusProps.StatusType;
  dropdownRole?: SelectProps.DropdownRole;
  onOpen?: () => void; // e.g. load items
  onFocus?: NonCancelableEventHandler;
  onBlur?: NonCancelableEventHandler;
  externalRef: React.Ref<any>;
}

interface UseSelectDropdownApi {
  /** The controller, with list props that follow the open state and defer the keyboard to the filter. */
  optionList: UseOptionListApi;
  isOpen: boolean;
  dialogId: string;
  focusActiveElement(): void; // filter if present, otherwise the list
  getTriggerProps(options?: { disabled?: boolean; autoFocus?: boolean }): SelectTriggerProps;
  getDropdownProps(): Pick<InternalDropdownProps, 'onFocus' | 'onBlur' | 'dropdownContentId' | 'ariaRole'>;
  getFilterProps(): Partial<FilterProps>; // wired to optionList.getComboboxInputProps()
  closeDropdown(): void; // closes and returns focus to the trigger
}
```

Responsibilities:

- Open state and toggle/close from trigger events.
- Highlight on open: keyboard open highlights the selected option (or the first) with a keyboard highlight, mouse
  open highlights it with a mouse highlight. With a filter, nothing is highlighted.
- Focus routing: the filter when there is one, otherwise the list element inside the dropdown. The trigger
  doesn't keep focus while open. On close, focus returns to the trigger.
- Closing after a selection, through `onSelectOption`, and on Escape.
- Closed-trigger type-ahead is not here. Select and Multiselect call `useTypeAhead` themselves: Select selects
  directly while closed, Multiselect enables it only while open.
- Status: sticky status goes in the Dropdown `footer` slot, next to the public `renderDropdownFooter`.
  Non-sticky status (pending, load-more, pagination error) goes inside the list as `__footer`.
- `aria-haspopup`, `aria-controls`, dialog role.

## Layer 3: Components

### Select

```tsx
const selection = singleSelection(selectedOption ? [selectedOption] : []);
const { optionList, ...dropdown } = useSelectDropdown({
  list: { options: filteredOptions, selection, onChange: ([option]) => fireChange(option), getParent, ... },
  closeOnSelect: true,
  filtering: filteringType !== 'none' ? { onChange: setFilteringValue, onDelayedChange: fireLoadItems } : undefined,
  onOpen: () => fireLoadItems(''),
  ...
});

<Dropdown {...dropdown.getDropdownProps()} open={dropdown.isOpen}
  trigger={<Trigger {...dropdown.getTriggerProps({ disabled })} />}
  header={filtering && <Filter {...dropdown.getFilterProps()} />}
  footer={stickyStatus}>
  <InternalOptionList
    __controller={optionList}
    __listOptions={filteredOptions}
    __listProps={{ onLoadMore: handleLoadMore, ariaLabelledby, ariaDescribedby, ariaRequired }}
    __listComponent={virtualScroll ? VirtualList : undefined}
    __footer={nonStickyStatus}
    __filteringValue={filteringValue}
    __renderOption={renderOption}
  />
</Dropdown>
```

### Multiselect

Same as Select, with
`multiSelection(selected, { options: filteredOptions, allOptions, interactiveGroups: true })`,
`closeOnSelect: !keepOpen`, select-all prepended when `enableSelectAll` is set, and a token group below the trigger.

### Multiselect (embedded)

Used only by PropertyFilter's property editor. `useOptionList({ embedded: true, embeddedBehavior:
'embedded-multiselect', typeAhead: false })` plus the controlled `InternalOptionList`, with `multiSelection`, `filteringText`
supplied from outside (`filteringType="manual"`), and a sibling `DropdownFooter` for status. There's no filter
input and no select dropdown; the list owns focus. `onEscape` is a no-op so Escape doesn't propagate to the
surrounding popover.

## Composition rules

- Import other components through `internal.tsx` (and their hooks or parts), never through the public
  `index.tsx`. This matches how `InternalButton`, `InternalBox` and others are reused.
- `src/option-list` and `select-dropdown` must not import runtime code from `src/select` or `src/multiselect`.
  Type-only imports (`import type`) are allowed because they're erased from `lib`. Enforced in
  `eslint.config.mjs` with `no-restricted-imports` and `allowTypeImports`.
- Layer 0 must not import from layers above it at runtime.

## OptionList dependencies

What `src/option-list` imports and what imports it, as the code stands. Tests, test-utils and dev pages are left
out unless noted.

### What OptionList depends on

```
src/option-list
 ├─ internal/components/list-container   ListContainer, use-highlighted-option, use-keyboard, use-ids, test-indexes
 ├─ internal/components/option           Option row content, ListOption, filter/unflatten utils, option-announcer
 ├─ internal/components/selectable-item  row shell used by parts/item
 ├─ internal/components/checkbox-icon    multi rows
 ├─ internal/hooks                       use-controllable, forward-focus, use-hidden-description,
 │                                       use-debounce-callback, use-base-component
 ├─ icon/internal, tooltip/internal      check mark, disabled-reason tooltip
 ├─ i18n/context                         selectedAriaLabel (reads the "select" namespace)
 ├─ types/option, types/events, types/base-component
 └─ select/interfaces, multiselect/interfaces   TYPE ONLY (see below)
```

Every runtime edge points down into layer 0 or shared internals. The only edges that point up are type-only:

| File                  | Imports (type only)                          | Why                                             |
| --------------------- | -------------------------------------------- | ----------------------------------------------- |
| `parts/item.tsx`      | `SelectProps`, `MultiselectProps`            | Item shapes passed to the public `renderOption` |
| `use-announcement.ts` | `SelectProps.ContainingOptionAndGroupString` | Public `renderHighlightedAriaLive` signature    |
| `use-option-list.ts`  | `SelectProps.ContainingOptionAndGroupString` | Forwards the same callback                      |

They're erased from `lib`, so there's no runtime cycle, and the lint rule allows them. They still tie the engine's
types to Select's and Multiselect's public interfaces. Moving these shapes to `option-list` and re-exporting them
from the public interfaces would remove the upward edges entirely. That's a type-only change with no runtime effect.

### What depends on OptionList

| Consumer                                    | Imports from `src/option-list`                                                               |
| ------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `src/index.ts`                              | `index.tsx` (public export)                                                                  |
| `select/internal.tsx`                       | `internal`, `selection/single-selection`, `use-type-ahead`, `utils/check-option-value-field` |
| `multiselect/internal.tsx`                  | `internal`, `use-type-ahead`                                                                 |
| `multiselect/use-multiselect.tsx`           | `selection/multi-selection`, `use-option-list` (types), `utils/check-option-value-field`     |
| `multiselect/embedded.tsx`                  | `internal`, `use-option-list`                                                                |
| `internal/components/select-dropdown`       | `use-option-list`, `utils/connect-options`                                                   |
| `autosuggest/options-list.tsx`              | `use-announcement`                                                                           |
| `autosuggest/internal.tsx`                  | `utils/check-option-value-field`                                                             |
| `prompt-input/components/menu-dropdown.tsx` | `use-announcement`                                                                           |
| test-utils (`internal/option`)              | `parts/styles.selectors` (`disabled-reason-tooltip`)                                         |
| dev pages                                   | `parts/list`, `parts/item` (sticky-item and item permutation pages)                          |

Nobody imports the public `option-list/index.tsx` except `src/index.ts`, so OptionList telemetry never fires
inside another component.

### Per file

Inside `src/option-list`, outside tests. "Rendered by" means which components reach the file at runtime.

| File                                | Depends on                                                                                                                                                                                           | Used by                                                                                                                              | Rendered by                               |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------- |
| `index.tsx`                         | `internal`, `interfaces`, `use-base-component`                                                                                                                                                       | `src/index.ts`, dev pages                                                                                                            | OptionList                                |
| `interfaces.ts`                     | `types/*`                                                                                                                                                                                            | `index`, `internal`                                                                                                                  | OptionList                                |
| `internal.tsx`                      | `parts/list`, `parts/item` (type), `selection/*`, `use-option-list`, `utils/check-option-value-field`, `use-controllable`, `forward-focus`, i18n                                                     | `index`, `select/internal`, `multiselect/internal`, `multiselect/embedded`                                                           | all four                                  |
| `use-option-list.ts`                | `list-container` (+ `use-highlighted-option`, `use-keyboard`, `use-ids`), `option` utils, `selection/interfaces`, `use-announcement`, `use-type-ahead`, `utils/connect-options`, `parts/item` (type) | `internal`, `select-dropdown/use-select-dropdown`, `multiselect/embedded`, `multiselect/use-multiselect` (type), `parts/list` (type) | all four                                  |
| `use-type-ahead.ts`                 | `option/utils/filter-options`, `use-debounce-callback`                                                                                                                                               | `use-option-list`, `select/internal`, `multiselect/internal`                                                                         | all four                                  |
| `use-announcement.ts`               | `option/option-announcer`                                                                                                                                                                            | `use-option-list`, `autosuggest/options-list`, `prompt-input/menu-dropdown`                                                          | all four + Autosuggest, PromptInput       |
| `selection/single-selection.ts`     | `selection/interfaces`, `option/utils/filter-options`                                                                                                                                                | `internal`, `select/internal`                                                                                                        | OptionList, Select                        |
| `selection/multi-selection.ts`      | `selection/interfaces`, `option/utils/filter-options`, `utils/connect-options`                                                                                                                       | `internal`, `multiselect/use-multiselect`                                                                                            | OptionList, Multiselect, embedded         |
| `parts/list.tsx`                    | `list-container`, `parts/render-options`, `parts/scroll-to-index`, `parts/common`, `use-option-list` (types)                                                                                         | `internal`, `select/parts/virtual-list` (type), sticky-item dev page                                                                 | all four                                  |
| `parts/render-options.tsx`          | `parts/item`, `parts/option-group`, `parts/get-item-props`, `option/utils/unflatten-options`, `react-virtual` (type)                                                                                 | `parts/list`, `select/parts/virtual-list`                                                                                            | all four                                  |
| `parts/item.tsx`                    | `selectable-item`, `option`, `checkbox-icon`, `icon`, `tooltip`, `use-hidden-description`, `Select`/`MultiselectProps` (type)                                                                        | `parts/render-options`, item permutations page                                                                                       | all four                                  |
| `parts/option-group.tsx`            | `parts/styles`                                                                                                                                                                                       | `parts/render-options`                                                                                                               | Select, Multiselect, embedded (groups)    |
| `parts/get-item-props.ts`           | `list-container/utils/test-indexes`                                                                                                                                                                  | `parts/render-options`                                                                                                               | all four                                  |
| `parts/scroll-to-index.ts`          | none                                                                                                                                                                                                 | `parts/list`, `select/parts/virtual-list`                                                                                            | all four                                  |
| `parts/common.ts`                   | none                                                                                                                                                                                                 | `parts/list`, `select/parts/virtual-list`                                                                                            | all four                                  |
| `utils/connect-options.ts`          | `option/interfaces`                                                                                                                                                                                  | `use-option-list`, `selection/multi-selection`, `select-dropdown/use-select-dropdown`                                                | all four                                  |
| `utils/check-option-value-field.ts` | `is-development`                                                                                                                                                                                     | `internal`, `select/internal`, `multiselect/use-multiselect`, `autosuggest/internal`                                                 | all four + Autosuggest (dev warning only) |

Notes:

- **VirtualList lives in `select/parts`, not here.** The public OptionList never virtualizes, so `option-list` owns only
  `List`. Select, Multiselect and embedded Multiselect choose the list themselves and pass
  `__listComponent={virtualScroll ? VirtualList : undefined}`; `InternalOptionList` still owns the
  scroll-to-highlight effect for whichever component it renders. `VirtualList` imports `ListProps`, `render-options`,
  `scroll-to-index`, `common` and the list stylesheet from `option-list/parts`, which is the allowed direction.
  Autosuggest has its own `autosuggest/virtual-list.tsx` and doesn't use this one.
- **Type-only cycle.** `parts/list` imports `ListElementProps` and `GetOptionProps` from `use-option-list`, and
  `use-option-list` imports `ItemProps` from `parts/item`. These are types, so nothing cycles at runtime, but the
  imports aren't marked `import type`. Moving `ListElementProps`, `GetOptionProps` and `ItemProps` into a
  `parts/types.ts` would make the direction one-way (`use-option-list` → `parts`).

### What this means for changes to OptionList

- **`selection/`, `use-option-list.ts`, `parts/`, `internal.tsx` (controlled path)** are shared with Select and
  Multiselect. Any change there must keep their behaviour. Select, Multiselect and embedded Multiselect tests
  cover them.
- **`use-announcement.ts`** is shared with Autosuggest and PromptInput too, so a change there affects five
  components.
- **`utils/check-option-value-field.ts`** is a dev warning shared with Select, Multiselect and Autosuggest.
- **OptionList-only code** is `index.tsx`, `interfaces.ts`, `StandaloneOptionList` in `internal.tsx`,
  `test-classes/`, `styles.scss` and the `embeddedBehavior: 'option-list'` branch in `use-option-list.ts`.
  Those can change without affecting other components.

`use-open-state` lives in `list-container/utils`, not in `select-dropdown`, so ButtonDropdown doesn't depend on
the select layer.

## Naming

### Renames from the previous code

| Previous                                    | Current                               | Why                                                                                                              |
| ------------------------------------------- | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `internal/components/options-list`          | `internal/components/list-container`  | One letter away from `option-list`, which owns the engine. It's a generic container also used for `role="menu"`. |
| `DropdownOption`                            | `ListOption`                          | The type is used by inline lists too, so "Dropdown" is wrong. About 70 references across about 20 files.         |
| `use-highlight-option.ts`                   | `use-highlighted-option.ts`           | Match the hook it exports, `useHighlightedOption`.                                                               |
| `select/utils/use-native-search.ts`         | `option-list/use-type-ahead.ts`       | It's custom type-ahead, not native browser search.                                                               |
| `select/parts/plain-list.tsx` (`PlainList`) | `option-list/parts/list.tsx` (`List`) | "Plain" only means "not virtual". Pair it with `VirtualList`.                                                    |
| `Item` + `MultiselectItem`                  | `Item` with `selectionType`           | One component; the difference is a prop.                                                                         |
| `useInteractiveGroups`                      | `interactiveGroups`                   | The `use` prefix makes a boolean read like a hook.                                                               |
| `checkboxes`, `isMultiSelect`               | `selectionType: 'single' \| 'multi'`  | Same values as the public OptionList API. One prop instead of two flags plus `useInteractiveGroups`.             |
| `useSelect`                                 | `useOptionList` + `useSelectDropdown` | Split by responsibility.                                                                                         |
| `updateSelectedOption`                      | `onChange`                            | `onChange` returns the full next selection, which matches the public `onChange` events.                          |

### Conventions followed

- **"Dropdown", not "popup".** The repo uses "dropdown" in about 400 files under `src`, and
  `internal/components/menu-dropdown` already exists. "Popup" appears only in ARIA attributes and comments.
- **`Use…Props` / `Use…Api`** for hook inputs and outputs, matching `UseButtonDropdownApi` and `UseHighlightedMenuApi`.
- **`get…Props()`** for prop getters, matching the existing `getTriggerProps`, `getMenuProps` and `getOptionProps`.
- **`__` prefix** for internal-only props on `InternalOptionList`, matching other `internal.tsx` files.
- **Public prop names where the concept is public:** `selectionType`, `enableSelectAll`, `filteringText`,
  `i18nStrings`, `closeDropdown`.
- **ARIA terms where they apply:** `getComboboxInputProps` for an input that keeps focus while it controls the
  list through `aria-activedescendant`.

### Names kept

- `internal/components/option`: renders one option's content and is already used outside lists (Select trigger, Token).
- `src/option-list` / `OptionList`: public API, already chosen, and now also the shared engine.
- `useUniqueId('option-list')` in the hook: the prefix matches the folder that owns it.
- `option-group`, `render-options`, `use-open-state`, `use-keyboard`, `use-ids`, `test-indexes`: clear as they are.

## Compatibility constraints

- **Hashed class names.** Scoped class names include a hash of the stylesheet path, so moving a `.scss` file
  changes them. Test-utils import the stylesheet from its new location, and
  `src/__tests__/snapshot-tests/__snapshots__/test-utils-selectors.test.tsx.snap` is updated in the same change.
  Customers aren't affected because test-utils ship with the same package version.
- **DOM and ARIA output.** Must stay the same for Select and Multiselect. The controlled path renders no extra
  element inside the dropdown. Behavioural tests query by test-utils, ARIA and ids; there's no DOM snapshot for
  the dropdown content, so integration and visual regression tests are the real guard.
- **Telemetry.** Select and Multiselect use `InternalOptionList`, so `useBaseComponent('OptionList')` doesn't fire
  inside them.
- **Analytics metadata.** Lives in `selectable-item/analytics-metadata`, which doesn't move.
- **Bundle size.** Splitting the hook must not duplicate code across entry points. Check the bundle-size report.

## Intended behaviour changes

Select, Multiselect (including embedded), Autosuggest, ButtonDropdown, PromptInput and PropertyFilter behave
exactly as before. The engine reproduces each of their previous focus, pointer and Escape rules through the
`embeddedBehavior` and `onEscape` options described below.

Only the public OptionList (unreleased) differs:

- **Focus.** Keyboard focus highlights the first selected option instead of always the first option. Pointer focus
  doesn't add a keyboard highlight, and leaving the list with the mouse clears it.
- **Escape.** OptionList no longer stops Escape propagation, so Escape inside an OptionList in a Modal closes the
  Modal.

OptionList is unreleased, so there's no customer impact.

How "no change" for the other components was checked:

- The component-level tests for Select, Multiselect, embedded Multiselect, PropertyFilter, Autosuggest,
  ButtonDropdown and PromptInput were not changed by the refactor except for import paths, and they pass.
- New tests in `multiselect-embedded.test.tsx` pin embedded Multiselect's mount highlight, focus, blur and
  mouse-leave behaviour. They pass against both the pre-refactor commit (`b9c34f236`) and the current code.
- A one-off probe rendered Select and Multiselect in 15 configurations (filtering, virtual scroll, select-all,
  async status, custom `renderOption`, `keepOpen`) plus embedded Multiselect, drove them through mouse open,
  keyboard open, arrow keys, Enter, Space, filtering, clicks, Escape, token dismiss and closed type-ahead, and
  serialized the DOM at 113 points. After normalizing hashed class names, generated ids and timestamp-based
  analytics ids, the DOM was identical between `b9c34f236` and the current code, including `aria-selected`,
  `aria-checked` and highlight classes. The probe was not committed.
- Not run: integration, visual-regression and a11y suites. They cover real browser focus and layout, which unit
  tests don't.

## Migration plan

See [LISTBOX_MIGRATION_PLAN.md](LISTBOX_MIGRATION_PLAN.md). It compares three stopping points (OptionList only,
shared rendering and selection, full migration), with actions, risk and verification for each.

## Open questions

- Should OptionList expose option groups publicly, now that `InternalOptionList` supports them?
- Callers pass options twice, once in the list config and again as `__listOptions`. Should `UseOptionListApi`
  expose `options` so the controlled path reads them from the controller?
- Should the ESLint rule cover Layer 0 too? `prepare-options.ts` already imports `SelectProps` type-only.

## Current state

For reference, what this replaced:

- `src/select/utils/use-select.ts` combined list and dropdown behaviour. Inline use relied on `embedded`,
  `keepOpen`, `filteringType: 'none'` and an open-time highlight that OptionList had to hide.
- "Single vs multi" was spread across `useInteractiveGroups`, `checkboxes` and `isMultiSelect`.
  `useInteractiveGroups` also chose between `Item` and `MultiselectItem`.
- OptionList and Multiselect imported from `src/select/parts` and `src/select/utils`, so the public list depended
  on the dropdown component instead of the other way round.
- `internal/components/option`, `internal/components/options-list` and `src/option-list` had similar names but sat
  on different layers.
