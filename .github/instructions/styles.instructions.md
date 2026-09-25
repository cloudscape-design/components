---
applyTo: "src/**/*.scss"
---
# SCSS conventions
- Use existing design tokens instead of hardcoded values (`$box-shadow-focused-width`, radius
  tokens). WHY: keeps theming consistent.
- Put classes that exist only for test selection in `src/<component>/test-classes/styles.scss`.
  WHY: segregated test classes keep integ selectors stable.
- Don't disable the repo's own lint rules or write selectors that depend on raw DOM structure /
  `nth-child` — add classnames to the inner elements and target those. WHY: structure-dependent
  selectors and rule overrides are brittle and re-break as markup changes.
