# Step 1 verification: #5239 pre-push cleanup

Worktree `.worktrees/listbox-use-listbox`, branch `refactor/use-listbox-in-select`. Start: HEAD `5dc61eeb4`, clean apart from untracked `pages/tsconfig.tsbuildinfo`, origin `318ee8036`. Not pushed.

## Commit

```
commit a7742476571328ba50f495d8dad79e56c59d793e
Author: Amanuel Sisay <amanabiy@amazon.de>
Date:   Tue Nov 3 22:46:32 2026 +0100

    refactor: Tidy the shared listbox API
    
    useListbox returns listRenderProps (scroll ref, highlight type, announcement, row props and selection type) that Select, Multiselect and embedded Multiselect spread onto the list. getListProps sets isMultiSelect from the selection model, so the list components no longer take it as a prop. useListbox reads the selected options from the selection model and no longer returns mouseHandlers. The list ref type moves to listbox/interfaces as ScrollToIndexRef, SelectListProps becomes ListProps and its menuProps prop becomes listProps. No behavior change.

 pages/dropdown/list-with-sticky-item.page.tsx      |  2 +-
 .../listbox/__tests__/use-listbox.test.tsx         | 52 +++++++++++--------
 src/internal/components/listbox/interfaces.ts      |  3 ++
 .../components/listbox/parts/plain-list.tsx        | 27 +++-------
 src/internal/components/listbox/use-listbox.ts     | 60 ++++++++++++++--------
 src/multiselect/embedded.tsx                       |  9 +---
 src/multiselect/internal.tsx                       |  9 +---
 src/multiselect/use-multiselect.tsx                | 10 +---
 src/select/internal.tsx                            | 14 ++---
 src/select/parts/virtual-list.tsx                  | 44 ++++++++--------
 src/select/utils/use-select.ts                     |  2 +-
 11 files changed, 113 insertions(+), 119 deletions(-)
```

## Items

