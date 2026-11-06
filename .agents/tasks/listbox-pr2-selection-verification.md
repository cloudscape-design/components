# PR 2 verification: shared listbox selection models

Worktree `/Users/amanabiy/Documents/components/.worktrees/listbox-03`, branch `listbox/02-selection-models` on
`listbox/01-move-list-helpers` (`9306cae1c`). First iteration (no review JSON present). Not committed.

## Changes

- `git checkout backup-after-done -- <5 selection paths>` → five files added (index shows `A`, working tree `M` for
  the adaptations).
- `ListOption` → `DropdownOption` in all five files (imports, annotations, `selectAll` constant). No edit to
  `option/interfaces.ts`, no alias, no repo-wide rename.
- `interfaces.ts` comments: "Replaces the ... flags" → "Covers what the ... flags express today"; dropped "Same values
  as the public OptionList `selectionType`." (kept "Drives aria-multiselectable and the row style.").
- No list-container / ListContainer / use-highlighted-option references existed; nothing to rewrite.
- Helpers confirmed unchanged and signature-compatible: `isGroup` (filter-options.ts:75), `flattenOptions`
  (flatten-options.ts:7), `findOptionIndex(options, option)` (listbox/utils/connect-options.ts:25).
- Gap tests added: 8 in multi-selection.test.ts, 2 in single-selection.test.ts (plan section 4). All pass without
  touching the models.

## Commands and results

| Command | Result |
| --- | --- |
| `git diff --stat listbox/01-move-list-helpers` | 5 new selection files (+380) plus ` M package-lock.json` (pre-existing postinstall change, unstaged, not part of PR) |
| `git diff --stat backup-after-done -- src/internal/components/listbox/selection` | 5 files, 86+/22- (type swap, 2 comments, new tests) |
| `npx eslint --max-warnings 0 src/internal/components/listbox/selection` | exit 0 |
| `npx prettier --check src/internal/components/listbox/selection` | exit 0, all files formatted |
| `TZ=UTC node_modules/.bin/jest -c jest.unit.config.js src/internal/components/listbox/selection` | 2 suites, 25/25 pass |
| `npm run quick-build` | exit 0 |
| `TZ=UTC npm run test:unit` | 644/647 suites pass; 14058 pass, 162 skipped, 3 failed |
| `TZ=UTC node_modules/.bin/jest -c jest.unit.config.js src/__tests__/snapshot-tests/test-utils-wrappers.test.tsx` | 2/2 pass, 2 snapshots pass |

Full-suite failures, all known non-issues:
- `snapshot-tests/documenter.test.ts`: TS2307, `lib/components-definitions/*` missing after quick-build.
- `snapshot-tests/style-docs.test.ts`: "No Style API docs found ... Run the build (gulp styleDocs)".
- `snapshot-tests/test-utils-wrappers.test.tsx`: parallel-run flake; passes when run alone.
Full `npm run build` was not run.

## Behaviour comparison (base: select/internal.tsx, select/utils/use-select.ts, multiselect/use-multiselect.tsx)

| # | Case | Result |
| --- | --- | --- |
| C1 | Single re-select | Same. internal.tsx:149 fires `onChange({ selectedOption: option })` for any interactive option; model returns `[option.option]`. |
| C2 | Single group state | Same. use-select.ts:274-281 with `useInteractiveGroups=false` → `selected` always false; indeterminate from truthy values. Model single-selection.ts:27-31. |
| C3 | Empty-value quirk | Same. use-select.ts:87-92 skips falsy values and :275 guards `!!item.value`; single model `!!child.value`, multi model `!!item.value` (multi-selection.ts:44). Multi `selectedValues` includes `''` but the guard excludes it. Tested both models. |
| C4 | Multi toggle add/remove | Same, incl. append order. use-multiselect.tsx:154-176 vs multi-selection.ts:64-71. |
| C5 | Choosing a disabled unselected option | Same: counts as all-selected → `unselect` → unchanged. Tested. |
| C6 | Group toggle | Same. `intersection(group.options, filteredNonParentOptions)` excludes hidden and disabled children (use-multiselect.tsx:157,169) vs multi-selection.ts:83-86. Selected disabled children and outside selections are kept on deselect. Tested. |
| C7 | Multi group state | Same formula (use-select.ts:274-281 vs multi-selection.ts:43-48); disabled children count toward length; not selected when groups are not interactive. Tested. |
| C8 | Select-all state | Same. use-select.ts:288,306 vs multi-selection.ts:51-53. |
| C9 | Select-all toggle | Same. use-multiselect.tsx:134-147 vs multi-selection.ts:40-41,57-62. Turns off when only disabled options remain unselected. Tested. |
| C10 | Token dismiss / option outside visible list | Same: `toggle([o])` finds it selected by value → removes. Tested. |
| C11 | Disabled / read-only gating | Models do no gating (see R1). |

