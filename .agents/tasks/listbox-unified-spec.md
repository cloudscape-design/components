# Unified listbox: fixes plus Select and Multiselect on the shared listbox core

Status: design, not implemented. Written 2026-11-02 from read-only analysis of
`.worktrees/listbox-unified` (`feat/listbox-unified` at `9a6541a01`) and of `feat/add-option-list`, which moved
to `4c06e5e9f` while this spec was being written (see "Base" below). No code was built or run.

## Branch rules (from the user, binding for every step)

- Do not write to any branch that existed before this work. That covers `refactor/move-shared-listbox-parts`,
  `feat/add-option-list`, `fix/select-multiselect-listbox-alignment`, every `backup/*` branch and every other
  existing branch, plus their worktrees and `stash@{0}`. Read them only with `git show`, `git diff`, `git log`
  and `git stash show -p stash@{0}`. Never check them out, pop or drop the stash, or run commands in their worktrees.
- Only `feat/listbox-unified` and brand-new branches may be written.
- No rebase, no amend, no push, no force, no remote changes.
- Copying content from existing branches is done with `git cherry-pick --no-commit <sha>` or
  `git show <sha> -- <path> | git apply --3way` onto the writable branch, then a new commit.

## Base

`feat/listbox-unified` was created at `9a6541a01`. Since then `feat/add-option-list` was rebased onto
`864c388ef` ("refactor: Share listbox keyboard navigation") and got `4c06e5e9f` ("refactor: Use shared keyboard
navigation in OptionList"). The tree difference between `9a6541a01` and `4c06e5e9f` is six files
(`git diff --stat 9a6541a01 4c06e5e9f`):

- new `src/internal/components/listbox/utils/navigation.ts` (`getListboxNavigation`, Select's current wrap logic)
  and its test `listbox/__tests__/navigation.test.ts`
- `use-listbox.ts` and `use-select.ts` both use `getListboxNavigation`. OptionList dropped its own Home/End
  `preventDefault` and its own wrap logic, so OptionList now has Select's wrap and Home/End behavior.
- two OptionList tests removed: group-state "arrows wrap at the first and last options when the list starts and
  ends with an empty group", and the Home/End `defaultPrevented` assertions in keyboard "focus highlights the first
  option, arrows move with wrap-around, Home and End jump".

**Decision: build on `4c06e5e9f`.** It already has one wrap implementation for both hooks, so the wrap fix lands
in one place. `feat/listbox-unified` has no commits of its own, so nothing is lost. Because it may not be rebased
or reset, the implementation creates a brand-new branch `feat/listbox-unified-2` at the current
`feat/add-option-list` tip, in the existing `.worktrees/listbox-unified` worktree, and leaves
`feat/listbox-unified` at `9a6541a01`. Plan step 0 re-reads the tip and stops if it is not `4c06e5e9f`, because the
user is still moving that branch. Step 0 also updates `listbox-unified-setup.md` to name the new branch
(`Branch: feat/listbox-unified-2 (new, at 4c06e5e9f; feat/listbox-unified left at 9a6541a01)`), and the final
report repeats that the deliverable is on `feat/listbox-unified-2`.

## 1. Requirements

### Summary

One local branch stack that (1) applies fixes A, B, C, D, G, Home/End and arrow wrap once in the shared listbox
layer for Select, Multiselect and OptionList, with their tests, and (2) moves Select and Multiselect off their
parallel listbox logic in `use-select.ts` onto a shared listbox core that `use-listbox.ts` (OptionList) also uses.

### Functional requirements

- F1. Fixes, each applied once in a shared file and effective in all three components:
  - A: type-ahead matches each option on its own text. A group header is no longer matched because a child matches,
    and a child is no longer matched because its group label matches (`use-type-ahead.ts`).
  - B: type-ahead ignores keys with `defaultPrevented`, so Space that selected or opened does not also type-ahead.
  - G: repeated-character cycling finds the current highlight by identity, falling back to `value` when the highlight
    is not one of the given objects (Select passes its `selectedOption` prop while closed).
  - C: `renderOption` `item.parent.disabled` is the group's disabled state, not the option's (`parts/item.tsx`).
  - D: with custom `renderOption` content, a disabled option with `disabledReason` keeps its hidden description, so
    `aria-describedby` points at an element. The tooltip stays limited to default content.
  - Home/End: when the list has focus (no filter input), Home and End prevent the browser's native scroll. With a
    filter input, Home and End keep moving the text cursor and still move the highlight.
  - Wrap: ArrowUp/ArrowDown wrap at the first and last highlightable options, not the first and last rows, so empty
    groups at either end no longer stop the highlight.
- F2. Select and Multiselect (including embedded Multiselect used by property-filter) get highlight state,
  selection guard, menu keyboard handling, mouse handlers, option props and the live announcement from the shared
  listbox core instead of from their own code in `use-select.ts`, `select/internal.tsx` and `use-multiselect.tsx`.
  `use-select.ts` stays as the dropdown shell (trigger, open state, filter, focus, open highlight). This spec reads
  the brief's "instead of `use-select.ts`" as "no listbox logic remains in `use-select.ts`" (acceptance criterion 4),
  not as deleting the file. This interpretation is repeated in the final report.
- F3. OptionList's `useListbox` is built on the same core.
- F4. Tests: the detailed case for each fix lives once in a shared unit test. Each component gets a short wiring test
  per fix. Every test removed in `460ac0f4c` (= `e9922fd3f` on the old base, `c164bb7e4` on the new base; identical
  diffs) and in `4c06e5e9f` comes back. The backup-branch tests (`c90d893b5`, `32daf8d07`) and the `stash@{0}`
  OptionList gap tests are added.
- F5. Autosuggest is a decision point, answered in section 4: not migrated on this branch.

### Must not change

- Public API (`interfaces.ts`, documenter snapshot) of Select, Multiselect, OptionList, Autosuggest, PropertyFilter.
- DOM structure, class names, ids scheme (`<listId>-option-<index>`), `role`, `aria-*` and `data-*` attributes,
  except the `aria-describedby` target that D adds back. Test-utils selectors and wrappers snapshots unchanged.
- Select/Multiselect focus model: trigger button, dropdown, focus in filter input or menu, `aria-activedescendant`
  on the input when filtering and on the menu otherwise, Escape closes and refocuses the trigger, `keepOpen`.
- Select open highlight: keyboard open highlights the first selected option (selection order) or the first option;
  mouse open uses a mouse highlight with `moveFocus: true`. Filtering resets the highlight.
- Select closed type-ahead selects directly; Multiselect type-ahead only when open; neither with filtering.
- Virtual scrolling (`VirtualList`, rAF scroll, sticky select-all), select-all toggling and its neighbour-style rule,
  interactive groups, tokens, embedded Multiselect focus/blur, load-more/recovery/status footer, announcements
  (including `renderHighlightedAriaLive` and the "Selected" prefix).
- OptionList: inline tab-stop list, focus entry on the first selected option in list order, pointer-focus rule,
  highlight follows its option when options change, scroll on every keyboard highlight request
  (`scrollRequest`), scroll through ancestors.
- `useSelect` return shape and `getTriggerProps` key order (asserted in `select/__tests__/use-select.test.ts:98`,
  `Object.keys(triggerProps)`), and `getOptionProps` exact objects (asserted at `use-select.test.ts:134`, `:154`
  and `:167`).

### Intentional behavior changes (all of them)

| Fix | Select | Multiselect | OptionList |
|---|---|---|---|
| A | typing a group's label no longer selects a child that doesn't match | group headers only match on their own text; children of a matching group are not cycle targets | same as Multiselect in multi; single as Select |
| B | Space then a letter: letter type-aheads only from the next key | same | same |
| G | none observable (value fallback keeps behavior) | cycling no longer sticks when a group and option share a value | same in multi |
| C | `item.parent.disabled` = group's state | same | same |
| D | hidden description rendered with custom content | same | same |
| Home/End | `preventDefault` without filter | same (also embedded) | `preventDefault` again (lost in `4c06e5e9f`) |
| Wrap | wraps past empty leading/trailing groups | no change (headers are highlightable) | wraps past empty groups again (lost in `4c06e5e9f`) |

The Multiselect integ test `src/multiselect/__integ__/multiselect.test.ts` changes its expectations with A
(from `5f8b96389`). Integ tests are not run on this branch (section 7); CI runs them.

### Acceptance criteria

1. Each fix commit's tests fail on assertions (not on compilation) against the parent's product code and pass with
   the fix. Tests that pass on the parent are committed separately, unchanged, in a `test:` commit right before the
   fix commit in the same PR, and listed in the report (procedure FAILPROOF in the plan).
2. Every test named in the `460ac0f4c` and `4c06e5e9f` commit messages exists again and passes.
3. All tests from `c90d893b5`, `32daf8d07` and `stash@{0}` exist and pass.
4. After the refactor commits, `use-select.ts` no longer calls `useHighlightedOption`, `useMenuKeyboard`,
   `getListboxNavigation`, `getListboxOptionProps`, `getListMouseHandlers`, `getSelectableOption` or
   `isAnnouncedSelected`; `select/internal.tsx` and `use-multiselect.tsx` no longer call `useAnnouncement`.
   `use-listbox.ts` also gets these from the core.
5. The refactor commits change no test file except imports, and all unit tests pass unchanged.
6. Snapshot tests (`src/__tests__/snapshot-tests`) pass without `-u`.
7. ESLint and `tsc` clean (pages tsconfig: only the 2 known `@formatjs` errors).
8. No pre-existing branch, worktree or stash changed (`git branch -v` and `git stash list` identical to step 0).

### Out of scope

- Autosuggest and property-filter autosuggest migration (section 4).
- Moving `select/parts/virtual-list.tsx` into `listbox/parts` (pure move, no consumer needs it; backlog).
- Stable row keys, item analytics test, `findDisabledReason()` on `OptionListOptionWrapper` (stack plan follow-ups).
- Integration and visual tests, pushing, PR creation on GitHub.

## 2. Current architecture (base `4c06e5e9f`)

Both hooks build on the same primitives: `useHighlightedOption` (`options-list/utils/use-highlight-option.ts`),
`useMenuKeyboard` (`options-list/utils/use-keyboard.ts`), `getListboxNavigation` (`listbox/utils/navigation.ts`),
`connectOptionsByValue`, the option-props helpers (`listbox/utils/option-props.ts`: `isHighlightable`,
`getListboxOptionProps`, `getSelectableOption`, `getListMouseHandlers`, `isAnnouncedSelected`), `useAnnouncement`,
`useTypeAhead`, the `SelectionModel`s, and the renderers `PlainList` → `renderOptions` → `Item`. What each hook does
around them:

| Concern | `useSelect` (`select/utils/use-select.ts`) | `useListbox` (`listbox/use-listbox.ts`) |
|---|---|---|
| Shell | trigger button + `Dropdown`; `useOpenState`; `getTriggerProps`, `getDropdownProps`, `getFilterProps`, `getMenuProps` | inline list, `getListProps` returns `open: true, embedded: true` (tab stop, `tabIndex 0`) |
| Focus | `focusActiveRef` focuses filter or menu on open; `useForwardFocus` to trigger; embedded: menu `onFocus` → `goHome` if nothing highlighted, `onBlur` → reset | list `onFocus` → first selected in list order or Home, except pointer focus (`pointerDown` ref); `onBlur` and `onMouseLeave` (when not focused) reset |
| Initial highlight | open effect (`use-select.ts:269–301`): keyboard → `__selectedOptions[0]` or Home; mouse → `highlightFirstOptionWithMouse` or mouse highlight with `moveFocus` | focus entry above |
| Options change | nothing; filter `onChange` resets highlight; `prepareOptions` is recomputed every render, so `options` is a new array each render | previous-props pattern follows the highlighted option by value (`isSameOption`) |
| Scroll | caller effect on `highlightedIndex` (`select/internal.tsx:184`, `use-multiselect.tsx:229`) → `PlainList`/`VirtualList` ref, `scrollStrategy 'menu'` | `scrollRequest` counter bumped by `withScroll` keyboard setters; `Listbox` effect; `scrollStrategy 'ancestors'` |
| Keyboard | `useMenuKeyboard` with `getListboxNavigation`, Escape closes, `preventNativeSpace: !hasFilter \|\| keyboard highlight`, no Home/End prevention; handler on filter input or menu | same helper via `withScroll`, no Escape, `preventNativeSpace: true`, no Home/End prevention since `4c06e5e9f` |
| Choose | `getSelectableOption` then `toggleAll` for select-all or `updateSelectedOption(option.option)`, then close unless `keepOpen` | `getSelectableOption` then `onChange(selection.getNextSelection(option))` |
| Highlightability | prop `useInteractiveGroups` (independent of `selection`; `use-select.test.ts:243` passes `true` with the default single selection) | `selection.interactiveGroups` |
| Option props | `getListboxOptionProps` with `menuId` | same with `listId` |
| `aria-activedescendant` | `getOptionId(menuId, highlightedIndex)` always (undefined for -1) | only when `highlightedOption` |
| Type-ahead | called by `select/internal.tsx:174` (enabled when no filter and not read-only; closed → selects with `selectedOption` as current) and `use-multiselect.tsx:174` (enabled when open and no filter) | inside the hook, always enabled |
| Announcement | `useAnnouncement` in `select/internal.tsx:269` and `use-multiselect.tsx:206`, fed `announceSelected` from `useSelect` | inside the hook |
| Select-all, tokens, status, load items | `use-multiselect.tsx` (select-all option, `toggleAll`, tokens), `useLoadItems`, `useDropdownStatus`, `listBottom`, sticky first option | none |
| Virtual list | `VirtualList` (`select/parts/virtual-list.tsx`) or `PlainList` | `PlainList` only |

Also: `PlainList` imports its prop types `MenuProps` and `GetOptionProps` from `select/utils/use-select.ts`
(`plain-list.tsx:10`), so the shared list depends on Select's hook module.

Duplicated logic today, about 110 lines across the two hooks plus 2×7 lines of `useAnnouncement` calls:
highlight state and keyboard setters, connected selection, choose guard, menu keyboard wiring, mouse handlers,
option props, `announceSelected`, announcement.

## 3. Target architecture

### Alternatives

1. **Select and Multiselect render OptionList (or the `Listbox` component) inside the dropdown.**
   Correctness: poor. OptionList's list is a tab stop with its own focus entry, highlight follow and ancestor scroll;
   it has no virtual scrolling, select-all, sticky row, filter highlight, status footer, `listBottom` or
   `onLoadMore`. Its root adds a `div` with OptionList test classes, `data-option-index`, `data-value` and
   `hideTopDivider`, so Select's DOM and test-utils output would change. Risk high, diff large (OptionList grows
   modes for all of the above), review hard, bundle: Select pulls in OptionList's option conversion. Rejected.
2. **`useSelect` calls `useListbox` with mode flags** (dropdown vs inline). `getListProps` would branch on six
   props, highlight follow must be turned off for Select (with an unmemoized `options` array the previous-props
   `setState` runs every render and would loop), `scrollRequest` and the inline focus handlers go unused, and
   `useListbox` would take Select-only inputs (Escape, Space policy, select-all). Risk medium: every flag is a path
   where OptionList could change. Diff medium, review harder because one hook carries two components' rules.
   Bundle: neutral (same code, Select pulls in the inline-only branches it never runs).
3. **Shared lower-level core hook used by both `useListbox` and `useSelect`.** The core holds only what is the same
   in both; inline-only behavior stays in `useListbox`, dropdown-only behavior stays in `useSelect`. The renderers
   (`PlainList`, `VirtualList`, `Item`) are already shared. Risk low to medium (hook-order and closure details,
   section 6). Diff about +140 new (core about 130, types file about 10), −175 removed product lines (about −70 in
   `use-listbox.ts`, −90 in `use-select.ts`, 2×7 `useAnnouncement` lines in the callers). Review: one new file plus two files that shrink.
   Bundle: neutral for Select (same code, one more module), slightly smaller overall.

**Chosen: alternative 3.** It removes the parallel implementation without making either component carry the
other's focus or scroll model, and keeps OptionList-only behavior (highlight follow) out of Select's path by
construction instead of by a flag.

### The core: `src/internal/components/listbox/use-listbox-core.ts` (new)

```ts
export interface UseListboxCoreProps {
  /** Rendered options in list order (flattened, filtered, including select-all). */
  options: ReadonlyArray<DropdownOption>;
  selection: SelectionModel;
  /** Whether group headers (and select-all) can be highlighted and chosen. */
  interactiveGroups: boolean;
  /** Called with an interactive option the user chose. */
  onSelect: (option: DropdownOption) => void;
  /** 'always': Space always chooses. 'keyboard-highlight': only while an option has a keyboard highlight,
   *  so Space still types into a filter input. */
  spaceSelects: 'always' | 'keyboard-highlight';
  /** Prevent the browser's Home/End action. False while focus is in a text input. */
  preventNativeHomeEnd: boolean;
  /** Escape handler. When omitted, Escape is not handled and keeps propagating. */
  onEscape?: () => void;
  /** Runs after every keyboard highlight request made through the returned setters. */
  onKeyboardHighlight?: () => void;
  getParent: (option: DropdownOption) => OptionGroup | undefined;
  selectedAriaLabel?: string;
  renderHighlightedAriaLive?: SelectProps.ContainingOptionAndGroupString;
}

export interface UseListboxCoreApi {
  listId: string;                         // useUniqueId('option-list')
  highlightedIndex: number;
  highlightType: HighlightType;
  highlightedOption: DropdownOption | undefined;
  /** Selected options connected to rendered rows (selection order), and as a set. */
  connectedSelected: ReadonlyArray<DropdownOption>;
  connectedSelectedSet: ReadonlySet<DropdownOption>;
  /** Keyboard setters; each calls onKeyboardHighlight. */
  moveHighlight(direction: -1 | 1): void;
  highlightOption(option: DropdownOption): void;
  goHome(): void;
  goEnd(): void;
  /** Raw setters from useHighlightedOption, without onKeyboardHighlight. */
  highlight: HighlightedOptionHandlers<DropdownOption>;
  selectOption(option?: DropdownOption): void;   // getSelectableOption guard, then onSelect
  onKeyDown: CancelableEventHandler<BaseKeyDetail>;
  mouseHandlers: Pick<ListElementProps, 'onMouseUp' | 'onMouseMove'>;
  getOptionProps: GetOptionProps;
  announceSelected: boolean;
  announcement: string;
}
```

Body, in this order (all hooks unconditional): `useUniqueId`;
`connectOptionsByValue(options, selection.selectedOptions)`; `useHighlightedOption`
with `isHighlightable(option, interactiveGroups)`; wrapped keyboard setters (the current `withScroll` generalized to
`onKeyboardHighlight`); `interactivityCheck = interactiveGroups ? isGroupInteractive : isInteractive` (both hooks
derive it this way today: `use-select.ts:83`, `use-listbox.ts:85` on `4c06e5e9f`); `selectOption`, which calls
`getSelectableOption(option, highlightedOption, interactivityCheck)` and then `onSelect`; `useMenuKeyboard` with `getListboxNavigation`, `selectOption`, `goHome`,
`goEnd`, `closeDropdown: onEscape`, `preventNativeSpace: spaceSelects === 'always' || (!!highlightedOption &&
highlightType.type === 'keyboard')`, `preventNativeHomeEnd`; `getListMouseHandlers`; `getOptionProps` via
`getListboxOptionProps`; `isAnnouncedSelected`; `useAnnouncement`.

The `spaceSelects` expression reproduces `use-select.ts:171` (on `4c06e5e9f`) exactly: with no filter Select passes `'always'`,
with a filter `'keyboard-highlight'`.

Selected-options source: the core connects `selection.selectedOptions`, while today `useSelect` connects its own
`selectedOptions` prop (`use-select.ts:94`). Invariant: callers of `useSelect` pass a `selection` whose
`selectedOptions` is their `selectedOptions`. This holds for every caller on the base: Select passes
`singleSelection(selectedOptions)` (at most one option), Multiselect passes `multiSelection(selectedOptions)`, and
the default is `singleSelection(selectedOptions)` (`use-select.ts:79`), which keeps only the first option; every
`use-select.test.ts` case passes at most one option. The invariant is owned by `useSelect`'s callers and documented
on the `selection` prop's JSDoc ("must be built from `selectedOptions`"); it is not checked at runtime.

Type-ahead is not in the core. Its wiring differs on purpose (Select selects while closed and passes its prop as
the current option; Multiselect only while open; OptionList always), and all three already call the one shared
`useTypeAhead`, which is where A, B and G land. Putting it in the core would need per-component callbacks that
reference the core's own return value.

Types: `ListElementProps` and `GetOptionProps` move from `use-listbox.ts` to a new
`src/internal/components/listbox/interfaces.ts`. `use-listbox.ts` and `use-select.ts` re-export them under their
current names (`ListElementProps`, `GetOptionProps`, `MenuProps`), and `PlainList` imports them from the listbox
folder, removing its dependency on `select/utils/use-select.ts`.

### `useListbox` after (`listbox/use-listbox.ts`)

Keeps its public `UseListboxProps`/`UseListboxApi` unchanged. Calls the core with
`interactiveGroups: selection.interactiveGroups`, `onSelect: option => onChange(selection.getNextSelection(option))`,
`spaceSelects: 'always'`, `preventNativeHomeEnd: true`, no `onEscape`, `onKeyboardHighlight: requestScroll`.
Keeps: `listRef`, `pointerDown`, `scrollRequest` state, highlight follow (previous-props pattern, using
`core.highlight.*` raw setters so it does not request a scroll), `getListProps` (spreads `core.mouseHandlers`,
`onKeyDown: core.onKeyDown`, focus/blur/mouse-leave, `aria-activedescendant` only with a highlighted option), and
`useTypeAhead` with `core.highlightOption`.

Order inside `useListbox` after the change:
1. `listRef = useRef`, `pointerDown = useRef`;
2. `const [scrollRequest, setScrollRequest] = useState(0)` and `requestScroll` (must exist before the core call,
   because the core receives `onKeyboardHighlight: requestScroll`);
3. `const core = useListboxCore(...)` (its `useUniqueId` produces `listId`);
4. a local `isHighlightable = (option?) => isHighlightableOption(option, selection.interactiveGroups)`, kept because
   the core doesn't return it and the follow needs it;
5. the previous-options follow (`useState(options)` plus the render-time compare), using `core.highlight.*`;
6. `useTypeAhead`, then `getListProps`.

On the base the order is `useRef`, `useUniqueId`, `useRef`, `useHighlightedOption`, `useState` (follow), `useState`
(scroll). The new order differs, which React allows as long as it is the same on every render. `useUniqueId`
(component-toolkit `internal/use-unique-id`) uses `React.useId` when it exists and otherwise a random id
(`counter-Date.now()-random`); with React 16 in the dev dependencies, ids are random per mount either way, so no test
can pin them and the call position doesn't matter (risk 9).

### `useSelect` after (`select/utils/use-select.ts`)

Props gain three optional props: `getParent` (default `() => undefined`), `selectedAriaLabel` and
`renderHighlightedAriaLive` (both default `undefined`). Select and Multiselect pass
`option => parentMap.get(option)?.option as undefined | OptionGroup` as `getParent`, exactly as their
`useAnnouncement` calls do today (`select/internal.tsx:272`, `use-multiselect.tsx:209`); `parentMap` comes from
`prepareOptions`, which both call before `useSelect` (`select/internal.tsx:125`, `use-multiselect.tsx:110`).
Return value keeps every current field and adds `announcement`. `highlightOption` is
`core.highlight.highlightOptionWithKeyboard` (the raw setter, as today at `use-select.ts:343`), not the wrapped
`core.highlightOption`; the two behave the same for Select and Multiselect, which pass no `onKeyboardHighlight`,
but returning the raw setter keeps the function identical to the base. Calls the core with
`interactiveGroups: useInteractiveGroups`, `onSelect` = the current select-all/`updateSelectedOption` branch plus
`closeDropdownIfNecessary()`, `spaceSelects: hasFilter ? 'keyboard-highlight' : 'always'`,
`preventNativeHomeEnd: !hasFilter`, `onEscape: () => handleEscape()`, no `onKeyboardHighlight`.

`handleEscape` (the current `closeDropdown` keyboard callback: if not embedded, focus trigger and close) and
`closeDropdownIfNecessary` are declared after `useOpenState`, because `useOpenState`'s `onClose` needs
`core.highlight.resetHighlightWithKeyboard`, so the core is called first. Closure note: `onSelect` and `onEscape`
are arrow functions passed to the core that read `closeDropdownIfNecessary` and `handleEscape` at call time (a key
press or click), after both `const`s are initialized; neither is called during render. `onSelect` keeps today's
`toggleAll` guard and fallback (`use-select.ts:144`; `toggleAll` is optional in `UseSelectProps`):

```ts
onSelect: option => {
  if (option.type === 'select-all' && toggleAll) {
    toggleAll();
  } else {
    updateSelectedOption(option.option);
  }
  closeDropdownIfNecessary();
},
```

Do not write `toggleAll?.()`: for a select-all option without `toggleAll` it would skip `updateSelectedOption`.
Order inside `useSelect`: `useListboxCore`, `useOpenState`, `closeDropdownIfNecessary`, `handleEscape`, the
remaining refs, effects and prop getters as today.

Keeps: open state, trigger props and `useTriggerKeyboard` (with `core.goHome`), dropdown props, filter props
(`onKeyDown: core.onKeyDown`, reset on change, `aria-activedescendant: getOptionId(core.listId,
core.highlightedIndex)`), menu props (`open`, `statusType`, `core.mouseHandlers`, `onKeyDown` and
`aria-activedescendant` only without filter, embedded focus/blur), the open effect (uses `core.connectedSelected`
and `core.highlight.*`), `focusActiveRef`, forward focus, `closeDropdownAndRefocus`.

`select/internal.tsx` and `use-multiselect.tsx` drop `useAnnouncement`, pass `getParent`, `selectedAriaLabel` and
`renderHighlightedAriaLive` to `useSelect`, and use `announcement` from it. Their type-ahead and scroll effects stay.

### Files

| File | Change |
|---|---|
| `src/internal/components/listbox/use-listbox-core.ts` | new, about 130 lines |
| `src/internal/components/listbox/interfaces.ts` | new: `ListElementProps`, `GetOptionProps` |
| `src/internal/components/listbox/use-listbox.ts` | uses the core; about −70 lines |
| `src/internal/components/listbox/utils/navigation.ts` | wrap fix (already takes `interactiveGroups`; drops the `highlightedOption` prop) |
| `src/internal/components/listbox/use-type-ahead.ts` | A, B, G |
| `src/internal/components/listbox/parts/item.tsx` | C, D |
| `src/internal/components/listbox/parts/plain-list.tsx` | type imports from `listbox/interfaces` |
| `src/internal/components/options-list/utils/use-keyboard.ts` | `preventNativeHomeEnd` option |
| `src/select/utils/use-select.ts` | uses the core; about −90 lines |
| `src/select/internal.tsx`, `src/multiselect/use-multiselect.tsx` | announcement moved into `useSelect` |
| Tests | listed in section 5 |
| Deleted | none |

`src/autosuggest`, `src/property-filter`, `src/multiselect/embedded.tsx`, `src/multiselect/internal.tsx`,
`select/parts/virtual-list.tsx`, scss files and test-utils: no change.

### Error handling and invariants

These are synchronous UI hooks; nothing is thrown or logged at runtime.

- Choosing a non-interactive or missing option: `selectOption` returns without calling `onSelect` (owned by the
  core via `getSelectableOption`, so every component gets the same guard).
- Highlight index out of range or on a non-highlightable row: `highlightedOption` is `undefined`
  (`useHighlightedOption`); `getOptionId` returns `undefined` for -1.
- Keyboard handler with no options: navigation calls `goHome`/`goEnd`/`moveHighlight`, which no-op when no
  highlightable option exists.
- Dev warnings stay where they are: `checkOptionValueField` in each component, OptionList duplicate-value
  `warnOnce`.
- Invariant "rows render as selected by value" is owned by `connectOptionsByValue` in the core; "group and
  select-all state" by the `SelectionModel` the component passes in; "highlight follows its option" by `useListbox`
  only, because it requires a memoized `options` array.

### Testability

- Pure helpers (`navigation.ts`, `option-props.ts`, `use-type-ahead`, `use-keyboard`) and `Item`: unit tests in
  `listbox/__tests__` and `options-list/__tests__`.
- The core is covered through `use-select.test.ts` (hook-level, already asserts props shapes and navigation) and
  the OptionList/Select/Multiselect component tests. No separate core test file: it would repeat those.
- Real browser focus, page scroll and virtual scroll timing: integ tests, CI only on this branch.

## 4. Autosuggest decision: no (not on this branch)

Recommendation: **do not build Autosuggest on the listbox core.** Possibly revisit only the wrap helper later, as a
separate `fix:` PR, after checking that Autosuggest really has the empty-group wrap bug.

Reasons, from the code:
- Different item model: `AutosuggestItem` spreads option fields onto the item and adds `'use-entered'`
  (`autosuggest/options-controller.ts:127–176`, `:71`). The core and `Item` work on `DropdownOption`. Converting
  would touch `createItems`, `filterOptions` (`autosuggest/utils/utils.ts`) and every renderer.
- Different focus and a11y model: focus always stays in the input (combobox); the highlighted option gets a single
  unique id (`autosuggest/internal.tsx:206–207`) instead of `<listId>-option-<index>` on every row. Moving to the
  core's ids changes the DOM.
- Different row renderer and test-utils contract: `AutosuggestOption` uses autosuggest `styles.option`,
  `data-in-group-index`, `hasBackground` for entered text and no selection marks (`autosuggest-option.tsx`).
  Replacing it with `Item` changes test-utils selectors used by Autosuggest and PropertyFilter.
- No selection model: "selected" means `value === filter text`.
- PropertyFilter reuses `useAutosuggestItems` and `AutosuggestOptionsList` with its own arrow handling, which
  doesn't wrap and moves focus into a custom form (`property-filter/property-filter-autosuggest.tsx:121–131`).
- Type-ahead, select-all, interactive groups and C/D don't apply (Autosuggest's `renderOption` parent has the same
  C-shaped bug at `autosuggest-option.tsx:73`, `toAutosuggestOptionItem`, but that is a separate fix with its own public type).

