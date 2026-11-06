# Shared list focus handling in useListbox, used by embedded Multiselect

`useListbox.getListProps` gains an optional `focus` setting that returns `onFocus` and `onBlur` (and `onMouseDown` with `skipAfterPointerDown`) for a list that is a tab stop. Two entry behaviors are defined: `'home-if-no-highlight'` (the current embedded Multiselect behavior) and `'first-selected-in-list-order-or-home'` (the future OptionList behavior). `useSelect` replaces its hand-written embedded onFocus/onBlur with `focus: embedded ? { entry: 'home-if-no-highlight' } : undefined`, and `OptionsList` takes a named `onMouseDown` prop. Select, dropdown Multiselect and embedded Multiselect keep the same behavior as before.

Watch for: nothing blocking. One cosmetic point: `OptionsList` now always renders `onMouseDown={onMouseDown}`, which is `undefined` for every current caller, so React attaches no listener (confirmed).

**Verdict**: APPROVED

## High-level view

The embedded path behaves exactly as before. The old handlers read `highlightedOption`, `goHomeWithKeyboard` and `resetHighlightWithKeyboard` from the `listbox` object in the same render (use-select.ts lines 108-119 destructure them from `listbox`). The new handlers read the same values inside `useListbox`, so they close over the same variables. The new blur also clears the pointer flag. On this path that is a no-op, because no `onMouseDown` is returned and the flag stays `false`.

Non-embedded Select and Multiselect pass `focus: undefined` and get the same props as before: no `onFocus`, no `onBlur`, no `onMouseDown`. The `OptionsList` wrapper still calls `fireNonCancelableEvent(onFocus)` with an undefined handler, the same as before the change.

Handler ordering is safe. `OptionsList` spreads `{...nativeAttributes}` before its explicit `onFocus`/`onBlur`/`onMouseDown`. The focus handlers travel as named props, not inside `nativeAttributes`, so nothing overwrites them. `nativeAttributes` still carries only `aria-activedescendant`. Neither `select/internal.tsx` nor `use-multiselect.tsx` overrides these keys after `getMenuProps()`.

The docstrings on `ListFocusOptions` and at the `useSelect` call site say that each setting keeps its component's current behavior and will be unified in a follow-up PR. The `onMouseDown` guard `pointerDown.current = listRef.current !== document.activeElement` matches the plan.

Process checks pass. There is exactly one commit on c7d7fce91 (`refactor: Share list focus handling through useListbox`, Conventional Commit with no scope) and it touches only 4 source and test files. `pages/tsconfig.tsbuildinfo` is untracked and not committed. `origin/refactor/use-listbox-in-select` still points at c7d7fce91, so nothing was pushed. The verification file covers every required check: quick-build, both tsc runs (pages has only the 2 known `Intl.ListFormat` errors), the jest set (1185/1185), `npm run build` followed by snapshot tests without `-u` (110/110, none written), and eslint on the changed files.

<details>
<summary>Issues (0)</summary>

No blocking or actionable issues.

</details>

<details>
<summary>Details</summary>

### Paths that are not yet used

`'first-selected-in-list-order-or-home'` and `skipAfterPointerDown` have no production caller on this branch. The 7 new unit tests in `use-listbox.test.tsx` are their only coverage. These tests exercise the hook directly and do not dispatch real DOM focus or mousedown events. As a result, the `listRef.current !== document.activeElement` guard is only tested in the case where the list is not focused. The "mousedown on an already focused list does not set the flag" case is not tested (possible gap, non-blocking; the follow-up that adopts OptionList should cover it with a DOM-level test).

</details>

<details>
<summary>File map</summary>

- `src/internal/components/listbox/use-listbox.ts`: `ListFocusOptions` type, `pointerDown` ref, and the focus, blur and mousedown handlers in `getListProps`.
- `src/internal/components/options-list/index.tsx`: named `onMouseDown` prop forwarded to the list element.
- `src/select/utils/use-select.ts`: the embedded branch uses `focus: { entry: 'home-if-no-highlight' }` instead of manual handlers.
- `src/internal/components/listbox/__tests__/use-listbox.test.tsx`: tests for both entries, blur reset, and the pointer flag.

Full diff: `git -C .worktrees/listbox-use-listbox diff c7d7fce91..HEAD`.

</details>
