# Type-ahead fixes: combined verification

Both parts passed and both reviews are APPROVED. All four source docs exist: `type-ahead-a-verification.md`, `type-ahead-a-review.md`, `type-ahead-b-verification.md`, `type-ahead-b-review.md`.

Bug 1: type-ahead targets included group headers whose children matched, and the children of a group whose label matched. Fix: match each option on its own (`options.filter(o => interactivityCheck(o) && filterOptions([o], text, true).length > 0)`). `filterOptions` is unchanged.
Bug 2: a Space that was already handled (preventDefault) still went into the 500 ms search buffer. Fix: `if (event.defaultPrevented || !key || key.length !== 1) return;`.

## Part A — OptionList

Worktree `.worktrees/pr3-option-list`, branch `feat/add-option-list`.

Commits (checked with `git log`):

| Hash | Subject |
|---|---|
| `dabe649b1` | fix: Ignore non-matching group headers in OptionList type-ahead |
| `e000abffd` | fix: Ignore handled keys in OptionList type-ahead |

Branch state has changed since the step ran. HEAD is now `96a51148f chore: add settings to make it easier to test`, which sits on top of `e000abffd` and contains only `pages/option-list/simple.page.tsx`. The reflog shows a separate commit made after this step, and `origin/feat/add-option-list` now points at `96a51148f`. That means both fix commits have been pushed. This workflow did not push them.

Files changed:
- `src/internal/components/listbox/use-type-ahead.ts`: both fixes.
- `src/internal/components/listbox/__tests__/use-type-ahead.test.ts`: 4 hook tests.
- `src/option-list/__tests__/option-list.test.tsx`: 4 tests, one for Space then a letter and three in `option groups > type-ahead`.
- `pages/option-list/type-ahead.page.tsx`: deleted (it was untracked).

Fail-before: with `use-type-ahead.ts` reverted to the old code, all 8 new tests failed (8 failed, 61 passed). That covers 2 tests for bug 2 and 6 for bug 1. One extra test that passed on the old code was dropped.

Results:

| Check | Result |
|---|---|
| eslint, prettier (changed files) | pass |
| `npm run quick-build` | pass |
| Unit tests, `src/option-list` and `src/internal/components/listbox` | 8 suites, 128 tests pass |
| Unit tests, full `src/` | 653/655 suites pass. `test-utils-wrappers` failed in the full run (parallel flake) and passed 2/2 alone. `documenter` needs a full build (`lib/components-definitions`); no API changes. |
| Integ | Not run in Part A. The doc lists no integ run and gives no reason. |

Review notes: (1) Single selection now behaves differently. Typing a group's name no longer jumps to that group's first child, and a new test locks this in. Mention it in the PR. (2) The `simple.page.tsx` edit was kept out of the fix commits. It is now its own commit, `96a51148f`.

## Part B — Select / Multiselect

Worktree `.worktrees/fix-native-search`, branch `fix/multiselect-type-ahead`, based on `origin/main` `b7014ed77`. Local only, not pushed.

Commits (checked with `git log`):

| Hash | Subject |
|---|---|
| `47562b91f` | fix: Ignore non-matching group headers in Multiselect type-ahead |
| `300341c11` | fix: Ignore handled keys in Select and Multiselect type-ahead |

Files changed:
- `src/select/utils/use-native-search.ts`: both fixes.
- `src/select/__tests__/use-native-search.test.ts`: 5 hook tests.
- `src/select/__tests__/native-search.test.tsx` (new): 3 Select tests.
- `src/multiselect/__tests__/native-search.test.tsx` (new): 5 Multiselect tests.
- `src/multiselect/__integ__/multiselect.test.ts`: 3 native-search expectations corrected, because they encoded bug 1 (`o` → option1, `oo` → option3, cycling takes 5×`o`).

Fail-before: with the fix stashed, 11 of the 16 targeted tests failed. Every new bug test failed, each for the expected reason. The other 5 are baselines that pass on both old and new code. With the fix applied, 16/16 pass.

Is Select affected?
- Bug 2: yes. With the trigger focused, Space opens the dropdown. With the list open, Space selects an option and returns focus to the trigger. In both cases the handler prevents the event, but it still bubbles to the root `onKeyDown={handleNativeSearch}`, so the next letter searches `" g"`. Two Select tests cover this.
- Bug 1: the header half can't happen in Select, because `isInteractive` excludes parents. The children half does happen: typing `c` with Compute → EC2 used to select EC2. Now it selects nothing, which matches native `<select>`. This is a user-visible change and should go in the PR description.

Results:

| Check | Result |
|---|---|
| eslint, prettier (changed files) | pass |
| `npm run quick-build` | pass |
| Unit tests, `src/select`, `src/multiselect`, `src/property-filter`, `src/autosuggest` | 59 suites, 1023 tests pass |
| Unit tests, full `src/` | 648/650 suites, 14138 pass. Same 2 known failures as Part A: `documenter` needs a full build, and `test-utils-wrappers` is a flake that passes 2/2 alone. |
| Integ, `src/multiselect/__integ__` and `src/select/__integ__` | Run 1: 121 pass, 7 fail. Six of those were the bug-1 expectations, now fixed. Run 2: all Multiselect integ tests pass, and `select-native-search` passed in run 1. One failure remains: `async-select` "bottom of the dropdown lines up with the highlighted option" (virtualScrolling, off by 32px). That test only uses ArrowDown, which never reaches the changed code. The attempt to confirm it fails on main too was inconclusive because the dev server didn't recompile. |

`git status` is clean.