Risks if done: test-utils and DOM changes in two public components, property-filter regressions, larger review.
Cost: estimated 500–800 changed lines across autosuggest and property-filter plus test churn, for little shared
code (the core's selection, option-props and announcement parts don't fit). Benefit: removes one copy of the old
wrap logic (`autosuggest/internal.tsx:152–172`).

Backlog items (not in this branch): "fix: Pass the group disabled state as parent in Autosuggest renderOption"
and "fix: Wrap Autosuggest arrow keys at the first and last highlightable options" (verify first).

## 5. Fixes, where they land, and tests

Rule: the detailed cases go once into the shared unit test. Each component gets one short wiring test, except that
tests removed in `460ac0f4c`/`4c06e5e9f` are restored as they were (requirement F4), even where that gives a
component more than one test for a fix. Tests that already pass on the base ("base-neutral") go into the test PR,
not into a fix commit, because a fix commit's tests must fail without the fix.

| Fix | Lands in | Shared tests (detailed) | Select | Multiselect | OptionList |
|---|---|---|---|---|---|
| A | `use-type-ahead.ts` filter (`5f8b96389`) | `use-type-ahead.test.ts` "with groups": matching child not group; no cycling into children of a matching group; skips disabled (the OptionList-branch version "repeated key cycles only through matching options and skips disabled ones" from `e9922fd3f^`); without interactive groups no children of a matching group | `native-search.test.tsx` "typing a group label prefix does not select an option inside that group" | `native-search.test.tsx` "highlights the matching option inside a group rather than the group", "Enter after typing selects only the matching option inside a group", "repeating a character does not cycle into group children that do not match" (restored) | `group-state.test.tsx` type-ahead describe, 3 tests (restored) |
| B | `use-type-ahead.ts` `defaultPrevented` (`e7429e11f`) | "ignores keys that were already handled by another handler" | "typing right after opening the dropdown with Space highlights…", "typing right after selecting with Space selects…" (restored) | "typing right after selecting with Space moves the highlight…" (restored) | `keyboard.test.tsx` "type-ahead after Space selects moves the highlight to the matching option" (restored) |
| G | `use-type-ahead.ts` identity lookup (`bd8f0792b`) | "with interactive groups, cycles from the highlighted option when its group has the same value" | none: Select has no interactive groups; the value fallback keeps closed-state cycling, guarded by the base-neutral "cycles from a highlighted option that is an equal copy" test | "repeating a character cycles to the next match when a group and its option share a value" | new: multi, group "Compute" and its child "Cloud" share value `shared`; `c c c` asserts the highlighted row's text after each key: Compute, Cloud, Cache (by text, because a value check gives `shared`, `shared`, `cache`). Without G the third key stays on Cloud |
| C | `item.tsx` `parentProps.disabled` (`6b95bbf8c`) | `item.test.tsx` "renderOption parent reflects the disabled state of the group, not of the option" (from `c90d893b5`) | `render-option.test.tsx` "parent reflects the disabled state of the group, not of the option" (restored) | same (restored) | `render-option.test.tsx` "%s: parent reflects the group state, not the disabled state of the option" (restored) |
| D | `item.tsx` description outside `!renderResult` (`7626adb9a`) | `item.test.tsx` "keeps the disabled reason description with custom content and shows the tooltip only for default content" (from `c90d893b5`) | `render-option.test.tsx` "keeps the disabled reason description for screen readers with custom content" (restored) | same (restored) | `disabled.test.tsx` back to "describes the disabled option with its disabled reason when renderOption is used (%s)" with the 3 `aria-describedby` lines (restored) |
| Home/End | `use-keyboard.ts` `preventNativeHomeEnd` (`6792d0dc3`); `use-select.ts` passes `!hasFilter`; `use-listbox.ts` passes `true` | `use-keyboard.test.ts` "useMenuKeyboard native Home and End" (2) | `home-end.test.tsx` (2: no filter prevented, filter not prevented) | `home-end.test.tsx` (2) | `keyboard.test.tsx` Home/End `defaultPrevented` assertions (restored from `4c06e5e9f`) |
| Wrap | `navigation.ts` (adapted from `58dad9856`; not cherry-picked, it conflicts) | `navigation.test.ts`: replace "wraps down only from the last row, even when it is not highlightable" (asserts the bug) with "wraps down from the last highlightable option when the list ends with an empty group"; add the mirror for a leading empty group; keep the other 5 cases | `arrow-key-wrap.test.tsx`: one test, empty groups at both ends, End→Down→Apple, Home→Up→Banana | none: interactive groups make headers highlightable, behavior unchanged; existing Multiselect keyboard tests guard it | `group-state.test.tsx` "arrows wrap at the first and last options when the list starts and ends with an empty group" (restored from `4c06e5e9f`) |

