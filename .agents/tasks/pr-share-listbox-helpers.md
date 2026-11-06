Title: refactor: Share listbox option props, mouse handlers and keyboard navigation
Base: refactor/move-shared-listbox-parts (#5204)
Head: refactor/share-listbox-helpers

### Description

Moves the option props, mouse handlers and arrow-key navigation from `useSelect` into pure helpers in `src/internal/components/listbox/utils/`, and the list prop types into `listbox/interfaces.ts`, with no behavior change for Select or Multiselect.

Related links, issue #, if available: n/a

### How has this been tested?

- New unit tests for the helpers (`option-props.test.ts`, `navigation.test.ts`).
- Existing Select, Multiselect, Autosuggest, Property filter and listbox unit tests pass unchanged. No existing test file was edited.
- Documenter and test-utils snapshots are unchanged.
- Existing integration tests run in CI.

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

----------------------------------------------------------------------

Updated description for #5239 (after PR A is in the stack below it):

Title: refactor: Build Select and Multiselect on a shared useListbox hook

### Description

Adds an internal `useListbox` hook, built from the shared listbox helpers, and builds `useSelect` on it: highlight, keyboard handling, choosing, the announcement, scrolling, the active descendant and the base list props. Also gives the shared list types and props neutral names. No behavior change for Select or Multiselect.

Related links, issue #, if available: n/a

### How has this been tested?

- New unit tests for `useListbox` (`use-listbox.test.tsx`).
- Existing Select, Multiselect, Autosuggest, Property filter and listbox unit tests pass unchanged. No existing test file was edited.
- Documenter and test-utils snapshots are unchanged.
- Existing integration tests run in CI.

(+ the same review checklist and license footer)
