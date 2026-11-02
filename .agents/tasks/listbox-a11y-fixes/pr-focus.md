### Description

When an embedded list (OptionList, embedded Multiselect) gets focus without a highlight, it now highlights the first selected option in selection order, the same as opening Select or Multiselect with the keyboard. When nothing in the list is selected, it highlights the first option. Before, embedded Multiselect always highlighted the first option. OptionList now uses the shared focus and blur handlers from `useListbox`.

From the OptionList accessibility review, question 1 (highlight on focus).

Related links, issue #, if available: n/a

### How has this been tested?

Unit tests in `use-listbox.test.tsx`: focus highlights the first selected option in selection order, and the first option when the selected option is not in the options. The duplicate OptionList cases in `highlight.test.tsx` were removed; its wiring test stays. Unit tests for OptionList, Select, Multiselect, Autosuggest, Property filter and the shared list code pass, and eslint and tsc pass.

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
