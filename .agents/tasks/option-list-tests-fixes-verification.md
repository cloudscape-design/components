# OptionList tests fixes: verification

Worktree: `/Users/amanabiy/Documents/components/.worktrees/option-list-on-use-listbox`, branch `feat/add-option-list-v2`.
Source review: `.agents/tasks/option-list-tests-review.md`, items 1–13 (item 14, the public `findListbox()` test-util, excluded as instructed).

Only test files changed. No component or shared source changed. All test changes were folded into commit 4 with a fixup commit and a non-interactive autosquash.

## Commits

```
2de5a59f8 (HEAD -> feat/add-option-list-v2) test: Add OptionList unit and integration tests
10a6b46f8 chore: Add OptionList dev pages
00ecc37e1 feat: Add OptionList component
a1ce65c51 refactor: Add OptionList support to the shared listbox code
73f803b62 (origin/refactor/use-listbox-in-select, refactor/use-listbox-in-select) refactor: Share embedded list focus handling through useListbox
```

Commits 1–3 keep their hashes. Only commit 4 changed: `22a4a7f2c` → `2de5a59f8`. Backup: `backup/feat-add-option-list-v2-22a4a7f2c`.

- `git diff --quiet a1ce65c51 HEAD~3` → 0 (identical)
- `git diff --quiet 00ecc37e1 HEAD~2` → 0 (identical)
- `git diff --quiet 10a6b46f8 HEAD~1` → 0 (identical)
- `git diff --stat 22a4a7f2c HEAD`: 15 files changed, 365 insertions(+), 101 deletions(-). All of them are under `__tests__` or `__integ__`.
- Commit 4 (`git diff --stat HEAD~1 HEAD`): 16 files changed, 1477 insertions(+), 1 deletion(-).

Not pushed. The push command for later (not run): `git push --force-with-lease=feat/add-option-list:24173f991 origin feat/add-option-list-v2:feat/add-option-list`

## Item → change

Line numbers refer to the files at `2de5a59f8`.

