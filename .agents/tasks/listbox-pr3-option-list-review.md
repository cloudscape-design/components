# Public OptionList component on the shared listbox engine (PR 3)

PR 3 adds the public `OptionList` component and the engine pieces it alone uses: `useListbox`, `Listbox`, `List`, `useTypeAhead`, and the new listbox `Item`. It sits on `listbox/02-selection-models` and uses PR 2's `singleSelection` / `multiSelection` models for `onChange`. Files came from `backup-after-done`, rewritten to the base's names (`options-list`, `OptionsList(Props)`, `use-highlight-option`, `DropdownOption`). The existing helpers get small optional additions that Select and Multiselect never trigger: optional `statusType`, `onMouseLeave` and `closeDropdown`, `hideTopDivider`, `scrollOptionIntoView`, and a `selectionType` branch in `render-options`. Nothing under `src/select`, `src/multiselect`, `src/autosuggest`, `src/prompt-input` or `src/button-dropdown` changes. The selectors snapshot only gains the `option-list` block.

Watch for: `render-options` now statically imports the new listbox `Item`, so it ships in Select and Multiselect bundles (confirmed, non-blocking). `package-lock.json` is modified in the worktree but must stay out of the commit (confirmed). The work is uncommitted and untracked, so reviewers need the untracked files in the commit.

Note on inputs: the step's plan reference was the unresolved placeholder `{{plan}}`. The review used `docs/OPTION_LIST_RELEASE_PLAN.md` (PR 3 section, "Source branches", "Decision: OptionList inside Dropdown", "API decisions before release") as the plan.

**Verdict**: APPROVED

## High-level view

Select and friends are isolated. Their source and tests are untouched, and no file in them imports `option-list` or the new engine files. The one `option-list` string is the pre-existing `useUniqueId('option-list')` in `use-select.ts`. Each shared-helper edit is additive and inert for existing callers. `closeDropdown` stays optional, and the only other caller (`use-select.ts`) always passes it. `statusType` now defaults to `'finished'`, and it is only compared with `'pending'`. `onMouseLeave` and `hideTopDivider` are unset everywhere else. `render-options` falls back to `useInteractiveGroups ? MultiselectItem : Item` when `selectionType` is absent. The selectors snapshot is purely additive.

The base adaptations are clean. Every new engine and component file differs from the backup only in the renames and import order. `options-list/index.tsx` now matches backup's `list-container/index.tsx` except for the component and prop names, and `use-highlight-option`, `use-keyboard` and `use-ids` match exactly. `listbox/parts/styles.scss` drops `.option-group` and `.layout-strut`, which none of the new files use. The backup version of `render-options` was rejected on purpose because it would have moved Select's rows onto listbox styles.

The PR 2 contracts hold. `useListbox.selectOption` rejects options that fail `isInteractive` / `isGroupInteractive`, which covers disabled options and, outside interactive groups, parents. That happens before `getNextSelection`. OptionList calls `multiSelection(selected, { options })` without `allOptions`, so R4's default applies. The three backup fixes are all present: `scrollStrategy: 'nearest'` with `scrollOptionIntoView`, the pointer flag on `onMouseDown` set only when focus moves in, and multi focus entry in list order. A unit test now locks the re-select `onChange` contract (`toHaveBeenCalledTimes(3)`).

The public API is exactly backup's `interfaces.ts`, and `index.tsx` is identical too. The open-before-merge items (listbox `id` forwarding, `option-list` i18n namespace, FormField) are not implemented, as instructed. The plan says to settle them before the PR is opened for merge.

The verification record is thorough and does not need a re-run. It covers the build, lint, the full unit suite, browser checks and integ. The one integ failure (`async-select` virtual scroll) also fails on the PR 2 baseline.

<details>
<summary>Issues (4)</summary>

1. **Listbox Item in the Select bundle** (confirmed, non-blocking): `render-options` imports `./item` (with `use-hidden-description`, `checkbox-icon` and `listbox/parts/styles.scss`), which loads for every Select and Multiselect. There is no behaviour change, but note it in the PR description next to the plan's list of remaining `listbox` → `select` imports.
2. **package-lock.json in the worktree** (confirmed, non-blocking): it holds `npm install` key-reordering churn. The verification record says it was "not touched", but the file is modified. Leave it unstaged or restore it before committing.
3. **Escape propagation not unit-tested** (confirmed, non-blocking): the `use-keyboard` change exists so Escape reaches a surrounding Dropdown or Modal. The OptionList unit test only checks that Escape leaves the selection alone. A unit test that Escape propagates (and `use-keyboard` with `closeDropdown` omitted) would lock it in. Today only the browser probe covers it.
4. **required-props entry not on backup** (confirmed, non-blocking): `'option-list': { options: [], selectionType: 'single' }` in `required-props-for-components.ts` is new shared test infra and is needed for the functional suites. Mention it in the PR description so it isn't read as a test edit made to force a pass.

