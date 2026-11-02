# OptionList (#5180): split by functionality, feasibility

Read-only analysis of `.worktrees/pr3-option-list` at `9e4db4e02`, diffed against `origin/refactor/add-listbox-selection-models` (#5179). I ran no builds; the line counts below are estimates from reading the code.

## Summary

- The 5-PR functional stack is feasible in the proposed order: core, then disabled, then groups, then type-ahead, then custom rendering. Every split point is easy except groups, which is medium. Splitting mostly means deleting code from earlier PRs. Very little intermediate code has to be written.
- #5179 does not force groups into PR 1. OptionList calls `singleSelection(selected)` and `multiSelection(selected, { options, interactiveGroups: true })`. With flat options, `getGroupState` is never reached for a group, and `interactiveGroups` only changes behavior for `type: 'parent'` rows.
- The public types only grow in this order. `Options` widens from `Option[]` to `Option | OptionGroup`, a new optional `group` argument is added, and the `Item` union is introduced together with `renderOption` in the last PR, after groups exist. No later PR breaks an earlier PR's types.
- Release: merging PR 1 into main publishes `OptionList` in the next package release. Every `src/<dir>` is public automatically, and there is no feature flag. The repo has two precedents for unreleased work: stage the component under `src/internal/components/…`, or ship it publicly with no website docs (navigable-group).
- One correction to the brief: the 3 test-reorg commits are already pushed. `HEAD` and `origin/feat/add-option-list` are both `9e4db4e02`.

## 1. Mapping

Legend: C = core, D = disabled, G = groups, T = type-ahead, R = custom rendering (`renderOption` and `renderHighlightedAriaLive`).

| File | C | D | G | T | R |
|---|---|---|---|---|---|
| `listbox/use-listbox.ts` (292) | All highlight, scroll, keyboard, focus and blur logic; `withScroll`/`scrollRequest`; options-change sync; `selectOption`; `getListProps`; `getOptionProps` (selected, prev/next selected); `useAnnouncement` with `selectedAriaLabel`. About 255 lines. | none (`isInteractive` already rejects disabled options) | `isHighlightable` parent check; `interactivityCheck` choice; the `type==='parent'` part of `isSameOption`; group branch of `isSelectedAt`; `groupState`/`indeterminate` in `getOptionProps`; group part of `announceSelected`; `getParent` prop. About 25 lines. | `useTypeAhead` call and `onTypeAhead` in the API (about 8 lines) | `renderHighlightedAriaLive` passthrough (about 3 lines) |
| `listbox/parts/item.tsx` (259) | `Item`, `SelectableItem` single/multi, `CheckboxIcon`, check icon, `Option` content, common props. About 140 lines. | `disabledReason`, `useHiddenDescription`, `canShowTooltip` effect, `Tooltip` with `onEscape`, `ariaDescribedby`, `disabledReasonContent`. About 30 lines. The plain `disabled` passthrough comes from `DropdownOption` and can stay in C. | `isParent`/`isChild`, `indeterminate`, `ariaChecked='mixed'`, `isGroupOption`. About 15 lines. | none | `ItemParentProps`, `RenderItemProps`, `toSingleGroupItem`, `toMultiGroupItem`, `toRenderItem`, `renderResult`, `disableContentStyling`, `!renderResult` guards, `renderOption`/`parentProps` props. About 75 lines. |
| `listbox/parts/list.tsx` (78), `listbox/index.tsx` (56) | all (`renderOption` forwarding: about 4 lines go to R) | | | | prop forwarding |
| `parts/render-options.tsx` (+17) | `selectionType` → `ListboxItem` | | | | |
| `parts/scroll-to-index.ts` (+17) | `scrollOptionIntoView` | | `index < 0` guard (b2a25baac): only group headers render `data-mouse-target=-1` | | |
| `parts/styles.scss` (36) | `.item`, `.checkbox`, `.selected-icon`, `.show-label-tag` | `.disabled-reason-tooltip` | | | |
| `use-type-ahead.ts` (94) and its test (121) | | | | all, including group branches (`interactiveGroups`, `isGroup(currentHighlight)`) | |
| `options-list/index.tsx`, `use-keyboard.ts`, `selectable-item/*` | all (optional `statusType`, `onMouseLeave`, optional `closeDropdown`, `hideTopDivider`) | | | | |
| `option-list/interfaces.ts` (156) | Main props, `SelectionType`, `Option` (value/label/lang/description/labelTag/tags/icon), `ChangeDetail`, `I18nStrings`, `Ref`. About 85 lines. | `disabled`, `disabledReason` fields and docs (about 5 lines) | `OptionGroup` type and docs, `Options` union (about 20 lines) | none | `OptionItem`, `OptionGroupItem`, `Item`, `OptionItemRenderer`, `ContainingOptionAndGroupString`, both props (about 50 lines) |
| `option-list/internal.tsx` (208) | `toInternalOptions` (flat path), originals map, value checks, `useControllable`, selection models, `useListbox`, `useForwardFocus`, root, `getOptionProps` override (`hideTopDivider`, `data-option-index`, `data-value`). About 130 lines. | none | Group branch of `toInternalOptions`, `originalGroups`/`toPublicGroup`, `parentMap`/`getParent`, `leafIndexes`, `group-header` class (about 35 lines). In C, `data-option-index` becomes `index + 1`. | `onKeyDown={controller.onTypeAhead}` | `renderOriginalOption`, mapping in `renderHighlightedAriaLive` (about 30 lines) |
| `option-list/index.tsx`, `styles.scss`, `test-classes` (`.root`, `.option`) | all | | `.group-header` | | |
| `test-utils/dom/option-list/index.ts` (132) | `OptionListOptionWrapper` (label/description/labelTag/tags/isSelected/isHighlighted), `findOptions`, `findOptionByIndex`, `findOptionByValue`, `findSelectedOptions`, `findHighlightedOption`. About 100 lines. | `isDisabled` (7 lines) | `findGroupHeaders`, `findGroupHeaderByValue`, the "group headers not included" docs (about 20 lines) | | |
| Snapshots (documenter, test-utils selectors/wrappers) | regenerated in every PR | regen | regen | none | regen |
| i18n (`messages-types.ts`, 15 × `all.*.json`) | all (`option-list.i18nStrings.selectedAriaLabel`) | | | | |
| `eslint.config.mjs`, `pluralize.js`, `required-props-for-components.ts` | all | | | | |
| `__tests__/common.tsx` (89) | `options`, `Stateful`, `renderOptionList`, helpers | `withDisabled` | `groupedOptions`, group branch of `leafOptions` | | |
| `option-list.test.tsx` (238) | all | | | | |
| `keyboard.test.tsx` (92) | everything except one test | | | "type-ahead after Space selects" (about 10 lines) | |
| `highlight.test.tsx` (238) | about 210 lines | | "does not scroll when a grouped list mounts" and "multi: keeps a highlighted group header" (about 28 lines) | | |
| `i18n.test.tsx` (33) | all | | | | |
| `option-list-a11y.test.tsx` (59) | flat rows (use `options` instead of `withDisabled`) | `withDisabled` rows | grouped rows | | `renderHighlightedAriaLive` describe (about 33 lines). Its group test needs G. |
| `disabled.test.tsx` (111) | | all | | | |
| `group-state.test.tsx` (209) | | | about 150 lines ("a disabled group" needs D) | `type-ahead` describe (about 58 lines) | |
| `render-option.test.tsx` (119) | | | | | all |
| `__integ__/option-list.test.ts` (60) | 3 tests | | "clicking a group header" | | |
| `__integ__/option-list-scroll.test.ts` (123) and `scroll.page.tsx`/`.scss` | all (flat 100 options) | | | | |
| `pages/simple.page.tsx` (235) | `single` and `multi` sections, settings, focus buttons | `efs` disabled option in the `services` section | `groups` section with `services` | `type-ahead` section with `typeAheadServices` | |
| `pages/permutations.page.tsx` (65) | `plain`, `withIcons`, `withTags` | `withDisabled` | `grouped` | | `renderOption` permutation |

### Per-PR size estimates

| PR | Product code | Unit tests | Integ tests | Pages | Notes |
|---|---|---|---|---|---|
| 1 Core | about 1,000 (engine about 560, OptionList about 260, test-utils about 100, shared/eslint/i18n about 110) | about 600 | about 175 | about 420 | plus documenter/test-utils snapshots of about 450 lines |
| 2 Disabled | about 45 | about 120 | none | about 10 | |
| 3 Groups | about 115 | about 210 | about 8 | about 50 | |
| 4 Type-ahead | about 100 | about 190 | none | about 40 | |
| 5 Custom rendering | about 160 | about 155 | none | about 5 | |

### Fix commits by PR

| Commit | PR |
|---|---|
| `87323099f` Home/End | 1 |
| `87344fe15` repeated scroll | 1 |
| `4f66c43bf` highlight sync | 1 (its group-header reorder test goes to 3) |
| `251106063` focus despite hover | 1 |
| `5360ed2b9` required values | 1 |
| `f3e409926` i18n namespace | 1 |
| `fd429dfb6` arrow wrap | 3 (the wrap code works for flat lists, so the code goes to 1 and the empty-group tests go to 3) |
| `b2a25baac` no scroll when nothing is highlighted | 3 (guard and test) |
| `84d4a8c73` tooltip Escape | 2 |
| `dabe649b1` group-header type-ahead | 4 |
| `e000abffd` handled keys type-ahead | 4 |
| `977d24fad` renderOption types | 5 |
| `e97a70c9d` parent group state | 5 |
| `d60d7e256` disabled reason with custom content | 5 (needs 2) |
| `5a726a486` renderHighlightedAriaLive | 5 |

## 2. Split points

| Between | What changes in the earlier PR | Shared logic | Difficulty |
|---|---|---|---|
| 1 → 2 Disabled | Remove `disabled`/`disabledReason` from `Option`. Remove the hidden description, `Tooltip` and `canShowTooltip` from `item.tsx`, the `.disabled-reason-tooltip` style, and `isDisabled`. | The disabled behavior is already in #5179 and shared utilities: `flattenOptions` sets `DropdownOption.disabled`, `isInteractive` blocks choosing, `multiSelection.toggle` treats disabled options as selected, and disabled options stay highlightable. PR 1 therefore behaves correctly if someone passes `disabled` through a cast. PR 2 mostly adds the public field and the reason tooltip. | Easy |
| 2 → 3 Groups | `use-listbox.ts` without its 7 group touch points: `isHighlightable = o => !!o`, `isSameOption` without the parent check, plain `isSelectedAt`, no `groupState`/`indeterminate`, `announceSelected` without the group check, no `getParent`. `item.tsx` without `isParent`/`indeterminate`. `internal.tsx` with a flat `toInternalOptions`, no `parentMap`/`leafIndexes`/`group-header`, and `data-option-index = index + 1`. `scroll-to-index` without the `-1` guard. This is all deletion; nothing new has to be written. | `data-mouse-target=-1` exists only for single-selection group headers, so the `-1` guard and its test belong in G. The wrap logic (`findIndex(isHighlightable)`) is generic and stays in C. In multi selection, groups depend on `interactiveGroups: true` and `getGroupState`, both from #5179. Announcements with a group depend on `getParent`, which `useAnnouncement` in #5179 already accepts. "A disabled group disables its options" couples G to D, so D goes first. | Medium (touches 6 files, all subtractive) |
| 3 → 4 Type-ahead | Remove the `useTypeAhead` call, `onTypeAhead` and the root `onKeyDown`. | The hook's group branches (`interactiveGroups`, `isGroup(currentHighlight)`) are only meaningful with groups. Doing G first lets the hook land complete, with the `dabe649b1` regression test. If T went before G, its group branches would be untested until G. | Easy |
| 4 → 5 Custom rendering | `item.tsx` without `toRenderItem` and its helpers, without `renderResult` (always the default content), and with no `!renderResult` guards. `interfaces.ts` without the `Item` types or the two props. `internal.tsx` without `renderOriginalOption`. `use-listbox` without the `renderHighlightedAriaLive` passthrough. | `parent` and `OptionGroupItem` need G. `d60d7e256` (`aria-describedby` stays mounted with custom content) needs D. `renderHighlightedAriaLive(option, group)` needs G for the `group` argument. `useAnnouncement` already supports a custom renderer. | Easy |

Alternatives I considered:

- **Groups into core:** this avoids the medium split point but grows PR 1 by about 400 lines and mixes the two hardest review topics. The split is subtractive, so it isn't worth it.
- **Disabled + groups in one PR:** these features don't share logic beyond one test, so there is no gain.
- **Disabled into core:** this is the only merge worth considering. It saves a small PR (about 45 product lines) if reviewers want fewer PRs.

On types, the proposed order never breaks published types.

- `Options` widening in PR 3 only widens an input.
- The `group?` argument is optional.
- `Item = OptionItem | OptionGroupItem` and `parent` arrive in PR 5, after groups exist. Introducing `renderOption` before groups would make PR 3 a type break for consumers' `renderOption` callbacks.

The test-utils split works: `isDisabled` can go to PR 2, `findGroupHeaders`/`findGroupHeaderByValue` to PR 3, and each PR adds methods and regenerates the snapshot.

## 3. Dependency on #5179

No group dependency is forced.

- `single-selection.ts` and `multi-selection.ts` return `getGroupState`, which only does work when `isGroup(option.option)` (or select-all) applies.
- OptionList passes flat options, so these group branches never run. They are already covered by #5179's own tests (`selection/__tests__/*`).
- `interactiveGroups: true` in multi selection only switches between `isGroupInteractive` and `isInteractive`. These two differ only for parent rows.
- `useSelect`'s group state is not used by OptionList at all.

PR 1 still has to stack on #5179, because it uses `SelectionModel`, `connectOptionsByValue`, `useAnnouncement` and `checkOptionValueField` from that branch.

## 4. Release

Merging PR 1 into main makes OptionList public in the next package release:

- `build-tools/utils/files.js` `listPublicItems('src')` treats every `src/<dir>` as public, except `internal`, `types`, `test-utils`, `i18n`, `theming`, `plugins`, `contexts` and names starting with `__`.
- `build-tools/tasks/generate-index-file.js` writes `export { default as OptionList, OptionListProps }` into `src/index.ts`.
- `build-tools/tasks/package-json.js` (`getComponentsExports`) adds `./option-list` and the test-utils exports.
- The documenter snapshot, the test-utils snapshots and `createWrapper().findOptionList()` all pick it up automatically.
- `required-props-for-components.ts` and `pluralize.js` only feed tests and test-utils generation.

There is no feature flag or "unreleased" marker; `@awsuiSystem` only tags a component or prop for a design system. The repo has two precedents:

1. **Staged as internal, then exposed:** `62efe831b chore: Refactor card into separate internal component (#4084)` put the card in `src/internal/components/card`, and `a1e1f5e7b feat: expose card component (#4315)` later moved it to `src/item-card` with the documenter and test-utils snapshots. Pages can import internals (for example `pages/options-list/simple.page.tsx`).
2. **Public in the package but undocumented:** `3a1996ead chore: Add navigable-group (#3785)` shipped `src/navigable-group` with test-utils and a documenter entry. Cloudscape website docs, which live outside this repo, decide what customers can find.

I did not check release cadence or how the website publishes docs.

## 5. Recommended stack

All five PRs stack linearly on #5179, and each one builds, passes its own tests and regenerates the snapshots. Titles follow `type: Subject`.

| # | Title | Contents | Size (product / tests incl. integ / pages) | Risk |
|---|---|---|---|---|
| 1 | `feat: Add OptionList component` | Flat options, single/multi, controlled and uncontrolled, keyboard, focus/highlight, scrolling (`scrollOptionIntoView`), options-change sync, default announcement and i18n, test-utils core methods, shared edits (options-list, use-keyboard, selectable-item, render-options), eslint rule, the `single`/`multi` sections of the simple page, the scroll page, flat permutations, both integ files except the group test | about 1,000 / about 775 / about 420 | Medium. Biggest review, and it sets the public API name. |
| 2 | `feat: Add disabled options to OptionList` | `disabled`/`disabledReason`, reason tooltip with Escape, hidden description, `isDisabled`, `disabled.test.tsx`, `withDisabled` a11y rows and permutation | about 45 / about 120 / about 10 | Low |
| 3 | `feat: Add option groups to OptionList` | `OptionGroup`/`Options` union, group handling in use-listbox, item and internal, `-1` scroll guard, group test-utils, `group-state.test.tsx` (minus type-ahead), the grouped highlight tests, grouped a11y rows, the empty-group wrap tests, the group-header integ test, the `groups` page section, grouped permutations | about 115 / about 220 / about 50 | Medium (most cross-cutting) |
| 4 | `feat: Add type-ahead to OptionList` | `use-type-ahead.ts` and its test, root `onKeyDown`, the type-ahead describe from `group-state.test.tsx` (or move it into a `type-ahead.test.tsx`; Select uses `select/__tests__/native-search.test.tsx`), the keyboard type-ahead test, the `type-ahead` page section | about 100 / about 190 / about 40 | Low |
| 5 | `feat: Add custom option rendering to OptionList` | `renderOption` (Item types, `parent` state, kept-mounted `aria-describedby`), `renderHighlightedAriaLive`, `render-option.test.tsx`, a11y `renderHighlightedAriaLive` tests, `renderOption` permutation | about 160 / about 155 / about 5 | Low |

How to build the stack: start from the final tree (`9e4db4e02`) and work backward. PR 5 is the current branch. Each earlier PR deletes the code that belongs to the later features, using the mapping above, which avoids re-deriving code forward.

The regression tests and test-reorg commits don't land as separate commits:

- Each Copilot-fix regression test lands in the PR of its feature, listed in "Fix commits by PR" above. The four that cross a boundary: `fd429dfb6` and `b2a25baac` go to PR 3, `dabe649b1` goes to PR 4, and `e97a70c9d`/`d60d7e256` go to PR 5.
- The 3 test-reorg commits (`5bd362948`, `550a18f6a`, `9e4db4e02`, already pushed) are absorbed: their per-feature file layout is what each PR introduces file by file.

For release, choose one of these before merging PR 1:

- **(a)** Accept "public but undocumented" until PR 5 lands, following navigable-group. Each PR only adds to the API, so this is safe for types. The cost is that consumers could adopt a partial component.
- **(b)** Point PRs 1–5 at a long-lived `feat/option-list` integration branch and merge it into main once.
- **(c)** Stage under `src/internal/components/option-list` and add a final `feat: Expose OptionList component`, as with the card. This means extra rework: tests can't use `createWrapper().findOptionList()`, and test-utils would need to move.

I recommend (a) if the team is fine with an undocumented public component, otherwise (b). (c) costs the most.
