# Unified listbox: final report

- The work is on the new branch `feat/listbox-unified-2` (tip `b2f8bf0ec`, base `feat/add-option-list` @ `4c06e5e9f`). `feat/listbox-unified` was left at `9a6541a01`.
- Worktree: `/Users/amanabiy/Documents/components/.worktrees/listbox-unified-2`.
- `src/select/utils/use-select.ts` stays as the dropdown shell (open state, trigger, filter, menu and dialog wiring, embedded focus). It has no listbox logic left: it no longer calls `useHighlightedOption`, `useMenuKeyboard`, `getListboxNavigation`, `getListboxOptionProps`, `getListMouseHandlers`, `getSelectableOption` or `isAnnouncedSelected`. All of these now come from `use-listbox-core.ts` (spec F2, acceptance criterion 4).

Nothing was pushed. No integration tests were run, and nothing ran on port 8080.

## Branches created

All are new local branches, created at each PR's last commit. None of the names existed before.

| PR | Branch | Sha |
|---|---|---|
| 1 | `test/listbox-unified-shared-tests` | `b5b017e5b91676d00cb8db6d5277376cf2e89adb` |
| 2 | `fix/listbox-unified-type-ahead` | `2333627610f564c5895f10d1e5e8fce544ce6072` |
| 3 | `fix/listbox-unified-render-option` | `a96893bef8132e273a43951e8b9d437eac3eb81b` |
| 4 | `fix/listbox-unified-keyboard` | `866fcb0c1f845e960950d5a55e22d0f2f8e267b4` |
| 5 | `refactor/listbox-unified-core` | `b2f8bf0ec6514a0fe3e6a252fc7d6d548878380c` (same as the `feat/listbox-unified-2` tip) |

The branches stack, so each one contains the PRs before it. `feat/listbox-unified-2` contains everything.

## Commits by PR (`git log --oneline 4c06e5e9f..feat/listbox-unified-2`)

Every commit passed PRECOMMIT with its files staged: QB exit 0, LINT 0 problems, TSC `tsconfig.json` 0 errors, and `pages/tsconfig.json` with only the 2 known `@formatjs` `Intl.ListFormat` errors. The UNIT column shows the result after each commit.

Baseline at `4c06e5e9f`: 87 suites, 1281 tests.

### PR 1: `test: Add shared listbox and OptionList tests` (9 files, +374/−3)

| Commit | Subject | UNIT suites / tests |
|---|---|---|
| `64c15ee08` | test: Add shared listbox item tests | 88 / 1292 (+11) |
| `ec489f7c1` | test: Cover more type-ahead matching cases | 89 / 1298 (+6) |
| `ee5db9d3a` | test: Add OptionList tests for missing cases | 89 / 1306 (+8) |
| `b5b017e5b` | test: Cover wrap down from the last child of a grouped list | 89 / 1307 (+1) |

All PR 1 tests pass on the base. The C and D item cases from `c90d893b5` were taken out of `64c15ee08` as planned and added in steps 8 and 9. No other test had to move. `stash@{0}` was read with `git diff`, and it was never popped, applied or dropped. SNAP at `b5b017e5b`: 4/4 suites, 113/113 tests, 111/111 snapshots.

### PR 2: `fix: Improve type-ahead in Select, Multiselect and OptionList` (7 files, +326/−14)

| Commit | Subject | UNIT suites / tests |
|---|---|---|
| `9b9847805` | fix: Ignore non-matching group headers in type-ahead (A) | 90 / 1318 (+11) |
| `49b564997` | fix: Ignore handled keys in type-ahead (B) | 90 / 1323 (+5) |
| `233362761` | fix: Find the highlighted option by identity in type-ahead (G) | 90 / 1326 (+3) |

SNAP at `233362761`: 4/4, 113/113, 111/111.

### PR 3: `fix: Fix renderOption parent and disabled reason in Select, Multiselect and OptionList` (6 files, +172/−5)

| Commit | Subject | UNIT suites / tests |
|---|---|---|
| `e7ca453aa` | fix: Pass the group disabled state as parent in renderOption (C) | 90 / 1332 (+6) |
| `a96893bef` | fix: Keep disabled reason description with custom renderOption content (D) | 90 / 1336 (+4; the OptionList case renames an existing test) |

