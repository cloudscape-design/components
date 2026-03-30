# Component Conventions

## Component Structure

Each component is exposed from `src/<component-name>/index.tsx`.

- `applyDisplayName` — readable name in consumers' devtools

### Internal Component (`internal.tsx`)

The APIs exported from `src/<component>/index.tsx` are public and must not be used internally by other components. For internal usage, each component exposes a private counterpart at `internal.tsx`.

## Props & Interfaces

- Props interface: `${ComponentName}Props`, namespace sub-types under it (e.g. `${ComponentName}Props.Variant`)
- Union types must be type aliases (no inline unions)
- Array types must use `ReadonlyArray<T>`

For how to document props, see [API_DOCS.md](API_DOCS.md).

## Events

Use `CancelableEventHandler<DetailType>` or `NonCancelableEventHandler<DetailType>`. All `on*` props must use these interfaces (build fails otherwise).

Events are similar to native events with `event.preventDefault()` for cancelable events, but are not dispatched via DOM.

## Refs

The component ref API does not give access to the underlying DOM node. Instead, we expose specific methods — most commonly `focus()`, for which a dedicated util `useForwardFocus` is available.

When a component accepts a ref, create `${ComponentName}ForwardRefType` as follows:

```tsx
interface MyComponentForwardRefType {
  <T>(props: MyComponentProps<T> & { ref?: React.Ref<MyComponentProps.Ref> }): JSX.Element;
}
```

## Controllable Components

Use the same behavior as built-in React components:

1. If only `onChange` is provided → uncontrolled (component manages its own state, `onChange` fires for side effects)
2. If `value` is provided → controlled (with or without `onChange`; without `onChange` it's read-only)

Implementation:
1. Create a controlled component first
2. Use `useControllable` to wrap customer-provided properties — gives you a `[value, setValue]` pair
3. If `value` is provided without `onChange`, `useControllable` emits a console warning

## I18n

Centralize all translatable strings under a skippable property (e.g. `i18nStrings`). Internationalization code lives in `src/i18n/`. The `useInternalI18n` hook is what components use to resolve translated strings.

```tsx
const i18n = useInternalI18n('alert');
<InternalButton ariaLabel={i18n('dismissAriaLabel', dismissAriaLabel)} />
```

## Dependencies

Before adding any dependency: must support React 16.8+ and latest 3 major Chrome/Firefox/Edge, no global state, ESM preferred.

## Test Utils

Test-utils core is a separate package: https://github.com/cloudscape-design/test-utils

- Test-utils should not have any dependencies — they can be used with any tech stack.
- Test-utils extend `ComponentWrapper`. `ElementWrapper` is only a return type when no more specific type is available.
- Methods must have explicitly declared return types (enforced via ESLint).
- Wrapper classes must have a static `rootSelector` property.
- For methods that always return a value, add a non-null assertion.
