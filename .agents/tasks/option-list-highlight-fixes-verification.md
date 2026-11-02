# OptionList highlight fixes — verification

Worktree: `/Users/amanabiy/Documents/components/.worktrees/pr3-option-list` (branch `feat/add-option-list`, base HEAD `d60d7e256`).

## Fix 1

Scroll on every keyboard navigation request (Copilot comment on `src/internal/components/listbox/index.tsx`).

### Change

- `src/internal/components/listbox/use-listbox.ts`: new `scrollRequest` state counter, incremented by a `withScroll` wrapper around every keyboard highlight: ArrowUp/ArrowDown (`moveHighlight`, including the wrap to End/Home), Home, End, focus-entry highlight (selected option or Home), and type-ahead (`highlightOption`). Mouse highlights (`setHighlightedIndexWithMouse`) and `resetHighlightWithKeyboard` don't increment it. Exposed on the controller as `scrollRequest` (documented on `UseListboxApi`).
- `src/internal/components/listbox/index.tsx`: scroll effect depends on `[controller.highlightedIndex, controller.scrollRequest]`. `List` still scrolls only when `highlightType.moveFocus`, so hover never scrolls.
- The controller API in this branch has no programmatic `highlightOption` method, so there was nothing extra to wrap. The type-ahead path is the keyboard `highlightOption` used by the hook.
- Unchanged: pointer focus adds no highlight and doesn't scroll; Home/End `preventDefault`; `use-highlight-option.ts`; Select/Multiselect.

### Tests (`src/option-list/__tests__/option-list.test.tsx`, "focus and highlight")

- `repeating a keyboard move that keeps the highlight scrolls it into view again`: focus, End, clear mock, End again → 1 scroll on `special`.
- `a keyboard highlight of the hovered option scrolls it into view`: hover `special` (no scroll), type `s` (type-ahead to the same row) → 1 scroll on `special`.
- `hovering after keyboard navigation does not scroll`: focus, clear mock, hover two options → no scroll.

### Fail before fix

`npm run quick-build` then `TZ=UTC node_modules/.bin/jest -c jest.unit.config.js src/option-list/__tests__/option-list.test.tsx -t "focus and highlight"`:

- ✕ repeating a keyboard move that keeps the highlight scrolls it into view again — expected 1 call, received 0
- ✕ a keyboard highlight of the hovered option scrolls it into view — expected 1 call, received 0
- ✓ hovering after keyboard navigation does not scroll (guard, passes before and after)
- Tests: 2 failed, 9 passed (57 skipped)

### Pass after fix

- `npm run quick-build`: finished OK.
- `TZ=UTC node_modules/.bin/jest -c jest.unit.config.js src/option-list src/internal/components/listbox`: Test Suites 8 passed, Tests 135 passed.
- `npx eslint` on the 3 changed files: clean.
- `npx prettier --check` on the 3 changed files: clean.

### Commit

`87344fe154204d830ecfba38ecfae1379a986862` — `fix: Scroll OptionList highlight on repeated keyboard navigation` (hooks ran: lint-staged eslint, git-secrets; not pushed).

```
 src/internal/components/listbox/index.tsx      |  7 +++--
 src/internal/components/listbox/use-listbox.ts | 39 ++++++++++++++++++-------
 src/option-list/__tests__/option-list.test.tsx | 30 +++++++++++++++++++
 3 files changed, 63 insertions(+), 13 deletions(-)
```

## Fix 2

Reconcile the highlight when options change (Copilot comment on `src/internal/components/listbox/use-listbox.ts`, `useHighlightedOption(...)` / `getOptionId(listId, highlightedIndex)`). Not committed in this step.

### Change

