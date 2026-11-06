# OptionList (#5180) rebased onto #5239 (`refactor/use-listbox-in-select`)

## Result
- Worktree: `/Users/amanabiy/Documents/components/.worktrees/option-list-on-use-listbox`
- Branch: `feat/add-option-list-on-use-listbox`, HEAD `24173f991e5e4aa90eae71fd24145ad50020e78e`
- Base: `origin/refactor/use-listbox-in-select` = `318ee8036` (#5239)
- 32 commits on the base, the same 32 as `origin/feat/add-option-list` (`33cfa9917..240cf49ef`). No commit was dropped, squashed or emptied. Subjects, author and author dates are unchanged.
- Nothing pushed. Working tree clean. `feat/add-option-list` (`240cf49ef`) and the other worktrees were not touched.
- This is the first iteration (no review file existed).

## How it was resolved
The rebase ran with `rerere.enabled true`, driven by two helper scripts (`/tmp/rebase_loop.sh` and `/tmp/resolve_inline.py`). The scripts stopped at each conflict, applied the rules below, ran `tsc -p tsconfig.json --noEmit` at every conflict stop, and then ran `GIT_EDITOR=true git rebase --continue`.

- **`src/internal/components/listbox/use-listbox.ts`**: kept #5239's shared `useListbox` unchanged (`git checkout origin/refactor/use-listbox-in-select -- <file>`). The commit's OptionList hook (`git show <orig>:…/use-listbox.ts`) was written to the new file **`use-inline-listbox.ts`**, with these changes:
  - `useListbox` / `UseListboxProps` / `UseListboxApi` renamed to `useInlineListbox` / `UseInlineListboxProps` / `UseInlineListboxApi`.
  - The local `ListElementProps` / `GetOptionProps` declarations were removed. They are imported from `./interfaces` instead.
  - The `OptionsListProps` / `ItemProps` imports that became unused were removed.
- **Importers** (`listbox/index.tsx`, `option-list/internal.tsx`, `listbox/parts/list.tsx` while it existed): took the commit's version of the file, then rewrote the imports.
  - `index.tsx` imports `GetOptionProps, ListElementProps` from `./interfaces` and `UseInlineListboxApi` from `./use-inline-listbox`.
  - `internal.tsx` imports `useInlineListbox` from `…/use-inline-listbox`.
  - `list.tsx` imports its types from `../interfaces`.
  - The doc comments in `index.tsx` that named `useListbox` now name `useInlineListbox`.
- **`2c824c84d` (Use PlainList)**: this commit deletes `parts/list.tsx`, which gave a modify/delete conflict. It was resolved by deleting the file (`git rm`), as the commit does.
- **`options-list/utils/use-keyboard.ts`, `options-list/index.tsx`, `parts/plain-list.tsx`**: auto-merged with no conflict. #5180's additions are kept (optional `closeDropdown`, `statusType` default, `onMouseLeave`, `scrollStrategy`), and so is #5239's type move.
- **Commit messages**: the bodies of 4 commits named `use-listbox`/`useListbox` for OptionList. They were committed with the names changed to `use-inline-listbox`/`useInlineListbox`, keeping the original author and author date:
  - `872248ac5` Add OptionList component
  - `57da752f6` Clean up OptionList tests and dev pages
  - `3cd1c53dd` Use shared listbox helpers
  - `f06a65f61` Use shared keyboard navigation

Conflict stops (the original commit, then the files with conflicts):
| Commit | Conflicts |
|---|---|
| `872248ac5` feat: Add OptionList component | use-listbox.ts (add/add) |
| `26cddd87e` fix: Prevent native page scroll on Home and End | use-listbox.ts |
| `57da752f6` chore: Clean up OptionList tests and dev pages | use-listbox.ts, listbox/index.tsx, parts/list.tsx |
| `3ade7cdff`, `8bff9a970`, `10d9aa3a4`, `e8ebcf578`, `1ab18b49a` | use-listbox.ts |
| `2c824c84d` refactor: Use PlainList in OptionList | listbox/index.tsx, parts/list.tsx (modify/delete) |
| `3cd1c53dd`, `f06a65f61` | use-listbox.ts |

tsc (excluding errors from generated files that weren't built yet at that point) was clean at every stop.

The rebase was run three times. The scripts reset the branch each time with `git checkout -B feat/add-option-list-on-use-listbox origin/feat/add-option-list`, never `reset --hard`.
- **Attempt 1** (`157690f9e`): resurrected `parts/list.tsx` at the modify/delete conflict. It also reset the author dates of the 4 reworded commits.
- **Attempt 2** (`24c2bbc18`): `index.tsx` imported `./interfaces` after `./parts/plain-list`, which fails ESLint `simple-import-sort`.
- **Attempt 3** is the final branch. It differs from attempt 2 only in that import order.

Per-commit invariants were checked on the final history for all 32 commits:
- The subject, author and author date match the original commit.
- `use-listbox.ts` equals #5239's file in every commit.
- `use-inline-listbox.ts` equals the scripted transform of the original commit's `use-listbox.ts`.
- `git diff <orig> <new>` contains only the expected parts: the import changes, and the files and directories that #5239 adds or changes. In detail, it covers 3 files (2 after `2c824c84d`): `index.tsx`, `internal.tsx` and `list.tsx`, with 8 insertions and 7 deletions. It excludes #5239's `use-listbox.ts` and its test, `interfaces.ts`, `select/`, `multiselect/` and `plain-list.tsx`.
- The import order in `index.tsx` is sorted in every commit.

## Equivalence diffs (final HEAD)
- `git diff origin/refactor/use-listbox-in-select HEAD -- src/select src/multiselect`: **empty**. `git diff 33cfa9917 origin/feat/add-option-list -- src/select src/multiselect` is also **empty**.
- `git diff origin/refactor/use-listbox-in-select HEAD -- src/internal/components/listbox/use-listbox.ts`: **empty**.
- `git diff origin/feat/add-option-list HEAD -- src/option-list pages/option-list src/test-utils`: only the import in `internal.tsx`:
  ```diff
  -import { useListbox } from '../internal/components/listbox/use-listbox';
  +import { useInlineListbox } from '../internal/components/listbox/use-inline-listbox';
  ...
  -    const controller = useListbox({
  +    const controller = useInlineListbox({
  ```
- `listbox/index.tsx` vs `240cf49ef`:
  ```diff
   import { DropdownOption } from '../option/interfaces';
  +import { GetOptionProps, ListElementProps } from './interfaces';
   import { ItemProps } from './parts/item';
   import PlainList, { SelectListProps } from './parts/plain-list';
  -import { GetOptionProps, ListElementProps, UseListboxApi } from './use-listbox';
  +import { UseInlineListboxApi } from './use-inline-listbox';
  -  /** The controller returned by `useListbox`. */
  -  controller: UseListboxApi;
  +  /** The controller returned by `useInlineListbox`. */
  +  controller: UseInlineListboxApi;
  - * Renders the list for a `useListbox` controller and scrolls the highlighted option into view.
  + * Renders the list for a `useInlineListbox` controller and scrolls the highlighted option into view.
  ```
- `use-inline-listbox.ts` vs `git show origin/feat/add-option-list:src/internal/components/listbox/use-listbox.ts`:
  ```diff
  -import { OptionsListProps } from '../options-list';
  -import { ItemProps } from './parts/item';
  +import { GetOptionProps, ListElementProps } from './interfaces';
  -export type ListElementProps = Omit<OptionsListProps, 'children'> & { ref: React.RefObject<HTMLDivElement> };
  -export type GetOptionProps = (option: DropdownOption, index: number) => ItemProps;
  -
  -export interface UseListboxProps {
  +export interface UseInlineListboxProps {
  -export interface UseListboxApi {
  +export interface UseInlineListboxApi {
  -export function useListbox({
  +export function useInlineListbox({
  -}: UseListboxProps): UseListboxApi {
  +}: UseInlineListboxProps): UseInlineListboxApi {
  ```
- Everything else: the added and removed lines of `git diff 33cfa9917 origin/feat/add-option-list` and `git diff origin/refactor/use-listbox-in-select HEAD` are **identical** (2851 lines each). This excludes `use-listbox.ts`, `use-inline-listbox.ts`, `listbox/index.tsx` and `option-list/internal.tsx`. It confirms that the `use-keyboard.ts`, `options-list/index.tsx`, `plain-list.tsx`, pages, snapshots, i18n, ESLint config and test-utils changes applied unchanged.

## Commands run (Node 22 via `mise exec node@22.23.2 --`, cwd = worktree)
| Check | Result |
|---|---|
| `npm run quick-build` | pass (no ENOTEMPTY) |
| `TZ=UTC npx jest -c jest.unit.config.js src/option-list src/select src/multiselect src/autosuggest src/property-filter src/internal/components/listbox src/internal/components/options-list src/internal/components/selectable-item` | **83/83 suites, 1241/1241 tests** pass |
| `TZ=UTC npx jest -c jest.unit.config.js src/option-list` (rebased) | **8 suites, 67 tests** pass |
| Same on baseline `origin/feat/add-option-list` (temporary worktree `.worktrees/tmp-option-list-baseline`, quick-build + jest, then removed with `worktree remove --force`) | **8 suites, 67 tests** pass. Same count as the rebased branch. |
| `npx eslint` on the 32 changed .ts/.tsx/.js/.mjs files vs `origin/refactor/use-listbox-in-select` | clean |
| `npx tsc -p tsconfig.json --noEmit` | clean |
| `npx tsc -p pages/tsconfig.json --noEmit` | only the 2 known `@formatjs/ecma402-abstract` `Intl.ListFormat` errors |
| `npm run build` | pass |
| `TZ=UTC npx jest -c jest.unit.config.js src/__tests__/snapshot-tests` (no `-u`) | 4/4 suites, 113/113 tests, 111/111 snapshots pass. No snapshot changes. |
| `git status` | clean. The build left an untracked `pages/tsconfig.tsbuildinfo`, which was deleted. `package-lock.json` was unchanged. |

No integration tests were run (CI runs them).

## Commands for you (not run)
`git branch -f feat/add-option-list …` is not possible while `feat/add-option-list` is checked out in `.worktrees/option-list-rebase`. Instead:
```bash
git -C /Users/amanabiy/Documents/components/.worktrees/option-list-rebase reset --keep feat/add-option-list-on-use-listbox
git push --force-with-lease=feat/add-option-list:240cf49ef origin feat/add-option-list
```
`reset --keep` refuses to run if the `option-list-rebase` worktree has local changes in affected files. The dev server on port 8080 runs from that worktree and will pick up the new files.

## Follow-up: #5208
#5208 (`fix/select-multiselect-listbox-alignment`) is built on an older #5180 (`f06a65f61`), so it needs a rebase onto the new `feat/add-option-list` afterwards. It would replay these commits (`git log --oneline f06a65f61..origin/fix/select-multiselect-listbox-alignment`):
```
f4e7628ca chore: add settings to make it easier to test
6168f55d3 fix: Drop removed highlightedOption argument in OptionList navigation
775731d72 chore: Trigger redeploy
617320f64 fix: Find the highlighted option by identity in Multiselect type-ahead
cb3b57c95 fix: Wrap Select arrow keys at the first and last highlightable options
0dd5f74e5 fix: Prevent page scroll on Home and End in Select and Multiselect
e2c35fd51 fix: Keep disabled reason description with custom renderOption content
c89d20932 fix: Pass the group disabled state as parent in renderOption
9a6e3cebc fix: Ignore handled keys in Select and Multiselect type-ahead
bffe2b511 fix: Ignore non-matching group headers in Multiselect type-ahead
```
`6168f55d3` touches OptionList's hook, so it will need the same `use-listbox.ts` → `use-inline-listbox.ts` remapping. The Select/Multiselect fixes will likely conflict with #5239's `useListbox`/`useSelect` move.
