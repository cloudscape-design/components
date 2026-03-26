# API Documentation Comments

Documentation is generated from JSDoc comments in component interface files (`src/<component>/interfaces.ts`).

## Writing Prop Descriptions

Every public prop must have a JSDoc comment. For union/enum props, list available options inline:

```ts
/** Determines the general styling of the button as follows:
 * * `primary` for primary buttons.
 * * `normal` for secondary buttons.
 * * `link` for tertiary buttons.
 */
variant?: ButtonProps.Variant;
```

## Special Tags

- `@displayname` — overrides the display name for children slots (e.g. `children` → `text`)

## Sub-types

Define union types as named type aliases in the component's namespace, not as inline unions:

```ts
export namespace ButtonProps {
  export type Variant = 'normal' | 'primary' | 'link' | 'icon' | 'inline-icon' | 'inline-link';
}
```

Then reference them in the interface: `variant?: ButtonProps.Variant`.

## Related

- For component props and interface conventions, see [COMPONENT_CONVENTIONS.md](COMPONENT_CONVENTIONS.md).
