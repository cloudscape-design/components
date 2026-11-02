# useSelect built on a shared useListbox hook

The branch `refactor/use-listbox-in-select` adds two local commits on top of `origin/refactor/move-shared-listbox-parts`. The first moves the list prop types (`MenuProps`, now `ListElementProps`, and `GetOptionProps`) into `src/internal/components/listbox/interfaces.ts`, so `PlainList` no longer imports Select's hook module. The second adds `useListbox`, which owns highlight state, keyboard navigation, the choose guard, mouse handlers, row props and the selected-announcement flag. `useSelect` now calls `useListbox` and keeps the dropdown-specific parts. To support `useListbox`, `useMenuKeyboard` gains two optional parameters whose defaults keep today's behavior. A line-by-line comparison with the base finds no behavior change for Select or Multiselect. The coder's evidence shows existing unit, snapshot and functional results equal to baseline, plus one new 18-test suite.

Watch for: the selected rows now come from `selection.selectedOptions` instead of the `selectedOptions` prop (likely harmless). All current callers build `selection` from the same array, and the contract is documented. Nothing blocking.

**Verdict**: APPROVED

## High-level view

`useListbox` is a short composition of helpers that already exist (`connectOptionsByValue`, `useHighlightedOption`, `getListboxNavigation`, `useMenuKeyboard`, and the `option-props` helpers). Its body is almost exactly the code removed from `useSelect`, with three things passed in as parameters: what happens when an option is chosen (`onSelect`), when Space chooses (`spaceSelects`), and what Escape does (`onEscape`). `useSelect` maps its old inline logic onto these. `onSelect` does select-all/toggleAll versus `updateSelectedOption`, then `closeDropdownIfNecessary`. `spaceSelects` is `hasFilter ? 'keyboard-highlight' : 'always'`, which matches the base `!hasFilter || keyboard highlight` rule. `onEscape` is the base Escape body. Because `onEscape` is always passed, Escape still always stops propagation, including in embedded Multiselect.

`useSelect` keeps its props and returns the same keys. `getOptionProps`, `selectOption` and `announceSelected` are forwarded from the listbox, and `highlightOption` is still the raw `highlightOptionWithKeyboard`. The highlight-on-open effect, embedded focus/blur, filter props, trigger keyboard and `closeDropdownAndRefocus` are textually unchanged apart from the renamed key handler. `useUniqueId('option-list')` still runs before `useUniqueId('dialog')`, so generated ids are unchanged.

The only input that changed is where selected rows come from. They now come from `selection.selectedOptions`, which can differ from the prop for the default `singleSelection`, because it keeps only the first entry. Select passes at most one option and Multiselect builds `multiSelection` from the same array, so the connected list is identical for real callers.

<details>
<summary>Issues (2)</summary>

1. **Selected rows read from `selection`, not the prop** (non-blocking) — If a future caller passes a `selection` built from different options than `selectedOptions` (or passes several options to the default single selection), highlight-on-open and row `selected` state would change. The JSDoc on `UseSelectProps.selection` documents the precondition. A follow-up could drop the redundant `selectedOptions` input, or derive the default from it explicitly.
2. **Listbox parts still import Select CSS at runtime** (non-blocking, pre-existing) — `parts/plain-list.tsx`, `parts/item.tsx` and `parts/option-group.tsx` import `select/parts/styles.css.js`. This diff does not introduce it and the new hook imports nothing from `src/select`. It remains to be done before the listbox folder is fully independent of Select.

</details>

<details>
<summary>Details</summary>

### Line-by-line mapping of the base paths

```
base useSelect                                new
──────────────────────────────────────────    ─────────────────────────────────────────────
interactivityCheck / isHighlightable          useListbox (same helpers, same args)
connectOptionsByValue(options, selectedOpts)  useListbox: connectOptionsByValue(options, selection.selectedOptions)
useHighlightedOption                          useListbox → returned as `highlight`
useUniqueId('option-list')                    useListbox (still before 'dialog')
selectOption guard + toggleAll/update + close useListbox guard → onSelect(...) in useSelect
useMenuKeyboard(nav w/ highlightedOption,     useListbox, same nav args; closeDropdown: onEscape;
  preventNativeSpace, closeDropdown)            preventNativeHomeEnd defaults to false
getListMouseHandlers                          listbox.mouseHandlers
getListboxOptionProps                         listbox.getOptionProps
isAnnouncedSelected                           listbox.announceSelected
```

