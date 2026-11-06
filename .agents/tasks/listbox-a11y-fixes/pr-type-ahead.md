### Description

Up and Down reach disabled options, so their disabled state and reason are announced, but type-ahead skipped them. Type-ahead now matches the same options as Up and Down, including disabled ones, in Select, Multiselect and OptionList. Choosing a disabled option is still ignored. When the Select dropdown is closed, type-ahead selects the match instead of highlighting it, so it keeps skipping disabled options there (`skipDisabled`), as a native select does.

From the OptionList accessibility review, question 3 (type-ahead and disabled options).

Related links, issue #, if available: n/a

### How has this been tested?

Unit tests in `use-type-ahead.test.ts` (reaches a disabled option; skips it with `skipDisabled`) and a new `select/__tests__/type-ahead.test.tsx` (closed: selects the first enabled match; open: highlights the disabled match). The closed Select test fails without `skipDisabled`. The OptionList test that asserted the old skipping was removed. Unit tests for OptionList, Select, Multiselect, Autosuggest, Property filter and the shared list code pass, and eslint and tsc pass.

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
