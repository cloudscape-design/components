# listbox-unified progress

- Worktree: /Users/amanabiy/Documents/components/.worktrees/listbox-unified-2
- Branch: feat/listbox-unified-2
- Base sha: 4c06e5e9f418a06e39b8b2b2fb4a1ecae59e2047

## Pre-existing branch tips (do not touch)
- feat/add-option-list 4c06e5e9f418a06e39b8b2b2fb4a1ecae59e2047
- refactor/move-shared-listbox-parts 864c388ef875f6f58dcf236cfe44ea0ec33e2df2
- fix/select-multiselect-listbox-alignment bd8f0792bbbffaa21458e70557966e4f17dc0817
- feat/listbox-unified 9a6541a01a568a64e2e80ab056c09a608df77825
- Full snapshots: /tmp/lu-branches-before.txt, /tmp/lu-stash-before.txt, /tmp/lu-worktrees-before.txt

## Decisions
- The plan says to work in .worktrees/listbox-unified (switching it to a new branch). Per the user's brief we leave that worktree alone and use the new worktree /Users/amanabiy/Documents/components/.worktrees/listbox-unified-2 instead. Every plan path referring to .worktrees/listbox-unified maps to this worktree.
- Per-PR branches will be created as new local branches without prompting the user (user delegated decisions).
- /tmp/lu-jest-nodiag.config.js points at the new worktree.

## Baseline
Baseline @ 4c06e5e9f (feat/listbox-unified-2, .worktrees/listbox-unified-2), Node 22.23.2
- QB: pass
- UNIT: 87/87 suites, 1281/1281 tests passed
- LINT: pass (0 problems)
- TSC tsconfig.json: 0 errors; pages/tsconfig.json: 2 errors (known @formatjs Intl.ListFormat only)
- SNAP: build pass; 4/4 suites, 113/113 tests, 111/111 snapshots passed
- FUNC: 10/10 suites, 1987/1987 tests passed; failing suites: none
## PR 1: test: Add shared listbox and OptionList tests
PRECOMMIT script: /tmp/lu-precommit.sh (git status, QB, UNIT, LINT, TSC main + pages) with each commit's files staged. Every commit below passed it: QB exit 0, LINT 0 problems, TSC tsconfig.json 0 errors, pages/tsconfig.json 2 errors (the known @formatjs ones).
`pages/tsconfig.tsbuildinfo` is untracked: TSC on pages generates it, it was already there before PR 1 and it was never staged.

- Step 1 `64c15ee08` test: Add shared listbox item tests
  - `git show c90d893b5 -- .../listbox/__tests__/item.test.tsx | git apply --3way` (new file, no conflict).
  - Removed C "renderOption parent reflects the disabled state of the group, not of the option" and D "keeps the disabled reason description with custom content and shows the tooltip only for default content". Their text is in /tmp/lu-item-cd.txt. That file also holds the `disabledOption` fixture (used only by D) and the `import type { DropdownOption }` line (used only by C and D). Both were removed here because `no-unused-vars` is an error, and steps 8 and 9 must add them back.
  - UNIT: 88/88 suites, 1292/1292 tests (+11: 4 cases x 2 modes + 3 multi-only).
- Step 2 `ec489f7c1` test: Cover more type-ahead matching cases
  - `git show 32daf8d07 -- use-type-ahead.test.ts | git apply --3way`: the expected conflict. Resolved by keeping the base file plus 32daf8d07's `describe('matching')` (fake timers, `type` helper, 3 tests). `grep -c "ignores keys that were already handled"` = 0.
  - Added "cycles from a highlighted option that is an equal copy rather than the same object" (from bd8f0792b), and `describe('with groups')` with the `groupedOptions` fixture, the `renderGroupedHook` helper and only "with interactive groups, highlights a group whose own label matches" (from e9922fd3f^).
  - New src/multiselect/__tests__/native-search.test.tsx from bd8f0792b, keeping header, fixtures, helper and only "highlights a group when its own label matches". The `KeyCode` import was dropped.
  - UNIT: 89/89 suites, 1298/1298 tests (+6). All pass on base; none moved.
