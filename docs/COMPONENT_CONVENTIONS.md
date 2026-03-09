# Component Conventions

## Ground Rules

- Always read existing code for the component you're working on before writing new code. For new components, pick a similar one as your template.
- Inner HTML structure and class names are not public API — don't rely on them.

## Component Structure

Each public component lives in `src/<component-name>/index.tsx` and must:

- Assign default prop values in the destructuring signature (not `defaultProps`), then pass them explicitly to the internal component
- Call `useBaseComponent` for telemetry — pass `props` (primitive/enum values with defaults applied) and optionally `metadata` (derived counters or booleans). No state props, no PII, no user input strings.
- Use `getExternalProps` or `getBaseProps` to strip internal `__`-prefixed props
- Call `applyDisplayName` at the bottom of the file
- Export the props interface as `${ComponentName}Props`

Each public component has a private counterpart at `src/<component-name>/internal.tsx` for composition. Internal props are prefixed with `__`. The public component must not add behavior beyond what the internal component provides.

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
