# Component Conventions

## Ground Rules

- Always read existing code for the component you're working on before writing new code. For new components, pick a similar one as your template.
- Inner HTML structure and class names are not public API — don't rely on them.

## Component Structure

A typical component directory looks like:

```
src/<component-name>/
  index.tsx              # public component (default export)
  internal.tsx           # internal component for composition (optional, for complex components)
  interfaces.ts          # props interface and sub-types
  styles.scss            # component styles
  style.tsx              # style API helpers (optional)
  test-classes/          # CSS classes used only by test-utils (optional)
    styles.scss
  __tests__/             # unit tests
  __integ__/             # integration tests (optional)
  __a11y__/              # accessibility tests (optional)
  __motion__/            # motion tests (optional)
```

Each component also has dev pages in `pages/<component-name>/` (see docs/DEV_PAGES.md).

## Public Component (`index.tsx`)

Each public component must:

- Assign default prop values in the destructuring signature (not `defaultProps`), then pass them explicitly to the internal component
- Call `useBaseComponent` for telemetry — pass `props` (primitive/enum values with defaults applied) and optionally `metadata` (derived counters or booleans). No state props, no PII, no user input strings.
- Use `getExternalProps` or `getBaseProps` to strip internal `__`-prefixed props
- Call `applyDisplayName` at the bottom of the file
- Export the props interface as `${ComponentName}Props`

## Internal Component (`internal.tsx`)

For components used in composition, a private counterpart lives at `internal.tsx`. Internal props are prefixed with `__`. The public component must not add behavior beyond what the internal component provides.

## Shared Utilities

Shared hooks, components, contexts, and helpers live in `src/internal/`. Always check there before building new shared code.

## Props & Interfaces

- Props interface: `${ComponentName}Props`, namespace sub-types under it (e.g. `${ComponentName}Props.Variant`)
- Union types must be type aliases (no inline unions)
- Array types must use `ReadonlyArray<T>`
- Cast string props to string at runtime if rendered in JSX — React accepts JSX content there
- Component return type must be exactly `JSX.Element` — `null` or arrays break the doc generator
- Components exported as default from `index.tsx` are public; everything else is private

## Events

- Use `CancelableEventHandler<DetailType>` or `NonCancelableEventHandler<DetailType>` from `../internal/events`
- All `on*` props must use these interfaces (build fails otherwise)

## Refs

- Expose via `${ComponentName}Props.Ref` interface
- Use `useForwardFocus(ref, elementRef)` for simple focus delegation
- For `React.forwardRef` generics, create a `${ComponentName}ForwardRefType` interface

## Controllable Components

- Controlled: requires `value` + `onChange` (e.g. Input)
- Uncontrolled: internal state only (e.g. dropdown open)
- Controllable: uncontrolled by default, controlled when `value` is set

Use `useControllable` — read existing components for the pattern.

## Test Utils

Components with interactive elements should provide test-util wrappers in `src/test-utils/dom/<component-name>/` (for unit tests) and `src/test-utils/selectors/<component-name>/` (for integration tests). CSS classes used exclusively by test-utils go in `src/<component-name>/test-classes/styles.scss`. See docs/WRITING_TESTS.md for details.

## Element Queries

Use `useContainerBreakpoints` instead of CSS media queries. Handle `null` on first render.

## I18n

Three string categories:
- Static → `i18nStrings` property
- Dynamic → functions in `i18nStrings` returning strings
- Context-dependent → top-level props (out of scope for i18n provider)

Use `useInternalI18n('<component>')` to consume. Test with `TestI18nProvider` from `src/i18n/testing`.

## Dependencies

Before adding any dependency: must support React 16.8+ and latest 3 major Chrome/Firefox/Edge, no global state, ESM preferred, no external resources (CSP).
