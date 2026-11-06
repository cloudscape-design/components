# fix: Align Select and Multiselect keyboard and renderOption behavior

- Worktree: `/Users/amanabiy/Documents/components/.worktrees/fix-listbox-alignment`
- Branch: `fix/select-multiselect-listbox-alignment` (local, unpushed), on `refactor/move-shared-listbox-parts` (ccd5025fe)
- Verification details: `/Users/amanabiy/Documents/components/.agents/tasks/fix-listbox-alignment-verification.md`

## Commits

| New | Original | Subject |
|---|---|---|
| 67aad9e0b | 47562b91f | fix: Ignore non-matching group headers in Multiselect type-ahead |
| 885d1c5c3 | 300341c11 | fix: Ignore handled keys in Select and Multiselect type-ahead |
| 82b17f6b3 | 09ef01d7a | fix: Pass the group disabled state as parent in renderOption |
| 5e0fbf1db | 0fa07c12e | fix: Keep disabled reason description with custom renderOption content |
| 219984fe8 | 7726b0953 | fix: Prevent page scroll on Home and End in Select and Multiselect |
| 0bfc8592f | 7bec02e80 | fix: Wrap Select arrow keys at the first and last highlightable options |
| 655a8219f | new | fix: Find the highlighted option by identity in Multiselect type-ahead |

The commits keep the original order, subjects and bodies. No original body mentioned moved file paths.

## Fail-before / pass-after
Each fix's product hunk was reverse-applied at HEAD, then quick-build ran and the fix's tests were run. The tree was restored afterwards. All of these tests pass at HEAD.

| Commit | Fail without the fix | Excerpt |
|---|---|---|
| 67aad9e0b | 7 tests: 3 use-type-ahead group cases, 1 Select native-search, 3 Multiselect native-search | `toHaveBeenCalledWith` mismatch on the highlighted child |
| 885d1c5c3 | 4 tests: use-type-ahead "ignores keys that were already handled…", 2 Select and 1 Multiselect "typing right after … Space …" | `highlightOption` not called with option 1 |
| 82b17f6b3 | Select and Multiselect render-option "parent reflects the disabled state of the group, not of the option" | `Expected: false, Received: true` |
| 5e0fbf1db | Select and Multiselect render-option "keeps the disabled reason description for screen readers with custom content" | `getElementById(describedBy)` is `null` |
| 219984fe8 | use-keyboard "prevents the native Home and End action…", Select and Multiselect home-end "without filtering, … prevents the native page scroll" | `goHome` called 0 times |
| 0bfc8592f | Select arrow-key-wrap ArrowDown and ArrowUp empty-group wrap cases | `Expected: "Apple", Received: "Banana"` |
| 655a8219f | Tests written first. use-type-ahead "…cycles from the highlighted option when its group has the same value" and Multiselect native-search "repeating a character cycles to the next match when a group and its option share a value" | `Expected: "Cache", Received: "Cloud"` |

Fix 7 keeps a value fallback for a highlight that isn't one of the given objects. Select passes its `selectedOption` prop as the highlight while the dropdown is closed, and that can be an equal copy, so dropping the old value lookup would have changed Select's closed-trigger cycling. The `isGroup` branch is folded into the identity lookup, which gives the same result for groups. A new unit case, "cycles from a highlighted option that is an equal copy rather than the same object", covers the fallback. It fails when the fallback is removed. The identity evidence is in the commit body and the verification note.

## Conflicts and how they were resolved
- 47562b91f: content conflict in `src/internal/components/listbox/use-type-ahead.ts` (rename detected). I kept `interactiveGroups` and added the new comment and filter. The moved `use-type-ahead.test.ts` got the hunk, with `useNativeSearch` → `useTypeAhead` and `useInteractiveGroups` → `interactiveGroups`.
- 300341c11: applied cleanly, but its new unit case still called `useNativeSearch`. I fixed that by amending this just-created, unpushed local commit.
- 09ef01d7a, 0fa07c12e: modify/delete conflicts on `src/select/parts/item.tsx` and `multiselect-item.tsx`. I deleted the resurrected files and ported the hunks to `src/internal/components/listbox/parts/item.tsx`. For 09ef01d7a, `toSelectOptionItem` and `toMultiselectOptionItem` both now use `props.parentProps.disabled`. For 0fa07c12e, the merged item has one shared `disabledReasonElement` used by both branches, so the single edit covers both original hunks.
- 7726b0953, 7bec02e80: applied cleanly.
- No stale files at old locations.

