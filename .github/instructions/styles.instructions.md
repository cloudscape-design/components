---
applyTo: "src/**/*.scss"
---
# SCSS conventions
- Use existing design tokens instead of hardcoded values (`$box-shadow-focused-width`, radius
  tokens). WHY: keeps theming consistent.
- Put classes that exist only for test selection in `src/<component>/test-classes/styles.scss`.
  WHY: segregated test classes keep integ selectors stable.
- Don't disable lint rules or depend on raw DOM structure / `nth-child` merely as a shortcut — add
  class names to inner elements and target those when possible. When a structural selector or suppression
  is necessary for component behavior, scope it narrowly and document why. WHY: unqualified
  structure-dependent selectors and rule overrides are brittle and re-break as markup changes.
