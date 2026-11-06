# renderOption parent disabled state and disabled-reason description in the shared listbox Item (PR 3)

PR 3 lands fixes C and D on `feat/listbox-unified-2` as two commits, `e7ca453aa` and `a96893bef`, on top of PR 2's last commit `233362761`. Both fixes live in the shared `src/internal/components/listbox/parts/item.tsx`, so one change covers Select, Multiselect and OptionList. Fix C builds `item.parent` for `renderOption` from the group's disabled state instead of the option's. Fix D keeps the hidden disabled-reason description mounted when `renderOption` supplies custom content, so `aria-describedby` no longer points to a missing element. The tooltip is still shown only for default content. Each product hunk is byte-identical to its source commit (`6b95bbf8c`, `7626adb9a`). The tests match the plan, and the progress file records per-test FAILPROOF results.

Watch for: one cosmetic gap. The new OptionList `render-option.test.tsx` case has no blank line before it, while its source in `e9922fd3f^` has one (LOW, confirmed). Pre-existing branch tips other than `feat/listbox-unified` have moved, but their reflogs show pulls and rebases done in other worktrees before PR 3 was committed, and the progress file records this.

**Verdict**: APPROVED

## High-level view

Fix C changes one argument in each of `toSelectOptionItem` and `toMultiselectOptionItem`: `disabled: props.disabled` becomes `disabled: props.parentProps.disabled`. `parentProps.disabled` is a required `boolean` on `ItemParentProps`, and the expression only runs inside the `props.parentProps ?` branch, so the parent can't be `undefined`. Only the `item.parent.disabled` value passed to `renderOption` changes, which is the fix.

Fix D moves `!renderResult` from the guard around the whole disabled-reason fragment to the tooltip alone. With custom content, a disabled option with a reason now renders the hidden `descriptionEl`, which its existing `aria-describedby` already referenced. Default content renders as before. Autosuggest doesn't use `parts/item.tsx` (only Select via `use-select.ts`, plus the listbox `index.tsx`/`use-listbox.ts` type imports), so neither fix reaches Autosuggest. That matches spec §410. No public types or props change.

The tests follow the spec's test map (§433–434). `item.test.tsx` now equals `c90d893b5` exactly, which brings back the C and D cases, the `DropdownOption` type import and the `disabledOption` fixture removed in PR 1. The Select and Multiselect `render-option.test.tsx` files equal `7626adb9a` exactly. The OptionList `render-option.test.tsx` C case and the `disabled.test.tsx` rename with its three `aria-describedby` lines match `e9922fd3f^` text for text. Each new test name appears once. The progress file records FAILPROOF for all 12 new or renamed tests (6 per fix): each failed on an assertion with the product file reverted and passed with the fix. So FAILPROOF step 4 and separate `test:` commits weren't needed.

Process checks pass. Both commit titles are `fix: Subject` with no scope. The reflog of `feat/listbox-unified-2` contains only `commit:` entries since branch creation, with no amend or rebase. `stash@{0}` is present and `git stash list` matches `/tmp/lu-stash-before.txt`. `feat/listbox-unified` is still at `9a6541a01`. The worktree is clean apart from the known untracked `pages/tsconfig.tsbuildinfo`.

<details>
<summary>Issues (1)</summary>

1. **Missing blank line before the OptionList C test** (LOW, confirmed): in `src/option-list/__tests__/render-option.test.tsx`, line 47 `});` is followed directly by `test.each(` on line 48, while the source `e9922fd3f^` has a blank line between them. Add the blank line back when the file is next touched. Lint passes, so this is cosmetic.

</details>

<details>
<summary>Details</summary>

### Pre-existing branch drift

The task expects `feat/add-option-list` at `4c06e5e9f`, `refactor/move-shared-listbox-parts` at `864c388ef` and `fix/select-multiselect-listbox-alignment` at `bd8f0792b`. They are now at `f06a65f61`, `33cfa9917` and `24a384784`. Their reflogs show a `pull` (10:29), a `rebase` (10:27) and a `rebase` (11:20), run in the `option-list-rebase`, `refactor-move-listbox-parts` and `fix-listbox-alignment` worktrees. All three happened before `e7ca453aa` was committed at 11:42, and `feat/listbox-unified-2` has no reflog entry that touches another ref. The progress file recorded the drift under PR 1, and PR 3's branch check repeats that only `feat/listbox-unified-2` was written. This review raises no finding against PR 3 for it. The source shas the plan uses can still be read as commit objects, and the diffs above were checked against them.

### OptionList C test formatting

The progress file says `eslint --fix` "removed one blank line that prettier flagged" in this test. The result has no blank line between the previous test's closing `});` and the new `test.each(`, while the source file has one (confirmed with `grep -n`: lines 47–48 are consecutive). The test body itself is identical to the source. A blank line between tests is not a lint rule, so this is cosmetic.

</details>

<details>
<summary>File map</summary>

- `src/internal/components/listbox/parts/item.tsx`: C uses `parentProps.disabled` for the parent group item in the Select and Multiselect builders. D keeps `descriptionEl` mounted for custom content and limits the tooltip to default content.
- `src/internal/components/listbox/__tests__/item.test.tsx`: the C and D cases, the `DropdownOption` import and the `disabledOption` fixture (file now equals `c90d893b5`).
- `src/select/__tests__/render-option.test.tsx`, `src/multiselect/__tests__/render-option.test.tsx`: the C and D component tests from the source commits.
- `src/option-list/__tests__/render-option.test.tsx`: the OptionList C case from `e9922fd3f^`.
- `src/option-list/__tests__/disabled.test.tsx`: test renamed back to the "describes the disabled option…" name, with the `aria-describedby` assertions restored.

Full diff: `git -C /Users/amanabiy/Documents/components/.worktrees/listbox-unified-2 diff 233362761..a96893bef`.

</details>