SNAP at `a96893bef`: 4/4, 113/113, 111/111.

### PR 4: `fix: Fix Home, End and arrow keys in Select, Multiselect and OptionList` (11 files, +264/−29)

| Commit | Subject | UNIT suites / tests |
|---|---|---|
| `e28877d2e` | test: Cover native Home and End in filter inputs (FAILPROOF step 4) | 92 / 1339 (+3) |
| `071edd6d4` | fix: Prevent page scroll on Home and End in Select, Multiselect and OptionList | 92 / 1343 (+4) |
| `866fcb0c1` | fix: Wrap arrow keys at the first and last highlightable options | 93 / 1346 (+3) |

SNAP at `866fcb0c1`: 4/4, 113/113, 111/111.

### PR 5: `refactor: Build Select and Multiselect on the shared listbox core` (8 files, +338/−218)

| Commit | Subject | UNIT suites / tests |
|---|---|---|
| `45567f02d` | refactor: Move listbox list prop types into the listbox folder | 93 / 1346 |
| `1b0f891c9` | refactor: Add a shared listbox core and use it in OptionList | 93 / 1346 |
| `b2f8bf0ec` | refactor: Use the shared listbox core in Select and Multiselect | 93 / 1346 |

`git diff 866fcb0c1..b2f8bf0ec --stat -- '**/__tests__/**'` is empty, so PR 5 changes no test file, not even an import. SNAP and FUNC at `b2f8bf0ec` are below.

Total `4c06e5e9f..b2f8bf0ec`: 30 files, +1471/−266.

## FAILPROOF results per fix

FAILPROOF ran before each fix commit. It reset the product files to the parent, ran the fix's new tests, then reapplied the fix and confirmed they pass.

| Fix | Failed on an assertion without the fix | Compile failures | nodiag config | Passed without the fix → separate `test:` commit |
|---|---|---|---|---|
| A `9b9847805` | All 11. use-type-ahead: matching child rather than its group; no cycling into children of a matching group; repeated key skips disabled; without interactive groups, no children of a matching group. Select: a group label prefix does not select an option in that group. Multiselect: matching option inside a group; Enter selects only the matching option; repeating does not cycle into group children. OptionList group-state: multi highlights the option, not its group (plus Enter); multi repeating cycles and skips a disabled group; single skips the options of a matching group | none | none | none |
| B `49b564997` | All 5. use-type-ahead "ignores keys that were already handled by another handler" (0 calls); Select "typing right after opening the dropdown with Space…" (Apple, not Grape); Select "typing right after selecting with Space…" (1 call, not 2); Multiselect "typing right after selecting with Space…" (EC2, not Glacier); OptionList keyboard "type-ahead after Space selects…" (`a`, not `c`) | none | none | none |
| G `233362761` | All 3. use-type-ahead "cycles from the highlighted option when its group has the same value"; Multiselect "repeating a character cycles … share a value" (Cloud, not Cache); OptionList "multi: repeating a key cycles … share a value" (Cloud, not Cache) | none | none | none |
| C `e7ca453aa` | All 6. item.test single and multi (the parent's `disabled` was the child's); Select and Multiselect render-option (expected false, got true); OptionList render-option single and multi | none | none | none |
| D `a96893bef` | All 6. item.test single and multi; Select and Multiselect render-option; OptionList disabled single and multi (`aria-describedby` target was null) | none | none | none |
| Home/End `071edd6d4` | use-keyboard "prevents the native Home and End action when preventNativeHomeEnd is enabled" (`preventDefault` called 0 times); Select and Multiselect "without filtering, moves the highlight and prevents the native page scroll"; Multiselect "embedded, prevents the native page scroll when the list has focus"; OptionList keyboard Home/End `defaultPrevented` assertions | none | `use-keyboard.test.ts` | use-keyboard "keeps the native Home and End action by default, for example to move the cursor in a filter input"; Select and Multiselect "with filtering, moves the highlight and keeps the native cursor movement in the filter input". All 3 are in `e28877d2e`, as the plan expected |
| Wrap `866fcb0c1` | navigation "wraps down from the last highlightable option when the list ends with an empty group"; navigation "wraps up from the first highlightable option when the list starts with an empty group"; Select arrow-key-wrap (Banana, not Apple); OptionList group-state "arrows wrap…" (banana, not apple) | none | `navigation.test.ts` | none. The other 5 navigation cases are existing tests and pass on the parent. "wraps up from the first child of a leading group when groups are not interactive" also failed on the parent, as the plan predicted, because the test setup no longer passes `highlightedOption`. That failure comes from the setup, not from the fix |

