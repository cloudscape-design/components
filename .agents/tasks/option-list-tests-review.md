# OptionList tests review (read-only)

Worktree: `/Users/amanabiy/Documents/components/.worktrees/option-list-on-use-listbox`, branch `feat/add-option-list-v2` @ `22a4a7f2c`.
Paths below are relative to the worktree.

## Summary

- **Unit tests pass.** `npx jest -c jest.unit.config.js src/option-list src/internal/components/listbox` gives 18 suites and 162 tests, all passing. Integ tests were not run because port 8080 is the user's dev server.
- **No test asserts dropped behavior.** No test checks focus moving to the selected option, a pointer-down flag, Home/End `preventDefault`, aria-activedescendant only while highlighted, type-ahead variants, or renderOption C/D. Three items are stale or misleading:
  - `keyboard.test.tsx:28-34` still builds `createEvent` objects for Home/End but no longer asserts anything about them. This is left over from the Home/End `preventDefault` variant.
  - `group-state.test.tsx:113` is named as if the highlight follows its option when options change. That behavior was dropped. The test passes only because the highlighted index stays the same.
  - In `option-list-scroll.test.ts:63-72`, Home and End now also trigger native scrolling, so those assertions no longer isolate `scrollOptionIntoView`. The last step (`scrollToTop` then ArrowDown to Option 1) passes even if no scrolling happens.
- **Biggest gaps:**
  - OptionList has no type-ahead test at all. The root `onKeyDown` wiring is untested.
  - `scrollOptionIntoView` has no direct test. The `index < 0` guard is covered only indirectly by `highlight.test.tsx:44-53`.
  - These shared additions are untested: PlainList `scrollStrategy`, `hideTopDivider`, the OptionsList `statusType` default, and `useMenuKeyboard` without `onEscape`.
  - Value validation of leaf options inside groups is untested.
  - Mouse-leave while the list is focused is untested.
- **Answer to the user's question:** yes, add direct `scrollOptionIntoView` tests. Put them in `src/internal/components/listbox/__tests__/scroll-to-index.test.ts` because that is where the function lives. Don't put them in `use-listbox.test.tsx`: the hook only calls `scrollToIndex.current(index)`, which `use-listbox.test.tsx:327-339` already covers. A small PlainList test covering `scrollStrategy` is optional. I recommend it because it is the only proof that `'ancestors'` picks the right function and that the default stays `'menu'`.

## 1. Correctness and staleness

| File:line | Finding | Proposed change |
|---|---|---|
| `src/option-list/__tests__/keyboard.test.tsx:28-34` | `createEvent.keyDown` and `fireEvent(listbox, endEvent)` are used, but `endEvent` and `homeEvent` are never inspected. This is a remnant of the dropped Home/End `preventDefault` assertion. | Replace with `pressKey(listbox, KeyCode.end)` and `pressKey(listbox, KeyCode.home)`. Remove the `createEvent` import. The `defaultPrevented === false` contract is already asserted in `use-listbox.test.tsx:132-143`. |
| `src/option-list/__tests__/group-state.test.tsx:113-136` | The title says the header "keeps its highlight when the options are rebuilt on change". The highlight is index-based, and "highlight follows its option when options change" was dropped. The test is still valid for its scenario: options are recreated with the same values and order, so the index doesn't move. | Rename it to something like `keeps the highlight when the options are recreated with the same values`. Add a comment saying that following an option that moved is a follow-up. |
| `src/option-list/__integ__/option-list-scroll.test.ts:63-66` | Home and End no longer call `preventDefault`. The browser also runs its native Home/End scroll on the nearest scrollable ancestor (wrapper, window, or dropdown content) after `scrollIntoView`. The assertions probably still pass, because native End lands at the list end and native Home lands at the top. However, they no longer prove that `scrollOptionIntoView` did the scrolling, and on `container=page` the result depends on nothing taller sitting below the list. | **Run these integ tests before merging** (all 3 containers × the dropdown variants). If you keep them, rely on ArrowUp/ArrowDown wrap for the scroll proof, which has no native action, and keep Home/End only for the label check. |
| `src/option-list/__integ__/option-list-scroll.test.ts:70-72` | After `scrollToTop()`, ArrowDown wraps to Option 1, which is already at the top, so `isHighlightVisible` is true even without any scrolling. | After `scrollToTop()`, press `ArrowUp` (Option 100 → Option 99) or `End`, then assert the option is visible. That checks scrolling away from the current scroll position. |
| `src/option-list/__integ__/option-list-scroll.test.ts:100-107` | `focus entry highlights the first option when an option near the end is selected` matches the current decision. Keep it. When the "move focus to selected" follow-up lands, this test must flip. | No change. Optionally add a `// Follow-up: focus moves to the selected option` comment. |
| `highlight.test.tsx:107-116` (`keyboard moves scroll…`) | Not stale. The scroll comes from the `useListbox` effect plus PlainList when `highlightType.moveFocus` is true, which is what PlainList does by default. There is no extra OptionList scroll. | No change. |

