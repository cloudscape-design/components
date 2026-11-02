# How Control group was developed and released

Sources: `git log`/`git show` in `/Users/amanabiy/Documents/components` (HEAD `4925c401c`), the remote branch `origin/dev-v3-jotresse-control-group`, and `gh pr view` on `cloudscape-design/components` (gh was authenticated as `amanabiy`). Author of every PR is Joan Perals (GitHub `jperals`, `jotresse@amazon.com`). Dates are as recorded in the repo.

## Summary

- Joan built Control group as an **internal component** at `src/internal/components/control-group/`, across 11 small `chore:` PRs merged to `main` over about 4 weeks (2026-10-01 to 2026-10-26). Each PR added one capability: base styling, vertical direction, inline label, action button, responsive mode, validation states, colors, ARIA props, disabled styles, autosuggest fix.
- Every PR targeted `main` directly. None were stacked on each other. Each new branch started after the previous related PR merged, or ran in parallel when the features did not overlap.
- Visual regression definitions were split into their own tiny PRs (#5099: 1 file, +17; #5100: 1 file, +17/−1). Feature PRs said "visual test definitions will be provided separately".
- The public release was one `feat:` PR, **#5145** (`6997ceb24`, 38 files, +874/−93). It moved the folder from `src/internal/components/control-group/` to `src/control-group/`, added a public `index.tsx` with `useBaseComponent` and analytics metadata, promoted the test-utils wrapper, added dev warnings, updated the API docs of related components, and updated the documenter and test-utils snapshots. All behaviour already existed on `main` by then.
- The "post-release" fixes (#5163, #5173, #5182, #5186) were all **merged before** #5145. The #5145 description lists them as included. Only #5193 (dev page padding) merged after release, and #5190 (more visual tests) was still open.
- PR descriptions are short. They contain a "Description" section with an internal design-doc ID (`aWXNB6Wkj8kF`, `kMUBQtg6r1WV`, `KaCZyfbvq46D`), an explicit out-of-scope list on the first PR, and a "How has this been tested?" section. Each PR had one approver, and the approver rotated between PRs.

## 1. PR sequencing, size, theme

First-parent order on `main` (all base `main`, squash-merged as `title (#N)`):

| # | Commit | PR | Opened → merged | Files | +/− | Theme | Approver |
|---|---|---|---|---|---|---|---|
| 1 | `9f0a2a81a` | #5043 chore: Add basic internal control group | 09-23 → 10-01 | 22 | +640/−126 | Context + styling approach; wires input, autosuggest, select, multiselect, segmented control | pan-kot (35 review events, georgylobko also commented) |
| 2 | `82b8af40e` | #5099 chore: Add visual test definition for control group | 10-02 → 10-05 | 1 | +17 | `test/definitions/visual/control-group.ts` (permutations page) | pan-kot |
| 3 | `ea381b71f` | #5098 chore: Add vertical direction to internal control group component | 10-02 → 10-06 | 19 | +280/−110 | `direction` prop, `grouped-control-styles.ts` | ernst-dev |
| 4 | `8960f5618` | #5110 chore: Add inline label to control group | 10-06 → 10-08 | 16 | +368/−59 | Inline label, `pages/control-group/labels.page.tsx`, first internal test util | amanabiy |
| 5 | `1257ec8ee` | #5119 chore: Add action button to control group | 10-08 → 10-13 | 19 | +478/−148 | Action button; button styles; `src/internal/styles/forms/grouped-control.scss`; `interfaces.ts` | srungta08 |
| 6 | `fdb6ffa92` | #5100 chore: Add more visual test definitions for control group | 10-02 → 10-15 | 1 | +17/−1 | Visual coverage for #5098 and #5119 | georgylobko |
| 7 | `008d3ca8d` | #5111 chore: Add auto responsive mode to control group | 10-06 → 10-19 | 13 | +492/−85 | `direction='auto'`, `src/internal/hooks/use-fits-inline.ts`, first integ test | NathanZlion |
| 8 | `8840978d1` | #5163 chore: Control group color adjustments | 10-20 → 10-21 | 7 | +67/−8 | New design token (style-dictionary), themes snapshot | georgylobko |
| 9 | `623c7d32b` | #5143 chore: Add validation states to control group | 10-13 → 10-21 | 18 | +654/−52 | invalid/warning states, tokens | ywyyu17 |
| 10 | `414c67876` | #5182 chore: Make borders of disabled controls transparent also when rendered in a control group | 10-22 → 10-26 | 7 | +83/−28 | Disabled styles (before/after screenshots) | NathanZlion |
| 11 | `ff7424128` | #5173 chore: Add `ariaLabelledby` and `ariaDescribedby` to control group | 10-22 → 10-26 | 3 | +52/−2 | ARIA props via `FormFieldControlProps` | srungta08 |
| 12 | `b3106e4d7` | #5186 chore: Prevent unexpected borders in grouped autosuggest input in validation state | 10-23 → 10-26 | 1 | +60/−58 | Reset context in token-mode autosuggest (`src/internal/components/autosuggest-input/index.tsx`) | — |
| 13 | `6997ceb24` | **#5145 feat: Control group component** | 10-14 → 10-26 | 38 | +874/−93 | Promote to public | cansuaa |
| after | `64253e385` | #5193 chore: Add padding to control group validation dev page | → 10-29 | | | Dev page tweak (not yet in current HEAD's history) | |

#5186 does not match `--grep='control group'`, so the brief's list missed it. It is in HEAD's history.

PRs that were not merged:
- #4969 `feat: control group component` (draft, 09-03, +3097 across 32 files). This was the full prototype. Joan closed it on 10-20 after landing the pieces separately.
- #5066 `chore: grouped controls with callback` (draft, +4918/−596). An alternative approach, still open.
- #5144 (draft, closed within one minute, replaced by #5145), #5154 (validation draft, superseded by #5143), and #5172 (dev warnings, closed and folded into #5145).
- #5190 `chore: Add more visual test definitions for control group` (+127/−4) is still open.

**Stacked or independent?** Independent. Every PR's base was `main` and each one could be reviewed alone. When a feature needed the previous one, Joan opened the next branch only after the previous PR merged (#5043 merged 10-01 and #5098 opened 10-02; #5119 merged 10-13 and #5143 opened 10-13). Features that did not overlap ran in parallel off `main` (#5110 and #5111 were both opened 10-06). Branch names follow `dev-v3-jotresse-control-group-<topic>`.

**The release branch was long-lived.** `origin/dev-v3-jotresse-control-group` (#5145) was opened 10-14 and stayed open while the chore PRs kept landing. Its history shows repeated `main` merges (`66b23ab84` "Merge main, relocate control group to internal" on 10-20, then `ebd1f0d31`, `4afb58531`, `9a78c05ea`, `9057ca169`). It also shows a re-promotion commit, `e1e2bb320` "refactor: Promote control group to public component" (10-22). Because the internal code kept changing on `main`, Joan moved it back to internal, merged, and promoted it again rather than resolving conflicts across a moved folder. Later small fixes were committed on the release branch (`34fdd012c`, `63a873c69`) and also split out as separate PRs (#5172, #5182, #5186).

## 2. Internal-first strategy

While internal (#5043 to #5186):
- Component: `src/internal/components/control-group/{index.tsx,interfaces.ts,styles.scss,grouped-control-styles.ts,test-classes/styles.scss,__tests__/,__integ__/}`.
- Context consumed by the existing controls: `src/internal/context/control-group-context.tsx` (`useGroupedControlContext`, `ResetGroupedControlContext`). Each control (`src/input/internal.tsx`, `src/select/internal.tsx`, `src/multiselect/internal.tsx`, `src/autosuggest/internal.tsx`, `src/segmented-control/internal.tsx`, `src/internal/components/button-trigger/index.tsx`, `src/button/internal.tsx`) read the context and applied grouped styles.
- Shared SCSS: `src/internal/styles/forms/grouped-control.scss` and mixins.
- Test util: `src/test-utils/dom/internal/control-group.ts`. Only the selectors snapshot changed (`test-utils-selectors.test.tsx.snap`). No public wrapper or `findControlGroup` existed yet.
- Dev pages imported `~components/internal/components/control-group`.
- No documenter snapshot changes, so the public API surface was not touched. This is why `chore:` was correct for all of these PRs.

What #5145 (`6997ceb24`) changed:
- **Moves (git renames):** `src/internal/components/control-group/index.tsx` → `src/control-group/internal.tsx`. `interfaces.ts`, `styles.scss`, `test-classes/`, `__tests__/` and `__integ__/` moved to `src/control-group/`. `src/test-utils/dom/internal/control-group.ts` → `src/test-utils/dom/control-group/index.ts` (`ControlGroupWrapper` with `findControls`, `findInlineLabel`, `findActionButton`). `grouped-control-styles.ts` → `src/internal/grouped-control/`.
- **New public entry** `src/control-group/index.tsx`: `'use client'`, `useBaseComponent('ControlGroup', { props: { direction }, metadata: { hasInlineLabel, hasActionButton } })`, default `direction = 'auto'`, `applyDisplayName`, re-exports `ControlGroupProps`.
- **Public API docs** in `src/control-group/interfaces.ts`: JSDoc on `direction`, `actionButton`, and `ControlGroupProps.ActionButton` members. Extends `Pick<FormFieldControlProps, 'ariaLabelledby' | 'ariaDescribedby'>`.
- **Build:** `build-tools/utils/pluralize.js` adds `ControlGroup: 'ControlGroups'`, which the test-utils `findAllControlGroups` generator needs.
- **Dev warnings:** new `src/internal/grouped-control/dev-warnings.ts` (`warnOnUnsupportedGroupedControlProps` for invalid, warning, readOnly, `inlineTokens=false`, `expandToViewport=false`). It is called from the input, select, multiselect and autosuggest internals and tested in `src/control-group/__tests__/dev-warnings.test.tsx` (+169).
- **Docs on related components:** `src/select/interfaces.ts` re-declares `expandToViewport` with a control-group note. `src/multiselect/interfaces.ts` adds an `inlineTokens` note. `src/form-field/interfaces.ts` rewords `controlId` so that "control group" no longer reads as a vague concept.
- **Snapshots:** `documenter.test.ts.snap` (+380), `test-utils-wrappers.test.tsx.snap` (+80), `test-utils-selectors.test.tsx.snap`.
- **Dev pages:** each `pages/control-group/*.page.tsx` changed one import line to `~components/control-group`.

## 3. Testing pattern per PR

| PR | Unit | Dev page | Integ | Visual def | Test utils / snapshots |
|---|---|---|---|---|---|
| #5043 | `control-group.test.tsx`, plus `src/{input,autosuggest,select,multiselect}/__tests__/control-group.test.tsx` (added after reviewer georgylobko asked why unit tests were missing) | `permutations.page.tsx` | – | – | – |
| #5099 | – | – | – | new `control-group.ts` | – |
| #5098 | updated | permutations param `controlGroupDirection` | – | +1 line | – |
| #5110 | yes | `labels.page.tsx`, `common.tsx` | – | deferred | internal util + selectors snap |
| #5119 | yes | `action-button.page.tsx` | – | deferred → #5100 | internal util, selectors snap |
| #5111 | yes | `responsive.page.tsx` | new `__integ__/control-group.test.ts` (+138) | deferred | internal util, selectors snap |
| #5143 | yes (+108) | `validation.page.tsx` | – | deferred | – |
| #5163 | – | `in-app-layout.page.tsx` | – | deferred | themes snapshot |
| #5173 | yes | – | – | – | – |
| #5182 | – | validation page update | – | – | – |
| #5145 | dev-warnings tests | import path only | path update | more in #5190 | documenter, wrappers, selectors snaps |

There were no separate a11y test files. ARIA behaviour was covered by unit tests (#5173) and by the repo's general a11y checks on dev pages.

## 4. PR titles and descriptions

- Titles use `type: Subject` with a capitalised subject and no scope. Every incremental PR is `chore:`. Only the release is `feat:`. This matches the AGENTS.md lint rule. Titles name the single capability ("Add inline label to control group").
- The body uses the repo template. "Description" is 1–8 lines and links an internal doc ID. #5043 includes a "Things that this PR does not do" list (button support, error states, responsiveness, test utils, dev warnings), which became the roadmap for the following PRs. #5098 says the new `direction` prop "may be kept, extended or changed before the component becomes public". #5145 lists the PRs it includes, then the extra release-only changes.
- "How has this been tested?" names the dev page (sometimes with a direct preview link), the tests added, and states when visual definitions will follow separately. #5182 includes before/after screenshots. #5190 links the Allure report.
- Reviews: each PR had a different single approver (pan-kot, ernst-dev, amanabiy, srungta08, georgylobko, NathanZlion, ywyyu17, cansuaa). Copilot review was on from #5111 onward. The foundational PR #5043 took 8 days and 35 review events. Later PRs merged in 1–5 days, except the larger #5111 and #5143 (8–13 days).
- No labels and no GitHub issue links.

## 5. Post-release follow-ups

Almost all polish happened before release:
- #5163: decoupled the group border color from the input border color (new token), and made the action button background opaque for OneTheme dark mode.
- #5182: disabled controls get transparent borders inside a group, as the design required.
- #5173: missing `ariaLabelledby` and `ariaDescribedby` props.
- #5186: token-mode autosuggest renders a nested input, so the context had to be reset to stop grouped styles leaking into it.
- #5172 (dev warnings) was closed and its content folded into #5145.

After release: #5193 added padding to the validation dev page so the visual tests are stable. #5190 (remaining visual definitions) was open at the time of this report, and its description asks for #5193 to deploy first.

## 6. Takeaways for the listbox PR series

1. **Keep every PR independent against `main`.** Do not stack. Open the next dependent branch only after the previous one merges, and run non-overlapping pieces in parallel. Name branches as a series (`dev-v3-amanabiy-listbox-<topic>`).
2. **Aim for one capability per PR, about 3–20 files and under about 650 added lines.** Joan's foundational PR was the largest and slowest to review (35 review events). Make your first PR the one that sets the pattern, and say what it deliberately leaves out.
3. **Use `chore:` (or `refactor:`) for anything that does not change the public API or documenter snapshot.** A pure internal listbox refactor never needs `feat:`. Reserve `feat:`/`fix:` for a PR that changes public behaviour or docs. If `documenter.test.ts.snap` changes, the PR is not a chore.
4. **Keep work under `src/internal/...` until it is ready.** Control group shows that internal code can live on `main` for weeks behind no public export. For a refactor, the equivalent is to land the new internal listbox pieces next to the old ones, move callers one at a time (select, multiselect, autosuggest), then delete the old code.
5. **Put a short scope note in each description:** an internal doc ID, what the PR does, an explicit "not in this PR" list, and how to test it (dev page link, tests added, visual tests to follow). Add before/after screenshots for any visual change.
6. **Split visual-regression definitions into tiny follow-up PRs** when they would otherwise block a feature PR. Still include unit tests in every PR. A reviewer pushed back when #5043 initially had none.
7. **Avoid moving folders on a long-lived branch while `main` keeps changing them.** Joan had to relocate back to internal and re-promote (`66b23ab84`, `e1e2bb320`). If a listbox PR moves files (see `refactor-move-listbox-parts-*`), land the move by itself, quickly, before content changes pile up.
8. **Rotate reviewers** and make each PR small enough for one approver.

No fixes recommended. This was a read-only investigation.
