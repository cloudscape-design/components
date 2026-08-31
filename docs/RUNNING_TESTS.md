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
- **Visual regression tests** — compare screenshots between a PR and `main` to detect unintended visual changes. CI-only (see below).

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

When component APIs change, you may need to update test snapshots. When design tokens are touched, you must also run integration tests to update their snapshots. Before updating, run a full build (`npm run build`) so that documenter docs are generated. Use the `-u` flag to update:

```
# Unit snapshots
TZ=UTC npx jest -u -c jest.unit.config.js src/__tests__/snapshot-tests

# Integ snapshots (requires dev server running via `npm start`)
NODE_OPTIONS=--experimental-vm-modules npx jest -u -c jest.integ.config.js src/__integ__/

# Snapshots inside components, e.g. when custom-css-properties.js changes (runs all unit tests)
TZ=UTC npx jest -u -c jest.unit.config.js src/
```

## Visual Regression Tests

Visual regression tests run automatically on pull requests via the CI pipeline (`.github/workflows/deploy.yml` and `.github/workflows/visual-regression.yml`). They cannot be run locally at the moment.

### How it works (CI)

The deploy workflow (`.github/workflows/deploy.yml`) orchestrates the full pipeline:

1. **Quick build** — builds dev pages for React 16 and React 18 in parallel using the `.github/actions/quick-build` composite action.
2. **Deploy** — deploys the React 18 pages to a preview environment (the PR deployment URL).
3. **Build baseline** — creates a git worktree of `origin/main`, installs its dependencies, and builds its pages.
4. **Visual regression** — once deploy and baseline are ready, calls the reusable `visual-regression.yml` workflow.

The visual regression workflow (`.github/workflows/visual-regression.yml`):

1. Checks the commit for a `visual-regression-override` status (see [Overriding](#overriding-intentional-visual-changes) below).
2. Resolves the PR deployment URL from the GitHub Deployments API.
3. Serves the baseline pages locally.
4. Runs the test suite sharded across multiple runners. Each test navigates to a page on both hosts, captures screenshots, and compares them pixel-by-pixel.
5. Produces an Allure report with image diffs for any failures, deployed to a preview environment.
6. A final `verify` job reports the mandatory pass/fail result.

### Mandatory check

The visual regression result is a **required check**: a PR cannot merge unless the
`verify` job passes. It passes only when every shard passed, or when the commit
was overridden (below). The reporting jobs run with `always()` and never block on
their own.

> To enforce this, add the `verify` job's status check (`Visual regression result`)
> to the branch protection rules for `main`.

### Reviewing failures

When the CI job fails, check the deployed Allure report (linked from the GitHub deployment). It shows expected vs actual vs diff images for each failing test. If the diff is expected (intentional visual change), override the check as described below.

### Overriding intentional visual changes

Because baselines are rebuilt from `origin/main` at run time (there are no committed
screenshots to update), an intentional visual change is approved by overriding the
check rather than by updating snapshots. This mirrors the manual "update workflow"
pattern from [Vitest visual regression testing](https://vitest.dev/guide/browser/visual-regression-testing.html#the-update-workflow).

The override is **scoped to a single commit**. It approves the exact SHA you reviewed;
pushing a new commit produces a new SHA with no override, so the comparison runs again.

To override, first confirm the diffs in the Allure report are intentional, then use either method:

- **From the PR page (recommended):** comment `/override-visual-regression` on the pull request. Only users with write access can trigger it; the head commit is used automatically.
- **From the Actions tab:** run the **Override visual regression** workflow (`.github/workflows/visual-regression-override.yml`) manually, passing the commit SHA to approve.

Either way the workflow posts a `visual-regression-override` success commit status on that SHA, comments on the PR crediting the person who triggered it, and re-runs the deploy workflow. On the re-run, the screenshot comparison is skipped and the `verify` job passes.

### Adding tests for a new component

1. Create `test/definitions/visual/<component>.ts` exporting a `TestSuite`.
2. Add the import to `test/definitions/index.ts`.
