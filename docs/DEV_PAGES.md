# Dev Pages

Dev and test pages live in `pages/<component-name>/`. They are used for local development, integration tests, and visual regression tests.

## Running Dev Pages

```
npm run quick-build    # build first (required before starting)
npm start              # starts watcher + dev server at http://localhost:8080
```

## Rules

- Import components via `~components/<name>` (not relative paths to `src/`)
- For visual regression content, either use `SimplePage` from `pages/app/templates` (handles heading, screenshot area, i18n, and layout) or wrap content in `ScreenshotArea` from `pages/utils/screenshot-area`.
- Use `createPermutations` and `PermutationsView` from `pages/utils/` for permutation pages.

## Related

- For integration tests that use dev pages, see [TESTING.md](TESTING.md).
