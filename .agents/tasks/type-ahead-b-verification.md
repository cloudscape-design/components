# Type-ahead fixes (Part B): verification

Worktree: `/Users/amanabiy/Documents/components/.worktrees/fix-native-search` (branch `fix/multiselect-type-ahead`, base `origin/main` b7014ed77). Committed locally (see Commits), not pushed.

## Changes (uncommitted)

- `src/select/utils/use-native-search.ts`
  - Bug 1: `filter` now checks each option on its own: `options.filter(option => interactivityCheck(option) && filterOptions([option], searchText, true).length > 0)`. `filterOptions` itself is unchanged.
  - Bug 2: `if (event.defaultPrevented || !key || key.length !== 1) return;`
- `src/select/__tests__/use-native-search.test.ts`: 5 new hook tests (handled-event ignored; with groups: child beats non-matching header, matching header still matches, repeated `c` doesn't cycle into children, non-interactive groups don't hand off to children).
- `src/select/__tests__/native-search.test.tsx` (new): 3 Select behaviour tests.
- `src/multiselect/__tests__/native-search.test.tsx` (new): 5 Multiselect behaviour tests (Compute → EC2/Lambda/Fargate, plus Glacier).
- `src/multiselect/__integ__/multiselect.test.ts`: 3 existing native-search expectations updated. They encoded bug 1. Page options are "First category" → option1, option2 (disabled), option3, and "Second category" → option4, option5 (disabled), option6. On main, typing `o` highlighted "First category", even though that label doesn't start with "o". New expectations: `o` → option1, `oo` → option3 (the second enabled match, as the test title says), and 5×`o` (number of matches + 1) → option1. Before, the cycle test used 7×`o` because the 2 headers were counted as matches.

## Is Select affected?

- Bug 2: yes, in two ways. (a) With the trigger focused and the dropdown closed, Space opens the dropdown. The trigger handler calls preventDefault, but the event still bubbles to the root `onKeyDown={handleNativeSearch}` and puts `' '` in the buffer. A letter typed within 500 ms searches for `" g"`, so nothing is highlighted (got "Apple" instead of "Grape"). (b) With the dropdown open, Space selects the highlighted option and closes the dropdown, and focus returns to the trigger. A letter typed within 500 ms on the closed trigger should select the matching option, but the buffer is `" g"`, so onChange is not called a second time.
- Bug 1: the header half can't happen in Select, because `isInteractive` excludes parents. The other half does reach Select. When a group label matches, `filterOptions` returns all of that group's children. So on main, typing `c` with group "Compute" → EC2 highlights or selects EC2, even though "EC2" doesn't start with "c". After the fix, `c` matches nothing in that case. This is how a native `<select>` behaves, since optgroup labels aren't searchable. It is a user-visible Select change that comes with the prescribed fix, and the Select test "typing a group label prefix does not select an option inside that group" covers it.

## Fail before / pass after

All 3 test files were written first. The fix was stashed (`git stash push src/select/utils/use-native-search.ts`), `npm run quick-build` was run, and then:

`TZ=UTC node_modules/.bin/jest -c jest.unit.config.js src/select/__tests__/use-native-search.test.ts src/select/__tests__/native-search.test.tsx src/multiselect/__tests__/native-search.test.tsx`

Before (main code): **11 failed, 5 passed / 16**. Failures and the reason for each:
- hook: ignores already-handled keys (no highlight after `' '`(prevented) + `o`)
- hook: interactive groups child-vs-header (called with Compute header)
- hook: repeated `c` (got EC2, expected Compute)
- hook: non-interactive groups (`c` highlighted EC2)
- Select: Space-open then `g` (highlighted "Apple", expected "Grape")
- Select: Space-select then `g` (onChange called 1×, expected 2×)
- Select: group label prefix (onChange called with EC2)
- Multiselect: `e` (highlighted "Compute", expected "EC2")
- Multiselect: `e` + Enter (selectedOptions contained the whole group)
- Multiselect: `c c` (highlighted "EC2", expected "Compute")
- Multiselect: ArrowDown → EC2, Space, `g` (highlight stayed "EC2", expected "Glacier")

