# Writing Tests

## Test Utils

Use the project's test utils in `src/test-utils/` — don't query the DOM directly.

- `src/test-utils/dom/` — unit test wrappers (JSDOM)
- `src/test-utils/selectors/` — integration test wrappers (real browser)

Read the wrapper for the component you're testing to see available `find*` methods.

### Authoring Test Utils

Each wrapper extends `ComponentWrapper`, has a static `rootSelector`, and explicit return types on all methods. Test-util CSS classes go in `src/<component-name>/test-classes/styles.scss`. Read existing wrappers for the pattern.

## Unit Tests

Use `react-testing-library` to render, combined with test-utils. Prefer test-utils for public interactions, react-testing-library for internal corner cases. Read an existing test file for the setup pattern.

## Integration Tests

Use `useBrowser` from `@amzn/awsui-browser-test-tools/use-browser`. Use a `setupTest` wrapper with `waitForVisible`. Don't wait on tag name selectors — they're visible before JS loads. Multiple assertions per test are fine (e2e tests are slow). Use page object pattern for files with many tests.

## I18n Testing

Test `useInternalI18n` with `TestI18nProvider` from `src/i18n/testing`. Read existing i18n tests for the pattern.

## Gotchas

- `findAll`/`findAllByClassName` with `.get()` uses `:nth-child()` — only works if items share the same parent node
- All dev pages are axe-checked automatically. A11y violations fail the build. Checks run in dark mode only.