The filter path still sends keydown to the filter input (`getFilterProps().onKeyDown = listbox.onKeyDown`). Typing still calls `setFilteringValue` and `resetHighlightWithKeyboard`. The menu gets `onKeyDown`/`aria-activedescendant` only without a filter. The highlight-on-open effect uses the same setters (`highlightOptionWithKeyboard`, `goHomeWithKeyboard`, `highlightFirstOptionWithMouse`, `setHighlightedIndexWithMouse`) and the same dependencies, with `__selectedOptions` now an alias of `listbox.selectedOptions`. Arrow wrap still gets `highlightedOption`, which the "first child of a leading group" rule needs. Home/End are not prevented because `useSelect` does not pass `preventNativeHomeEnd`. The `useMenuKeyboard` Escape branch now checks `if (closeDropdown)`. Every existing caller passes a function, so they keep the old stop-and-close behavior. None of the section-D prototype parts (keyboard-highlight wrappers, announcement in the hook, `preventNativeHomeEnd: !hasFilter`) were ported.

The `onSelect`/`onEscape` closures reference `closeDropdownIfNecessary` and `handleEscape`, which are declared after the `useListbox` call. A comment in the code notes this. They only run from event handlers, so they never read an uninitialized binding.

### Selection source

```ts
// base
const __selectedOptions = connectOptionsByValue(options, selectedOptions);
// new (inside useListbox)
const selectedOptions = connectOptionsByValue(options, selection.selectedOptions);
```

`singleSelection` slices to `selectedOptions.slice(0, 1)`. With two or more selected options and no explicit `selection`, the base would have marked every one as selected and could open-highlight a later one when the first is filtered out. The new code considers only the first. `select/internal.tsx:143` builds `selectedOption ? [selectedOption] : []`, and `use-multiselect.tsx:125` passes the same `selectedOptions` to both `multiSelection` and `useSelect`. Confidence that real behavior is unchanged: **likely** (traced both callers, plus unit/functional parity in the evidence).

### Test coverage

The new `use-listbox.test.tsx` covers four Space cases ('always'; 'keyboard-highlight' with nothing highlighted, after a mouse highlight, and after a keyboard highlight). It also covers Escape with and without `onEscape` (via `cancelBubble`), and Home/End with `preventNativeHomeEnd` off by default and on. For choosing, it checks that a disabled option and a non-interactive header are ignored, an interactive header is chosen, and Enter prevents default. The remaining cases cover mouse move/up and index -1, `getOptionProps` pass-through (highlighted, selected by value, row id, `data-mouse-target`, group state from `multiSelection`), and `announceSelected`. The plan proposed adding cases to the existing `use-keyboard.test.ts`. The coder skipped that to honor the no-existing-test-edit rule and covered the same options through `useListbox`.

Not tested directly: the `useSelect` → `useListbox` wiring. The existing `use-select.test.ts` and component suites cover it, and the evidence shows them passing at baseline counts.

### Evidence and repository state

`verification.md` reports the following results. TSC and ESLint are clean. Unit tests went from 74 suites / 1157 tests to 75 / 1175, and the delta is exactly the new suite. Snapshots are 110/110 with no `-u`, and functional tests are 1969/1969, both equal to baseline. The `__tests__` diff lists only the new file. `git status -sb` shows the branch ahead 2 with a clean tree, and `git ls-remote --heads origin refactor/use-listbox-in-select` returns nothing, so the branch was not pushed. The commit titles match the plan. Neither commit includes `package-lock.json`, tsbuildinfo, tsconfig or `.agents` files.

</details>

<details>
<summary>File map</summary>

- `src/internal/components/listbox/interfaces.ts` — new; `ListElementProps`, `GetOptionProps`.
- `src/internal/components/listbox/parts/plain-list.tsx` — imports the types from `../interfaces` instead of `select/utils/use-select`.
- `src/internal/components/listbox/use-listbox.ts` — new shared hook.
- `src/internal/components/listbox/__tests__/use-listbox.test.tsx` — new, 18 tests.
- `src/internal/components/options-list/utils/use-keyboard.ts` — optional `closeDropdown`, new `preventNativeHomeEnd` (default false).
- `src/select/utils/use-select.ts` — composes `useListbox`; 350 → 315 lines.

Full diff: `git -P -C /Users/amanabiy/Documents/components/.worktrees/listbox-use-listbox diff origin/refactor/move-shared-listbox-parts..HEAD`

</details>
