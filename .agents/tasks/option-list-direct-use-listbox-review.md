# Moving scroll, active descendant and OptionList's controller into useListbox

Step 1 (`97391cac5` on `refactor/use-listbox-in-select`) moves the `scrollToIndex` ref, its scroll-on-highlight effect and the `aria-activedescendant` id out of `useSelect` into `useListbox`. `useSelect` reads `listbox.scrollToIndex` and `listbox.activeDescendantId`, and its returned API does not change. Step 2 (`c2ebf9c1a` on `feat/add-option-list-v2`) adds optional settings to `useListbox`, all off by default: `scrollOn`, `keepHighlightOnOptionsChange`, `activeDescendant`, the returned `highlightOption`/`goHome` setters and a default `getParent`. They replace `onKeyboardHighlight`. `src/option-list/internal.tsx` now calls `useListbox` directly, and `use-option-list.ts` is deleted. This matches the user's direction to "use use-listbox as much as we can" and drop `use-option-list`.

Watch for: three small comment-accuracy items, none blocking. The `activeDescendantId` docstring is imprecise under the default `'always'` mode (confirmed). The raw `highlight` setters skip the scroll request in `'keyboard-request'` mode, and nothing documents this (confirmed). A comment in `internal.tsx` refers to history ("as before") (confirmed).

**Verdict**: APPROVED

## High-level view

Step 1 is a pure move. `getOptionId` returns `undefined` for index -1, so `activeDescendantId` has exactly the value `useSelect` computed before. The new `useRef`/`useEffect` come after every id-generating hook, so the `option-list-*` and `dialog-*` ids keep their order. The only observable difference is effect order. The scroll effect now runs before `useSelect`'s open-highlight and focus effects in the same commit. Those effects change the highlight through state, so the scroll still runs on the following render, and `focus({ preventScroll: true })` does not interact with list scrolling. Select and Multiselect tests and snapshots pass unchanged.

Step 2 is a mechanical move of `use-option-list.ts` logic into `useListbox` behind flags. The options-change follow block and `isSameOption` are copied verbatim, gated on `keepHighlightOnOptionsChange`. The single scroll effect is keyed on a request counter in `'keyboard-request'` mode and on `highlightedIndex` otherwise. The counter only increments in `'keyboard-request'` mode, so Select gets no extra state updates. The new `useState` calls are unconditional, so hook order stays stable. On the OptionList side, the pointer-down flag, the focus entry (first selected option in list order, otherwise `goHome`), the blur reset, the root `onMouseLeave`, type-ahead through `highlightOption`, and the missing `onEscape` all match `17f00cd92:src/option-list/use-option-list.ts` line for line. `git diff refactor/use-listbox-in-select feat/add-option-list-v2 -- src/select src/multiselect` is empty, and no Select or Multiselect call site passes the new options.

Tests are changed only in `use-listbox.test.tsx`. The three `onKeyboardHighlight` cases were rewritten as `scrollOn: 'keyboard-request'` cases because that option was removed. Each original assertion still has a counterpart: arrows, Home and End request a scroll; a repeated End on the same index scrolls again; a mouse move does not. OptionList's 67 tests and the 111 snapshots pass unchanged, according to the step 2 notes. Nothing was pushed. The origin refs are still `318ee8036` and `24173f991`, `feat/add-option-list-v2` does not exist on origin, and local `feat/add-option-list` and the `option-list-rebase` worktree are still at `17f00cd92` with no tracked changes.

<details>
<summary>Issues (3)</summary>

1. **`activeDescendantId` docstring under `'always'`** (confirmed, non-blocking). `UseListboxApi.activeDescendantId` says it is "undefined when nothing is highlighted". In the default mode it is undefined only when `highlightedIndex` is -1. A stale index beyond the options still yields an id, and the new `'always'` test asserts exactly that. Reword it to "undefined when `highlightedIndex` is -1; see `activeDescendant`".
2. **Raw `highlight` setters bypass scroll requests** (confirmed, non-blocking). With `scrollOn: 'keyboard-request'`, `highlight.highlightOptionWithKeyboard` and `highlight.goHomeWithKeyboard` change the highlight without scrolling, while the returned `highlightOption`/`goHome` do scroll. Add a note to the `highlight` docstring so a future caller doesn't pick the wrong pair.
3. **History-referencing comment in OptionList** (confirmed, non-blocking). "useListbox comes first, so the list id is created first, as before." only makes sense to someone who knows the deleted file. State the constraint itself instead, for example "Keep useListbox the first id-generating hook so the list id stays stable".