Changing the "wraps down only from the last row" test is intentional: it pins the bug that the fix removes.

Base-neutral tests (test PR, must pass on the base):
- `item.test.tsx` from `c90d893b5` without the C and D cases: lang; group header content and role; no tooltip or
  `aria-describedby` without a reason; `highlighted` passed to renderOption; multi disabled group header; multi
  `aria-checked`.
- `use-type-ahead.test.ts`: `32daf8d07` (multi-character buffer, description/tags matching, no match); "with
  interactive groups, highlights a group whose own label matches"; "cycles from a highlighted option that is an
  equal copy rather than the same object".
- Multiselect `native-search.test.tsx` created with "highlights a group when its own label matches".
- `stash@{0}` OptionList tests: disabled hover tooltip; group-state `options: undefined`, single-selection
  neighbours, multi neighbours; i18n group header announced selected; option-list special-character values and
  controlled empty selection; render-option click/Enter on custom content.
- `navigation.test.ts` "wraps down from the last child of a grouped list" (`grouped` fixture, highlight 4 = `b1`,
  Down → `goHome` called, `moveHighlight` not called). The Up direction and the flat list are already covered by
  "wraps up from the first child of a leading group when groups are not interactive" and "wraps from the first
  option to the end and from the last option to the start".

Any of these that fails on the base is moved into the fix commit that makes it pass, and the plan's report says so.

