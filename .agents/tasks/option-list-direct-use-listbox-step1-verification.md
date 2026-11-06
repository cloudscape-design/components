# Step 1 verification: move list scrolling and active descendant into useListbox

Worktree: `/Users/amanabiy/Documents/components/.worktrees/listbox-use-listbox`
Branch: `refactor/use-listbox-in-select` (local only, not pushed; origin still at 318ee8036)

## Commit

`97391cac596c3315b13260250dfa73afa35f285e` — `refactor: Move list scrolling and active descendant into useListbox`
Parent: `318ee8036336a7bf64506d21f367a71a97ceccd4` (= origin/refactor/use-listbox-in-select)

```
$ git -P show --stat HEAD
 .../listbox/__tests__/use-listbox.test.tsx      | 25 ++++++++++++++++++++
 src/internal/components/listbox/use-listbox.ts  | 23 ++++++++++++++++--
 src/select/utils/use-select.ts                  | 15 +++---------
 3 files changed, 49 insertions(+), 14 deletions(-)
```

## Line counts

| File | Before | After |
|---|---|---|
| src/internal/components/listbox/use-listbox.ts | 169 | 188 |
| src/select/utils/use-select.ts | 335 | 326 |

## What changed

- `useListbox` now owns the `scrollToIndex` ref (`RefObject<SelectListProps.SelectListRef>`) and the effect
  `useEffect(() => scrollToIndex.current?.(highlightedIndex), [highlightedIndex])`, copied unchanged from useSelect.
  Both are returned.
- `useListbox` returns `activeDescendantId = getOptionId(listId, highlightedIndex)`. `getOptionId` returns
  `undefined` for index -1, so the type is `string | undefined`, the same value useSelect built before.
- `useSelect` drops its own `scrollToIndex` ref/effect and `highlightedOptionId`; it uses `listbox.scrollToIndex`
  and `listbox.activeDescendantId`. Its returned API (including `scrollToIndex`) is unchanged.
  Unused imports (`SelectListProps`, `getOptionId`) removed from use-select.ts.
- Select and Multiselect components: not touched.
- No new options.

Hook order / ids: the only new hooks in useListbox (`useRef`, `useEffect`) are added after all existing hooks
and are not id-generating; `useUniqueId('option-list')` and `useUniqueId('dialog')` are called in the same order
as before, so generated ids are unchanged. The scroll effect now runs before useSelect's open-highlight and
focus effects in the same commit instead of after them. It only fires when `highlightedIndex` changes, and those
effects change the highlight through state (next render), so the observable call sequence is the same; all
Select/Multiselect tests pass unchanged.

## Commands and results (all Node 22 via `mise exec node@22.23.2 --`)

| Command | Result |
|---|---|
| Baseline: `TZ=UTC npx jest -c jest.unit.config.js src/select src/multiselect src/autosuggest src/property-filter src/internal/components/listbox src/internal/components/options-list src/internal/components/selectable-item` (lib already built) | 75 suites / 1174 tests passed |
| `npx jest ... use-listbox.test.tsx` (first try) | failed: tsc type error, `activeDescendantId` must be `string \| undefined`; fixed |
| `npx tsc -p tsconfig.json --noEmit` | pass (exit 0) |
| `npx eslint use-listbox.ts use-select.ts __tests__/use-listbox.test.tsx` | pass (exit 0) |
| `npm run quick-build` | pass |
| Same jest set after change | 75 suites / 1176 tests passed (+2 new cases) |
| `npm run build` | pass (only the usual webpack asset/entrypoint size warnings) |
| `TZ=UTC npx jest -c jest.unit.config.js src/__tests__/snapshot-tests` (no `-u`) | 4 suites / 112 tests passed, 110 snapshots passed, none written or updated |
| `git -P diff --stat HEAD~1 -- '**/__tests__/**'` | only `use-listbox.test.tsx` (+25) |
| `git checkout -- package-lock.json` | done; `pages/tsconfig.tsbuildinfo` is untracked so nothing to restore. Worktree clean. |

## New test cases (use-listbox.test.tsx)

- `activeDescendantId` is undefined with no highlight and `getOptionId(listId, 3)` after highlighting row 3.
- `scrollToIndex` ref is called with the highlighted index on each highlight change (keyboard down → 1, mouse move → 4; 2 calls).

## Test counts

- Before: 75 suites, 1174 tests passed.
- After: 75 suites, 1176 tests passed.
- Snapshots: 110/110 passed, unchanged.