No test or comment references the pointer-down flag, focus moving to the selected option, or `aria-activedescendant` being removed when nothing is highlighted. `keyboard.test.tsx:66-76` asserts that the attribute is absent after blur. That is consistent with `getOptionId(listId, -1)` being `undefined`.

## 2. Gaps

Where each test should live: OptionList behavior goes in `src/option-list/__tests__`. Shared code goes next to the shared module's existing tests.

| Behavior | Current coverage | Recommendation | Location |
|---|---|---|---|
| **Type-ahead** (`useOptionList` root `onKeyDown`) | None in OptionList. Only the shared hook is tested in `use-type-ahead.test.ts`. | Add these tests: typing `s` on the focused list highlights "Second" and sets `aria-activedescendant`; typing in multi with groups can match a group header (`interactiveGroups`); a disabled option is skipped or matched per `useTypeAhead` behavior (read the hook to pin this down). | `keyboard.test.tsx` (new `describe('type-ahead')`) |
| **`scrollOptionIntoView`** including the `-1` guard | Indirect only: `highlight.test.tsx:44-53` (grouped mount) and the scroll mocks in the same file. | Add a `describe('scrollOptionIntoView')` with three tests: (a) calls `scrollIntoView({block:'nearest',inline:'nearest'})` on the `[data-mouse-target="2"]` element; (b) does nothing for index `-1` even when a `data-mouse-target="-1"` element exists (this is the group-header case); (c) does nothing when no element matches. Use a real `document.createElement` tree and mock `HTMLElement.prototype.scrollIntoView` with restore. | `src/internal/components/listbox/__tests__/scroll-to-index.test.ts` |
| **PlainList `scrollStrategy`** | None. | One small test: render `PlainList` with `scrollStrategy="ancestors"` and a ref, call `ref.current(1)` with a keyboard `highlightType`, and expect `scrollIntoView` to be called. Then render with the default and expect `scrollIntoView` not to be called (the default calls `scrollBy` on the menu instead). Optional if OptionList's `highlight.test.tsx` is considered enough, but it is the only check of the default branch. | New `src/internal/components/listbox/__tests__/plain-list.test.tsx` |
| **`useMenuKeyboard` without `onEscape`** | `use-listbox.test.tsx:123-130` covers it through the hook. `use-keyboard.test.ts:98-106` covers only the case where `onEscape` is provided. | Add `does not stop propagation when onEscape is omitted` next to `use-keyboard.test.ts:98`. | `src/internal/components/options-list/__tests__/use-keyboard.test.ts` |
| **Escape reaching the parent** | `keyboard.test.tsx:52-64` | Covered. | — |
| **OptionsList `statusType` default `'finished'`** | None. All of `options-list.test.tsx` passes `statusType="pending"`. | Add a test that renders `<OptionsList open={true} onLoadMore={fn}>` without `statusType` and expects `onLoadMore` not to be called. | `src/internal/components/options-list/__tests__/options-list.test.tsx` |
| **`hideTopDivider`** | None. | In `selectable-item.test.tsx`, assert that the `hide-top-divider` class is applied only when the prop is set. In OptionList, assert that only index 0 gets it. Class names are acceptable here because no test-utils finder exists for this styling primitive (the exception in `tests.instructions.md`). | `src/internal/components/selectable-item/__tests__/selectable-item.test.tsx` plus one assertion in `option-list.test.tsx` rendering |
| **Embedded focus/blur** | Hook: `use-listbox.test.tsx:283-310`. Component: `highlight.test.tsx`, `keyboard.test.tsx`. | Covered. | — |
| **`onMouseLeave` while focused** | Only the unfocused case, `highlight.test.tsx:55-62`. | Add: `act(() => listbox.focus())`, press ArrowDown, `mouseLeave` the root, and expect the highlight to be kept. Real focus is required because the handler compares against `document.activeElement`, and `fireEvent.focus` doesn't move it. | `highlight.test.tsx` |
| **Leaf value validation inside groups** (`internal.tsx:117-121`) | None. | Add: an option without `value` inside a group triggers `warnOnce('OptionList', 'You provided an \`options\` prop where at least one non-group array element is missing the \`value\` field. …')`. Also check that a valid grouped list does not warn. | `option-list.test.tsx` → `rendering` (the `warnOnce` mock already exists) |
| **Single selection uses only the first `selectedOptions` entry** (documented in `interfaces.ts:41`) | None. | Pass `selectionType="single" selectedOptions={[{value:'b'},{value:'c'}]}` and expect `selectedLabels` to equal `['Second']`. | `option-list.test.tsx` → `selection` |
| **Default group announcement** (`getParent` without `renderHighlightedAriaLive`) | Indirect: `option-list-a11y.test.tsx:52-60` checks that the group reaches `renderHighlightedAriaLive`. The default text format is covered in `use-announcement.test.ts`. | Nice-to-have: one assertion that the highlighted grouped option's screen-reader text contains the group label `Compute`. | `option-list-a11y.test.tsx` |
| **a11y in the highlighted state** | `option-list-a11y.test.tsx:15-25` validates only the resting state. | Nice-to-have: focus the list and press ArrowDown before `toValidateA11y`, so `aria-activedescendant` points to a real id. | `option-list-a11y.test.tsx` |
| **Controlled `selectedOptions` without `onChange` warning** (`useControllable`) | None. | Nice-to-have. | `option-list.test.tsx` |
| Multi vs single, interactive groups, disabled, i18n, renderOption | Covered (`option-list.test.tsx` selection, `group-state.test.tsx`, `disabled.test.tsx`, `i18n.test.tsx`, `render-option.test.tsx`). The selection order (`['c','a']` at `option-list.test.tsx:181`, `['efs','s3']` at `group-state.test.tsx:105`) matches the "use the selection order for now" decision. | — | — |

