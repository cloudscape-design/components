# Verification: refactor/move-shared-listbox-parts (iteration 1)

Worktree: `.worktrees/refactor-move-listbox-parts`, base origin/main 544e4286a. No review file existed, so this is the first implementation.

## Commits (local, not pushed)
1. `23eae758a refactor: Move Select type-ahead hook to listbox`: renames `select/utils/use-native-search.ts` to `listbox/use-type-ahead.ts` and moves its test to `listbox/__tests__/use-type-ahead.test.ts`. `useNativeSearch` becomes `useTypeAhead` and the `useInteractiveGroups` option becomes `interactiveGroups`. 4 files, +24/-29.
2. `586bfedd2 refactor: Share one option item between Select and Multiselect`: merges `select/parts/item.tsx` and `multiselect-item.tsx` into `listbox/parts/item.tsx`, chosen by `selectionType`. Removes the `checkboxes`, `useInteractiveGroups` and `hasCheckbox` plumbing from render-options, get-item-props (and its test), PlainList and VirtualList. Updates the dev pages. 13 files, +395/-486.
3. `ccd5025fe refactor: Move PlainList to listbox`: renames `select/parts/plain-list.tsx` to `listbox/parts/plain-list.tsx` and updates the importers. 7 files, +17/-17.

`git -P diff --shortstat origin/main...HEAD`: 17 files changed, 435 insertions(+), 531 deletions(-). That is 966 lines with default rename detection. With `-M30%`, which also pairs item.tsx as a rename: 16 files, +270/-366.

## Commands and results
- `npm run build`: passes (run after commit 2 and again at the final state).
- `npm run quick-build`: passes after each commit.
- `TZ=UTC npx jest -c jest.unit.config.js src/select src/multiselect src/autosuggest src/internal/components/listbox src/internal/components/options-list src/internal/components/selectable-item src/test-utils`: 56/56 suites and 801/801 tests pass after each of the three commits. This matches the baseline exactly. The renamed `use-type-ahead.test.ts` keeps the same test count.
- `TZ=UTC npx jest -c jest.unit.config.js src/__tests__/snapshot-tests` (no `-u`): 4/4 suites, 112/112 tests and 110/110 snapshots pass. This matches the baseline, with no snapshot diff, so the test-utils selectors and documenter output are unchanged. Running it after only quick-build failed because `lib/components-definitions` was missing. The full build fixed that.
- `npx eslint` on every added, modified or renamed file vs origin/main: clean.
- `npx tsc -p tsconfig.json --noEmit`: clean.
- `npx tsc -p pages/tsconfig.json --noEmit`: the only errors are 2 in `../../node_modules/@formatjs/ecma402-abstract/utils.d.ts` (`Intl.ListFormat`). They come from the main checkout's shared node_modules overlay, not from changed files. The dev-page edits type-check.
- `git grep` for `select/parts/(item|multiselect-item|plain-list)` and `use-native-search|useNativeSearch` outside lib: no matches.
- Ran `git checkout -- pages/tsconfig.tsbuildinfo package-lock.json` afterwards. No stray tracked changes.

## Behavior notes
- In the product, Select only ever produced single rows without checkboxes, and Multiselect (internal and embedded) only ever produced multi rows with checkboxes. The merged item reproduces both. Each branch keeps today's JSX, hook order, `virtualIndex`, renderOption item shapes (including the child `parent` with the child's `disabled`), select-all, `afterHeader`, the disabledReason tooltip and its placement, and the `show-label-tag` class.
- Dev pages only: on `item.permutations` the former single-with-checkbox permutations now render as multi rows. The visual result should be identical. The DOM gains `aria-checked`, the `interactiveGroups` class (which only changes the cursor), and loses `show-label-tag` (which only affects the check icon, and that icon is not rendered here). `list-with-sticky-item` now shows checkboxes, because multi rows always render one. That page has no ScreenshotArea and no integ test.
- Not included: PR #5179 follow-ups and the fix branches. Not moved: use-select, use-multiselect logic, virtual-list.
