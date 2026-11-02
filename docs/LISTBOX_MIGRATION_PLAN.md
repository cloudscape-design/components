# Listbox migration plan

Three ways to get OptionList onto a clean list engine, from least to most change to the other components. Each
option is a complete stopping point, and each builds on the one before it, so they can also be done in order as
separate PRs. See [LISTBOX_ARCHITECTURE.md](LISTBOX_ARCHITECTURE.md) for the target structure.

| Option                            | Select / Multiselect code                            | What OptionList gets                                    | Behaviour risk for others         |
| --------------------------------- | ---------------------------------------------------- | ------------------------------------------------------- | --------------------------------- |
| A. OptionList only                | Not touched                                          | Its own list behaviour; still reuses Select's rendering | None                              |
| B. Shared rendering and selection | Rendering and selection swapped; behaviour hook kept | Shared rendering, no import from `src/select`           | Low to medium (visual, selection) |
| C. Full                           | Behaviour hook split and replaced                    | One engine for all three                                | Medium (focus, keyboard)          |

## Where the branch is today

`dev-v3-amanabiy` already contains option C: commit `eb7bdcc69` does the refactor, and `01c2810a7` adds the parity
fixes (embedded Multiselect focus, empty-value group state, `use-open-state` location) and their tests. The
baseline is `b9c34f236`.

So the choice is between:

- **Keep C** and finish the remaining items listed under C.
- **Step back to B or A** by reverting those two commits and redoing the subset. Most of the code can be reused
  file by file; the work is in deciding what to leave out.

## Baseline (what all three options start from)

At `b9c34f236`, OptionList is a thin layer over Select's internals:

- `useSelect` from `select/utils`, with dropdown settings faked (`embedded`, `keepOpen`, `filteringType: 'none'`,
  dummy `statusType` and `fireLoadItems`).
- `PlainList` from `select/parts`, which renders `Item` or `MultiselectItem` depending on `useInteractiveGroups`.
- Pure helpers from `select/utils`: `use-native-search`, `use-announcement`, `connect-options`,
  `check-option-value-field`.
- Workarounds to undo dropdown behaviour: `isFocused` and `isPointerInside` to hide the open-time highlight, a
  re-highlight on focus, and its own copy of Multiselect's toggle logic.

