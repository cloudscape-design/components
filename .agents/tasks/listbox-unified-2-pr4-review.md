# Home/End scroll prevention and highlightable-option wrap for Select, Multiselect and OptionList

PR 4 of the unified-listbox stack (`a96893bef..866fcb0c1` on `feat/listbox-unified-2`, three commits) brings back the two keyboard behaviors that `4c06e5e9f` dropped from OptionList, and fixes them for Select and Multiselect too. `useMenuKeyboard` gains an opt-in `preventNativeHomeEnd`. Select and Multiselect pass `!hasFilter`, and OptionList passes `true`. `getListboxNavigation` now wraps at the first and last highlightable options, not at the first and last rows, and no longer takes `highlightedOption`. The FAILPROOF split worked as the plan expected: the three filter-input tests that already pass on the parent went into `test: Cover native Home and End in filter inputs`, ahead of the fix.

Watch for: nothing blocking. The progress file's PR 4 branch check doesn't mention that `fix/select-multiselect-listbox-alignment` moved again during PR 4 (LOW, record-keeping only).

**Verdict**: APPROVED

## High-level view

Home/End prevention is opt-in on `useMenuKeyboard` (default `false`), so Autosuggest and every other caller keep the native action. `use-select.ts` passes `preventNativeHomeEnd: !hasFilter`, which also covers embedded Multiselect, because `hasFilter` is false there. `use-listbox.ts` passes `true` and comments why: focus is on the list, never in a text input. The `use-keyboard.ts`, `use-select.ts`, Select/Multiselect `home-end.test.tsx` and `use-keyboard.test.ts` changes match `6792d0dc3` byte for byte. The one exception is the embedded Multiselect case added for design-review NIT 3.

The wrap fix copies `58dad9856`'s conditions into the shared `navigation.ts`. Up wraps when `highlightedIndex === options.findIndex(isHighlightable)`. Down wraps when `!options.slice(highlightedIndex + 1).some(isHighlightable)`. `isHighlightable` is bound to `interactiveGroups` from `option-props.ts`. With interactive groups (Multiselect) every row is highlightable, so the result equals the old row-based check. Without them it replaces the old `type === 'child' && index === 1` special case, which covered only a leading group that has options. Both callers drop `highlightedOption`, and nothing else calls `getListboxNavigation`.

The tests restore what `4c06e5e9f` removed: the group-state "arrows wrap … empty group" test and the keyboard `defaultPrevented` assertions and their comment, both identical to the removed text. They also add the planned navigation cases. The bug-pinning "wraps down only from the last row" test is replaced, and the leading-empty-group mirror is added. They add one Select `arrow-key-wrap.test.tsx` test, plus the embedded Multiselect Home/End test. FAILPROOF shows assertion failures on the parent for every fix test. The only parent failure that isn't caused by the fix is the expected one from the dropped `highlightedOption` prop.

<details>
<summary>Issues (1)</summary>

1. **Unrecorded branch drift during PR 4** (LOW, confirmed): `fix/select-multiselect-listbox-alignment` moved from `24a384784` to `a47f825be` ("chore: Trigger redeploy", 11:48:54, committed in `.worktrees/fix-listbox-alignment` and matching origin). The progress file's "Branch check after PR 4" says nothing changed except the PR 1 drift. Add this move to the progress file as outside activity. The `feat/listbox-unified-2` reflog shows only its own three commits, so this worktree didn't cause it.

</details>

<details>
<summary>Details</summary>

### Wrap via `isHighlightable` in `getListboxNavigation`

```
goUp:   highlightedIndex === options.findIndex(isHighlightable)        -> goEnd
goDown: !options.slice(highlightedIndex + 1).some(isHighlightable)     -> goHome
```