No test failed only on compilation in any FAILPROOF run.

## Final verification on `b2f8bf0ec`

All commands ran in the worktree with `mise exec node@22.23.2 --`.

| Check | Command | Result | Baseline (`4c06e5e9f`) |
|---|---|---|---|
| QB | `npm run quick-build` | exit 0 | exit 0 |
| UNIT | `TZ=UTC npx jest -c jest.unit.config.js src/option-list src/select src/multiselect src/autosuggest src/property-filter src/internal/components/listbox src/internal/components/options-list src/internal/components/selectable-item src/internal/components/option` | 93/93 suites, 1346/1346 tests | 87 / 1281 |
| LINT | `npx eslint src/internal/components/listbox src/internal/components/options-list src/option-list src/select src/multiselect` | exit 0, 0 problems | 0 problems |
| TSC | `npx tsc -p tsconfig.json --noEmit` | 0 errors | 0 |
| TSC pages | `npx tsc -p pages/tsconfig.json --noEmit` | 2 errors, both the known `@formatjs/ecma402-abstract` `Intl.ListFormat` ones | same 2 |
| SNAP | `npm run build` then `TZ=UTC npx jest -c jest.unit.config.js src/__tests__/snapshot-tests` (no `-u`) | build exit 0; 4/4 suites, 113/113 tests, 111/111 snapshots | identical |
| FUNC | `TZ=UTC npx jest -c jest.unit.config.js src/__tests__/functional-tests` | 10/10 suites, 1987/1987 tests, no failing suites | identical |

Nothing failed, so no further commit was needed.

The spec risk 15–18 guard suites passed at `b2f8bf0ec`: virtual-scroll 4/4, select-all 19/19, select 88/88, use-load-items 5/5, multiselect 78/78, multiselect-embedded 9/9, property-filter 17 suites 346/346, select-a11y 16/16. That is 24 suites and 565/565 tests in total.

## Line counts

| File | `4c06e5e9f` (base) | `866fcb0c1` (before PR 5) | `b2f8bf0ec` (after) |
|---|---|---|---|
| `src/select/utils/use-select.ts` | 350 | 350 | 331 |
| `src/internal/components/listbox/use-listbox.ts` | 257 | 258 | 196 |
| `src/internal/components/listbox/use-listbox-core.ts` | — | — | 199 |

`use-select.ts` shrank less than the spec's estimate of about −90 lines. The listbox logic moved out, but the file gained the core call (about 35 lines, with the `onSelect` body and comments), the destructuring of the core result, and three new optional props with their JSDoc.

## Intended behavior changes per component

| Fix | Select | Multiselect | OptionList |
|---|---|---|---|
| A (type-ahead and group headers) | Typing a group's label no longer selects a child that doesn't match | Group headers match only on their own text. Children of a matching group are not cycle targets | Multi: same as Multiselect. Single: same as Select |
| B (handled keys) | After Space, type-ahead starts from the next letter | same | same |
| G (identity lookup) | No visible change, because the value fallback keeps closed-state cycling | Cycling no longer gets stuck when a group and its option share a value | same, in multi |
| C (renderOption parent) | `item.parent.disabled` is the group's state | same | same |
| D (disabled reason) | The hidden disabled-reason description is rendered with custom `renderOption` content. The tooltip still shows only for default content | same | same |
| Home/End | `preventDefault` without a filter. With a filter, Home and End still move the cursor | same, and also in embedded mode | `preventDefault` again (it was lost in `4c06e5e9f`) |
| Wrap | Arrow keys wrap past empty leading and trailing groups | no change, because headers are highlightable | Wraps past empty groups again (it was lost in `4c06e5e9f`) |

