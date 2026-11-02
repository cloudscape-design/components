# PR3 OptionList `renderOption` type contract — verification

Worktree: `.worktrees/pr3-option-list` (branch `feat/add-option-list`, HEAD `1dfd1e098`). Not committed (a later step commits).

## Change

- `src/option-list/interfaces.ts`: `renderOption?: OptionListProps.OptionItemRenderer`; new namespace types below; prop JSDoc lists the item fields. Removed the type-only import of `SelectProps`.
- `src/option-list/internal.tsx`: adapter typed against the listbox's own `renderOption` param (`ListboxProps['renderOption']`) on the input side and `OptionListProps.OptionItem` / `OptionGroupItem` on the output side. No casts to Select types, no `as any`, no import from `../select` any more. `toOriginal` generic cast helper replaced by `toOriginalOption` / `toOriginalGroup` (typed lookups in the existing `originals` map).
- `pages/option-list/permutations.page.tsx`: the dev page's renderer checked `item.type === 'trigger'`, which the new type correctly rejects (OptionList has no trigger). Now renders `<strong>{item.option.label}</strong>` for every item — same output as before, since the trigger branch was unreachable.
- `src/option-list/__tests__/option-list.test.tsx`: new test `multi: items carry the option icon and the group selection state`.
- Documenter snapshot updated.

## New type definitions

```ts
export interface OptionItem {
  /** The item type. */
  type: 'item';
  /** The position of the item in the list, counting group headers. */
  index: number;
  /** The option, as provided in `options`. */
  option: Option;
  /** Whether the option is selected. */
  selected: boolean;
  /** Whether the option is highlighted. */
  highlighted: boolean;
  /** Whether the option is disabled. */
  disabled: boolean;
  /** The group header item of the group that contains the option, or `null` if the option isn't in a group. */
  parent: OptionGroupItem | null;
}

export interface OptionGroupItem {
  /** The item type. */
  type: 'group';
  /** The position of the item in the list, counting group headers. */
  index: number;
  /** The option group, as provided in `options`. */
  option: OptionGroup;
  /** Whether the group is disabled. In `OptionItem.parent`, whether the contained option is disabled. */
  disabled: boolean;
  /** Whether all options in the group are selected. Only provided in multi selection. */
  selected?: boolean;
  /** Whether some, but not all, options in the group are selected. Only provided in multi selection. */
  indeterminate?: boolean;
  /** Whether the group header is highlighted. Only provided in multi selection. */
  highlighted?: boolean;
}

export type Item = OptionItem | OptionGroupItem;

export type OptionItemRenderer = (props: { item: Item }) => React.ReactNode | null;
```

## Runtime fields reaching `renderOption`

Source: `src/internal/components/listbox/parts/item.tsx` (`toRenderItem`, `toSingleGroupItem`, `toMultiGroupItem`), `parts/render-options.tsx` (parentProps), `parts/list.tsx` (`filteringValue: ''`), then OptionList's adapter swaps `option` / `parent.option` for the consumer's objects.

| Item | Fields |
| --- | --- |
| Option item (single and multi) | `type: 'item'`, `index`, `option` (consumer `Option`, incl. `icon`), `selected`, `highlighted`, `disabled`, `parent` (group item or `null`) |
| Group header, single | `type: 'group'`, `index`, `option` (consumer `OptionGroup`), `disabled` |
| Group header, multi | `type: 'group'`, `index`, `option`, `disabled`, `highlighted`, `selected`, `indeterminate` |
| `item.parent` | Same shape as the group header for the selection type, but `disabled` is the child option's disabled state (same as Select/Multiselect) |
| `filterText` (top-level prop) | Was forwarded, always `''` (OptionList has no filtering) — see runtime mismatch below |

No `virtualIndex`, `filteringValue`, select-all, trigger or use-entered items reach the consumer.

## Naming

Select uses `SelectOptionItem` / `SelectOptionGroupItem` / `SelectItem` / `SelectOptionItemRenderer`; Multiselect uses `MultiselectOptionItem` / `MultiselectOptionGroupItem` / `MultiselectItem` / `MultiselectOptionItemRenderer`. OptionList keeps the same suffixes and drops the component prefix, which is already given by the `OptionListProps` namespace: `OptionListProps.OptionItem`, `OptionGroupItem`, `Item`, `OptionItemRenderer`. `OptionGroupItem` (not `GroupItem`) keeps parity with the dropdown types.

The multi-only group fields are optional rather than a separate single/multi type because the item carries no selection-type discriminant; optional fields match runtime exactly (absent in single selection).

## Runtime mismatches found

1. `filterText` (reported separately, runtime changed): the adapter forwarded `filterText`, always `''`. It was dropped from the type (OptionList has no filtering) and the adapter now calls `renderOption({ item })`. Only effect: `props.filterText` is now `undefined` instead of `''`; it was never part of a documented OptionList contract. Revert by adding `filterText` back to the call and type if wanted.
2. Type-only (fixed): `item.option.icon` and multi group `selected` / `highlighted` / `indeterminate` were passed at runtime but rejected by `SelectProps.SelectItem`. The dev page's unreachable `'trigger'` check showed the old type allowed an item OptionList never produces.
3. Noted, not changed: `parent.disabled` is the child option's disabled state, not the group's. This matches Select and Multiselect, so it is documented rather than changed.

