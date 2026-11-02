# OptionList PR: impact on Select / Multiselect (and other options-list consumers)

Range: base `origin/refactor/move-shared-listbox-parts` (6c48dd2c1) ... head `origin/feat/add-option-list` (24524f9b9), 60 files, 22 commits.

## Summary

Four changes in the OptionList PR change Select/Multiselect behavior. All four are in shared listbox code, and each came from its own commit:

| # | Change | File | Commit | Select | Multiselect |
|---|---|---|---|---|---|
| A | Type-ahead matches each option on its own content (no group header for a matching child, no children of a matching group) | `src/internal/components/listbox/use-type-ahead.ts:27-30` | b5f875a26 | yes | yes |
| B | Type-ahead ignores keys with `event.defaultPrevented` (Space that opened the dropdown / selected an option no longer enters the search buffer) | `use-type-ahead.ts:83-84` | ad1132a99 | yes | yes |
| C | `renderOption` `item.parent.disabled` now reflects the group, not the option | `src/internal/components/listbox/parts/item.tsx:99,140` | e0bed93c2 | yes | yes |
| D | Hidden disabled-reason description is rendered when `renderOption` returns custom content (before: `aria-describedby` pointed at an id that wasn't in the DOM) | `item.tsx:276-280` | eb9030d45 | yes | yes |

Autosuggest and PropertyFilter are not affected: they don't use `useTypeAhead` or `listbox/parts/item.tsx`, and every other shared-code hunk is neutral (only active when OptionList passes a new optional prop). No Select/Multiselect/Autosuggest snapshot entries changed; all snapshot hunks are OptionList additions.

The base versions of the Select, Multiselect, Autosuggest, PropertyFilter, options-list, selectable-item and listbox unit tests all pass against the head code (70 suites, 1106 tests). So the existing test suite did not catch A–D. Only the tests the PR added detect them, plus the edited multiselect integ test (A).

Recommendation: variant (b). Put A, B and D behind internal flags that only OptionList passes, and handle C inside `src/option-list/internal.tsx` without touching shared code. That reverts Select/Multiselect exactly to base and keeps every OptionList test green. All four are arguably bug fixes for Select/Multiselect too (D in particular fixes a dangling `aria-describedby`), so they could be proposed again in a separate PR after OptionList lands.

## Evidence: every non-OptionList hunk

OptionList-only files (not classified): `src/option-list/**`, `pages/option-list/**`, `src/test-utils/dom/option-list/**`, `listbox/use-listbox.ts`, `listbox/index.tsx`, `listbox/parts/list.tsx`, the i18n `option-list` blocks. Grep confirms that only `src/option-list/internal.tsx` imports `listbox/index.tsx` and `use-listbox.ts`, and only `listbox/index.tsx` imports `parts/list.tsx`.

| File / hunk | Classification | Evidence |
|---|---|---|
| `build-tools/utils/pluralize.js` (+`OptionList`) | NEUTRAL (tooling) | New map entry only. |
| `eslint.config.mjs` (restricted-imports rule for option-list + listbox engine files) | NEUTRAL (lint) | No runtime effect. |
| `src/__tests__/required-props-for-components.ts` (+`option-list`) | TEST-ONLY | |
| `src/__tests__/snapshot-tests/**` (documenter, test-utils selectors, wrappers) | TEST-ONLY, OptionList additions | `git diff -U0` contains no `-` lines. The added names are `OptionList*` only. |
| `src/i18n/messages-types.ts`, `all.*.json` (`option-list.i18nStrings.selectedAriaLabel`) | NEUTRAL | New namespace only. |
| `listbox/use-type-ahead.ts` hunk 1: `filterOptions(options,…)` → per-option `filterOptions([option],…)` | **BEHAVIOR CHANGE (A)** | Used by `src/select/internal.tsx:174` (`handleNativeSearch`, `filteringType='none'`) and `src/multiselect/use-multiselect.tsx:174` (`wrapperOnKeyDown`, interactive groups). Before: typing a letter that matches a child highlighted its group header in Multiselect (`'o'` → "First category"). Typing a group label prefix highlighted or selected that group's first child in Select (e.g. closed Select, `'c'` with group "Compute" → selects EC2). After: only options whose own fields match. |
| `listbox/use-type-ahead.ts` hunk 2: `if (event.defaultPrevented \|\| …) return` | **BEHAVIOR CHANGE (B)** | `useTriggerKeyboard` calls `preventDefault` on Space, and `useMenuKeyboard` does so too when `preventNativeSpace` is set (`use-select.ts:170`, which is the case when there is no filter or there is a keyboard highlight). Before: that Space was appended to the 500 ms type-ahead buffer, so `Space` then `g` searched `" g"` and matched nothing. After: Space is skipped, so `g` matches. |
| `listbox/parts/item.tsx` +`hideTopDivider` prop / pass-through to `SelectableItem` (lines 46-47, 168, 318, 360) | NEUTRAL | Set only by `src/option-list/internal.tsx:195` (`hideTopDivider: index === 0` via `getOptionProps`). Select/Multiselect never set it, so the value is `undefined`. |
| `item.tsx:99, 140` `parent.disabled: props.disabled` → `props.parentProps.disabled` | **BEHAVIOR CHANGE (C)** | `parentProps.disabled` comes from `render-options.tsx:110` (`nestedDropdownOption.option.disabled`, the group). Before, `parent.disabled` copied the child's own disabled state. `renderOptions` is used by `select/parts/virtual-list.tsx:92` and `listbox/parts/plain-list.tsx:97`, so the `renderOption` arguments change in both Select and Multiselect. Example: a disabled child in an enabled group used to get `parent.disabled === true` and now gets `false`. |
| `item.tsx:276-280` `!renderResult && isDisabledWithReason` → `isDisabledWithReason`; tooltip now gated on `!renderResult` | **BEHAVIOR CHANGE (D)** | With `renderOption` + `disabledReason`, Select/Multiselect now render `descriptionEl` (a hidden span) inside the option, and `aria-describedby` resolves. Before, nothing was rendered, though `ariaDescribedby` (line 314/357) was still set. The tooltip behavior with custom content is unchanged (still not shown). |
| `listbox/parts/scroll-to-index.ts` +`scrollOptionIntoView` export | NEUTRAL | The only caller is `listbox/parts/list.tsx:53` (OptionList). The default export used by `select/parts/virtual-list.tsx:11` and `plain-list.tsx:17` is unchanged. |
| `options-list/index.tsx` `statusType` optional, default `'finished'` | NEUTRAL | The only read is `statusType === 'pending'` (line 108), so `undefined` and `'finished'` behave the same. All existing callers pass it: autosuggest `options-list.tsx:80`, button-dropdown `internal.tsx:524`, select menuProps. It was required before, so TypeScript enforced that. The type widening is internal and not public. |
| `options-list/index.tsx` +`onMouseLeave` | NEUTRAL | Only `use-listbox` / `option-list/internal.tsx:183` sets it. Select's `MenuProps` never includes it. A `undefined` React handler is a no-op. |
| `options-list/utils/use-keyboard.ts` `closeDropdown` optional; Escape handled only if provided | NEUTRAL | The callers are `select/utils/use-select.ts:166` (always passes `closeDropdown`, shared by Select and Multiselect) and `use-listbox.ts:151` (omits it, OptionList). |
| `selectable-item/{index.tsx,interfaces.ts}` +`hideTopDivider` → class `hide-top-divider` | NEUTRAL | The class is added only when the prop is truthy. The prop is destructured, so it is not spread to the DOM. |
| `selectable-item/styles.scss` `&.hide-top-divider:not(...)` | NEUTRAL | The selector requires the new class, so no CSS applies without it. |
| `listbox/__tests__/use-type-ahead.test.ts` (+6 tests) | TEST-ONLY (encodes A, B) | |
| `select/__tests__/native-search.test.tsx` (new, 3 tests), `multiselect/__tests__/native-search.test.tsx` (new, 5 tests) | TEST-ONLY (encodes A, B) | |
| `select/__tests__/render-option.test.tsx`, `multiselect/__tests__/render-option.test.tsx` (+2 tests each) | TEST-ONLY (encodes C, D) | |
| `multiselect/__integ__/multiselect.test.ts` (3 expectations: `'o'`→option1, `'oo'`→option3, 5×`'o'`→option1) | TEST-ONLY integ expectation change (encodes A) | The base expectations (`First category`, `option1`, 7×`'o'`) describe the old group-header matching. |

## Empirical results

Setup: a throwaway detached worktree `/tmp/ol-impact` at head, with symlinked `node_modules` and Node 22. `quick-build` first failed with TS2742 (the symlinked `node_modules` resolved `csstype` outside the project), so I set `"preserveSymlinks": true` in that worktree's `tsconfig.json` only.

1. Base tests against head code. I checked out base `src/{select,multiselect,autosuggest,property-filter}/__tests__`, `src/internal/components/{options-list,selectable-item,listbox}/__tests__`, and deleted the head-only `select/__tests__/native-search.test.tsx` and `multiselect/__tests__/native-search.test.tsx`. Result: **70 suites, 1106 tests, all passed.** The pre-existing unit tests don't detect A–D. The multiselect integ test (browser) was not run, but its diff shows the base expectations fail under A.

2. Revert each change alone against the head tests. I ran OptionList, Select, Multiselect, listbox, Autosuggest, options-list and selectable-item tests (64 suites, 862 tests) for each experiment:

| Reverted | Failing tests |
|---|---|
| A (per-option match) | **OptionList:** group-state › type-ahead › "multi: highlights the option that matches, not its group, and Enter selects only that option"; "multi: repeating a key cycles through the matching group and options, skipping a disabled group"; "single: skips the options of a group whose label matches". **Select:** native-search › "typing a group label prefix does not select an option inside that group". **Multiselect:** native-search › "highlights the matching option inside a group rather than the group", "Enter after typing selects only the matching option inside a group", "repeating a character does not cycle into group children that do not match". **useTypeAhead:** 4 "with groups" tests. Total: 11 failures. |
| B (defaultPrevented) | **OptionList:** keyboard › "type-ahead after Space selects moves the highlight to the matching option". **Select:** native-search › "typing right after opening the dropdown with Space…", "typing right after selecting with Space…". **Multiselect:** native-search › "typing right after selecting with Space…". **useTypeAhead:** "ignores keys that were already handled by another handler". Total: 5 failures. |
| C (parent.disabled) | **OptionList:** render-option › "single: parent reflects the group state…", "multi: parent reflects the group state…". **Select/Multiselect** render-option › "parent reflects the disabled state of the group, not of the option". Total: 4 failures. |
| D (disabled-reason description) | **OptionList:** disabled › "describes the disabled option with its disabled reason when renderOption is used (single)" and "(multi)". **Select/Multiselect** render-option › "keeps the disabled reason description for screen readers with custom content". Total: 4 failures. |

Every OptionList test that depends on A–D is listed above. No other test failed in any experiment.

## Revert plan (single commit)

### Variant (a): plain revert. OptionList loses the behavior too.

Commit: `revert: Restore Select and Multiselect type-ahead and renderOption behavior`

- `src/internal/components/listbox/use-type-ahead.ts`: restore the base `filter` (`filterOptions(options, searchText, true).filter(option => interactivityCheck(option))`) and `if (!key || key.length !== 1)`, and drop the two comments.
- `src/internal/components/listbox/parts/item.tsx`: lines 99 and 140 back to `disabled: props.disabled`. Restore `const disabledReasonElement = !renderResult && isDisabledWithReason && (`, drop the comment, and restore the tooltip condition to `highlighted && canShowTooltip`. Keep the `hideTopDivider` hunks.
- `src/multiselect/__integ__/multiselect.test.ts`: restore the 3 base expectations.
- Delete `src/select/__tests__/native-search.test.tsx` and `src/multiselect/__tests__/native-search.test.tsx`.
- `src/select/__tests__/render-option.test.tsx`, `src/multiselect/__tests__/render-option.test.tsx`: remove the 2 added tests from each.
- `src/internal/components/listbox/__tests__/use-type-ahead.test.ts`: remove the 6 added tests.
- OptionList tests: remove or rewrite the 8 tests listed above (3 group-state type-ahead, 1 keyboard, 2 render-option, 2 disabled). With the old behavior, OptionList multi type-ahead would highlight group headers, Space would pollute the buffer, `parent.disabled` would mirror the option, and custom content would have a dangling `aria-describedby`.
- Size: about 10 source lines, about 300 test lines removed. This is a user-visible regression in OptionList, and reintroduces a known a11y bug (D) there.

### Variant (b): keep the behavior OptionList-only. Recommended.

Commit: `fix: Limit OptionList listbox fixes to OptionList`

- **A + B** in `use-type-ahead.ts`: add two optional props to `UseTypeAheadProps`, both default `false`, and restore base behavior when they are false:
  - `matchOwnContent?: boolean`. When true, use the per-option filter. Otherwise use the base `filterOptions(options, …).filter(interactivityCheck)`.
  - `skipHandledKeys?: boolean`. When true, return early on `event.defaultPrevented`.
  - Thread them only from `src/internal/components/listbox/use-listbox.ts:271` (`useTypeAhead({ …, matchOwnContent: true, skipHandledKeys: true })`). `select/internal.tsx:174` and `multiselect/use-multiselect.tsx:174` stay unchanged.
  - Size: about 8 source lines.
- **C**: revert `item.tsx:99,140` to `props.disabled`. Then in `src/option-list/internal.tsx` `renderOriginalOption`, build the parent from the group: `const parent = item.parent && { ...toGroupItem(item.parent), disabled: !!item.parent.option.disabled };`. In OptionList, the flattened group's `DropdownOption.disabled` equals `group.disabled`, which is the value `render-options.tsx:110` used. No shared threading is needed. Size: 2 shared lines reverted, 1–2 OptionList lines.
- **D**: in `item.tsx`, add the optional `ItemProps.describeDisabledReasonWithCustomContent?: boolean`. Use `const disabledReasonElement = (describeDisabledReasonWithCustomContent || !renderResult) && isDisabledWithReason && (…)`, and keep the tooltip gated on `!renderResult`. Then the base tooltip behavior and the base "nothing rendered" behavior hold for Select/Multiselect. Destructure the prop so it isn't spread. Set it only in `src/option-list/internal.tsx` `getOptionProps` next to `hideTopDivider` (line ~195). `get-item-props.ts` already forwards arbitrary `getOptionProps` keys to `Item`. Size: about 5 lines.
- Tests:
  - Delete `src/select/__tests__/native-search.test.tsx` and `src/multiselect/__tests__/native-search.test.tsx`.
  - Remove the 2 added tests from each of `select/__tests__/render-option.test.tsx` and `multiselect/__tests__/render-option.test.tsx`.
  - Restore the 3 base expectations in `src/multiselect/__integ__/multiselect.test.ts`.
  - In `listbox/__tests__/use-type-ahead.test.ts`, keep the 6 added tests but pass `matchOwnContent: true` / `skipHandledKeys: true`. Optionally add 2 tests asserting the default keeps the base behavior.
  - The OptionList tests stay unchanged and should pass.
  - Size: about 200 test lines removed, about 10 changed.
- Keep as is (neutral): `hideTopDivider` (item / selectable-item / scss), `scrollOptionIntoView`, the `statusType` default, `onMouseLeave`, optional `closeDropdown`.
- Verify:
  1. `npm run quick-build` (Node 22).
  2. `TZ=UTC npx jest -c jest.unit.config.js src/option-list src/select src/multiselect src/internal/components/listbox src/internal/components/options-list src/internal/components/selectable-item src/autosuggest`.
  3. Diff `src/internal/components/listbox/use-type-ahead.ts` and `parts/item.tsx` against base: only the flag code should remain.

Cleanup: `/tmp/ol-impact` was removed with `git worktree remove --force /tmp/ol-impact`. It no longer exists and is not in `git worktree list`. I also ran `git worktree prune`, which only drops worktree entries whose directories are already missing. No other worktree was touched.
