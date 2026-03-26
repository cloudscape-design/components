# Component Conventions

## Component Structure

Each component is exposed from `src/<component-name>/index.tsx`.

- `applyDisplayName` — readable name in consumers' devtools

### Internal Component (`internal.tsx`)

For components used in composition, a private counterpart lives at `internal.tsx`. The public component must not add behavior beyond what the internal component provides.

## Props & Interfaces

- Props interface: `${ComponentName}Props`, namespace sub-types under it (e.g. `${ComponentName}Props.Variant`)
- Union types must be type aliases (no inline unions)
- Array types must use `ReadonlyArray<T>`
- Cast string props to string at runtime if rendered in JSX — React accepts JSX content there
- Component return type must be exactly `JSX.Element` — `null` or arrays break the doc generator

For how to document props, see [API_DOCS.md](API_DOCS.md).

## Events

Use `CancelableEventHandler<DetailType>` or `NonCancelableEventHandler<DetailType>`. All `on*` props must use these interfaces (build fails otherwise).

Events are similar to native events with `event.preventDefault()` for cancelable events, but are not dispatched via DOM.

## Refs

- Use `useForwardFocus(ref, elementRef)` for simple focus delegation
- For `React.forwardRef` generics, create a `${ComponentName}ForwardRefType` interface

## Controllable Components

Use the same behavior as built-in React components:

1. If only `onChange` is provided → uncontrolled (component manages its own state, `onChange` fires for side effects)
2. If `value` is provided → controlled (with or without `onChange`; without `onChange` it's read-only)

Implementation:
1. Create a controlled component first
2. Use `useControllable` to wrap customer-provided properties — gives you a `[value, setValue]` pair
3. If `value` is provided without `onChange`, `useControllable` emits a console warning

## I18n

Centralize all translatable strings under a skippable property (e.g. `i18nStrings`).

## Dependencies

Before adding any dependency: must support React 16.8+ and latest 3 major Chrome/Firefox/Edge, no global state, ESM preferred.
