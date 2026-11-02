# fix-listbox-alignment verification

Worktree: `/Users/amanabiy/Documents/components/.worktrees/fix-listbox-alignment`, branch `fix/select-multiselect-listbox-alignment`, base `refactor/move-shared-listbox-parts` (ccd5025fe).

## Environment note
The default `node` (18.20.2, mise) fails `npm run build` with `ERR_REQUIRE_ESM` (`@material/material-color-utilities` is ESM, required from `@cloudscape-design/theming-build`). Every npm/npx command below was run with Node 22 via `mise exec node@22.23.2 -- <cmd>`. Builds then succeeded on the first try (no ENOTEMPTY retry needed).

## Base (before any commit, at ccd5025fe)
- `npm run build`: pass.
- `TZ=UTC npx jest -c jest.unit.config.js src/select src/multiselect src/autosuggest src/property-filter src/internal/components/listbox src/internal/components/options-list src/internal/components/selectable-item src/test-utils`: **73 suites, 1147 tests, all pass**.
- Same set without `src/property-filter`: **56 suites, 801 tests** (matches the reference).
- `TZ=UTC npx jest -c jest.unit.config.js src/__tests__/snapshot-tests`: 4 suites, 112 tests, 110 snapshots pass.

## Per-commit build/test
After each commit: `npm run quick-build` plus the relevant unit tests, all passing:
- 67aad9e0b: listbox + select/multiselect native-search: 9 suites, 72 tests.
- 885d1c5c3: same set: 9 suites, 76 tests.
- 82b17f6b3: select + multiselect render-option: 2 suites, 22 tests.
- 5e0fbf1db: same: 2 suites, 24 tests.
- 219984fe8: checked by restoring commit 5's `src/select/utils/use-select.ts` at HEAD (the only product file commit 6 changes), quick-build, `src/select src/multiselect src/internal/components/options-list --testPathIgnorePatterns arrow-key-wrap`: 37 suites, 468 tests pass. Restored afterwards.
- 0bfc8592f: `src/select src/multiselect src/internal/components/options-list`: 38 suites, 470 tests.
- 655a8219f: `src/select src/multiselect src/internal/components/listbox`: 40 suites, 509 tests.

## Fail-before / pass-after
Method for fixes 1-6: at HEAD, `git show <sha> -- <product files> | git apply -R`, `npm run quick-build`, run the commit's tests, then `git checkout HEAD -- <product files>`. Tree clean afterwards (`git status --short` empty). All listed tests pass at HEAD (final run below).

1. 67aad9e0b (product: `use-type-ahead.ts`). 7 fail without the fix, 12 pass:
   - use-type-ahead: "with interactive groups, highlights the matching child rather than its non-matching group", "with interactive groups, does not cycle into children of a matching group when their own labels do not match", "without interactive groups, does not highlight children of a group whose label matches"
   - Select native search: "typing a group label prefix does not select an option inside that group"
   - Multiselect native search: "highlights the matching option inside a group rather than the group", "Enter after typing selects only the matching option inside a group", "repeating a character does not cycle into group children that do not match"
   - Excerpt: `expect(jest.fn()).toHaveBeenCalledWith(...expected)` at `expect(highlightOption).toHaveBeenCalledTimes(1)` context.
2. 885d1c5c3 (product: `use-type-ahead.ts`). 4 fail, 15 pass:
   - use-type-ahead: "ignores keys that were already handled by another handler"
   - Select native search: "typing right after opening the dropdown with Space highlights the matching option", "typing right after selecting with Space selects the matching option"
   - Multiselect native search: "typing right after selecting with Space moves the highlight to the matching option"
   - Excerpt: `Expected: {"option": {"label": "option 1", "value": "option1"}}` (not called).
3. 82b17f6b3 (product: `listbox/parts/item.tsx`). 2 fail, 22 pass:
   - Select and Multiselect render-option: "parent reflects the disabled state of the group, not of the option"
   - Excerpt: `expect(parentOf('c1').disabled).toBe(false)` → `Expected: false, Received: true`.
