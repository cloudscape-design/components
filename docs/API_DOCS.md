# API Documentation Comments

This project uses `@cloudscape-design/documenter` to generate API docs from JSDoc comments in component interface files (`src/<component>/interfaces.ts`).

## Special Tags

- `@i18n` — marks internationalization properties
- `@analytics` — marks analytics metadata properties
- `@deprecated` — marks deprecated properties (include replacement info)
- `@displayname` — overrides the display name (e.g. `children` → `text`)
- `@awsuiSystem` — tags a property or import by internal system (e.g. `@awsuiSystem core`), used for internal classification

## Sub-types

Define union types as named type aliases in the component's namespace, not as inline unions. Then reference them in the interface: `variant?: ButtonProps.Variant`.
