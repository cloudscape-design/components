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

## ChromeDriver

Integration and motion tests require ChromeDriver:

```
npm i -g chromedriver
```

## Updating Snapshots

When component APIs change, you may need to update test snapshots. When design tokens are touched, you must also run integration tests to update their snapshots Before updating, run a full build (`npm run build`) so that documenter docs are generated. Use the `-u` flag to update:

```
# Unit snapshots
TZ=UTC npx jest -u -c jest.unit.config.js src/__tests__/snapshot-tests

# Integ snapshots (requires dev server running via `npm start`)
NODE_OPTIONS=--experimental-vm-modules npx jest -u -c jest.integ.config.js src/__integ__/

# Snapshots inside components, e.g. when custom-css-properties.js changes (runs all unit tests)
TZ=UTC npx jest -u -c jest.unit.config.js src/
```
## Visual Regression Tests

Visual regression tests run automatically when opening a pull request in GitHub (see `.github/workflows/visual-regression.yml`).

They compare permutation pages between the PR build and a baseline build of `main`, both served locally in the same CI job. Each side installs from its own `package-lock.json` via a git worktree, so dependency changes in the PR are handled correctly and unpinned updates in sister repositories affect both sides equally.

### How it works

1. The PR pages are built and served on port 8080.
2. A git worktree of `origin/main` is created, its dependencies installed, and its pages built and served on port 8081.
3. The single test runner (`test/visual.test.ts`) iterates over all test definitions, captures the `.screenshot-area` element from both servers for each test, and fails if any pixels differ.

### Running locally

```
npm run test:visual
```

This handles the full build and comparison in one command. If both outputs are already built, skip the build step:

```
NODE_OPTIONS=--experimental-vm-modules node_modules/.bin/jest -c jest.visual.config.js
```

(Requires both servers to be running — start the PR build with `npm run start:integ` on port 8080 and the baseline build on port 8081, or set `NEW_HOST` / `OLD_HOST` env vars to point at different hosts.)

### Adding tests for a new component

Create `test/definitions/visual/<component>.ts`:

```ts
import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'my-component',
  tests: [
    {
      description: 'permutations',
      path: 'my-component/permutations',
    },
  ],
};

export default suite;
```

Then import and add it to `test/definitions/visual/index.ts`:

```ts
import myComponent from './my-component';

export const allSuites: TestSuite[] = [..., myComponent];
```

### Reviewing failures

If the CI job fails, download the `visual-regression-diffs` artifact from the Actions summary.

If the diff is expected (intentional visual change), note it in your PR description.