With no highlight (`-1`) the old and new code agree for any list that has a highlightable option. Up gives `moveHighlight(-1)`, and Down gives `moveHighlight(1)`. The one difference is a list with no highlightable option at all, where Up now calls `goEnd` instead of `moveHighlight(-1)`. Both do nothing on such a list. Disabled options count as highlightable, as they did before. The JSDoc and the `58dad9856` comment describe the new rule.

### FAILPROOF and the separate `test:` commit

`e28877d2e` holds exactly the three tests the plan names: the `use-keyboard` default case, and Select and Multiselect "with filtering …", in trimmed files with only the imports those tests use. `071edd6d4` then adds the `preventNativeHomeEnd: true` hook case, the two "without filtering" cases, the embedded case and the OptionList assertions. The progress file records each of these failing on an assertion on the parent: `preventDefault` called 0 times, `fireEvent.keyDown` returning true, and `defaultPrevented` false. The run used the nodiag config only for `use-keyboard.test.ts` and `navigation.test.ts`, as the plan requires. Two departures from the plan are recorded with their reasons, and neither changes what was committed. `git rm --cached -f` was needed because the Multiselect file had status AM. A first rerun against stale `lib` failed until QB rebuilt it. In step 11, Select arrow-key-wrap got Banana instead of Apple, OptionList got banana instead of apple, and the two new navigation cases saw `goHome`/`goEnd` called 0 times. All of these are assertion failures.

### Branch and repo state

The three commits have allowed `type: Subject` titles with no scope. The branch reflog shows plain `commit` entries, with no amend or rebase. Each test name appears once in the touched files. `feat/listbox-unified` is still at `9a6541a01`, and `stash@{0}` is unchanged (`7f1b9f34f`). `feat/add-option-list` (`f06a65f61`) and `refactor/move-shared-listbox-parts` (`33cfa9917`) are where PR 1 recorded them, after drift from other worktrees. `fix/select-multiselect-listbox-alignment` moved again, from `24a384784` to `a47f825be`, at 11:48:54. That falls between `a96893bef` (11:44:52) and `e28877d2e` (11:52:48), and the commit was made in its own worktree and matches origin. The PR 4 notes don't mention it (Issue 1). No public `interfaces.ts` or component entry file changed. The SNAP evidence (113/113 tests, 111/111 snapshots) confirms that test-utils and documenter output are unchanged.

### Test coverage

Not tested: Select (non-embedded) with a filter while focus is on the list rather than the input. This state isn't normally reachable, because the filter input owns the keyboard handler. The OptionList group-state wrap test checks End→Down→Up but not Home→Up. It is restored verbatim per F4, and Select's `arrow-key-wrap.test.tsx` and `navigation.test.ts` cover the leading-group direction.

</details>

<details>
<summary>File map</summary>

- `src/internal/components/options-list/utils/use-keyboard.ts`: `preventNativeHomeEnd` option (default false).
- `src/select/utils/use-select.ts`: passes `preventNativeHomeEnd: !hasFilter`, drops `highlightedOption` from navigation.
- `src/internal/components/listbox/use-listbox.ts`: passes `preventNativeHomeEnd: true` with comment, drops `highlightedOption`.
- `src/internal/components/listbox/utils/navigation.ts`: wrap at first/last highlightable option.
- `src/internal/components/options-list/__tests__/use-keyboard.test.ts`: two Home/End hook cases.
- `src/select/__tests__/home-end.test.tsx`, `src/multiselect/__tests__/home-end.test.tsx`: new; filter and no-filter (plus embedded for Multiselect).
- `src/internal/components/listbox/__tests__/navigation.test.ts`: setup without `highlightedOption`; replaced and added empty-group wrap cases.
- `src/select/__tests__/arrow-key-wrap.test.tsx`: new; empty groups at both ends.
- `src/option-list/__tests__/group-state.test.tsx`, `keyboard.test.tsx`: restored from `4c06e5e9f`.

Full diff: `git -C .worktrees/listbox-unified-2 diff a96893bef..866fcb0c1`.

</details>
