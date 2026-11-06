# Fit check: OptionList on the shared PlainList

Worktree: `/Users/amanabiy/Documents/components/.worktrees/option-list-plain-list`
Branch: `refactor/option-list-plain-list` at `460ac0f4c` (= `origin/feat/add-option-list`).
Future PR title: `refactor: Use PlainList in OptionList`.

All paths below are relative to the worktree.

## Importers

- `src/internal/components/listbox/parts/list.tsx` (List): imported only by `src/internal/components/listbox/index.tsx` (Listbox), which is used only by `src/option-list/internal.tsx`. No test imports it.
- `src/internal/components/listbox/parts/plain-list.tsx` (PlainList): `src/select/internal.tsx` (via `SelectListProps` + PlainList), `src/multiselect/internal.tsx`, `src/multiselect/embedded.tsx`, `pages/dropdown/list-with-sticky-item.page.tsx`. `SelectListProps` type also used by `src/select/parts/virtual-list.tsx` and `src/multiselect/use-multiselect.tsx`.
- `scrollOptionIntoView` (named export of `parts/scroll-to-index.ts`): used only by `list.tsx`. Default export (`scrollToIndex`) used by PlainList and `select/parts/virtual-list.tsx`; tested by `listbox/__tests__/scroll-to-index.test.ts`.

## Line-by-line comparison

| Aspect | List (`parts/list.tsx`) | PlainList (`parts/plain-list.tsx`) | Equivalent when PlainList is fed OptionList's values? |
|---|---|---|---|
| Container props | `listProps: ListElementProps` (`Omit<OptionsListProps,'children'> & {ref}`, use-listbox.ts:22) | `menuProps: MenuProps` (same definition, select/utils/use-select.ts:30) | Yes, structurally identical types. Pass `menuProps={mergedListProps}`. |
| getOptionProps type | `GetOptionProps` from use-listbox.ts:23 | `GetOptionProps` from use-select.ts:31 | Yes, identical signature `(option, index) => ItemProps`. |
| Options prop | `options` | `filteredOptions` | Rename in adapter. |
| idPrefix | `useUniqueId('select-list-')` | `useUniqueId('select-list-')` | Identical. |
| useContainerQuery | returns `{inner: contentBoxWidth, outer: borderBoxWidth}` | same, plus measures `stickyOptionRef.current` if set | Yes. `stickyOptionRef.current` is null without `firstOptionSticky` (render-options.tsx:76 only attaches it to the sticky item), so no extra setState. |
| withScrollbar | `!!width && width.inner < width.outer` | same | Identical. |
| menuRef / merged ref | `listProps.ref`, `useMergeRefs(menuMeasureRef, menuRef)` | `menuProps.ref`, same merge | Identical. |
| Imperative ref type | `ListProps.ListRef = (index) => void` | `SelectListProps.SelectListRef = (index) => void` | Identical shape. |
| useImperativeHandle condition | `highlightType.moveFocus && menuRef.current` | `highlightType.moveFocus && menuRef.current && !isSticky` (`isSticky = firstOptionSticky && index === 0`) | Yes when `firstOptionSticky` is undefined (isSticky is false). |
| Scroll function | `scrollOptionIntoView` → returns on `index < 0`, then `scrollElementIntoView(item)` = native `scrollIntoView({block:'nearest',inline:'nearest'})` through all ancestors | default `scrollToIndex` → `menuEl.scrollBy`, only the menu, skipped when `clientHeight <= 15` (AWSUI-60318); no `index < 0` guard | **Different.** This is the only behavioral gap. Needs the new option below. |
| Scroll on mount | Listbox effect calls ref with `highlightedIndex = -1`; initial `HighlightType('keyboard')` has `moveFocus: true` (use-highlight-option.ts:8,40), so the `index < 0` guard is what prevents a scroll to a group header with `data-mouse-target="-1"` (covered by highlight.test.tsx "does not scroll when a grouped list mounts without a highlight") | n/a for OptionList | Preserved by routing to `scrollOptionIntoView`, which keeps the guard. |
| Deps of imperative handle | `[moveFocus, menuRef]` | `[firstOptionSticky, moveFocus, menuRef]` | Extra stable dep; adding `scrollStrategy` (a constant) is harmless. |
| OptionsList `{...props}` | `{...listProps}` | `{...menuProps}` | Same spread. |
| OptionsList `isMultiSelect` | from the spread (`listProps.isMultiSelect = selectionType === 'multi' \|\| undefined`, use-listbox.ts:189) | explicit `isMultiSelect={isMultiSelect}` **after** the spread, so it overrides | Adapter must pass `isMultiSelect={mergedListProps.isMultiSelect}`; otherwise `aria-multiselectable` would be lost. |
| OptionsList `stickyItemBlockSize` | not set → `undefined` → no inline `scroll-padding-block-start` | always set: `stickyOptionBlockSize`, initial `firstOptionSticky ? fallbackItemHeight : 0` → `0` | **DOM-only difference**: OptionList's list gets inline `scroll-padding-block-start: 0px` instead of none (`auto`). Browsers resolve `auto` to 0, so scroll results are the same. See Risks. |
| renderOptions `filteringValue` | `''` | prop (required) | Adapter passes `filteringValue=""`. |
| renderOptions `hasDropdownStatus` | not passed (undefined) | prop | Not passed → undefined → same `padBottom` on last item. |
| renderOptions `selectionType` | `selectionType` (required) | prop (optional; render-options defaults `'single'`) | Adapter passes `controller.selection.selectionType`. |
| renderOptions `screenReaderContent` | `controller.announcement` | prop | Same value passed. |
| renderOptions `firstOptionSticky` / `stickyOptionRef` | not passed | `firstOptionSticky`, `stickyOptionRef` | `firstOptionSticky` undefined → `isSticky` false → ref never attached. Same output. |
| renderOptions `renderOption` | `ItemProps['renderOption']` | `SelectProps.SelectOptionItemRenderer \| MultiselectProps.MultiselectOptionItemRenderer` | Identical type (item.tsx:49 declares exactly this union). |
| listBottom | none | renders `<div role="option">` only when truthy | Not passed → `null`. Same output. |
| statusType default | not set → OptionsList default `'finished'` | not set by PlainList (comes from menuProps) → `'finished'` | Identical (use-listbox does not set it). |

