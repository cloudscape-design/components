# OptionList rebased onto shared useListbox focus handling

`feat/add-option-list-v2` was rebased onto the new #5239 tip `4c51035b1` (refactor: Share list focus handling through useListbox). `use-option-list.ts` drops its own pointer-down ref, `onMouseDown` (in `nativeAttributes`), `onFocus` and `onBlur`. It now asks `getListProps` for `focus: { entry: 'first-selected-in-list-order-or-home', skipAfterPointerDown: true }`. The fix was autosquashed into `feat: Add OptionList component` (14601179f), the commit that introduces the file, so the branch still has exactly the 4 requested commits on top of the tip. Select and Multiselect are untouched by this branch.

Watch for: nothing blocking.

**Verdict**: APPROVED

## High-level view

The shared focus handler in `use-listbox.ts` (lines 209–247 at the branch tip) matches the removed OptionList code. A pointer-down that moves focus into the list sets a flag. The next focus reads and clears that flag and keeps the current highlight. Any other focus highlights `options.find(o => selectedSet.has(o))` with the keyboard (first selected option in list order), or falls back to `goHomeWithKeyboard()`. Blur clears the flag and calls `resetHighlightWithKeyboard()`. `onMouseDown` sets the flag to `listRef.current !== document.activeElement`. `selectedSet` is built from the same `selectedOptions` the old local code used (confirmed).

The DOM wiring changed. In the backup, `onMouseDown` reached the list through `nativeAttributes`, which `OptionsList` spreads onto the element. Now it travels as a named prop: `internal.tsx` passes `listProps` to `PlainList`, `PlainList` spreads them into `OptionsList`, and `OptionsList` sets `onMouseDown={onMouseDown}` on the same `Tag` element (line 133; that prop was added in Part 1). The handler still reaches the list DOM element (confirmed). `nativeAttributes` now contains only `aria-activedescendant`, so nothing in the spread competes with the named handler.

`onMouseLeave` and type-ahead in `getRootProps` match the backup byte for byte; the diff against the backup only touches the import, the destructure, the docstring and the `listProps` block. `selectedOptions` was dropped from the destructure because nothing uses it any more.

<details>
<summary>Issues (0)</summary>

No blocking or non-blocking issues.

</details>

<details>
<summary>Details</summary>

### History and scope checks

`git log --oneline 4c51035b1..feat/add-option-list-v2` shows exactly 150fbd159 refactor / 14601179f feat / f39f81b89 chore / 0e00ef95e test, with the required messages. `git log -- src/option-list/use-option-list.ts` lists only 14601179f, so the fold went into the introducing commit and created no extra commits. `git diff 4c51035b1 feat/add-option-list-v2 -- src/select src/multiselect` is empty (confirmed), which matches the user's request not to change Select or Multiselect. The full diff's file list has no `tsbuildinfo`, `.agents`, `package-lock.json`, review or log files. `pages/tsconfig.tsbuildinfo` is untracked only. No `origin/feat/add-option-list-v2` ref exists locally, which is consistent with the coder's statement that nothing was pushed. The backup branch `backup/feat-add-option-list-v2-0d4ac6cf5` exists and points at 0d4ac6cf5.

### Evidence

`part2-verification.md` records all the required checks:

- quick-build passes.
- `tsc` on the root config passes. `tsc` on `pages/tsconfig.json` shows only the 2 known `Intl.ListFormat` errors.
- The jest set, including `src/option-list`, passes: 83 suites and 1248 tests.
- Snapshot tests pass without `-u`, with no snapshots written.
- eslint passes on the changed files.
- quick-build and `tsc` pass on each of the 4 commits.
- The Select/Multiselect diff is empty.

The coder added no new OptionList tests. The pointer and keyboard focus paths are covered by the existing `highlight.test.tsx` and by the Part 1 shared-path tests.

</details>

<details>
<summary>File map</summary>

Relative to the backup 0d4ac6cf5, the only OptionList change is `src/option-list/use-option-list.ts`, which now uses the shared `useListbox` focus option and drops its local focus, blur, mousedown and ref code. The other 4 differing files come from Part 1 (#5239 tip). Full diff: `git diff 4c51035b1 feat/add-option-list-v2`.

</details>