PR 5 (refactor) is meant to change no behavior. It changes no test file, and UNIT, SNAP and FUNC are identical before and after it.

## Decisions taken

- The plan names `.worktrees/listbox-unified` as the worktree. That worktree was left alone, and all work used the new worktree `.worktrees/listbox-unified-2`. `/tmp/lu-jest-nodiag.config.js` points at it.
- The per-PR branches were created without asking, because the user delegated all decisions. None of the names existed, so no `-2` suffix was needed.
- `feat/listbox-unified-2` stays on base `4c06e5e9f` even though `feat/add-option-list` later moved in another worktree (see the branch verification below). The source commits the plan uses are still readable as objects.
- PR 1: The `disabledOption` fixture and the `DropdownOption` type import were taken out with the C and D cases, because `no-unused-vars` is an error. Steps 8 and 9 added them back, and `item.test.tsx` now matches `c90d893b5` exactly.
- PR 1: The `KeyCode` import was dropped from the Multiselect `native-search.test.tsx`. Step 5 brought it back from `5f8b96389`.
- Step 7: The OptionList G test reads the highlighted row's label through `findLabel()`, because the header row's raw `textContent` is "ComputeCompute". It still asserts by text.
- Step 10: Fixed design-review NIT 3 with the embedded Multiselect Home/End test. NIT 1 (`__integ__` globs in the FAILPROOF lists) was applied and matched nothing.
- Step 10, FAILPROOF 4b: `git rm --cached` needed `-f` for the Multiselect file (status AM). It only drops the index entry, and the full copy was already saved.
- Step 11: The Select wrap test uses the same name as the OptionList one, because both cover the same two directions in one test.
- Step 14: The core types `getOptionProps` as `(option, index) => ReturnType<typeof getListboxOptionProps>`, which is the type both hooks had before. Typing it as `GetOptionProps` broke a test's compile (`delete props.id`), and the pure-refactor rule forbids changing tests. `useListbox` still exposes it as `GetOptionProps`.
- Step 14: The hook order puts refs and derived values first, then the core, then `useOpenState` (design-review NIT 2).
- The core's keyboard setters always wrap and call `onKeyboardHighlight?.()`. Select passes none, so they act like the raw setters there. `useSelect` still returns the raw `highlightOptionWithKeyboard`.
- The core passes `selectOption: () => selectOption()` to `useMenuKeyboard`. `useMenuKeyboard` always calls it with no arguments, so this behaves the same as Select's old direct pass.
- Autosuggest, property-filter, `multiselect/embedded.tsx`, `multiselect/internal.tsx` and virtual-list were not changed.

## Deferred items

- Autosuggest: `fix: Pass the group disabled state as parent in Autosuggest renderOption`. Then check, and maybe do, `fix: Wrap Autosuggest arrow keys at the first and last highlightable options`. Moving Autosuggest and the property-filter autosuggest onto the core is also out of scope (spec section 4).
- Move `select/parts/virtual-list.tsx` to `listbox/parts`.
- Stack-plan follow-ups: stable row keys, an item analytics test, and `findDisabledReason()` on `OptionListOptionWrapper`.
- Integration and visual tests were not run locally. CI runs them.

## Pre-existing branch verification

- This workflow wrote only `feat/listbox-unified-2` (its reflog shows only plain `commit` entries), the five new branches above, and the new worktree. Nothing was pushed, rebased or amended, and no remote was changed.
- `feat/listbox-unified`: `9a6541a01`, unchanged.
- `git stash list`: identical to `/tmp/lu-stash-before.txt`. `stash@{0}` is still "backup: listbox-test-dedup uncommitted OptionList tests".
- Three pre-existing branches no longer match the shas expected at step 0. Their reflogs show that git operations in their own worktrees moved them. This workflow did not touch them:
  - `feat/add-option-list`: `4c06e5e9f` → `f06a65f61`, from a `pull origin refactor/move-shared-listbox-parts` at 10:29 in `.worktrees/option-list-rebase`.
  - `refactor/move-shared-listbox-parts`: `864c388ef` → `33cfa9917`, from a rebase onto `8a3001d72` at 10:27 in `.worktrees/refactor-move-listbox-parts`.
  - `fix/select-multiselect-listbox-alignment`: `bd8f0792b` → `24a384784` (rebase at 11:20) → `a47f825be` ("chore: Trigger redeploy" commit at 11:48), in `.worktrees/fix-listbox-alignment`.
  - A new `backup/fix-listbox-alignment-bd8f0792b` (at `bd8f0792b`) appeared, also created outside this workflow.
