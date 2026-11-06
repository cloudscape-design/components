# Part 1 verification

Worktree: `/Users/amanabiy/Documents/components/.worktrees/listbox-use-listbox`, branch `refactor/use-listbox-in-select`.
No `part1-review.json` existed, so this is the first implementation.

New commit: `4c51035b1 refactor: Share list focus handling through useListbox`

```
$ git log --oneline c7d7fce91..HEAD
4c51035b1 (HEAD -> refactor/use-listbox-in-select) refactor: Share list focus handling through useListbox
```

Files changed (4): `src/internal/components/listbox/use-listbox.ts`, `src/internal/components/options-list/index.tsx`,
`src/select/utils/use-select.ts`, `src/internal/components/listbox/__tests__/use-listbox.test.tsx`.

## What changed

- `useListbox`: new `ListFocusOptions` (`entry: 'home-if-no-highlight' | 'first-selected-in-list-order-or-home'`,
  `skipAfterPointerDown?`), with docstrings saying each setting keeps its component's current behavior and will be
  unified in a follow-up PR. `getListProps({ withKeyboard, focus })` returns `onFocus`/`onBlur` only when `focus` is
  given and `onMouseDown` only with `skipAfterPointerDown`. `pointerDown` ref added after `listRef`.
  `nativeAttributes` still only carries `aria-activedescendant`; focus handlers never go into it, so nothing is overwritten.
- `OptionsList`: named `onMouseDown?: () => void` prop, attached raw (`undefined` attaches no listener).
  Select/Multiselect never pass it (their `getListProps` call has no `skipAfterPointerDown`).
- `useSelect.getMenuProps`: the embedded branch's manual onFocus/onBlur replaced by
  `focus: embedded ? { entry: 'home-if-no-highlight' } : undefined`. Same logic: focus → `if (!highlightedOption) goHomeWithKeyboard()`;
  blur → `resetHighlightWithKeyboard()`; the pointer flag is never set because no onMouseDown is returned.
  Non-embedded: `focus` undefined, returned props identical to before. Open effect, focus on open, Dropdown blur untouched.
- Tests: 7 new tests in `use-listbox.test.tsx` `getListProps` for the new paths (`first-selected-in-list-order-or-home`
  and `skipAfterPointerDown` have no other coverage on this branch). Existing tests unchanged.

## Checks (Node 22 via `mise exec node@22.23.2 --`)

| Command | Result |
| --- | --- |
| `npm run quick-build` | pass (first run, no ENOTEMPTY) |
| `npx tsc -p tsconfig.json --noEmit` | pass, 0 errors |
| `npx tsc -p pages/tsconfig.json --noEmit` | 2 errors, both the known `@formatjs/ecma402-abstract` `Intl.ListFormat` ones |
| `npx tsc -p tsconfig.unit.json --noEmit` (extra, filtered) | no errors in changed files (pre-existing unrelated config errors only) |
| `TZ=UTC npx jest -c jest.unit.config.js src/select src/multiselect src/autosuggest src/property-filter src/internal/components/listbox src/internal/components/options-list src/internal/components/selectable-item` | 75/75 suites, 1185/1185 tests pass |
| `npm run build` | pass |
| `TZ=UTC npx jest -c jest.unit.config.js src/__tests__/snapshot-tests` (no `-u`) | 4/4 suites, 112/112 tests, 110/110 snapshots pass, none written/updated |
| `npx eslint` on the 4 changed files | pass, no warnings |

No Select/Multiselect tests were edited. `package-lock.json` unchanged; `pages/tsconfig.tsbuildinfo` is untracked and not committed. Not pushed.