## Verification (run from the worktree)

| Command | Result |
| --- | --- |
| `npx eslint` + `npx prettier --check` on the 4 changed source files | pass |
| `npm run quick-build` | pass (first attempt hit `ENOTEMPTY` in `clean` because a `start:watch` dev server is running in this worktree; rerun passed) |
| `npm run build` | first run failed: `pages/option-list/permutations.page.tsx` TS2367 (`'trigger'` comparison, see above); fixed; rerun pass |
| `TZ=UTC npx jest -c jest.unit.config.js src/__tests__/snapshot-tests/documenter.test.ts -u` | 105 passed, 1 snapshot updated |
| `TZ=UTC npx jest -c jest.unit.config.js src/option-list src/internal/components/listbox src/select src/multiselect src/__tests__` | 52/53 suites, 2628/2629 tests; only failure `test-utils-wrappers.test.tsx` (known parallel flake) |
| `TZ=UTC npx jest -c jest.unit.config.js src/__tests__/snapshot-tests/test-utils-wrappers.test.tsx` (alone) | 2 passed, 2 snapshots passed |
| New test (ts-jest type-checks it under `tsconfig.unit.json`) | pass; reads `item.option.icon`, `item.selected/indeterminate/highlighted` without casts |

`git diff --stat HEAD`:

```
 pages/option-list/permutations.page.tsx           |  3 +-
 .../__snapshots__/documenter.test.ts.snap         | 28 ++++++++--
 src/option-list/__tests__/option-list.test.tsx    | 42 ++++++++++++++
 src/option-list/interfaces.ts                     | 61 ++++++++++++++++++++-
 src/option-list/internal.tsx                      | 42 ++++++++------
 5 files changed, 150 insertions(+), 26 deletions(-)
```

`package-lock.json` unchanged; `pages/tsconfig.tsbuildinfo` and `.agents/` were untracked before this step and stay out of the diff.

## Documenter snapshot diff

Only the OptionList `renderOption` entry changed: `type` `SelectProps.SelectOptionItemRenderer` → `OptionListProps.OptionItemRenderer`, inline param `{ item: SelectProps.SelectItem; filterText?: string | undefined; }` → `{ item: OptionListProps.Item; }`, and the description now lists the `OptionItem` / `OptionGroupItem` fields.

## Iteration 2 (review fixes)

Review: `listbox-pr3-render-option-type-review.{json,md}` (CHANGES_REQUESTED).

1. Blocking, fixed: `OptionGroupItem.selected` / `indeterminate` JSDoc and the matching `renderOption` prop docblock lines said "enabled options". `multi-selection.ts` `getOptionGroupState` compares against `group.options.length`, so disabled children count. Changed to "all options" / "some, but not all, options" (type definitions above updated too). The line "choosing a group header selects or deselects all its enabled options" on `OptionGroup` stays: it describes the toggle, which does skip disabled options. Documenter snapshot regenerated; it no longer contains "enabled options in the group are selected".
2. Non-blocking, left as-is and surfaced: `filterText` is no longer passed to `renderOption` (it was always `''`; OptionList has no filtering and is unreleased). Restore on request.
3. Non-blocking, added: the existing single-select test `renders custom content for options and group headers with the original options` now asserts group headers and every `item.parent` have no `selected` / `indeterminate` / `highlighted` property (`not.toHaveProperty`, since `toContainEqual` ignores undefined keys).

| Command | Result |
| --- | --- |
| `npx eslint` + `npx prettier --check` on the 4 changed source files | pass |
| `npm run quick-build` | pass (first two attempts hit transient `ENOTEMPTY` in `clean` on `lib/`; third passed) |
| `npm run build` | pass |
| `npx jest -c jest.unit.config.js src/__tests__/snapshot-tests/documenter.test.ts -u` | 105 passed, 1 snapshot updated |
| `npx jest -c jest.unit.config.js src/option-list src/internal/components/listbox src/select src/multiselect src/__tests__` | 52/53 suites, 2628/2629 tests; only failure `test-utils-wrappers.test.tsx` (parallel flake) |
| `npx jest -c jest.unit.config.js src/__tests__/snapshot-tests/test-utils-wrappers.test.tsx` (alone) | 2 passed, 2 snapshots passed |

`git diff --stat HEAD`:
```
 pages/option-list/permutations.page.tsx           |  3 +-
 .../__snapshots__/documenter.test.ts.snap         | 28 ++++++++--
 src/option-list/__tests__/option-list.test.tsx    | 54 ++++++++++++++++++
 src/option-list/interfaces.ts                     | 61 ++++++++++++++++++++-
 src/option-list/internal.tsx                      | 42 ++++++++------
 5 files changed, 162 insertions(+), 26 deletions(-)
```
`package-lock.json` unchanged; `.agents/` and `pages/tsconfig.tsbuildinfo` untracked, outside the diff. Not committed.
