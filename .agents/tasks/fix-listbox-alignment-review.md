# Select and Multiselect listbox fixes ported onto the shared listbox refactor

The branch `fix/select-multiselect-listbox-alignment` holds 7 commits on top of `refactor/move-shared-listbox-parts`. Six of them port 47562b91f, 300341c11, 09ef01d7a, 0fa07c12e, 7726b0953 and 7bec02e80 to the post-refactor locations (`listbox/use-type-ahead.ts`, the merged `listbox/parts/item.tsx`, the moved `use-type-ahead.test.ts`). The seventh is a new fix that finds the current highlight by identity in the type-ahead's repeated-character cycle. Every ported commit has the same subject, body and line-level changes as its original. Only file paths and the `useNativeSearch`/`useInteractiveGroups` renames differ. The diff touches only the fixes' product lines and their tests, and the verification note records fail-before/pass-after evidence for all 7 commits.

Watch for: integration tests were not run (chromedriver missing), so the updated `multiselect.test.ts` integ expectations from 47562b91f are unverified on this stack (confirmed, non-blocking). The draft PR's "How has this been tested?" lists those integ updates without saying they weren't run.

**Verdict**: APPROVED

## High-level view

The type-ahead ports (67aad9e0b, 885d1c5c3) apply the original filter and `event.defaultPrevented` changes to `use-type-ahead.ts`. Their unit cases are in the moved `listbox/__tests__/use-type-ahead.test.ts` and use the renamed hook and prop. The Select and Multiselect `native-search.test.tsx` files are new, as they were in the originals. No file came back at the old `select/utils` or `select/parts` paths.

The renderOption ports (82b17f6b3, 5e0fbf1db) collapse two hunks each (old `item.tsx` and `multiselect-item.tsx`) into the merged item. For the parent-disabled fix, both `toSelectOptionItem` and `toMultiselectOptionItem` were changed. For the disabled-reason fix, the merged item has one `disabledReasonElement` that both the single and multi render branches use (lines 330 and 366), so one edit covers both originals.

The Home/End and arrow-wrap ports (219984fe8, 0bfc8592f) apply cleanly to unmoved files and match the originals hunk for hunk.

The identity fix (655a8219f) is correct. Multiselect passes the same `visibleOptions` array to `useSelect`, whose `useHighlightedOption` returns `options[highlightedIndex]`, and to `useTypeAhead`. `findMatchingOption` keeps the original entries because it uses `options.filter` with `filterOptions([option])` only as a predicate. The `isGroup` branch wasn't dropped. Its identity lookup became the first step for every highlight, and the value fallback still runs for non-group highlights. That keeps Select's closed-trigger case working, where `selectedOption` can be an equal copy, and a new unit case covers it.

<details>
<summary>Issues (2)</summary>

1. **Integ expectations unverified** — `src/multiselect/__integ__/multiselect.test.ts` changes were not run on this stack. Run the Multiselect integ suite before merge or let CI cover it.
2. **PR testing text overstates integ** — the draft "How has this been tested?" says integ expectations were updated but not that they weren't run locally. Say they weren't run, or run them.

</details>

<details>
<summary>Details</summary>

### Port fidelity at the new locations

Comparing the `+`/`-` lines of each original against its port shows identical content. The only differences are hunk order, from the rename-sorted file order, and the hook/prop renames inside the moved unit test. 300341c11 applied cleanly but its new unit case still called `useNativeSearch`. The coder amended the unpushed local commit to use `useTypeAhead`, and the branch shows the corrected call. The removed line in 0bfc8592f still reads `useInteractiveGroups`, which matches the base `use-select.ts` (the refactor didn't rename that local). `git diff --name-status` against the base lists 14 files, all from the originals' file sets after mapping. New test files (`select/native-search`, `multiselect/native-search`, both `home-end`, `arrow-key-wrap`) are added as new files. No `package-lock.json`, `pages/tsconfig.tsbuildinfo`, `.agents/`, `.kiro/` or `node_modules` entries are present. All 7 subjects use `fix: Subject`.

### Identity lookup in findMatchingOption

```ts
let active = matchingOptions.findIndex(({ option }) => option === currentHighlight);
if (active === -1 && !isGroup(currentHighlight)) {
  active = matchingOptions.map(({ option }) => option.value).indexOf(currentHighlight.value);
}
```

For a group highlight, the result is identical to the old `indexOf(currentHighlight)`. For an option highlight, the result differs from the old value lookup only when an earlier match shares the highlight's value. With interactive groups, that is the reported bug (group `Compute` and child `Cloud` both valued `shared`). Without interactive groups, it can only happen with duplicate option values, where identity picks the actual highlight. Select calls the hook without `interactiveGroups`, so groups never enter `matchingOptions`. When Select is closed, an equal-copy `selectedOption` misses on identity and takes the same value path as before. The commit subject says "Multiselect", which is accurate because the user-visible bug only occurs there.

### Evidence quality

The verification note reverse-applies each fix's product hunk at HEAD, rebuilds, and records the failing test names with excerpts. For the new fix, it records the tests failing first against commit 6 (`Expected: "Cache", Received: "Cloud"`). It also shows the value fallback is needed: removing it makes the equal-copy case fail and leaves the other 509 tests passing. Final counts are 78 suites / 1176 tests against a base of 73 / 1147. The +5 suites match the 5 new test files. Snapshots show 110 with no `-u` and no diff, and eslint and tsc are clean. The fix 1 excerpt in the note is garbled ("at `expect(highlightOption).toHaveBeenCalledTimes(1)` context"), but the test names carry the evidence. Integ was not run (confirmed). The only integ change is the 47562b91f expectation update, carried over unchanged.

### Report and PR draft

The report has every required section: branch, commit mapping, fail/pass evidence, conflicts and resolutions, test counts, snapshot status, integ status, shortstat (14 files, +572/−21, which matches `git diff --shortstat`), and the overlap list for `feat/add-option-list` (dabe649b1, e000abffd, e97a70c9d, d60d7e256, plus the 87323099f/fd429dfb6 counterparts). The draft follows the repo template, with a one-line description, 7 fix bullets, a "How has this been tested?" section and no stack-relation text.

</details>

<details>
<summary>File map</summary>

- `src/internal/components/listbox/use-type-ahead.ts`: per-option filter, `defaultPrevented` skip, identity-first highlight lookup.
- `src/internal/components/listbox/__tests__/use-type-ahead.test.ts`: group cases, handled-key case, shared-value and equal-copy cycle cases.
- `src/internal/components/listbox/parts/item.tsx`: group disabled as parent, disabled-reason description kept with custom content.
- `src/internal/components/options-list/utils/use-keyboard.ts` and its test: `preventNativeHomeEnd`.
- `src/select/utils/use-select.ts`: Home/End flag, wrap at first/last highlightable option.
- `src/multiselect/__integ__/multiselect.test.ts`: updated type-ahead expectations.
- `src/{select,multiselect}/__tests__/native-search.test.tsx`, `home-end.test.tsx`, `render-option.test.tsx`, `src/select/__tests__/arrow-key-wrap.test.tsx`: component regression tests.

Full diff: `git -C .worktrees/fix-listbox-alignment diff refactor/move-shared-listbox-parts..HEAD`.

</details>