- `src/internal/components/listbox/use-listbox.ts`:
  - Reconciles during render with the React "previous props" pattern (`const [previousOptions, setPreviousOptions] = useState(options); if (previousOptions !== options) {...}`), so a stale index is never committed. The previously highlighted option is `previousOptions[highlightedIndex]`; it's looked up in the new `options`.
  - Found and highlightable at a new index: moves the highlight there with the setter of the current type. Keyboard → `highlightOptionWithKeyboard(option)`, mouse → `setHighlightedIndexWithMouse(index, highlightType.moveFocus)`. `useHighlightedOption` keeps the existing `HighlightType` object when the type doesn't change, so `moveFocus` is preserved too. These are the raw setters, not the `withScroll` wrappers, so the Fix 1 `scrollRequest` counter isn't bumped. Same index: no-op.
  - Gone, not highlightable, or had no value: `resetHighlightWithKeyboard()` (index -1). Nothing happens when nothing was highlighted.
  - `aria-activedescendant` is set only when `highlightedOption` exists (`highlightedOption ? getOptionId(...) : undefined`), so React omits the attribute otherwise. `getOptionId` already returned `undefined` for -1. The new guard covers an index with no highlightable option.
  - Identity (`isSameOption`): matches by `option.value` (must be `!== undefined`) and by kind (group header vs. non-header). Why value and not the object: OptionList's `useMemo` rebuilds every internal option and group object (`toInternalOptions` + `flattenOptions`) whenever the consumer's `options` changes, so references never survive a change. The public API documents `value` as unique for options (and warns on duplicates), and for groups `value` is what test-utils use to find a group. Comparing the kind keeps a group and a leaf with the same value apart. With no value there's nothing stable to match, so the highlight resets instead of guessing.
- `src/internal/components/listbox/index.tsx`: the scroll effect now depends only on `controller.scrollRequest` (with an `exhaustive-deps` disable and a comment). Before, it also depended on `highlightedIndex`, so the reconcile's index change scrolled with keyboard highlights (confirmed, see below). Every keyboard request already bumps `scrollRequest` in the same batch as the highlight change. Mouse highlights never scrolled (`moveFocus` false), and reset to -1 needs no scroll, so the index dependency added nothing else.
- Focus entry is unchanged: `onFocus` still highlights the first selected option in list order, or Home. All existing "focus and highlight" tests pass.
- Unchanged: `use-highlight-option.ts`, Select/Multiselect.

### Existing tests asserting aria-activedescendant

No existing test asserted an empty-string or dangling `aria-activedescendant`. The only `not.toHaveAttribute('aria-activedescendant')` is in `src/autosuggest/__tests__/autosuggest.test.tsx` (unrelated). Nothing was updated.

### Tests (`src/option-list/__tests__/option-list.test.tsx`, new "highlight when options change" block)

- (c) `has no aria-activedescendant without a highlighted option`: absent before interaction, present on focus, absent after blur.
- (a) `clears the highlight when the highlighted option is removed, and arrow keys still move it`: End → `c`, rerender with `[a]` → no highlight, no attribute. ArrowDown → `a`, and `aria-activedescendant` resolves to `a`'s row.
- (b) `keeps the keyboard highlight on the same option when options are reordered or inserted, without scrolling`: highlight `banana` (index 1), rerender `[date, cherry, banana, apple]` → `banana` is highlighted with the keyboard class, `aria-activedescendant` resolves to its row, there's no `scrollIntoView`, and ArrowDown then goes to `apple`.
- `keeps the mouse highlight on the same option when options are reordered`: hover `banana`, reorder → `banana` is still highlighted, no keyboard class, no scroll.
- `multi: keeps a highlighted group header when groups are reordered`: highlight the `storage` header, swap the groups → `storage` is still highlighted, `compute` isn't, and `aria-activedescendant` resolves to the `storage` header.

### Fail before fix

`npm run quick-build` then `TZ=UTC node_modules/.bin/jest -c jest.unit.config.js src/option-list/__tests__/option-list.test.tsx -t "highlight when options change"`:

- ✓ has no aria-activedescendant without a highlighted option (guard, passes before and after, because `getOptionId` returns `undefined` for -1)
- ✕ clears the highlight when the highlighted option is removed… (attribute still present / dangling)
- ✕ keeps the keyboard highlight on the same option… (expected `banana`, received `cherry`)
- ✕ keeps the mouse highlight on the same option… (expected `banana`, received `apple`)
- ✕ multi: keeps a highlighted group header… (expected true, received false)
- Tests: 4 failed, 1 passed (68 skipped)

