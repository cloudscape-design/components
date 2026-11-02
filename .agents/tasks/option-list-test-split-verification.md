# OptionList unit test split — verification

Worktree: `.worktrees/pr3-option-list`, branch `feat/add-option-list`. Test files only, no product code changes.
Commit: `5bd3629480b14c56acf269b7a5a1771f7028f925` on top of `b2a25baac`. Not pushed.

## Final file set (`src/option-list/__tests__/`)

| File | Tests | Select/Multiselect counterpart |
|---|---|---|
| common.tsx | helpers only | `select/__tests__/common.ts`, `multiselect/__tests__/common.ts` (.tsx because `Stateful` is JSX) |
| option-list.test.tsx | 19 | `select.test.tsx` / `multiselect.test.tsx` (rendering, selection, ref). Only file mocking `warnOnce` |
| disabled.test.tsx | 9 | `select/__tests__/disabled.test.tsx` |
| keyboard.test.tsx | 7 | no direct counterpart (Select tests keyboard in select.test.tsx); split out for size |
| highlight.test.tsx | 18 | no direct counterpart; the only file that mocks `scrollIntoView` (top-level beforeEach/afterEach restore) |
| group-state.test.tsx | 12 | `select/` and `multiselect/__tests__/group-state.test.tsx` (group checkbox state, group navigation, group type-ahead) |
| render-option.test.tsx | 4 | `select/` and `multiselect/__tests__/render-option.test.tsx` |
| option-list-a11y.test.tsx | 6 | `select/__tests__/select-a11y.test.tsx` (axe + highlighted announcement override) |
| i18n.test.tsx | 3 | `select/` and `multiselect/__tests__/i18n.test.tsx` |
| **Total** | **78** | |

Integration tests in `__integ__/` are unchanged.

## Mapping of original tests (original describe › name → new file)

rendering
- renders a labelled, focusable listbox with an option per item → option-list
- renders label and description → option-list
- renders icon, label tag and tags → option-list
- passes aria-labelledby and aria-describedby to the listbox → option-list
- renders an empty listbox when there are no options → option-list
- warns about duplicate values → option-list

selection (all → option-list)
- single: marks only the selected option with aria-selected and a check mark
- single: clicking replaces the selection and repeat click keeps it selected
- single: uses only the first selected option
- onChange returns the original option objects
- multi: marks the listbox multiselectable and every selected option
- multi: clicking toggles options and keeps the selection order
- controlled: does not change the selection without the consumer updating selectedOptions
- controlled: matches selected options by value, not by reference
- ignores selected options that do not match an option
- uncontrolled: manages selection internally and fires onChange

disabled options (all → disabled)
- marks disabled options and ignores clicks on them (single, multi)
- keyboard can reach a disabled option but Enter does not select it
- a selected disabled option stays selected and cannot be deselected in multi mode
- describes the disabled option with its disabled reason
- describes the disabled option with its disabled reason when renderOption is used (single, multi) — regression: aria-describedby with custom content kept mounted
- shows the disabled reason tooltip when a disabled option is highlighted with the keyboard
- Escape closes the disabled reason tooltip and keeps the highlight and selection

keyboard
- focus highlights the first option, arrows move with wrap-around, Home and End jump → keyboard
- Home and End move the highlight without the browser scrolling the page → keyboard
- Enter and Space select the highlighted option → keyboard
- Escape is not handled and reaches the parent → keyboard
- type-ahead highlights the matching option → keyboard (regression: type-ahead)
- type-ahead after Space selects moves the highlight to the matching option → keyboard (regression: type-ahead)
- blur clears the highlight → MERGED into keyboard › "blur clears the highlight and aria-activedescendant"

focus and highlight (all → highlight, describe "OptionList focus and highlight")
- does not show a highlight before the user interacts with the list
- does not scroll when a grouped list mounts without a highlight (regression: no scroll on unfocused grouped mount; local fixture renamed `groupedOptions` → `twoGroups` to avoid shadowing the shared fixture)
- hovering highlights the option without scrolling, and leaving the list clears it
- focus entry highlights and scrolls to the first option
- focus entry highlights the selected option with the keyboard style and scrolls to it
- focus entry highlights the first selected option in list order, not selection order
- keyboard focus entry replaces a hover highlight with the selected option (regression: keyboard focus on selected despite hover)
- keyboard focus entry replaces a hover highlight with the first option when nothing is selected (regression)
- focus from a pointer adds no highlight and does not scroll
- focus after selecting with the mouse highlights and scrolls to the selected option
- keyboard moves scroll the highlighted option into view (regression: scroll on keyboard moves)
- repeating a keyboard move that keeps the highlight scrolls it into view again (regression: scrollRequest)
- a keyboard highlight of the hovered option scrolls it into view (regression)
- hovering after keyboard navigation does not scroll

highlight when options change (→ highlight, describe "OptionList highlight when options change"; regression: highlight reconcile)
- has no aria-activedescendant without a highlighted option → MERGED into keyboard › "blur clears the highlight and aria-activedescendant"
- clears the highlight when the highlighted option is removed, and arrow keys still move it → highlight
- keeps the keyboard highlight on the same option when options are reordered or inserted, without scrolling → highlight
- keeps the mouse highlight on the same option when options are reordered → highlight
- multi: keeps a highlighted group header when groups are reordered → highlight