4. 5e0fbf1db (product: `listbox/parts/item.tsx`). 2 fail, 22 pass:
   - Select and Multiselect render-option: "keeps the disabled reason description for screen readers with custom content"
   - Excerpt: `expect(document.getElementById(describedBy!)).toHaveTextContent(...)` → `Received has value: null`.
5. 219984fe8 (product: `options-list/utils/use-keyboard.ts`, `select/utils/use-select.ts`). 3 fail, 13 pass:
   - use-keyboard: "prevents the native Home and End action when preventNativeHomeEnd is enabled"
   - Select and Multiselect home-end: "without filtering, moves the highlight and prevents the native page scroll"
   - Excerpt: `expect(goHome).toHaveBeenCalled()` → `Received number of calls: 0`.
6. 0bfc8592f (product: `select/utils/use-select.ts`). 2 fail, 1 pass:
   - Select arrow-key-wrap: "ArrowDown on the last option wraps to the first when the list ends with an empty group", "ArrowUp on the first option wraps to the last when the list starts with an empty group"
   - Excerpt: `Expected: "Apple", Received: "Banana"`.
7. 655a8219f (new fix). Tests written first, run against the unchanged hook (lib built at commit 6):
   - `TZ=UTC npx jest -c jest.unit.config.js src/multiselect/__tests__/native-search src/internal/components/listbox/__tests__/use-type-ahead` → 2 failed, 13 passed:
     - "useTypeAhead › with groups › with interactive groups, cycles from the highlighted option when its group has the same value": `Expected: {"option": {"label": "Cache", ...}}`, received last call `{"label": "Cloud", "value": "shared"}`.
     - "Multiselect native search › repeating a character cycles to the next match when a group and its option share a value": `Expected: "Cache"`, `Received: "Cloud"`.
   - After the fix + quick-build: both pass; `src/select src/multiselect src/internal/components/listbox` 40 suites / 509 tests pass.
   - The fix keeps a value fallback for a highlight that isn't one of the given objects. Select passes its `selectedOption` prop as the highlight while closed, and that can be an equal copy. No existing test covered this: with the fallback removed, all 509 tests still passed. So I added the unit case "cycles from a highlighted option that is an equal copy rather than the same object". It fails with the fallback removed (`1 failed, 9 passed`) and passes with it (`10 passed`).
   - Identity evidence: `useHighlightedOption` (options-list/utils/use-highlight-option.ts:46-47) returns `options[highlightedIndex]`; `useSelect` calls it with its `options` (use-select.ts:99); Multiselect passes the same `visibleOptions` array to both `useSelect` and `useTypeAhead` (use-multiselect.tsx:157, 176) and passes `highlightedOption?.option`; `findMatchingOption` uses `options.filter(...)`, with `filterOptions([option], ...)` only as a predicate, so matched entries are the original objects. The change only differs from the old lookup when an earlier match has the same value as the highlight (the bug), or when there are duplicate values (identity picks the actual highlight). For groups the old code already used identity, and the new code gives the same result.

## Final (HEAD 655a8219f, after `npm run build`)
- Jest set with property-filter: **78 suites, 1176 tests, all pass** (base 73 / 1147; +5 suites, +29 tests).
- Without property-filter: **61 suites, 830 tests** (base 56 / 801).
- New suites: select/native-search, multiselect/native-search, select/home-end, multiselect/home-end, select/arrow-key-wrap.
- Snapshots (`TZ=UTC npx jest -c jest.unit.config.js src/__tests__/snapshot-tests`, no `-u`): 4 suites, 112 tests, 110 snapshots pass. No diff, same as base.
- `npx eslint` on the 14 changed files: clean.
- `npx tsc -p tsconfig.json --noEmit`: clean.
- Integration tests: not run. `/tmp/listbox-04-chromedriver` does not exist. Commit 1 updates `src/multiselect/__integ__/multiselect.test.ts` expectations (unchanged from 47562b91f).
- Cleanup: `git checkout -- pages/tsconfig.tsbuildinfo package-lock.json`; `git status --short` empty.
- No stale files: `src/select/utils/use-native-search.ts`, `src/select/__tests__/use-native-search.test.ts`, `src/select/parts/item.tsx`, `src/select/parts/multiselect-item.tsx`, `src/select/parts/plain-list.tsx` do not exist.
