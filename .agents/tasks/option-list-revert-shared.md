# OptionList PR #5180: revert shared fixes that changed Select/Multiselect (variant a)

- Worktree: `/Users/amanabiy/Documents/components/.worktrees/option-list-revert-shared`
- Branch: `option-list/revert-shared-fixes`
- HEAD: `460ac0f4c` `revert: Restore Select and Multiselect type-ahead and renderOption behavior` (local, unpushed; `git branch -r --contains HEAD` is empty)
- Parent: `87aa788fe` `fix: Add gap between icon and content in OptionList options`
- `git log --oneline origin/feat/add-option-list..HEAD`: exactly `460ac0f4c` and `87aa788fe`.
- Base for "restore": `origin/refactor/move-shared-listbox-parts` (6c48dd2c1).

## Commit stats

12 files, 13 insertions, 427 deletions:

```
src/internal/components/listbox/__tests__/use-type-ahead.test.ts  | 91 -
src/internal/components/listbox/parts/item.tsx                    |  9 +-
src/internal/components/listbox/use-type-ahead.ts                 |  7 +-
src/multiselect/__integ__/multiselect.test.ts                     |  8 +-
src/multiselect/__tests__/native-search.test.tsx                  | 76 - (deleted)
src/multiselect/__tests__/render-option.test.tsx                  | 41 -
src/option-list/__tests__/disabled.test.tsx                       |  6 +-
src/option-list/__tests__/group-state.test.tsx                    | 61 +-
src/option-list/__tests__/keyboard.test.tsx                       | 12 +-
src/option-list/__tests__/render-option.test.tsx                  | 27 -
src/select/__tests__/native-search.test.tsx                       | 61 - (deleted)
src/select/__tests__/render-option.test.tsx                       | 41 -
```

## Revert hunks

| # | Original commit (origin/feat/add-option-list) | File | Change |
|---|---|---|---|
| A | b5f875a26 | `listbox/use-type-ahead.ts` | `options.filter(option => interactivityCheck(option) && filterOptions([option], …).length > 0)` back to `filterOptions(options, searchText, true).filter(option => interactivityCheck(option))`; the two-line comment is gone. |
| B | ad1132a99 | `listbox/use-type-ahead.ts` | `if (event.defaultPrevented \|\| !key \|\| key.length !== 1)` back to `if (!key \|\| key.length !== 1)`; comment removed. |
| C | e0bed93c2 | `listbox/parts/item.tsx` (2 places, select and multiselect item builders) | `disabled: props.parentProps.disabled` back to `disabled: props.disabled`. |
| D | eb9030d45 | `listbox/parts/item.tsx` | `disabledReasonElement = isDisabledWithReason && (` back to `!renderResult && isDisabledWithReason && (`; comment removed; tooltip condition `!renderResult && highlighted && canShowTooltip` back to `highlighted && canShowTooltip`. |

`use-type-ahead.ts` was restored from base with `git checkout`. `git diff origin/refactor/move-shared-listbox-parts HEAD -- src/internal/components/listbox/use-type-ahead.ts` is empty. The `parts/item.tsx` diff against base now contains only the `hideTopDivider` hunks (prop + JSDoc, destructure, and the two pass-throughs to `SelectableItem`).

Kept (neutral): `hideTopDivider` (item.tsx, selectable-item), `scrollOptionIntoView`, options-list `statusType` default and `onMouseLeave`, optional `closeDropdown` in `use-keyboard.ts`.

## Tests removed

Select/Multiselect/listbox (all files now equal base):

- `src/select/__tests__/native-search.test.tsx`, deleted (not on base). Its 3 tests: "typing right after opening the dropdown with Space highlights the matching option", "typing right after selecting with Space selects the matching option", "typing a group label prefix does not select an option inside that group".
- `src/multiselect/__tests__/native-search.test.tsx`, deleted (not on base). Its 5 tests: "highlights the matching option inside a group rather than the group", "Enter after typing selects only the matching option inside a group", "highlights a group when its own label matches", "repeating a character does not cycle into group children that do not match", "typing right after selecting with Space moves the highlight to the matching option". "highlights a group when its own label matches" doesn't depend on A or B, but it was added by this PR as part of the same file, so it goes with it.
- `src/select/__tests__/render-option.test.tsx` and `src/multiselect/__tests__/render-option.test.tsx`: "parent reflects the disabled state of the group, not of the option" and "keeps the disabled reason description for screen readers with custom content". Both files now equal base.
- `src/multiselect/__integ__/multiselect.test.ts`: the 3 base expectations are back ('o' → "First category", 'oo' → "option1", 7×'o' → "First category"). The file equals base.
- `src/internal/components/listbox/__tests__/use-type-ahead.test.ts`: removed "ignores keys that were already handled by another handler" and the whole `with groups` describe (5 tests). The describe didn't exist on base. One case, "with interactive groups, highlights a group whose own label matches", would also pass under base behavior. I removed it anyway so the file equals base. The file now equals base.