| Item | Status | Notes |
|---|---|---|
| A1 | done | `UseListboxApi.listRenderProps` = `{ ref: scrollToIndex, highlightType, screenReaderContent: announcement, getOptionProps, selectionType: selection.selectionType }` (type `ListRenderProps`). `useSelect` and `useMultiselect` return it; spread in `select/internal.tsx`, `multiselect/internal.tsx`, `multiselect/embedded.tsx`. `filteringValue`, `listBottom`, `hasDropdownStatus`, `firstOptionSticky`, `renderOption` stay per caller. Select now passes `selectionType="single"` where it used to pass nothing; `renderOptions` and `Item` already default to `'single'`, so the output is the same. `useMultiselect` no longer returns `announcement`, `highlightType`, `scrollToIndex`, `getOptionProps` (only internal.tsx/embedded.tsx read them, now via `listRenderProps`). `useSelect` keeps those returns because `use-select.test.ts` and `group-state.test.tsx` read them. |
| A2 | done | `getListProps` sets `isMultiSelect: selection.selectionType === 'multi' \|\| undefined` (`BaseListProps` picks `isMultiSelect`). `isMultiSelect` removed from `ListProps`; PlainList/VirtualList pass it through the `listProps` spread. The literal `isMultiSelect={true}` removed from Multiselect and embedded. `OptionsList` renders `aria-multiselectable={role === 'listbox' && isMultiSelect ? true : undefined}` (`options-list/index.tsx:133`), so Select (undefined) and Multiselect (true) are unchanged. |
| B1 | done | `mouseHandlers` removed from `UseListboxApi` and the return. `use-listbox.test.tsx` reads them through `getListProps({ withKeyboard: false })` (helper `mouse(hook)`); the two `getListProps` tests compare `onMouseUp`/`onMouseMove` with `expect.any(Function)` instead of spreading `mouseHandlers`. |
| B2 | partly done | `selectedOptions` input removed; `useListbox` reads `selection.selectedOptions`. Callers: Select passes `selectedOptions=[selectedOption]` and `singleSelection(selectedOptions)` (same 0–1 items); Multiselect passes the same array to `useSelect` and `multiSelection`; `useSelect`'s default `singleSelection(selectedOptions)` slices to 1, and every `useSelect` test passes 0 or 1 selected options. **`interactiveGroups` kept**: `useSelect` passes its own `useInteractiveGroups` prop, and `use-select.test.ts` "should navigate to the first parent option … (interactive groups)" calls `useSelect` with `useInteractiveGroups: true` and the default `singleSelection` (`interactiveGroups: false`). Reading it from `selection` would break that test, so the values differ for that caller. Production callers pass equal values (Select false/false, Multiselect true/true). |
| B4 | done | `ScrollToIndexRef = (index: number) => void` in `listbox/interfaces.ts`. `use-listbox.ts` imports it from there; it no longer imports from `parts/plain-list`. |
| B5 | done | `SelectListProps` → `ListProps`, `SelectListProps.SelectListRef` → `ScrollToIndexRef` (namespace removed) in `plain-list.tsx`, `select/parts/virtual-list.tsx`, `use-listbox.ts`. `useUniqueId('select-list-')` calls unchanged. |
| B6 | done | PlainList/VirtualList prop `menuProps` → `listProps` (also in `pages/dropdown/list-with-sticky-item.page.tsx`; Select's local `menuProps` variable renamed to `listProps`). `getMenuProps`/`menuId` in `useSelect` unchanged. Autosuggest's own `menuProps` untouched. |
| B11 | done | `activeDescendantId`: "undefined when `highlightedIndex` is -1". |
| B12 | done | `scrollToIndex`: "called with `highlightedIndex` whenever the highlighted index changes". |

## Commands (all in the worktree, via `mise exec node@22.23.2 --`)

| Command | Result |
|---|---|
| `npm run quick-build` (baseline, HEAD 5dc61eeb4) | pass |
| `TZ=UTC npx jest -c jest.unit.config.js src/select src/multiselect src/autosuggest src/property-filter src/internal/components/listbox src/internal/components/options-list src/internal/components/selectable-item` (baseline) | 75 suites, 1178 tests, all pass |
| `npx tsc -p tsconfig.json --noEmit` | pass |
| `npx tsc -p pages/tsconfig.json --noEmit` (before rebuilding lib) | dev page error from stale `lib` types (`listProps` unknown) + 2 @formatjs |
| `npm run quick-build` (after) | pass |
| `npx tsc -p pages/tsconfig.json --noEmit` (after rebuild) | only the 2 known @formatjs errors |
| same jest command (after) | 75 suites, 1178 tests, all pass |
| `TZ=UTC npx jest -c jest.unit.config.js src/__tests__/functional-tests` | 10 suites, 1969 tests, all pass |
| `npx eslint <11 changed files>` | first run: prettier errors in `virtual-list.tsx` (VirtualListClosed fits one line now); `eslint --fix` on that file; re-run: clean |
| `npm run build` | pass |
| `TZ=UTC npx jest -c jest.unit.config.js src/__tests__/snapshot-tests` (no `-u`) | 4 suites, 112 tests, 110 snapshots passed; unchanged |
| `git checkout -- package-lock.json` | no-op (unchanged) |
| `git checkout -- pages/tsconfig.tsbuildinfo` | not tracked; left untracked, not staged |

Test counts: before 1178 / 75 suites, after 1178 / 75 suites. Snapshots unchanged.

## Test-file diffs (`git diff HEAD~1 -- '*__tests__*'`)

Only `src/internal/components/listbox/__tests__/use-listbox.test.tsx` changed (B1 and the removed `selectedOptions` input, B2). No component test changed.

```diff
diff --git a/src/internal/components/listbox/__tests__/use-listbox.test.tsx b/src/internal/components/listbox/__tests__/use-listbox.test.tsx
index 58b35b838..7b3b38021 100644
--- a/src/internal/components/listbox/__tests__/use-listbox.test.tsx
+++ b/src/internal/components/listbox/__tests__/use-listbox.test.tsx
@@ -41,12 +41,17 @@ const { flatOptions } = flattenOptions([
   { value: 'd', label: 'D' },
 ]);
 
+// The mouse handlers of the list element, as returned by getListProps.
+const mouse = (hook: { result: { current: ReturnType<typeof useListbox> } }) => {
+  const { onMouseMove, onMouseUp } = hook.result.current.getListProps({ withKeyboard: false });
+  return { onMouseMove: onMouseMove!, onMouseUp: onMouseUp! };
+};
+
 function renderListbox(props: Partial<UseListboxProps> = {}) {
   const onSelect = jest.fn();
   const hook = renderHook(useListbox, {
     initialProps: {
       options: flatOptions,
-      selectedOptions: [],
       selection: singleSelection([]),
       onEscape: () => {},
       interactiveGroups: false,
@@ -87,7 +92,7 @@ describe('useListbox', () => {
 
     test("types after a mouse highlight when spaceSelects is 'keyboard-highlight'", () => {
       const { hook, onSelect, keyDown } = renderListbox({ spaceSelects: 'keyboard-highlight' });
-      act(() => hook.result.current.mouseHandlers.onMouseMove(3));
+      act(() => mouse(hook).onMouseMove(3));
 
       const event = keyDown(KeyCode.space);
 
@@ -176,19 +181,19 @@ describe('useListbox', () => {
     test('onMouseMove highlights with mouse type and onMouseUp chooses', () => {
       const { hook, onSelect } = renderListbox();
 
-      act(() => hook.result.current.mouseHandlers.onMouseMove(3));
+      act(() => mouse(hook).onMouseMove(3));
       expect(hook.result.current.highlightedOption).toBe(flatOptions[3]);
       expect(hook.result.current.highlightType.type).toBe('mouse');
 
-      act(() => hook.result.current.mouseHandlers.onMouseUp(4));
+      act(() => mouse(hook).onMouseUp(4));
       expect(onSelect).toHaveBeenCalledWith(flatOptions[4]);
     });
 
     test('ignore index -1', () => {
       const { hook, onSelect } = renderListbox();
 
-      act(() => hook.result.current.mouseHandlers.onMouseMove(-1));
-      act(() => hook.result.current.mouseHandlers.onMouseUp(-1));
+      act(() => mouse(hook).onMouseMove(-1));
+      act(() => mouse(hook).onMouseUp(-1));
 
       expect(hook.result.current.highlightedIndex).toBe(-1);
       expect(onSelect).not.toHaveBeenCalled();
@@ -198,8 +203,8 @@ describe('useListbox', () => {
   describe('getOptionProps', () => {
     test('returns highlight, selection matched by value and the row id', () => {
       const selected: OptionDefinition = { value: 'c' };
-      const { hook } = renderListbox({ selectedOptions: [selected], selection: singleSelection([selected]) });
-      act(() => hook.result.current.mouseHandlers.onMouseMove(3));
+      const { hook } = renderListbox({ selection: singleSelection([selected]) });
+      act(() => mouse(hook).onMouseMove(3));
       const { listId, getOptionProps, selectedOptions } = hook.result.current;
 
       expect(selectedOptions).toEqual([flatOptions[3]]);
@@ -227,7 +232,6 @@ describe('useListbox', () => {
       const selectedOptions = [{ value: 'a' }];
       const { hook } = renderListbox({
         interactiveGroups: true,
-        selectedOptions,
         selection: multiSelection(selectedOptions, { options: flatOptions, interactiveGroups: true }),
       });
 
@@ -243,7 +247,7 @@ describe('useListbox', () => {
       const { hook } = renderListbox();
       expect(hook.result.current.activeDescendantId).toBeUndefined();
 
-      act(() => hook.result.current.mouseHandlers.onMouseMove(3));
+      act(() => mouse(hook).onMouseMove(3));
       expect(hook.result.current.activeDescendantId).toBe(getOptionId(hook.result.current.listId, 3));
     });
   });
@@ -251,18 +255,24 @@ describe('useListbox', () => {
   describe('getListProps', () => {
     test('returns the id, list ref and mouse handlers without keyboard props', () => {
       const { hook } = renderListbox();
-      const { listId, listRef, mouseHandlers, getListProps } = hook.result.current;
-      expect(getListProps({ withKeyboard: false })).toEqual({ id: listId, ref: listRef, ...mouseHandlers });
+      const { listId, listRef, getListProps } = hook.result.current;
+      expect(getListProps({ withKeyboard: false })).toEqual({
+        id: listId,
+        ref: listRef,
+        onMouseUp: expect.any(Function),
+        onMouseMove: expect.any(Function),
+      });
     });
 
     test('adds onKeyDown and aria-activedescendant with withKeyboard', () => {
       const { hook } = renderListbox();
-      act(() => hook.result.current.mouseHandlers.onMouseMove(3));
-      const { listId, listRef, mouseHandlers, onKeyDown, getListProps } = hook.result.current;
+      act(() => mouse(hook).onMouseMove(3));
+      const { listId, listRef, onKeyDown, getListProps } = hook.result.current;
       expect(getListProps({ withKeyboard: true })).toEqual({
         id: listId,
         ref: listRef,
-        ...mouseHandlers,
+        onMouseUp: expect.any(Function),
+        onMouseMove: expect.any(Function),
         onKeyDown,
         nativeAttributes: { 'aria-activedescendant': getOptionId(listId, 3) },
       });
@@ -278,7 +288,7 @@ describe('useListbox', () => {
       keyDown(KeyCode.down);
       expect(scrollToIndex).toHaveBeenLastCalledWith(1);
 
-      act(() => hook.result.current.mouseHandlers.onMouseMove(4));
+      act(() => mouse(hook).onMouseMove(4));
       expect(scrollToIndex).toHaveBeenLastCalledWith(4);
       expect(scrollToIndex).toHaveBeenCalledTimes(2);
     });
@@ -287,14 +297,13 @@ describe('useListbox', () => {
   describe('announceSelected', () => {
     test('is true only when the highlighted option is selected', () => {
       const { hook } = renderListbox({
-        selectedOptions: [{ value: 'c' }],
         selection: singleSelection([{ value: 'c' }]),
       });
 
-      act(() => hook.result.current.mouseHandlers.onMouseMove(3));
+      act(() => mouse(hook).onMouseMove(3));
       expect(hook.result.current.announceSelected).toBe(true);
 
-      act(() => hook.result.current.mouseHandlers.onMouseMove(4));
+      act(() => mouse(hook).onMouseMove(4));
       expect(hook.result.current.announceSelected).toBe(false);
     });
   });
@@ -302,16 +311,15 @@ describe('useListbox', () => {
   describe('announcement', () => {
     test('announces the highlighted option, with selectedAriaLabel when it is selected', () => {
       const { hook } = renderListbox({
-        selectedOptions: [{ value: 'c' }],
         selection: singleSelection([{ value: 'c' }]),
         selectedAriaLabel: 'Selected',
       });
       expect(hook.result.current.announcement).toBe('');
 
-      act(() => hook.result.current.mouseHandlers.onMouseMove(3));
+      act(() => mouse(hook).onMouseMove(3));
       expect(hook.result.current.announcement).toBe('Selected C');
 
-      act(() => hook.result.current.mouseHandlers.onMouseMove(4));
+      act(() => mouse(hook).onMouseMove(4));
       expect(hook.result.current.announcement).toBe('D');
     });
   });
```
