# Test Pages

Test pages live in `pages/<component-name>/`. They are used for integration tests, visual regression tests, and local development. Visual regression tests are not currently running for the components repository on GitHub — only internally.

## Rules
- For visual regression content, either use `SimplePage` (handles heading, screenshot area, i18n, and layout) or wrap content in `ScreenshotArea`.
- Use `createPermutations` and `PermutationsView` for permutation pages.
