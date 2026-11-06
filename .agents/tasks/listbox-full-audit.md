# Listbox stack: full audit (Select, Multiselect, OptionList)

Read-only. Code read at `.worktrees/option-list-on-use-listbox` (`feat/add-option-list-v2`, tip `aa5383ed2`, = #5204 `8875ae167` + #5239 local `5dc61eeb4` + OptionList). GitHub state read with `gh` on 2026-11-03. Nothing was edited, built or run. Paths below are relative to `src/` unless they start with `pages/` or `.agents/`.

## Summary

The core of Andrei's request is done locally. `useSelect` and `useOptionList` both build on `useListbox`, which owns highlight, keyboard navigation, choosing, mouse handling, row props, scrolling, the active descendant, the announcement and the base list props. Select/Multiselect behavior does not change in #5204, #5239 or #5180. What's left falls into four groups:

1. **Unfinished sharing, no behavior change (do now).** Each component still hand-wires the same `PlainList`/`VirtualList` props (`highlightType`, `screenReaderContent`, `ref`, `selectionType`, `isMultiSelect`, `getOptionProps`). `isMultiSelect` is passed twice in OptionList and as a literal in Multiselect. `UseListboxProps` takes `selectedOptions` and `interactiveGroups` even though `selection` already holds both. `useListbox` returns `mouseHandlers`, which no production code uses. `OptionsList.onMouseLeave`, added by #5180, has no caller. Shared names still say Select (`SelectListProps`, `SelectListRef`, `'select-list-'`, `menuProps`). `use-listbox.ts` imports a type from a component file (`parts/plain-list`). OptionList rebuilds test indexes that `prepareOptions` already generates. All of these are XS–S.
2. **Behavior changes (follow-up fix PRs).** These are the 10 behaviors already listed in the plan: A, B, G (type-ahead), C, D (renderOption), Home/End, wrap past empty groups, scroll on repeated keyboard, stale `aria-activedescendant` and highlight following options. There are also three remaining differences that the plan doesn't list yet: embedded Multiselect focus entry vs OptionList's, the highlight-on-open order (selection order vs list order), and Select's mount scroll at index -1.
3. **Inaccurate text.** The `aa5383ed2` commit message wrongly says `aria-activedescendant` is set when nothing is highlighted. One of the 3 docstring findings is still open; the other two are obsolete or fixed. A test still presses End twice for a removed assertion. The #5180 and #5239 descriptions are out of date, and the #5180 description has broken `<details>` markup. Five resolved Copilot threads on #5180 have replies that say "Fixed" for behavior that has since been reverted or dropped. Most of the plan files describe designs that no longer exist (`useInlineListbox`, `scrollOn`, the `Listbox` wrapper, `use-listbox-core`).
4. **Stack.** #5239 needs a fast-forward push. #5180 needs a force-push of `feat/add-option-list-v2` over `feat/add-option-list`. #5208 is unusable as it stands: it carries a stale duplicate of every OptionList commit on an old #5204 head (`33cfa9917`). It has to be rebuilt on the new #5180, or closed and replaced by the planned fix PRs. #5204 is 12 commits behind `main`, deferred per your instruction.

## A. Remaining duplication between OptionList and Select/Multiselect

| # | What | Evidence | Class | Size | Recommendation |
|---|---|---|---|---|---|
| A1 | List render props assembled by hand in 4 places | `select/internal.tsx:312-324`, `multiselect/internal.tsx:244-262`, `multiselect/embedded.tsx:79-90`, `option-list/internal.tsx:202-226` all pass `ref={scrollToIndex}`, `highlightType`, `screenReaderContent={announcement}`, `getOptionProps`, `filteredOptions`, `filteringValue` | 1 (#5239) | S | Have `useListbox` return `listRenderProps` (or `getListRenderProps()`): `{ ref: scrollToIndex, highlightType, screenReaderContent: announcement, getOptionProps, selectionType: selection.selectionType }`, and spread it in all 4. Leave `filteringValue`, `listBottom`, `hasDropdownStatus`, `firstOptionSticky`, `renderOption` and `scrollStrategy` per caller. |
| A2 | `selectionType` / `isMultiSelect` | Multiselect passes `selectionType="multi"` and `isMultiSelect={true}` as literals (`multiselect/internal.tsx:257,261`, `embedded.tsx:86,89`). OptionList sets `isMultiSelect` in `listProps` (`use-option-list.ts:63`) **and** passes it again as a prop (`internal.tsx:209`). PlainList's own prop overrides the spread one (`plain-list.tsx:100-103`). | 1 (#5239) | S | Put `isMultiSelect: selection.selectionType === 'multi' \|\| undefined` into `getListProps`. Drop the `isMultiSelect` prop from `SelectListProps` and read it from `menuProps` in PlainList and VirtualList (`virtual-list.tsx:108,125`). `OptionsList` renders `aria-multiselectable` only when it's true (`options-list/index.tsx:139`), so the DOM doesn't change. Take `selectionType` from A1. |
| A3 | `getOptionProps` overrides | OptionList adds `hideTopDivider`, test classes, `data-option-index` and `data-value` (`option-list/internal.tsx:213-224`). Select uses plain `getOptionProps`. | 3 | — | Keep. These are OptionList's test-utils and inline styling. See A5 for `data-option-index`. |
| A4 | Option flattening | Select and Multiselect use `prepareOptions` (flatten + filter + `generateTestIndexes`) (`select/internal.tsx:125`, `use-multiselect.tsx:111`). OptionList calls `flattenOptions` and builds its own `leafIndexes` map (`option-list/internal.tsx:99-104`). | 1 (#5180) | S | Call `prepareOptions(internalOptions, 'none', '')`. You get `parentMap` and the test indexes for free, and `getItemProps` then sets `data-test-index`/`data-group-index`/`data-child-index` on OptionList rows like Select's. That's a DOM addition to an unreleased component. |
| A5 | 1-based option index for test-utils | `data-option-index` (`internal.tsx:221`) duplicates `data-test-index` (`throughIndex`, `options-list/utils/test-indexes.ts`) | 1 (#5180) | XS | After A4, have the OptionList test-utils use `data-test-index` and drop `leafIndexes`. Optional. Only test-utils selectors change, and they're new in #5180. |
| A6 | Value checks | Select and Multiselect call `checkOptionValueField(..., options)` with the raw options. OptionList passes `leafOptions` (`internal.tsx:108`) and adds duplicate-value and duplicate-group-value warnings (`:109-117`), recomputed on every render outside the `useMemo`. | 1 (#5180) for the call. 3 for the warnings. | XS | Pass `options` like Select does; the result is the same because groups pass the check. Move the two `Set` computations into the `useMemo`. The uniqueness warnings stay OptionList-only, because only OptionList documents values as unique. Adding them to Select would be a new dev warning (class 2, optional). |
| A7 | i18n `selectedAriaLabel` | Select/Multiselect: `useInternalI18n('select')('selectedAriaLabel', ...)` (`select/internal.tsx:102`, `use-multiselect.tsx:96`). OptionList: `'option-list'` namespace, `i18nStrings.selectedAriaLabel` (`internal.tsx:161`). | 3 | — | Keep. OptionList has its own namespace by decision (`64f2c28c7`). The string itself is passed the same way into `useListbox`. |
| A8 | `renderOption` mapping | OptionList maps items back to public objects (`internal.tsx:173-191`). Select/Multiselect pass the renderer straight through. | 3 | — | Keep (OptionList's own option types and `icon` slot). |
| A9 | `renderHighlightedAriaLive` mapping | OptionList wraps the callback to return public objects (`internal.tsx:162-169`). Select passes it straight through. | 3 | — | Keep, same reason as A8. |
| A10 | Type-ahead call | Select: `useTypeAhead` that selects when closed and highlights when open (`select/internal.tsx:175-180`). Multiselect: open only, `filteringType === 'none'` (`use-multiselect.tsx:175-181`). OptionList: always on (`use-option-list.ts:101-107`). | 3 | — | Keep. It's already one shared hook; only the settings differ per component, as decided in the plan. |
| A11 | Root wiring | Select: root `onKeyDown={handleNativeSearch}` (`select/internal.tsx:290`). Multiselect: `getWrapperProps()` (`use-multiselect.tsx:261`, `internal.tsx:224`). OptionList: `onKeyDown={onTypeAhead}` plus `onMouseLeave` (`option-list/internal.tsx:199-200`). | 1 (#5180) | XS | Have `useOptionList` return `getRootProps()` (`onKeyDown`, `onMouseLeave`), like `useMultiselect.getWrapperProps`. Cosmetic. |
| A12 | Focus layer for a list that is its own tab stop | Embedded Multiselect: focus does `goHome` only when nothing is highlighted, and blur resets (`use-select.ts:222-231`). OptionList: focus highlights the first selected option in list order, otherwise `goHome`; skipped after a pointer down. Blur resets, and mouse leave resets when not focused (`use-option-list.ts:66-100`). | 2 | M | One shared focus layer would change embedded Multiselect (PropertyFilter) focus behavior. Follow-up fix PR: embedded Multiselect adopts OptionList's focus entry, then the layer moves into `useListbox` (for example `getListProps({ withKeyboard, withFocus })`). Needs an a11y review. |
| A13 | Highlight on open vs focus entry order | Select/Multiselect open with the keyboard on `__selectedOptions[0]`, which is selection order (`use-select.ts:241-242`). OptionList uses list order (`use-option-list.ts:78-80`). | 2 | S | Follow-up, or keep with a written reason. The ARIA listbox pattern favors list order. |
| A14 | `useForwardFocus` | Select forwards to the trigger (`use-select.ts:285`); OptionList forwards to the list (`internal.tsx:171`). | 3 | — | Keep. The focus targets differ by design. |
| A15 | Escape | Select closes the dropdown; OptionList doesn't handle Escape (`onEscape` omitted). | 3 | — | Keep (OptionList has no popup). |
| A16 | Scroll strategy | Select uses `menu` and OptionList uses `ancestors` (`internal.tsx:212`). VirtualList accepts `scrollStrategy` through `SelectListProps` but ignores it. | 3. VirtualList part: 1 | XS | Keep the difference. Document on `scrollStrategy` that only PlainList honors it, or `Omit` it from VirtualList's props. |
| A17 | Select scrolls at index -1 on mount | `scrollOptionIntoView` returns early for `index < 0` (`scroll-to-index.ts:10-12`). Select's default `scrollToIndex` doesn't, so it can scroll its menu to a non-interactive group header (`data-mouse-target="-1"`). | 2 | XS | Low-impact follow-up (the scroll stays inside the menu). Add it to the follow-up list. |
| A18 | Status, load-more, mouse-down and tokens code duplicated between Select and Multiselect | `select/internal.tsx:224-260` vs `use-multiselect.tsx:183-230`; `handleMouseDown` vs `dropdownOnMouseDown`; tokens built twice (`use-multiselect.tsx:232-246` vs `multiselect/internal.tsx:166-180`) | 3 (out of scope) | — | Dropdown concerns, left out by decision (stack plan, "Decided to leave out"). The duplicated token list is code that predates the stack; don't touch it here. |

## B. Leftovers and inconsistencies

| # | What | Evidence | Class | Size | Recommendation |
|---|---|---|---|---|---|
| B1 | `UseListboxApi.mouseHandlers` has no production consumer | `use-listbox.ts:83,207`; only `use-listbox.test.tsx` reads it | 1 (#5239) | XS | Remove it from the API; `getListProps` covers it. Update the test to read from `getListProps`. |
| B2 | Redundant inputs: `selectedOptions` and `interactiveGroups` next to `selection` | `use-listbox.ts:37,41`. Every caller passes values equal to `selection.selectedOptions` and `selection.interactiveGroups` (`use-select.ts:88-90`, `use-option-list.ts:45-47`; `singleSelection` slices to 1 item, the same as `[selectedOption]`) | 1 (#5239) | S | Read both from `selection`. This is the change `use-listbox-in-select.md` first made and then reverted; ask whether to redo it. `useSelect`'s own `useInteractiveGroups` prop stays. |
| B3 | `OptionsList.onMouseLeave` is dead | Added in #5180 (`options-list/index.tsx:37,76,132`), but OptionList attaches mouse leave to its root and types `listProps` as `Omit<ListElementProps, 'onMouseLeave'>` (`use-option-list.ts:59`) | 1 (#5180) | XS | Remove the prop and the `Omit`. The `4dddb67ef` message says "onMouseLeave … stay", which will then be historical only. |
| B4 | Hook imports a type from a component file | `use-listbox.ts:20` imports `SelectListProps` from `parts/plain-list` | 1 (#5239) | XS | Move the ref type into `listbox/interfaces.ts` as `ScrollToIndexRef = (index: number) => void`. PlainList and VirtualList import it from there. |
| B5 | Select-named shared types and ids | `SelectListProps`, `SelectListProps.SelectListRef` (`plain-list.tsx:21-44`, `virtual-list.tsx`); `useUniqueId('select-list-')` (`plain-list.tsx:64`, `virtual-list.tsx:91`) | 1 (#5239) | S | Rename to `ListProps`/`PlainListProps` and `ScrollToIndexRef`. Changing the `'select-list-'` prefix is optional: it only feeds the fallback `props.id ?? \`${idPrefix}-option-${index}\`` in `render-options.tsx:97`, which never runs because `getListboxOptionProps` always sets `id`. Don't remove the `useUniqueId` call, so ids generated after it stay the same. |
| B6 | `menuProps` naming in shared code | PlainList and VirtualList prop `menuProps` (`plain-list.tsx:22`), `menuRef`. `useSelect` uses `listId: menuId` and `getMenuProps` (`use-select.ts:108,216`). `getOptionId(menuId, …)` (`options-list/utils/use-ids.ts:3`). | 1. Shared part: #5239. `useSelect`: leave. | S | Rename PlainList/VirtualList's `menuProps` to `listProps` (rename only, 6 files). Keep `getMenuProps`/`menuId` inside `useSelect`: renaming them would edit `use-select.test.ts`, and "menu" fits the dropdown. |
| B7 | Listbox parts still import Select's styles | `listbox/parts/item.tsx:22`, `option-group.tsx:6`, `plain-list.tsx:19` import `select/parts/styles.css.js` (classes `item`, `checkbox`, `selected-icon`, `show-label-tag`, `disabled-reason-tooltip`, `option-group`, `virtual`, `list-bottom`). Test-utils `test-utils/dom/internal/option.ts`, `select/index.ts` and `multiselect/index.ts` read the same selectors. | 1 (own refactor PR after OptionList) | M | Moving the classes changes their hashed names and the test-utils-selectors snapshot, so it's not a pure move. Run it as its own `refactor:` PR after the stack. Known open item since `use-listbox-in-select.md` (review issue 2). |
| B8 | `VirtualList` lives in `select/parts` but is shared | `select/parts/virtual-list.tsx` used by Select, Multiselect and embedded | 1 (optional) | S | Move it to `listbox/parts` next to PlainList, in the same PR as B7. OptionList doesn't need it. |
| B9 | `renderOptions` `ariaSetsize` is never passed | `render-options.tsx:26,43,80`; no caller passes it | 1 (optional) | XS | Remove it. This dead parameter came along unchanged from `main`. |
| B10 | Loose types | `getListboxOptionProps` returns `any` (`option-props.ts:39`), so `UseListboxApi.getOptionProps` is `any`. `render-options.tsx:18` and `get-item-props.ts:9` use `getOptionProps: any`. | 1 (optional, #5239) | S | Type the result as `ItemProps`-compatible. Optional. |
| B11 | Open docstring finding 1 | `UseListboxApi.activeDescendantId` says "undefined when nothing is highlighted" (`use-listbox.ts:70`). It's undefined only at index -1; after the options shrink, a stale index still produces an id. | 1 (#5239, `97391cac5`) | XS | Reword to "undefined when `highlightedIndex` is -1". Finding 2 (raw setters bypass scroll requests) is **obsolete**: `scrollOn` is gone. Finding 3 ("as before" comment) is **fixed**: `use-option-list.ts:33` now states the constraint. |
| B12 | `scrollToIndex` docstring | `use-listbox.ts:72` says "whenever the highlight changes"; the effect is keyed on `highlightedIndex` only (`:182-184`) | 1 (#5239) | XS | Say "whenever the highlighted index changes". That's exactly follow-up 1's gap, so the wording should be precise. |
| B13 | Inaccurate commit message (unpushed) | `aa5383ed2` body: "aria-activedescendant is always set, also when no option is highlighted". `getOptionId(listId, -1)` is undefined, and `option-list/__tests__/keyboard.test.tsx` "blur clears the highlight and aria-activedescendant" asserts the attribute is absent. | 4 | XS | Reword to "can name a row that no longer exists after the options shrink". The commit is local only, so the message can be amended with your OK. |
| B14 | Leftover from removed assertion | `option-list/__tests__/highlight.test.tsx` "keyboard moves scroll the highlighted option into view" still presses `[down, end, end, home, up]`. The second End no longer scrolls; `lastScrolledValue()` just repeats `'special'`. | 1 (#5180) | XS | Drop the second `KeyCode.end` (and its `'special'`), or add a comment that it stays for follow-up 1. Today it reads as if a repeated End scrolls. |
| B15 | Home/End integ risk | Home/End `preventDefault` was dropped for OptionList (`abbec7ab8`). `__integ__/option-list-scroll.test.ts` `assertKeyboardScrolling` presses End and Home with `container=page`, so the native page scroll now runs after the list scroll. | 4 | — | Run the OptionList integ tests (or wait for CI) on `aa5383ed2` before pushing. If they fail, it confirms the Home/End follow-up; don't patch it in #5180. |
| B16 | Comments mentioning removed code | Searched `src`, `pages`, `eslint.config.mjs` and `build-tools` for `use-inline-listbox`, `useInlineListbox`, `scrollRequest`, `onKeyboardHighlight`, `keepHighlightOnOptionsChange`, `scrollOn`, `keyboard-request`, `when-highlighted`, `listbox/index`, `withScroll(` and `preventNativeHomeEnd` | — | — | No matches in code. Clean. |
| B17 | Public docs and documenter snapshot | `option-list/interfaces.ts`; the snapshot diff adds only prop and test-utils descriptions | — | — | Nothing promises scroll on repeat, highlight following or an absent active descendant. Clean. The dev pages (`pages/option-list/*`) have no a11y wording about removed behavior. |
| B18 | Missing test-utils method | `OptionListOptionWrapper` has no `findDisabledReason()` (`test-utils/dom/option-list/index.ts`) | 2 (feat follow-up) | S | Already in the stack plan's "After the stack". |
| B19 | Untracked build artifact | `pages/tsconfig.tsbuildinfo` untracked in 3 worktrees | 4 | — | Keep it out of commits. |
| B20 | `useSelect` returns `announceSelected` and `highlightedIndex` that nothing reads except tests and `useMultiselect`'s passthrough | `use-select.ts:304-317` | 3 (came from `main`) | — | Out of scope. |

## C. Stack and process gaps

### Pushes

| PR | Local | Origin | Action |
|---|---|---|---|
| #5204 `refactor/move-shared-listbox-parts` | `8875ae167` | `8875ae167` | Nothing to push. 12 commits behind `main`. Rebasing it would force-push the whole stack, so it's deferred per "don't rebase … yet". |
| #5239 `refactor/use-listbox-in-select` | `5dc61eeb4` (+`97391cac5`, `5dc61eeb4`) | `318ee8036` | Fast-forward: `git push origin refactor/use-listbox-in-select`. Do the #5239 items from A/B first if you want them in this PR; then #5180 needs a rebase onto it. |
| #5180 `feat/add-option-list` | `feat/add-option-list-v2` `aa5383ed2` | `24173f991` | `git push --force-with-lease=feat/add-option-list:24173f991 origin feat/add-option-list-v2:feat/add-option-list`. Local `feat/add-option-list` (`17f00cd92`, checked out in `.worktrees/option-list-rebase`) is stale; don't push it. |
| #5208 `fix/select-multiselect-listbox-alignment` | `f4e7628ca` | `f4e7628ca` | Rebuild (see below). |

### #5208 now

Its base on GitHub is `feat/add-option-list`, but the branch sits on `33cfa9917` (old #5204 head) with its own copy of the 33 OptionList commits (`872248ac5` … `f06a65f61`). Against any new #5180, the diff is meaningless.

| Commit | Content | Status |
|---|---|---|
| `872248ac5` … `f06a65f61` (33) | Old OptionList copies | Obsolete. The new #5180 replaces them. |
| `bffe2b511` | A: non-matching group headers in type-ahead | Port. Touches `use-type-ahead.ts` and its tests, Select/Multiselect `native-search.test.tsx` and the Multiselect integ. Also restore the OptionList type-ahead tests removed in `4dddb67ef`. |
| `9a6e3cebc` | B: ignore handled keys | Port, plus the OptionList "type-ahead after Space" test from `4dddb67ef`. |
| `617320f64` | G: find the highlight by identity | Port. Also answers the Copilot thread about a group and child sharing a value. |
| `c89d20932` | C: `parent.disabled` from the group | Port (`listbox/parts/item.tsx`), plus the OptionList render-option test from `4dddb67ef`. |
| `e2c35fd51` | D: disabled-reason description with custom content | Port, plus the OptionList disabled test text from `4dddb67ef`. |
| `0dd5f74e5` | Home/End `preventDefault` | Port and adapt. It edited `use-select.ts`; the option now belongs in `useListbox` (the call into `useMenuKeyboard`). Restore the OptionList Home/End `defaultPrevented` assertions removed in `abbec7ab8`. |
| `cb3b57c95` | Wrap at the first/last highlightable option | Port and adapt. The `getListboxNavigation` signature change now affects `use-listbox.ts:136-144`, not `use-select.ts`. Restore the OptionList empty-group wrap test removed in `abbec7ab8`. |
| `775731d72` | Trigger redeploy | Drop. |
| `6168f55d3` | OptionList `highlightedOption` argument | Obsolete; that code was deleted. |
| `f4e7628ca` | Settings on `pages/option-list/simple.page.tsx` (+154 lines) | Decide: move it to #5180 as a dev-page commit, or drop it. It's not a fix. |
| (new) | Follow-up 1: scroll on repeated keyboard highlight | Add. Tests from `backup/feat-add-option-list-v2-6023aab41^` (`use-listbox.test.tsx` `scrollOn` cases, `highlight.test.tsx` hovered-option case and `toHaveBeenCalledTimes(5)`), adapted to the chosen API, plus new Select/Multiselect tests. |
| (new) | Follow-up 2: no dangling `aria-activedescendant` (stale index) | Add. Fixes B11's gap for all three components. |
| (new) | Follow-up 3: highlight follows its option on options change | Add. Check the interaction with Select's reset on filter change (`use-select.ts:205-207`). |
| (new) | A12, A13, A17 | Add to the follow-up list (not in the plan today). |

Recommendation: close #5208 and open the planned PRs on top of the new #5180: PR 2 tests, PR 3 type-ahead (A, B, G), PR 4 renderOption (C, D), PR 5 keyboard (Home/End, wrap), plus PR 6 scroll/active-descendant/highlight-follow (follow-ups 1–3). The other option is to force-push #5208 as PR 3 and retitle it. Either way, every fix lands once in shared code and is tested in all three components. Other source branches with ports of these fixes: `fix/listbox-unified-keyboard` `866fcb0c1`, `fix/listbox-unified-type-ahead` `233362761`, `fix/listbox-unified-render-option` `a96893bef`, `fix/select-home-end-page-scroll` `7726b0953`, `fix/select-empty-group-wrap` `7bec02e80`, `fix/render-option-parent-disabled` `0fa07c12e`, `fix/multiselect-type-ahead` `300341c11`.

### PR descriptions

| PR | Problem | Fix |
|---|---|---|
| #5204 | Accurate. Title ends with a space and doesn't follow the repo's sentence-case convention ("refactor: move internal parts and utils from select to listbox ") | Optional: "refactor: Move Select's list parts and utils to listbox" |
| #5239 | Lists helpers, highlight, keyboard, choosing, mouse, row props, announcement and scroll. Missing the active descendant, the scroll ref owned by the hook, and `getListProps`/`listRef` (the base list props shared with OptionList). | Add one sentence once `97391cac5`/`5dc61eeb4` are pushed. Also mention that #5180 builds OptionList on it. |
| #5180 | "Stacked on #5179" is wrong: #5179 is merged and the base is #5239. "runs on the new internal list engine, with OptionList as its only caller" is wrong now: it runs on `useListbox`, which Select and Multiselect share. The `<details><summary>Review checklist</summary>` opening lines are missing, but `</details>` is present. | Rewrite: "Stacked on #5239. Adds OptionList … built on the shared `useListbox` hook (via `useOptionList`), so list behavior is the same code as Select and Multiselect. Where OptionList differed, it now matches Select; the fixes come in follow-up PRs." Restore the template markup. |
| #5208 | Empty description, draft, title "fix: select multiselect listbox alignment" | Replace it, or close it with a pointer to the new PRs. |

### #5180 review threads whose replies must change

| Thread (author) | Current reply / state | Now |
|---|---|---|
| Scroll on repeated keyboard (Copilot, resolved) | "Fixed. Added a counter…" | Dropped. Reply: "Removed so OptionList matches Select; it comes back for all three in follow-up PR <n>." |
| `parent.disabled` (Copilot, resolved) | "Fixed, parent now gets the group's own props" | Reverted by `4dddb67ef`; OptionList has the old behavior too. Reply: "follow-up PR 4". |
| `aria-describedby` with custom content (Copilot, resolved) | "I kept the hidden description mounted…" | Reverted (D). Reply: "follow-up PR 4". |
| Type-ahead highlights a non-matching group (Copilot, resolved) | "Fixed…" | Reverted (A). Reply: "follow-up PR 3". |
| Space enters the type-ahead buffer (Copilot, resolved) | "fixed…" | Reverted (B). Reply: "follow-up PR 3". |
| Highlight not reconciled on options change / dangling active descendant (Copilot, resolved, no reply) | — | Dropped. Reply: "follow-up PR 6". |
| Empty-group wrap (Copilot, resolved, no reply) | — | Dropped. Reply: "follow-up PR 5". |
| Group/child share a value in type-ahead (Copilot, resolved) | "same as select…" | Add: "fixed for all three in follow-up PR 3 (G)". |
| Home/End not prevented (Copilot, open) | — | Reply: "matches Select; follow-up PR 5". |
| Value-less groups lose highlight (Copilot, open) | — | Reply: group values are required (`34d461f9b`), and the highlight-follow code was removed. Resolve. |
| Public group to `renderHighlightedAriaLive` (Copilot, open) | — | Fixed in `1c77e3868`. Reply and resolve. |
| `usePrevious` instead of state (pan-kot, open) and "why a new function" (pan-kot, open) | — | That code is gone (options-change follow removed, `use-inline-listbox.ts` deleted). Reply, and say the follow-up will consider `usePrevious`. |
| "is this rule still needed?" eslint (pan-kot, open) | — | Removed in `86b09864e`. Reply. |
| Split permutations (pan-kot, open) | — | Done in `e9851c7e1`. Reply. |
| "displayed inline" and "why describe this behaviour here" (pan-kot, open) | — | Done in `f17716a4a` ("displayed as a list"). Reply. |

Still correct: focus entry despite hover (still in `use-option-list.ts`), negative-index scroll (`scroll-to-index.ts:10`), `renderOption` types, value required, custom-content announcements (`renderHighlightedAriaLive`), and key by index ("same as select").

### Plan files that are out of date

| File | Out of date | Update |
|---|---|---|
| `.agents/tasks/listbox-stack-plan.md` "Current state" | Old hashes (`6c48dd2c1`, `864c388ef`, `4c06e5e9f`), `.worktrees/option-list-rebase`, push commands for the old branch, "PR 2 bases on `feat/add-option-list`" | Replace with the push table above. |
| same, "Update 2026-11-03" | "rename OptionList's hook to `useInlineListbox`" | Superseded: OptionList is `useOptionList` on `useListbox` (`aa5383ed2`). |
| same, "Update: refactor/use-listbox-in-select" | Says "Not pushed yet" (`318ee8036` is pushed); missing `97391cac5`, `5dc61eeb4` | Update. |
| same, "Follow-up fixes" | Refers to `6023aab41` as on the branch (it's now `backup/feat-add-option-list-v2-6023aab41`; the branch was squashed into `aa5383ed2`). Lists only 1–3, separate from stack rows 3–5. | Merge into one follow-up list (A, B, G, C, D, Home/End, wrap, 1–3, A12, A13, A17) and fix the recovery command: `git show backup/feat-add-option-list-v2-6023aab41^:<path>`. |
| `.agents/tasks/option-list-direct-use-listbox-review.md` | Describes `c2ebf9c1a` (`scrollOn`, `keepHighlightOnOptionsChange`, `activeDescendant`, inline `internal.tsx`, deleted `use-option-list.ts`) | Mark it superseded. Only finding 1 still applies (B11). |
| `.agents/tasks/select-on-listbox-migration-plan.md` | Table and routes refer to `use-listbox-core`, the `Listbox` wrapper, `scrollRequest`, `preventNativeHomeEnd` and `useListbox` as OptionList's layer | Mark PR plan rows 1–3 done (as #5239 and #5180). Rows 4 (shared rendering), 5 (embedded focus = A12), 6 (leftovers) and 7 (test dedup) remain as options. |

## D. Andrei's requests

| Request | Status | Left |
|---|---|---|
| `useSelect` uses `useListbox` under the hood | Done (#5239; `97391cac5` and `5dc61eeb4` local) | Push. |
| OptionList on the same base, like `useMultiselect` on `useSelect` | Done locally (`use-option-list.ts` → `useListbox`, `aa5383ed2`) | Push #5180. |
| List behavior the same, not similar | Mostly. Same code for highlight, arrows/Home/End, choosing, mouse, row props, scroll trigger, active descendant and announcement. Differences on purpose: Escape, scroll strategy, type-ahead settings, i18n namespace. | Behavior differences to fix in follow-ups: A12 (focus entry vs embedded Multiselect), A13 (open/focus order), A17. Plus the 10 planned fixes, so all three gain them together. |
| Shared utils as straightforward hooks (keyboard nav, scroll, native attributes for roles) | Partially. Navigation (`utils/navigation.ts`), mouse/row props (`utils/option-props.ts`), scroll and `aria-activedescendant` (in `useListbox`) are shared. | `aria-multiselectable` (`isMultiSelect`) and `selectionType` are still wired per component (A2). List render props aren't composed (A1). There's dead or duplicated API surface (B1, B2, B3, B4). |
| Folder `src/internal/utils/listbox` (from `use-listbox-in-select.md` open decision 1) | Not done. Code is in `src/internal/components/listbox/`. | Ask Andrei. If he wants the move, do it as a rename-only PR at the end of the stack. |
| Autosuggest out of scope | Agreed (`option-list-direct-use-listbox.md:75`) | — |

## Prioritized action list

1. **#5239 cleanup, no behavior change (S total).** A1 list render props from `useListbox`. A2 `isMultiSelect` in `getListProps`, dropping the PlainList prop. B1 remove `mouseHandlers`. B2 read `selectedOptions`/`interactiveGroups` from `selection` (confirm first). B4 + B5 `ScrollToIndexRef` in `interfaces.ts` and the `ListProps` rename. B6 `menuProps` → `listProps` in PlainList/VirtualList. B11 + B12 docstrings. Verify with the unit, snapshot (no `-u`) and functional suites from the stack plan.
2. **Rebase `feat/add-option-list-v2` onto the updated #5239** and apply the #5180 items (XS–S): B3 remove `OptionsList.onMouseLeave`; A4/A5 `prepareOptions` and test indexes (optional); A6 value check and `useMemo`; A11 `getRootProps`; B14 double End; B13 reword the `aa5383ed2` message. Run the OptionList unit and integ tests (B15).
3. **Push** #5239 (fast-forward), then #5180 (force-with-lease from v2). Needs your go-ahead.
4. **Update the PR descriptions** of #5239 and #5180 (fix the #5180 `<details>` markup).
5. **Reply to the #5180 threads** listed in C, and resolve the ones that are done.
6. **Replace #5208:** close it, or force-push it as the first fix PR. Then build the fix PRs in order: tests, type-ahead (A, B, G), renderOption (C, D), keyboard (Home/End, wrap), scroll/active-descendant/highlight-follow (1–3), embedded focus and open order (A12, A13), A17. Decide on the `f4e7628ca` dev-page settings.
7. **Update the plan files** (C, last table) so the next session starts from the real state.
8. **Later, own PRs:** B7 + B8 move the listbox styles and VirtualList out of `select/parts` (changes the test-utils selectors snapshot). Folder move if Andrei asks. B18 `findDisabledReason()`. B9/B10 optional type and dead-param cleanup.