Conclusion: with the adapter below, PlainList renders the same tree for OptionList except the scroll function (fixed by the new option) and one inline style value that has no visible or scroll effect.

## Proposed PlainList change (minimal)

In `src/internal/components/listbox/parts/plain-list.tsx`:

1. Add to `SelectListProps`:
   ```ts
   /**
    * How the highlighted option is scrolled into view.
    * `menu` (default) scrolls only the list itself. `ancestors` scrolls through all scrollable ancestors,
    * for a list that is not its own scroll container, such as in OptionList.
    */
   scrollStrategy?: 'menu' | 'ancestors';
   ```
2. Destructure `scrollStrategy = 'menu'`.
3. Import `{ scrollOptionIntoView }` alongside the default `scrollToIndex` from `./scroll-to-index`.
4. In `useImperativeHandle`, call `(scrollStrategy === 'ancestors' ? scrollOptionIntoView : scrollToIndex)({ index, menuEl: menuRef.current })`; add `scrollStrategy` to deps.

Default `'menu'` runs exactly today's code for Select, Multiselect, the sticky-item dev page, and VirtualList (which receives `SelectListProps` but ignores the new optional field). No other PlainList prop changes; no prop becomes optional, because the adapter passes `filteringValue=""` explicitly. The `SelectListProps` name stays to avoid churn in Select/Multiselect files.

## Adapter plan

`src/internal/components/listbox/index.tsx`:
- Replace `import List, { ListProps } from './parts/list'` with `import PlainList, { SelectListProps } from './parts/plain-list'`.
- `useRef<SelectListProps.SelectListRef>(null)`.
- Render:
  ```tsx
  <PlainList
    ref={scrollToIndex}
    menuProps={mergedListProps}
    getOptionProps={getOptionProps}
    filteredOptions={options}
    filteringValue=""
    highlightType={controller.highlightType}
    selectionType={controller.selection.selectionType}
    isMultiSelect={mergedListProps.isMultiSelect}
    screenReaderContent={controller.announcement}
    renderOption={renderOption}
    scrollStrategy="ancestors"
  />
  ```
