# OptionList unit tests split by feature

Commit `5bd362948` (`test: Split OptionList unit tests by feature`, on top of `b2a25baac`) replaces the 1,100-line `src/option-list/__tests__/option-list.test.tsx` with a shared `common.tsx` and eight feature files laid out like `select/__tests__` and `multiselect/__tests__`. The change touches only the nine test files. Two pairs of tests were merged, and in both cases every assertion survives. All the other 67 original test titles exist unchanged in the new files, apart from `single:`/`multi:` prefixes that moved into nested `describe` blocks. A line-level comparison of the original file with the new files finds no assertion dropped. The only lines missing from the new files are the merged titles, the hoisted helper declarations and two renamed local identifiers. Watch for: nothing blocking. The `keyboard` and `highlight` files have no Select counterpart, but the task listed them by name.

**Verdict**: APPROVED

## High-level view

`common.tsx` holds the fixtures (`options`, `withDisabled`, `groupedOptions`), the `Stateful` wrapper and the helpers (`renderOptionList`, `clickOption`, `pressKey`, `selectedLabels`, `highlightedValue`). This matches what `select/__tests__/common.ts` does. The `.tsx` extension is needed because `Stateful` is written in JSX. `option-list.test.tsx` keeps rendering, selection, ref and root attributes. It is still the only file that mocks `warnOnce`, which is correct because the duplicate-value warning test lives there. File names follow the Select and Multiselect convention: `disabled`, `group-state`, `render-option`, `i18n`, and `option-list-a11y` in place of `select-a11y`.

The `scrollIntoView` mock lives only in `highlight.test.tsx`. It is installed in a top-level `beforeEach` and restored in `afterEach`. The original file installed the same mock in two separate describe blocks, so this consolidates them. Some tests that used to run under the mock now run without it: the aria-activedescendant assertions merged into `keyboard.test.tsx`, plus the group navigation tests. This is safe because `scrollElementIntoView` calls `element?.scrollIntoView?.(...)` (scrollable-containers.ts:94), so it does nothing in jsdom.

The two merges hold up against the original. "blur clears the highlight" and "has no aria-activedescendant without a highlighted option" both ran render → focus → blur on the default list. The merged test keeps all six assertions. "multi: group header items include the checkbox state" checked selected false, indeterminate true and highlighted false for a partially selected group. The icon/group-state renderOption test already asserted exactly that state, and the merged version adds the original's one extra check, the group `option` identity. The original used the two-group `groupedOptions` fixture and the merged test uses a one-group fixture. This loses nothing, because the asserted group is the first one in both.

Every regression test named in the brief survives:
- type-ahead: two tests in keyboard, three in group-state
- `parent.disabled` in renderOption
- `aria-describedby` with custom content still mounted, with no tooltip shown
- scrolling on keyboard moves, including repeated moves and the hovered option
- highlight reconciliation when options change (four tests)
- arrows wrapping at the first and last options, including empty groups
- keyboard focus going to the selected option despite a hover
- `renderHighlightedAriaLive` (two tests)
- no scroll when a grouped list mounts without a highlight

The original had no unit test for "Required option values", so there was nothing to carry over.

The verification note records coverage before and after. OptionList coverage is unchanged. Listbox coverage is down by one statement and one function. The note shows this comes from a `lib/` rebuild, not from the split: the unsplit original file gives the same numbers on the rebuilt `lib/`, and a per-statement diff of hit maps finds nothing the original covered that the new files miss. The test count went from 80 to 78, which matches the two merges. The commit contains only the nine test files. `.agents/`, `pages/tsconfig.tsbuildinfo` and `pages/option-list/repro-mount-scroll.page.tsx` are untracked and not committed. `package-lock.json` is unchanged.

<details>
<summary>Issues (0)</summary>

No blocking or non-blocking action items.

</details>

<details>
<summary>File map</summary>

- `common.tsx`: shared fixtures, `Stateful`, render, key and click helpers (new)
- `option-list.test.tsx`: reduced to rendering, selection, ref and root attributes; keeps the `warnOnce` mock
- `disabled.test.tsx`: disabled options, disabled reasons and the tooltip
- `keyboard.test.tsx`: arrows, Home/End, Enter/Space, Escape, type-ahead, the merged blur test
- `highlight.test.tsx`: focus entry, hover, scrolling, highlight reconciliation; the only `scrollIntoView` mock
- `group-state.test.tsx`: groups, nested single/multi describes, group type-ahead
- `render-option.test.tsx`: renderOption item shapes, including the merged group-header test
- `option-list-a11y.test.tsx`: axe checks (`test.each` ×4) and `renderHighlightedAriaLive`
- `i18n.test.tsx`: `selectedAriaLabel` via props and the provider

Full diff: `git -C .worktrees/pr3-option-list diff b2a25baac..HEAD`

</details>
