# Implementation Plan: OptionList scrolls the keyboard-highlighted option into view

Work directly in `/Users/amanabiy/Documents/components` on branch `dev-v3-amanabiy`. No worktree, no branch switch, never push.

## Findings (verified in code)

- `src/internal/components/listbox/index.tsx` (`Listbox`) runs `scrollToIndex.current?.(controller.highlightedIndex)` in a `useEffect` on `[controller.highlightedIndex]`. The ref is the imperative handle of `List` (or Select's `VirtualList`).
- `src/internal/components/listbox/parts/list.tsx` imperative handle: `if (highlightType.moveFocus && menuRef.current && !isSticky) scrollToIndex({ index, menuEl: menuRef.current })`, where `isSticky = firstOptionSticky && index === 0`.
- `src/internal/components/listbox/parts/scroll-to-index.ts` finds `[data-mouse-target="${index}"]` inside the listbox and scrolls only the listbox via `menuEl.scrollBy`, guarded by `menuEl.clientHeight > 15` (AWSUI-60318). In OptionList the `<ul role="listbox">` is never the scroll container (the OptionList root with `overflow:auto`, a wrapper, Dropdown content or the window scrolls), so nothing scrolls. That is the bug.
- `HighlightType.moveFocus` is `true` for keyboard highlights. Mouse hover uses `setHighlightedIndexWithMouse(index, false)`, so it doesn't scroll.
- Focus entry (`use-listbox.ts` `getListProps`, `embedded && isDefaultBehavior` branch, which OptionList uses) calls `highlightOptionWithKeyboard(selected)` or `goHomeWithKeyboard()` (both have `moveFocus: true`), unless focus came from a pointer or something is already highlighted. With a naive `scrollIntoView`, focus entry would scroll too, and the task forbids that. `onBlur` resets the highlight to -1, so every focus entry starts from no highlight.
- Keys handled by `useMenuKeyboard` (`list-container/utils/use-keyboard.ts`): Up, Down (both wrap), Home, End, Enter, Space, Escape. PageUp and PageDown are NOT handled. PageDown only scrolls the nearest scroll container natively and never moves the highlight. OptionList's root `onKeyDown={controller.onTypeAhead}` adds type-ahead, which uses keyboard highlights.
- `scrollElementIntoView(el, { block: 'nearest', inline: 'nearest' })` in `src/internal/utils/scrollable-containers.ts` calls `el?.scrollIntoView?.(options)`, so it is a no-op in JSDOM unless mocked. Autosuggest (`src/autosuggest/plain-list.tsx`) uses it, guarded by `highlightType.moveFocus`.
- Callers of the shared `Listbox`: `src/option-list/internal.tsx`, `src/select/internal.tsx`, `src/multiselect/internal.tsx`, `src/multiselect/embedded.tsx`. Select and Multiselect pass `VirtualList` (`src/select/parts/virtual-list.tsx`) for virtual scrolling, which accepts `ListProps` and ignores unknown props.
- Existing unit test pattern: `src/internal/components/listbox/__tests__/scroll-to-index.test.ts` mocks geometry with plain objects. `src/container/__tests__/container.test.tsx` mocks `HTMLElement.prototype.scrollIntoView = jest.fn()` and restores it afterwards.

## Design decisions

1. **Mechanism: an internal `scrollStrategy?: 'list' | 'nearest'` prop.** It goes on `ListProps` (parts/list.tsx) and on `ListboxProps` (index.tsx), and defaults to `'list'`. `'list'` is today's manual `scrollBy` path, unchanged. `'nearest'` calls `scrollElementIntoView` on the option element. Only OptionList passes `'nearest'`. An enum prop is simpler and easier to test than an injectable function, and it keeps the focus-entry rule in one place. It isn't in `src/option-list/interfaces.ts`, so the public API and documenter snapshot don't change.
2. **Keep the `'nearest'` helper next to the manual one.** Add an exported `scrollOptionIntoView({ index, menuEl })` to `parts/scroll-to-index.ts`. It finds the same `[data-mouse-target="${index}"]` element and calls `scrollElementIntoView(item)`. The default export (manual `scrollBy`, including the `clientHeight > 15` guard) stays byte-for-byte unchanged. The small-height guard isn't applied to `'nearest'`: it protects Select's own scrolling menu, and `scrollIntoView` with `block: 'nearest'` doesn't fight a tiny container the same way.
3. **Guards in the `List` handle.** For both strategies, scroll only when `highlightType.moveFocus && menuRef.current && !isSticky`. The sticky-item and moveFocus-only rules stay shared. Add `scrollStrategy` to the `useImperativeHandle` deps.
4. **No scroll on focus entry. Only `Listbox` handles this, and only when `scrollStrategy === 'nearest'`.** Add `skipNextScroll = useRef(false)` to `Listbox`. Wrap the merged list props:
   - `onFocus`: set `skipNextScroll.current = true`, then call the original `onFocus`. The original runs the focus-entry highlight.
   - `onKeyDown`: set `skipNextScroll.current = false`, then call the original `onKeyDown`. This means a key press always scrolls, even if focus entry didn't change the highlight and so never consumed the flag.
   - In the effect: `if (skipNextScroll.current) { skipNextScroll.current = false; return; }`, then scroll as before.
   - With `'list'` (Select and Multiselect), neither the handlers nor the effect change: don't wrap anything, so the behavior stays exactly as it is today.
   Type-ahead keys bubble from the `<ul>` (its `onKeyDown` fires first and clears the flag) to the OptionList root, so type-ahead highlights scroll too.
5. **PageDown is a gap.** It isn't a listbox key, so it can't move the highlight. The integration test presses PageDown and then asserts that the next ArrowDown brings the highlight back into view. Adding PageUp and PageDown navigation is out of scope.

## Steps

- [ ] 1. Add `scrollOptionIntoView` and its unit tests.
      In `src/internal/components/listbox/parts/scroll-to-index.ts`, import `scrollElementIntoView` from `../../../utils/scrollable-containers`. Add a named export `scrollOptionIntoView({ index, menuEl }: { index: number; menuEl: HTMLElement })` that queries `[data-mouse-target="${index}"]` and calls `scrollElementIntoView(item)` when the item is found. Leave the default export untouched.
      In `src/internal/components/listbox/__tests__/scroll-to-index.test.ts`, add `describe('scrollOptionIntoView')`:
      (a) Given a mocked menuEl with `querySelector` returning an item that has `scrollIntoView: jest.fn()` and `menuEl.scrollBy = jest.fn()`, expect `item.scrollIntoView` to be called with `{ block: 'nearest', inline: 'nearest' }`, the `querySelector` argument to be `[data-mouse-target="3"]`, and `scrollBy` not to be called.
      (b) When `querySelector` returns null, expect it not to throw and `scrollBy` not to be called.
      Files: src/internal/components/listbox/parts/scroll-to-index.ts, src/internal/components/listbox/__tests__/scroll-to-index.test.ts
      Verify: `TZ=UTC node_modules/.bin/jest -c jest.unit.config.js src/internal/components/listbox/__tests__/scroll-to-index.test.ts`. The existing tests and the 2 new ones pass. (Unit tests import from `lib/components`, so run `npm run quick-build` first if the test imports the built output. This test imports the source directly.)

- [ ] 2. Add the `scrollStrategy` prop to `List` and `Listbox`, with the focus-entry skip.
      `src/internal/components/listbox/parts/list.tsx`: add `/** How the highlighted option is scrolled into view. Defaults to 'list' (only the list element scrolls). */ scrollStrategy?: 'list' | 'nearest'` to `ListProps`. Destructure it with default `'list'`. In the handle, inside the existing `highlightType.moveFocus && menuRef.current && !isSticky` guard, call `scrollStrategy === 'nearest' ? scrollOptionIntoView({ index, menuEl: menuRef.current }) : scrollToIndex({ index, menuEl: menuRef.current })`. Add `scrollStrategy` to the deps.
      `src/internal/components/listbox/index.tsx`: add the same documented `scrollStrategy?` to `ListboxProps` (default `'list'`) and pass it to `<ListComponent scrollStrategy={...}>`. Build `mergedListProps = { ...controller.getListProps(), ...listProps }`. When `scrollStrategy === 'nearest'`, override `onFocus` and `onKeyDown` with the wrappers from decision 4, calling the originals via optional chaining with the same event argument. Add `const skipNextScroll = useRef(false)` and the early return in the effect. Don't touch the code path for `'list'`.
      `src/select/parts/virtual-list.tsx`: no change. It destructures only the props it uses, and Select never sets `'nearest'`.
      Files: src/internal/components/listbox/parts/list.tsx, src/internal/components/listbox/index.tsx
      Verify: `npx tsc -p tsconfig.json --noEmit`, or `npm run quick-build` if the root tsconfig isn't standalone, compiles. Then `TZ=UTC node_modules/.bin/jest -c jest.unit.config.js src/select src/multiselect src/autosuggest src/internal/components/listbox` passes unchanged.

- [ ] 3. Enable the strategy in OptionList and add OptionList unit tests.
      `src/option-list/internal.tsx`: pass `scrollStrategy="nearest"` to `<Listbox>`, with a one-line comment: "OptionList's listbox is never its own scroll container, so the highlighted option is scrolled into view through all scrollable ancestors."
      `src/option-list/__tests__/option-list.test.tsx`: add `describe('scrolling the highlighted option into view')`. In `beforeEach`, set `HTMLElement.prototype.scrollIntoView = jest.fn()`. In `afterEach`, restore the original (pattern from `src/container/__tests__/container.test.tsx`). Use a 10-option list and the existing `pressKey` and `renderOptionList` helpers:
      - Focus entry (`fireEvent.focus(wrapper.findOptionsContainer().getElement())`) highlights the first option and doesn't call `scrollIntoView`.
      - Focus entry with a preselected option (`initialSelected`) highlights it and doesn't call `scrollIntoView`.
      - After focus, ArrowDown calls `scrollIntoView` once with `{ block: 'nearest', inline: 'nearest' }`, and `mock.instances[0]` is the element with `data-mouse-target="1"`. Check which element carries the attribute (the option or its parent) and assert on that element via `container.querySelector('[data-mouse-target="1"]')`.
      - End scrolls the last option. Home scrolls the first option. ArrowUp from the first option wraps and scrolls the last option.
      - Type-ahead (keyDown with `key: 'S'` on a list containing a label starting with "S") scrolls the matched option.
      - `fireEvent.mouseMove` on an option highlights it without calling `scrollIntoView`.
      - Blur followed by focus again doesn't call `scrollIntoView`.
      Files: src/option-list/internal.tsx, src/option-list/__tests__/option-list.test.tsx
      Verify: `npm run quick-build`, then `TZ=UTC node_modules/.bin/jest -c jest.unit.config.js src/option-list` passes. `TZ=UTC node_modules/.bin/jest -c jest.unit.config.js src/__tests__/snapshot-tests/documenter.test.ts` passes without `-u`, which confirms no public API change.

- [ ] 4. Add a dev page with an inline long list in a scroll container.
      Create `pages/option-list/scroll.page.tsx` with a `SimplePage` titled "Option list: keyboard scrolling", following `pages/option-list/simple.page.tsx`. It contains:
      (a) `<div id="inline-scroll-container" style={{ blockSize: 240, overflow: 'auto' }}>` wrapping `<OptionList data-testid="inline-long" ariaLabelledby=... selectionType="single" options={100 generated options} .../>` (controlled with `useState`).
      (b) A second inline OptionList, `data-testid="inline-page"`, with 100 options and no height limit, so the window scrolls.
      Use a heading id for `ariaLabelledby` and follow the file header and license conventions.
      Files: pages/option-list/scroll.page.tsx
      Verify: `npm run lint:eslint -- pages/option-list` passes. Start the dev server per docs/SETUP.md (`npm start`), open `#/light/option-list/scroll`, Tab into each list, hold ArrowDown, and confirm the highlight stays visible.

- [ ] 5. Add integration tests in `src/option-list/__integ__/option-list.test.ts`.
      Add a helper `isHighlightVisible(page, listSelector)` that uses `browser.execute` with the highlighted-option selector (`wrapper.findOptionList(sel).findHighlightedOption().toSelector()`). In the browser, it gets the element's rect and walks the ancestors. For every ancestor whose computed `overflow-y` is `auto` or `scroll` and whose `scrollHeight > clientHeight`, it checks that the rect is within the ancestor's client rect (1px tolerance). It also checks that the rect is within `0..window.innerHeight`, and returns a boolean. Add a separate `setupScrollTest(url, fn)` next to the existing `setupTest`.
      Tests:
      - Inline in a scroll container (`#/light/option-list/scroll`, `[data-testid="inline-long"]`): click the heading, press Tab. Then, asserting `isHighlightVisible` is true after each step:
        1. 30× ArrowDown
        2. End
        3. Home
        4. ArrowUp, which wraps to the last option
        5. PageDown, then ArrowDown. Only assert after the ArrowDown; document that PageDown doesn't move the highlight.
      - Inline with the window scrolling (`[data-testid="inline-page"]`): run the same sequence with ArrowDown ×40 and End.
      - DIY select in Dropdown (`#/light/option-list/in-dropdown?longList=true`): click `#diy-select-trigger` and wait for `#diy-select-list` to be focused. Assert that the page scroll (`window.scrollY`) is unchanged by opening, which guards against the #3798 regression. Then run ArrowDown ×30, End and Home, asserting visibility each time.
      - DIY multiselect in Dropdown: same page, `#diy-multiselect-trigger`, list `#diy-multiselect-list`. Focus goes into the list on open. Run the same keys and assertions.
      - Regression for Select: on the in-dropdown page, open the real Select (`#real-select-trigger`), press ArrowDown ×30, and assert the highlight is visible. This confirms the unchanged manual path still works.
      Files: src/option-list/__integ__/option-list.test.ts
      Verify: `npm run build` (or `npm run quick-build`), then `NODE_OPTIONS=--experimental-vm-modules node_modules/.bin/jest -c jest.integ.config.js src/option-list/__integ__/`. All tests pass, including the 4 existing ones. Sanity-check that the new tests fail without step 3: temporarily drop `scrollStrategy="nearest"`, run once, then revert.

- [ ] 6. Run the full verification matrix (below) and fix any failures.

## Verification matrix

| Area | Command | Expected |
|---|---|---|
| Typecheck and build | `npm run quick-build` | succeeds |
| Lint | `npm run lint` | no errors |
| Listbox unit tests | `TZ=UTC node_modules/.bin/jest -c jest.unit.config.js src/internal/components/listbox` | pass, including the new `scrollOptionIntoView` tests |
| OptionList unit tests | `TZ=UTC node_modules/.bin/jest -c jest.unit.config.js src/option-list` | pass, including the new scroll tests |
| Select, Multiselect, Autosuggest regression | `TZ=UTC node_modules/.bin/jest -c jest.unit.config.js src/select src/multiselect src/autosuggest` | pass with no changes |
| Public API unchanged | `TZ=UTC node_modules/.bin/jest -c jest.unit.config.js src/__tests__/snapshot-tests` | pass without `-u`. `git diff src/option-list/interfaces.ts` is empty |
| OptionList integration tests | `NODE_OPTIONS=--experimental-vm-modules node_modules/.bin/jest -c jest.integ.config.js src/option-list/__integ__/` | pass |
| Select scroll regression (integ) | `NODE_OPTIONS=--experimental-vm-modules node_modules/.bin/jest -c jest.integ.config.js src/select/__integ__/ src/app-layout/__integ__/global-scroll-padding*` (where the #3798 tests live; check with `ls src/app-layout/__integ__`) | pass |
| Manual check | dev server: `#/light/option-list/in-dropdown?longList=true` and `#/light/option-list/scroll` | highlight stays visible with ArrowDown, End and Home. Opening the dropdown doesn't scroll the page. Mouse hover doesn't scroll |

## Assumptions and notes

- PageUp and PageDown aren't handled by the listbox (see Findings), so the integration test treats PageDown as native scrolling followed by a key that moves the highlight.
- Focus entry relies on the browser's native focus scrolling, which brings the `<ul>` into view, not the selected option. This follows the task's constraint.
- The commit happens in a later workflow step: Conventional Commit, e.g. `fix: Scroll highlighted option into view in option list`. Stage files by name, including the new page and tests. Don't include the untracked `docs/*.md`, `.agents/` or `.kiro/` files unless asked.
