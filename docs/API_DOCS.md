# API Documentation Comments

This project uses `@cloudscape-design/documenter` to generate API docs from JSDoc comments in component interface files (`src/<component>/interfaces.ts`).

## Writing Prop Descriptions

Every public prop must have a JSDoc comment describing its purpose. For union/enum props, list the available options and their meanings inline in the description:

```ts
/** Determines the general styling of the button as follows:
 * * `primary` for primary buttons.
 * * `normal` for secondary buttons.
 * * `link` for tertiary buttons.
 */
variant?: ButtonProps.Variant;
```

Do not use `@default` tags — default values are documented by the component implementation (destructuring defaults in `index.tsx`), not in the interface comments.

## Special Tags

- `@i18n` — marks internationalization properties
- `@analytics` — marks analytics metadata properties
- `@deprecated` — marks deprecated properties (include replacement info)
- `@displayname` — overrides the display name (e.g. `children` → `text`)
- `@awsuiSystem core` — marks properties that are part of the core system (style API, native attributes)

## Sub-types

Define union types as named type aliases in the component's namespace, not as inline unions on the prop:

```ts
export namespace ButtonProps {
  export type Variant = 'normal' | 'primary' | 'link' | 'icon' | 'inline-icon' | 'inline-link';
}
```

Then reference them in the interface: `variant?: ButtonProps.Variant`.
