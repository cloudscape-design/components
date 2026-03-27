# Dev Pages

Dev and test pages live in `pages/<component-name>/`. They are used for local development, integration tests, and visual regression tests.

## Rules
- For visual regression content, either use `SimplePage` (handles heading, screenshot area, i18n, and layout) or wrap content in `ScreenshotArea`.
- Use `createPermutations` and `PermutationsView` for permutation pages.