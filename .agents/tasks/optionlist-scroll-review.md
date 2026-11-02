# OptionList scrolls the keyboard-highlighted option into view

OptionList's `<ul role="listbox">` is never its own scroll container, so the shared Listbox's manual `menuEl.scrollBy` did nothing and keyboard navigation left the highlight off-screen. The fix adds an internal `scrollStrategy: 'list' | 'nearest'` to `List` and `Listbox`. The default `'list'` keeps today's path. OptionList opts into `'nearest'`, which calls `scrollElementIntoView` on the highlighted option. A `skipNextScroll` ref, set on focus and cleared on key down, stops focus entry from scrolling. Unit tests cover the new helper and the OptionList key paths. Integration tests were written but never run because of a local ChromeDriver/page-load problem. The user has confirmed manually in the browser that the fix works.

Watch for: integration tests are unexecuted (confirmed, from the verification note). The plan's Select integ regression run was also skipped (confirmed).

**Verdict**: APPROVED

## High-level view

The scroll mechanism stays isolated. `'nearest'` is opt-in, only `src/option-list/internal.tsx` passes it, and it lives on `ListProps`/`ListboxProps`, not on the public `OptionListProps`. `git diff` of `src/option-list/interfaces.ts` and `src/__tests__/snapshot-tests` is empty. The default export of `scroll-to-index.ts`, including the `clientHeight > 15` guard, is unchanged. The focus/keydown wrappers are only installed when `scrollStrategy === 'nearest'`, so Select, Multiselect, Autosuggest and embedded Multiselect render exactly as before. Their effect also behaves as before, because `skipNextScroll` is never set on their path. That keeps the #3798 page-scroll-on-open fix intact for Select.

The shared guard `highlightType.moveFocus && menuRef.current && !isSticky` applies to both strategies, so the scroll is keyboard-only and the sticky-first-option rule holds, matching Autosuggest's `plain-list.tsx`. The focus-entry skip is correct on the paths that matter. Pointer focus leaves the flag set until the next key down clears it. Mouse highlights never scroll because of `moveFocus`. Blur resets the highlight, so re-focus starts clean.

The unit tests exercise real behaviour. They mock `HTMLElement.prototype.scrollIntoView`, follow the container test pattern, and assert on `mock.instances` against the `[data-mouse-target]` element. They cover focus entry with and without a selection, ArrowDown, End, Home, wrap-around ArrowUp, type-ahead, mouse hover and re-focus. The integration tests use a viewport-plus-scrolling-ancestor visibility check and assert that `getWindowScroll` doesn't change on Dropdown open, which guards #3798 for the DIY dropdowns. They have never passed or failed in a real browser.

<details>
<summary>Issues (2)</summary>

1. **Integration tests unexecuted** (confirmed, non-blocking): `src/option-list/__integ__/option-list.test.ts` scroll tests have never run. Run them in CI or after fixing the local ChromeDriver/`lib` state, before relying on them as a regression guard.
2. **Select integ regression not run** (confirmed, non-blocking): the plan's `src/select/__integ__` and global-scroll-padding run was skipped. Risk is low because the `'list'` path is unchanged in code, but run it in CI.

</details>

<details>
<summary>Details</summary>

### Focus-entry skip semantics

`skipNextScroll` is consumed by the first `highlightedIndex` change after focus, whatever the source, and a key down clears it. If focus entry doesn't change the highlight (pointer focus), the first mouse-driven change consumes the flag. That change wouldn't scroll anyway (`moveFocus: false`), so the outcome is the same. Type-ahead handled on the OptionList root still scrolls, because the `<ul>` `onKeyDown` clears the flag first, and the unit test covers it.

### Browser evidence

The verification note records the build, unit, lint and prettier runs. It also records that the integ and manual browser checks were blocked by a page-load error (`styles.scoped.css`). The user has since reported reviewing the change manually and confirmed it works, which covers the browser-behaviour gap. The documenter snapshot failures in the note are pre-existing (from commit b9c34f236). This diff doesn't touch interfaces or snapshots.

</details>

<details>
<summary>Files</summary>

- `src/internal/components/listbox/parts/scroll-to-index.ts`: new `scrollOptionIntoView` named export. The default export is unchanged.
- `src/internal/components/listbox/parts/list.tsx`: `ScrollStrategy` type and prop, strategy branch inside the existing guard, and the deps updated.
- `src/internal/components/listbox/index.tsx`: `scrollStrategy` prop, `skipNextScroll`, and focus/keydown wrappers for `'nearest'` only.
- `src/option-list/internal.tsx`: passes `scrollStrategy="nearest"`.
- `src/internal/components/listbox/__tests__/scroll-to-index.test.ts`: 2 helper tests.
- `src/option-list/__tests__/option-list.test.tsx`: 7 scroll tests.
- `src/option-list/__integ__/option-list.test.ts`: keyboard-scroll integ suite (not run).
- `pages/option-list/scroll.page.tsx` (untracked): new dev page.

Full diff: `git -P diff` on `dev-v3-amanabiy`.

</details>
