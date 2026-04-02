# Writing Tests

## Unit Tests

Location: `src/<component-name>/__tests__/`

Use `react-testing-library` to render, combined with test-utils. Prefer test-utils for querying and interacting with components — use react-testing-library directly only for internal edge cases not covered by test-utils.

### Snapshot Tests

Snapshot tests guard generated artifacts (API definitions, test-util wrappers, design tokens, etc.) against unintended changes. They are grouped inside the global `src/__tests__/` and `src/__integ__/` folders.

The project must be fully built before updating snapshots, so that documenter docs are generated:

```
npm run build
```

Update unit test snapshots:

```
TZ=UTC npx jest -u -c jest.unit.config.js src/__tests__/
```

If design tokens are changed, update integ test snapshots as well:

```
NODE_OPTIONS=--experimental-vm-modules npx jest -u -c jest.integ.config.js src/__integ__/
```

## Integration Tests

Location: `src/<component-name>/__integ__/`

Integration tests run in a real browser against test pages. Use `createWrapper` from `test-utils/selectors` (not `test-utils/dom` — selectors generate CSS selectors for browser tests, while dom wrappers operate on DOM nodes for unit tests).

## Accessibility in Unit Tests

Use the `toValidateA11y` Jest matcher to run axe and HTML validation on rendered components:

```tsx
const { container } = render(<MyComponent />);
await expect(container).toValidateA11y();
```
