# OptionList (#5180) rebased onto the shared `useListbox` refactor (#5239)

The branch `feat/add-option-list-on-use-listbox` (HEAD `24173f991`) replays the 32 OptionList commits from `33cfa9917..240cf49ef` onto `origin/refactor/use-listbox-in-select` (`318ee8036`). #5239 now owns `listbox/use-listbox.ts`, so OptionList's hook of the same name was moved to `use-inline-listbox.ts` as `useInlineListbox`, and its list prop types now come from #5239's `listbox/interfaces.ts`. I checked every commit with read-only git commands. Each one keeps #5239's `use-listbox.ts` byte-identical, and each `use-inline-listbox.ts` matches the original commit's `use-listbox.ts` apart from the rename and the import swap. The final tree differs from `240cf49ef` only by #5239's own diff plus the rename.

Watch for: OptionList still runs its own copy of highlight, keyboard, choose-guard, mouse and announcement logic beside #5239's shared `useListbox` (**confirmed**). That matches the plan ("building it on `useListbox` is a later step"). The user's last message ("update it to work with the refactors") could also mean building it on `useListbox` now, so confirm with the user which one they meant. The new branch also tracks `origin/feat/add-option-list` (**confirmed**). Neither of these blocks the rebase.

**Verdict**: APPROVED

## High-level view

The rename keeps #5239 and OptionList apart. `use-listbox.ts` matches `318ee8036` at HEAD and in all 32 commits. `use-inline-listbox.ts` differs from the original hook only in three things: the `useInlineListbox` / `UseInlineListboxProps` / `UseInlineListboxApi` names, an import of `GetOptionProps` / `ListElementProps` from `./interfaces` in place of local declarations, and two removed imports that became unused. Only `listbox/index.tsx` and `option-list/internal.tsx` import the new hook. #5239's own `use-listbox.test.tsx` and `use-select.ts` are the only places that still import `use-listbox`.

Select and Multiselect come out exactly as #5239 left them. `git diff origin/refactor/use-listbox-in-select HEAD -- src/select src/multiselect` is empty, and #5180 never touched those folders (`git diff 33cfa9917 origin/feat/add-option-list -- src/select src/multiselect` is empty too).

OptionList's code, pages and test-utils are the same as on `240cf49ef`, except for the hook import and call in `option-list/internal.tsx`. Overall, `git diff origin/feat/add-option-list HEAD --stat` lists 10 files. Six of them have line changes identical to #5239's `33cfa9917..318ee8036` diff: `use-listbox.test.tsx`, `interfaces.ts`, `plain-list.tsx`, `use-multiselect.tsx`, `select/internal.tsx` and `use-select.ts`. The other four come from the rename: `use-listbox.ts`, `use-inline-listbox.ts`, `listbox/index.tsx` and `option-list/internal.tsx`.

The files that merged without conflicts keep both sides. In `plain-list.tsx`, #5180's `scrollStrategy` sits alongside #5239's move of `GetOptionProps` and `ListElementProps` into `../interfaces`. `use-keyboard.ts` keeps the optional `closeDropdown`. `options-list/index.tsx` keeps the `statusType = 'finished'` default and `onMouseLeave`.

The coder's evidence is complete and green. It covers quick-build, 83 unit test suites (1241 tests), OptionList at 67 tests on both the rebased branch and the baseline, ESLint on the changed files, a clean `tsc` for the sources, `tsc` for the pages with only the 2 known `@formatjs` errors, a full build, and the snapshot tests (111 snapshots, no `-u`). Nothing was pushed.

<details>
<summary>Issues (2)</summary>

1. **OptionList not yet built on the shared `useListbox`** (non-blocking): `useInlineListbox` repeats what #5239's `useListbox` provides (highlight, `useMenuKeyboard` and `getListboxNavigation` wiring, `getSelectableOption`, mouse handlers, `getListboxOptionProps`, `useAnnouncement`). Ask the user whether "update it to work with the refactors" means this rename (as planned) or rebuilding `useInlineListbox` on top of `useListbox` now.
2. **New branch tracks `origin/feat/add-option-list`** (non-blocking): `git checkout -B … origin/feat/add-option-list` set the upstream, so `git status` in the worktree reports the branch as diverged. Either use the `reset --keep` plus `--force-with-lease` commands from the report, or run `git branch --unset-upstream` on the new branch.

</details>

<details>
<summary>Details</summary>

### Per-commit split of `use-listbox.ts` into `use-inline-listbox.ts`

I matched each original commit to its rebased commit by position. The subject, author and author date are identical for all 32 pairs, and none of the rebased commits is empty. For each pair I compared the original `use-listbox.ts` with the rebased `use-inline-listbox.ts`, leaving out the rename lines and the import and type-declaration swap. Nothing else differed in any of the 32. That includes the conflict-heavy commits `872248ac5`, `57da752f6`, `3ade7cdff`, `2c824c84d`, `3cd1c53dd` and `f06a65f61`. At every commit, `use-listbox.ts` equals #5239's file.

`parts/list.tsx` exists in the rebased commits 1–24 and is gone from commit 25 (`2c824c84d`, "Use PlainList") onward. The original history has it in exactly the same commits, so the modify/delete conflict was resolved as the original commit intended. No commit has `option-list/`, `listbox/index.tsx` or `listbox/parts/` importing the old `use-listbox` path.

### Duplication with #5239's `useListbox`

#5239 describes its `useListbox` as "List state shared by all list components: highlight, keyboard navigation, the choose guard, mouse handlers, row props and the live region announcement." It leaves focus, filtering, scrolling and type-ahead to the callers. `useInlineListbox` imports and wires the same building blocks itself: `useHighlightedOption`, `useMenuKeyboard`, `getListboxNavigation`, `getSelectableOption`, `getListMouseHandlers`, `getListboxOptionProps`, `isAnnouncedSelected` and `useAnnouncement`. After this rebase, the shared hook and OptionList's hook can drift apart (**confirmed** that both exist side by side).

The plan in `listbox-stack-plan.md` says to rename now and move to `useListbox` later, and the review brief asked for an unchanged hook body. That makes the rename correct for this step. The user's message 12 ("for the option-list component update it to work with the refactors") can be read either way, so the user should confirm.

### Branch upstream

`git rev-parse --abbrev-ref @{u}` on the new branch returns `origin/feat/add-option-list`. Nothing was pushed: `branch -r --contains` is empty, and both `feat/add-option-list` and `.worktrees/option-list-rebase` are still at `240cf49ef`. The upstream setting is still misleading, though. A bare `git pull` in this worktree would try to merge the old #5180 history back in (**likely**, given the upstream setting).

</details>

<details>
<summary>File map</summary>

- `src/internal/components/listbox/use-listbox.ts`: #5239's shared hook, unchanged.
- `src/internal/components/listbox/use-inline-listbox.ts`: OptionList's hook after the rename, with types from `./interfaces`.
- `src/internal/components/listbox/index.tsx`: imports `GetOptionProps`/`ListElementProps` from `./interfaces` and `UseInlineListboxApi`; doc comments renamed.
- `src/option-list/internal.tsx`: calls `useInlineListbox`.
- `src/internal/components/listbox/interfaces.ts`, `parts/plain-list.tsx`, `__tests__/use-listbox.test.tsx`, `src/select/internal.tsx`, `src/select/utils/use-select.ts`, `src/multiselect/use-multiselect.tsx`: #5239's changes, identical to `33cfa9917..318ee8036`.

Full diff: `git -C .worktrees/option-list-on-use-listbox -P diff origin/feat/add-option-list feat/add-option-list-on-use-listbox`.

</details>