## 3. Redundancy

### Within OptionList (fix now)

- **Focus entry is tested three times.** `highlight.test.tsx:64-69` is a strict subset of `highlight.test.tsx:71-80`; both check the first option is highlighted and scrolled once. `keyboard.test.tsx:15-16` checks the same through `aria-activedescendant`. Merge 64-69 into 71-80 by adding `expect(lastScrolledValue()).toBe('0')`, then delete 64-69. Keep the keyboard one, since it is the start of a navigation sequence.
- **Blur is tested twice.** `keyboard.test.tsx:66-76` checks that blur clears the highlight and `aria-activedescendant`. `highlight.test.tsx:94-105` checks that blur clears the highlight and the next focus picks the first option. Keep the highlight one (add the `aria-activedescendant` assertion to it) and delete the keyboard one. Alternatively, move the "next focus" part into the keyboard one.
- **"Focus, Home, group header highlighted, Enter" setup is repeated four times:** `group-state.test.tsx:107-112`, `group-state.test.tsx:126-133`, `render-option.test.tsx:84-90`, and `option-list-a11y.test.tsx:69-71`. Each asserts something different, so keep them. Extract a `highlightFirstGroupHeader(listbox)` helper in `common.tsx`, or drop the repeated `isHighlighted()` precondition where another test already proves it.
- **Icon rendering is split across two tests.** `option-list.test.tsx:45-60` (icon renders) and `option-list.test.tsx:62-66` (icon slot class) could be one test. This is a nice-to-have.
- **The listbox lookup is duplicated.** `keyboard.test.tsx:57-64` repeats the `find('[role="listbox"]')` lookup instead of `renderOptionList(<div onKeyDown…><Stateful/></div>)`, which works because `renderOptionList` uses `createWrapper(container).findOptionList()`.

