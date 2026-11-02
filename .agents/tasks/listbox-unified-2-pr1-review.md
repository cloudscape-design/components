# Shared listbox and OptionList tests (PR 1, plan steps 1-4)

PR 1 adds tests only, on `feat/listbox-unified-2` over base `4c06e5e9f`. It brings in the shared listbox `Item` tests from `c90d893b5` (without the C and D cases, which wait for their fixes), the type-ahead matching cases from `32daf8d07`, the equal-copy and group-label cases from `bd8f0792b` and `e9922fd3f^`, a trimmed Multiselect `native-search.test.tsx`, the OptionList tests from `stash@{0}`, and one navigation wrap case. All four commits match the plan's titles. The diff touches no product files. Every added test is recorded as passing on the base.

Watch for: three pre-existing branch tips (`feat/add-option-list`, `refactor/move-shared-listbox-parts`, `fix/select-multiselect-listbox-alignment`) no longer match the shas in the brief. Their reflogs show rebase and pull operations in their own worktrees, not in `listbox-unified-2`, and the progress file records the drift (confirmed). This does not block PR 1, but the PR target `feat/add-option-list` has moved.

**Verdict**: APPROVED

## High-level view

The four commits follow plan steps 1-4 in order. Each has the exact plan title in `test: Subject` form and a body. The branch reflog shows only `branch: Created from 4c06e5e9f` followed by four `commit:` entries, so nothing was amended or rebased. `git diff 4c06e5e9f..HEAD --stat` outside `__tests__`/`__integ__` is empty.

The copied content matches its sources. `item.test.tsx` differs from `c90d893b5` only by the C and D cases, the `disabledOption` fixture and the `DropdownOption` type import. All four are saved in `/tmp/lu-item-cd.txt` for steps 8 and 9. The `describe('matching')` block is byte-identical to `32daf8d07`'s, and "ignores keys that were already handled" appears 0 times. `native-search.test.tsx` is `bd8f0792b`'s file without the `KeyCode` import and without every test except "highlights a group when its own label matches". The added lines in the 5 OptionList files are identical to the `+` lines of `stash@{0}`, and the base's icon-slot tests are untouched. `stash@{0}` is still present and `git stash list` matches `/tmp/lu-stash-before.txt`. No file contains a duplicate test name, and every new import is used.

The progress file accounts for the test counts commit by commit. UNIT went 1281 → 1292 (+11: 4×2 per-mode cases + 1 + 2) → 1298 (+6) → 1306 (+8) → 1307 (+1), and suites went 87 → 89. SNAP on the last commit gave 113/113 tests and 111/111 snapshots, unchanged from the baseline. The PRECOMMIT results (QB, LINT, TSC) are recorded for each commit.

The branch-tip drift is outside this PR. The rebases and pulls happened in the `option-list-rebase`, `refactor-move-listbox-parts` and `fix-listbox-alignment` worktrees, and `origin/*` was updated with them. `feat/add-option-list` (now `f06a65f61`) is the same OptionList stack rebased onto a newer mainline. A 3-way `git merge-tree --merge-base=4c06e5e9f f06a65f61 b5b017e5b` succeeds, so PR 1 still applies to the moved target.

<details>
<summary>Issues (2)</summary>

1. **Pre-existing branch tips moved outside this workflow (NIT, informational)**: `feat/add-option-list` 4c06e5e9f→f06a65f61, `refactor/move-shared-listbox-parts` 864c388ef→33cfa9917, `fix/select-multiselect-listbox-alignment` bd8f0792b→24a384784, and a new `backup/fix-listbox-alignment-bd8f0792b`. The reflogs place these operations in other worktrees (confirmed). Keep the branch on `4c06e5e9f` as the progress file decided, and state the drift in the final verification report so the user knows the original tips changed for reasons outside this work.
2. **PR target has moved (NIT)**: `feat/add-option-list` is now a rebased copy on a newer mainline. Before PRs are opened, note in the report that the stack needs a rebase onto `f06a65f61`. PR 1 merges cleanly onto it (confirmed via merge-tree). Later product commits have not been checked against it.

</details>

<details>
<summary>Details</summary>

### Branch-tip drift and the step 0.2 base check

Plan step 0.2 requires `feat/add-option-list` = `4c06e5e9f`. That held at step 0, and the branch was created from it. The tip then moved at 10:29 (`pull origin refactor/move-shared-listbox-parts`), after `refactor/move-shared-listbox-parts` was rebased at 10:27 and published to origin. `fix/select-multiselect-listbox-alignment` was rebased at 11:20 in `.worktrees/fix-listbox-alignment`. `feat/listbox-unified` is still at `9a6541a01`. None of these reflog entries come from `.worktrees/listbox-unified-2`. The coder is not allowed to push, and the origin refs moved together with the local ones, so another actor most likely did this (likely). Every source sha the plan reads (`c90d893b5`, `32daf8d07`, `bd8f0792b`, `5f8b96389`, `e9922fd3f`) is still a reachable object, and `backup/fix-listbox-alignment-bd8f0792b` now also pins `bd8f0792b`, so later steps can still read their inputs.

The cross-check against `f06a65f61` shows that between the two tips, only `use-load-items` and two caller lines changed in the listbox-related folders. PR 1's tests merge onto it without conflicts. Whether the later fix and refactor commits do is unchecked. That matters only when the stack is opened as PRs.

Step 7 cherry-picks `bd8f0792b`, which adds the equal-copy type-ahead test again. PR 1 already has that test, so step 7 must drop the second copy (`grep -c` = 1, as the plan says).

</details>

<details>
<summary>File map</summary>

- `src/internal/components/listbox/__tests__/item.test.tsx`: new; shared Item tests without the C/D cases.
- `src/internal/components/listbox/__tests__/use-type-ahead.test.ts`: equal-copy case, `describe('matching')` (3), `describe('with groups')` (1).
- `src/multiselect/__tests__/native-search.test.tsx`: new; one group-label case.
- `src/option-list/__tests__/{disabled,group-state,i18n,option-list,render-option}.test.tsx`: the stash's 8 tests.
- `src/internal/components/listbox/__tests__/navigation.test.ts`: "wraps down from the last child of a grouped list".

Full diff: `git -C .worktrees/listbox-unified-2 diff 4c06e5e9f..b5b017e5b`.

</details>
