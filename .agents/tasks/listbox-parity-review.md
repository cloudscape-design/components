# Listbox-parity refactor: behaviour-neutrality review

The working tree shares one list engine (`useOptionList` + `useSelectDropdown`, under `src/option-list` and
`src/internal/components/select-dropdown`) across Select, Multiselect, embedded Multiselect, and the public
OptionList, replacing the old `src/select/utils/use-select.ts` + `src/internal/components/options-list` stack. This
review independently re-derives each behaviour from the pre-refactor baseline and confirms it is preserved for every
component except the public OptionList, which is intentionally allowed to differ. Baseline is `b9c34f236` (read via
`git show b9c34f236:`); HEAD `eb7bdcc69` is the committed refactor and the three-plus uncommitted edits are the
parity fixes. I compared the baseline `use-select.ts`, `use-multiselect.tsx`, Select/Multiselect/embedded internals
and keyboard/open-state utils line-for-line against the working-tree `use-option-list.ts`,
`use-select-dropdown.ts`, the selection models, and the component internals.

Watch for: nothing blocking. The one real code fix (single-selection falsy-value guard) is present and correct; the
embedded-focus and Escape parity rules are routed through a documented `embeddedBehavior` option and `onEscape`
plumbing; the two cleanups (use-open-state move, type-only SelectProps import) are complete; and the required unit
and regression tests exist, are sound, and would pass at baseline semantics. Recorded verification evidence
(quick-build, tsc, eslint, jest) is present, internally consistent, and corroborated by the on-disk `/tmp` logs.

**Verdict**: APPROVED

## High-level view

The engine split is the core design move: `useOptionList` owns highlight, keyboard, selection and rendering; the
list is embedded (a tab stop that owns its focus) or wrapped by `useSelectDropdown` (which adds open-state,
trigger, filter, close-on-select and close-on-Escape). Select and Multiselect compose `useSelectDropdown`; embedded
Multiselect composes `useOptionList` directly; the public OptionList also composes `useOptionList` directly but with
the default options. Selection logic moved into pure `singleSelection`/`multiSelection` models that are byte-for-byte
equivalent in observable output to the baseline `getGroupState`/`updateSelectedOption`/`toggleAll` code.

The one place three variants genuinely differed before the refactor is embedded focus/pointer behaviour, and the
refactor keeps all three by a single documented switch: `embeddedBehavior: 'embedded-multiselect'` restores the old
mount highlight and "focus goes Home when nothing is highlighted" with no pointer skip and no mouse-leave clear;
the default `'option-list'` carries the new public-OptionList rules; and the dropdown variant (`embedded: false`)
drives focus from the trigger/filter. Only embedded Multiselect passes `'embedded-multiselect'`, only the public
OptionList uses the default, so the behaviour each component had before is exactly the behaviour it keeps.

Escape is gated the same way: the shared keyboard handler now acts only when an `onEscape` is supplied, and each
caller supplies exactly what reproduces its baseline. The dropdown passes `closeAndFocusTrigger` (close + refocus,
with `stopPropagation`), embedded passes a no-op (stops propagation, does nothing — the baseline embedded branch),
and the public OptionList passes nothing (Escape propagates — the intended new behaviour).

The cleanups move `use-open-state.ts` into `list-container/utils` so ButtonDropdown depends only on layer-0
list-container, and make `prepare-options.ts`'s `SelectProps` import type-only so layer-0 `option` carries no
runtime edge into `select`. A new ESLint `no-restricted-imports` rule enforces that `option-list` and
`select-dropdown` import only types from `select`/`multiselect`.

<details>
<summary>Issues (0)</summary>

No actionable findings. All HEAD parity checks hold for the non-OptionList components, the cleanups are complete,
and the required tests exist and are sound.

</details>

<details>
<summary>Details</summary>

### Embedded-Multiselect focus parity via `embeddedBehavior`