Extra check: with the `use-listbox.ts` fix in place but `index.tsx` reverted to HEAD, only the keyboard reorder test failed, because the reconcile scrolled. So the `index.tsx` change is required for "no scroll on reconcile". Restored afterwards and rebuilt.

### Pass after fix

- `npm run quick-build`: finished OK.
- `TZ=UTC node_modules/.bin/jest -c jest.unit.config.js src/option-list src/internal/components/listbox`: Test Suites 8 passed, Tests 140 passed.
- `npx eslint` on the 3 changed files: clean.
- `npx prettier --check` on the 3 changed files: clean.

```
 src/internal/components/listbox/index.tsx      |  6 +-
 src/internal/components/listbox/use-listbox.ts | 31 ++++++++-
 src/option-list/__tests__/option-list.test.tsx | 88 +++++++++++++++++++++++++
 3 files changed, 122 insertions(+), 3 deletions(-)
```

### Commit

`4f66c43bf78e8f3b7db2bc6cc7f2558089d598f8` `fix: Keep OptionList highlight in sync when options change` (on top of Fix 1 `87344fe15`). Hooks ran (lint-staged eslint, git-secrets) and passed. Not pushed.

```
 src/internal/components/listbox/index.tsx      |  6 +-
 src/internal/components/listbox/use-listbox.ts | 31 ++++++++-
 src/option-list/__tests__/option-list.test.tsx | 88 +++++++++++++++++++++++++
 3 files changed, 122 insertions(+), 3 deletions(-)
```

## Final verification

Run at HEAD `4f66c43bf` (branch `feat/add-option-list`, 2 commits on top of `d60d7e256`). No source edits, no commits, nothing pushed.

### Scope check

`git diff --stat d60d7e256..HEAD`:

```
 src/internal/components/listbox/index.tsx      |   9 +-
 src/internal/components/listbox/use-listbox.ts |  70 +++++++++++---
 src/option-list/__tests__/option-list.test.tsx | 118 ++++++++++++++++++++++++
 3 files changed, 183 insertions(+), 14 deletions(-)
```

`git diff --stat d60d7e256..HEAD -- src/select src/multiselect src/internal/components/options-list/utils/use-highlight-option.ts` is empty. Select, Multiselect and `use-highlight-option.ts` are untouched.

### Build

`npm run quick-build`: exit 0, finished first try (no ENOTEMPTY rerun needed).

### Unit tests

`TZ=UTC node_modules/.bin/jest -c jest.unit.config.js src/option-list src/internal/components/listbox src/select src/multiselect`: exit 0. Test Suites 37 passed, Tests 563 passed, 0 failed.

### Integ tests

- `npm run start:integ` in the worktree (background). Webpack compiled successfully; `http://localhost:8080/` returned 200.
- Port 9515 was free. Started `/tmp/listbox-04-chromedriver/chromedriver/mac_arm-155.0.8059.85/chromedriver-mac-arm64/chromedriver --port=9515`; `/status` reported ChromeDriver 155.0.8059.85 ready.
- `NODE_OPTIONS=--experimental-vm-modules node_modules/.bin/jest -c jest.integ.config.js src/option-list/__integ__/`: exit 0. `option-list.test.ts` and `option-list-scroll.test.ts` passed. Test Suites 2 passed, Tests 10 passed. Uses the repo's default `ChromeHeadlessIntegration` browser config (`build-tools/integ/setup.integ.js`), the same as CI.
- Stopped both. Afterwards nothing was listening on 8080 or 9515, and no webpack-integ or chromedriver processes were left.

### Cleanup

- `package-lock.json`: not modified.
- `pages/tsconfig.tsbuildinfo`: untracked and not changed by this run (mtime still Oct 27 19:14). Nothing to restore, so it was left in place.
- The `npm-lock-churn` stash (`stash@{1}`) was left in place.