### Overlap with the shared listbox tests (keep, different layer)

`keyboard.test.tsx` Escape and Home/End overlap `use-listbox.test.tsx:113-143`. Focus and blur overlap `use-listbox.test.tsx:283-310`. Disabled Enter overlaps `use-listbox.test.tsx:146-154`. Each OptionList test proves OptionList's wiring (`embedded`, no `onEscape`, `spaceSelects`), so keep them. Don't add more hook-level assertions to them.

### Cross-component (for the planned dedup after OptionList, not now)

- Disabled-reason tooltip tests: `disabled.test.tsx:64-106` vs the Select/Multiselect disabled-reason tests.
- `renderOption` item shape: `render-option.test.tsx` vs the Select/Multiselect `renderOption` tests.
- `selectedAriaLabel` i18n: `i18n.test.tsx` vs the Select/Multiselect i18n tests.
- Group header aria-checked/mixed and toggle: `group-state.test.tsx:84-111` vs the Multiselect group-selection tests.
- `renderHighlightedAriaLive` argument mapping: `option-list-a11y.test.tsx:27-75` vs the Select/Multiselect tests.

## 4. Quality vs repo conventions

- **Test-utils usage is good.** Tests use `createWrapper(...).findOptionList()`, `findOptionByValue/Index`, `findGroupHeaderByValue`, `findHighlightedOption`, and `isSelected/isHighlighted/isDisabled`.
- **Raw DOM and class lookups.** These are acceptable under the "no finder exists" exception, but worth noting:
  - `common.tsx:77`: `[role="listbox"]`. The comment explains it. A public `findListbox()` test-util would change the public test-utils API, so ask the user before adding one. Don't add it silently.
  - `highlight.test.tsx:72`: `selectableItemStyles['is-keyboard']`.
  - `option-list-a11y.test.tsx:37-41`: `.closest('[role="option"]')` plus `screenreader-content`. The `.closest` call is redundant because `findHighlightedOption()` already is the option element. Simplify it.
  - `option-list.test.tsx:65,70`: `styles.icon`.
- **`act` and `fireEvent` usage is mixed.** Most tests use `fireEvent.focus(listbox)`, which runs the React handler but leaves `document.activeElement` as `body`. Two tests use `act(() => listbox.focus())`. This works today, but behavior that reads `document.activeElement` (`onMouseLeave` in `use-option-list.ts:62-66`) will behave differently under `fireEvent.focus`. Add a `focusList(listbox)` helper in `common.tsx` that uses `act(() => listbox.focus())` and use it everywhere. Also add a `blurList` helper.
- **Mocks are restored.** `warnOnce` uses `mockReset` in `afterEach` (`option-list.test.tsx:19-21`). `scrollIntoView` is restored (`highlight.test.tsx:25-30`). Other files don't need `scrollIntoView` mocked because `scrollElementIntoView` calls it optionally (`element?.scrollIntoView?.(...)`).
- **Naming** is behavior-based and follows the convention. `render-option.test.tsx:46` (`multi: items carry the option icon, and group header items the group and its checkbox state`) is hard to read; split it or rename it.
- **File organization** is clear. One misplacement: `option-list-a11y.test.tsx` holds the `renderHighlightedAriaLive` tests, which could live in `i18n`/announcement files, but a11y is a reasonable home.
- **Integ flakiness risks.**
  - `option-list-scroll.test.ts`: Home/End native scrolling (see section 1), and the visibility check uses a ±1px tolerance and inspects only `overflow-y: auto|scroll`. That is fine for these pages.
  - The 30 × ArrowDown loop runs without waits. `browser.keys` is synchronous per call, so the risk is low.
  - `click('#option-list-heading')` then `Tab` relies on the click setting the sequential-focus starting point on a non-focusable `h2`. This works in Chrome and is the same pattern in both integ files.
  - In `option-list.test.ts`, the click on `findDescription()` at line 26 depends on layout and is fine.

