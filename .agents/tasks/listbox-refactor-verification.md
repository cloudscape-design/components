# Verification: in-progress listbox refactor (working tree vs HEAD b9c34f236)

## Verdict

**Mostly yes.** The working tree builds, type-checks, lints clean, and every unit suite for the touched areas passes
(Select, Multiselect, OptionList, select-dropdown, list-container, option, Autosuggest, ButtonDropdown, PromptInput,
PropertyFilter, chart-filter, test-utils selectors snapshot). Every unit-test failure in the full suite is either
pre-existing at HEAD or caused by the environment, not by the refactor. Two things are still open. Integration and a11y
tests were not run, and they are the only tests that cover dropdown Escape and real focus. There are also two
behaviour changes that no test catches (see "Behaviour differences").

## What's implemented so far

All six migration steps in `docs/LISTBOX_ARCHITECTURE.md` appear done, except for the doc's own deviations noted below:

1. **Selection models**: `src/option-list/selection/{interfaces,single-selection,multi-selection}.ts`. Used by OptionList (`option-list/internal.tsx:169-172`), Select (`select/internal.tsx:130`) and Multiselect (`multiselect/use-multiselect.tsx:108-112`).
2. **Hook split**: `src/option-list/use-option-list.ts` and `src/internal/components/select-dropdown/use-select-dropdown.ts`. `src/select/utils/use-select.ts` is deleted.
3. **Parts moved**: `option-list/parts/{list,virtual-list,item,option-group,render-options,get-item-props,scroll-to-index,common}.tsx/ts`. `Item` and `MultiselectItem` are merged into `parts/item.tsx` with `selectionType`, and `select/parts/item.tsx` and `multiselect-item.tsx` are deleted. The utils `use-announcement`, `use-type-ahead` (was `use-native-search`), `check-option-value-field` and `connect-options` are in `src/option-list`.
4. **OptionList on `useOptionList`**: `StandaloneOptionList` in `option-list/internal.tsx`. The old workarounds (`isFocused`, `isPointerInside`, dummy `statusType`/`fireLoadItems`) are gone.
5. **Callers on `InternalOptionList`**: Select, Multiselect and embedded Multiselect render `<InternalOptionList __controller=... />`. `trigger`, `filter`, `dropdown-customization`, `use-load-items` and `use-open-state` are in `select-dropdown/`.
6. **Rename and lock**:
   - `options-list` → `list-container` (`ListContainer`), and `use-highlight-option` → `use-highlighted-option`.
   - `DropdownOption` → `ListOption`, with 0 remaining references in `src`/`pages`.
   - The ESLint rule in `eslint.config.mjs:203-223` is unstaged, unlike the rest of the change.
   - Test-utils imports and `test-utils-selectors.test.tsx.snap` are updated.

Deviations from the doc's sample code. These are improvements that the review asked for:

- `InternalOptionList` switches between two components, `ControlledOptionList` and `StandaloneOptionList`, instead of calling a hook conditionally (`option-list/internal.tsx:240-242`).
- The controlled path renders no root wrapper.
- Non-sticky status goes in as `__footer` and renders as the last list row (`listBottom`). Sticky status stays in the Dropdown `footer` slot (`select/internal.tsx:228-238, 289-296`).

## Command results

| Command | Result |
|---|---|
| `npx gulp quick-build` (needed: unit tests import `lib/components`) | PASS, 12 s, no TS errors |
| `npx tsc -p tsconfig.json --noEmit` | PASS, 0 errors |
| `npx tsc -p tsconfig.unit.json --noEmit` | 50 errors, all environmental or pre-existing: `lib.dom` SVG conflicts, `Intl.ListFormat`, `TS1323` dynamic imports in `*/styles.test.tsx`, `live-region/controller.ts:76`, `documenter.test.ts` needing `components-definitions`. None are in changed files. |
| `npx tsc -p pages/tsconfig.json --noEmit` | 2 errors, both in `node_modules/@formatjs` (environmental). Dev pages compile. |
| `eslint` on all staged and unstaged changed files plus `src/option-list`, `select-dropdown`, `list-container` | PASS: 0 errors, 1 warning (`autosuggest/interfaces.ts:276`, `TODO` comment) |
| `stylelint` on moved `.scss` | PASS |
| Targeted jest (13 paths listed in the brief, plus `selectable-item`) | 111/113 suites, 2605 passed, 2 failed. Both failures were missing generated docs (documenter, style-docs). |
| `docs` + `styleDocs` gulp tasks, then `jest src/__tests__/snapshot-tests` | 4/5 suites. `test-utils-selectors` PASS. `documenter` has 3 snapshot failures, all pre-existing (below). |
| Full `jest -c jest.unit.config.js` | 631/645 suites, 13922 passed, 25 failed. All 25 are pre-existing or environmental (below). |

