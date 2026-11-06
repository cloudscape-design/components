# Use PlainList in OptionList: final report

## Decision: GO

OptionList's internal `Listbox` can render the shared `PlainList` instead of its own `List`. The fit check found one behavioral gap, which is how the highlighted option is scrolled into view. One optional prop on `PlainList` closes it, and the default value runs today's code for Select, Multiselect, VirtualList and the sticky-item dev page. No public `interfaces.ts` or documented prop changed. The review verdict is APPROVED, and the verification results match the baseline exactly.

## Where

- Worktree: `/Users/amanabiy/Documents/components/.worktrees/option-list-plain-list`
- Branch: `refactor/option-list-plain-list`, 1 commit ahead of `origin/feat/add-option-list` (`460ac0f4c`)
- Commit: `5297ed2efbc647fa8edb1ac25945aa0922faa1ae` (`5297ed2ef`) `refactor: Use PlainList in OptionList`
- Diff (`git diff --shortstat origin/feat/add-option-list..HEAD`): `3 files changed, 20 insertions(+), 87 deletions(-)`. Without the deleted `list.tsx` (78 lines), the change is +20 / −9.

Files:
- `src/internal/components/listbox/parts/plain-list.tsx`: adds the `scrollStrategy` prop.
- `src/internal/components/listbox/index.tsx`: renders `PlainList` with `menuProps={mergedListProps}`, `filteredOptions={options}`, `filteringValue=""`, `isMultiSelect={mergedListProps.isMultiSelect}` and `scrollStrategy="ancestors"`. The ref type is now `SelectListProps.SelectListRef`. `ListboxProps` is unchanged.
- `src/internal/components/listbox/parts/list.tsx`: deleted. Nothing in `src/` imports it any more.

## PlainList changes

| Option | Type | Default | Behavior |
|---|---|---|---|
| `scrollStrategy` (new, optional, on `SelectListProps`) | `'menu' \| 'ancestors'` | `'menu'` | `'menu'` calls the existing `scrollToIndex`, which scrolls only the menu and skips menus 15 px tall or less (AWSUI-60318). `'ancestors'` calls the existing `scrollOptionIntoView`, which scrolls through all scrollable ancestors and skips index −1, as `List` did. |

No other PlainList prop changed, and no prop became optional. `scrollStrategy` was added to the `useImperativeHandle` deps. The `moveFocus`, `menuRef.current` and `!isSticky` guards are unchanged.

Known DOM-only difference, accepted in the fit check and the review: OptionList's list element now gets an inline `scroll-padding-block-start: 0px`, because `PlainList` always sets `stickyItemBlockSize`. Before, it had no inline value, which resolves to the same 0. Scrolling is unaffected, and no test asserts on it.

## Test results

| Check | Before (`460ac0f4c`) | After (`5297ed2ef`) |
|---|---|---|
| Targeted unit (option-list, select, multiselect, autosuggest, property-filter, listbox, options-list, selectable-item) | 81/81 suites, 1211/1211 tests | 81/81 suites, 1211/1211 tests |
| Snapshots (`src/__tests__/snapshot-tests`, no `-u`) | 4/4 suites, 113/113 tests, 111/111 snapshots | 4/4 suites, 113/113 tests, 111/111 snapshots, 0 written, 0 obsolete |
| Integ (option-list, select, multiselect) | 11/12 suites, 137/138 tests, 1 pre-existing failure | 11/12 suites, 137/138 tests, the same 1 failure |
| ESLint (listbox, option-list, select, multiselect) | clean | clean |
| tsc (src) | 0 errors | 0 errors |
| tsc (pages) | 2 known `@formatjs/ecma402-abstract` errors | the same 2, no others |
| quick-build / full build | pass (2 webpack asset-size warnings) | pass (the same 2 warnings) |

The pre-existing integ failure is `async-select.test.ts` › "Async select scrolling (with virtualScrolling=true) › the bottom of the dropdown lines up with the highlighted option, when going down the list" (expected ≤ 3, received 32). It fails the same way on the base branch, was reproduced 3 times there, and is recorded in earlier task docs.

No test file is in the diff, and no test expectation changed. Pre-commit hooks passed.

## Push status

Nothing was pushed. `git status -sb` shows `[ahead 1]` against `origin/feat/add-option-list`, and `git ls-remote --heads origin refactor/option-list-plain-list` returns nothing. The working tree is clean.

---

## Draft PR description

**Title:** `refactor: Use PlainList in OptionList`
**Base branch:** `feat/add-option-list`

```markdown
### Description

OptionList now renders the shared `PlainList` (with a new optional `scrollStrategy` prop, default `'menu'`) instead of its own `List`, which is deleted.

Related links, issue #, if available: n/a

### How has this been tested?

- Unit tests for option-list, select, multiselect, autosuggest, property-filter and listbox: 1211/1211 pass, same as the base branch. No test changes.
- Snapshot tests: 111/111 pass, none written.
- Integration tests for option-list, select and multiselect: 137/138 pass. The one failure (`async-select` virtual scrolling, 32 px) also fails on the base branch.
- `tsc` and ESLint are clean.

<details>
   <summary>Review checklist</summary>

_The following items are to be evaluated by the author(s) and the reviewer(s)._

#### Correctness

- _Changes include appropriate documentation updates._
- _Changes are backward-compatible if not indicated, see [`CONTRIBUTING.md`](https://github.com/cloudscape-design/components/blob/main/CONTRIBUTING.md#public-apis)._
- _Changes do not include unsupported browser features, see [`CONTRIBUTING.md`](https://github.com/cloudscape-design/components/blob/main/CONTRIBUTING.md#browsers-support)._
- _Changes were manually tested for accessibility, see [accessibility guidelines](https://cloudscape.design/foundation/core-principles/accessibility/)._

#### Security

- _If the code handles URLs: all URLs are validated through [the `checkSafeUrl` function](https://github.com/cloudscape-design/components/blob/main/src/internal/utils/check-safe-url.ts)._

#### Testing

- _Changes are covered with new/existing unit tests?_
- _Changes are covered with new/existing integration tests?_
</details>

---

By submitting this pull request, I confirm that you can use, modify, copy, and redistribute this contribution, under the terms of your choice.
```