- Step 3 `ee5db9d3a` test: Add OptionList tests for missing cases
  - Ran `git diff 'stash@{0}^' 'stash@{0}' > /tmp/lu-stash.patch; git apply --3way`. The stash was not popped, applied or dropped, and `git stash list` is unchanged.
  - option-list.test.tsx conflict: kept both of the base's icon-slot tests and the stash's special-character test. The stash adds no imports to that file. The other 4 files applied cleanly. Each new test name appears once.
  - UNIT: 89/89 suites, 1306/1306 tests (+8). All pass on base.
- Step 4 `b5b017e5b` test: Cover wrap down from the last child of a grouped list
  - navigation.test.ts: added "wraps down from the last child of a grouped list" (`setup(grouped, 4)`, goDown, goHome called once, moveHighlight not called).
  - UNIT: 89/89 suites, 1307/1307 tests (+1).
  - SNAP (PR's last commit): `npm run build` exit 0; snapshot-tests 4/4 suites, 113/113 tests, 111/111 snapshots passed (unchanged from baseline).
- Tests moved to later fix commits: only the planned C and D item tests (to steps 8 and 9). Every other PR 1 test passed on base.
- Design review NITs: none of the three touches PR 1 (they concern FAILPROOF for step 5, step 14 order and step 10). They are left for those steps.
- Observation, not caused by this work: while PR 1 ran, other worktrees rebased or pulled some pre-existing branches. `feat/add-option-list` went 4c06e5e9f -> f06a65f61 (pull at 10:29). `refactor/move-shared-listbox-parts` went 864c388ef -> 33cfa9917 (rebase at 10:27). `fix/select-multiselect-listbox-alignment` went bd8f0792b -> 24a384784 (rebase at 11:20). A new `backup/fix-listbox-alignment-bd8f0792b` appeared. Reflogs show these as rebase/pull operations in their own worktrees. Decision: feat/listbox-unified-2 stays on base 4c06e5e9f, which matches the spec. The source shas in the plan (c90d893b5, 32daf8d07, bd8f0792b, 5f8b96389, etc.) are commit objects and can still be read. Nothing was done to those branches.
- .worktrees/listbox-unified-2 PR1 last commit: b5b017e5b
## PR 2: fix: Improve type-ahead in Select, Multiselect and OptionList
No `listbox-unified-2-pr2-review.json` existed, so this is the first pass. Every commit below passed PRECOMMIT (/tmp/lu-precommit.sh) with its files staged: QB exit 0, LINT 0 problems, TSC tsconfig.json 0 errors, pages/tsconfig.json 2 errors (the known @formatjs ones). FAILPROOF used the normal jest config for every test; none needed /tmp/lu-jest-nodiag.config.js. No test passed without its fix, so FAILPROOF step 4 was not needed and PR 2 has no separate `test:` commits.
- Step 5 `9b9847805` fix: Ignore non-matching group headers in type-ahead (A)
  - `git cherry-pick --no-commit 5f8b96389`. Conflicts: `use-type-ahead.test.ts` (content) and Multiselect `native-search.test.tsx` (add/add). Both resolved by keeping both sides. The Multiselect file takes the `KeyCode` import from 5f8b96389, which its Enter test uses. Select `native-search.test.tsx` is new from the cherry-pick. The integ change in `src/multiselect/__integ__/multiselect.test.ts` is kept and was not run.
  - Added from `e9922fd3f^`: use-type-ahead "with interactive groups, repeated key cycles only through matching options and skips disabled ones", and the `group-state.test.tsx` type-ahead describe (3 tests, `typeAheadOptions`, `type`, `isComputeHighlighted`, `Wrapper` import).
  - Product file: `use-type-ahead.ts`. FAILPROOF: all 11 new tests failed on assertions on the parent and passed with the fix. use-type-ahead: matching child rather than its group; no cycling into children of a matching group; repeated key skips disabled; without interactive groups no children of a matching group. Select: group label prefix does not select an option inside that group. Multiselect: matching option inside a group; Enter selects only the matching option; repeating does not cycle into group children. OptionList group-state: multi highlights the option not its group, plus Enter; multi repeating cycles and skips a disabled group; single skips the options of a matching group.
  - UNIT: 90/90 suites, 1318/1318 tests (+11, +1 suite from Select native-search).
- Step 6 `49b564997` fix: Ignore handled keys in type-ahead (B)
  - `git cherry-pick --no-commit e7429e11f`. Conflict in `use-type-ahead.test.ts`, at the spot where PR 1 added the "equal copy" test and `describe('matching')`. Resolved by placing "ignores keys that were already handled by another handler" after the isEnabled test, where the source has it, and keeping PR 1's content. `grep -c` = 1. Select and Multiselect `native-search.test.tsx` merged cleanly.
  - Added from `e9922fd3f^`: `keyboard.test.tsx` "type-ahead after Space selects moves the highlight to the matching option" and the `highlightedValue` import.
  - FAILPROOF: all 5 new tests failed on assertions on the parent and passed with the fix. use-type-ahead "ignores keys…" got 0 calls at the final `toHaveBeenCalledWith`. Select "typing right after opening the dropdown with Space…" got Apple, not Grape. Select "typing right after selecting with Space…" got 1 call, not 2. Multiselect "typing right after selecting with Space…" got EC2, not Glacier. OptionList keyboard got `a`, not `c`.
  - UNIT: 90/90 suites, 1323/1323 tests (+5).
- Step 7 `233362761` fix: Find the highlighted option by identity in type-ahead (G)
  - `git cherry-pick --no-commit bd8f0792b`. Conflicts in `use-type-ahead.test.ts`. (1) bd8f0792b's side lacks `describe('matching')`: kept HEAD's. (2) Both sides add a test at the end of "with groups": kept both. The "equal copy" test was auto-merged and appears once (`grep -c` = 1), as do "ignores keys…" and "cycles from the highlighted option when its group has the same value". Multiselect `native-search.test.tsx` merged cleanly.
  - New OptionList test in the `group-state.test.tsx` type-ahead describe: "multi: repeating a key cycles to the next match when a group and its option share a value". It focuses the list, types `c` three times, and expects Compute, Cloud, Cache. The test reads the highlighted row's label through `findGroupHeaders()`/`findOptions()` + `isHighlighted()` + `findLabel()`. Decision: the header's raw `textContent` is "ComputeCompute" (the label renders twice in the header row), so the test uses `findLabel()` and still asserts by text, not by value.
  - FAILPROOF: all 3 new tests failed on assertions on the parent and passed with the fix. use-type-ahead "cycles from the highlighted option when its group has the same value" expected Cache. Multiselect "repeating a character cycles … share a value" and OptionList "multi: repeating a key cycles … share a value" got Cloud, not Cache.
  - UNIT: 90/90 suites, 1326/1326 tests (+3).
  - SNAP (PR's last commit): `npm run build` exit 0; snapshot-tests 4/4 suites, 113/113 tests, 111/111 snapshots passed, unchanged from baseline.
- Design review NITs: NIT 1 (FAILPROOF step 4 and `__integ__` files) would only matter if step 5 took FAILPROOF step 4. It didn't, because all A tests failed on the parent, so no change was needed. NITs 2 and 3 concern steps 14 and 10 and are left for those steps.
- Branch check after PR 2: `git stash list` is unchanged. `git branch -v` differs from step 0 only by the drift already recorded under PR 1 (other worktrees moved those branches) and by upstream ahead/behind counts. `feat/listbox-unified` is still at 9a6541a01.
- PR2 last commit: 233362761
## PR 3: fix: Fix renderOption parent and disabled reason in Select, Multiselect and OptionList
No `listbox-unified-2-pr3-review.json` existed, so this is the first pass. Both commits passed PRECOMMIT (`zsh /tmp/lu-precommit.sh`, since the script has no exec bit) with their files staged: QB exit 0, LINT 0 problems, TSC tsconfig.json 0 errors, pages/tsconfig.json 2 errors (the known @formatjs ones). FAILPROOF used the normal jest config. Every new test failed on an assertion without its fix, so FAILPROOF step 4 was not needed and PR 3 has no separate `test:` commits.
- Step 8 `e7ca453aa` fix: Pass the group disabled state as parent in renderOption (C)
  - `git cherry-pick --no-commit 6b95bbf8c`: no conflict. `item.tsx` gets `disabled: props.parentProps.disabled` in both the Select and Multiselect item builders. Select and Multiselect `render-option.test.tsx` gained "parent reflects the disabled state of the group, not of the option" (`grep -c` = 1 each).
  - `item.test.tsx`: added the C case and the `import type { DropdownOption }` line from `c90d893b5`, in the original position. The `disabledOption` fixture is used only by D, so it waited for step 9.
  - OptionList `render-option.test.tsx`: added "%s: parent reflects the group state, not the disabled state of the option" from `e9922fd3f^`. `eslint --fix` removed one blank line that prettier flagged. Its local `options` shadows the imported `options`; lint allows this, and the text is unchanged from the source.
  - FAILPROOF (product file `item.tsx`): all 6 failed on assertions on the parent and passed with the fix. item.test single and multi (`toEqual`: parent `disabled` was the child's), Select and Multiselect (expected false, got true), OptionList single and multi (expected false, got true).
  - UNIT: 90/90 suites, 1332/1332 tests (+6).
- Step 9 `a96893bef` fix: Keep disabled reason description with custom renderOption content (D)
  - `git cherry-pick --no-commit 7626adb9a`: no conflict. `item.tsx` renders `descriptionEl` whenever the option is disabled with a reason, and keeps the tooltip behind `!renderResult`. Select and Multiselect gained "keeps the disabled reason description for screen readers with custom content" (`grep -c` = 1 each).
  - `item.test.tsx`: added the D case and the `disabledOption` fixture. The file now matches `c90d893b5` exactly.
  - OptionList `disabled.test.tsx`: renamed "does not show the disabled reason tooltip when renderOption is used (%s)" back to "describes the disabled option with its disabled reason when renderOption is used (%s)" and restored the three `aria-describedby` lines from `e9922fd3f^`.
  - FAILPROOF: all 6 failed on assertions on the parent (`document.getElementById(describedBy)` was null at `toHaveTextContent`) and passed with the fix. These were item.test single and multi, Select, Multiselect, and OptionList single and multi. The OptionList case is an existing test renamed, so UNIT grows by 4.
  - UNIT: 90/90 suites, 1336/1336 tests (+4).
  - SNAP (PR's last commit): `npm run build` exit 0. snapshot-tests: 4/4 suites, 113/113 tests and 111/111 snapshots passed, the same as the baseline.
- Design review NITs: none of them touch steps 8 or 9 (they cover FAILPROOF for integ files, step 14 order, and step 10). They are left for those steps.
- Branch check after PR 3: `git stash list` is the same as at step 0. `feat/listbox-unified` is still at 9a6541a01. No other branch or worktree was written.
- PR3 last commit: a96893bef
## PR 4: fix: Fix Home, End and arrow keys in Select, Multiselect and OptionList
No `listbox-unified-2-pr4-review.json` existed, so this is the first pass. Every commit below passed PRECOMMIT (`zsh /tmp/lu-precommit.sh`) with its files staged: QB exit 0, LINT 0 problems, TSC tsconfig.json 0 errors, pages/tsconfig.json 2 errors (the known @formatjs ones). `/tmp/lu-jest-nodiag.config.js` was checked and already points at this worktree (require path and rootDir).
- Step 10, FAILPROOF step 4 commit `e28877d2e` test: Cover native Home and End in filter inputs
  - Holds the three tests that pass on the parent, as the plan expected: `use-keyboard.test.ts` "keeps the native Home and End action by default, for example to move the cursor in a filter input" (in a new `describe('useMenuKeyboard native Home and End')` with the `homeEndKeys` helper), and Select and Multiselect `home-end.test.tsx` trimmed to "with filtering, moves the highlight and keeps the native cursor movement in the filter input".
  - UNIT: 92/92 suites, 1339/1339 tests (+3, +2 suites). The first PRECOMMIT failed LINT on one extra blank line in the trimmed Multiselect file. `eslint --fix` removed it, and PRECOMMIT then passed.
- Step 10 `071edd6d4` fix: Prevent page scroll on Home and End in Select, Multiselect and OptionList
  - `git cherry-pick --no-commit 6792d0dc3`: no conflict. It adds `use-keyboard.ts` `preventNativeHomeEnd`, `use-select.ts` `preventNativeHomeEnd: !hasFilter`, the `use-keyboard.test.ts` cases, and new Select and Multiselect `home-end.test.tsx`.
  - `use-listbox.ts`: `preventNativeHomeEnd: true`, with a comment saying focus is on the list, so Home and End must not scroll the page or scroll container.
  - `keyboard.test.tsx`: `git show 4c06e5e9f -- …keyboard.test.tsx | git apply -R` restored the comment and the two `defaultPrevented` assertions.
  - Design review NIT 3 (embedded Multiselect is not tested): fixed. Multiselect `home-end.test.tsx` gained "embedded, prevents the native page scroll when the list has focus". It renders `EmbeddedMultiselect`, focuses `[role=listbox]`, and expects `fireEvent.keyDown` with End and Home to return false.
  - FAILPROOF (product files `use-listbox.ts`, `use-keyboard.ts`, `use-select.ts`) on the parent:
    - use-keyboard "prevents the native Home and End action when preventNativeHomeEnd is enabled": failed on an assertion (nodiag config; `preventDefault` called 0 times).
    - use-keyboard "keeps the native Home and End action by default…": passed. Moved to `e28877d2e`.
    - Select and Multiselect "without filtering, moves the highlight and prevents the native page scroll": failed on assertions (normal config; expected false, got true).
    - Select and Multiselect "with filtering…": passed. Moved to `e28877d2e`.
    - Multiselect "embedded, prevents the native page scroll when the list has focus": failed on an assertion (normal config; expected false, got true).
    - OptionList keyboard "focus highlights the first option, arrows move with wrap-around, Home and End jump": failed on an assertion (normal config; `defaultPrevented` expected true, got false).
    - With the patch applied again, all 22 tests in the 4 files passed.
  - FAILPROOF step 4 ran as planned. Both `home-end.test.tsx` files went through `.staged-new-tests`, and `.untracked-new-tests` was empty. `.mod-tests` = use-keyboard.test.ts and keyboard.test.tsx. The 4a lists also included `'**/__integ__/**'` (design review NIT 1), which matched nothing here.
    - In 4b, `git rm --cached` refused the Multiselect file because its status was AM (the staged and worktree versions differed after the embedded test was added). It was rerun with `-f`, which only drops the index entry. The full copy was already saved in `/tmp/lu-fix-10-new/`.
    - In 4d, `git apply --3way` conflicted in `use-keyboard.test.ts` where step c had added the trimmed describe. The conflict was resolved by removing the markers, which kept both tests. The result is identical to `6792d0dc3`'s file, and `grep -c` = 1 for each test.
    - In 4e, the first targeted rerun showed 4 failures. QB had not rebuilt lib after the product patch was restored, so the run used stale lib. The PRECOMMIT QB rebuilt lib, and UNIT passed.
  - UNIT: 92/92 suites, 1343/1343 tests (+4).
- Step 11 `866fcb0c1` fix: Wrap arrow keys at the first and last highlightable options
  - `navigation.ts`: `highlightedOption` prop removed. Wrap is computed with `isHighlightable(option, interactiveGroups)` from `option-props.ts` (imported as `isHighlightableOption`, with a local bound `isHighlightable`). Up wraps when `highlightedIndex === options.findIndex(isHighlightable)`. Down wraps when `!options.slice(highlightedIndex + 1).some(isHighlightable)`. The code carries the comment from `58dad9856`, and the JSDoc was updated to match. Both callers (`use-select.ts`, `use-listbox.ts`) no longer pass `highlightedOption`.
  - `navigation.test.ts`: `highlightedOption` was dropped from `setup`. "wraps down only from the last row, even when it is not highlightable" was replaced with "wraps down from the last highlightable option when the list ends with an empty group". "wraps up from the first highlightable option when the list starts with an empty group" was added, with a new `startsWithEmptyGroup` fixture `[header Empty, 1]`.
  - New `src/select/__tests__/arrow-key-wrap.test.tsx`: one test, "arrows wrap at the first and last options when the list starts and ends with an empty group", built from `58dad9856`'s first two cases (End, Down → Apple; Home, Up → Banana).
  - `group-state.test.tsx`: `git show 4c06e5e9f -- …group-state.test.tsx | git apply -R` restored "arrows wrap at the first and last options when the list starts and ends with an empty group" (`grep -c` = 1).
  - FAILPROOF (product files `use-listbox.ts`, `navigation.ts`, `use-select.ts`) on the parent:
    - navigation.test.ts (nodiag config): the two new wrap cases failed on assertions (`goHome`/`goEnd` called 0 times).
    - navigation.test.ts "wraps up from the first child of a leading group when groups are not interactive" also failed on an assertion. The plan expected this: the dropped `highlightedOption` prop makes the parent's `highlightedOption?.type === 'child'` check see `undefined`. The failure comes from the test setup change, not from the fix.
    - navigation.test.ts: the other 5 cases passed on the parent, as expected. They are existing tests, so no `test:` commit was needed.
    - Select arrow-key-wrap: failed on an assertion (normal config; expected "Apple", got "Banana").
    - OptionList group-state: failed on an assertion (normal config; expected "apple", got "banana").
    - With the patch applied again, all 24 tests in the 3 files passed.
  - UNIT: 93/93 suites, 1346/1346 tests (+3: 1 net in navigation, 1 Select, 1 OptionList; +1 suite).
  - SNAP (PR's last commit): `npm run build` exit 0. snapshot-tests: 4/4 suites, 113/113 tests and 111/111 snapshots passed, the same as the baseline.
- Design review NITs: NIT 1 was applied to the step 10 FAILPROOF lists (integ globs, no match). NIT 3 was fixed with the embedded test. NIT 2 concerns step 14 and is left for PR 5.
- Decision: the step 11 Select test name matches the OptionList one ("arrows wrap at the first and last options when the list starts and ends with an empty group"), because it covers the same two directions in one test.
- Branch check after PR 4: `git stash list` is the same as at step 0, and `feat/listbox-unified` is still at 9a6541a01. No other branch or worktree was written.
- PR4 last commit: 866fcb0c1
## PR 5: refactor: Build Select and Multiselect on the shared listbox core
No `listbox-unified-2-pr5-review.json` existed, so this is the first pass. Every commit passed PRECOMMIT (`zsh /tmp/lu-precommit.sh`) with its files staged: QB exit 0, LINT 0 problems, TSC tsconfig.json 0 errors, pages/tsconfig.json 2 errors (the known @formatjs ones). UNIT after each commit: 93/93 suites, 1346/1346 tests, the same as at the end of PR 4.
- Step 12 `45567f02d` refactor: Move listbox list prop types into the listbox folder
  - New `src/internal/components/listbox/interfaces.ts` with `ListElementProps` and `GetOptionProps`. `use-listbox.ts` re-exports both. `use-select.ts` re-exports them as `GetOptionProps` and `MenuProps` (`export type { GetOptionProps, ListElementProps as MenuProps }`) and uses `ListElementProps` internally. `parts/plain-list.tsx` imports from `../interfaces` and no longer imports `select/utils/use-select`. `index.tsx` imports from `./interfaces`.
  - UNIT 93/93, 1346/1346.
- Step 13 `1b0f891c9` refactor: Add a shared listbox core and use it in OptionList
  - New `use-listbox-core.ts` with the spec section 3 props and return. Body order: `useUniqueId('option-list')`, `connectOptionsByValue(options, selection.selectedOptions)`, `useHighlightedOption` with `isHighlightable(option, interactiveGroups)`, the wrapped keyboard setters (`withScroll` generalized to `withKeyboardHighlight`, which calls `onKeyboardHighlight?.()`), `interactivityCheck`, `selectOption` (`getSelectableOption` and then `onSelect`), `useMenuKeyboard` with `getListboxNavigation`, `closeDropdown: onEscape`, `preventNativeSpace: spaceSelects === 'always' || (!!highlightedOption && highlightType.type === 'keyboard')` and `preventNativeHomeEnd`, then `getListMouseHandlers`, `getOptionProps` via `getListboxOptionProps`, `isAnnouncedSelected` and `useAnnouncement`. The wrapped-setter comment and the Space comment moved with the code.
  - `use-listbox.ts` hook order: `listRef`, `pointerDown`, `scrollRequest` state and `requestScroll`, the core call (`interactiveGroups: selection.interactiveGroups`, `onSelect: option => onChange(selection.getNextSelection(option))`, `spaceSelects: 'always'`, `preventNativeHomeEnd: true`, `onKeyboardHighlight: requestScroll`, plus `getParent`, `selectedAriaLabel` and `renderHighlightedAriaLive`), a local `isHighlightable`, the previous-options follow (using `core.highlight.*` raw setters), `useTypeAhead` (with `core.highlightOption`), and `getListProps` (spreads `core.mouseHandlers` and sets `onKeyDown: core.onKeyDown`). `UseListboxProps` and `UseListboxApi` are unchanged.
  - UNIT 93/93, 1346/1346.
- Step 14 `b2f8bf0ec` refactor: Use the shared listbox core in Select and Multiselect
  - Caller guard, before editing: `git grep -n "useSelect(" src ':!**/__tests__/**'` printed:
    ```
    src/multiselect/use-multiselect.tsx:155:  } = useSelect({
    src/select/internal.tsx:159:    } = useSelect({
    src/select/utils/use-select.ts:63:export function useSelect({
    ```
    These are the definition and the two calls. The definition moved from :65 to :63 because step 12 replaced two type lines with one re-export and removed one import. No other file appears. The invariant is now in the `selection` JSDoc ("Must be built from `selectedOptions`").
  - `use-select.ts`: new optional props `getParent` (default `noParent = () => undefined`), `selectedAriaLabel` and `renderHighlightedAriaLive`. Order: refs and plain derived values as before (`filterRef`, `triggerRef`, `menuRef`, `hasFilter`, `isDialog`, `activeRef`; this applies design-review NIT 2), then `useListboxCore`, `useOpenState`, `closeDropdownIfNecessary`, `handleEscape`, then the rest as before. The local `isHighlightable` and `interactivityCheck` were removed. `onSelect` is exactly the spec body (`option.type === 'select-all' && toggleAll` → `toggleAll()`, otherwise `updateSelectedOption(option.option)`, then `closeDropdownIfNecessary()`). `onEscape: () => handleEscape()`, `spaceSelects: hasFilter ? 'keyboard-highlight' : 'always'`, `preventNativeHomeEnd: !hasFilter`, and no `onKeyboardHighlight`. The `menuId` is `core.listId`, which still comes before `useUniqueId('dialog')`. The trigger keyboard uses `core.goHome`. The filter and menu `onKeyDown` are `core.onKeyDown`, and the menu spreads `core.mouseHandlers`. The open effect and embedded focus/blur use `core.connectedSelected` and the raw `core.highlight.*` setters. The return value keeps every field (`highlightOption: core.highlight.highlightOptionWithKeyboard`, `selectOption: core.selectOption`, `getOptionProps: core.getOptionProps`, `announceSelected: core.announceSelected`) and adds `announcement`. The `getTriggerProps` code is untouched.
  - `select/internal.tsx` and `multiselect/use-multiselect.tsx`: `useAnnouncement` and its import were removed. Both now pass `getParent: option => parentMap.get(option)?.option as undefined | OptionGroup`, `selectedAriaLabel` and `renderHighlightedAriaLive` to `useSelect`, and destructure `announcement` from it instead of `announceSelected`. Type-ahead and the scroll effects are unchanged.
  - First PRECOMMIT: UNIT failed to compile `src/select/__tests__/group-state.test.tsx:91` (`delete props.id`, TS2339). In step 13 the core typed `getOptionProps` as `GetOptionProps` (returns `ItemProps`, which has no `id`). Before that, `useSelect`'s `getOptionProps` was inferred from `getListboxOptionProps`, which returns `any`. Decision: type the core's `getOptionProps` as `(option, index) => ReturnType<typeof getListboxOptionProps>`, which is the type both hooks had before. This keeps the test unchanged, as the pure-refactor rule requires. `useListbox` still exposes it as `GetOptionProps`. The fix is in the step 14 commit, because step 13 did not expose the core's type through `useSelect`. The second PRECOMMIT passed.
  - Acceptance criterion 4 greps (both empty):
    - `grep -n "useHighlightedOption\|useMenuKeyboard\|getListboxNavigation\|getListboxOptionProps\|getListMouseHandlers\|getSelectableOption\|isAnnouncedSelected" src/select/utils/use-select.ts src/internal/components/listbox/use-listbox.ts`: no output.
    - `grep -n useAnnouncement src/select/internal.tsx src/multiselect/use-multiselect.tsx`: no output.
  - UNIT 93/93, 1346/1346.
  - FUNC (before the commit, with the step 14 change staged, and again after the final build): 10/10 suites, 1987/1987 tests, no failing suites. This is identical to the step-0 baseline.
  - Spec risk 15-18 guard suites (run with `--json` on the committed tree): virtual-scroll 4/4; select-all 19/19; select 88/88; use-load-items 5/5; multiselect 78/78; multiselect-embedded 9/9; property-filter 17 suites, 346/346; select-a11y 16/16. Total 24 suites, 565/565.
  - SNAP (after the last commit): `npm run build` exit 0. The first build run hung after its 12:11 log lines and went past the 30-minute tool timeout, so it was re-run in the background and finished with exit 0 in 59 s. snapshot-tests: 4/4 suites, 113/113 tests and 111/111 snapshots passed, the same as the baseline, without `-u`.
  - `git diff 866fcb0c1..HEAD --stat -- '**/__tests__/**'`: empty. PR 5 changes no test file at all, not even an import.
- Line counts (before at PR 4's last commit 866fcb0c1 → after at b2f8bf0ec): `use-select.ts` 350 → 331; `use-listbox.ts` 258 → 196; `use-listbox-core.ts` 0 → 199. `use-select.ts` shrank less than the spec's estimate of about −90. It keeps the dropdown shell, and it gains the core call (about 35 lines with the `onSelect` body and comments), the destructuring of the core result, and the three new props with their JSDoc. The listbox logic is gone from it, as the acceptance greps show.
- PR 5 total: 8 files, +338/−218 (`git diff 866fcb0c1..HEAD --stat`).
- Design review NITs: NIT 2 (hook order) applied in step 14. NITs 1 and 3 were handled in PRs 2 and 4.
- Decisions:
  - The core's keyboard setters always wrap, and call `onKeyboardHighlight?.()`. For Select, which passes none, they behave like the raw setters. `useSelect` still returns the raw `highlightOptionWithKeyboard`, as the spec requires.
  - The core passes `selectOption: () => selectOption()` to `useMenuKeyboard`, the form OptionList used. Select passed `selectOption` directly, but `useMenuKeyboard` always calls it with no arguments, so the behavior is the same.
  - Autosuggest, property-filter, `multiselect/embedded.tsx`, `multiselect/internal.tsx` and virtual-list were not changed.
- Branch check after PR 5: `git stash list` is identical to /tmp/lu-stash-before.txt, and `stash@{0}` is still 7f1b9f34f. `feat/listbox-unified` is still at 9a6541a01. The reflog of `feat/listbox-unified-2` shows only plain `commit` entries. No other branch or worktree was written, and nothing was pushed.
- PR5 last commit: b2f8bf0ec
## Final
- Per-PR branches created as new local branches (no name existed, no suffix needed): test/listbox-unified-shared-tests b5b017e5b, fix/listbox-unified-type-ahead 233362761, fix/listbox-unified-render-option a96893bef, fix/listbox-unified-keyboard 866fcb0c1, refactor/listbox-unified-core b2f8bf0ec (= feat/listbox-unified-2 tip).
- Final verification on b2f8bf0ec, Node 22.23.2: QB exit 0; UNIT 93/93 suites, 1346/1346 tests; LINT 0 problems; TSC tsconfig.json 0 errors, pages/tsconfig.json 2 known @formatjs errors; SNAP build exit 0 (52 s), 4/4 suites, 113/113 tests, 111/111 snapshots; FUNC 10/10 suites, 1987/1987 tests. Nothing failed, no new commit.
- Pre-existing state: feat/listbox-unified 9a6541a01 unchanged; git stash list identical to /tmp/lu-stash-before.txt. Moved by their own worktrees (reflog: pull/rebase/commit), not by this workflow: feat/add-option-list f06a65f61, refactor/move-shared-listbox-parts 33cfa9917, fix/select-multiselect-listbox-alignment a47f825be (new since the PR 1 note: "chore: Trigger redeploy" at 11:48). git worktree list differs only by the new listbox-unified-2 worktree and those three HEADs. Worktree status: only untracked pages/tsconfig.tsbuildinfo (TSC output, pre-existing, never staged).
- Reports: .agents/tasks/listbox-unified-report.md and .agents/tasks/listbox-unified-verification.md.
