### Description

Stacked on #5239.

**What:** Adds OptionList, an always visible list with single or multi selection, plus its test-utils and dev pages. It runs on the shared `useListbox` hook from #5239, the same engine as Select and Multiselect. Select and Multiselect behave the same.

**How:** `src/option-list/use-option-list.ts` builds on `useListbox` and adds only what an always visible list needs:
- the list is a tab stop with its own focus and blur, like opening and closing Select or Multiselect with the keyboard: focus highlights the first selected option (in selection order) and scrolls it into view, or the first option when nothing is selected. An existing hover highlight is kept, so a click selects the hovered option. Blur clears the highlight.
- type-ahead, and clearing a hover highlight when the pointer leaves the component (`getRootProps()`)

OptionList renders the shared `PlainList`.

**Shared listbox additions** (only OptionList uses them; Select and Multiselect don't pass them):
- `onEscape` is optional in `useListbox` and `useMenuKeyboard`. Without it, Escape is not handled and keeps propagating.
- `PlainList` takes `scrollStrategy`. The default `'menu'` scrolls the list itself. `'ancestors'` scrolls the highlighted row into view through the page or a parent scroll container (`scrollOptionIntoView`), because OptionList is not its own scroll container.
- `OptionsList` `statusType` is optional, defaulting to `'finished'`.
- The shared item and `SelectableItem` take `hideTopDivider`.

**Commits:**
1. refactor: Add OptionList support to the shared listbox code
2. feat: Add OptionList component
3. chore: Add OptionList dev pages
4. test: Add OptionList unit and integration tests

**Follow-ups after this PR** (they change behavior for all three components, so they are kept out of here):
- which selected option gets the highlight on focus when several are selected: selection order (today, as in Multiselect) or list order (ARIA listbox pattern)
- scrolling on every keyboard highlight, the highlight following its option when options change, and `aria-activedescendant` only while an option is highlighted
- Home/End `preventDefault`, wrapping past empty groups, type-ahead and `renderOption` fixes

Related links, issue #, if available: Docs: CUJAl2wq1b6Z and 5evHnSwN7iHe

### How has this been tested?

- Unit tests for selection, keyboard, type-ahead, focus and blur, highlight and scrolling, groups, disabled options, `renderOption`, i18n, accessibility and test-utils.
- Unit tests for the shared additions: `scrollOptionIntoView`, `PlainList` `scrollStrategy`, `useMenuKeyboard` without `onEscape`, the `OptionsList` `statusType` default and `hideTopDivider`.
- Integration tests for keyboard scrolling across scroll containers and inside a Dropdown, run at CI's window size.
- Existing Select and Multiselect tests pass unchanged. Documenter and test-utils snapshots change only for OptionList.
- Manual checks on the `option-list` dev pages.

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
