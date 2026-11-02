# Scroll on every keyboard highlight request in Listbox

The Listbox scroll effect used to depend only on `controller.highlightedIndex`, so any keyboard request that kept the index did not scroll. That covered End pressed again after scrolling away, type-ahead onto the row that was already hovered, and a mouse-to-keyboard switch on the same row. `useListbox` now keeps a `scrollRequest` counter. A `withScroll` wrapper bumps it after each keyboard highlight: ArrowUp/ArrowDown including the wrap-around, Home, End, the focus-entry highlight, and type-ahead. The counter is exposed on the controller, and the Listbox effect depends on `[highlightedIndex, scrollRequest]`. Mouse highlights and `resetHighlightWithKeyboard` don't touch it. `List` still scrolls only when `highlightType.moveFocus` is set, so hover never scrolls. Three tests cover the reported cases. The recorded evidence shows two of them failing before the fix and all three passing after.

Watch for: one minor gap. The only check that hover alone doesn't scroll is an assertion inside the type-ahead test, made before the keyboard step (possible, non-blocking).

**Verdict**: APPROVED

## High-level view

The fix lives entirely in the shared listbox hook and the Listbox wrapper. Wrapping the four keyboard highlight functions in one place means every keyboard path (arrow keys, wrap-around, Home/End, focus entry, type-ahead) bumps the counter, and nothing else does. `setHighlightedIndexWithMouse` is still called directly from `onMouseMove`. The scroll decision stays in `List` through `moveFocus`, so a mouse highlight that changes the index still runs the effect but does not scroll. The branch has no programmatic `highlightOption` on the controller, so the type-ahead path is the only `highlightOption` caller, and it is wrapped.

Scope is clean. Nothing changed in `src/select`, `src/multiselect` or `options-list/utils/use-highlight-option.ts`. Home/End `preventDefault` and the pointer-focus short-circuit are unchanged. `package-lock.json`, `pages/tsconfig.tsbuildinfo` (untracked), `.agents` and `.kiro` are not in the staged diff.

The three new tests reuse the existing `scrollIntoView` mock, `renderLongList` and `lastScrolledValue` helpers. They cover End pressed twice, hover followed by type-ahead on the same row, and hovering after keyboard focus with no scroll. The verification file records the before and after runs, plus lint and prettier.

<details>
<summary>Issues (1)</summary>

1. **Hover-alone coverage is indirect (possible, non-blocking)**: hover with no prior focus is only checked by the `not.toHaveBeenCalled` assertion before the type-ahead step. The standalone hover test focuses first. This is enough as is. Optionally add a test that hovers two rows on an unfocused list and asserts no scroll.

</details>

<details>
<summary>Details</summary>

### Counter semantics and ordering

`withScroll` calls the highlight action first and then `requestScroll()`. Both state updates come from the same event handler, so React batches them into one render, and the effect runs once with the new index and a keyboard `highlightType`. When the highlight type changes from mouse to keyboard on the same row, `List` updates its imperative handle (deps `[highlightType.moveFocus]`) during commit, before the parent's passive effect runs. The scroll callback therefore sees `moveFocus === true`. The hover-then-type-ahead test passes, which confirms this.

Type-ahead with no match never calls `highlightOption`, so it doesn't bump the counter. ArrowDown on the last option goes through `goHome`, and ArrowUp at the top goes through `goEnd`, so both wrap-around paths bump it. Arrow presses that leave the index unchanged also bump it, which matches the comment's request to scroll for every keyboard navigation request.

### Tests

The tests follow `.github/instructions/tests.instructions.md`: they test behaviour through `createWrapper`, use the existing mock and helpers, and have descriptive names. The evidence records 2 failed / 9 passed in "focus and highlight" before the fix, and 135 passed across `src/option-list` and `src/internal/components/listbox` after. The hover-after-keyboard test passed both before and after, as a guard, which is expected.

</details>

<details>
<summary>File map</summary>

- `src/internal/components/listbox/use-listbox.ts`: `scrollRequest` state, `withScroll` wrappers for the keyboard highlight paths, exposed on `UseListboxApi`.
- `src/internal/components/listbox/index.tsx`: scroll effect depends on `scrollRequest`; comment updated.
- `src/option-list/__tests__/option-list.test.tsx`: three scroll tests in "focus and highlight".

Full diff: `git -C .worktrees/pr3-option-list diff --cached` (the changes are staged against `d60d7e256`).

</details>
