# Select, Multiselect and OptionList on one shared listbox core

PR 5 (plan steps 12–14, commits `45567f02d`, `1b0f891c9`, `b2f8bf0ec` on `feat/listbox-unified-2`, diffed against PR 4's last commit `866fcb0c1`) removes the parallel listbox implementation in `useSelect` and `useListbox`. The list prop types move to `listbox/interfaces.ts`. A new `useListboxCore` now holds highlight state, the wrapped keyboard setters, the choose guard, menu keyboard handling, mouse handlers, option props and the live announcement. `useListbox` and `useSelect` keep only their own focus, open-state, scroll and type-ahead concerns. Select and Multiselect no longer call `useAnnouncement` themselves; `useSelect` returns `announcement`. The change follows spec section 3 closely, and behavior parity holds on every path traced.

Watch for: the core types `getOptionProps` as `ReturnType<typeof getListboxOptionProps>` rather than the spec's `GetOptionProps` (documented deviation, LOW). `fix/select-multiselect-listbox-alignment` moved again to `a47f825be` in another worktree, and the PR 5 branch check doesn't record it (LOW, not caused by this work).

**Verdict**: APPROVED

## High-level view

The core matches spec section 3 in props, return fields and body order: `useUniqueId('option-list')`, `connectOptionsByValue(options, selection.selectedOptions)`, `useHighlightedOption`, the wrapped setters, `interactivityCheck`, `selectOption`, `useMenuKeyboard`, `getListMouseHandlers`, `getOptionProps`, `isAnnouncedSelected`, `useAnnouncement`. The `withScroll` comment was generalized and moved with the code, as was the Space comment. The one shape difference is the `getOptionProps` return type. The progress file explains it: `GetOptionProps` returns `ItemProps`, which would break `delete props.id` in an unchanged Select test. The new type is the one both hooks had inferred before.

`useListbox` keeps `UseListboxProps` and `UseListboxApi`. The hook order is the one the spec gives: refs, `scrollRequest` and `requestScroll`, core, local `isHighlightable`, follow, `useTypeAhead`, `getListProps`. Highlight follow uses the raw `core.highlight.*` setters, so it still does not request a scroll. Type-ahead uses the wrapped `core.highlightOption`, so it still scrolls.

`useSelect` calls the core with the exact spec `onSelect` body (`option.type === 'select-all' && toggleAll`, otherwise `updateSelectedOption(option.option)`, then `closeDropdownIfNecessary()`). It passes `spaceSelects: hasFilter ? 'keyboard-highlight' : 'always'`, `preventNativeHomeEnd: !hasFilter`, `onEscape: () => handleEscape()` and no `onKeyboardHighlight`. Only `getParent` gets a default (module-level `noParent`). The `selection` JSDoc states the `selectedOptions` invariant. `getTriggerProps` is untouched. It still returns the raw `highlightOptionWithKeyboard` as `highlightOption`. Refs stay before the core call (design-review NIT 2), then `useOpenState`, `closeDropdownIfNecessary`, `handleEscape`.

The process evidence is complete. The acceptance greps are empty (re-run here). No test file, no component `interfaces.ts`, nothing under `src/autosuggest` and nothing under `src/property-filter` changed (`git diff --stat` re-run here). The progress file records UNIT 93/93 suites and 1346/1346 tests (equal to the end of PR 4), FUNC 10/10 and 1987/1987 (equal to the baseline), SNAP 113/113 tests and 111/111 snapshots without `-u`, and the risk 15–18 guard suites at 565/565. The titles are `refactor: …` with no scope. The reflog shows only `commit` entries, `stash@{0}` is still `7f1b9f34f`, and `feat/listbox-unified` is still `9a6541a01`.

<details>
<summary>Issues (3)</summary>

1. **Core `getOptionProps` type differs from spec** (LOW, confirmed): `UseListboxCoreApi.getOptionProps` returns `ReturnType<typeof getListboxOptionProps>`, not `GetOptionProps`. Accept it as documented. Optionally add a spec revision note so the spec and the code agree.
2. **Branch drift not recorded for PR 5** (LOW, confirmed): `fix/select-multiselect-listbox-alignment` is now `a47f825be` ("chore: Trigger redeploy", 11:48, `.worktrees/fix-listbox-alignment`). That is after PR 1's recorded drift to `24a384784` and before PR 5's first commit at 12:02. Add a line to the PR 5 branch check saying another worktree moved it and this work did not.
3. **`use-select.ts` shrank less than estimated** (NIT, confirmed): 350 → 331 lines, against the spec's estimate of about −90. The progress file explains why, and the acceptance greps show no listbox logic is left. No action needed beyond the existing note.

</details>

<details>
<summary>Details</summary>

### Parity of the Select keyboard and mouse paths

Before this PR, `useSelect` passed the raw `moveHighlightWithKeyboard`, `goHomeWithKeyboard` and `goEndWithKeyboard` to `getListboxNavigation` and `useTriggerKeyboard`. Now it gets the core's wrapped setters. With no `onKeyboardHighlight`, the wrapper adds only `onKeyboardHighlight?.()`, a no-op, so the effect is identical. `selectOption` now reaches `useMenuKeyboard` as `() => selectOption()` instead of directly. `use-keyboard.ts:65,70` calls it with no arguments in both places, so the behavior is the same. The old `preventNativeSpace` was `!hasFilter || (highlightedOption && highlightType.type === 'keyboard')`, which could be an object or `undefined`. The new expression gives the same truthiness as a boolean, and `useMenuKeyboard` only tests it with `if`. For OptionList, `closeDropdown: onEscape` is `undefined`. That matches the old missing key, because `use-keyboard.ts:58` checks `if (closeDropdown)`.

Mouse handlers used to be built lazily inside `getMenuProps` and are now built once per render in the core. Both versions close over the same render's `selectOption` and `setHighlightedIndexWithMouse`, so clicks and hovers behave the same.

### Selected-options source switch

Rows now render as selected from `connectOptionsByValue(options, selection.selectedOptions)` instead of `useSelect`'s own `selectedOptions`. For Select, `internal.tsx:142,160` passes `singleSelection(selectedOptions)`, built from the same `[selectedOption]` array, and `singleSelection` keeps `slice(0, 1)`. For Multiselect, `use-multiselect.tsx:124` builds `multiSelection(selectedOptions, …)` and that model returns the same array (`multi-selection.ts:76`). The step-14 caller grep found only the definition and these two calls, so no other caller can break the invariant. The open effect reads `core.connectedSelected` and gets the same list.

### Announcement moved into `useSelect`

`useAnnouncement` holds a ref and an effect with no dependency array that records the last announced group in a `requestAnimationFrame`. Moving the call from the component body into `useSelect` (inside the core) changes where that effect sits in the effect order. It now runs before `useSelect`'s open effect and the components' scroll effects instead of after them. This is likely harmless. The effect only schedules a frame callback and cancels it on the next render, so a state update from an earlier or later effect still leads to one re-render that cancels and reschedules it. OptionList already had this ordering. The inputs are the same values as before: `announceSelected`, `highlightedOption`, the same `parentMap` lookup, `selectedAriaLabel` (declared at `internal.tsx:105` and `use-multiselect.tsx:97`, before `useSelect`) and `renderHighlightedAriaLive`. FUNC, SNAP and `select-a11y` passed unchanged, which covers the announcement text.

### Hook order and ids

In both hooks the hook order changed but stays the same on every render. In `useSelect`, `useUniqueId('option-list')` still runs before `useUniqueId('dialog')`. In `useListbox`, it is still the only id call. With React 16, ids are random per mount, so no test or snapshot can depend on the call position. The unchanged SNAP result confirms this.

### Typing of `getOptionProps`

The spec declares `getOptionProps: GetOptionProps` on the core. The commit uses `ReturnType<typeof getListboxOptionProps>`, and its JSDoc says why: callers keep access to `key`, `id` and `data-mouse-target`, and `select/__tests__/group-state.test.tsx:91` (`delete props.id`) compiles without a test edit, which the pure-refactor rule requires. `useListbox` still narrows it to `GetOptionProps` through `UseListboxApi`, so OptionList's public hook type is unchanged. `useSelect`'s return type matches the base, where it was inferred from the same function.

### Branch hygiene

`feat/add-option-list` (`f06a65f61`) and `refactor/move-shared-listbox-parts` (`33cfa9917`) drifted as PR 1 recorded. `fix/select-multiselect-listbox-alignment` moved once more, from `24a384784` to `a47f825be`, by a `commit` in `.worktrees/fix-listbox-alignment` at 11:48. This work did not write it: PR 5's commits are in `.worktrees/listbox-unified-2`, from 12:02 on, and its reflog shows only its own commits. The PR 5 branch check in the progress file only names `feat/listbox-unified` and the stash, so this drift is missing from the record.

</details>

<details>
<summary>File map</summary>

- `src/internal/components/listbox/interfaces.ts`: new. `ListElementProps` and `GetOptionProps`.
- `src/internal/components/listbox/use-listbox-core.ts`: new shared core (199 lines).
- `src/internal/components/listbox/use-listbox.ts`: calls the core and re-exports the types (258 → 196 lines).
- `src/internal/components/listbox/index.tsx`, `parts/plain-list.tsx`: type imports from `./interfaces`. PlainList no longer imports `select/utils/use-select`.
- `src/select/utils/use-select.ts`: calls the core. New `getParent`, `selectedAriaLabel` and `renderHighlightedAriaLive` props, `announcement` in the return value, and the `MenuProps` re-export.
- `src/select/internal.tsx`, `src/multiselect/use-multiselect.tsx`: `useAnnouncement` removed. They pass the three props and use `announcement`.

Full diff: `git -C .worktrees/listbox-unified-2 diff 866fcb0c1..b2f8bf0ec` (8 files, +338/−218).

</details>
