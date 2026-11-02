# Type-ahead: per-option matching and handled-key guard in OptionList

The change fixes two bugs in `src/internal/components/listbox/use-type-ahead.ts`, the type-ahead hook behind OptionList. First, candidates are now matched one at a time (`filterOptions([option], …)`) instead of taking the output of `filterOptions(options, …)`. That output includes a group header whenever one of its children matches, so in multi selection with interactive groups, `e` used to highlight Compute instead of EC2. Second, the handler now returns early on `event.defaultPrevented`, so the Space that selects an option no longer enters the 500 ms search buffer. `filterOptions` is untouched. Hook tests and OptionList tests cover both bugs, and the coder's evidence shows all 8 new tests fail on the old hook and pass on the new one. The untracked `type-ahead.page.tsx` dev page is gone.

Watch for: the per-option filter also changes single selection (confirmed). Typing a group's name used to jump to that group's first child. Now it skips the group's children, and one new test locks that in. The worktree also has an unrelated, unstaged edit to `pages/option-list/simple.page.tsx` that must not be committed with this fix (confirmed).

**Verdict**: APPROVED

## High-level view

The matching fix is the suggested changeset, applied as written. Each option is now judged only on its own label, value, description and tags. That removes the context-driven inclusion in both directions. A header no longer matches through its child, and a child no longer matches through its header. The first is the bug. The second is a side effect: with non-interactive groups (single selection), `c` in Compute → EC2/Lambda used to land on EC2 and now finds nothing in that group. This arguably matches native `<select>`, where an optgroup label is not searchable. Still, it is a behavior change that was not part of the stated bug. It also makes OptionList differ from Select and Multiselect, whose copy of this logic (`src/select/utils/use-native-search.ts`) still has the old code and both bugs.

The `defaultPrevented` guard works because the list key handler prevents the default on Space (`preventNativeSpace: true`) before the same event reaches the type-ahead handler. The OptionList test proves this wiring end to end, and it failed on the old code.

The tests follow the repo conventions. They assert the observable highlight and `onChange` payloads through test-utils (`findGroupHeaderByValue(...).isHighlighted()`), and test names describe behavior. The hook-level grouped tests feed each highlight back through `rerender`, which models the listbox loop correctly for the cycling case.

<details>
<summary>Issues (3)</summary>

1. **Single-selection group-name jump removed** (confirmed, non-blocking) — With non-interactive groups, typing a group's name no longer highlights that group's children. The test "single: skips the options of a group whose label matches" pins this new behavior and is not a baseline. Confirm with the user that this is intended, and mention it in the PR description.
2. **Unrelated `simple.page.tsx` edit in the worktree** (confirmed, non-blocking) — `pages/option-list/simple.page.tsx` has about 110 lines of preselection and focus-button settings. The coder reports that something outside this step made the edit. Leave it out of this fix's commit.
3. **Select/Multiselect still have both bugs** (confirmed, non-blocking, scope) — `use-native-search.ts` is unchanged. If the user's "this two exists in multiselect as well" means fixing them there too, that needs a follow-up step.

</details>

<details>
<summary>Details</summary>

### Per-option matching and its effect on non-interactive groups

```ts
// before
filterOptions(options, searchText, true).filter(option => interactivityCheck(option));
// after
options.filter(option => interactivityCheck(option) && filterOptions([option], searchText, true).length > 0);
```

When `filterOptions` gets a one-element array, it can only match that element's own fields, because there is no `currentGroup` or `parentMatched` context. That fixes the multi case:

- `e` → EC2.
- `c` → Compute.
- Repeated `c` cycles Compute → Cherry → Compute and skips the disabled Databases group and its children.
- Enter after `e` emits `['ec2']`, not the whole group.

The same loss of context applies in reverse (confirmed). The old `parentMatched` branch pushed every child of a matching header. With `isInteractive`, the header itself was filtered out and its first child became the target. That is why the evidence records old-code `c` → EC2 for non-interactive groups. The new test "single: skips the options of a group whose label matches" and the hook test "non-interactive groups: skips the options of a group whose label matches" both fail on the old code. So they pin a change in single-selection behavior, not a baseline. A narrower fix would have kept the old single-selection behavior: keep the `filterOptions` result and drop only `type === 'parent'` entries whose own fields don't match. The user picked the suggested changeset, so this is a decision to surface, not a defect.

Performance: `filterOptions` now runs once per option per keystroke, plus once more for the repeat-cycle path. Each call is O(1), so the total stays linear.

### Space and the search buffer

The guard sits before `delayedResetValue()`. A prevented event therefore doesn't extend the debounce window or touch the buffer. Other single-character keys whose defaults are prevented upstream are skipped too, which is the intent. Both the hook test (`{ key: ' ', defaultPrevented: true }` then `o`) and the OptionList test (Space emits `['a']`, then `t` highlights `c`) failed before the fix.

### Test coverage and evidence

For the targeted run, the evidence reports lint, prettier and quick-build all passing, and 128 tests passing in the `option-list` and `listbox` suites. The full `src/` run had two failures unrelated to this change: a parallel flake that passes when run alone, and `documenter`, which needs a full build. Not tested: a header whose description or tags (not its label) match the query, and repeated-key cycling in single selection across groups. Both follow from the same per-option rule, so their absence is minor.

### Repository state

The brief's base `416630869` is outdated. At 15:36, before this step ran, the branch was rebased onto `origin/feat/add-option-list` and the commit was amended into `977d24fad`. The diff was reviewed against the current HEAD. These files are unmodified and untracked as before: `package-lock.json`, `pages/tsconfig.tsbuildinfo`, `.agents/` and `.kiro/`. `filter-options.ts` has no diff. `pages/option-list/type-ahead.page.tsx` is gone from disk and from the index.

</details>

<details>
<summary>File map</summary>

- `src/internal/components/listbox/use-type-ahead.ts`: per-option candidate matching, plus the `defaultPrevented` early return.
- `src/internal/components/listbox/__tests__/use-type-ahead.test.ts`: grouped-options hook tests (interactive and non-interactive) and the handled-event test.
- `src/option-list/__tests__/option-list.test.tsx`: Space-then-letter test, plus `option groups > type-ahead` tests for multi and single selection.
- `pages/option-list/simple.page.tsx`: unrelated preselection and focus settings, not from this step. Exclude from the commit.

Full diff: `git -C .worktrees/pr3-option-list diff`

</details>