The dependency points the wrong way (the public list depends on Select's private folders), and any change to
`useSelect` can break OptionList.

---

## Option A: OptionList only

OptionList gets its own behaviour hook. Nothing in `src/select`, `src/multiselect` or any other component changes.

### Actions

1. Add `src/option-list/use-option-list.ts`: highlight, keyboard, mouse, focus rules and option props, built on the
   layer-0 primitives that already exist (`options-list/utils/use-highlight-option`, `use-keyboard`, `use-ids`).
   It produces the same `menuProps` and `getOptionProps` shapes that `select/parts/plain-list` expects.
2. Add `src/option-list/selection/single-selection.ts` and `multi-selection.ts` (no groups, no select-all needed)
   and use them for `onChange`. This removes the copied toggle logic.
3. Rewrite `option-list/internal.tsx` on the new hook. Delete the workarounds: `isFocused`, `isPointerInside`,
   the re-highlight on focus, and the dummy dropdown settings.
4. Keep importing `select/parts/plain-list` for rendering, and the pure helpers from `select/utils`.
5. Unit-test the selection models; keep `option-list.test.tsx` as the behaviour spec.

### What changes for each component

| Component                                                | Change                                                  |
| -------------------------------------------------------- | ------------------------------------------------------- |
| OptionList                                               | New behaviour hook and selection models; same rendering |
| Select, Multiselect, embedded                            | None. No file edited                                    |
| Autosuggest, ButtonDropdown, PromptInput, PropertyFilter | None                                                    |

### Dependencies after A

```
OptionList ──► select/parts/plain-list (+ item, multiselect-item, render-options)
           ──► select/utils (use-native-search, use-announcement, connect-options, check-option-value-field)
           ──► options-list utils (layer 0)
Select / Multiselect: unchanged, and still don't import OptionList
```

OptionList no longer depends on `useSelect`, which was the fragile edge. It still depends on Select's rendering
parts and pure helpers. There's no cycle, because Select never imports OptionList.

### Risk

- **Other components:** none. Their code is byte-identical, so no regression is possible there.
- **OptionList:** low. Its tests already describe the intended behaviour.
- **Hidden coupling:** a change to `select/parts` (for example a new required prop on `PlainList`) can still break
  OptionList. Running OptionList's tests in Select PRs covers this.

### Cost of stopping here

- Two behaviour hooks with overlapping logic: `useSelect` and `useOptionList` both do highlight, keyboard and
  option props. A focus or a11y fix in one has to be repeated in the other.
- The naming confusion (`option`, `options-list`, `option-list`) stays.

### Verification

OptionList unit and a11y tests. Nothing else needs to run, though the full unit suite is cheap insurance.

---

## Option B: shared rendering and selection

Everything from A, plus the rendering parts and selection logic move into `src/option-list` and Select and
Multiselect use them. Select and Multiselect keep `useSelect` for open state, focus and keyboard, so their
interaction behaviour doesn't change.

### Actions

1. Everything in A.
2. Move the shared types (`renderOption` item shapes, `ContainingOptionAndGroupString`) to a neutral file in
   `option-list` and re-export them from `select/interfaces` and `multiselect/interfaces`. This stops the moved
   parts from importing upward.
3. Move `PlainList` → `option-list/parts/list`, plus `item`, `option-group`, `render-options`, `get-item-props`,
   `scroll-to-index` and `common`. Merge `Item` and `MultiselectItem` into one `Item` with `selectionType`.
   `VirtualList` stays in `select/parts`: the public OptionList never virtualizes, so only Select and Multiselect
   need it. It imports the moved parts from `option-list`, which is the allowed direction.
4. Move the pure helpers (`use-native-search` → `use-type-ahead`, `use-announcement`, `connect-options`,
   `check-option-value-field`) to `option-list`. Update Autosuggest and PromptInput imports.
5. Split `select/parts/styles.scss` into rows/list (`option-list/parts`) and trigger/filter (stays with Select).
   Update test-utils stylesheet imports and the test-utils selectors snapshot.
6. Make Multiselect use `multiSelection` (with groups, select-all, visible vs all options) instead of its own
   toggle and select-all code in `use-multiselect.tsx`.
7. Point `useSelect` at the moved types. `useSelect`, `trigger` and `filter` stay in `src/select`.
8. Add the lint rule: `src/option-list` must not import runtime code from `src/select` or `src/multiselect`.

### What changes for each component

| Component                | Change                                                                    |
| ------------------------ | ------------------------------------------------------------------------- |
| OptionList               | As in A, plus rendering from its own folder                               |
| Select                   | Rows rendered by the merged `Item`; behaviour hook unchanged              |
| Multiselect, embedded    | Merged `Item` and `multiSelection`; behaviour hook unchanged              |
| Autosuggest, PromptInput | Import path changes only (`use-announcement`, `check-option-value-field`) |
| test-utils               | New stylesheet paths; hashed class names change                           |

### Dependencies after B

```
Select ─────────┐
Multiselect ────┼──► select/utils/use-select ──► option-list/parts, option-list/selection
Embedded MS ────┘                             ──► options-list utils (layer 0)
OptionList ────────► option-list/use-option-list ──► option-list/parts
Autosuggest, PromptInput ──► option-list/use-announcement
```

The direction is right: Select depends on OptionList, never the reverse. Two behaviour hooks still exist.

### Risk

- **Rendering (low to medium).** Merging `Item` and `MultiselectItem` is mechanical (both wrap `SelectableItem`),
  but small differences matter: which `disabledReason` is read, `aria-checked` vs `aria-selected` on groups, check
  mark vs checkbox, the `show-label-tag` class. A DOM comparison against baseline catches these.
- **Selection semantics (medium, Multiselect only).** Select-all and group toggles have subtle rules: checked state
  over all options, toggle over visible enabled ones, disabled children counted as selected, falsy values ignored.
  Replacing that code is where a regression is most likely. Needs pure unit tests plus the existing Multiselect
  suites.
- **Class-name churn (no customer impact).** Moving `.scss` changes hashed names. test-utils ship in the same
  package, so consumers aren't affected, but the selectors snapshot changes.
- **Interaction behaviour: none.** Focus, keyboard, open/close and Escape still come from `useSelect`.

### Cost of stopping here

- Still two behaviour hooks (`useSelect`, `useOptionList`), so focus and keyboard fixes are still duplicated.
- `useSelect` keeps its inline-mode flags (`embedded`, `keepOpen`) for embedded Multiselect.

### Verification

- Full unit suite, plus pure selection-model tests.
- DOM comparison of Select and Multiselect against baseline, normalizing hashed class names and generated ids.
- Visual regression (CI) for rows: check mark, checkbox, groups, disabled reason, label tags.

---

## Option C: full migration

Everything from B, plus `useSelect` is split into `useOptionList` (list behaviour) and `useSelectDropdown`
(dropdown behaviour), and all three list consumers run on the same engine. This is what the branch has today.

### Actions

1. Everything in B.
2. Extract the dropdown half of `useSelect` into `internal/components/select-dropdown/use-select-dropdown.ts`:
   open state, highlight on open, focus routing, close on select and Escape, trigger and filter props. Move
   `trigger`, `filter`, `dropdown-customization` and `use-load-items` there.
3. Make `useOptionList` support the dropdown case (`embedded: false`, optional `onEscape`, combobox input props for
   the filter) and embedded Multiselect's previous rules (`embeddedBehavior: 'embedded-multiselect'`).
4. Add the controlled path to `InternalOptionList` (`__controller` and friends). It renders no root element, so the
   list stays the dropdown's flex child. Callers choose the list component through `__listComponent`, so Select
   and Multiselect pass `VirtualList` when `virtualScroll` is set and `option-list` never imports it.
5. Move Select, Multiselect and embedded Multiselect onto `useSelectDropdown` + controlled `InternalOptionList`.
   Delete `useSelect`.
6. Rename `options-list` → `list-container` and `DropdownOption` → `ListOption`. Keep `use-open-state` in
   `list-container/utils` because ButtonDropdown uses it.
7. Extend the lint rule to `select-dropdown`.

### What changes for each component

| Component                                | Change                                                                        |
| ---------------------------------------- | ----------------------------------------------------------------------------- |
| OptionList                               | As in B, plus it is the shared engine                                         |
| Select, Multiselect                      | Behaviour hook replaced; rendering through controlled `InternalOptionList`    |
| Embedded Multiselect                     | Behaviour hook replaced; previous focus rules kept through `embeddedBehavior` |
| ButtonDropdown, Autosuggest, PromptInput | Import paths only (`list-container`, `ListOption`)                            |
| test-utils, dev pages                    | Paths and class hashes                                                        |

### Dependencies after C

```
Select ──────────┐
Multiselect ─────┼──► select-dropdown ──► option-list ──► list-container, option
Embedded MS ─────┼───────────────────────► option-list
OptionList ──────┘
Autosuggest, PromptInput ──► list-container, option-list/use-announcement
ButtonDropdown ────────────► list-container
```

One engine; the only upward edges are type-only imports of `SelectProps` and `MultiselectProps`.

### Risk

- **Interaction behaviour (medium).** Highlight on open, focus routing, Escape, Space handling, wrap-around and
  type-ahead are re-implemented for Select and Multiselect. The first attempt already got one wrong (embedded
  Multiselect focus), which shows this is where regressions come from.
- **Layout (low to medium).** The controlled path must not add a wrapper inside the dropdown, or the list stops
  scrolling between header and footer. Unit tests can't see this; visual regression and integ tests can.
- **Everything in B.**
- **Mitigations already in place:** the existing component tests were kept with only import changes and pass;
  new tests pin embedded Multiselect focus and Escape; a DOM comparison over 113 states matched baseline.

### Remaining work to finish C

1. Move the `renderOption` and announcement types out of `select/interfaces` and `multiselect/interfaces` (B, step 2)
   so the only upward edges disappear.
2. Move `ListElementProps`, `GetOptionProps`, `ItemProps` and `ListProps` into `option-list/parts/types.ts` to
   break the type-only loop between `parts/list` and `use-option-list`.
3. Expose `options` on `UseOptionListApi` and drop `__listOptions`, so options aren't passed twice.
4. Rename `__footer` to `__listBottom`, and narrow `__listProps` to aria attributes, `statusType` and `onLoadMore`.
5. Run integration, visual-regression and a11y suites; these are the guards for focus and layout.
6. Add `option-list` to `required-props-for-components.ts` so the generic suites stop crashing on it.

### Verification

Everything in B, plus integration tests for Select, Multiselect and PropertyFilter (real focus, Escape,
scroll-to-load-more) and keyboard a11y checks.

---

## Side by side

| Aspect                              | A                                | B                                                         | C                                                     |
| ----------------------------------- | -------------------------------- | --------------------------------------------------------- | ----------------------------------------------------- |
| Files touched outside OptionList    | 0                                | Select, Multiselect, test-utils, Autosuggest, PromptInput | B + ButtonDropdown, dev pages, all `ListOption` users |
| OptionList → `src/select` imports   | Rendering and helpers            | None (types only, then none)                              | None (types only, then none)                          |
| Behaviour hooks                     | 2 (`useSelect`, `useOptionList`) | 2                                                         | 1 (+ dropdown layer)                                  |
| Row components                      | 2 (`Item`, `MultiselectItem`)    | 1                                                         | 1                                                     |
| Selection logic copies              | 2 (Multiselect, OptionList)      | 1                                                         | 1                                                     |
| Select/Multiselect interaction risk | None                             | None                                                      | Medium                                                |
| Select/Multiselect rendering risk   | None                             | Low to medium                                             | Low to medium                                         |
| Class-hash / snapshot churn         | None                             | Yes                                                       | Yes                                                   |
| Main guard                          | OptionList tests                 | Unit + DOM comparison + visual regression                 | B + integ + a11y                                      |
| Easy to revert                      | Yes, one component               | Moderate                                                  | Hard, many files                                      |

## Recommendation

- **Need to ship OptionList soon with zero risk to Select:** do A. It removes the fragile `useSelect` dependency and
  all the workarounds, and costs one duplicated hook.
- **Want the dependency direction fixed without touching interaction behaviour:** do B. It gets most of the
  structural benefit (one `Item`, one selection model, no OptionList → Select imports) and keeps the riskiest
  code (`useSelect`) untouched.
- **Want one engine:** keep C, which is already on the branch, and finish the six remaining items before merging,
  especially integration and visual-regression runs.

A sensible order if C feels too big for one PR: land A, then B, then C, each as its own PR on top of the last.
Each PR stays reviewable and each can be reverted on its own.
