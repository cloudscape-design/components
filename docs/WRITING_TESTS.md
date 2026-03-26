# Writing Tests

## Test Utils

Test-utils core is a separate package: https://github.com/cloudscape-design/test-utils

- Test-utils should not have any dependencies — they can be used with any tech stack.
- Test-utils extend `ComponentWrapper`. `ElementWrapper` is only a return type when no more specific type is available.
- Methods must have explicitly declared return types (enforced via ESLint).
- Wrapper classes must have a static `rootSelector` property.
- For methods that always return a value, add a non-null assertion.
- Adding `null` as a return type is a breaking change. Removing `null` is not.

## Unit Tests

Location: `src/<component-name>/__tests__/`

Use `react-testing-library` to render, combined with test-utils. Prefer test-utils for querying and interacting with components — use react-testing-library directly only for internal edge cases not covered by test-utils. Read an existing test file (e.g. `src/button/__tests__/button.test.tsx`) for the setup pattern.

### Snapshot Tests

Snapshot tests guard generated artifacts (API definitions, test-util wrappers, design tokens, etc.) against unintended changes. Running the unit and integration tests will update the snapshots accordingly.

## Integration Tests

Location: `src/<component-name>/__integ__/`

Integration tests run in a real browser against dev pages (see [DEV_PAGES.md](DEV_PAGES.md)). Use `createWrapper` from `test-utils/selectors` (not `test-utils/dom` — selectors generate CSS selectors for browser tests, while dom wrappers operate on DOM nodes for unit tests).

## Related

- For test commands and configs, see [TESTING.md](TESTING.md).
- For dev/test pages, see [DEV_PAGES.md](DEV_PAGES.md).
