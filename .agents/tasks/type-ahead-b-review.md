# Per-option matching and handled-event guard in native type-ahead search

`useNativeSearch` (shared by Select and Multiselect) gets two small fixes. First, each option is now matched on its own content instead of running `filterOptions` over the whole list. `filterOptions` adds parent headers for matching children and all children of a matching group. With interactive groups (Multiselect), that made non-matching headers into type-ahead targets: `e` highlighted Compute instead of EC2. Second, the key handler now returns early on `event.defaultPrevented`, so a Space that already selected an option or opened the dropdown no longer goes into the 500 ms search buffer. `filterOptions` itself is untouched. Hook, Select and Multiselect unit tests reproduce both bugs, and three Multiselect integ expectations that encoded bug 1 were corrected.

Watch for: the Select behaviour change (typing a group label's prefix no longer selects that group's first child) is user-visible and should go in the PR description (confirmed). The async-select scroll integ failure was not confirmed on main, but nothing in this diff touches that code path (likely unrelated).

**Verdict**: APPROVED

## High-level view

The matching fix is the per-option filter the user accepted: `options.filter(o => interactivityCheck(o) && filterOptions([o], text, true).length > 0)`. Calling `filterOptions` with a one-element array removes the parent/child expansion, so an option is a target only when its own label (or other searchable fields) matches. In Multiselect, headers stay targets when their own label matches (`c` → Compute). In Select, headers were never targets because `isInteractive` excludes parents. The other half of the expansion did reach Select, though: the children of a matching group were returned. After the fix, typing `c` with only Compute → EC2 matches nothing, the same as a native `<select>`, where optgroup labels aren't searchable.

The `defaultPrevented` guard is safe because the only single-character key any upstream handler prevents is Space (`useMenuKeyboard` with `preventNativeSpace`, and `useTriggerKeyboard`). Printable letters are never prevented, so type-ahead for real input keeps working. Select is affected by bug 2: Space on the trigger opens the dropdown, and Space in the list selects and returns focus to the trigger. In both cases the prevented event bubbled to the root `onKeyDown={handleNativeSearch}`. The coder's justification and the two Select tests are sound.

The tests follow repo conventions. They go through public test-utils (`findMultiselect`, `findHighlightedOption`, `findOptionsContainer`), assert observable effects (highlighted label, `onChange` detail), and have behaviour-named titles. According to the verification doc, 11 of the 16 targeted tests failed with the fix stashed and all 16 passed with it. Each listed failure reason matches the bug it targets. The 5 that passed before are baselines that should pass on both versions. The integ edits are correct for the page's options: 4 enabled `o*` options, so `oo` → option3 and 5×`o` (matches + 1) wraps to option1.

<details>
<summary>Issues (2)</summary>

1. **Select group-label behaviour change undocumented** (confirmed, non-blocking) — typing a group label's prefix in Select used to select that group's first child and now does nothing. State this in the PR description as a deliberate side effect so it doesn't read as a regression.
2. **async-select scroll integ failure not confirmed on main** (likely unrelated, non-blocking) — the attempt to confirm it on main was inconclusive because the dev server didn't recompile. The test uses only ArrowDown, which returns early before any changed logic. Mention it as a pre-existing flake in the PR, or rerun it once on main.

</details>

<details>
<summary>Details</summary>

### Hygiene

The diff touches only `use-native-search.ts`, its hook test, two new behaviour test files, and the Multiselect integ file. `node_modules` in the worktree is a symlink covered by `.gitignore` and does not appear in `git status`. The new test files are untracked, so they must be added explicitly when committing.

</details>

<details>
<summary>File map</summary>

- `src/select/utils/use-native-search.ts` — per-option matching; `defaultPrevented` early return.
- `src/select/__tests__/use-native-search.test.ts` — 5 hook tests (handled key ignored; grouped child vs header, matching header, no cycling into children, non-interactive groups).
- `src/select/__tests__/native-search.test.tsx` (new) — Space-open then type, Space-select then type, group-label prefix.
- `src/multiselect/__tests__/native-search.test.tsx` (new) — `e` → EC2, Enter selects only EC2, `c` → Compute, `cc` stays, Space then `g` → Glacier.
- `src/multiselect/__integ__/multiselect.test.ts` — three native-search expectations corrected for bug 1.

Full diff: `git -C .worktrees/fix-native-search diff` plus the two untracked test files.

</details>
