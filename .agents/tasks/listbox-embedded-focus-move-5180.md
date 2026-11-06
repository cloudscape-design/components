# Embedded focus move, part 2: rebase #5180 onto the new #5239 commit

Nothing pushed.

## #5239 (part 1)

`73f803b621c40dbf58e826d22c09fef208ccf93c` refactor: Share embedded list focus handling through useListbox (parent `c7d7fce91`).
3 files changed, 53 insertions(+), 17 deletions(-). Report: `listbox-embedded-focus-move-5239.md`.

## #5180 `feat/add-option-list-v2` (old tip `599443dd1`, backup `backup/feat-add-option-list-v2-599443dd1`)

`git rebase --onto 73f803b62 c7d7fce91 feat/add-option-list-v2` applied with no conflicts. Commit 1's message was changed with an `amend!` commit and `GIT_SEQUENCE_EDITOR=: git rebase -i --autosquash c7d7fce91`.

| New | Old | Subject |
|---|---|---|
| `df90ee81d3c37d476bb25f91ba4160d92183b933` | `4e25b0b13` | refactor: Add OptionList support to the shared listbox code |
| `a4f70109a294beca4b78a4e50d63acc7865bc3bd` | `bb7db2aa6` | feat: Add OptionList component |
| `66b0e5c9cec7e6eeff3149d572ad36e7f8fe1c8f` | `ae5f5bd88` | chore: Add OptionList dev pages |
| `d6bbf27d06fca68f41ed1d3deeccaefdc986b289` | `599443dd1` | test: Add OptionList unit and integration tests |

Commit 1 diff vs `73f803b62`: 10 files changed, 69 insertions(+), 14 deletions(-). Commits 2–4 messages unchanged.

New commit 1 body:

```
Optional additions that OptionList needs and Select and Multiselect don't pass, so their behavior does not change: onEscape is optional in useListbox (without it Escape keeps propagating) and getParent defaults to no group; PlainList takes scrollStrategy ('menu' by default, 'ancestors' scrolls through the page or a scroll container with the new scrollOptionIntoView); OptionsList statusType is optional with 'finished' as the default; useMenuKeyboard onEscape is optional; the shared item and SelectableItem take hideTopDivider.
OptionList passes embedded: true to useListbox getListProps, like embedded Multiselect.
```

## Tree checks

- `git diff --quiet 4e25b0b13 HEAD~3`: pass
- `git diff --quiet bb7db2aa6 HEAD~2`: pass
- `git diff --quiet ae5f5bd88 HEAD~1`: pass
- `git diff --quiet 599443dd1 HEAD`: pass
- `HEAD~4` = `73f803b621c40dbf58e826d22c09fef208ccf93c`
- `git diff 73f803b62 feat/add-option-list-v2 -- src/select src/multiselect`: empty

## Checks on commit 1 (`df90ee81d`, Node 22.23.2)

- `npm run quick-build`: passed first run
- `npx tsc -p tsconfig.json --noEmit`: passed

Final tree equals `599443dd1`, so earlier full checks on it still hold. Worktree is back on `feat/add-option-list-v2`; only untracked `pages/tsconfig.tsbuildinfo`.

## Push (not run; #5239 first, wait, then #5180, never concurrently)

```
git -C /Users/amanabiy/Documents/components/.worktrees/listbox-use-listbox push origin refactor/use-listbox-in-select
git push --force-with-lease=feat/add-option-list:24173f991 origin feat/add-option-list-v2:feat/add-option-list
```