- The rest of the `git branch -v` diff against `/tmp/lu-branches-before.txt` is upstream ahead/behind counts, plus the six branches this workflow created. Every other branch kept its sha.
- `git worktree list` differs from `/tmp/lu-worktrees-before.txt` only in the new `.worktrees/listbox-unified-2` entry and in the HEAD shas of the three worktrees whose branches moved (above).
- `git -C .worktrees/listbox-unified-2 status --short` shows no tracked changes. Its only entry is the untracked `pages/tsconfig.tsbuildinfo`, which TSC on `pages/tsconfig.json` generates. It was there before PR 1 and was never staged.

## Suggested PRs

Each PR targets the previous one's branch. PR 1 is based on `4c06e5e9f`, which was `feat/add-option-list` at step 0. That branch has since moved to `f06a65f61`, so check the PR 1 base before opening it.

### PR 1: `test: Add shared listbox and OptionList tests` (`test/listbox-unified-shared-tests`)

Adds the shared listbox item and type-ahead tests and the missing OptionList tests. All of them pass on the current code.

How has this been tested?
- Unit tests for option-list, select, multiselect, autosuggest, property-filter and the internal listbox, options-list, selectable-item and option folders: 89 suites, 1307 tests pass (baseline 87 / 1281). Snapshot tests pass unchanged. ESLint and `tsc` are clean.
- Integration tests were not run locally.

### PR 2: `fix: Improve type-ahead in Select, Multiselect and OptionList` (`fix/listbox-unified-type-ahead`)

Type-ahead now skips group headers that don't match, ignores keys another handler already used (Space then a letter), and finds the highlighted option by identity when a group and its option share a value.

How has this been tested?
- New unit tests in the shared type-ahead tests and in Select, Multiselect and OptionList. Each one fails without its fix and passes with it. 90 suites, 1326 tests pass. Snapshot tests pass unchanged.
- The Multiselect integration test `src/multiselect/__integ__/multiselect.test.ts` changes its expectations to the new group-header matching (for example, `o o` now highlights `option3`, not `option1`). Integration tests were not run locally.

### PR 3: `fix: Fix renderOption parent and disabled reason in Select, Multiselect and OptionList` (`fix/listbox-unified-render-option`)

`renderOption` now gets the group's own disabled state as `parent.disabled`. Disabled options with custom content keep their disabled-reason description for screen readers.

How has this been tested?
- New unit tests in the shared item tests and in Select, Multiselect and OptionList. Each one fails without its fix and passes with it. 90 suites, 1336 tests pass. Snapshot tests pass unchanged.
- Integration tests were not run locally.

### PR 4: `fix: Fix Home, End and arrow keys in Select, Multiselect and OptionList` (`fix/listbox-unified-keyboard`)

Home and End no longer scroll the page when the list has focus (filter inputs keep native cursor movement), and arrow keys wrap at the first and last highlightable options, past empty groups.

How has this been tested?
- New unit tests for `useMenuKeyboard`, listbox navigation, Select, Multiselect (including embedded) and OptionList. Each fix's tests fail without it. The three filter-input tests already passed and are in their own `test:` commit. 93 suites, 1346 tests pass. Snapshot tests pass unchanged.
- Integration tests were not run locally.

### PR 5: `refactor: Build Select and Multiselect on the shared listbox core` (`refactor/listbox-unified-core`)

Moves highlight, keyboard, mouse, option props, selection and announcement logic into a shared `useListboxCore`, which OptionList, Select and Multiselect all use. `useSelect` keeps only the dropdown shell.

How has this been tested?
- No test file changed. Unit tests (93 suites, 1346 tests), snapshot tests (113 tests, 111 snapshots) and functional tests (10 suites, 1987 tests) all match the results before the refactor. ESLint and `tsc` are clean.
- Integration tests were not run locally.
