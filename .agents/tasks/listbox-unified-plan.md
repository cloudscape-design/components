# Unified listbox: implementation plan

Companion to `listbox-unified-spec.md` (design, test map, risks). Steps run in order; each commit passes
PRECOMMIT before it is made.

## Rules (binding)

- Do not write to any pre-existing branch (`refactor/move-shared-listbox-parts`, `feat/add-option-list`,
  `fix/select-multiselect-listbox-alignment`, all `backup/*`, every other existing branch), their worktrees, or
  `stash@{0}`. Read them only with `git show`, `git diff`, `git log`, `git stash show -p stash@{0}`.
- Write only `feat/listbox-unified` and brand-new branches. No rebase, amend, push, force, or remote changes.
- Work only in `.worktrees/listbox-unified` (node_modules is symlinked there).
- Copy content with `git cherry-pick --no-commit <sha>` or `git show <sha> -- <paths> | git apply --3way`, then
  make a new commit with the message given here.
- Commit messages: `type: Subject` with `chore|feat|fix|refactor|test|revert`, no scope. A body says what changed
  and why; fix bodies may reuse the source commit's body.
- No integration tests, no dev server, nothing on port 8080.
- Every `git commit` (fix, refactor, and the `test:` commits from PR 1 and FAILPROOF) comes after PRECOMMIT passes.
  If a check fails, fix the staged change and run PRECOMMIT again. Never commit a red state and fix it later.
- Conflicts from `cherry-pick --no-commit` or `git apply --3way`:
  - In test files: keep both sides; keep each test name exactly once (`grep -c "<test name>" <file>` = 1); keep the
    base's imports plus any the source adds, and no import that nothing uses.
  - In product files: never take "theirs" whole. Stop, re-read the source diff (`git show <sha> -- <file>`), and
    apply only its hunks by hand. If the intent isn't clear, stop and ask the user.