option groups (all → group-state, describe "OptionList option groups"; `single:`/`multi:` prefixes became nested describes "single selection"/"multi selection")
- single: arrows wrap at the first and last options when the list starts and ends with an empty group (regression: wrap with empty groups)
- single: arrows still wrap when the list starts with a group that has options (regression)
- renders each group labelled by its header, and option finders skip the headers
- single: group headers cannot be chosen and arrow keys skip them
- multi: the group header is checked, mixed or unchecked by its selected options
- multi: choosing a group header toggles its enabled options with the mouse and keyboard
- multi: a disabled group disables its options
- onChange returns the original options and never a group
- type-ahead › multi: highlights the option that matches, not its group, and Enter selects only that option (regression: type-ahead)
- type-ahead › multi: repeating a key cycles through the matching group and options, skipping a disabled group (regression: type-ahead)
- type-ahead › single: skips the options of a group whose label matches (regression: type-ahead)
- announces the group of the highlighted option

renderOption (→ render-option)
- renders custom content for options and group headers with the original options → render-option
- single/multi: parent reflects the group state, not the disabled state of the option → render-option (regression: parent.disabled)
- multi: group header items include the checkbox state → MERGED into the next test
- multi: items carry the option icon and the group selection state → render-option, renamed "multi: items carry the option icon, and group header items the group and its checkbox state"

top level
- ref.focus() focuses the listbox → option-list
- announces the highlighted option as selected with i18nStrings.selectedAriaLabel → i18n
- hides the top divider of the first option only → option-list (rendering)
- passes id, className and data attributes to the root → option-list (rendering)
- is accessible: single selection / multi selection / single selection with groups / multi selection with groups → option-list-a11y

renderHighlightedAriaLive (→ option-list-a11y, both kept)
- announces the highlighted option with the custom text, for example with custom option content
- receives the consumer option objects and the group when it changes

i18n provider (→ i18n)
- announces the selected option with the provider message
- i18nStrings.selectedAriaLabel takes precedence over the provider message

"Required option values" is a type-level change with no unit test in the original file, so nothing to carry over.

## Removed (merged) tests

1. "blur clears the highlight" + "has no aria-activedescendant without a highlighted option": same render → focus → blur steps on the default list; merged into one test that keeps every assertion (highlight and aria-activedescendant absent before focus, present after focus, absent after blur).
2. "multi: group header items include the checkbox state": its multi group-item state (selected false, indeterminate true, highlighted false with one child selected) was already asserted by the icon/group-state renderOption test. The one extra check (group item carries the group option) moved into that test as a `toHaveBeenCalledWith(objectContaining({ type: 'group', option }))` assertion.

No other tests were removed. Remaining near-duplicates (for example the two type-ahead tests in keyboard.test.tsx) use different setups or guard specific regressions, so they stay.

## Test counts

- `TZ=UTC npx jest -c jest.unit.config.js src/option-list src/internal/components/listbox`: before 147 tests / 8 suites, after 145 tests / 15 suites, all passing.
- OptionList unit tests only: before 80, after 78.

## Coverage

The task's `--collectCoverageFrom='src/...'` globs report 0% because the tests import from `lib/components`. Coverage below was collected with `--collectCoverageFrom="lib/components/<dir>/**/*.js" --coverageThreshold='{}'` while running `src/option-list` tests.

| Scope | Metric | Before (stale lib) | After (rebuilt lib, new files) | Original file on rebuilt lib |
|---|---|---|---|---|
| option-list | Statements | 98.64% (73/74) | 98.64% (73/74) | — |
| | Branches | 94.11% (32/34) | 94.11% (32/34) | — |
| | Functions | 100% (22/22) | 100% (22/22) | — |
| | Lines | 98.52% (67/68) | 98.52% (67/68) | — |
| listbox | Statements | 92.18% (295/320) | 91.87% (294/320) | 91.87% (294/320) |
| | Branches | 80.81% (257/318) | 80.81% (257/318) | — |
| | Functions | 92.13% (82/89) | 91.01% (81/89) | 91.01% (81/89) |
| | Lines | 92.17% (271/294) | 92.17% (271/294) | — |

The listbox drop of 1 statement and 1 function is not caused by the split. The baseline ran against a `lib/` built before `npm run quick-build`. Running the original, unsplit test file against the rebuilt `lib/` gives the same 294/320 and 81/89. A diff of the per-function and per-statement hit maps (original file vs new files, same lib) found no function or statement covered by the original file that the new files miss.

## Other checks

- `npm run quick-build`: passed on the first run.
- `npx eslint src/option-list`: clean, no errors or warnings.
- The pre-commit hook (lint-staged eslint --fix, git-secrets) passed with no extra changes.
- `git checkout -- pages/tsconfig.tsbuildinfo package-lock.json`: `package-lock.json` unchanged; `pages/tsconfig.tsbuildinfo` was already untracked before this step and was left as is. Not staged.
- `.agents/`, `pages/option-list/repro-mount-scroll.page.tsx`, `pages/tsconfig.tsbuildinfo` remain untracked and uncommitted.

## `git show --stat HEAD`

```
commit 5bd3629480b14c56acf269b7a5a1771f7028f925 (HEAD -> feat/add-option-list)
    test: Split OptionList unit tests by feature

 src/option-list/__tests__/common.tsx            |  89 ++
 src/option-list/__tests__/disabled.test.tsx     | 118 +++
 src/option-list/__tests__/group-state.test.tsx  | 215 ++++
 src/option-list/__tests__/highlight.test.tsx    | 252 +++++
 src/option-list/__tests__/i18n.test.tsx         |  41 +
 src/option-list/__tests__/keyboard.test.tsx     | 108 ++
 .../__tests__/option-list-a11y.test.tsx         |  59 ++
 src/option-list/__tests__/option-list.test.tsx  | 991 +------------------
 .../__tests__/render-option.test.tsx            | 119 +++
 9 files changed, 1030 insertions(+), 962 deletions(-)
```