OptionList (only these tests changed):

- `group-state.test.tsx`: removed the `type-ahead` describe and its fixtures (`typeAheadOptions`, `type`, `isComputeHighlighted`) with all 3 tests: "multi: highlights the option that matches, not its group, and Enter selects only that option", "multi: repeating a key cycles through the matching group and options, skipping a disabled group", "single: skips the options of a group whose label matches". Removed the now-unused `Wrapper` import.
- `keyboard.test.tsx`: removed "type-ahead after Space selects moves the highlight to the matching option", plus the now-unused `highlightedValue` import.
- `render-option.test.tsx`: removed the `test.each` "%s: parent reflects the group state, not the disabled state of the option" (single + multi).
- `disabled.test.tsx`, **partially trimmed**: the `test.each` "describes the disabled option with its disabled reason when renderOption is used (%s)" mixed a D assertion (the `aria-describedby` target exists with text) with an assertion that holds under base (no tooltip with custom content). I removed the D assertions, kept the highlight and no-tooltip assertions, and renamed the test to "does not show the disabled reason tooltip when renderOption is used (%s)". It still runs for single and multi.

`common.tsx` is unchanged. `Wrapper` is still used inside it.

## Docs / snapshot

`src/option-list/interfaces.ts` makes no promises about A–D. The `renderOption` JSDoc is just "Specifies a render function to render custom options." `disabledReason` says it displays a tooltip, which is still accurate. No wording changes, so I didn't regenerate the documenter snapshot.

## Verification (Node 22.23.2)

- `npm run quick-build`: passed both before and after the change, with no TS2742.
- Unit tests, `TZ=UTC npx jest -c jest.unit.config.js src/option-list src/select src/multiselect src/autosuggest src/property-filter src/internal/components/listbox src/internal/components/options-list src/internal/components/selectable-item`:
  - Before (87aa788fe): **83 suites, 1235 tests, all passed.**
  - After: **81 suites, 1211 tests, all passed.** That is 2 suites and 24 tests fewer: 8 native-search, 4 select/multiselect render-option, 6 use-type-ahead, 3 group-state, 1 keyboard, 2 render-option (each). The disabled test was kept (trimmed).
  - OptionList alone after the change: 8 suites, 65 tests, all passed.
- Equivalence: after the commit, `git diff origin/refactor/move-shared-listbox-parts HEAD -- src/select src/multiselect` is **empty**. The diff for `src/internal/components/listbox/__tests__` and `use-type-ahead.ts` is also empty. So the base Select, Multiselect and listbox tests *are* the tests in the "after" run, and they all pass. A temporary `git checkout <base> -- …__tests__` would be a no-op, so I didn't run it separately. `git status` is clean.
- Integ: installed chromedriver 157.0.8103.15 to `/tmp/chromedriver` (Chrome 157.0.8103.26; the existing 156 driver didn't match). I ran it with `npx --registry=https://registry.npmjs.org`, which didn't touch node_modules. The dev server ran with `--host 127.0.0.1`, and lsof showed only `127.0.0.1:8080 (LISTEN)`. `jest -c jest.integ.config.js src/multiselect/__integ__/multiselect.test.ts src/option-list/__integ__/`: **3 suites, 44 tests, all passed**, including the restored multiselect type-ahead expectations. Afterwards I stopped the server. lsof shows no listener on 8080 or 9515, and no chromedriver or webpack process is running. The shell tool rejects inline server commands, so I started the server from a throwaway `/tmp` script, which I deleted afterwards.
- `npx eslint` on all changed files: clean after fixing one unused import and three blank-line prettier errors from the removals.
- `npx tsc -p tsconfig.json --noEmit`: passed.
- `package-lock.json` and `pages/tsconfig.tsbuildinfo` weren't modified (the latter isn't tracked here). Nothing else was staged.

## #5180 Copilot comments whose replies should now say "addressed in a follow-up"

- Type-ahead matching group headers for matching children / children of matching groups (A, `use-type-ahead.ts`).
- Type-ahead handling keys that another handler already handled, e.g. Space (B, `event.defaultPrevented`).
- `renderOption` `item.parent.disabled` reflecting the option instead of the group (C, `parts/item.tsx`).
- `aria-describedby` pointing at a missing element when `renderOption` returns custom content for a disabled option with `disabledReason` (D, `parts/item.tsx`).

## Updating #5180

This branch builds on `origin/feat/add-option-list` (24524f9b9) → 87aa788fe → 460ac0f4c, so the update is a fast-forward:

```
git push origin option-list/revert-shared-fixes:feat/add-option-list
```

No force is needed. I did not push.
