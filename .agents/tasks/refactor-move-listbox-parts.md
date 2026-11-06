# Report: refactor: Move shared option list parts to listbox

Suggested PR title: `refactor: Move shared option list parts to listbox`

- Branch: `refactor/move-shared-listbox-parts` (local only, not pushed, not merged)
- Worktree: `/Users/amanabiy/Documents/components/.worktrees/refactor-move-listbox-parts`
- Base: `origin/main` 544e4286a (#5198). The branch does not depend on `origin/refactor/add-listbox-selection-models`; `SelectionType` comes from `listbox/selection/interfaces.ts`, which is on main from #5179 (5a5372a42).
- Review verdict: APPROVED, with three non-blocking notes (see "PR description notes").
- Working tree: clean apart from an untracked `pages/tsconfig.tsbuildinfo` (build output, not committed).

## Commits (oldest first)

| Commit | Subject | Files | Lines |
|---|---|---|---|
| 23eae758a | refactor: Move Select type-ahead hook to listbox | 4 | +24 / -29 |
| 586bfedd2 | refactor: Share one option item between Select and Multiselect | 13 | +395 / -486 |
| ccd5025fe | refactor: Move PlainList to listbox | 7 | +17 / -17 |

1. **Type-ahead.** `useNativeSearch` moves to `listbox/use-type-ahead.ts` as `useTypeAhead`. Its option `useInteractiveGroups` is renamed `interactiveGroups`. Logic and comments are unchanged.
2. **Item.** `select/parts/item.tsx` and `select/parts/multiselect-item.tsx` merge into `listbox/parts/item.tsx`. `selectionType: 'single'` renders today's Select row and `'multi'` renders today's Multiselect row (checkbox, interactive groups, select-all, `afterHeader`). Each branch is a copy of the old JSX. `render-options` passes `selectionType` instead of choosing a component. The `checkboxes`/`hasCheckbox` plumbing is removed, because Select never rendered checkboxes and Multiselect always did.
3. **PlainList.** `select/parts/plain-list.tsx` (PlainList and `SelectListProps`) moves to `listbox/parts/plain-list.tsx`. Only import paths change.

All moved files still import `select/parts/styles.css.js`, so class names and test-utils selectors are unchanged.

## Files

From `git diff -M --name-status origin/main...HEAD`:

Moved (renames detected at default similarity):
- `src/select/utils/use-native-search.ts` → `src/internal/components/listbox/use-type-ahead.ts` (R076)
- `src/select/__tests__/use-native-search.test.ts` → `src/internal/components/listbox/__tests__/use-type-ahead.test.ts` (R080)
- `src/select/parts/plain-list.tsx` → `src/internal/components/listbox/parts/plain-list.tsx` (R078)

Merged:
- `src/select/parts/item.tsx` + `src/select/parts/multiselect-item.tsx` → `src/internal/components/listbox/parts/item.tsx` (added, 371 lines). Git shows the new file as an add plus two deletes at default similarity. It pairs with `select/parts/item.tsx` only at `-M30%`.

Deleted:
- `src/select/parts/item.tsx`
- `src/select/parts/multiselect-item.tsx`

Modified:
- `src/internal/components/listbox/parts/render-options.tsx`: `selectionType` replaces `checkboxes`/`useInteractiveGroups`; always renders `Item`.
- `src/internal/components/listbox/parts/get-item-props.ts` and `__tests__/get-item-props.test.ts`: `checkboxes` input and `hasCheckbox` output removed.
- `src/select/parts/virtual-list.tsx`: `selectionType` prop, new `SelectListProps` import path.
- `src/select/internal.tsx`, `src/select/utils/use-select.ts`: import paths, `useTypeAhead`.
- `src/multiselect/internal.tsx`, `src/multiselect/embedded.tsx`: `selectionType="multi"` replaces `checkboxes={true} useInteractiveGroups={true}`.
- `src/multiselect/use-multiselect.tsx`: import paths, `interactiveGroups` key.
- `pages/select/item.permutations.page.tsx`, `pages/dropdown/list-with-sticky-item.page.tsx`: new import paths, `hasCheckbox` mapped to `selectionType`.

## Line counts

- `git diff --shortstat origin/main...HEAD`: **17 files changed, 435 insertions(+), 531 deletions(-)** (966 lines).
- With `-M30%` (item.tsx paired as a rename): 16 files, +270 / -366 (636 lines).

The plan estimated about 700 lines. GitHub uses default rename detection, so the PR will likely show the 966-line figure.

## Tests

| Run | Baseline (origin/main) | After (each of the 3 commits) |
|---|---|---|
| Unit: select, multiselect, autosuggest, listbox, options-list, selectable-item, test-utils | 56/56 suites, 801/801 tests | 56/56 suites, 801/801 tests |
| Snapshot tests (`src/__tests__/snapshot-tests`) | 4/4 suites, 112/112 tests, 110/110 snapshots | 4/4 suites, 112/112 tests, 110/110 snapshots |

The renamed `use-type-ahead.test.ts` keeps the same test count. No pre-existing failures.

## Snapshot status

Unchanged. The snapshot suite ran without `-u` and passed, and no `.snap` file is in the diff. Test-utils selectors and documenter output are identical to main. (The snapshot suite needs `npm run build`; after only `quick-build` it fails because `lib/components-definitions` is missing.)

## Lint and type checks

- `npm run build`: passes.
- `npm run quick-build`: passes after each commit.
- `npx eslint` on every added, modified or renamed file: clean.
- `npx tsc -p tsconfig.json --noEmit`: clean.
- `npx tsc -p pages/tsconfig.json --noEmit`: only 2 errors, both in `node_modules/@formatjs/ecma402-abstract/utils.d.ts` (`Intl.ListFormat`). They come from the main checkout's shared node_modules overlay, not from this change. The dev-page edits type-check.
- Grep of `src` and `pages`: no remaining references to `hasCheckbox`, `checkboxes=`, `useNativeSearch`, or the old `select/parts/{item,multiselect-item,plain-list}` paths.

Not run: Select/Multiselect integ suites (need a dev server). CI will run them.

## Left out, and why

- **Fixes from the OptionList branch** (`parentProps.disabled` for group parents, dropped `virtualIndex`, select-all excluded from checkbox `indeterminate`, disabled-reason description kept with custom content, type-ahead group-header filtering and `defaultPrevented` check). Each one changes Select/Multiselect behavior. This PR is a pure refactor.
- **`virtual-list.tsx`**: stays in `select/parts` (only imports and the prop name change). Not requested.
- **`use-select.ts`, `use-multiselect.tsx` logic, `use-load-items.ts`, `filter.tsx`, `trigger.tsx`**: not option-list row/list parts.
- **`select/parts/styles.scss`**: stays in place, so class names and test-utils selectors do not change. Moving it would change generated class names and snapshots.
- **`useInteractiveGroups` on `useSelect`**: logic, out of scope. **`isMultiSelect` on `SelectListProps`**: feeds `OptionsList`, unrelated to the row.
- **`src/autosuggest/plain-list.tsx`**: a different PlainList used by Autosuggest and PromptInput. Not touched.
- **PR #5179 follow-ups**: not needed. The branch builds on main as is.

## PR description notes (from review)

1. `pages/dropdown/list-with-sticky-item.page.tsx` now shows checkboxes. It passed `useInteractiveGroups` without `checkboxes`, a combination the product never uses. Multi is still the right mapping because only the multi row supports `afterHeader`, which the page uses. The page has no ScreenshotArea and no integ test.
2. On `pages/select/item.permutations.page.tsx` (a screenshot page), the former single-with-checkbox permutations now render as multi rows. They should look the same: same checkbox, no check icon. The DOM gains `aria-checked` and the interactive-groups class (cursor only on non-parents). If visual regression flags this page, this mapping is the cause.
3. Ask reviewers to compare each branch of the new `listbox/parts/item.tsx` with its old file (`git show origin/main:src/select/parts/item.tsx` and `.../multiselect-item.tsx`), since the diff shows it as a full add.

## Rebasing the OptionList branch onto this later

OptionList branch: `feat/add-option-list` in `/Users/amanabiy/Documents/components/.worktrees/pr3-option-list` (read only, not modified). It is 29 commits ahead of its merge-base 6997ceb24, which is older than origin/main. `git diff --shortstat origin/main...HEAD` there: 68 files, +4956 / -101.

### Commits that become empty

The first five commits (`f65039fdd`..`f7dd0f99c`, the `origin/refactor/add-listbox-selection-models` stack) already landed on main as #5179. Their files are byte-identical to origin/main: `listbox/selection/{interfaces,single-selection,multi-selection}.ts` and their tests, `select/utils/use-select.ts`, `select/internal.tsx`, `multiselect/use-multiselect.tsx`, `select/__tests__/group-state.test.tsx`, `multiselect/__tests__/{group-state,selection-order}.test.tsx`. Rebase only the commits after them, for example:

```
git rebase --onto refactor/move-shared-listbox-parts f7dd0f99c feat/add-option-list
```

`96a51148f chore: add settings to make it easier to test` (origin/dev-v3-amanabiy) sits in the middle of the stack. Check whether it belongs in the OptionList PR before rebasing.

### Add/add conflicts (both branches create the file)

| File | OptionList version | Refactor version | Resolution |
|---|---|---|---|
| `listbox/use-type-ahead.ts` | A copy of `use-native-search.ts` (Select still uses the old file) plus two fixes: per-option filtering so non-matching group headers are skipped (`dabe649b1`), and an `event.defaultPrevented` check (`e000abffd`). | The moved file, no fixes. | Keep the refactor file. The two fixes now also change Select and Multiselect type-ahead, so ship them as `fix:` commits with Select/Multiselect tests, or add an OptionList-only option. |
| `listbox/__tests__/use-type-ahead.test.ts` | Same tests plus a `with groups` describe block (57 lines). | The moved test. | Keep the refactor file and append the `with groups` block. |
| `listbox/parts/item.tsx` | A separate single/multi item written for OptionList: own `listbox/parts/styles.scss`, `hideTopDivider`, no `virtualIndex`, no `isSelectAll`/`afterHeader`, `parentProps.disabled` for group parents, description kept with custom content. | The merged Select/Multiselect item, styles from `select/parts/styles.css.js`. | Use the refactor item for OptionList and port what OptionList needs: add `hideTopDivider` as a prop passed through to SelectableItem. Bring in the behavior fixes (`e97a70c9d` group parent `disabled`, `d60d7e256` description with custom content) as `fix:` commits, since they now reach Select and Multiselect too. Do not drop `virtualIndex` or select-all from `indeterminate`; Select and Multiselect need them. |

### Content conflicts

- `listbox/parts/render-options.tsx`: OptionList chooses `selectionType ? ListboxItem : useInteractiveGroups ? MultiselectItem : Item` and imports `select/parts/item` and `select/parts/multiselect-item`, which no longer exist. The refactor version always renders `Item` with `selectionType` (default `'single'`). Keep the refactor version. The three-way choice and the `checkboxes`/`useInteractiveGroups` props become redundant. OptionList's `List` already passes `selectionType`, so it keeps working. If `hideTopDivider` is added, pass it through here.

### Files that become redundant

- `src/internal/components/listbox/parts/styles.scss` (OptionList): it duplicates the item rules in `select/parts/styles.scss` (`.item`, `.checkbox`, `.selected-icon`, `.show-label-tag`, `.disabled-reason-tooltip`). Once OptionList uses the shared item, it can be deleted. OptionList test-utils (`src/test-utils/dom/option-list/index.ts`) import from `option-list/test-classes` and `selectable-item`, not from this file, so deleting it does not break them. Re-check `disabled-reason-tooltip` lookups in OptionList tests.
- The OptionList copy of `use-type-ahead.ts` and its test (replaced by the moved files, see above).
- The ListItem selection logic in `render-options.tsx` (see above).

### Files that stay, with overlap to review

- `listbox/parts/list.tsx` (OptionList `List`): no conflict. It imports `ItemProps` from `./item`, which still exists. It overlaps with the moved `listbox/parts/plain-list.tsx`, but differs: no sticky first option or `listBottom`, and it scrolls through all ancestors with `scrollOptionIntoView`. It can stay separate, or `List` can be built on PlainList in a later change.
- `listbox/parts/scroll-to-index.ts` (adds `scrollOptionIntoView`), `options-list/index.tsx`, `options-list/utils/use-keyboard.ts`, `selectable-item/{index.tsx,interfaces.ts,styles.scss}` (`hideTopDivider`): the refactor branch does not touch them, so they should apply cleanly.
- `listbox/index.tsx`, `listbox/use-listbox.ts`: new, no conflict. `use-listbox.ts` imports `useTypeAhead` from `./use-type-ahead` with the `interactiveGroups` option, which matches the refactor's name.
- `src/option-list/**`, `pages/option-list/**`, test-utils, i18n files and snapshots: no overlap with this branch. Snapshots need regenerating after the rebase as they would on any new main.