Check commands (from the spec, section 7), referred to below as:
- **QB**: `mise exec node@22.23.2 -- npm run quick-build > /tmp/lu-qb.log 2>&1; tail -5 /tmp/lu-qb.log`
- **UNIT**: `TZ=UTC mise exec node@22.23.2 -- npx jest -c jest.unit.config.js src/option-list src/select src/multiselect src/autosuggest src/property-filter src/internal/components/listbox src/internal/components/options-list src/internal/components/selectable-item src/internal/components/option > /tmp/lu-unit.log 2>&1; tail -8 /tmp/lu-unit.log`
- **LINT**: `mise exec node@22.23.2 -- npx eslint src/internal/components/listbox src/internal/components/options-list src/option-list src/select src/multiselect`
- **TSC**: `mise exec node@22.23.2 -- npx tsc -p tsconfig.json --noEmit` and `... -p pages/tsconfig.json --noEmit` (2 known `@formatjs` errors only)
- **SNAP**: `mise exec node@22.23.2 -- npm run build > /tmp/lu-build.log 2>&1` then `TZ=UTC mise exec node@22.23.2 -- npx jest -c jest.unit.config.js src/__tests__/snapshot-tests` (no `-u`)
- **FUNC**: `TZ=UTC mise exec node@22.23.2 -- npx jest -c jest.unit.config.js src/__tests__/functional-tests` (unit only; step-0 baseline and PR 5's last commit)
- **PRECOMMIT**: `git add` the commit's files, then QB, UNIT, LINT, TSC with the changes staged but not committed.
  `git status --short` shows only the staged files (plus nothing untracked except ignored build output). Commit only
  when all four pass.
- **FAILPROOF** (fix commits; runs BEFORE the fix commit, so nothing is ever amended):
  1. With the fix and its test edits in the worktree, list product files:
     `git diff --name-only HEAD -- . ':!**/__tests__/**' ':!**/__integ__/**' > /tmp/lu-fix-<n>.files`.
     Save them: `git diff HEAD -- $(cat /tmp/lu-fix-<n>.files) > /tmp/lu-fix-<n>.patch`. Restore the parent's
     versions: `git checkout HEAD -- $(cat /tmp/lu-fix-<n>.files)` (resets index and worktree for those files only;
     test files keep the new tests). New product files (none expected for fix commits) would be removed with
     `git rm --cached` + delete after confirming they are in the patch.
  2. QB. Run each new test with `-t '<name>'`. Record per test: failed on an assertion, failed on compilation, or
     passed. A compile failure doesn't count as a failure.
     For `src/internal/components/options-list/__tests__/use-keyboard.test.ts` (step 10) and
     `src/internal/components/listbox/__tests__/navigation.test.ts` (step 11), which only compile against the new
     signatures, use the untracked no-typecheck config:
     ```js
     // /tmp/lu-jest-nodiag.config.js (outside the repo, never committed)
     const c = require('/Users/amanabiy/Documents/components/.worktrees/listbox-unified/jest.unit.config.js');
     module.exports = {
       ...c,
       rootDir: '/Users/amanabiy/Documents/components/.worktrees/listbox-unified',
       transform: { ...c.transform, '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.unit.json', diagnostics: false }] },
     };
     ```
     `TZ=UTC mise exec node@22.23.2 -- npx jest -c /tmp/lu-jest-nodiag.config.js <file> -t '<name>'`. Component
     test files use the normal config.
  3. `git apply /tmp/lu-fix-<n>.patch`, QB, run the same tests (normal config) and confirm all pass.
  4. If any test passed in step 2 (no interactive `git add -p`). The worktree is now in the step-3 state: product
     patch applied, test edits present. Test files fall into three kinds, handled separately: modified (in `HEAD`),
     new and staged (added by `cherry-pick --no-commit`, status `A`, not in `HEAD`), and new and untracked (written
     by hand, status `??`).
     a. Save:
        ```
        git diff HEAD --name-only --diff-filter=M -- '**/__tests__/**' > /tmp/lu-fix-<n>.mod-tests
        git diff HEAD --name-only --diff-filter=A -- '**/__tests__/**' > /tmp/lu-fix-<n>.staged-new-tests
        git ls-files --others --exclude-standard -- '**/__tests__/**' > /tmp/lu-fix-<n>.untracked-new-tests
        cat /tmp/lu-fix-<n>.staged-new-tests /tmp/lu-fix-<n>.untracked-new-tests > /tmp/lu-fix-<n>.new-tests
        git diff HEAD -- $(cat /tmp/lu-fix-<n>.mod-tests) > /tmp/lu-fix-<n>-tests.patch
        rm -rf /tmp/lu-fix-<n>-new && mkdir -p /tmp/lu-fix-<n>-new
        for f in $(cat /tmp/lu-fix-<n>.new-tests); do mkdir -p "/tmp/lu-fix-<n>-new/$(dirname "$f")" && cp "$f" "/tmp/lu-fix-<n>-new/$f"; done
        ```
        Product changes are already in `/tmp/lu-fix-<n>.patch` (step 1). Check that every line of
        `git status --short` names a file in `.files`, `.mod-tests` or `.new-tests`; stop if not.
     b. Reset to the parent:
        ```
        [ -s /tmp/lu-fix-<n>.staged-new-tests ] && git rm -q --cached -- $(cat /tmp/lu-fix-<n>.staged-new-tests)
        [ -s /tmp/lu-fix-<n>.new-tests ] && rm -- $(cat /tmp/lu-fix-<n>.new-tests)
        git checkout HEAD -- $(cat /tmp/lu-fix-<n>.files /tmp/lu-fix-<n>.mod-tests)
        ```
        Every path given to `git checkout HEAD --` exists in `HEAD`, so it restores all of them. `git status --short`
        must now be empty.
     c. Add only the passing tests, unchanged, by hand: for modified files, from `/tmp/lu-fix-<n>-tests.patch`; for
        new files, a trimmed copy of `/tmp/lu-fix-<n>-new/<path>` (header, imports and fixtures the kept tests use,
        and those tests; no unused import). PRECOMMIT, then commit `test: <what they cover>`.
     d. Restore the fix:
        ```
        git apply --3way /tmp/lu-fix-<n>-tests.patch   # modified files only; conflicts where step c added tests: keep one copy of each
        cp -R /tmp/lu-fix-<n>-new/. .                   # new files: the full saved version replaces the trimmed one from step c
        git apply /tmp/lu-fix-<n>.patch                 # product files, which step b reset to HEAD
        ```
        After this, files new in the fix but committed trimmed in step c show as modified; files not touched in step
        c are untracked again. Both are staged in step 5.
     e. QB and rerun the fix's tests before step 5. `grep -c "<test name>" <file>` = 1 for each test of the fix.
     The report lists these tests as "passes without the fix, committed separately".
  5. PRECOMMIT (stages the fix's product and test files), then commit the fix with its message.
     `git status --short` must be empty afterwards.

## Step 0: base and baseline

1. Record state: `git branch -v > /tmp/lu-branches-before.txt`, `git stash list > /tmp/lu-stash-before.txt`.
2. `git rev-parse feat/add-option-list` must be `4c06e5e9f418a06e39b8b2b2fb4a1ecae59e2047`. If not, stop and ask the
   user (the spec's base analysis would need redoing).
3. In `.worktrees/listbox-unified` (clean, on `feat/listbox-unified` at `9a6541a01`):
   `git switch -c feat/listbox-unified-2 4c06e5e9f`. This is a new branch; `feat/listbox-unified` stays at
   `9a6541a01`. All later commits go on `feat/listbox-unified-2`. Update the Branch line of
   `/Users/amanabiy/Documents/components/.agents/tasks/listbox-unified-setup.md` (an untracked notes file, so this
   changes no branch) to
   `Branch: feat/listbox-unified-2 (new, at 4c06e5e9f; feat/listbox-unified left at 9a6541a01)`, and its Base line
   to `Base: feat/add-option-list @ 4c06e5e9f418a06e39b8b2b2fb4a1ecae59e2047`.
4. Baseline: QB, UNIT, LINT, TSC, SNAP, FUNC. Save suite/test counts (and, for FUNC, the names of any failing
   suites) to `/tmp/lu-baseline.txt`. Any failure here is reported before continuing.

## PR 1: `test: Add shared listbox and OptionList tests`

All tests must pass on the base. A test that fails is removed from this commit and added to the fix commit that
makes it pass (note it in the report).

1. `test: Add shared listbox item tests`
   - `git show c90d893b5 -- src/internal/components/listbox/__tests__/item.test.tsx | git apply --3way`.
   - Remove the two cases "renderOption parent reflects the disabled state of the group, not of the option" (goes to
     commit C) and "keeps the disabled reason description with custom content and shows the tooltip only for default
     content" (goes to commit D). Keep their source text in `/tmp/lu-item-cd.txt`.
2. `test: Cover more type-ahead matching cases`
   - `git show 32daf8d07 -- src/internal/components/listbox/__tests__/use-type-ahead.test.ts | git apply --3way`.
     **Expected conflict** (confirmed with `git merge-tree --write-tree --merge-base=32daf8d07^ 4c06e5e9f 32daf8d07`):
     the backup predates the revert, so its side also carries the B test "ignores keys that were already handled by
     another handler" and the whole `describe('with groups')` (5 tests). Resolve by keeping the base file plus only
     `describe('matching', …)` from `32daf8d07`: its fake-timer `beforeEach`/`afterEach`, the `type` helper, and
     the 3 tests "keys typed within 500 ms are matched together…", "highlights an option whose description or tag
     starts with the typed text", "a key that matches no option leaves the highlight unchanged". Drop the "ignores
     keys…" test (comes with commit 6) and the `with groups` describe (started below, completed in commit 5).
     Check: `grep -c "ignores keys that were already handled" <file>` is 0 after resolving.
   - Add "cycles from a highlighted option that is an equal copy rather than the same object" (text from
     `git show bd8f0792b:src/internal/components/listbox/__tests__/use-type-ahead.test.ts`).
   - Add a `describe('with groups')` with the `groupedOptions` fixture and only "with interactive groups, highlights a
     group whose own label matches" (text from `e9922fd3f^`). Later commits add the other cases to this describe.
   - Create `src/multiselect/__tests__/native-search.test.tsx` from `git show bd8f0792b:<path>` keeping the header,
     helpers, fixtures and only "highlights a group when its own label matches". Drop the
     `import { KeyCode } from '@cloudscape-design/test-utils-core/utils';` line: only the Enter (A) and Space (B)
     tests use it, and `no-unused-vars` is an error (`eslint.config.mjs:56`).
3. `test: Add OptionList tests for missing cases`
   - `git diff 'stash@{0}^' 'stash@{0}' | git apply --3way`. Resolve the `option-list.test.tsx` conflict by keeping
     both the base's icon-slot tests and the stash's special-character test, and both import blocks.
   - Do not run `git stash pop/apply/drop`.
4. `test: Cover wrap down from the last child of a grouped list`
   - `navigation.test.ts`: add one case, "wraps down from the last child of a grouped list":
     `setup(grouped, 4)` (`b1`), `goDown()`, expect `goHome` called once and `moveHighlight` not called. The Up and
     flat-list directions are already covered by existing cases, so nothing else is added.

Each commit: PRECOMMIT (UNIT count = previous count + the commit's new tests). PR's last commit: also SNAP.

## PR 2: `fix: Improve type-ahead in Select, Multiselect and OptionList`

5. `fix: Ignore non-matching group headers in type-ahead` (A)
   - `git cherry-pick --no-commit 5f8b96389`. Conflicts in the test files created in PR 1: keep PR 1's content and
     add the source commit's cases. The Multiselect `native-search.test.tsx` is an add/add conflict; the resolved
     file takes the `KeyCode` import from `5f8b96389` (its Enter test uses it). Keep in `use-type-ahead.test.ts` "with groups": matching child not group; no
     cycling into children of a matching group; without interactive groups no children of a matching group.
   - Add from `e9922fd3f^`: use-type-ahead "with interactive groups, repeated key cycles only through matching
     options and skips disabled ones"; `src/option-list/__tests__/group-state.test.tsx` type-ahead describe (3 tests,
     its fixtures and the `Wrapper` import).
   - The Multiselect integ file change from `5f8b96389` is kept (not run).
   - FAILPROOF.
6. `fix: Ignore handled keys in type-ahead` (B)
   - `git cherry-pick --no-commit e7429e11f`. Its `use-type-ahead.test.ts`, Select and Multiselect
     `native-search.test.tsx` hunks were checked only against `4c06e5e9f`, and these files already changed in PR 1
     and step 5; resolve any conflict with the test-file conflict rule. The "ignores keys that were already handled"
     test must appear once (`grep -c` = 1). The same rule applies to steps 8 and 9 (`render-option.test.tsx`).
   - Add from `e9922fd3f^`: `keyboard.test.tsx` "type-ahead after Space selects moves the highlight to the matching
     option" and its `highlightedValue` import.
   - FAILPROOF.
7. `fix: Find the highlighted option by identity in type-ahead` (G)
   - `git cherry-pick --no-commit bd8f0792b`; resolve the `use-type-ahead.test.ts` conflict (both sides add tests).
     The "equal copy" test is already present from PR 1; don't duplicate it.
   - New OptionList wiring test in `group-state.test.tsx` type-ahead describe: multi, options
     `[{ value: 'shared', label: 'Compute', options: [{ value: 'shared', label: 'Cloud' }, { value: 'cache', label: 'Cache' }] }]`,
     focus, type `c` three times; after each key assert the highlighted row's text: `Compute`, then `Cloud`, then
     `Cache`. Assert by text, not value: header and first option both have value `shared`. Without G the third key
     stays on `Cloud`.
   - FAILPROOF.

Each commit: PRECOMMIT. PR's last commit: also SNAP.

## PR 3: `fix: Fix renderOption parent and disabled reason in Select, Multiselect and OptionList`

8. `fix: Pass the group disabled state as parent in renderOption` (C)
   - `git cherry-pick --no-commit 6b95bbf8c` (Select and Multiselect render-option tests come with it).
   - Add the C case from `/tmp/lu-item-cd.txt` to `item.test.tsx`; add from `e9922fd3f^` the OptionList
     `render-option.test.tsx` "%s: parent reflects the group state, not the disabled state of the option".
   - FAILPROOF.
9. `fix: Keep disabled reason description with custom renderOption content` (D)
   - `git cherry-pick --no-commit 7626adb9a`.
   - Add the D case to `item.test.tsx`; in `src/option-list/__tests__/disabled.test.tsx` restore the name
     "describes the disabled option with its disabled reason when renderOption is used (%s)" and the three
     `aria-describedby` lines (from `e9922fd3f^`).
   - FAILPROOF.

Each commit: PRECOMMIT. PR's last commit: also SNAP.

## PR 4: `fix: Fix Home, End and arrow keys in Select, Multiselect and OptionList`

10. `fix: Prevent page scroll on Home and End in Select, Multiselect and OptionList`
    - `git cherry-pick --no-commit 6792d0dc3` (adds `preventNativeHomeEnd` to `useMenuKeyboard`, its unit tests,
      `use-select.ts` `preventNativeHomeEnd: !hasFilter`, Select and Multiselect `home-end.test.tsx`).
    - `use-listbox.ts`: pass `preventNativeHomeEnd: true` with a short comment (the focused list sits in a scroll
      container or the page).
    - Restore in `keyboard.test.tsx` the Home/End `defaultPrevented` assertions and comment removed in `4c06e5e9f`
      (`git show 4c06e5e9f -- src/option-list/__tests__/keyboard.test.tsx`, reversed).
    - FAILPROOF. `use-keyboard.test.ts` runs on the parent with `/tmp/lu-jest-nodiag.config.js` (the new cases pass
      `preventNativeHomeEnd`, which the parent's type lacks); expect assertion failures on `defaultPrevented`.
    - FAILPROOF step 4 is expected here. These tests pass on the parent, because nothing prevents Home/End there:
      Select and Multiselect "with filtering, moves the highlight and keeps the native cursor movement in the filter
      input", and `use-keyboard.test.ts` "keeps the native Home and End action by default, for example to move the
      cursor in a filter input". `home-end.test.tsx` (Select and Multiselect) are staged new files from the
      cherry-pick, so they go through the `.staged-new-tests` path. The result is a commit
      `test: Cover native Home and End in filter inputs` (the three tests, with the two new files trimmed to the
      filter cases) before the fix commit. The "without filtering" cases, the `preventNativeHomeEnd` case and the
      restored OptionList `defaultPrevented` assertions must fail on the parent on assertions.
11. `fix: Wrap arrow keys at the first and last highlightable options`
    - `navigation.ts`: replace `highlightedOption` with nothing; compute with `isHighlightable(option, interactiveGroups)`
      from `option-props.ts`: Up wraps when `highlightedIndex === options.findIndex(isHighlightable)`, Down wraps when
      `!options.slice(highlightedIndex + 1).some(isHighlightable)`. Use the comment from `58dad9856`. Update the two
      callers (drop `highlightedOption`).
    - `navigation.test.ts`: drop `highlightedOption` from `setup`; replace "wraps down only from the last row, even
      when it is not highlightable" with "wraps down from the last highlightable option when the list ends with an
      empty group" (`goHome` called, `moveHighlight` not); add "wraps up from the first highlightable option when the
      list starts with an empty group".
    - `src/select/__tests__/arrow-key-wrap.test.tsx`: one test, built from `58dad9856`'s first two cases (empty
      groups at both ends; End, Down → Apple; Home, Up → Banana).
    - Restore `group-state.test.tsx` "arrows wrap at the first and last options when the list starts and ends with
      an empty group" (removed in `4c06e5e9f`).
    - FAILPROOF (product files: `navigation.ts`, `use-listbox.ts`, `use-select.ts`). `navigation.test.ts` runs on
      the parent with `/tmp/lu-jest-nodiag.config.js` (its `setup` no longer passes the required
      `highlightedOption`); the two new wrap cases must fail on assertions (on the parent, `goDown` from index 0 of
      `[1, header Empty]` calls `moveHighlight(1)`, and `goUp` from index 1 of `[header Empty, 1]` calls
      `moveHighlight(-1)`, so `goHome`/`goEnd` are not called). The existing case "wraps up from the first child of a
      leading group when groups are not interactive" also fails there, because the parent's
      `highlightedOption?.type === 'child'` check sees `undefined`. That failure comes from the dropped prop, not
      from the fix, and is recorded as such; the other existing cases pass on the parent.

Each commit: PRECOMMIT. PR's last commit: also SNAP.

## PR 5: `refactor: Build Select and Multiselect on the shared listbox core`

No test file changes except import paths. UNIT counts must equal the end of PR 4. Each commit (12, 13, 14):
PRECOMMIT. PR's last commit: also SNAP and FUNC.

12. `refactor: Move listbox list prop types into the listbox folder`
    - New `src/internal/components/listbox/interfaces.ts` with `ListElementProps` and `GetOptionProps` (moved from
      `use-listbox.ts`). `use-listbox.ts` re-exports both; `use-select.ts` re-exports them as `MenuProps` and
      `GetOptionProps`. `parts/plain-list.tsx` and `index.tsx` import from `../interfaces` / `./interfaces`.
13. `refactor: Add a shared listbox core and use it in OptionList`
    - New `use-listbox-core.ts` exactly as in spec section 3 (props, return, body order). Move the existing
      comments with the code (the `withScroll` and Space comments).
    - `use-listbox.ts`: call the core with `interactiveGroups: selection.interactiveGroups`,
      `onSelect: option => onChange(selection.getNextSelection(option))`, `spaceSelects: 'always'`,
      `preventNativeHomeEnd: true`, `onKeyboardHighlight: requestScroll`, `getParent`, `selectedAriaLabel`,
      `renderHighlightedAriaLive`. Highlight follow uses `core.highlight.setHighlightedIndexWithMouse`,
      `core.highlight.highlightOptionWithKeyboard`, `core.highlight.resetHighlightWithKeyboard`. Keep `UseListboxApi`.
    - Core body connects `connectOptionsByValue(options, selection.selectedOptions)`.
    - Hook order in `useListbox`: `listRef`, `pointerDown`, `scrollRequest` state + `requestScroll`, the core call,
      a local `isHighlightable` (the core doesn't return it; the follow needs it), the previous-options follow,
      `useTypeAhead`, `getListProps`.
    - PRECOMMIT (run the OptionList and listbox suites first for faster feedback, then the full UNIT).
14. `refactor: Use the shared listbox core in Select and Multiselect`
    - `use-select.ts`: as in spec section 3. Add optional props `getParent`, `selectedAriaLabel`,
      `renderHighlightedAriaLive`; return `announcement` in addition to all current fields; keep `getTriggerProps`
      key order. Order: core, `useOpenState`, `closeDropdownIfNecessary`, `handleEscape`, then the rest as today.
      `onSelect` and `onEscape` are arrow functions that read `closeDropdownIfNecessary` and `handleEscape` at call
      time (both declared after `useOpenState`, neither called during render).
    - Before editing, `git grep -n "useSelect(" src ':!**/__tests__/**'` must list only the definition
      `src/select/utils/use-select.ts:65` and the calls `src/select/internal.tsx:159` and
      `src/multiselect/use-multiselect.tsx:155` (line numbers as on `4c06e5e9f`; the fix commits may shift them, but
      no other file may appear). This guards the `selection.selectedOptions` = `selectedOptions` invariant (spec
      section 3). Add the invariant to the `selection` prop's JSDoc.
    - `select/internal.tsx` and `multiselect/use-multiselect.tsx`: remove `useAnnouncement`, pass the three props,
      use `announcement` from `useSelect`.
    - Confirm acceptance criterion 4 with
      `grep -n "useHighlightedOption\|useMenuKeyboard\|getListboxNavigation\|getListboxOptionProps\|getListMouseHandlers\|getSelectableOption\|isAnnouncedSelected" src/select/utils/use-select.ts src/internal/components/listbox/use-listbox.ts`
      and `grep -n useAnnouncement src/select/internal.tsx src/multiselect/use-multiselect.tsx` (both empty).
    - `onSelect` body exactly as in spec section 3 (`option.type === 'select-all' && toggleAll`, else
      `updateSelectedOption(option.option)`, then `closeDropdownIfNecessary()`); not `toggleAll?.()`. Only
      `getParent` defaults to `() => undefined`.
    - PRECOMMIT, plus FUNC (spec risk 19). FUNC results must equal the step-0 baseline. A suite that failed at the
      baseline is reported and not counted as a regression; any other FUNC failure blocks the commit. The guards for spec risks 15–18 (`virtual-scroll.test.tsx`,
      `select-all.test.tsx`, `select.test.tsx`, `use-load-items.test.ts`, `multiselect.test.tsx`,
      `multiselect-embedded.test.tsx`, property-filter suites, `select-a11y.test.tsx`) are in UNIT; the report lists
      their pass counts. After the commit: SNAP. `git diff <end of PR 4>..HEAD --stat -- '**/__tests__/**'` shows
      only import-line changes.

## Finish

1. Optional per-PR branches at commit boundaries, new names only:
   `git branch <name> <sha of the PR's last commit>` for `test/listbox-unified-shared-tests` (PR 1),
   `fix/listbox-unified-type-ahead` (PR 2), `fix/listbox-unified-render-option` (PR 3),
   `fix/listbox-unified-keyboard` (PR 4), `refactor/listbox-unified-core` (PR 5). Step numbers don't map to commit
   positions, because FAILPROOF may add `test:` commits before fix commits.
   Ask the user before creating them.
2. `git branch -v` and `git stash list` compared with step 0: only `feat/listbox-unified-2` and the optional new
   branches differ.
3. Report to `.agents/tasks/listbox-unified-verification.md`: per commit, checks and counts; per fix, the failing
   test names from FAILPROOF with the failure kind (assertion; compile failures listed separately and not counted),
   which tests ran with `/tmp/lu-jest-nodiag.config.js`, and any test that passed without its fix and went into a
   separate `test:` commit; any base-neutral test moved; snapshot and FUNC results; line counts for
   `use-select.ts`, `use-listbox.ts`, `use-listbox-core.ts` before and after. The report's first lines state that
   the work is on the new branch `feat/listbox-unified-2` (`feat/listbox-unified` left at `9a6541a01`), and that
   `use-select.ts` stays as the dropdown shell with no listbox logic left in it (spec F2).
4. PR descriptions (when the user asks): one-line description plus "How has this been tested?", noting that the
   Multiselect integ expectations change in PR 2 and integ tests were not run locally.

## Backlog (not in this branch)

- Autosuggest: `fix: Pass the group disabled state as parent in Autosuggest renderOption`; verify, then maybe
  `fix: Wrap Autosuggest arrow keys at the first and last highlightable options`.
- Move `select/parts/virtual-list.tsx` to `listbox/parts`.
- Stack plan follow-ups: stable row keys, item analytics test, `findDisabledReason()` on `OptionListOptionWrapper`.

## Revision log

Revision 4, answering the third `listbox-unified-design-review.md` (CHANGES_REQUESTED, 1 MEDIUM, 3 NIT). Details
are in the spec's revision log.
- Finding 1 (MEDIUM): FAILPROOF step 4 now splits test files into modified, staged-new (from the cherry-pick) and
  untracked-new. Only paths in `HEAD` go to `git checkout HEAD --`; staged-new files are unstaged with
  `git rm --cached` and deleted; new files are restored by copy from `/tmp/lu-fix-<n>-new/`, not by
  `git apply`. Step 10 says this path is expected and names the three tests that pass on the parent.
- Finding 2: step 0.4 baselines FUNC; step 14 compares FUNC with it.
- Finding 3: fixed in the spec (`interactivityCheck`, `highlightOption` return).
- Finding 4: step 0.3 also updates the setup file's Base line.

Revision 3, answering the second `listbox-unified-design-review.md`. Details are in the spec's revision log.
- Finding 1 (MEDIUM): PRECOMMIT (QB, UNIT, LINT, TSC on staged, uncommitted changes) defined and required before
  every commit, including FAILPROOF steps 4c and 5. Each PR's "Checks:" line is now "Each commit: PRECOMMIT. PR's
  last commit: also SNAP." Steps 13 and 14 use PRECOMMIT too.
- Finding 2: PR 1 step 2 drops the `KeyCode` import; step 5 takes it from `5f8b96389`.
- Finding 3: Rules gain the test-file and product-file conflict rules; step 6 points at them for steps 6, 8 and 9.
- Finding 4: step 14 repeats the exact `onSelect` body and the defaults.
- Finding 5: step 14's caller check expects the definition line plus the two calls.
- Finding 6: FUNC (`src/__tests__/functional-tests`) added to step 14; step 14 names the guards of spec risks 15–18.
- Finding 7: step 0.3 updates `listbox-unified-setup.md`; the Finish report states the branch and the
  `use-select.ts` reading.

Revision 2, answering `listbox-unified-design-review.md`. Details per finding are in the spec's revision log.
- Finding 1: PR 1 step 2 states the `32daf8d07` conflict and keeps only `describe('matching', …)`.
- Findings 2 and 3: FAILPROOF rewritten. It runs before the fix commit, records assertion vs compile failures,
  uses `/tmp/lu-jest-nodiag.config.js` for `use-keyboard.test.ts` (step 10) and `navigation.test.ts` (step 11),
  and puts tests that pass without the fix into a separate `test:` commit before the fix commit.
- Finding 4: step 13 names `selection.selectedOptions` as the connect source; step 14 checks the callers.
- Finding 5: steps 13 and 14 give the hook order and the `onSelect`/`onEscape` closure note.
- Finding 6: step 4 is now the single "wraps down from the last child of a grouped list" case.
- Finding 7: step 7 asserts row text (Compute, Cloud, Cache).
- Finding 8: fixed in the spec (numbers, line references, Files table, alternative 2 bundle).
