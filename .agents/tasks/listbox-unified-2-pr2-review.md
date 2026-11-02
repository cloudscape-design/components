# Type-ahead fixes A, B and G for the shared listbox (PR 2)

PR 2 adds three fix commits on top of PR 1 (`b5b017e5b`) on `feat/listbox-unified-2`: `9b9847805` (A, group headers), `49b564997` (B, handled keys) and `233362761` (G, finding the highlight by identity). They are cherry-picks of `5f8b96389`, `e7429e11f` and `bd8f0792b`. All product changes are in `src/internal/components/listbox/use-type-ahead.ts`, which Select, Multiselect and OptionList (`use-listbox.ts`) share. The commits also restore the OptionList tests from `e9922fd3f^` and add the planned OptionList test for shared values. At each commit, `use-type-ahead.ts` has exactly the source commit's blob (`328e2e2b6`, `9eee3ec82`, `0d69903a6`). Each test file matches the source version plus the planned additions, line for line.

Watch for: the pre-existing branch tips still differ from the values in the brief. Other worktrees moved them before PR 2 started, and PR 1's review already recorded this. It is informational only (NIT, confirmed).

**Verdict**: APPROVED

## High-level view

Fix A matches each option on its own text instead of filtering the whole list. Before the fix, a group header matched when one of its children matched, and every child of a matching group matched too. The fix changes what Select selects when the user types a group's label while the dropdown is closed. It also changes Multiselect and OptionList (multi) cycling. That is why the three Multiselect integ expectations change, and the commit body says those were not run locally.

Fix B skips `defaultPrevented` keys, so a Space that opened the dropdown or selected an option no longer enters the type-ahead buffer. Fix G finds the current highlight by identity, and falls back to the value only for non-group highlights. The fallback keeps Select's closed-dropdown path working when `selectedOption` is an equal copy. The hook's signature and the props of Select, Multiselect, OptionList and Autosuggest do not change. Autosuggest does not use `useTypeAhead`.

The progress file has FAILPROOF evidence for all 19 new tests (11 + 5 + 3). Every test failed on an assertion without its fix, so no separate `test:` commits were needed. The UNIT counts add up: 1307, then 1318, 1323 and 1326. SNAP on the last commit matches the baseline, 113 tests and 111 snapshots.

<details>
<summary>Issues (1)</summary>

1. **Pre-existing branch drift (NIT, confirmed)**: `feat/add-option-list` is at `f06a65f61`, `refactor/move-shared-listbox-parts` at `33cfa9917` and `fix/select-multiselect-listbox-alignment` at `24a384784`. These are pulls and rebases from 10:27 to 11:20 in the `option-list-rebase`, `refactor-move-listbox-parts` and `fix-listbox-alignment` worktrees. The HEAD reflog of `listbox-unified-2` shows only its own commits. Mention the drift in the final verification report. PR 2 still merges cleanly onto `f06a65f61` (`git merge-tree` exit 0).

</details>

<details><summary>Details</summary>

### Source fidelity of the three cherry-picks

The product diff `b5b017e5b..HEAD` covers only `use-type-ahead.ts` and the Multiselect integ file. Both are identical to the source commits, so no hunk was taken from "theirs" beyond the source. Each test file, compared with `git show bd8f0792b:<path>`, differs only by the expected additions. The Select and Multiselect `native-search.test.tsx` files are byte-identical. `use-type-ahead.test.ts` adds only PR 1's `describe('matching')` and the restored "repeated key cycles only through matching options and skips disabled ones" test. The `group-state.test.tsx` type-ahead describe and the `keyboard.test.tsx` Space test match `e9922fd3f^` exactly, apart from the new shared-value test. Every planned test name from the three source commits and from `e9922fd3f^` is present. A duplicate-name scan of the five changed test files finds nothing. `KeyCode`, `Wrapper` and `highlightedValue` are all used, and LINT reported 0 problems at each commit.

### The OptionList shared-value test

The new test reads the label of the highlighted row through `findGroupHeaders()`/`findOptions()`, `isHighlighted()` and `findLabel()`. It asserts text, not value, as plan step 7 requires. The progress file explains why it uses `findLabel()`: a header's `textContent` repeats the label. On the parent the third key stays on Cloud, which the plan also predicted.

### Branch and stash state

`feat/listbox-unified` is still at `9a6541a01`. `stash list` matches `/tmp/lu-stash-before.txt`. The `backup/*` branches are unchanged, including `backup/fix-listbox-alignment-bd8f0792b`, which keeps the original `bd8f0792b`. The commit titles follow `fix: Subject`, the commits form a linear chain on `b5b017e5b`, and the reflog shows no amend or rebase. The other three tips moved, as listed under Issues.

</details>

<details>
<summary>File map</summary>

- `src/internal/components/listbox/use-type-ahead.ts`: per-option matching (A), the `defaultPrevented` skip (B), and identity lookup with a value fallback (G).
- `src/multiselect/__integ__/multiselect.test.ts`: three highlight expectations updated for A (not run).
- `src/internal/components/listbox/__tests__/use-type-ahead.test.ts`: A, B and G hook cases plus the restored disabled-skip cycle.
- `src/select/__tests__/native-search.test.tsx`: new file with the group-prefix (A) and Space (B) cases.
- `src/multiselect/__tests__/native-search.test.tsx`: A, B and G cases and the `KeyCode` import.
- `src/option-list/__tests__/group-state.test.tsx`: type-ahead describe (3 restored tests plus 1 new G test) and the `Wrapper` import.
- `src/option-list/__tests__/keyboard.test.tsx`: Space then type-ahead (B) and the `highlightedValue` import.

Full diff: `git -C .worktrees/listbox-unified-2 diff b5b017e5b..233362761`.

</details>
