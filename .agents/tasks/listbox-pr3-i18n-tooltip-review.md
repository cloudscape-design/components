# OptionList: own i18n namespace and coverage for the tooltip Escape handler

OptionList stops reading `selectedAriaLabel` from Select's `select` i18n namespace and gets its own `option-list` namespace, keyed `i18nStrings.selectedAriaLabel` to match its prop path (Select's top-level `selectedAriaLabel` prop maps to key `selectedAriaLabel`; Multiselect's `i18nStrings.selectAllText` and Dialog's `i18nStrings.dismissAriaLabel` follow the same prop-path rule). All 15 locale files and `messages-types.ts` get the entry in alphabetical position, reusing each locale's existing `select.selectedAriaLabel` translation. This follows the pattern from `81007d585 feat: Add dialog component`. A new OptionList test drives the disabled-reason tooltip's `onEscape` (item.tsx:194), which takes `item.tsx` to 100% line coverage. Also included: a dev-page cleanup that moves `permutations.page.tsx` onto the `PermutationsPage` template. That cleanup isn't one of the two fixes requested.

Watch for: the permutations page change is out of scope for this request and should go in its own `chore:` commit, which the verification note already plans (non-blocking). An untracked `.agents/tasks/listbox-pr3-plan.md` sits inside the worktree and must not be staged (non-blocking).

**Verdict**: APPROVED

## High-level view

The namespace change matches the repo's existing pattern. It makes `useInternalI18n('option-list')` calls, uses a prop-path key, adds an entry to every `all.*.json` plus `messages-types.ts`, and leaves the `@i18n` tag on `i18nStrings` in `interfaces.ts` unchanged. Select and Multiselect code is untouched, so their behaviour is the same. The only observable change is that `I18nProvider` messages under `select.selectedAriaLabel` no longer reach OptionList. That's fine, because OptionList hasn't been released yet.

The i18n tests use the public `TestI18nProvider` and `createWrapper` test-utils. They check that the provider message is announced and that the prop overrides it. The Escape test highlights a disabled option with a reason and presses Escape. It then checks that the tooltip is gone, the highlight stays, and `onChange` isn't called. That mirrors Select's `disabled.test.tsx` Escape test. All the new tests sit in the existing `option-list.test.tsx`, as Dialog's tests do.

The evidence is complete. It covers a full build, unit tests for option-list, listbox, i18n, select and multiselect, `src/__tests__` with unchanged snapshots, the integ suite, and coverage before and after for `item.tsx`. `package-lock.json` isn't modified and `pages/tsconfig.tsbuildinfo` was deleted. The prettier failures on `messages-types.ts` and seven JSON files (no newline at EOF) were shown to fail the same way at HEAD.

<details>
<summary>Issues (2)</summary>

1. **Out-of-scope dev page change** — `pages/option-list/permutations.page.tsx` template migration isn't part of the two requested fixes. Commit it separately as `chore:` (planned). Non-blocking. Confidence: confirmed.
2. **Untracked plan file in worktree** — `.agents/tasks/listbox-pr3-plan.md` is untracked in the worktree. Stage files by name when committing so it stays out. Non-blocking. Confidence: confirmed.

</details>

<details>
<summary>Details</summary>

### Escape test reachability

The internal Tooltip listens for Escape on `window` in capture phase, so the `keyDown` fired on the listbox reaches it and triggers `setCanShowTooltip(false)`. The before/after coverage numbers (line 194 uncovered, then covered) confirm the handler runs. One gap remains: Escape propagating to a parent *after* the tooltip has closed isn't tested again with the tooltip involved. The existing "Escape is not handled and reaches the parent" test covers the case with no tooltip, and the note documents this. Confidence: confirmed (code and coverage evidence).

</details>

<details>
<summary>File map</summary>

- `src/option-list/internal.tsx`: `option-list` namespace, `i18nStrings.selectedAriaLabel` key
- `src/i18n/messages-types.ts`: `option-list` type entry
- `src/i18n/messages/all.{ar,de,en-GB,en,es,fr,id,it,ja,ko,pt-BR,th,tr,zh-CN,zh-TW}.json`: `option-list` entry per locale
- `src/option-list/__tests__/option-list.test.tsx`: tooltip Escape test, i18n provider tests
- `pages/option-list/permutations.page.tsx`: `PermutationsPage` template (out of scope)

Full diff: `git -C .worktrees/pr3-option-list diff HEAD`

</details>
