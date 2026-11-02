# OptionList rebuilt on refactor/move-shared-listbox-parts

`feat/add-option-list` (HEAD `24524f9b9`) now sits on `refactor/move-shared-listbox-parts` (`6c48dd2c1`) as 22 commits: the original 23 with the test-settings commit `f8188ea94` dropped. OptionList uses the shared listbox item, render-options and `useTypeAhead`. Four Select/Multiselect fixes from the later fix branch are folded into the matching OptionList commits, and their Select/Multiselect tests come with them. The OptionList component, its tests, `use-listbox.ts`, `listbox/index.tsx`, `parts/list.tsx`, `scroll-to-index.ts` and the OptionList test-utils are byte-identical to the reviewed `origin/feat/add-option-list` (`4925c401c`). The only OptionList-area difference is `pages/option-list/simple.page.tsx`, which loses the preselection/type-ahead settings that `f8188ea94` added. Nothing has been pushed.

Watch for: nothing blocking. One note that is not a defect: OptionList depends at runtime on `select/parts/styles` through the shared item. The eslint rule leaves `parts/item.tsx` out of its scope on purpose and says so in a comment (confirmed).

**Verdict**: APPROVED

## High-level view

The shared-code delta that reaches Select and Multiselect is the four fix-branch changes and nothing else. The `use-type-ahead.ts` hunks (per-option matching, `defaultPrevented` skip) and the `parts/item.tsx` hunks (`parentProps.disabled`, description kept mounted with the tooltip gated on `!renderResult`) match `5f8b96389`, `e7429e11f`, `6b95bbf8c` and `7626adb9a` line for line. The Select and Multiselect native-search and render-option tests and the Multiselect integ expectation are identical to the fix branch at `7626adb9a`. The hook test file has one extra case, OptionList's interactive-groups cycle test. The identity-lookup rewrite (`bd8f0792b`) is absent from `use-type-ahead.ts` and its tests.

Select and Multiselect Home/End and wrap behaviour is unchanged. `use-keyboard.ts` only makes `closeDropdown` optional, and `use-select.ts` always passes it, so the Escape path for Select and Multiselect is the same. Nothing under `src/select/utils` or `src/multiselect` changes outside tests. There is no `preventNativeHomeEnd`, and none of the `home-end` or `arrow-key-wrap` tests from `6792d0dc3`/`58dad9856` are present. OptionList keeps its own Home/End `preventDefault` in `use-listbox.ts`, as reviewed on #5180.

The other shared additions do not change Select or Multiselect. They are an optional `hideTopDivider` on the item and `SelectableItem`, an optional `statusType` (default `finished`) and `onMouseLeave` on `OptionsList`, an additive `scrollOptionIntoView` export, plus the pluralize, required-props, i18n and eslint entries. All three snapshot files only add lines, and the added test-utils selectors/wrappers belong to OptionList. `listbox/parts/styles.scss`, `select/parts/item.tsx` and `multiselect-item.tsx` are gone. The required grep only matches the pre-existing `hasCheckboxItems` helper in button-dropdown, which is unrelated and also on the base.

Commit hygiene checks out. Subjects are unchanged apart from the dropped commit. Each of the four folded commits says "Select and Multiselect get the same fix" and lists Select/Multiselect tests in its stat. No commit touches `package-lock.json`, `tsbuildinfo`, `.agents/`, `.kiro/`, `node_modules` or the repro page. `origin/feat/add-option-list` is still `4925c401c` and the worktree is clean.

<details>
<summary>Issues (0)</summary>

No actionable issues.

</details>

<details>
<summary>Details</summary>

### Copilot regression tests preserved

`git diff origin/feat/add-option-list feat/add-option-list -- src/option-list` is empty, so every OptionList unit and integ test from the reviewed PR is still there unchanged. That covers type-ahead (group-state `type-ahead` describe, keyboard "type-ahead after Space"), `parent.disabled`, aria-describedby with custom content, scrolling on keyboard moves, highlight sync when options change, wrap past empty groups, keyboard focus on the selected option despite hover, required values, the `renderHighlightedAriaLive` cases and no scroll on grouped mount.

### Verification evidence

The report records the build, the 99-suite/3338-test unit run, the 69 OptionList tests, the snapshot regeneration with no change, eslint/stylelint/tsc on HEAD and per commit, and the OptionList (10/10) and Multiselect (34/34) integ runs with the server bound to 127.0.0.1. Nothing in the diff gave a reason to spot-check, so no tests were re-run.

### Report completeness

The report has the old-to-new commit mapping, the conflicts and their resolutions (including dropping the `bd8f0792b` test context from the hook test), a justification for each file outside OptionList, test counts, the snapshot summary, integ status, and the push/`gh pr edit` commands marked as not run.

</details>

<details>
<summary>File map</summary>

- `src/option-list/**`, `src/test-utils/dom/option-list/index.ts`, `listbox/{use-listbox.ts,index.tsx,parts/list.tsx}`: new OptionList code, identical to origin.
- `pages/option-list/*`: dev pages; `simple.page.tsx` without the dropped settings.
- `listbox/parts/item.tsx`: `hideTopDivider`, group `parent.disabled`, description kept mounted.
- `listbox/use-type-ahead.ts` + test: per-option matching, `defaultPrevented` skip.
- `listbox/parts/scroll-to-index.ts`: additive `scrollOptionIntoView`.
- `options-list/index.tsx`, `options-list/utils/use-keyboard.ts`: optional `statusType`/`onMouseLeave`, optional `closeDropdown`.
- `selectable-item/*`: `hideTopDivider` class.
- `select|multiselect/__tests__/{native-search,render-option}.test.tsx`, `multiselect/__integ__/multiselect.test.ts`: tests for the folded fixes.
- Snapshots, i18n, pluralize, required-props, eslint: OptionList registration.

Full diff: `git -C .worktrees/option-list-rebase diff refactor/move-shared-listbox-parts...feat/add-option-list`.

</details>
