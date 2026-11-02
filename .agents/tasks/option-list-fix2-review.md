# Highlight follows its option when OptionList options change

The listbox stores the highlight as an index, so changing `options` left that index pointing at a removed row or a different option. This change reconciles during render using the "previous props" pattern: it looks up the previously highlighted option in the new options by `value` and kind (group header vs. not). If it's found and still highlightable, the highlight moves to the new index through the existing setter for the current highlight type. If not, it resets to -1. `aria-activedescendant` is now emitted only when a highlighted option exists. The Listbox scroll effect now depends only on `scrollRequest`, so a reconcile never scrolls.

Watch for: the scroll effect no longer reacts to `highlightedIndex`. That is correct only because every keyboard highlight path goes through the `withScroll` wrappers. I checked focus entry, type-ahead, arrows, Home and End (confirmed), but a future raw-setter call site would silently stop scrolling. The untracked `pages/tsconfig.tsbuildinfo` and `.agents/` must stay out of the commit.

**Verdict**: APPROVED

## High-level view

The reconcile runs during render, not in an effect, so a stale index never reaches the DOM and no extra commit happens. All state it touches belongs to hooks in the same component, so render-phase updates are legal. `setPreviousOptions(options)` is called first, so the immediate re-render settles and can't loop, even when a consumer passes a fresh array on every render. `highlightOptionWithKeyboard` resolves the index against the new `options` closure. The mouse path passes the preserved `moveFocus`. Both are raw setters, so the Fix 1 `scrollRequest` counter isn't bumped.

Identity is `option.value` plus "is a group header". OptionList rebuilds every internal option object whenever the consumer's options change, which rules out object identity. Values are documented as unique, and duplicates warn. With a duplicate value, `findIndex` picks the first match, which is acceptable given that contract. Options or groups without a value reset instead of guessing. Disabled options stay highlightable in the current model, so "disabled after change" keeps the highlight. A group header in a non-interactive-groups list resets through the `isHighlightable` check.

Moving the scroll effect to `scrollRequest` only is required, not cosmetic. The verification log shows the keyboard reorder test failing with only the `use-listbox.ts` part applied. The `exhaustive-deps` disable has a comment explaining why.

Tests cover shrink-to-one followed by ArrowDown, keyboard reorder and insert that keep `banana` with no scroll, mouse reorder, a reordered group header in multi mode, and no attribute without a highlight. The verification doc records 4 tests failing before and passing after. The attribute test is a guard that passes both before and after, and that is documented. No existing tests were modified. `src/select`, `src/multiselect`, and `use-highlight-option.ts` are untouched (confirmed with `git diff --stat`).

<details>
<summary>Issues (2)</summary>

1. **Scroll now depends on wrapper discipline** (non-blocking, confirmed): the scroll effect ignores index changes, so any future keyboard highlight that calls a raw `*WithKeyboard` setter instead of a `withScroll` wrapper won't scroll. Consider a short comment at the raw setter destructure noting that keyboard callers must use the wrapped versions.
2. **Keep build artifacts out of the commit** (non-blocking, confirmed): `pages/tsconfig.tsbuildinfo` and `.agents/` are untracked in the worktree. Stage only the three source and test files.

</details>

<details>
<summary>Details</summary>

### Virtualized and off-screen behaviour after reconcile

A keyboard-highlighted option that moves out of view because of a reorder or insert stays where it is, without scrolling, until the next key press. In virtualized lists the next keyboard request scrolls by the new index, so this matches the requested "no scroll on reconcile" behaviour and isn't a defect.

</details>

<details>
<summary>File map</summary>

- `src/internal/components/listbox/use-listbox.ts`: `isSameOption` identity helper, render-phase reconcile, and `aria-activedescendant` guarded on `highlightedOption`.
- `src/internal/components/listbox/index.tsx`: the scroll effect depends on `scrollRequest` only, with a comment.
- `src/option-list/__tests__/option-list.test.tsx`: new "highlight when options change" block with 5 tests.

Full diff: `git -C .worktrees/pr3-option-list diff`.

</details>
