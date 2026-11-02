# Implementation Plan: `refactor: Move shared option list parts to listbox`

Worktree: `/Users/amanabiy/Documents/components/.worktrees/refactor-move-listbox-parts`
(branch `refactor/move-shared-listbox-parts`, HEAD = `origin/main` 544e4286a). Run every command
with this directory as `cwd`; relative paths elsewhere land in the parent workspace.
Read-only reference: `.worktrees/pr3-option-list` (do not modify, do not copy its fixes).

## Findings that shape the plan

- `SelectionType = 'single' | 'multi'` already exists on origin/main in
  `src/internal/components/listbox/selection/interfaces.ts` (PR #5179 merged as 5a5372a42). Using it adds no
  dependency on `origin/refactor/add-listbox-selection-models` or any local fix branch.
- `renderOptions` (`src/internal/components/listbox/parts/render-options.tsx`) is called only by
  `src/select/parts/plain-list.tsx` and `src/select/parts/virtual-list.tsx`. It picks
  `useInteractiveGroups ? MultiselectItem : Item`, and `getItemProps` sets `hasCheckbox: checkboxes`
  (overriding anything from `getOptionProps`).
- Product call sites:
  - Select (`src/select/internal.tsx` L323) passes neither `checkboxes` nor `useInteractiveGroups` →
    `Item` with `hasCheckbox=false`, always.
  - Multiselect (`src/multiselect/internal.tsx` L257-258, `src/multiselect/embedded.tsx` L86-87) passes
    `checkboxes={true} useInteractiveGroups={true}` → `MultiselectItem` with `hasCheckbox=true`, always.
  - So in the product, `checkboxes === useInteractiveGroups` always. One `selectionType` prop reproduces both.
- Dev pages are the only places using other combinations:
  - `pages/select/item.permutations.page.tsx` renders `Item` directly, some permutations with
    `hasCheckbox: true` (single item with checkbox — never produced by the product).
  - `pages/dropdown/list-with-sticky-item.page.tsx` renders PlainList/VirtualList with
    `useInteractiveGroups={true}` but no `checkboxes` (multi item without checkbox). It has no
    `ScreenshotArea` and no integ test references it (grep of `src/` for `list-with-sticky` is empty).
- Test-utils and class names come from `src/select/parts/styles.scss`. `listbox/parts/option-group.tsx` already
  imports `../../../../select/parts/styles.css.js`; the moved files do the same, so generated class names
  and `src/__tests__/snapshot-tests/test-utils-selectors.test.tsx` do not change.
- Unit tests of components import from `lib/components`, so run `npm run quick-build` before jest.
- `src/autosuggest/plain-list.tsx` and its users (`autosuggest/options-list.tsx`, `autosuggest/virtual-list.tsx`,
  `prompt-input/components/menu-dropdown.tsx`) are a different PlainList. Do not touch them.

## Go/no-go on merging item.tsx + multiselect-item.tsx: GO

For the two combinations the product produces (single without checkbox, multi with checkbox), one component
branching on `selectionType` reproduces both DOM trees byte-for-byte (table below). `hasCheckbox` becomes dead
because it always equals `selectionType === 'multi'`. The only differences land on dev pages, analysed under Risks.

### Diff of `src/select/parts/item.tsx` (single) vs `src/select/parts/multiselect-item.tsx` (multi) and how the merged item reproduces it

| Aspect | item.tsx (Select) | multiselect-item.tsx (Multiselect) | Merged item |
|---|---|---|---|
| Extra props | — | `indeterminate` | `indeterminate?: boolean`, ignored in single branch (Select's getOptionProps sends `indeterminate`; today it falls into `restProps` and `getBaseProps` drops it, so single output is unchanged) |
| `parentProps` type | `{index, virtualIndex?, option, disabled}` | adds `indeterminate, highlighted, selected` | One `ItemParentProps` with the last three optional. render-options already passes the full multi shape to both items today |
| `disabled` | `option.disabled \|\| wrappedOption.disabled` | same | shared |
| `disabledReason` source | `wrappedOption.disabledReason` | `option.disabledReason \|\| wrappedOption.disabledReason` | branch on `isMulti` for the source; then `disabled && source ? source : ''` for both |
| Hooks | useRef, useHiddenDescription, useState, useEffect([highlighted]), useMergeRefs (in JSX) | same order | shared, same order; call `useMergeRefs(ref, internalRef)` once after the effect |
| renderOption item, parent row | `{type:'group', index: virtualIndex ?? index, option, disabled}` | adds `indeterminate: indeterminate ?? false, selected, highlighted` | keep both `toSelectOptionGroupItem` and `toMultiselectOptionGroupItem` helpers verbatim; pick by `isMulti` |
| renderOption item, select-all row | n/a (falls to item branch) | `{type:'select-all', option, indeterminate ?? false, selected, highlighted}` | multi branch only; single keeps today's fallthrough to item |
| renderOption item, child `parent` | `toSelectOptionGroupItem({index: parentProps.index, virtualIndex: parentProps.virtualIndex, option: parentProps.option, disabled: <child's disabled>})` | `toMultiselectOptionGroupItem({... disabled: <child's disabled>, highlighted/indeterminate/selected: parentProps.x ?? false})` | keep `toSelectOptionItem` and `toMultiselectOptionItem` verbatim. Keep `disabled: props.disabled` (the child's value) and `virtualIndex ?? index`. Do NOT copy pr3's `parentProps.disabled` or its dropped `virtualIndex` |
| renderOption call | `renderOption({ item, filterText: filteringValue })`, typed `SelectOptionItemRenderer` | typed `MultiselectOptionItemRenderer` | `renderOption` prop typed as the union. Call through a typed cast per branch (`renderOption as SelectProps.SelectOptionItemRenderer` / `as MultiselectProps.MultiselectOptionItemRenderer`); no `as any` |
| `ariaSelected` | `Boolean(selected)` | `isParent && indeterminate ? undefined : Boolean(selected)` | branch |
| `ariaChecked` | not passed (parent → `role="presentation"`) | `isParent && indeterminate ? 'mixed' : Boolean(selected)` | multi branch only |
| `disabled` on SelectableItem | `option.disabled` | `disabled` (combined) | branch |
| `isSelectAll`, `afterHeader`, `useInteractiveGroups={true}` | not passed | passed | multi branch only |
| Other SelectableItem props (`disableContentStyling`, `selected`, `isNextSelected`, `isPreviousSelected`, `highlighted`, `isParent`, `isChild`, `highlightType`, `ref`, `virtualPosition`, `padBottom`, `screenReaderContent`, `ariaPosinset`, `ariaSetsize`, `ariaDescribedby`, `value`, `withScrollbar`, `sticky`) | same | same | shared object; `{...baseProps}` stays last in both branches, so `data-*` analytics attributes (`data-group-index`, `data-child-index`, `data-test-index`, `data-mouse-target`) and `id` still reach `getAnalyticsSelectActionMetadata` unchanged |
| Wrapper `div` class | `clsx(styles.item, !isParent && wrappedOption.labelTag && styles['show-label-tag'])` | `styles.item` | branch |
| Checkbox | `!renderResult && hasCheckbox && !isParent` (never true for Select) | `!renderResult && hasCheckbox` with `checked={selected}`, `indeterminate={(isParent \|\| isSelectAll) && indeterminate}`, `disabled={disabled}` | single: no checkbox. multi: `!renderResult &&` the same CheckboxIcon props. Keep `isSelectAll` in `indeterminate` (pr3 dropped it, do not copy that) |
| `<Option>` | `customContent, option={{...wrappedOption, disabled}}, highlightedOption, selectedOption, highlightText, isGroupOption={isParent}` | same | shared element |
| Selected check icon | `!renderResult && !hasCheckbox && !isParent && selected` → `.selected-icon` with `InternalIcon name="check"` | none | single branch: `!renderResult && !isParent && selected` |
| Disabled reason (hidden description + Tooltip `.disabled-reason-tooltip`, `position="right"`, `onEscape`) | inside the `.item` div, after the icon; gated by `!renderResult && isDisabledWithReason` | sibling after the `.item` div, inside SelectableItem; same gate | shared fragment, placed per branch exactly as today. Do NOT copy pr3's "keep description with custom content" fix |
| Export | `React.memo(React.forwardRef(Item))` | same | same |

## Dead plumbing to remove

- `ItemProps.hasCheckbox` (always derivable from `selectionType`).
- `checkboxes` param and `hasCheckbox` output of `getItemProps` (`listbox/parts/get-item-props.ts`). Keep the
  function itself: it still produces the `data-*` test/analytics attributes.
- `checkboxes` and `useInteractiveGroups` on `RenderOptionProps` and `SelectListProps`. Both are replaced by
  `selectionType?: SelectionType` (default `'single'`).
- `src/select/parts/multiselect-item.tsx` (merged).
- Generic `ItemProps<T>` parameter (renderOption becomes the union).

Not removed: `isMultiSelect` on `SelectListProps` (feeds `OptionsList`, unrelated to the row), and
`useInteractiveGroups` on `useSelect` (logic; out of scope).

## Excluded from the move (considered)

`src/select/parts/virtual-list.tsx` (stays, imports only), `src/select/utils/use-select.ts`,
`src/multiselect/use-multiselect.tsx` logic, `src/select/utils/use-load-items.ts`, `src/select/parts/filter.tsx`,
`src/select/parts/trigger.tsx`, `src/select/parts/styles.scss`. None is an option-list row/list part, or the
task excludes it. No extra pure duplicates were found between select/multiselect parts and listbox beyond the
three below.

---

- [ ] 1. Commit `refactor: Move Select type-ahead hook to listbox`.
      Move the hook and its unit test, rename the hook and its option, and update callers. No logic change.
      Commands:
      `git mv src/select/utils/use-native-search.ts src/internal/components/listbox/use-type-ahead.ts`
      `git mv src/select/__tests__/use-native-search.test.ts src/internal/components/listbox/__tests__/use-type-ahead.test.ts`
      Edits:
      - `use-type-ahead.ts`: fix imports (`../option/interfaces`, `../option/utils/filter-options`,
        `../../hooks/use-debounce-callback`, `../../../types/option`). Rename `UseNativeSearchProps` →
        `UseTypeAheadProps`, `useNativeSearch` → `useTypeAhead`, option and `findMatchingOption` param
        `useInteractiveGroups` → `interactiveGroups`. Update the comment "when useInteractiveGroups is set" to
        "when interactiveGroups is set". Keep every other comment.
      - `__tests__/use-type-ahead.test.ts`: imports `../../../../__tests__/render-hook`, `../../option/interfaces`,
        `../use-type-ahead`; rename `useNativeSearch` usages and `describe('useNativeSearch'` → `describe('useTypeAhead'`.
      - `src/select/internal.tsx`: import `{ useTypeAhead } from '../internal/components/listbox/use-type-ahead'`;
        call `useTypeAhead({...})` (keep the local `handleNativeSearch` variable name to keep the diff small).
      - `src/multiselect/use-multiselect.tsx`: same import; call `useTypeAhead({ ..., interactiveGroups: useInteractiveGroups })`.
      Component-level type-ahead tests stay in `src/select/__tests__` and `src/multiselect/__tests__`.
      Files: the two moved files, `src/select/internal.tsx`, `src/multiselect/use-multiselect.tsx`.
      Verify: `npx eslint --fix` on the four files, then `npm run quick-build` succeeds, then
      `TZ=UTC node_modules/.bin/jest -c jest.unit.config.js src/internal/components/listbox src/select src/multiselect`
      passes. `git status` shows the two files as renames.

- [ ] 2. Commit `refactor: Share one option item between Select and Multiselect`.
      Merge the two item components into `listbox/parts/item.tsx`, switch render-options and the list
      components to `selectionType`, and remove the `hasCheckbox`/`checkboxes` plumbing. Depends on nothing from item 1.
      Commands:
      `git mv src/select/parts/item.tsx src/internal/components/listbox/parts/item.tsx`
      `git rm src/select/parts/multiselect-item.tsx`
      Edits:
      - `src/internal/components/listbox/parts/item.tsx`: implement the merged component following the table above.
        Imports become `../../../../icon/internal.js`, `../../../base-component`, `../../checkbox-icon`, `../../option`,
        `../../option/interfaces`, `../../options-list/utils/use-highlight-option.js`, `../../selectable-item`,
        `../../../hooks/use-hidden-description`, `../../../../tooltip/internal.js`, `../../../../types/option`,
        `../../../../select/interfaces`, `../../../../multiselect/interfaces`, `../selection/interfaces` (SelectionType),
        and `styles from '../../../../select/parts/styles.css.js'`. `ItemProps` gains
        `selectionType?: SelectionType` (default `'single'`) and `indeterminate?: boolean`, and loses `hasCheckbox`.
        Keep `virtualIndex`. Export `ItemProps` and `ItemParentProps`. Structure: shared hooks and `<Option>`,
        then `if (isMulti) return <multi JSX>; return <single JSX>;`, each a copy of today's JSX with the
        `hasCheckbox` conditions resolved (single: false, multi: true).
      - `src/internal/components/listbox/parts/render-options.tsx`: import `Item, { ItemParentProps } from './item'` and
        `SelectionType` from `../selection/interfaces`. Replace `checkboxes`/`useInteractiveGroups` with
        `selectionType = 'single'`. Render `<Item selectionType={selectionType} ... />` and drop the `ListItem` choice.
        Leave the parentProps object at L111-119 unchanged.
      - `src/internal/components/listbox/parts/get-item-props.ts`: drop `checkboxes` from the interface/params and
        `hasCheckbox` from the result.
      - `src/internal/components/listbox/__tests__/get-item-props.test.ts`: drop `checkboxes` inputs and
        `hasCheckbox` expectations. Rename "…with checkboxes and keyboard" to "…with keyboard".
      - `src/select/parts/plain-list.tsx` and `src/select/parts/virtual-list.tsx`: in `SelectListProps` replace
        `checkboxes?` and `useInteractiveGroups?` with `selectionType?: SelectionType`; destructure and pass
        `selectionType` to `renderOptions`.
      - `src/multiselect/internal.tsx` and `src/multiselect/embedded.tsx`: replace `checkboxes={true}
        useInteractiveGroups={true}` with `selectionType="multi"`. `src/select/internal.tsx` needs no change (default single).
      - `src/select/utils/use-select.ts`: `import { ItemProps } from '../../internal/components/listbox/parts/item'`.
      - `pages/select/item.permutations.page.tsx`: import `Item, { ItemProps }` from
        `~components/internal/components/listbox/parts/item`. Replace `hasCheckbox: [true]` with
        `selectionType: ['multi']`, `hasCheckbox: [false]` with `selectionType: ['single']`, and
        `hasCheckbox: [false, true]` with `selectionType: ['single', 'multi']`.
      - `pages/dropdown/list-with-sticky-item.page.tsx`: `useInteractiveGroups={true}` → `selectionType="multi"`.
      Files: listed above.
      Verify: `npx eslint --fix` on changed files; `npm run quick-build` succeeds; `npx tsc -p pages/tsconfig.json --noEmit`
      passes; `TZ=UTC node_modules/.bin/jest -c jest.unit.config.js src/internal/components/listbox src/internal/components/selectable-item src/select src/multiselect src/__tests__/snapshot-tests/test-utils-selectors.test.tsx`
      passes with no snapshot updates. Key suites: `select/__tests__/{render-option,disabled,analytics-metadata,select-a11y,group-state}.test.tsx`,
      `multiselect/__tests__/{render-option,select-all,group-state,analytics-metadata,multiselect-embedded}.test.tsx`.

- [ ] 3. Commit `refactor: Move PlainList to listbox`.
      Move Select's PlainList (and `SelectListProps`) into listbox, keeping name and behavior (sticky first option,
      `listBottom`, `scrollToIndex` from `./scroll-to-index`, `withScrollbar`). Depends on item 2 (moves the edited file).
      Command: `git mv src/select/parts/plain-list.tsx src/internal/components/listbox/parts/plain-list.tsx`
      Edits:
      - `plain-list.tsx` imports: `./common`, `./render-options`, `./scroll-to-index`, `../../option/interfaces`,
        `../../options-list`, `../../options-list/utils/use-highlight-option`, `../selection/interfaces`,
        `../../../../multiselect/interfaces`, `../../../../select/interfaces`, `../../../../select/utils/use-select`
        (GetOptionProps, MenuProps), `styles from '../../../../select/parts/styles.css.js'` (`list-bottom` class).
        There is no import cycle: use-select → listbox/parts/item, which does not import plain-list.
      - Importers: `src/select/internal.tsx` (`PlainList, { SelectListProps }`), `src/select/parts/virtual-list.tsx`
        (`SelectListProps` from `../../internal/components/listbox/parts/plain-list`), `src/multiselect/internal.tsx`,
        `src/multiselect/embedded.tsx`, `src/multiselect/use-multiselect.tsx` (`SelectListProps`),
        `pages/dropdown/list-with-sticky-item.page.tsx` (`~components/internal/components/listbox/parts/plain-list`).
      Files: listed above.
      Verify: `npx eslint --fix` on changed files; `npm run quick-build`; `npx tsc -p pages/tsconfig.json --noEmit`;
      the same jest command as item 2 passes. Then `npm run lint` passes, and `git diff --stat origin/main` shows
      three renames (use-type-ahead, its test, item) plus plain-list, roughly 700 changed lines in total.

- [ ] 4. Final check before the PR.
      Run `npm run test:unit` (full unit suite, including the documenter and test-utils snapshot tests) and confirm
      no snapshot changes. If a dev server is available, run the Select/Multiselect integ suites
      (`NODE_OPTIONS=--experimental-vm-modules node_modules/.bin/jest -c jest.integ.config.js src/select/__integ__ src/multiselect/__integ__`).
      PR title: `refactor: Move shared option list parts to listbox`. Do not push.
      Verify: all commands exit 0; `git log origin/main..HEAD --oneline` shows the three commits.

## Risks

- **Dev page DOM.** On `pages/select/item.permutations.page.tsx`, the former single-with-checkbox permutations now
  render as multi. Visually they should be identical: the same checkbox in the same place, no check icon, the same
  `disabled` (the fixture sets `DropdownOption.disabled`), and `complexOptionGroup` has no `type: 'parent'`, so it
  does not get group styling. The DOM gains `aria-checked` and the `interactiveGroups` class, which only affects
  `cursor`. Expect no visual-regression diff; if CI reports one on this page, it comes from this mapping.
- **Sticky-item page.** `pages/dropdown/list-with-sticky-item.page.tsx` gains checkboxes, because multi rows always
  render one. The page has no ScreenshotArea and no integ coverage. Multi is still the right choice: only the multi
  row honours `afterHeader`, which the page uses.
- **Copying pr3 fixes by accident.** The pr3 item differs from today in four ways: `parentProps.disabled`, no
  `virtualIndex`, select-all left out of the checkbox `indeterminate`, and the description kept with custom content.
  All four are behavior changes. The coder must use the current files, not pr3, as the source of the JSX.
- **Union renderOption typing.** A cast per branch keeps type safety; `as any` is banned by repo conventions.
- **Import sorting.** The repo uses an eslint import-sort rule. Run `eslint --fix` on every touched file.
- **Stale lib.** Component tests run against `lib/components`; always `npm run quick-build` before jest.
