# Testing

## Quick Reference

```
npm test               # all tests (unit + integ + a11y)
npm run test:unit      # unit + build-tool tests
npm run test:integ     # integration tests (starts dev server automatically)
npm run test:motion    # motion tests (starts dev server automatically)
npm run test:a11y      # accessibility tests
```

The npm scripts use gulp tasks that handle env vars (`TZ=UTC`, `NODE_OPTIONS=--experimental-vm-modules`) and dev server lifecycle automatically.

## Targeting Specific Files

For running a specific test file or folder, call jest directly with the appropriate config:

```
# Unit
TZ=UTC node_modules/.bin/jest -c jest.unit.config.js src/button/__tests__/button.test.tsx

# Integration (requires dev server running via `npm start`)
NODE_OPTIONS=--experimental-vm-modules node_modules/.bin/jest -c jest.integ.config.js src/input/__integ__/

# Motion (requires dev server running via `npm start`)
NODE_OPTIONS=--experimental-vm-modules node_modules/.bin/jest -c jest.motion.config.js src/flashbar/__motion__/

# Build-tool / stylelint
NODE_OPTIONS=--experimental-vm-modules node_modules/.bin/jest -c jest.build-tools.config.js build-tools/stylelint
```

## Updating Snapshots

```
TZ=UTC node_modules/.bin/jest -u -c jest.unit.config.js src/__tests__/snapshot-tests/
```

## Testing in the Browser

Integration and motion tests run against dev pages served by the dev server (see docs/DEV_PAGES.md for setup). When running individual test files with jest directly, start the dev server first (`npm start`). The `npm run test:integ` and `npm run test:motion` scripts handle the dev server automatically.

## A11y Tests

All dev pages are axe-checked automatically. A11y violations fail the build. Checks run in dark mode only.