## 5. Unit test run

```
TZ=UTC mise exec node@22.23.2 -- npx jest -c jest.unit.config.js src/option-list src/internal/components/listbox
Test Suites: 18 passed, 18 total
Tests:       162 passed, 162 total
```

## Prioritized recommendations

All test changes go in commit 4 (`test: Add OptionList unit and integration tests`), as the brief asks. One exception already exists: commit 1 (`a1ce65c51`) added the shared `use-listbox.test.tsx` Escape test together with the `onEscape` change. If the user prefers shared-code tests to travel with the shared change, the shared items marked † could go in commit 1 instead. Ask before moving them.

### Must-fix

1. `keyboard.test.tsx:28-34`: replace the unused `createEvent` Home/End events with `pressKey` and drop the `createEvent` import. This is stale from the dropped `preventDefault` variant. (commit 4)
2. Add OptionList type-ahead tests in `keyboard.test.tsx`. The feature has no OptionList test today. (commit 4)
3. Add direct `scrollOptionIntoView` tests in `scroll-to-index.test.ts`: scrolls the matching item with `nearest`, does nothing for `-1` even if a `-1` element exists, and does nothing when there is no match. (commit 4 †)
4. Run `option-list-scroll.test.ts` against a dev server after the Home/End change and confirm all 6 cases pass. Fix `option-list-scroll.test.ts:70-72` so it checks scrolling away from the current position (ArrowUp to Option 99 after `scrollToTop`). (commit 4)

### Should-fix

5. Rename `group-state.test.tsx:113` and add a comment that it relies on an unchanged index. (commit 4)
6. Merge `highlight.test.tsx:64-69` into `71-80`. Merge the two blur tests (`keyboard.test.tsx:66-76` and `highlight.test.tsx:94-105`). (commit 4)
7. Add `focusList`/`blurList` helpers using real `act(() => el.focus())` in `common.tsx` and use them throughout. Add the "mouse leave while focused keeps the highlight" test. (commit 4)
8. Add leaf-value validation inside groups and "single uses only the first `selectedOptions`" tests in `option-list.test.tsx`. (commit 4)
9. Add a `useMenuKeyboard` test for omitted `onEscape` (`use-keyboard.test.ts`) and an OptionsList `statusType` default test (`options-list.test.tsx`). (commit 4 †)
10. Add a PlainList `scrollStrategy` test (new `listbox/__tests__/plain-list.test.tsx`). (commit 4 †)

### Nice-to-have

11. Test `hideTopDivider` in `selectable-item.test.tsx` and add a first-item-only assertion in OptionList. (commit 4 †)
12. Extract a helper for the repeated "Home → group header" setup. Merge the two icon tests. Use `renderOptionList` in the `keyboard.test.tsx` Escape test. Remove the redundant `.closest('[role="option"]')` in `option-list-a11y.test.tsx:39`. Split or rename `render-option.test.tsx:46`. (commit 4)
13. Add an a11y validation in the highlighted state, a default group-announcement assertion, and a controlled-without-`onChange` warning test. (commit 4)
14. Ask the user whether OptionList should expose a public `findListbox()` test-util. This is a public API decision, so don't add it without asking.
