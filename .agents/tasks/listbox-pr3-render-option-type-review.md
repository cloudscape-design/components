# OptionList-owned `renderOption` contract (review pass 2)

OptionList's `renderOption` now uses `OptionListProps.OptionItemRenderer` instead of `SelectProps.SelectOptionItemRenderer`. Four new namespace types, `OptionItem`, `OptionGroupItem`, `Item` and `OptionItemRenderer`, describe what the listbox actually passes: the option `icon`, and the multi-selection group `selected`/`indeterminate`/`highlighted` state, which Select's type used to reject. The adapter in `internal.tsx` takes the listbox's own render-item type as input and returns OptionList types, so it no longer needs the generic `toOriginal` cast or the `as SelectProps.SelectItem` cast. Pass 1's blocking finding, which said the group state JSDoc counted only "enabled" options, is fixed. Its optional single-select coverage suggestion is also done.

Watch for: `filterText` is no longer passed to `renderOption`. It was always `''`, so this is a small runtime change, not a type-only one (confirmed, non-blocking, already flagged to the user).

**Verdict**: APPROVED

## High-level view

The types match runtime field for field. Option items get `type/index/option/selected/highlighted/disabled/parent`, which is what `toRenderItem` in `listbox/parts/item.tsx` builds. Single-select group headers and `parent` get `type/index/option/disabled` (`toSingleGroupItem`). Multi-select adds `selected/indeterminate/highlighted` (`toMultiGroupItem`), which the type marks optional and "only provided in multi selection". Nothing in `Option` blocks `icon`. The old `'trigger'` variant can't happen in OptionList and is gone, so the dev page's unreachable trigger branch had to go too.

Naming follows Select and Multiselect (`…OptionItem`, `…OptionGroupItem`, `…Item`, `…OptionItemRenderer`), minus the component prefix that the `OptionListProps` namespace already supplies. Unlike the dropdown types, every field has JSDoc, and the prop docblock lists the fields for the documenter. `interfaces.ts` and `internal.tsx` no longer import `../select`. Select types now reach the adapter only indirectly, through `ListboxProps['renderOption']`, which is internal and never shows up in the public API. The documenter snapshot change covers only OptionList's `renderOption` entry.

The adapter behaves as before for options and group headers. The new `return null` fallback only covers listbox item types that OptionList never produces. `toOriginalGroup` falls back to the listbox's group if the stored original isn't a group, which can't happen. The new multi test checks the icon slot and walks the group header through indeterminate, highlighted and selected using the real keyboard path. The single-select test now asserts that the multi-only fields are absent from both group headers and `parent`.

The diff covers the option-list sources, the option-list dev page and the documenter snapshot. `package-lock.json` is unchanged. `.agents/` and `pages/tsconfig.tsbuildinfo` are untracked, sit outside the diff, and are dated before this step.

<details>
<summary>Issues (1)</summary>

1. **`filterText` dropped (non-blocking)**: `renderOption` gets `props.filterText` as `undefined` now, where it used to get `''`. OptionList has no filtering and isn't released yet, so keeping it out is fine. Restore it only if the user wants exact runtime parity.

</details>

<details>
<summary>Details</summary>

### Runtime/type alignment

The listbox builds the render item from the selection type: `toSingleGroupItem` returns `{ type, index, option, disabled }`, and `toMultiGroupItem` adds `indeterminate`, `selected` and `highlighted`, each defaulted to `false`. For an option item, `parent` is built with the same helper but takes the child's `disabled`. `OptionGroupItem.disabled`'s JSDoc says so ("In `OptionItem.parent`, whether the contained option is disabled"), which matches what Select and Multiselect do. The adapter spreads the listbox item and swaps in the original `option`, so no fields are added and none are lost. Group state JSDoc now says "all options" / "some, but not all, options", which matches `getOptionGroupState` comparing against `group.options.length`.

`selected`/`indeterminate`/`highlighted` are optional rather than split into single and multi group types. The item carries no selection-type discriminant, so optional fields describe runtime accurately (absent in single selection). The new `not.toHaveProperty` assertions pin this down.

### Test coverage

The new multi test reads `item.option.icon` and the group state without casts, and ts-jest type-checks it, so it exercises the type contract as well as runtime. Not tested: a `parent` item in multi selection carrying group state. This is low risk because it goes through the same `toGroupItem` path as group headers.

</details>

<details>
<summary>File map</summary>

- `src/option-list/interfaces.ts`: new `OptionItem`/`OptionGroupItem`/`Item`/`OptionItemRenderer` types, a `renderOption` docblock that lists the fields, and the `SelectProps` import removed.
- `src/option-list/internal.tsx`: the adapter is typed from `ListboxProps['renderOption']` to OptionList types, typed `toOriginalOption`/`toOriginalGroup` replace the cast helper, and `filterText` is no longer forwarded.
- `src/option-list/__tests__/option-list.test.tsx`: a multi test for the icon and group state, plus single-select absence assertions.
- `pages/option-list/permutations.page.tsx`: the unreachable `'trigger'` branch is removed.
- `src/__tests__/snapshot-tests/__snapshots__/documenter.test.ts.snap`: OptionList `renderOption` entry.

Full diff: `git -C .worktrees/pr3-option-list diff HEAD`.

</details>
