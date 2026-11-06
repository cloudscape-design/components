# Listbox stack plan (after OptionList)

Saved: 2026-10-30. Status: planned, not started. Progress updated 2026-11-02.

## Current state

- #5204 `refactor/move-shared-listbox-parts` → `main`. Origin at `6c48dd2c1`; local at `864c388ef` (2 commits ahead, not pushed; old head kept as `backup/pr1-f484a89f3`). Moves the option row, type-ahead and PlainList into `src/internal/components/listbox/`.
  - `f484a89f3` refactor: Share listbox option props and mouse handlers (local). New `listbox/utils/option-props.ts`: `isHighlightable`, `getListboxOptionProps`, `isAnnouncedSelected`, `getSelectableOption` (choose guard), `getListMouseHandlers` (`onMouseUp`/`onMouseMove`), with unit tests. `use-select.ts` uses them. No behavior change. This replaces stack row 1.
  - `864c388ef` refactor: Share listbox keyboard navigation (local). New `listbox/utils/navigation.ts`: `getListboxNavigation` (goUp/goDown with Select's current wrap at the first and last rows), with unit tests. `use-select.ts` uses it. Home/End stay as in `useMenuKeyboard` (native action not prevented). No behavior change.
- #5180 `feat/add-option-list` → `refactor/move-shared-listbox-parts`. Origin at `5297ed2ef`; local rebased onto `864c388ef`, now at `4c06e5e9f` (not pushed). Pre-rebase head `9a6541a01` kept as `backup/feat-add-option-list-9a6541a01`. Worktree: `.worktrees/option-list-rebase`. The old local head `1bf6d4552` is kept as `backup/feat-add-option-list-1bf6d4552`; `1bf6d4552` itself was dropped in the rebase.
  - `c164bb7e4` revert: Restore Select and Multiselect type-ahead and renderOption behavior (reverts fixes A–D, so Select and Multiselect behave the same as on PR 1)
  - `e67ae145b` refactor: Use PlainList in OptionList (was `5297ed2ef` before the first rebase)
  - `d339a480f` chore: Remove OptionList import restriction from ESLint config (local)
  - `fcdcf61ed` refactor: Use shared listbox helpers in OptionList (local). `use-listbox.ts` uses the PR 1 helpers instead of its own copies. No behavior change.
  - `4c06e5e9f` refactor: Use shared keyboard navigation in OptionList (local). `use-listbox.ts` uses `getListboxNavigation` (wrapped with `withScroll`) and passes `useMenuKeyboard`'s handler directly. OptionList no longer has its wrap fix (wrap at the first/last highlightable option) or its Home/End `preventDefault`; it now behaves like Select. Removed tests: group-state "arrows wrap at the first and last options when the list starts and ends with an empty group", and the Home/End `defaultPrevented` assertions in keyboard "focus highlights the first option, arrows move with wrap-around, Home and End jump".
  - Push in this order: `git push origin refactor/move-shared-listbox-parts`, then `git push --force-with-lease=feat/add-option-list:5297ed2ef origin feat/add-option-list` (force needed because of the rebase).
- Next: PR 2 (`test/listbox-shared-tests`) bases on `feat/add-option-list`.
- #5208 `fix/select-multiselect-listbox-alignment` → `refactor/move-shared-listbox-parts` is open on GitHub with the earlier 7 fixes, based on PR 1 rather than on OptionList. It is out of date with this plan and will be replaced by the fix PRs 3–5 on top of OptionList; decide whether to close #5208 or repoint it.
- Backups to keep:
  - branch `backup/feat-add-option-list-test-dedup` (c90d893b5, 32daf8d07: shared item tests and type-ahead cases)
  - `stash@{0}` "backup: listbox-test-dedup uncommitted OptionList tests" (OptionList gap tests)
  - branches `backup/feat-add-option-list-local`, `backup/feat-add-option-list-origin-4925c401c`, `backup/feat-add-option-list-1bf6d4552` (pre-rebase head), `backup/feat-add-option-list-9a6541a01` (before the keyboard rebase), `backup/pr1-f484a89f3` (PR 1 before the keyboard commit)
- Fix sources: branch `fix/select-multiselect-listbox-alignment` (bd8f0792b): 5f8b96389 (A), e7429e11f (B), 6b95bbf8c (C), 7626adb9a (D), 6792d0dc3 (Home/End), 58dad9856 (wrap), bd8f0792b (identity). OptionList versions of A–D: b5f875a26, ad1132a99, e0bed93c2, eb9030d45. `git -P show 460ac0f4c` lists the tests that were removed.

## Stack

Each branch builds on the one before it. All stay local until the user pushes.

| # | Branch | PR title | Base | Contents | Select/Multiselect |
|---|---|---|---|---|---|
| 1 | done, no separate branch | — | — | Done as `f484a89f3` + `864c388ef` on #5204 (shared helpers and keyboard navigation, used by Select) and `fcdcf61ed` + `4c06e5e9f` on #5180 (OptionList uses them). | Unchanged |
| 2 | `test/listbox-shared-tests` | `test: Add shared listbox and OptionList tests` | `feat/add-option-list` | New `listbox/__tests__/item.test.tsx` (lang, group header content, no tooltip or aria-describedby without a reason, multi aria-checked, renderOption `highlighted`). Type-ahead multi-character and field-matching cases. OptionList gap tests (parity report gaps 3, 4, 5, 6 click/Enter, 9, 12, 13, 14). Starts from the backup branch and the stash, without cases that depend on A–D. | Tests only |
| 3 | `fix/listbox-type-ahead` | `fix: Improve type-ahead in Select, Multiselect and OptionList` | 2 | Commits: A, ignore non-matching group headers. B, ignore handled keys. G, find the highlighted option by identity (with a value fallback). | Changes, tested |
| 4 | `fix/listbox-render-option` | `fix: Fix renderOption parent and disabled reason in Select, Multiselect and OptionList` | 3 | Commits: C, group disabled state as `parent.disabled`. D, disabled-reason description kept with custom content. | Changes, tested |
| 5 | `fix/select-keyboard` | `fix: Fix Home, End and arrow keys in Select, Multiselect and OptionList` | 4 | Commits: Home/End no longer scroll the page (prevention added once in `useMenuKeyboard`, e.g. `preventNativeHomeEnd`). Arrows wrap at the first and last highlightable options, past empty groups (fix applied once in `getListboxNavigation`). Both apply to Select, Multiselect and OptionList. Restores the OptionList tests removed in `4c06e5e9f` (the empty-group wrap test and the Home/End `defaultPrevented` assertions). | Changes, tested |

## Rules

- Tests: detailed cases go once into the shared tests (`item.test.tsx`, `use-type-ahead.test.ts`, the option-props helper test). Each component gets one short wiring test per behavior. Every test removed in 460ac0f4c is restored in the PR for its fix, including the two from the revert review: Multiselect "highlights a group when its own label matches", and the use-type-ahead "with interactive groups, highlights a group whose own label matches".
- Every new test is shown to fail without its fix.
- Per branch, run with Node 22 (`mise exec node@22.23.2 --`):
  - unit tests for option-list, select, multiselect, autosuggest, property-filter and the shared listbox, options-list, selectable-item and option code
  - eslint and tsc
  - snapshot tests unchanged
  - Select, Multiselect and OptionList integ tests for PRs 1 and 5
- One worktree: `.worktrees/listbox-stack`, with node_modules symlinked from `.worktrees/refactor-move-listbox-parts`.
- Never push, never force. Leave the backup branches and `stash@{0}` untouched.
- PR descriptions: one-line description plus "How has this been tested?" in the repo template.

## Open before starting

1. ~~Push `5297ed2ef` to #5180.~~ Done. The ESLint rule removal (now `f75de8bc8`) and the shared-helper commits are still local; see the push order above.
2. ~~Confirm the order (refactor before tests).~~ Confirmed by the user on 2026-10-30.
3. Check whether GitHub treats the PRs as a native stack (#5180's merge box). If not, merging one PR means rebasing and force-pushing the PRs above it.

## After the stack

- Update the Copilot replies on #5180 for type-ahead group headers, handled keys, `parent.disabled` and `aria-describedby` with custom content, saying they're addressed in PRs 3 and 4.
- Follow-up: item analytics test (needs a decision on component-level analytics metadata) and `findDisabledReason()` on `OptionListOptionWrapper`.
- Clean up worktrees and branches no longer needed: `refactor/option-list-plain-list`, `option-list/revert-shared-fixes`, `fix/option-list-icon-gap`, `feat/add-option-list-rebased`, `fix/select-multiselect-listbox-alignment` (once ported).

## Update 2026-11-03: useListbox refactor between #5204 and #5180

- New PR (branch `refactor/use-listbox-in-select`, worktree `.worktrees/listbox-use-listbox`, commits `e468024a7` and `2a861fe1b`) sits between #5204 and #5180: `main` ← #5204 ← this PR ← #5180. `useSelect` is built on a shared `useListbox` hook, with no behavior change.
- **Not pushed yet.** Waiting for the user's confirmation.
- #5180 has to be rebased onto it, with OptionList's hook renamed to `useInlineListbox` (`use-inline-listbox.ts`). Report with the conflicts and the draft PR description: `.agents/tasks/use-listbox-in-select.md`.

## Update: refactor/use-listbox-in-select (local, not pushed)

Stacked between #5204 and #5180. Worktree `.worktrees/listbox-use-listbox`. No behavior change for Select/Multiselect.

- `e468024a7` refactor: Move listbox list prop types into the listbox folder
- `93ff97f60` refactor: Build useSelect on a shared useListbox hook (no new options: no preventNativeHomeEnd, Escape required, selected rows from the `selectedOptions` prop)
- `318ee8036` refactor: Share the list announcement and scroll between Select and Multiselect

Decided to leave out:
- Dropdown status, loading and mouse-down sharing (Select/Multiselect-only code, not the list layer shared with OptionList).
- Moving the `useTypeAhead` call into useSelect. The hook is already shared in `listbox/use-type-ahead.ts`; only the call settings differ per component, and OptionList would not benefit.

Next, after the user confirms: push the branch and open it as a draft PR on `refactor/move-shared-listbox-parts`, then rebase #5180 onto it (rename OptionList's hook to `useInlineListbox`; building it on `useListbox` is a later step).

## Follow-up fixes after OptionList (dropped from #5180)

Dropped from `feat/add-option-list-v2` in `6023aab41` (local, not pushed) so OptionList uses Select's current list behavior. Each fix goes into the shared `useListbox` and applies to Select, Multiselect and OptionList together, with the removed tests restored (recover them with `git show 6023aab41^:<path>`). The behaviors were first added in `bde559410` (repeated keyboard scroll) and `a7cb59704` (highlight sync and no dangling active descendant), and moved into useListbox as options in `5994e045c`.

1. **Scroll on repeated keyboard highlights (Select, Multiselect, OptionList).** Today the highlighted row scrolls into view only when the highlighted index changes, so End again after scrolling away, or a keyboard highlight (type-ahead, focus entry) of the hovered option, doesn't scroll. Mouse highlights must still not scroll. Tests to restore:
   - `use-listbox.test.tsx`: the `scrollOn: 'keyboard-request'` describe (scrolls after ArrowDown, ArrowUp, Home and End, also when End keeps the index; does not scroll on mouse move; highlightOption and goHome scroll, also when the index stays the same) and `highlightOption and goHome › highlight with the keyboard and scroll on index change with the default scrollOn`, adapted to the API the fix chooses.
   - `src/option-list/__tests__/highlight.test.tsx`: `a keyboard highlight of the hovered option scrolls it into view`, and the `expect(scrollIntoView).toHaveBeenCalledTimes(5)` assertion (plus the "repeated End still scrolls" comment) in `keyboard moves scroll the highlighted option into view`.
   - Add matching Select and Multiselect tests.
2. **No dangling `aria-activedescendant` when nothing is highlighted (Select, Multiselect, OptionList).** `getOptionId(listId, -1)` is already undefined, but after the options shrink the highlighted index can point past the end, and `aria-activedescendant` then names a row that doesn't exist. Tests to restore:
   - `use-listbox.test.tsx`: `activeDescendantId › with 'when-highlighted', is undefined when no option is highlighted` (and drop or flip `with 'always', is the id of the highlighted index even when no option is at that index`, which documented today's behavior).
   - `highlight.test.tsx`: the `expect(listbox).not.toHaveAttribute('aria-activedescendant')` assertion in `clears the highlight when the highlighted option is removed, and arrow keys still move it`.
3. **Keep the highlight on its option when options change (Select, Multiselect, OptionList).** The highlight is stored as an index, so when options are reordered, inserted or removed it lands on a different option. The fix makes it follow its option by `value` (group headers only match group headers), or clears it when the option is gone, keeping the highlight type and not scrolling. Check how it interacts with Select/Multiselect filtering: typing in the filter changes the options on every keystroke, and Select's current highlight reset and re-highlight on filter change must still win (or be deliberately changed). Also check `group-state.test.tsx`, where a controlled multi list rebuilds its options on every render and Enter is pressed on the header twice. Tests to restore:
   - `use-listbox.test.tsx`: the `keepHighlightOnOptionsChange` describe (follows the highlighted option to its new index and keeps the highlight type; clears the highlight when the highlighted option is gone; keeps the index by default, which flips if the fix becomes the only behavior).
   - `highlight.test.tsx`: the whole `OptionList highlight when options change` describe (clears the highlight when the highlighted option is removed, and arrow keys still move it; keeps the keyboard highlight on the same option when options are reordered or inserted, without scrolling; keeps the mouse highlight on the same option when options are reordered; multi: keeps a highlighted group header when groups are reordered).
   - Add matching Select and Multiselect tests.
4. **Embedded list focus entry: move focus to the selected option for embedded lists (OptionList, embedded Multiselect); decide selection order vs list order (ARIA listbox pattern says list order); the Select dropdown open effect uses selection order today.**

## Update: embedded focus refactor moved to #5239 (local, not pushed)

- #5239 `refactor/use-listbox-in-select` now has `73f803b62` refactor: Share embedded list focus handling through useListbox (on `c7d7fce91`). `useListbox` `getListProps({ embedded })` returns onFocus/onBlur; embedded Multiselect uses it. Focus entry keeps selection order (follow-up item 4 above).
- #5180 `feat/add-option-list-v2` rebased onto `73f803b62`; trees identical to the old commits, final tree equals `599443dd1` (backup `backup/feat-add-option-list-v2-599443dd1`):
  - `df90ee81d` refactor: Add OptionList support to the shared listbox code (body no longer mentions the embedded flag, says OptionList passes `embedded: true`)
  - `a4f70109a` feat: Add OptionList component
  - `66b0e5c9c` chore: Add OptionList dev pages
  - `d6bbf27d0` test: Add OptionList unit and integration tests
- Push #5239 first, then #5180 (`git push --force-with-lease=feat/add-option-list:24173f991 origin feat/add-option-list-v2:feat/add-option-list`). Report: `.agents/tasks/listbox-embedded-focus-move-5180.md`.

## Deferred from #5239 cleanup (do after OptionList)

Decided 2026-11-03: #5239 only takes the neutral type names (`ScrollToIndexRef` in `listbox/interfaces.ts`, `SelectListProps` → `ListProps`), the `menuProps` → `listProps` rename on `PlainList`/`VirtualList`, and the two `use-listbox.ts` docstrings. The earlier fuller cleanup is saved as `backup/use-listbox-in-select-a77424765`.

Refactors after OptionList, no behavior change (audit `.agents/tasks/listbox-full-audit.md`):
- A1: `useListbox` returns the shared list render props (`ref`, `highlightType`, `screenReaderContent`, `getOptionProps`, `selectionType`), spread by Select, Multiselect, embedded Multiselect and OptionList.
- A2: `isMultiSelect` comes from `getListProps`; drop the separate `PlainList`/`VirtualList` prop and Multiselect's literal.
- B1: remove `mouseHandlers` from `UseListboxApi` (only tests read it).
- B2: read `selectedOptions` from `selection`. `interactiveGroups` stays a prop (a `use-select.test.ts` case passes a different value).

## Follow-up: share one SelectableItem shell in the listbox row (after OptionList)

Copilot on #5204 (`src/internal/components/listbox/parts/item.tsx`): the single and multi paths each render a full `SelectableItem` with the same refs, virtualization, highlight, scroll and position props. Decided to keep #5204 as is (the two old rows side by side, no behavior change) and consolidate in a follow-up PR: render `SelectableItem` once and vary only the mode-specific props and children, keeping each mode's ARIA attributes and tooltip placement. Prove no change by comparing rendered HTML for both modes before and after. Branch: `fix/select-multiselect-listbox-alignment` (#5208, worktree `.worktrees/fix-listbox-alignment`), the follow-up branch that was reset to start from OptionList (old version in `backup/fix-listbox-alignment-f4e7628ca`). Before adding commits, move it from `8e6767b4a` to the current `origin/feat/add-option-list`. An unfinished attempt is saved in the `.worktrees/refactor-move-listbox-parts` stash "aborted listbox-item-shell-consolidation (item.tsx)".
