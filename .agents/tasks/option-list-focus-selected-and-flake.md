# OptionList: focus entry on the selected option, and the scroll integ flake

Worktree: `/Users/amanabiy/Documents/components/.worktrees/option-list-on-use-listbox`, branch `feat/add-option-list-v2`.
Started from `efa386d63` (clean; backup branch `backup/feat-add-option-list-v2-efa386d63`). Not pushed.

## New commits (on `bae20008f`, subjects and messages unchanged)

| # | Old | New | Subject |
|---|---|---|---|
| 1 | `0bd8a2703` | `0bd8a2703` (unchanged) | refactor: Add OptionList support to the shared listbox code |
| 2 | `cd5e89d64` | `3e0d928c4` | feat: Add OptionList component |
| 3 | `fac524cc8` | `32499b977` (same patch) | chore: Add OptionList dev pages |
| 4 | `004cef133` | `37f4eaa29` | test: Add OptionList unit and integration tests |
| 5 | `efa386d63` | `cb0afbe2e` (same patch) | chore: clean up translations |

`git range-diff bae20008f..efa386d63 bae20008f..HEAD`: 1, 3, 5 are `=`, only 2 and 4 are `!`.
Commit messages (subjects and bodies) are byte-identical to the old ones (`diff` of `git log --format=%B`).
Made with `git commit --fixup` for each commit, then `GIT_SEQUENCE_EDITOR=: GIT_EDITOR=: git rebase -i --autosquash bae20008f`.
(A first attempt passed the env var in a way that didn't reach git, so `vi` opened on the unmodified todo; I terminated `vi`, git cancelled the rebase with no changes, and I reran it correctly.)

Later push: `git push --force-with-lease=feat/add-option-list:efa386d63 origin feat/add-option-list-v2:feat/add-option-list`.

## Part 1: focus entry

### Rule
`src/option-list/use-option-list.ts:58-72`. OptionList keeps `getListProps({ withKeyboard: true, embedded: true })` (so blur still calls `resetHighlightWithKeyboard`) and overrides only its `onFocus`:
1. If an option is already highlighted (for example a hover highlight), keep it, so a click selects the hovered option.
2. Otherwise, take the first entry of `selectedOptions` from `useListbox` (selection order, which is the order of the `selectedOptions` prop) that is one of the rendered `options`, and highlight it with `highlight.highlightOptionWithKeyboard`. The `useListbox` effect then scrolls it into view.
3. Otherwise, `highlight.goHomeWithKeyboard()`.

This mirrors the keyboard-open rule in `src/select/utils/use-select.ts:231-235`. Step 2 skips selected entries that aren't in `options`: `connectOptionsByValue` returns `{ option }` for them, and `options.includes` filters those out. In single selection, `singleSelection` keeps only the first entry, so this is just "the selected option".

No pointer-down flag was added. `useListbox`, Select, Multiselect (including embedded Multiselect) and every file under `src/internal` are unchanged: `git diff efa386d63 HEAD -- src/select src/multiselect src/internal` is empty (0 lines).

### Files
- `src/option-list/use-option-list.ts` (commit 2): the `onFocus` override, a comment that describes the rule, and the hook doc comment now says focus entry comes from this hook.
- `src/option-list/__tests__/highlight.test.tsx` and `src/option-list/__integ__/option-list-scroll.test.ts` (commit 4).
- `src/option-list/interfaces.ts`: no change. No public doc text describes focus entry today, so there was nothing to update, and `documenter.test.ts.snap` wasn't regenerated (the snapshot suite passes without `-u`). `pages/option-list/` has no comment about focus entry either, so no change there.
- Not changed, because it is in `src/internal` (shared, must not change): the `getListProps` doc in `src/internal/components/listbox/use-listbox.ts:86-90` still ends with "Moving focus to the selected option is a follow-up." That sentence describes the shared embedded rule, which embedded Multiselect still uses, so it remains true for that caller. It could be reworded in a separate change to the shared code if you want.

### Unit tests (`highlight.test.tsx`)
- `:73` flipped and renamed: "focus entry highlights and scrolls to the selected option with the keyboard style". Single selection with `special` (the last option) selected: highlights `special` with `is-keyboard`, sets `aria-activedescendant` to it, scrolls once with `{block:'nearest',inline:'nearest'}`, and the scrolled element is `special`.
- `:86` new: multi selection with `['5', '2']` selected (selection order differs from list order) highlights and scrolls to `5`.
- `:93` new: no selection highlights and scrolls to the first option.
- `:100` new: a controlled `selectedOptions={[{ value: 'missing' }]}` (not in `options`) highlights the first option.
- `:115` kept: "focus keeps a hover highlight, so a click selects the hovered option". It now also has `special` selected, so it fails if focus moves to the selected option over a hover highlight (see mutation 2).
- `:127` updated, also covers "focus again after blur re-applies the rule": select `Special` by click, blur (highlight and `aria-activedescendant` cleared), focus again, highlights and scrolls to `special`.
- No other OptionList unit test assumed first-option entry with a selection. `group-state` and `render-option` use `highlightFirstGroupHeader` (focus, then Home), which still lands on the first item.

### Integ test (`option-list-scroll.test.ts`)
`:111-118`: the `preselected=near-end` case is now "focus entry highlights the selected option near the end and scrolls it into view". It expects `Option 81` and waits until it is visible. The follow-up comment is removed. It runs for `container=wrapper` and `container=page`.

## Part 2: the flaky `container=page` integ test

### Root cause
The test pressed End, then Home, then immediately ArrowUp, and checked the visibility right after the ArrowUp. Home and End don't call `preventDefault` (shared `useMenuKeyboard`), so Chrome also runs its native keyboard scroll, which is animated. That animation keeps scrolling the page after the next key: OptionList's `scrollIntoView` did bring Option 100 into view, and then the leftover Home animation scrolled the page back up past it.

I recorded this with a temporary webdriver probe (deleted afterwards), React 18 dev server, `container=page`, viewport 1200x800 (`top`/`bottom` are the highlighted option's rect, `innerHeight` = 800):

```
after End:       t=1003 hl=Option 100 scrollY=2753 top=679  bottom=713
after Home:      t=1027 hl=Option 1   scrollY=463  top=-1   bottom=31
after ArrowUp #0 t=1050 hl=Option 100 scrollY=2731 top=701  bottom=735    <- scrollIntoView worked, visible
after ArrowUp #1 t=1104 hl=Option 100 scrollY=2524 top=908  bottom=942    <- page still moving (native Home animation)
after ArrowUp #2 t=1159 hl=Option 100 scrollY=2292 top=1140 bottom=1174
after ArrowUp #3+ (stable)            scrollY=2290 top=1142 bottom=1176   <- below the viewport
```

In `container=wrapper` the same sequence only moved the window by a few pixels and the option stayed visible, so only `page` failed. Whether the check lands before or after the animation moves the option out depends on timing, which is why CI passed on retry. Locally, with retries off, it failed in 3 of 3 runs.

This isn't an OptionList scrolling bug: the component scrolls the highlight into view on every move. It follows from the existing shared decision not to call `preventDefault` on Home/End. A user who presses Home and then an arrow key within about 100 ms on a page-scrolled list can see the same thing. I didn't change any component code.

### Fix (test only, commit 4)
`ScrollPage.assertKeyboardScrolling` (`:63-83`), used by `container=wrapper`, `container=page` and both Dropdown cases:
- Visibility checks use `waitForHighlightVisible()` (`:53`), which uses the page object's `waitForAssertion` (p-retry, 5 retries starting at 100 ms) around `isHighlightVisible()`. Each step checks the highlighted label first, then waits for visibility.
- The scroll proofs use only arrow keys, which call `preventDefault`, so every scroll comes from OptionList: 30×ArrowDown → Option 31, 30×ArrowUp → Option 1 (this replaces Home), the wrap ArrowUp → 100, ArrowDown → 1, ArrowUp → 100, then `scrollToTop()` + ArrowUp → Option 99.
- End → Option 100 and Home → Option 1 now come last, as label-only checks, with a comment explaining that the native animated scroll would move the page under any later check.
- The near-end focus test also uses `waitForHighlightVisible()`.

The test can still fail when OptionList stops scrolling (see the integ mutation below).

## Verification record

Node: `mise exec node@22.23.2 --` before every npm/npx command.

| Command | Result |
|---|---|
| `npm run build` at `efa386d63` (before, for the integ baseline) | pass |
| `npm run quick-build` (with the change) | pass |
| `TZ=UTC npx jest -c jest.unit.config.js src/option-list src/select src/multiselect src/autosuggest src/property-filter src/internal/components/listbox src/internal/components/options-list src/internal/components/selectable-item` | **84 suites, 1258 tests, all pass** (before and after `npm run build`). The 3 new tests are in `highlight.test.tsx`. No Select, Multiselect or shared test was edited. |
| `npm run build` (with the change) | pass (no ENOTEMPTY) |
| `npx tsc -p tsconfig.json --noEmit` | pass, no output |
| `npx tsc -p pages/tsconfig.json --noEmit` | only the 2 known `@formatjs/ecma402-abstract/utils.d.ts` `Intl.ListFormat` errors |
| `TZ=UTC npx jest -c jest.unit.config.js src/__tests__/snapshot-tests` (no `-u`) | 113 tests, 111 snapshots, all pass |
| `npx eslint` on the 3 changed files | pass |
| `npx prettier --check` on the 3 changed files | pass |
| `git diff efa386d63 HEAD -- src/select src/multiselect src/internal` | empty |
| `git status` after builds | only untracked `pages/tsconfig.tsbuildinfo` (not tracked in this repo, so `git checkout --` doesn't apply; not committed). `package-lock.json` unchanged. |

### Unit mutations (rebuilt with `quick-build` each time, then restored)
1. Plain embedded `onFocus` (removed the `onFocus` override, so `getListProps`'s rule applies): `jest src/option-list` gives **3 failed, 66 passed**: the selected-option test (`:73`), the multi selection-order test (`:86`), and the blur/refocus test (`:127`). The no-selection and not-in-options tests pass, as expected, because both rules give the first option there.
2. Override without the hover check (removed `if (highlightedOption) return;`): **1 failed, 68 passed**: "focus keeps a hover highlight, so a click selects the hovered option".
Both restored. The final source was rebuilt by the later `npm run build`, and the suites above ran on it.

### Integ runs
Setup: the dev pages are served by the CI integ webpack config (`pages/webpack.config.integ.cjs`, `NODE_ENV=development REACT_VERSION=18`, like the failing React 18 shard) on `127.0.0.1:8187` (not 8080), started in the background and stopped afterwards (8187 and 9515 are free now). Jest ran with a temporary config in `/tmp/olfs-integ/` that reuses `jest.integ.config.js` but sets `baseUrl` to `http://127.0.0.1:8187` and **`jest.retryTimes(0)`**, so a flake fails instead of being retried. `NODE_OPTIONS=--experimental-vm-modules`, as `gulp test:integ` sets. Local ChromeDriver 152 doesn't support the installed Chrome 157, so I downloaded ChromeDriver 157.0.8103.39 into `/tmp/olfs-cd` with `npx @puppeteer/browsers` and put it first on `PATH`. Nothing was installed globally. The user's `.worktrees/option-list-rebase` was not touched.

Command: `npx jest -c /tmp/olfs-integ/jest.config.js src/option-list/__integ__` (2 files, 10 tests).

| When | Runs | Result |
|---|---|---|
| Before the fix (`efa386d63`) | 3 | each run **1 failed, 9 passed**: `container=page › keeps the highlighted option visible` at `option-list-scroll.test.ts:54` via `:72`, the same failure as CI |
| After the fix | 6 | each run **10 passed**, 60/60 |
| Integ mutation: `scrollOptionIntoView` made a no-op in the built `lib` (not in source), scroll file only | 1 | **6 failed, 6 total**: both `keeps the highlighted option visible` cases, both near-end focus cases, and both Dropdown cases. Then `lib` was restored from a backup copy and the dev server recompiled. |

### Real-browser hover + click check
puppeteer-core with local Chrome 157, headless, 1200x800, against the 8187 dev server, page `#/light/option-list/scroll?preselected=near-end` (Option 81 selected, scrolled out of view). The script is `/tmp/olfs-integ/click-check.js`. "Hover + click" is `mouse.move` to Option 3, then `mouse.down`, a pause of 0 or 150 ms, then `mouse.up`, on a list that isn't focused.

| container | selection | scenario | highlighted | visible | selected after |
|---|---|---|---|---|---|
| wrapper | single | Tab in | Option 81 | yes | option-81 |
| wrapper | single | hover + click Option 3, 0 ms | Option 3 | yes | option-3 |
| wrapper | single | hover + click Option 3, 150 ms | Option 3 | yes | option-3 |
| wrapper | multi | Tab in | Option 81 | yes | option-81 |
| wrapper | multi | hover + click Option 3, 0 ms | Option 3 | yes | option-81, option-3 |
| wrapper | multi | hover + click Option 3, 150 ms | Option 3 | yes | option-81, option-3 |
| page | single | Tab in | Option 81 | yes | option-81 |
| page | single | hover + click Option 3, 0 ms | Option 3 | yes | option-3 |
| page | single | hover + click Option 3, 150 ms | Option 3 | yes | option-3 |
| page | multi | Tab in | Option 81 | yes | option-81 |
| page | multi | hover + click Option 3, 0 ms | Option 3 | yes | option-81, option-3 |
| page | multi | hover + click Option 3, 150 ms | Option 3 | yes | option-81, option-3 |

The previous attempt without the hover check selected `option-76` for the slow 150 ms click (`option-list-non-embedded-focus.md`). With the hover check, the slow click selects the clicked option.

## Remaining limitation (known, no mechanism added, as agreed)
If a mousedown reaches an option with no hover highlight (no `mousemove` over the list before the press, for example a touch-like or synthetic press), focus has nothing to keep. It highlights the selected option and scrolls it into view between mousedown and mouseup. If the selected option is out of view and the press is slow, mouseup can land on a different row, and that row gets selected. A normal mouse click sends `mousemove` first, keeps the hover highlight and doesn't scroll, as the table above shows.
