# Testing

## Quick Reference

```
npm test               # all tests
npm run test:unit      # unit + build-tool tests
npm run test:integ     # integration tests (starts dev server automatically)
npm run test:motion    # motion tests (starts dev server automatically)
npm run test:a11y      # accessibility tests
```

The npm scripts use gulp tasks that handle env vars (`TZ=UTC`, `NODE_OPTIONS=--experimental-vm-modules`) and dev server lifecycle automatically.

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

## Updating Snapshots

```
TZ=UTC node_modules/.bin/jest -u -c jest.unit.config.js src/__tests__/snapshot-tests/
```

## Related

- For writing tests, test utils, and test conventions, see [WRITING_TESTS.md](WRITING_TESTS.md).
- For dev/test pages used by integration tests, see [DEV_PAGES.md](DEV_PAGES.md).
