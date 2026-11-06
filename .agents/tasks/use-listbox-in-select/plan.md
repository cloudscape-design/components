# Implementation Plan: build `useSelect` on a shared `useListbox` hook

- Worktree: `/Users/amanabiy/Documents/components/.worktrees/listbox-use-listbox`. Always use absolute paths or `cwd` set to the worktree; relative paths land in the parent workspace.
- Branch: `refactor/use-listbox-in-select`, base `33cfa9917` (= `origin/refactor/move-shared-listbox-parts`, PR #5204).
- Node: prefix every command with `mise exec node@22.23.2 --`.
- Local commits only. Never push.
- Rule for the whole PR: no behavior change. No existing test file is edited. Only new tests are added.

## Background read for this plan

- Base `src/select/utils/use-select.ts` (350 lines) already calls the shared helpers from `listbox/utils/option-props.ts` and `listbox/utils/navigation.ts`, but still owns `useHighlightedOption`, `useMenuKeyboard`, the choose guard, mouse handlers, option props and `announceSelected`.
- Prototype commits on `refactor/listbox-unified-core` were built on a base that already had three fix PRs (type-ahead, renderOption, Home/End + wrap). Those fixes are **not** on this base, so parts of the prototype must not be ported (section D).
- No `src/internal/components/listbox/interfaces.ts` and no OptionList `use-listbox.ts` exist on this base.
- `src/internal/components/listbox/parts/plain-list.tsx:10` imports `GetOptionProps, MenuProps` from `select/utils/use-select`. Nothing else imports those two types.
- `useMenuKeyboard` (`src/internal/components/options-list/utils/use-keyboard.ts`) on this base has a required `closeDropdown`, always calls `event.stopPropagation()` on Escape, and has no `preventNativeHomeEnd` option (Home/End never call `preventDefault`).
- `getListboxNavigation` on this base takes `highlightedOption` (needed by the "first child of a leading group" wrap rule). The prototype dropped it as part of the wrap fix.
- `useUniqueId` uses `React.useId`, so ids depend on the order of `useId` calls inside the component. Keep `useUniqueId('option-list')` (menu id) called before `useUniqueId('dialog')`.
- Hook tests use `renderHook`/`act` from `src/__tests__/render-hook` and `createCustomEvent` key events (see `src/select/__tests__/use-select.test.ts:13-24`).

## A. Design decisions

1. **File and name.** `src/internal/components/listbox/use-listbox.ts`, export `useListbox`, plus `UseListboxProps` and `UseListboxApi`. It stays in `src/internal/components/listbox/`, next to the helpers it composes.
2. **Announcement stays with the callers.** `useListbox` returns `announceSelected` and `highlightedOption` (the inputs `useAnnouncement` needs). `useAnnouncement` stays in `select/internal.tsx` and `multiselect/use-multiselect.tsx`. Rationale: the prototype moved it into the hook and added `getParent`/`selectedAriaLabel`/`renderHighlightedAriaLive` props and an `announcement` return value to `useSelect`, which changes `useSelect`'s API and touches two more files. The goal is an unchanged `useSelect` API.
3. **No `onKeyboardHighlight` wrapper.** The prototype wrapped keyboard setters so OptionList could scroll. No caller needs it in this PR (YAGNI). `useListbox` returns the raw `useHighlightedOption` handlers as `highlight`, and `getListboxNavigation`/`useMenuKeyboard` get the raw `*WithKeyboard` setters, exactly as `useSelect` does today.
4. **Selected rows come from `selection.selectedOptions`.** `SelectionModel` documents it as the single source of truth. Every current caller builds the selection from the same `selectedOptions`: Select passes `singleSelection(selectedOptions)` with a one-item array (`select/internal.tsx:143,161`), Multiselect's `multiSelection` returns `selectedOptions` unchanged, and `useSelect`'s default is `singleSelection(selectedOptions)`. All `use-select.test.ts` cases pass zero or one selected option. So the connected list is identical. Document on `UseSelectProps.selection` that it must be built from `selectedOptions`.
5. **`interactiveGroups` is an explicit prop**, not read from `selection.interactiveGroups`, because `useSelect` receives `useInteractiveGroups` separately and tests (e.g. `group-state.test.tsx`) can pass a selection model without it.
6. **`useMenuKeyboard` gets two optional, default-preserving options**: `closeDropdown` becomes optional (when omitted, Escape is not handled and not stopped) and new `preventNativeHomeEnd?: boolean` (default `false`). This is the minimal way to support `onEscape?` and `preventNativeHomeEnd` in `useListbox`. All current callers pass `closeDropdown` and no `preventNativeHomeEnd`, so their behavior is identical. Port only these two hunks from the prototype's `use-keyboard.ts`.
7. **List prop types** move to `src/internal/components/listbox/interfaces.ts` as `ListElementProps` and `GetOptionProps` (the names the OptionList branch uses). `use-select.ts` does not re-export them, because no other file imports them from there after `plain-list.tsx` is updated.
8. **`getOptionProps` return type** stays `ReturnType<typeof getListboxOptionProps>` (as inferred today), not `GetOptionProps`. The prototype found that typing it as `GetOptionProps` breaks a test compile.

## B. `useListbox` signature

```ts
// src/internal/components/listbox/use-listbox.ts
export interface UseListboxProps {
  /** Rendered options in list order (flattened, filtered, including select-all). */
  options: ReadonlyArray<DropdownOption>;
  /** Selected, group and select-all state. Rows are matched to `selection.selectedOptions` by value. */
  selection: SelectionModel;
  /** Whether group headers (and select-all) can be highlighted and chosen. */
  interactiveGroups: boolean;
  /** Called with the interactive option the user chose (Enter, Space, mouse up, or `selectOption`). */
  onSelect: (option: DropdownOption) => void;
  /**
   * 'always': Space always chooses the highlighted option.
   * 'keyboard-highlight': Space chooses only while an option has a keyboard highlight, so it still types into a filter input.
   */
  spaceSelects: 'always' | 'keyboard-highlight';
  /** Prevent the browser's Home/End action. Defaults to false (Home/End only move the highlight). */
  preventNativeHomeEnd?: boolean;
  /** Escape handler. When omitted, Escape is not handled and keeps propagating. */
  onEscape?: () => void;
}

export interface UseListboxApi {
  /** Id of the list element; row ids are `getOptionId(listId, index)`. */
  listId: string;
  highlightedIndex: number;
  highlightType: HighlightType;
  highlightedOption: DropdownOption | undefined;
  /** `selection.selectedOptions` connected to rendered rows, in selection order. */
  selectedOptions: ReadonlyArray<DropdownOption>;
  /** Raw highlight setters from `useHighlightedOption`. */
  highlight: HighlightedOptionHandlers<DropdownOption>;
  /** Chooses `option`, or the highlighted option when omitted. Ignores non-interactive options. */
  selectOption(option?: DropdownOption): void;
  /** Keydown handler for the element that has focus (list or filter input). */
  onKeyDown: CancelableEventHandler<BaseKeyDetail>;
  /** `onMouseUp` / `onMouseMove` for the list element. */
  mouseHandlers: ReturnType<typeof getListMouseHandlers>;
  /** Props for the row at `index`. */
  getOptionProps(option: DropdownOption, index: number): ReturnType<typeof getListboxOptionProps>;
  /** Whether the live region announces the highlighted option as selected. */
  announceSelected: boolean;
}

export function useListbox(props: UseListboxProps): UseListboxApi;
```

Body, in this order (a short composition of the shared utils):

```ts
const listId = useUniqueId('option-list');
const selectedOptions = connectOptionsByValue(options, selection.selectedOptions);
const selectedSet = new Set(selectedOptions);
const [{ highlightType, highlightedOption, highlightedIndex }, highlight] = useHighlightedOption({
  options,
  isHighlightable: (option?: DropdownOption) => isHighlightable(option, interactiveGroups),
});
const interactivityCheck = interactiveGroups ? isGroupInteractive : isInteractive;
const selectOption = (option?: DropdownOption) => {
  const optionToSelect = getSelectableOption(option, highlightedOption, interactivityCheck);
  if (optionToSelect) {
    onSelect(optionToSelect);
  }
};
const onKeyDown = useMenuKeyboard({
  ...getListboxNavigation({
    options, highlightedIndex, highlightedOption, interactiveGroups,
    moveHighlight: highlight.moveHighlightWithKeyboard,
    goHome: highlight.goHomeWithKeyboard,
    goEnd: highlight.goEndWithKeyboard,
  }),
  selectOption,
  goHome: highlight.goHomeWithKeyboard,
  goEnd: highlight.goEndWithKeyboard,
  closeDropdown: onEscape,
  preventNativeSpace: spaceSelects === 'always' || (!!highlightedOption && highlightType.type === 'keyboard'),
  preventNativeHomeEnd,
});
const mouseHandlers = getListMouseHandlers({ options, selectOption, setHighlightedIndexWithMouse: highlight.setHighlightedIndexWithMouse });
const getOptionProps = (option, index) => getListboxOptionProps(option, index, { options, selectedSet, selection, highlightedOption, interactiveGroups, listId });
const announceSelected = isAnnouncedSelected(highlightedOption, selectedSet, selection);
return { listId, highlightedIndex, highlightType, highlightedOption, selectedOptions, highlight, selectOption, onKeyDown, mouseHandlers, getOptionProps, announceSelected };
```

JSDoc on the hook: list state shared by all list components (highlight, keyboard navigation, choose guard, mouse handlers, row props, selected-announcement flag). Focus, open state, filter, scrolling, type-ahead and the highlight on open stay with callers.

## C. What moves out of `use-select.ts` and what stays

| Piece in base `use-select.ts` | Lines (base) | Moves to `useListbox` | Stays in `useSelect` |
|---|---|---|---|
| `MenuProps`, `GetOptionProps` type aliases | 37-38 | to `listbox/interfaces.ts` (commit 1) | |
| `interactivityCheck`, `isHighlightable` | 82-84 | yes | |
| `filterRef`, `triggerRef`, `menuRef`, `hasFilter`, `isDialog`, `activeRef` | 86-92 | | yes |
| `connectOptionsByValue` → `__selectedOptions`, `__selectedOptionsSet` | 93-94 | yes (`selectedOptions`, internal set) | `__selectedOptions` becomes an alias of `listbox.selectedOptions` |
| `useHighlightedOption` | 95-106 | yes | destructures `highlight.*` setters it still needs |
| `useOpenState` (+ `onClose` resets highlight, clears filter) | 108-115 | | yes |
| `handleFocus`, `handleBlur` | 117-124 | | yes |
| `hasSelectedOption` | 126 | | yes (effect dep) |
| `menuId = useUniqueId('option-list')` | 127 | yes (`listId`) | `const menuId = listbox.listId` |
| `dialogId`, `highlightedOptionId` | 128-129 | | yes |
| `closeDropdownIfNecessary` (keepOpen, trigger focus) | 131-136 | | yes, called from `onSelect` |
| `selectOption` guard | 138-149 | guard moves | select-all/`toggleAll` vs `updateSelectedOption` + `closeDropdownIfNecessary` become the `onSelect` callback |
| `useMenuKeyboard` + `getListboxNavigation` | 151-171 | yes | Escape body becomes `onEscape` (`if (!embedded) { trigger focus; closeDropdown() }`), `spaceSelects: hasFilter ? 'keyboard-highlight' : 'always'`, no `preventNativeHomeEnd` |
| `useTriggerKeyboard` | 173-176 | | yes, `goHome: goHomeWithKeyboard` (raw) |
| `getDropdownProps`, `getTriggerProps` | 178-207 | | yes, unchanged |
| `getFilterProps` | 209-231 | | yes; `onKeyDown: listbox.onKeyDown` |
| `getMenuProps` | 233-258 | mouse handlers come from `listbox.mouseHandlers` | yes; `onKeyDown: listbox.onKeyDown` without filter, embedded `onFocus`/`onBlur` unchanged |
| `getOptionProps` | 259-267 | yes | returned as `listbox.getOptionProps` |
| highlight-on-open effect | 269-299 | | yes, unchanged (same setters, same deps) |
| `focusActiveRef`, focus-on-open effect, `useForwardFocus` | 301-313 | | yes |
| `announceSelected` | 314 | yes | returned as `listbox.announceSelected` |
| `closeDropdownAndRefocus` | 316-328 | | yes |
| return object | 330-347 | | identical keys and values: `highlightOption: highlightOptionWithKeyboard` (raw), `selectOption: listbox.selectOption`, `announceSelected: listbox.announceSelected`, `getOptionProps: listbox.getOptionProps` |

Ordering inside `useSelect`: refs and derived flags → `useListbox(...)` → `useOpenState(...)` → the rest. `onSelect` and `onEscape` are arrow functions that call `closeDropdownIfNecessary()` / `handleEscape()` declared after `useOpenState`; they only run on user events, after declaration, so there is no TDZ issue. Add a one-line comment saying so (as in the prototype). `useOpenState` must come after `useListbox` because its `onClose` uses `resetHighlightWithKeyboard`.

`select/internal.tsx`, `multiselect/use-multiselect.tsx`, `multiselect/embedded.tsx`, `multiselect/internal.tsx`, `select/parts/virtual-list.tsx`, autosuggest and property-filter are **not** changed.

## D. Prototype parts that must NOT be ported

| Prototype (`b2f8bf0ec` / `1b0f891c9`) | Why not | Do instead |
|---|---|---|
| `preventNativeHomeEnd: !hasFilter` in `useSelect` | Comes from fix PR "Prevent page scroll on Home and End" (`071edd6d4`). Base Select never prevents Home/End | `useSelect` does not pass `preventNativeHomeEnd` (default `false`) |
| `getListboxNavigation` call without `highlightedOption` | Comes from the wrap fix (`866fcb0c1`); base wrap rule needs `highlightedOption` | Pass `highlightedOption` as base `use-select.ts:155` does |
| `onKeyboardHighlight` and wrapped `moveHighlight`/`goHome`/`goEnd`/`highlightOption`; `useTriggerKeyboard({ goHome: core.goHome })` | OptionList-only scroll hook; not needed here | Raw setters everywhere |
| `announcement` via `useAnnouncement` inside the core; new `useSelect` props `getParent`, `selectedAriaLabel`, `renderHighlightedAriaLive`; `noParent`; removing `useAnnouncement` from `select/internal.tsx` and `use-multiselect.tsx` | Changes `useSelect`'s API (decision A2) | Keep `useAnnouncement` in callers; return `announceSelected` only |
| Changes to `src/internal/components/listbox/use-listbox.ts` (OptionList hook) and `listbox/index.tsx` | Those files don't exist on this base | Create a new `use-listbox.ts` with the API above |
| Any `use-type-ahead.ts` change (handled-key check etc.) | Type-ahead fix PR | Don't touch |
| `useMenuKeyboard` Home/End and Escape hunks beyond optional params | Only the default-preserving optional params are needed | Decision A6 |

## E. Behavior-sensitive paths to preserve (and their safety nets)

1. **Filter.** With a filter, keydown comes from the filter input (`getFilterProps().onKeyDown`), `aria-activedescendant`/`aria-owns`/`aria-controls` on the input; typing calls `setFilteringValue` and `resetHighlightWithKeyboard`; `__onDelayedInput` calls `fireLoadItems`. Menu gets no `onKeyDown`/`nativeAttributes`. Nets: `use-select.test.ts:425,453`, `src/select/__tests__/filter*.test.tsx`, Multiselect filtering tests.
2. **Space with filter.** Space chooses only when an option has a keyboard highlight; otherwise it types a space (no `preventDefault`). After a mouse highlight, Space types. Without filter Space always chooses. Mapping: `spaceSelects: hasFilter ? 'keyboard-highlight' : 'always'`. Note base `hasFilter` is false when `embedded`, so embedded Multiselect uses `'always'`.
3. **Highlight on open.** Without filter: keyboard open highlights the first selected option in selection order (`__selectedOptions[0]`) with keyboard type, else `goHomeWithKeyboard`; mouse open uses `highlightFirstOptionWithMouse` or `setHighlightedIndexWithMouse(index, true)`. With filter: no highlight on open. The effect and its deps stay byte-identical except that the setters come from `listbox.highlight`. Nets: `use-select.test.ts:193-340,436-462`.
4. **Trigger keyboard.** Up/Down call `goHomeWithKeyboard` then open; Space/Enter open. Trigger `onMouseDown` prevents default, refocuses when open, toggles. Trigger `onFocus` closes. Net: `use-select.test.ts:96,180-230`, `select/__tests__/trigger*.test.tsx`.
5. **Embedded Multiselect focus/blur.** `defaultOpen: embedded`; menu `onFocus` → `goHomeWithKeyboard()` if nothing highlighted; `onBlur` → `resetHighlightWithKeyboard()`; Escape does nothing when embedded (but still `stopPropagation`, because `onEscape` is always passed). No focus-on-open effect when embedded. Nets: `src/multiselect/__tests__/multiselect-embedded.test.tsx`, property-filter tests.
6. **Select-all.** `onSelect` calls `toggleAll()` only when `option.type === 'select-all' && toggleAll`; otherwise `updateSelectedOption(option.option)` (also for select-all without `toggleAll`). Select-all row props from `getListboxOptionProps`. Net: `src/multiselect/__tests__/select-all.test.tsx`.
7. **keepOpen / close on select.** After every successful choose, `closeDropdownIfNecessary()`: when `!keepOpen`, focus trigger then `closeDropdown()`. Non-interactive (disabled, parent without interactive groups) chooses do nothing and don't close. Nets: `use-select.test.ts:346-424`.
8. **Escape and trigger focus return.** Escape stops propagation; when not embedded, focuses the trigger then closes. `closeDropdownAndRefocus` (dropdown customization) unchanged. Nets: Select/Multiselect Escape tests, `src/select/__tests__/dropdown-customization*.test.tsx` if present.
9. **Arrow wrap.** Up at index 0 (or at index 1 on a child without interactive groups) → `goEndWithKeyboard`; Down at last → `goHomeWithKeyboard`. Home/End move the highlight without `preventDefault`. Nets: `use-select.test.ts:231-287`, `listbox/__tests__/navigation.test.ts`.
10. **Mouse.** `onMouseMove(i)` with `i > -1` → `setHighlightedIndexWithMouse(i)`; `onMouseUp(i)` with `i > -1` → `selectOption(options[i])`. Rows with non-highlightable options get `data-mouse-target: -1`.
11. **Ids.** `menuId` prefix `option-list`, created before `dialogId`; row ids `getOptionId(menuId, index)`; `aria-controls` on trigger uses `dialogId` or `menuId`.
12. **Type-ahead.** `select/internal.tsx` and `use-multiselect.tsx` keep calling `useTypeAhead` with `highlightOption` (raw `highlightOptionWithKeyboard`) and `selectOption` from `useSelect`.

## F. Verification commands (from baseline.md)

Run in the worktree with `mise exec node@22.23.2 --`:

- QB: `npm run quick-build` → exit 0.
- UNIT: `TZ=UTC npx jest -c jest.unit.config.js src/select src/multiselect src/autosuggest src/property-filter src/internal/components/listbox src/internal/components/options-list src/internal/components/selectable-item` → baseline 74 suites / 1157 tests all pass; after this PR all pass with only the new tests added.
- LINT: `npx eslint src/internal/components/listbox src/internal/components/options-list src/select src/multiselect` → 0 problems.
- TSC: `npx tsc -p tsconfig.json --noEmit` → 0 errors.
- SNAP: `npm run build` then `TZ=UTC npx jest -c jest.unit.config.js src/__tests__/snapshot-tests` (no `-u`) → 4/4 suites, 112/112 tests, 110/110 snapshots.
- FUNC: `TZ=UTC npx jest -c jest.unit.config.js src/__tests__/functional-tests` → 10/10 suites, 1969/1969 tests.
- No existing test edited: `git -C /Users/amanabiy/Documents/components/.worktrees/listbox-use-listbox diff --stat 33cfa9917 -- '*__tests__*'` lists only `src/internal/components/listbox/__tests__/use-listbox.test.tsx` (new) and `src/internal/components/options-list/__tests__/use-keyboard.test.ts` (added cases only; `git diff` shows only `+` lines).

Save logs to `/Users/amanabiy/Documents/components/.agents/tasks/use-listbox-in-select/logs/<step>-*.log`. Revert generated noise before committing (`git status --short` must show only intended files; `pages/tsconfig.tsbuildinfo` is untracked, leave it unstaged).

# Implementation Plan

- [ ] 1. Commit 1: `refactor: Move listbox list prop types into the listbox folder`.
      Create `src/internal/components/listbox/interfaces.ts` with `ListElementProps = Omit<OptionsListProps, 'children'> & { ref: React.RefObject<HTMLDivElement> }` and `GetOptionProps = (option: DropdownOption, index: number) => ItemProps` (copy of prototype `45567f02d` file, with license header). In `plain-list.tsx`, replace the `select/utils/use-select` import with `import { GetOptionProps, ListElementProps } from '../interfaces'` and type `menuProps: ListElementProps`. In `use-select.ts`, delete the two type aliases and the `ItemProps` and `OptionsListProps` imports, import `ListElementProps` from `../../internal/components/listbox/interfaces`, and type `menuProps: ListElementProps` in `getMenuProps`. No re-export (no other importer). Commit body: types moved so the shared list no longer imports Select's hook module; no behavior change.
      Files: src/internal/components/listbox/interfaces.ts (new), src/internal/components/listbox/parts/plain-list.tsx, src/select/utils/use-select.ts
      Verify: LINT and TSC clean; UNIT all pass (74 suites / 1157 tests).

- [ ] 2. Add the two default-preserving options to `useMenuKeyboard` (decision A6) and cover them.
      In `use-keyboard.ts`: make `closeDropdown?: () => void` with JSDoc "When omitted, Escape is not handled and keeps propagating"; Escape case becomes `if (closeDropdown) { event.stopPropagation(); closeDropdown(); }`. Add `preventNativeHomeEnd?: boolean` (default `false`, comment: leave off while focus is in a text input) and call `event.preventDefault()` in the HOME/END cases only when it is set. In `use-keyboard.test.ts` add cases: Home and End keep the native action by default; Home and End prevent the native action when `preventNativeHomeEnd` is set; Escape is not stopped when no `closeDropdown` is given. Don't change existing cases. This is part of commit 2 (do not commit yet).
      Files: src/internal/components/options-list/utils/use-keyboard.ts, src/internal/components/options-list/__tests__/use-keyboard.test.ts
      Verify: `TZ=UTC npx jest -c jest.unit.config.js src/internal/components/options-list` passes; TSC clean.

- [ ] 3. Add `useListbox` (section B) in `src/internal/components/listbox/use-listbox.ts`.
      Implement exactly the signature and body in section B, importing `useUniqueId`, `connectOptionsByValue`, `useHighlightedOption`/`HighlightType`/`HighlightedOptionHandlers`, `isGroupInteractive`/`isInteractive`, `getSelectableOption`/`getListMouseHandlers`/`getListboxOptionProps`/`isAnnouncedSelected`/`isHighlightable`, `getListboxNavigation`, `useMenuKeyboard`, `SelectionModel`, `BaseKeyDetail`/`CancelableEventHandler`. Do not import anything from `src/select` at runtime. Depends on item 2.
      Files: src/internal/components/listbox/use-listbox.ts (new)
      Verify: TSC and LINT clean (file unused yet; that is fine for TSC/ESLint).

- [ ] 4. Add `src/internal/components/listbox/__tests__/use-listbox.test.tsx` (renderHook + `act` from `src/__tests__/render-hook`, key events built with `createCustomEvent` as in `use-select.test.ts:13-24`, options from `flattenOptions` with a group, a disabled option and plain options).
      Cases, named by behavior: Space chooses the highlighted option and prevents the native action when `spaceSelects` is 'always'; with 'keyboard-highlight', Space types (no `preventDefault`, no `onSelect`) when nothing or a mouse-highlighted option is highlighted, and chooses after a keyboard highlight; Escape calls `onEscape` and stops propagation; Escape without `onEscape` is not stopped; Home and End move the highlight without `preventDefault` by default, and with `preventDefault` when `preventNativeHomeEnd` is set; Enter/`selectOption` ignores a disabled option and a group header when groups aren't interactive, and chooses the header when they are; `onMouseMove`/`onMouseUp` highlight with mouse type and choose, and ignore index -1; `getOptionProps` returns `highlighted`, `selected` (from `selection.selectedOptions` matched by value), `id: getOptionId(listId, index)` and `data-mouse-target: -1` for a non-highlightable header; `announceSelected` is true only when the highlighted option is selected. Every test asserts the observable effect (calls, `defaultPrevented`, returned values).
      Files: src/internal/components/listbox/__tests__/use-listbox.test.tsx (new)
      Verify: `TZ=UTC npx jest -c jest.unit.config.js src/internal/components/listbox` passes, new suite included.

- [ ] 5. Rewrite `useSelect` on `useListbox` (section C), keeping its props, return keys and values identical.
      Call `const listbox = useListbox({ options, selection, interactiveGroups: useInteractiveGroups, onSelect, spaceSelects: hasFilter ? 'keyboard-highlight' : 'always', onEscape: () => handleEscape() })` right after the refs/flags and before `useOpenState`. `onSelect: option => { if (option.type === 'select-all' && toggleAll) { toggleAll(); } else { updateSelectedOption(option.option); } closeDropdownIfNecessary(); }`. Add `handleEscape` with the base Escape body. Destructure `listId: menuId`, `highlightType`, `highlightedOption`, `highlightedIndex`, `selectedOptions: __selectedOptions` and `highlight: { resetHighlightWithKeyboard, setHighlightedIndexWithMouse, highlightOptionWithKeyboard, highlightFirstOptionWithMouse, goHomeWithKeyboard }`. Replace `activeKeyDownHandler` with `listbox.onKeyDown`, the inline mouse handlers with `...listbox.mouseHandlers`, and return `getOptionProps: listbox.getOptionProps`, `selectOption: listbox.selectOption`, `announceSelected: listbox.announceSelected`; all other returns unchanged. Delete the moved code and now-unused imports (`connectOptionsByValue`, `getListboxNavigation`, option-props helpers, `isGroupInteractive`/`isInteractive`, `useHighlightedOption`, `useMenuKeyboard`). Keep `useUniqueId` (dialog id). Update the `selection` JSDoc to say it must be built from `selectedOptions`. Do not port anything listed in section D. Then commit items 2-5 as `refactor: Build useSelect on a shared useListbox hook` with a body explaining: new `useListbox` owns highlight, keyboard navigation, choose guard, mouse handlers, row props and the selected-announcement flag; `useSelect` keeps trigger, open state, filter, dialog, focus, Escape, highlight on open and embedded focus; `useMenuKeyboard` gains optional `preventNativeHomeEnd` and optional `closeDropdown` with today's defaults; no behavior change and no existing test changed.
      Files: src/select/utils/use-select.ts
      Verify: full section F: QB, UNIT (all pass; the only new suites/tests are from items 2 and 4), LINT, TSC, SNAP identical, FUNC identical, and the `__tests__` diff check. Also run the guard suites explicitly and confirm they pass: `src/select/__tests__/use-select.test.ts`, `src/select/__tests__/group-state.test.tsx`, `src/multiselect/__tests__/select-all.test.tsx`, `src/multiselect/__tests__/multiselect-embedded.test.tsx`, `src/property-filter`.

- [ ] 6. (Optional) Commit 3 `refactor: Remove leftovers from useSelect` only if items 1-5 leave dead code that is small and pure to delete (an unused import, an unused local, a now-redundant comment) in `src/select/utils/use-select.ts` or `src/multiselect/use-multiselect.tsx`. From reading the code, none is expected (`hasSelectedOption` is still an effect dependency and must stay); skip this commit if `npx eslint` reports nothing and no dead code is visible.
      Files: src/select/utils/use-select.ts, src/multiselect/use-multiselect.tsx (only if needed)
      Verify: LINT, TSC, UNIT pass.

- [ ] 7. Final report: write `/Users/amanabiy/Documents/components/.agents/tasks/use-listbox-in-select/verification.md` with each section F command, its result next to the baseline numbers, `wc -l` for `use-select.ts` (baseline 350) and `use-listbox.ts`, `git log --oneline 33cfa9917..HEAD`, and confirmation that nothing was pushed (`git status -sb` shows the branch ahead of `origin/refactor/move-shared-listbox-parts` only locally).
      Files: .agents/tasks/use-listbox-in-select/verification.md (outside the worktree)
      Verify: file lists all commands with passing results.

## Gaps and assumptions

- "Keep the returned API exactly the same" is read as: same keys, same value types and the same function semantics. `getOptionProps`/`selectOption` are new closures each render, as before.
- Adding optional parameters to `useMenuKeyboard` is assumed in scope because the brief requires `preventNativeHomeEnd` and optional `onEscape` on `useListbox`; both default to today's behavior.
- If any existing test fails after item 5, the cause is a behavior difference in the port; fix the port (compare against section C/E), never the test.
- PR title when the user opens it: `refactor: Build Select and Multiselect list behavior on a shared useListbox hook` (type `refactor:`, no scope).
