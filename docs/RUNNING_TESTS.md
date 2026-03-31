# Running Tests

## Quick Reference

```
npm test               # all tests
npm run test:unit      # unit tests
npm run test:integ     # integration tests (starts dev server automatically)
npm run test:motion    # motion tests (starts dev server automatically)
npm run test:a11y      # accessibility tests
```

The npm scripts use gulp tasks that handle env vars (`TZ=UTC`, `NODE_OPTIONS=--experimental-vm-modules`) and dev server lifecycle automatically.

## Test Types

- **Unit tests** — emulate a browser environment using JSDOM.
- **Integration tests** — test against real browser behavior on Chrome, with motion disabled.
- **Motion tests** — run a specific set of tests on Chrome, with motion enabled.
- **Accessibility tests** — run on all test pages across themes and color modes (`src/__a11y__/`).

## Targeting Specific Files

Call jest directly with the appropriate config:

```
# Unit
TZ=UTC node_modules/.bin/jest -c jest.unit.config.js src/button/__tests__/button.test.tsx

# Integration (requires dev server running via `npm start`)
NODE_OPTIONS=--experimental-vm-modules node_modules/.bin/jest -c jest.integ.config.js src/input/__integ__/

# Motion (requires dev server running via `npm start`)
NODE_OPTIONS=--experimental-vm-modules node_modules/.bin/jest -c jest.motion.config.js src/flashbar/__motion__/
```

> **Note:** When running jest directly you may see errors about `--experimental-vm-modules`. The npm scripts handle this automatically, but when calling jest directly you need to set the flag yourself (see examples above).

## ChromeDriver (macOS)

Integration and motion tests require ChromeDriver:

```
npm i -g chromedriver
```

## Updating Snapshots

When component APIs change, you may need to update test snapshots. When design tokens are touched, you must also run integ tests to update their snapshots Before updating, run a full build (`npm run build`) so that documenter docs are generated. Use the `-u` flag to update:

```
# Unit snapshots
TZ=UTC npx jest -u -c jest.unit.config.js src/__tests__/snapshot-tests

# Integ snapshots (requires dev server running via `npm start`)
NODE_OPTIONS=--experimental-vm-modules npx jest -u -c jest.integ.config.js src/__integ__/

# Snapshots inside components, e.g. when custom-css-properties.js changes (runs all unit tests)
TZ=UTC npx jest -u -c jest.unit.config.js src/
```
## Visual Regression Tests

> **Note:** The components repository does not have visual regression tests on GitHub. This section applies to other repositories such as chat-components, code-view, chart-components, and board-components.

Visual regression tests for permutation pages run automatically when opening a pull request in GitHub.

To check results: look at the "Visual Regression Tests" action in the PR. The "Test for regressions" step logs which pages failed. For a full report, download the `visual-regression-snapshots-results` artifact from the action summary.

If there are unexpected regressions, fix your pull request.
If the changes are expected, call this out in your pull request comments.
