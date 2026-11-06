# Listbox embedded focus: verification

Worktree `.worktrees/option-list-on-use-listbox`, branch `feat/add-option-list-v2`. Nothing pushed.
Backup of the previous tip: `backup/feat-add-option-list-v2-9c86b7efc`.

## Commits (base `c7d7fce91`, unchanged)

| Old | New | Subject |
| --- | --- | --- |
| fd9018951 | 4e25b0b13 | refactor: Add OptionList support to the shared listbox code |
| 62d420a16 | bb7db2aa6 | feat: Add OptionList component |
| 592ba65fb | ae5f5bd88 | chore: Add OptionList dev pages (tree content unchanged) |
| 9c86b7efc | 599443dd1 | test: Add OptionList unit and integration tests |

Changes were folded in with fixup commits (plus one `amend!` commit to replace commit 1's message) and `GIT_SEQUENCE_EDITOR=: git rebase -i --autosquash c7d7fce91`. Commit 1's second body paragraph now reads:

> useListbox getListProps also takes an embedded flag that returns onFocus and onBlur for an embedded list, an always visible list that is a tab stop: focus highlights the first option if nothing is highlighted, and blur clears the highlight. This is embedded Multiselect's current behavior, and embedded Multiselect now passes the flag instead of setting its own handlers; OptionList passes it too. Select and Multiselect dropdowns don't pass it. Moving focus to the selected option is a follow-up.

## use-listbox.ts vs c7d7fce91 (focus part)

```diff
 export type BaseListProps = Pick<
   ListElementProps,
-  'id' | 'ref' | 'onMouseUp' | 'onMouseMove' | 'onKeyDown' | 'nativeAttributes'
+  'id' | 'ref' | 'onMouseUp' | 'onMouseMove' | 'onKeyDown' | 'onFocus' | 'onBlur' | 'nativeAttributes'
 >;
@@
    * Base props for the list element: id, ref and mouse handlers. With `withKeyboard`, also `onKeyDown` and
-   * `aria-activedescendant`, for a list that has focus itself (not through a filter input).
+   * `aria-activedescendant`, for a list that has focus itself (not through a filter input). With `embedded`, also
+   * `onFocus` and `onBlur`, for an embedded list: an always visible list that is a tab stop. Focus highlights the
+   * first option if nothing is highlighted, and blur clears the highlight. A hover highlight is kept on focus, so a
+   * click selects the hovered option. Moving focus to the selected option is a follow-up.
+   * Callers that add native attributes spread `nativeAttributes`.
    */
-  getListProps(options: { withKeyboard: boolean }): BaseListProps;
+  getListProps(options: { withKeyboard: boolean; embedded?: boolean }): BaseListProps;
@@
- * Focus, open state, filter, type-ahead and the highlight on open stay with the callers, because they differ
- * per component.
+ * Focus handling of an embedded list is shared through `getListProps({ embedded })`. Open state, filter,
+ * type-ahead and the highlight on open stay with the callers, because they differ per component.
@@
-  const getListProps = ({ withKeyboard }: { withKeyboard: boolean }) => {
+  const getListProps = ({ withKeyboard, embedded }: { withKeyboard: boolean; embedded?: boolean }) => {
     const listProps: BaseListProps = { id: listId, ref: listRef, ...mouseHandlers };
     if (withKeyboard) {
       listProps.onKeyDown = onKeyDown;
       listProps.nativeAttributes = { 'aria-activedescendant': activeDescendantId };
     }
+    if (embedded) {
+      listProps.onFocus = () => {
+        if (!highlightedOption) {
+          highlight.goHomeWithKeyboard();
+        }
+      };
+      listProps.onBlur = () => {
+        highlight.resetHighlightWithKeyboard();
+      };
+    }
     return listProps;
   };
```

Removed compared with the old commit 1: `ListFocusOptions`, the `entry` values, `skipAfterPointerDown`, the `pointerDown` ref, the `onMouseDown` handler, and `onMouseDown` in `BaseListProps`. The named `onMouseDown` prop on `OptionsList` is gone; `git diff c7d7fce91 -- src/internal/components/options-list/index.tsx` now only shows the optional `statusType` (default `'finished'`), which is still needed by OptionList.

## Select and Multiselect

- `git diff c7d7fce91 HEAD --stat -- src/select src/multiselect`: only `src/select/utils/use-select.ts` (1 insertion, 11 deletions). The change replaces the `if (embedded) { menuProps.onFocus ...; menuProps.onBlur ... }` block with `listbox.getListProps({ withKeyboard: !hasFilter, embedded })`.
- `origin/main` `use-select.ts` has `onFocus: if (!highlightedOption) goHomeWithKeyboard();` and `onBlur: resetHighlightWithKeyboard();` under `if (embedded)`. The shared handler runs the same calls on the same highlight state, so embedded Multiselect behavior matches main. Dropdown Select/Multiselect get no focus handlers, as before.
- No file under `src/select` or `src/multiselect` tests changed.

## OptionList behavior and tests

Intended behavior change: keyboard focus no longer moves to the selected option. Focus highlights the first option (keyboard style) if nothing is highlighted, and keeps an existing highlight, including a hover highlight. Blur clears the highlight. The pointer-down guard is gone.

- `src/option-list/use-option-list.ts`: `getListProps({ withKeyboard: true, embedded: true })`; docstring no longer mentions the pointer-down guard. `onMouseLeave` and type-ahead in `getRootProps` unchanged; all imports and values are still used (`highlight`, `highlightedOption` for type-ahead and mouse leave).
- `src/option-list/__tests__/highlight.test.tsx`: replaced the selected-option, list-order, hover-replacement and pointer-skip tests with three tests: focus highlights the first option with the keyboard style also when another option is selected; focus keeps a hover highlight so a click selects the hovered option; blur clears the highlight and the next focus highlights the first option. The first-option focus, keyboard-scroll and hover tests are unchanged.
- `src/option-list/__integ__/option-list-scroll.test.ts`: `focus entry scrolls to a preselected option near the end` became `focus entry highlights the first option when an option near the end is selected` (expects `Option 1`). The dev page's "Already selected" setting stays for the follow-up.
- `src/internal/components/listbox/__tests__/use-listbox.test.tsx`: the commit 1 focus tests are now one `embedded` describe: no handlers without `embedded`; focus without a highlight goes home with the keyboard type, and blur resets; focus keeps an existing highlight.
- OptionList docs: no wording in `src/option-list/interfaces.ts`, `internal.tsx` or `pages/option-list/` described focus moving to the selected option, so the API doc snapshot did not change (no `-u`).

## Iteration 2: commit 2 message

Review finding: commit 2's body still described the old focus entry on the selected option. Fixed with an empty `amend! feat: Add OptionList component` commit and `GIT_SEQUENCE_EDITOR=: git rebase -q -i --autosquash c7d7fce91`. The paragraph now reads:

> useOptionList (src/option-list/use-option-list.ts) calls the shared useListbox with embedded: true, which handles focus and blur, and adds the mouse-leave reset and type-ahead. The list renders through the shared PlainList with scrollStrategy 'ancestors'.

Message-only change. Tree hashes are identical before and after for every commit (checked with `git rev-parse <commit>^{tree}`: 3df983de, 3a513cf5, 7e0aa69b, 204176ea), and `git diff --quiet fe3484273 599443dd1` passes. The build, type-check, jest, snapshot, eslint and per-commit results above apply unchanged to the new hashes. Previous tip `fe3484273` is still reachable from the reflog; the existing backup branch `backup/feat-add-option-list-v2-9c86b7efc` was not recreated.

## Commands and results (Node via `mise exec node@22.23.2 --`)

| Command | Result |
| --- | --- |
| `npm run quick-build` | pass (no ENOTEMPTY retry needed) |
| `npx tsc -p tsconfig.json --noEmit` | pass, 0 errors |
| `npx tsc -p pages/tsconfig.json --noEmit` | only the 2 expected `@formatjs/ecma402-abstract/utils.d.ts` `Intl.ListFormat` errors (TS2339, TS2694) |
| `npx tsc -p tsconfig.integ.json --noEmit` | config error TS5109 (moduleResolution vs module Node16), unrelated to this change |
| `npx tsc -p tsconfig.integ.json --noEmit --module commonjs` | pass, 0 errors (integ tests type-check) |
| `TZ=UTC npx jest -c jest.unit.config.js src/option-list src/select src/multiselect src/autosuggest src/property-filter src/internal/components/listbox src/internal/components/options-list src/internal/components/selectable-item` | pass: 83/83 suites, 1241/1241 tests (run before the commits and again on the final HEAD) |
| `npm run build` | pass |
| `TZ=UTC npx jest -c jest.unit.config.js src/__tests__/snapshot-tests` | pass: 4/4 suites, 113 tests, 111/111 snapshots; no `-u` |
| `npx eslint` on all changed files | pass |
| Per commit, detached: `npm run quick-build` + `npx tsc -p tsconfig.json --noEmit` on 4e25b0b13 and on the trees now in bb7db2aa6, ae5f5bd88, 599443dd1 (run as ddf491519, ec68c2d46, fe3484273, same trees) | all pass; returned to `feat/add-option-list-v2` |
| `git status --short` | only untracked `pages/tsconfig.tsbuildinfo`; `package-lock.json` unmodified; `.agents/`, `.kiro/` not committed |

Integration tests were not run (port 8080 busy), as instructed.

`.agents/tasks/listbox-stack-plan.md`: follow-up 4 now reads "Embedded list focus entry: move focus to the selected option for embedded lists (OptionList, embedded Multiselect); decide selection order vs list order (ARIA listbox pattern says list order); the Select dropdown open effect uses selection order today."