## Behavioural differences / caller contracts (reported, not changed)

- R1. The models do not gate input. Base `selectOption` (use-select.ts:136-147) rejects options failing
  `isInteractive` / `isGroupInteractive` (wrapper `disabled`, parent rows in single mode) and read-only never opens the
  dropdown. The models return a selection for any input: single `getNextSelection` on a group header or select-all
  wrapper returns `[group]` / `[{ label }]`; multi with `interactiveGroups: false` still toggles a group. Callers must
  keep the gating and read-only handling.
- R2. `singleSelection` uses only the first entry of `selectedOptions`; base use-select counted all entries for group
  state. Equivalent for Select (passes at most one). Tested.
- R3. Group toggle and select-all read `OptionDefinition.disabled`, not the wrapper `disabled` that `flattenOptions`
  sets on children of a disabled group. Select-all selects an enabled child of a disabled group. Base Multiselect does
  the same (maps to `item.option`), so this is parity; flag for later API review.
- R4. `allOptions` defaults to `options`. Base Multiselect always computes select-all state against `flatOptions`
  (all, incl. filtered-out). A caller that filters but omits `allOptions` would compute select-all `selected` against
  the visible list only, and select-all ON (`all.filter(...)`) would drop hidden selections. Caller contract: pass
  `allOptions: flatOptions` when filtering. Not observable today (no callers).
- R5. Row-level `selected` is not part of the model; base use-select derives it via `connectOptionsByValue`
  (first row with a matching value wins). The model only exposes `selectedOptions`; callers keep that matching.

No difference changes current Select/Multiselect behaviour, because nothing calls the models yet.

## Commit

Committed `9185f55ad` (`9185f55ade26cf866e83b9a0096ee179f668c331`) on `listbox/02-selection-models`:
`refactor: Add shared listbox selection models`. The five selection paths were re-staged first, because the index
still held the unadapted backup versions. The committed content is the adapted 380-line version, and `git show HEAD`
has 0 `ListOption` matches. The lint-staged hooks (eslint --fix) and git-secrets ran and changed nothing. Nothing was
pushed. `package-lock.json` (postinstall change) and `.agents/` were left out of the commit.

`git log --oneline origin/main..HEAD`:

```
9185f55ad (HEAD -> listbox/02-selection-models) refactor: Add shared listbox selection models
9306cae1c (listbox/01-move-list-helpers) refactor: Move list rendering and helpers into internal listbox
```

`git diff --stat listbox/01-move-list-helpers HEAD`:

```
 .../selection/__tests__/multi-selection.test.ts    | 161 +++++++++++++++++++++
 .../selection/__tests__/single-selection.test.ts   |  61 ++++++++
 .../components/listbox/selection/interfaces.ts     |  32 ++++
 .../listbox/selection/multi-selection.ts           |  91 ++++++++++++
 .../listbox/selection/single-selection.ts          |  35 +++++
 5 files changed, 380 insertions(+)
```

The working-tree form (`git diff --stat listbox/01-move-list-helpers`) also lists the uncommitted ` M package-lock.json`.

Unit tests (from the verification above): selection suites 2/2, 25/25 pass. Full unit run 644/647 suites pass. The 3
failures are known non-issues: documenter and style-docs need full-build artifacts, and test-utils-wrappers is a
parallel-run flake that passes alone. eslint, prettier and quick-build are clean.

Behaviour comparison: C1–C10 match the base Select/Multiselect. Caller contracts, recorded in the commit body:
R1 no disabled/read-only/interactivity gating; R2 single uses only the first selected option; R3 reads
`OptionDefinition.disabled`, not the wrapper `disabled` (parity); R4 `allOptions` defaults to `options`; R5 row-level
selected matching stays with the caller. Nothing calls the models yet, so current behaviour does not change.
