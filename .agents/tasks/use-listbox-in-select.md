# Report: build useSelect on a shared useListbox hook

- Worktree: `/Users/amanabiy/Documents/components/.worktrees/listbox-use-listbox`
- Branch: `refactor/use-listbox-in-select`, 2 local commits on `origin/refactor/move-shared-listbox-parts` (`33cfa9917`, PR #5204).
- Status: approved by review (`use-listbox-in-select/review.md`). **Not pushed**: `git ls-remote --heads origin refactor/use-listbox-in-select` returns nothing. Waiting for your confirmation before pushing.
- Inputs: `use-listbox-in-select/plan.md`, `baseline.md`, `verification.md`, `review.md`.

## Branch and commits

```
$ git -P -C .worktrees/listbox-use-listbox log --stat origin/refactor/move-shared-listbox-parts..HEAD

commit 2a861fe1b6217defd6e8077e32e532fbfcef3c91 (HEAD -> refactor/use-listbox-in-select)
    refactor: Build useSelect on a shared useListbox hook

    New useListbox (src/internal/components/listbox/use-listbox.ts) owns the list state shared by list
    components: highlight, keyboard navigation, the choose guard, mouse handlers, row props and the
    selected-announcement flag. useSelect calls it and keeps the dropdown concerns: trigger, open state,
    filter, dialog, focus, Escape, the highlight on open and embedded focus. Its props and return values
    are unchanged.

    useMenuKeyboard gains an optional preventNativeHomeEnd (default false) and an optional closeDropdown
    (when omitted, Escape is not handled). All existing callers keep today's behavior.

    No behavior change and no existing test changed.

 .../listbox/__tests__/use-listbox.test.tsx      | 268 +++++++++++++++++++
 src/internal/components/listbox/use-listbox.ts  | 148 ++++++++++
 .../options-list/utils/use-keyboard.ts          |  19 +-
 src/select/utils/use-select.ts                  | 117 +++-----
 4 files changed, 475 insertions(+), 77 deletions(-)

commit e468024a7dc73622a97d7365ac97bb23fe362837
    refactor: Move listbox list prop types into the listbox folder

    ListElementProps (formerly MenuProps) and GetOptionProps now live in
    src/internal/components/listbox/interfaces.ts. PlainList imports them from there, so the shared list
    no longer depends on Select's hook module. No behavior change.

 src/internal/components/listbox/interfaces.ts        | 13 +++++++++++++
 src/internal/components/listbox/parts/plain-list.tsx |  4 ++--
 src/select/utils/use-select.ts                       |  8 ++------
 3 files changed, 17 insertions(+), 8 deletions(-)
```

Not changed: `select/internal.tsx`, `multiselect/*`, `select/parts/virtual-list.tsx`, autosuggest, property-filter.

## Line counts

| File | Before (`origin/refactor/move-shared-listbox-parts`) | After (`HEAD`) |
|---|---|---|
| `src/select/utils/use-select.ts` | 350 | 315 |
| `src/internal/components/listbox/use-listbox.ts` | does not exist | 148 (new) |
| `src/internal/components/listbox/interfaces.ts` | does not exist | 13 (new) |

`use-select.ts` shrinks by 35 lines, not 148, because most of what moved was already one-line calls into the `listbox/utils` helpers added in #5204. The new file is mostly types and JSDoc around that composition.

## What is shared now and what stays in useSelect

**Shared in `useListbox`** (a short composition of the listbox utils):

- Selected rows: `connectOptionsByValue(options, selection.selectedOptions)`.
- Highlight state and setters: `useHighlightedOption` with `isHighlightable` (from `utils/option-props.ts`).
- List id: `useUniqueId('option-list')`, still called before Select's `useUniqueId('dialog')`, so generated ids don't change.
- Choose guard: `getSelectableOption` with `isInteractive` / `isGroupInteractive`. What happens after a choice is the caller's `onSelect`.
- Keyboard: `useMenuKeyboard` + `getListboxNavigation` (from `utils/navigation.ts`). Callers configure it with `spaceSelects: 'always' | 'keyboard-highlight'`, `onEscape?` and `preventNativeHomeEnd?`.
- Mouse: `getListMouseHandlers`.
- Row props: `getListboxOptionProps`.
- Selected-announcement flag: `isAnnouncedSelected`.
- List prop types: `ListElementProps` and `GetOptionProps` in `listbox/interfaces.ts`.

**Still in `useSelect`**, because these are dropdown concerns OptionList doesn't have, or moving them would change `useSelect`'s API:

- Trigger props and `useTriggerKeyboard` (Up/Down/Space/Enter open the dropdown).
- Open state (`useOpenState`), `keepOpen` and close-on-select, focus returning to the trigger, `closeDropdownAndRefocus`.
- Filter input props. With a filter, keydown comes from the input and Space types unless an option has a keyboard highlight.
- Dialog id, `aria-controls`, and the menu and filter wiring.
- Highlight on open (first selected option, or Home, or a mouse highlight), and embedded Multiselect focus and blur.
- Select-all versus `updateSelectedOption`, passed in as `onSelect`.
- `useAnnouncement` stays in `select/internal.tsx` and `multiselect/use-multiselect.tsx`. Moving it into the hook would need new `useSelect` props (`getParent`, `selectedAriaLabel`, `renderHighlightedAriaLive`).
- Type-ahead stays with the components (`useTypeAhead` in `select/internal.tsx` and `use-multiselect.tsx`).

The one input that changed: selected rows come from `selection.selectedOptions` instead of the `selectedOptions` prop. All current callers build `selection` from the same array, so the result is identical. The precondition is documented on `UseSelectProps.selection` (review issue 1, non-blocking).

Still to do, and not part of this PR: `parts/plain-list.tsx`, `parts/item.tsx` and `parts/option-group.tsx` still import `select/parts/styles.css.js` (review issue 2).

## Tests

| Check | Baseline (`33cfa9917`) | After (`2a861fe1b`) |
|---|---|---|
| Unit (select, multiselect, autosuggest, property-filter, listbox, options-list, selectable-item) | 74 suites / 1157 tests | 75 suites / 1175 tests, all pass |
| Snapshot (no `-u`) | 4/4 suites, 112/112 tests, 110/110 snapshots | same |
| Functional | 10/10 suites, 1969/1969 tests | same |
| TSC / ESLint / quick-build / build | clean | clean (build has the same 2 webpack warnings) |

The new suite `listbox/__tests__/use-listbox.test.tsx` accounts for all 18 new tests: Space modes (4), Escape (2), Home/End (2), choosing (4), mouse (2), `getOptionProps` (3) and `announceSelected` (1). No existing test file changed; the `__tests__` diff lists only the new file. The plan suggested adding cases to `use-keyboard.test.ts`. That was skipped to keep existing test files untouched, and the new `useMenuKeyboard` options are covered through `useListbox` instead.

## Open decisions

1. **Folder location.** The hook and utils stay in `src/internal/components/listbox/` (with `utils/`, `parts/`, `selection/`), where #5204 already put the shared parts and where #5180's OptionList code lives. Andrei suggested `src/internal/utils/listbox`. Moving now would add a rename-only diff across #5204's files and the whole stack above it. Options: keep the current folder, or do the move as its own rename-only PR at the end of the stack. I'd keep it for now and ask Andrei in this PR whether that's OK.
2. **OptionList's inline focus layer as `useInlineListbox`.** #5180's hook (`useListbox` in the same file path) repeats most of what the new `useListbox` does. It adds: keeping the highlight in sync when options change, scroll requests (`withScroll`), focus/blur/mouse-down handling for a list that is a tab stop, the announcement, type-ahead, and `onChange(selection.getNextSelection(...))`. It could become `useInlineListbox`, built on `useListbox`, like `useMultiselect` is built on `useSelect`. To do that, `useListbox` needs a way to scroll on keyboard highlight (the `onKeyboardHighlight` wrapper the plan left out under YAGNI) and `preventNativeHomeEnd` (already added). Decide whether to do it in #5180 during the rebase or in a follow-up PR. A follow-up keeps the rebase mechanical.

## Rebasing #5180 (`feat/add-option-list`) onto this branch

Inspected read-only: `origin/feat/add-option-list` = local `feat/add-option-list` = `240cf49ef`, 32 commits on `33cfa9917`. #5180 doesn't change `select/utils/use-select.ts` or any Select test, so `useSelect` doesn't conflict.

**Rename needed.** Both branches add `src/internal/components/listbox/use-listbox.ts` with an exported `useListbox`. In #5180, rename OptionList's hook to `use-inline-listbox.ts` / `useInlineListbox` (with `UseInlineListboxProps`, `UseInlineListboxApi`), and update its two importers:
- `src/internal/components/listbox/index.tsx` (imports `GetOptionProps, ListElementProps, UseListboxApi` from `./use-listbox`)
- `src/option-list/internal.tsx` (imports `useListbox` from `../internal/components/listbox/use-listbox`)

Also delete #5180's own `ListElementProps` / `GetOptionProps` declarations in that file, and import them from `./interfaces` (in `use-inline-listbox.ts` and `index.tsx`).

**Expected conflicts.**

| File | #5180 commits touching it | Expected | Resolution |
|---|---|---|---|
| `listbox/use-listbox.ts` | 11: `872248ac5` (add/add), `26cddd87e`, `57da752f6`, `3ade7cdff`, `8bff9a970`, `10d9aa3a4`, `e8ebcf578`, `1ab18b49a`, `2c824c84d`, `3cd1c53dd`, `f06a65f61` | add/add at `872248ac5`, then a content conflict at each later commit | Keep this branch's file (`git checkout --ours`). Write the commit's version to `use-inline-listbox.ts` (`git show <commit>:src/internal/components/listbox/use-listbox.ts`) and apply the rename. |
| `options-list/utils/use-keyboard.ts` | `872248ac5`, `26cddd87e` (adds Home/End prevention), `f06a65f61` (removes it) | Conflicts in those commits | Keep this branch's version. It already has #5180's final change (optional `closeDropdown`, identical text) plus `preventNativeHomeEnd`. |
| `listbox/parts/plain-list.tsx` | `2c824c84d` (adds `scrollStrategy`, changes the `scrollToIndex` import) | Probably clean. The changed lines don't overlap with this branch's import and `menuProps` changes. | If it conflicts, keep both: import types from `../interfaces`, plus `scrollStrategy`. |
| `listbox/index.tsx`, `option-list/internal.tsx` | `872248ac5`, `57da752f6`, `3ade7cdff`, `8bff9a970`, `2c824c84d` | No text conflict (they don't exist here) | Update the imports to `use-inline-listbox` / `interfaces` (otherwise TSC fails). |

**How to run it.** Replaying 11 conflicting commits by hand is slow. Alternatives:
- (a) Plain rebase with `git rerere` enabled, resolving as in the table above. Keeps the 32-commit history.
- (b) First, on a new local branch from `feat/add-option-list`, squash the OptionList commits that touch `use-listbox.ts` into fewer commits, then rebase. Fewer conflict stops, less history.

Either way: do it on a new local branch (e.g. `feat/add-option-list-on-use-listbox`). Keep `feat/add-option-list` as a backup. Run the full check list (unit incl. `src/option-list`, TSC, ESLint, snapshots, functional, OptionList integ). Pushing needs `--force-with-lease=feat/add-option-list:240cf49ef` and your confirmation.

## Draft PR description

Title: `refactor: Build Select and Multiselect on a shared useListbox hook`
Base: `refactor/move-shared-listbox-parts`

```markdown
### Description

Moves the list logic from `useSelect` into a new shared `useListbox` hook (highlight, keyboard, choosing, mouse and row props), with no behavior change for Select or Multiselect.

Related links, issue #, if available: #5204, #5180

### How has this been tested?

- New `use-listbox.test.tsx` (18 tests) covers Space modes, Escape, Home/End, choosing, mouse, row props and the selected announcement.
- Existing Select, Multiselect, Autosuggest, Property filter and listbox unit tests pass unchanged (1157 before, 1175 with the new suite).
- Snapshot tests (110/110) and functional tests (1969/1969) are unchanged.
- No existing test file was edited.

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

When the PR is open, change #5180's base from `refactor/move-shared-listbox-parts` to `refactor/use-listbox-in-select` after the rebase.
