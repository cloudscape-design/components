# OptionList: non-embedded useListbox mode with Select-like focus entry

Status: **blocked, waiting for a decision**. A real-browser mouse click selects the wrong option in one case (see "Mouse click verification"). Following the task, I reported it instead of adding a mechanism. Nothing is committed yet; the changes are uncommitted in the worktree.

Worktree: `/Users/amanabiy/Documents/components/.worktrees/option-list-on-use-listbox`, branch `feat/add-option-list-v2`, still at `efa386d63`.

## Rule implemented (uncommitted)

`src/option-list/use-option-list.ts`:
- `getListProps({ withKeyboard: true })` (no `embedded`).
- Own `onFocus`: if `selectedOptions[0]` (useListbox's connected selection, selection order) exists and is in `options`, `highlight.highlightOptionWithKeyboard(it)`; otherwise `highlight.goHomeWithKeyboard()`.
- Own `onBlur`: `highlight.resetHighlightWithKeyboard()`.
- onMouseLeave and type-ahead in `getRootProps` unchanged. No pointer-down flag.

## Tests changed (uncommitted)

`src/option-list/__tests__/highlight.test.tsx`:
- focus entry highlights and scrolls to the selected option with the keyboard style (single).
- multi with `['5', '2']` selected highlights `5` (selection order).
- no selection highlights and scrolls to the first option.
- selected option not in `options` highlights the first option.
- a click selects the clicked option, also when focus moves the highlight to the selected option (replaces "focus keeps a hover highlight").
- blur clears highlight and aria-activedescendant; focus after blur highlights the selected option.

`src/option-list/__integ__/option-list-scroll.test.ts`: the near-end case expects `Option 81` highlighted and visible; follow-up comment removed.

## Results so far

- `npm run quick-build`: pass.
- `TZ=UTC npx jest -c jest.unit.config.js src/option-list`: 69/69 pass.
- `npm run build`: pass.
- Not yet run: tsc checks, full jest set, snapshot tests, eslint/prettier, mutation check, commits.

## Mouse click verification (real browser)

Static dev pages from `npm run build` (`pages/lib/static-default`) served on `127.0.0.1:8187` (not 8080), checked with puppeteer-core + local Chrome, viewport 1200x800, page `#/light/option-list/scroll`. Script: `/tmp/olnef-browser-check.js`.

| container | scenario | highlighted after | highlight visible | selected after |
|---|---|---|---|---|
| wrapper | Tab in, Option 81 selected | Option 81 | yes | option-81 |
| wrapper | click Option 3, list unfocused, Option 81 selected, mousedown→mouseup 0 ms | Option 81 | yes | option-3 |
| wrapper | same, mousedown→mouseup 150 ms | Option 81 | yes | **option-76** |
| wrapper | click Option 5, unfocused, nothing selected | Option 1 | yes | option-5 |
| page | Tab in, Option 81 selected | Option 81 | yes | option-81 |
| page | click Option 3, unfocused, Option 81 selected, 0 ms | Option 81 | yes | option-3 |
| page | same, 150 ms | Option 81 | yes | **option-73** |
| page | click Option 5, unfocused, nothing selected | Option 1 | yes | option-5 |

Scroll into view on focus works: Tab entry highlights Option 81 and scrolls it into view in both the wrapper and the page container.

Mouse click fails when the selected option is out of view. Mousedown focuses the list, onFocus highlights the selected option with the keyboard type, PlainList (`scrollStrategy="ancestors"`) scrolls it into view, and the mouseup at human speed lands on whatever row is now under the pointer (Option 76 / 73 instead of Option 3). With a 0 ms click the mouseup arrives before the scroll and the clicked option is selected. When nothing is selected, or the selected option is already in view, the click selects the clicked option (the highlight moves to the first option, which only scrolls if it is out of view, so the same failure can happen if the first option is scrolled out of view).

The jsdom unit test passes because `scrollIntoView` is mocked; it can't catch this.
