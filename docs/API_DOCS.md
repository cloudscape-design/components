# API Documentation Comments

This project uses `@cloudscape-design/documenter` to generate API docs from JSDoc comments in component interface files (`src/<component>/interfaces.ts`).

## Special tags

- `@i18n` — marks internationalization properties
- `@analytics` — marks analytics metadata properties
- `@deprecated` — marks deprecated properties (include replacement info)
- `@displayname` — overrides the display name (e.g. `children` → `text`)
