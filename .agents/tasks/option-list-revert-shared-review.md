# Revert shared listbox fixes A–D so OptionList PR #5180 leaves Select and Multiselect unchanged

Commit `460ac0f4c` on `option-list/revert-shared-fixes` is a plain revert (variant (a)) of four shared listbox fixes. A (b5f875a26) is type-ahead matching against the whole filtered list. B (ad1132a99) is type-ahead skipping `defaultPrevented` keys. C (e0bed93c2) is `item.parent.disabled` in `renderOption`. D (eb9030d45) is the hidden disabled-reason description with custom content. All four go back to base behavior in `use-type-ahead.ts` and `parts/item.tsx`. The tests that asserted A–D are removed from Select, Multiselect, the listbox hook and OptionList, and the multiselect integ test is back to its base expectations. The neutral shared changes (`hideTopDivider`, `scrollOptionIntoView`, options-list `statusType` default and `onMouseLeave`, optional `closeDropdown`) stay. Against `origin/refactor/move-shared-listbox-parts`, `src/select`, `src/multiselect`, `use-type-ahead.ts` and `use-type-ahead.test.ts` show no diff, and the only `item.tsx` hunks are `hideTopDivider`.

Watch for: OptionList now carries the known D a11y bug (the `aria-describedby` target is missing when `renderOption` returns custom content for a disabled option with `disabledReason`). It also carries A–C. The plan accepts this, and the commit body says the fixes return in a follow-up, so it does not block (confirmed).

**Verdict**: APPROVED

## High-level view

The source revert matches the plan line for line. `use-type-ahead.ts` was restored from base and shows no diff. `item.tsx` has `disabled: props.disabled` in both item builders again, plus `!renderResult && isDisabledWithReason` for the description element and `highlighted && canShowTooltip` for the tooltip. The diff against base contains only the four `hideTopDivider` hunks (confirmed).

On the OptionList test side, the commit removes exactly the A–D tests named in the plan: the 3 group-state type-ahead tests and their fixtures, the keyboard Space-then-type test, and the single/multi render-option parent test. The disabled `renderOption` test was partially trimmed: it keeps the highlight and no-tooltip assertions and drops the `aria-describedby` target assertion. The no-tooltip assertion holds under base because base omits the whole `disabledReasonElement` when `renderResult` is set. No test was rewritten to assert the old buggy behavior. The unused imports (`Wrapper` and `highlightedValue`) were removed (confirmed).

Docs need no change. The OptionList `renderOption` JSDoc says only "Specifies a render function to render custom options". `disabledReason` promises a tooltip, which is still true for default rendering, and `OptionItem.parent` has no wording about group state. The commit touches no snapshots. The snapshot diff against base is the PR's own OptionList additions (confirmed).

The process requirements are met. The branch has exactly the two expected commits on top of `origin/feat/add-option-list`, which is still at 24524f9b9. The branch has no upstream and no remote contains HEAD. The commit stat lists only source and test files. The report gives before/after test counts, an equivalence argument, eslint, tsc, a loopback-only integ run, the #5180 Copilot follow-up comments and the fast-forward push command.

<details>
<summary>Issues (2)</summary>

1. **OptionList regresses A–D until the follow-up** (non-blocking): this was accepted under variant (a). The follow-up fix PR should restore the 8 removed OptionList tests (and the `aria-describedby` assertions in the disabled test) for all three components.
2. **Base-neutral tests removed with their files** (non-blocking): "highlights a group when its own label matches" (multiselect native-search) and the use-type-ahead "with interactive groups, highlights a group whose own label matches" would pass under base, but they were removed so the files match base. Re-add them in the follow-up.

</details>

<details>
<summary>Details</summary>

### Partial trim of the disabled `renderOption` test

`src/option-list/__tests__/disabled.test.tsx` renames the test to "does not show the disabled reason tooltip when renderOption is used (%s)" and removes the three `aria-describedby` lines. Under base, `item.tsx:276` returns no description element when `renderResult` is set, while `ariaDescribedby={isDisabledWithReason ? descriptionId : ''}` still points at it. So OptionList with custom content now has a dangling `aria-describedby` (confirmed, D is reintroduced). The remaining assertions (highlight lands on `b`, no tooltip) hold under base, and the comment "Custom content owns the visible output, so the tooltip isn't shown" still describes base behavior. The imports in this file are all still used.

### Test accounting

The count drops from 83 suites / 1235 tests to 81 / 1211. The drop of 24 tests and 2 suites matches the itemized removals: 8 native-search, 4 select/multiselect render-option, 6 use-type-ahead, 3 group-state, 1 keyboard and 2 render-option. The report says the Select, Multiselect and listbox test files equal base, so the after-run already runs base's own tests against the reverted code. That makes a separate checkout-based equivalence run redundant. I accept that argument because the diffs against base are empty (verified). The integ run covered `multiselect.test.ts` with the restored expectations ('o' → "First category", 'oo' → "option1", 7×'o' → "First category") and the OptionList integ suites: 3 suites, 44 tests passed. The dev server was bound to 127.0.0.1 and stopped afterwards.

### Commit and workspace hygiene

The subject is exactly `revert: Restore Select and Multiselect type-ahead and renderOption behavior`. The body lists A–D with all four hashes, says OptionList loses them and that they return in a follow-up, and lists the removed tests. `git show --stat HEAD` lists 12 source/test files and no lockfile, tsbuildinfo, tsconfig, `.agents/`, `.kiro/` or `node_modules`. The revert worktree is clean. The `option-list-icon-gap` worktree is still at 87aa788fe, and `refactor-move-listbox-parts` is at 6c48dd2c1. The uncommitted changes in other worktrees (for example `option-list-rebase`) do not involve this commit.

</details>

<details>
<summary>File map</summary>

- `src/internal/components/listbox/use-type-ahead.ts`: A and B reverted; equals base.
- `src/internal/components/listbox/parts/item.tsx`: C and D reverted; only `hideTopDivider` differs from base.
- `src/internal/components/listbox/__tests__/use-type-ahead.test.ts`: defaultPrevented test and "with groups" describe removed; equals base.
- `src/select/__tests__/native-search.test.tsx`, `src/multiselect/__tests__/native-search.test.tsx`: deleted.
- `src/select/__tests__/render-option.test.tsx`, `src/multiselect/__tests__/render-option.test.tsx`: 2 tests each removed; equal base.
- `src/multiselect/__integ__/multiselect.test.ts`: base expectations restored.
- `src/option-list/__tests__/group-state.test.tsx`: type-ahead describe, fixtures and `Wrapper` import removed.
- `src/option-list/__tests__/keyboard.test.tsx`: Space-then-type test and `highlightedValue` import removed.
- `src/option-list/__tests__/render-option.test.tsx`: parent-group-state `test.each` removed.
- `src/option-list/__tests__/disabled.test.tsx`: `renderOption` test trimmed to the no-tooltip assertion and renamed.

Full diff: `git -C .worktrees/option-list-revert-shared -P show HEAD`.

</details>
