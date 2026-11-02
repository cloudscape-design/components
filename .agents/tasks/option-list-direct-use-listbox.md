# OptionList on useListbox directly: final report

Goal from the user: "use use-listbox as much as we can", drop `use-option-list`, do both steps, don't push.

Both steps are done and committed locally. Nothing was pushed. Origin still has `refactor/use-listbox-in-select` = `318ee8036` and `feat/add-option-list` = `24173f991`. `feat/add-option-list-v2` does not exist on origin.

| Step | Branch | Worktree | New commit |
|---|---|---|---|
| 1 | `refactor/use-listbox-in-select` | `.worktrees/listbox-use-listbox` | `97391cac5` refactor: Move list scrolling and active descendant into useListbox |
| 2 | `feat/add-option-list-v2` | `.worktrees/option-list-on-use-listbox` | `c2ebf9c1a` refactor: Use useListbox directly in OptionList |

## What changed

**Step 1 (#5204 branch).** `useListbox` now owns the `scrollToIndex` ref, the scroll-on-highlight effect and the `aria-activedescendant` id (`activeDescendantId`). `useSelect` reads `listbox.scrollToIndex` and `listbox.activeDescendantId` and drops its own copies. Its returned API is unchanged. The Select and Multiselect components were not touched, and no new options were added.

**Step 2 (OptionList branch).** `feat/add-option-list` (`17f00cd92`) was rebased onto Step 1 as the new branch `feat/add-option-list-v2`: 33 commits, no conflicts. `17f00cd92` became `a434668dd`. On top of that, `c2ebf9c1a` adds optional `useListbox` settings, all off by default, so Select and Multiselect keep today's behavior:

- `scrollOn: 'highlight-change' | 'keyboard-request'` (default `'highlight-change'`). It replaces `onKeyboardHighlight`, which is removed.
- `keepHighlightOnOptionsChange` (default false). The highlight follows its option when the options change.
- `activeDescendant: 'always' | 'when-highlighted'` (default `'always'`).
- `highlightOption(option)` and `goHome()` are returned. Each one highlights with the keyboard type and requests a scroll.
- `getParent` is now optional and defaults to `() => undefined`.

`src/option-list/internal.tsx` calls `useListbox` directly. `src/option-list/use-option-list.ts` is deleted. `git diff refactor/use-listbox-in-select feat/add-option-list-v2 -- src/select src/multiselect` is empty.

## Line counts

| File | Before | After |
|---|---|---|
| `src/internal/components/listbox/use-listbox.ts` (Step 1) | 169 | 188 |
| `src/internal/components/listbox/use-listbox.ts` (Step 2, from `a434668dd`) | 204 | 277 |
| `src/select/utils/use-select.ts` (Step 1) | 335 | 326 |
| `src/select/utils/use-select.ts` (Step 2) | 326 | 326 |
| `src/option-list/internal.tsx` (Step 2) | 226 | 307 |
| `src/option-list/use-option-list.ts` (Step 2) | 217 | deleted |
| OptionList total (internal + hook) | 443 | 307 |

`use-listbox.ts` is 204 lines at `a434668dd` rather than 188 because the rebased `17f00cd92` adds `onEscape` and `onKeyboardHighlight` to it.

## Tests

All runs used Node 22 (`mise exec node@22.23.2 --`) and `TZ=UTC npx jest -c jest.unit.config.js`.

| Run | Before | After |
|---|---|---|
| Step 1: select, multiselect, autosuggest, property-filter, listbox, options-list, selectable-item | 75 suites / 1174 tests | 75 suites / 1176 tests |
| Step 2: the same set plus `src/option-list` | 83 suites / 1247 tests | 83 suites / 1253 tests |
| Step 2: `src/option-list` only | 8 suites / 67 tests | 8 suites / 67 tests |

- Step 1 adds 2 `use-listbox.test.tsx` cases: `activeDescendantId`, and `scrollToIndex` being called on highlight change.
- Step 2 removes the 3 `onKeyboardHighlight` cases along with the option and adds 9 cases covering `scrollOn`, the setters, `keepHighlightOnOptionsChange` and `activeDescendant`. Each removed assertion has a `scrollOn: 'keyboard-request'` counterpart.
- In both commits, the only test file changed is `use-listbox.test.tsx`. Select, Multiselect and OptionList test files are unchanged (`git diff --stat 17f00cd92 feat/add-option-list-v2 -- src/option-list/__tests__` is empty).
- `tsc --noEmit`, eslint, `npm run quick-build` and `npm run build` pass on both branches. `tsc -p pages/tsconfig.json` shows only the 2 known `@formatjs/ecma402-abstract` `Intl.ListFormat` errors.

## Snapshots

Snapshots were run without `-u`.

- Step 1: 4 suites / 112 tests, 110 snapshots passed, none written or updated.
- Step 2: 4 suites / 113 tests, 111 snapshots passed, none written or updated.

The generated ids are unchanged. The new hooks are added after every id-generating hook, and `useListbox` is still the first id-generating hook in OptionList.

## Review outcome

**APPROVED** (`option-list-direct-use-listbox-review.md`). Step 1 is a pure move. The only difference is effect order: the scroll effect now runs before `useSelect`'s open-highlight and focus effects. This can't be observed because those effects change the highlight through state, so the scroll runs again on the next render. Step 2 matches the behavior of `17f00cd92:src/option-list/use-option-list.ts` line for line. The review found three non-blocking comment-accuracy issues, all of which are still open:

1. The `activeDescendantId` docstring says "undefined when nothing is highlighted". In the default `'always'` mode, it is undefined only when `highlightedIndex` is -1.
2. The `highlight` docstring does not say that the raw `highlight.*WithKeyboard` setters skip the scroll request in `'keyboard-request'` mode. The returned `highlightOption` and `goHome` do scroll.
3. A comment in `internal.tsx` ("…as before") refers to the deleted file. It should state the rule instead: keep `useListbox` the first id-generating hook.

## Left out, and why

- **The three review comments above.** They don't block the change and they don't affect behavior. The workflow stopped after an approved review. They can go in as a follow-up commit on `feat/add-option-list-v2` before pushing.
- **Autosuggest.** It doesn't use `PlainList` or `useListbox`, which matches what was agreed with Andrei.
- **Removing Select/Multiselect tests that duplicate OptionList ones.** This was deferred until OptionList lands, as agreed. Until then, the existing Select and Multiselect suites check that nothing changed.
- **Integration and visual tests.** They were not run in either step. Only unit, snapshot, type-check, lint and build checks ran.
- **`pages/tsconfig.tsbuildinfo`.** It is an untracked build artifact in the worktrees. It was left as is.
- **`feat/add-option-list` and the `option-list-rebase` worktree.** They were not touched and are still at `17f00cd92`. The commands below move them.

## Commands for you (not run)

```sh
# 1. Publish Step 1 (fast-forward from 318ee8036 to 97391cac5)
git push origin refactor/use-listbox-in-select

# 2. Point local feat/add-option-list (checked out in option-list-rebase) at the new history
git -C /Users/amanabiy/Documents/components/.worktrees/option-list-rebase reset --keep feat/add-option-list-v2

# 3. Replace the remote OptionList branch, only if origin is still at 24173f991
git push --force-with-lease=feat/add-option-list:24173f991 origin feat/add-option-list
```

Command 3 rewrites the history of PR #5180's branch. The lease makes the push fail if anyone has pushed to `feat/add-option-list` since `24173f991`. Run command 1 first so that #5180's base already contains Step 1.

## Commits

### `refactor/use-listbox-in-select` (`318ee8036..refactor/use-listbox-in-select`)

```
97391cac5 refactor: Move list scrolling and active descendant into useListbox
 .../components/listbox/__tests__/use-listbox.test.tsx        | 25 +++++++++++++++++++++++++
 src/internal/components/listbox/use-listbox.ts               | 23 +++++++++++++++++++++--
 src/select/utils/use-select.ts                               | 15 +++------------
 3 files changed, 49 insertions(+), 14 deletions(-)
```

### `feat/add-option-list-v2` (`refactor/use-listbox-in-select..feat/add-option-list-v2`, 34 commits)

The commit added in this work:

```
c2ebf9c1a refactor: Use useListbox directly in OptionList
 .../listbox/__tests__/use-listbox.test.tsx         | 160 +++++++++++----
 src/internal/components/listbox/use-listbox.ts     |  99 ++++++++--
 src/option-list/internal.tsx                       | 115 +++++++++--
 src/option-list/use-option-list.ts                 | 217 ---------------------
 4 files changed, 310 insertions(+), 281 deletions(-)
```

The remaining 33 commits are the existing `feat/add-option-list` history, rebased with no conflicts:

```
a434668dd refactor: Build OptionList on the shared useListbox hook   (was 17f00cd92)
 .../listbox/__tests__/use-listbox.test.tsx         |  46 +++++
 src/internal/components/listbox/index.tsx          |  60 ------
 src/internal/components/listbox/use-listbox.ts     |  30 ++-
 src/option-list/internal.tsx                       |  26 ++-
 .../use-option-list.ts}                            | 202 +++++++++------------
 5 files changed, 169 insertions(+), 195 deletions(-)
609965be7 chore: Simplify OptionList options documentation                                  2 files, +4 -8
3698234e7 chore: Split OptionList permutations into single and multi pages                 3 files, +84 -21
4060e4b49 fix: Pass group headers to renderHighlightedAriaLive as the consumer's group      4 files, +27 -3
c505e13f9 fix: Require group values in OptionList                                           6 files, +56 -12
fff033ed5 refactor: Use shared keyboard navigation in OptionList                            3 files, +11 -51
463bf5483 refactor: Use shared listbox helpers in OptionList                                1 file,  +22 -40
3105c0b6e chore: Remove OptionList import restriction from ESLint config                    1 file,  +0 -29
871a45b33 refactor: Use PlainList in OptionList                                             3 files, +20 -87
6d09ef973 revert: Restore Select and Multiselect type-ahead and renderOption behavior      12 files, +13 -427
6a58d5c6e fix: Add gap between icon and content in OptionList options                       3 files, +29 -1
fd83c4ae0 test: Remove OptionList tests covered by listbox tests                            3 files, +0 -26
9b32bf901 test: Prune redundant OptionList unit tests                                       4 files, +16 -56
c42a1eb84 test: Split OptionList unit tests by feature                                      9 files, +1030 -962
3beb4c917 fix: Skip OptionList scroll when nothing is highlighted                           2 files, +16 -0
ed657e8ce feat: Add renderHighlightedAriaLive to OptionList                                 5 files, +95 -4
ed95e0c5a fix: Require option values in OptionList                                          3 files, +30 -38
a885e31ed fix: Start OptionList keyboard focus on the selected option despite hover         2 files, +25 -1
6e842ac53 fix: Wrap OptionList arrow keys at the first and last highlightable options       2 files, +43 -5
a7cb59704 fix: Keep OptionList highlight in sync when options change                        3 files, +122 -3
bde559410 fix: Scroll OptionList highlight on repeated keyboard navigation                  3 files, +63 -13
32a9aa21e fix: Keep disabled reason description with custom OptionList options             4 files, +57 -2
464241d62 fix: Pass the group state as parent in OptionList renderOption                    6 files, +81 -22
a4997ebda fix: Ignore handled keys in OptionList type-ahead                                 5 files, +75 -2
e3a8b35bc fix: Ignore non-matching group headers in OptionList type-ahead                   6 files, +232 -5
ff44150b5 feat: Add OptionList renderOption item types                                      5 files, +143 -25
8558a7210 test: Drop duplicate root scroll container from OptionList scroll page            3 files, +4 -7
39082d006 chore: Use page templates for OptionList dev pages                                1 file,  +11 -14
8404c99ba test: Cover OptionList disabled reason tooltip Escape                             1 file,  +17 -0
4122239be fix: Use own i18n namespace in OptionList                                        18 files, +77 -2
a8a242b10 chore: Clean up OptionList tests and dev pages                                   22 files, +1079 -1397
374db32a0 fix: Prevent native page scroll on Home and End in OptionList                     2 files, +27 -2
450526e85 feat: Add OptionList component                                                   34 files, +3128 -6
```

Per-file stats for every commit: `git -C .worktrees/option-list-on-use-listbox -P log --stat refactor/use-listbox-in-select..feat/add-option-list-v2`.
