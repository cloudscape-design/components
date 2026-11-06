# Baseline: refactor/move-shared-listbox-parts

- Worktree: `/Users/amanabiy/Documents/components/.worktrees/refactor-move-listbox-parts`
- Base: origin/main 544e4286a (#5198)
- node_modules: worktree-local overlay. It symlinks every entry from the main checkout's node_modules, except `@cloudscape-design/component-toolkit`, which is a real 1.0.0-beta.192 copy from public npm. Main's node_modules is unchanged (toolkit beta.191).
- Caveat: toolkit beta.192 declares `weekstart ^2.0.0`, but the overlay resolves the main checkout's `weekstart` 1.1.0. Beta.191 declares the same range, so main already has this mismatch.

## Results
- `npm run build`: passes.
- Unit tests for select, multiselect, autosuggest, listbox, options-list, selectable-item and test-utils: 56/56 suites, 801/801 tests passed, 0 failed.
- Snapshot tests (`src/__tests__/snapshot-tests`): 4/4 suites, 112/112 tests, 110/110 snapshots passed, 0 failed.
- Pre-existing failures: none.