</details>

<details>
<summary>Details</summary>

### Shared helper edits and why Select can't see them

```
Select/Multiselect ─▶ select/parts/{plain,virtual}-list ─▶ listbox/parts/render-options ─┬▶ select/parts/item | multiselect-item   (selectionType unset)
OptionList ─▶ Listbox ─▶ List ───────────────────────────────────────────────────────────┴▶ listbox/parts/item                      (selectionType set)
                         └▶ OptionsList (statusType?, onMouseLeave?)   useListbox ─▶ useMenuKeyboard (closeDropdown?)
```

The only `render-options` callers are `select/parts/plain-list`, `select/parts/virtual-list` and the new `List`, and only `List` passes `selectionType`. The `...(selectionType ? { selectionType } : {})` spread keeps the prop off Select's items. On this base, `get-item-props` still adds `hasCheckbox: false` to the props it builds. On the listbox `Item` that prop ends up in `restProps` and `getBaseProps` drops it, so it is harmless.

`useMenuKeyboard` has two callers: `use-select.ts`, which always passes `closeDropdown`, and `useListbox`, which passes `onEscape` and leaves it undefined for OptionList. Without `closeDropdown`, Escape is no longer swallowed by `stopPropagation`, which is the intended behaviour for OptionList inside a Dropdown or Modal. The browser probe confirmed that Escape closes the DIY dropdown and returns focus to the trigger.

The new `.hide-top-divider` rule in `selectable-item/styles.scss` excludes highlighted, selected and sticky states. Nothing applies the class except OptionList's first row, and the selectors snapshot shows no hash change for `selectable-item`.

### Import fence

The new eslint block covers `src/option-list/**` and the five new engine files instead of backup's `listbox/**`. It bans runtime imports from `select/` or `multiselect/`, and type-only imports are allowed. The scope is right for this base: `render-options` and `option-group` still import from `select/parts`, as PR 1 documented. `use-listbox.ts` uses `import type { SelectProps }`, which the fence allows.

### Test coverage

OptionList brings 46 unit tests, 20 integ tests (all green on Chrome 155 via the local driver) and dev pages, all identical to backup apart from the added re-select assertion. Not tested in unit tests: Escape propagating out of OptionList, and the `scrollStrategy: 'nearest'` path inside real scroll containers. Integ and the 50-check browser probe cover the scroll path; only the browser probe covers Escape.

</details>

<details>
<summary>File map</summary>

- `src/option-list/{index,interfaces,internal,styles,test-classes,__tests__,__integ__}`: new component. Only `internal.tsx` (`DropdownOption`) and the test (+1 assertion) differ from backup.
- `src/internal/components/listbox/{use-listbox,use-type-ahead,index}.ts(x)`, `parts/{list,item,styles}`, `__tests__/use-type-ahead.test.ts`: new engine; renames only vs backup (styles minus two unused blocks).
- `listbox/parts/render-options.tsx`: optional `selectionType` branch to the listbox Item.
- `listbox/parts/scroll-to-index.ts` (+ test): additive `scrollOptionIntoView`.
- `options-list/index.tsx`: optional `statusType` (default `finished`), `onMouseLeave`.
- `options-list/utils/use-keyboard.ts`: optional `closeDropdown`.
- `selectable-item/{index,interfaces,styles}`: optional `hideTopDivider`.
- `src/test-utils/dom/option-list/index.ts`, `pages/option-list/*`, `test/definitions/visual/option-list.ts`: identical to backup.
- `build-tools/utils/pluralize.js`, `eslint.config.mjs`, `src/__tests__/required-props-for-components.ts`: plural, import fence, default props.
- Snapshots: documenter +468, wrappers +80, selectors +4, all OptionList-only.
- `package-lock.json`: install churn, exclude from the commit.

Full diff: `git -C .worktrees/listbox-04 diff -M listbox/02-selection-models` plus the untracked files listed by `git ls-files --others --exclude-standard`.

</details>
