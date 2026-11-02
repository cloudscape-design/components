# Unified listbox: verification

- The work is on the new branch `feat/listbox-unified-2` (tip `b2f8bf0ec`, base `4c06e5e9f`). `feat/listbox-unified` was left at `9a6541a01`. Worktree: `/Users/amanabiy/Documents/components/.worktrees/listbox-unified-2`.
- `use-select.ts` stays as the dropdown shell with no listbox logic left in it (spec F2). These two greps print nothing at `b2f8bf0ec`:
  - `grep -n "useHighlightedOption\|useMenuKeyboard\|getListboxNavigation\|getListboxOptionProps\|getListMouseHandlers\|getSelectableOption\|isAnnouncedSelected" src/select/utils/use-select.ts src/internal/components/listbox/use-listbox.ts`
  - `grep -n useAnnouncement src/select/internal.tsx src/multiselect/use-multiselect.tsx`

The full narrative, decisions and PR texts are in `listbox-unified-report.md`. This file lists the checks the plan's Finish step 3 asks for.

## Per-commit checks

Every commit passed PRECOMMIT with its files staged: QB exit 0, ESLint 0 problems, `tsc -p tsconfig.json` 0 errors, and `tsc -p pages/tsconfig.json` with only the 2 known `@formatjs` errors.

| PR | Commit | UNIT suites / tests | SNAP |
|---|---|---|---|
| base | `4c06e5e9f` | 87 / 1281 | 4/4, 113/113, 111/111 |
| 1 | `64c15ee08` test: Add shared listbox item tests | 88 / 1292 | |
| 1 | `ec489f7c1` test: Cover more type-ahead matching cases | 89 / 1298 | |
| 1 | `ee5db9d3a` test: Add OptionList tests for missing cases | 89 / 1306 | |
| 1 | `b5b017e5b` test: Cover wrap down from the last child of a grouped list | 89 / 1307 | 4/4, 113/113, 111/111 |
| 2 | `9b9847805` fix: Ignore non-matching group headers in type-ahead | 90 / 1318 | |
| 2 | `49b564997` fix: Ignore handled keys in type-ahead | 90 / 1323 | |
| 2 | `233362761` fix: Find the highlighted option by identity in type-ahead | 90 / 1326 | 4/4, 113/113, 111/111 |
| 3 | `e7ca453aa` fix: Pass the group disabled state as parent in renderOption | 90 / 1332 | |
| 3 | `a96893bef` fix: Keep disabled reason description with custom renderOption content | 90 / 1336 | 4/4, 113/113, 111/111 |
| 4 | `e28877d2e` test: Cover native Home and End in filter inputs | 92 / 1339 | |
| 4 | `071edd6d4` fix: Prevent page scroll on Home and End in Select, Multiselect and OptionList | 92 / 1343 | |
| 4 | `866fcb0c1` fix: Wrap arrow keys at the first and last highlightable options | 93 / 1346 | 4/4, 113/113, 111/111 |
| 5 | `45567f02d` refactor: Move listbox list prop types into the listbox folder | 93 / 1346 | |
| 5 | `1b0f891c9` refactor: Add a shared listbox core and use it in OptionList | 93 / 1346 | |
| 5 | `b2f8bf0ec` refactor: Use the shared listbox core in Select and Multiselect | 93 / 1346 | 4/4, 113/113, 111/111 |

FUNC (`src/__tests__/functional-tests`): 10/10 suites and 1987/1987 tests at both the baseline and `b2f8bf0ec`, with no failing suites.

## FAILPROOF per fix

- Assertion failures without the fix: every new or restored test of A (11), B (5), G (3), C (6) and D (6). For Home/End: the `preventNativeHomeEnd` case, Select and Multiselect "without filtering", Multiselect embedded, and the OptionList `defaultPrevented` assertions. For Wrap: both new navigation cases, Select arrow-key-wrap and OptionList group-state wrap. The per-test detail is in the report.
- Compile failures: none.
- Run with `/tmp/lu-jest-nodiag.config.js`: `src/internal/components/options-list/__tests__/use-keyboard.test.ts` (step 10) and `src/internal/components/listbox/__tests__/navigation.test.ts` (step 11). All other tests used the normal config.
- Passed without the fix, committed separately in `e28877d2e`: use-keyboard "keeps the native Home and End action by default, for example to move the cursor in a filter input", plus Select and Multiselect "with filtering, moves the highlight and keeps the native cursor movement in the filter input".
- An expected non-fix failure: navigation "wraps up from the first child of a leading group when groups are not interactive" failed on the parent because the test setup no longer passes `highlightedOption`. It is an existing test.
- Base-neutral tests moved out of PR 1: only the C and D `item.test.tsx` cases, to steps 8 and 9.

## Final run on `b2f8bf0ec` (Node 22.23.2, `mise exec node@22.23.2 --`)

- QB: exit 0.
- UNIT: 93/93 suites, 1346/1346 tests.
- LINT: 0 problems.
- TSC: `tsconfig.json` 0 errors; `pages/tsconfig.json` 2 errors, both the known `@formatjs` ones.
- SNAP: build exit 0; 4/4 suites, 113/113 tests, 111/111 snapshots, without `-u`.
- FUNC: 10/10 suites, 1987/1987 tests.
- Risk 15–18 guard suites: 24 suites, 565/565 tests.
- PR 5 test-file diff (`git diff 866fcb0c1..b2f8bf0ec --stat -- '**/__tests__/**'`): empty.

## Line counts

| File | base `4c06e5e9f` | before PR 5 `866fcb0c1` | after `b2f8bf0ec` |
|---|---|---|---|
| `src/select/utils/use-select.ts` | 350 | 350 | 331 |
| `src/internal/components/listbox/use-listbox.ts` | 257 | 258 | 196 |
| `src/internal/components/listbox/use-listbox-core.ts` | — | — | 199 |

## Branch and stash state

- New branches: `feat/listbox-unified-2` and `refactor/listbox-unified-core` at `b2f8bf0ec`, `test/listbox-unified-shared-tests` at `b5b017e5b`, `fix/listbox-unified-type-ahead` at `233362761`, `fix/listbox-unified-render-option` at `a96893bef`, and `fix/listbox-unified-keyboard` at `866fcb0c1`. The only new worktree is `.worktrees/listbox-unified-2`.
- `git stash list` is identical to step 0. `feat/listbox-unified` is still at `9a6541a01`.
- These branches were moved by work in their own worktrees, not by this workflow (reflog evidence is in the report):
  - `feat/add-option-list` → `f06a65f61`
  - `refactor/move-shared-listbox-parts` → `33cfa9917`
  - `fix/select-multiselect-listbox-alignment` → `a47f825be`
  - The new `backup/fix-listbox-alignment-bd8f0792b` was also created there.
- Acceptance criterion 8 therefore holds for this workflow's writes. A literal comparison with step 0 also shows those external moves.
