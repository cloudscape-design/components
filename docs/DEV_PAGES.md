# Dev Pages

Dev and test pages live in `pages/<component-name>/`. They are used for local development, integration tests, and visual regression tests.

## Rules

- Export a default function component
- Import components via `~components/<name>` (not relative paths to `src/`)
- For visual regression content, either use `SimplePage` from `pages/app/templates` (handles heading, screenshot area, i18n, and layout) or wrap content in `ScreenshotArea` from `pages/utils/screenshot-area` with a manual `<h1>`
- Use `createPermutations` and `PermutationsView` from `pages/utils/` for permutation pages
- If multiple pages share data (like `i18nStrings`), put it in a `common.tsx` in the same directory
