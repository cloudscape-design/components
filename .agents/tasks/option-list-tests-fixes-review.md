# OptionList test fixes for review items 1–13

The change folds a set of test-only edits into commit 4 (`test: Add OptionList unit and integration tests`) on `feat/add-option-list-v2`. It applies items 1–13 of `option-list-tests-review.md` and leaves item 14 (public `findListbox()`) alone. The edits fall into four groups. Stale Home/End and "rebuilt options" leftovers are cleaned up. OptionList gains type-ahead, mouse-leave-while-focused, grouped value validation, single-first-selection and controlled-warning tests. The shared listbox code gains direct tests for `scrollOptionIntoView`, PlainList `scrollStrategy`, `useMenuKeyboard` without `onEscape`, the OptionsList `statusType` default and `hideTopDivider`. Every OptionList unit test now focuses through a real `act(() => el.focus())` helper. Commits 1–3 are byte-identical to `a1ce65c51`, `00ecc37e1` and `10a6b46f8`. The branch has exactly 4 commits on `73f803b62` with the original subjects, and no build artifacts or agent files are committed.

Watch for: the integ changes in `option-list-scroll.test.ts` have not been run (port 8080 is the user's dev server), so the new "Option 31", wrap and "Option 99 after scrollToTop" expectations are unverified in a browser. Two small test-quality nits are noted below. Neither blocks.

**Verdict**: APPROVED

## High-level view

The source assertions match the decided behavior. I checked them against `scroll-to-index.ts`, `plain-list.tsx`, `use-option-list.ts`, `internal.tsx`, `check-option-value-field.ts`, `use-type-ahead.ts` and `options-list/index.tsx`. `scrollOptionIntoView` returns for `index < 0` and otherwise calls `scrollElementIntoView` on `[data-mouse-target=index]` with `nearest`/`nearest`. PlainList picks `scrollOptionIntoView` only for `'ancestors'`. The default `scrollToIndex` path calls `scrollBy` only when `clientHeight > 15`, and the new test stubs `clientHeight=100` with geometry that yields exactly `{top:150}`. The root `onKeyDown` is `onTypeAhead`. `onMouseLeave` resets only when the list is not `document.activeElement`, and the new test uses real focus so that branch is exercised. The warning strings match `checkOptionValueField` and `useControllable` with `componentName: 'OptionList'`.

The verification note maps every item to a file:line and records all the requested evidence: quick-build, `tsc` for both configs (the pages config has only the 2 known `@formatjs` errors), and the jest set at 1257 tests against a baseline of 1241. The +16 delta is itemized. It also records unchanged snapshots, eslint and prettier, and both mutation checks failing as expected (the `index < 0` guard and the type-ahead wiring). It states that the user must run `src/option-list/__integ__`.

The integ rewrite does what review item 4 asked. Home and End now only check labels, because their native scroll can't prove anything. The scroll proof uses arrow-key wraps, and `useMenuKeyboard` calls `preventDefault` on arrows, so the browser does no native arrow scroll. After `scrollToTop()`, ArrowUp from Option 100 to Option 99 forces a real scroll away from the current position.

<details>
<summary>Issues (3)</summary>

1. **Integ expectations not run** (confirmed, informational): run `src/option-list/__integ__` across all containers (wrapper, page, dropdown with expandToViewport false/true) before pushing.
2. **`statusType` default test title overclaims** (confirmed, nit): `options-list.test.tsx:123` says "defaults to "finished"", but it can only tell that the default is not `'pending'`, as the coder noted. Rename it to something like `onLoadMore does not fire on open when statusType is omitted`.
3. **Disabled type-ahead test is vacuous on its own** (confirmed, nit): `keyboard.test.tsx` `typing does not highlight a disabled option` still passes with type-ahead fully unwired. The other two type-ahead tests catch that mutation, so this is fine. To make it self-standing, type `t` afterwards and assert `c`.

</details>

<details>
<summary>Details</summary>

### Scope and commit hygiene

`git diff --name-only backup/feat-add-option-list-v2-22a4a7f2c HEAD` lists only `__tests__`/`__integ__` paths (15 files). `git diff --quiet` passes for all three earlier commits. `git log 73f803b62..HEAD` shows exactly the 4 original subjects. `git status` shows only untracked `pages/tsconfig.tsbuildinfo`. No `findListbox` was added to test-utils. The `[role="listbox"]` lookup in `common.tsx` stays behind its explanatory comment.

### Assertion strength on the new shared tests

The PlainList tests prove both branches. The `'ancestors'` test checks that `scrollIntoView` ran on the `[data-mouse-target="1"]` item and that `scrollBy` did not run. The default test checks the opposite. `scrollOptionIntoView`'s `-1` test plants a real `data-mouse-target="-1"` row, so it fails if the guard is removed, as mutation 1 confirmed. Every `scrollIntoView` prototype mock is restored in `afterEach`.

The `statusType` test (issue 2) and the disabled type-ahead test (issue 3) are the only ones that can't fail on their own for the behavior their titles describe.

### Conventions

The tests use test-utils finders throughout. Class-name lookups remain only for `hide-top-divider`, `is-keyboard`, `screenreader-content` and the option-list `icon` slot, where no finder exists. The a11y file also switched from `styles.css.js` to `styles.selectors.js`. Dev warnings are asserted through the mocked `warnOnce` with `(componentName, message)`, as `tests.instructions.md` requires. No `fireEvent.focus`/`fireEvent.blur` remain in `src/option-list/__tests__`.

</details>

<details>
<summary>File map</summary>

- `src/internal/components/listbox/__tests__/plain-list.test.tsx`: new, `scrollStrategy` ancestors vs default.
- `src/internal/components/listbox/__tests__/scroll-to-index.test.ts`: `scrollOptionIntoView` match, `-1` and no-match cases.
- `src/internal/components/options-list/__tests__/options-list.test.tsx`: omitted `statusType` doesn't load more.
- `src/internal/components/options-list/__tests__/use-keyboard.test.ts`: Escape without `onEscape` is not stopped.
- `src/internal/components/selectable-item/__tests__/selectable-item.test.tsx`: `hideTopDivider` class.
- `src/option-list/__integ__/option-list-scroll.test.ts`: Home/End label-only, arrow-wrap scroll proof, ArrowUp after `scrollToTop`, follow-up comment.
- `src/option-list/__tests__/common.tsx`: `focusList`, `blurList`, `highlightFirstGroupHeader`.
- `src/option-list/__tests__/{disabled,group-state,highlight,i18n,keyboard,option-list-a11y,option-list,render-option}.test.tsx`: real focus helpers, merged/renamed/split tests, type-ahead, mouse leave, a11y highlighted state, group announcement, value/single/controlled warnings, first-item divider.

Full diff: `git -C .worktrees/option-list-on-use-listbox diff backup/feat-add-option-list-v2-22a4a7f2c HEAD`.

</details>