## Tests
| | Suites | Tests |
|---|---|---|
| Base, full set incl. property-filter | 73 | 1147 |
| Final, full set incl. property-filter | 78 | 1176 |
| Base, without property-filter | 56 | 801 |
| Final, without property-filter | 61 | 830 |

- Snapshot tests (no `-u`): 112 tests and 110 snapshots pass at base and at final, with no diff.
- eslint on the changed files and `tsc -p tsconfig.json --noEmit`: clean.
- Integration tests: not run, because `/tmp/listbox-04-chromedriver` is missing.
- All npm/npx commands ran under Node 22 (`mise exec node@22.23.2 --`). The default Node 18 fails the build with `ERR_REQUIRE_ESM`.

```
$ git -C <worktree> -P diff --shortstat refactor/move-shared-listbox-parts...HEAD
 14 files changed, 572 insertions(+), 21 deletions(-)
```

## Overlap with OptionList (`feat/add-option-list`, read-only)
`feat/add-option-list` is based on 6997ceb24 (older main), not on this stack. Some of its commits make the same product change in shared listbox code. Their OptionList test hunks are unique, so git won't drop them automatically on rebase. Expect each one to shrink to its OptionList tests, plus conflicts in the shared files:
- dabe649b1 "Ignore non-matching group headers in OptionList type-ahead": same `use-type-ahead.ts` line change as 67aad9e0b. Its `use-type-ahead.test.ts` additions overlap with the group cases already added here. It reduces to the `option-list.test.tsx` tests.
- e000abffd "Ignore handled keys in OptionList type-ahead": same `event.defaultPrevented` change as 885d1c5c3. Its unit test duplicates "ignores keys that were already handled…". It reduces to the OptionList test.
- e97a70c9d "Pass the group state as parent in OptionList renderOption": the same fix as 82b17f6b3, but against that branch's restructured `item.tsx` (`toSingleGroupItem`/`toMultiGroupItem`). It also changes the `option-list/interfaces.ts` and documenter snapshot, which stay.
- d60d7e256 "Keep disabled reason description with custom OptionList options": the same change as 5e0fbf1db, in the restructured `item.tsx`. It reduces to the OptionList tests.
- 87323099f (Home/End) and fd429dfb6 (arrow wrap) change OptionList's own `use-listbox.ts`. They are counterparts of 219984fe8 and 0bfc8592f, not duplicates, and they stay.
- None of the OptionList commits fixes the identity lookup (fix 7). That branch still has the value-based `indexOf`.

## Draft PR description

Title: `fix: Align Select and Multiselect keyboard and renderOption behavior`

```
### Description

Fixes keyboard type-ahead, Home/End, arrow-key wrapping and renderOption details in Select and Multiselect.

- Multiselect type-ahead ignores group headers whose own label doesn't match.
- Select and Multiselect type-ahead ignores keys already handled elsewhere, such as Space.
- renderOption gets the group's disabled state as `parent.disabled`, not the option's.
- Disabled options with custom renderOption content keep their hidden disabled reason, so `aria-describedby` resolves.
- Home and End no longer scroll the page when the list has focus and there is no filter.
- Select ArrowUp and ArrowDown wrap at the first and last highlightable options when a group is empty.
- Multiselect type-ahead finds the highlighted option by identity, so cycling works when a group and its option share a value.

Related links, issue #, if available: n/a

### How has this been tested?

- New unit tests for each fix. Each one fails without its product change and passes with it.
- Updated Multiselect integration expectations for type-ahead with groups.
- Select, Multiselect, Autosuggest, Property filter, listbox, options-list, selectable-item and test-utils unit tests pass (1176 tests). Snapshot tests pass with no changes.

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
