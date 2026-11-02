# Review: OptionList focus entry on the selected option, and the scroll integ flake

Worktree `.worktrees/option-list-on-use-listbox`, branch `feat/add-option-list-v2`, HEAD `cb0afbe2e`. Verdict: **APPROVED**, no blockers.

## Evidence

- **History.** `bae20008f..HEAD` has 5 commits with the original subjects: `0bd8a2703`, `3e0d928c4`, `32499b977`, `37f4eaa29`, `cb0afbe2e`. `git range-diff` marks 1, 3 and 5 as `=`. Commit 2 changes only `src/option-list/use-option-list.ts`. Commit 4 changes only `src/option-list/__integ__/option-list-scroll.test.ts` and `src/option-list/__tests__/highlight.test.tsx`. `git diff efa386d63 HEAD -- src/select src/multiselect src/internal` is empty. No tsbuildinfo, package-lock, `.agents/` or `.kiro/` file is committed. `pages/tsconfig.tsbuildinfo` is untracked only. `origin/feat/add-option-list` is still `efa386d63`, and no remote branch contains HEAD.
- **Focus rule** (`use-option-list.ts:54-72`). The new `onFocus` replaces the embedded `onFocus` after the spread of `getListProps({ withKeyboard: true, embedded: true })`, so the embedded `onBlur` stays. It keeps an existing `highlightedOption`. Otherwise it highlights the first entry of useListbox's `selectedOptions` that is one of the rendered `options`, using `highlight.highlightOptionWithKeyboard`, and falls back to `goHomeWithKeyboard`. The `options.includes` filter is correct: `connectOptionsByValue` (`listbox/utils/connect-options.ts`) returns the rendered `DropdownOption` object for a value that matches, and a new `{ option }` object for one that doesn't. `singleSelection` keeps only `selectedOptions[0]`, so single selection can't skip to a second entry. The handler is recreated on every render, so `highlightedOption` is always current. The rule matches the brief and the Select keyboard-open rule. The change adds no pointer-down flag and no other behavior.
- **Docs.** `interfaces.ts`, `index.tsx` and `pages/option-list/` have no text about focus entry (checked with grep), so they need no change and the documenter snapshot doesn't need regenerating. The hook's doc comment and the rule comment were updated.
- **Unit tests** (`highlight.test.tsx`). The brief asked for these cases, and each one is present:
  - the flipped selected-option test, which checks the highlight, the `is-keyboard` class, `aria-activedescendant` and the scroll target;
  - multi selection `['5','2']` highlights `5`, in selection order;
  - no selection highlights the first option;
  - a selected option that is not in `options` falls back to the first option;
  - focus after blur re-applies the rule.

  The hover test was kept and strengthened: `special` is selected, so the test now fails if focus overrides a hover highlight. The recorded mutations confirm the tests work. With the plain embedded `onFocus`, 3 tests fail. Without the hover check, 1 test fails.
- **Integ test.** The `preselected=near-end` case now expects Option 81 and waits until it is visible. The follow-up comment is gone.
- **Flake root cause.** The report's probe trace supports the cause. In `container=page`, the native animated scroll from Home/End keeps moving the page after the next ArrowUp, which carries Option 100 out of the viewport. The failure reproduced locally in 3 of 3 runs with retries off. Home/End skip `preventDefault` in the shared code, so this is not an OptionList scrolling bug.
- **Flake fix.** `assertKeyboardScrolling` is shared by the wrapper, page and both Dropdown cases.
  - Scrolling is now proven with arrow keys only. Thirty ArrowUp presses replace Home.
  - Each step checks the label, then waits for visibility with `waitForAssertion`.
  - Home and End come last and only check the label.
  - With `scrollOptionIntoView` made a no-op, 6 of 6 tests fail, so the test still catches a component that stops scrolling.
- **Verification record.** Everything the brief requires is recorded:
  - the quick-build and the full build;
  - both `tsc` runs (only the 2 known `@formatjs` errors);
  - the unit suites (84 suites, 1258 tests);
  - the snapshot tests without `-u`;
  - eslint and prettier on the changed files;
  - the empty shared diff;
  - the integ runs on port 8187 with retries off: 3 failing runs before the fix and 6 runs of 10/10 after it;
  - a real-browser hover + click check in Chrome. Hovering then clicking Option 3, with a 0 ms or 150 ms press, selects Option 3 in both containers and both selection types.

  The report documents the remaining slow-click limitation (a press with no hover first), as the brief asked.

## Non-blocking note

The `getListProps` doc in `src/internal/components/listbox/use-listbox.ts:86-90` still ends with "Moving focus to the selected option is a follow-up." The brief bars changes to `src/internal`. The sentence remains true for embedded Multiselect, and the report flags it.