Showing each new test fails without its fix (plan FAILPROOF). The check runs before the fix commit exists, so no
amend or rebase is ever needed:
1. With the fix and its tests in the worktree (after `cherry-pick --no-commit` and the test edits), save the
   product diff (`git diff HEAD -- <product files> > /tmp/lu-fix-<n>.patch`) and restore the product files
   (`git checkout HEAD -- <product files>`). Test files stay.
2. Quick-build, run the new test names, and record for each test whether it failed on an assertion or on
   compilation. A compile failure doesn't count.
3. ts-jest type-checks tests with `tsconfig.unit.json` (strict). Two test files only compile against the fixed
   signatures: `use-keyboard.test.ts` (the Home/End cases pass `preventNativeHomeEnd` in an object literal; the
   parent's `UseMenuKeyboard` has no such prop) and the rewritten `navigation.test.ts` (no `highlightedOption`,
   which the parent requires). Those two run on the parent with an untracked config outside the repo,
   `/tmp/lu-jest-nodiag.config.js`, that extends `jest.unit.config.js` with `rootDir` set to the worktree and
   ts-jest `diagnostics: false`. At runtime the parent ignores the extra `preventNativeHomeEnd` and reads
   `highlightedOption?.type` as undefined, so the new cases fail on their assertions. Component tests
   (`home-end.test.tsx`, `arrow-key-wrap.test.tsx`, `group-state.test.tsx`, `keyboard.test.tsx`) compile against
   both versions and use the normal config.
