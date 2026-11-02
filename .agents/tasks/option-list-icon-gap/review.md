# Gap between icon and content in OptionList options

The change wraps the consumer's `icon` in OptionList options in a new OptionList `.icon` span. That span carries the same `padding-inline-end: space-xs` that the shared option renderer applies to the built-in icons of Select and Multiselect. The root cause is that the shared option renders `__customIcon` without a wrapper. OptionList passed the raw icon node, so the glyph sat directly against the label. Token and chart-filter avoid this because they bring their own wrappers. The fix stays inside `src/option-list/`, adds two unit tests, and the browser measurements show the OptionList gap going from 0px to 8px while Select and Multiselect stay at 8px.

Watch for: the OptionList `.icon` rule copies the shared option `.icon` declarations, so the two can drift apart (possible, non-blocking).

**Verdict**: APPROVED

## High-level view

The commit range `origin/feat/add-option-list..HEAD` contains one commit, 87aa788fe, titled `fix: Add gap between icon and content in OptionList options`. Its body states the root cause, and the diff matches it. `src/internal/components/option/index.tsx:78` renders `option.__customIcon || <OptionIcon/>`, and only `OptionIcon` (`option-parts.tsx:155`) adds the `.icon` span. The commit changes `toInternalOptions` in `src/option-list/internal.tsx` and nothing else in the rendering path.

Select and Multiselect are unaffected by construction. The commit touches only `src/option-list/internal.tsx`, `src/option-list/styles.scss` and the OptionList unit test. The measurements agree: Select item, Multiselect item, the opened Select dropdown and the opened Multiselect dropdown all measure 8px both before and after. After the fix, OptionList measures 8px across 16 single-selection rows and 24 multi-selection rows, which matches Select. The after screenshot (`after-option-list-single-0.png`) shows the spacing.

The styling follows `styles.instructions.md`. It uses the `awsui.$space-xs` token and the logical property `padding-inline-end`, with no hardcoded px. Its declarations are identical to the shared option `.icon`. The wrapper is rendered only when `icon` is truthy, so options without an icon keep their current DOM. A falsy `icon` such as `0` still falls through to `OptionIcon`, which is how it behaved before.

The report records exit 0 for quick-build, jest (56 suites, 678 tests), the full build, snapshot tests (111/111, no snapshots changed), eslint, stylelint and tsc. It also notes that the dev server was bound to 127.0.0.1 and then stopped. The commit contains no package-lock.json, tsbuildinfo, `.agents/`, `.kiro/` or node_modules files. `git ls-remote origin fix/option-list-icon-gap` returns nothing, and `origin/feat/add-option-list` is still at 24524f9b9, the same as the remote.

<details>
<summary>Issues (1)</summary>

1. **Duplicated icon slot rule** (possible, non-blocking): the OptionList `.icon` copies the four declarations of the shared option `.icon`. If one of them changes later, OptionList and Select spacing will differ. You could leave it as is, since the comment points to the shared rule, or later expose a shared wrapper for `__customIcon`.

</details>

<details>
<summary>Details</summary>

### Wrapper placement in toInternalOptions

`__customIcon: icon && <span className={styles.icon}>{icon}</span>` applies to both options and group headers, because both go through `toInternalOptions`. The new tests check that the icon's parent has the OptionList `styles.icon` class and that options without an icon have no wrapper. jsdom cannot measure layout, so the spacing itself is covered by the browser measurements and by the existing `withIcons` permutations in `pages/option-list/permutations.page.tsx`, which run under visual regression.

### Duplicated CSS

`src/option-list/styles.scss` adds `.icon { padding-inline-end: awsui.$space-xs; align-content: center; display: flex; flex-shrink: 0; }`, which is the same rule as `src/internal/components/option/styles.scss:119-124`. Token handles its custom icon the same way, with a local wrapper class, so this follows existing practice. The rules can still drift apart in the future.

</details>

<details>
<summary>File map</summary>

- `src/option-list/internal.tsx`: wraps the `icon` in an `.icon` span when it is set.
- `src/option-list/styles.scss`: adds the `.icon` rule using a token and a logical property.
- `src/option-list/__tests__/option-list.test.tsx`: adds tests for the wrapper being present and absent.

Full diff: `git -C .worktrees/option-list-icon-gap diff origin/feat/add-option-list..HEAD`

</details>