I also checked that every class referenced from `option-list/parts/*` and `select-dropdown/*` exists in that folder's
`styles.scss` (none missing). The compiled `lib` output has no runtime import from `option-list`, `select-dropdown`,
`list-container` or `option` into `select` or `multiselect`, so there is no runtime cycle.

## Failures with root cause

None of the failures come from the refactor.

| Failure | Root cause | Refactor? | Suggested fix |
|---|---|---|---|
| `documenter.test.ts`: option-list definition, test-utils dom, test-utils selectors (3 snapshots) | HEAD commit b9c34f236 "chore: remove grouping" changed `src/option-list/interfaces.ts` and removed `findGroupHeaders`/`findGroupHeaderByValue` from `src/test-utils/dom/option-list/index.ts` without updating `__snapshots__/documenter.test.ts.snap`. The working tree doesn't touch either file. | No, pre-existing | `npm run build` then `TZ=UTC npx jest -u -c jest.unit.config.js src/__tests__/snapshot-tests` |
| `functional-tests/{base-props-support,use-base-component,use-telemetry-usage,outer-form-submit,ssr,test-utils}` for option-list (14 tests) | `src/option-list/index.tsx:18` reads `props.options.length`, but the functional tests render components with no required props. The file is unchanged from HEAD. | No, pre-existing | Add option-list to the required-props map that the functional tests use, or default `options` to `[]` |
| `build-tools/eslint/__tests__/prefer-live-region.test.js` (5) | Repo eslint-rule test, unrelated to changed files | No | — |
| `token-versions`, `theming/index`, `theming/index-ssr`, `flashbar/{flashbar,dismiss,collapsible}` (suite failed to run) | "Must use import to load ES Module" (`@material/material-color-utilities`, `@cloudscape-design/global-styles`). These are ESM loading problems from calling jest directly instead of through `gulp test:unit`. | No, environmental | Run through `npm run test:unit` |

The SSR log also shows `useLayoutEffect` warnings at `option-list/parts/list.tsx:59` (`useContainerQuery`). That code moved
unchanged from `select/parts/plain-list.tsx`, so the warning also happens at HEAD.

## Risks from the review: status in the current code

| Review risk | Status |
|---|---|
| Import cycle `option-list` ↔ `select`/`multiselect` | **Resolved at runtime.** The only remaining imports are `import type` (`option-list/use-announcement.ts:7`, `use-option-list.ts:17`, `parts/item.tsx:16-17`; `select-dropdown/{use-load-items,use-select-dropdown,filter,trigger}.ts(x)`). The new ESLint rule allows these via `allowTypeImports`, and they are erased in `lib`. Layer 0 `internal/components/option/utils/prepare-options.ts:4` still imports `SelectProps`. It's type-only in effect but not written as `import type`, and the ESLint rule doesn't cover it. |
| Root wrapper inside the dropdown breaks the flex scroll layout | **Resolved.** `ControlledOptionList` renders `List`/`VirtualList` directly with no root (`option-list/internal.tsx:105-128`). Not visually verified. |
| `__footer` merges sticky and non-sticky status | **Resolved.** Non-sticky status goes in as `listBottom` inside the list. Sticky status stays in the Dropdown footer through `composeDropdownContent`. |
| `use-open-state` used by ButtonDropdown | **Still present, but it works.** `button-dropdown/utils/use-button-dropdown.ts:5` imports `internal/components/select-dropdown/use-open-state`, so ButtonDropdown depends on the select-dropdown folder (the hook itself has no select deps). The doc still places it in `select-dropdown/`. Recommend moving it to `list-container/utils` or `internal/hooks`. |
| Autosuggest, PromptInput and `prepare-options` resolve moved files | **Resolved.** They import `list-container/...`, `option-list/use-announcement` and `option-list/utils/check-option-value-field`. tsc is clean and all their suites pass. |
| Conditional hook | **Resolved** by the component split. |
| Select-all semantics (state over all options, toggle over visible) | **Implemented and equivalent to HEAD.** `multiSelection(selected, { options: filteredOptions, allOptions: flatOptions, interactiveGroups })`. `isAllSelected` is computed over `all`. `toggleAll` and the group toggle work on the visible enabled options (`multi-selection.ts:39-88`), line for line the same as HEAD `use-multiselect.tsx:128-170`. `select-all.test.tsx` (46 references) passes. No dedicated pure unit tests for the selection models exist, although the doc promises them. |
| Highlight-on-open, mouse vs keyboard | **Equivalent to HEAD.** `use-select-dropdown.ts:205-221` matches HEAD `use-select.ts:314-346`. In the dropdown the list is created with `embedded: false`, so the list `onFocus` doesn't apply a keyboard highlight. That removes the conflict the review flagged. Covered by `use-select-dropdown.test.ts` (keyboard/mouse, selected/first, filter = no highlight); all pass. |
| Focus routing (filter vs list, back to trigger) | **Equivalent to HEAD** (`activeRef = hasFilter ? filterRef : listRef`, plus a focus effect). Unit-tested only indirectly. Real focus is integ territory, which wasn't run. |
| Closed-trigger type-ahead | **Equivalent.** Select: `highlightOption: !isOpen ? optionList.selectOption : …` (`select/internal.tsx:153-158`). Multiselect: enabled only while open (`multiselect/internal.tsx:133-139`). |
| Escape | Dropdown: `onEscape: closeAndFocusTrigger` (`use-select-dropdown.ts:100`). Embedded Multiselect: `onEscape: () => {}`, which keeps `stopPropagation` (`embedded.tsx:74`). **No unit test covers Escape closing the Select/Multiselect dropdown.** Only `__integ__/events-select.test.ts` and `dropdown-customization.test.ts` do, and they weren't run. |
| `__controller` duplicates sources of truth | **Partly open.** Callers pass options to `useOptionList` and again as `__listOptions` (`select/internal.tsx:134` and `289`). Selection is read from the controller. The two can drift but currently match. |
| Hashed class names change when `.scss` moves | **Handled.** Test-utils import the new paths (`select-dropdown/styles`, `option-list/parts/styles`, `list-container/styles`) and the selectors snapshot is updated. Its diff is only hash changes plus `group-header_1kbcw`, which was removed by the HEAD grouping commit. |
| DOM inside the dropdown unchanged | **Not directly verified.** No unit DOM snapshot exists for Select/Multiselect. The ~2600 behavioural tests that query by test-utils, aria and ids pass, which suggests the structure is preserved. |