4. Re-apply the patch, quick-build, confirm the tests pass.
5. A new or restored test that passed in step 2 is committed unchanged in its own `test: …` commit right before the
   fix commit, in the same PR, and the report lists it. It stays (F4 requires restored tests) without breaking
   acceptance criterion 1. To split it out, the plan handles three kinds of test file separately: modified files
   (saved as a patch and reset with `git checkout HEAD --`), new files staged by `cherry-pick --no-commit` (not in
   `HEAD`, so unstaged with `git rm --cached`, deleted, and later restored by copy), and new untracked files written
   by hand (deleted and restored by copy). The Home/End commit always takes this path: its Select and Multiselect
   `home-end.test.tsx` are staged new files, and their "with filtering" cases plus the `use-keyboard.test.ts`
   default case pass on the parent.
6. Commit the fix.

## 6. Risks and unverified assumptions

| # | Risk or assumption | How it's verified |
|---|---|---|
| 1 | `feat/add-option-list` moves again before implementation | Step 0 compares the tip to `4c06e5e9f`; stop and ask if different |
| 2 | Fix commits apply on `4c06e5e9f`: A, B, G, C, D, Home/End apply cleanly (`git merge-tree` run in sequence, rc 0); wrap conflicts in `use-select.ts` | Confirmed by `merge-tree`; wrap is written by hand in `navigation.ts` |
| 3 | `stash@{0}` conflicts with base in `option-list.test.tsx` (adjacent inserts next to the icon-gap tests) | Confirmed by `merge-tree`; keep both sides |
| 3a | `32daf8d07` conflicts in `use-type-ahead.test.ts`: the backup predates the revert, so its side also carries the B test "ignores keys that were already handled by another handler" and the whole A `describe('with groups')` (5 tests) | Confirmed by `git merge-tree --write-tree --merge-base=32daf8d07^ 4c06e5e9f 32daf8d07` (CONFLICT). Resolve by keeping the base file plus only `describe('matching', …)` (its fake-timer `beforeEach`/`afterEach`, the `type` helper, 3 tests); the dropped tests come with B (commit 6) and A (this PR's `with groups` start and commit 5) |
| 3b | FAILPROOF failures could be compile errors rather than missing behavior (ts-jest type-checks tests) | FAILPROOF records the failure kind; signature-dependent files run with `diagnostics: false` (section 5) |
| 4 | Base-neutral tests really pass on the base | Run them in the test commit; move failures to fix commits |
| 5 | Highlight follow would loop for Select because `prepareOptions` returns a new array every render | Design keeps follow in `useListbox` only; Select/Multiselect unit tests run after the refactor |
| 6 | `onEscape` closure reads `handleEscape` before it's defined | Escape tests in `select.test.tsx`, `multiselect.test.tsx`, `use-select.test.ts` |
| 7 | `spaceSelects` reproduces the old `preventNativeSpace` exactly | `use-select.test.ts` Space cases, Select filter tests, B wiring tests |
| 8 | Moving `useAnnouncement` into the core keeps the group-announced-once behavior (its `prevAnnouncedGroup` ref lives per instance either way) | `select-a11y.test.tsx`, Multiselect and OptionList announcement tests |
| 9 | Hook order changes change generated ids | `useUniqueId` is `React.useId` or a random id, independent of call position (read in component-toolkit); ids are not snapshotted (no `toMatchSnapshot` in these folders); full unit run |
| 9a | A Select/Multiselect caller passes a `selection` whose `selectedOptions` differs from `selectedOptions` | Read of all `useSelect` callers (section 3 invariant); before PR 5 commit 14, `git grep -n "useSelect(" src ':!**/__tests__/**'` lists only the definition `select/utils/use-select.ts:65` and the calls `select/internal.tsx:159` and `multiselect/use-multiselect.tsx:155` (checked on `4c06e5e9f`) |
| 10 | `use-select.test.ts` exact shapes (`getTriggerProps` keys, `getOptionProps` object) | Test runs unchanged |
| 11 | Embedded Multiselect (property-filter) now prevents Home/End when its list has focus | Intended (hasFilter is false when embedded); property-filter unit tests |
| 12 | Multiselect integ expectations change with A but integ tests are not run here | Stated in the PR; CI runs integ |
| 13 | Autosuggest has the same empty-group wrap bug | Not verified; backlog item says verify first |
| 14 | Snapshot tests unchanged (no scss or public types touched) | Snapshot run without `-u` after each PR |
| 15 | Virtual scroll and the sticky select-all row change when highlight and mouse handlers come from the core | `select/__tests__/virtual-scroll.test.tsx`, `multiselect/__tests__/select-all.test.tsx` (in UNIT) |
| 16 | Status footer and recovery focus (load-more, error recovery) break because `useSelect` reorders its hooks | `select/__tests__/select.test.tsx`, `select/__tests__/use-load-items.test.ts` (in UNIT) |
| 17 | Tokens and embedded Multiselect (property-filter) change | `multiselect/__tests__/multiselect.test.tsx`, `multiselect-embedded.test.tsx`, the `src/property-filter` suites (in UNIT) |
| 18 | Effect order changes when `useAnnouncement` moves into `useSelect`: its per-render `useEffect` now runs before `useSelect`'s open/focus effects and Select's scroll effect instead of after them. Its rAF only records `prevAnnouncedGroup.current` (`use-announcement.ts`), and the other effects don't read that ref, so no announcement should change | `select/__tests__/select-a11y.test.tsx`, Multiselect and OptionList announcement tests |
| 19 | Select and Multiselect regress in shared functional suites (`ssr.test.ts`, `base-props-support.test.tsx`, `form-field-controls-integration.test.tsx`, `outer-form-submit.test.tsx`) that are not in UNIT | PR 5 commit 14 also runs `src/__tests__/functional-tests` (unit config, no integ) |
| 20 | Cherry-picks of `e7429e11f`, `6b95bbf8c`, `7626adb9a` don't apply to test files as they stand after PR 1 and the earlier fix commits (the "apply cleanly" check in row 2 was against `4c06e5e9f`, not the PR 1 tree) | Plan rule "test-file conflicts": keep both sides, each test name once (`grep -c` = 1), base imports plus any the source adds; product-file conflicts stop the step. PRECOMMIT (UNIT, LINT, TSC) runs before each commit |

## 7. Verification per step

All commands from `.worktrees/listbox-unified` with Node 22. Tests import from `lib/components`, so quick-build
runs before jest whenever product code changed.

Every commit (including the `test:` commits FAILPROOF may add) runs the block below with its changes staged but
not yet committed (the plan calls it PRECOMMIT). Nothing is committed until all of it passes; a failure is fixed in
the staged change and the block is run again. Because amending is not allowed, this is what keeps every commit in a
reviewed PR green.

```
mise exec node@22.23.2 -- npm run quick-build > /tmp/lu-qb.log 2>&1
TZ=UTC mise exec node@22.23.2 -- npx jest -c jest.unit.config.js \
  src/option-list src/select src/multiselect src/autosuggest src/property-filter \
  src/internal/components/listbox src/internal/components/options-list \
  src/internal/components/selectable-item src/internal/components/option > /tmp/lu-unit.log 2>&1
mise exec node@22.23.2 -- npx eslint src/internal/components/listbox src/internal/components/options-list \
  src/option-list src/select src/multiselect
mise exec node@22.23.2 -- npx tsc -p tsconfig.json --noEmit
mise exec node@22.23.2 -- npx tsc -p pages/tsconfig.json --noEmit   # only the 2 known @formatjs errors
```

Per PR (once, at the PR's last commit) also:

```
mise exec node@22.23.2 -- npm run build > /tmp/lu-build.log 2>&1
TZ=UTC mise exec node@22.23.2 -- npx jest -c jest.unit.config.js src/__tests__/snapshot-tests   # no -u
```

PR 5's last commit (step 14) also runs the shared functional suites, which render Select and Multiselect
(risk 19):

```
TZ=UTC mise exec node@22.23.2 -- npx jest -c jest.unit.config.js src/__tests__/functional-tests
```

The same command runs once in the step-0 baseline. At step 14, FUNC results must equal the baseline: a suite that
already failed on `4c06e5e9f` is reported and not counted as a regression; any other failure blocks the commit.

No integration tests, no dev server, nothing on port 8080. Delete an untracked `pages/tsconfig.tsbuildinfo` if tsc
creates it.

## 8. PR split

Stacked, each on the one before. All on the writable branch; optional per-PR branches are new branches created at
commit boundaries (`git branch <name> <sha>`), never rebased.

| # | Branch (new) | Title | Contents |
|---|---|---|---|
| 1 | `test/listbox-unified-shared-tests` | `test: Add shared listbox and OptionList tests` | base-neutral tests only |
| 2 | `fix/listbox-unified-type-ahead` | `fix: Improve type-ahead in Select, Multiselect and OptionList` | A, B, G |
| 3 | `fix/listbox-unified-render-option` | `fix: Fix renderOption parent and disabled reason in Select, Multiselect and OptionList` | C, D |
| 4 | `fix/listbox-unified-keyboard` | `fix: Fix Home, End and arrow keys in Select, Multiselect and OptionList` | Home/End, wrap |
| 5 | `refactor/listbox-unified-core` | `refactor: Build Select and Multiselect on the shared listbox core` | types move, core + OptionList, Select/Multiselect |

PR 1 bases on `feat/add-option-list` (#5180). PRs 2–4 replace #5208; whether to close or repoint #5208 stays the
user's call. Fixes come before the refactor so that the refactor is verified against the fixed behavior with no test
changes.

## Revision log

Revision 4, answering the third `listbox-unified-design-review.md` (CHANGES_REQUESTED, 1 MEDIUM, 3 NIT). All
findings addressed; none backlogged or ignored. Re-checked: `feat/add-option-list` is still `4c06e5e9f`,
`feat/listbox-unified` is still `9a6541a01`; `6792d0dc3 --name-status` shows both `home-end.test.tsx` as `A`.

1. MEDIUM, FAILPROOF and staged new test files: confirmed. Plan FAILPROOF step 4 now lists modified
   (`--diff-filter=M`), staged-new (`--diff-filter=A`) and untracked-new (`git ls-files --others`) test files
   separately. Only `HEAD` paths go to `git checkout HEAD --`; staged-new files are unstaged with `git rm --cached`
   and deleted; all new files are saved to `/tmp/lu-fix-<n>-new/` and restored by copy, which replaces the trimmed
   version committed in the `test:` commit. Only the modified-files patch goes through `git apply --3way`. Section 5
   step 5 summarizes this; plan step 10 says the path is expected and names the three tests that pass on the parent
   (both "with filtering" cases and the `use-keyboard.test.ts` default case).
2. NIT, FUNC baseline: section 7 and plan step 0.4 run FUNC at the baseline; step 14 compares with it and counts
   only new failures as regressions.
3. NIT, core details: the body list now derives `interactivityCheck` before `selectOption` (line numbers checked:
   `use-select.ts:83` and `use-listbox.ts:85` on `4c06e5e9f`, not 84 and 83 as the review said). "`useSelect` after"
   states `highlightOption: core.highlight.highlightOptionWithKeyboard`.
4. NIT, setup file Base line: plan step 0.3 also sets `Base: feat/add-option-list @ 4c06e5e9f418a06e39b8b2b2fb4a1ecae59e2047`.

Revision 3, answering the second `listbox-unified-design-review.md` (CHANGES_REQUESTED, 1 MEDIUM, 6 NIT). All
findings addressed; none backlogged or ignored. Re-checked on 2026-11-02: `feat/add-option-list` is still
`4c06e5e9f`, `feat/listbox-unified` is still `9a6541a01`.

1. MEDIUM, per-commit checks: section 7 now says every commit runs QB, UNIT, ESLint and both `tsc` runs with its
   changes staged and uncommitted, and nothing is committed until they pass. The plan defines this as PRECOMMIT and
   uses it in every PR, in FAILPROOF steps 4c and 5, and in the Rules.
2. NIT, unused `KeyCode`: confirmed. In `bd8f0792b`'s Multiselect `native-search.test.tsx`, `KeyCode` is used only
   by the Enter test (line 48, from A) and the Space test (lines 90–92, from B), and `eslint.config.mjs:56` makes
   `no-unused-vars` an error. Plan PR 1 step 2 drops the import; step 5 takes it from `5f8b96389`, whose version of
   the file imports it for the Enter test.
3. NIT, conflict rule: plan Rules gain a test-file conflict rule and a product-file stop rule. Risk 20 records that
   the clean-apply check in risk 2 was against `4c06e5e9f`, not the PR 1 tree.
4. NIT, `onSelect` sketch: section 3 gives the exact body with the `&& toggleAll` guard and the
   `updateSelectedOption` fallback, and states the defaults: only `getParent` defaults to `() => undefined`.
   Also states where `getParent`'s `parentMap` comes from (already computed before `useSelect` in both callers).
5. NIT, caller grep: risk 9a and plan step 14 expect the definition `select/utils/use-select.ts:65` plus the calls
   `select/internal.tsx:159` and `multiselect/use-multiselect.tsx:155` (re-run on `4c06e5e9f`).
6. NIT, missing risks: rows 15–19 added (virtual scroll and sticky select-all, status and recovery, tokens and
   embedded Multiselect, `useAnnouncement` effect order, functional suites), each with its guard; all guard test
   files exist on `4c06e5e9f`. Section 7 and plan step 14 add the `src/__tests__/functional-tests` run.
7. NIT, branch switch and interpretation: "Base" says step 0 updates `listbox-unified-setup.md` with the new branch;
   F2 states the `use-select.ts`-as-shell reading. Both are repeated in the final report.

Revision 2, answering `listbox-unified-design-review.md` (CHANGES_REQUESTED, 3 MEDIUM, 5 NIT). All findings
addressed; none backlogged or ignored. Base re-checked: `feat/add-option-list` is still `4c06e5e9f`.

1. MEDIUM, `32daf8d07` conflict: re-confirmed with `merge-tree` (CONFLICT in `use-type-ahead.test.ts`). Resolution
   (keep base + only `describe('matching', …)`) is in plan PR 1 step 2 and risk 3a.
2. MEDIUM, compile-only failures: FAILPROOF records assertion vs compile failure, and compile failures don't count.
   `use-keyboard.test.ts` and `navigation.test.ts` run on the parent with `/tmp/lu-jest-nodiag.config.js`
   (`diagnostics: false`). Section 5 and plan FAILPROOF; risk 3b.
3. MEDIUM, test passes without fix: FAILPROOF now runs before the fix commit (save patch, restore product files,
   run, re-apply). A test that passes goes unchanged into a `test:` commit just before the fix commit in the same
   PR. Acceptance criterion 1 reworded to match.
4. NIT, selected-options source: the core body says `connectOptionsByValue(options, selection.selectedOptions)`;
   the invariant and its owner (callers, JSDoc on `selection`) are stated in section 3; risk 9a verified with
   `git grep` (only Select and Multiselect call `useSelect`).
5. NIT, hook order and closures: `useListbox` order listed (refs, scroll state + `requestScroll`, core, local
   `isHighlightable`, follow, type-ahead). `useSelect` closure note covers both `onSelect`
   (`closeDropdownIfNecessary`) and `onEscape` (`handleEscape`). Also noted that `useUniqueId` ids don't depend on
   call position (read the toolkit source).
6. NIT, duplicate navigation case: replaced by one case, "wraps down from the last child of a grouped list".
7. NIT, G OptionList test: asserts the highlighted row's text (Compute, Cloud, Cache).
8. NIT, inaccuracies: alternative 2 has a bundle line; diff size is about +140 / −175 with its breakdown;
   `use-select.test.ts` references are `:98`, `:134`, `:154`, `:167`; Files table says `navigation.ts` already
   takes `interactiveGroups` and only drops `highlightedOption`.
