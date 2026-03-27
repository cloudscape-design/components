# Running Tests

## Quick Reference

```
npm test               # all tests
npm run test:unit      # unit + build-tool tests
npm run test:integ     # integration tests (starts dev server automatically)
npm run test:motion    # motion tests (starts dev server automatically)
npm run test:a11y      # accessibility tests
```

The npm scripts use gulp tasks that handle env vars (`TZ=UTC`, `NODE_OPTIONS=--experimental-vm-modules`) and dev server lifecycle automatically.

## Test Types

- **Build-tool tests** — test the build-tools code in a NodeJS context.
- **Unit tests** — emulate a browser environment using JSDOM.
- **Integration tests** — test against real browser behavior on Chrome, with motion disabled.
- **Motion tests** — run a specific set of tests on Chrome, with motion enabled.

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

#### Updating all snapshots

When component APIs change, you may need to update test snapshots. Use the `-u` flag to update snapshots:

```
TZ=UTC  npx jest -u snapshot -c jest.unit.config.js src/
```

## Visual Regression Tests

Visual regression tests for permutation pages run automatically when opening a pull request in GitHub.

To check results: look at the "Visual Regression Tests" action in the PR. The "Test for regressions" step logs which pages failed. For a full report, download the `visual-regression-results` artifact from the action summary and open `html_report/index.html` in your browser.

If changes are expected, call it out in your PR comments.


### Run visual regression tests

Visual regression tests for the permutation pages are automatically run when opening a pull request in GitHub.