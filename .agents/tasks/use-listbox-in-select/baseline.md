# Baseline: refactor/use-listbox-in-select (unmodified)

- Worktree: `/Users/amanabiy/Documents/components/.worktrees/listbox-use-listbox`
- Branch: `refactor/use-listbox-in-select`
- HEAD: `33cfa9917` (refactor: Share listbox keyboard navigation), same as `origin/refactor/move-shared-listbox-parts`
- Node: `mise exec node@22.23.2 --`
- Logs: `.agents/tasks/use-listbox-in-select/logs/baseline-*.log`
- No code changes, no commits.

## 1. Quick build

```
mise exec node@22.23.2 -- npm run quick-build
```

Exit 0. Log: `logs/baseline-quick-build.log`.

## 2. Targeted unit tests

```
TZ=UTC mise exec node@22.23.2 -- npx jest -c jest.unit.config.js src/select src/multiselect src/autosuggest src/property-filter src/internal/components/listbox src/internal/components/options-list src/internal/components/selectable-item
```

Exit 0. Log: `logs/baseline-unit.log`.

- Test Suites: 74 passed, 74 total
- Tests: 1157 passed, 0 failed, 0 skipped, 1157 total

## 3. Full build, snapshot and functional tests

```
mise exec node@22.23.2 -- npm run build
TZ=UTC mise exec node@22.23.2 -- npx jest -c jest.unit.config.js src/__tests__/snapshot-tests
TZ=UTC mise exec node@22.23.2 -- npx jest -c jest.unit.config.js src/__tests__/functional-tests
```

- Build: exit 0 (webpack compiled with 2 warnings). Log: `logs/baseline-build.log`.
- Snapshot tests (no `-u`): 4/4 suites passed, 112/112 tests passed, 110/110 snapshots passed. Log: `logs/baseline-snapshot.log`.
- Functional tests: 10/10 suites passed, 1969/1969 tests passed. Log: `logs/baseline-functional.log`.
- Failing tests: none.

## 4. Size and file inventory

`wc -l src/select/utils/use-select.ts`: **350** lines.

`src/internal/components/listbox/`:

```
__tests__/connect-options.test.ts
__tests__/get-item-props.test.ts
__tests__/navigation.test.ts
__tests__/option-props.test.ts
__tests__/scroll-to-index.test.ts
__tests__/use-announcement.test.ts
__tests__/use-type-ahead.test.ts
parts/common.ts
parts/get-item-props.ts
parts/item.tsx
parts/option-group.tsx
parts/plain-list.tsx
parts/render-options.tsx
parts/scroll-to-index.ts
selection/__tests__/multi-selection.test.ts
selection/__tests__/single-selection.test.ts
selection/interfaces.ts
selection/multi-selection.ts
selection/single-selection.ts
use-announcement.ts
use-type-ahead.ts
utils/check-option-value-field.ts
utils/connect-options.ts
utils/navigation.ts
utils/option-props.ts
```

## 5. Cleanup

```
git -C /Users/amanabiy/Documents/components/.worktrees/listbox-use-listbox checkout -- pages/tsconfig.tsbuildinfo package-lock.json
```

Errored: `pages/tsconfig.tsbuildinfo` is not tracked. `git status --short` afterwards was clean, so nothing needed restoring.