| # | Item | Change |
|---|---|---|
| 1 | Stale `createEvent` Home/End in keyboard test | `src/option-list/__tests__/keyboard.test.tsx:21-43`: Home and End now use `pressKey`. The `createEvent` and `createWrapper` imports are removed. |
| 2 | OptionList type-ahead tests | `keyboard.test.tsx:75-98`, new `describe('type-ahead')`. (a) `:76` typing `t` highlights "Third" and sets `aria-activedescendant` to its id. (b) `:84` typing `s` with `withDisabled` keeps the highlight on "First", because `useTypeAhead` filters with `isInteractive`/`isGroupInteractive`, which exclude disabled options. (c) `:92` in multi with groups, typing `s` highlights the "Storage" group header (`interactiveGroups`). |
| 3 | Direct `scrollOptionIntoView` tests | `src/internal/components/listbox/__tests__/scroll-to-index.test.ts:172-211`. (a) `:193` scrolls the `[data-mouse-target="2"]` element with `{block:'nearest',inline:'nearest'}`. (b) `:201` does nothing for index -1 even when a `data-mouse-target="-1"` element exists. (c) `:207` does nothing when no element matches. These use a real `document.createElement` tree, and `HTMLElement.prototype.scrollIntoView` is mocked and restored. |
| 4 | Integ scroll proof | `src/option-list/__integ__/option-list-scroll.test.ts:57-83`. 30×ArrowDown now also asserts "Option 31". Home and End only check the label (comment at `:64`). The scroll proof uses the ArrowUp/ArrowDown wrap: Option 1 → 100 → 1 → 100, each asserted visible (`:71`). After `scrollToTop()`, ArrowUp moves to Option 99, which must be scrolled back into view (`:79`). Added a `// Follow-up:` comment on the near-end test (`:113`). **Not run** (see below). |
| 5 | Rename the group-state "rebuilt" test | `src/option-list/__tests__/group-state.test.tsx:122` is renamed `keeps the highlight when the options are recreated with the same values`. It has a comment that it relies on an unchanged index, plus a `// Follow-up:` (`:125`). |
| 6 | Merge duplicate focus-entry and blur tests | `highlight.test.tsx:73` now also asserts `lastScrolledValue() === '0'`. The old subset test `focus entry highlights and scrolls to the first option` is deleted. The blur test `highlight.test.tsx:96` now asserts that `aria-activedescendant` is absent before focus, set to option 1 on focus, and absent after blur. The duplicate `keyboard.test.tsx` blur test is deleted. |
| 7 | `focusList`/`blurList` helpers and a mouse-leave-while-focused test | `src/option-list/__tests__/common.tsx:89,91` use `act(() => el.focus()/blur())`. Every `fireEvent.focus(listbox)` in the OptionList unit tests was replaced (keyboard, highlight, group-state, disabled, i18n, a11y, render-option). New test `highlight.test.tsx:65` `mouse leave keeps the highlight while the list has focus`. |
| 8 | Leaf value validation in groups, and single uses the first `selectedOptions` | `option-list.test.tsx:125` asserts the exact `checkOptionValueField` `warnOnce('OptionList', …)` message for a grouped option without `value`, and no warning for `groupedOptions`. `option-list.test.tsx:184` checks that single with `[{value:'b'},{value:'c'}]` gives `selectedLabels` `['Second']`. |
| 9 | `useMenuKeyboard` without `onEscape`, and OptionsList `statusType` default | `src/internal/components/options-list/__tests__/use-keyboard.test.ts:108` uses a fresh Escape event and asserts that neither `stopPropagation` nor `preventDefault` is called. `src/internal/components/options-list/__tests__/options-list.test.tsx:123` checks that `onLoadMore` is not called on open when `statusType` is omitted. Note: the only effect of `statusType` is the `=== 'pending'` check, so this test guards against a `'pending'` default. It can't tell `'finished'` apart from `undefined`. |
| 10 | PlainList `scrollStrategy` | New `src/internal/components/listbox/__tests__/plain-list.test.tsx`. `:50` `'ancestors'` calls `scrollIntoView` on the `[data-mouse-target="1"]` item and not `scrollBy`. `:59` the default calls `list.scrollBy({top:150})` (with jsdom layout stubbed) and not `scrollIntoView`. |
| 11 | `hideTopDivider` | `src/internal/components/selectable-item/__tests__/selectable-item.test.tsx:84` checks that the class is applied only with the prop. `option-list.test.tsx:79` checks that only the first option has `hide-top-divider` (`[true,false,false]`). Both use `styles.selectors.js` class names (no test-utils finder exists). |
| 12 | Cleanups | Added a `highlightFirstGroupHeader` helper (`common.tsx:94`), used at `group-state.test.tsx:114,140`, `render-option.test.tsx:97` and `option-list-a11y.test.tsx:91`. The redundant `isHighlighted()` preconditions were dropped in render-option and a11y and kept in group-state, where they are the assertion. The two icon tests are merged into `option-list.test.tsx:45`. The Escape test uses `renderOptionList(<div onKeyDown>…)` (`keyboard.test.tsx:61`). The `.closest('[role="option"]')` is removed: the shared `announcement(wrapper)` helper is at `option-list-a11y.test.tsx:47`, and the a11y file now imports `styles.selectors.js`. `render-option.test.tsx:46` is split into `:48` `multi: items carry the option icon` and `:67` `multi: group header items carry the group and its checkbox and highlight state`. |
| 13 | Nice-to-have a11y and warning tests | `option-list-a11y.test.tsx:37` validates a11y with an option highlighted (`aria-activedescendant` set). `option-list-a11y.test.tsx:49` checks that the default announcement of a highlighted grouped option contains "Compute". `option-list.test.tsx:253` checks that controlled `selectedOptions` without `onChange` triggers the `useControllable` `warnOnce` message. |
| 14 | Public `findListbox()` | Skipped as instructed. No test-utils API change. |