</details>

<details>
<summary>Details</summary>

### Effect order after moving the scroll effect into useListbox (Step 1)

The scroll effect used to be declared last in `useSelect`. Now it is declared inside `useListbox`, which runs before `useSelect`'s open-highlight effect and `focusActiveRef` effect. In a commit where `highlightedIndex` changes and the dropdown opens at the same time, the list now scrolls before the active element gets focus. The open-highlight effect itself only calls highlight setters, which take effect on the next render, and the scroll runs again on that render. Focus uses `preventScroll: true`. No ordering dependency exists, which the unchanged Select and Multiselect suites confirm (1174 tests before, 1176 after; the 2 additions are the new useListbox cases).

### `scrollOn` and the single scroll effect (Step 2)

```ts
const scrollTrigger = scrollOn === 'keyboard-request' ? scrollRequest : highlightedIndex;
useEffect(() => {
  scrollToIndex.current?.(highlightedIndex);
}, [scrollTrigger]);
```

In `'keyboard-request'` mode this is the old `use-option-list` effect on `[scrollRequest]`. Before Step 2, OptionList passed its own ref to `PlainList`, so `useListbox`'s `highlightedIndex` effect called a null ref. Merging the two effects therefore drops only a no-op. The mount-time call with index -1 happens in both versions; commit `3beb4c917` handles it in `PlainList`. A repeated End still scrolls because the counter changes even though the index does not. A mouse highlight, and the highlight following its option when the options change, never touch the counter, so they don't scroll.

The new comment on `scrollRequest` explains why a counter exists (End again after scrolling away), which is the non-obvious part. The `highlight` docstring does not mention that the raw setters skip the request (issue 2).

### Options-change follow inside useListbox (Step 2)

The render-phase "previous props" block now runs right after `useHighlightedOption` instead of after `useListbox` returns. It reads the same `highlightedIndex`/`highlightType`, and React throws away the render in which `setPreviousOptions` is called. The hooks that run in between (`useMenuKeyboard`, `useAnnouncement`) also saw stale values in that discarded render before the change. The result is the same. When the flag is off, `previousOptions` keeps holding the initial options array and is never compared, which is harmless for Select.

### Equivalence with 17f00cd92 (Step 2)

`feat/add-option-list-v2~1` (`a434668dd`) differs from `17f00cd92` only by the Step 1 files, so `use-option-list.ts` and `internal.tsx` at the parent are byte-identical to `17f00cd92`. Compared against those files, the inlined `internal.tsx` keeps every behavior on the checklist:

- `selectedAriaLabel` is passed straight from `i18n(...)` instead of through `i18nStrings`.
- `onMouseLeave` is defined on the root, with `listElementProps` typed as `Omit<ListElementProps, 'onMouseLeave'>` in place of the earlier destructure.
- `aria-activedescendant` uses `activeDescendant: 'when-highlighted'`, which reproduces `highlightedOption ? getOptionId(...) : undefined`.
- `onEscape` is still absent, so Escape keeps propagating.

The id order is also unchanged. `useListbox` is the first hook after `useControllable`, and its `useUniqueId('option-list')` is its first call. The unchanged snapshots back this up.

</details>

<details>
<summary>Files changed</summary>

- Step 1 `src/internal/components/listbox/use-listbox.ts`: owns the `scrollToIndex` ref and effect, and returns `activeDescendantId`.
- Step 1 `src/select/utils/use-select.ts`: uses `listbox.scrollToIndex` and `listbox.activeDescendantId`; drops its own ref, effect and id.
- Step 1 `src/internal/components/listbox/__tests__/use-listbox.test.tsx`: adds `activeDescendantId` and `scrollToIndex` cases.
- Step 2 `src/internal/components/listbox/use-listbox.ts`: adds `scrollOn`, `keepHighlightOnOptionsChange`, `activeDescendant`, the `highlightOption`/`goHome` setters and the `getParent` default; removes `onKeyboardHighlight`.
- Step 2 `src/option-list/internal.tsx`: calls `useListbox` directly, with the list props, focus/blur and type-ahead inlined.
- Step 2 `src/option-list/use-option-list.ts`: deleted.
- Step 2 `src/internal/components/listbox/__tests__/use-listbox.test.tsx`: replaces the `onKeyboardHighlight` cases and adds cases for the new options.

Full diffs: `git -C .worktrees/listbox-use-listbox -P show refactor/use-listbox-in-select` and `git -C .worktrees/option-list-on-use-listbox -P show feat/add-option-list-v2`.

</details>
