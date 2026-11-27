# React-version-scoped test skips

Tests skipped for a specific React version because of a known issue in a component on that version. Remove an entry once the issue is fixed.

Where the skips live:

- a11y page sweep: `reactVersionSkipPages` in `src/__a11y__/run-a11y-tests.ts`, keyed by React version.
- jest integration tests: `isReact18OrNewer` / `reactVersion` from `src/__integ__/utils.ts`.

Run the suites for a version with `REACT_VERSION=<version> npx gulp test:integ` / `npx gulp test:a11y --reactVersion <version>`.
Verified on the dev pages in visual refresh (default) and with `theme=one-theme`.

## Component issues

| Test                                                                                                                                               | React versions | Themes                    | Component                                                         | What breaks                                                                                                                                                                                                                      | Error                                                                  | Short repro                                                                  |
| -------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- | ------------------------- | ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `src/__a11y__/a11y-*.test.ts`, page `file-upload/permutations`                                                                                     | 19             | visual refresh, one-theme | File token group thumbnail (`src/file-token-group/thumbnail.tsx`) | The thumbnail renders `<img src="">` on its first render, before the preview object URL is set. React 19 reports an empty `src` because browsers may download the page again.                                                    | Console error: `An empty string ("") was passed to the src attribute.` | Open `#/light/file-upload/permutations` with React 19 and check the console. |
| `src/__a11y__/a11y-*.test.ts`, pages `prompt-input/menu-style`, `prompt-input/permutations`, `prompt-input/shortcuts`, `prompt-input/style-api-v2` | 18, 19         | visual refresh, one-theme | Prompt input (token mode, React 18+ only)                         | The `contentEditable` element has `role="textbox"` and gets `aria-expanded` and `aria-haspopup="listbox"` when menus are configured. `textbox` does not allow `aria-expanded`. The permutations page also renders duplicate ids. | axe `aria-allowed-attr`, `duplicate-id`                                | Open `#/light/prompt-input/menu-style` with React 18 or 19 and run axe.      |

## Tests skipped on React 18 and newer

These were already skipped on React 18 and fail the same way on React 19.

| Test                                                                                                                         | React versions | Component                            | What breaks                                                        |
| ---------------------------------------------------------------------------------------------------------------------------- | -------------- | ------------------------------------ | ------------------------------------------------------------------ |
| `src/autosuggest/__integ__/virtual-resize.test.ts`, `src/select/__integ__/virtual-resize.test.ts`                            | 18, 19         | Autosuggest, select (virtual scroll) | Option positions are not remeasured after the dropdown gets wider. |
| `src/collection-preferences/content-display/__integ__/content-reordering.test.ts`, "cancels reordering when pressing Escape" | 18, 19         | Collection preferences               | "Reordering canceled" is not announced.                            |
| `src/internal/analytics/__integ__/static-single-page-flow.test.ts`, `static-multi-page-create.test.ts`                       | 18, 19         | Funnel analytics                     | Substep numbers are `null` and extra step events are emitted.      |
| `src/mixed-line-bar-chart/__integ__/announcements.test.ts`, "with expandable sub-items"                                      | 18, 19         | Mixed line/bar chart                 | Expanded sub-items are missing from the popover announcement.      |
| `src/popover/__integ__/popover-placement.test.ts`, right/left placement at 768x1024                                          | 18, 19         | Popover                              | The popover is placed on the wrong side at this viewport.          |