## Bugs found

None. Every new assertion matched the current behavior. One observation, not changed, about shared `useTypeAhead`/`filterOptions` behavior: when a group label or value matches the typed character, all of that group's children are included in the matches. A child match also includes its group header. So in multi with interactive groups, typing `l` (Lambda) highlights the "Compute" header first. Select and Multiselect behave the same way. I didn't assert it.

## Commands and results

Node 22 via `mise exec node@22.23.2 --`.

- `npm run quick-build` → exit 0. ENOTEMPTY didn't occur.
- `npx tsc -p tsconfig.json --noEmit` → exit 0, 0 errors.
- `npx tsc -p pages/tsconfig.json --noEmit` → 2 errors, both the known `@formatjs/ecma402-abstract` `Intl.ListFormat` ones.
- Extra check: `npx tsc -p tsconfig.unit.json --noEmit` → 50 errors. All of them come from the environment or unrelated files: d3-scale vendor types, the `snapshot-tests` lib-definitions before the build, dynamic-import `module` flags in container/dropdown style tests, and the toolkit `React.JSX` type in the other worktree's node_modules. None are in the changed files.
- Extra check: `npx tsc -p tsconfig.integ.json --noEmit` fails on the config itself (`TS5109 moduleResolution`), so it can't type-check here. The integ file passes eslint (which runs the TS parser) and prettier.
- `TZ=UTC npx jest -c jest.unit.config.js src/option-list src/select src/multiselect src/autosuggest src/property-filter src/internal/components/listbox src/internal/components/options-list src/internal/components/selectable-item` → **84 suites, 1257 tests, all pass**. Baseline 1241, +16: type-ahead +3, keyboard blur −1, highlight focus subset −1 and mouse leave +1, render-option split +1, a11y +2, option-list icon merge −1 plus hideTopDivider, leaf value, single first and controlled warn +4, scrollOptionIntoView +3, PlainList +2, useMenuKeyboard +1, OptionsList +1, SelectableItem +1. Re-run after the lint autofix and the full build gave the same result.
- `npm run build` → exit 0.
- `TZ=UTC npx jest -c jest.unit.config.js src/__tests__/snapshot-tests` (no `-u`) → 4 suites, 113 tests, 111 snapshots, all pass, unchanged.
- `npx eslint <15 changed test files>` → first run reported 3 fixable issues (import sort in `plain-list.test.tsx`, prettier wrapping in `keyboard.test.tsx` and `option-list.test.tsx`). After `eslint --fix` → exit 0. `npx prettier --check <same files>` → exit 0.
- Mutation 1: removed `if (index < 0) return;` from `scroll-to-index.ts` → `does not scroll when nothing is highlighted, even if a non-interactive row uses index -1` **fails** (1 failed, 11 passed). Restored, `git diff --quiet` → clean.
- Mutation 2: removed `onKeyDown: onTypeAhead` from `getRootProps` in `use-option-list.ts`, then ran quick-build → `typing a character highlights the first option that starts with it` and `multi: typing can highlight a group header` **fail** (2 failed, 4 passed). The disabled-option type-ahead test still passes, as expected, because it asserts that nothing changes. Restored, `git diff --quiet` → clean, quick-build rerun → exit 0. My first attempt at this mutation (`onTypeAhead && undefined`) didn't compile (TS2774), so it ran no tests, and I replaced it with the removal above.
- `git status --short` after the commit → only `?? pages/tsconfig.tsbuildinfo`. `package-lock.json` is unmodified.

## Integ tests: must be run by the user

The integ tests were not run because port 8080 is the user's dev server. Run `src/option-list/__integ__` (both files, all containers: wrapper, page, and dropdown with expandToViewport false and true) against your dev server before merging. The new expectations to watch are "Option 31" after 30×ArrowDown, the ArrowUp/ArrowDown wrap visibility checks, and "Option 99" being visible after `scrollToTop()` + ArrowUp.