The 5 that passed before are baselines: the 3 existing hook tests, plus the hook and Multiselect "group whose own label matches" tests.

After (fix applied, quick-build): **16 passed / 16**.

## Commands and results

| Command | Result |
|---|---|
| `prettier --write` + `--check` on the 4 changed/new unit test/source files and the integ file | pass |
| `eslint` (with `--fix`, then clean run) on the same files | pass, 0 problems |
| `npm run quick-build` | exit 0 |
| `TZ=UTC jest -c jest.unit.config.js src/select src/multiselect src/property-filter src/autosuggest` | 59 suites, 1023 tests passed |
| `grep -rln "use-native-search\|useNativeSearch" src` | only `src/select/internal.tsx`, `src/multiselect/use-multiselect.tsx` (+ the hook and its test), covered above |
| `TZ=UTC jest -c jest.unit.config.js src/` (full) | 648/650 suites; 14138 passed, 1 failed, 162 skipped. Failures: `documenter.test.ts` (needs `lib/components-definitions`, full build; not changed, skipped per instructions) and `test-utils-wrappers.test.tsx` (parallel flake). Rerun alone: 2/2 passed. |

## Integration

Setup: ran `npm run start:integ` (background, served on :8080) and the ChromeDriver at `/tmp/listbox-04-chromedriver/chromedriver/mac_arm-155.0.8059.85/chromedriver-mac-arm64/chromedriver --port=9515`. No other chromedriver was running. The server started after the fix was applied.

`NODE_OPTIONS=--experimental-vm-modules node_modules/.bin/jest -c jest.integ.config.js src/multiselect/__integ__/ src/select/__integ__/`

- Run 1: 10 suites, 121 passed, 7 failed.
  - 6 failures in `multiselect.test.ts` native search (keepOpen false/true × 3). These were the expectations that encoded bug 1, and they were updated as described above.
  - 1 failure in `async-select.test.ts`: "the bottom of the dropdown lines up with the highlighted option, when going down the list" (virtualScrolling=true), off by 32px > 3. That test uses only ArrowDown keys, and the native-search handler returns early for keys longer than 1 character, so this change doesn't touch that path. I tried to confirm it on main by stashing the fix and rerunning, but the dev server log showed no recompile, so that rerun is inconclusive.
- Run 2 (`multiselect.test.ts` + `async-select.test.ts`): 46 passed, 1 failed (the same async-select scroll test). All Multiselect integ tests pass, and `select-native-search.test.ts` passed in run 1.
- Shut down afterwards: killed the integ webpack server and chromedriver 155. Port 8080 is free. An unrelated dev server from the `pr3-option-list` worktree was left running.

## Commits

Local only, not pushed. Pre-commit hooks (lint-staged eslint, git-secrets) ran normally. The split was staged through the index (`git apply --cached` plus blob updates), and the final tree matches the verified worktree exactly. Select is affected by bug 2, so commit 2 names both components.

1. `47562b91f` fix: Ignore non-matching group headers in Multiselect type-ahead
   - `src/select/utils/use-native-search.ts` (per-option filter)
   - `src/select/__tests__/use-native-search.test.ts` ("with groups" tests)
   - `src/select/__tests__/native-search.test.tsx` (new; group-label-prefix test)
   - `src/multiselect/__tests__/native-search.test.tsx` (new; 4 group tests)
   - `src/multiselect/__integ__/multiselect.test.ts` (updated native-search expectations)
2. `300341c11` fix: Ignore handled keys in Select and Multiselect type-ahead
   - `src/select/utils/use-native-search.ts` (`event.defaultPrevented` check)
   - `src/select/__tests__/use-native-search.test.ts` (handled-key test)
   - `src/select/__tests__/native-search.test.tsx` (2 Space tests)
   - `src/multiselect/__tests__/native-search.test.tsx` (Space-then-type test)

On HEAD, after `npm run quick-build`: the 3 unit test files had 16/16 passing, and `git status` is clean apart from ignored files.