Baseline `use-select.ts` gave the always-open embedded dropdown two focus behaviours: an open-time `useEffect`
(`isOpen && !prevOpen && !hasFilter`, mouse branch since `openedWithKeyboard` is `false`) that highlighted the
selected option with the mouse highlight, else the first option; and a `menuProps.onFocus` that ran
`goHomeWithKeyboard()` only when `!highlightedOption`, with `onBlur` resetting the highlight and no mouse-leave
handler. The working tree reproduces this exactly under `embeddedBehavior: 'embedded-multiselect'`: a one-shot mount
effect (`embedded && !isOptionListBehavior && options.length > 0`) highlights selected-else-first with
`setHighlightedIndexWithMouse(..., true)` / `highlightFirstOptionWithMouse()`, and the `else if (embedded)` branch
sets `onFocus → goHomeWithKeyboard()` only when nothing is highlighted and `onBlur → resetHighlightWithKeyboard()`,
with no `onMouseDown` pointer-skip and no `onMouseLeave`. `src/multiselect/embedded.tsx` passes
`embeddedBehavior: 'embedded-multiselect'`.

The public OptionList (`StandaloneOptionList`) calls `useOptionList` without `embeddedBehavior`, so it keeps the
default `'option-list'` rules (no highlight until interaction, pointer-focus adds no keyboard highlight, mouse-leave
clears when unfocused). The switch is documented in the hook's `embeddedBehavior` prop doc. The one edge where the
mount effect sets its done-flag even when `options.length === 0` matches baseline, which also would not re-highlight
on a later render once `prevOpen` is set.

### Escape routing

The shared `useMenuKeyboard` changed from "always `stopPropagation()` + `closeDropdown()`" to "act only when
`closeDropdown` is defined". The dropdown (`use-select-dropdown.ts`) passes `onEscape: closeAndFocusTrigger`
(`triggerRef.focus(); closeDropdown()`), matching baseline's non-embedded branch and keeping `stopPropagation`
because the handler is defined. Embedded passes `onEscape: () => {}`, which still triggers `stopPropagation` while
doing nothing — matching baseline's embedded branch (`if (!embedded)` was false, yet `stopPropagation` still ran).
The public OptionList passes no `onEscape`, so Escape now propagates — the sole intended OptionList-only change.

### Selection models vs baseline

`singleSelection.getGroupState` guards the child count with `!!child.value && child.value === selectedValue`,
restoring baseline's `__selectedValuesSet` built from `!!item.value`; an empty-string child value is never counted
even when the selected value is also falsy. `selected` is always `false` for single-select groups and
`indeterminate = totalSelected > 0 && totalSelected !== children.length`, as at baseline.

`multiSelection` reproduces baseline `use-multiselect.tsx`: `isAllSelected` over all non-parent options (select-all
excluded from the set on both sides); `toggleAll` keyed on `isAllVisibleSelectableSelected` keeping hidden
selections and toggling only visible enabled options; group toggle restricted to visible, enabled children via
`findOptionIndex`; the disabled-counts-as-selected rule in `toggle`; group state counting `!!item.value`; and
select-all `{ selected: isAllSelected, indeterminate: !isAllSelected && isSomeSelected }`.

### Open/highlight, focus routing, type-ahead, keyboard

`use-select-dropdown.ts`'s highlight-on-open effect is the negated-guard equivalent of baseline's
(`!isOpen || prevOpen || options.length === 0 || hasFilter` returns early): keyboard open → selected-else-first with
keyboard highlight, mouse open → selected (if present and visible) else first with mouse highlight, filter → nothing.
`activeRef = hasFilter ? filterRef : listRef`, trigger `onFocus → closeDropdown`, close refocuses the trigger — all
as baseline. `preventNativeSpace` splits into the list handler (always `true`) and the combobox/filter handler
(`!!highlightedOption && highlightType.type === 'keyboard'`), together equal to baseline's
`!hasFilter || (highlightedOption && keyboard)`. The Up/Down wrap and child-boundary rule in `navigation` matches
baseline `goUp`/`goDown`.

`useTypeAhead` is `useNativeSearch` renamed. Select wires closed type-ahead to `selectOption` and open type-ahead to
keyboard highlight (`isEnabled: filteringType === 'none' && !readOnly`), matching baseline; Multiselect enables
type-ahead only while open with keyboard highlight and `interactiveGroups: true`, matching baseline. With a filter,
`getListProps` deletes `onKeyDown` and the list's `aria-activedescendant`, moving them to the filter input, as
baseline did via its `if (!hasFilter)` guard.

### Unaffected consumers