- Update the comment on the scroll effect: "`List` checks `moveFocus`" → "`PlainList` checks `moveFocus`".
- `ListboxProps` keeps its public-to-internal shape (`renderOption?: ItemProps['renderOption']`, `listProps?: Partial<ListElementProps>`, `getOptionProps?: GetOptionProps`), so `src/option-list/internal.tsx` (which derives `ListboxRenderItem` from `ListboxProps['renderOption']`) needs no change.

`src/internal/components/listbox/use-listbox.ts`: no change (its `ListElementProps`/`GetOptionProps` are structurally identical to `MenuProps`/use-select `GetOptionProps`).

`src/internal/components/listbox/parts/scroll-to-index.ts`: no code change; the doc comment on `scrollOptionIntoView` ("Used when the list is not its own scroll container, such as in OptionList") stays accurate.

Delete `src/internal/components/listbox/parts/list.tsx`.

## Line estimates (excluding deleted list.tsx, 78 lines)

- `plain-list.tsx`: about +8 / −2 (prop + doc comment, destructure, import, call site, deps).
- `listbox/index.tsx`: about +7 / −6 (import, ref type, JSX props, comment).
- `use-listbox.ts`: 0.
- Total: about 15–25 changed lines. Well under 60.

## Test impact

- No unit test imports `parts/list`. Nothing to move.
- OptionList unit tests (`src/option-list/__tests__/*.test.tsx`, especially `highlight.test.tsx`, which mocks `HTMLElement.prototype.scrollIntoView` and asserts call counts and `{block:'nearest', inline:'nearest'}`, plus the mount-without-highlight case) cover the `ancestors` path end to end and must pass unchanged.
- `listbox/__tests__/scroll-to-index.test.ts` covers the default `menu` path and must pass unchanged.
- Select and Multiselect unit tests (`src/select/__tests__`, `src/multiselect/__tests__`) cover the default path and must pass unchanged.
- Optional: add one PlainList-level unit test asserting that `scrollStrategy="ancestors"` calls `scrollIntoView` and that index `-1` does not scroll. Not required since OptionList tests already exercise it.
- Verification commands (from docs/RUNNING_TESTS.md):
  - `TZ=UTC node_modules/.bin/jest -c jest.unit.config.js src/option-list src/internal/components/listbox src/select src/multiselect`
  - `npx tsc -p tsconfig.json --noEmit` (or `npm run build` if the project's type check is part of build) and `npx eslint` on the changed files.
  - Documenter/test-utils snapshot tests (`src/__tests__/snapshot-tests`) should not change, since no public interface changes.

## Public API check

No file under any component's `interfaces.ts` changes. `SelectListProps`, `ListboxProps`, and `scroll-to-index.ts` are internal (`src/internal/components/...`). OptionList's documented props are untouched.

## Risks

1. Inline style: OptionList's list element gains `style="scroll-padding-block-start: 0px"` (from `stickyItemBlockSize={0}`). `scroll-padding: auto` resolves to 0 in Chrome, Firefox, and Safari, so `scrollIntoView` results are the same. No OptionList unit test asserts the list's inline style (checked `src/option-list/__tests__`). If a reviewer wants zero DOM diff, the fix is out of scope for "default path unchanged" (changing PlainList's sticky expression would alter Select's DOM), so the recommendation is to accept it.
2. `isMultiSelect` override: forgetting to pass `isMultiSelect` in the adapter drops `aria-multiselectable` for multi OptionList. Covered by `option-list-a11y.test.tsx` / multi-selection tests; call it out in the implementation step.
3. PlainList now imports both scroll functions; trivial bundle impact (the named export lives in the same module already bundled for Select).
4. PlainList's Select-specific types (`SelectProps`, `MultiselectProps` imports) now also serve OptionList. That coupling already exists through `item.tsx` and `render-options.tsx`, so it adds nothing new.

DECISION: GO
Reasons: (a) the only PlainList change is an optional `scrollStrategy` prop defaulting to `'menu'`, which runs today's exact code for Select, Multiselect, VirtualList, and the dev page; (b) the product change is about 15–25 lines plus deleting list.tsx; (c) no public `interfaces.ts` or documented prop changes, and `use-listbox.ts` and `option-list/internal.tsx` need no edits.