### Behaviour differences found by reading the code (not caught by tests)

1. **Embedded Multiselect (PropertyFilter editor).**
   - Before: on list focus with nothing highlighted, HEAD always highlighted the first option (`goHomeWithKeyboard`).
   - Now: it highlights the first *selected* option when there is one, skips the highlight when focus comes from a pointer, and clears the highlight on mouse leave (`use-option-list.ts:191-215`, `embedded: true`).

   This is the OptionList focus rule from the doc, so it's probably intended. It is still a user-visible change and
   should be confirmed.
2. **Public OptionList Escape.**
   - Before: at HEAD, OptionList went through `useSelect` with a no-op `closeDropdown`, so `useMenuKeyboard` called `stopPropagation()` on Escape.
   - Now: `onEscape` is undefined, so Escape propagates (`list-container/utils/use-keyboard.ts:47-51`). An OptionList inside a Modal now lets Escape close the modal.

   This matches the doc ("the option list doesn't handle Escape"). The existing test only checks that the selection doesn't change. OptionList isn't released yet (dev branch), so the impact is low.
3. Minor: `singleSelection.getGroupState` counts a child whose `value` is `''`. HEAD skipped falsy values (`!!item.value`). This only affects groups whose selected child has an empty-string value.

## Not verified

- Integration, motion and a11y tests (`npm run test:integ`, `test:a11y`). They need the dev server and ChromeDriver, and I wasn't to start servers. This covers Escape closing the dropdown, real focus and scroll, flex layout, load-more on scroll, and the `pages/list-container/simple` page used by `list-container/__integ__`.
- Visual regression (CI only) and the bundle-size report (`sizeLimit` task not run).
- The full `npm run build`. Only quick-build plus the docs and styleDocs tasks were run.

Note: some `src` files were modified at 14:13, after the existing `lib` was built at 14:09. Something was editing
concurrently. Results reflect the tree as of my quick-build at about 14:15.

## Recommendations

1. Update the pre-existing documenter snapshot (from the grouping removal) with `-u` after a full build, in its own commit.
2. Move `use-open-state` out of `select-dropdown` (to `list-container/utils` or `internal/hooks`) and update the doc. Today ButtonDropdown reaches into the select layer.
3. Add pure unit tests for `singleSelection`/`multiSelection`, covering select-all with hidden selections, a group with disabled children, and a disabled single option. Add unit tests for `useOptionList`'s embedded focus rules and for Escape closing the Select/Multiselect dropdown.
4. Stage the ESLint rule (`eslint.config.mjs`) with the rest, and consider writing `prepare-options.ts:4` as `import type`.
5. Confirm the two behaviour changes above (embedded Multiselect focus highlight, OptionList Escape propagation) are wanted.
6. Run `npm run test:integ` for `src/select`, `src/multiselect`, `src/internal/components/list-container` and `src/option-list` before raising the PR.
