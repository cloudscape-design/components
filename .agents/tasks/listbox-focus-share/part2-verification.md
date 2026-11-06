# Part 2 verification

Worktree: `/Users/amanabiy/Documents/components/.worktrees/option-list-on-use-listbox`, branch `feat/add-option-list-v2`.
No `part2-review.json` existed, so this was the full procedure (not a fix pass).

- New #5239 tip: `4c51035b1 refactor: Share list focus handling through useListbox`
- Backup branch: `backup/feat-add-option-list-v2-0d4ac6cf5` → `0d4ac6cf5` (created)
- Original tip: `0d4ac6cf5`. Not pushed.

## Steps

1. `git branch backup/feat-add-option-list-v2-0d4ac6cf5 0d4ac6cf5`
2. `git rebase --onto 4c51035b1 c7d7fce91 feat/add-option-list-v2`: applied cleanly, no conflicts
   (intermediate: 150fbd159, cd20bd99f, 94d4bcb9d, 320e76091).
3. `src/option-list/use-option-list.ts`: removed the `useRef` import, the `pointerDown` ref, the `nativeAttributes`
   override with `onMouseDown`, and the manual `onFocus`/`onBlur`; dropped `selectedOptions` from the `useListbox`
   destructure (now unused). List props now come from
   `getListProps({ withKeyboard: true, focus: { entry: 'first-selected-in-list-order-or-home', skipAfterPointerDown: true } })`.
   `onMouseLeave` and type-ahead in `getRootProps` are unchanged. Docstring updated.
   Behavior is the same: the shared `onFocus` reads and clears the pointer flag and returns on pointer focus, otherwise
   highlights `options.find(o => selectedSet.has(o))` with keyboard (`selectedSet` is the same connected
   `new Set(selectedOptions)` the old code built) or `goHomeWithKeyboard()`. The shared `onBlur` clears the flag and calls
   `resetHighlightWithKeyboard()`. The shared `onMouseDown` sets the flag to `listRef.current !== document.activeElement`.
   Wiring: `internal.tsx` spreads `listProps` into `PlainList`, which spreads them into `OptionsList`, which attaches
   the named `onMouseDown` on the same list element that previously got it through `nativeAttributes`.
4. `git log --format=%h -- src/option-list/use-option-list.ts` oldest = `cd20bd99f feat: Add OptionList component`;
   `git commit --fixup cd20bd99f`, then `GIT_SEQUENCE_EDITOR=: git rebase --autosquash 4c51035b1`.

## Resulting history

```
$ git log --oneline 4c51035b1..feat/add-option-list-v2
0e00ef95e test: Add OptionList unit and integration tests
f39f81b89 chore: Add OptionList dev pages
14601179f feat: Add OptionList component
150fbd159 refactor: Add OptionList support to the shared listbox code
```

`git diff backup/feat-add-option-list-v2-0d4ac6cf5 feat/add-option-list-v2 --stat`: only the 4 Part 1 files plus
`src/option-list/use-option-list.ts` (5 files, +164/-53).

## Checks (Node 22 via `mise exec node@22.23.2 --`, run from the worktree)

| Command | Result |
| --- | --- |
| `npm run quick-build` | pass (no ENOTEMPTY) |
| `npx tsc -p tsconfig.json --noEmit` | pass, 0 errors |
| `npx tsc -p pages/tsconfig.json --noEmit` | 2 errors, both the known `@formatjs/ecma402-abstract` `Intl.ListFormat` ones |
| `TZ=UTC npx jest -c jest.unit.config.js src/select src/multiselect src/autosuggest src/property-filter src/internal/components/listbox src/internal/components/options-list src/internal/components/selectable-item src/option-list` | 83/83 suites, 1248/1248 tests pass |
| `npm run build` | pass |
| `TZ=UTC npx jest -c jest.unit.config.js src/__tests__/snapshot-tests` (no `-u`) | 4/4 suites, 113/113 tests, 111/111 snapshots pass, none written/updated |
| `npx eslint` on all 33 ts/tsx/js files changed in `4c51035b1..feat/add-option-list-v2` | pass, no warnings |
| Per commit (detached checkout): `quick-build` + `tsc -p tsconfig.json --noEmit` | 150fbd159 pass/pass; 14601179f pass/pass; f39f81b89 pass/pass; 0e00ef95e pass/pass; returned to `feat/add-option-list-v2` |
| `git diff 4c51035b1 feat/add-option-list-v2 -- src/select src/multiselect` | empty |

No tests were edited or added; existing OptionList tests in `highlight.test.tsx` cover the pointer and keyboard focus
paths, and Part 1 added unit tests for the shared path. No integration tests run. `package-lock.json` unchanged;
`pages/tsconfig.tsbuildinfo` is untracked and was not committed (it is untracked, so `git checkout --` does not apply).
Working tree clean apart from that file.