Autosuggest renders through its own `src/autosuggest/{plain-list,virtual-list,options-list}` and imports nothing
from `select`/`multiselect`/the old `options-list`, so its behaviour is untouched. PromptInput and chart-filter
reference only option-list CSS class names. ButtonDropdown's only change is the `use-open-state` import path. A repo
grep confirms no remaining references to `internal/components/options-list`, `select/utils/use-select`, or
`select/parts/plain-list`, and the old `options-list` directory is removed.

### Cleanups

`use-open-state.ts` and its test moved to `src/internal/components/list-container/utils/` (via rename, preserving
history); the two runtime importers (`button-dropdown/utils/use-button-dropdown.ts`,
`select-dropdown/use-select-dropdown.ts`) point to the new path; no `select-dropdown/use-open-state` references
remain; the moved test's `render-hook` import depth (`../../../../../__tests__/render-hook`) resolves correctly.
`prepare-options.ts` imports `SelectProps` with `import type`. The new ESLint rule guards the dependency direction.

### Tests

The pure selection-model suites (`single-selection.test.ts`, `multi-selection.test.ts`) assert `getGroupState` and
`getNextSelection` directly, including the empty-string guard, group indeterminacy, visible-vs-all group toggles,
and select-all computed over `allOptions` while keeping hidden selections — each reasoned from baseline. The four
regression suites cover embedded mount highlight (first and selected), keep-highlight-on-focus, focus-after-blur →
first option (baseline `goHomeWithKeyboard`), no mouse-leave clear, embedded Escape stop-propagation with no
selection change, Select/Multiselect Escape close + refocus trigger (list and filter paths), and the public
OptionList's distinct focus/blur/mouse-leave/Escape rules. Reasoning each expectation from baseline code confirms it
would hold at baseline semantics.

### Verification evidence

The recorded evidence is present and corroborated by the on-disk logs (`/tmp`, timestamps after the test-file
mtimes, so they reflect the current tree): quick-build finished; `tsc.log`/`eslint.log`/`eslint2.log` are empty
(clean/EXIT 0, including the two import-guarded folders); selection suites 15/15; regression suites 60/60; the full
targeted set 2624 passed, 1 skipped, 0 failed across select, multiselect, option-list, select-dropdown,
list-container, option, selectable-item, autosuggest, button-dropdown, prompt-input, property-filter, chart-filter;
and the test-utils selectors snapshot passed with no churn (a `.ts` move changes no hashed class names). Integration
tests (real Escape/focus) were not run; they are the only outstanding guard and are covered at the unit level. The
named pre-existing/environmental failures (documenter snapshot, option-list functional-tests, prefer-live-region
eslint test, ESM theming/flashbar) are out of scope.

</details>

<details>
<summary>File map</summary>

- `src/option-list/use-option-list.ts` — shared list engine; `embeddedBehavior` + `onEscape` options.
- `src/option-list/selection/{single,multi}-selection.ts` — pure selection models; single-selection falsy guard.
- `src/option-list/internal.tsx` — public (`StandaloneOptionList`, default rules) and controlled list views.
- `src/internal/components/select-dropdown/use-select-dropdown.ts` — dropdown layer (open-state, trigger, filter,
  highlight-on-open, Escape → close + refocus).
- `src/internal/components/list-container/utils/use-keyboard.ts` — Escape gated on `onEscape`.
- `src/internal/components/list-container/utils/use-open-state.ts` — moved from select-dropdown.
- `src/{select,multiselect}/internal.tsx`, `src/multiselect/{use-multiselect.tsx,embedded.tsx}` — compose the engine.
- `src/button-dropdown/utils/use-button-dropdown.ts` — use-open-state import path.
- `src/internal/components/option/utils/prepare-options.ts` — type-only SelectProps import.
- `eslint.config.mjs` — no-restricted-imports guard for option-list/select-dropdown.
- Tests: `src/option-list/selection/__tests__/*`, `src/{select,multiselect}/__tests__/*-escape.test.tsx`,
  `src/multiselect/__tests__/multiselect-embedded.test.tsx`, `src/option-list/__tests__/option-list.test.tsx`.

Full diff: `git diff b9c34f236` in `/Users/amanabiy/Documents/components`.

</details>
