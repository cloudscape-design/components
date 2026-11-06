### Description

When the list element has focus, Home and End moved the highlight and the browser also ran its native action, which scrolls the page or a scroll container to its top or bottom. The list's keydown handler from `useListbox` now prevents the native Home and End action. This applies to Select and Multiselect without a filter, embedded Multiselect and OptionList. With a filter, focus is in the input, and Home and End keep moving the text cursor.

From the OptionList accessibility review, question 2 (Home and End).

Related links, issue #, if available: n/a

### How has this been tested?

Unit tests in `use-listbox.test.tsx`: on the list, Home and End move the highlight and prevent the native action; through the filter input handler, they keep it. Unit tests for OptionList, Select, Multiselect, Autosuggest, Property filter and the shared list code pass, and eslint and tsc pass.

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
